# Fifth parity pass (10 Nov 2026): "fix all"

**Result: 133 of 134 controlled states match canonical `7.css@0.21.1`** (131 pixel-exact, 2 within the measured 1/255 noise band). Round 4 ended at 87. One state remains, described below. The owner directed that every remaining difference be closed, including the ones round 4 had kept for accessibility or design reasons.

- Base: `73d443b`. Final: `de69591`. Method, tolerance and environment are unchanged from [round 3](../round3/parity-matrix.md) (Chromium 153, 1440×900, DPR 1, unmodified scoped stylesheet).
- Per-state results: [evidence/classification.tsv](evidence/classification.tsv).
- Orchestrator: Claude Fable 5.2. Workers: four `claude-haiku-5-5` agents (three implementers with disjoint file leases, one independent reviewer).

## What changed

| Area | Change | States now matching |
| --- | --- | ---: |
| Title bars | Title text only, like `.title-bar > .title-bar-text`; the app icon is gone | 1 (inactive; the active crop is the one remaining state) |
| Window body | The 7.css body ships untouched (grey surface, 9pt). The white reading sheet moved to the page roots and spans the window; the portfolio's own windows keep white bodies explicitly | 2 |
| 404 | A canonical grey dialog; its rows carry the reading type | 1 |
| Scrollbar | Reading and taskbar clearance moved from the body to the sheet, so the scroll range is canonical | 4 |
| Group box | Fieldset keeps the 7.css font; hints get their own class; bare paragraphs keep UA margins | 1 |
| Icon buttons | Canonical inline layout (icon on the text baseline, line centred); icons sized by attribute; a real space before the label | 17 |
| Simurgh stations | Native buttons with 7.css's `active` class, in a wrapping row | 6 |
| Write-up tables | 7.css list view untouched on desktop; larger type on phones and touch | 2 |
| Start search | Native clear control; custom clear button removed | 1 |
| Focus and field edges (owner decision) | 7.css's own behaviour by default: see below | 11 |

Three more Tailwind preflight resets were found and undone inside the Win7 scope during this pass (`svg { display: block }` for inline icons, zeroed paragraph margins, and earlier the placeholder and disabled inks).

Harness change: the reference window body carries 7.css's optional `has-space` padding only when the actual body does, so the same canonical variant is compared on both sides.

## Accessibility trade-off (commit `c82436c`, isolated and revertible)

By default the app now matches what 7.css draws:

| Control | Default focus or state cue | WCAG note |
| --- | --- | --- |
| Caption buttons | 7.css's own `:focus-visible` glow (blue; red on Close), the same face as hover. The earlier commit message said "no indicator"; the independent review corrected that | Indicator present; its contrast is unmeasured |
| Search fields (Projects, Write-ups, Start) | The caret only: no ring and no edge change | Risks failing 2.4.7 Focus Visible |
| Text fields | Blue focus edge and caret. Resting edge is 7.css's `#abadb3`, about 2.3:1 on white | Resting edge is below the 3:1 of 1.4.11; each field has a visible label |
| Invalid field | No red edge. Error text, `aria-invalid` and `aria-describedby` still report it | Passes 3.3.1 and 1.4.1 |

The stronger versions were kept, not deleted. They apply under `prefers-contrast: more` or forced colours: the two-tone ring on caption buttons, the dotted ring on search fields, the 3:1 field edge and the red invalid edge. To restore them for everyone, revert `c82436c`.

## The one remaining state

Closed in the [sixth pass](../round6/README.md), which also adds accessibility cues beside the controls.

`titlebar` (active, isolated crop): 1,736 pixels differ by at most 6/255, none above the 16/255 reporting band. Cause: the title text is lifted above the isolated window body so its glow lies over the body's top edge, as in 7.css. That makes the full window pixel-exact in both states, but in the isolated title-bar crop the lifted text composites slightly differently. Removing the lift returns 25 pixels (≤8/255) to both window states instead. A clean fix means making the title bar non-positioned, which its hairline and the phone sticky layout depend on.

## Verification

Run on the final code commit `de69591` (build `2026-11-10T09:31:03Z`):

| Gate | Result |
| --- | --- |
| Parity (134 states) | 131 exact, 2 within 1/255, 1 differing |
| Lint, typecheck | pass |
| Unit tests | 755 of 755 (46 files) |
| Schema, tooling, security, HTTP audit, dependency security | 6/6, 17/17, 14/14, 17/17, 3/3 |
| Static artifact audit, agent audit | pass (1,067 files), pass |
| Playwright (Chromium only) | 79 of 79 |
| Local production audit | reports the build as stale, because documentation commits follow it; not a defect in the build |

Raw harness output is in `artifacts/aero-parity/round5/` (ignored). Independent review (Haiku) found no P0 or P1 defect; its findings (grey side gutters beside the sheet, icons flush against labels, and the caption-focus correction above) are fixed or recorded here. Not verified: Firefox, WebKit, real devices, screen readers. Not deployed.
