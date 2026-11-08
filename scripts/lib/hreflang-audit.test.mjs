import test from "node:test";
import assert from "node:assert/strict";
import { auditHreflang, expectedHreflang } from "./hreflang-audit.mjs";

const ORIGIN = "https://raoufabedini.dev";

// Mirrors the shape the built site emits: English is the unprefixed path,
// every other locale is /<locale><path>, and x-default is the English URL.
function cluster(enPath) {
  const base = enPath === "/" ? "" : enPath;
  const en = `${ORIGIN}${base}`;
  return [
    ["en", en],
    ["fa", `${ORIGIN}/fa${base}`],
    ["ar", `${ORIGIN}/ar${base}`],
    ["zh", `${ORIGIN}/zh${base}`],
    ["es", `${ORIGIN}/es${base}`],
    ["x-default", en],
  ];
}

function html(pairs) {
  return `<html><head>${pairs
    .map(
      ([hreflang, href]) =>
        `<link rel="alternate" hrefLang="${hreflang}" href="${href}"/>`,
    )
    .join("")}</head><body></body></html>`;
}

function withPair(pairs, hreflang, href) {
  return pairs.map(([code, url]) =>
    code === hreflang ? [code, href] : [code, url],
  );
}

test("a correct cluster passes for English, localized and home pages", () => {
  assert.deepEqual(
    auditHreflang(html(cluster("/about")), `${ORIGIN}/about`),
    [],
  );
  assert.deepEqual(
    auditHreflang(html(cluster("/about")), `${ORIGIN}/fa/about`),
    [],
  );
  assert.deepEqual(auditHreflang(html(cluster("/")), ORIGIN), []);
  assert.deepEqual(auditHreflang(html(cluster("/")), `${ORIGIN}/zh`), []);
  assert.deepEqual(
    auditHreflang(
      html(cluster("/projects/x-y")),
      `${ORIGIN}/es/projects/x-y`,
    ),
    [],
  );
});

test("expectedHreflang derives the same mapping from any locale of a page", () => {
  const expected = {
    en: `${ORIGIN}/about`,
    fa: `${ORIGIN}/fa/about`,
    ar: `${ORIGIN}/ar/about`,
    zh: `${ORIGIN}/zh/about`,
    es: `${ORIGIN}/es/about`,
    "x-default": `${ORIGIN}/about`,
  };
  assert.deepEqual(expectedHreflang(`${ORIGIN}/about`), expected);
  assert.deepEqual(expectedHreflang(`${ORIGIN}/ar/about`), expected);
});

test("a wrong-locale URL fails", () => {
  const pairs = withPair(cluster("/about"), "fa", `${ORIGIN}/ar/about`);
  const issues = auditHreflang(html(pairs), `${ORIGIN}/about`);
  assert.ok(
    issues.some((issue) => issue.includes('hreflang="fa"')),
    issues.join("\n"),
  );
});

test("a cross-page URL fails", () => {
  const pairs = withPair(cluster("/about"), "es", `${ORIGIN}/es/projects`);
  const issues = auditHreflang(html(pairs), `${ORIGIN}/about`);
  assert.ok(
    issues.some((issue) => issue.includes('hreflang="es"')),
    issues.join("\n"),
  );
});

test("a missing x-default fails", () => {
  const pairs = cluster("/about").filter(([code]) => code !== "x-default");
  const issues = auditHreflang(html(pairs), `${ORIGIN}/about`);
  assert.ok(issues.some((issue) => issue.includes('hreflang="x-default"')), issues.join("\n"));
});

test("an x-default that is not the English URL fails", () => {
  const pairs = withPair(cluster("/about"), "x-default", `${ORIGIN}/fa/about`);
  assert.ok(auditHreflang(html(pairs), `${ORIGIN}/about`).length > 0);
});

test("missing, duplicate, unexpected and unsafe alternates fail", () => {
  const base = cluster("/about");
  const cases = {
    missingLocale: base.filter(([code]) => code !== "zh"),
    duplicate: [...base, ["fa", `${ORIGIN}/fa/about`]],
    unexpectedLocale: [...base, ["de", `${ORIGIN}/de/about`]],
    httpScheme: withPair(base, "fa", `http://raoufabedini.dev/fa/about`),
    foreignHost: withPair(base, "fa", `https://attacker.invalid/fa/about`),
    queryString: withPair(base, "fa", `${ORIGIN}/fa/about?x=1`),
    relativeHref: withPair(base, "fa", `/fa/about`),
  };
  for (const [name, pairs] of Object.entries(cases))
    assert.ok(
      auditHreflang(html(pairs), `${ORIGIN}/about`).length > 0,
      name,
    );
});

test("only <link rel=alternate> elements count, in any attribute order", () => {
  const reordered = cluster("/about")
    .map(([code, url]) => `<link href="${url}" hrefLang="${code}" rel="alternate">`)
    .join("");
  assert.deepEqual(auditHreflang(reordered, `${ORIGIN}/about`), []);

  const decoys = cluster("/about")
    .map(([code, url]) => `<a hreflang="${code}" href="${url}">x</a>`)
    .join("");
  assert.ok(auditHreflang(decoys, `${ORIGIN}/about`).length > 0);
});
