# Controlled visual-parity matrix

The accepted evidence contains **56 component/state pairs across 13 families**, captured from the frozen application export and compared with untouched `7.css@0.21.1` in Chromium 155.0.8059.79. Twenty-three non-focus caption states have **zero exact differing pixels** under these specific conditions. This is not a whole-site or cross-platform parity score.

Baseline application source: commit `b4cc49de662b3013a97d5497f3fd8daed0df1a20`; its retained export reports base `2b6d048` and was built at `2026-11-03T05:58:48.112Z`. Final reviewed export: **`xfHy_bhVfJKii-CA72D9U`**, built at **`2026-11-03T07:23:07.345Z`**, from `b4cc49d` plus the current Aero changes. [Baseline identity](evidence/parity-before-identity.json) and [final identity](evidence/parity-final-identity.json) include source hashes. These are local captures, not production deployment evidence.

## Conditions and interpretation

- Both specimens use the same browser, 1440 × 900 viewport, DPR 1, zoom 1, font availability and explicit font family. The reference receives that family through the documented `--w7-font` variable while retaining native 9pt size and weight. All nine font files are frozen and hashed in the full results.
- The installed scoped stylesheet is unchanged: SHA-256 `583a27d5dd81875f7e85df65da06451ae4ff6f01aa8687357ebcd0e04cc658f1`. Candidate classes, inherited tokens, ancestor selectors and pseudo-elements come from actual exported markup/CSS.
- Camera isolation removes application scripts, hides unrelated pixels and clears unrelated ancestor surfaces. Both specimens have a blue `#90b5d0` backdrop for glass or a white backdrop for document controls. Animations, transitions and carets are disabled equally.
- Window samples share a 640 × 240 external box and filled body. Search/textbox widths are 320px, selects 240px and tab lists 640px. Native caption/button dimensions and original live geometry remain recorded. No screenshot is scaled. Tab wording and action icon/text content match.
- Actual pointer and keyboard operations activate hover, pressed and focus states. Nonvisual CSS sentinels assert the requested pseudo-state and focus also checks `document.activeElement`. This browser applies pointer CSS while `Element.matches(':hover')`/`':active'` reports false in a bare-button reproduction; the sentinel observes the actual CSS engine instead. Tabs target the second child button, not the nonfocusable menu container.
- Restore, inactive and disabled fixtures exercise supported styles synthetically. They are distinct from the native React navigation/window tests reported in [browser results](browser-test-results.md).
- `>16` means a maximum RGB channel delta greater than 16/255. It is a reporting band, **not a pass threshold**. Exact differences and full computed styles remain available. Opaque pixels only; no alpha-compositing claim.

## Default geometry and material changes

All widths below are CSS pixels. Fluid specimen widths reflect the documented common camera conditions, not a claim that live controls all have that width.

| Component | Before | Final | Reference | Before >16 pixels | Final >16 pixels |
| --- | --- | --- | --- | ---: | ---: |
| window | 640 × 240 | 640 × 240 | 640 × 240 | 39,497 | 3,095 |
| titlebar | 630 × 30 | 638 × 27 | 638 × 27 | 18,045 | 1,274 |
| caption-group | 96 × 26 | 108 × 20 | 108 × 20 | 2,180 | 0 |
| minimize | 30 × 24 | 29 × 19 | 29 × 19 | 325 | 0 |
| maximize | 30 × 24 | 29 × 19 | 29 × 19 | 407 | 0 |
| restore | 30 × 24 | 29 × 19 | 29 × 19 | 402 | 0 |
| close | 30 × 24 | 48 × 19 | 48 × 19 | 807 | 0 |
| command-button | 81.52 × 24 | 80.44 × 24 | 80.44 × 23 | 701 | 468 |
| search-field | 320 × 24 | 320 × 24 | 320 × 24 | 1,244 | 270 |
| category-select | 240 × 26.14 | 240 × 24 | 240 × 23 | 3,414 | 1,101 |
| contact-textbox | 320 × 24 | 320 × 24 | 320 × 23 | 1,392 | 1,392 |
| dossier-tabs | 640 × 36.8 | 640 × 24 | 640 × 23 | 6,359 | 1,226 |
| document-action | 135.94 × 24 | 123.38 × 24 | 117.38 × 23 | 1,596 | 1,107 |

## Window chrome mask and residuals

The chrome mask includes the 7px frame edges, 28px title strip and bottom edge. It excludes the union of actual text-node `Range` rectangles and the app-icon rectangle in both specimens, expanded by 10px for the canonical text glow and clipped to preserve the outer frame edge. It excludes reading content and exterior shadows; raw screenshots and raw metrics remain available. The mask definition and measured bounds are in [the measurement ledger](evidence/parity-measurements.json).

| State | Before sampled / >16 | Final sampled / >16 | Before mean RGB delta | Final mean RGB delta |
| --- | ---: | ---: | ---: | ---: |
| default | 22,975 / 21,306 | 23,191 / 310 | 72.823518 | 0.418496 |
| inactive | 22,975 / 21,123 | 23,191 / 310 | 74.473326 | 0.418323 |

The final 310 above-band pixels were independently diagnosed: 92 are the title halo moving because the portfolio retains its app icon and 6px gap; 218 lie on the one-pixel body-top highlight painted beneath the positioned title bar. The latter is a **low-severity remaining paint-order difference**, explicitly retained in this frozen build; it is not hidden by enlarging the mask. See [the independent diagnosis](reference-analysis.md). The final title bar, caption group, frame borders, gradients and shadow values otherwise match the controlled canonical specimen closely.

The prior provisional 400px-wide label mask was too broad. It has been superseded. The two window rows were recaptured after independent review with measured exclusions and merged into the 56-state ledger with revision provenance. Other state rows retain their accepted full-run captures. Do not cite the old 236/14,470 mask as the final result.

## Complete state ledger

Each listed state completed its required fixture assertions. The table reports raw whole-crop differences; the frame-only interpretation above is separate. Captions use their actual native geometry. Focus differences are retained accessibility extensions, not suppressed violations.

| Component | State | Final size | Reference size | Exact differing pixels | Pixels >16 |
| --- | --- | --- | --- | ---: | ---: |
| window | default | 640 × 240 | 640 × 240 | 130,855 | 3,095 |
| window | inactive | 640 × 240 | 640 × 240 | 130,853 | 3,095 |
| titlebar | default | 638 × 27 | 638 × 27 | 1,976 | 1,274 |
| titlebar | inactive | 638 × 27 | 638 × 27 | 1,974 | 1,274 |
| caption-group | default | 108 × 20 | 108 × 20 | 0 | 0 |
| caption-group | inactive | 108 × 20 | 108 × 20 | 0 | 0 |
| caption-group | disabled | 108 × 20 | 108 × 20 | 0 | 0 |
| minimize | default | 29 × 19 | 29 × 19 | 0 | 0 |
| minimize | hover | 29 × 19 | 29 × 19 | 0 | 0 |
| minimize | pressed | 29 × 19 | 29 × 19 | 0 | 0 |
| minimize | focus | 29 × 19 | 29 × 19 | 152 | 145 |
| minimize | disabled | 29 × 19 | 29 × 19 | 0 | 0 |
| minimize | inactive | 29 × 19 | 29 × 19 | 0 | 0 |
| maximize | default | 29 × 19 | 29 × 19 | 0 | 0 |
| maximize | hover | 29 × 19 | 29 × 19 | 0 | 0 |
| maximize | pressed | 29 × 19 | 29 × 19 | 0 | 0 |
| maximize | focus | 29 × 19 | 29 × 19 | 144 | 144 |
| maximize | disabled | 29 × 19 | 29 × 19 | 0 | 0 |
| maximize | inactive | 29 × 19 | 29 × 19 | 0 | 0 |
| restore | default | 29 × 19 | 29 × 19 | 0 | 0 |
| restore | hover | 29 × 19 | 29 × 19 | 0 | 0 |
| restore | pressed | 29 × 19 | 29 × 19 | 0 | 0 |
| restore | focus | 29 × 19 | 29 × 19 | 144 | 144 |
| restore | disabled | 29 × 19 | 29 × 19 | 0 | 0 |
| restore | inactive | 29 × 19 | 29 × 19 | 0 | 0 |
| close | default | 48 × 19 | 48 × 19 | 0 | 0 |
| close | hover | 48 × 19 | 48 × 19 | 0 | 0 |
| close | pressed | 48 × 19 | 48 × 19 | 0 | 0 |
| close | focus | 48 × 19 | 48 × 19 | 227 | 221 |
| close | disabled | 48 × 19 | 48 × 19 | 0 | 0 |
| close | inactive | 48 × 19 | 48 × 19 | 0 | 0 |
| command-button | default | 80.44 × 24 | 80.44 × 23 | 1,150 | 468 |
| command-button | hover | 80.44 × 24 | 80.44 × 23 | 1,160 | 516 |
| command-button | pressed | 80.44 × 24 | 80.44 × 23 | 1,457 | 443 |
| command-button | focus | 80.44 × 24 | 80.44 × 23 | 1,920 | 1,497 |
| command-button | disabled | 80.44 × 24 | 80.44 × 23 | 1,824 | 1,048 |
| search-field | default | 320 × 24 | 320 × 24 | 400 | 270 |
| search-field | hover | 320 × 24 | 320 × 24 | 400 | 270 |
| search-field | focus | 320 × 24 | 320 × 24 | 2,076 | 1,946 |
| search-field | disabled | 320 × 24 | 320 × 24 | 400 | 270 |
| category-select | default | 240 × 24 | 240 × 23 | 3,383 | 1,101 |
| category-select | hover | 240 × 24 | 240 × 23 | 3,387 | 1,287 |
| category-select | focus | 240 × 24 | 240 × 23 | 3,131 | 1,249 |
| category-select | disabled | 240 × 24 | 240 × 23 | 1,161 | 816 |
| contact-textbox | default | 320 × 24 | 320 × 23 | 1,487 | 1,392 |
| contact-textbox | hover | 320 × 24 | 320 × 23 | 1,125 | 1,032 |
| contact-textbox | focus | 320 × 24 | 320 × 23 | 1,457 | 1,365 |
| contact-textbox | disabled | 320 × 24 | 320 × 23 | 7,009 | 1,384 |
| dossier-tabs | default | 640 × 24 | 640 × 23 | 2,218 | 1,226 |
| dossier-tabs | hover | 640 × 24 | 640 × 23 | 2,218 | 1,258 |
| dossier-tabs | pressed | 640 × 24 | 640 × 23 | 2,218 | 1,258 |
| dossier-tabs | focus | 640 × 24 | 640 × 23 | 2,694 | 1,855 |
| document-action | default | 123.38 × 24 | 117.38 × 23 | 1,961 | 1,107 |
| document-action | hover | 123.38 × 24 | 117.38 × 23 | 1,832 | 971 |
| document-action | pressed | 123.38 × 24 | 117.38 × 23 | 2,282 | 861 |
| document-action | focus | 123.38 × 24 | 117.38 × 23 | 1,849 | 1,216 |

## Intentional adaptations and limits

- Normal visual captions are the canonical 29 × 19px and 48 × 19px close control. Transparent hit extensions, coarse-pointer geometry and stronger focus outlines remain accessibility features. The four focus crops differ by design; all other captured caption states are exact matches.
- Command buttons, textboxes, selects and tabs retain a 24px minimum target versus the canonical 23px geometry. Primary action links preserve their arrow/icon spacing, producing a 6px width difference in the representative action. Larger responsive/touch targets are checked separately.
- The project search placeholder is darker than the reference default for readability. The small remaining field differences are visible in the evidence rather than removed by a favourable threshold.
- The reference sample has grey 12px body copy; the portfolio keeps readable 16px copy on white, original content and an app icon. Raw window/image differences include those content adaptations.
- These isolated pairs cover Chromium/light appearance. They do not prove exact dark-theme, Firefox/WebKit, RTL, mobile, live-wallpaper or physical Windows rendering equivalence. Use the separate browser/responsive evidence for those scopes.
- Menus, taskbar, desktop and welcome are not implied by the 13-family pixel matrix. Component mapping and live-browser review document their own scope; 7.css does not supply a complete desktop/window manager.

## Curated pairs

| Specimen | Before | Reference | Final | Difference |
| --- | --- | --- | --- | --- |
| Window frame | [Before](evidence/parity-frame-before.png) | [Reference](evidence/parity-frame-reference.png) | [Final](evidence/parity-frame-final.png) | [Raw difference](evidence/parity-frame-diff.png) |
| Caption group | [Before](evidence/parity-captions-before.png) | [Reference](evidence/parity-captions-reference.png) | [Final](evidence/parity-captions-final.png) | [Difference](evidence/parity-captions-diff.png) |
| Close keyboard focus | — | [Reference](evidence/parity-close-focus-reference.png) | [Final](evidence/parity-close-focus-final.png) | [Accessibility difference](evidence/parity-close-focus-diff.png) |
| Search input | — | [Reference](evidence/parity-search-reference.png) | [Final](evidence/parity-search-final.png) | [Difference](evidence/parity-search-diff.png) |
| Dossier tabs | — | [Reference](evidence/parity-tabs-reference.png) | [Final](evidence/parity-tabs-final.png) | [Difference](evidence/parity-tabs-diff.png) |

The group itself is not focusable; the close-button pair is the representative group-member focus state. Full reference/candidate/overlay/difference PNGs, CSS observations and native-state assertions remain under `artifacts/aero-parity/{before,final}/comparisons/`.

## Evidence-tool validation

- Four independently encoded PNG fixtures pass: identical pixels, known black/white 255-channel delta with decoded valid overlay/difference images, differing image extent, and explicit mask scope.
- Independent Pillow decoding of the real baseline 672 × 272 window pair exactly reproduced the harness: 182,600 exact differing pixels; 39,497 above16; mean absolute channel delta 25.07818882761438. Both inputs were fully opaque.
- Two negative snapshot checks pass: accidental phase overwrite and mismatched-export `--extend` both exit before modifying any original file. [All original hashes remained equal](evidence/parity-snapshot-guard.json).
- Harness ESLint passes with zero warnings. Commands and conditions are documented in [the harness README](../../scripts/browser-regressions/aero-parity/README.md).

Early fixture calibration failures (stale inactive selector, wrong containing-block crop, relative font URLs, irrelevant body/backdrop content differences and the Chromium DOM pseudo-state observation anomaly) were corrected before accepted captures. They are not application regressions and are not counted as passing runs. The independent snapshot-preservation and broad-mask findings were also corrected and rechecked.
