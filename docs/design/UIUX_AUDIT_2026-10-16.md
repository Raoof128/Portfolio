# UI/UX audit: raoufabedini.dev (16 October 2026)

Live site audit of the Windows 7 Aero edition (commit `58d9bd6`). Report rebuilt on 17 October 2026 from the complete workflow journal after the first write-up received only 48 of the 107 confirmed findings.

## 1. Summary

**Scope.** https://raoufabedini.dev in English (logon, desktop and its windows, projects, project detail, about, résumé, contact, write-ups, lab, lab/001, security policy, hall of fame, search, both 404s), with RTL and locale spot checks on `/fa`, `/ar`, `/zh` and `/es`. Aero (light) and Aero Night (dark), 320 to 1920 px wide, landscape and 200% zoom.

**Method.** Eleven auditor lenses built on the UI/UX Pro Max priority rules (accessibility, touch, performance, style, layout, typography and colour, animation, forms, navigation) plus a frontend-design first-impression lens. Evidence came from headless Chromium and WebKit (Playwright): screenshots, frame bursts, computed-style contrast, keyboard Tab walks, accessibility-tree snapshots, touch hit tests and Core Web Vitals runs. Each lens's findings went to an independent verifier who had to reproduce them; unreproduced findings were rejected and verifier severities are used. All agents ran on Haiku 5.5; the orchestrator re-checked the critical dark-theme issues on the live site.

**Counts.** 107 confirmed (3 critical, 11 high, 27 medium, 66 low) and 9 rejected. Several confirmed findings describe the same defect from different lenses (for example the Explorer footer appears as A11Y-V-01, SC-01 and F2); the fix plan below groups them.

**Verdict.** The Win7 concept is distinctive and mostly coherent, semantics are solid and lab Core Web Vitals are good. The serious problems cluster in Aero Night: the project explorer (footer, search field, category select, sidebar header, active evidence item), the lab code panel (code text measured at 1.11:1 on the live site) and the active taskbar label all fail contrast. Keyboard focus does not move into a window when it opens. On phones and tablets the taskbar clips the Résumé and Contact pins, and taps can land on the tray instead. Most of the critical and high items are contained CSS token fixes.

## 2. Scorecard

Scores are the report writer's judgement from the verified findings and strengths. Confidence is shown where the evidence base was thin.

| Category (Pro Max priority) | Score /10 | Reason                                                                                                                                                                                                      | Key findings                           |
| --------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 1. Accessibility            | 5         | Two critical and four high-severity issues in dark mode and focus handling. Good skip link, landmarks, focus return on close and Lock, and reduced-motion handling.                                         | C-1, C-2, H-1, H-2, H-3, H-4           |
| 2. Touch and interaction    | 6         | Most controls meet 44 px at 390 px. Dock pins clipped at rest, cramped title bar and tablet targets, a 23 px CTA, and sticky hover after tap.                                                               | M-4, M-5, M-6, M-7, M-8, L-7           |
| 3. Performance              | 7         | Lab LCP medians under 2.5 s and near-zero mobile CLS. Desktop CLS 0.04 on /about. About 50 % of shell JS and 75 % of logon CSS unused. Oversized images.                                                    | M-9, M-10, M-11, M-12, L-9, L-10, L-11 |
| 4. Style selection          | 7         | Win7 chrome is applied consistently across reading routes and suits the concept. Undercut by two radius systems, glow leftovers, and one window body in the wrong surface.                                  | M-13, M-14, L-12, L-14                 |
| 5. Layout and responsive    | 6         | No horizontal overflow at 390 or 768. Short viewports (640x360) cover CTAs, the pin strip hides destinations, and tablet portrait hides the app row.                                                        | M-15, M-16, L-16, L-17, L-13           |
| 6. Typography and colour    | 5         | Dark theme leaves light-theme text tokens in several components (footer, search, code, sidebar index). Light theme mostly passes.                                                                           | C-1, C-2, H-1, H-4, M-1                |
| 7. Animation                | 7         | Reduced motion removes running animation at load. The fixed 3 s logon loader is a design call. Low confidence: the animation lens produced no confirmed finding beyond the loader.                          | L-5                                    |
| 8. Forms and feedback       | 6         | Copy Link gives a clear status toast. Search has an accessible result count. Low confidence: the live contact page has no form (it offers a mailto CTA and social links), so form behaviour was not tested. | M-6, M-7                               |
| 9. Navigation               | 6         | Ctrl+K search, language menu and dock navigation work. Escape navigates home from page content, the 404 page duplicates the language control, and two pins are hidden at rest on phones.                    | M-3, L-3, M-4, M-2                     |
| 10. Charts and data viz     | 5         | The Proof Atlas schematic is the only chart. Its labels are about 8 px at 1280 px and hidden on phones. No data charts exist to audit.                                                                      | M-16                                   |
| First impression            | 8         | Logon, desktop, and reading windows read as one concept and are memorable. Clear entry points (Explore My Work, Proof Atlas). The 3 s loader adds a wait before the desktop.                                | L-5                                    |
| RTL and i18n                | 6         | `/fa` and `/ar` set `lang` and `dir`, and the skip link is translated. Footer and search defects reproduce on `/ar/projects`. Low confidence: no full RTL layout audit of windows, dock or Atlas.           | C-1, H-1                               |

---

## 3. Findings

Grouped by severity, then by lens. Evidence paths point to screenshots and scripts saved during the audit run.

### Critical (3)

#### A11Y-V-01: Explorer footer unreadable in Aero Night on project pages

- **Lens**: Accessibility (visual)
- **Rule**: WCAG 1.4.3 Contrast (Minimum); quick-reference color-accessible-pairs, contrast-readability, color-dark-mode
- **Routes**: /en/projects/project-simurgh (dark), /en/projects (dark, inferred from the same footer component)
- **Evidence**: Crop uiux/a11y-visual/crops/simurgh-footer/footer-dark-0.png shows 'Let's talk' heading and 'Contact' button label in near-black on navy, body line 'For research collaboration...' nearly invisible, copyright dim, footer links blue on navy. Probe uiux/a11y-visual/json/cx-simurgh-dark.json: h2 1.50:1, p 1.29:1, Contact 1.50:1, footer links 2.51:1 (computed-colour bg detection, confirmed visually). Projects-dark probe timed out; footer seen in first-pass old tool output as 1.50:1 (not visually re-checked).
- **Impact**: A recruiter or hiring manager reaching the closing call-to-action on any project page in dark mode cannot read the heading, the contact invitation, or the Contact button label. This is the page's main conversion point.
- **Recommendation**: Give the explorer footer its own token-driven foreground set for dark mode (text, muted text, link colour, button label) that meets 4.5:1 on the navy footer background. Check the .os-explorer-footer rules in project-explorer.css and the Contact button in the same file.
- **Likely files**: src/components/os/project-explorer.css, src/components/os/ProjectExplorer.tsx
- **Verifier**: Reproduced in Aero Night on /en/projects/project-simurgh and /en/projects (same footer component). Computed text on the navy footer (rgb 19,44,80): Let's talk h2 and Contact label #000 at 1.50:1, body line and copyright #3d3d3d at 1.29:1, footer links #0066cc at 2.51:1. Root cause: project-explorer.css:128 sets dark --explorer-footer-bg #132c50, but the footer text uses --win7-body-text/--win7-body-muted (#000/#3d3d3d, win7-theme.css:161-163), which are not redefined for dark in this scope. Visible in verify-simurgh-footer-dark.png. Sits on the main closing CTA, so it fails WCAG 1.4.3 on a core path.

#### A11Y-V-03: Lab code-panel header and line numbers at 1.74:1 in dark mode

- **Lens**: Accessibility (visual)
- **Rule**: WCAG 1.4.3 (text); quick-reference contrast-readability, color-dark-mode
- **Routes**: /en/lab/001 (dark), /en/lab/<id> (dark, same component)
- **Evidence**: Computed: .os-code-panel-head span 'Source code · original language' and 'src/main.rs' rgb(61,61,61) on rgb(10,17,32) = 1.74:1; .os-code-number line numbers same pair = 1.74:1. Code text .os-code-scroll rgb(223,234,247) = 15.49:1, so the code body passes. Visible in uiux/a11y-visual/lab001-dark.png.
- **Impact**: Line numbers and the file-name header are hard to read for dark-mode users. Code tokens are fine.
- **Recommendation**: Raise the header and line-number colour to at least 4.5:1 on the dark code background, for example to a token near the code text colour with reduced opacity kept above the threshold.
- **Likely files**: src/app/[locale]/lab/[id]/LabDetailClient.tsx, src/components/os/supporting-apps.css, src/components/os/win7-pages.css
- **Verifier**: Header and line numbers confirmed at 1.74:1 (#3d3d3d on rgb(10,17,32)). The lead's claim that the code body passes at 15.49:1 is wrong: that colour (#dfeaf7) is on the <pre>/scroll container, but the actual code glyphs (span.os-code-text inside code) compute to #000, about 1.11:1 on the panel. A pixel check of a code-line clip found no pixel brighter than the background, and verify-line clip shows black text on navy. Cause: .os-support code { color: var(--os-text) } (supporting-apps.css:60-66) where --os-text resolves to #000 in the lab detail scope. Upgraded to critical because the lab listing is the page's main content and the glyphs fail WCAG 1.4.3 in dark mode. Light mode was not affected in the check.

#### SC-01: Projects explorer footer is near-invisible in Aero Night

- **Lens**: Style consistency
- **Rule**: quick-reference 6 color-accessible-pairs; 4 color-semantic / dark-mode-pairing; pro-rules Token-driven theming
- **Routes**: /en/projects, /en/projects/<slug> (all explorer detail pages), /ar/projects
- **Evidence**: Measured in dark theme: footer background rgb(19,44,80) (#132c50); h2 'Let's talk' is #000 = 1.50:1; footer copy is #3d3d3d = 1.29:1; the 'Mohammad Raouf Abedini' copyright is in the same band. Screenshot: /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/style-consistency/footer-projects-dark.png . Source: src/components/os/project-explorer.css:128 sets the dark footer background to #132c50, but footer text at lines ~940-980 uses var(--win7-body-text) (#000 in the light token set) and var(--win7-body-muted). No per-theme footer text token exists.
- **Impact**: In the default dark theme the closing contact call-to-action ('Let's talk', the contact sentence, and the Contact button's surrounding text) and the copyright are effectively unreadable on every project page. This is the recruiter's final contact path on the main project index.
- **Recommendation**: Add a footer text token per theme (e.g. --explorer-footer-fg: #f1f7ff and --explorer-footer-muted: #b4c6da in the dark block near project-explorer.css:128) and point the footer h2, p, meta and links at it; or keep the footer on the light surface like the light theme does. Re-measure both themes.
- **Likely files**: src/components/os/project-explorer.css
- **Verifier**: Reproduced live on https://raoufabedini.dev/en/projects in dark theme (1440px), and also on /ar/projects (RTL) and at 390px phone width. Footer background is rgb(19,44,80) #132c50. Pixel sampling of footer-projects-dark-footer-center.png confirms the 'Let's talk' h2 and the Contact link text are rgb(0,0,0), and the sentence and copyright are #3d3d3d. Tool ratios: h2 1.50:1, sentence 1.29:1, Contact 1.50:1, copyright 1.29:1, meta links 2.51:1, all failing WCAG 1.4.3. Source: project-explorer.css:128 sets --explorer-footer-bg to #132c50 in the dark block, and no footer text token exists per theme (footer h2/p/a rules at project-explorer.css:955-994 use inherited black or #3d3d3d). Severity raised from high to critical per the rubric: it fails WCAG AA on the core contact path of the project index. Evidence: uiux/style-consistency/projects-dark-live.png, footer-projects-dark-footer-center.png, projects-dark-full.png.

### High (11)

#### a11y-focus-lost-on-window-open: Keyboard focus does not move into a window when it opens

- **Lens**: Accessibility (keyboard and semantics)
- **Rule**: WCAG 2.4.3 Focus Order; UX focus-on-route-change; keyboard-nav
- **Routes**: /en (taskbar Projects link and Proof Atlas 'Open Project Evidence' link), /en/projects/project-simurgh
- **Evidence**: Verified in headless Chromium at 1440x900 (lens-a11y-keyboard-sr/dock-open.mjs, window-focus.mjs, window-dom.mjs, window-open-compare.mjs). (a) Tab to the taskbar 'Projects' link and press Enter: the window opens (role=main, labelled 'Projects'), but focus stays on the taskbar link; the next four Tabs go to Research, About, Resume, Contact. (b) Tab to the Proof Atlas 'Open Project Evidence' link and press Enter or click: the URL becomes /projects/project-simurgh and the window h1 'Project Simurgh' exists and accepts focus, but document.activeElement is BODY at 50, 250, 700 and 1500 ms and after one Tab (uiux/a11y-keyboard-sr/window-opened-focus.png). Code intent: WorkspaceWindows.tsx activation effect (~L195-230) focuses the window h1, and ResearchOS.tsx focusWorkspaceWindow (~L471-488) routes the page; the focus move is not landing.
- **Impact**: Screen-reader and keyboard users are not placed inside the window they just opened. To reach its content they must Shift+Tab across the whole desktop, or the focus is lost to the document body.
- **Recommendation**: After a window activation completes (window mounted, not inert), move focus to its h1 or pane. Do not let the trigger become inert before focus has moved. Add an automated check: after Enter on a dock link and on the Proof Atlas link, document.activeElement must be inside the new role=main window.
- **Verifier**: Reproduced on the live site at 1440x900 (scripts in /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/lens-a11y-verifier/focus-open.mjs and focus-trace.mjs). Dock route: Enter on the taskbar Projects link opens the window (role=main) but focusin logging over 2 s shows no focus move into it; the next Tab goes to the taskbar Research link. Proof Atlas route: focus is BODY at 250, 700 and 1500 ms after navigation to /projects/project-simurgh, and one Tab lands on the taskbar Desktop button, not in the page. Mouse click gives the same BODY result. The h1 'Project Simurgh' exists and accepts programmatic focus, so the failure is the focus move, not the target. Cause in WorkspaceWindows.tsx activation effect is inferred, not verified. Severity kept at high because focus is lost on a core path, though keyboard users are not blocked.

#### A11Y-V-02: Projects search field and category select: text 1.21:1, placeholder 1.60:1 in dark mode

- **Lens**: Accessibility (visual)
- **Rule**: WCAG 1.4.3 and 1.4.11 (input text and boundary); quick-reference contrast-readability, input-labels (labels present, colour fails)
- **Routes**: /en/projects (dark), /en/projects/<slug> sidebar (dark)
- **Evidence**: Computed via lens-a11y-visual/colors.mjs: input[type=search] text rgb(0,0,0) on rgb(10,26,51) = 1.21:1; placeholder rgb(61,61,61) on same background = 1.60:1. Select #..-category text rgb(0,0,0) on rgb(10,26,51) = 1.21:1. Visible in crop uiux/a11y-visual/crops/proj-dark/proj-dark-0.png (placeholder 'Search Projects' is dim italic, select text is dark on navy).
- **Impact**: Typed search queries and the category filter are close to invisible for dark-mode users, which undermines the main filtering path on the projects index.
- **Recommendation**: Set the input and select foreground to a light token in dark mode and set placeholder colour to at least 4.5:1 against the field. Keep the field background opaque.
- **Likely files**: src/components/os/project-explorer.css, src/components/os/ProjectExplorer.tsx
- **Verifier**: Reproduced on /en/projects dark. Search input text #000 on rgb(10,26,51) = 1.21:1; placeholder #3d3d3d = 1.60:1; category select text is also black on navy. Labels are present (aria-label), so input-labels passes; the colour fails 1.4.3. Visible in verify-projects-dark.png. Sidebar on project pages was not separately probed.

#### F1: Phone taskbar: tapping pinned Contact locks the desktop; Resume opens Search

- **Lens**: First impression and i18n
- **Rule**: persistent-nav; nav-label-icon; touch-target-size
- **Routes**: /en (390px phone, after sign-in), all locales at phone width (Viewport 390x844, dark or light. Pinned strip ends at x=198px; the top-actions tray (search, lock, theme, language) sits over it, and Resume (x 203-247) and Contact (x 251-295) are clipped.)
- **Evidence**: Hit-test at the Contact centre (273,819) returns the Lock button (probe: lens-first-impression-design/probe-hit2.mjs). Real tap at that point returns to the logon screen (uiux/first-impression-design/phone-tap-contact.png). Tap on Resume opens the Search panel (uiux/first-impression-design/phone-tap-resume.png). Phone taskbar shows icon-only pins (phone-desktop.png). Strip has overflow:hidden (win7-taskbar.css ~L88-105).
- **Impact**: On phones, the two most important recruiter destinations (Contact and Resume) cannot be reached from the taskbar. A tap on Contact drops the visitor back to the logon screen, which looks like a crash.
- **Recommendation**: At phone widths, stop the tray overlapping the pinned strip (or move Lock/search/theme/language into a menu). Make the strip scroll with a visible overflow cue, or reduce pins to fit. Add a visible Contact/Resume CTA inside the intro window, which is already on screen at phone width. Keep Lock out of the reach of pinned-app taps.
- **Likely files**: src/components/os/win7-taskbar.css (dock strip L88-105, .os-top-actions L360), src/components/os/research-os.css (mobile .os-top-actions L1738-1746), src/components/os/ResearchOS.tsx
- **Verifier**: Reproduced at 390x844 in en and fa, dark and light. The Contact centre (273,818) hit-tests to the Lock button, and a real tap returns to the logon screen. Tapping the Résumé pin (centre ~225) opens the Search panel. Pins sit under the tray; the phone taskbar shows icon-only pins (uiux/fid-verify/phone-taskbar-en-dark.png). Downgraded from critical: Résumé and Contact are still reachable from the desktop icons after scrolling os-desktop (tap on /contact verified). Rule IDs exist in quick-reference.

#### F2: Dark theme: Explorer footer text is black or grey on navy; Contact CTA nearly invisible

- **Lens**: First impression and i18n
- **Rule**: color-accessible-pairs; color-dark-mode; dark-mode-pairing
- **Routes**: /en/projects/project-simurgh (and every Explorer project page, dark theme) (Dark appearance (localStorage researchos.appearance.v1=dark). Light theme is fine (black on white).)
- **Evidence**: Footer background becomes rgb(19,44,80) in dark while the text stays rgb(0,0,0) for the h2 and CTA, rgb(61,61,61) for the description and copyright (lens-first-impression-design/probe-footer.mjs output). Crop: uiux/first-impression-design/crop-explorer-footer-dark.png (light crop for comparison: crop-explorer-footer-light.png). Estimated ratios: heading and CTA label about 1.5:1, description and copyright about 1.3:1, footer links about 2.5:1.
- **Impact**: The only persistent 'Let's talk / Contact' call to action at the bottom of every project is effectively unreadable in dark mode. The collaboration and recruiter path disappears at the end of every project page.
- **Recommendation**: Use semantic footer tokens that change with the theme (footer background and text pair together). In dark mode, use light text on the navy footer or a light footer surface. Check the Contact button separately.
- **Likely files**: src/components/os/project-explorer.css (dark block sets --explorer-footer-bg #132c50 at L128; footer rule L934-963), src/components/os/win7-theme.css (--win7-body-text #000 at L161)
- **Verifier**: Explorer footer (.os-explorer-footer) in dark: background rgb(19,44,80), text black. Computed contrast: heading and Contact CTA about 1.5:1, paragraph #3d3d3d about 1.29:1, meta link #0066cc about 2.5:1. Root cause confirmed: --explorer-footer-bg #132c50 is set in the dark block while --win7-body-text stays #000 (project-explorer.css L128, win7-theme L161). The global site footer is fine and was not the target.

#### F3: Dark theme: Explorer category select and search placeholder unreadable; Arabic chevron overlaps label

- **Lens**: First impression and i18n
- **Rule**: color-accessible-pairs; contrast-readability
- **Routes**: /en/projects (desktop and phone), /ar/projects/project-simurgh (phone 390px) (Dark appearance. The Arabic chevron overlap is at 390px.)
- **Evidence**: Select text computes to rgb(0,0,0) on rgb(10,26,51) (about 1.2:1; 'All Categories' and 'كل الفئات' nearly invisible). Search placeholder computes to rgb(61,61,61) on navy (about 1.3:1). Crops: uiux/first-impression-design/crop-en-390-ctrl.png and crop-ar-390-ctrl.png. Arabic at 390px: the select chevron sits on the first glyph of 'كل الفئات'. Token --explorer-select-text is #fff in the dark block (project-explorer.css ~L107), yet the rendered select stays black, so the token is not reaching the control.
- **Impact**: The filter for 13 projects is hard to read in dark mode, and the Arabic phone view has a visible collision. The first control a visitor uses to browse is the least legible.
- **Recommendation**: Apply --explorer-select-text and --explorer-select-muted to the select's color and placeholder. Check contrast of placeholder text (at least 4.5:1 or use visible label text). In RTL, pad the select so the chevron sits clear of the text.
- **Likely files**: src/components/os/project-explorer.css (select tokens ~L30-42, L97-116), src/components/os/ProjectExplorer.tsx
- **Verifier**: Select computes to color rgb(0,0,0) on rgb(10,26,51), about 1.21:1, at 1440 and 390 in en and ar. At 390 in ar the chevron overlaps the first glyph of 'كل الفئات' (uiux/fid-verify/select-ar-dark-390.png). Diagnosis correction: the select rule (project-explorer.css ~L272-277) sets color to --os-text, not --explorer-select-text, so the token is not used by the control. Placeholder #3d3d3d on navy is about 1.6:1 (inferred from the select background).

#### F4: Dark theme: active 'Boundary explanations' item has black text on navy

- **Lens**: First impression and i18n
- **Rule**: color-accessible-pairs; state-clarity
- **Routes**: /en/projects/project-simurgh (Boundary explanations, item 01 active) (Dark appearance. Item 01 is the highlighted state.)
- **Evidence**: List item background rgb(27,61,102) with text rgb(0,0,0) (about 1.9:1, from lens-first-impression-design/probe-contrast.mjs). Crop: uiux/first-impression-design/crop-simurgh-explanations.png. The inactive items use dark text on white and read fine.
- **Impact**: The highlighted explanation, the one a reader is most likely to read, is the hardest to read in the section.
- **Recommendation**: Set the active state text to the light token in dark mode, or use a light tint background for active items.
- **Likely files**: src/components/os/evidence-story-simurgh.css (.os-simurgh-explanations li L174-210)
- **Verifier**: Active explanation li (aria-current step) computes to black text on rgb(27,61,102), about 1.91:1. Inactive items are white with #3d3d3d text (10.9:1). Source: evidence-story-simurgh.css. Confirmed on /en/projects/project-simurgh at 1440 dark.

#### nav-phone-dock-clipped: Phone and tablet taskbar clips the Resume and Contact pins

- **Lens**: Navigation and IA
- **Rule**: persistent-nav and adaptive-navigation (quick-reference 9)
- **Routes**: / at 390x844 (phone), / at 768x1024 (tablet) (Verified with Chromium device emulation (isMobile) at 390x844 and 768x1024. Mobile Safari was not checked.)
- **Evidence**: probe12.mjs output: at 390px, .os-dock-strip clientWidth 141, scrollWidth 240, right edge 198px; Resume pin at 203-247px and Contact pin at 251-295px sit outside the strip. At 768px the strip right edge is 428px; Contact sits at 462-558px (outside) and Resume at 361-458px (cut). Screenshot /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/navigation-ia/d-phone390.png shows only Projects, Research and About before the tray. The strip is overflow-x:auto with no scroll affordance. On the 390px desktop, the Resume and Contact desktop icons sit at y=1244, below the 844px fold. At 1280px the strip fits (879 client, 879 scroll).
- **Impact**: On phones and tablets, which are part of the stated audience, Contact is not visible in the taskbar at all and Resume is hidden. A recruiter has to discover the scrollable strip or scroll the desktop to find them.
- **Recommendation**: At narrow widths show every pin (icon-only, or a More menu), or move Resume and Contact into the intro above the fold. If the strip stays scrollable, add an overflow cue.
- **Verifier**: Reproduced (lens-nav-verifier/dock-verify.mjs). 390x844 isMobile: strip clientWidth 141, scrollWidth 240, overflow-x auto; Resume and Contact pins lie outside the strip rect (offscreen). 768x1024: strip right edge 428, Resume and Contact outside. 1280x800: strip 879/879, all five pins visible. Screenshot uiux/nav-verifier/dock-390.png shows only Projects, Research, About before the tray with no overflow cue. Contact is reachable only by scrolling the strip or the desktop icons, which sit at y=1244 below the 844px fold. Keep high: primary navigation hidden by default on the stated phone and tablet audience.

#### SC-03: Explorer search and category select are navy in dark theme; other routes keep white fields

- **Lens**: Style consistency
- **Rule**: quick-reference 4 consistency; state-clarity; quick-reference 6 color-accessible-pairs; pro-rules Semantic theme tokens used consistently
- **Routes**: /en/projects, /en/projects/<slug>, /ar/projects, /en/projects (phone 390px)
- **Evidence**: Measured: the category select text #000 on rgb(10,26,51) = 1.21:1; the search placeholder is #3d3d3d on the navy field. Screenshots: /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/style-consistency/r01-_en_projects.png, phone-projects.png and rtl-ar-projects.png (navy fields). The Write-ups search and 'All Topics' select on the same Win7 reading body are white (r06-_en_write-ups.png). Source: src/components/os/project-explorer.css:114-120 defines dark --explorer-field-bg #0a1a33 and field line tokens; they are applied at lines ~239 and ~279-282 while the field text stays black.
- **Impact**: The explorer's only filter controls, the main way to browse the 13 projects, are dim and hard to read in dark mode, and they look different from the search on Write-ups. Two search fields on the same site do not look like one control.
- **Recommendation**: Use one field treatment for search and select across the OS. Either white fields with dark text in both themes (as Write-ups does), or add light field-text tokens (e.g. --explorer-field-fg #f1f7ff) to the dark block and apply them to the input, placeholder and select.
- **Likely files**: src/components/os/project-explorer.css, src/components/os/ProjectExplorer.tsx, src/components/os/win7-pages.css
- **Verifier**: Reproduced on /en/projects dark theme. The Projects search field and category select sit on navy #0a1a33 (select computed bg rgb(10,26,51), value text rgb(0,0,0), about 1.2:1 by ratio; search placeholder #3d3d3d on the navy field, about 1.6:1). The Write-ups search and 'All Topics' select are white with dark text in the same dark theme (uiux/style-consistency/wu-dark-full.png), so the two search fields look different. Severity raised from medium to high: the select value fails WCAG 1.4.3 on the project-browsing control. Not checked: the phone and RTL search fields were not individually screenshotted, though the phone and RTL projects pages were audited and showed the same footer failure. Evidence: projects-dark-full.png, footer-projects-dark-footer-center.png. Source: project-explorer.css:114-120 and 239, 279-282.

#### TC-01: Active taskbar label is white on a light steel highlight in Aero Night

- **Lens**: Typography and colour
- **Rule**: color-contrast (WCAG 1.4.3; quick-reference section 1) with color-accessible-pairs and nav-state-active
- **Routes**: /en/about (dark), /en/contact (dark), /en/projects (dark), /fa/about (dark) (Aero Night; the active pinned app carries aria-current=page)
- **Evidence**: Pixel test under the text (hidden-text background sample, text colour composited): About 3.14:1, Contact 3.13:1, Projects 3.17:1, fa 'درباره من' 3.03:1, all need 4.5:1, background about #7a95a8. See /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/type-colour/measure/about-en-dark.json, contact-en-dark.json, proj-en-dark.json, fa-about-dark.json. 3x zoom taskbar-about-dark.png shows the active label visibly weaker than its neighbours. The same control in light mode (taskbar-about-light.png) is black on the highlight and passes.
- **Impact**: The label that shows which window is active is the weakest text in the dock, in the dark theme that night-time readers choose.
- **Recommendation**: In Aero Night give the active pin a dark plate (the navy gradient already used by the dock) with the dock's white text, or keep the light plate and switch its label to dark text. Keep a text-shadow. Target 4.5:1 for 13px text and re-measure.
- **Likely files**: src/components/os/win7-taskbar.css:152,159 (dock labels color #ffffff), src/components/os/win7-taskbar.css:256-260 (active gradient rgb(255 255 255 / 0.2 to 0.65))
- **Verifier**: Reproduced live on https://raoufabedini.dev (Aero Night, 1440px, 3x). Active dock label 'About' computes to rgb(255,255,255) with a 1px text-shadow, sitting on a rendered highlight sampled from pixels at mean #7f94a7 (top #8b9dad). White vs that background = 3.14:1 (3.03:1 for fa 'درباره من'; Projects 3.14:1 and Contact 3.14:1 on the same highlight). Fails 4.5:1 for 13px text; the text-shadow does not count toward the ratio. Light mode passes: label computes black on about #bdd8da = 14.0:1. The shot.mjs lowContrast array came back empty for this route, so that tool's approximation misses it; the direct pixel sample is authoritative. Source: win7-taskbar.css active rule (~lines 256-258) uses a light gradient rgb(255 255 255/.2 to .65). Evidence: lens-type-colour-verifier/active-about-dark.png, active-about-light.png, sample-bg.mjs.

#### TC-02: Project-detail sidebar index header renders black on navy

- **Lens**: Typography and colour
- **Rule**: color-contrast (WCAG 1.4.3) with color-accessible-pairs and color-semantic
- **Routes**: /en/projects/invisible-window-research (dark), any /en/projects/<slug> detail route in Aero Night (On detail routes the 'All Projects' index row is not aria-current, so it keeps the light text colour)
- **Evidence**: 'All Projects' span: #000 on #18345a, 1.68:1, weight 600 (measure/proj-en-dark.json). 4x zoom uiux/type-colour/zoom-index-link-dark.png shows black text and folder icon on navy; only the count badge is white. On /en/projects the same row is aria-current and renders white (uiux/type-colour/sidebar-top-dark-3x.png), so the colour depends on route state.
- **Impact**: The root of the project explorer is unreadable on the detail page, which is where project links from elsewhere land.
- **Recommendation**: Drive the index row colour from a theme token (for example --explorer-nav-text) instead of --win7-body-text, set it to light text in Aero Night, and verify both aria-current states in both themes.
- **Likely files**: src/components/os/project-explorer.css:157 (color: var(--win7-body-text) on .os-explorer-index-link and .os-explorer-project-link), src/components/os/project-explorer.css:176-180 (only [aria-current=page] takes --explorer-select-text)
- **Verifier**: Reproduced on /en/projects/invisible-window-research (dark). The '.os-explorer-index-link' 'All Projects' (13px, weight 600) computes to rgb(0,0,0) over a sampled navy background of rgb(23,51,89): contrast 1.65:1. On /en/projects, the same row carries aria-current=page and computes to rgb(255,255,255), so the colour depends on route state, as claimed. The explorer rule in project-explorer.css (~line 157) takes color: var(--win7-body-text), and only [aria-current] gets --explorer-select-text. Note: a separate 'All Projects' breadcrumb on the detail route is white on white at a different location; the finding is about the sidebar row (x≈306,y≈198), which was verified.

#### TC-03: Dark explorer search placeholder and category select are near-invisible

- **Lens**: Typography and colour
- **Rule**: color-contrast (WCAG 1.4.3) with color-accessible-pairs, color-dark-mode and dark-mode-pairing
- **Routes**: /en/projects (dark), /en/projects/<slug> (dark) (Aero Night)
- **Evidence**: Placeholder 'Search Projects' rgb(61,61,61) on field #0a1a33: 1.60:1 (measure/projects-dark.json). Category select text #000 on the same field: about 1.19:1 by token arithmetic (--explorer-field-bg #0a1a33 against --os-text #000); it reads as near-black on navy in uiux/type-colour/sidebar-top-dark-3x.png.
- **Impact**: The filter prompt and the current category, the main controls for narrowing the portfolio, cannot be read in dark mode.
- **Recommendation**: In the Aero Night block also set --os-text and --os-muted (light values already exist in that block: #f1f7ff and #b4c6da). Re-measure so the placeholder and the select text each reach 4.5:1.
- **Likely files**: src/components/os/project-explorer.css:12-20 (light --os-text and --os-muted never overridden in dark), src/components/os/project-explorer.css:92-130 (Aero Night block), src/components/os/project-explorer.css:255-260 (placeholder uses --win7-body-muted)
- **Verifier**: Reproduced on /en/projects (dark). Search input placeholder computes rgb(61,61,61) over the field background rgb(10,26,51): 1.60:1. The native category select ('All Categories') computes to rgb(0,0,0) on rgb(10,26,51): 1.21:1. Both are core filter controls. Source: project-explorer.css Aero Night block (lines ~92-130) does not override --os-text or --os-muted, and the placeholder rule (~line 255) uses --win7-body-muted. The proposed light tokens #f1f7ff and #b4c6da reach 16.1:1 and 10.0:1 on that field, so the recommendation is sound.

### Medium (27)

#### a11y-escape-navigates-home: Escape closes the active window and navigates home even when focus is on page content

- **Lens**: Accessibility (keyboard and semantics)
- **Rule**: UX back-stack-integrity; keyboard-shortcuts; escape-routes
- **Routes**: /en/projects, any reading or workspace window
- **Evidence**: lens-a11y-keyboard-sr/behaviours.mjs case 2: focus on the /en/projects h1 and press Escape; URL changes from /projects to / after 2.5 s. Case 3: Escape inside the search input does not navigate (correct). Code: ResearchOS.tsx keydown effect (Escape branch, ~L540-556) calls router.push(home) for any Escape outside text fields, unless a dialog is open or the window is minimised.
- **Impact**: A keyboard user who presses Escape to dismiss something else, or to back out of a focused element, is silently taken to the home page. There is no confirmation and no visible shortcut hint.
- **Recommendation**: Restrict the window-close Escape to when focus is inside the active window and no transient UI is open, and document the shortcut in the visible UI or in an accessible help line. Do not navigate away when Escape is pressed on plain body content.
- **Verifier**: Reproduced: on /en/projects with focus on the h1, Escape changes the URL from /projects to / within 2.5 s. Also reproduced on /en/about with focus on body content (blurred paragraph): Escape navigates to /. Code matches ResearchOS.tsx keydown handler (~L540-556): any Escape outside text fields navigates home when not on home, not minimised and no search dialog open. Escape inside a search input was not re-run by this verifier.

#### A11Y-V-05: Desktop icon sub-labels at 12px white on light Aero wallpaper, about 3.8:1

- **Lens**: Accessibility (visual)
- **Rule**: WCAG 1.4.3 (small text 4.5:1); quick-reference color-accessible-pairs, contrast-data (text overlaid on wallpaper)
- **Routes**: /en (desktop, light theme)
- **Evidence**: Probe uiux/a11y-visual/json/cx-desk-light.json: 'Start a conversation' 12px white, box [29,654,110,34], p5 3.78:1, median 4.17:1, below 4.5 for small text. Crop uiux/a11y-visual/crops/desk-light/icons-light-0.png. Dark theme passed on the same probe (cx-desk-dark.json, 0 failures).
- **Impact**: The app-entry descriptions are hard to read on the lighter day wallpaper, especially on phones and for low-vision users.
- **Recommendation**: Use a stronger text shadow or a translucent dark backing behind icon labels in light mode, or raise the sub-label to 13px and check it against the wallpaper gradient stops in win7-theme.css.
- **Likely files**: src/components/os/win7-desktop.css, src/components/os/win7-theme.css, src/components/os/Desktop.tsx
- **Verifier**: Confirmed in light theme on /en. The 'Start a conversation' small label is 12px white with a text-shadow of rgba(0,0,0,.85) 0 1px 2px. Pixel sampling of the background behind the text gives 4.27:1 at median and 3.74:1 at the 90th percentile, below 4.5:1 for small text. The shadow visibly helps (verify desk-light-subtitle.png), so the failure is nominal rather than severe. Dark theme was not rechecked.

#### A11Y-V-07: Phone-width taskbar is icon-only with no visible labels

- **Lens**: Accessibility (visual)
- **Rule**: quick-reference nav-label-icon (navigation items need icon and text label); quick-reference touch-target-size (labels aid recognition at small size)
- **Routes**: all routes at 390px width (taskbar)
- **Evidence**: Screenshot uiux/a11y-visual/phone-about-dark.png at 390x844: the bottom dock shows Start orb, folder, book, person, search, lock, theme and language icons with no text labels. Phone layout had no horizontal overflow (shot.mjs hOverflow=false). Accessible names were not verified at 390px (inferred from desktop DOM check).
- **Impact**: Phone visitors have to guess what each dock icon opens (for example, the person icon is About).
- **Recommendation**: Show a short text label under the dock icons at phone width, or add a visible label on the active app, and confirm each icon has an aria-label at that breakpoint.
- **Likely files**: src/components/os/win7-taskbar.css, src/components/os/ResearchOS.tsx
- **Verifier**: Confirmed at 390x844 dark on /en/about (verify phone-about-dark.png). The bottom dock shows icons only (Desktop, Projects, Research, About, Résumé, Contact, search, lock, theme, language) with no visible text. Accessible names do exist (text is in the DOM but visually hidden), so this is a discoverability issue rather than a missing-name issue. Cited rule nav-label-icon is valid. Scrolled body text also runs behind the dock at the bottom edge in the same screenshot; not investigated further.

#### ANIM-01: Logon Enter forces a fixed 3 s wait that cannot be skipped or cancelled

- **Lens**: Animation
- **Rule**: no-blocking-animation / interruptible / loading-states (UI/UX Pro Max quick-reference, section 7 and 3)
- **Routes**: /en (logon, #os-enter)
- **Evidence**: Code: src/components/os/WelcomeEnter.tsx:7 sets WELCOME_LOADER_MS = 3000 and enter() runs a fixed timer (lines ~110-130); the button is disabled and the profile tile is made inert while loading; no Escape or cancel handler exists (grep for escape/keydown/cancel finds only unmount bookkeeping). Runtime: /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/animation/nm-log.json logonSamples show enterDisabled=true from 564 ms to 3015 ms. Timeline in the same file: data-leaving at 2893 ms, desktop arrival at 3100 ms, identical in rm-log.json.
- **Impact**: Every visitor, including recruiters on a phone with a short attention span, waits about 3 s before any content, and the wait is not tied to real readiness. The rest of the logon cannot be used while it runs.
- **Recommendation**: Finish the wait when the desktop is ready (or cut it to about 1 s), and let a second press or Escape skip it. If the cinematic wait is a deliberate brand choice, keep it but make it interruptible and say so in the status line.
- **Verifier**: Source confirmed: WelcomeEnter.tsx WELCOME_LOADER_MS = 3000, enter() uses a fixed timer, button disabled while loading, no Escape or keydown skip. Runtime confirmed: Escape and a second Enter do not skip; logon still present at 3201 ms and gone by 3551 ms. Kept at medium because it is a non-skippable gate on the entry screen. It is not a WCAG A/AA failure.

#### F5: Logon orb has no visible label; the only cue is a bare arrow

- **Lens**: First impression and i18n
- **Rule**: nav-label-icon; primary-action
- **Routes**: /en (desktop and phone logon), /fa, /ar, /zh, /es logon (Logon screen before entry.)
- **Evidence**: Desktop and phone logon screenshots show only the orb with an arrow: uiux/first-impression-design/desk-logon.png and phone-logon.png. The label 'Explore the Lab' (en.ts enter_lab) is rendered as SPAN.os-enter-label with a 1x1px box (sr-only), so it is not visible. Hover does not reveal it either.
- **Impact**: A recruiter's first interaction is an unlabelled arrow. Some visitors will not know to click, and touch users have no hover hint.
- **Recommendation**: Show the existing 'Explore the Lab' text under or beside the orb (it is already translated in all five locales). Keep the orb as the primary action.
- **Likely files**: src/components/os/WelcomeEnter.tsx, src/components/os/welcome-enter.css, src/i18n/locales/en.ts (enter_lab L69)
- **Verifier**: Visible logon affordance is the 56px orb with an arrow only. The span .os-enter-label reads 'Explore the Lab' but is 1x1px (sr-only), so it is not visible, and hover does not reveal it. Severity lowered from high: the sr-only text gives the control an accessible name, so this is a sighted-user discoverability issue, not an accessibility failure. Accessible name itself was not separately tested.

#### F6: Logon gate repeats on every home visit with a forced wait of about 3 seconds and no skip

- **Lens**: First impression and i18n
- **Rule**: progressive-loading; loading-states
- **Routes**: /en and other locale roots (Reloading the root page shows the logon again (verified). The wait was measured once from orb click to logon hidden, about 3.1s.)
- **Evidence**: lens-first-impression-design/probe-repeat.mjs: logonAfterReload=true. lens-first-impression-design/probe-misc.mjs: logonToDeskMs=3131. Loader state: uiux/first-impression-design/loader-f1.png ('Opening the research desk'). Only skip control is the screen-reader 'Skip to main content' link. CLAUDE.md documents the 3s loader.
- **Impact**: Recruiters who return, or who are in a hurry, must click and wait about 3 seconds before the work is visible. There is no way to skip it.
- **Recommendation**: Remember the unlock for the session, or let Enter or a click on the desktop skip the loader. Shorten the loader to about 1s, or run it behind the desktop so the content is already visible.
- **Likely files**: src/components/os/WelcomeEnter.tsx, src/components/os/win7-logon.css
- **Verifier**: Reload of /en shows the logon again (logonAfterReload=true). Orb click to #os-enter removed took 3099ms. WELCOME_LOADER_MS=3000 in WelcomeEnter.tsx, and no localStorage or sessionStorage use there, so no per-visit memory. 'No skip' is supported by the source and the observed flow; keyboard skip inputs were not tested exhaustively.

#### F7: Phone Explorer: project index fills the first screen and the work starts below the fold

- **Lens**: First impression and i18n
- **Rule**: content-priority; scroll-behavior
- **Routes**: /en/projects/project-simurgh (390px), /ar/projects/project-simurgh (390px) (Phone width. The index sits in a nested scroll region above the content.)
- **Evidence**: uiux/first-impression-design/phone-en-projects.png: only about 3.5 project rows are visible before the description starts near y=500. uiux/first-impression-design/phone-ar-projects.png shows the same layout in Arabic. Search field and category select are placed above the list.
- **Impact**: On a phone, a recruiter arriving on a project page sees a list, not the project. Nested scroll inside the window adds friction.
- **Recommendation**: On phone widths, collapse the index into a 'Projects (13)' button or sheet, and show the selected project first. Remove the nested scroll region below the breakpoint.
- **Likely files**: src/components/os/project-explorer.css, src/components/os/ProjectExplorer.tsx
- **Verifier**: 390px en light: project rows start at y=152 and continue inside a nested scroll region (.os-explorer-sidebar, overflow-y auto). H1 'Project Simurgh' is at y=532 and the description at y=570, so the work starts below the fold. Same layout in ar per the evidence set.

#### F8: Atlas diagram labels render at about 9px

- **Lens**: First impression and i18n
- **Rule**: readable-font-size; axis-labels
- **Routes**: /en desktop Proof Atlas window, /en phone Proof Atlas window (Labels 'Agent', 'Input', 'Context', 'Tool gate', 'Output' are 15 SVG units in a 552-unit viewBox scaled to 336px wide.)
- **Evidence**: lens-first-impression-design/probe-misc.mjs: svg viewBox 0 0 552 320 rendered at 336px; text fontSize 15px in SVG units, bounding height 10.2px. Visible in uiux/first-impression-design/desk-desktop.png and phone-desktop.png.
- **Impact**: The architecture labels that explain the diagram are hard to read, especially on phones and for anyone with low vision.
- **Recommendation**: Scale labels to at least 12px rendered (raise SVG font size or enlarge the diagram). Use HTML labels or a responsive viewBox at small widths.
- **Likely files**: src/components/os/ProofAtlas.tsx, src/components/os/proof-atlas.css
- **Verifier**: Atlas SVG viewBox 552 wide renders at 361px (desktop, scale 0.654) and 378px (phone, scale 0.685). Labels are 15 SVG units, so effective size is about 9.8px desktop and 10.3px phone, not 9px. Still under 12px for the architecture labels. Rule readable-font-size applies.

#### F9: Same destinations carry different names across chrome and content

- **Lens**: First impression and i18n
- **Rule**: navigation-consistency; nav-label-icon
- **Routes**: /en (bottom-left link, Lab window, logon), /es (taskbar vs desktop icons), /en/write-ups (EN and ES.)
- **Evidence**: Lab is named 'Experiments →' (bottom-left link, uiux/first-impression-design/desk-desktop.png), window title 'Experiments' (desk_en_lab.png), H1 'The Lab', logon 'Explore the Lab', URL /lab. ES: taskbar reads 'Estudios' and 'CV' while desktop icons read 'Investigación' and 'Currículum' (desk-es.png; probe-es output: taskbar aria-label 'Estudios (Investigación)', 'CV (Currículum)'). Write-ups window title is 'Research' over H1 'Write-ups' (desk_en_write-ups.png).
- **Impact**: Visitors cannot be sure two labels lead to the same place, which weakens wayfinding in a desktop metaphor that depends on consistent names.
- **Recommendation**: Pick one name per destination (for example 'Lab' everywhere) and use the same string in taskbar, icon, window title, and H1. Make the ES taskbar and icon strings match.
- **Likely files**: src/i18n/locales/en.ts, src/i18n/locales/es.ts, src/components/os/ResearchOS.tsx, src/components/os/WorkspaceWindows.tsx
- **Verifier**: ES phone and desktop: taskbar aria-labels are 'Estudios (Investigación)' and 'CV (Currículum)', while desktop icons read 'Investigación' and 'Currículum'. ES Lab appears as 'Experimentos' while the taskbar item is 'Estudios'. EN: bottom-left link 'Experiments →', window 'Experiments', H1 'The Lab', logon 'Explore the Lab'.

#### FB-01: Search dialog returns focus to BODY when opened with Ctrl/Cmd+K from an unfocused page

- **Lens**: Forms and feedback
- **Rule**: quick-reference 8 focus-management (WCAG 2.4.3 Focus Order)
- **Routes**: /en (ResearchOS search dialog)
- **Evidence**: Live probe (lens-forms-feedback/focus-validate.mjs): focus on BODY before shortcut; Control+k then Escape leaves document.activeElement = BODY. Contrast: opening via the taskbar Search button then Escape returns focus to the Search button (lens-forms-feedback/focus-reading.mjs, A_after_escape). Source: src/components/os/ResearchOS.tsx openSearch() stores returnFocus = document.activeElement (BODY when nothing is focused) and restoreSearchFocus() calls body.focus(), a no-op.
- **Impact**: A keyboard user who opens search with the shortcut and dismisses it loses their place; the next Tab starts from the top of the document instead of the Search control.
- **Recommendation**: In openSearch, ignore BODY/null as the return target and fall back to the taskbar Search button (or the desktop region) in restoreSearchFocus.
- **Verifier**: Reproduced live on https://raoufabedini.dev/en at 1440x900. Focus on BODY, Ctrl+K opens search (INPUT in dialog), Escape returns activeElement to BODY, and one Tab press leaves focus on BODY. Control: opening via the taskbar Search button then Escape returns focus to button.os-control 'Search'. Source confirmed: ResearchOS.tsx openSearch() stores document.activeElement (BODY) and restoreSearchFocus() calls focus() on it, a no-op. Rule citation is loose: quick-reference 'focus-management' covers focus after a submit error. WCAG 2.4.3 is the better criterion. Severity medium kept.

#### LR-01: Desktop intro and Proof Atlas windows ignore the viewport: on short or zoomed screens the Atlas sits below the fold and covers the intro CTAs

- **Lens**: Layout and responsive
- **Rule**: quick-reference 5: fixed-element-offset, content-priority, orientation-support (also touch-target-size where the CTAs are covered)
- **Routes**: / (desktop, after Enter) (Viewports 640x360, 720x450, 844x390; partly 390x844 (see LR-02).)
- **Evidence**: Measured with lens-layout/measure.mjs (data in /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/layout-responsive/data/m-640x360.json, m-720x450.json, m-844x390.json). At 640x360 (= 1280x720 at 200% zoom) the intro CTAs 'Explore My Work' and 'View Resume PDF' are partly under the taskbar (3 of 6 sample points covered), and the Proof Atlas title bar starts at y=427, below the 360px viewport, so its Minimise/Full Size/Close controls are off-screen at first paint. At 720x450 (= 1440x900 at 200%) and 844x390 (landscape phone) the Atlas starts at y=354 and is fully below the first screen. Screenshots: uiux/layout-responsive/z640.png, z720.png, land844.png. Full-page scroll reaches all content (lens-layout/scrollreach.mjs), so this is a first-view failure, not unreachable content.
- **Impact**: A recruiter on a landscape phone or a laptop at 200% zoom sees only the intro window and a taskbar; the primary CTAs are partly hidden and the Proof Atlas window is not visible until they scroll. Scrolling is required to find the work sample.
- **Recommendation**: Bring the two desktop windows under the same workspace clamp used for floating windows (window-geometry.ts clampWindowRect with TASKBAR_RESERVE) or cap their height to 100dvh minus the taskbar. For short viewports (max-height about 500px) either collapse the Atlas to its heading and a 'Show evidence' control, or place it after the intro in the flow with the intro CTAs above the taskbar line.
- **Likely files**: src/components/os/Desktop.tsx (intro window line ~254; Atlas ~294-300; comment ~115-117 says these windows are outside the window manager), src/components/os/window-geometry.ts (clampWindowRect, TASKBAR_RESERVE 56 + FOOTER_RESERVE 64), src/components/os/win7-desktop.css (desktop padding ~31-46; identity column ~89-141)
- **Verifier**: Partly reproduced on the live site, narrower than claimed. At 640x360 the fixed taskbar (dock top 308) covers the bottom ~19px of 'Explore My Work' (y 283-327) and 'View Resume PDF'; the Proof Atlas title bar starts at y=428 and its Minimise/Full Size/Close controls at y=435, both below the 360px viewport at first paint (screenshot probe v640.png). NOT reproduced: at 720x450 and 844x390 the Atlas title bar (y=355) and caption controls are visible (v720x450.png, v844x390.png), and the CTAs are clear of the taskbar (CTA bottom 298 vs dock tops 398 and 338), so 'fully below the first screen' is wrong for those sizes. CTAs are reachable by scrolling (scrollIntoView centre gives 3/3 hit). No WCAG AA failure identified (focus not obscured is only partly tested: Tab walks at 1024x768 and 390x844 showed 0px overlap; 640x360 Tab walk not run). Severity lowered from high to medium. Rules fixed-element-offset, content-priority, orientation-support exist in quick-reference.md.

#### LR-03: Taskbar pin strip overflows with no visible scroll cue: at 320 to 768 wide only one or two apps are visible, and Resume and Contact are cut or hidden

- **Lens**: Layout and responsive
- **Rule**: quick-reference 5: horizontal-scroll, content-priority, breakpoint-consistency
- **Routes**: / (taskbar on all routes) (Overflow is intended by the code comment (~lines 36-40), so the finding is about discoverability, not a bug. Impact on touch devices is inferred from the hidden scrollbar and short strip.)
- **Evidence**: lens-layout data: m-320x640.json strip scrollWidth 240 vs clientWidth 71, pins Research/About/Resume/Contact hidden; m-390x844.json strip 141px, Resume and Contact hidden; m-720x450.json and m-768x1024.json strip 319 and 367px, Resume and Contact hidden; m-844x390.json Contact hidden. Screenshots: uiux/layout-responsive/m320.png (one pin visible, a partial second), t768.png (Resume label cut at a vertical divider, Contact absent). CSS: win7-taskbar.css ~91-108 sets overflow-x:auto with scrollbar-width:none and a hidden webkit scrollbar, so the overflow is invisible.
- **Impact**: On a phone the primary navigation shows the Start orb, Projects and a fragment. The other destinations need a horizontal swipe inside a 71px strip with no cue. The same destinations exist as desktop icons, but on phones those sit below the fold (desktop icons after scroll at y around 438 at 390x844).
- **Recommendation**: Either show a fade or scroll indicator at the strip edge, or reflow the pins into a compact overflow menu (a 'More' pin that opens the remaining apps) below 700px, or move the phone navigation into the Start panel as a visible grid.
- **Likely files**: src/components/os/win7-taskbar.css (.os-dock-strip ~91-108; phone rules ~950-975; narrow rules ~1063-1075)
- **Verifier**: Reproduced from measured data and screenshots. Strip scrollWidth 240 vs clientWidth 71 at 320px (Research/About/Resume/Contact hidden beyond the edge); at 390px strip 141px with Resume and Contact past the right edge; at 768x1024 the 'Resu' pin is cut at the strip edge and Contact is absent (t768.png). win7-taskbar.css sets overflow-x:auto with scrollbar-width:none and ::-webkit-scrollbar display:none, and grep finds no mask-image/fade cue, so the overflow has no visible affordance. Code comment confirms overflow is intended, so this is a discoverability finding. Impact on touch users is inferred. Rule horizontal-scroll/content-priority is a reasonable fit.

#### LR-04: Proof Atlas diagram labels are about 8px at 1280x720 and removed entirely on phones, so the schematic loses its node names

- **Lens**: Layout and responsive
- **Rule**: quick-reference 10: responsive-chart (charts must reflow or simplify without losing meaning); quick-reference 5: readable-font-size
- **Routes**: / (Proof Atlas window)
- **Evidence**: lens-layout/atlas.mjs: rendered SVG text height about 8px at 1280x720 (window 295px wide, labels 'Agent', 'Input', 'Context', 'Tool gate', 'Output'), about 11px at 1024 and 1440, 18px at 1920, and 0 at 390 because proof-atlas.css ~380-384 sets '.proof-atlas-node text { display: none }' at max-width 700px. Screenshots: uiux/layout-responsive/w1280.png (labels barely legible), m390.png (nodes with no names), m320.png.
- **Impact**: A reader on a laptop at 1280 wide, or on a phone, sees a diagram whose nodes are unlabelled or hard to read. The caption helps, but the boundary names carry the argument of the schematic.
- **Recommendation**: Give the Atlas window a minimum width (for example 360px) and scale the SVG to it rather than to the cascade width, and on phones show the node names as HTML labels beneath the figure instead of hiding them.
- **Likely files**: src/components/os/ProofAtlas.tsx (SVG text ~409-458), src/components/os/proof-atlas.css (phone rule ~380-384; desktop figure ~391), src/components/os/window-geometry.ts (cascade width, PREFERRED_WIDTH 1000 and the 295px result at 1280)
- **Verifier**: Reproduced. Rendered SVG label boxes are ~8.0-8.3px tall at 1280x720 (Agent, Input, Context, Tool gate, Output; Atlas width 295px), ~11px at 1024 and 1440, ~18px at 1920, and zero SVG text nodes at 390px because proof-atlas.css (max-width:700px block, ~380-384) sets .proof-atlas-node text to display:none. Cited rule readable-font-size targets body text; the better-fitting rule is responsive-chart (quick-reference line 218), which the finding also cites.

#### nav-focus-route-change: Focus does not move into a window after it opens, and is lost to BODY after a language switch

- **Lens**: Navigation and IA
- **Rule**: focus-on-route-change (quick-reference 9) + WCAG 2.4.3 Focus Order
- **Routes**: / (dock Projects activated with Enter), /projects/project-simurgh -> /fa/projects/project-simurgh (language switch) (Reproduced in Chromium at 1440x900. The locale-remount cause is inferred, not confirmed in a debugger.)
- **Evidence**: Live probe /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/navigation-ia/probe8.mjs (1440x900, dark): after Enter on the dock Projects link the activeElement stays on that dock link (A.os-dock-app.is-running 'Projects'); Tab then moves to dock Research, About, Resume and skips the window content. probe6.mjs: after switching to /fa/projects/project-simurgh, activeElement is BODY at 0.2s, 0.8s, 1.8s and 3.0s. Code: src/components/os/ResearchOS.tsx focusContent effect (~line 461) runs only on a pathname change inside a mounted shell; changeLanguage (~line 615) does router.push to another locale root. The remount explanation is inferred from the comment 'Locale root layouts may reload' in src/components/os/language-navigation.ts.
- **Impact**: Keyboard and screen-reader users must Tab through the dock to reach a window they just opened, and after a language switch focus drops to the document start, losing their place.
- **Recommendation**: After a window opens or a locale change completes, move focus to the window heading (or #main-content) with preventScroll, and add a Playwright keyboard test that asserts focus lands inside the window.
- **Likely files**: src/components/os/ResearchOS.tsx, src/components/os/WorkspaceWindows.tsx, src/components/os/language-navigation.ts
- **Verifier**: Both sub-claims reproduced at 1440x900 dark (lens-nav-verifier/focus-verify.mjs). Dock Projects via Enter: activeElement stays on the dock link (A.os-dock-app.is-running 'Projects') at 300ms, 1.2s and 2.5s; the Projects window H1 has tabindex -1 but does not receive focus. Tab then goes to dock Research, then About. Language switch on /projects/project-simurgh to /fa/...: activeElement is BODY at 300ms, 1s, 2s and 3.5s. The 'locale root remount' cause is CONTRADICTED: a window marker survived the switch and only one same-document framenavigated event fired (lens-nav-verifier/lang-remount.mjs), so there is no reload. Severity lowered from high to medium: WCAG 2.4.3 is a weak basis (it concerns order, not focus-on-navigation); the rule focus-on-route-change is the closer fit. Real harm for keyboard and screen-reader users.

#### nav-window-back-vs-history: Window Back is a parent link, so browser Back does not undo it

- **Lens**: Navigation and IA
- **Rule**: back-behavior and back-stack-integrity (quick-reference 9)
- **Routes**: /projects -> /projects/invisible-window-research -> window Back -> /projects -> browser Back (Behaviour verified live. Parent-link intent is read from the code.)
- **Evidence**: probe2.mjs steps 4a to 4c: the Explorer click gives /projects/invisible-window-research; the .os-window-back control (a Link to parentPath, ResearchOS.tsx ~line 404, WorkspaceWindows.tsx ~line 134) goes to /projects; a browser Back then returns to /projects/invisible-window-research, the page just left. The same pattern applies to every detail page.
- **Impact**: A user who presses Back after using the in-window Back button is returned to the page they just left, so Back seems to do nothing or repeat.
- **Recommendation**: Choose one model: use history when the previous entry is the parent, or keep the hierarchy and document it. Test whichever is chosen.
- **Verifier**: Reproduced (lens-nav-verifier/back-verify.mjs) on /projects/invisible-window-research only: explorer click gives /projects/invisible-window-research; .os-window-back (href /projects) goes to /projects; browser Back returns to /projects/invisible-window-research. The claim that the pattern applies to every detail page was not verified beyond this one page.

#### P-01: Desktop reading routes shift the window shell during load (CLS 0.043 on /about, 0.024 on project pages)

- **Lens**: Performance
- **Rule**: layout-shift-avoid / content-jumping (Core Web Vitals CLS); quick-reference.md sections 3 and 7
- **Routes**: /about (1440px), /projects/project-simurgh (1440px) (Exact CSS rule that sets the 32 px offset was not isolated; the mechanism is inferred from the rect changes. Frames were captured with waitUntil commit, so the 600 to 1000 ms frames may not match what a real user sees.)
- **Evidence**: lens-performance/shift.mjs: layout-shift at 1808 ms, value 0.0429, source DIV.os-shell.win7 moved from rect [0,32,1440,868] to [0,0,1440,900]. shift2.mjs body snapshots: shell top goes 8 -> 0 -> 32 -> 0 and shell height 5919 -> 3138 -> 2709 -> 3283 -> 901 between DCL and load. Repeat runs (n=3 each, identical values): /about desktop CLS 0.0429, project desktop CLS 0.0236; mobile 0 to 0.0001. Screenshots uiux/performance/montage-about-desktop-load.png: at 600 ms and 1000 ms the reading page is an unframed long page with an empty portrait box; at 1400 ms the window chrome, taskbar and portrait are present. Source: src/components/os/ResearchOS.tsx:710 (os-shell win7) and research-os.css:36.
- **Impact**: On desktop the reading window jumps and re-lays out while the page loads, so a reader can lose their place. The score stays under the 0.1 good threshold, so this is a stability and polish issue rather than a failing metric.
- **Recommendation**: Make the reading-route shell geometry the same in server HTML and after hydration (fixed offset and height, no reflow of the whole shell), or render window chrome in the first pass with the content. Re-run lens-performance/shift.mjs after the change.
- **Verifier**: Reproduced. Playwright run at 1440x900 on /about (3 runs) gave CLS 0.0423, and /projects/project-simurgh gave 0.0236. In both, the largest shift is DIV.os-shell.win7 moving from [0,32,1440,868] to [0,0,1440,900]. Mobile (390px) CLS is 0. The CSS rule that adds the 32px offset is not isolated (mechanism inferred). Evidence: uiux/performance/verify/probe.json and lens-verifier-performance/probe.mjs.

#### P-04: About-page photo is a 270 KB 1200 px JPEG shown at 240x300, and it is preloaded at high priority

- **Lens**: Performance
- **Rule**: image-optimization (section 3); lazy-load-below-fold (section 3)
- **Routes**: /about (Byte targets are estimates. The JSON-LD and OG use of the full-size file is taken from src/app/[locale]/about/page.tsx:73 and layout.tsx:123.)
- **Evidence**: public/Raouf_2.jpg is 1200x1200 and 270,547 bytes. The /about SSR head contains <link rel=preload as=image href=/Raouf_2.jpg>. The image is rendered with next/image fill (SSR markup data-nimg=fill). Rendered size is 240x300 on desktop and 118x148 on mobile (run_about_desktop.json, run_about_mobile.json). Resource timing (lens-performance/timing.mjs): the JPEG starts at 1124 ms with the CSS and ends at 2084 ms, after the six head stylesheets. next.config.ts sets images.unoptimized: true, so Next does not resize it. Photo CLS is zero because the box is sized, so this finding is about bytes and priority only. The LCP on /about is a paragraph (median 1564 ms), not the photo.
- **Impact**: The portrait is the largest image on the page, is about 5x larger than displayed at desktop size, and competes with critical CSS and JS during first render.
- **Recommendation**: Export a 600x750 AVIF and WebP (about 2.5x the displayed size) with a JPEG fallback, and use sizes. Keep the 1200 px file only for JSON-LD and OG metadata. Remove the high-priority preload, because the photo is not the LCP.
- **Verifier**: Confirmed. public/Raouf_2.jpg is 1200x1200 and 270,547 bytes. Live /about HTML has <link rel=preload as=image href=/Raouf_2.jpg>, and the img is data-nimg=fill. Measured rendered box is 240x300 at 1440 (mobile not re-measured here). The LCP on /about is a P (t=412 ms, size 126887), not the photo. Impact is mainly bytes and preload competition on slower links (preload priority inferred as high). next.config.ts sets images.unoptimized true.

#### P-05: Every route ships the full desktop shell JS eagerly: about 620 KB raw (about 193 KB gzip) on the logon, roughly half not executed

- **Lens**: Performance
- **Rule**: bundle-splitting and lazy-loading (quick-reference section 3)
- **Routes**: / (logon), /about and all other routes via the locale layout (Coverage was taken only over the first 2.5 to 6 s, so code run later by interactions is not counted as used. Gzip figures are summed from local gzip -9, not from the CDN.)
- **Evidence**: src/app/[locale]/layout.tsx:16 imports ResearchOS statically, so the shell is in every route's bundle. The live root loads 12 chunks totalling 637,527 bytes raw; gzip -9 sums to 197,505 bytes (lens-performance/coverage.mjs and chunks in uiux/performance/chunks). Playwright JS coverage after load on /: 615 KB total, 53% unused; after clicking the orb: 51% unused. /about: 704 KB, 52% unused. Largest: 3g4px251sg85e.js 229 KB raw and 71 KB gzip (59% unused), 0tgjiok8t6d_n.js 165 KB raw and 45 KB gzip (68% unused), 3xl-23b2x59pp.js 52 KB raw (64% unused). The legacy noModule chunk 0cz1d0mv5g_q7.js is not requested by modern Chrome and is excluded.
- **Impact**: Parse and compile cost is paid on every first load, including the logon screen and every reading route. Lab LCP is still good (1.5 to 2.1 s medians), so this is headroom against slower devices, not a current failing score.
- **Recommendation**: Move the window manager, dock and app-window code out of the root layout into a client boundary loaded with next/dynamic (ssr: false) after first paint, and keep the logon and reading routes in separate chunks. Re-run coverage after the split.
- **Verifier**: Numbers reproduced with per-byte coverage. On /, 12 JS files are requested, 629,933 chars, 52.7% unused. On /about, 20 files, 720,406 chars, 52.1% unused. Largest chunks match: 3g4px251sg85e.js 229 KB and 0tgjiok8t6d_n.js 165 KB. Severity lowered from high to medium: the finding names no WCAG failure or core-path harm, and its own lab LCP data says the scores are good. This is headroom, not a current failure.

#### P-06: Render-blocking CSS is 270 KB raw on the logon route, about 75% unused on load

- **Lens**: Performance
- **Rule**: critical-css (quick-reference section 3)
- **Routes**: / (logon), /about (299 KB, 63% unused) (Coverage was taken at load only, so hover, focus and dark-theme rules are not exercised and may look unused when they are not.)
- **Evidence**: Six stylesheets in the SSR <head> with data-precedence=next (live HTML). lens-performance/csscov.mjs: 270 KB raw, 67 KB executed, 75% unused on /. Examples: 20xei433-vuj1.css 89 KB, 86% unused; 1_b7vvci5n6sa.css 59 KB, 82% unused; 1g3y8_4r1enqd.css 18 KB, 82% unused. Gzip total about 56 KB (summed from chunks/*.css).
- **Impact**: Every stylesheet blocks first paint. Desktop FCP median on the logon is 1568 ms, and about 56 KB of CSS transfers before the first render.
- **Recommendation**: Audit the win7 and 7.css chunks for dead rules, merge the overlapping win7-*.css files, and load route-only sheets with their route. Re-measure FCP after the change.
- **Verifier**: Reproduced with CSS coverage (range-based). On /, 6 stylesheets, 275,997 chars, 25% used (about 75% unused). On /about, 7 stylesheets, 306,612 chars, 36.6% used (about 63% unused). Six stylesheets are in the SSR head. Load-time coverage only, as the finding says. FCP was not re-measured in this pass, so the 1568 ms figure is not confirmed.

#### SC-02: Proof Atlas is the only dark window body in Aero Night; sibling windows stay white

- **Lens**: Style consistency
- **Rule**: quick-reference 4 consistency (same style across all pages); dark-mode-pairing; pro-rules 'Both themes tested before delivery'
- **Routes**: /en (desktop first screen, dark theme)
- **Evidence**: Screenshot /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/style-consistency/02-desktop-1440.png shows the white Getting Started window next to the navy Proof Atlas window. In light mode (light-desktop.png) both are white. Source: src/components/os/proof-atlas.css:607-625 sets --win7-body-bg #0d1b2e for Aero Night. Its comment (607-609) says this matches 'the dark reading tokens' of win7-pages.css, but win7-pages.css:1-6 says reading pages sit in white bodies in both themes, and the intro body (win7-desktop.css:220-226) still resolves to --body-bg #ffffff from the Aero Night block at win7-theme.css:253.
- **Impact**: On the first screen in dark mode, two adjacent windows have different surfaces and text tokens, so the desktop looks like two design systems. The Atlas comment describes a state the code does not implement, which will mislead the next editor.
- **Recommendation**: Pick one rule. Either make the Atlas body white in both themes (delete the dark block at proof-atlas.css:607-625, which also keeps it consistent with the reading windows), or move the intro and reading bodies to the dark tokens. Correct the comment in either case.
- **Likely files**: src/components/os/proof-atlas.css, src/components/os/win7-pages.css, src/components/os/win7-theme.css, src/components/os/win7-desktop.css
- **Verifier**: Reproduced. In dark theme on /en the Proof Atlas body is navy (#0d1b2e) while the Getting Started intro body is white and the Projects/Write-ups reading bodies are white. In light theme both windows are white. Evidence: uiux/style-consistency/desktop-dark-live.png, desktop-light-atlas.png. Source confirmed: proof-atlas.css:607-625 sets --win7-body-bg #0d1b2e under the Aero Night selector; the comment at 607-609 claims it matches the dark reading tokens of win7-pages.css, but win7-pages.css:1-6 says reading bodies are white in both themes, so the comment is inaccurate. win7-theme.css:160 sets --win7-body-bg to var(--body-bg), and win7-theme.css:253 sets --body-bg #ffffff in the Aero Night block, so the intro stays white.

#### SC-04: Two radius systems sit side by side on the same window bodies

- **Lens**: Style consistency
- **Rule**: quick-reference 4 effects-match-style; elevation-consistent; style-match (flat vs rounded)
- **Routes**: /en/resume, /en/contact, /en/security-policy, /en/hall-of-fame, /en/lab/001, /en/write-ups (search field), /en (logon pills)
- **Evidence**: Screenshots in /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/style-consistency/: r04-_en_resume.png (14px rounded card beside 3px Win7 buttons), r05-_en_contact.png (rounded email card and icon tile), r09-_en_security-policy.png (rounded callout nested inside a rounded section), r08-_en_lab_001.png (20px left panel, 14px code panel), 01-logon-desktop.png (pill toggles). Source: src/components/os/research-os.css:132-136 defines --radius-xs 6px, --radius-s 10px, --radius-m 14px, --radius-l 20px, --radius-pill. These are used across supporting-apps.css (10 uses of --radius-m) and reading-window.css (--radius-l). Win7 controls fall back to 3px (win7-pages.css:175 and 397); window frames use --win7-radius 6px (win7-theme.css:222).
- **Impact**: Win7 chrome is flat and crisp, but the page content uses soft 10-20px cards, so each window reads as two visual languages. Nested rounded boxes (security policy scope, hall of fame) add visual weight without adding meaning.
- **Recommendation**: Adopt one OS radius scale: about 3px for controls and content cards inside Win7 bodies, 6px for window frames only. Retire --radius-m and --radius-l on OS content, and remove the nested card on the security-policy scope block.
- **Likely files**: src/components/os/research-os.css, src/components/os/supporting-apps.css, src/components/os/reading-window.css, src/components/os/win7-pages.css, src/components/os/win7-theme.css
- **Verifier**: Reproduced visually. On /en/security-policy the 14px-radius 'Report a Vulnerability' card sits beside a square 3px 7.css button, and the 'Scope' section contains a further rounded callout nested inside a rounded section (uiux/style-consistency/sp-dark-full.png). On /en/resume the rounded contact card sits beside the square 'Download Résumé' button (resume-dark-full.png). Source: research-os.css:132-136 defines --radius-m 14px and --radius-l 20px; win7-theme.css:222 sets --win7-radius 6px; win7-pages.css:175 and 397 use 3px for controls. grep finds 33 uses of --radius-m or --radius-l in components/os/*.css.

#### TI-01: Pinned Resume and Contact dock apps sit under the tray on phone and tablet

- **Lens**: Touch and interaction
- **Rule**: touch-target-size; gesture-alternative (quick-reference 2. Touch & Interaction)
- **Routes**: /en (desktop after Enter), /en/about, /en/resume, /en/contact
- **Evidence**: Touch hit-test (lens-touch/hit-probe.mjs, lens-touch/dock-scroll.mjs). At 390x844 the Resume pin (x=203) is covered by the Search button and Contact (x=251) by the Lock button; elementFromPoint at Contact's centre returns svg.lucide-lock-keyhole. At 768x1024 Contact (x=462) is fully covered by the Search icon and Resume partly covered. The dock strip is overflow-x:auto (390: scrollWidth 240, clientWidth 141), so the pins are only reachable by a horizontal swipe. Screenshots: /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/touch-interaction/_en_about-390x844-e0-dark.png (Resume and Contact invisible), taskbar-768.png (Contact missing, Resume cut at the tray divider), taskbar-after-swipe-768.png (Contact appears after swipe). Code: src/components/os/win7-taskbar.css:951-975 (phone rules; comment says pins never run under the tray).
- **Impact**: A recruiter tapping the visible Contact icon on a phone hits Lock instead. Lock (ResearchOS.tsx lockWorkspace, ~line 596) returns the desktop to the logon screen and forces a 3-second re-entry. Resume and Contact, the two most important paths for a hiring audience, are hidden at rest with no scroll affordance.
- **Recommendation**: Make the pin strip and tray non-overlapping at every width: give the strip its own clipped region with a right-edge fade or chevron that signals more pins, or reorder pins so Resume and Contact are visible on phones (drop or move Desktop/Research first). Verify with elementFromPoint at each pin's centre at 390, 768 and 1024. Keep Lock out of the 44px neighbourhood of any pin.
- **Verifier**: Partly confirmed, mechanism corrected. At 390x844 and 768x1024 portrait, Resume and Contact are clipped out of the dock strip at rest (strip scrollWidth 240 vs clientWidth 141 at 390). Hit-testing at their centres returns Search/Lock only because the clipped pins are not hit-testable, not because the tray overlaps them: the strip ends where the tray starts (198px at 390 on /en/about, 428px at 768). After scrolling the strip to its end, Contact and Resume hit-test as themselves. The claim that a tap on the visible Contact icon hits Lock was NOT reproduced (no visible Contact icon exists at rest). Real defect: two of six pins are hidden at rest with no fade or chevron cue. At 1024x768 landscape all six pins fit and hit-test correctly. Severity lowered from high: the pins are reachable by horizontal swipe and no WCAG criterion fails. Evidence: uiux/touch-interaction/verify/phone390-taskbar-rest.png, tab768-taskbar-rest.png (Resume cut at the divider, Contact absent), all.json, probe2.json.

#### TI-02: Tablet width (768) falls back to desktop-size touch targets

- **Lens**: Touch and interaction
- **Rule**: touch-target-size (44x44); touch-spacing (8px); touch-friendly-input
- **Routes**: /en (768x1024), /en/about, /en/projects/project-zurvan, /en/resume, /en/lab
- **Evidence**: Measured with lens-touch/inventory.mjs (uiux/touch-interaction/desk-768-after-enter.json, 22 small targets). Title-bar Minimise/Maximise/Close 30x24 with 2px gaps (x=642/674/706). Theme switch 40x24. Open language menu items 174x28 (verified open via lens-touch/search-lang.mjs at 768). Proof Atlas options 222x30. Open Project Evidence link 682x30. Desktop footer links 30px tall. Direct links Explore My Work and View Resume PDF 23px tall. Dock home 40x40. At 390 the same controls are 44px, so the fix is gated by a max-width:700px or coarse-pointer selector list that leaves 701-1024 at desktop sizes (research-os.css:2206-2224 applies 44px only to .os-control, .os-window-back, .os-search-scopes, .os-language summary and .os-dock a).
- **Impact**: iPad and Android-tablet users (a common reading device for portfolio review) get 23-30px targets with 2px gaps. Adjacent Maximise and Close mis-taps are likely, and Close is the red control.
- **Recommendation**: Apply the 44px minimum on pointer:coarse regardless of viewport width, for every interactive class in the list above, or use one shared token (for example --touch-target: 44px) and an invisible hit-area extension (the approach theme-switch.css already uses). Add 8px spacing between title-bar controls on coarse pointers.
- **Verifier**: Partly confirmed. Measured at 768 portrait and 1024 landscape with pointer:coarse matching: Explore My Work 152x23 and View Resume PDF 160x23 (below the 24px WCAG 2.2 AA minimum, the only AA-level miss found), Dark Appearance 40x24, Minimise/Full Size/Close 30x24 with 2px gaps, language summary 51x28, language items 174x28. Those at 24px or above meet WCAG 2.5.8 AA; 44px is the AAA/guideline size, so 'high' overstates it. Root cause corrected: the 44px coarse rule at research-os.css:2206-2224 is gated by pointer:coarse and the selector list, not by max-width. At 768 it does apply to .os-control (Search and Lock measure 44x44). It is overridden for the language summary by .os-shell.win7 .os-language summary (win7-taskbar.css:518-520, min-height 28px, higher specificity) and for title-bar controls by a later width/height rule not traced. Evidence: all.json, probe2.json.

#### TI-03: Primary Contact CTA 'Open Email Draft' is 24px tall on phone

- **Lens**: Touch and interaction
- **Rule**: touch-target-size (44x44); gesture-alternative
- **Routes**: /en/contact (390x844)
- **Evidence**: lens-touch/inventory.mjs on /en/contact at 390: 'Open Email Draft' a.os-button in div.os-contact-email measures 151.8 x 24 px (uiux/touch-interaction/contact-inv-390.json). The sibling GitHub, LinkedIn and ORCID links measure 50px tall on the same screen. Screenshot: uiux/touch-interaction/contact-390.png. CSS: src/components/os/supporting-apps.css:438 (.os-contact-email sets no min-height; the coarse-pointer .os-button rules do not reach it).
- **Impact**: The one action that starts contact (the mailto CTA) is the hardest target on the page to hit with a thumb, and it is visibly smaller than the social buttons beside it.
- **Recommendation**: Give .os-contact-email a.os-button min-height:44px and horizontal padding that makes it a full-width tap target on phones. Make it the visually dominant CTA on the card.
- **Verifier**: Measurement confirmed: a.os-button 'Open Email Draft' measures 152x24 at 390 and 768, while the GitHub, LinkedIn and ORCID links measure 50px tall. Mechanism not separately traced to supporting-apps.css:438. Severity lowered from high: 24px meets the WCAG 2.2 AA minimum (2.5.8, 24x24), so this is a UX and guideline issue (44px is AAA), not an AA failure. It is still the visually smallest primary CTA on the card. Evidence: probe2.json (contact array).

#### TI-04: Search input is 13px and 26px tall; focusing it on iOS will zoom the page

- **Lens**: Touch and interaction
- **Rule**: touch-friendly-input (>=44px); touch-target-size
- **Routes**: /en (Search panel), any route with the Search button (390x844)
- **Evidence**: lens-touch/search-lang.mjs at 390 and 768: the search dialog input computes font-size 13px, height 26px, and is focused on open (uiux/touch-interaction/search-390.png shows it at the bottom above the taskbar). iOS Safari auto-zooms inputs whose computed font-size is below 16px (inferred from known Safari behaviour; not run on a WebKit device here).
- **Impact**: On iPhone each search focus zooms the whole desktop, which the user then has to undo. The 26px field is also a small target for a primary search affordance.
- **Recommendation**: Set the search input to font-size: max(16px, var(--text-m)) on coarse pointers and min-height 44px. Keep the placement above the taskbar, which is good for thumb reach.
- **Verifier**: Confirmed: the search input (type=search, aria-label 'Search projects, papers, and writing') computes font-size 13px and height 26px at 390 and 768, and receives focus on open (document.activeElement is the INPUT). The iOS auto-zoom consequence is inferred from known Safari behaviour and was not reproduced on a WebKit device. Evidence: probe2.json (search), uiux/touch-interaction/verify/ probe2.mjs.

#### TI-05: Window title-bar controls: 0px gap on phone, 2px on tablet, Close adjacent to Maximise

- **Lens**: Touch and interaction
- **Rule**: touch-spacing (8px between targets); touch-target-size
- **Routes**: any reading window, e.g. /en/about (390 and 768)
- **Evidence**: At 390 Minimise, Full Size and Close are each 44x44 at x=251, 295, 339, so they touch with 0px gap (uiux/touch-interaction/_en_about-390x844-e0-dark.png, scroll-end-390.png). At 768 they are 30x24 at x=642, 674, 706 with 2px gaps (taskbar-768.png, desk-768-full.png). Close is the red control. Probe: lens-touch/inventory.mjs (about-390.json, desk-768-after-enter.json).
- **Impact**: Mis-taps between Maximise and Close are likely. Closing a window has no confirmation or undo, so one stray tap removes the open reading window.
- **Recommendation**: Add at least 8px between title-bar controls on coarse pointers, or separate Close with a visible gap. Consider a confirmation or Undo toast for Close on touch.
- **Verifier**: Confirmed: title-bar Minimise, Full Size and Close are 44x44 at 390 with 0px gaps (titleGaps [0,0]), and 30x24 at 768 with 2px gaps (titleGaps [2,2]). At 768 a 24px circle centred on Close does not reach Full Size, so the WCAG 2.5.8 spacing exception is met. The 8px spacing is a guideline. Close has no confirmation, so an adjacent mis-tap is a real UX harm. Evidence: probe2.json (titleBar, titleGaps).

#### TI-06: Phone dock: 4px gaps between 44px pins and icon-only labels

- **Lens**: Touch and interaction
- **Rule**: touch-spacing (8px); nav-label-icon (icon-only nav harms discoverability)
- **Routes**: /en (390x844, all windows)
- **Evidence**: Inventory (uiux/touch-interaction/desk-390-after-enter.json): Projects at x=59 and Research at x=107 are 44px wide, a 4px gap; About to Resume to Contact sit at a 48px pitch. Labels are visually hidden below 480px (src/components/os/win7-taskbar.css:1062-1075, inline-size:1px). Screenshot _en_about-390x844-e0-dark.png shows only three unlabelled icons in the visible dock strip.
- **Impact**: A sighted phone user sees Projects, Research and About only as unlabelled glyphs, and mis-taps between neighbours are likely at 4px.
- **Recommendation**: Restore 8px spacing (shrink the Desktop home pin or show fewer pins on phones and scroll the rest), and show a short label under each icon or on the active pin, so the dock meets nav-label-icon.
- **Verifier**: Confirmed: at 390 dock pins are 44px wide with 4px gaps (Projects to Research, About to Resume), a 48px pitch, and labels are visually hidden below 480px (win7-taskbar.css:1062). 44px targets meet WCAG 2.5.8, so the issue is spacing and icon-only discoverability (guideline level), not a WCAG failure. Evidence: all.json (dock pins, gapsPx [7,4,4,4,4]), uiux/touch-interaction/verify/phone390-taskbar-rest.png.

### Low (66)

#### a11y-404-duplicate-language-control: 404 page exposes the language switcher twice under the same name

- **Lens**: Accessibility (keyboard and semantics)
- **Rule**: UX nav-hierarchy; WCAG 2.4.6 Headings and Labels
- **Routes**: /en/this-page-does-not-exist
- **Evidence**: Accessibility snapshot on the 404 page (lens-a11y-keyboard-sr/nf-lock.mjs): combobox 'Select Language' with five options, and navigation 'Select Language' with five links. Tab order: Return Home, Browse Projects, the select, then the five links, so the same choice is offered twice (uiux/a11y-keyboard-sr/not-found-en.png). The error alert region is present but has no text.
- **Impact**: Keyboard users get two tab stops that do the same thing, and both have the same name, which adds noise to the page.
- **Recommendation**: Keep one language control on the 404 page and give it a distinct name if both must remain.
- **Verifier**: Duplication confirmed on /en/this-page-does-not-exist: a SELECT named 'Select Language' with 5 options and a nav landmark labelled 'Select Language' containing 5 links. Tab order: Return Home, Browse Projects, select, then the five language links, then BODY. NOT confirmed: the claim that the error alert region is present. No role=alert, role=status, aria-live or alertdialog element exists on the page. Remove that sub-claim.

#### a11y-duplicate-window-control-names: Window control buttons use bare names and are duplicated on the home desktop

- **Lens**: Accessibility (keyboard and semantics)
- **Rule**: WCAG 4.1.2 Name, Role, Value; WCAG 2.4.6 Headings and Labels; UX aria-labels, voiceover-sr
- **Routes**: /en, /en/projects
- **Evidence**: uiux/a11y-keyboard-sr/desktop-aria.txt lists button 'Minimise', 'Full Size' and 'Close' twice on /en: once for the Getting Started intro window and once inside the region 'Where the evidence connects' (Proof Atlas). Tab walk stops 2-4 and 29-31 show the same names with no window context. On /en/projects the reading window's controls are also bare 'Minimise', 'Full Size', 'Close' (uiux/a11y-keyboard-sr/aria-_en_projects.txt). Code: WorkspaceWindows.tsx ~L484-514 uses copy.minimize / copy.close with no window title.
- **Impact**: With two or more windows open, a screen-reader user hears 'Close' or 'Minimise' with no indication of which window the command acts on.
- **Recommendation**: Include the window title in each control name, for example 'Close Proof Atlas' or 'Minimise Getting Started', via aria-label built from the title or aria-labelledby. Use the same pattern for Minimise and Full Size.
- **Verifier**: Duplicates reproduced: on /en the window controls appear as Minimise x2, Full Size x2 and Close x3 (one Close sits at x=0, possibly offscreen or inert); on /en/projects Minimise x3, Full Size x3, Close x4. Names are bare aria-labels from copy.minimize / copy.close with no window title (WorkspaceWindows.tsx ~L484-514). Downgraded from medium: the labels are valid names, the controls sit inside their window, and WCAG 2.4.6 asks for descriptive labels, so this is an ambiguity issue when two or more windows are open rather than an AA failure.

#### a11y-loader-fixed-delay-reduced-motion: Logon loader holds for a fixed 3 seconds, unaffected by reduced motion, and Enter is ignored meanwhile

- **Lens**: Accessibility (keyboard and semantics)
- **Rule**: reduced-motion (partial); no-blocking-animation
- **Routes**: /en
- **Evidence**: lens-a11y-keyboard-sr/motion.mjs: time to desktop about 3283 ms without reduced motion and about 3095 ms with it; with reduced motion there are zero running animations at load (uiux/a11y-keyboard-sr/motion-reduce-true.png). Code: WelcomeEnter.tsx L7 WELCOME_LOADER_MS = 3000 drives a setTimeout (L124-130); enter() returns early while loading (L107).
- **Impact**: The 3 s wait is a timer, not motion, so it is not a reduced-motion violation as such. It is still a fixed delay before keyboard focus reaches the desktop, and the key press during it does nothing.
- **Recommendation**: Keep the loader as status feedback, but either shorten it or let Enter or Escape complete it early. Keep the aria-busy and status announcement.
- **Verifier**: Reproduced: the logon stage is removed at about 3.48 s without reduced motion and about 3.26 s with it, so the fixed loader delay is not shortened by reduced motion. Reduced motion does remove running animations (0 running at load vs 20 without). A second Enter during the loader changes nothing (URL and stage unchanged), and aria-busy=true is set during loading. Consistent with WelcomeEnter.tsx enter() returning early while loading.

#### a11y-search-result-names-verbose: Search result link names run kind, title and full description together

- **Lens**: Accessibility (keyboard and semantics)
- **Rule**: voiceover-sr (meaningful accessible labels)
- **Routes**: /en (Search dialog)
- **Evidence**: lens-a11y-keyboard-sr/flows.mjs case B: after ArrowDown from the search field the focused result's accessible name is 'Projects Project Zurvan Local-first LLM knowledge engine. Ingests any document ... 218 tests passing.' Papers results follow the same pattern, for example 'Papers Banking Shield: Machine-...' (dom-dup.mjs). Live count 'x / 41 · Search results' is announced correctly.
- **Impact**: Each result is read as one long string with no pause between the category, title and abstract, which is slow to scan with a screen reader.
- **Recommendation**: Give each result a short name (kind and title) and move the description into aria-describedby.
- **Verifier**: Confirmed for project results: after Ctrl+K, typing 'zurvan' and ArrowDown, the focused result is an anchor with no aria-label and no aria-describedby, so its accessible name is the full concatenated text 'Projects Project Zurvan Local-first LLM knowledge engine. Ingests any document, ...'. The 'Papers' result pattern was not re-tested here, so that part is unverified. Screenshot: /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/lens-a11y-verifier/search-zurvan.png.

#### a11y-thin-focus-ring-primary-cta: Primary 'Explore My Work' focus ring is a 1px dotted outline

- **Lens**: Accessibility (keyboard and semantics)
- **Rule**: WCAG 2.4.7 Focus Visible; UX focus-states (2-4px ring)
- **Routes**: /en
- **Evidence**: Desktop Tab walk stop 0 and stop 32: the 'Explore My Work' link computes outline 'dotted 1px rgb(0,0,0)' plus a box-shadow when focused. Crops: uiux/a11y-keyboard-sr/focus-dark-home-explore.png and focus-light-home-explore.png show a faint dotted ring. Taskbar and tray controls use a 2px solid ring with 2px offset (for example taskbar-about crop), so the focus style is inconsistent across the same screen.
- **Impact**: The main call to action is visible but low-contrast when focused, which is harder to see for low-vision users and on busy wallpapers.
- **Recommendation**: Give .os-button the same 2px solid ring with 2px offset used by the taskbar and tray, and verify the ring has at least 3:1 contrast against the window body and the wallpaper in both themes.
- **Verifier**: Reproduced in dark and light: the Explore My Work button (.os-button, 152x23 px) computes outline 'dotted 1px rgb(0,0,0)' offset -4px with a 1px inset white box-shadow on focus. The taskbar About control computes 'solid 2px rgb(255,255,255)' offset 2px plus a glow. The ring is visible in the crops (focus-explore-dark.png, focus-explore-light.png) but weak, so the inconsistency is confirmed and the low severity stands.

#### a11y-titlebar-button-tab-stop: Reading-window title bar is a tab stop that only refocuses the window

- **Lens**: Accessibility (keyboard and semantics)
- **Rule**: UX keyboard-nav (Tab order matches purpose); focus-states
- **Routes**: /en/projects, /en/contact, /en/projects/*
- **Evidence**: Tab walks: /en/projects stop 5 is button '#_r_h_-title' named 'Projects'; /en/contact stop 5 is button named 'Contact'. Code: WorkspaceWindows.tsx ~L455-470 renders the title as a button whose only action is onClick -> actions.focus(id); the pointer drag is for mouse users.
- **Impact**: Every reading page has an extra tab stop that does nothing useful for keyboard users, and its name repeats the page heading.
- **Recommendation**: Make the title tabIndex -1 or a non-interactive element for keyboard users, keeping the pointer drag affordance. Keep the window's accessible name from aria-labelledby.
- **Verifier**: Confirmed: on /en/projects the 6th Tab stop is button#..-title named 'Projects' (after the Skip link, Search, Lock, Dark Appearance and the language summary); on /en/contact it is button named 'Contact'. The button's only action is actions.focus(id) (WorkspaceWindows.tsx ~L455-470), so it is a redundant tab stop.

#### ANIM-02: Theme-switch colour cross-fade never runs: data-theme-switching is styled but never set

- **Lens**: Animation
- **Rule**: state-transition / motion-consistency (section 7)
- **Routes**: /en desktop (tray theme switch, .os-theme-switch)
- **Evidence**: research-os.css:15-29 defines a 240 ms cross-fade keyed on .os-shell[data-theme-switching], but no TS/TSX file sets that attribute (grep finds only the CSS). Runtime: after clicking the switch, .os-shell never carries data-theme-switching (nm-run2.json themeFlip, switching=null on every sample). Computed transition on .os-window is 'opacity, transform 0.24s' only, so window colour snaps (rgba(190,220,245,0.72) with no tween). The wallpaper ::after fades over 250 ms (win7-theme.css:344), so the wallpaper tweens while the windows snap. Screenshots: nm-theme-light.png, nm-theme-after.png.
- **Impact**: The light/dark flip looks inconsistent: the backdrop fades while window chrome and text change instantly. Minor, but it is a visible mismatch on the primary theme control.
- **Recommendation**: Either set data-theme-switching from the appearance setter for 240 ms (the CSS is ready) or delete the dead rule and the wallpaper-only fade so the flip is one consistent behaviour.
- **Verifier**: Confirmed: research-os.css:15-29 defines the data-theme-switching cross-fade, but no TS/TSX sets the attribute (grep finds only CSS). Logged themeFlip samples show switching null, and .os-window transitions only opacity and transform (0.24s). Window colour snaps while the wallpaper fades.

#### ANIM-03: Start-menu (search dialog) closes with no exit animation while it opens with a fade

- **Lens**: Animation
- **Rule**: state-transition / exit-faster-than-enter (section 7)
- **Routes**: /en desktop (search button, .os-search-dialog)
- **Evidence**: Open: win7-taskbar.css:691 sets an opacity-only 120 ms transition; runtime probe samples opacity 0 to 1 over about 200 ms and transform stays none (probe3 output). Close: after Escape the dialog reports open=false at the first sample (about 22-35 ms; nm-run2.json searchClose and rm-run2.json searchClose). No exit transition or transition-behavior: allow-discrete is defined for the closed state.
- **Impact**: The panel fades in gently and then vanishes on dismiss. The motion is asymmetric, and the exit gives no spatial closure.
- **Recommendation**: Add a short opacity exit (about 90 to 120 ms, ease-in) using transition-behavior: allow-discrete on the closed state, or accept the snap and document it.
- **Verifier**: Confirmed: win7-taskbar.css:691 sets opacity-only 120ms on .os-search-dialog, and there is no exit transition. Logged searchClose shows open=false at the first sample (about 35 ms after Escape), so close is instant. The open duration of about 200 ms from the probe was not re-measured.

#### ANIM-04: Maximise and restore FLIP applies a non-uniform scale to the whole window

- **Lens**: Animation
- **Rule**: transform-performance / motion-meaning (section 7; visual quality)
- **Routes**: /en desktop windows (title-bar maximise, .is-maximize)
- **Evidence**: WorkspaceWindows.tsx:286 calls createFlipTransform (window-geometry.ts ~lines 190-210), which returns translate(dx,dy) scale(sx,sy) with sx and sy computed independently. Runtime: getKeyframes shows 'translate(168px, 80px) scale(0.694444, 0.872449) -> none' over 180 ms on the .os-window element (nm-log.json maximiseFlip, pause.mjs output). Transform-only, so no layout thrash. The mid-flight screenshot did not capture the scaled frame, so the distortion is inferred from the non-uniform factors, not visually confirmed.
- **Impact**: For about 180 ms, text and screenshots inside the window are stretched unevenly during maximise and restore. It is brief, but the aspect change is visible.
- **Recommendation**: Use a uniform scale (the larger of the two factors, with the frame clipped) or fade the content across the FLIP instead of stretching it. Keep the transform-only approach.
- **Verifier**: Confirmed in source: window-geometry.ts:206-217 computes scaleX and scaleY independently, and WorkspaceWindows.tsx:286 applies it to the whole window. The keyframe scale(0.694, 0.872) -> none is logged. The visible stretching of content is inferred from the non-uniform factors, not seen in a captured frame.

#### ANIM-05: Hand-off from logon to desktop shows one main-thread stall at the crossfade end

- **Lens**: Animation
- **Rule**: main-thread-budget / input-latency (section 3)
- **Routes**: /en (logon to desktop hand-off)
- **Evidence**: jank.mjs, three fresh loads, headless Chromium: run0 one frame of 67 ms at 3226 ms; run1 one frame of 67 ms at 3205 ms; run2 frames of 296 ms, 396 ms and a 200 ms frame at 3496 ms (the hand-off fade ends about 3073 ms). Output captured in the run log, and drawn from /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/lens-animation/jank.mjs. The cause is inferred to be the desktop mount right after the fade, not profiled.
- **Impact**: The 180 ms logon fade can stutter as the desktop mounts. This is headless software rendering, so magnitude on real hardware is unknown.
- **Recommendation**: Profile the mount with a performance trace on a real device and defer non-critical desktop work (Proof Atlas, thumbnails) until after the first paint.
- **Verifier**: Reproduced intermittently in this session: jank.mjs runs show frames of 50 ms at 3174, 50 ms at 3176, 133 ms at 3220 and 50 ms at 3178 ms, which is around the hand-off end. Not reproduced in the first run here, and the earlier 296-396 ms frames did not recur. Cause (desktop mount) not profiled. Headless software rendering, so real-device impact is unknown.

#### ANIM-06: Exit durations equal enter durations for windows and logon

- **Lens**: Animation
- **Rule**: exit-faster-than-enter (section 7, about 60-70% of enter)
- **Routes**: /en desktop windows (open/close), /en logon (fade out / desktop in)
- **Evidence**: win7-windows.css:596 open 180 ms cubic-bezier(0.2,0.8,0.2,1); win7-windows.css:600 close 180 ms cubic-bezier(0.4,0,1,1); welcome-enter.css:125 and :129 both 180 ms. Runtime: close samples reach the end at about 184 ms (closeSamples in nm-log.json), so exit equals enter.
- **Impact**: Closing feels as slow as opening, which makes the desktop feel heavier than the rule's responsive target.
- **Recommendation**: Shorten the close and logon-leave to about 120 ms (ease-in), keeping the open at 180 ms.
- **Verifier**: Confirmed in source: win7-windows.css:596 open 180ms ease-out curve and :600 close 180ms ease-in curve. welcome-enter.css:118-125 leave is 180ms, matching the enter. Logged closeSamples end about 184 ms. This is a guideline-level polish issue.

#### ANIM-07: Language switch changes the page with no transition and a route wait of about 570 ms

- **Lens**: Animation
- **Rule**: input-latency / state-transition / fade-crossfade (sections 3 and 7)
- **Routes**: /en desktop tray language control (details.os-language) to /fa
- **Evidence**: lang.mjs trace: the shell stays at opacity 1 and the URL flips from / to /fa at 599 ms after the link was activated (about 570 ms of silence, no pending indicator observed; the trace is recorded in the lang.mjs output). Screenshot after the switch: nm-language-fa.png. Cold-route timings in dock.mjs show the same pattern.
- **Impact**: A language change gives no feedback for about half a second, then every string swaps at once. This looks like a stall, not a deliberate change.
- **Recommendation**: Show an immediate pending state (e.g., the existing loading hairline) on the language link, and crossfade the content once the new locale renders.
- **Verifier**: The missing feedback is confirmed: LanguageSwitcher.tsx has no pending or transition state, and the shell opacity stays at 1 during the switch. The magnitude is unstable: the URL flipped to /fa at 254 ms in one run, the original lang.mjs recorded 599 ms, and nm-run2 was still on /projects at 1481 ms. The 570 ms figure does not hold across runs.

#### ANIM-08: First activation of a route takes 48-423 ms before a window appears (press feedback is immediate)

- **Lens**: Animation
- **Rule**: tap-feedback-speed / input-latency (section 2 and 3)
- **Routes**: /en desktop dock (About, Contact, Resume, Projects)
- **Evidence**: dock.mjs, single run: the dock item reports :active at 60 ms (pressed transform matrix(0.985,...) on Projects). Window appearance after release: About 423 ms (cold), Contact 48 ms, Resume 162 ms, Projects 63 ms. Reduced-motion run shows the same route delay (rm-run2.json dockClick firstWindowAt 554 ms), so the wait is not caused by animation.
- **Impact**: Visible feedback is instant, but the window itself can lag by roughly half a second on the first visit to a route.
- **Recommendation**: Prefetch the route components on hover or pointer-down, or open the window shell immediately and fill its content when the route resolves.
- **Verifier**: Intermittent: in 3 fresh runs the window appeared 44-86 ms after the dock click (verify2.mjs), while earlier runs logged 423 ms (About), 498 ms (nm) and 554 ms (rm). The reduced-motion run shows the same delay, so animation is not the cause. The cause is not profiled, and a route-chunk fetch is inferred.

#### ANIM-09: Framer-motion components would bypass the CSS reduced-motion guard if mounted

- **Lens**: Animation
- **Rule**: reduced-motion (section 1, Accessibility, CRITICAL)
- **Routes**: none mounted today (src/components/layout/Navbar.tsx, LanguageSwitcher.tsx, src/components/ui/ProjectCard.tsx)
- **Evidence**: grep finds no MotionConfig or useReducedMotion anywhere in src. Navbar.tsx and ProjectCard.tsx use motion.div with whileHover, spring and scale, and LanguageSwitcher uses motion.div with scale 0.95 to 1. The global CSS guard (globals.css:103-115) cannot stop JS-driven framer-motion animation. Grep shows Navbar and LanguageSwitcher, ProjectCard are not imported by any app route or non-test module, so there is no live impact now.
- **Impact**: No current user impact. A future re-mount of these components would ignore prefers-reduced-motion.
- **Recommendation**: Wrap the app in MotionConfig reducedMotion='user', or delete the unused components.
- **Verifier**: Latent only. grep finds no MotionConfig or useReducedMotion in src. framer-motion is used in Navbar.tsx, LanguageSwitcher.tsx and ProjectCard.tsx, which are imported only by their test files, so there is no live impact. The globals.css:103-115 guard is CSS-only.

#### ANIM-10: Stale and contradictory motion comments

- **Lens**: Animation
- **Rule**: motion-consistency (section 7)
- **Routes**: source only
- **Evidence**: win7-taskbar.css:691 says Start menu is opacity-only 120 ms, while the comment at about line 716 in the same file says the windows layer starts it at scale 0.96 over 300 ms. workspace-windows.css:296-313 sets a scale start and 240 ms transition that the win7 layer overrides, so the comment is wrong. research-os.css:15 describes a theme cross-fade that never runs (see ANIM-02).
- **Impact**: Maintainers will reason from wrong timings and may reintroduce the scale that was removed on purpose.
- **Recommendation**: Update the three comments to match the runtime values (opacity-only 120 ms for the Start menu; theme fade status after ANIM-02 is resolved).
- **Verifier**: Confirmed: win7-taskbar.css:716 comment says the windows layer starts the search dialog at scale 0.96 over 300ms. The actual duration token is --motion-window: 240ms (research-os.css:143), and workspace-windows.css:315-321 starting-style is scale(0.96). The 300ms figure is wrong, and the 'overridden' note should be checked against the cascade.

#### ANIM-11: Row stagger is 16 ms, below the 30-50 ms guideline

- **Lens**: Animation
- **Rule**: stagger-sequence (section 7)
- **Routes**: /en desktop lists using os-row-in (research-os.css:1422-1445)
- **Evidence**: research-os.css:144 defines --motion-stagger: 16ms and uses it for up to five row delays. Code only, not observed live.
- **Impact**: Very small: the stagger reads as nearly simultaneous rather than a sequence.
- **Recommendation**: Use 30-40 ms per row, capped at five rows, or keep it if the density is intentional.
- **Verifier**: Confirmed in code only: research-os.css:144 sets --motion-stagger: 16ms. The stagger applies only to .os-search-results rows 1-6 (research-os.css:1422-1445), not to desktop lists as the finding's route states. It is not observed live. Polish only.

#### F10: Window titles truncate with no full-title affordance

- **Lens**: First impression and i18n
- **Rule**: truncation-strategy
- **Routes**: /en desktop (Proof Atlas), /es desktop (Atlas title), phone reading windows (Long titles plus window chrome buttons.)
- **Evidence**: 'Proof Atlas · Sele…' followed by 'Where the eviden…' at 1440px (uiux/first-impression-design/desk-desktop.png). 'Atlas de prueb…' in ES (desk-es.png). On phone, three chrome buttons take about a third of the title bar (phone-desktop.png).
- **Impact**: The window label cuts off the descriptive part of the title, which is the part that says what the window contains.
- **Recommendation**: Shorten the window title to the primary noun and move the subtitle into the body, or allow a tooltip with the full title. Reduce chrome-button width on phone.
- **Likely files**: src/components/os/WorkspaceWindows.tsx
- **Verifier**: At 1440 the Proof Atlas title element 'Proof Atlas · Selected research' has scrollWidth overflow with text-overflow ellipsis, so it renders 'Proof Atlas · Sele…'. The second part 'Where the evidence connects' is clipped with no full-title affordance (uiux/fid-verify/home-desk-dark.png).

#### F11: Dark theme only partly applied: reading windows keep white bodies

- **Lens**: First impression and i18n
- **Rule**: dark-mode-pairing; color-dark-mode
- **Routes**: /en (intro window, dark), /en/about, /en/contact, /en/write-ups, /en/lab (dark) (Default dark appearance.)
- **Evidence**: Intro card (uiux/first-impression-design/desk-desktop.png), About (desk_en_about.png), Write-ups (desk_en_write-ups.png) show white window bodies. The Atlas and Explorer sidebar go navy in the same session, so the dark palette is mixed.
- **Impact**: Long reading in dark mode is glaring, and the surfaces do not feel like one 'Aero Night' theme.
- **Recommendation**: Decide whether reading windows are light by design (state it) or give them a dark body token that is checked for contrast.
- **Likely files**: src/components/os/win7-theme.css (Aero Night block L239-284)
- **Verifier**: In dark mode the intro window body (.window-body.has-space) computes to rgb(255,255,255). The Atlas and Explorer use dark navy, so the palette is mixed. Verified on the home desktop at 1440 dark.

#### F12: Tray 'Lock' and 'Window Controls' labels are unclear and sit next to frequent controls

- **Lens**: First impression and i18n
- **Rule**: nav-label-icon; destructive-nav-separation
- **Routes**: /en desktop tray, /en reading windows toolbar (Desktop tray and window toolbars.)
- **Evidence**: Tray order is search, lock, theme, language (desk-desktop.png). Lock returns to the logon screen (phone-tap-contact.png). Reading windows have a 'Window Controls' button in the toolbar (desk_en_about.png) with no visible meaning.
- **Impact**: A visitor can lock the desktop by accident, and 'Window Controls' does not say what it does.
- **Recommendation**: Add visible text or a tooltip for Lock and Window Controls, or drop them. Separate Lock from search and theme with spacing.
- **Likely files**: src/components/os/ResearchOS.tsx, src/components/os/WorkspaceWindows.tsx
- **Verifier**: Tray order is Search, Lock, Dark Appearance, Language. Lock is a 28px button with aria-label 'Lock' and no visible text, and tapping it returns to logon (verified in F1). Reading-window toolbar shows a 'Window Controls' button with no visible meaning (uiux/first-impression-design/desk_en_hall-of-fame.png). Visible label or tooltip is a fair recommendation.

#### F13: Hall of Fame shows an empty state from a main desktop link

- **Lens**: First impression and i18n
- **Rule**: empty-states
- **Routes**: /en/hall-of-fame (linked from desktop bottom-right) (No entries yet.)
- **Evidence**: uiux/first-impression-design/desk_en_hall-of-fame.png: 'No Entries Yet' inside a framed panel inside a framed panel; 'Awaiting the First Report' is cut at the window edge.
- **Impact**: A recruiter who clicks it sees an empty list. This reads as an empty section, not a credibility signal.
- **Recommendation**: Hide the Hall of Fame link until it has entries, or lead with the reporting policy and a clear invitation. Remove the double frame.
- **Likely files**: Hall of Fame view (not traced in src)
- **Verifier**: Confirmed from the existing evidence screenshot (desk_en_hall-of-fame.png): 'No Entries Yet' inside a framed panel inside a framed panel, subtitle clipped at the window bottom, and a 'Found a Vulnerability?' CTA above it. A direct URL to /en/hall-of-fame did not open the window in my run, so the live visual check relies on the evidence screenshot. Hiding the link is a judgement call.

#### F14: Contact page has no form, while the audit brief describes a secure contact form

- **Lens**: First impression and i18n
- **Rule**: n/a (brief versus live discrepancy)
- **Routes**: /en/contact (Observation only; not a defect by itself.)
- **Evidence**: DOM: 0 forms; the only input is the site search (lens-first-impression-design/probe-forms.mjs). Screenshot: uiux/first-impression-design/desk_en_contact.png shows an email-draft card (Open Email Draft), social links, and no form.
- **Impact**: Visitors get a mailto-style path. If a secure form was intended, it is missing.
- **Recommendation**: Confirm the intended contact method. If a form was planned, add it with visible labels and error text, or update the brief.
- **Likely files**: Contact view (not traced in src)
- **Verifier**: /en/contact has no form; ContactClient.tsx renders an intro and an email-draft card. SecureContactForm.tsx exists in src/components/ui, but the only importer is its own test file, so the form is not wired to any page. The 'brief' discrepancy is real; the orphaned component is an extra observation.

#### F15: Lab index leads with a keylogger proof of concept (editorial judgement)

- **Lens**: First impression and i18n
- **Rule**: n/a (editorial, inferred)
- **Routes**: /en/lab (Opinion for a recruiter-skim audience, not a UI defect.)
- **Evidence**: uiux/first-impression-design/desk_en_lab.png: the first card is 'Rust Keylogger PoC' (Archived), described as 'educational detection analysis'.
- **Impact**: The first item a recruiter reads in the Lab could be read as offensive tooling without context.
- **Recommendation**: Consider leading with a defensive or analysis-first item, or adding a one-line context note to the card.
- **Likely files**: Lab content source (not traced)
- **Verifier**: Lab headings in order: 'Rust Keylogger PoC' first, then 'Raw Socket Packet Sniffer', 'Steganography Tool'. Ordering is confirmed. The defect claim is editorial judgement, not a UI defect, so low is the right ceiling.

#### F16: Hero does not show availability; the Resume does

- **Lens**: First impression and i18n
- **Rule**: visual-hierarchy (inferred)
- **Routes**: /en desktop intro window (Recruiter-judgement recommendation.)
- **Evidence**: Intro (desk-desktop.png) shows name, role, and a one-line value statement, but no availability. The Resume header states 'Ready to relocate now... Visa sponsorship required' (uiux/first-impression-design/desk_en_resume.png), and About says 'ready to relocate' in body text.
- **Impact**: Hiring managers must open the Resume to learn availability and visa status.
- **Recommendation**: Add a short availability line to the intro card (for example 'Sydney, open to relocation'), or one line in the Getting Started text.
- **Likely files**: Intro window copy (not traced)
- **Verifier**: The intro window (desk-desktop evidence and home-desk-dark.png) shows name, role, one-line value statement and two buttons, with no availability line. The Resume states 'Ready to relocate now ... Visa sponsorship required' (en.ts L228, L320). Recommendation is editorial; the factual gap is confirmed.

#### FB-02: Search input has only a placeholder as its label, and the placeholder disappears once text is typed

- **Lens**: Forms and feedback
- **Rule**: quick-reference 8 input-labels (visible label per input, not placeholder-only)
- **Routes**: /en (search dialog, desktop and phone)
- **Evidence**: /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/forms-feedback/search-noresults-desk.png shows the input holding 'zzqxw' with no visible label, only the h2 'Search' above. Source: ResearchOS.tsx input has aria-label equal to the placeholder and no visible label element.
- **Impact**: Sighted users lose the prompt once they type; the heading is the only remaining context.
- **Recommendation**: Add a visible label (can be visually compact, e.g. a leading 'Search' label) that remains when the field has a value.
- **Verifier**: Reproduced in DOM: the search input has aria-label equal to placeholder ('Search projects, papers, and writing'), labels.length is 0, and no visible label element exists. The dialog heading 'Search' and hint 'Find a project, paper, article, or page.' give context. Accessible name is present, so this is a best-practice gap (input-labels), not a hard failure. Severity low is correct.

#### FB-03: The live /en/contact page has no contact form; SecureContactForm is orphaned code

- **Lens**: Forms and feedback
- **Rule**: Scope premise check (no form on the live page) - quick-reference 8 submit-feedback does not apply to a page with no form
- **Routes**: /en/contact
- **Evidence**: Live DOM probe (lens-forms-feedback/contact.mjs): forms=0, no #contact-name, only a search input and a mailto link 'Open Email Draft'. Screenshots: uiux/forms-feedback/contact-desk.png and contact-phone.png. Source: SecureContactForm (src/components/ui/SecureContactForm.tsx) is imported only by its own test file; ContactClient.tsx renders a mailto button instead.
- **Impact**: Anyone expecting the secure contact form gets a mail-client handoff. The form's validation and status code (and its tests) run only in tests, so its UX cannot be exercised by real visitors.
- **Recommendation**: Decide whether the form ships. If it does, wire it into ContactClient and fix FB-06 to FB-10 first; if not, remove the component and its test to avoid a false impression of a working form.
- **Verifier**: Reproduced on desktop and phone: /en/contact has forms=0, no #contact-name, one visible mailto link 'Open Email Draft'. Source: ContactClient.tsx line 47 comment says the address is shown as text 'so there is one mailto action per view', so the no-form design is deliberate. The page also states the handoff ('Opens your email app. You can review and send the message there.'). Severity downgraded from medium to low: this is a product and code-hygiene issue (orphaned SecureContactForm), not a UX or WCAG failure on the live page. Rule 'Scope premise check' is not a quick-reference rule id.

#### FB-04: Mail-client handoff has no fallback copy action for the address

- **Lens**: Forms and feedback
- **Rule**: quick-reference 8 error-recovery (clear recovery path)
- **Routes**: /en/contact
- **Evidence**: contact-desk.png and contact-phone.png show the address as plain text and one mailto button; the live button list has no copy-email control. Source: ContactClient.tsx lines 45-55. The no-mail-client case is inferred, not tested.
- **Impact**: On a device with no configured mail app (common on phones and shared machines) the visitor can only select the text manually; the page gives no feedback when the mailto link does nothing.
- **Recommendation**: Add a small 'Copy address' button with 'Address copied' feedback next to the mailto link.
- **Verifier**: Confirmed: the live button list has no copy-email control (the only 'Copy' match is 'Copy Link', which copies the page URL, not the address). Address is shown as selectable text. The no-mail-client case and missing feedback when mailto does nothing are INFERRED, not tested (an anchor has no JS hook). Severity low is correct.

#### FB-05: Copy Link failure message does not show the address to copy

- **Lens**: Forms and feedback
- **Rule**: quick-reference 8 error-recovery / error-clarity
- **Routes**: /en/contact (window Copy Link), /en/about (reading window Copy Link)
- **Evidence**: Clipboard-denied probe (search-copy.mjs, copy_denied_status): status text 'Select and copy the address from your browser' with no URL shown anywhere. Source: os-copy.ts line 95 (copyFailed) used by ResearchOS.tsx copyLink() and WorkspaceWindows.tsx copyLink().
- **Impact**: The recovery depends on the visitor finding the address bar; the message gives no address to copy, and it disappears after 3.5 s.
- **Recommendation**: Include the URL in the failure message, or show it in a read-only field that stays until dismissed.
- **Verifier**: Reproduced with clipboard denied on /en/contact: status 'Select and copy the address from your browser' appears, is still present at 3.1 s and gone by 4.3 s (consistent with the 3.5 s timer). No URL is shown anywhere in the failure state. Source: os-copy.ts line 95 and ResearchOS.tsx copyLink(), WorkspaceWindows.tsx copyLink(). Severity low is correct.

#### FB-06: Copy Link success toast appears far from the button that triggered it

- **Lens**: Forms and feedback
- **Rule**: quick-reference 8 success-feedback (confirm near the action)
- **Routes**: /en/contact (window toolbar)
- **Evidence**: /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/forms-feedback/copy-desk-after.png: the 'Link copied' toast is at the top-right of the viewport, about 900 px from the Copy Link button. The button itself does not change state. Clipboard value verified as https://raoufabedini.dev/contact (no stray hash).
- **Impact**: On a wide desktop the confirmation is easy to miss, because the eye stays on the button.
- **Recommendation**: Show a short inline state on the button (e.g. 'Copied' with a check icon for 2 s) and keep the global toast or status as the announcement.
- **Verifier**: Reproduced: after clicking Copy Link (clipboard granted), clipboard value is https://raoufabedini.dev/contact. The 'Link copied' status box is at x=1312, y=56, and the button is at x=346, y=116, a centre-to-centre distance of about 981 px. Button text and aria-pressed do not change. Screenshot: uiux/forms-feedback-adv/FB06-copy-after-click.png. The toast is role=status, so it is announced. Severity low is correct.

#### FB-07: Latent: native required and type=email constraint validation hides the component's custom error copy

- **Lens**: Forms and feedback
- **Rule**: quick-reference 8 error-clarity and error-placement; the custom error copy never reaches the user on empty fields
- **Routes**: SecureContactForm (not on the live site)
- **Evidence**: Replica test with the same attributes (lens-forms-feedback/focus-validate.mjs): empty submit fires 0 handler calls and shows the browser bubble 'Please fill out this field.'; a whitespace-only name passes native validation and shows the custom error. Source: SecureContactForm.tsx lines 144-203 use required, type=email and no noValidate; custom messages at lines 64-74.
- **Impact**: If the form ships, empty-field errors appear as unstyled browser bubbles that are not tied to the field, and the plain-language copy ('Please complete all fields.') is never used for the main case.
- **Recommendation**: Add noValidate to the form and run all validation in handleSubmit, or keep native validation and remove the duplicate custom messages.
- **Verifier**: Latent: SecureContactForm is not on the live site. Confirmed in source (form has no noValidate; required and type=email on inputs) and in a replica with the same attributes: empty submit fires 0 handler calls, shows the native bubble 'Please fill out this field.', and the custom 'Please complete all fields.' never appears. Whitespace-only name passes native validation and shows the custom error. Severity downgraded from medium to low because there is no live user exposure today. Would matter if the form ships.

#### FB-08: Latent: validation errors are not associated with their fields and move no focus

- **Lens**: Forms and feedback
- **Rule**: quick-reference 8 focus-management, error-summary, aria-live-errors
- **Routes**: SecureContactForm (not on the live site)
- **Evidence**: Source: SecureContactForm.tsx lines 205-222 render one <p role=alert> above the buttons; no aria-invalid or aria-describedby on any input (grep confirms none); handleSubmit (lines 64-74) does not move focus to the first invalid field. Validation runs only on submit, so there is no inline validation on blur.
- **Impact**: A screen reader user hears the message but cannot tell which field is wrong; a sighted user gets one generic line far from the field.
- **Recommendation**: Set aria-invalid and aria-describedby per field, put each error under its field, focus the first invalid field, and validate on blur after the first submit.
- **Verifier**: Latent (not live). Confirmed: no aria-invalid or aria-describedby in SecureContactForm.tsx; the error is one role=alert paragraph. Correction to the finding: the 'moves no focus' claim is wrong for empty fields. Replica shows native constraint validation focuses the first empty field (activeElement = name input). The gap is real only for custom-validation errors: whitespace name and invalid-email pattern leave focus on the submit button, with aria-invalid null and aria-describedby null. Recommend rewording the finding to name the custom-validation path only.

#### FB-09: Latent: success state reports 'Email draft opened' even though the page cannot know a mail client handled the mailto

- **Lens**: Forms and feedback
- **Rule**: quick-reference 8 submit-feedback / success-feedback (confirm only what the system has confirmed)
- **Routes**: SecureContactForm (not on the live site)
- **Evidence**: Source: SecureContactForm.tsx lines 84-95 call window.location.assign(mailto:...) and then unconditionally setStatus('DRAFT_OPENED'), so the status line reads 'Email draft opened' and the button reads 'Draft Opened' and stays disabled (line 232) until the user types. The catch branch cannot fire for an unhandled mailto. Inferred from code; not tested in a mail client.
- **Impact**: A visitor with no mail app sees a success state while nothing was sent, and the disabled button leaves no obvious way to resend.
- **Recommendation**: Use a neutral state ('Opening your email app...' then 'If nothing opened, copy the address below') and keep the button enabled with a 'Open again' action.
- **Verifier**: Latent (not live). Source-confirmed: SecureContactForm.tsx lines 84-95 call window.location.assign(mailto) and then unconditionally setStatus('DRAFT_OPENED'), so status reads 'Email draft opened' (en.ts status_sent) and the button is disabled (line 232) until typing. Whether a mail client handled the mailto was NOT tested (INFERRED UX harm). Severity downgraded from medium to low because it is not reachable on the live site.

#### FB-10: Latent: the form status line is not a live region, so state changes are silent to screen readers

- **Lens**: Forms and feedback
- **Rule**: quick-reference 8 aria-live-errors / toast-accessibility
- **Routes**: SecureContactForm (not on the live site)
- **Evidence**: Source: SecureContactForm.tsx lines 116-141 render the status text (Editing draft / Opening email app / Email draft opened) in a plain span with no role or aria-live. Only the error <p> (line 206) is announced.
- **Impact**: Screen reader users do not hear that the draft is opening or has opened.
- **Recommendation**: Give the status span role=status (polite) and keep it mounted.
- **Verifier**: Latent (not live). Source-confirmed: the status span at SecureContactForm.tsx lines 116-141 has no role or aria-live. Only the error paragraph (line 205-208, role=alert, aria-live=polite) is announced. Severity low is correct.

#### FB-11: Latent: the typing state uses error red, a warning icon and a red top bar for neutral input

- **Lens**: Forms and feedback
- **Rule**: quick-reference 8 contrast-feedback and color-semantic (error colour reserved for errors)
- **Routes**: SecureContactForm (not on the live site)
- **Evidence**: Source: SecureContactForm.tsx lines 101-109 (bg-red-500 bar when status is TYPING), lines 117-131 (text-red-400 and AlertTriangle while typing). Visual result not captured because the form is not live.
- **Impact**: Ordinary typing looks like an error state, which can make visitors think their input is wrong.
- **Recommendation**: Use the neutral cyan accent for typing and reserve red and amber for real errors.
- **Verifier**: Latent (not live). Source-confirmed: bg-red-500 top bar when status is TYPING (line 104), and text-red-400 with AlertTriangle while TYPING (lines 118-128). TYPING lasts 800 ms after each keystroke, so the error colour flickers during ordinary typing. Rule citation is loose: 'color-semantic' is a token-naming rule. Severity low is correct.

#### FB-12: Latent: no required markers, helper text or visible character limits on the form fields

- **Lens**: Forms and feedback
- **Rule**: quick-reference 8 required-indicators, input-helper-text
- **Routes**: SecureContactForm (not on the live site)
- **Evidence**: Source: SecureContactForm.tsx lines 144-203: required and maxLength (80, 120, 2000) are set, but no asterisk, legend or counter is rendered and the placeholders are the only hints.
- **Impact**: Visitors learn about required fields and limits only by submitting, and the 2000-character message limit is silent.
- **Recommendation**: Add 'Required' text or a marker, a visible limit counter on the message, and helper text for the email field.
- **Verifier**: Latent (not live). Source-confirmed: required, maxLength 80/120/2000 and placeholders are present, but no required marker, helper text, or visible character counter is rendered. Native required does expose the field to assistive tech. Severity low is correct.

#### FB-13: 404 page offers two language controls that repeat the same choices

- **Lens**: Forms and feedback
- **Rule**: quick-reference 8 progressive-disclosure (avoid redundant options)
- **Routes**: /en/no-such-page, /fa/no-such-page
- **Evidence**: Live probe (search-copy.mjs, nf_en_no-such-page): a language select plus five language links (English, فارسی, العربية, 中文, Español) are rendered together. Screenshot: uiux/forms-feedback/404-en-desk.png.
- **Impact**: Minor clutter on an error page where the visitor only needs a way back; no search box is offered.
- **Recommendation**: Keep one language control, and consider a short search field or a link to /projects as the primary recovery path.
- **Verifier**: Reproduced: /en/no-such-page renders one select plus five language links (English, فارسی, العربية, 中文, Español); /fa/no-such-page renders the same set plus home and browse links. No search input is present. Projects link is /projects on en. Redundancy confirmed. Rule 'progressive-disclosure' is a loose fit. Severity low is correct. Screenshot: uiux/forms-feedback-adv/FB13-404-en-desk.png.

#### LR-02: At 1024x768 and 390x844 the Proof Atlas option row is cut by the taskbar on first paint and its description and link sit below the fold

- **Lens**: Layout and responsive
- **Rule**: quick-reference 5: fixed-element-offset; quick-reference 2: touch-target-size (partly covered controls)
- **Routes**: / (desktop, after Enter) (Reproduced at 1024x768 and 390x844 after Enter; not present at 1280x720, 1440x900 or 1920x1080.)
- **Evidence**: uiux/layout-responsive/l1024.png shows 'Project Simurgh / Invisible Window / Project Zurvan' cut at the taskbar edge; lens-layout data m-1024x768.json reports the Atlas window at y=408 to 925 in a 768px viewport, 3 option buttons 3/6 covered and 'Open Project Evidence' at y=876 (off-screen). At 390x844 (uiux/layout-responsive/m390.png) 'Project Zurvan' is 0/6 hit under the taskbar (m-390x844.json).
- **Impact**: The three project selectors, the main interaction on the Atlas, are partly or wholly hidden under the taskbar until the user scrolls, and the labels are half-covered on a common laptop size.
- **Recommendation**: Same root cause as LR-01. Apply the workspace clamp to the Atlas, or add bottom scroll-padding so the Atlas is in view above the taskbar when focus or the selector row is scrolled into view.
- **Likely files**: src/components/os/Desktop.tsx, src/components/os/proof-atlas.css (.proof-atlas--desktop ~21-31; option row)
- **Verifier**: Reproduced with corrected numbers. At 1024x768 the option row (y 677-727) has its bottom ~11px under the taskbar (dock top 716); hit test 4/5 points, not 3/6. At 390x844 'Project Zurvan' (y 795-839, dock top 792) is fully under the taskbar at first paint (0/5 hit); 'Invisible Window' is clear. Keyboard Tab focus scrolls each option clear of the taskbar (overlap 0px in ax.mjs walk). Not present at 1280x720 and 1440x900 (5/5 hit). Evidence link at y=876 at 1024x768 is ordinary below-the-fold flow. Severity low: reachable by scroll and focus, not an AA failure.

#### LR-05: Window titles truncate on desktop widths 1024 to 1440, and the intro title truncates at 320

- **Lens**: Layout and responsive
- **Rule**: quick-reference 1: dynamic-type (avoid truncation as text grows); quick-reference 6: visual-hierarchy
- **Routes**: / (Proof Atlas and Getting Started windows)
- **Evidence**: uiux/layout-responsive/s/d1440-en-enter.png and w1280.png show 'Proof Atlas · Sele…' and 'Where the eviden…'. atlas.mjs reports the eyebrow span (80 to 126px wide) and the h2 truncated at 1024, 1280, 1440 and 390, and not at 1920. m320.png shows 'Independent research · …' truncated.
- **Impact**: The window's subtitle, which is the thesis line ('Where the evidence connects'), is cut off on the common laptop widths.
- **Recommendation**: Let the title wrap onto a second line or move the subtitle below the controls, instead of ellipsising the thesis line.
- **Likely files**: src/components/os/ProofAtlas.tsx (heading ~304-309), src/components/os/proof-atlas.css (.proof-atlas--desktop .proof-atlas-heading ~488-493)
- **Verifier**: Reproduced. The Proof Atlas eyebrow ('Proof Atlas · Selected research') and h2 ('Where the evidence connects') use text-overflow:ellipsis and are clipped at 1024 (126 of 186px and 122 of 180px), 1280 (80 of 186px), 1440 (121 of 186px) and 390 (110 of 186px); not clipped at 1920 (283px wide). Cited rule dynamic-type is a loose fit (it concerns text scaling); content-priority or visual-hierarchy would fit better.

#### LR-06: Projects explorer sidebar is a nested scroll region capped at 40dvh, showing about two and a half rows on phones and short screens

- **Lens**: Layout and responsive
- **Rule**: quick-reference 5: scroll-behavior (avoid nested scroll regions that interfere with the main scroll)
- **Routes**: /projects, /projects/invisible-window-research
- **Evidence**: lens-layout/nested.mjs: aside.os-explorer-sidebar max-height 256px at 320x640 (content 740px), 338px at 390x844 (content 740), 180px at 720x450 (content 651). At 1024x768 and above the sidebar nests inside the scrolling window body (window body 480px tall, sidebar 480px, content 727). Screenshots: uiux/layout-responsive/projects-320.png (third project row cut mid-line), projects-720x450.png (second row cut).
- **Impact**: On a touch device the list scrolls inside the page, a second scroll target sits inside the window, and the list shows a cut row rather than a clear end. Overscroll is contained, so this is usability, not a trap.
- **Recommendation**: On narrow screens show the project list as a horizontal chip row or a disclosure ('All projects, 13') that opens to a full-height list, rather than a 40dvh pane. At desktop widths keep the sticky sidebar but let the window body be the only scroller where possible.
- **Likely files**: src/components/os/project-explorer.css (narrow explorer rule with max-block-size 40dvh, ~1060-1080; desktop sticky sidebar ~1017-1027)
- **Verifier**: Confirmed in source and browser. project-explorer.css (~1069-1075) sets max-block-size:40dvh and overflow-y:auto on the explorer sidebar, which is the scroll container. Measured on /en/projects: 390x844 maxH 337.6px with scrollHeight 740 and one row cut at the edge; 720x450 maxH 180px with scrollHeight 651; 1024x768 maxH 480px, scrollHeight 727, sticky. The source comment says the nested pane is intentional, so this is usability polish. Rule scroll-behavior exists.

#### LR-07: Between 480px and 700px the pinned app labels collapse to a single letter with ellipses

- **Lens**: Layout and responsive
- **Rule**: quick-reference 5: breakpoint-consistency (systematic breakpoints)
- **Routes**: / (taskbar)
- **Evidence**: uiux/layout-responsive/z640.png shows 'P…', 'R…', 'A…', 'R…', 'C…' in the taskbar at 640x360. win7-taskbar.css sets pins to min-width 44px at max-width 700px, and labels are visually hidden only below 479px (~1063-1075), so the 480 to 700 band keeps truncated labels.
- **Impact**: Labels are unreadable in this band, and the icons are the only cue, so a first-time visitor cannot tell which pin is which.
- **Recommendation**: Use icon-only pins with a tooltip and an accessible name from 480px up, or drop to a single breakpoint so that the label behaviour is the same across the band.
- **Likely files**: src/components/os/win7-taskbar.css (max-width 700 block ~950-975; max-width 479 block ~1063-1075)
- **Verifier**: Reproduced visually at 640x360 (taskbar pins show 'P...', 'R...', 'A...', 'R...', 'C...'). win7-taskbar.css max-width:700px block sets pin min-width 44px, and the label is visually hidden only at max-width:479px (~1062-1080), so the 480-700 band keeps truncated labels. At 720x450 the full labels show, consistent with the band. Rule breakpoint-consistency exists.

#### LR-09: On tablet portrait the first screen shows only windows; the desktop app icons sit below the fold

- **Lens**: Layout and responsive
- **Rule**: quick-reference 5: content-priority (show core content first; fold or hide secondary content)
- **Routes**: / (desktop at 768x1024) (Observed at 768x1024; impact on users is inferred.)
- **Evidence**: uiux/layout-responsive/t768.png: the intro and Atlas windows fill the first screen and no app icons are visible. Page scroll reveals icons (scrollreach.mjs reports Projects at y=760 after centring). At 1024x768 the icons are visible at the top-left.
- **Impact**: Tablet visitors who do not scroll or use the taskbar may not see the app launchers. The taskbar pins remain reachable, which limits the impact.
- **Recommendation**: At 701px to 1023px portrait, place the app icon row above the windows, or stack a compact launcher row in the first screen.
- **Likely files**: src/components/os/win7-desktop.css (.os-app-grid ~320-360; desktop grid order ~31-60)
- **Verifier**: Reproduced. At 768x1024 the app grid (Projects, Research, About, Resume, Contact) starts at y=1056, below the 1024px first screen; t768.png shows only the two windows and the taskbar. At 1024x768 and 1280x720 icons are visible at y=61. Impact on users is inferred: the taskbar pins remain reachable, and the Getting Started window has direct CTAs. Rule content-priority fits.

#### nav-404-no-shell: The 404 page drops the desktop shell, so the taskbar and search disappear

- **Lens**: Navigation and IA
- **Rule**: persistent-nav (quick-reference 9)
- **Routes**: /nope, /projects/nope, /fa/nope (Ctrl+K on the 404 page was not tested.)
- **Evidence**: probe19.mjs and /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/navigation-ia/p19-404.png: the 404 dialog shows only 'Return Home', 'Browse Projects' and the language links, with no dock, search or tray. curl confirms HTTP 404 with noindex.
- **Impact**: A visitor who mistyped a path has two in-dialog routes and no global navigation. Strength: the recovery copy is clear.
- **Recommendation**: Render the taskbar, or at least Search and Projects, on the 404 screen.
- **Verifier**: Confirmed (misc-verify.mjs, screenshot uiux/nav-verifier/404-check.png). /nope: 0 dock items, no Search control; the dialog offers Return Home, Browse Projects and the five language links. HTTP 404 and robots noindex confirmed with curl. Ctrl+K on the 404 page was not tested.

#### nav-breadcrumb-static: Explorer breadcrumb is decorative and never names the open project

- **Lens**: Navigation and IA
- **Rule**: breadcrumb-web (quick-reference 9); drill-down-consistency
- **Routes**: /projects/project-simurgh (desktop and phone)
- **Evidence**: probe14.mjs: .os-explorer-address is aria-hidden, has no links or buttons, and reads 'Projects > All Projects' while Project Simurgh is open. ProjectExplorer.tsx ~lines 130-146 renders the address bar as spans. The 390px screenshot /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/navigation-ia/m4-project.png shows the same crumb.
- **Impact**: The crumb suggests a path but cannot be used to go back, and it does not say which project is open; only the sidebar highlight shows that.
- **Recommendation**: Make 'Projects' a link to /projects and show the project title as the last crumb, or remove the crumb and rely on the sidebar (keep it aria-hidden if removed).
- **Verifier**: Confirmed (misc-verify.mjs, crumb-verify.mjs). .os-explorer-address text reads 'Projects All Projects' with no links or buttons. It is aria-hidden through its ancestor DIV.os-explorer-commandbar (aria-hidden=true), not on the element itself. The sidebar marks 'Project Simurgh' with aria-current=page, so the open project is visible only there.

#### nav-contact-no-form: Contact is a mailto-only page; the 'secure contact form' is not mounted

- **Lens**: Navigation and IA
- **Rule**: error-recovery (quick-reference 8): a fallback when the primary action fails
- **Routes**: /contact (Impact for users without a mail client is inferred. Other mail clients were not tested.)
- **Evidence**: probe15.mjs: /contact has 0 forms, and the only input is the OS shell search box. The visible action is 'Open Email Draft' (mailto:raoof.r12@gmail.com) with the address as plain text. src/components/ui/SecureContactForm.tsx exists with a test, but nothing imports it (grep finds only its own file and its test). The live page matches the source. Screenshot: /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/navigation-ia/p14-contact.png.
- **Impact**: If no mail client is configured, or on a shared machine, the only route to contact is a mailto link with no copy-address control. The expected form is absent. Inferred impact: some recruiters reach a dead end here.
- **Recommendation**: Either mount SecureContactForm (its test already exists) or add a copy-address button and a fallback message, and update the docs to name the live contact path.
- **Likely files**: src/app/[locale]/contact/ContactClient.tsx, src/components/ui/SecureContactForm.tsx
- **Verifier**: Facts confirmed (misc-verify.mjs): /contact has 0 forms; the only input is the OS search box; a mailto:raoof.r12@gmail.com link is present; the only copy control is 'Copy Link', which copies the page URL, not the address. SecureContactForm is imported only by its own file and its test. Downgraded from medium: no user-facing copy promises a form, and ContactClient.tsx line 47 says the address is shown as text so there is one mailto action per view, i.e. a deliberate design. The 'dead end without a mail client' impact is inferred and was not tested.

#### nav-lock-resets: Lock returns to home and drops the open window

- **Lens**: Navigation and IA
- **Rule**: state-preservation (quick-reference 9)
- **Routes**: /projects/project-zurvan -> Lock -> unlock
- **Evidence**: probe17.mjs: Lock from /projects/project-zurvan goes to / with 0 windows, and after unlock the page is at / with no window. lockWorkspace in ResearchOS.tsx (~line 612) calls router.push(home).
- **Impact**: A visitor who locks loses their place. This is minor for a portfolio, but unexpected for a control that looks like a session lock.
- **Recommendation**: Keep the last path in sessionStorage and reopen it on unlock, as a per-viewer convenience only.
- **Verifier**: Confirmed (lock-verify.mjs). Lock on /projects/project-zurvan goes to / with 0 workspace windows; unlock also lands on / with 0 windows. Matches lockWorkspace (ResearchOS.tsx ~line 596, router.push(home)).

#### nav-naming-drift: The same destination has different names on the dock, window, document title and footer

- **Lens**: Navigation and IA
- **Rule**: WCAG 3.2.4 Consistent Identification; navigation-consistency (quick-reference 9)
- **Routes**: /write-ups, /lab, /lab/001
- **Evidence**: probe4.mjs: /write-ups has window title 'Research' and document title 'Write-ups'; /lab has window title 'Experiments' and document title 'Lab'. The dock label 'Research' (os-copy.ts dockResearch) points to /write-ups; the desktop icon subtitle is 'Papers and writing'; the desktop footer link reads 'Experiments' (Desktop.tsx); /lab/001 has a 'Back to Experiments' link; the search placeholder is 'Search Write-ups' (os-copy.ts librarySearch, line 82); the Explorer on /write-ups says 'Writing'.
- **Impact**: Recruiters cross-referencing names (for example 'Experiments' in the footer against 'Lab' in the tab title or URL) can lose the thread, and screen-reader users hear different names for the same destination.
- **Recommendation**: Choose one noun per destination (for example 'Research / Write-ups' and 'Lab') and use it on the dock, window title, document title, footer and search.
- **Verifier**: Confirmed live (lens-nav-verifier/naming-verify.mjs). /write-ups: document title 'Write-ups', dock label 'Research', search placeholder 'Search Write-ups' in source (os-copy.ts line 82), window chrome shows 'Research' and 'Writing'. /lab: document title 'Lab', window 'Experiments' / 'The Lab', footer link 'Experiments' visible in the desktop screenshot. Downgraded from medium: this is wording inconsistency, with no task failure. WCAG 3.2.4 is a weak fit because the same function is not clearly mislabelled across pages.

#### nav-pdf-target: PDF links open in the same tab on project pages and the resume page, but in a new tab elsewhere

- **Lens**: Navigation and IA
- **Rule**: navigation-consistency (quick-reference 9)
- **Routes**: /projects/project-simurgh, /projects/invisible-window-research, /resume
- **Evidence**: probe13.mjs: the 'Download Paper' links on project pages have target null, and 'Download Resume' on /resume has target null. The desktop 'View Resume PDF' (Desktop.tsx ~line 282), the /write-ups PDFs and the search PDF results (probe18.mjs) use target _blank. DOI and Zenodo links use _blank with rel noopener noreferrer. The label 'Download' does not match inline PDF viewing.
- **Impact**: From a project page, the paper opens in the same tab and takes the reader off the site; the 'Download' label also promises a file save that the browser may not perform.
- **Recommendation**: Apply one rule for documents (target _blank with rel noopener, or a real download) and label the link to match what happens.
- **Verifier**: Confirmed (lens-nav-verifier/misc-verify.mjs). 'Download Paper' links on /projects/project-simurgh and 'Download Résumé' on /resume have target null. 'View Résumé PDF' and the search/write-up PDF links use target _blank with rel noopener noreferrer. DOI and Zenodo links were not re-checked.

#### nav-restore-chip: A closed desktop window is restored only through a small bottom chip

- **Lens**: Navigation and IA
- **Rule**: empty-nav-state (quick-reference 9)
- **Routes**: / (after Close on the Getting Started window)
- **Evidence**: probe10.mjs and /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/navigation-ia/p10-intro-close.png: after Close on the intro window, the only way back is the chip 'Independent research · Sydney' at bottom centre (Desktop.tsx restore buttons ~lines 348-359).
- **Impact**: The intro holds the main call to action ('Explore My Work'). A visitor who closes it may not find the way back, and must use the dock instead.
- **Recommendation**: Add a visible 'Show intro' item in the footer, or allow the window to reopen from the Desktop orb.
- **Verifier**: Partly confirmed, and the 'only way back' wording is wrong. After closing the intro, the chip 'Independent research · Sydney' appears at y=796 of 900 and restores it. The Desktop orb on home does not restore it. But a page reload also brings the intro back: the chip disappears and the intro is visible (screenshot uiux/nav-verifier/after-reload-home.png). The chip is the only in-session restore control. Severity stays low.

#### nav-single-window: Opening another app closes the current window and its state, with no way to keep two open

- **Lens**: Navigation and IA
- **Rule**: state-preservation (quick-reference 9)
- **Routes**: /projects -> /resume (Intent is documented; the user impact is inferred.)
- **Evidence**: probe3.mjs part A: after Projects and then Resume, only one .os-workspace-window remains (/resume). The comment in src/components/os/workspace-model.ts reads 'Only the current reading page; previous pages are never retained.' This is a documented design choice, not a defect.
- **Impact**: Recruiters comparing a project with the resume or papers must reopen windows, and the Explorer selection is lost.
- **Recommendation**: If the single-window model is intended, restore the last Explorer selection on return, or allow a second window to stay open.
- **Verifier**: Behaviour confirmed (misc2-verify.mjs): Projects then Resume leaves only /resume open. The comment in workspace-model.ts line 15 ('Only the current reading page; previous pages are never retained') shows this is an intended model. Treat as a design observation, not a defect. User impact is inferred.

#### nav-start-orb: The Start orb is a home link labelled 'Desktop', not a Start menu

- **Lens**: Navigation and IA
- **Rule**: search-accessible and nav-label-icon (quick-reference 9)
- **Routes**: Every desktop route (dock)
- **Evidence**: probe2.mjs and ResearchOS.tsx ~lines 1183-1186: the orb is a Link with href '/' and aria-label copy.desktop. Search is only the tray magnifier (aria 'Search') or Ctrl+K. probe18.mjs: the magnifier opens the dialog, and focus returns to it on Escape.
- **Impact**: The Win7 metaphor implies a Start menu. The orb behaves like Show Desktop, so the index and search are less discoverable than the metaphor suggests.
- **Recommendation**: Open a Start panel (apps plus search) from the orb, or relabel it 'Desktop' everywhere and show 'Search (Ctrl K)' as visible text.
- **Verifier**: Confirmed (misc2-verify.mjs): the orb is a.os-dock-home with href '/' and aria-label 'Desktop'. Clicking it on the home page does not reopen the closed intro (lock-verify.mjs). The argument that the Win7 metaphor implies a Start menu is subjective and was not tested with users.

#### nav-trailing-slash-chain: Trailing-slash URLs take two redirect hops

- **Lens**: Navigation and IA
- **Rule**: deep-linking (quick-reference 9)
- **Routes**: /projects/, /about/
- **Evidence**: curl -L: https://raoufabedini.dev/projects/ reaches https://raoufabedini.dev/projects after 2 redirects (308 to /en/projects, then 308 to /projects). /about/ behaves the same way. public/_redirects has the /en/projects and /en/projects/* 308 rules. The origin of the first hop is inferred (trailing-slash handling plus the /projects/* 200 rewrite) and not confirmed.
- **Impact**: Small extra latency, and a confusing intermediate URL for shared links that end with a slash.
- **Recommendation**: Redirect trailing-slash variants straight to the canonical path in one 308, or set the trailing-slash behaviour consistently.
- **Likely files**: public/_redirects
- **Verifier**: Confirmed with curl -L: https://raoufabedini.dev/projects/ reaches /projects after 2 redirects (first 308 to /en/projects, then 308 to /projects per public/_redirects line 17). /about/ shows the same pattern via /en/about. The origin of the first hop is inferred (trailing-slash handling), not confirmed.

#### P-02: Logon sign-in waits a fixed 3 s with no reduced-motion bypass

- **Lens**: Performance
- **Rule**: reduced-motion (quick-reference section 1); progressive-loading (section 3)
- **Routes**: / (logon, default locale) (Measured by code reading and by the transition probe (lens-performance/perf.mjs with the enter flag); the timer itself was not timed separately.)
- **Evidence**: src/components/os/WelcomeEnter.tsx:7 defines WELCOME_LOADER_MS = 3000. enter() (lines 108-127) sets loading, disables the orb with aria-busy, and calls arrive() after loaderMs. setWelcomeLoaderDuration (line 15) has no caller outside tests (grep over src). Neither WelcomeEnter.tsx nor ResearchOS.tsx checks prefers-reduced-motion for this timer. The desktop JS is already downloaded and mostly parsed when the orb is clicked (see P-05), so the 3 s is idle wait.
- **Impact**: Every visitor, including people who asked for reduced motion, waits 3 s after clicking the orb before the desktop appears. The skip link bypasses the wait.
- **Recommendation**: If the loader is kept for branding, skip or shorten it when prefers-reduced-motion is set, and consider a shorter default. This is a design call for the owner, so leave the 3 s as-is until they decide.
- **Verifier**: Reproduced. Click on #os-enter to .os-shell[data-arriving] took 3354 ms by default and 3338 ms with reduced motion emulated (matchMedia confirmed reduce). The timer is not bypassed. WelcomeEnter.tsx:7 sets 3000 ms and setWelcomeLoaderDuration has no production caller. Severity lowered: welcome-enter.css:153-161 already stops the dot animation under reduce, with a comment that the wait is kept on purpose. The wait is not motion and the skip link exists, so this is a design decision, not a WCAG A/AA failure.

#### P-03: Logon portrait is a 118 KB file for an 84 px slot and is the LCP element on the first screen

- **Lens**: Performance
- **Rule**: image-optimization (section 3); image-dimension (already satisfied)
- **Routes**: / (logon) (Image sizing is observed. The byte target is an estimate, not a measured result.)
- **Evidence**: public/images/raouf-welcome.webp is 336x336 and 118,458 bytes (magick identify; curl -sI on the live URL returns content-length 118458). Live HTML: <img width=84 height=84 class=os-lock-portrait src=/images/raouf-welcome.webp> plus <link rel=preload as=image>. Largest-contentful-paint entries on desktop and mobile runs end on IMG.os-lock-portrait (single runs at 1776 ms desktop and 1736 ms mobile). Desktop LCP median for / is 1664 ms (n=3).
- **Impact**: The first screen waits on about 118 KB of image for an 84 CSS px avatar. On a slow mobile connection this is the largest single cost on the logon route.
- **Recommendation**: Export a 168x168 (2x) WebP and AVIF at about quality 80 and point the logon at it. The byte target is an estimate, so measure the result. Keep the existing width and height attributes.
- **Verifier**: Element and bytes confirmed. The LCP element on / is IMG.os-lock-portrait (src /images/raouf-welcome.webp). The file is 336x336 and 118,458 bytes, rendered at 84 CSS px, and the preload link is in the HTML. Magnitude not reproduced: LCP was 164 to 212 ms over 3 runs on the current SYD edge, not the 1664 ms claimed. Severity lowered to low because the byte waste is real but the measured cost is small on this network.

#### P-07: About 11.5 MB of unused hero video and posters ship in public/ on every build

- **Lens**: Performance
- **Rule**: No UX rule applies; repository hygiene (affects deploy size, not visitor page weight)
- **Routes**: site-wide build output (Unreferenced status is confirmed by grep and by the live HTML, not by a runtime request log for every route.)
- **Evidence**: public/hero-verification-desktop.mp4 4,326,800 bytes; hero-verification-desktop.webm 2,234,444; hero-verification-mobile.mp4 3,176,646; hero-verification-mobile.webm 1,758,874; posters 177,635 and 164,030. src/components/ui/HeroVideo.tsx has no importer outside its own test (grep over src). The live root and /about HTML contain no hero-verification references (grep count 0). public/Raouf_2.png (538 KB) appears only as a fallback candidate in src/app/[locale]/about/AboutClient.tsx:34.
- **Impact**: No visitor download cost today, because nothing references the files. They are copied into out/ and every Cloudflare Pages deploy.
- **Recommendation**: If the hero video is not planned, remove the assets and HeroVideo.tsx with its test in a separate change, after the owner confirms. If it is planned, mount it with preload set to none until needed.
- **Verifier**: Confirmed. Files exist in public/: hero-verification-desktop.mp4 4,326,800 B, .webm 2,234,444 B, mobile mp4 3,176,646 B, .webm 1,758,874 B, plus posters (jpg 177,635 and 164,030, avif 82,563 and 83,550). Including the AVIF posters the total is about 11.45 MiB, so the finding's 11.5 MB is right once those are counted. grep finds no importer of HeroVideo outside HeroVideo.tsx and its test. Live HTML has 0 hero-verification references. The mp4 is still served (HTTP 200, 4326800 bytes). Low severity is right.

#### P-08: Replaceable images and video are cached for 4 h without hashed names or immutable caching

- **Lens**: Performance
- **Rule**: No UX rule applies; cache policy
- **Routes**: /Raouf_2.jpg, /images/raouf-welcome.webp, /og.png, /hero-verification-desktop.mp4 (Header values were observed on the live site; the cause (Pages defaults or a rule) was not traced.)
- **Evidence**: curl -sI on the live URLs returns cache-control: public, max-age=14400, must-revalidate for each file. By contrast /_next/static/* returns public, max-age=31536000, must-revalidate, immutable (observed in lens-performance run JSON).
- **Impact**: Returning visitors revalidate photos every 4 h. Because the filenames are not versioned, a replaced image can stay stale in caches. Impact is low.
- **Recommendation**: Give replaced media versioned filenames, such as a hash suffix, and set a long max-age or immutable on those paths.
- **Verifier**: Confirmed by curl. /Raouf_2.jpg, /images/raouf-welcome.webp, /og.png and the hero mp4 all return cache-control: public, max-age=14400, must-revalidate. /_next/static/chunks/3g4px251sg85e.js returns public, max-age=31536000, must-revalidate, immutable. Filenames are not versioned. Low impact, as stated.

#### SC-05: Pastel glow gradient hairlines and hover rims survive in the Win7 layer

- **Lens**: Style consistency
- **Rule**: quick-reference 4 style-match and consistency; effects-match-style; state-clarity
- **Routes**: /en/security-policy, /en/about, /en/resume, /en/contact, /en/write-ups and lab footers, /en/hall-of-fame callouts
- **Evidence**: Screenshot r09-_en_security-policy.png: a blue-to-pink-to-orange hairline sits between the report callout and the Scope section. Source: src/components/os/supporting-apps.css:1593-1620 draws section dividers with var(--os-glow-gradient); research-os.css:65-71 defines it as blue, violet, pink, orange at 100deg. supporting-apps.css:1642-1690 adds a gradient card rim on hover. No win7-*.css file overrides --os-glow-gradient or --os-card-rim (grep returned no matches).
- **Impact**: The rainbow hairline is a leftover from the earlier glow design. It clashes with the flat Win7 rules around it and reads as decoration rather than structure.
- **Recommendation**: Replace the glow divider with a 1px Win7 keyline (#d5dfe5 in light, the dark keyline in night) and use a flat 1px Win7-blue border for the hover state instead of the gradient rim.
- **Likely files**: src/components/os/supporting-apps.css, src/components/os/research-os.css, src/components/os/win7-pages.css
- **Verifier**: Reproduced on /en/security-policy: a blue-to-pink-to-orange 1px hairline sits between the report card and the Scope section (uiux/style-consistency/sp-dark-full.png). Source confirmed: supporting-apps.css:1593-1620 draws the section divider with var(--os-glow-gradient); research-os.css:65 and 294 define the gradient; grep finds no --os-glow-gradient or --os-card-rim override in any win7*.css file. The hover gradient rim (supporting-apps.css:1642-1690) was not exercised.

#### SC-06: Proof Atlas title bar truncates at the default desktop width

- **Lens**: Style consistency
- **Rule**: quick-reference 6 truncation-strategy (prefer wrapping; full text available); navigation-consistency (window titles)
- **Routes**: /en (desktop, 1440px and 390px)
- **Evidence**: Screenshot 02-desktop-1440.png shows the title bar as 'Proof Atlas · Sele…' followed by 'Where the eviden…' (cut). phone-desktop.png shows the same cut. Source: src/components/os/atlas-copy.ts:22-23 (eyebrow 'Proof Atlas · Selected research' and heading 'Where the evidence connects'); src/components/os/Desktop.tsx:141 uses the .proof-atlas-heading h2 selector for the title.
- **Impact**: The window's name reads as unfinished, and the heading that explains the Atlas is unreadable in the title bar.
- **Recommendation**: Show only the heading in the title bar and move the eyebrow into the body, or set a minimum window width that fits the full title.
- **Likely files**: src/components/os/atlas-copy.ts, src/components/os/Desktop.tsx, src/components/os/proof-atlas.css
- **Verifier**: Reproduced in both themes on /en at 1440px: the Proof Atlas title bar reads 'Proof Atlas · Sele…' then 'Where the eviden…' and is cut (uiux/style-consistency/desktop-dark-live.png, desktop-light-atlas.png). Correction to the evidence: the cited Desktop.tsx:141 is a focus-restore selector, not the title. The window title is set at Desktop.tsx:109-112 from atlasCopy.eyebrow, and atlas-copy.ts:22-23 holds the eyebrow and heading strings. The source of the second heading segment in the title bar was not located. The phone route was not re-checked for this finding.

#### SC-07: Atlas uses a text arrow glyph while the rest of the OS uses Lucide icons

- **Lens**: Style consistency
- **Rule**: quick-reference 4 icon-style-consistent; pro-rules 'All icons come from a consistent icon family'
- **Routes**: /en (Proof Atlas 'Open Project Evidence')
- **Evidence**: Source: src/components/os/ProofAtlas.tsx:538-540 renders '↗' as a text span. Desktop.tsx:6 and 289 use Lucide ExternalLink for the same kind of affordance. Screenshot: light-desktop.png, 'Open Project Evidence ↗'.
- **Impact**: Minor. The glyph's size and weight do not match the Lucide icons next to it, so the link looks slightly off.
- **Recommendation**: Replace the span with a Lucide ArrowUpRight at 14-16px, aria-hidden, as the rest of the OS does.
- **Likely files**: src/components/os/ProofAtlas.tsx
- **Verifier**: Confirmed in source: ProofAtlas.tsx:538-540 renders the '↗' glyph in a span with aria-hidden. Desktop.tsx:6 and 289 import and use Lucide ExternalLink for a similar affordance. The glyph is visible next to 'Open Project Evidence' in the light screenshot (uiux/style-consistency/desktop-light-atlas.png). Polish only.

#### SC-09: Two contact addresses appear across pages

- **Lens**: Style consistency
- **Rule**: quick-reference 8 form-labels / error-clarity (content consistency, inferred)
- **Routes**: /en/security-policy (raoof.r999@outlook.com), /en/about, /en/contact, /en/resume (raoof.r12@gmail.com)
- **Evidence**: Screenshot r09-_en_security-policy.png shows raoof.r999@outlook.com. r03-_en_about.png, r05-_en_contact.png and r04-_en_resume.png show raoof.r12@gmail.com. Source: src/lib/constants.ts:8-9 defines CONTACT_EMAIL (outlook) and CONTACT_EMAIL_GMAIL; SecurityPolicyClient.tsx uses CONTACT_EMAIL. Inferred intent: deliberate split for security reports.
- **Impact**: A recruiter or peer may see two addresses and not know which to use. It is probably intentional, but the page does not say why.
- **Recommendation**: Confirm the intent with the owner. If reports should go to a separate address, say so in the policy copy (for example 'Security reports go to ...').
- **Likely files**: src/lib/constants.ts, src/app/[locale]/security-policy/SecurityPolicyClient.tsx
- **Verifier**: Confirmed in code and in the rendered pages. /en/security-policy shows raoof.r999@outlook.com (uiux/style-consistency/sp-dark-full.png) because SecurityPolicyClient.tsx:12 and 39 use CONTACT_EMAIL. /en/resume shows raoof.r12@gmail.com (resume-dark-full.png), and about, contact, resume, layout and feed files use CONTACT_EMAIL_GMAIL. constants.ts:8-9 defines both addresses. The deliberate split is inferred from the code and was not confirmed with the owner.

#### TI-07: Hover styles stick after a tap (no (hover: hover) guard)

- **Lens**: Touch and interaction
- **Rule**: hover-vs-tap; state-clarity
- **Routes**: /en/about (Copy Link button), /en (dock pins)
- **Evidence**: Only one @media (hover: hover) guard exists in the stylesheets (src/components/os/workspace-windows.css:147), against 83 :hover selectors overall. Measured with lens-touch/sticky-copy.mjs at 390: after a real touch tap, Copy Link still matches :hover and shows the blue hover gradient 4 seconds later (rest state had no hover). A dock item kept :hover 1.5s after lift (lens-touch/sticky-enter.mjs) until the next tap elsewhere.
- **Impact**: After a tap, controls stay highlighted and read as selected or still active, which is confusing on touch devices where there is no pointer to move away.
- **Recommendation**: Wrap hover-only decoration in @media (hover: hover) and keep :active and :focus-visible feedback for touch. Keep the Copy Link success toast as the confirmation.
- **Verifier**: Confirmed with one caveat. After a real touch tap, the Copy Link button stays in the :hover chain at 300ms, 1.5s and 4s (document.querySelectorAll(':hover') at 390 and 768). A dock pin (Research) stays hovered at 1.5s. Caveat: an earlier locator-based check returned not-hovered at 4s, so the behaviour was observed inconsistently. The CSS count and the single @media (hover: hover) guard at workspace-windows.css:147 are confirmed by grep (83 :hover occurrences, one hover guard, which covers the tooltip only). Evidence: probe3.json (stickyHover).

#### TI-09: Theme switch thumb renders as a stray ring outside the track on the logon screen at 390

- **Lens**: Touch and interaction
- **Rule**: state-clarity (visual state of a toggle); touch target itself is met by the hit area
- **Routes**: /en (logon, 390x844)
- **Evidence**: Computed style (lens-touch/switch-crop.mjs): button.os-theme-switch::before has top:-10px, left:-2px, width:18px, height:18px, so it sits above and left of the 40x24 track. Screenshot uiux/touch-interaction/switch-crop-390.png shows a grey circle hanging off the top-left of the pill. The phone rule in src/components/os/theme-switch.css:148-160 sets inset:-10px -2px as a transparent hit-area extension, but the 18px width and height from the base thumb rule apply, so the extension is drawn as the thumb.
- **Impact**: The first control a visitor sees on the logon screen looks misaligned on phones. (Cause inferred from computed style; the author's intent for the 18px box is not confirmed.)
- **Recommendation**: On the phone rule, make the hit-area ::before transparent and sized by inset:-10px -2px with width and height auto, and keep the visible thumb on a separate element so the track thumb stays inside the pill.
- **Verifier**: Confirmed by computed style and a 4x crop. button.os-theme-switch::before computes top -10px, left -2px, width 18px, height 18px, with the phone inset override applied. It renders as a faint translucent ring with a drop shadow hanging off the top-left of the 40x24 track. It is a faint ring, not a solid grey circle. Correction: the 44px hit-area extension is not effective. The effective hit area is the 40x24 button plus the 18px pseudo box, so the switch is 40x24 on phone, which still meets WCAG 2.5.8 AA. Evidence: uiux/touch-interaction/verify/phone390-logon-switch-x4.png, probe3.json (logonHit).

#### TC-04: Aero Night is only half dark: explorer list and reading bodies stay pure white

- **Lens**: Typography and colour
- **Rule**: color-dark-mode and dark-mode-pairing (quick-reference section 4 and 6)
- **Routes**: /en/projects (dark), /en/about (dark), /fa/about (dark) (Aero Night)
- **Evidence**: DOM probe: .os-explorer-sidebar background-color rgb(255,255,255) with black text in dark mode; uiux/type-colour/sidebar-top-dark-3x.png shows the white list next to navy controls. Reading windows keep a #ffffff body in a navy shell (uiux/type-colour/about-fa-dark.png). The Aero Night block re-points --explorer-* but not --os-surface (project-explorer.css:14-15).
- **Impact**: Bright white panels against navy chrome produce glare and a mixed look: the sidebar reads as light while its controls read as dark. Judgement call: white reading panes are a deliberate choice, so this is a design issue rather than a measured defect.
- **Recommendation**: Pick one dark surface policy and apply it to the sidebar, fields and reading windows together: either dark reading and sidebar surfaces with light text (the tokens already exist), or keep white panes and bring the controls into line with them.
- **Likely files**: src/components/os/project-explorer.css:14-15 (--os-surface white, no dark override), src/components/os/win7-theme.css:119 and 253 (--body-bg #ffffff in both themes)
- **Verifier**: The facts are confirmed: in dark mode .os-explorer-sidebar computes background rgb(255,255,255) with black text (also on the detail route), and the about reading body (for example 'Raouf Abedini.') computes black on rgb(255,255,255). This is a design-consistency judgement, not a measured WCAG failure, and the finding itself says so; severity downgraded from medium to low.

#### TC-05: Desktop icon sub-labels are white 12px text on mid-blue in light mode

- **Lens**: Typography and colour
- **Rule**: color-contrast (WCAG 1.4.3: normal text needs 4.5:1; 12px is not large text)
- **Routes**: /en (desktop, light theme) (Light theme; sub-label under the Contact icon, 'Start a conversation')
- **Evidence**: Pixel test: white #fff on #3982c3 at 12px, 4.07:1 (measure/desk-en-light.json). Legible in uiux/type-colour/desk-light-icon-label.png thanks to the 1px text-shadow, which the ratio does not count. Other icon sub-labels were not measured individually; same class assumed (inferred).
- **Impact**: Secondary desktop labels are the least legible text on the light desktop.
- **Recommendation**: Use a darker sky behind the icon column or a faint plate under the labels, or raise sub-labels to 13px. Re-measure.
- **Likely files**: src/components/os/win7-desktop.css:54,307,321,360 (raw #ffffff on desktop labels), src/components/os/win7-desktop.css (--win7-desk-label-shadow)
- **Verifier**: Reproduced on /en light: the 'Start a conversation' sub-label (12px, weight 400) computes rgb(255,255,255) with a 1px text-shadow over a sampled background of rgb(60,133,197) (#3c85c5). White vs that background = 3.92:1, slightly below the 4.07 recorded earlier, but still under 4.5:1 for normal text. The same label on dark reads 7.57:1 (rgb(29,84,152)). Source confirmed: win7-desktop.css uses raw #ffffff on desktop labels (lines 54, 307, 321, 360 and others). Other sub-labels were not individually measured, so their status is inferred. Low severity is right.

#### TC-06: Raw colour and duplicated tokens undercut the 'define once' token layer

- **Lens**: Typography and colour
- **Rule**: color-semantic (quick-reference section 6); dark-mode-pairing
- **Routes**: all OS-shell routes (/en, /fa, /ar, /zh) (Static code audit)
- **Evidence**: 53 raw 'color:' literals (#hex or rgb) against 51 var() references across win7-desktop, logon, pages, taskbar, windows, polish and explorer CSS. win7-theme.css:4-6 says each token is defined once, yet --os-line #d5dfe5 is declared in win7-pages.css:16, win7-windows.css:463 and project-explorer.css:16, and dark #2b4466 in project-explorer.css:100 and proof-atlas.css:622. win7-taskbar.css:662-671 redefines --os-text #000 and --os-muted #3d3d3d as raw values. These gaps produced TC-02 and TC-03.
- **Impact**: Each new surface can keep light text in dark mode without anyone noticing, which is how TC-02 and TC-03 got in.
- **Recommendation**: Route every text colour through --win7-text-* or --os-text. Define each --os-* role once per theme in win7-theme.css. Add a CI grep guard against raw color: literals outside theme.css.
- **Likely files**: src/components/os/win7-theme.css:4-6 (claim of single definition), src/components/os/win7-taskbar.css:662-671, src/components/os/win7-pages.css:16, src/components/os/win7-windows.css:463, src/components/os/project-explorer.css:16,100, src/components/os/proof-atlas.css:622
- **Verifier**: Partly confirmed. Confirmed: --os-line #d5dfe5 is declared in win7-pages.css:16, win7-windows.css:463 and project-explorer.css:16; dark #2b4466 appears in project-explorer.css:100 and proof-atlas.css:622; win7-taskbar.css:662-663 sets raw --os-text #000000 and --os-muted #3d3d3d; win7-theme.css:4-6 says each token is defined once. Not reproduced: the '53 raw color literals vs 51 var() references' ratio. A count of lines matching color: var( across the same files returns 210, so the ratio depends on the counting method and cannot be supported as stated. The causal link to TC-02 and TC-03 is also not shown: TC-02 is a token choice (--win7-body-text), and TC-03 is a missing dark override. No direct user-facing defect, so severity is low rather than medium.

#### TC-07: Project-detail prose runs about 81 characters per line

- **Lens**: Typography and colour
- **Rule**: line-length (quick-reference section 6, 65-75 characters) and line-length-control (section 5)
- **Routes**: /en/projects/invisible-window-research (dark and light) (Desktop 1440px, detail column)
- **Evidence**: Median 81 characters per line, estimated as text length divided by line count (measure/proj-en-dark.json). About measures 61 (measure/about-en-dark.json), inside the guideline. The estimate is inferred and should be about plus or minus 5. uiux/type-colour/proj-en-dark.png shows description lines of roughly 85 characters.
- **Impact**: Long lines make the paper summary harder to track on a wide desktop.
- **Recommendation**: Cap the dossier description column at about 68ch.
- **Likely files**: src/components/os/project-explorer.css (dossier column width, inferred), src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx (inferred)
- **Verifier**: Measured with real line boxes (Range rects, not a text/line-count estimate). Detail prose on invisible-window-research averages 80-81 characters per line at 1440px (column 654-665px wide). About paragraphs run 61-74 characters per line, so About is within the 65-75 guideline and the finding's 'about 61' understates its upper range. Low severity stands.

#### TC-08: Type scale is off-grid and phone window chrome sits at 12-13px

- **Lens**: Typography and colour
- **Rule**: font-scale (quick-reference section 6), readable-font-size (section 5: 16px mobile body), text-styles-system (section 6)
- **Routes**: /en/about (1440 and 390), /en/projects (390), /en (390) (Measured font sizes across routes)
- **Evidence**: Measured sizes: About 12/13/15/16/32; project detail 12/13/15/16/28; desktop-at-390 12/13/16/28; Projects at 390 12/13/16 (measure/*.json sizeHistogram). Reading body is 16px, which complies. Window chrome, explorer rows and tags are 12-13px on phones too. The 15px and 28px sizes sit off the 12/13/16 token set.
- **Impact**: Small text that is still readable, but it is tiring on a bright phone screen and for older readers.
- **Recommendation**: Set a 14px floor for interactive chrome on phones, keep 13px on desktop, and consolidate to one scale such as 12/14/16/18/24/32.
- **Likely files**: src/components/os/win7-theme.css (--win7-ui-size, --win7-small-size, --win7-body-size), src/components/os/win7-pages.css:48 (max(15px, body))
- **Verifier**: Histograms checked against the measurement files and consistent with the claim: about 1440 has 12/13/15/16/32; project detail 1440 has 12/13/15/16/28; desk 390 dark has 12/13/16/28; projects 390 light has 12/13/16. about 390 also has a 24px size, which the finding does not mention (not a correction to the verdict). Reading body is 16px. Minor. Low severity.

#### TC-09: CJK font stacks differ between the two sheets

- **Lens**: Typography and colour
- **Rule**: font-pairing (quick-reference section 6), typography stack hygiene
- **Routes**: /zh/* (all routes) (Chinese locale; Windows behaviour inferred, not tested on Windows)
- **Evidence**: win7-theme.css:297-300 zh stack is PingFang SC, Hiragino Sans GB, Noto Sans SC, system-ui. research-os.css:260-263 also lists Microsoft YaHei. On macOS the render is clean (uiux/type-colour/about-zh-light.png). On Windows, PingFang is absent, so Chinese relies on browser per-glyph fallback (inferred).
- **Impact**: Chinese may render with a different face on Windows than the research-os styles would give.
- **Recommendation**: Add 'Microsoft YaHei' to the win7 zh stack so the two sheets match, and check on Windows.
- **Likely files**: src/components/os/win7-theme.css:297-300, src/components/os/research-os.css:260-263
- **Verifier**: Source inconsistency confirmed: win7-theme.css:297-300 sets .win7:lang(zh) --win7-font to PingFang SC, Hiragino Sans GB, Noto Sans SC, system-ui (no Microsoft YaHei), while research-os.css:258-264 sets .os-shell:lang(zh) --os-font-ui and --os-font-display including Microsoft YaHei. They set different custom properties, so whether the Windows render differs depends on which variable the shell uses. The Windows impact is inferred and was not tested. Low severity.

## 4. Strengths to keep

- Visible keyboard focus on controls: a 2px black or white ring with dotted outline on window controls, the dock, desktop app tiles and CTAs (lens-a11y-visual/focus.mjs output, computed outline and box-shadow).
- No horizontal overflow at 390px or 1440px on any route tested, and no visible text below 12px detected (shot.mjs diagnostics across routes).
- Taskbar, tray, top bar and the Start-menu search panel read clearly in both Aero light and Aero Night (crops uiux/a11y-visual/crops/tb-dark/tb-dark-0.png, crops/tb-light/tb-light-0.png, search-dark.png, search-light.png). The probe's low-contrast flags on the taskbar and clock were detection artifacts, dismissed on visual check.
- Document structure is sound: lang=en, a skip link on every route, named landmarks (Select Language, Workspace Navigation, Portfolio Applications), a labelled search input and select, a meaningful alt on the portrait, and no unnamed buttons or links found in the DOM audit.
- Wallpaper labels 'Experiments', 'Security & Responsible Disclosure' and 'Hall of Fame' pass the visual probe in both themes, and so do the lab code body (15.5:1) and most body copy.
- Win7 chrome is applied consistently across every reading route tested (projects, project detail, about, resume, contact, write-ups, lab, lab/001, security policy, hall of fame): frame, title bar, Back / Copy Link toolbar, window controls and taskbar pinned apps all match the desktop icons. Evidence: /private/tmp/claude-501/-Users-raoof-r12-Desktop-Raouf-Portfolio/959c3f5d-f236-4ea5-920d-ca6c77526e77/scratchpad/audit/uiux/style-consistency/r01-_en_projects.png through r10-_en_hall-of-fame.png.
- No emoji glyphs in any non-test .tsx, .ts or .css source (scanned with a Unicode range check). Icons come from lucide-react across 24 component files. Legacy HUDFrame, Card, GlowCard, NeonButton and ProjectCard are not imported by any route.
- The 404 is a Win7-style error dialog (red error icon, Win7 buttons, native select, language links) and is consistent with the OS vocabulary. Evidence: r11-_en_does-not-exist.png.
- Light theme is coherent: every window body is white and the intro, Atlas, explorer and reading windows share the same surfaces. Evidence: light-desktop.png.
- RTL is handled well. The Persian and Arabic routes mirror the taskbar, window controls, explorer and icon labels, and render Vazirmatn/Arabic type with Persian/Arabic digits and calendar in the tray clock. Evidence: rtl-fa-about.png and rtl-ar-projects.png.
- Phone width (390px) keeps the Win7 frame and taskbar intact, with touch-sized window controls and no horizontal overflow on the routes tested. Evidence: phone-desktop.png, phone-about.png, phone-projects.png.
- Across 14 desktop routes at 1440px, 3 phone routes and 2 RTL routes, the screenshot tool reported no horizontal page overflow, no sub-12px text and no unexpected console errors (the only error was the expected 404 resource response).
- Empty state (Hall of Fame 'No Entries Yet') uses an icon tile and short copy in the same vocabulary as the rest of the site. Evidence: r10-_en_hall-of-fame.png.
- Enter flow feedback is strong: on tap the orb is disabled with aria-busy, a status line takes focus, the user tile is made inert, and a dot loader runs for 3s before the desktop mounts (src/components/os/WelcomeEnter.tsx; lens-touch/sticky-enter.mjs timeline shows disabled and busy from 80ms through 2.6s).
- On a 390px phone every measured control meets 44x44: tray Search, Lock and theme switch, window Back and Copy Link, title-bar buttons, dock pins, language menu items (44px, hit-testable open), Explore My Work and View Resume PDF links, and the Proof Atlas option buttons (uiux/touch-interaction/_-390_.json).
- Copy Link gives clear success feedback: a 'Link copied' role=status toast appears within about 100ms and persists about 3.5s (uiux/touch-interaction/copy-feedback-390.png).
- Viewport meta is 'width=device-width, initial-scale=1' with no user-scalable=no or maximum-scale, so pinch zoom is allowed.
- No horizontal page overflow at 390 or 768 (overflowX 0), and reading windows clear the taskbar at scroll end (uiux/touch-interaction/scroll-end-390.png).
- Touch-friendly structure: touch-action:manipulation is used to remove tap delay, Proof Atlas tabs use touch-action:pan-y so horizontal swipes do not fight page scroll, and the dock strip scrolls horizontally on swipe (verified at 390 and 768).
- Press feedback exists for dock pins, .os-control, .os-button and the Enter orb: a shared 0.98 scale on :active (controls.css:126-160), verified with pointer press (lens-touch/press-mouse.mjs).
- The search panel places its input above the taskbar within thumb reach, and its scope chips are at least 44px (uiux/touch-interaction/search-390.png).
- Skip-to-content link is the first tab stop on every page, shows a visible focus ring, and moves focus into the main region (verified on /en/projects: focus lands on section#main-content). Translated on /fa and /ar.
- Search dialog is a native modal: 12 of 12 Tab presses stayed inside it (search-open-tab.png). Ctrl+K and the Search button open it, the input receives focus, ArrowUp/Down move through results, and Escape closes it and returns focus to the trigger (h1 after Ctrl+K, the Search button after Enter). The result count is a polite status ('30 / 41 · Search results').
- Language menu: Enter opens the disclosure, Escape closes it and returns focus to its summary (verified), and the current locale carries aria-current.
- Escape inside the search input does not navigate away; the global Escape handler correctly excludes text fields.
- Focus indicators are visible on almost every tab stop checked (focus-visible true on logon, desktop, taskbar, tray, window controls, the search field and the language select). Taskbar and tray use a consistent 2px ring with 2px offset.
- Reduced motion: with prefers-reduced-motion set, zero animations are running at load, the global stylesheet collapses animation and transition durations, and ProofAtlas gates its motion on the media query.
- Landmarks and names are largely sound: banner, a single main per view with an h1, labelled navigation ('Workspace Navigation', 'Portfolio Applications', 'Select Language'), a complementary sidebar on /en/projects, and a role=switch 'Dark Appearance' that exposes its checked state. Search has aria-keyshortcuts.
- Proof Atlas research map: toggle buttons expose aria-pressed, and selecting one updates a polite live region with the new description (verified after Enter on 'Invisible Window').
- Focus return works for Lock (focus goes to 'Explore the Lab') and for closing a reading window (focus goes to the home h1 and the URL returns to /).
- Locale markup is correct on /fa and /ar (html lang and dir set; skip link translated).
- 404 page has a single h1 'Page not found', plain links to Return Home and Browse Projects, and no console errors other than the expected 404 resource response.
- Contact page: the external links (GitHub, LinkedIn, ORCID) carry '(opens in a new tab)' in their accessible names, and the email link is a plain mailto.
- SCOPE NOTE (not a strength): the /en/contact page has no form on the live site (no input, textarea or submit button). It offers an 'Open Email Draft' mailto link and social links, so the 'secure contact form' in the brief does not exist and was not tested. Tests were Chromium only; no VoiceOver or NVDA speech was run, so screen-reader findings rest on the browser accessibility tree (inferred for speech output).
- Lab LCP medians are under 2.5 s on every route tested (n=3 per route, desktop and mobile): / 1664 ms desktop and 1360 ms mobile; /about 1564 ms and 1424 ms; /projects/project-simurgh 2052 ms and 2104 ms. One cold mobile run on / hit 8.1 s and is treated as an outlier.
- Layout is stable on mobile at 390px: CLS 0 to 0.0001 on every mobile route run, and the logon-to-desktop transition is 0.010 CLS on desktop and 0.046 on mobile (top bar actions), both well under 0.1.
- No long tasks of 50 ms or more during the logon and /about loads in the desktop runs; one 50 ms task on mobile project page in one of three runs.
- Interaction proxy: dock clicks produced event durations of 40 to 64 ms in lens-performance/inp.mjs, under the 200 ms good threshold (headless, so treat as indicative).
- Fonts are self-hosted through next/font: the only preloaded font file is one 40 KB JetBrains Mono woff2, Vazirmatn is loaded only for fa and ar with preload disabled (src/app/[locale]/layout.tsx:27-38), and no third-party font requests were seen.
- Caching for hashed build output is correct: /_next/static/* is public, max-age=31536000, immutable, and the logon portrait and about photo are preloaded or sized with width and height where it matters.
- Heavy desktop components are split: ProofAtlas (src/components/os/Desktop.tsx:14) and the evidence stories (src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx:37-51) use next/dynamic.
- Third-party load is minimal: only the Cloudflare Web Analytics beacon and the Cloudflare email-decode script are external, and the CSP restricts script sources to self plus the beacon origin (out/_headers).
- backdrop-filter on the title bars and dock did not change scroll frame timing in an A/B test (scroll.mjs with and without the blur, 4x CPU throttle, two pairs). No evidence that the blur is a jank source in this environment; GPU cost was not measured because headless rendering is software-only.
- No horizontal page overflow at any tested size: 320x640, 390x844, 640x360 and 720x450 (200%-zoom equivalents), 768x1024, 844x390, 1024x768, 1280x720, 1440x900 and 1920x1080, on the desktop and on every reading route tested (about, contact, resume, lab, lab/001, projects, projects detail, write-ups, security-policy, hall-of-fame, 404). Data in uiux/layout-responsive/data/ and shot.mjs runs.
- Viewport meta is 'width=device-width, initial-scale=1' with no maximum-scale or user-scalable=no on the live site, so pinch zoom and 200% zoom remain available (curl of raoufabedini.dev/about).
- Floating reading windows respect the taskbar: at 1024x768 the Projects window ends at y=630 above the taskbar top at 716 (WorkspaceBounds reserves TASKBAR_RESERVE and FOOTER_RESERVE in window-geometry.ts).
- Reading pages clear the fixed taskbar at the end of scroll on phones (desktop padding is taskbar height + 16px in win7-desktop.css; nested.mjs at 390x844 shows the last text 47 to 120px above the taskbar).
- The phone reflow is systematic: at 320 and 390 the windows go full width with no radius, the intro CTAs stack, the logon centres in portrait and landscape (uiux/layout-responsive/logon-320.png, logon-844x390.png), and the 404 dialog wraps its language links cleanly (404-320.png).
- The search panel reflows well: at 320 and 390 the scope chips wrap above the results and the field sits above the taskbar; at 1024 and above it becomes two columns with a scope rail and keyboard hints (search-320.png, search-1024.png, search-844x390.png).
- The projects explorer is a clean two-pane layout on desktop: at 1440 and 1280 the detail column keeps a readable measure of about 75 characters, with action buttons on one row (uiux/layout-responsive/s/routes/proj-detail-1440.png).
- Taskbar touch targets are 44px at phone widths and the tray keeps 44px controls (win7-taskbar.css phone rules), and the taskbar never pushes pins under the tray because the strip is its own scroll port.
- The Atlas window at 1920x1080 is 600px wide with 18px diagram labels, and the page has no overlap between the intro window and the icon column at 1024 and above (uiux/layout-responsive/w1920.png, l1024.png).
- 404 pages return HTTP 404 (verified for /en/no-such-page and /fa/no-such-page) and show a clear 'Page not found' message with a plain-language description that says why the page may be missing.
- 404 recovery is explicit: 'Return Home' and 'Browse Projects' are real links to the correct locale (/fa and /fa/projects on the Persian page), the page sets lang and dir (rtl for fa), and the layout keeps the same actions at 390 px.
- Search empty state explains the cause ('No results found. Try another term or choose a different category.'), echoes the query, offers 'Clear Search', and the count ('0 · Search results') is in a role=status region.
- Search keyboard handling is sound: Ctrl/Cmd+K opens and focuses the input, ArrowDown moves from the field into results, Enter on zero results is a no-op, Escape closes the dialog without closing the window beneath it, and the footer lists the keys.
- Copy Link writes the correct address (verified clipboard values: https://raoufabedini.dev/contact and https://raoufabedini.dev/about), shows 'Link copied' in a role=status region, clears the message after about 3.5 s, and has a message for the clipboard-denied case.
- The live contact page shows the email address as selectable text beside the mailto button, with a note that the email app opens and the visitor reviews the message there. The expectation is set before the click, and there are no dead-end form states on the live page.
- SecureContactForm's logic (dormant) trims input before validation, checks email shape, caps lengths, and falls back to showing the address if the draft cannot open. Its error copy is localised in all five locales (for example 'Please complete all fields.' and 'Could not open your email app. You can email me directly at the address below.').
- Reduced motion is a real, complete guard: with prefers-reduced-motion set, the live site ran zero CSS animations and zero window or search transitions (nm vs rm runs: rm-log.json, rm-run2.json). Window minimise, logon hand-off, theme flip and search all become instant. Layered guards in globals.css:103, win7-theme.css:401, win7-desktop.css:654, workspace-windows.css:352 and welcome-enter.css:153 all agree.
- No layout-property animation: a scan of every transition and @keyframes in src (CSS and TSX) found zero animated width, height, top, left, margin, padding or inset properties. The window, dock and logon motion is transform and opacity only, as the rule requires.
- Durations sit in the rule's range: press 90 ms, control 180 ms, window open 180 ms, Start menu fade 120 ms, theme flip 250 ms, all well under the 400 ms ceiling.
- Easing follows the entering/exiting convention: entering uses cubic-bezier(0.2,0.8,0.2,1) (verified computed on .os-window), exiting uses cubic-bezier(0.4,0,1,1), and no linear UI easing is used on windows.
- Idle desktop has no infinite animations (nm-log.json idleDesktop empty after the logon hand-off), so the desktop is calm at rest.
- Spatial continuity is designed in: windows open from the pressed dock item's x-origin (spotlight.ts sets --dock-origin-x), and minimise drops toward the taskbar with translateY(24px) scale(0.6). Restoring a minimised window animates back in with os-win7-window-open (verified by restore.mjs).
- Logon hand-off is robust: WelcomeEnter waits on the fade's animation promise, with a capped fallback, before mounting the desktop, so the logon never pops out early (timeline in nm-log.json: leave at 2893 ms, arrive at 3100 ms).
- Animation teardown is coordinated, not timer-guessed: WorkspaceWindows listens for animationend and only uses a fallback timer (LEAVE_MS + 60) when the animation never reports, and it guards against a frame reused for another window.
- Ambient artwork is well behaved: ProjectMotion.tsx plays only when the stage is visible, the app is active, the user has not paused, and reduced motion is off, and it exposes pause, play and restart controls (WCAG 2.2.2 style).
- Press feedback is immediate: the dock item shows :active within 60 ms, and control presses use a 90 ms press-in (controls.css), which meets the 100 ms feedback guideline.
- Concept is distinctive and executed with discipline. The first window on the Win7 desktop states name, role, a one-line value statement, and two clear CTAs (Explore My Work, View Resume PDF) within the first screen at 1440px (uiux/first-impression-design/desk-desktop.png).
- Desktop icons carry two-line subtitles ('Projects / Selected engineering', 'Research / Papers and writing') and the taskbar pins use the same names in English, so the metaphor is easy to read.
- Project detail hierarchy is clear: filled primary CTA 'Download Paper', outlined secondary CTAs, tag chips, and a short summary (uiux/first-impression-design/desk_en_projects_project-simurgh.png).
- RTL mirroring is thorough. Taskbar order, desktop icon column, window controls, Explorer sidebar, and Back icons all flip in /fa and /ar. The Arabic Back arrow is transformed with matrix(-1,0,0,1,0,0) (uiux/first-impression-design/desk-fa.png, desk-ar.png, desk-ar-projects.png, desk-fa-projects.png).
- Persian chrome is localised down to the clock: Persian digits and the Jalali date (24 Mehr 1405) appear in the fa taskbar (desk-fa.png).
- Chrome strings are translated in all five locales: logon label, loader ('Opening the research desk' and equivalents), tray labels, and the 404 dialog. No untranslated UI chrome was seen; proper nouns stay in Latin.
- Microcopy builds trust. 'Architecture schematic based on documented components; no run trace is shown' and 'Opens your email app. You can review and send the message there' are honest and specific (desk-desktop.png, desk_en_contact.png).
- Phone search panel (Start-menu style) is well structured: filter chips, result count, typed results with category labels, and a focused input at the bottom (uiux/first-impression-design/phone-tap-resume.png).
- No horizontal overflow at 390px in any locale tested, and no console errors on the pages sampled apart from the expected 404 resource log.
- The 404 page stays on-metaphor as an error dialog with Return Home, Browse Projects, and language links (uiux/first-impression-design/desk_en_does-not-exist.png).
- Write-ups list has clear hierarchy: date and category metadata, linked title, summary, and read-more affordance, with a result count (desk_en_write-ups.png).
- Resume header puts availability, location, and visa status next to the Download Resume primary action, which is the right information for a recruiter (desk_en_resume.png).
- Light Aero desktop is polished, with consistent icon style and clear taskbar states (desk-desktop-light.png).
- Phone logon is a single clear focal point: photo, name, role, and orb (phone-logon.png).
- Direct deep links work across 19 routes: index pages, project slugs, write-up slugs, lab 001, and the fa/ar/zh/es locale variants. Each opens its matching window with the right title, dock aria-current and running state, and window Back target (probe4.mjs). Unknown routes return HTTP 404 with noindex.
- URL and window stay in sync. Dock and Explorer clicks update the URL, and browser Back and Forward re-open the correct window (probe2.mjs steps 1 to 3c).
- Escape closes a window to home, and Ctrl+K search has a working focus trap. Escape from search returns focus to the tray Search button (probe2.mjs step 5, probe18.mjs).
- Search groups results by kind (Projects, Papers, Writing, Experiments). Enter opens the top result, PDF results open in a new tab, and the empty state offers a Clear Search action (probe3.mjs, probe14.mjs).
- The language switcher keeps the exact path, the open window, the theme and the minimised state. The RTL Back arrow flips correctly in fa and ar (probe5.mjs, probe16.mjs, probe20.mjs).
- Recruiter reach is short. Projects is one click from the landing ('Explore My Work' or the dock). A project is two clicks. Papers are about three clicks (Research, then the 'Papers' jump link, then the PDF or DOI). The resume PDF is one click on the intro and opens in a new tab.
- All six hosted PDFs (five papers and the resume) return 200 as application/pdf. All five DOIs and the Zenodo record resolve 200 (curl).
- The Explorer sidebar lists all 13 projects with an index link, search and a category filter. Its selected state (aria-current) matches the open dossier.
- Dock state is accurate: aria-current=page on the active app, is-running on open apps, and a minimised dot. Dock targets are 44x44 on phones (probe11.mjs).
- The hero h1 is inert and aria-hidden while a window is open, so screen readers get a single main heading (probe6.mjs).
- No horizontal page overflow at 390px (scrollWidth 390). The write-ups page exposes in-page jump links ('Writing 7', 'Papers 5').
- The 404 page has clear recovery: Return Home, Browse Projects, and five language links.
- Light mode is clean on every measured route: no failing text on About, Projects, project detail or Contact. The lowest prose is about 5.4:1 and links about 5.6:1 on white (measure/*-light.json).
- Dark reading prose is strong: #000 text on the white reading panes is about 21:1 by arithmetic, and the navy desktop labels measure 7:1 or more (measure/desk-en-dark.json).
- Persian and Arabic in Vazirmatn render cleanly in RTL reading windows (uiux/type-colour/about-fa-dark.png, about-ar-light.png). Glyph joining is correct, the clock uses Arabic-Indic and Persian digits, and the Persian line-height of 1.95 suits reading. Neither has horizontal overflow.
- Chinese is set in PingFang SC with a line-height of 1.80 and about 39 CJK characters per line, which suits the script (uiux/type-colour/about-zh-light.png).
- Prose rhythm is good: 16px body with line-height 1.60 in English, about 61 characters per line on About at 1440px, and about 43 at 390px, inside the mobile guidance of 35-60.
- The token architecture is sound in principle: one .win7 token set in win7-theme.css with light, Aero Night, reduced-transparency and forced-colours guards. Segoe UI is never named, and :lang(fa), :lang(ar) and :lang(zh) overrides switch the font stack per locale.
- The Latin stack resolves to the same computed family on WebKit and Chromium (ui-sans-serif, system-ui, -apple-system, Helvetica Neue, Arial) with no overflow, so Safari on macOS should match the measured layout (uiux/type-colour/about-en-light-webkit.png).
- Phone width at 390px has no failing text on /en, /en/about or /en/projects in either theme, and no horizontal page overflow.
- The taskbar language menu is white with black text when open (about 21:1 in both themes). Its closed-state links are not painted, so they are not a visual defect.
- Heading hierarchy is clear: 32px H1, 28px project title, 16px body and 13px window chrome, with weight doing most of the work.
- Tooling caveat, verified: the top-bar clock passes at about 5.4:1 or more in both themes. The shot.mjs lowContrast flag (1.08:1) is an approximation artefact and should not be reported as a defect.

## 5. Prioritised fix plan

**Quick wins (under an hour each, CSS tokens):**

1. Aero Night explorer tokens: footer text and Contact CTA, search field and placeholder, category select (and its Arabic chevron overlap), sidebar index header, active evidence item. Covers A11Y-V-01, A11Y-V-02, SC-01, SC-03, F2, F3, F4, TC-02, TC-03.
2. Lab code panel in Aero Night: header, line numbers and code text to at least 4.5:1 (A11Y-V-03).
3. Active taskbar label in Aero Night (TC-01).
4. Desktop icon sub-labels on the light wallpaper: stronger shadow or slightly larger and bolder text (A11Y-V-05, TC-05).
5. Search input at 16px on touch to stop iOS zoom, with a visible or programmatic label (TI-04, FB-02).
6. Stop the stray theme-switch ring on the logon at 390 px (TI-09) and add a (hover: hover) guard to hover styles (TI-07).

**Medium (a few hours):**

1. Phone and tablet taskbar: keep all pins reachable (fewer pins, an overflow menu or a scroll cue), make sure taps cannot land on the tray, wider gaps and 44 px targets at 768 px (F1, nav-phone-dock-clipped, TI-01, TI-02, TI-06, LR-03, LR-07, A11Y-V-07).
2. Focus management: move focus into a window when it opens, restore it after a language switch, keep it after Ctrl/Cmd+K closes, and stop Escape from leaving the page when focus is in content (a11y-focus-lost-on-window-open, nav-focus-route-change, FB-01, a11y-escape-navigates-home).
3. Logon: let Enter or a second press skip the 3 s wait, shorten it under reduced motion, add a visible "Sign in" label to the orb, and do not force the gate on every home visit (ANIM-01, F5, F6, P-02, a11y-loader-fixed-delay-reduced-motion).
4. Window title-bar controls on touch: spacing and size (TI-05); title truncation tooltips or wrapping (SC-06, LR-05, F10).
5. Proof Atlas legibility: labels at 12 px or more, keep them on phones, keep the option row above the taskbar (LR-01, LR-02, LR-04, F8).
6. Explorer on phones: show the selected project before the index (F7, LR-06); a breadcrumb that names the open project (nav-breadcrumb-static).
7. Contact: primary CTA 44 px tall on phones (TI-03), a copy-address fallback (FB-04), and decide whether to mount or delete the orphaned SecureContactForm (FB-03, F14, FB-07 to FB-12).

**Larger (a day or more):**

1. Performance: code-split the desktop shell from reading routes, trim unused render-blocking CSS, right-size the About photo and logon portrait, drop unused hero video from `public/`, hashed names and immutable caching for media (P-01, P-03 to P-08).
2. Aero Night consistency: decide whether reading bodies stay white (current rule) or go dark everywhere, and make Proof Atlas match (SC-02, TC-04, F11).
3. Motion polish: theme cross-fade that actually runs, Start-menu exit fade, exits faster than entries, uniform maximise/restore, 30 to 50 ms stagger (ANIM-02 to ANIM-11).
4. Naming and IA consistency across dock, window titles, document titles and footer; consistent PDF targets; 404 inside the desktop shell (F9, nav-naming-drift, nav-pdf-target, nav-404-no-shell, FB-13).

## 6. Not covered and limitations

- **Input shortfall.** The brief stated 107 confirmed findings, but only 48 complete records were supplied, and the list stops in the middle of TC-03. The strengths list is also truncated, so the style-consistency strengths are incomplete. The 59 missing records cannot be assessed. Re-run the writer with the full list before treating this as final.
- **Unresolved measurement conflict.** Logon LCP is 164 to 212 ms in the verifier's three runs, but the performance strength cites a 1664 ms desktop median for `/`. Re-measure before relying on either figure.
- **Verifier corrections applied.** Where the original record conflicted with the verifier, the verifier's version is used: C-2 (code glyphs about 1.1:1, not 15.5:1), TI-01 (no Lock hit on a visible Contact icon), TI-09 (hit-area extension not effective), LR-01 (only 640x360 covers CTAs), P-03 (LCP magnitude), and L-8.
- **No real devices.** No iPhone, Android or iPad hardware. The iOS zoom behaviour in M-7 is inferred from known Safari behaviour.
- **No screen reader.** Speech output was not tested with VoiceOver or NVDA. Findings rest on the browser accessibility tree; speech effects are inferred.
- **No field data.** All performance figures are lab results from headless runs (three per route). No CrUX or real-user data. Headless GPU cost was not measured.
- **Contact form not present.** The brief describes a secure contact form, but the live `/en/contact` page has no input, textarea or submit button. It offers a mailto CTA and social links. Form behaviour, validation and error feedback were not tested, so the Forms and feedback score has low confidence.
- **Animation coverage thin.** The animation lens produced one rejected finding and the logon loader. The animation score has low confidence.
- **Charts coverage thin.** The only chart-like element is the Proof Atlas schematic. There are no data charts to audit.
- **RTL coverage partial.** Markup on `/fa` and `/ar` was checked, and the footer and search defects were reproduced on `/ar/projects`. No full RTL layout audit of windows, dock or Atlas was run.
- **Light theme under-tested on phones and tablets.** Dark theme was checked more thoroughly at 390 and 768 px.
- **Some checks not run.** A 640x360 Tab walk for focus obscured by the taskbar was not run (LR-01). Escape inside the search input was not re-run by the verifier for H-2 and M-3. The Papers search result pattern was not re-tested (L-6). The hover-stickiness check at 4 s gave inconsistent results (L-7).
- **Unconfirmed observation.** A separate "All Projects" breadcrumb on detail routes is white on white (noted under H-4). It was not confirmed as a finding.
- **Limits of the contrast method.** Ratios use computed colours and pixel sampling against the composited background. Text shadows are not counted, as WCAG requires. The shot.mjs low-contrast detector missed H-3, so its results were not used alone.
- **Pro Max rules not re-queried.** The report writer did not run the Pro Max database search. Rule names are as cited by the auditors.

---

## 7. Appendix: rejected findings (9)

- **A11Y-V-04** (Accessibility (visual)): Desktop <main> is aria-hidden while its window controls stay focusable. Verifier: Not reproduced. The desktop main (WorkspaceWindows.tsx around line 675) carries both inert and aria-hidden when a window is open, so its controls are not focusable. Tab walk: 40 and then 120 presses on /en/projects, zero stops inside the aria-hidden subtree. Programmatic focus() on its first button failed (focused:false). The earlier 'tabbable' count came from a tabIndex check that ignores inert. The aria-hidden plus inert pattern is intentional and works; no defect.
- **A11Y-V-06** (Accessibility (visual)): Every route has two <main> landmarks and two <h1>s. Verifier: DOM fact is true (two main tags and two h1 elements, the desktop one inside aria-hidden). The stated user impact is not reproduced: the accessibility tree on /en/projects exposes one main (getByRole main = 1) and one h1 (heading level 1 = ['Projects']). The desktop intro heading and landmark are removed from AT by aria-hidden and inert. At most this is low-priority DOM hygiene, not a screen-reader problem.
- **A11Y-V-08** (Accessibility (visual)): Proof Atlas SVG labels not reliably measured. Verifier: Contrast claim rejected. Probe read the wrong fill. Actual Proof Atlas SVG label fills: #000 on white in light (21:1) and #f1f7ff on rgb(13,27,46) in dark, both pass. A real but separate size point was found: the 15px labels are scaled by the SVG (viewBox 552 wide, rendered 361px, scale 0.61), so they render at about 9.2px on a 1440px desktop. Reframe as a low-priority small-text issue, not a contrast failure.
- **SC-08** (Style consistency): Desktop footer links are web text on the wallpaper, not Win7 chrome. Verifier: Rejected as a defect. The desktop footer links are deliberately styled as Win7 wallpaper labels: win7-desktop.css:436-466 sets white text, a transparent 1px border that becomes a translucent selected box on hover and focus, and a dotted focus outline, with a comment stating the shortcut row's links are white text with the same translucent box on hover and focus. The finding's claim that they have no Win7 link treatment is factually wrong. The rendered text-on-wallpaper look matches the desktop icon labels (uiux/style-consistency/desktop-dark-live.png). Any remaining objection is a matter of taste, not an audit defect.
- **TI-08** (Touch and interaction): Window title-bar controls have no pressed-state feedback. Verifier: Rejected. Title-bar buttons do match :active and do change transform on press: Minimise measures matches(':active') true and transform matrix(0.98) during mouse-down at both 390 and 768, returning to none on release. Background is unchanged, but the shared press rule is scale, which this control does get. The original probe most likely targeted a hidden duplicate (its first '.os-window-actions button' match had a null bounding box). Evidence: probe3.json (press-phone390, press-tab768).
- **a11y-atlas-diagram-alt-text** (Accessibility (keyboard and semantics)): Proof Atlas schematic alt text lists node labels, not the flow. Verifier: Rejected. The claim that the alt text does not say the order or the four boundaries is false. The SVG has aria-labelledby giving the accessible name 'Where the evidence connects', and its <desc> is exposed as the accessible description: 'The agent crosses the input firewall, context-provenance guard, tool-invocation gate, and output-leakage firewall. Each boundary branches to its own signed evidence receipt.' That states the order and the four boundaries. Only the short name is minimal, which is a matter of taste rather than a defect. Verified with Accessibility.getFullAXTree (ax-desc.mjs). Not verified with a real screen reader.
- **P-09** (Performance): HTML is served with cf-cache-status DYNAMIC and TTFB median about 0.7 s from this network. Verifier: Not reproduced. cf-cache-status DYNAMIC on /about is real (curl, cf-ray ends SYD). But TTFB measured in browser over 4 fresh contexts each was 48 to 55 ms on / and 48 to 128 ms on /about, and curl TTFB was 60 to 88 ms. The 0.7 s median (SJC edge) does not hold on the current SYD edge. Without the 0.7 s figure there is no demonstrated harm, so this finding is rejected as written.
- **LR-08** (Layout and responsive): At 768 wide the topbar status line is covered by the intro window. Verifier: Stated mechanism not reproduced. The line 'Open an app to explore my work.' is the .os-section-label in the app column (Desktop.tsx ~312), not a topbar status line. At 1024x768, 1280x720 and 820x1180 it is visible at top-left (y 25 to 45) and not covered by the intro window (intro starts at x=586 at 1024). At 768x1024 the line sits at y=1021-1040, i.e. below the first screen, which is why t768.png shows no line. A narrower real defect is that the decorative line falls below the fold on tablet portrait, which is folded into LR-09. Rule z-index-management does not fit the reproduced behaviour.
- **ANIM-12** (Animation): An infinite dandelion loop ran once while several windows were open. Verifier: Not reproduced as stated. After opening Projects, About, Contact and Resume, no infinite animation was running. dn-spin runs only on /en/projects/gitswitch while visible. project-artwork.ts lazy-imports DandelionSpinner for the gitswitch slug, so the 'only referenced from a test mock and CSS' mount-path claim is wrong. artwork-pause.ts pauses it off-screen, and reduced motion removes it. The loop is by design on the case-study page, not an open-window issue.
