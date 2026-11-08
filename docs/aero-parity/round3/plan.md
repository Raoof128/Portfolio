# Third parity pass: plan and frozen specification

Base: `38842e2` (clean tree), built `2026-11-08T20:12:08.781Z`. Previous accepted pass: [round 2](../round2/README.md), committed as `8b7907c`.

## Reference freeze

| Item | Value |
| --- | --- |
| Installed package | `7.css@0.21.1` (npm `latest` on 2026-11-08) |
| `dist/7.scoped.css` SHA-256 | `583a27d5dd81875f7e85df65da06451ae4ff6f01aa8687357ebcd0e04cc658f1` (unchanged since round 2) |
| Live demo stylesheet | Identical to installed `dist/7.css` except the banner line, which reads `v0.21.0` (R3-A) |
| Browser | Chromium 153.0.8010.12 (Chrome for Testing), headless, 1440×900, DPR 1, reduced motion |
| Fonts | Linux host fallback chain; no Segoe UI. Reference and candidate use the same frozen font data through `--w7-font` |
| Firefox / WebKit | Not installed in this container; cross-engine results are UNVERIFIED |

## Classification

- **Direct match:** window frame, title bar, caption buttons, push buttons and button-like links, text/search/select fields, tabs, group box, table header, scrollbars, 404 message box.
- **Intentional adaptation:** stronger static focus, 44px coarse/≤700px targets, 16px mobile inputs, darker contact field border (3:1), 14px research table text, static default cue instead of pulsing (WCAG 2.2.2), Aero Night.
- **Portfolio extension:** lock screen, desktop, icons, taskbar/Start/tray, Explorer navigation pane, window-controls popover, Atlas/Simurgh diagrams, wallpaper.
- **Not rendered (R3-B census):** checkbox, radio, slider, listbox, `ul.tree-view`, `role=menu`/menubar, tooltip/balloon, progress bar, status bar. No parity claim is made for them.

## Control experiment

Round 2 reported 50/134 exact pairs in Chromium 155. Rebuilding `8b7907c` in an isolated worktree and running the same harness in Chromium 153 gives **39/134**; HEAD gives **40/134**. The post-round-2 commits therefore introduced no measured regression. The lost pairs are a browser-version effect, but it exposed CSS that only matched canonical output by coincidence (see findings R3-01, R3-02).

## Tasks, ownership and order

| Task | Owner (model) | Files leased | Depends on |
| --- | --- | --- | --- |
| R3-A reference spec | Haiku | `artifacts/.../R3-A/` only | none |
| R3-B cascade census + file coverage | Haiku | `artifacts/.../R3-B/` only | none |
| R3-C1 select floor, tab alignment, placeholder ink | Haiku | `project-explorer.css`, `win7-pages.css`, `supporting-apps.css`, `research-os.css` | specification |
| R3-C2 default border, legend metrics, placeholder token | Haiku | `controls.css`, `reading-window.css`, `win7-theme.css` | specification |
| R3-F1 RTL cascade mirror (test first) | Haiku | `window-geometry.ts`, `use-reading-window.ts` + tests | none (disjoint) |
| Integration build, harness rerun, journeys | Opus | `out/`, `artifacts/aero-parity/r3-*` | C1, C2, F1 |
| R3-H independent parity review | Haiku (fresh context) | read-only | integration |
| Final screenshot inspection and verdict | Opus | docs | review |

Workers ran in one checkout with exclusive file leases (no shared file, no concurrent builds). Opus reviewed every diff before integration.
