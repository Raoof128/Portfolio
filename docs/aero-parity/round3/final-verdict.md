# Third pass: final verdict

**CONDITIONAL PASS.** Every reproducible deviation from canonical 7.css that this pass measured on a rendered, directly matching component is either fixed or explicitly classified. No pair got worse. Cross-engine, Windows rasterisation, assistive-technology and physical-device checks remain unverified, and nothing has been deployed.

## Identity

| Item | Value |
| --- | --- |
| Base | `38842e2` (clean tree) |
| Final source | `769cb00` on `claude/dazzling-feynman-cp1q08` (checkpoints `3358b96`, `540a560`) |
| Final export | Built `2026-11-08T20:45:31.258Z`. Its `version.json` names `540a560`, because it was built from `540a560` plus working-tree edits that were then committed unchanged as `769cb00`. `git diff 769cb00 -- src` was empty after the build |
| Reference | `7.css@0.21.1`, `dist/7.scoped.css` SHA-256 `583a27d5…cc658f1`; live demo stylesheet identical apart from its `v0.21.0` banner |
| Browser | Chromium 153.0.8010.12 headless (Chrome for Testing), Linux, Wrangler 4.158.0 Pages preview |

## Models

| Role | Model | Evidence |
| --- | --- | --- |
| Orchestrator, diagnosis, integration, final review | `claude-opus-5-5` | Session metadata (`get_session`) |
| R3-A reference, R3-B census, R3-C1/C2 components, R3-F1 RTL geometry, R3-H independent review | `claude-haiku-5-5` | Each worker's self-reported system-prompt model ID; invoked with an explicit `haiku` model override |

The project-scoped role files in `.claude/agents/` declare `model: claude-haiku-5-5`, but agent types register only at session start. This session therefore dispatched `general-purpose` agents with the explicit override, and each read its role file first. No worker spawned agents, committed or approved its own work.

## Results

| Gate | Result |
| --- | --- |
| Controlled parity (134 pairs, 38 specimens) | **60 exact + 1 within the measured 1/255 noise band**, up from 40; 0 pairs with more >16/255 pixels than baseline. [Matrix](parity-matrix.md) |
| Findings | 7 corrected visual/layout/doc defects, 1 caught by independent review, 1 stale test repaired; 4 recorded P3/process items. [Findings](findings.md) |
| Lint, typecheck | Pass |
| Unit tests | 803/803 in 52 files (includes 6 new RTL geometry/hook tests that failed before the fix) |
| Static/schema/security/HTTP/dependency/agent audits | Pass |
| Production audit | Live site correctly reported stale (still `38842e2`; not deployed). Same audit against the local candidate: pass |
| Harness self-tests | 8/8 |
| Playwright, Chromium | **72/72** (2 previously failing, pre-existing on `38842e2`, fixed in R3-13) |
| Playwright, Firefox / WebKit | **UNVERIFIED**: binaries not installed, and this environment forbids `playwright install` |
| Opus journey walk | Lock screen → keyboard Enter → Projects → Simurgh (tab arrow keys) → Résumé → Contact; Back, Back, Forward, refresh; maximise 1440×796 / restore 1000×684; 12 rapid dock clicks; theme persists; 0 page or console errors |
| Keyboard focus | Primary link reached by 15 real Tab presses, with canonical dotted outline and `#98d1ef` inset. [Capture](evidence/primary-link-keyboard-focus.png) |
| Responsive / RTL | 390, 768 and 1440 with no horizontal overflow; reviewer measured 44px coarse targets and no overflow at 390 on four routes. RTL windows mirror at 1024/1440/1920. [Before](evidence/rtl-fa-projects-before.jpg) / [after](evidence/rtl-fa-projects-after.jpg) |
| Aero Night | Placeholders 4.61:1 on white fields; primary border canonical grey. [Capture](evidence/projects-dark-final.jpg) |

## Remaining differences and owner decisions

- **Intentional adaptations, unchanged:** static focus rings, 3:1 contact field borders, 44px coarse/≤700px targets, 14px research tables, scrollbar reading clearance, non-pulsing default cue (WCAG 2.2.2).
- **Portfolio extensions:** icon layout inside link buttons, Atlas/Simurgh diagrams, window-controls popover, lock screen, desktop, taskbar, Explorer navigation and Aero Night. These are not claimed as 7.css parity.
- **Open P3 items:** a 4px icon-column overlap at 1024px (pre-existing, now symmetric in RTL); `summary` pressed border; Copy Link hover/press antialiasing (≤12 px, Δ≤8).
- **Unverified:** Firefox, WebKit, real Windows and Segoe UI, screen-reader speech, physical touch devices, 200%/400% OS zoom on this build, dark-appearance pixel pairs, and field performance.
- **Owner decisions:** whether to open a pull request and deploy. **Nothing was merged, published or deployed.** Earlier owner/content items (PDF tagging, claim evidence, development advisories) remain as recorded in round 2.
