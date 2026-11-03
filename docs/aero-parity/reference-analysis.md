# Canonical 7.css reference specification

Inspected on 3 November 2026 (Australia/Sydney). The portfolio checkpoint is `b4cc49de662b3013a97d5497f3fd8daed0df1a20`. This document defines the reference, not a claim that every candidate component already matches it. Candidate measurements and exceptions belong in [the visual parity matrix](visual-parity-matrix.md).

## Authority and reproducibility

The visual authority is the [official demonstration](https://khang-nd.github.io/7.css/), supported by the installed `7.css@0.21.1` distribution and its readable source map. The official demonstration HTML and stylesheet were retrieved afresh through the configured proxy with normal TLS verification. All component documentation, example markup and all 23 source-map entries were examined: 21 component files, `_variables.scss` and `index.scss`, totalling 2,197 source lines. Generated distribution CSS was checked against these sources, rather than pretending each minified line is an independent first-party file.

| Reference artifact | SHA-256 |
| --- | --- |
| Official `https://khang-nd.github.io/7.css/` HTML | `505401c2cd1d6a54a53e1a6efdc1691cb58bdd758d07504a9a13745cde3e0d7a` |
| Official demonstration `7.css` | `ddb48c06d9ab1d27c7cbc90f618cd2df65d85c58b941e09425fa72d985765bfd` |
| Installed `node_modules/7.css/dist/7.css` | `7449894044051ef07ed0fc2c2d92178f265f76b0ec4e91de4517f0740bea8379` |
| Installed `node_modules/7.css/dist/7.scoped.css` | `583a27d5dd81875f7e85df65da06451ae4ff6f01aa8687357ebcd0e04cc658f1` |
| Installed `node_modules/7.css/dist/7.scoped.css.map` | `100fdcce74cdc9140b143f58208559522a01819ba0c0caaf9408929a9a6e91ef` |

The live demo stylesheet says `v0.21.0`; the installed package and stylesheet say `0.21.1`. Removing only the opening banner makes the two unscoped stylesheet strings exactly equal. This establishes the relevant styling identity without assuming that a banner proves a release version. No additional framework version or competing stylesheet is needed.

The current GitHub `main` version of `_window.scss` has newer dialog animation rules and `image-rendering: pixelated` compared with the published source map. Its retrieved SHA-256 is `9ff4af3de68bcd461935b3428d3b8f946bfabf2b9f8937c5431d8740b8a6a7f3`. Those unversioned additions are not silently mixed into the published reference.

One documentation discrepancy matters: the official Scoping paragraph says that `7.scoped.css` eliminates scrollbar styling. The installed bytes actually contain `.win7 .has-scrollbar::-webkit-scrollbar` and its track, thumb and button rules. Source inspection therefore takes precedence over that stale sentence. The earlier frontend audit repeated that sentence; this pass corrects the integration decision.

The source locations below use the original `../gui/_*.scss` names and line numbers inside the installed source map's `sourcesContent`. They can be reconstructed directly from the pinned dependency. [Upstream GUI sources](https://github.com/khang-nd/7.css/tree/main/gui) are useful for navigation, but the hashes above fix the reviewed version.

## Shared tokens and typography

`_variables.scss:1–36` supplies the following shared primitives. Equivalent controls should inherit them rather than duplicate their gradients in a competing token set.

| Property | Canonical value |
| --- | --- |
| Font | `9pt "Segoe UI", "SegoeUI", "Noto Sans", sans-serif` (`9pt` computes to `12px` at CSS zoom 1) |
| General surface | `#f0f0f0` |
| Control face / disabled face | `#f2f2f2` / `#f4f4f4` |
| Face shades | `#ebebeb`, `#cfcfcf` |
| Border normal / hover / pressed / disabled | `#8e8f8f` / `#3c7fb1` / `#6d91ab` / `#adb2b5` |
| Control radius | `3px` |
| Normal face | `linear-gradient(#f2f2f2 45%, #ebebeb 45%, #cfcfcf)` |
| Hover face | `linear-gradient(#eaf6fd 45%, #bee6fd 45%, #a7d9f5)` |
| Pressed face | `linear-gradient(#e5f4fc, #c4e5f6 30% 50%, #98d1ef 50%, #68b3db)` |
| Inset edge | `inset 0 0 0 1px #fffc` |
| Pressed inset | `inset 1px 1px 0 #0003, inset -1px 1px 0 #0001` |
| Highlighted list border / face | `#aaddfa` / `linear-gradient(#fff9, #e6ecf5cc 90%, #fffc)` |

`_typography.scss:1–48` defines links `#0066cc` and hover `#3399ff`, with a dotted focus outline; instruction headings are `12pt`, group headings `11pt`, and document headings `17pt Calibri`. These are component roles, not a requirement to shrink long research prose. Installed font availability, locale-specific font stacks, accessible document sizing and forced-colour overrides remain explicit adaptations. No proprietary font is distributed with the portfolio.

## Window and caption specification

The reference structure is `.window[.glass][.active] > .title-bar > .title-bar-text + .title-bar-controls`, followed by `.window-body[.has-space]`, and optionally `.status-bar > .status-bar-field`. Caption buttons can use `.is-minimize`, `.is-maximize`, `.is-restore`, `.is-help`, `.is-close`; these classes allow meaningful localised accessible names without relying on exact English `aria-label` matching.

| Part and source | Dimensions and geometry | Material, typography and states |
| --- | --- | --- |
| Frame, `_window.scss:1–82` | `1px` border; `6px` radius; no framework-fixed window width/height | Border `#000000b3`; shadow `2px 2px 10px 1px` in that colour plus `inset 0 0 0 1px #fffa`. `::before` draws the frame gradient and `inset 0 0 0 1px #fffd` edge. |
| Frame colour, `_window.scss:5–46` | Colour extension through `--w7-w-bg`, default `#4580c4` | `--w7-w-grad` is a horizontal white/black/white reflection over the base colour. The frame also has the vertical transparent/white/transparent band at 20%/40%/41%. |
| Glass, `_window.scss:126–149` | Same frame geometry | `::before` opacity `0.6`; `::after` behind the window applies `backdrop-filter: blur(4px)`. Title bar receives two corner glints plus the multi-stop 54° reflection stripes in `--w7-w-glass`; default attachment is fixed. The documentation permits local/scroll attachment. |
| Title bar, `_window.scss:150–196` | Padding `0 6px 6px`; flex row, centred items; top radii `6px` | Inside a window, border `0`; three inset white edge highlights. Title text has line height `15px`, top padding `6px`, black ink, zero letter spacing and eight white 10px glow shadows. Chromium measured `27px` height inside a window; standalone title bar is `29px` including its own border. |
| Caption group, `_window.scss:198–209` | Flex row; `1px` border except top `0`; bottom radii `5px`; no inter-button gap | Background `#fff3`; white bottom/side highlights. Three standard buttons measure `108×20px` in the reference fixture. |
| Caption buttons, `_window.scss:210–312` | Minimise/maximise/restore/help minimum `29×19px`; close minimum `48×19px`; zero padding; zero radius except group ends | Inactive controls retain canonical bitmap glyphs in `::before`; nonfinal buttons have a `1px` right divider. Disabled glyph opacity `0.4`. The native PNG glyphs are embedded by the distribution. |
| Active captions, `_window.scss:315–478` | Same geometry | `.window.active` or `.title-bar.active` enables inset white edge and `--w7-wct-bg`. Hover/focus-visible uses the cyan radial/blue split gradient and blue glow; pressed uses darker blue. Close uses the red multi-layer treatment, orange hover glow and dark red pressed treatment. Disabled rules remove glows. |
| Body, `_window.scss:84–98` | Margin `6px`, top margin `0`; border `1px`; `.has-space` adds `6px` padding | `#f0f0f0`, white outer keyline. `.is-bright` uses white. Body size follows content; large reading content is not comparable with an empty demo. |
| Footer, `_window.scss:100–124` | Margin `6px`, top `-7px`; border except top; padding `10px` | Surface fill and inset double-line separator. Bright variant uses `#eee` and a different inset shadow. |
| Status bar, `_window.scss:481–501` | Margin `6px`, top `-6px`; border except top; flex fields with `2px 3px` padding | Surface fill; white outer bottom/side keylines; `#cfcfcf` field dividers except the last field. |
| Dialog, `_window.scss:158–175` | Fixed at viewport centre; `translate(-50%,-50%)`; framework z-index `999` | Published CSS demonstrates `:target` visibility/opacity transitions. It does not implement modality, inert background, a focus trap or focus restoration. Preserve the portfolio's native dialog implementation and apply equivalent chrome rather than replacing its behaviour with fragment navigation. |

The frame reflection uses a viewport-relative fixed texture; screenshots taken at different page coordinates can differ despite identical declarations. Compare identical positioning/backdrops or separately compare geometry and computed styles. A native OS taskbar, desktop wallpaper, Start orb, window manager, resize affordance and Explorer application layout are not supplied by 7.css.

For the desktop-only extension, [Microsoft's legacy Windows 7 taskbar guidance](https://learn.microsoft.com/en-us/windows/win32/uxguide/winenv-taskbar) and its [annotated taskbar illustration](https://learn.microsoft.com/en-us/windows/win32/uxguide/images/winenv-taskbar-image1.png) provide separate era evidence. The inspected illustration shows full bordered task buttons within a roughly 40px-high band, active surface treatment and aligned tray items. This supports removing unrelated underline/dot running indicators; it does not impose a 40px touch target or make the taskbar an official 7.css component. The illustration is research evidence, not a shipped portfolio asset.

## Control specifications

| Component and source | Dimensions, typography and geometry | Paint and meaningful states |
| --- | --- | --- |
| Button, `_button.scss:1–130` | Font token; minimum `75×23px`; `0 12px` padding; border `1px`; radius `3px`; border-box | Shared normal face; hover `::before`, pressed `::after`; disabled `#f4f4f4`, border `#adb2b5`, text `#838383`. Focus-visible inset `2px #98d1ef`, dotted black outline offset `-4px`. Default/focus has border `#5586a3`, light blue face and pulse animation. Reduced-motion suppression is a portfolio accessibility extension. |
| Text box / textarea, `_textbox.scss:1–41` | Text-like inputs `23px` tall; `3px 4px 5px` padding; `2px` radius; border-box; textareas content-sized | White; side borders top/right/bottom/left `#abadb3/#dbdfe6/#e3e9ef/#e2e3ea`. Hover `#5794bf/#b7d5ea/#c7e2f1/#c5daed`; focus `#3d7bad/#a4c9e3/#b7d9ed/#b5cfe7`. Disabled grey surface and inset white edge. |
| Search box, `_searchbox.scss:1–69` | `24px` tall; min-width `187px`; `3px 6px` padding; transparent `1px` border; radius `2px` | White, inset top/left `#8e8f8f`, bottom/right `#ccc`; italic placeholder. Empty instant search shows the canonical `14px` search SVG at right `8px`. Optional `.searchbox` adds a `26×22px` command button, positioned `1px` from top/right, with normal/hover/pressed faces. |
| Combo box, `_combobox.scss:1–36` | Wrapper inline-block/relative; input width 100%, right padding `20px`; adjoining button min-width `16px` | Text box plus button; squared joining corners, embedded down arrow and shared face state gradients. Framework CSS does not implement option keyboard behaviour. |
| Dropdown, `_dropdown.scss:1–46` | Native single select; `2px 3px` padding, right `30px`; border `1px`; radius `3px`; appearance none | Canonical dropdown SVG over shared normal/hover/pressed faces. Focus inset `2px #98d1ef` and dotted black outline. Disabled arrow/face/ink separate. Popup option-list rendering remains browser/OS-dependent. |
| Menu, `_menu.scss:1–230` | `ul[role=menu]` min-width `150px`, padding `2px`, border `1px`; item commands `4px 10px 4px 32px`, radius `3px`; icon gutter `28px` | Surface `#f0f0f0`, border `#0006`, shadow `4px 4px 3px -2px #00000080`. Hover/focus-visible list highlight. Submenu shown by focus/focus-within; `.can-hover` opts into hover. Disabled opacity `0.5`; divider two-line emboss. Do not add menu ARIA roles merely to obtain these styles. |
| Menu bar / navigation, `_menu.scss:13–39` | Flex `ul[role=menubar]`; top-level item padding `6px 10px` | White/pale blue split gradient at 20/25/43/48%; hover/focus `#3399ff` and white. Complete command keyboard interaction remains application work. No standalone Explorer navigation-button widget exists. |
| Tabs, `_tabs.scss:1–87` | `menu[role=tablist]`; buttons `2px 6px` padding; selected tab rises `2px`, extends its bottom padding to `4px`; square corners | Selected tab white, bottom border removed, no normal button pseudo faces; panel white with `14px` padding, `1px #8e8f8f` border. Disabled opacity `0.6`; selected focus remains dotted. |
| Tree view, `_treeview.scss:1–88` | `ul.tree-view`; padding `6px 6px 6px 20px`; child indent `20px`; item top margin `4px` | Optional white bordered container; native `details/summary`; optional `8px` plus/minus box and dotted connectors. A flat list of project links should not be relabelled a tree. |
| List box, `_listbox.scss:1–34` | `select[multiple]` or `[role=listbox]`; block, overflow-y scroll; item padding `2px` | White with `1px #c0c1cd`; optional shadow; hovered/selected items `#2a90ff` with white text. Published attribute selector is `[aria-selected]`, so application use must account for it matching `false` too. |
| List view, `_listview.scss:1–87` | Actual table; collapsed border; fixed layout; header `22px`, `0 8px` padding; body cells height `14px` plus `2px 8px` padding | White, outer `#c0c1cd`; header white/grey split gradient and `#d7d7d7` borders; highlighted header blue gradient; highlighted row shared list treatment. Sort indicator `6×5px`. This is the Details table view, not an arbitrary card/list API. |
| Checkbox, `_checkbox.scss:1–81` | Native input followed by associated label; visual box `14×14px`; label gap `6px` | Sunken grey box; blue hover inset; checked tick via label `::after`; disabled grey; focus dotted on label. Input stays keyboard/assistive operable despite opacity `0`. |
| Radio / option button, `_radiobutton.scss:1–85` | Input plus associated label; visual circle `14px`, gap `6px`, selected dot `8px` | Multi-layer sunken shadow, blue dot/border, blue hover; disabled greyscale/opacity; dotted label focus. Native input grouping required. |
| Slider, `_slider.scss:1–159` | Range width 100%, padding `10px 1px`; track `3px`; thumb `10×18px`; vertical wrapper default `4×150px` | Canonical normal/hover/pressed/disabled bitmap variants, optional box indicator; separate WebKit/Gecko rules; focus dotted. Orientation transform is not window-resize behaviour. |
| Group box, `_groupbox.scss:1–22` | Fieldset border `1px`, radius `3px`, padding `8px 10px 10px`; flex column gap `6px` | `#cdd7db` border and inset white edge; legend uses font token. `.group` gives spacing without a fieldset role. |
| Progress, `_progressbar.scss:1–88` | Content height `15px` plus border; radius `3px`; nested div supplies determinate width | Grey track with bevels, green fill `#0bd82c`, paused yellow `#e6df1b`, error red `#ef0000`; `.animate`/`.marquee` sweep at `3s`. State/ARIA values are application responsibilities. |
| Spinner, `_spinner.scss:1–12` | `.spinner` or `.loader`, `20×20px`, inline-block | Canonical static PNG; `.animate` switches to GIF. Its motion is not controlled by CSS animation-duration; a reduced-motion implementation must choose static imagery. |
| Balloon / tooltip, `_balloon.scss:1–57` | Padding `1em 1em 1em 2.5em`, border `1px`, radius `3px`, tail `18px`, offset `1em` | White-to-`#ebebeb` gradient, shadow `5px 5px 3px -3px #0006`; positional classes change tail placement. Trigger/dismissal/announcement not supplied by CSS. |
| Collapse, `_collapse.scss:1–39` | Native `details > summary`; `5px` triangle | Black closed chevron; open rotates `45deg`; marker hidden. Keyboard and open-state semantics should remain native. |
| Scrollbar, `_scrollbar.scss:1–192` | `.has-scrollbar`; vertical width `16px`, horizontal height `17px`; arrow buttons `17px` vertical / `16px` horizontal | Grey track; inset-bordered gradient thumb with embedded grip image; canonical arrow SVGs; blue hover and pressed gradients. WebKit pseudo-elements only; Firefox needs an explicit native fallback. These rules are present in the installed scoped distribution. |

## Actual reference-browser observations

Chromium `155.0.8059.79` rendered the first documented specimen for all 25 component/example families at `1440×900`, DPR 1, light colour scheme and reduced-motion preference. The stylesheet was unmodified. The fixture placed each official example within the same 600px-wide pale-blue host; the body inherited the same font token as the official docs. This host placement is a test fixture, not framework CSS. Source-specified widths remained unchanged.

The inspected glass/window/menu captures showed the expected narrow blue frame, red close face, corner highlights and recessed grey menu gutter. Computed measurements confirmed button `75×23px`, text input `23px` high, search `24px` high, dropdown `23px` high, window title `27px`, caption buttons `29×19px`/`48×19px`, three-button group `108×20px`, table header `22px`, and progress outer height `17px` from a `15px` content box plus borders. See [reference browser measurements](evidence/reference-browser.json).

These default reference captures do not certify candidate parity or every interactive state. Hover, pressed, focus, disabled, inactive and adaptive candidate comparisons are recorded by the paired harness and in the visual parity matrix. Source review identifies all framework states; actual executed capture coverage must remain separately counted.

## Independent residual-pixel diagnosis

The final controlled window pair retains a small measured difference; it is not pixel-identical chrome. `artifacts/aero-parity/final/comparisons/results-window.json` records **310 pixels above the 16/255 channel reporting band out of 23,191 sampled chrome pixels**, mean absolute RGB-channel difference 0.4185. The mask uses measured text/icon bounds plus 10px glow, while retaining the frame edge. Its earlier 400px-wide label exclusion counted 236/14,470 pixels; the raw window images are unchanged. The tighter measurement exposes more of the existing boundary difference.

Independent PNG analysis separates the 310 pixels into **92 left-edge title-halo pixels** and **218 pixels on the one-pixel body-top highlight at image y43**. The app's 16px title icon plus 6px gap shifts the canonical title text 22px right: removing that icon solely in a temporary diagnostic eliminates the halo difference. Keep the functional icon. The highlight difference is a genuine small paint-order mismatch: the positioned application title bar overlays the body's outer white highlight. Body/title rectangles and canonical shadow declarations match; changing the white reading background to canonical grey does not remove the line. Temporary candidate-only experiments using title `z-index:auto` and body `isolation:isolate` remove the 218 highlight pixels with the actual icon retained, leaving 92 halo pixels. The final frozen application retains its existing stacking; this one-pixel overlap is explicitly deferred as low severity because a layering change needs its own full interaction regression review. No reference CSS, image or mask was modified to hide it.

Both original window screenshots were independently reproduced with zero decoded-pixel differences. The reviewer opened the reference/candidate/diff window images, both default caption-group crops and reference/candidate close/minimise focus crops. All 23 non-focus caption pairs are exactly identical in the controlled captures; the four keyboard-focus pairs differ through the intentional strong inset black/white focus indicator. This bounded result does not establish whole-desktop or cross-browser pixel equivalence. Diagnostic source, computed styles and experiment captures are in `/tmp/aero-residual-diagnose.mjs`, `/tmp/aero-residual/` and `/tmp/aero-residual-retained-icon/`; these temporary files are supplementary, while the frozen pair images and JSON are the durable harness evidence.

## Legal and behavioural boundary

7.css is MIT licensed; preserve dependency attribution. The reference's gallery photos, Icons8 images, Windows branding and proprietary fonts are not granted a blanket reuse licence by that package licence. The portfolio retains its original wallpaper, artwork and monogram. Native React window management, semantic navigation, multilingual type, reduced motion, forced colours and practical touch targets take precedence over copying inaccessible historical behaviour.
