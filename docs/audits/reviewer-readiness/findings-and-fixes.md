# Findings and fixes

Severity: P0 critical, P1 high, P2 medium, P3 low. "Reproduced" means Opus re-observed it in source or a real browser, not only through a worker's report. Worker IDs map to the lane records under `artifacts/reviewer-readiness/tasks/` (local, ignored).

## Fixed

| ID | Sev | Location | Route | Reproduction → root cause | Fix and tests | Commit |
| --- | --- | --- | --- | --- | --- | --- |
| RR-F01 | **P1** | `src/components/os/ResearchOS.tsx` ~984 | all window routes on short screens | A cold load of `/projects` at 320×568 ended at scrollY 6,556–7,180 (3,326 at 640×360), with the heading off-screen. A traced probe found one `scrollIntoView` on the pressed dock pin, which scrolls the page because the taskbar is in normal flow on short screens | The strip scrolls by a physical delta only. Test-first: a new unit test and 4 Playwright cases failed before and pass after | `7c43d0a`, `1351966` |
| RR-F02 | **P1** content | `src/i18n/locales/*.ts` about.bio_3 | About/home, 5 locales | Bios said Microsoft **and Apple** called the behaviour "by design". The preprint records Apple as "consistent with documented functionality; not a security issue" | Corrected in all five locales, reusing the wording from the translated write-ups | `4f225d4` |
| RR-F03 | P2 content | es/fa/ar locales | home/projects | KotlinConf: English says "Submitted"; es/fa/ar said "presented at" | Aligned to "submitted to" | `4f225d4` |
| RR-F04 | P2 content | `src/lib/data.ts` ~908, ~925 + 4 locales | `/projects/aion` | "eliminates redundant LLM costs", "zero LLM cost" | Qualified to the mechanism: no new call for an identical repeated query | `4f225d4` |
| RR-F05 | P3 content | dossier-copy, lab 003, es/fa/ar/zh copy | several | "OpenAI capture" was ambiguous on a screen-capture site; lab 003 objective claimed code not present; Persian typos; missing spaces before figures/DOIs; Spanish note added claims absent from English | Corrected (no English write-up bodies touched, so translation hashes stay valid) | `4f225d4` |
| RR-F06 | P2 maintainability | `src/components/layout/*`, 6 `ui/*`, `lib/utils.ts`, CSS, `os-copy.ts` | none (dead) | Import graph: only their own tests imported them (retired neon design layer, old Navbar/Footer) | Removed 17 files, about 213 dead CSS/copy lines, 9 copy keys (`tsc` proves no readers remain) | `67c2048` |
| RR-F07 | P2 tooling | `scripts/lib/static-security.mjs` | export audit | The redirect audit passed loops and self-redirects | Literal non-200 chain detection, test-first | `fbb74c4` |
| RR-F08 | P2 tooling | `scripts/audit-agents.mjs` | export audit | hreflang "reciprocity" checked codes only, not URLs | Pure helper validates every alternate URL; all 160 pages pass | `fbb74c4` |
| RR-F09 | P2 tooling | `package.json` | — | Three tooling test files ran under no script | `test:tooling` (17/17) | `fbb74c4` |
| RR-F10 | P3 copy | `src/components/os/Desktop.tsx` | desktop | "Offensive security 1 · Defensive security 4" read like ranks | "Offensive security (1) · …" | `7c43d0a` |
| RR-F11 | P3 exposure | `public/*.svg` | `/next.svg`, `/vercel.svg`, … | Five create-next-app boilerplate SVGs, unreferenced but publicly served and allow-listed | Removed with their allow-list entries | final commit |
| RR-F12 | P3 test | `full-audit.spec.ts` | `/` | Coarse-pointer test predated the lock screen (pre-existing failure on `38842e2`) | Fixed in the round-3 pass | `769cb00` |
| RR-F13 | Feature (owner request, 9 Nov) | `WorkspaceWindows.tsx`, `ResearchOS.tsx`, `reading-window.css` | every window | Windows could only maximise inside the desktop work area (taskbar and footer row stayed) | Toolbar **Full Screen** command using the Fullscreen API; Escape exits and keeps the window open; geometry restored exactly; five languages; hidden where unsupported. 3 unit and 2 Chromium tests | `53e45bb` |
| RR-F14 | P3 a11y | `Desktop.tsx` | desktop | Two landmarks were both named "Portfolio Applications" | App grid named by its visible hint | `53e45bb` |
| RR-F15 | P3 | `win7-taskbar.css` | fa/ar | Dock labels clipped about 2px of Vazirmatn's glyph box | Taller leading for fa/ar labels | `53e45bb` |
| RR-F16 | P3 | `package.json` | — | `clsx`, `tailwind-merge` unused after RR-F06 | Removed (lockfile −25 lines) | `53e45bb` |

## Verified as not defects

| Claim | Disposition |
| --- | --- |
| Skip link unlocks the lock screen without the 3 s wait (RR-L1-02) | Deliberate WCAG 2.4.1 bypass, pinned by a named regression test; consistent with the owner decision |
| Lock state returns on Back/Forward (RR-L1-01) | Main reviewer flow re-verified in a real browser: Back/Forward keep the desktop. Only lock-from-detail → Back → Forward shows it (P3) |
| Simurgh citation uses the wrong DOI (RR-L4-F02) | The cited paper itself prints DOI `10.5281/zenodo.20374849`; the software DOI is a different object |
| Alignerr/Anthropic evaluation claim unsupported (RR-L4-F05) | Present in the owner-supplied résumé PDF (Jan–Mar 2026) |
| "100%" About stat unsourced (RR-L2-03) | Labelled "Evasion in Tested Lab Configurations" |
| Dock overflows the viewport (RR-B1) | Measured: the dock fits the viewport at every width and locale |
| Many sub-24px targets (RR-B1) | Real WCAG 2.5.8 spacing test: only the 16px resize grip fails, and the Move and Resize panel provides the equivalent control (exception). 0 failures on phones |
| Broken internal links (Opus file crawl) | Over Pages HTTP, all 190 unique internal hrefs return 200 |

## Recorded, not changed

See [unresolved-risks.md](unresolved-risks.md) for owner decisions, verification gaps and the P2 LCP diagnosis.
