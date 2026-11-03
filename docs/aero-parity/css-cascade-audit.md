# CSS cascade and integration audit

Baseline: `b4cc49de662b3013a97d5497f3fd8daed0df1a20`. The first browser comparison used its previously verified application export, build `Dfv1QQLfhv_4WAY_tllxC` (`version.json` built at `2026-11-03T05:58:48.112Z`). That export records the older parent commit because it was built before the checkpoint commit; the earlier audit source hashes connect it to the committed application source. New source changes are evaluated against a freshly rebuilt candidate before acceptance.

## Integration and ordering

`src/components/os/ResearchOS.tsx:77–88` imports the structural ResearchOS, glass and reading sheets, then `7.css/dist/7.scoped.css`, then the theme, logon, taskbar, desktop, window, Explorer, page and polish extensions. The rendered root is `.os-shell.win7`; the unscoped 7.css sheet is not imported. Child components also import their own structural sheets, so production computed styles and selector specificity are the authority for an individual declaration, rather than an assumption based only on import order.

Tailwind 4's reset/utilities are in cascade layers. The 7.css and ResearchOS rules are unlayered; ordinary unlayered rules win over ordinary layered Tailwind rules regardless of specificity. The important hidden reset is a different case: the existing `<noscript>` fallback intentionally uses the base layer because important layer precedence reverses. The fallback and `[hidden]` guards are retained.

The layout supplies local Vazirmatn for Persian/Arabic and JetBrains Mono for code. No proprietary Segoe UI font is downloaded. Windows uses an installed Segoe UI where available; other operating systems use the documented fallback stack. A Linux fixture cannot establish Windows font rasterisation parity.

## Confirmed conflicts and treatment

Line ranges in the baseline column refer to the checkpoint revision, so deletion and consolidation do not invalidate the diagnosis.

| Area | Baseline winner and evidence | Correction or retained distinction |
| --- | --- | --- |
| Aero glass | `win7-theme.css:444–447` gives `.os-shell.win7 .window.glass::before` `content:none`; `win7-windows.css:10–37` replaces the frame and disables backdrop blur. Chromium computed `content:none`, while unchanged 7.css produces an empty-string painted pseudo-element. | Remove the suppression and competing frame skin; use the canonical `window glass active` layers. Preserve position/flex/window-manager geometry as functional extensions. |
| Canonical material tokens | `win7-theme.css:278–283` remaps `--w7-w-bg`, `--w7-w-glass` and `--w7-surface` to custom tint/gradients. Reusing the canonical selectors alone therefore cannot restore their materials. | Keep canonical light defaults; supply only the explicitly documented Aero Night tint. Reading bodies remain white as an established readability decision. |
| Framework control type | `win7-theme.css:278` sets the font shorthand to the 14px portfolio UI token, while canonical `_variables.scss` uses 9pt/12 CSS px. Baseline Copy Link computed 14px; the equivalent canonical button computed 12px in the same Chromium process. | Separate the canonical 9pt control shorthand from 14px extension chrome and 16px prose. Retain locale stacks and the coarse-pointer 16px input floor. Explicit component font declarations still require their own measured comparison. |
| Caption geometry | `win7-windows.css:313–395` overrides the canonical group/button dimensions. Baseline Close computed 24px tall, canonical Close 19px. | Reuse native caption shapes and grouping; document the smallest target-size adaptation and test it separately from appearance. Touch controls remain enlarged. |
| Body scrollbars | `research-os.css:1574–1690` has a higher-specificity replacement for `.has-scrollbar`. It changes the vertical width to 17px, removes the canonical grip sprite, replaces stepped gradients and changes arrow borders/shapes. Chromium measured 17px versus the canonical 16px. | Delete the replacement pseudo-element recipe and reuse installed 7.css. Retain the `scrollbar-color:auto`/`scrollbar-width:auto` inheritance reset, plus the Firefox standard-property fallback. |
| Push-button faces and states | `controls.css:1–188`, followed by `win7-pages.css:153–283`, mixes a flat primary fill, modern press scale and a second 7.css reconstruction. The custom class selectors beat native element selectors. | Consolidate shared action classes into one adapter for semantic links using canonical tokens/overlays; native buttons keep native styling. Links retain link semantics. Preserve target size, static visible focus and forced-colour exceptions. |
| Desktop frame overrides | Desktop `.os-intro`/`.os-desktop-featured` selectors also alter shared frame/title values. | Remove duplicate skin decisions from the desktop lane so all equivalent windows consume the shared window implementation. Desktop placement/content remains an extension. |
| Search panel | `ResearchOS.tsx:1616` uses native `<dialog>` for focus isolation; `win7-taskbar.css:721+` intentionally lays it out as a two-pane Start search panel anchored above the taskbar. | Retain this desktop extension. Dialog semantics do not require adding application-window captions. Compare its equivalent search input and button states, not an unrelated whole window. |
| Focus and reduced preferences | `win7-theme.css`, `win7-polish.css`, `controls.css` and structural sheets provide explicit focus, touch, reduced-motion, reduced-transparency and forced-colour paths. | Keep these requirements visible in the parity matrix; they are documented accessibility deviations rather than screenshot defects to hide. |

## Existing rules reviewed and retained

The complete `ResearchOS.tsx`, locale layout, global stylesheet, `research-os.css`, `liquid-glass.css`, `win7-theme.css`, `win7-polish.css`, `theme-switch.css`, `welcome-enter.css`, `supporting-apps.css` and shared `controls.css` were examined in this lane. Relevant window, taskbar, page and canonical source sections were cross-checked with their owning lanes. This is additional focused coverage; it does not relabel the previous audit as a new full repository review.

- The body-reading token remap in `win7-pages.css` is intentional: white document surfaces need black/muted ink in both appearances. Removing it would regress known Aero Night contrast.
- The old gradient heading declarations in `supporting-apps.css` are superseded by the `.win7` page rules. They are not evidence that the rendered headings still glow. Likewise, the old capsule dock/glass declarations are superseded by the taskbar extension. Removing every historical source token without a usage proof would risk the artwork and research diagrams.
- The 14px extension UI scale, 16px reading scale, locale line heights and larger touch controls are distinct from the canonical desktop control font. The whole portfolio need not shrink to the demo's 12px content.
- High-specificity maximised-position declarations override live inline window rectangles deliberately. They implement the window manager and are not unexplained visual patches.
- Short-height and coarse-pointer adaptations remain essential. CSS viewport reflow checks do not by themselves prove physical-device or assistive-technology behaviour.

## Evidence and acceptance

The baseline probe launched Chromium `155.0.8059.79`, viewport `1440×900`, DPR 1, light appearance and reduced motion. It loaded the actual `/projects` export and a second page using the unchanged installed scoped stylesheet. The probe compared computed frame/title/caption/button/scrollbar properties; it did not use a restyled reference to conceal differences. Full control-state screenshots, final build identity, intentional differences and the final verdict belong in the companion parity and browser reports.

## Independent candidate challenge

An independent Chromium pass, separate from the shared regression and parity harnesses, checked build `zhI36HtTY1lmEpHTY4Njv` (built `2026-11-03T07:06:11.209Z`). Its eleven route/theme/viewport cases covered Projects in both appearances; the desktop in both appearances; 320px welcome and Projects; Persian Projects and Arabic About at 390px; tablet Write-ups; a 640×360 Simurgh detail; and 1920px Contact. No horizontal page overflow, page errors or console errors occurred in that scope. Representative captures were actually inspected, including the light/Night desktop, reading frame, Start search, mobile and RTL layouts.

| Independent measurement | Candidate | Unmodified 7.css specimen | Interpretation |
| --- | --- | --- | --- |
| Copy Link font | 12px | 12px | The original 14px override is removed. |
| Push-button minimum width / padding | 75px / 0 12px | 75px / 0 12px | Canonical geometry is reused; actual text lengths determine the final width. |
| Push-button border | 1px, `#8e8f8f` | 1px, `#8e8f8f` | Canonical border and base gradient match. |
| Push-button height | 24px | 23px | Intentional minimum target adaptation. |
| Close button height | 19px | 19px | Native visible geometry; separate pointer extension and coarse-pointer sizing remain. |
| Glass pseudo-element content | Painted | Painted | The framework layer is no longer suppressed. |
| Vertical scrollbar width | 16px | 16px | Canonical scrollbar restored. |
| Scrollbar thumb border / radius | 1px / 3px | 1px / 3px | The global 3px/999px thumb recipe does not win inside `.has-scrollbar`. |

Identical animation/transition suppression was applied to both computed-style specimen pages. The initial exploratory probe could otherwise sample a native control's one-second border transition partway through; those transient colour differences are not defects. Widths, content heights and box-sizing declarations are not compared as if unrelated content were identical.

The actual portalled Move and Resize panel was also exercised: Tab from its last Done button closes the panel and reaches the All Projects content link in both appearances. Its previous fallback to the summary no longer traps the workflow. Fourteen changed stylesheets, containing 4,532 declarations at this checkpoint, parsed successfully. Chromium rejected only the intentionally supplied `-webkit-backdrop-filter` compatibility declarations; the unprefixed property's final exported form was then tested separately.

The challenge found and drove corrections for four integration defects that visual parity alone would miss:

| Finding | Observed evidence and source | Correction |
| --- | --- | --- |
| RTL search icon overlaps placeholder | `win7-taskbar.css` targeted `.os-shell.win7[dir="rtl"]`, but `dir` belongs to the document. Persian/Arabic icons remained right-aligned while logical padding reserved space on the left. | Use inherited `:dir(rtl)`. Rebuilt captures show `background-position:8px 50%` and a clear RTL placeholder. |
| Restored native glass bypasses accessibility fallbacks | Chromium CDP confirmed reduced-transparency and forced-colour media queries matched, but native window `::after` still blurred at 4px and `::before` remained at 0.6 opacity. The original universal descendant selector did not include pseudo-elements. Additionally, production CSS optimisation retained only the prefixed declaration when it came last. | Extend the existing preference blocks to pseudo-elements, use opaque canonical frame material, and put the standard `backdrop-filter` declaration last. Increased contrast receives the same opaque treatment. Validate the compiled export, not merely the source. |
| Current breadcrumb disappears in forced colours | The global `[aria-current="page"]` selected-state rule also styled a noninteractive breadcrumb span. Actual light/dark forced-colour screenshots lost “All Projects”; a transient Canvas/CanvasText correction made it readable. | Restrict the global selected-current styling to links/buttons; retain ordinary breadcrumb ink. |
| Proof Atlas loses diagram contrast in the dark forced palette | Its SVG kept authored white surfaces while `currentColor` strokes became white. The selected project control also needed a consistent system-colour face. | Bind the desktop body/diagram palette to Canvas, CanvasText and Highlight in the existing forced-colour block. Keep a 2px selected border and readable label face without disabling forced colours. |

## Final independent sign-off

The final exported build is `xfHy_bhVfJKii-CA72D9U`, built `2026-11-03T07:23:07.345Z`, recording checkpoint commit `b4cc49de662b3013a97d5497f3fd8daed0df1a20` plus the audited working-tree candidate. The independent checks were rerun against this exact export:

- All eleven route/theme/viewport cases again had zero horizontal page overflow, page errors or console errors. Both actual forward-Tab exits still reached content.
- The canonical control/caption/scrollbar measurements above remained unchanged.
- Persian and Arabic search inputs placed the icon at `8px 50%`; their placeholders were clear.
- Light and dark reduced-transparency, increased-contrast and forced-colour states had zero remaining backdrop filters among shell elements and their generated pseudo-elements. Frame paint was opaque. Normal appearance retained the canonical 4px blur and 0.6 glass opacity.
- Both forced-colour palettes displayed the current breadcrumb. All three Atlas diagrams and their selected buttons used readable system colours; all six diagram/palette captures were inspected. No transparent text face or white-on-white diagram stroke remained.
- Compiled CSS retained both backdrop-filter declarations in the corrected order, the narrowed interactive current-state selector and the scoped Atlas system-colour tokens.

Evidence: [canonical computed styles](evidence/independent-cascade.json), [browser cases and build identity](evidence/independent-browser.json), [media preferences](evidence/independent-preferences.json), [forced-colour details](evidence/independent-forced-detail.json), [six Atlas cases](evidence/independent-atlas.json), and [RTL input measurements](evidence/independent-rtl.json).

**PASS for this lane's defined integration and independent regression scope.** The Start search, wallpaper, taskbar, research diagrams, larger reading typography and coarse-pointer controls remain documented extensions. These Linux Chromium checks do not establish Windows font rasterisation equivalence, physical-device behaviour, universal pixel identity or a complete assistive-technology audit. The release verdict also depends on the separate shared browser, accessibility, security and build gates.

### Firefox contrast-emulation investigation

The subsequent cross-engine test initially failed its increased-contrast opacity assertion in bundled Firefox 157. A bare HTML fixture reproduced the cause: `page.emulateMedia({contrast:"more"})` could make `matchMedia` return true without reevaluating the stylesheet; navigation also reset the effective preference. Context-level contrast exhibited the same navigation reset. This was independent of the portfolio's CSS.

The test fixture now navigates first, emulates contrast, asserts the media-query match, then invalidates Firefox's stale evaluation with a one-pixel viewport change and restores the original viewport. It neither injects replacement application CSS nor relaxes the opacity, blur or solid-background assertions. On the unchanged final export, the isolated Firefox regression passed **1/1**. An independent more → no-preference → more probe at the restored `1440×900` viewport produced opacity `1 → 0.6 → 1` and blur `none → 4px → none`, demonstrating that the actual stylesheet controls both states. See [the minimal reproduction and results](evidence/firefox-contrast-emulation.json). Native operating-system preference switching remains outside this emulation check.
