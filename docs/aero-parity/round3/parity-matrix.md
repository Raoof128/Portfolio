# Third-pass parity matrix

Environment for every row: Chromium 153.0.8010.12 headless, Linux, 1440×900, DPR 1, zoom 1, reduced motion, light appearance, same frozen font data for reference and candidate. Reference: unchanged `7.css@0.21.1` `dist/7.scoped.css`. Harness: `scripts/browser-regressions/aero-parity/{snapshot,compare}.mjs --expanded` (134 state pairs, 38 actual specimens). Raw data: `artifacts/aero-parity/r3-baseline/` and `r3-final/` (ignored; `r3-candidate1/2` are intermediate); per-pair classification is kept in [classification.tsv](evidence/classification.tsv).

## Tolerance, set before classification

Capture-to-capture noise was measured by comparing all 268 reference and candidate images from two runs with identical CSS. Only focus captures changed: at most 10 pixels, maximum channel delta **1/255**, in reference images as well as candidates. **Declared tolerance: maximum channel delta ≤ 1/255.** Pairs are labelled MATCH WITH DECLARED TOLERANCE only under that bound, and their raw counts are still reported. No mask was widened.

## Summary

| Result | Baseline (HEAD `38842e2`) | Final candidate |
| --- | ---: | ---: |
| EXACT MATCH (0 differing pixels) | 40 | **60** |
| MATCH WITH DECLARED TOLERANCE (Δ ≤ 1/255) | 0 | **1** |
| Remaining pairs (classified below) | 94 | 73 |
| Pairs with more >16/255 pixels than baseline | — | **0** |

Control: the round-2 commit `8b7907c`, rebuilt and measured in the same browser, scores 39 exact. Round 2's published 50 came from Chromium 155. These counts describe this sample of 134 states only and are not a whole-site percentage.

## Matrix

| Component | States | Result | Evidence (final exact / >16 px) | Deviation |
| --- | --- | --- | --- | --- |
| Caption group, minimise, maximise, restore, close | default, hover, pressed, disabled, inactive | EXACT MATCH | 0/0 in all 23 non-focus states | — |
| Caption buttons | keyboard focus | INTENTIONAL ADAPTATION | 144–227 px | Static 2px focus ring for visibility and forced colours |
| Window frame (projects reading window) | default, inactive | INTENTIONAL ADAPTATION | chrome mask 95 px >16 of sampled frame | App title icon and its glow; body is portfolio content |
| 404 message-box frame / title bar | default | EXACT MATCH (chrome mask; title crop) | mask 0; title 0/0 | Body content differs by design |
| Native selects (Projects, Write-ups, 404) | default, hover, focus, disabled | **EXACT MATCH** | 0/0 ×12 | Fixed R3-01 (was 1,130 px) |
| Search fields (Projects, Write-ups) | default, hover, disabled | **EXACT MATCH** | 0/0 ×6 | Fixed R3-04 (was 299 px) |
| Search fields | focus | INTENTIONAL ADAPTATION | 1,676 px | Visible focus ring |
| Taskbar search | default / hover / disabled | EXACT / INTENTIONAL ADAPTATION / NOT APPLICABLE | 0 / 40 / 187 px | Native "×" hidden deliberately; disabled state never rendered. Placeholder ink now canonical (R3-12) |
| Dossier tabs | hover, pressed | **EXACT MATCH** | 0/0 | Fixed R3-02 |
| Dossier tabs | default | MATCH WITH DECLARED TOLERANCE | 135 px, max Δ 1 | Gradient rounding on a 3px wider fluid strip |
| Dossier tabs | focus | INTENTIONAL ADAPTATION | 614 px | Focus ring |
| Push button / command button | default, disabled | EXACT MATCH | 0/0 | — |
| Command button | hover, pressed | FAIL (P3) | 12 px / 7 px, max Δ 8, none >16 | Sub-pixel antialiasing on face; unresolved |
| Contact Submit, 404 action | default, hover, pressed | **EXACT MATCH** | 0/0 | Fixed R3-03 (was 310 / 242 px) |
| Contact Submit, 404 action | focus | EXACT MATCH | 0/0 in the final run (10 / 5 px at Δ 1 in candidate 2, inside the measured noise band) | — |
| Icon links (document action, copy address, terminal copy) | all | PORTFOLIO EXTENSION | 479–722 px | Flex-centred SVG icons (7.css defines no icon layout); faces, borders and geometry follow canonical. Border regression fixed (R3-03) |
| Evidence toggle | default, hover, pressed, focus | EXACT MATCH | 0/0 | — |
| Evidence toggle (selected) | default, focus | INTENTIONAL ADAPTATION | 6 / 479 px | Persistent selection latches the pressed face |
| Window disclosure (`summary`) | default / hover, pressed | EXACT / FAIL (P3) | 0 / 14, 278 px | Pressed border on `summary` slightly differs; unresolved |
| Group box | default | INTENTIONAL ADAPTATION (body) | 1,039 px (was 1,618) | Legend fixed R3-05; remaining difference is popover body text |
| Text boxes, email, textarea, invalid | all | INTENTIONAL ADAPTATION | 330–849 px | Darker resting border for 3:1 non-text contrast; focus ring |
| Research table header/cell | default | INTENTIONAL ADAPTATION | 394 / 794 px | 14px research reading type |
| Scrollbar | default, scrolled, hover, held | INTENTIONAL ADAPTATION | 100–201 px | 44px reading clearance and paper track |
| Atlas toggles, Simurgh stations | all | PORTFOLIO EXTENSION | 2,344–34,250 px | Authored research-diagram composition |
| Window-controls step buttons | all | PORTFOLIO EXTENSION | 598–2,271 px | Two-column popover layout and 16px icons; bare-button reference lacks app icon sizing |

## Not covered by pixel pairs

- **Not rendered in the app (R3-B census):** checkbox, radio, slider, list box, tree view, menu/menubar, balloon/tooltip, progress bar, status bar. No parity claim is made.
- **Portfolio extensions with no 7.css counterpart:** lock screen, desktop, icons, taskbar/Start/tray, Explorer navigation pane, Aero Night.
- **Unverified:** Firefox and WebKit (not installed here), Windows/Segoe UI rasterisation, real devices, screen readers, dark-appearance pixel pairs.
