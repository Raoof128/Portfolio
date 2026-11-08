# Source inventory and coverage

Calculated from the repository at `263a0e5`, not copied from earlier audit totals. The per-file ledger with SHA-256 hashes is in [evidence/source-coverage.tsv](evidence/source-coverage.tsv). Binary assets are in [evidence/binary-assets.tsv](evidence/binary-assets.tsv).

| Lane | Scope | Files | Lines | Read completely | Dispositions | Auditor |
| --- | --- | ---: | ---: | ---: | --- | --- |
| RR-L1 | `src/components/os` TS/TSX (window manager, desktop, taskbar, lock screen, Explorer, Atlas, evidence stories, copy) | 35 | 8,469 | 35 | 21 clean · 10 findings · 4 dead code | Haiku 5.5 |
| RR-L2 | `src/app`, `src/components/ui`, `src/components/layout`, `src/lib` (code), `src/i18n/index`, `src/proxy.ts` | 80 | 11,698 | 80 | 46 clean · 19 findings · 12 dead code · 3 runtime check | Haiku 5.5 |
| RR-L3 | `src/components/os/*.css` | 27 | 13,684 | 27 | 14 clean · 5 findings · 6 dead code · 2 runtime check | Haiku 5.5 |
| RR-L4 | Content: `data.ts`, `project-content/*`, `writing-translations/*`, `i18n/locales/*` | 20 | 8,391 | 20 | 4 clean · 16 findings | Haiku 5.5 |
| RR-L5 | Tests, browser specs, audit scripts, configs, workflows, `_headers`, `_redirects` | 91 | 18,927 | 91 | 44 clean · 38 findings · 8 dead code · 1 runtime check | Haiku 5.5 |
| **Total** | | **253** | **61,169** | **253** | | |

Binary/static assets: 19 inspected by metadata (5 research PDFs untagged, résumé tagged; images with dimensions; SVGs). `package-lock.json` (generated) and `node_modules` are excluded from line review; dependency risk is covered by `npm audit` instead.

**Method.** Each lane worker read every file with bounded sequential reads, recorded hash and disposition, and reported findings with file:line. Opus re-verified every finding acted on (source or browser) before any change. Lanes ran read-only and in parallel; there were no shared writable files.

**Post-audit changes** (`263a0e5` → `9f2a8cf` and later) were each reviewed in full by Opus and independently re-reviewed by RR-Q1. Twenty-two files were deleted: 17 dead source and test files, and 5 boilerplate SVGs.
