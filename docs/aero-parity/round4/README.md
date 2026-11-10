# Fourth parity pass (10 Nov 2026)

**Result: 87 of 134 controlled states match canonical `7.css@0.21.1`** (85 pixel-exact, 2 within the measured 1/255 noise band), up from 61 at the start of this pass, with no state worse. A literal 134/134 is not reachable without removing accessibility protections or research content; the 47 remaining states are itemised below, not hidden.

- Base: `a035858` (`main` after the round-3 and reviewer-readiness merge). Final: `7702670`, export built `2026-11-10T07:13:40Z`.
- Method and tolerance are unchanged from [round 3](../round3/parity-matrix.md): real exported markup against the unmodified scoped stylesheet, Chromium 153, 1440×900, DPR 1.
- Per-state results: [evidence/classification.tsv](evidence/classification.tsv).
- Orchestrator: Claude Fable 5.2. Workers: four `claude-haiku-5-5` agents (three implementers with disjoint file leases, one independent reviewer), each self-reporting its model.

## What changed

| Area | Root cause (measured) | Fix | Now exact |
| --- | --- | --- | --- |
| Toolbar Copy Link / Full Screen | A hand-copied skin painted hover and press directly and replaced the focus ring | Native buttons take `.win7 button` paint | hover, pressed, focus |
| Toolbar Back, Move and Resize | Same skin; the `summary` still carried the details triangle box | Canonical overlay mechanism (`::before` hover, `::after` pressed), dotted focus | hover, pressed, focus |
| Evidence platform picker | Selected state painted on the element | 7.css's own `active` class | selected default, focus |
| Proof Atlas selectors | 30px, 14px labels, custom pressed paint, equal-width columns | Canonical geometry, `active`, intrinsic width on wide fine-pointer layouts | all 6 states |
| Focus inside windows | A global two-tone ring outranked the canonical dotted ring on every native button | Canonical ring for native buttons and unselected tabs in windows | tabs focus (tolerance) |
| Disabled fields | Preflight `color: inherit`; window bodies re-pointed `--w7-surface` to white; the 3:1 resting border also applied to disabled | Canonical surface and UA ink (tokens); border scoped to enabled | 3 contact fields, taskbar search |
| Placeholders | Preflight replaces the UA placeholder ink with 50% of the text colour | Placeholder token for every field in the scope | field hover (3) |
| Text-field focus | App added a dotted ring inside the field | Canonical blue edge and caret | 4 states |

## The 47 states that still differ

| Group | States | Why it stays |
| --- | ---: | --- |
| Caption buttons, keyboard focus | 4 | 7.css draws **no** focus indicator (`outline: none`). Matching it would fail WCAG 2.4.7 |
| Search fields, focus (Projects, Write-ups, taskbar) | 3 | 7.css draws no focus indicator and no border change |
| Text-field resting border | 4 | 7.css's `#abadb3` edge is about 2.2:1 on white; the app keeps `#8e8f8f` (3.2:1) for WCAG 1.4.11 |
| Taskbar search hover | 1 | The reference shows the browser's native clear "×"; the app has its own labelled clear button, so the native one stays hidden |
| Icon buttons (document action, copy address, terminal copy, window step buttons) | 17 | 7.css defines no icon layout. The reference is a bare button with the same SVG dropped inline; face, border and geometry follow canonical |
| Simurgh station cards | 6 | Numbered research-diagram cards, not push buttons |
| Window and title bar (reading window, 404) | 5 | Frame geometry matches (404 chrome mask: 0 px; reading window: 95 px from the app icon's glow). The remainder is the app icon, title text and page content |
| Research tables | 2 | Document tables at 14px reading size, not the 9pt list view |
| Scrollbar | 4 | Same native scrollbar; thumb proportions differ because the reading body keeps 44px bottom clearance and a white surface |
| Group box body | 1 | Legend matches; the body is the popover's own hint text |

## Verification on `7702670`

- Parity harness: 85 exact + 2 tolerance, 0 worse than baseline.
- Unit tests 753/753; lint and typecheck clean; static artifact, agent and local production audits pass.
- Chromium Playwright 79/79. Ten cases in `project-content.spec.ts` were already failing on `main` since `030e261` made the Invisible Window repository private; the test now asserts the private-repository behaviour.
- Independent review (Haiku): no P0–P2 defects; every tabbed control shows a visible focus indicator in light and Night; 44px touch targets and no overflow at 390×844; RTL toolbars mirror. Its one P3 (disabled ink in Night) is fixed.
- Not verified: Firefox, WebKit, real devices, screen readers. Not deployed.

## Owner note

Text fields now focus the canonical way (blue edge and caret, no ring). That reverses an earlier choice to add a dotted ring. It still satisfies WCAG 2.4.7, but if you prefer the stronger ring, restore the two `outline` lines in `src/components/os/win7-pages.css` (`.os-support :is(input, textarea)…:focus-visible`).
