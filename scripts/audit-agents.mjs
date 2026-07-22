#!/usr/bin/env node
/**
 * audit-agents.mjs — machine-reliability audit of the static export (out/).
 *
 * Fails (exit 1) when the generated site would be hard for AI agents, search
 * engines, or crawlers to discover, retrieve, understand, or attribute. Run
 * after `npm run build`. See AGENT.md for the rationale.
 *
 * No dependencies — parses HTML/XML with scoped regexes over the built files.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const ORIGIN = "https://raoufabedini.dev";
const LOCALES = ["en", "fa", "ar", "zh", "es"];
const NONEN = ["fa", "ar", "zh", "es"];

const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);

if (!existsSync(OUT)) {
  console.error(`✘ ${OUT}/ not found — run \`npm run build\` first.`);
  process.exit(1);
}

// ── URL → built-file resolver ────────────────────────────────────────────────
// Clean English URLs are served from out/en/* via _redirects rewrites; other
// locales live under their prefix. Root "/" → out/en.html, "/fa" → out/fa.html.
function urlToFile(url) {
  let path = url.replace(ORIGIN, "");
  if (path === "" || path === "/") return join(OUT, "en.html");
  path = path.replace(/\/$/, "");
  const seg = path.split("/")[1];
  if (NONEN.includes(seg)) {
    const rest = path.slice(seg.length + 1);
    return rest ? join(OUT, seg + rest + ".html") : join(OUT, seg + ".html");
  }
  return join(OUT, "en" + path + ".html");
}

function localeOf(url) {
  const seg = url.replace(ORIGIN, "").split("/")[1];
  return NONEN.includes(seg) ? seg : "en";
}

// ── Load sitemap ─────────────────────────────────────────────────────────────
const sitemapPath = join(OUT, "sitemap.xml");
if (!existsSync(sitemapPath)) fail("sitemap.xml missing");
const sitemapXml = existsSync(sitemapPath)
  ? readFileSync(sitemapPath, "utf8")
  : "";
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1],
);
if (sitemapUrls.length === 0) fail("sitemap.xml has no <loc> entries");

// ── Route-count parity vs generated pages (authoritative inventory) ──────────
const countHtml = (dir) => {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => f.endsWith(".html")).length;
};
const nProjects = countHtml(join(OUT, "en", "projects"));
const nWriteups = countHtml(join(OUT, "en", "write-ups"));
const nLab = countHtml(join(OUT, "en", "lab"));
const STATIC_PER_LOCALE = 9; // home, projects, lab, write-ups, resume, about, contact, security-policy, hall-of-fame
const perLocale = STATIC_PER_LOCALE + nProjects + nWriteups + nLab;
const expectedTotal = perLocale * LOCALES.length;
if (sitemapUrls.length !== expectedTotal) {
  fail(
    `sitemap URL count ${sitemapUrls.length} ≠ inventory ${expectedTotal} ` +
      `(per-locale ${perLocale} = 9 static + ${nProjects} projects + ${nWriteups} write-ups + ${nLab} lab)`,
  );
}

// ── Forward parity + per-page checks ─────────────────────────────────────────
const titlesByLocale = Object.fromEntries(LOCALES.map((l) => [l, new Map()]));

for (const url of sitemapUrls) {
  const file = urlToFile(url);
  if (!existsSync(file)) {
    fail(`sitemap URL has no generated page: ${url} → ${file}`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const locale = localeOf(url);

  // title
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1]?.trim();
  if (!title) fail(`missing <title>: ${url}`);
  else if ((title.match(/Mohammad Raouf Abedini/g) || []).length > 1)
    fail(
      `title repeats the brand name (template + inline): "${title}" — ${url}`,
    );
  if (title) {
    const seen = titlesByLocale[locale].get(title);
    if (seen && seen !== url)
      fail(`duplicate title within ${locale}: "${title}" (${seen} & ${url})`);
    else titlesByLocale[locale].set(title, url);
  }

  // description
  if (!/<meta[^>]+name="description"[^>]+content="[^"]+"/.test(html))
    fail(`missing meta description: ${url}`);

  // H1
  if (!/<h1[\s>]/.test(html)) fail(`missing <h1>: ${url}`);

  // canonical
  const canonical = (html.match(
    /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/,
  ) || [])[1];
  if (!canonical) fail(`missing canonical: ${url}`);
  else if (canonical.replace(/\/$/, "") !== url.replace(/\/$/, ""))
    fail(`canonical ≠ self: ${url} → ${canonical}`);

  // hreflang reciprocity + x-default. React serializes the attribute as
  // `hrefLang` (camelCase), so match case-insensitively.
  const alts = [...html.matchAll(/hreflang="([^"]+)"/gi)].map((m) => m[1]);
  for (const l of LOCALES)
    if (!alts.includes(l)) fail(`missing hreflang="${l}": ${url}`);
  if (!alts.includes("x-default")) fail(`missing hreflang="x-default": ${url}`);

  // noindex must not appear on public pages
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html))
    fail(`public page is noindex: ${url}`);

  // html lang
  const lang = (html.match(/<html[^>]+lang="([^"]+)"/) || [])[1];
  if (lang !== locale)
    fail(`<html lang="${lang}"> ≠ route locale ${locale}: ${url}`);

  // JSON-LD parse + inLanguage agreement
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ].map((m) => m[1]);
  let parsed = [];
  for (const b of blocks) {
    try {
      parsed.push(JSON.parse(b));
    } catch {
      fail(`JSON-LD fails to parse: ${url}`);
    }
  }
  const flatTypes = JSON.stringify(parsed);

  // project pages carry SoftwareSourceCode or CreativeWork; write-ups TechArticle
  if (/\/projects\/[^/]+$/.test(url.replace(ORIGIN, ""))) {
    if (!/"SoftwareSourceCode"|"CreativeWork"/.test(flatTypes))
      fail(`project page lacks project schema: ${url}`);
    // DOI + repo URL sanity (if present)
    for (const doi of flatTypes.match(/10\.\d{4,9}\/[^"\\]+/g) || [])
      if (!/^10\.\d{4,9}\/\S+$/.test(doi)) fail(`malformed DOI ${doi}: ${url}`);
  }
  if (/\/write-ups\/[^/]+$/.test(url.replace(ORIGIN, ""))) {
    if (!/"TechArticle"|"BlogPosting"/.test(flatTypes))
      fail(`write-up lacks article schema: ${url}`);
  }
  if (/\/about$/.test(url.replace(ORIGIN, ""))) {
    if (!/"@type":"ProfilePage"/.test(flatTypes))
      fail(`about page lacks ProfilePage schema: ${url}`);
  }

  // The root WebSite entity should use a concise human identity and offer
  // fallback names, matching Google's site-name guidance.
  if (url === `${ORIGIN}/`) {
    if (!/"@type":"WebSite"/.test(flatTypes))
      fail("home page lacks WebSite schema");
    if (!/"name":"Mohammad Raouf Abedini"/.test(flatTypes))
      fail("WebSite.name is not the concise personal name");
    if (
      !/"alternateName":\["Raouf Abedini","raoufabedini.dev"\]/.test(flatTypes)
    )
      fail("WebSite schema lacks preferred alternate names");
  }

  // inLanguage should match locale on the primary node (allow "en" article
  // sub-nodes such as English PDFs on localized pages)
  const inLangs = [...flatTypes.matchAll(/"inLanguage":"([^"]+)"/g)].map(
    (m) => m[1],
  );
  if (inLangs.length && locale !== "en" && !inLangs.includes(locale))
    fail(`no JSON-LD inLanguage="${locale}" on localized page: ${url}`);

  // og:image + twitter:image resolve to a real file
  const og = (html.match(/property="og:image"[^>]+content="([^"]+)"/) || [])[1];
  if (!og) fail(`missing og:image: ${url}`);
  else if (og.startsWith(ORIGIN)) {
    const f = join(OUT, og.replace(ORIGIN, ""));
    if (!existsSync(f)) fail(`og:image file missing (${og}): ${url}`);
  }
  if (!/name="twitter:image"/.test(html)) fail(`missing twitter:image: ${url}`);

  // og:url must be present and agree with the self-canonical (no page may
  // advertise the English apex — or any other URL — as its own og:url).
  const ogUrl = (html.match(/property="og:url"[^>]+content="([^"]+)"/) ||
    html.match(/content="([^"]+)"[^>]+property="og:url"/) ||
    [])[1];
  if (!ogUrl) fail(`missing og:url: ${url}`);
  else if (
    canonical &&
    ogUrl.replace(/\/$/, "") !== canonical.replace(/\/$/, "")
  )
    fail(
      `og:url ≠ canonical: ${url} → og:url ${ogUrl}, canonical ${canonical}`,
    );
}

// ── Machine-control files ────────────────────────────────────────────────────
const mustExist = [
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "llms-full.txt",
  "feed.xml",
  "og.png",
  "security.txt",
  ".well-known/security.txt",
  "version.json",
];
for (const f of mustExist)
  if (!existsSync(join(OUT, f))) fail(`machine file missing: ${f}`);

// robots.txt (the file we control) must allow crawling, advertise sitemap
if (existsSync(join(OUT, "robots.txt"))) {
  const r = readFileSync(join(OUT, "robots.txt"), "utf8");
  if (!/Allow:\s*\//.test(r)) fail("robots.txt does not Allow: /");
  if (/User-Agent:\s*\*[\s\S]*?Disallow:\s*\/\s*$/im.test(r))
    fail("robots.txt blocks all agents (Disallow: / for *)");
  if (!/Sitemap:/i.test(r)) fail("robots.txt does not advertise a Sitemap");
}

// security.txt RFC 9116 validity + expiry
for (const p of ["security.txt", ".well-known/security.txt"]) {
  const fp = join(OUT, p);
  if (!existsSync(fp)) continue;
  const s = readFileSync(fp, "utf8");
  if (!/^Contact:\s*\S+/im.test(s)) fail(`${p}: missing Contact`);
  if (/^Ack:/im.test(s)) fail(`${p}: uses "Ack" — must be "Acknowledgments"`);
  const exp = (s.match(/^Expires:\s*(\S+)/im) || [])[1];
  if (!exp) fail(`${p}: missing Expires`);
  else if (new Date(exp) <= new Date()) fail(`${p}: Expires ${exp} is expired`);
  const canon = (s.match(/^Canonical:\s*(\S+)/im) || [])[1];
  if (canon && canon !== `${ORIGIN}/.well-known/security.txt`)
    fail(`${p}: Canonical ${canon} ≠ live well-known URL`);
}

// og.png dimensions sanity (PNG header: width/height at bytes 16..24)
if (existsSync(join(OUT, "og.png"))) {
  const buf = readFileSync(join(OUT, "og.png"));
  const w = buf.readUInt32BE(16),
    h = buf.readUInt32BE(20);
  if (w !== 1200 || h !== 630) fail(`og.png is ${w}×${h}, expected 1200×630`);
}

// llms.txt / llms-full.txt non-trivial
for (const f of ["llms.txt", "llms-full.txt"]) {
  const fp = join(OUT, f);
  if (existsSync(fp) && statSync(fp).size < 500)
    fail(`${f} is suspiciously small`);
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log(
  `Audited ${sitemapUrls.length} sitemap URLs · inventory ${expectedTotal} ` +
    `(${nProjects} projects, ${nWriteups} write-ups, ${nLab} lab / locale)`,
);
for (const w of warnings) console.log(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`\n✘ agent audit FAILED — ${errors.length} issue(s):`);
  for (const e of errors) console.error(`  ✘ ${e}`);
  process.exit(1);
}
console.log(`✔ agent audit passed (${warnings.length} warning(s))`);
