# UI/layout full source audit

Reviewed all **36 assigned files / 6,518 initial lines**, including dormant code and tests. The exact per-file initial read spans, initial/final SHA-256, mount classification, notes and new-test identity are in `ui-review.json`. No child reads are counted; this lane personally read every assigned line. Changed final code was reviewed against the fully read source and the complete patch. One new 58-line test was fully read.

## Confirmed findings and corrections

| ID | Priority / actual use | Original location | Reproduction and result |
| --- | --- | --- | --- |
| UI-01 | P2, mounted Contact | `SecureContactForm.tsx:410` | The baseline exported `<form noValidate="" class="os-secure-form">` lacked action/method. With JS disabled, ordinary submit defaults to a GET at the current contact URL with entered fields. Corrected to localized native `mailto:` POST / `text/plain`; required/email validation stays native until hydration; five-language `<noscript>` instructions include a plain email link. The standalone script-only copy button is disabled until hydration. Current CSP already permits mailto, so headers unchanged. |
| UI-02 | P3, dormant language control | `LanguageSwitcher.tsx:43` | Both dormant desktop/mobile instances used `language-menu`; menu/menuitem roles had no corresponding menu keyboard implementation. Replaced with unique disclosure IDs and ordinary language navigation links; Escape restores toggle focus, leaving focus closes without stealing focus. |
| UI-03 | P3, dormant Navbar | `Navbar.tsx:120` | The mobile popup used one fixed ID and had no Escape restoration. Added per-instance ID and Escape close/focus return. |
| UI-04 | P3, dormant project card | `ProjectCard.tsx:45` | Repeated/sanitized titles collided; ARIA tabs lacked roving focus and navigation keys. Added unique IDs, one tab stop, Arrow/Home/End focus and activation, and focusable panel. |

The dormant fixes are library-level regressions demonstrated by independent component tests. They are **not** presented as active ResearchOS route defects.

## Complete-scope observations

- `MotionPreferences` is mounted by the locale layout. `SimpleMarkdown` is mounted by write-up detail. Contact mounts the form and copy control. Shared surface CSS is mounted by markdown/artwork.
- All 13 original artwork components are lazy mounted through `project-artwork.ts` by project previews/dossiers. SVG source/IDs/filters/styles, canvas geometry/drawing code, active-state effects and teardown were fully read. Original artwork bytes remain unchanged.
- SVG artwork uses unique IDs, decorative hidden semantics and explicit reduced-motion rules. Canvas playback stops while inactive, offscreen, document-hidden or under reduced motion, redraws a still on resize/context restoration, and disconnects observers/listeners on disposal. Existing lifecycle tests cover these paths; no reproduced artwork defect found in this scope.
- Footer, Navbar, LanguageSwitcher, AnimatedSection, Card, GlowCard, HUDFrame, NeonButton and ProjectCard have no production import path from the current ResearchOS routes (some depend on one another or are covered by tests). Their legacy visual design was not remounted or restyled.
- Markdown links reject executable schemes/authority paths; authored markup remains React text, code/table overflow regions are named keyboard targets, lists retain semantics, RTL prose and LTR code stay isolated. Parser is intentionally limited; no unsupported broad Markdown claim added.

## Verification

`npx vitest run src/components/layout/LanguageSwitcher.test.tsx src/components/layout/Navbar.test.tsx src/components/ui/ProjectCard.test.tsx src/components/ui/SecureContactForm.test.tsx src/components/ui/canvas-playback.test.tsx src/components/ui/SimpleMarkdown.test.tsx src/components/ui/NeonButton.test.tsx src/components/ui/Card.test.tsx src/components/layout/Footer.test.tsx`

**9 files / 103 tests passed** in 12.68s. Log: `ui-tests-final.log`. Final run has no errors/warnings. `git diff --check -- src/components/layout src/components/ui` passes. Edited TSX formatted with Prettier. The first test attempt exposed one new focus-out test missing React `act`; the harness was corrected and the failed run retained as `ui-tests.log`.

Parent owns the final exact-export build and browser checks. Requested no-JS native browser sequence: empty Contact submit retains the URL/focuses a required field; then enter all three fields and submit while recording requests, confirming no same-origin document request containing the draft. Native mail application opening/delivery remains unverified in a headless environment. No broad browser, build, dependency, deployment, root-log or original public-asset changes were made by this lane.

## Additional confirmed viewport correction

**UI-05 — P2, mounted Contact.** Parent native keyboard entry at 390×844 focused Message at top691.7/bottom789.7; shrinking to390×360 left the field there while the dock started at308. The scoped form fix listens to window and VisualViewport resizing, coalesces work in requestAnimationFrame and only reveals the currently focused out-of-bounds field. It keeps focus, respects dock/visual viewport bounds, corrects remaining software-keyboard offset through the reading/document scroller, and removes both listeners/queued work on unmount. It does not scroll visible fields or unfocused content.

Final Contact-focused suite: **30/30 tests**, including four new coalescing/visual-viewport/no-unfocused-scroll/cleanup cases, in1.98s (`ui-viewport-tests.log`). Targeted ESLint passes without warnings (`ui-tooling-lint.log`). Native final-candidate verification remains parent-owned; initial complete UI suite103/103 was run before this extra scoped correction. Final form/test hashes and the native baseline pointer are updated in `ui-review.json`.

## Independent native no-JS handoff probe

On compiled build `7ZXmp772g5T8B_eREKvhm`, a separate headless Chromium context with scripting disabled submitted the filled native Contact form. CDP reported `frameRequestedNavigation` with reason `formSubmissionPost`, disposition `currentTab`, and a `mailto:` URI containing the localized subject and correctly encoded fixture draft body. No HTTP navigation containing the draft followed. With no working external mail handler in this environment, the browser then reached `chrome-error://chromewebdata/`. Evidence: `ui-nojs-mailto-probe.json`.

This demonstrates the repaired native handoff rather than same-origin GET submission. It does not prove an external application launched or a message was sent. The browser fixture's unchanged-URL/retained-fields assertion after valid native submit assumes a working handler and should be replaced by mailto-attempt proof plus no HTTP draft navigation, allowing the original URL or the internal browser failure state. A separate diagnostic-only `_blank` target preserved the original draft but opened an error tab; no product target change was made.
