# Portfolio localization audit — 13 November 2026

## Scope and outcome

Audited English, Persian, Arabic, Spanish and Simplified Chinese across shared interface dictionaries, window and search copy, project dossiers, write-ups, lab pages, metadata and locale routing. The inventory is 14 projects, seven write-ups, three lab experiments and the supporting pages in each locale.

The authored translation and routing checks found no missing dictionary keys, empty values, missing dossier narratives, missing translated write-up or lab prose, or missing locale routes. This is a coverage assessment, not a certification of translation quality.

The About portrait used a hard-coded Latin-script alternative name in every locale. It now uses the same authored locale-specific name as the About heading. Five regression cases check the image's accessible name. The résumé retains its English identity line, explicitly marked as English, in keeping with the original English résumé. Original publication titles, certificate names, code, product names, URLs and source-language PDFs remain in their original form; they are not missing translations.

## Verification

- 113 tests in seven focused files passed: translation dictionaries and shell copy; locale resolution; all project narratives and evidence; article and lab translation/source consistency; language navigation; About portrait and image fallbacks.
- Six schema-language tests passed. The static route audit passed for 165 sitemap URLs, with zero warnings. The production build and TypeScript passed; changed source lint passed.
- Independent scan of 32 non-root exported HTML pages per locale found no missing counterparts. It compared authored text of at least 24 characters and accessibility attributes of at least 12 characters with English, excluding code, hidden content and explicitly English source material. Its 38 exact-match candidates were names, email placeholders, technical identifiers, URLs and source names. This heuristic is not an exhaustive linguistic review; five locale roots were covered by the 165-route audit.
- Ten Chromium browser combinations passed: five locales at 390 and 1440 pixels. Each checked About portrait name, locale and direction, FORMA tabs, global search result routing and language switching. RTL was checked for Persian and Arabic; horizontal overflow was checked on the exercised pages. An initial test fixture incorrectly waited for a project-only search field on About, producing two timeout attempts before the harness was corrected; the corrected run passed all ten.

## Limits

Automated coverage and comparison cannot determine whether every sentence is fluent, idiomatic, culturally appropriate or faithful to its source. Persian, Arabic, Spanish and Chinese copy has not received a native-speaker review in this audit. Original-language source artifacts are not translated. Browser checks used Chromium on a desktop host, not physical mobile devices or assistive technology.
