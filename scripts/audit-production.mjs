#!/usr/bin/env node
/**
 * audit-production.mjs — live post-deploy audit of https://raoufabedini.dev.
 *
 * The static `audit:agents` guards the blueprint (out/); this guards the actual
 * building: real HTTP status/redirects/headers, canonical↔og:url agreement,
 * per-bot reachability, and deployment freshness (version.json commit vs local
 * git HEAD). Run AFTER `wrangler pages deploy`. Needs network + Node 22 fetch.
 *
 * Usage: node scripts/audit-production.mjs [origin]   (default origin below)
 * Exit 1 on any failure. No dependencies.
 */
import { execFileSync } from "node:child_process";
import { auditSchemaLanguages } from "./lib/schema-language-audit.mjs";
import {
  CANONICAL_ORIGIN,
  parseAuditOrigin,
  fetchAuditResponse,
  auditRedirect,
  auditSecurityExpiry,
  auditSecurityHeaders,
  auditDeploymentVersion,
} from "./lib/production-audit.mjs";

let ORIGIN;
try {
  ORIGIN = parseAuditOrigin(process.argv[2]);
} catch (error) {
  console.error(`✘ ${error.message}`);
  process.exit(1);
}
const LOCALES = ["en", "fa", "ar", "zh", "es"];
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36";
const BOTS = [
  "ClaudeBot/1.0",
  "Claude-User/1.0",
  "Claude-SearchBot/1.0",
  "GPTBot/1.2",
  "OAI-SearchBot/1.0",
  "ChatGPT-User/1.0",
  "Googlebot/2.1",
  "Bingbot/2.0",
  "PerplexityBot/1.0",
];

const errors = [];
const notes = [];
const fail = (m) => errors.push(m);
const note = (m) => notes.push(m);

async function get(
  path,
  { ua = BROWSER_UA, redirect = "error", readBody = true } = {},
) {
  const url = new URL(path, ORIGIN).href;
  return fetchAuditResponse(url, { ua, redirect, readBody });
}

// ── Machine-control files must be 200 with sane content-types ────────────────
const machineFiles = [
  ["/robots.txt", /text\/plain/],
  ["/sitemap.xml", /xml/],
  ["/security.txt", /text\/plain/],
  ["/.well-known/security.txt", /text\/plain/],
  ["/llms.txt", /text\/plain/],
  ["/llms-full.txt", /text\/plain/],
  ["/feed.xml", /xml|rss/],
  ["/og.png", /image\/png/],
  ["/version.json", /json/],
];
for (const [path, ctRe] of machineFiles) {
  try {
    const { res } = await get(path, { readBody: false });
    if (res.status !== 200) fail(`${path} → ${res.status} (expected 200)`);
    else {
      const ct = res.headers.get("content-type") || "";
      if (!ctRe.test(ct)) fail(`${path} content-type "${ct}" (wanted ${ctRe})`);
    }
  } catch (e) {
    fail(`${path} fetch failed: ${e.message}`);
  }
}

// ── Deployment freshness: version.json commit vs local HEAD ──────────────────
try {
  const { res, body } = await get("/version.json");
  if (res.status === 200) {
    const v = JSON.parse(body);
    for (const issue of auditDeploymentVersion(v)) fail(issue);
    let head = "";
    try {
      head = execFileSync("git", ["rev-parse", "HEAD"], {
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 2_000,
        maxBuffer: 4_096,
      })
        .toString()
        .trim();
    } catch {
      /* not in a git checkout — skip comparison */
    }
    if (
      typeof v?.commit === "string" &&
      /^(?:[a-f\d]{40}|[a-f\d]{64})$/i.test(v.commit) &&
      head
    ) {
      if (v.commit !== head)
        fail(
          `production is STALE: version.json commit ${v.commit.slice(0, 8)} ≠ local HEAD ${head.slice(0, 8)} — redeploy`,
        );
      else
        note(
          `commit identity matches HEAD ${head.slice(0, 8)}; exact export bytes need separate validation`,
        );
    } else {
      note(
        `version.json commit=${v?.commit}, contentRevision=${v?.contentRevision}; local HEAD comparison unavailable`,
      );
    }
  }
} catch (e) {
  fail(`version.json parse failed: ${e.message}`);
}

// ── Redirects: www → apex 308, /en → clean 308 (path preserved) ──────────────
async function expectRedirect(path, expected) {
  try {
    const { res, url } = await get(path, { redirect: "manual" });
    const issue = auditRedirect(res, url, new URL(expected, ORIGIN).href);
    if (issue) fail(`${path}: ${issue}`);
  } catch (error) {
    fail(`${path} redirect check failed: ${error.message}`);
  }
}
// A staging/loopback audit must never make an unrelated production request.
if (ORIGIN === CANONICAL_ORIGIN)
  await expectRedirect("https://www.raoufabedini.dev/about", "/about");
else note("www → apex check applies only to the production origin");
await expectRedirect("/en", "/");
await expectRedirect("/en/about", "/about");
await expectRedirect("/en/about?audit=1", "/about?audit=1");

// ── Canonical page checks: status, html[lang], canonical↔og:url agreement ────
// One representative of each primary document type in every locale.
const sampleSlug = "project-simurgh";
for (const locale of LOCALES) {
  for (const [kind, suffix] of [
    ["project", `/projects/${sampleSlug}`],
    ["article", "/write-ups/project-simurgh-containment"],
    ["lab", "/lab/001"],
  ]) {
    const prefix = locale === "en" ? "" : `/${locale}`;
    const path = `${prefix}${suffix}`;
    try {
      const { res, body, url } = await get(path);
      if (res.status !== 200) {
        fail(`${path} → ${res.status}`);
        continue;
      }
      const lang = (body.match(/<html[^>]+lang="([^"]+)"/) || [])[1];
      if (lang !== locale) fail(`${path}: <html lang="${lang}"> ≠ ${locale}`);

      const canonical = (body.match(
        /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/,
      ) || [])[1];
      const ogUrl = (body.match(/property="og:url"[^>]+content="([^"]+)"/) ||
        body.match(/content="([^"]+)"[^>]+property="og:url"/) ||
        [])[1];
      // A preview still advertises the production canonical identity.
      const want = `${CANONICAL_ORIGIN}${path}`;
      if (!canonical) fail(`${path}: missing canonical`);
      else if (canonical.replace(/\/$/, "") !== want)
        fail(`${path}: canonical ${canonical} ≠ ${want}`);
      if (!ogUrl) fail(`${path}: missing og:url`);
      else if (ogUrl.replace(/\/$/, "") !== want)
        fail(`${path}: og:url ${ogUrl} ≠ canonical ${want}`);

      for (const issue of auditSchemaLanguages(body, {
        locale,
        pageUrl: want,
        kind,
      }))
        fail(`${path}: ${issue}`);
      for (const issue of auditSecurityHeaders(res.headers))
        fail(`${path}: ${issue}`);
      void url;
    } catch (e) {
      fail(`${path} fetch failed: ${e.message}`);
    }
  }
}

// ── Every named bot must get 200 on a deep route (no WAF challenge/block) ─────
const botPath = `/projects/${sampleSlug}`;
for (const ua of BOTS) {
  try {
    const { res } = await get(botPath, { ua, redirect: "manual" });
    if (res.status !== 200)
      fail(`bot "${ua.split("/")[0]}" → ${res.status} on ${botPath}`);
  } catch (e) {
    fail(`bot "${ua}" fetch failed: ${e.message}`);
  }
}

// ── robots.txt must allow crawling and advertise the sitemap ─────────────────
try {
  const { body } = await get("/robots.txt");
  if (/user-agent:\s*\*[\s\S]*?disallow:\s*\/\s*$/im.test(body))
    fail("robots.txt blocks all agents (Disallow: / for *)");
  if (!/sitemap:/i.test(body)) fail("robots.txt does not advertise a Sitemap");
} catch (e) {
  fail(`robots.txt fetch failed: ${e.message}`);
}

for (const path of ["/security.txt", "/.well-known/security.txt"]) {
  try {
    const { body } = await get(path);
    const expiry = body.match(/^Expires:\s*(\S+)/im)?.[1];
    const issue = auditSecurityExpiry(expiry);
    if (issue) fail(`${path}: ${issue}`);
  } catch (error) {
    fail(`${path} expiry check failed: ${error.message}`);
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`Production audit · ${ORIGIN}`);
for (const n of notes) console.log(`  · ${n}`);
if (errors.length) {
  console.error(`\n✘ production audit FAILED — ${errors.length} issue(s):`);
  for (const e of errors) console.error(`  ✘ ${e}`);
  process.exit(1);
}
console.log(`\n✔ production audit passed (${notes.length} note(s))`);
