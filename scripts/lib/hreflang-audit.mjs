/**
 * Pure hreflang reciprocity checks for the static export. Used by
 * scripts/audit-agents.mjs; no I/O here so the rules are unit-testable.
 *
 * Expected mapping, derived from src/lib/seo.ts (buildAlternates) and
 * src/app/sitemap.ts (alternatesFor): English is the unprefixed path, every
 * other locale is `/<locale><path>`, and x-default is the English URL.
 */

export const SITE_ORIGIN = "https://raoufabedini.dev";
export const SITE_LOCALES = ["en", "fa", "ar", "zh", "es"];
const NON_ENGLISH = SITE_LOCALES.filter((locale) => locale !== "en");

// Trailing slashes are not significant for these URLs (the canonical audit
// makes the same allowance). Anything else, including a query or fragment,
// must match exactly.
function stripTrailingSlash(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

/**
 * Returns the English (unprefixed) path for a page URL, e.g.
 * "https://raoufabedini.dev/fa/about" -> "/about" and "/zh" -> "".
 */
function englishPathOf(pageUrl) {
  const { pathname } = new URL(pageUrl);
  const segments = stripTrailingSlash(pathname).split("/").filter(Boolean);
  if (segments.length && NON_ENGLISH.includes(segments[0]))
    segments.shift();
  return segments.length ? `/${segments.join("/")}` : "";
}

/**
 * The hreflang → absolute URL map every page of the same cluster must emit.
 */
export function expectedHreflang(pageUrl) {
  const path = englishPathOf(pageUrl);
  const english = `${SITE_ORIGIN}${path}`;
  const expected = { en: english, "x-default": english };
  for (const locale of NON_ENGLISH)
    expected[locale] = `${SITE_ORIGIN}/${locale}${path}`;
  return expected;
}

// Canonical form of an alternate href, or null when it is not an absolute
// https URL on the site origin without credentials, port, query or fragment.
function canonicalHref(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (
    url.protocol !== "https:" ||
    url.hostname !== new URL(SITE_ORIGIN).hostname ||
    url.port ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    return null;
  const path = url.pathname === "/" ? "" : stripTrailingSlash(url.pathname);
  return `${SITE_ORIGIN}${path}`;
}

function attributesOf(tag) {
  const attributes = {};
  for (const [, name, double, single] of tag.matchAll(
    /([a-zA-Z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,
  ))
    attributes[name.toLowerCase()] = double ?? single;
  return attributes;
}

/**
 * Parses `<link rel="alternate" hreflang href>` elements. Only link elements
 * whose rel includes "alternate" count, so anchors that merely carry an
 * hreflang attribute cannot satisfy the check.
 */
export function parseHreflangLinks(html) {
  const links = [];
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = attributesOf(tag);
    const rel = (attributes.rel ?? "").toLowerCase().split(/\s+/);
    if (!rel.includes("alternate") || attributes.hreflang === undefined)
      continue;
    links.push({
      hreflang: attributes.hreflang.trim().toLowerCase(),
      href: attributes.href ?? "",
    });
  }
  return links;
}

/**
 * Returns human-readable issues for one page's hreflang set. An empty array
 * means the set is exactly the expected cluster, with each URL correct.
 */
export function auditHreflang(html, pageUrl) {
  const issues = [];
  const expected = expectedHreflang(pageUrl);
  const links = parseHreflangLinks(html);
  for (const code of Object.keys(expected)) {
    const matches = links.filter((link) => link.hreflang === code);
    if (matches.length === 0) {
      issues.push(`missing hreflang="${code}"`);
      continue;
    }
    if (matches.length > 1) {
      issues.push(`duplicate hreflang="${code}" (${matches.length} entries)`);
      continue;
    }
    const actual = canonicalHref(matches[0].href);
    if (actual !== expected[code])
      issues.push(
        `hreflang="${code}" href ${matches[0].href} ≠ expected ${expected[code]}`,
      );
  }
  for (const link of links)
    if (!Object.hasOwn(expected, link.hreflang))
      issues.push(`unexpected hreflang="${link.hreflang}"`);
  return issues;
}
