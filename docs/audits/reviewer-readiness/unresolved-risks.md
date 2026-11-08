# Unresolved risks, owner decisions and verification gaps

Ordered by impact on a serious reviewer.

## Engineering

| Priority | Item | Evidence | Recommended next step |
| --- | --- | --- | --- |
| P2 performance | Mobile lab LCP is 2.99 s on `/projects` and 3.44 s on Simurgh (390×844, 4× CPU, 1.6 Mbps, 150 ms; median of 3). Desktop unthrottled is 0.74–0.99 s; CLS is 0 | The content paints at FCP (~1.0–1.1 s). LCP moves later because hydration **remounts the window**: the server title (`SPAN`, 2,420 px² painted) is replaced by a new client node (6,030 px²). Switching the client element type was tested and rejected (no change) | Keep the server-rendered window node through hydration (window-handover change in `ResearchOS.tsx`/`WorkspaceWindows.tsx`). This is an architectural change, not attempted in this pass. No field (p75) data exists |
| P3 | Desktop renders a second, hidden and inert Desktop tree after workspace registration | RR-L1-04; seen live as two `.os-desktop` nodes, one hidden | Render one Desktop per state |
| P3 | 1024px first window overlaps the icon column by 4px (LTR and mirrored RTL) | Measured; icon column 268px versus a 240px fallback before icons mount | Breakpoint-aware `--win7-icon-column-edge` |
| P3 | fa/ar standalone 404 uses Tahoma/system font (Vazirmatn not loaded there) | Measured computed font | Load Vazirmatn in `global-not-found` |
| P3 | Persian/Arabic dock labels clip about 2px of glyph box at 1280×720 | scrollHeight 19 vs clientHeight 17; visually legible at 2× | Locale-specific line height for dock labels |
| P3 | Mail draft body is unbounded (long Persian messages produce about 12k-character `mailto:` URLs) | RR-L2-01, RR-L5-F12 | Cap length with a visible counter, or offer copy-to-clipboard over a size threshold |
| P3 | 73 of 160 meta descriptions exceed about 160 characters (home pages up to 486) | Export crawl | Shorter, page-specific descriptions (owner copy) |
| P3 | Duplicated route→app mapping, three clipboard helpers, effect dependency nits | RR-L1-05/07/08/09/18 | Small refactors with tests |
| P3 | `clsx`, `tailwind-merge` now unused dependencies | After RR-F06 | Remove in a lockfile-reviewed change |
| Tooling | Browser suites do not run in CI; a missing Cloudflare token silently skips deploy | RR-L5-F01, F-17 | Add a Pages-preview Playwright job; fail the deploy job when the token is absent |
| Tooling | 8 moderate dev-tool advisories (down from 16 on 4 Nov); runtime 0 | `npm audit` | Track upstream; high-severity gate passes |

## Owner decisions (content and policy)

| Item | Why it needs the owner |
| --- | --- |
| Nexus Archive year: résumé page shows 2025, project data shows 2026 | Neither the repository nor the supplied résumé PDF settles it |
| Mehr Guard "Source Code" points to `Raoof128.github.io` (the demo's site repo) | Could not be verified from this environment (GitHub API 403) |
| Limitations sections exist for 4 of 13 projects | Writing the other nine would mean inventing scope statements |
| Metrics without repository evidence (70+ repos, Airtasker figures, 30% triage) | Need a source or qualification |
| Lab 001 publishes a working Windows keyboard-hook logger as "educational" | Publication policy decision |
| Security policy promises 48–72 h response and 7–30 day resolution | Capacity commitment |
| Metadata keyword "Anthropic" | Can imply affiliation; keep or drop |
| Five original research PDFs are untagged (résumé is tagged) | Author-side tagging; originals must stay byte-identical |

## Verification gaps (not run, never reported as passed)

- Firefox and WebKit: not installed, and installing is forbidden in this environment.
- Screen-reader speech, physical phones and tablets, software keyboards, OS-level 200%/400% zoom and orientation changes on real devices.
- Field Core Web Vitals (no RUM data). Lab numbers come from one Linux container.
- Production: `raoufabedini.dev` still serves `38842e2`. **None of these changes is deployed.**
