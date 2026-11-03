# Independent second-pass source review

**Independent source review and focused final checks passed in the declared scope. The reproduced P1 forced-colour defect below was corrected and verified on the rebuilt export.** This reviewer did not implement application changes. Browser evidence was subsequently added in a separate section; the initial source review itself did not rely on new browser claims. The checks below do not certify universal pixel identity, every state, or WCAG conformance.

## Exact scope and identity

Read all twenty files in the candidate-1 changed-source identity completely, in bounded sequential spans: nineteen application/style/test files and the snapshot helper. The initial read totalled 9,089 lines; later source amendments were re-reviewed, and the machine ledger records the updated exact ranges and hashes. The later selected-platform focus selector correction is included. Complete ranges and hashes are in [source-review-coverage.json](source-review-coverage.json). Subsequent validation-tool changes are owned and re-reviewed by the parity lane; its later hash should not be attributed to this earlier read.

| File | Complete examined range |
| --- | --- |
| `scripts/browser-regressions/aero-parity/snapshot.mjs` | 1–264 |
| `src/components/os/controls.css` | 1–182 |
| `src/components/os/project-explorer.css` | 1–1167 |
| `src/components/os/reading-window.css` | 1–262 |
| `src/components/os/theme-token-guard.test.ts` | 1–114 |
| `src/components/os/win7-desktop.css` | 1–745 |
| `src/components/os/win7-pages.css` | 1–652 |
| `src/components/os/win7-taskbar.css` | 1–1219 |
| `src/components/os/win7-windows.css` | 1–822 |
| `src/components/os/workspace-windows.css` | 1–466 |
| `src/app/[locale]/not-found.tsx` | 1–76 |
| `src/app/global-not-found.css` | 1–280 |
| `src/app/global-not-found.tsx` | 1–56 |
| `src/components/os/GlobalNotFoundContent.tsx` | 1–207 |
| `src/components/os/TerminalCommand.tsx` | 1–142 |
| `src/components/os/evidence-story-common.css` | 1–319 |
| `src/components/os/evidence-story-invisible.css` | 1–244 |
| `src/components/os/supporting-apps.css` | 1–1658 |
| `src/components/os/terminal.css` | 1–124 |
| `src/components/ui/ui-surfaces.css` | 1–153 |

## Independent checks and conclusions

- **Embedded terminal:** its classes now consume the shared canonical window/title/body rules while preserving actual command strings, localised labels, named focusable code region and truthful clipboard status. The terminal-specific body selector has greater specificity than the generic mobile dock-clearance selector, so the code card does not inherit viewport-sized bottom padding. Its frame is also excluded from the full-height mobile application rule. Forced-colour background/image/ink rules were cross-checked in the shared theme; an actual final-system-palette rendering check remains separate from this static conclusion.
- **Server/no-JavaScript Close:** the fallback remains an anchor with its real navigation href and accessible label. The narrow adapter supplies the upstream button-only material without nesting interactive elements. Its 255-byte bitmap appears unchanged in the installed canonical stylesheet (SHA-256 `8af2703d43d218ff1d238799223be1ff7cffd17960c450e59a3d7e54021448a4`). Normal/hover/pressed use the same canonical layers. Forced colours removes bitmap backgrounds and exposes the original SVG. This source agreement is not a claimed zero-pixel fallback capture.
- **Global 404:** `html.os-shell.win7` now allows the same semantic action adapter and preference treatment as the shell. The separate message-box content keeps its document/landmark semantics and real recovery links. Native window paint owns the 6px frame/body inset and caption typography. The retained `main.win7` locale scope updates the font stack immediately with the selected locale; no new modal focus trap or dummy captions were added.
- **23px targets:** the source retains 44px coarse/mobile rules and native 23px fine-pointer faces. The compact values can rely on WCAG 2.5.8’s spacing exception only where nearby-target geometry passes; the saved helper uses interactive elements, a radius-12px centre circle against other target rectangles, and 24px centre distance between undersized-target circles. It does not pretend that text spans are controls. Recovered measured results are below.
- **Window stacking and resize:** clearing the obsolete sticky-bar layer and isolating body paint preserves portal and resize ordering without reanchoring fixed descendants through a filter. The resize grip no longer clips the entire control; its tooltip resets inherited native-button pseudo dimensions and retains hover bridge, focus and Escape dismissal. Actual final browser verification is separate.
- **Forced-colour tray/search:** SVG foreground inheritance is limited to the relevant controls and the forced-colour media block. It preserves original paths and the platform’s adjustment behaviour. Selected search scopes retain an opaque Canvas/CanvasText pair plus a 2px Highlight border; footer stacking no longer outranks tray popups.
- **Focus selection:** the corrected platform selector includes `:not(:disabled)` so the later focus rule reaches equal specificity with the latched selected rule. This restores the intended native inset focus indicator while retaining the dotted outline and selected state.
- **Canonical table paint:** the removed shared material override permits the native header gradient, weight and borders. `supporting-apps.css` deliberately still sets the reading-table font to the reading UI size (14px). Therefore these tables must not be reported as native 12px geometry merely because the competing header rule was deleted. Wrapping/scrolling remains an application reading adaptation.

The static review identified the selected-platform forced-palette path for rendering follow-up; actual verification reproduced the P1 below. No other material application regression was established in this declared review scope. One snapshot-integrity edge case was sent to the parity owner: extending an already-expanded phase without `--expanded` could downgrade its manifest to four listed pages while leaving the older captures unlisted. The owner added an early rejection for that downgrade and keeps census refresh separate from immutable capture images. These guards and the complete 264-line helper were re-reviewed; the parity lane owns its negative-path execution evidence.

## Recovered geometry and behaviour evidence

[Recovered summary](controls-recovered/summary.json) and the raw helper outputs plus forensic `.cjs.txt` source copies were recovered after reconnection. Contrary to the earlier agent’s last unconfirmed status, `final-spacing.json` had completed: **60 pages**, comprising 40 desktop and 20 touch views across five locales, with **488 changed-control observations**, **zero measured target-circle conflicts**, **zero horizontal overflows**, and a **44px minimum touch height**. The geometry helper checks actual nearby interactive targets and stores its observations; it is not a universal all-controls compliance audit.

The ten locale/theme behaviour rows also completed. All matched the expected observations: three invalid fields with focus on the name field; correction clearing that field’s invalid attribute; keyboard platform selection updating its panel; direction-aware tab navigation; empty Write-ups results; one filtered result; and no page errors.

These recovered files belong to candidate 1 (`4XbG7ZUIl5UCdQuMwBv7c`, built 08:12:59.751Z), not a fresh run on the later build. The helper does not record a per-page version response, so [the provenance note](controls-recovered/summary.json) and saved source hashes remain explicit. A one-line later selected-focus correction does not change measured geometry, but its visual state needs actual final-export verification.

## Remaining verification boundary

The final section supplies the actual rendered platform/terminal forced-palette and 404 checks. The dedicated browser/parity lanes supply fallback Close comparison, final tooltip behaviour and expanded component-state captures. Do not convert this source review or the recovered measurements into a claim that every rendered state has 100% reference parity.

## R2-REVIEW-01 — selected platform label invisible in forced colours

- **Severity:** high / P1 visual accessibility.
- **Affected source:** `src/components/os/evidence-story-invisible.css:24–30`, high-specificity latched selected-gradient rule; interacting with the generic `aria-pressed=true` HighlightText rule in `win7-theme.css:571–575`. The final correction is at `evidence-story-invisible.css:38–47`.
- **Actual build:** `iIwRABh8xPIUf2fpDkuDr`, built `2026-11-03T09:07:57.318Z`.
- **Reproduction:** open `/projects/invisible-window-research` with forced colours enabled; focus the selected Windows platform button. Repeat app Light/Night with system Light/Dark (four combinations).
- **Observed:** the selected Windows label is invisible in all four captures. In the light system palette it uses white ink over a transparent white-backed face; in dark it uses black ink over black. The unselected macOS control remains readable. The selected border/accessible name remain, so this is specifically a visible-label contrast failure, not loss of the control semantics.
- **Root cause:** the component’s selected gradient wins over the lower-specificity system background. Forced colours removes that gradient, leaving a transparent face while HighlightText remains. This is the same class of issue already corrected for Atlas and Start scopes, but its evidence-platform path was absent from those captures.
- **Proposed correction:** in the component’s existing scope under forced colours, give selected buttons an opaque Canvas face, CanvasText label and 2px Highlight border. Preserve normal canonical pressed paint, aria-pressed, keyboard interaction and platform content.
- **Evidence:** [raw failing-candidate measurements](independent-forced/results.json), [light screenshot](independent-forced/light-light-platform.png), [dark screenshot](independent-forced/light-dark-platform.png). These actual captures have no injected stylesheet. Their original effective-background helper stops early on transparent white; do not treat that field as a numerical contrast calculation. The computed foreground/transparency and inspected screenshots establish the defect independently.
- **Status:** root implemented the scoped system-colour correction and added a maintained browser regression for both forced palettes. The amended source was independently re-reviewed. The final compiled four-palette check passed on `UD_vNX6v9YqmgrvZLWuY7`, built `2026-11-03T09:25:26.070Z`, without injected CSS. All four selected-platform captures were visually inspected; the labels are readable and selection/focus remains visible. See [final measurements](independent-forced/final/results.json) and [summary](independent-forced/final/summary.json).

The same four-case check found the embedded terminal title, command text and Copy control readable in both palettes, with no page errors. Representative [dark terminal capture](independent-forced/dark-dark-terminal.png) was inspected. This does not replace clipboard/native-navigation testing in the root’s suite.

### Proposal and normal-focus follow-up

The narrowly scoped diagnostic correction was rendered in all four app/system forced-colour combinations on the same 09:07:57 candidate. Every corrected capture shows the selected Windows label. Actual measured pairs are black/white or white/black with a 2px Highlight border. [Proposal data](independent-forced/platform-proposal-and-normal-focus.json), [light proposal](independent-forced/light-light-platform-proposal.png), [dark proposal](independent-forced/dark-dark-platform-proposal.png). These four cases explicitly have `injected:true`; they are not final-export proof.

The same follow-up also checked normal selected keyboard focus in both app appearances without injection. Both record the intended dotted outline and `rgb(152,209,239) 0 0 0 2px inset`, with `focusVisible:true` and `aria-pressed:true`. The existing one-line specificity correction is therefore effective in that actual build. [Normal focus screenshot](independent-forced/light-normal-focus-compiled.png). All screenshots linked in this subsection were visually inspected.

### Final source amendments re-reviewed

The root’s native command-ink token/disabled Copy palette, stricter colour-literal ratchet, platform forced-colour block and real-control browser regression were checked. The global404’s redundant nested isolation was also removed after controlled pixel diagnosis: its main remains positioned with an opaque wallpaper, the decorative vortex is z0 with pointer-events:none, the dialog retains its own z1 context, and the HTML shell retains root isolation. Full SignalVortex component/style examination found no source stacking or pointer-routing regression from that one-line removal. Actual final 404/cross-palette results are recorded below.

The recovered helper source is stored as exact text evidence (`controls-recovered/spacing.cjs.txt` and `behaviour.cjs.txt`), keeping repository lint active without treating historical scratch code as maintained runnable source.


## Final compiled verification

The independent checks used Chromium 155.0.8059.79 against the accepted static export `UD_vNX6v9YqmgrvZLWuY7`, whose served version records `2026-11-03T09:25:26.070Z`. Earlier failure and injected-proposal evidence remains unchanged.

- **Four forced-colour combinations passed:** app Light/Night × system Light/Dark. The selected platform has an opaque white/black or black/white pair, a 2px system selection border, visible dotted focus and `aria-pressed=true`. The terminal title, command and Copy text also use the expected readable pairs. These measured text pairs are 21:1. No page errors occurred. All eight final captures were visually inspected. [Data and exact probe text](independent-forced/final/results.json), [light platform](independent-forced/final/light-light-platform.png), [dark platform](independent-forced/final/dark-dark-platform.png), [light terminal](independent-forced/final/light-light-terminal.png), [dark terminal](independent-forced/final/dark-dark-terminal.png).
- **Ten 404 combinations passed:** English, Persian, Arabic, Chinese and Spanish × Light/Night. The actual response is 404, document direction is appropriate, the language select updates the recovery destination, and the CSP retains `script-src-attr 'none'`. There is no horizontal overflow at 1440×900 or 320×568. The frame records a 6px radius, 27px caption and `0px 6px 6px` body margin. Unexpected captured console/page errors: zero. [Results](reference-404-final/results.json), [English Light image](reference-404-final/light-en-320.png), [Persian Night image](reference-404-final/dark-fa-320.png); these two representative images were visually inspected. Long translated content retains ordinary vertical page scrolling.

These checks resolve R2-REVIEW-01 and confirm the final 404 changes within the stated scope. Fallback-glyph pixel comparison, tooltip interaction and the broader component comparison remain with their dedicated verification lanes; this report does not replace those results.
