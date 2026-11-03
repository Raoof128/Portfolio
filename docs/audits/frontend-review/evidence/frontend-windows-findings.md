# Window and shell review — 3 November 2026 (Australia/Sydney)

Baseline: `2b6d048c42c7feb7ef82e38f5ca519603d40afc6`. Final per-file hashes are in `frontend-windows-coverage.json`. The lane read 31 source/test files entirely in bounded sequential chunks. This is source and unit/integration evidence; browser/visual verification is performed by the root workflow.

## WIN-01 — Decorative entry implies authentication (P2 / medium)

- Affected route: home/welcome, five locales.
- Source: `src/components/os/WelcomeEnter.tsx:26–33,74–87,280–284`.
- Observed: English caption says “Sign in”; translated captions likewise refer to login. No account or authentication exists.
- Expected: the action identifies entering the portfolio workspace while retaining Aero logon styling.
- Reproduce: fresh browser session, visit home and inspect visible orb caption and accessible name.
- Root cause: literal authentication copy in the dedicated caption table.
- Correction: “Enter workspace” and equivalent basic workspace-entry wording in each supported locale; visible label remains the start of the accessible name. Loader, skip links, direct project/résumé access and reduced-motion behavior are preserved.
- Verification: existing label-in-name expectation was changed and failed before source modification (`frontend-welcome-red.log`: 1 failure / 9 pass). Final parameterized assertions cover all five captions alongside loader/cancellation/focus tests.
- Result: unit regression passes; longer-label visual wrapping requires root browser evidence.

## WIN-02 — Copy fallback leaks the previous page address (P2 / medium)

- Affected: any navigation between pages within the persistent reading frame.
- Source: `src/components/os/WorkspaceWindows.tsx:229–269,350–358,467–493`.
- Observed: a failed Copy Link leaves its read-only old URL visible after navigating to another page. A late clipboard success/failure can publish feedback into the replacement document.
- Expected: copy feedback belongs to the document on which it was requested.
- Reproduce: deny clipboard; Copy Link on Project Simurgh; navigate to About without closing the window. Old project address remained. Alternatively hold a clipboard promise pending, navigate, then reject it.
- Root cause: frame survives navigation but copy state/timers/promise completion were scoped only to component lifetime.
- Correction: clear share URL/status and copied state when descriptor.id changes; cancel timers in per-document layout cleanup; accept clipboard completion only for the latest request token. Unmount protection remains.
- Verification: two deterministic regressions failed before correction (`frontend-windows-red.log`: 2 fail / 6 pass), then 8/8 passed (`frontend-windows-green.log`). Final coverage additionally checks both late success and late failure.
- Result: fixed by regression evidence; no broad frame remount or loss of geometry.

## WIN-03 — Desktop caption actions do not name their window (P2 / medium)

- Affected: unlocked desktop Introduction and Proof Atlas.
- Source: `src/components/os/Desktop.tsx:59–101,269–276,310–319`; new `Desktop.test.tsx`.
- Observed: two sets of controls exposed duplicate names “Minimise”, “Full Size”, “Close”, unlike the contextual reading-window controls.
- Expected: a user browsing controls can identify the window each command affects.
- Reproduce: inspect accessible button names on desktop; both Close buttons were identical.
- Root cause: shared local caption receives labels but not title context.
- Correction: pass the actual localized window heading and append it to all three accessible control names. Glyphs, state and geometry are unchanged.
- Verification: regression failed before source modification (`frontend-desktop-red.log`: 1 fail); now asserts both caption groups plus hide-to-restore-button and restore-to-heading focus.
- Result: verified in unit/integration test; native screen reader testing remains separate.

## WIN-04 — Old exit callback acts after navigation replaces the document (P1 / high)

- Affected: rapid close/minimise then navigation within the 180ms exit fallback.
- Source: `src/components/os/WorkspaceWindows.tsx:350–358,383–407,638–645,670–677`.
- Observed: the previous document’s queued close/minimise callback still executes after descriptor.id changes. A stale close closure can route away from the newly selected document.
- Expected: navigating interrupts exit work belonging to the replaced document.
- Reproduce: click Close or Minimise with ordinary motion; before 180ms navigate to another registered document in the same frame; advance timer. Old actions executed.
- Root cause: navigation cleared the visible leaving state but retained leaveDone/leaveTimer.
- Correction: per-document layout cleanup invalidates the pending exit function and cancels its fallback timer. Normal reduced-motion behavior remains immediate.
- Verification: deterministic fake-time close and minimise cases both failed before correction (`frontend-window-exit-red.log`: 2 fail / 9 pass). Final complete lane run is `frontend-windows-suite-final.log`.
- Result: fixed by regression evidence.

## Historical findings reconciled by current source and tests

- Window activation/new document focuses the document heading; restore-at-load does not steal initial focus. Per-window controls are already named on reading windows; WIN-03 was limited to the desktop captions.
- Native modal search is separate from modeless reading windows. Search restores launcher focus, supports IME input, arrow/Enter navigation, first-Escape dismissal, scope filtering and localized result semantics. Ordinary windows have no modal trap.
- The dock strip already scrolls and exposes overflow fade cues; active pins scroll into view. A scrollbar is not proof every narrow-screen target fits; root browser testing owns that determination.
- Minimize retains the current document via React Activity; navigation disposes prior page drafts. Exactly one route-backed window is intentional and tested.
- Pointer capture is interrupted on route change, viewport changes, deactivation, blur, cancellation and unmount; keyboard movement/resize and step alternatives exist. Finite geometry clamps reserve taskbar/footer bounds and survive restore.
- Home can be bypassed by direct content URLs and visible project/résumé links. Same-session reload skips decorative entry; intentional Lock can return to its prior page. The skippable owner-approved first entry animation is retained.
- Parent-link Back behavior is documented and retained; browser Back/Forward remains a separate navigation capability.

## Deliberately retained limits

No universal accessibility compliance or pixel-perfect fidelity claim follows from jsdom tests. Long localized labels, real pointer geometry, native dialog focus, browser history, 200/400% reflow, reduced transparency/forced colors and real assistive technologies require the root browser/manual matrix. External factual research content was not rewritten.
