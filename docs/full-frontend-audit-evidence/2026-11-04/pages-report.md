# PAGES full-source audit — 4 November 2026

All **27 assigned files / 4,184 initial source lines** were read in full, not just the previous upgrade diff. Exact initial and final hashes, read spans and per-file review notes are in `pages-review.json`. The assigned initial hashes match the reads. Twenty-five unchanged files retain their original complete-read coverage only after hash equality; both modified files were read in full again after the fix.

## Confirmed finding and correction

**PAGES-01 · P2 · Dossier direct fragments reveal their panel without accepting requested focus.** The component already schedules focus after opening the correct tab, but `#methods`, `#methods-heading` and `#research-papers` had no explicit `tabindex`. A fresh native Chromium probe against the existing export confirmed all three targets visible with focus left on `BODY`; `#limitations-heading` served as the working control. See `pages-hash-focus-baseline.json`.

Added `tabIndex={-1}` only to the three existing section fragment targets, the Methods heading and paper-library target in `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`. This makes direct fragment focus work without adding sequential tab stops. All content, evidence sources, locale copy, Aero styling, routes and static fallback links remain intact.

Added five locale regressions in `ProjectDetailClient.test.tsx`. Each exercises actual `hashchange`, verifies visible target/panel and requested focus across five fragment targets. All five tests failed before the correction; the original failures remain in `pages-fragment-red.txt`.

No additional substantive owned source defect was confirmed. Review covered route metadata/static generation/404s, real links and email handoffs, content/heading/list semantics, tab navigation, fragment state, no-JavaScript content fallback, translated and original-language research text, and RTL identifiers. Form internals, shared CSS/reflow, markdown rendering and underlying research wording are coordinated with their owning lanes rather than edited here.

## Executed verification

| Check | Result | Evidence |
| --- | --- | --- |
| New fragment regression before fix | Expected red: 5 failures, 14 unrelated cases skipped | `pages-fragment-red.txt` |
| Full dossier test file after fix | 19 / 19 pass | `pages-fragment-green.txt` |
| All five owned page test files | 59 / 59 pass | `pages-tests.txt` |
| ESLint across all 27 assigned paths | Exit 0; no warnings/errors | `pages-lint.txt` |
| Changed-file whitespace check | Exit 0 | `git diff --check` |
| Native Chromium baseline diagnostics | Three unfocusable fragments reproduced; working limitations target confirmed | `pages-hash-focus-baseline.json` |

The baseline preview reports commit `2057c9b6d427c8b16544494abb90ed6f4ee2c5d2`, built `2026-11-04T00:56:40.512Z`. Native diagnostics used 1440×900 and reduced motion. These are four focused navigations, not a new route-wide browser certification. The parent owns the new integrated build and final compiled-browser verification. No new build, full browser sweep, dependency/config changes, root logs, commit, push or deployment were performed in this lane. Native screen-reader speech and physical-device behaviour are not established by the source/unit checks.

## Complete assigned-file ledger

| Path | Read lines | Disposition |
| --- | ---: | --- |
| `src/app/[locale]/about/AboutClient.test.tsx` | 1–65 | Reviewed; final hash identical |
| `src/app/[locale]/about/AboutClient.tsx` | 1–425 | Reviewed; final hash identical |
| `src/app/[locale]/about/page.tsx` | 1–89 | Reviewed; final hash identical |
| `src/app/[locale]/contact/ContactClient.tsx` | 1–105 | Reviewed; final hash identical |
| `src/app/[locale]/contact/page.tsx` | 1–56 | Reviewed; final hash identical |
| `src/app/[locale]/hall-of-fame/HallOfFameClient.tsx` | 1–86 | Reviewed; final hash identical |
| `src/app/[locale]/hall-of-fame/page.tsx` | 1–53 | Reviewed; final hash identical |
| `src/app/[locale]/lab/LabClient.tsx` | 1–97 | Reviewed; final hash identical |
| `src/app/[locale]/lab/[id]/LabDetailClient.test.tsx` | 1–41 | Reviewed; final hash identical |
| `src/app/[locale]/lab/[id]/LabDetailClient.tsx` | 1–120 | Reviewed; final hash identical |
| `src/app/[locale]/lab/[id]/page.tsx` | 1–153 | Reviewed; final hash identical |
| `src/app/[locale]/lab/page.tsx` | 1–65 | Reviewed; final hash identical |
| `src/app/[locale]/projects/[slug]/ProjectDetailClient.test.tsx` | 1–279 | PAGES-01 fixed; full final reread |
| `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx` | 1–628 | PAGES-01 fixed; full final reread |
| `src/app/[locale]/projects/[slug]/page.tsx` | 1–213 | Reviewed; final hash identical |
| `src/app/[locale]/projects/layout.tsx` | 1–50 | Reviewed; final hash identical |
| `src/app/[locale]/projects/page.tsx` | 1–18 | Reviewed; final hash identical |
| `src/app/[locale]/resume/ResumeClient.test.tsx` | 1–143 | Reviewed; final hash identical |
| `src/app/[locale]/resume/ResumeClient.tsx` | 1–451 | Reviewed; final hash identical |
| `src/app/[locale]/resume/page.tsx` | 1–53 | Reviewed; final hash identical |
| `src/app/[locale]/security-policy/SecurityPolicyClient.tsx` | 1–181 | Reviewed; final hash identical |
| `src/app/[locale]/security-policy/page.tsx` | 1–53 | Reviewed; final hash identical |
| `src/app/[locale]/write-ups/WriteUpsClient.test.tsx` | 1–209 | Reviewed; final hash identical |
| `src/app/[locale]/write-ups/WriteUpsClient.tsx` | 1–248 | Reviewed; final hash identical |
| `src/app/[locale]/write-ups/[slug]/WriteupDetailClient.tsx` | 1–63 | Reviewed; final hash identical |
| `src/app/[locale]/write-ups/[slug]/page.tsx` | 1–166 | Reviewed; final hash identical |
| `src/app/[locale]/write-ups/page.tsx` | 1–74 | Reviewed; final hash identical |


Subsequent source reconciliation with the two uploaded PDFs and the current Simurgh software-header correction are documented in `pages-reconciliation-report.md` / `pages-simurgh-header-report.md` and their exact read/hash ledgers. The parent `pages-review.json` final hashes now cover these five changed page files; earlier test entries retain their original phase identities.


The compiled follow-up found a fragment-focus timing race beyond the initial tabindex correction. Its native evidence, focused fix, early-frame red/green regression and two browser-fixture corrections are recorded in `pages-focus-commit-report.md` and `pages-focus-commit-review.json`. Current final source hashes in `pages-review.json` include that correction.
