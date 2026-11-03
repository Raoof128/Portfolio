# Styles audit and implementation

Baseline HEAD: 2b6d048c42c7feb7ef82e38f5ca519603d40afc6. All 29 first-party src/**/*.css files were read completely in bounded sequential chunks, including eight legacy/evidence sheets read by the named helper. Current file hashes and examined endpoints are in frontend-styles-coverage.json. Full source review does not prove that every rendered state was tested.

## CSS-01 — P1: forced-colour caption controls lose their visual meaning

- Affected: reading and desktop window minimise/maximise/restore/close controls, all locales.
- Source: src/components/os/win7-theme.css forced-colours reset; src/components/os/win7-windows.css final forced-colours block (new lines 724 onward).
- Observed: root's Chromium forced-colours baseline capture shows nine blank caption controls. Computed backgroundImage is none and buttons have no inline SVG.
- Expected: users who select forced colours can visually distinguish each caption command.
- Reproduction: open /en/projects with forced-colors active; inspect the two desktop window caption groups and current reading caption group.
- Root cause: 7.css draws caption symbols as bitmap background images; the project's accessibility reset removes all background images and shadows.
- Correction: system-coloured border glyphs, selected using language-neutral is-minimize/is-maximize/is-restore/is-close classes; distinct two-square restore and two-stroke close. Keep all existing accessible names and ordinary Aero appearance.
- Verification: root owns before/after browser screenshots and computed-pseudo checks. The first after-capture failed: the shared pseudo rule had one extra element selector, outranking per-kind border/height rules. Corrected by giving every per-kind selector the same `button` element, then re-read the whole final block. The next browser capture exposed a second cascade issue: ::after inherited tooltip padding6px10px and Canvas background, producing20x14 instead of14x2 and obscuring the opposite stroke. Shared glyph pseudos now reset padding/margin/background/z-index. A real isolated Chromium page with exact pending stylesheet overlay produced two14x2 strokes with opposed transforms and visible X (/tmp/forced-close-corrected-overlay.png). This overlay is diagnostic evidence, not the final build; root must confirm the rebuilt export. No claim of physical Windows high contrast verification.

## CSS-02 — P1: Aero Night Explorer hover pairs navy fills with blue/dark text

- Affected: /en/projects sidebar non-current links and index rows, all locale equivalents. Non-current All Projects header uses another navy fill.
- Source: src/components/os/project-explorer.css dark interaction tokens (~117-132), row hover (~465); src/components/os/win7-explorer.css All Projects header (~87-100).
- Observed: root reproduced fg rgb(0,61,153) on bg rgb(23,58,99) while hovering a non-current Simurgh link. Baseline screenshot: artifacts/frontend-review/baseline/projects-night-hover.png, build 6bEVgZEX1rNmEyqH4_pUo.
- Expected: text is readable during hover and rest as well as selected states.
- Root cause: night hover tokens changed the fill while reading-body text remained dark; non-current header did not consume its existing paired foreground role.
- Correction: use the existing light-blue body hover role in both themes; the reading body remains white by design. Non-current header consumes --explorer-nav-head-text, leaving navy/white selected states intact.
- Verification: root final browser contrast check; existing CSS token/contrast suites pass 32/32.

## CSS-03 — P2: typography bypasses Windows/locale roles and violates the 7.css font token contract

- Source: src/components/os/win7-theme.css (~252,276,370), src/components/os/win7-windows.css (~136), src/components/os/research-os.css (~92).
- Observed in source and vendor contract: canonical 7.scoped.css consumes --w7-font through the CSS font shorthand in 16 rules, but app supplied a family-only value. Reading title hardcoded system families rather than per-locale type. Latin token explicitly excluded Segoe UI.
- Expected: installed Segoe UI is preferred for Latin Windows interface text; font declarations remain valid; Persian/Arabic/Chinese retain their own stacks.
- Correction: valid --w7-font shorthand with UI size and family; shell font-family reads --win7-font directly; title and OS UI body role consume Win7 family; Segoe UI first for Latin only. No font download or proprietary redistribution introduced.
- Verification: root computed title font on locale routes; existing CSS token/contrast suites pass 32/32. Linux screenshots use platform fallback, so no native Segoe pixel identity is claimed.

## Shared correction — visible terminal clipboard feedback

src/components/os/terminal.css supplies a light-on-command-prompt status row and Canvas/CanvasText fallback for the artwork agent's reproducible clipboard-feedback correction. The mounted empty region occupies no space at rest. Detailed TSX finding/testing belongs to artwork lane.

## Verification record

- 3 CSS-related Vitest files, 32 tests passed, Vitest 4.1.12, current run 05:40:52 UTC. Log /tmp/styles-tests-2.log.
- An earlier run during dependency replacement executed only 16 tests and had two missing-module worker errors. This was NOT accepted as a pass. Log /tmp/styles-tests.log retained.
- Six changed CSS diffs re-reviewed. No deletion of legacy selectors based on first-paint CSS coverage.
- Official 7.css 0.21.1 package README/metadata, scoped variable contracts and gui/window/button/typography integration inspected. Official documentation fetched over TLS through configured proxy: /tmp/7css-official.html and /tmp/7css-official-prose.txt. Extracted prose read completely (1,020 lines). Canonical states include 75x23 standard buttons, glass/active title bars, caption classes, status bars and semantic controls. Portfolio enlarges hit targets intentionally, customises night chrome while preserving white reading bodies, and supplies its own scoped scrollbar treatment (official scoped sheet omits scrollbar styling).

## Remaining scope limits / candidates

The eight-sheet helper identified possible dark evidence source-link/unselected Zurvan hover and selected ledger pairings; source alone is not reported as proof of a live defect. Selected Zurvan buttons explicitly use the existing navy/white pair and are not defects. Root browser confirmation is required for each other candidate. Reduced motion intentionally removes decorative window and artwork loops; static status and state still carry meaning. The many old sheet layers remain maintenance debt; their removal would require complete state coverage and measured output comparison. No claim of pixel-perfect Win7 equivalence, universal WCAG compliance, or zero CSS debt.
