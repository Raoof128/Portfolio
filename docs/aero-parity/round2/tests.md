# Verification and scope

Acceptance build: `UD_vNX6v9YqmgrvZLWuY7`, generated `2026-11-03T09:25:26.070Z`, from base `b4cc49d` plus the recorded uncommitted source. The 08:12 candidate and 09:07 candidate retain their own evidence; they are not relabelled as this build. The exact application/export hashes identify the bytes beyond the unchanged HEAD token.

## Engineering environment

Debian 13; Node 24.22.1/npm 11.9.0; Next 16.4.4, React 19.2.3, Tailwind 4, 7.css 0.21.1, Vitest 4.1.12, Playwright 1.64.1, axe 4.14.0. System Chromium 155.0.8059.79; bundled Firefox 157 and WebKit 27.2. The local Wrangler 4.149.0 Pages preview serves `out/` on HTTP port 4398 and HTTPS port 4400. WebKit uses loopback HTTPS with the existing explicitly scoped self-signed-certificate exception because the preserved CSP upgrades asset requests. Production TLS/CSP is unchanged.

The environment became unavailable during the first candidate's broad browser run. That output is incomplete and is not counted as a pass. After restoration, browser concurrency was limited. A complete 32-case Chromium run passed on candidate2 (`iIwRABh8xPIUf2fpDkuDr`) before independent forced-colour review found the selected-platform defect. The final source fixes it and adds a maintained browser regression. Candidate2's passing default-state/axe results therefore do not conceal that discovered state-specific defect.

## Final engineering checks

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run build` | Pass; 168 generated routes | [build log](evidence/build.txt) |
| `npm run test:ci` | Pass; 674 tests/51 files | [unit log](evidence/unit-tests.txt) |
| `npm run lint` | Pass after evidence-file correction | [lint log](evidence/lint.txt) |
| `npm run typecheck` | Pass | [typecheck log](evidence/typecheck.txt) |
| `npm run audit:security` | Pass; 1,072 exported files | [artifact audit](evidence/artifact-security.txt) |
| `npm run audit:agents` | Pass; 160 URLs, 0 warnings | [agent audit](evidence/agent-audit.txt) |
| `npm run test:dependency-security` |3 pass | [guard log](evidence/dependency-security.txt) |
| `npm run audit:production -- http://127.0.0.1:4398` |Pass against local Pages preview | [HTTP log](evidence/preview-audit.txt) |
| PNG metric fixtures |4 pass | [image-tool log](evidence/image-diff-tests.txt) |

Final browser results are complete: Chromium **32/32**, Firefox/WebKit **12/12**, no failures, skips or retries. [Chromium summary](evidence/chromium-summary.json), [native engine summary](evidence/native-summary.json). Chromium recorded 360 responsive observations with zero horizontal overflow and 160 route/axe scans with zero violations. There are 158 incomplete colour-contrast groups, retained with their targets in [route observations](evidence/route-observations.json); automated incompleteness is not rewritten as a pass.

Additional actual final checks: all four app/system forced palettes preserve the selected evidence label and terminal text; all ten locale/theme 404 cases retain HTTP 404, recovery links, correct language/direction, CSP and 320px reflow. Seven final terminal cases (five locales, themes, narrow widths and forced colours) copied the exact commands, with no page/terminal overflow or page errors. Four no-JavaScript Close states match native material/geometry properties and its real link returns home. The resized tooltip is visible, hoverable and Escape-dismissable. [Independent final source/palette review](evidence/source-review.md), [terminal](evidence/terminal-final.json), [no-JavaScript Close](evidence/nojs-close-final.json), [resize tooltip](evidence/resize-final.json).

Accepted expanded visual results are in the [paired-comparison report](parity.md); the [coverage ledger](coverage.md) explains the census scope. No dependency or lockfile changed in this pass. Prior backend/coverage/registry audit results remain historical in the first frontend review; the 16 moderate lint-tool advisories are not silently resolved.

## Native workflow coverage

The maintained six journey cases cover direct routes, window actions/geometry, actual forward/reverse Tab exit, meaningful entry focus, history, search and empty results in five languages, locale/theme persistence, résumé PDF bytes, contact links, welcome entry, five-language 404 recovery, preference modes, forced-colour caption glyphs/Atlas/breadcrumb, and now the actual evidence-platform selected label.

Chromium's broader matrix adds nine viewport sizes × five locales × two appearances × four destinations: 360 responsive observations/captures. Its 16 sitemap chunks scan 160 routes with axe. Captures are evidence, not automatically approved goldens. A completed matrix does not mean a reviewer visually inspected every image. Representative final images and targeted states are inspected separately.

## Recovered and independently checked evidence

Before the disconnect, candidate1 completed 60 spacing pages (40 desktop+20 touch), 488 changed-control observations, 0 spacing conflicts and 0 horizontal overflow. The helper checks 24px centre circles against other interactive rectangles/circles for undersized targets. Touch targets remain at least 44px. Ten locale/theme behaviour cases and 72 control-style records also completed; their recovered JSON and script provenance are kept separate. The later focus/palette/toolbar-ink changes do not alter their measured dimensions; actual final style/state checks remain separate.

The expanded paired comparisons distinguish real pointer/focus operations in isolated specimens from synthetic disabled/inactive style states and from full React workflows. The census counts rendered instances across 15 captured English/light scenes, not unique controls, full accessible names, occlusion, or individual activation of every instance. Closed native disclosures are excluded. Research artwork and desktop extensions without a canonical 7.css counterpart cannot receive a fabricated pixel-parity score.

## Failures and limitations retained

- The environment disconnect interrupted a broad run and a partial snapshot; both remain preserved and unaccepted.
- A selected-platform focus-specificity defect was fixed after candidate1. Independent candidate2 review then found its forced-colour label failure in all four app/system palette combinations; raw failure and injected diagnostic captures remain separate from final compiled proof.
- Lint caught CommonJS scratch helpers copied as executable evidence. They were preserved as `.cjs.txt` forensic text with updated provenance; no lint rule was disabled.
- Expanded harness review corrected a groupbox font context and excluded closed-disclosure links from the census. Earlier results remain backed up with revision provenance.
- Pixel comparisons use the same Linux Chromium/font/DPR conditions. They do not certify native Windows rasterisation, native popup rendering across platforms or physical assistive technology.
- Loopback navigation LCP/CLS samples are early diagnostic observations; field p75/INP and production deployment are unverified. A local HTTP audit cannot establish current production bytes.

## Bounded performance observations

The final route sweep's early navigation samples had median LCP 552ms, maximum 1,532ms, and maximum sampled CLS 0.09985. The responsive sweep had median LCP 392ms, maximum 1,504ms, and maximum sampled CLS 0.06071. These unthrottled loopback samples include concurrent tests, early observation stops and zero LCP entries before the observer yielded. They are diagnostics, not complete laboratory load tests or representative user-percentile results. INP and field p75 were not measured. [Raw observation summary](evidence/chromium-summary.json).
