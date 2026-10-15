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
