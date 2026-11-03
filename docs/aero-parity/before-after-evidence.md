# Before and after

Baseline: saved pre-Aero export `Dfv1QQLfhv_4WAY_tllxC`, built `2026-11-03T05:58:48.112Z`, connected to source checkpoint `b4cc49d`. Final: `xfHy_bhVfJKii-CA72D9U`, built `2026-11-03T07:23:07.345Z`. All final whole-page screenshots below were captured from that exact export without injected application CSS. Isolated component pairs use the disclosed camera/fixture normalisation to compare equivalent canonical specimens.

| Experience | Before | Final | Observed change |
| --- | --- | --- | --- |
| Projects, light desktop | [Before](evidence/before-projects.png) | [Final](evidence/final-projects.png) | Native glass/frame/captions; one Explorer body; canonical fields and compact toolbar |
| Desktop, light | [Before](evidence/before-desktop.png) | [Final](evidence/final-desktop.png) | Shared 27px titles and 6px body margins, 40px fine-pointer taskbar, running plates and original icon silhouettes |
| Dark forced-colour Atlas | [Before correction](evidence/atlas-forced-dark-before.png) | [Final](evidence/atlas-forced-dark-after.png) | Distinct system-colour diagram plate/stroke/text and readable selected project |

The forced-colour “before” is the explicitly identified intermediate build `J2d8sif3jb9mZBHg6W_B0`, not the original checkpoint. This pair documents a regression found and corrected during independent review. Its final compiled measurements cover all three diagrams in both system palettes: [six-case evidence](evidence/atlas-forced-final.json).

Other final inspected views: [Aero Night Projects](evidence/final-projects-dark.png), [390px mobile](evidence/final-mobile.png), [Persian mobile](evidence/final-rtl-mobile.png), [desktop welcome](evidence/final-welcome.png), [mobile welcome](evidence/final-welcome-mobile.png), [Persian welcome](evidence/final-welcome-rtl.png), [Lab detail](evidence/final-lab.png), [light forced-colour Atlas](evidence/atlas-forced-light-after.png). The four fresh welcome cases also verify keyboard theme/language controls, workspace entry and reload persistence in [their measured results](evidence/welcome-final.json).

## Equivalent canonical components

| Specimen | Before | Reference | Final |
| --- | --- | --- | --- |
| Frame | [Before](evidence/parity-frame-before.png) | [7.css](evidence/parity-frame-reference.png) | [Final](evidence/parity-frame-final.png) |
| Caption group | [Before](evidence/parity-captions-before.png) | [7.css](evidence/parity-captions-reference.png) | [Final](evidence/parity-captions-final.png) |
| Keyboard Close focus | — | [7.css](evidence/parity-close-focus-reference.png) | [Final](evidence/parity-close-focus-final.png) |
| Search | — | [7.css](evidence/parity-search-reference.png) | [Final](evidence/parity-search-final.png) |
| Tabs | — | [7.css](evidence/parity-tabs-reference.png) | [Final](evidence/parity-tabs-final.png) |

These are actual browser renders, not projected designs. Component specimens use the matching conditions recorded in [the complete 56-state matrix](visual-parity-matrix.md). Whole-page captures show the visitor experience; isolated pairs compare material and geometry. Neither implies unrelated page contents should be identical. The reference's [glass](evidence/reference-glass.png) and [menu](evidence/reference-menu.png) specimens remain separate reference evidence.

Early fixture calibration exposed wrong containing-block heights, implicit font fallbacks and pointer state checks across background tabs. Those attempts were corrected before acceptance. The final harness records dimensions/fonts and verifies the exercised interaction state. Independent review also tightened a provisional overbroad title mask and added snapshot overwrite/version guards. Raw images and measurements remain available; neither baseline regeneration nor a favourable threshold conceals the remaining one-pixel frame difference.
