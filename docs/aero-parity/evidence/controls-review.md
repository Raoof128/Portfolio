# Controls and Explorer implementation notes

Baseline: b4cc49de662b3013a97d5497f3fd8daed0df1a20. Before browser captures use the existing exported build Dfv1QQLfhv_4WAY_tllxC, not a post-change export.

## Complete source inspection

Read all of controls.css, project-explorer.css, win7-explorer.css, win7-pages.css, ProjectExplorer.tsx and ProjectExplorer.test.tsx. Read all ProjectDetailClient.tsx before changing its tab container. Relevant canonical sources: installed 7.css0.21.1 button, searchbox, textbox, dropdown, menu, listview, treeview, tabs and groupbox CSS; readable source-map button and tabs SCSS. Relevant integration/cascade reviewed: ResearchOS imports, win7-theme variables and touch/focus guards, all win7-polish.css, supporting-apps search/topic rules and button markup.

## Reproduced differences and correction

- Resource action links: computed baseline40px high,16px weight500, transparent/flat primary faces and16px horizontalpadding. Shared controls adapter now reproduces canonical --w7-el-* gradient/border/shadow and pseudo-element hover/pressed paint; native link semantics preserved. Native7.css does not style ordinary anchors, so this small adapter is necessary. Native buttons without actionclasses still use official selectors. Duplicated reading-page and social-link face rules removed. Reduced-motion pulse suppression retained. Removed generic scale(.98) pressed treatment to keep Aero geometry stable.
- Explorer search: computed baseline26px wrapper,1px#767676border, insetblack8%, Lucide leadingicon,186px transparentinput with no border. Native search now draws its own canonical24px inset field and source14px trailingmagnifier; decorative Lucide removed. Label/input IDs and filtering unchanged. Explicit26px endpadding reserves iconspace; RTL moves magnifier toleft. Dottedfocus+blueinset is an accessibility extension because upstreamsearch removes outline.
- Category dropdown: baseline flatwhite face26.14px high, copiedSVGarrow and collapsedhover/pressedstates (navyNight). Deleted custombackground/image/state rules; native7.css supplies separate rest/hover/pressed/focus/disabled, canonicalarrow and3px/30px padding. Retain24px minimum,44pxcoarse,logicalRTLarrow edge, fontlocalisation and fluidwidth.
- Dossier tabs: divrole=tablist never matched canonical menu[role=tablist]. Change to menu, adjust keyboardevent elementtype. Remove custom30px,14pxhorizontalpadding,roundedcorners,heavyselectedtype andNightfaces; official selectors now own geometry/paint. Only sticky/wrapping layout,24px/44pxtargetfloor andRTLmargin mapping extend source. Panel joins tabs rather than24pxgap; research content untouched.
- Explorer chips: asymmetric2px/12pxradius became3px. No canonicaltagcomponent is claimed; retained portfolio metadata and readabletheme pairs.
- Explorer innerframe: removed duplicate4pxglasspadding/border/radius/shadow inside the existing canonicalwindow. Outerwindow owns frame; Explorer remains applicationbody with commandbar/navigation/content keyline.
- Removed dead disabledgradient-rim pseudo-element block, oldfield/tab tokens and unusedfooteractionedge tokens.

## Verification so far

- Before screenshot and computedmetrics: /tmp/aero-controls/before-projects-light.png, before-tabs-light.png, before-resources-light.png, before-computed.json.
- Before fullinput/selectstates: before-states-computed.json, generated from probe.cjs;2themes×2nativefields×5states plus2tabkeyboardrecords. Captures use isolatedbrowsercontexts, reducedmotion and1440x900. Synthetic disabledstate verifies native styling; productionfilters are not disabled by these changes.
- Existing ProjectExplorer and ProjectDetailClient tests:37pass/2files afterchanges. ESLint and tsc --noEmit pass. No new tests merely mirroringHTMLtag.
- Token guard first pass failed afterduplicateface cleanup changedliteralcounts and introducedcontrolsrawliterals. Replaced controlscolours withtheme tokens supplied byroot. Root is reconciling onlylowered legacycounts; no guard weakened. pagesentry should reachzero andbe removed.
- Chromium launch inrestrictedprocesssandboxfailed crashpadsetsockopt; authorisedescalatedlocalbrowser works. Initial4398preview absent; rootrestartedWranglerbeforebaselinecaptures.

## First integrated candidate browser result

The rebuilt candidate was inspected on port 4398 in Chromium 155 with reduced motion. Twenty native search/select state records (default, hover, focus, pressed, disabled, in both themes) plus two tab-keyboard records completed without page errors. Canonical search now computes to 24px high, 12px type, source inset shadows, transparent 1px border, 2px radius and the source 14px trailing magnifier. Canonical select computes to 24px high, 12px type, source gradient, source arrow, 1px #8e8f8f border, 3px radius and 2px 30px 2px 3px padding. Theme does not replace these native control faces.

Visual inspection: candidate-projects-light.png, candidate-tabs-light.png and candidate-resources-dark.png. Resource actions now use the shared 24px reference face; tabs use source geometry; the second Explorer glass frame and asymmetric chip radii are gone.

A separate five-locale 320×568 coarse-pointer check opened the Explorer disclosure and searched Simurgh; all five produced two matching projects with zero horizontal overflow, 44px search/select targets and 16px field type. The five localised Write-ups routes also had zero overflow and 44px/16px fields. Persian candidate-mobile-fa.png was visually inspected: RTL arrow/icon placement, mixed Latin query and reading layout were intact. Full data: candidate-mobile.json.

Current final source/build-wide acceptance remains root's responsibility; these lane notes do not substitute for the final canonical image-diff and cross-engine regression cohorts.
