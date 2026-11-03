# Portfolio-to-7.css component map

This map starts from committed checkpoint `b4cc49de662b3013a97d5497f3fd8daed0df1a20`. The prior [268-file frontend source ledger](../audits/frontend-review/file-coverage.md) remains the broad architectural review; this pass rechecks the rendering layers that affect parity. The [reference specification](reference-analysis.md) gives the canonical values. A component mapping is not by itself a passing visual comparison.

## Integration boundary

`src/components/os/ResearchOS.tsx` loads `controls.css`, the existing shell/material/reading styles, then `7.css/dist/7.scoped.css`, followed by `win7-theme.css`, `win7-logon.css`, `win7-taskbar.css`, `win7-desktop.css`, `win7-windows.css`, `win7-explorer.css`, `win7-pages.css` and `win7-polish.css`. All active ResearchOS surfaces descend from `.os-shell.win7`. Global 404 has its own scoped import and `.win7` wrapper. Portalled window-control panels explicitly retain `.win7` and appearance state.

This order means late application CSS can override the official framework even when markup is correct. Tailwind's preflight also changes box sizing and default element margins. The controlled harness must include the actual candidate cascade and measure border-box dimensions, not assume that identical declared widths mean identical outer geometry.

The extension layer has three legitimate responsibilities: React window/layout behaviour, content/application-specific structures absent from 7.css, and accessibility/localisation adaptations. Equivalent frame and control paint should come from the canonical stylesheet wherever possible. [The cascade audit](css-cascade-audit.md) records the concrete changes.

## Live application surfaces

| Portfolio surface | First-party implementation | Canonical counterpart | Applicable states and boundary |
| --- | --- | --- | --- |
| Reading/application window | `src/components/os/WorkspaceWindows.tsx`; `workspace-windows.css`; `win7-windows.css` | `.window.glass`, `.active`, `.title-bar`, `.title-bar-text`, `.title-bar-controls`, `.window-body` | Active/inactive, default/hover/pressed/focus captions, minimised/restored/maximised/closed, resize/move, mobile/RTL. React retains modeless semantics and routing. |
| Server/fallback reading frame | `src/components/os/ResearchOS.tsx`; `reading-window.css` | Same window structure | Direct loading, hydration handoff, route changes and unavailable client registration. Check both rendered paths to avoid a visually different initial frame. |
| Desktop introduction | `src/components/os/Desktop.tsx`; `win7-desktop.css` | Active glass window with body | Visible/hidden/expanded, caption hover/focus/pressed, multilingual title. Its rich content and document sizing are application content. |
| Proof Atlas desktop frame | `src/components/os/Desktop.tsx`; `ProofAtlas.tsx`; `proof-atlas.css`; `win7-desktop.css` | Same frame/caption conventions | Visible/hidden/expanded, current project, artwork interaction. Atlas drawing, evidence and project identities stay original. |
| Global and locale 404 | `src/components/os/GlobalNotFoundContent.tsx`; `src/app/global-not-found.css`; `src/app/[locale]/not-found.tsx` | `.window.glass.active`, body, ordinary controls | Default, focus/hover/pressed links, locale selection, small viewport. No fabricated minimise/close operations for a full-page error. |
| Ordinary command/CTA | `src/components/ui/NeonButton.tsx`; `controls.css`; `win7-pages.css`; `win7-polish.css` | Native `button` / `[role=button]` face | Default, hover, pressed, focus, disabled where real. Navigation remains an anchor; appearance does not justify changing navigation semantics. |
| Window Back, Copy Link and geometry controls | `WorkspaceWindows.tsx`; `ReadingWindowControls.tsx`; `win7-windows.css` | Buttons, native disclosure, group boxes | Clipboard success/failure, disabled move/resize limits, open/closed panel, keyboard arrows/step controls. The icon/system menu trigger is a separate application control, not a fourth caption button. |
| Search dialog | `ResearchOS.tsx`; `research-os.css`; `win7-pages.css` | Native modal dialog with equivalent window/control styling | Open/closed, input, scope selection, empty/results, active keyboard result, clear, dismiss/focus return. Preserve native `<dialog>` modality; framework `:target` example is not a replacement. |
| Project instant search | `ProjectExplorer.tsx`; `project-explorer.css`; `win7-explorer.css` | `[type=search]` | Empty placeholder, typed, focused, filtered-empty. Keep real label and keyboard filtering. Avoid drawing two competing search icons. |
| Write-up instant search | `src/app/[locale]/write-ups/WriteUpsClient.tsx`; `supporting-apps.css`; `win7-pages.css` | `[type=search]` | Same input states and result feedback. |
| Category/language selects | `ProjectExplorer.tsx`; `WriteUpsClient.tsx`; `GlobalNotFoundContent.tsx` | Native `select:not([multiple])` | Default, hover, focus, open, selection; disabled only if application uses it. Native popup surfaces vary by browser/OS. |
| Contact text fields | `src/components/ui/SecureContactForm.tsx`; `supporting-apps.css`; `win7-pages.css` | Text box and textarea | Empty, typed, focus, invalid/recovery, mail-client handoff. Validation text is content, not a synthetic Windows error box. |
| Project Explorer navigation | `ProjectExplorer.tsx`; `project-explorer.css`; `win7-explorer.css` | List/tree highlight and Explorer-era visual conventions | Current link, hover/focus, mobile collapsed/open index, filters, empty list. The flat project navigation is a real `<nav>` of links, not a fake filesystem tree. |
| Project result rows | Same Explorer files and `ProjectThumbnail.tsx` | List-view highlight as visual reference | Default, hover/focus, project navigation. Rich article rows are not tabular data and should not be converted into a table solely to inherit 7.css. |
| Project detail file tabs | `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`; `project-explorer.css` | `menu[role=tablist] > button[role=tab]`, tab panel | Selected/unselected, focus, keyboard change, overflow/reflow. Maintain real controls/panel associations and reading content. |
| Interactive evidence platform picker | `InvisibleWindowEvidenceStory.tsx`; `evidence-story-invisible-window.css` | Fieldset/legend grouping; command/button state | Selected platform, focus/hover, evidence change. Research-specific diagrams are not OS decoration. |
| App/language disclosure panel | `ResearchOS.tsx`; `win7-taskbar.css`; `win7-pages.css` | Native `details/summary`; menu surface inspiration | Closed/open, focus/hover, selected locale, pending navigation, dismissal. Use actual disclosure/navigation semantics rather than adding ARIA menu roles without a full menu keyboard model. |
| Tooltips and status feedback | Shell/control CSS; `TerminalCommand.tsx`; `WorkspaceWindows.tsx` | Balloon material; standard status text | Tooltip hover/focus, copied/failed, announcement. Existing small non-balloon labels need a documented component boundary; do not attach decorative tails to every status message. |
| Scroll containers | `WorkspaceWindows.tsx`; shell/reading CSS; `.window-body.has-scrollbar` | Scoped `.has-scrollbar` rules | Scroll position, thumb/arrow normal/hover/pressed, overflow/reflow. Canonical bitmap grip and arrow paint are present in installed scoped CSS. Gecko uses native scrollbar fallback. |

## Desktop-specific extensions

| Surface | Implementation | Comparison rule |
| --- | --- | --- |
| Wallpaper | `win7-theme.css` | Original CSS composition. Assess Aero colour balance, contrast and continuity; do not claim parity with a nonexistent 7.css wallpaper component. |
| Desktop icons and labels | `OSIcon.tsx`, `Desktop.tsx`, `win7-desktop.css` | Preserve original app identity; evaluate icon geometry, label alignment, selected/hover/focus surfaces and keyboard activation against Windows 7 conventions. |
| Taskbar and Start control | `ResearchOS.tsx`, `win7-taskbar.css` | Application extension. Check glass, grouping, active/running state, focus, icon placement, tray/clock and narrow-screen access. 7.css has no taskbar specification to score. |
| Welcome screen | `WelcomeEnter.tsx`, `welcome-enter.css`, `win7-logon.css` | Application extension with authentic Aero-era account-tile cues. Entry stays clearly labelled as workspace entry, skippable and keyboard accessible. |
| Window geometry, stacking and history | `use-reading-window.ts`, `window-geometry.ts`, `workspace-model.ts`, `WorkspaceWindows.tsx` | React behaviour, not CSS framework functionality. Preserve pointer and keyboard move/resize, focus return, history and responsive boundary handling. |
| Original artwork and evidence | `src/components/ui/*Canvas.tsx`, `ProjectArtwork.tsx`, evidence stories and project content | No reference equivalent. Preserve content/claims/assets; only surrounding chrome participates in parity measurement. |

## Framework components without a live equivalent

These were inspected in the official documentation and source, but the portfolio should not gain dummy UI merely to make the reference catalogue complete.

| Framework family | Current mapping |
| --- | --- |
| Editable combo box | No live editable listbox-combobox widget. Native selects and instant search have different semantics. |
| Checkbox / option button | No native checkbox/radio controls found in mounted portfolio UI. Theme and evidence selectors use real buttons; do not change their model arbitrarily. |
| Range slider | No live range input. Window step resize controls are commands, not sliders. |
| ARIA list box | Search/project results navigate to content and remain links. They are not selectable form options. |
| Classic menu bar | No live File/Edit/View-style application menu bar. The framework reference establishes material/state conventions only. |
| Canonical tree-view widget | Explorer uses flat project navigation; nested research content does not imply a filesystem tree. |
| Determinate progress bar | No meaningful numeric progress operation requiring the framework widget. Decorative welcome waiting must not invent completion percentages. |
| Canonical bitmap spinner | Welcome's existing wait indicator is an application extension. Any adoption of the upstream GIF would require an actual reduced-motion fallback. |
| Segmented status-bar widget | Explorer/footer status copy exists, but the framework's three-column demo has no direct functional equivalent. Avoid fabricated CPU/slide indicators. |

`src/components/layout/LanguageSwitcher.tsx` contains legacy menu roles and `src/components/ui/ProjectCard.tsx` contains a separate tab implementation. The preceding audit classifies those retained components separately from the mounted ResearchOS journey. Their presence in the source does not prove that a live page uses them; inspect imports/mounts before treating them as current candidate defects.

## State-coverage rules

The paired capture suite should test default, hover, pressed, keyboard focus and disabled states for actual equivalent controls, active/inactive frames and restore/maximise glyph variants. Native dropdown popups, scrollbars, native focus rendering and fonts can differ across engines; compare each engine to its own reference. Touch/RTL/reduced-motion/forced-colour variants are intentional adaptations and need functional/readability evidence, not a forged zero-difference image score.

Source review covers framework-supported states. Runtime state coverage is recorded only for executed captures/tests in [browser results](browser-test-results.md), [accessibility results](accessibility-results.md) and [the visual parity matrix](visual-parity-matrix.md). Unsupported or unmounted controls receive “not applicable”, not an invented passing state.
