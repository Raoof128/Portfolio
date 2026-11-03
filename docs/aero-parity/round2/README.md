# Second parity pass

**CONDITIONAL PASS for owner review.** The resumed pass is complete on build **`UD_vNX6v9YqmgrvZLWuY7`**, generated **2026-11-03T09:25:26.070Z**, from checkpoint `b4cc49d` plus the reviewed working-tree source. There is no universal 100% pixel-parity claim: the measured reference components, deliberate accessibility/content adaptations and unverified environments are separated below.

The pass corrected additional 404/table/terminal/control skins, the reading-frame paint overlap, server Close material, clipped resize tooltip, language-popup stacking, forced-colour labels/glyphs and clipped Start focus. Independent review found a selected-platform forced-colour regression that the default route/axe sweep missed; it was fixed and covered by a maintained native-browser assertion. Original research content/artwork, five languages and static export remain.

| Evidence | Completed result |
| --- | --- |
| Controlled reference/candidate styling | **134 asserted pairs across 38 actual specimens; 50 exact pixel matches**, compared with 28 baseline matches. No whole-site percentage inferred. |
| Standalone 404 frame | **0 differences in 24,433 sampled chrome pixels; mean 0**; title is also exact in its crop. |
| Reading frame |218 incorrect highlight pixels removed; 92 retained title-icon/halo pixels in 23,191 sampled remain explicit. |
| Native browser suite |Chromium 32/32; Firefox/WebKit 12/12; no failed/skipped/retried final cases. |
| Responsive/routes |360 observations, 0 horizontal overflow; 160 route/axe scans, 0 violations and 158 incomplete contrast groups retained. |
| Independent/targeted states |4 final palette combinations; 10 final locale/theme 404 cases; 7 exact clipboard/terminal cases; 4 no-JavaScript Close states+navigation; real tooltip hover/focus/Escape. |
| Visible scrollbars |4 actual paint/scroll states; 7 real-page reflow cases with 16px bars, 0 overflow/errors. Headless default hiding was explicitly corrected for these captures. |
| Engineering |674 unit tests/51 files, lint/typecheck/build, artifact/HTTP/agent/dependency guards, 4 PNG fixtures and 4 snapshot-preservation guards pass. |
| Source accounting |24 changed application/validation files reviewed; 250 prior complete reviews carried forward only after hash equality. 274 cumulative applicable files, with explicit provenance. |

## Reports and reproducible evidence

- [All findings and implemented corrections](findings.md)
- [Measured parity, all 38 specimens and before/after pairs](parity.md)
- [Rendered element/state coverage and limits](coverage.md)
- [Test commands, actual results and environment](tests.md)
- [Independent source/palette review](evidence/source-review.md)
- [Exact modified-file list and source coverage](source-changes.md)
- [Exact source manifest](evidence/source-manifest.json), [build identity](evidence/build-identity.json), [1,072 export hashes](evidence/export-manifest.json)

The baseline is the first-pass export `xfHy_bhVfJKii-CA72D9U` (07:23:07.345 UTC). Candidate1 `4XbG7ZUIl5UCdQuMwBv7c` and candidate2 `iIwRABh8xPIUf2fpDkuDr` retain separate captures/results. The environment disconnect interrupted an initial browser run and snapshot; neither is counted as accepted. Final raw evidence is under `artifacts/aero-parity/round2-final`; useful measurements and representative actual screenshots are retained here. [Reproduction instructions](../../../scripts/browser-regressions/aero-parity/README.md).

## Remaining differences and release recommendation

Native desktop faces and geometry were restored wherever applicable. Darker field boundaries, static visible focus, 44px touch targets, localised fonts, larger reading/table text and authored diagram layouts remain intentional. Desktop/taskbar/Start/welcome and Aero Night have no complete 7.css counterpart. A bare native-button reference does not justify deleting research-diagram composition or accessible text.

The 158 automated contrast incompletes remain incomplete with representative manual follow-up; all positions of translucent glass and every literal control instance are not separately certified. Native Windows font rasterisation, real screen-reader speech, physical devices/software keyboards/native zoom, native OS dropdowns, field INP/Core Web Vitals and current production bytes remain unverified. Prior original-PDF tagging, owner claim-evidence questions and 16 moderate development-tool advisories are unchanged documented limits.

No known reproducible live P0/P1 from this pass remains unresolved within the executed scope. The candidate is suitable for owner/technical review with these disclosures. **No new commit, push, merge, deployment or environment publication was performed.**
