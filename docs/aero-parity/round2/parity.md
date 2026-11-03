# Second-pass controlled parity

**Measured improvement with explicit remaining adaptations; no universal 100% parity claim.** Final artifact `UD_vNX6v9YqmgrvZLWuY7`, built `2026-11-03T09:25:26.070Z`. Baseline is the previous Aero export `xfHy_bhVfJKii-CA72D9U`, built `2026-11-03T07:23:07.345Z`. Both are local exports from checkpoint `b4cc49d` plus their separately identified working-tree changes.

Accepted evidence contains **134 component/state pairs across 38 actual specimens**. **50 final pairs have zero exact differing pixels**, compared with 28 baseline pairs. This is a count of these controlled samples, not a percentage score for all site elements. Every remaining raw difference stays in [the measurement ledger](evidence/parity-measurements.json). [Rendered family/state coverage](coverage.md) distinguishes sampling, synthetic CSS states, actual runtime workflows and controls without a canonical counterpart.

## Conditions and capture cohorts

- Chromium 155.0.8059.79; 1440×900, DPR 1, zoom 1, reduced motion; light reference/candidate appearance. Identical frozen font files and explicit font family through canonical `--w7-font`; native reference 9pt size/weight retained. No proprietary Segoe UI redistribution.
- Unchanged installed `7.css@0.21.1`, SHA-256 `583a27d5dd81875f7e85df65da06451ae4ff6f01aa8687357ebcd0e04cc658f1`. Candidate DOM/classes/ancestor cascade come from actual exported snapshots. Scripts are removed only from isolated styling specimens.
- Common camera/backdrop, equal window external box/body fill and declared fluid sample widths. Original live/natural geometry remains recorded. Same tab wording, button content and field placeholders/options/values are used. No image rescaling or enlarged favourable mask.
- The baseline is an asserted 113-pair cohort, one reviewed groupbox row, 20 additional states from six actual control variants, and a four-state visible-scrollbar replacement. The final is an asserted 133-pair cohort plus that four-state replacement. Count 134 includes replacing three old scrollbar rows and adding the held-thumb state; it does not invent a single 134-case execution. Full provenance and prior JSON remain in each phase.
- The reference groupbox initially inherited browser Times New Roman because it was standalone. It now sits in an ordinary canonical window/body and inherits the actual UI font. Only that baseline row was corrected with prior results preserved; no application or canonical CSS was changed to make it favourable.

## Principal measurements

| Sample | Baseline | Final | Interpretation |
| --- | --- | --- | --- |
| Reading-frame chrome mask |310 of 23,191 pixels above 16/255; mean 0.418496 |92 of 23,191; mean 0.127779 |All 218 body-highlight paint-order pixels removed. Remaining 92 are title-halo displacement from the retained app icon. |
| Standalone 404 chrome mask |21,215 of 24,433 pixels above 16/255 |**0 of 24,433; mean 0** |Native frame/header/border samples match in this controlled case; body content remains different. |
| Standalone 404 title |630×30; 18,224 above-band pixels |**638×27; exact 0** |Separate legacy skin replaced by native framework. |
| Copy Link |80.44×24; 468 above-band pixels |**80.44×23; exact 0** at rest |Canonical geometry and ink now match; supported native states individually recorded. |
| Project/Write-ups/404 dropdowns |Project 24px; Write-ups 25px |**23px; exact 0 in all four captured states per variant** |Native faces and font restored. |
| Evidence unselected button |306.5×36, 16px label |**102.25×23; exact 0 in all four captured states** |Native button geometry/type; group/persistent-selection semantics retained. |
| Native captions |Already native in prior pass |23 non-focus caption/group states remain exact 0 |Focus keeps the stronger accessible outline. |

A channel delta above 16/255 is a reporting band, **not an acceptance threshold**. Exact differences are also retained. The chrome mask samples frame edges/title strip/bottom, with the actual text/icon rectangles plus 10px halo excluded; it does not include reading content or exterior shadows. Raw PNGs remain available.

The global 404 residual was independently diagnosed before the final correction: canonical frame/title/body rectangles and pseudo-element paint matched, but the ancestor `isolation:isolate` changed one-pixel inset compositing. Candidate-only probes showed isolation removal alone reduced 1,046 masked pixels to zero; position/overflow/display changes, body grey/isolation, frame isolation and box sizing did not. The originating main isolation was removed in the final app; the captured final pair verifies zero without injected application CSS.

## Native scrollbar verification

A strict new held-thumb check exposed an evidence flaw: Playwright passes `--hide-scrollbars` in normal headless Chromium, so the older three right-edge crops were blank. They are explicitly superseded and must not be cited as native thumb parity. The comparator now closes/relaunches its browser **only for the scrollbar specimen**, omitting that default flag for both reference and candidate. Other image cohorts keep their original launch conditions.

Actual default, scrolled, thumb-hover and held-thumb images are now present. The pointer aims at the measured thumb centre, scrollTop 100 is asserted, and held paint must differ from the same target's immediately preceding hover capture. Held transitions changed 786 candidate and 882 reference pixels. Both real thumb and arrow artwork were visually inspected. The final crop retains 100/201/141/173 above-band pixels for default/scrolled/hover/pressed respectively: the app preserves 44px bottom reading clearance (scrollHeight 464 vs 420) and a white-paper track token, so thumb proportions and track material differ from the grey canonical sample. Those are recorded geometry/content adaptations, not hidden zero scores.

A separate [seven-case actual page reflow probe](evidence/visible-scrollbar-reflow.json) also ran with visible 16px scrollbars: Projects, Contact and Simurgh at 320/1440, plus Persian Projects 390. No page overflow or page errors occurred. [320px capture](evidence/visible-scrollbar-projects-320.png), [1440px capture](evidence/visible-scrollbar-projects-1440.png). This scope complements, rather than relabels, the default-headless route matrix.

## Complete specimen/state ledger

D default, H hover, P pressed, F keyboard focus, X synthetic disabled, I synthetic inactive, S scrolled. The table reports **raw whole-crop** default differences; frame masks above provide the separate chrome interpretation. Native dimensions are CSS pixels.

| Actual specimen | Captured states | Baseline size | Final / reference size | Baseline / final raw pixels >16 |
| --- | --- | --- | --- | ---: |
| `window` |D, I|640.00×240.00|640.00×240.00 / 640.00×240.00|3095 / 2811|
| `titlebar` |D, I|638.00×27.00|638.00×27.00 / 638.00×27.00|1274 / 1274|
| `caption-group` |D, I, X|108.00×20.00|108.00×20.00 / 108.00×20.00|0 / 0|
| `minimize` |D, H, P, F, X, I|29.00×19.00|29.00×19.00 / 29.00×19.00|0 / 0|
| `maximize` |D, H, P, F, X, I|29.00×19.00|29.00×19.00 / 29.00×19.00|0 / 0|
| `restore` |D, H, P, F, X, I|29.00×19.00|29.00×19.00 / 29.00×19.00|0 / 0|
| `close` |D, H, P, F, X, I|48.00×19.00|48.00×19.00 / 48.00×19.00|0 / 0|
| `command-button` |D, H, P, F, X|80.44×24.00|80.44×23.00 / 80.44×23.00|468 / 0|
| `search-field` |D, H, F, X|320.00×24.00|320.00×24.00 / 320.00×24.00|270 / 270|
| `category-select` |D, H, F, X|240.00×24.00|240.00×23.00 / 240.00×23.00|1101 / 0|
| `contact-textbox` |D, H, F, X|320.00×24.00|320.00×23.00 / 320.00×23.00|1392 / 682|
| `dossier-tabs` |D, H, P, F|640.00×24.00|640.00×23.00 / 640.00×23.00|1226 / 0|
| `document-action` |D, H, P, F|123.38×24.00|117.38×23.00 / 117.38×23.00|1107 / 718|
| `atlas-toggle` |D, H, P, F|155.33×30.00|155.33×30.00 / 121.39×23.00|2352 / 2352|
| `atlas-toggle-selected` |D, F|155.33×30.00|155.33×30.00 / 116.27×23.00|3606 / 3606|
| `simurgh-station` |D, H, P, F|612.00×48.00|616.00×48.00 / 160.22×23.00|4118 / 4126|
| `simurgh-station-selected` |D, F|612.00×48.00|616.00×48.00 / 121.31×23.00|28091 / 28279|
| `contact-submit` |D, H, P, F|134.78×24.00|134.78×23.00 / 134.78×23.00|1094 / 312|
| `contact-copy-address` |D, H, P, F|121.70×24.00|115.70×23.00 / 115.70×23.00|1060 / 486|
| `contact-email` |D, H, F, X|320.00×24.00|320.00×23.00 / 320.00×23.00|1806 / 682|
| `contact-textarea` |D, H, F, X|320.00×86.00|320.00×78.00 / 320.00×78.00|1707 / 792|
| `contact-invalid` |D, F|320.00×24.00|320.00×23.00 / 320.00×23.00|1394 / 684|
| `writeups-search` |D, H, F, X|320.00×24.00|320.00×24.00 / 320.00×24.00|302 / 302|
| `writeups-select` |D, H, F, X|240.00×25.00|240.00×23.00 / 240.00×23.00|1142 / 0|
| `not-found-window` |D|640.00×240.00|640.00×240.00 / 640.00×240.00|38038 / 1473|
| `not-found-titlebar` |D|630.00×30.00|638.00×27.00 / 638.00×27.00|18224 / 0|
| `not-found-select` |D, H, F, X|240.00×23.00|240.00×23.00 / 240.00×23.00|0 / 0|
| `not-found-action` |D, H, P, F|114.22×24.00|101.62×23.00 / 101.62×23.00|1271 / 246|
| `global-search-field` |D, H, F, X|320.00×24.00|320.00×24.00 / 320.00×24.00|0 / 0|
| `window-disclosure` |D, H, P, F|120.03×24.00|120.03×23.00 / 120.03×23.00|819 / 0|
| `window-step-button` |D, H, P, F, X|118.00×24.00|118.00×23.00 / 75.00×30.00|1376 / 1443|
| `window-groupbox` |D|320.00×140.00|320.00×140.00 / 320.00×140.00|1558 / 1558|
| `evidence-toggle` |D, H, P, F|306.50×36.00|102.25×23.00 / 102.25×23.00|7500 / 0|
| `evidence-toggle-selected` |D, F|306.50×36.00|112.30×23.00 / 112.30×23.00|10214 / 6|
| `terminal-copy` |D, H, P, F|139.80×24.00|137.80×23.00 / 137.80×23.00|1440 / 661|
| `markdown-table-header` |D|240.00×22.00|240.00×22.00 / 240.00×22.00|439 / 385|
| `markdown-table-cell` |D|240.00×24.00|240.00×24.00 / 240.00×22.00|775 / 775|
| `window-scrollbar` |D, S, H, P|320.00×180.00|320.00×180.00 / 320.00×180.00|100 / 100|

## Remaining differences and evidence limits

- Contact fields retain a darker resting boundary for 3:1 non-text contrast. Focus outlines remain clear and static; primary/default action borders retain a static default cue rather than upstream pulsing. Coarse/mobile controls remain 44px with 16px input text. These accessibility constraints prevent a truthful claim of universal pixel identity.
- Research tables retain 14px reading type and content-driven row height; canonical header gradient/borders/weight are restored. Geometry-panel text/command layout and semantic links with original SVG icons have different content/layout rules from a bare native button. Raw icon alignment/default-border differences are retained, not normalised away.
- Atlas selectors retain their desktop map sizing/14px labels; Simurgh stations retain numbered research-diagram composition and large card targets. Their buttons are explicitly measured here, but a canonical bare-button crop is not a requirement to destroy authored diagram layout.
- Desktop/taskbar/Start/welcome, wallpaper, diagrams and Aero Night are project extensions without a complete 7.css counterpart. Native dropdown popups, native title tooltips, Firefox scrollbar fallback, physical Windows/Segoe rendering and assistive speech are outside these Chromium/light pixel pairs. Runtime evidence for other scopes is separately identified.

## Curated comparisons

| Actual specimen | Before | Canonical reference | Final |
| --- | --- | --- | --- |
| `window` |[Before](evidence/pair-window-default-before.png)|[Reference](evidence/pair-window-default-reference.png)|[Final](evidence/pair-window-default-candidate.png)|
| `not-found-window` |[Before](evidence/pair-not-found-window-default-before.png)|[Reference](evidence/pair-not-found-window-default-reference.png)|[Final](evidence/pair-not-found-window-default-candidate.png)|
| `command-button` |[Before](evidence/pair-command-button-default-before.png)|[Reference](evidence/pair-command-button-default-reference.png)|[Final](evidence/pair-command-button-default-candidate.png)|
| `category-select` |[Before](evidence/pair-category-select-default-before.png)|[Reference](evidence/pair-category-select-default-reference.png)|[Final](evidence/pair-category-select-default-candidate.png)|
| `contact-textbox` |[Before](evidence/pair-contact-textbox-default-before.png)|[Reference](evidence/pair-contact-textbox-default-reference.png)|[Final](evidence/pair-contact-textbox-default-candidate.png)|
| `evidence-toggle` |[Before](evidence/pair-evidence-toggle-default-before.png)|[Reference](evidence/pair-evidence-toggle-default-reference.png)|[Final](evidence/pair-evidence-toggle-default-candidate.png)|

Visible scrollbar [rest](evidence/pair-window-scrollbar-default-candidate.png), [hover](evidence/pair-window-scrollbar-hover-candidate.png) and [held](evidence/pair-window-scrollbar-pressed-candidate.png) now show actual native paint. Whole-page [404 before](evidence/not-found-before.png) / [after](evidence/not-found-after.png) and [Projects before](evidence/projects-before.png) / [after](evidence/projects-after.png) are actual exported visitor views, distinct from the isolated camera fixtures.

## Tool integrity

Four independent encoded PNG metric tests pass; four negative snapshot guards reject overwrite, mixed appearance and expanded-scope downgrade without changing any original baseline file. Snapshot census refresh writes a separate JSON file after export validation and does not alter frozen HTML/PNGs. Harness lint passes. Current tool hashes are in [harness source](evidence/harness-source.json). Full raw captures/overlays and all revision backups remain under ignored `artifacts/aero-parity/` rather than being silently regenerated.
