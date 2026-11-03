# Browser and engineering checks

Final application artifact: **`xfHy_bhVfJKii-CA72D9U`**, built **2026-11-03T07:23:07.345Z**, checkpoint `b4cc49d` plus the working-tree application changes. All 23 changed application/style/test hashes remained unchanged after that build. Test-only fixture/mask/guard refinements are recorded separately. The export manifest covers 1,072 files.

## Environment and commands

Debian 13, Node 24.22.1, npm 11.9.0, Next 16.4.4, React 19.2.3, Tailwind 4, 7.css 0.21.1, Vitest 4.1.12, Playwright 1.64.1 and axe 4.14.0. Chromium 155.0.8059.79 uses `/usr/bin/chromium`; bundled Firefox 157 and WebKit 27.2 use the installed Playwright engines.

Wrangler 4.149.0 serves the exact `out/` on HTTP loopback port 4398 and HTTPS loopback 4400. WebKit uses HTTPS because the preserved CSP upgrades asset requests. The certificate exception is restricted by Playwright configuration to opted-in HTTPS loopback. Isolated WebKit libraries are available through the local runtime; `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` avoids a host preflight that does not see those libraries. Actual WebKit launch and journeys succeeded. No production security policy was relaxed.

| Check | Actual result | Evidence |
| --- | --- | --- |
| `npm run lint` | Pass, zero reported warnings/errors | [log](evidence/lint.txt) |
| `npm run typecheck` | Pass | [log](evidence/typecheck.txt) |
| `npm run test:ci` | 51 files, 674 tests pass | [log](evidence/unit-tests.txt) |
| `npm run test:schemas` | 6 pass | [log](evidence/schema-tests.txt) |
| `npm run test:dependency-security` | 3 pass | [log](evidence/dependency-security.txt) |
| `npm run test:security` | 12 pass | [log](evidence/security-tests.txt) |
| `node --test scripts/browser-regressions/aero-parity/png-diff.test.mjs` | 4 pass | [log](evidence/image-diff-tests.txt) |
| `npm run build` | Pass, 168 generated routes | [log](evidence/build.txt) |
| `npm run audit:agents` | 160 sitemap routes, zero warnings | [log](evidence/agent-audit.txt) |
| `npm run audit:security` | Pass, 1,072 files | [log](evidence/artifact-security.txt) |
| `npm run audit:production -- http://127.0.0.1:4398` | Pass against local Pages preview; production-only www redirect not tested | [log](evidence/preview-audit.txt) |
| Full Chromium Playwright project | 32 pass; zero failures/skips/retries | [summary](evidence/chromium-summary.json), [log](evidence/chromium-tests.txt) |
| Corrected preference fixture, Chromium rerun | 1 pass on unchanged final export | [summary](evidence/chromium-preference-verified.json) |
| Final Firefox/WebKit native journeys, one worker | 12 pass; zero failures/skips/retries | [summary](evidence/final-native-single-worker.json) |
| Controlled image comparison | 56 valid state pairs per baseline/final phase; 2 negative snapshot guards pass | [matrix](visual-parity-matrix.md) |

Reproduction: `PORTFOLIO_CHROMIUM_PATH=/usr/bin/chromium node node_modules/@playwright/test/cli.js test --project=chromium`. For Firefox/WebKit use `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 PORTFOLIO_PREVIEW_ORIGIN=https://127.0.0.1:4400 PORTFOLIO_LOCAL_TLS=1 node node_modules/@playwright/test/cli.js test --project=firefox --project=webkit --grep 'reviewer journey|pointer geometry|forced colours|keyboard workspace|five-language keyboard|increased contrast' --workers=1`. Use a separate reporter/output path when preserving previous evidence.

The earlier checkpoint's frozen installation, backend, coverage and registry-audit runs remain identified in [the previous test report](../audits/frontend-review/test-results.md); they are not newly rerun results. No package or lockfile changed in this pass. Earlier runtime audit had zero advisories; the full graph retained 16 moderate lint-tool entries, with high-threshold gates passing.

## Native browser scope

Each engine's six journeys exercise direct Projects loading; filter state; minimise/restore/maximise; keyboard move/resize with forward/reverse Tab exit and Done focus; taskbar navigation; meaningful window-entry focus; history; search selection/dismissal/empty results in five languages; résumé PDF bytes; contact links; drag/resize geometry; language and theme persistence; opaque preference modes; forced-colour glyphs/Atlas/breadcrumb; welcome entry; and five-language 404 recovery.

The Chromium responsive matrix executes four destinations (`/`, `/projects`, `/lab/001`, `/contact`) at all nine requested viewport sizes in five languages and two appearances: **360 observations/captures**. It asserts no horizontal page overflow, duplicate IDs or broken completed images, and one visible main landmark. It does not claim all 360 captures were visually inspected individually. Representative mobile, RTL, desktop, short and theme captures were inspected separately. Taskbar lane checks also exercised all five pins at fine/coarse sizes.

The same export's **160 sitemap destinations** loaded successfully and reported **zero axe violations**. There were **158 incomplete colour-contrast result groups**, requiring manual interpretation rather than suppression. [Route observations](evidence/route-observations.json) retain their node targets; [responsive observations](evidence/responsive-observations.json) retain viewport geometry and sampled metrics.

## Failures and corrections retained

- Candidate 2's broad matrix was intentionally interrupted after an independently reproduced RTL selector defect required a new export: 2 passed, 2 interrupted, 22 unrun. That attempt is not a pass. The final matrix above supersedes it.
- The sandboxed dependency guard initially could not run subprocess checks; the unchanged three tests passed with authorised subprocess access.
- Initial final-artifact Firefox/WebKit run: **10 passed, 2 failed** ([record](evidence/final-cross-engine.json)). Firefox's contrast emulation reset on navigation and left CSS media evaluation stale; a bare fixture proved it independent of application CSS. The fixture now navigates first, asserts `matchMedia`, invalidates Firefox's stale evaluation with a one-pixel viewport change, and restores the viewport. The opacity/blur assertions are unchanged. [Minimal reproduction](evidence/firefox-contrast-emulation.json); [isolated pass](evidence/firefox-contrast-rerun.json).
- WebKit timed out waiting for a caption click to stabilise during the concurrent run. The unchanged journey passed in isolation ([record](evidence/webkit-reviewer-isolated.json)) and again in the final single-worker 12-case run. No reproducible application cause was found; resource contention is a plausible explanation, not proven fact. The initial trace remains in `artifacts/aero-parity/cross-engine-results/`.
- One attempted isolated grep included an incorrect leading anchor and selected no tests. A subsequent Chromium fixture check initially omitted the configured system-browser path and failed before launch. Neither is counted as executed passing coverage; corrected invocations are retained under `artifacts/aero-parity/validation/`.
- Independent evidence review found an overwrite guard after writes and an overbroad mask. Both were corrected; hash-preservation checks and independent PNG calibration passed. [Review](evidence/harness-independent-review.md).

## Performance observations, not field certification

The route sweep recorded navigation-time samples on this unthrottled loopback host, with concurrent tests and early observation stops. Across 160 routes the sampled LCP median was 604ms, maximum 1,508ms; sampled CLS maximum was 0.09910. Across the 360 responsive observations LCP median was 528ms, maximum 2,156ms; sampled CLS maximum was 0.06071. Some LCP samples were zero because the observer had not produced an entry before sampling. These are diagnostic observations, not complete lab load tests or representative user percentiles. INP and field p75 were not measured.

The frozen Projects snapshot's eight loaded stylesheet texts fell from 333,179 to 315,501 bytes (17,678 bytes, about 5.3%). This is decoded CSS text, not compressed transfer size or a demonstrated timing improvement. No unsupported speed claim is made.
