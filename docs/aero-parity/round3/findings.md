# Third-pass findings

Each finding was reproduced on the HEAD export (`38842e2`) before a change was made. "Measured" means computed style and/or pixel comparison against unchanged `7.css@0.21.1` in Chromium 153.

| ID | Severity | Reproduced problem and root cause | Correction (owner) |
| --- | --- | --- | --- |
| R3-01 | Medium visual | Projects and Write-ups selects were 23px; canonical selects are content-height (21px with this font). App floors at `project-explorer.css:282`, `win7-pages.css:131` and the shared reading-field rule. In Chromium 155 the natural height happened to be 23px, so round 2 measured them exact by coincidence. The 404 select (no floor) is exact in both browsers. | Floors removed at fine pointer; 44px coarse/≤700px floors kept. `min-block-size` for inputs/textareas split from the font rule (R3-C1, Haiku) |
| R3-02 | Low visual | Selected dossier tab sat 1px low: `align-items: flex-end` on the tab strip stopped the canonical stretch that lifts the selected tab 2px above the strip. | Declaration removed; wrap, sticky and RTL margins unchanged (R3-C1) |
| R3-03 | Medium visual | Primary links and focused button-links had a static `#5586a3` border. Upstream rule `button:not(:disabled):not(:hover)` (specificity 0,3,1) beats `.default`/`:focus` (0,2,1), so the canonical resting and focused border is grey `#8e8f8f`; only hover/press turn blue. Verified with the canonical stylesheet alone. | Both border declarations and the unused token removed; hover gradient face and static (non-pulsing) cue kept (R3-C2, Haiku) |
| R3-04 | Low visual | Search placeholders were `#3d3d3d`/`#5a5a5a`; canonical fields show Chromium's UA ink `#757575` (4.61:1 on white). Firefox's UA default (opacity 0.54) would fall below AA. | One token `--win7-field-placeholder: #757575` with opacity 1 in all three search fields (R3-C1/C2) |
| R3-05 | Low visual | Window-controls group-box legend sat 2px left with a different font. First correction (deleting the app's legend override) was insufficient: re-measurement showed `padding: 0` persisted. Second diagnosis: Tailwind preflight's universal reset zeroes the UA 2px legend inline padding that canonical 7.css relies on. R3-B's census found no other rendered canonical component relying on a UA padding default. | App override removed (R3-C2) and `:where(.win7) legend { padding-inline: revert }` added in the foundations sheet (Opus, after the failed first round) |
| R3-06 | Medium layout (RTL) | In Persian/Arabic the first workspace window opened at the LTR position (x 264–1264 at 1440px) and covered ~90px of the desktop intro on the right. `createCascadedWindowRect` and the icon-column measurement assumed the column is on the left. | Test-first mirror for RTL; LTR unchanged. Verified in browser: `fa`/`ar` 176–1176 at 1440, 656–1656 at 1920 (R3-F1, Haiku) |
| R3-07 | Documentation | `win7-logon.css` said a second press ends the lock-screen wait; commit `38842e2` intentionally disables the orb and moves focus to the status line (`WelcomeEnter.tsx:156`). R3-B's focus-loss concern was checked and is not a defect. | Comment corrected (Opus) |

## Recorded, not changed

| ID | Severity | Observation | Reason |
| --- | --- | --- | --- |
| R3-08 | P3 | At 1024×768 the first window overlaps the icon column by 4px in LTR (pre-existing) and, now mirrored, in RTL. The column is 268px wide there, while the measurement falls back to 240px when icons are not yet mounted. | Pre-existing and cosmetic (frame edge over label padding). Fix needs a breakpoint-aware `--win7-icon-column-edge`; outside this pass's measured scope |
| R3-09 | P3 | Window-disclosure (`summary`) pressed border differs slightly from canonical button press (1195 px, max Δ135, small area). Copy Link hover/press differ by 12/7 px at Δ≤8. | Pre-existing; unchanged by this pass |
| R3-10 | n/a | Taskbar search hover shows no native "×": the app hides `::-webkit-search-cancel-button` deliberately. Disabled taskbar search is a synthetic state the app never renders. | Declared adaptation / not applicable |
| R3-11 | Process | Worker R3-A briefly wrote scratch outside its lease and removed it; its scratch scripts also tripped ESLint inside ignored `artifacts/`. They were moved to the session scratchpad; no lint rule was changed. | Logged for transparency |
