# Project overlay reconciliation

All 13 canonical projects are reconciled across Persian, Arabic, Spanish and Chinese. Canonical SHA-256: `42ec417598cd6dc1a7c806264fd78eb0dd5c010e222c53314c55724d61969065`. Only the four project-overlay source files were edited. Paper titles, DOI, href and ordering remain inherited from canonical data.

The translations retain current/frozen study distinctions, source-reporting qualifiers, failed/skipped/open results, roadmap status, scoped benchmarks, deployment dependencies and privacy limitations. Independent Spanish and Chinese reviews found no material errors.

Validation: 30/30 maintained localization tests; four-file ESLint and whitespace checks passed. Underlying project test and benchmark receipts were not rerun; this lane ran no build or browser suite. Exact per-project array/paper coverage, read spans and hashes are in the JSON ledger and locale reports.

- `src/lib/project-content/fa.ts` (546 lines): `473df0748e5fe47301e41cdb0f62ac04ba553cbbbc141c6c6d1c05186c8ce6e7`
- `src/lib/project-content/ar.ts` (494 lines): `10ef607b1bfd5ef9e1318c63ab81456aed79abf105a58369698de0d098b04ef0`
- `src/lib/project-content/es.ts` (575 lines): `66d674199a97de1e44cb4248a7ef95223eca4726d36e464e8324af0139359649`
- `src/lib/project-content/zh.ts` (580 lines): `856f76e7ad64ab8c56e3873e2851ed015615d52050f54355befc09a7d6e4c37d`
