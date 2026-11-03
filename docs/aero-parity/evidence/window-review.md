# Window lane — Operation Aero

Baseline source: b4cc49de662b3013a97d5497f3fd8daed0df1a20. Previous audit and historical notes were retained. The new source changes preserve window-manager state and route behaviour.

## Findings and corrections

- WIN-PARITY-01 (high visual): the custom Aero layer replaced the canonical frame with 4px padding, mixed 8px/4px corners, larger shadow, a 30px title bar and a hand-built vertical glass gradient. Removed redundant frame/title skins and obsolete 20px-radius/grid/focus-rim rules in `reading-window.css`; restored the installed 7.css frame and glass pseudo-elements. `win7-theme.css` no longer maps `--w7-w-glass` to the custom fill or disables `::before`. The native blur remains on `::after`, so it does not re-anchor fixed descendants.
- WIN-PARITY-02 (high visual): 30×24px captions compressed Close to the same width as Minimise and Maximise; the custom 2px gap and rounded group differed from 7.css. Restored native 29×19px ordinary / 48×19px Close geometry, 108×20px zero-gap group and native hover/pressed/inactive artwork. A transparent 5px lower hit extension supplies a 24px effective height without changing the visible native caption. Real 44px boxes remain on mobile/coarse pointers; forced colours uses real 24px boxes with system-colour glyphs.
- WIN-PARITY-03 (medium visual): old caption-tooltip `::before` hover bridges overrode the native glow geometry, producing a second glyph below the Maximise button in the first integrated build. Scoped custom tooltips away from `.title-bar-controls` in `workspace-windows.css`; native `title` attributes supply caption hints. Actual second-build hover/pressed captures show the corrected single glyph.
- WIN-PARITY-04 (medium visual): bold titles and clipped short-title halos differed from the reference. Titles now use normal-weight 12px/15px canonical text with 6px top padding; only measured truncation clips the halo. Explicit semantic title-bar ink also prevents the Intro window's black body text leaking into the Night title bar.
- WIN-PARITY-05 (medium functional): the keyboard controls panel used `nextElementSibling` after its last button. When the launcher was the last toolbar child, Tab returned to the launcher instead of continuing through the document. `ReadingWindowControls.tsx` now closes the portal, restores the native tab origin and leaves Tab uncancelled. The unit case explicitly distinguishes jsdom's lack of default Tab traversal from actual browser verification.
- Toolbar extension: native button font, 12px padding, 75px minimum width, border and active colour now match 7.css. The 24px minimum target height is an intentional 1px accessibility adaptation; mobile/coarse controls retain 44px targets and 14px labels.

## Actual built comparison

Captured in Chromium 155.0.8059.79, 1440×900, DPR1, reduced motion, local Wrangler preview. The before build is the committed prior audit export. First integrated build `ur0quRzFck7S6YZ6THiOy` exposed WIN-PARITY-03. Second build `zhI36HtTY1lmEpHTY4Njv`, built2026-11-03T07:06:11.209Z, fixes it.

| Property | Before | Second build | Canonical reference |
| --- | --- | --- | --- |
| Frame padding / radius | 0 4px 4px / 8px 8px 4px 4px | 0 / 6px | 0 / 6px |
| Title bar in 1000px outer window | 990×30 | 998×27 | outer width−2;27px high |
| Title text | bold12px/30px | normal12px/15px +6px top padding | same |
| Caption group | 96×26;2px gap | 108×20;0 gap | same |
| Minimise / Maximise | 30×24 | 29×19 | same visual geometry |
| Close | 30×24 | 48×19 | same visual geometry |
| Reading-body margin | 0 | 0 6px 6px | same |

`probe.cjs` records 14 actual route state captures per build: two themes × default/hover/pressed/focus/restore/inactive/disabled. Inactive and disabled are controlled styling-state mutations, not claims of an added user workflow. `round2.json` retains computed styles and hit tests. `interaction.json` records actual clicks 4px below all visible caption boxes: Maximise, Restore, Minimise and Close all function. It also records reverse Tab closing to the launcher and forward Tab from Done closing to the first Explorer content link.

An additional source-level isolated fixture matches the canonical geometry. Its 600×27px header had64 nonidentical pixels out of16200;26 exceeded a maximum per-channel delta of2. This exploratory crop excludes body content and is not a whole-window or whole-site parity score; the main controlled compiled-CSS harness is the release authority. Body content intentionally remains white and16px for reading rather than the reference's grey12px demonstration body.

## Verification and limits

- Focused Vitest:140 tests across6 files pass, including the updated keyboard-exit case; log `unit-tests-round2.txt`.
- `git diff --check` passes for owned files.
- Second-build default/hover/focus/pressed states visually inspected; duplicate glyph resolved and focus ring retained.
- The parent runs final lint/typecheck/build, responsive/RTL/axe and cross-engine gates. These Chromium probes do not independently certify Firefox, WebKit, screen readers or physical touch devices.
- Night's tint and light caption backing, two-tone focus rings, coarse/mobile targets, long-title truncation and white16px research reading surfaces are explicit adaptations. No Microsoft assets were added and no canonical stylesheet was modified.

## Changed source

`src/components/os/win7-windows.css`, `workspace-windows.css`, `reading-window.css`, `WorkspaceWindows.tsx`, `ReadingWindowControls.tsx`; specific window token mappings in `win7-theme.css`; keyboard-exit portion of `ResearchOS.test.tsx` (other changes there belong to root). Root owns governance logs and final reports.
