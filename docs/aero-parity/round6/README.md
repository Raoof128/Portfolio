# Sixth parity pass (10 Nov 2026): the last state, and accessibility beside the controls

**Result: all 134 controlled states match canonical `7.css@0.21.1`** (132 pixel-exact, 2 within the measured 1/255 noise band). Round 5 ended at 133. Method, tolerance and environment are unchanged from [round 3](../round3/parity-matrix.md) (Chromium 153, 1440×900, DPR 1, unmodified scoped stylesheet). Per-state results: [evidence/classification.tsv](evidence/classification.tsv).

The two states inside the noise band are `dossier-tabs` default and focus (maximum channel difference 1 of 255).

## The title bar

Round 5 lifted the title text above the window body so its glow lies over the body's top edge, as in 7.css. That reversed the order inside the title bar: the text then painted after the caption buttons, where 7.css paints it before them. The isolated active title-bar crop differed by up to 6/255 over 1,736 pixels.

The caption group is now lifted one step above the text. The order is canonical again (title background, body edge, title text, caption buttons), the window stays exact in both states, and the title bar keeps its positioning for the phone layout.

## Accessibility without touching the controls

The owner asked for both full parity and the accessibility cues. The two conflict only when a cue is drawn on the control itself, so the cues moved to the row around the control. The 7.css controls are unchanged.

| Control | 7.css control (unchanged) | Cue beside it (new) |
| --- | --- | --- |
| Contact fields | Blue focus edge and caret | The field's label is underlined while the field has focus |
| Invalid contact field | No red edge | The label turns red and semibold, and the error message carries a round "!" badge; `aria-invalid` and `aria-describedby` are unchanged |
| Projects search, Start search | Caret only | The visible label is underlined while the field has focus |
| Write-ups search | Caret only | None: its label is visually hidden, so there is nothing beside the field to mark |
| Caption buttons | 7.css's own focus glow | None needed, see the measurement below |

What the harness does and does not show: it isolates each control and hides everything else, so these cues are outside what it measures. The claim is that each control renders as 7.css renders it. A full-page screenshot differs from a bare 7.css page by the underlined label and the error badge.

One option was rejected: drawing a darker frame around a field from its wrapper. It would have restored a 3:1 edge on screen while the harness still reported the field as exact. That is a border in all but name and would have made the parity figure misleading.

### Standing against WCAG 2.2

| Item | Basis | Standing |
| --- | --- | --- |
| Search field focus (caret) | Understanding 2.4.7 lists the text caret as a focus indicator, and Understanding 1.4.11 describes the caret as a sufficiently strong indication for a text input | Passes 2.4.7 |
| Text-field resting edge (`#abadb3`, about 2.3:1) | Understanding 1.4.11, Boundaries: a border is not required when the control has visible content that identifies it. Every field here has a visible label and placeholder text at 4.6:1. The same document also says that where an input's indicator is a complete border, that border must meet 3:1 | Arguable. A strict audit may still flag it |
| Invalid field | Error text, badge, label and ARIA state; not colour alone | Passes 3.3.1 and 1.4.1 |
| Caption button focus | Measured on the built site: focus changes most of the button face (grey to blue; Close to a brighter red with a glow). About 90 to 110 pixels per button change by 3:1 or more; the peak is 4.6:1 (Minimise, Maximise) and 3.8:1 (Close) | Visible; passes 2.4.7 |

The stronger on-control versions from before round 5 still apply under `prefers-contrast: more` and forced colours: the two-tone caption ring, the dotted search ring, the 3:1 field edge and the red invalid edge.

W3C (n.d.) *Understanding SC 1.4.11: Non-text Contrast*, Web Accessibility Initiative, accessed 10 November 2026, <https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html>.

W3C (n.d.) *Understanding SC 2.4.7: Focus Visible*, Web Accessibility Initiative, accessed 10 November 2026, <https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html>.

## Verification

Two Playwright tests cover the new cues (`cues beside canonical fields` in `full-audit.spec.ts`). Not verified: Firefox, WebKit, real devices, screen readers. Not deployed.
