/** Small, bounded primitives shared by export and HTTP deployment checks. */
export const CANONICAL_ORIGIN = "https://raoufabedini.dev";

export function parseAuditOrigin(value = CANONICAL_ORIGIN) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Audit origin must be an absolute HTTP(S) origin.");
  }
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (
    (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "Use an HTTPS origin or HTTP loopback, without credentials, a path, query or fragment.",
    );
  }
  return url.origin;
}

export async function fetchAuditResponse(
  url,
  {
    ua,
    redirect = "error",
    readBody = true,
    timeoutMs = 10_000,
    maxBytes = 4 * 1024 * 1024,
    fetchImpl = fetch,
  } = {},
) {
  if (
    !Number.isSafeInteger(timeoutMs) ||
    timeoutMs < 1 ||
    timeoutMs > 60_000 ||
    !Number.isSafeInteger(maxBytes) ||
    maxBytes < 1 ||
    maxBytes > 16 * 1024 * 1024
  )
    throw new Error("Invalid finite audit request limits.");
  const controller = new AbortController();
  let timer;
  let reader;
  // The deadline covers both headers and body, even if a test transport ignores
  // AbortSignal. Aborting also releases a real fetch's network resources.
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(`Audit request exceeded ${timeoutMs} ms.`);
      controller.abort(error);
      reject(error);
    }, timeoutMs);
  });
  try {
    const request = (async () => {
      const res = await fetchImpl(url, {
        headers: ua ? { "user-agent": ua } : {},
        redirect,
        signal: controller.signal,
      });
      if (controller.signal.aborted) {
        // An abort-ignoring transport may return after outer cleanup completed.
        // Cancel that late body before creating a reader that cleanup cannot see.
        void res.body?.cancel().catch(() => {});
        throw controller.signal.reason;
      }
      if (!readBody || redirect === "manual") {
        await res.body?.cancel();
        return { res, body: "", url };
      }
      if (Number(res.headers.get("content-length")) > maxBytes) {
        await res.body?.cancel();
        throw new Error(`Audit response exceeds ${maxBytes} bytes.`);
      }
      if (!res.body) return { res, body: "", url };
      reader = res.body.getReader();
      const chunks = [];
      let bytes = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > maxBytes)
          throw new Error(`Audit response exceeds ${maxBytes} bytes.`);
        chunks.push(value);
      }
      return { res, body: Buffer.concat(chunks, bytes).toString("utf8"), url };
    })();
    return await Promise.race([request, deadline]);
  } finally {
    clearTimeout(timer);
    controller.abort();
    if (reader) {
      // Cancellation must not extend the deadline when a body stalls.
      void reader.cancel().catch(() => {});
      try {
        reader.releaseLock();
      } catch {
        /* pending read is being cancelled */
      }
    }
  }
}

export function auditRedirect(res, requestUrl, expectedUrl) {
  if (res.status !== 308) return `status ${res.status}; expected 308`;
  const location = res.headers.get("location");
  if (!location) return "missing Location";
  try {
    if (new URL(location, requestUrl).href !== new URL(expectedUrl).href)
      return "Location does not preserve the expected origin, path and query";
  } catch {
    return "invalid Location";
  }
  return null;
}

export function auditSecurityExpiry(value, now = Date.now()) {
  if (!value) return "missing Expires";
  // RFC 9116 requires an RFC 3339 timestamp, including a time and timezone.
  const match =
    /^(\d{4}-\d{2}-\d{2})T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/i.exec(
      value,
    );
  const timestamp = Date.parse(value);
  const calendar = match && new Date(`${match[1]}T00:00:00Z`);
  if (
    !match ||
    !Number.isFinite(timestamp) ||
    !Number.isFinite(calendar.getTime()) ||
    calendar.toISOString().slice(0, 10) !== match[1]
  )
    return "invalid Expires timestamp";
  return timestamp <= now ? "Expires is expired" : null;
}

export function auditSecurityHeaders(headers) {
  const issues = [];
  for (const [name, expected] of [
    ["x-content-type-options", "nosniff"],
    ["x-frame-options", "DENY"],
    ["referrer-policy", "strict-origin-when-cross-origin"],
    ["cross-origin-opener-policy", "same-origin"],
  ])
    if (headers.get(name)?.toLowerCase() !== expected.toLowerCase())
      issues.push(`missing or incorrect ${name}`);
  const csp = headers.get("content-security-policy") ?? "";
  const directives = new Map();
  for (const part of csp.split(";")) {
    const [rawName, ...values] = part.trim().split(/\s+/);
    if (!rawName) continue;
    const name = rawName.toLowerCase();
    // Browsers honor the first instance; a later safe value cannot repair it.
    if (directives.has(name)) issues.push(`duplicate CSP ${name}`);
    else directives.set(name, values);
  }
  const approved = new Map([
    ["default-src", ["'self'"]],
    ["base-uri", ["'none'"]],
    ["object-src", ["'none'"]],
    [
      "script-src",
      ["'self'", "'unsafe-inline'", "https://static.cloudflareinsights.com"],
    ],
    ["script-src-attr", ["'none'"]],
    ["style-src", ["'self'", "'unsafe-inline'"]],
    ["img-src", ["'self'", "data:", "blob:"]],
    ["media-src", ["'self'"]],
    ["font-src", ["'self'"]],
    ["connect-src", ["'self'", "https://cloudflareinsights.com"]],
    ["frame-src", ["'none'"]],
    ["worker-src", ["'none'"]],
    ["frame-ancestors", ["'none'"]],
    ["form-action", ["'self'", "mailto:"]],
    ["upgrade-insecure-requests", []],
  ]);
  // Fixed expectations must not be derived from the input policy. Otherwise a
  // weakened config, or a script-src-elem override, would certify itself.
  for (const [name, expected] of approved) {
    const values = directives.get(name);
    if (
      !values ||
      values.length !== expected.length ||
      expected.some((value) => !values.includes(value))
    )
      issues.push(`missing or incorrect CSP ${name}`);
  }
  for (const name of directives.keys())
    if (!approved.has(name)) issues.push(`unapproved CSP ${name}`);

  const hsts = headers.get("strict-transport-security") ?? "";
  const hstsParts = hsts
    .toLowerCase()
    .split(";")
    .map((part) => part.trim());
  if (
    hstsParts.length !== 3 ||
    new Set(hstsParts).size !== 3 ||
    !hstsParts.includes("max-age=63072000") ||
    !hstsParts.includes("includesubdomains") ||
    !hstsParts.includes("preload")
  )
    issues.push("missing or incorrect strict-transport-security");

  const permissions = (headers.get("permissions-policy") ?? "")
    .toLowerCase()
    .split(",")
    .map((part) => part.trim().replace(/\s+/g, ""));
  const denied = [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "payment=()",
    "usb=()",
    "browsing-topics=()",
    "interest-cohort=()",
  ];
  if (
    permissions.length !== denied.length ||
    new Set(permissions).size !== denied.length ||
    denied.some((value) => !permissions.includes(value))
  )
    issues.push("missing or incorrect permissions-policy");
  return issues;
}

export function auditDeploymentVersion(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return ["version.json is not an object"];
  const issues = [];
  if (
    typeof value.commit !== "string" ||
    !/^(?:[a-f\d]{40}|[a-f\d]{64})$/i.test(value.commit)
  )
    issues.push(
      "version.json has no valid commit identity; freshness is unverified",
    );
  const revision = value.contentRevision;
  const date =
    typeof revision === "string" && /^\d{4}-\d{2}-\d{2}$/.test(revision)
      ? new Date(revision)
      : null;
  if (
    !date ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== revision
  )
    issues.push("version.json has an invalid content revision date");
  if (
    typeof value.builtAt !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value.builtAt) ||
    !Number.isFinite(Date.parse(value.builtAt)) ||
    new Date(value.builtAt).toISOString() !== value.builtAt
  )
    issues.push("version.json has an invalid build timestamp");
  if (value.site !== CANONICAL_ORIGIN)
    issues.push("version.json has an incorrect canonical site identity");
  return issues;
}
