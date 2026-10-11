import assert from "node:assert/strict";
import test from "node:test";
import { auditSchemaLanguages } from "./schema-language-audit.mjs";

const pageUrl = "https://raoufabedini.dev/fa/write-ups/test";
const html = (value) =>
  `<script data-test="schema" type="application/ld+json">${JSON.stringify(value)}</script>`;
const article = {
  "@type": "TechArticle",
  "@id": `${pageUrl}#article`,
  url: pageUrl,
  inLanguage: "fa",
};
const options = { locale: "fa", pageUrl, kind: "article" };

test("accepts active translated body alongside an original English DOI paper", () => {
  assert.deepEqual(
    auditSchemaLanguages(
      html({
        "@graph": [
          article,
          {
            "@type": "ScholarlyArticle",
            "@id": "https://doi.org/10.5281/zenodo.123",
            inLanguage: "en",
          },
        ],
      }),
      options,
    ),
    [],
  );
});
test("rejects an English fallback body on a Persian route", () => {
  assert.match(
    auditSchemaLanguages(
      html({ ...article, inLanguage: "en" }),
      options,
    ).join(),
    /expected fa/,
  );
});
test("rejects falsely localized original DOI publications", () => {
  assert.match(
    auditSchemaLanguages(
      html([
        article,
        {
          "@type": "ScholarlyArticle",
          "@id": "https://doi.org/10.5281/zenodo.123",
          inLanguage: "fa",
        },
      ]),
      options,
    ).join(),
    /expected en/,
  );
});
test("reads every JSON-LD block and nested graphs, with array types", () => {
  const value = {
    "@graph": [
      { "@graph": [{ ...article, "@type": ["Article", "TechArticle"] }] },
    ],
  };
  assert.deepEqual(
    auditSchemaLanguages(html({ "@type": "Person" }) + html(value), options),
    [],
  );
});
test("rejects malformed or missing primary schemas without throwing", () => {
  assert.match(
    auditSchemaLanguages(
      '<script type="application/ld+json">{broken}</script>',
      options,
    ).join(),
    /fails to parse/,
  );
  assert.match(
    auditSchemaLanguages(
      html([null, 5, { "@type": "Person" }]),
      options,
    ).join(),
    /missing primary/,
  );
});
test("validates project bodies and lab experiment identities", () => {
  assert.deepEqual(
    auditSchemaLanguages(
      html({
        "@type": "SoftwareSourceCode",
        "@id": `${pageUrl}#project`,
        inLanguage: "fa",
      }),
      { ...options, kind: "project" },
    ),
    [],
  );
  assert.deepEqual(
    auditSchemaLanguages(html({ ...article, "@id": `${pageUrl}#experiment` }), {
      ...options,
      kind: "lab",
    }),
    [],
  );
});
