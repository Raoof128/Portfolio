# ResearchOS Design System 2026

**Date:** 2026-10-16 · **Branch:** `redesign/apple-2026` · **Owner:** Mohammad Raouf Abedini
**Inputs:** [APPLE_2026_RESEARCH.md](APPLE_2026_RESEARCH.md) (47 official sources), [FRONTEND_BASELINE_AUDIT.md](FRONTEND_BASELINE_AUDIT.md) (91 files plus an 8-lane gap fill), three concept proposals and three lens-specific judges (Haiku 5.5 agents). Final direction chosen by the orchestrator (Claude Opus 5.5).

## 1. Direction and decision

| Concept                          | Credibility/originality judge | Usability/a11y/i18n judge | Performance/fit judge |
| -------------------------------- | ----------------------------- | ------------------------- | --------------------- |
| A. Cupertino Research Laboratory | 7.0                           | **7.25 (winner)**         | **7.3 (winner)**      |
| B. ResearchOS Pro                | 7.1                           | 6.5                       | 6.9                   |
| C. Frontier Research Atelier     | **7.3 (winner)**              | 6.75                      | 6.9                   |

**Chosen:** A as the system, with C's storytelling grafted in. The working name is **ResearchOS: Research Desk**.

> A quiet, editorial research desk. Chrome recedes; evidence and original artwork lead. Glass only where you navigate; every page you read is solid. One accent means "act here", "selected" or "status", and nothing else.

Grafted from C: artwork-led dossier heroes (artwork is content and keeps its own palette), editorial serif display headings, a calm animated 404 vortex in one accent, a visible text state beside the theme switch, the explorer sidebar on logical inset (start edge in LTR, end edge in RTL), text-labelled window step controls.
Grafted from judges: first visit follows `prefers-color-scheme` (an explicit choice persists), platform-correct shortcut hint (⌘K on Apple platforms, Ctrl K elsewhere, plus `aria-keyshortcuts`), accessible names contain visible labels (WCAG 2.5.3), phone labels ≥ 12px, one shared visibility hook for canvases.

**Owner decision recorded (not changed here):** `CLAUDE.md` names cyan `#06b6d4` as the accent. On white it measures about 2.4:1 and fails text contrast, so this system keeps the shipped tokens (`#67dbff` dark, `#0069bb` light). Updating `CLAUDE.md` is a follow-up for the owner.

## 2. Non-negotiables (from the research)

1. **Two layers.** Navigation and controls may be glass: top bar, dock, reading-window title bar, search-dialog header, open menus and the language popup. Everything you read is opaque: reading window body, cards, dossiers, evidence stories, terminal card, résumé, lab, policy, 404. Never glass on glass. (HIG Materials; Adopting Liquid Glass.)
2. **One accent, one meaning.** `--os-accent` marks primary actions, the selected item and active status only. State is never shown by colour alone. Per-app hues, gradient fills, neon glows and coloured shadows are retired. (HIG Branding, Color.)
3. **Case.** English UI labels use title case (`Open Paper`, `Download PDF`, `Copy Link`). Editorial headings and body copy keep source case. `text-transform: uppercase` is removed everywhere. `letter-spacing` is 0 in every locale (never on Arabic or Persian). (Adopting Liquid Glass: section headers.)
4. **Concentric radii.** inner = outer − padding. (Adopting Liquid Glass: controls.)
5. **Motion is optional.** Short, interruptible, transform and opacity only, and `prefers-reduced-motion: reduce` removes it. No infinite decorative loops in chrome. (HIG Motion; Design principles: "Don't mistake delight for decoration.")
6. **Fallbacks.** Reduced transparency, increased contrast, forced colours and no-`backdrop-filter` all produce a solid, legible UI. The base style is opaque; glass is the enhancement.
7. **Licensing.** No bundled SF Pro, SF Mono, New York or SF Symbols. System font stack plus Lucide icons (MIT) and the existing Google fonts.
8. **Contrast.** WCAG 2.2 AA minimum: text 4.5:1 (3:1 large), non-text UI 3:1. Targets 24px minimum, 44px on touch.

## 3. Tokens

Tokens live in **one place**: the `.os-shell` blocks at the top of `src/components/os/research-os.css` (colour, type, space, radius, motion, shadow), with glass and dock tokens in `src/components/os/liquid-glass.css`. Delete duplicates elsewhere.

### 3.1 Colour, dark (default)

| Token                                       | Value                    | Use                                       | Contrast                  |
| ------------------------------------------- | ------------------------ | ----------------------------------------- | ------------------------- |
| `--os-bg`                                   | `#080d19`                | desktop canvas                            | —                         |
| `--os-surface`                              | `#111b2b`                | reading surfaces, cards, tiles            | text 16.0:1               |
| `--os-elevated`                             | `#18243a`                | dialogs, menus, tooltip                   | muted 8.0:1               |
| `--os-text`                                 | `#f1f7ff`                | primary text                              | 18.0:1 on bg              |
| `--os-muted`                                | `#a9bdd0`                | secondary text                            | 10.0:1 bg, 8.95:1 surface |
| `--os-accent`                               | `#67dbff`                | primary action, selection, status         | 12.2:1 on bg              |
| `--os-accent-hover` / `--os-accent-pressed` | `#8be6ff` / `#4fcdf0`    | button states                             | —                         |
| `--os-on-accent`                            | `#080d19`                | text on accent fill                       | 12.2:1                    |
| `--os-accent-tint`                          | `rgb(103 219 255 / 14%)` | selected row/tile background (never text) | —                         |
| `--os-focus`                                | `#67dbff`                | focus ring                                | ≥ 3:1                     |
| `--os-line`                                 | `rgb(184 214 255 / 12%)` | decorative hairlines only                 | —                         |
| `--os-control-line`                         | `#5b7593`                | control boundaries                        | 3.63:1 surface            |
| `--os-scrim`                                | `rgb(8 13 25 / 56%)`     | dialog scrim, no blur                     | —                         |
| `--os-code-surface` / `--os-code-text`      | `#0a1120` / `#dfeaf7`    | terminal and code                         | ≥ 7:1                     |

### 3.2 Colour, light

| Token                                       | Value                                       | Contrast                         |
| ------------------------------------------- | ------------------------------------------- | -------------------------------- |
| `--os-bg`                                   | `#f2f7ff`                                   | text 14.4:1                      |
| `--os-surface` / `--os-elevated`            | `#ffffff` (elevated adds `--shadow-window`) | text 15.5:1                      |
| `--os-text`                                 | `#18243b`                                   | 15.5:1 white                     |
| `--os-muted`                                | `#3d5470`                                   | 7.8:1 white (replaces `#536781`) |
| `--os-accent`                               | `#0069bb`                                   | 5.6:1 white                      |
| `--os-accent-hover` / `--os-accent-pressed` | `#005aa3` / `#004c8a`                       | —                                |
| `--os-on-accent`                            | `#ffffff`                                   | 5.6:1                            |
| `--os-accent-tint`                          | `rgb(0 105 187 / 10%)`                      | —                                |
| `--os-line`                                 | `rgb(36 75 124 / 12%)`                      | decorative                       |
| `--os-control-line`                         | `#6f8399`                                   | 3.90:1 white                     |
| `--os-scrim`                                | `rgb(18 36 61 / 36%)`                       | —                                |
| `--os-code-surface` / `--os-code-text`      | `#eef3fa` / `#14203a`                       | ≥ 7:1                            |

**Increased contrast** (`prefers-contrast: more`, both themes): `--os-muted: var(--os-text)`; `--os-control-line`: `#8aa2bd` dark, `#4a6280` light; `--os-line` alpha 40%; focus ring 3px.
**Retired tokens:** `--os-action`, `--os-action-hover`, `--os-on-action` (alias them to the accent tokens during migration, then remove), every `--os-*-start/-end` per-app gradient, `--os-*-accent` per-app hues, `--os-dock-*-accent`, `--os-success`, `--os-warning` (use text labels with accent or muted dots), the legacy neon `:root` palette in `globals.css`.

### 3.3 Glass (liquid-glass.css only)

| Token                  | Dark                     | Light                    |
| ---------------------- | ------------------------ | ------------------------ |
| `--os-glass`           | `rgb(17 27 43 / 88%)`    | `rgb(255 255 255 / 90%)` |
| `--os-glass-rim`       | `rgb(190 222 255 / 22%)` | `rgb(36 75 124 / 14%)`   |
| `--os-glass-highlight` | `rgb(231 246 255 / 18%)` | `rgb(255 255 255 / 95%)` |
| `--os-dock-selection`  | `rgb(255 255 255 / 10%)` | `rgb(0 105 187 / 9%)`    |

Recipe (one rule, reused): `background: var(--os-glass); -webkit-backdrop-filter: blur(20px) saturate(1.2); backdrop-filter: blur(20px) saturate(1.2); border: 1px solid var(--os-glass-rim); box-shadow: inset 0 1px 0 var(--os-glass-highlight);` No sheen gradient, no additive white glare. Fallback (`prefers-reduced-transparency: reduce`, `@supports not (backdrop-filter: blur(1px))`, `prefers-contrast: more`): `background: var(--os-surface); backdrop-filter: none; border-color: var(--os-control-line);`. Forced colours: `Canvas`/`CanvasText` borders, no shadows or filters.

### 3.4 Type

| Token                     | Value                                                                                         | Use                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `--os-font-ui`            | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif`    | UI and body (Latin, es)                                            |
| `--os-font-display`       | `Charter, "Iowan Old Style", Georgia, "Times New Roman", serif`                               | H1/H2 display and dossier titles only                              |
| `--os-font-mono`          | `var(--font-jetbrains-mono), ui-monospace, Menlo, Consolas, monospace`                        | DOIs, identifiers, kbd, commands only                              |
| fa, ar                    | `var(--font-vazirmatn), Tahoma, "Segoe UI", sans-serif`                                       | all text incl. headings (no serif)                                 |
| zh                        | `"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif` | all text                                                           |
| `--text-xs`               | `0.75rem` (12px)                                                                              | floor for any visible text on phones; 11px only for kbd and badges |
| `--text-s`                | `0.8125rem` (13px)                                                                            | captions, meta, controls                                           |
| `--text-ui`               | `0.9375rem` (15px)                                                                            | shell body, buttons                                                |
| `--text-reading`          | `1.0625rem` (17px)                                                                            | reading body; line-height 1.75 Latin, 1.8 zh, 1.95 fa/ar           |
| `--text-h3` / `--text-h2` | `1.25rem` / `1.5rem`                                                                          | sections                                                           |
| `--text-h1`               | `clamp(2rem, 1.6rem + 2vw, 3rem)`                                                             | page and dossier titles                                            |
| `--text-display`          | `clamp(2.75rem, 2rem + 4vw, 4.5rem)`                                                          | welcome name only                                                  |

Weights 400 body, 500 labels/controls, 600 headings; no 100–300. Reading column `max-width: 66ch` (a web convention, not a HIG value). **Chakra Petch is retired** (remove its `next/font` load in `layout.tsx` and its mappings in `globals.css` and `i18n/index.ts`).

### 3.5 Space, size, radius, shadow, motion

- **Space:** 4px base: 4, 8, 12, 16, 24, 32, 48, 64. Phone gutter 16px everywhere.
- **Sizes:** top bar 44px; window title bar 44px; search field 44px; list rows ≥ 44px; buttons 40px (44px coarse pointer); dock 56px tall, items 40px (44px coarse), 6px padding, 4px gap.
- **Radius:** `--radius-xs` 6px (kbd, tags) · `--radius-s` 10px (buttons, inputs, menu items) · `--radius-m` 14px (cards, tiles, evidence, inner window content) · `--radius-l` 20px (reading window, search dialog, popovers) · `--radius-pill` 999px (dock, switch, status pills). Concentric: window 20px with 6px inset gives 14px content; dialog 20px with 8px padding gives a 12px field.
- **Shadow:** dark `--shadow-window: 0 24px 48px -12px rgb(0 0 0 / 45%)`, `--shadow-dock: 0 8px 24px rgb(0 0 0 / 28%)`; light `0 20px 40px -16px rgb(24 55 104 / 22%)`, `0 8px 20px rgb(24 55 104 / 14%)`. No coloured or neon shadows.
- **Motion:** `--motion-quick: 120ms` (hover, focus, colour) · `--motion-control: 180ms` (disclosure, segmented, tooltip) · `--motion-window: 240ms` (window open/close) · `--ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1)` · `--ease-exit: cubic-bezier(0.4, 0, 1, 1)`. Press feedback `scale(0.98)`. No hover lifts. Reduced motion: transitions ≤ 1ms, no transforms, no loops.

## 4. Components

### Controls (one primitive, defined once)

- **Primary** (`.os-button`, and the supporting/project/document classes mapped onto it): 40px tall (44px coarse), padding `0 16px`, `--radius-s`, `--text-ui` weight 500, no uppercase, no tracking. Fill `--os-accent`, text `--os-on-accent`. Hover `--os-accent-hover`, pressed `--os-accent-pressed` + `scale(0.98)`. Disabled: `aria-disabled` styling with muted text on `--os-line`, not opacity alone.
- **Secondary**: same geometry, transparent, `1px solid var(--os-control-line)`, `--os-text`. Hover background `--os-accent-tint`.
- **Text link**: `--os-accent`, underlined (`text-underline-offset: 0.25em`) in reading contexts.
- **Focus**: global `:focus-visible { outline: 2px solid var(--os-focus); outline-offset: 2px }`; never `outline: none`; `scroll-margin-block: 120px` so the dock and top bar never obscure focus (WCAG 2.4.11).
- **Tooltip**: `--os-elevated`, 13px weight 500, radius 8px, padding 6px 10px, hairline border; appears after 400ms on hover or focus; dismissible with Escape; stays while hovered (WCAG 1.4.13).

### Shell

- **Top bar** (glass, 44px): name or mark once; search trigger with label `Search` and a platform kbd; theme switch; language select; clock in `--os-muted` without uppercase.
- **Theme switch** (kept, retokenised power switch): 44px hit area, 36px round control, 18px power glyph. Off: `--os-surface`, 1px `--os-control-line`, glyph `--os-muted`. On (dark mode): `--os-accent` fill, glyph `--os-on-accent`, no glow. `role="switch"`, `aria-checked`, static accessible name `Dark Appearance` (localised), visible state text beside it on wide screens.
- **Dock** (glass capsule): 56px tall, radius pill, items 40px (44px coarse), 22px monochrome Lucide glyphs in `--os-muted`; current page: glyph `--os-text`, `--os-accent-tint` background and a 4px accent dot. Labels stay visible at ≥ 12px on phones.
- **Desktop home**: flat monochrome tiles (80px, `--radius-m`, `--os-surface`, hairline border, 28px glyph in `--os-text`, 13px title-case label); hover `--os-accent-tint`. No gradients, inset highlights, drop shadows, per-app hues or folder tab. Hero: display serif name, one tagline, one primary + one secondary action. Proof Atlas: solid panel, single-accent strokes, no blue/teal/gold gradient.
- **Welcome (lock) screen**: still wallpaper (`--os-bg` with one radial accent tint at 8% behind the name). **The rain layer is retired.** Sydney clock large and light, date in `--os-muted` sentence case, portrait, display serif name, role, tagline, one primary **Explore the Lab** button, two text links. Enter keeps the 3-second wait: the button becomes `disabled`, focus moves to a polite status line ("Opening the research desk", localised), and a 2px accent hairline (max 240px) fills by `transform: scaleX()` over 3000ms. Reduced motion: the hairline is shown full with no animation. The orange blob loader and rainbow gradient are retired.
- **Reading window**: `--radius-l`, `--shadow-window`, solid body, 6px inset so content corners are 14px. Title bar glass 44px: Back (dir-aware chevron, accessible name contains visible text), centred title with ellipsis, trailing controls. Expand toggle: constant name `Full Size` with `aria-pressed`. Window Controls popover: glass, step buttons with visible text labels. Navigation progress: a 2px accent hairline under the title bar shown only while the next page loads (transform only, static under reduced motion), replacing the 24-block neon scan bar. Tooltips per the control spec. Phones: document flow, no window theatrics.
- **Search dialog**: `--os-elevated`, `--radius-l`, `--shadow-window`; scrim `--os-scrim` with **no blur**; header row glass; body solid. Field 44px, radius 12px, solid `--os-surface`, 1px `--os-control-line`, focus ring accent. Scope bar as a segmented control (selected: accent tint + accent text, never colour alone). Results 44px rows, hairline separators. Result count announced once after typing pauses, not on every keystroke.

### Content

- **Project explorer**: sidebar on `--os-surface` with logical inset; solid filter field; 44px rows; selected row `--os-accent-tint` + accent title + `aria-current`. Index entries are solid cards (`--os-surface`, hairline, `--radius-m`, 24px padding) with hover border `--os-control-line`. No neon edges, glows or gradient borders.
- **Dossier (project detail)**: artwork-led hero (the project's original artwork, its own palette, still poster unless visible and motion allowed), display-serif H1, one primary resource action (Download Paper or Source Code), others as secondary buttons. Heading outline h1 → h2 → h3 with no skipped levels (fixes the baseline Lighthouse heading-order failure). Papers as solid cards.
- **Evidence stories**: solid cards, hairline border, `--radius-m`; selected: 1px accent border + accent tint (one ring, no stacked bars); markers ≥ 12px.
- **Terminal card**: flat `--os-code-surface`, `--radius-m`, hairline, no blur, no typewriter, prompt `$` in `--os-muted` via `::before` with `user-select: none`; header label `Reproduce Locally` and a secondary 32px Copy Commands button; scroll region focusable with an accessible name.
- **Supporting pages** (about, contact, résumé, write-ups, lab, security, hall of fame): reading primitives (display-serif H1, 66ch column, hairline lists, solid callouts, one accent action). Per-category hues, neon HUD frames, `GlowCard`, hover lifts, `animate-ping` and amber/green status colours are retired. Status = 8px dot (accent active, muted outline otherwise) + text.
- **404**: same buttons; locale direction respected; vortex in `--os-accent` alpha steps, no hue-rotate, gentle rise ≤ 24px, loop only when motion is allowed, static otherwise.
- **Artwork**: kept with its own palettes. Pause off-screen through one shared visibility hook; reduced motion renders one still frame.

## 5. RTL and internationalisation

`dir` per locale; logical properties (`inset-inline-*`, `margin-inline-*`, `padding-inline-*`, `border-inline-*`); directional icons flip via `:dir(rtl)` (back/forward chevrons, arrows), while logos, photos, checkmarks, DOIs, years, counts and code stay LTR (`<bdi dir="ltr">`). No letter-spacing on Arabic script. fa/ar headings use Vazirmatn, never the Latin serif. Language and theme switches keep the open window and reading position.

## 6. Retire list (from the audit and Concept A)

`showcase.css` (blueprint grid, neon cards, aurora search, scan bar, tooltips, terminal styling) · `action-buttons.css` (replaced by the control primitive) · `lock-rain.css` · the rainbow Enter CTA and orange blob loader in `welcome-enter.css` · dimensional app icons and per-app gradients · uppercase rules · duplicate glass/dock declarations · the `!important` legacy override · neon `:root` palette, glowing scrollbar and `.glass` utilities in `globals.css` once unused · Chakra Petch · dead classes listed in the audit. Uiverse MIT attributions move to source comments for any element that survives in restyled form (power switch, vortex).

## 7. Verification bar

Lint, typecheck, `test:ci`, `test:schemas`, `test:security`, build, `audit:security`, `audit:agents` all pass; browser checks at 320–1920px in light and dark, all five locales, reduced motion; LCP/CLS no worse than the baseline (395 ms / 0.02 lab, Simurgh, desktop) and Lighthouse accessibility ≥ the baseline 99 with the heading-order failure fixed.

## 8. Colour and motion enhancement (v1.1)

Status: authoritative for v1.1. Extends sections 3.1 to 3.5 and renames nothing. Base: Quiet Depth (concept 1), with the judge-selected grafts from concepts 2 and 3. Every contrast figure below was recomputed in WCAG 2.2 relative luminance (scratch script, 2026-10-16). These are token-pair values, not DOM measurements, so verify in a browser before shipping.

### 8.1 Principles

- Depth comes from a four-step luminance ramp (base, surface, elevated, inset), not from shadows or lifts. Cards and tiles never get a shadow on hover.
- One accent means act, selected or status. Accent text is allowed only on base, surface or white, never on a tinted inset row.
- Glass is for chrome only. Dense glass sits behind text-bearing bars (top bar, window bar). Thin glass sits behind the dock, which holds glyphs only. Reading content is always solid.
- Motion is transform, opacity or colour only, is one-shot for entrances, and can be interrupted. Reduced motion keeps colour and fades and removes transforms and loops.

### 8.2 Corrections to the Quiet Depth values (verified in this pass)

- The light accent on the 10% tint over the base measures 4.54:1, not 4.80:1. Over white it measures 4.86:1 (confirmed). Over the new inset #eaf1fb it measures 4.31:1, which FAILS 4.5:1 for text. Rule: no accent text on a tinted inset row. Use var(--os-text) there and keep the accent for the indicator.
- The dark control line #5b7593 measures 3.26:1 on --os-elevated, which is below the 3:1 non-text floor when it is the only boundary of a control inside a dialog or popover. Use --os-control-line-inset on elevated and inset tiers.
- Light dense glass over black artwork: text 13.57:1, muted 6.81:1, accent 4.92:1 (computed over pure black). The quoted 13.66, 6.85 and 4.95 are close and also pass.
- The wide-gamut accent is inside @media (color-gamut: p3), so sRGB displays never receive it. The #35e1ff clip is the approximate look on P3 hardware. Ratios: 12.35 on base, 11.00 on surface, 9.88 on elevated. All pass.
- Spring fallback: custom properties accept any token sequence, so a second declaration of linear() on the same property is never rejected. A browser without linear() then gets an invalid value and falls back to initial 'ease'. The fallback is therefore the base cubic-bezier declaration, with linear() applied only inside @supports (animation-timing-function: linear(0, 1)), both on .os-shell. Not on :root.
- Press selector: .os-theme-switch::before:active matches nothing useful. Use .os-theme-switch:active::before.
- Window open must not run on first page load, because an opacity-zero window would delay the LCP paint (baseline 395 ms). The open animation is driven by a data-opening attribute set on a user-initiated show.
- Deuteranopia: violet #5a3cc0 and brown #7a4b00 have identical relative luminance (0.092). Under deuteranopia simulation (Machado 2009, severity 1.0) they stay different in hue (roughly rgb 0 82 189 against rgb 102 90 2) but have the same lightness. Hue alone is not a signal. Every evidence category needs an icon and a text label.

### 8.3 Colour tokens

Dark, default (.os-shell in research-os.css):

```
--os-bg: #080d19;                 /* base */
--os-surface: #111b2b;            /* secondary, cards */
--os-elevated: #18243a;           /* popovers, dialogs */
--os-inset: #1d2c46;              /* NEW tertiary: fields and rows inside a card */
--os-control-line: #5b7593;       /* unchanged: bg 4.08, surface 3.63 (not on elevated or inset) */
--os-control-line-inset: #7892b2; /* NEW: bg 6.06, surface 5.39, elevated 4.85, inset 4.37 */
--os-accent: #67dbff;             /* sRGB fallback; bg 12.16, surface 10.82, elevated 9.73, inset 8.76 */
--os-accent-hover: #8be6ff;
--os-accent-pressed: #4fcdf0;
--os-on-accent: #080d19;          /* 12.16 on the sRGB accent */
--os-accent-tint: rgb(103 219 255 / 14%);
--os-focus: #67dbff;
--os-line: #b8d6ff1f;             /* decorative only */
--os-glass-dense: rgb(17 27 43 / 92%);  /* in liquid-glass.css: top bar and window bar only */
```

Dark text: #f1f7ff on base 18.01, surface 16.03, elevated 14.41, inset 12.98. Muted #a9bdd0 on base 10.05, surface 8.95, elevated 8.04, inset 7.25.
Accent on the 14% tint: base 9.26, surface 7.86, elevated 6.98, inset 6.28.

Light (.os-shell[data-appearance='light']):

```
--os-bg: #f2f7ff;
--os-surface: #ffffff;
--os-elevated: #ffffff;           /* depth from --shadow-window, as now */
--os-inset: #eaf1fb;              /* NEW */
--os-control-line: #6f8399;       /* bg 3.63, white 3.90 */
--os-control-line-inset: #6f8399; /* NEW: inset 3.43 (passes 3:1 non-text) */
--os-accent: #0069bb;             /* white 5.62, bg 5.22, inset 4.94 */
--os-accent-hover: #005aa3;
--os-accent-pressed: #004c8a;
--os-on-accent: #ffffff;          /* 5.62 */
--os-accent-tint: rgb(0 105 187 / 10%);  /* accent text on it: white 4.86, bg 4.54, inset 4.31 (FAILS on inset) */
--os-focus: #0069bb;
--os-glass-dense: rgb(255 255 255 / 94%); /* text over black artwork 13.57 */
```

Light text: #18243b on bg 14.42, white 15.51, inset 13.64. Muted #3d5470 on bg 7.23, white 7.78, inset 6.84. Text on the 10% tint over inset is 11.89.

Glass, liquid-glass.css (the recipe, blur, rim and highlight stay as they are):

```
.os-shell { --os-glass: rgb(17 27 43 / 88%); --os-glass-dense: rgb(17 27 43 / 92%); }
.os-shell[data-appearance='light'] { --os-glass: rgb(255 255 255 / 90%); --os-glass-dense: rgb(255 255 255 / 94%); }
.os-topbar, .os-windowbar { background: var(--os-glass-dense); }   /* placed AFTER the shared recipe, BEFORE the fallbacks */
```

The dock keeps --os-glass (thin): it holds glyphs only. Dock labels use --os-text. Accent on thin dock glass is allowed only as a glyph or an indicator (light 90% glass over black gives 4.48:1, which passes only as non-text 3:1). Dense glass measured: dark over white artwork, text 12.83 and muted 7.16; over the flat base, text 16.21.
Fallbacks (prefers-reduced-transparency, prefers-contrast, and no backdrop-filter): --os-glass-dense: var(--os-surface). Forced colours: Canvas background and CanvasText border, no fills.

### 8.4 Wide-gamut accent (dark only)

```
@supports (color: color(display-p3 0 0 0)) {
  @media (color-gamut: p3) {
    .os-shell:not([data-appearance='light']) { --os-accent: color(display-p3 0.44 0.87 1.00); }
  }
}
```

Place this BEFORE the increased-contrast block so that block wins. The sRGB fallback #67dbff stays in the base. Hover and pressed stay sRGB. Do not use the P3 value to carry meaning. The light theme is never widened.

### 8.5 Increased contrast (prefers-contrast: more)

Raise the accent and the boundary together, not the surfaces.

```
@media (prefers-contrast: more) {
  .os-shell:not([data-appearance='light']) {
    --os-accent: #a6ecff;        /* bg 14.85, surface 13.22, elevated 11.88, inset 10.70 */
    --os-accent-hover: #c4f2ff;  /* on-accent 16.17 */
    --os-accent-pressed: #8be6ff;/* on-accent 13.74 */
    --os-focus: #a6ecff;         /* bg 14.85 */
    --os-on-accent: #080d19;     /* 14.85 on the accent */
    --os-control-line: #8aa2bd;  /* bg 7.38, surface 6.57, elevated 5.90, inset 5.32 */
    --os-control-line-inset: #8aa2bd;
    --os-muted: var(--os-text);
  }
  .os-shell[data-appearance='light'] {
    --os-accent: #00528f;        /* white 8.07, bg 7.50, inset 7.10 */
    --os-accent-hover: #00457a;  /* white 9.85 */
    --os-accent-pressed: #003866;/* white 11.95 */
    --os-focus: #00528f;
    --os-control-line: #4a6280;  /* white 6.27, bg 5.83, inset 5.51 */
    --os-control-line-inset: #4a6280;
    --os-muted: var(--os-text);
  }
}
```

Keep the --os-line alpha overrides (#b8d6ff66 dark, #244b7c66 light). Focus ring is 3px under this query. Accent-on-tint under this query: dark bg 10.86, surface 9.19, elevated 8.14, inset 7.32; light #00528f on a 10% tint: bg 6.40, white 6.85, inset 6.07. The owner should confirm the darker light accent (#00528f) since it departs from the brand #0069bb.

### 8.6 Contrast regression guard (new tests required)

Every pair below must stay at or above its floor. Any alpha or token change reruns this table.

- Text 4.5:1: dark text on all four tiers; muted on all four; light text on bg, white, inset; light muted on bg, white, inset; accent-on-tint on base and white (light 4.54 and 4.86, the tightest margins).
- Non-text 3:1: control lines (dark #5b7593 on base and surface only; dark #7892b2 on surface, elevated and inset; light #6f8399 on all three light tiers; increased-contrast values); accent indicators on glass; focus ring.
- Must FAIL and be excluded: light accent text on tint over inset (4.31); dark #5b7593 on elevated (3.26) and on inset (2.94).

### 8.7 Motion tokens and spring curves

Duration and easing tokens (defined in .os-shell):

```
--motion-press-in: 90ms;      /* entering :active */
--motion-press-out: 160ms;    /* release, the base-state transition for transform only */
--motion-quick: 120ms;        /* hover, focus, colour, menus */
--motion-control: 180ms;      /* scrim, tooltips, disclosure, closing window */
--motion-window: 240ms;       /* window and dialog open, theme cross-fade */
--motion-stagger: 16ms;       /* search rows */
--motion-tooltip-delay: 400ms;/* every tooltip, replacing the scattered 400ms values */
--ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
--ease-exit: cubic-bezier(0.4, 0, 1, 1);
--dir-sign: 1;               /* .os-shell:dir(rtl) { --dir-sign: -1; } */
```

Springs, fallback first, linear() only inside @supports:

```
.os-shell {
  --ease-spring-window: var(--ease-standard);   /* fallback: declared first */
  --ease-spring-soft: var(--ease-standard);
}
@supports (animation-timing-function: linear(0, 1)) {
  .os-shell {
    /* zeta 1, omega 8.46, bounce 0: windows and dialogs (ends at 0.998, snaps to 1) */
    --ease-spring-window: linear(0, 0.0493, 0.1576, 0.2855, 0.4117, 0.526, 0.6244, 0.7061, 0.7724, 0.8253, 0.8668, 0.8991, 0.924, 0.9429, 0.9574, 0.9683, 0.9764, 0.9826, 0.9871, 0.9905, 0.993, 0.9949, 0.9963, 0.9973, 1);
    /* zeta 0.8, omega 9.0, peak 1.52% at t 0.58: dock arrival only */
    --ease-spring-soft: linear(0, 0.0575, 0.1875, 0.3438, 0.4982, 0.6354, 0.7488, 0.8372, 0.9028, 0.949, 0.9796, 0.9986, 1.0091, 1.014, 1.0152, 1.0142, 1.0122, 1.0099, 1.0075, 1.0055, 1.0038, 1.0024, 1.0014, 1.0008, 1);
  }
}
```

The VT pseudo-elements sit outside .os-shell and cannot read these tokens, so their rules use literal values (240ms, the standard cubic-bezier).

Press: one shared rule for .os-control, .os-button, .os-button--secondary, .os-document-button, .os-direct-links .os-button, .os-project-explorer .os-project-resource, .os-app-icon, .ui-card--interactive, .os-dock a and .os-enter. Each is scale(0.98) on :active only, with disabled excluded. The theme thumb uses .os-theme-switch:active::before. Base transition: colour at --motion-quick, transform at --motion-press-out. Entering :active uses 90ms because the :active state sets transition-duration: var(--motion-press-in).

### 8.8 Per-component choreography

- Reading window open: os-window-in, 240ms, --ease-spring-window, fill backwards, from opacity 0, translateY(6px), scale(0.985). Runs only when data-opening is set by a user-initiated show. Nothing animates on first load, and nothing animates backdrop-filter or the glass fill.
- Reading window close: data-state='closing' is set together with inert and a focus move to the opener. os-window-out runs for 180ms with --ease-exit (opacity 1 to 0, scale 1 to 0.985, fill forwards). hidden is set on animationend, with a 260ms timeout fallback. pointer-events is none while closing. A reopen during close cancels the timer and clears the state.
- Workspace windows follow the same open and close pattern. The floating window's icon appear (workspace-windows.css:14) moves to --motion-quick and --ease-standard. The default open delay is 0 ms. Set a delay of --motion-quick only if a trace shows the handoff still animating.
- Dock-origin travel (concept 2): NOT in v1.1. The window would need the hidden-attribute rework, which is out of scope.
- Search dialog open: os-dialog-arrive, 240ms, --ease-spring-window, fill backwards, from opacity 0 and translateY(-6px) scale(0.985). Scrim: os-scrim-in, opacity 0 to 1, 180ms, --ease-standard. The scrim colour is var(--os-scrim) with no blur. Results: rows 1 to 6 fade in with translateY(4px), 120ms each, delays 0, 16, 32, 48, 64 and 80ms; rows 7 onwards appear at once. Dialog close is instant in v1.1. The @supports allow-discrete and @starting-style branch is removed.
- Menus and popovers (language, share status, Window Controls): os-menu-arrive, 120ms, --ease-standard, fill backwards, opacity 0 to 1 with translateY(-4px) to 0. No overshoot.
- Dock arrival: one shot. It runs only when the shell carries data-arriving, which the welcome Enter sets. os-dock-arrive runs from translate(-50%, 8px) to translateX(-50%) over --motion-window with --ease-spring-soft (1.5% overshoot). Hover and focus on dock items stay colour-only at --motion-quick. No magnification, bounce or loops.
- Tiles: .os-app-icon hover moves background to --os-accent-tint at --motion-quick. Press uses the shared scale.
- Cards: .ui-card--interactive hover moves background to --os-inset and border to --os-control-line-inset at --motion-quick. Press uses the shared scale. No shadow, lift or accent wash. In light, the card goes from white to #eaf1fb.
- Reading card: .os-reading-card transitions border-color, background-color and colour at --motion-control with --ease-standard. The .os-reading-card * descendant rule is removed.
- Welcome hairline: scaleX fill over the inline 3000 ms with --ease-standard (not linear). Total wait is unchanged, and the button stays disabled.
- Navigation hairline: one keyframe, os-scan-grow, scaleX 0 to 1 over --motion-control. The separate 1.6 s workspace scan and the 3000 ms scan are both removed.
- Theme switch: the default path is a transient class. JS sets data-theme-switching on the shell for 240 ms (--motion-window) with the same synchronous change of data-appearance. The CSS transitions background-color, border-color, colour, fill and stroke for that window only. html:has(.os-shell[data-theme-switching]) cross-fades the page background. Under reduced motion the class is never set and the flip is instant. The View Transitions path (document.startViewTransition, cross-fade of root, opacity only, under 300 ms) ships DISABLED behind a constant, and is enabled only after a frame-cost trace on the Proof Atlas and the 404 vortex. The reading body never gets view-transition-name.
- Wallpaper (concept 2 graft): one static radial accent wash at 8% of --os-accent, split into two layers. Each layer is opacity-only and cross-fades by data-appearance over --motion-window. No loops.
- Scroll progress rail (concept 3 graft): a 2px accent rail on html:has(.os-shell)::after, scaleY from scroll(root block), inside @supports (animation-timeline: scroll()) and no-preference. No JS per frame.
- Evidence reveal (concept 3 graft): opacity and translateY(12px) on evidence cards only, inside @supports (animation-timeline: view()) and no-preference, with animation-range entry 0% entry 40%. Fill mode none, so content is visible by default, in print, and without JS.
- Proof Atlas: node transform at --motion-window; edge opacity at --motion-window only (the stroke-dashoffset transition is removed); figure parallax at --motion-control.
- 404 vortex: keeps its loop, only inside no-preference, with the period and stagger moved to local tokens (3s and 0.08s) and --ease-standard.
- Dynamic tooltip delay: every tooltip uses --motion-tooltip-delay for its show delay. Escape and dismissal stay instant.
- Sliding selection marker and dock indicator (concept 3 graft): CONDITIONAL. It needs one JS write per selection (one offsetTop read) in ResearchOS.tsx, which no lane owns. Until granted, the indicator is a static ::after. When it ships: translate: calc(var(--marker-x) * var(--dir-sign)) 0, with inset-inline-start, height from 1lh (computed line-height), never a layout property.

### 8.9 Reduced motion (one rule, research-os.css)

Under @media (prefers-reduced-motion: reduce):

- animation: none !important on .os-shell and all descendants and pseudo-elements, including the dock arrival, window open, search rows, scrim and vortex. Fixed or still states stay visible.
- transition-property: background-color, border-color, color, opacity !important with transition-duration: var(--motion-quick) !important. Colour and fades stay (fade or nothing is allowed). transform is not transitioned.
- transform: none !important on every press selector in :active, including .os-theme-switch:active::before.
- scroll-behavior: auto !important.
- Windows and dialogs open and close instantly with no closing state. Menus and the scrim are instant too (decision: one rule, no fade-opt-in in v1.1).
- The dock arrival and the welcome hairline show their end state. The navigation hairline is shown full and static.
- ::view-transition-group, old and new: animation none. startViewTransition is never called.
- The spring curves are never used. The scale, parallax and overshoot disappear.
- Tooltips keep their --motion-tooltip-delay, which is not overridden.
- Forced colours, no backdrop-filter and reduced transparency keep solid surfaces. The spring has no effect on them.
- globals.css is changed to match: colour and opacity only at 120ms in its reduce block.

### 8.10 Ownership gaps and deferred items (orchestrator decisions required)

1. src/components/os/ResearchOS.tsx is in no lane. It holds the reading window's hidden toggle (about lines 985 to 992), the theme switch handler (about line 752), the appearance flip (line 694) and the dock mount. Needed for the reading-window closing state and data-opening, and the theme-switch class. Fallbacks if not granted: the reading window closes instantly, and the theme flip is an instant token flip. Both acceptable for v1.1.
2. The new token-ratio test file (quiet-depth-contrast.test.ts) is outside the foundations owned list. Grant it to foundations.
3. The dossier hero wash needs a per-artwork hue value, which would come from ProjectDetailClient.tsx (not owned, and data.ts must not change). Deferred.
4. The sliding selection marker needs the JS in gap 1. Deferred.
5. The owner must confirm the increased-contrast light accent #00528f and the open CLAUDE.md cyan (#06b6d4) owner decision.

### 8.11 Verification before shipping

- Trace the window open and close and the theme switch in Chrome and Safari, with the press timings (90ms and 160ms) and the dialog timings checked.
- Check light, dark, increased contrast, reduced transparency and reduced motion, each alone and in pairs, at 320, 390, 1024 and 1920px, in fa and ar with RTL.
- LCP against the 395 ms baseline after the dossier wash and the wallpaper change. Frame cost of the VT snapshot on the Proof Atlas and the 404 before the constant is enabled.
- Confirm the workspace handoff (workspace-windows.css:14) settles before the window animates.
- Verify the Lighthouse reduced-motion and accessibility audits.
- Run lint, typecheck, test:ci and build. Recheck any colour pinned by a shipped test; do not change content assertions.
- Dark tokens are authored, not inverted. Light values are not generated from dark ones.

## 9. Showstopper layer (v2.0, owner decision 2026-10-16)

### 9.1 Decision and scope

- Owner feedback: the v1.x restrained design is too plain. The target is the apple.com marketing register: a cinematic dark stage, large confident type, a multi-hue glow (blue, violet, pink, orange), luminous edges, depth, spring motion and cursor-reactive light. It must stop someone on first paint and still read as premium.
- v2.0 supersedes the v1.0 rules "no gradients, no glow, no loops" for the brand layer only: the welcome stage, the desktop hero, the Proof Atlas rail, the app tiles, the dock and window accents, and the 404. Reading content (body text, paper titles, résumé text, forms, citations) stays on solid surfaces and passes 4.5:1 in both themes.
- Base: Concept 1 (Intelligence Glow), with the grafts listed in the brief. The palette is this brand's own choice. It is not attributed to Apple, whose overview CSS does not supply it.
- Out of bounds: no edits to src/i18n locale strings, public/, or src/lib/data.ts; no new copy; no images, fonts or libraries; no git commit, push or deploy.
- Verified in this pass (2026-10-16): token values and contrast were computed with a script over the real research-os.css tokens. DOM facts were checked in ResearchOS.tsx, Desktop.tsx, welcome-enter.css, signal-vortex.css and data.ts (13 category lines: OFFENSIVE 2, DEFENSIVE 3, ENGINEERING 8).

### 9.2 Resolved conflicts (read before implementing)

1. Loops. Concept 1 proposed a 14s halo spin and a 24s aurora drift. The grafted rule "no infinite animation, WCAG 2.2.2 by construction" wins for v2.0. Result: zero infinite animations in the welcome, the desktop and the 404. The halo and the aurora are static. No pause control is added, so the top bar keeps its button count. Bringing a loop back needs a separate owner decision and a visible pause control.
2. Portrait halo. .os-lock-profile is a flex column that wraps the portrait img and h1#os-lock-name (and more). It is not an 84px square, so Concept 1's ::before halo on that box is wrong. The ring is painted on the img itself: a conic background, 3px padding, border-box sizing at 84px, and a box-shadow glow. The outer box stays 84px, so nothing moves and CLS stays 0. The portrait is shown 78px inside the ring.
3. Enter face. A static titanium face replaces accent or stop-coloured fills. The four glow stops appear only as a masked 3px outer ring and a box-shadow.
4. Light sweep. None. The one-shot name sweep is dark only.
5. Light text. The brief's assumed light values are replaced by the real tokens in research-os.css: --os-text #18243b (14.42:1 on #f2f7ff, 15.51:1 on #ffffff) and --os-muted #3d5470 (7.23:1 on #f2f7ff). The assumed #0b1626 is dropped.
6. Aurora estimate. The brief's estimate (#0f1d36, muted 8.7:1) is wrong. A 22% blue composite over #080d19 is #1f2f4c, with muted text at 6.93:1. A single pink layer at 35% gives muted 4.89:1, and stacked radials can fall lower, so the aurora must be measured on rendered pixels.
7. Proof Atlas. Light pulses along the paths are cut, because they would animate stroke-dashoffset, which the transform and opacity rule forbids. The glow behind the figure is omitted in v2.0. The atlas keeps the scroll-linked hairline and static luminous nodes.
8. 404 vortex. signal-vortex.css line 40 is infinite. It becomes finite: iteration-count 2, period at most 2.2s, with the longest ring finishing within 5s. Finite motion of 5s or less is outside WCAG 2.2.2, so the lint rule needs no allowlist.
9. Name font. --os-font-display is Charter today. v2.0 uses the system sans through one token (--os-name-font: var(--os-font-ui)) because the brief asks for a confident sans. The owner must confirm this. Setting the token back to var(--os-font-display) reverts it.
10. Name size and short windows. --text-display was measured against the shipped clamp. v2.0 applies clamp(2.75rem, 1.8rem + 3.6vw, 5rem) to the welcome name only, capped at 3.5rem below 740px tall and at 4rem below 800px tall. Re-measure at 1440x700, 1920x1080 and 390x844.
11. Stat labels. The labels reuse the existing os-copy keys categoryOffensive, categoryDefensive and categoryEngineering. The counts come from a build-time reduce over data.ts in Desktop.tsx (13 total; OFFENSIVE 2; DEFENSIVE 3; ENGINEERING 8).
12. Spotlight and dock origin. Both live in src/components/os/spotlight.ts as two listeners behind one mount function. The spotlight is gated to fine hover pointers. The dock-origin capture always runs, because it causes no motion.

### 9.3 Signature palette (tokens, flat at the top of each shell block)

Dark (.os-shell, default):

- Base and tiers (existing): bg #080d19, surface #111b2b, elevated #18243a, inset #1d2c46.
- Text #f1f7ff; muted #a9bdd0.
- Glow stops: blue #6fa8ff, violet #b49cff, pink #ff8fd0, orange #ffb36b.
- --os-glow-gradient: linear-gradient(100deg, blue 0%, violet 35%, pink 65%, orange 100%).
- --os-glow-conic: conic-gradient(from 0deg, blue, violet, pink, orange, blue).
- --os-rim-gradient: conic-gradient(from 200deg, blue, violet, pink, orange, blue).
- --os-rim-solid #7892b2 (prefers-contrast: more); --os-rim-opacity .5; --os-dock-rim-opacity .6.
- --os-aurora-alpha 22%; --os-halo-alpha 28%; --os-spotlight-alpha 12%.
- --os-titanium-top #e9eef6; --os-titanium-bottom #aab6c8; --os-titanium-ink #080d19.
- --os-sweep-band rgb(255 255 255 / 35%).
- --os-name-font var(--os-font-ui); --text-showstopper-name clamp(2.75rem, 1.8rem + 3.6vw, 5rem); --text-showstopper-figure clamp(3.5rem, 2.8rem + 3vw, 5rem); --motion-sweep 1600ms.

Light (.os-shell[data-appearance="light"]):

- Glow stops: blue #1d5fd6, violet #6a3fd6, pink #b8236f, orange #a84a06. The gradient and conic tokens are redefined from these stops.
- --os-rim-solid #6f8399; --os-rim-opacity .35; --os-dock-rim-opacity .35.
- --os-aurora-alpha 11%; --os-halo-alpha 14%; --os-spotlight-alpha 8%.
- --os-titanium-top #ffffff; --os-titanium-bottom #d6dfec; --os-titanium-ink #18243b.

Contrast, computed in WCAG relative luminance:

- Dark stops on bg / surface / elevated / inset: blue 8.06 / 7.17 / 6.45 / 5.81; violet 8.45 / 7.52 / 6.76 / 6.09; pink 9.33 / 8.30 / 7.46 / 6.72; orange 11.01 / 9.80 / 8.81 / 7.94. Every stop clears 4.5:1 as text.
- Dark text on bg / surface / elevated / inset: 18.01 / 16.03 / 14.41 / 12.98. Muted: 10.05 / 8.95 / 8.04 / 7.25.
- Light stops on page #f2f7ff / white / inset #eaf1fb: blue 5.33 / 5.74 / 5.05; violet 5.93 / 6.37 / 5.61; pink 5.57 / 5.99 / 5.27; orange 5.35 / 5.76 / 5.07.
- Light text #18243b: 14.42 on page, 15.51 on white, 13.64 on inset. Muted #3d5470: 7.23, 7.78, 6.84.
- Enter label: #080d19 on the dark titanium face is 9.46:1 at the bottom stop (higher at the top). #18243b on the light face is 11.54:1 at the bottom stop.
- Aurora composites, dark 22%: blue #1f2f4c (muted 6.93, each stop 5.56 or better); violet #2e2c4c (muted 6.88); pink #3e2a41 (muted 6.75). The 35% variant is measured only at the single-layer level (pink gives muted 4.89) and must be re-measured with the stacked layers.
- Aurora composites, light 11%: blue #dbe6fa (ink 12.34, muted 6.19); violet #e3e3fa (ink 12.28, muted 6.16); pink #ece0ef (ink 12.16, muted 6.10).
- Spotlight composites, dark 12%: over bg #132635 (muted 8.02); over surface #1b3244 (muted 6.86); over elevated #213a52 (muted 6.07). Light 8% over white #ebf3fa (ink 13.83, muted 6.94).
- Silver sweep band (dark only): white at 35% over each stop raises the text luminance and gives at least 11.13:1 on bg.
- Gradient text rule: use it at 24px or larger only, where every stop clears 3:1 on the composite it sits on. The gradient is never used on body copy.

### 9.4 Effects per surface

- Welcome (section.os-welcome): static aurora as radial gradients in ::before, masked to the top half, no filter. Portrait: static conic ring plus box-shadow glow. Name (h1#os-lock-name): gradient text with a solid var(--os-text) fallback, one-shot sweep in dark only. Enter: static titanium face with a masked 3px outer ring and a violet glow. The loader and its 3s timing are unchanged. The clock is unchanged.
- Desktop hero: the familyName span in .os-intro h1 takes the gradient (solid fallback). The givenName keeps the solid colour. An aurora sits behind the heading band only (.os-desktop-identity--atlas::before, masked so the summary and links sit on the solid surface). The desktop spotlight field is a 520px radial in ::before on .os-desktop, transform-only, at 12% accent.
- Bento (.os-app-grid): four columns; Projects spans 2x2; the other four fill the 2x2 block to its right. Below 700px, one column with 1x1 tiles. Each tile is a solid var(--os-surface) with a 1px var(--os-line) border, a static rim on ::after, and a per-tile spotlight on ::before (solid tiles only, never glass). Tile accents: Projects blue, Research violet, About pink, Résumé orange, Contact blue. The Projects tile carries the stat callout: a gradient 80px figure "13" and the three category counts.
- Proof Atlas: a 2px full-width hairline on section.proof-atlas--desktop::before, static by default and scaleX-drawn by view() where supported. Luminous nodes as static halo fills on the desktop variant only.
- Dock: a static 1px conic rim on .os-dock::before (masked, opacity .6 dark and .35 light); the liquid-glass blur is untouched. Each item has its own --app-glow, shown as a static box-shadow on hover; the current item gets a 2px gradient bar on a::before, with the existing ::after dot kept.
- Windows: a focused-window rim on ::after (inset -1px) fades in over 180ms. The open animation is @starting-style with transform-origin from the dock item's x position. Dense chrome keeps the existing blur 7px. No new backdrop-filter anywhere.
- Search dialog: @starting-style entrance; no spotlight; static rim only.
- Projects index: a static rim on the row under focus-within. Thumbnails stay lazy and un-animated.
- Project detail and papers: solid surfaces; a static rim on paper cards on hover only; download and DOI links unchanged.
- Research and write-ups: no decoration.
- About and résumé: solid --os-surface text. Only the gradient display heading (on the page h1, at 24px or above) is allowed.
- 404: a static rim on the card, and the vortex is finite (see 9.2).

### 9.5 Motion choreography (exact timings)

- Welcome first paint: t=0 nothing animates. The portrait is never faded (it is the LCP element). Name sweep: starts at 200ms, lasts 1600ms, ease var(--ease-standard), one shot with backwards fill; dark only. Clock, role and intro may use a staged 240ms opacity and translate entrance with delays of 0, 60 and 120ms, provided they are not LCP candidates; measure first.
- Enter: hover and press use the existing 120ms and 160ms transitions. The 3s fill is unchanged.
- Desktop tiles: scroll-linked rise (translate 24px to 0, opacity 0 to 1) over animation-range entry 0% to entry 40%, animation-fill-mode backwards so hover transforms work after the reveal.
- Atlas hairline: scaleX 0 to 1 over animation-range entry 0% to entry 40%, under @supports and no-preference.
- Dock: hover magnification at 180ms (var(--ease-standard)) only on fine pointers, with the neighbours at 1.12 and the hovered item at 1.25. Icon glow box-shadow 180ms.
- Windows: @starting-style, 240ms var(--ease-spring-window) when supported, otherwise var(--ease-standard). Close keeps the existing os-window-out.
- Search dialog: @starting-style, 240ms.
- Focus rim: opacity 0 to 1 over 180ms.
- Spotlight: per-frame transform via requestAnimationFrame, no transition.

### 9.6 Reduced-motion stills

- Under prefers-reduced-motion: reduce, no animation runs. Stills: the static conic ring, the static aurora, the gradient name (no sweep), all tiles visible at opacity 1 with no transform, the atlas hairline full width, no dock magnification, no spotlight, and windows and dialogs appear without transition (0ms).
- There is no tilt and no parallax anywhere in v2.0.

### 9.7 Performance budget and fallbacks

- Added CSS is about 6 KB raw. Added JavaScript is under 1.5 KB (spotlight.ts). Zero images, fonts or libraries.
- No filter blur anywhere in v2.0, so the old 10px blur risk is removed. Glows are box-shadow or gradient, painted once.
- Only transform and opacity are animated. No loops, no width, height, top, left, box-shadow or background-position transitions, except the one-shot name sweep (background-position on h1, once, dark only).
- CLS is 0: every layer is absolutely positioned with pointer-events none, and the portrait box stays 84px.
- LCP is unchanged: the portrait on the welcome and the hero h1 on the desktop. Measure before and after with web-perf at 1440x700, 1920x1080 and 390x844.
- Fallbacks: color-mix() is used for alpha with an opaque fallback first where cheap. The view() rules and @starting-style rules are behind @supports, so unsupported browsers keep the static state. Gradient text keeps a solid fallback. Forced-colors and prefers-contrast resets apply to every gradient-text element.
- Glass rules: no mix-blend-mode and no opacity below 1 on any glass ancestor.

### 9.8 Verification gates

- Token edits: run quiet-depth-contrast.test.ts and reading-contrast.test.ts after each edit.
- New tests: showstopper-motion.test.ts (fails on 'infinite' in the os, ui and global CSS files in scope); showstopper-contrast.test.ts (every stop against bg, surface, elevated, inset and the composites above, in both themes); showstopper-forced-colors.test.ts (each background-clip:text selector has the forced-colors reset); spotlight.test.ts (fine pointer only, pointerType mouse only, no listener under reduced motion).
- Screenshots: the aurora at 22% and at 35% (static) in both themes, judged for loudness. The 35% variant is adopted only if the muted composite stays at 4.5:1 or higher.
- Fonts: check Vazirmatn (fa, ar) and the Arabic display strings for clipping of diacritics; check zh letter-spacing.
- Browser: confirm the view() timeline in Chrome; live-test Firefox and Safari before claiming support (Firefox 161 per caniuse; Safari 26 per caniuse, 19 per WWDC25). Do not claim support before a live test.

### 9.9 Owner decisions and risks

- Restraint risk: the owner asked for shock on first paint. Without loops the first paint depends on the gradient name, the halo and the sweep. A louder variant (aurora 35%, full bleed) is a token change, decided after the screenshot.
- Loops: reinstating the halo spin (14s) or the aurora drift (24s) is a separate decision that also needs the visible pause control.
- Font: sans (default) or Charter (keep). One token.
- Enter face: titanium (default) or accent fill.
- Atlas pulses: cut in v2.0.
- Stat callout accessibility name: the link name gains the figures. Accepted if the ResearchOS and OSApplicationBridge tests pass; otherwise add the text as an sr-only sibling.
- Attribution: the palette is this brand's own. It is not attributed to Apple.

## 10. Windows 7 Aero edition (v3.0, owner decision 2026-10-16)

### Decision

The owner asked for the whole ResearchOS interface to be restyled in a Windows 7 Aero look, built on 7.css v0.21.1 (MIT, khang-nd.github.io/7.css). Rules:

- Only dist/7.scoped.css is loaded, imported from ResearchOS.tsx and global-not-found.tsx. Every 7.css rule is prefixed .win7, so the unscoped sheet is never loaded.
- The shell root is div.os-shell.win7. The global 404 wrapper is main.global-not-found.win7. Nothing else is wrapped.
- Two themes: Aero (light, sky-blue wallpaper) and Aero Night (dark, navy wallpaper, darker glass). Window bodies are white in both, so reading contrast stays high.
- The Aero layer is a set of CSS files loaded after research-os.css and liquid-glass.css. Those two files stay as the source of the --os-* roles that the contrast tests read.

### Trademark and copy boundaries

- No Microsoft or Windows logo, flag, wallpaper image or Segoe UI font file. The word Windows does not appear in UI text, i18n strings, class names or attributes. Code comments say Aero or Win7.
- Wallpapers are CSS gradients only. The Start orb is the existing R monogram (OSMark) in a glossy orb. Icons stay Lucide inside glossy tiles.
- Font stacks do not name Segoe UI. The research flagged the name and the owner rule bans it; macOS falls through to system-ui anyway. Vazirmatn stays for fa and ar, JetBrains Mono stays for code.
- No new webfonts, images or libraries beyond 7.css.
- Not edited: src/i18n, src/lib/data.ts, public/, os-copy.ts, window-copy.ts. Accessible names come from those files and stay exact.

### Component mapping

- Welcome screen becomes the logon: section.os-welcome on the wallpaper. The portrait sits in a white user-tile frame, h1#os-lock-name is the name, Enter is a round glossy arrow button. The 3-second wait shows a progress bar and a busy spinner beside the existing status line.
- Top bar and dock become one bottom glass taskbar. The Start orb is a.os-dock-home (the R home link). Pinned apps are a.os-dock-app. The tray on the right holds the brand (icon only, sr-only text), search, lock, theme switch (role=switch), language (details, shown as a short code) and the clock with the date.
- Search dialog becomes the Start menu above the orb: white left pane (heading, count, results, search field at the bottom), dark glass right column (scope buttons, key hints).
- Reading windows become .window.glass with .title-bar (back button, title, caption controls) and .window-body.has-scrollbar. Caption buttons: Minimise (is-minimize), Maximise or Restore (is-maximize or is-restore, from aria-pressed), Close (is-close). Copy link and move/resize sit in the caption group.
- Desktop hero becomes a Getting Started window (section.os-intro, eyebrow moved into the title bar).
- Proof Atlas becomes a window; its heading acts as the title bar.
- App tiles become desktop icons (a.os-app): uniform glossy tiles, label plates, Win7 selection. Hues are retired.
- Project explorer becomes Windows Explorer style in the sense of layout only: address bar (div.os-explorer-address, aria-hidden), navigation pane (aside.os-explorer-sidebar) as a tree, listview rows (.os-project-rows), status bar (.os-explorer-footer).
- Project dossier becomes a properties page with groupbox-style sections.
- Terminal card becomes a command prompt window: black console (pre.os-terminal-body) with a glass title bar.
- 404 (global and locale) becomes a Win7 error dialog: title bar with the 404 code, the existing inline error svg, Win7 buttons.
- Contact and language groups become fieldset/legend groupboxes with 7.css inputs.

### Tokens

Declared on .win7 in win7-theme.css. Light (Aero) is the default. Night overrides with the selectors .win7[data-appearance=dark] and [data-appearance=dark] .win7 (both needed: the shell carries both, the 404 wrapper sits under html).

- --win7-wallpaper: light radial-gradient(120% 55% at 20% 108%, #d8f1ff 0%, transparent 60%), radial-gradient(70% 38% at 88% 2%, rgba(255,255,255,.75), transparent 62%), a faint diagonal streak, linear-gradient(180deg, #1c63ad 0%, #3a8fd6 45%, #6cb8ec 74%, #2a78c0 100%). Night: radial-gradient(120% 55% at 22% 110%, #1f4f8a 0%, transparent 60%), radial-gradient(80% 40% at 90% 0%, rgba(120,170,230,.18), transparent 60%), linear-gradient(180deg, #030813 0%, #0a1d3a 48%, #040a16 100%).
- --win7-glass-tint: light rgba(196,228,250,.42) | night rgba(14,36,72,.62).
- --win7-glass-tint-solid (reduced transparency): light #bcdcf5 | night #17335e.
- --win7-glass-blur: 14px (8px on phones; 0 under reduced transparency).
- --win7-glass-edge (inner white highlight): light rgba(255,255,255,.85) | night rgba(255,255,255,.22).
- --win7-frame-border: light rgba(16,48,92,.8) | night rgba(0,0,0,.85).
- --win7-frame-shadow: 0 8px 24px rgba(0,0,0,.35) plus inset 0 1px 0 var(--win7-glass-edge).
- --win7-title-base (also --w7-w-bg): light #5b93cc | night #1d3c68.
- --win7-title-bg (also --w7-w-glass): linear-gradient(180deg, rgba(255,255,255,.6) 0%, rgba(255,255,255,.08) 50%, transparent 52%, rgba(255,255,255,.14) 100%) over var(--win7-title-base).
- --win7-taskbar-bg: light linear-gradient(180deg, rgba(214,238,252,.72), rgba(120,180,230,.62)) | night linear-gradient(180deg, rgba(40,78,130,.72), rgba(10,26,52,.82)).
- --win7-taskbar-solid: light #cfe9fa | night #15294a.
- --win7-text-glass (text on glass and taskbar): light #000000 | night #ffffff.
- --win7-text-shadow: light 0 0 6px rgba(255,255,255,.85) | night 0 1px 2px rgba(0,0,0,.85).
- --win7-plate (dark translucent plate behind labels and logon text): light rgba(0,22,46,.55) | night rgba(0,0,0,.5). Text on a plate is #ffffff.
- --win7-body-bg #ffffff (both). --win7-body-text #000000 (both). --win7-body-muted #3d3d3d (both).
- --win7-link #0066cc (both, 5.56:1 on white). --win7-link-hover #003d99 (both, about 9.9:1).
- --win7-select-bg: linear-gradient(rgba(204,236,252,.95), rgba(144,205,245,.9)) with black text. --win7-select-border #6fb8ec.
- --win7-focus: light #0066cc | night #9fd4ff.
- --win7-orb-grad: radial-gradient(circle at 50% 32%, #f1fbff 0%, #9bdcff 18%, #2f8fe0 58%, #0c4c97 100%) (night outer stop #0a3570).
- --win7-tile-bg: light #3b8bd4 | night #24558f.
- --win7-start-right (Start panel right column, both themes): linear-gradient(180deg, rgba(30,72,122,.94), rgba(12,30,58,.96)), text #ffffff.
- --win7-progress-fill #0e7a2e (both). --win7-danger #c42b1c (both).
- --win7-font: ui-sans-serif, system-ui, -apple-system, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif. fa and ar override --win7-font to var(--font-vazirmatn), system-ui, sans-serif. zh keeps the research-os zh stack.
- --w7-font: var(--win7-font). --w7-surface #f0f0f0. --w7-tab-bg #ffffff. --w7-link-c var(--win7-link). --w7-link-c-h var(--win7-link-hover). --w7-title-c #000000.
- Sizes: --win7-ui-size 13px; --win7-small-size 12px (minimum); --win7-body-size 16px.
- Geometry: --win7-taskbar-h 44px (52px on phones); --win7-orb-size 40px (44px phones); --win7-pin-h 36px (44px phones); --win7-tray-w 340px; --win7-title-h 30px; --win7-caption-w 30px (44px phones); --win7-radius 6px (windows), 3px (controls).

### Contrast (WCAG 2.2 AA, estimates from flat colours)

- Body #000 on #fff about 21:1. Muted #3d3d3d on #fff about 10.8:1. Link #0066cc about 5.56:1. Link hover #003d99 about 9.9:1.
- Black title text on #5b93cc about 6.5:1. White on night title base #1d3c68 about 11.7:1.
- Plain white text on the light wallpaper mid-blue is about 3.3:1, which fails for small text. Desktop labels, logon text and captions therefore sit on --win7-plate (about 6:1 estimated). Text-shadow does not count toward contrast.
- Taskbar text on the composite glass is estimated above 10:1.
- Progress fill #0e7a2e: about 5.5:1 on white and about 4.0:1 on a #ddd track (passes the 3:1 non-text rule). The 7.css default #0bd82c is about 1.4:1 and must not be used.
- Focus rings #0066cc (light) and #9fd4ff (night).
- Glass areas must be checked with a real screenshot and a contrast tool before sign-off.

### Typography

- UI labels 13px. Small text 12px minimum. Reading body 16px, line-height 1.55. Headline (h1 on the hero and logon) clamp(28px, 4.2vw, 40px), weight 300.
- Nothing below 12px. Buttons, tree and list rows use 13px.

### Geometry

- Taskbar 44px on desktop, 52px at 700px and below.
- Orb 40px desktop, 44px phones. Pinned buttons 36px desktop, 44px phones (44px minimum target on phones).
- Tray 340px on desktop. Tray chips 28px desktop, 44px phones.
- Start panel: width min(560px, 100vw), height min(600px, 100dvh minus taskbar minus 16px), bottom edge 4px above the taskbar.
- Window title bar 30px. Caption buttons 30 by 22px desktop, 44 by 44px phones. Frame: 4px glass border around a white body, radius 6px.
- Desktop icon cell 104px wide; glossy tile 52px.
- --os-dock-clearance = taskbar height plus 24px plus env(safe-area-inset-bottom).

### Window anatomy

Glass frame (title gradient, 4px edge) > .title-bar (back button, title text, caption group) > .window-body (white, has-scrollbar) > optional footer styled as a status bar (--w7-surface) > resize grip at the inline-end bottom corner.

### RTL

All new CSS uses logical properties (inset-inline, margin-inline, padding-inline, border-inline-end). The taskbar, tray, caption group and Explorer pane mirror through dir on html. Only the back-arrow icon is flipped, with :dir(rtl). fa and ar use Vazirmatn.

### Phones (700px and below)

- Taskbar 52px. The pinned-app row scrolls inside the bar (its own scroller, not the page). Pin labels are visually hidden and the icon keeps a 44px target. The tray keeps language, theme, search and time.
- Windows are full width and full height above the taskbar, with no radius. The override uses !important to beat the inline rect.
- Desktop icons in a 4-column grid. Windows stack.
- Nothing wider than the viewport at 320px. No page-level horizontal scroll.

### Motion, transparency and forced colours

- prefers-reduced-motion: no animation or transition, including the 7.css pulses and the progress motion. State changes are instant. The 3-second welcome timer stays, but the bar shows a static 40 percent fill and the spinner is static.
- prefers-reduced-transparency: backdrop-filter removed; glass tokens switch to the solid variants.
- forced-colors: gradients and shadows removed, system colours used, focus outline kept.

### Retired

- showstopper.css (Intelligence Glow), welcome-show.css, desktop-show.css, dock-show.css.
- Pointer light (--mx, --my) in spotlight.ts. The dock-origin handler stays only while the window open animation reads it.
- Per-app hue palette, dock neighbour magnification, floating top bar, the Quiet Depth shell skin. research-os.css and liquid-glass.css stay as token sources for the contrast tests.

### Risks and follow-ups

- package.json and package-lock.json are modified in the working tree (7.css 0.21.1 pin). Mention this to the owner before any commit.
- The Raouf Change Protocol requires AGENT.md and CHANGELOG.md entries before a commit. The lanes do not write them.
- The lanes do not commit, push or deploy.
- ResearchOS.tsx is edited by three lanes: foundations first, then taskbar and windows. Each re-reads the file before every Edit and touches only its own blocks.
- Firefox does not show 7.css styled scrollbars. Accepted.
- Open: src/i18n/index.ts still names "Segoe UI" in its fontFamily strings (en, es, zh and the rest). The locale layout applies that string inline, so the font rule is not yet met at the page body. The file is outside this run's edit list and the owner decides whether to change it. src/app/globals.css no longer names it.
- Open: InvisibleWindowEvidenceStory.tsx labels one platform button "Windows 10/11". It is research content, not chrome, and the file is outside this run's edit list. The owner decides whether that label stays or becomes a copy change.
