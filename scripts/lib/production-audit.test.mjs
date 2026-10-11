import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  parseAuditOrigin,
  fetchAuditResponse,
  auditRedirect,
  auditSecurityExpiry,
  auditSecurityHeaders,
  auditDeploymentVersion,
} from "./production-audit.mjs";

test("accepts production/staging HTTPS and explicit HTTP loopback origins", () => {
  for (const origin of [
    "https://raoufabedini.dev",
    "https://preview.example",
    "http://127.0.0.1:4398",
    "http://[::1]:4398",
  ])
    assert.equal(parseAuditOrigin(origin + "/"), origin);
});

test("rejects credentials, paths, query strings and unsupported audit origins", () => {
  for (const value of [
    "not a URL",
    "file:///tmp/site",
    "http://example.com",
    "https://user:password@example.com",
    "https://example.com/path",
    "https://example.com/?token=value",
    "https://example.com/#fragment",
  ])
    assert.throws(() => parseAuditOrigin(value));
});

test("reads bounded UTF-8 across chunks and closes the request lifecycle", async () => {
  let signal;
  const bytes = Buffer.from("فارسی");
  const stream = new ReadableStream({
    start(c) {
      c.enqueue(bytes.subarray(0, 3));
      c.enqueue(bytes.subarray(3));
      c.close();
    },
  });
  const result = await fetchAuditResponse("http://127.0.0.1:4398/", {
    fetchImpl: async (_, options) => {
      signal = options.signal;
      return new Response(stream);
    },
  });
  assert.equal(result.body, "فارسی");
  assert.equal(signal.aborted, true);
  assert.equal(stream.locked, false);
});

test("cancels bodies for header-only requests", async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    cancel() {
      cancelled = true;
    },
  });
  const result = await fetchAuditResponse("https://preview.example/og.png", {
    readBody: false,
    fetchImpl: async () => new Response(stream),
  });
  assert.equal(result.body, "");
  assert.equal(cancelled, true);
});

test("rejects oversized advertised responses before reading them", async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    cancel() {
      cancelled = true;
    },
  });
  await assert.rejects(
    fetchAuditResponse("https://preview.example/", {
      maxBytes: 8,
      fetchImpl: async () =>
        new Response(stream, { headers: { "content-length": "9" } }),
    }),
    /exceeds 8 bytes/,
  );
  assert.equal(cancelled, true);
});

test("enforces the actual decoded byte limit without Content-Length", async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    start(c) {
      c.enqueue(new Uint8Array(5));
    },
    cancel() {
      cancelled = true;
    },
  });
  await assert.rejects(
    fetchAuditResponse("https://preview.example/", {
      maxBytes: 4,
      fetchImpl: async () => new Response(stream),
    }),
    /exceeds 4 bytes/,
  );
  assert.equal(cancelled, true);
  assert.equal(stream.locked, false);
});

test("a request that never returns headers still has a finite deadline", async () => {
  let signal;
  await assert.rejects(
    fetchAuditResponse("https://preview.example/", {
      timeoutMs: 20,
      fetchImpl: (_, options) => {
        signal = options.signal;
        return new Promise(() => {});
      },
    }),
    /exceeded 20 ms/,
  );
  assert.equal(signal.aborted, true);
});

test("the same deadline also covers a stalled response body", async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    cancel() {
      cancelled = true;
    },
  });
  await assert.rejects(
    fetchAuditResponse("https://preview.example/", {
      timeoutMs: 20,
      fetchImpl: async () => new Response(stream),
    }),
    /exceeded 20 ms/,
  );
  assert.equal(cancelled, true);
  assert.equal(stream.locked, false);
});

test("headers arriving after the deadline never start a new body reader", async () => {
  let resolveHeaders;
  let cancelled = false;
  let read = false;
  const stream = new ReadableStream({
    cancel() {
      cancelled = true;
    },
  });
  const getReader = stream.getReader.bind(stream);
  stream.getReader = () => {
    read = true;
    return getReader();
  };
  await assert.rejects(
    fetchAuditResponse("https://preview.example/", {
      timeoutMs: 20,
      fetchImpl: () =>
        new Promise((resolve) => {
          resolveHeaders = resolve;
        }),
    }),
    /exceeded 20 ms/,
  );
  resolveHeaders(new Response(stream));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(cancelled, true);
  assert.equal(read, false);
  assert.equal(stream.locked, false);
});

test("rejects non-finite request limits and preserves network errors", async () => {
  await assert.rejects(
    fetchAuditResponse("https://preview.example/", { timeoutMs: Infinity }),
    /Invalid finite/,
  );
  await assert.rejects(
    fetchAuditResponse("https://preview.example/", {
      fetchImpl: async () => {
        throw new Error("fixture network failure");
      },
    }),
    /fixture network failure/,
  );
});

test("direct-200 probes reject redirects instead of following another origin", async () => {
  await assert.rejects(
    fetchAuditResponse("https://preview.example/", {
      fetchImpl: async (_, options) => {
        assert.equal(options.redirect, "error");
        throw new TypeError("fixture unexpected redirect");
      },
    }),
    /unexpected redirect/,
  );
});

test("redirects must preserve status, origin, path and query", () => {
  const source = "https://preview.example/en/about?audit=1";
  const expected = "https://preview.example/about?audit=1";
  const response = (location, status = 308) =>
    new Response(null, { status, headers: location ? { location } : {} });
  assert.equal(
    auditRedirect(response("/about?audit=1"), source, expected),
    null,
  );
  assert.equal(auditRedirect(response(expected), source, expected), null);
  for (const location of [
    "/",
    "/about",
    "https://other.example/about?audit=1",
    "/about?audit=2",
  ])
    assert.ok(auditRedirect(response(location), source, expected));
  assert.ok(auditRedirect(response("/about?audit=1", 302), source, expected));
  assert.ok(auditRedirect(response(null), source, expected));
});

test("security expiry rejects missing, malformed, impossible and expired dates", () => {
  const now = Date.parse("2026-10-11T00:00:00Z");
  for (const value of [
    undefined,
    "nonsense",
    "2030-02-31T00:00:00Z",
    "2030-01-01",
    "2026-10-10T00:00:00Z",
    "2026-10-11T00:00:00Z",
  ])
    assert.ok(auditSecurityExpiry(value, now));
  assert.equal(auditSecurityExpiry("2027-01-01T00:00:00Z", now), null);
  assert.equal(auditSecurityExpiry("2027-01-01T00:00:00+11:00", now), null);
});

function authoredHeaders() {
  const headers = new Headers();
  const global = readFileSync(
    new URL("../../public/_headers", import.meta.url),
    "utf8",
  ).split("\n\n")[0];
  for (const match of global.matchAll(/^\s+([^:]+):\s*(.+)$/gm))
    headers.set(match[1].trim(), match[2].trim());
  return headers;
}

test("security headers retain the complete authored browser policy", () => {
  const headers = authoredHeaders();
  assert.deepEqual(auditSecurityHeaders(headers), []);
  headers.set("x-frame-options", "SAMEORIGIN");
  headers.set(
    "content-security-policy",
    "object-src *; frame-ancestors *; base-uri *",
  );
  assert.ok(auditSecurityHeaders(headers).length >= 4);
  headers.set(
    "content-security-policy",
    "object-src *; object-src 'none'; frame-ancestors 'none'; base-uri 'self'",
  );
  assert.ok(
    auditSecurityHeaders(headers).includes(
      "missing or incorrect CSP object-src",
    ),
  );
  headers.set("x-frame-options", "DENY");
  headers.set(
    "content-security-policy",
    "Object-Src *; object-src 'none'; frame-ancestors 'none'; base-uri 'self'",
  );
  assert.ok(
    auditSecurityHeaders(headers).includes(
      "missing or incorrect CSP object-src",
    ),
  );
});

test("weakening any browser header or CSP directive fails closed", () => {
  const original = authoredHeaders();
  for (const name of [...original.keys()].filter(
    (name) => name !== "cache-control",
  )) {
    const headers = new Headers(original);
    headers.delete(name);
    assert.ok(auditSecurityHeaders(headers).length, `missing ${name}`);
  }
  for (const part of original.get("content-security-policy").split(";")) {
    if (!part.trim()) continue;
    const headers = new Headers(original);
    headers.set(
      "content-security-policy",
      original.get("content-security-policy").replace(part, ""),
    );
    assert.ok(auditSecurityHeaders(headers).length, `missing ${part}`);
  }
  for (const extra of [
    "script-src-elem *",
    "style-src-elem *",
    "object-src 'none'",
    "Script-Src *",
  ]) {
    const headers = new Headers(original);
    headers.set(
      "content-security-policy",
      `${original.get("content-security-policy")}; ${extra}`,
    );
    assert.ok(auditSecurityHeaders(headers).length, extra);
  }
  for (const [name, value] of [
    ["strict-transport-security", "max-age=0"],
    ["permissions-policy", "camera=*, microphone=*"],
  ]) {
    const headers = new Headers(original);
    headers.set(name, value);
    assert.ok(auditSecurityHeaders(headers).length, value);
  }
});

test("CSP ordering and source ordering do not change an approved policy", () => {
  const headers = authoredHeaders();
  headers.set(
    "content-security-policy",
    headers
      .get("content-security-policy")
      .split(";")
      .reverse()
      .map((part) => {
        const [name, ...values] = part.trim().split(/\s+/);
        return `${name.toUpperCase()} ${values.reverse().join("  ")}`;
      })
      .join(" ; "),
  );
  assert.deepEqual(auditSecurityHeaders(headers), []);
});

test("deployment identity must be a valid fingerprint, never unknown or malformed", () => {
  const version = {
    commit: "a".repeat(40),
    contentRevision: "2026-10-10",
    builtAt: "2026-10-11T00:00:00.000Z",
    site: "https://raoufabedini.dev",
  };
  assert.deepEqual(auditDeploymentVersion(version), []);
  for (const value of [
    null,
    [],
    {},
    { ...version, commit: "unknown" },
    { ...version, contentRevision: "2026-02-31" },
    { ...version, builtAt: "not a date" },
    { ...version, builtAt: "2026-02-31T00:00:00.000Z" },
    { ...version, site: "https://other.example" },
  ])
    assert.ok(auditDeploymentVersion(value).length > 0);
});
