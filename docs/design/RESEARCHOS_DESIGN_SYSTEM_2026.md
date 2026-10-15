# ResearchOS Design System 2026

**Date:** 2026-10-16 · **Branch:** `redesign/apple-2026` · **Owner:** Mohammad Raouf Abedini
**Inputs:** [APPLE_2026_RESEARCH.md](APPLE_2026_RESEARCH.md) (47 official sources), [FRONTEND_BASELINE_AUDIT.md](FRONTEND_BASELINE_AUDIT.md) (91 files plus an 8-lane gap fill), three concept proposals and three lens-specific judges (Haiku 5.5 agents). Final direction chosen by the orchestrator (Claude Opus 5.5).

## 1. Direction and decision

| Concept | Credibility/originality judge | Usability/a11y/i18n judge | Performance/fit judge |
|---|---|---|---|
| A. Cupertino Research Laboratory | 7.0 | **7.25 (winner)** | **7.3 (winner)** |
| B. ResearchOS Pro | 7.1 | 6.5 | 6.9 |
| C. Frontier Research Atelier | **7.3 (winner)** | 6.75 | 6.9 |

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

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--os-bg` | `#080d19` | desktop canvas | — |
| `--os-surface` | `#111b2b` | reading surfaces, cards, tiles | text 16.0:1 |
| `--os-elevated` | `#18243a` | dialogs, menus, tooltip | muted 8.0:1 |
| `--os-text` | `#f1f7ff` | primary text | 18.0:1 on bg |
| `--os-muted` | `#a9bdd0` | secondary text | 10.0:1 bg, 8.95:1 surface |
| `--os-accent` | `#67dbff` | primary action, selection, status | 12.2:1 on bg |
| `--os-accent-hover` / `--os-accent-pressed` | `#8be6ff` / `#4fcdf0` | button states | — |
| `--os-on-accent` | `#080d19` | text on accent fill | 12.2:1 |
| `--os-accent-tint` | `rgb(103 219 255 / 14%)` | selected row/tile background (never text) | — |
| `--os-focus` | `#67dbff` | focus ring | ≥ 3:1 |
| `--os-line` | `rgb(184 214 255 / 12%)` | decorative hairlines only | — |
| `--os-control-line` | `#5b7593` | control boundaries | 3.63:1 surface |
| `--os-scrim` | `rgb(8 13 25 / 56%)` | dialog scrim, no blur | — |
| `--os-code-surface` / `--os-code-text` | `#0a1120` / `#dfeaf7` | terminal and code | ≥ 7:1 |

### 3.2 Colour, light

| Token | Value | Contrast |
|---|---|---|
| `--os-bg` | `#f2f7ff` | text 14.4:1 |
| `--os-surface` / `--os-elevated` | `#ffffff` (elevated adds `--shadow-window`) | text 15.5:1 |
| `--os-text` | `#18243b` | 15.5:1 white |
| `--os-muted` | `#3d5470` | 7.8:1 white (replaces `#536781`) |
| `--os-accent` | `#0069bb` | 5.6:1 white |
| `--os-accent-hover` / `--os-accent-pressed` | `#005aa3` / `#004c8a` | — |
| `--os-on-accent` | `#ffffff` | 5.6:1 |
| `--os-accent-tint` | `rgb(0 105 187 / 10%)` | — |
| `--os-line` | `rgb(36 75 124 / 12%)` | decorative |
| `--os-control-line` | `#6f8399` | 3.90:1 white |
| `--os-scrim` | `rgb(18 36 61 / 36%)` | — |
| `--os-code-surface` / `--os-code-text` | `#eef3fa` / `#14203a` | ≥ 7:1 |

**Increased contrast** (`prefers-contrast: more`, both themes): `--os-muted: var(--os-text)`; `--os-control-line`: `#8aa2bd` dark, `#4a6280` light; `--os-line` alpha 40%; focus ring 3px.
**Retired tokens:** `--os-action`, `--os-action-hover`, `--os-on-action` (alias them to the accent tokens during migration, then remove), every `--os-*-start/-end` per-app gradient, `--os-*-accent` per-app hues, `--os-dock-*-accent`, `--os-success`, `--os-warning` (use text labels with accent or muted dots), the legacy neon `:root` palette in `globals.css`.

### 3.3 Glass (liquid-glass.css only)

| Token | Dark | Light |
|---|---|---|
| `--os-glass` | `rgb(17 27 43 / 88%)` | `rgb(255 255 255 / 90%)` |
| `--os-glass-rim` | `rgb(190 222 255 / 22%)` | `rgb(36 75 124 / 14%)` |
| `--os-glass-highlight` | `rgb(231 246 255 / 18%)` | `rgb(255 255 255 / 95%)` |
| `--os-dock-selection` | `rgb(255 255 255 / 10%)` | `rgb(0 105 187 / 9%)` |

Recipe (one rule, reused): `background: var(--os-glass); -webkit-backdrop-filter: blur(20px) saturate(1.2); backdrop-filter: blur(20px) saturate(1.2); border: 1px solid var(--os-glass-rim); box-shadow: inset 0 1px 0 var(--os-glass-highlight);` No sheen gradient, no additive white glare. Fallback (`prefers-reduced-transparency: reduce`, `@supports not (backdrop-filter: blur(1px))`, `prefers-contrast: more`): `background: var(--os-surface); backdrop-filter: none; border-color: var(--os-control-line);`. Forced colours: `Canvas`/`CanvasText` borders, no shadows or filters.

### 3.4 Type

| Token | Value | Use |
|---|---|---|
| `--os-font-ui` | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif` | UI and body (Latin, es) |
| `--os-font-display` | `Charter, "Iowan Old Style", Georgia, "Times New Roman", serif` | H1/H2 display and dossier titles only |
| `--os-font-mono` | `var(--font-jetbrains-mono), ui-monospace, Menlo, Consolas, monospace` | DOIs, identifiers, kbd, commands only |
| fa, ar | `var(--font-vazirmatn), Tahoma, "Segoe UI", sans-serif` | all text incl. headings (no serif) |
| zh | `"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif` | all text |
| `--text-xs` | `0.75rem` (12px) | floor for any visible text on phones; 11px only for kbd and badges |
| `--text-s` | `0.8125rem` (13px) | captions, meta, controls |
| `--text-ui` | `0.9375rem` (15px) | shell body, buttons |
| `--text-reading` | `1.0625rem` (17px) | reading body; line-height 1.75 Latin, 1.8 zh, 1.95 fa/ar |
| `--text-h3` / `--text-h2` | `1.25rem` / `1.5rem` | sections |
| `--text-h1` | `clamp(2rem, 1.6rem + 2vw, 3rem)` | page and dossier titles |
| `--text-display` | `clamp(2.75rem, 2rem + 4vw, 4.5rem)` | welcome name only |

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
