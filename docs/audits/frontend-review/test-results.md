# Test results

Environment: Debian13, Node24.22.1, npm11.9.0; Chromium155.0.8059.79. Final export build ID `Dfv1QQLfhv_4WAY_tllxC`, `version.json` built2026-11-03T05:58:48.112Z, source base2b6d048 plus reviewed changes. This is local, not deployed production.

Commit preparation: the staged whitespace check identified trailing terminal spaces/carriage returns and excess final blank lines in captured `.txt` logs. These formatting characters were normalised before committing; diagnostic text, results and failed attempts were preserved. All 268 reviewed source hashes still match. This documentation cleanup does not constitute a new application build or browser run.

| Command | Actual outcome |
| --- | --- |
| npm ci | Baseline and final-lock frozen installations pass; final clean-install log retained |
| npm run lint / typecheck | Both pass, zero ESLint errors/warnings |
| npm run test:ci |674 passed /51 files; early transitional run672 before last regressions is retained separately |
| npm run test:schemas |6 passed |
| npm run test:backend |17 HTTP primitive tests +56 application tests /7 files pass |
| npm run test:dependency-security |3 pass; exact source/archive/installed parity and real Next consumer guarded |
| npm run test:security |12 pass |
| npm run test:coverage |674 pass /51 files; statements88.24%, branches82.48%, functions87.52%, lines90.07% |
| Optional Go source execution |1 Node wrapper executed,4 Go tests plus4 invalid-input subcases pass; zero skips |
| npm run build |168 generated pages; static export succeeds |
| npm run audit:agents |160 sitemap routes, zero warnings |
| npm run audit:security |1072 files pass disclosure/header/redirect/private-artifact checks |
| npm run audit:production -- local preview |Passes under Wrangler4.149.0 with real _headers/_redirects; production-only www redirect intentionally not covered locally |
| npm audit --omit=dev --audit-level=high |Pass,0 advisories |
| npm audit --audit-level=high |Exit0,16 moderate entries; no high/critical. Not a clean zero-advisory claim |
| First full Chromium pass |28/28 pass;360 responsive captures,160 route/axe scans,0 violations,158 incomplete results |

Final artifact: the broad Chromium run executed 360 captures and all160 route/axe scans again, with0 violations and158 incomplete results. It passed29/30 tests; the sole failure was a test fixture that overwrote the stored appearance on reload. The fixture was corrected rather than weakening the persistence assertion. The corrected journey passed in Chromium, Firefox and WebKit.

Five current native journey cases pass in each of Chromium155, Firefox157 and WebKit27.2: reviewer navigation/window commands/résumé/contact; pointer move/resize plus search/history/locale/theme persistence; forced-colour glyph geometry and Persian font; sequential keyboard entry and five-language404 recovery; five-language keyboard search/empty/dismissal. That is15 native engine cases plus26 broad Chromium matrix cases:41 distinct accepted cases across documented runs, not a fictitious single41/41 CLI run. Browser cohorts retain their actual test-source versions and unsuccessful attempts.

WebKit's initial five HTTP-fixture cases failed because the preserved CSP upgraded every asset to HTTPS on a plain-HTTP port; the trace confirms those URLs. All five pass on the local HTTPS fixture with the same export and headers. These setup failures are not erased or reported as application passes. No full Firefox/WebKit160-route/nine-viewport matrix is claimed. Do not interpret first-pass screenshots or old October reports as all current checks. Full raw captures/results live under `artifacts/frontend-review`; compact CLI evidence is in this directory's evidence folder.

Initial failures retained: sandboxed install lacked proxy/cache writes; stale historical browser-helper locators; first glyph correction had a specificity defect; second glyph had inherited tooltip padding; an initial persistence test unconditionally overwrote its own localStorage fixture. Each was diagnosed and corrected; affected checks were rerun. No tests/assertions were disabled to obtain a pass.

Cross-engine setup: Firefox157 and WebKit27.2 downloaded with normal verification. Root installation of system libraries was unavailable. Signed distribution packages were fetched into isolated /tmp indexes and missing libraries linked into WebKit's private sys/lib. Its global ldconfig-only preflight could not detect local GLES; actual dlopen and browser launch were verified before skipping that host preflight. Registry/artifact TLS and package-integrity verification remain enabled. WebKit upgrades loopback assets because of the retained CSP; its HTTPS preview uses an ephemeral self-signed local certificate. The explicit PORTFOLIO_LOCAL_TLS flag permits certificate errors only when the configured preview origin is HTTPS loopback; remote preview configurations cannot enable this exception. This does not certify production TLS. Application security headers and assertions remain intact. Engine result scope is explicit in the final consolidated browser record.
