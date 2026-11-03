# Independent browser-suite review

Read the full playwright.config.ts and portfolio.spec.ts, then checked selectors against actual Desktop, ResearchOS, WorkspaceWindows and window-copy sources. No parallel browser runner was started.

Confirmed initial runner defects: the maximize locator targeted .is-maximize, which changes to .is-restore; the stable .os-expand now fixes this. The command disclosure is native summary (Chromium accessibility snapshot calls it generic), so querying a button role was not reliable; the current .os-window-controls > summary locator fixes that. Movement's accessible name is Down, not Move down; current scoped locator fixes it. Performance initialization did not cause the observed hang: the failure trace recorded document.fonts.ready resolving within 36 ms. Shared-output ENOENT errors are consistent with overlapping runners removing each other's reporter/trace files; run one Playwright process at a time.

Scope caveats passed to root: responsive tests make 36 captures each under a 120s budget, mainCount is collected without an assertion, current CLS arithmetic is a cumulative sum rather than the official max-session-window metric, and initial journeys did not select/filter empty search results or switch locale through the UI, close/drag/reload/forward. Root owns extending these concrete journeys and recording measured limits.

The two CUA helpers were read entirely. Both assert the obsolete multiple-retained-app architecture, stale accessible names and old .os-open-windows selector. A prominent deprecation header now warns that they are historical evidence and points to the maintained Playwright suite. Assertions are preserved as historical source, never relabelled as current passes.

The three contrast/token tests were read entirely. They remain useful static checks of retained source token pairs and raw-literal budgets. They do not model the whole rendered Win7 CSS cascade, translucent background sampling, every locale font or WCAG compliance; browser evidence is still required.


## Final source review after expanded journeys

The final 255+ line suite and 32-line configuration were fully reread. Current root source resolves the originally reported stable maximize locator, native summary selector and Down action name issues. New journeys test real pointer drag/resize bounds, theme toggle plus reload, search empty results and selection, browser Back/Forward, UI locale switch to the matching Persian dossier, close to the localized desktop, sequential Tab-to-entry, and five localized 404 recovery documents. These selectors were cross-checked against ResearchOS, WorkspaceWindows, window-copy and GlobalNotFoundContent. The recovery links are specifically scoped to `.global-not-found-actions` to avoid duplicate destination links in the recovery navigation.

Independent review caught an additional test bug: an unconditional addInitScript theme seed would reset Light to Dark on every reload. Root corrected this to seed only missing storage, allowing the test to measure actual persistence. Independent review also corrected the CLS observer algorithm: the current source starts sessions on the first eligible shift, combines shifts only within a <1s gap and <5s session, and keeps the largest session. Unsupported LCP/CLS now remain null, preventing unavailable Firefox/WebKit metrics from appearing as measured zero. These were test/evidence corrections; no application code was altered by this independent review.

Responsive mainCount is now asserted, rather than merely observed. Forced-colour coverage inspects close-glyph before/after widths, zero padding and opposing transforms in addition to border strokes, exposing the two-stroke X geometry directly. Final execution and screenshot conclusions remain root-owned; the review did not start a second Playwright process or reuse historic CUA passes.

Remaining scope limits: locale UI switching is exercised from English to Persian, while other locale rendering is covered by the direct-load matrix; this is not every cross-locale switch. Scope-filter buttons and every artwork/motion state are not all exercised by native journeys. Screenshot attachments are inspection artifacts rather than approved screenshot assertion goldens. Lab metric samples are not field p75 CWV evidence or INP measurements. These limits must remain explicit in the release verdict.
