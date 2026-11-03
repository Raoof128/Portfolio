# Historical-reference reconciliation

Reviewed against current baseline `2b6d048c42c7feb7ef82e38f5ca519603d40afc6` on branch `work`.

## What was actually read

All five requested documents were read in their entirety: UIUX audit 1,350 lines; source baseline 252; design system 625; implementation 548; verification 293 (3,068 lines total). Large padded baseline table rows were whitespace-normalized for reading; overflowing tool results were reread in smaller spans. Exact hashes are in `frontend-historical-coverage.json`.

## Which authority still applies

- `UIUX_AUDIT_2026-10-16.md` describes deployed `58d9bd6`, then appends a 17 October Resolution log. It contains exactly **107 finding records**, plus nine rejected observations. Its severity labels and measurements belong to that deployment. Several IDs duplicate the same root defect. The final limitation claiming only 48/107 input records were supplied is stale writer history, contradicted by the rebuilt file's 107 complete records; it does not establish missing current input.
- `FRONTEND_BASELINE_AUDIT.md` is **source-only** on `redesign/apple-2026`, covering 91 files/237 issues. Its plans to replace palettes, remove artwork, retire the mail form and redesign the shell are not authorisation to do so now. Many named files, source line numbers, component call sites and current-code premises changed. Its useful requirements are honest metrics, correct semantics, measured boundaries, matching visual/DOM order and preserved research evidence.
- `RESEARCHOS_DESIGN_SYSTEM_2026.md` has three superseding eras: Quiet Depth, Intelligence Glow, then **section 10 Windows 7 Aero**. Section 10 supersedes Apple capsule geometry, serif-first chrome, single-accent artwork restrictions and non-Aero material directions. It explicitly retains white reading bodies in Aero Night, scoped 7.css only and CSS wallpaper. The current user instruction also permits legally available Segoe UI in a system stack; the older ban on naming Segoe is superseded by that explicit brief. No bundled proprietary font or Windows/Microsoft trademark asset is justified.
- `research-os-implementation.md` and `research-os-verification.md` preserve exact historical build 6/8/9/10 evidence; they repeatedly prohibit relabelling old screenshots. Build 6/8 native matrices, historical Safari/Firefox results, 468-test counts and zero-advisory integration statements do not validate today's changed source or registry. Current acceptance requires fresh commands and export identity.
- Single route-backed reading window is intentional. Native Next history, modeless window controls, direct readable SSR, static export, five languages, original PDFs/artwork and honest mail-draft handoff remain architectural contracts.
- Physical devices, real assistive speech, native mobile keyboard/autofill and field p75 CWV remain separate evidence requirements. Historical lab LCP measurements conflict across environments; neither old fast nor old slow samples establish current performance.

## 107-record disposition ledger

These labels distinguish documentary claims from current verification. **No historical-only row is an independently verified pass.** Root's source/browser/contrast ledgers may append exact current evidence. No stale issue is automatically reopened solely because it once existed.

| ID | Disposition | Finding |
| --- | --- | --- |
| A11Y-V-01 | Reported fixed historically; current independent check required | Explorer footer unreadable in Aero Night on project pages |
| A11Y-V-03 | Reported fixed historically; current independent check required | Lab code-panel header and line numbers at 1.74:1 in dark mode |
| SC-01 | Reported fixed historically; current independent check required | Projects explorer footer is near-invisible in Aero Night |
| a11y-focus-lost-on-window-open | Reported fixed historically; current independent check required | Keyboard focus does not move into a window when it opens |
| A11Y-V-02 | Reported fixed historically; current independent check required | Projects search field and category select: text 1.21:1, placeholder 1.60:1 in dark mode |
| F1 | Reported fixed historically; current independent check required | Phone taskbar: tapping pinned Contact locks the desktop; Resume opens Search |
| F2 | Reported fixed historically; current independent check required | Dark theme: Explorer footer text is black or grey on navy; Contact CTA nearly invisible |
| F3 | Reported fixed historically; current independent check required | Dark theme: Explorer category select and search placeholder unreadable; Arabic chevron overlaps label |
| F4 | Reported fixed historically; current independent check required | Dark theme: active 'Boundary explanations' item has black text on navy |
| nav-phone-dock-clipped | Reported fixed historically; current independent check required | Phone and tablet taskbar clips the Resume and Contact pins |
| SC-03 | Reported fixed historically; current independent check required | Explorer search and category select are navy in dark theme; other routes keep white fields |
| TC-01 | Reported fixed historically; current independent check required | Active taskbar label is white on a light steel highlight in Aero Night |
| TC-02 | Reported fixed historically; current independent check required | Project-detail sidebar index header renders black on navy |
| TC-03 | Reported fixed historically; current independent check required | Dark explorer search placeholder and category select are near-invisible |
| a11y-escape-navigates-home | Reported fixed historically; current independent check required | Escape closes the active window and navigates home even when focus is on page content |
| A11Y-V-05 | Unresolved verification state | Desktop icon sub-labels at 12px white on light Aero wallpaper, about 3.8:1 |
| A11Y-V-07 | Reported fixed historically; current independent check required | Phone-width taskbar is icon-only with no visible labels |
| ANIM-01 | Reported fixed historically; current independent check required | Logon Enter forces a fixed 3 s wait that cannot be skipped or cancelled |
| F5 | Reported fixed historically; current independent check required | Logon orb has no visible label; the only cue is a bare arrow |
| F6 | Reported fixed historically; current independent check required | Logon gate repeats on every home visit with a forced wait of about 3 seconds and no skip |
| F7 | Reported fixed historically; current independent check required | Phone Explorer: project index fills the first screen and the work starts below the fold |
| F8 | Reported fixed historically; current independent check required | Atlas diagram labels render at about 9px |
| F9 | Deferred/current candidate requiring scoped measurement | Same destinations carry different names across chrome and content |
| FB-01 | Reported fixed historically; current independent check required | Search dialog returns focus to BODY when opened with Ctrl/Cmd+K from an unfocused page |
| LR-01 | Deferred/current candidate requiring scoped measurement | Desktop intro and Proof Atlas windows ignore the viewport: on short or zoomed screens the Atlas sits below the fold and covers the intro CTAs |
| LR-03 | Reported fixed historically; current independent check required | Taskbar pin strip overflows with no visible scroll cue: at 320 to 768 wide only one or two apps are visible, and Resume and Contact are cut or hidden |
| LR-04 | Reported fixed historically; current independent check required | Proof Atlas diagram labels are about 8px at 1280x720 and removed entirely on phones, so the schematic loses its node names |
| nav-focus-route-change | Reported fixed historically; current independent check required | Focus does not move into a window after it opens, and is lost to BODY after a language switch |
| nav-window-back-vs-history | Deferred/current candidate requiring scoped measurement | Window Back is a parent link, so browser Back does not undo it |
| P-01 | Reported fixed historically; current independent check required | Desktop reading routes shift the window shell during load (CLS 0.043 on /about, 0.024 on project pages) |
| P-04 | Reported fixed historically; current independent check required | About-page photo is a 270 KB 1200 px JPEG shown at 240x300, and it is preloaded at high priority |
| P-05 | Deferred/current candidate requiring scoped measurement | Every route ships the full desktop shell JS eagerly: about 620 KB raw (about 193 KB gzip) on the logon, roughly half not executed |
| P-06 | Deferred/current candidate requiring scoped measurement | Render-blocking CSS is 270 KB raw on the logon route, about 75% unused on load |
| SC-02 | Reported fixed historically; current independent check required | Proof Atlas is the only dark window body in Aero Night; sibling windows stay white |
| SC-04 | Unresolved verification state | Two radius systems sit side by side on the same window bodies |
| TI-01 | Reported fixed historically; current independent check required | Pinned Resume and Contact dock apps sit under the tray on phone and tablet |
| TI-02 | Reported fixed historically; current independent check required | Tablet width (768) falls back to desktop-size touch targets |
| TI-03 | Reported fixed historically; current independent check required | Primary Contact CTA 'Open Email Draft' is 24px tall on phone |
| TI-04 | Reported fixed historically; current independent check required | Search input is 13px and 26px tall; focusing it on iOS will zoom the page |
| TI-05 | Reported fixed historically; current independent check required | Window title-bar controls: 0px gap on phone, 2px on tablet, Close adjacent to Maximise |
| TI-06 | Reported fixed historically; current independent check required | Phone dock: 4px gaps between 44px pins and icon-only labels |
| a11y-404-duplicate-language-control | Unresolved verification state | 404 page exposes the language switcher twice under the same name |
| a11y-duplicate-window-control-names | Reported fixed historically; current independent check required | Window control buttons use bare names and are duplicated on the home desktop |
| a11y-loader-fixed-delay-reduced-motion | Reported fixed historically; current independent check required | Logon loader holds for a fixed 3 seconds, unaffected by reduced motion, and Enter is ignored meanwhile |
| a11y-search-result-names-verbose | Partial historical repair; fresh reproduction needed | Search result link names run kind, title and full description together |
| a11y-thin-focus-ring-primary-cta | Reported fixed historically; current independent check required | Primary 'Explore My Work' focus ring is a 1px dotted outline |
| a11y-titlebar-button-tab-stop | Unresolved verification state | Reading-window title bar is a tab stop that only refocuses the window |
| ANIM-02 | Unresolved verification state | Theme-switch colour cross-fade never runs: data-theme-switching is styled but never set |
| ANIM-03 | Unresolved verification state | Start-menu (search dialog) closes with no exit animation while it opens with a fade |
| ANIM-04 | Unresolved verification state | Maximise and restore FLIP applies a non-uniform scale to the whole window |
| ANIM-05 | Deferred/current candidate requiring scoped measurement | Hand-off from logon to desktop shows one main-thread stall at the crossfade end |
| ANIM-06 | Reported fixed historically; current independent check required | Exit durations equal enter durations for windows and logon |
| ANIM-07 | Reported fixed historically; current independent check required | Language switch changes the page with no transition and a route wait of about 570 ms |
| ANIM-08 | Deferred/current candidate requiring scoped measurement | First activation of a route takes 48-423 ms before a window appears (press feedback is immediate) |
| ANIM-09 | Reported fixed historically; current independent check required | Framer-motion components would bypass the CSS reduced-motion guard if mounted |
| ANIM-10 | Unresolved verification state | Stale and contradictory motion comments |
| ANIM-11 | Reported fixed historically; current independent check required | Row stagger is 16 ms, below the 30-50 ms guideline |
| F10 | Partial historical repair; fresh reproduction needed | Window titles truncate with no full-title affordance |
| F11 | Retained by documented product/policy decision | Dark theme only partly applied: reading windows keep white bodies |
| F12 | Unresolved verification state | Tray 'Lock' and 'Window Controls' labels are unclear and sit next to frequent controls |
| F13 | Deferred/current candidate requiring scoped measurement | Hall of Fame shows an empty state from a main desktop link |
| F14 | Historical premise disproved by current source | Contact page has no form, while the audit brief describes a secure contact form |
| F15 | Retained by documented product/policy decision | Lab index leads with a keylogger proof of concept (editorial judgement) |
| F16 | Retained by documented product/policy decision | Hero does not show availability; the Resume does |
| FB-02 | Unresolved verification state | Search input has only a placeholder as its label, and the placeholder disappears once text is typed |
| FB-03 | Historical premise disproved by current source | The live /en/contact page has no contact form; SecureContactForm is orphaned code |
| FB-04 | Historical premise disproved by current source | Mail-client handoff has no fallback copy action for the address |
| FB-05 | Unresolved verification state | Copy Link failure message does not show the address to copy |
| FB-06 | Unresolved verification state | Copy Link success toast appears far from the button that triggered it |
| FB-07 | Unresolved verification state | Latent: native required and type=email constraint validation hides the component's custom error copy |
| FB-08 | Unresolved verification state | Latent: validation errors are not associated with their fields and move no focus |
| FB-09 | Unresolved verification state | Latent: success state reports 'Email draft opened' even though the page cannot know a mail client handled the mailto |
| FB-10 | Unresolved verification state | Latent: the form status line is not a live region, so state changes are silent to screen readers |
| FB-11 | Unresolved verification state | Latent: the typing state uses error red, a warning icon and a red top bar for neutral input |
| FB-12 | Unresolved verification state | Latent: no required markers, helper text or visible character limits on the form fields |
| FB-13 | Unresolved verification state | 404 page offers two language controls that repeat the same choices |
| LR-02 | Deferred/current candidate requiring scoped measurement | At 1024x768 and 390x844 the Proof Atlas option row is cut by the taskbar on first paint and its description and link sit below the fold |
| LR-05 | Partial historical repair; fresh reproduction needed | Window titles truncate on desktop widths 1024 to 1440, and the intro title truncates at 320 |
| LR-06 | Unresolved verification state | Projects explorer sidebar is a nested scroll region capped at 40dvh, showing about two and a half rows on phones and short screens |
| LR-07 | Reported fixed historically; current independent check required | Between 480px and 700px the pinned app labels collapse to a single letter with ellipses |
| LR-09 | Unresolved verification state | On tablet portrait the first screen shows only windows; the desktop app icons sit below the fold |
| nav-404-no-shell | Deferred/current candidate requiring scoped measurement | The 404 page drops the desktop shell, so the taskbar and search disappear |
| nav-breadcrumb-static | Unresolved verification state | Explorer breadcrumb is decorative and never names the open project |
| nav-contact-no-form | Historical premise disproved by current source | Contact is a mailto-only page; the 'secure contact form' is not mounted |
| nav-lock-resets | Unresolved verification state | Lock returns to home and drops the open window |
| nav-naming-drift | Deferred/current candidate requiring scoped measurement | The same destination has different names on the dock, window, document title and footer |
| nav-pdf-target | Historical premise disproved by current source | PDF links open in the same tab on project pages and the resume page, but in a new tab elsewhere |
| nav-restore-chip | Unresolved verification state | A closed desktop window is restored only through a small bottom chip |
| nav-single-window | Retained by documented product/policy decision | Opening another app closes the current window and its state, with no way to keep two open |
| nav-start-orb | Unresolved verification state | The Start orb is a home link labelled 'Desktop', not a Start menu |
| nav-trailing-slash-chain | Unresolved verification state | Trailing-slash URLs take two redirect hops |
| P-02 | Reported fixed historically; current independent check required | Logon sign-in waits a fixed 3 s with no reduced-motion bypass |
| P-03 | Reported fixed historically; current independent check required | Logon portrait is a 118 KB file for an 84 px slot and is the LCP element on the first screen |
| P-07 | Reported fixed historically; current independent check required | About 11.5 MB of unused hero video and posters ship in public/ on every build |
| P-08 | Reported fixed historically; current independent check required | Replaceable images and video are cached for 4 h without hashed names or immutable caching |
| SC-05 | Reported fixed historically; current independent check required | Pastel glow gradient hairlines and hover rims survive in the Win7 layer |
| SC-06 | Partial historical repair; fresh reproduction needed | Proof Atlas title bar truncates at the default desktop width |
| SC-07 | Reported fixed historically; current independent check required | Atlas uses a text arrow glyph while the rest of the OS uses Lucide icons |
| SC-09 | Retained by documented product/policy decision | Two contact addresses appear across pages |
| TI-07 | Deferred/current candidate requiring scoped measurement | Hover styles stick after a tap (no (hover: hover) guard) |
| TI-09 | Reported fixed historically; current independent check required | Theme switch thumb renders as a stray ring outside the track on the logon screen at 390 |
| TC-04 | Retained by documented product/policy decision | Aero Night is only half dark: explorer list and reading bodies stay pure white |
| TC-05 | Reported fixed historically; current independent check required | Desktop icon sub-labels are white 12px text on mid-blue in light mode |
| TC-06 | Deferred/current candidate requiring scoped measurement | Raw colour and duplicated tokens undercut the 'define once' token layer |
| TC-07 | Reported fixed historically; current independent check required | Project-detail prose runs about 81 characters per line |
| TC-08 | Deferred/current candidate requiring scoped measurement | Type scale is off-grid and phone window chrome sits at 12-13px |
| TC-09 | Unresolved verification state | CJK font stacks differ between the two sheets |

## Concrete current source checks from this lane

The route lane read all 42 original owned source/test files and the new lab test, not only these documents. It confirms that Contact mounts the existing form and copy-address recovery; résumé/project paper target attributes are explicit; code is LTR with focusable scrolling; all metadata detail routes use export-safe static params; qualification remains expected November 2026 rather than claiming an earned degree. The legacy Navbar/LanguageSwitcher menu issues are dormant because no application route imports Navbar.

The new ROUTE-01 correction excludes decorative lab line numbers from accessible reading. Five locale regressions failed before the change and pass after it. This is not one of the historical 107 findings.

## Binary asset inspection

`frontend-public-assets.json` inventories 24 public files with sizes/hashes, image dimensions, PDF metadata and source reference matches. Six PDF covers were actually rendered and viewed; the résumé's extracted text was examined. The two current WebP portraits and OG card were actually viewed. This does not certify every page of each research PDF or independently validate research outcomes.

- Current welcome WebP: 168×168, 4,840 bytes, visibly clean at its small slot; current About WebP: 600×750, 26,336 bytes, correct portrait aspect and quality. Both have source alt handling. Original 1200×1200 JPG/PNG remain fallbacks and JSON-LD identity imagery.
- OG card: 1200×630, 161,455 bytes, readable name, technical focus, site and ORCID. It retains the older technical/cyan social-card identity rather than a desktop screenshot; this is share metadata, not mounted chrome.
- Résumé: two-page tagged PDF, 112,307 bytes, correct author/name/contact and current containment-attestation summary, no PDF JavaScript, no encryption. Tagging does not certify correct reading order. Dense print text is readable when zoomed; the HTML résumé remains available.
- Five paper PDFs: 6/13/12/5/8 pages (Banking Shield/Invisible Window/Simurgh/voting supplement/Aion), selectable text, no JavaScript or encryption, **untagged**. This is a PDF accessibility limitation; preserve the original scholarly artifacts and accessible HTML summaries. Do not claim WCAG conformance for the PDFs.
- The 12-page Simurgh v1.0 original paper is explicitly titled privacy-preserving device integrity proofs. Newer containment-attestation claims in the résumé/dossier are not automatically proven by that older PDF; preserve chronology and resource descriptions rather than replacing the paper silently.
- Seven SVG files were fully read: two original monograms have accessible titles and no active script; five scaffold SVGs have no source imports. Historical lens map has no active URL import. Removal is unnecessary for this audit and no original assets were deleted.

External URL resolution and actual deployed PDF responses are owned by root's network/browser validation. Local file presence and metadata are not HTTP success evidence.
