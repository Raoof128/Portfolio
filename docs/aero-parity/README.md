# Operation Aero

Latest completed review: [third parity pass](round3/README.md) (2026-11-08). The [second pass](round2/README.md) and the first-pass build and evidence below remain historical.

**CONDITIONAL PASS for owner review.** The reviewed local export is `xfHy_bhVfJKii-CA72D9U`, built `2026-11-03T07:23:07.345Z` from checkpoint `b4cc49de662b3013a97d5497f3fd8daed0df1a20` plus the documented working-tree changes. It has not been committed, pushed, merged, deployed or published by this pass.

The implementation restores the unchanged installed `7.css@0.21.1` frame, captions, glass, buttons, fields, tabs and scrollbars. It preserves ResearchOS, original artwork and research evidence, all five locales, modeless windows and the static Cloudflare architecture. Desktop/taskbar/Start and Aero Night remain explicitly identified portfolio extensions.

## Evidence ledger

| Stage | Completed evidence |
| --- | --- |
| Baseline | Frozen DOM, CSS, fonts and screenshots from export `Dfv1QQLfhv_4WAY_tllxC`, built 05:58:48.112 UTC; source checkpoint `b4cc49d` |
| Reference | Official documentation/demo, 23 source-map entries, 25 browser specimens; unchanged canonical stylesheet hash |
| Implementation | 23 changed application/test/style files; six browser-harness files; exact hashes and review ownership in [source changes](source-changes.md) |
| Visual comparison | 56 before/reference/final component-state pairs; measured masks, raw differences and independently calibrated PNG tooling |
| Independent challenge | Cascade, native keyboard, RTL, touch, preference modes, Atlas diagrams, remaining frame pixels and evidence-harness integrity independently reviewed |
| Final native tests | Chromium 32/32, Firefox/WebKit final single-worker 12/12; 360 responsive observations, 160 route scans with zero axe violations and 158 incomplete contrast results |
| Engineering | 674/674 unit tests, lint/typecheck, build, schema/dependency/static-security tests and local artifact/HTTP audits passed |
| Verdict | [Conditional acceptance](final-acceptance.md), with explicit remaining differences, prior author/document matters and environment limits |

The earlier complete 268-file source audit remains under [frontend-review](../audits/frontend-review/README.md). SHA-256 revalidation carries forward 244 unchanged prior reviews; 24 prior files were re-reviewed and five new harness files were examined, giving 273 cumulatively accounted files. This pass adds complete examination and re-review of its changed source plus relevant integration/reference files; it does not falsely describe the previous full audit as a fresh sweep. [Build identity](evidence/build-identity.json), [current changed-source manifest](evidence/source-manifest.json) and [all 1,072 export hashes](evidence/export-manifest.json) distinguish application bytes from subsequently refined test tooling.

## Reports

- [Reference analysis](reference-analysis.md)
- [Component mapping](component-mapping.md)
- [CSS cascade audit](css-cascade-audit.md)
- [Visual parity matrix](visual-parity-matrix.md)
- [Before/after evidence](before-after-evidence.md)
- [Browser test results](browser-test-results.md)
- [Accessibility results](accessibility-results.md)
- [Unresolved differences](unresolved-differences.md)
- [Final acceptance](final-acceptance.md)

Large raw captures, traces and complete browser reports remain under ignored `artifacts/aero-parity/` and `artifacts/frontend-review/`; useful screenshots, reduced measurements and command logs are retained here. The [harness README](../../scripts/browser-regressions/aero-parity/README.md) documents reproducible capture/compare commands and protects existing phases from accidental replacement.
