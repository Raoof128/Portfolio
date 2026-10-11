import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  rm,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  auditStaticArtifact,
  auditRedirectRules,
  parseGlobalSecurityHeaders,
} from "./static-security.mjs";
import { auditSecurityHeaders } from "./production-audit.mjs";

const headers = await readFile(
  new URL("../../public/_headers", import.meta.url),
  "utf8",
);
const redirects = await readFile(
  new URL("../../public/_redirects", import.meta.url),
  "utf8",
);
const disclosure = await readFile(
  new URL("../../public/.well-known/security.txt", import.meta.url),
  "utf8",
);

async function fixture(run) {
  const root = await mkdtemp(join(tmpdir(), "researchos-artifact-test-"));
  try {
    await mkdir(join(root, ".well-known"));
    for (const name of [
      "en.html",
      "404.html",
      "version.json",
      "robots.txt",
      "sitemap.xml",
      "feed.xml",
      "llms.txt",
      "llms-full.txt",
    ])
      await writeFile(join(root, name), "fixture");
    await writeFile(join(root, "_headers"), headers);
    await writeFile(join(root, "_redirects"), redirects);
    await writeFile(join(root, "security.txt"), disclosure);
    await writeFile(join(root, ".well-known/security.txt"), disclosure);
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("the authored policy is valid regardless of specific feed/asset header rules", () => {
  assert.deepEqual(
    auditSecurityHeaders(parseGlobalSecurityHeaders(headers)),
    [],
  );
  assert.ok(
    auditSecurityHeaders(
      parseGlobalSecurityHeaders(
        headers + "\n/*\n  Content-Security-Policy: script-src *\n",
      ),
    ).length,
  );
});

test("static redirects reject authority-position splats and external destinations", () => {
  assert.deepEqual(auditRedirectRules(redirects), []);
  for (const rule of [
    "/en/* /:splat 308",
    "/en/:slug /:slug 308",
    "/en/* //attacker.invalid/:splat 308",
    "/en/* /\\attacker.invalid/:splat 308",
    "/a https://attacker.invalid 302",
    "/a /a 999",
  ])
    assert.ok(auditRedirectRules(rule).length, rule);
  assert.deepEqual(
    auditRedirectRules("/en/projects/* /projects/:splat 308"),
    [],
  );
});

test("specific path rules cannot detach or override any global security header", () => {
  for (const name of [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Cross-Origin-Opener-Policy",
  ]) {
    for (const declaration of [`! ${name}`, `${name}: weakened`]) {
      assert.throws(
        () =>
          parseGlobalSecurityHeaders(
            `${headers}\n/projects/*\n  ${declaration}\n`,
          ),
        /specific rule overrides protected header/,
      );
    }
  }
  assert.throws(
    () =>
      parseGlobalSecurityHeaders(
        `${headers}\n/about\n  ! cOnTeNt-SeCuRiTy-PoLiCy\n`,
      ),
    /protected header content-security-policy/,
  );
});

test("approved regular public files preserve the canonical disclosure contact", async () => {
  await fixture(async (root) =>
    assert.deepEqual((await auditStaticArtifact(root)).issues, []),
  );
});

test("courtesy comments and Next build directories preserve valid exports", async () => {
  await fixture(async (root) => {
    await writeFile(
      join(root, "security.txt"),
      await readFile(new URL("../../public/security.txt", import.meta.url)),
    );
    await mkdir(join(root, "_next/build-123"), { recursive: true });
    await writeFile(join(root, "_next/build-123/_buildManifest.js"), "fixture");
    assert.deepEqual((await auditStaticArtifact(root)).issues, []);
  });
});

test("artifact transfer that omits hidden files fails the receiving gate", async () => {
  await fixture(async (root) => {
    await rm(join(root, ".well-known"), { recursive: true });
    assert.ok(
      (await auditStaticArtifact(root)).issues.includes(
        ".well-known/security.txt: required artifact file missing",
      ),
    );
  });
});

test("including hidden files never admits unexpected secrets or directories", async () => {
  await fixture(async (root) => {
    await writeFile(join(root, ".env"), "synthetic fixture only");
    await mkdir(join(root, ".git"));
    await mkdir(join(root, ".well-known/.well-known"));
    await mkdir(join(root, ".well-known/unapproved-directory"));
    await writeFile(join(root, ".well-known/unapproved.txt"), "fixture");
    const issues = (await auditStaticArtifact(root)).issues;
    for (const path of [
      ".env",
      ".git",
      ".well-known/.well-known",
      ".well-known/unapproved-directory",
      ".well-known/unapproved.txt",
    ])
      assert.ok(
        issues.some((issue) => issue.startsWith(path + ":")),
        path,
      );
  });
});

test("symlinks, source maps and private source types cannot enter the artifact", async () => {
  await fixture(async (root) => {
    await symlink("security.txt", join(root, "alias.txt"));
    await writeFile(join(root, "debug.js.map"), "fixture");
    await writeFile(join(root, "private.key"), "synthetic fixture only");
    await writeFile(join(root, "source.ts"), "fixture");
    const issues = (await auditStaticArtifact(root)).issues;
    for (const path of [
      "alias.txt",
      "debug.js.map",
      "private.key",
      "source.ts",
    ])
      assert.ok(
        issues.some((issue) => issue.startsWith(path + ":")),
        path,
      );
  });
});

test("missing roots and unequal disclosure copies fail without an uncaught I/O error", async () => {
  await fixture(async (root) => {
    assert.ok((await auditStaticArtifact(join(root, "missing"))).issues.length);
    await writeFile(
      join(root, ".well-known/security.txt"),
      "different fixture",
    );
    assert.ok(
      (await auditStaticArtifact(root)).issues.includes(
        "disclosure contact copies differ",
      ),
    );
  });
});

test("an artifact with weakened headers or unsafe locale redirects fails", async () => {
  await fixture(async (root) => {
    await writeFile(
      join(root, "_headers"),
      headers.replace(
        "script-src-attr 'none'",
        "script-src-attr 'unsafe-inline'",
      ),
    );
    await writeFile(join(root, "_redirects"), "/en/* /:splat 308");
    const issues = (await auditStaticArtifact(root)).issues;
    assert.ok(issues.includes("missing or incorrect CSP script-src-attr"));
    assert.ok(
      issues.some((issue) => issue.includes("no fixed section prefix")),
    );
  });
});

test("execution controls and source/private namespaces cannot enter a static deployment", async () => {
  await fixture(async (root) => {
    for (const name of [
      "_worker.js",
      "_routes.json",
      "src/secret.js",
      "private/client-data.json",
      "backup/passwords.txt",
    ]) {
      await mkdir(join(root, name, ".."), { recursive: true });
      await writeFile(join(root, name), "synthetic fixture only");
    }
    const issues = (await auditStaticArtifact(root)).issues;
    for (const path of [
      "_worker.js",
      "_routes.json",
      "src",
      "private",
      "backup",
    ])
      assert.ok(
        issues.some((issue) => issue.startsWith(path + ":")),
        path,
      );
  });
});

test("matching disclosure files must retain the approved contact, canonical URL and current expiry", async () => {
  await fixture(async (root) => {
    for (const content of [
      "not a security contact\n",
      disclosure.replace(
        "mailto:raoof.r999@outlook.com",
        "mailto:attacker@example.invalid",
      ),
      disclosure.replace(
        "https://raoufabedini.dev/.well-known/security.txt",
        "https://attacker.invalid/security.txt",
      ),
      disclosure.replace(/Expires: .+/, "Expires: 2020-01-01T00:00:00Z"),
      disclosure + "Expires: 2030-01-01T00:00:00Z\n",
    ]) {
      await writeFile(join(root, "security.txt"), content);
      await writeFile(join(root, ".well-known/security.txt"), content);
      const issues = (await auditStaticArtifact(root)).issues;
      assert.ok(
        issues.some((issue) => issue.includes("disclosure")),
        content,
      );
    }
  });
});
