# Full frontend audit and source reconciliation — 4 November 2026

The local candidate is ready for repository review within the tested Chromium/Linux scope. The audit corrected the confirmed frontend defects, reconciled the supplied résumé/profile across all five languages, and produced a phone-free downloadable résumé. The taskbar now has rounded corners and spans the usable screen width with safe-area gutters. No commit, push, merge or deployment was performed.

The supplied documents were treated as reference data. Their contents did not become operating instructions. Existing Aero styling, artwork, five locales, the one route-backed reading window, static export, thirteen project routes and five original research PDFs remain intact. The résumé replacement is the explicit user-authorised exception to preserving original PDF bytes.

## Candidate and scope

- Build: `7ZXmp772g5T8B_eREKvhm`; built `2026-11-04T02:03:27.478Z`; content revision `2026-11-04`.
- Base HEAD: `2057c9b6d427c8b16544494abb90ed6f4ee2c5d2`. This is a dirty working-tree candidate; the version endpoint's commit alone does not identify its exact bytes.
- Exact current source and export manifests: [build identity](full-frontend-audit-evidence/2026-11-04/build-identity.json), [source hashes](full-frontend-audit-evidence/2026-11-04/source-manifest.json), [all export hashes](full-frontend-audit-evidence/2026-11-04/export-manifest.json).
- Next generated 168 route entries; the export contains 1,072 files and 160 sitemap URLs. Inventory remains 13 projects, seven write-ups and three labs per locale.
- Node 24.22.1, Next 16.4.4, React 19.2.3, 7.css 0.21.1, Playwright 1.64.1 and Chromium 155.0.8059.79. Wrangler served the export locally with its actual headers and redirects.

The initial census contained 273 files: 259 manually reviewed text files spanning 57,933 lines, 13 binary assets, and a 9,803-line generated dependency lock verified structurally. The final census contains 278 files, including five added tests/helpers: 264 reviewed text files with a final extent of 60,736 lines, 13 binary assets and the generated lock. Within `src`, all 215 final text files are covered; the remaining source asset is the favicon. Third-party package implementation sources and generated chunks are outside the authored-source line census.

| Initial review lane | Files | Initial text lines | Reader |
|---|---:|---:|---|
| Shell/navigation/window lifecycle | 29 | 8,556 | review_changes |
| Styles/layout/painted contrast | 18 | 9,075 | responsive |
| Research interactions/diagrams | 38 | 10,611 | signature_motion |
| Shared UI/forms/library components | 36 | 6,518 | opening_tests |
| Route pages/dossier/resumé | 27 | 4,184 | baseline_review |
| Content/localisation/data | 31 | 9,215 | evidence |
| Root/configuration/assets/tooling | 94 | 19,577 including generated lock | root; 21 tooling files delegated to opening_tests |

The [coverage ledger](full-frontend-audit-evidence/2026-11-04/coverage-ledger.json) links every final hash to its actual review record and line spans. Initial current-source files were read completely in bounded chunks; every subsequent changed field, hunk or final source was reviewed. Unchanged portions carry credit from this audit's initial read only when byte identity supports it. Binary metadata, hashes and representative visual inspection are distinguished from text reads. Generated lock verification is not described as a full manual read. These records establish review coverage, not semantic infallibility.

An independent final reviewer also read 15 shell/pages/UI files in full (7,965 lines), reconstructed their exact audit baseline with SHA verification, and read the complete 1,358-line audit-only diff. Six focused suites passed 174 tests; no blocking regression was demonstrated. See the [peer review](full-frontend-audit-evidence/2026-11-04/final-peer-review.md).

## Corrected behavior

| Area | Confirmed correction |
|---|---|
| Rounded taskbar | 18px corner radius, full usable width and safe-area/8px gutters. At widths through 1023px, five labelled pins fill the first row and Start/tray use the second. At 1024–1279px, compact stacked labels fit a 52px bar. Wide fine-pointer desktops keep inline labels. Short screens place the bar after the document. Fixed both an 8px collapsed-margin tray overlap and the 1024px Contact cutoff. |
| Keyboard/navigation | Direct dossier fragments reveal and focus the requested section after the DOM commits. Corrected modified-link and IME handling, per-document reading offset reset, and retained-window handover toolbar measurement. |
| Appearance | Explicit preference survives locale remounts, cross-tab storage updates and blocked/write-denied storage. Portal controls inherit the active appearance. |
| Contact | Native no-JavaScript validation and mailto POST replace an unsafe default GET fallback; the submit remains visible while JS-only shell buttons stay hidden. A focused field stays visible after viewport shrink without stealing focus. |
| Contrast/short screens | Fixed Night caption glyph contrast, selected Zurvan ledger ink, coarse-pointer wallpaper-link hover, dim pending-language text, narrow Search overflow and zero-height short-screen results. Removed blanket body horizontal clipping and fixed the narrow home shortcut grid. |
| Async/UI library | Prevented stale terminal clipboard completions and unmount timers. Fixed unique disclosure/panel IDs, Escape/focus restoration and tab keyboard semantics in dormant Navbar/LanguageSwitcher/ProjectCard components as well as reviewing their live counterparts. |
| Audit tooling | Snapshot extension now preserves the old cohort and checks export/capture identity, uses exclusive writes and includes untracked source. The optional Go probe is bounded. Tooling fixtures are distinguished from native-browser proof. |

Per-lane reports and exact source references are retained beside the coverage ledger. Earlier failed browser/probe runs were preserved rather than converted into passing evidence. [Failure record](full-frontend-audit-evidence/2026-11-04/preserved-failed-runs.json) distinguishes genuine product defects from incorrect footer, same-document navigation and external-mail-handler fixture assumptions, plus the outdated Simurgh disclaimer guard.

## Updated facts and downloadable résumé

Both uploaded PDFs were read completely and compared with the rendered pages, dictionaries, project overlays, research diagrams, article translations, structured metadata and both machine-readable summaries. The [23-row reconciliation matrix](full-frontend-audit-evidence/2026-11-04/content-reconciliation-matrix.md) records sources and conflict resolutions.

The current profile foregrounds adversarial robustness, AI control and empirical safety evaluation. It states expected June 2027 graduation, the February–June 2027 online final session, December 2026 availability, the requested San Francisco placement and visa sponsorship, Alignerr January–March 2026, SyllabusSync cofounder since May 2026, and source-supported prior roles. Unsupported precise academic marks and stale immediate-availability/job claims were removed; valid unrelated projects and credentials were retained.

Current Simurgh copy reports the October 2026 matched-control study: 24 tasks, two trials, three controls and two models, yielding 288 replayed branches. Llama restricted-state new effects moved from 17/24 to 0/24 with 23/24 useful completions. The gpt-6-luna baseline was already 0/24, so no incremental protection was observed. State clustering, uncertainty, partly-by-construction differences, the separate role-placement failure/correction and the remaining refusal are explicit. The 39 Lean proofs, 5,171-test October 19 smoke and 92 releases are dated author-reported snapshots, not independently reproduced results.

Software DOI `10.5281/zenodo.21737792` is distinct from the earlier device-integrity preprint `10.5281/zenodo.20374849`. The original papers/citations remain available; earlier experiments and architecture are labelled as frozen earlier stages. SentinelSSH is supporting work with 17 typed read-only Linux tools; no unprovided repository or route was invented. Technical descriptions now correctly qualify public-key passkeys, expected O(1) lookup/cancellation, synthetic parsing benchmarks, Electron processes and kernel tracepoint compatibility. Machine-corpus write-ups preserve both publication and substantive update dates.

`public/Mohammad_Raouf_Abedini_Resume.pdf` is the new supplied two-page résumé with true content redaction of the phone number and adjacent separators. Its SHA256 is `e0a41eee56fe67d165619b73e42b0681a72c011044d5bb750046b002e1254827`. The uploaded original was not modified. Independent PyMuPDF/pdftotext/decoded-object checks found no phone content in text, metadata, XML, streams or link targets. All other substantive text remains; page two is pixel-identical, and the first page has zero changed pixels outside the authorised redaction area plus a one-point margin. [Redaction record](full-frontend-audit-evidence/2026-11-04/resume-redaction.json) · [Independent check](full-frontend-audit-evidence/2026-11-04/root-reconciliation-pdf-check.json) · [Phone-free page preview](full-frontend-audit-evidence/2026-11-04/resume-phone-free-page1.png).

All five original research PDFs are byte-identical to the audit baseline. No phone-bearing source extraction or original résumé raster was copied into this report's evidence directory.

## Final validation

| Gate | Result |
|---|---|
| Production build, lint and TypeScript | Pass; last browser-guard delta also linted separately |
| Vitest | 791/791 tests, 52 files |
| Node schema/HTTP/security/dependency/image/snapshot regressions | 46/46 |
| Static export, agent inventory and local HTTP audit | Pass; 1,072 files, 160 URLs, zero agent warnings |
| Chromium maintained suite | 62/62; 360 responsive observations, 160 route scans, two representative Day axe scans, 18 pane-resize and 32 taskbar observations |
| Native 200%/400% Chromium zoom | 16/16 observations across eight routes |
| Runtime dependency audit | Zero vulnerabilities |
| Full dependency audit, high threshold | Pass; 16 moderate tooling entries remain |
| Optional Go snippet execution | One skipped: compiler unavailable; not counted among passing gates |
| Text whitespace check | Pass; PDF binary checked separately |

The responsive matrix covers five locales × two themes × nine sizes × four representative routes. The taskbar matrix includes en/fa, fine/coarse pointer, eight sizes from 320px to 1920px, and 320×225 short viewports. Every pin/label fits its strip; tray controls remain contained without pin/control intersections. The separate 38-case source-injection diagnostic also included ar/zh/es at 1024px and is labelled as a diagnostic, not the compiled final gate. [Final browser summary and decoded observations](full-frontend-audit-evidence/2026-11-04/browser-summary.json).

The no-JavaScript mail test uses a real native click and read-only Chromium navigation observation. It proves empty-field validation, an encoded `formSubmissionPost` to the intended mailto recipient/subject/body and no HTTP draft submission. An external mail client is absent in headless Chromium, which may show its internal error page after handoff. Actual mail-client launch/delivery is unverified; this single CDP-specific oracle is explicitly skipped on other engines.

Native zoom uses a fresh temporary Chromium profile and the real `chrome://settings/appearance` Page zoom setting. At 200% and 400%, 1280×1024 outer dimensions stay fixed, DPR becomes 2/4, inner dimensions become 640×512/320×256 and visualViewport scale stays 1. Sixteen observations across eight routes pass horizontal containment and ordinary document-scroll checks. These probes do not inspect every end-of-document control at native zoom. CDP is used only to capture pixels after scrolling, because Playwright's clipped screenshot produced blank scrolled images; it does not set zoom or emulate a viewport. [Native geometry and method](full-frontend-audit-evidence/2026-11-04/native-zoom-final-build/geometry.json).

### Accessibility evidence boundaries

The final 160-route Night scan at 1440px reports zero automated violations and **160 incomplete color-contrast groups covering 7,046 node appearances**. Incomplete checks are unresolved, not passes. Two additional representative Day scans also report zero violations. The raw incomplete selectors/reasons remain in the decoded route observations. Neither this result nor the base-token tests certify WCAG conformance.

Manual paint sampling covers 240 text runs in four representative page/theme/size cases (minimum sampled ratio 5.567:1), plus 28 rounded-taskbar text runs including pending locale state (minimum 4.833:1). The compiled suite independently measures all four selected Zurvan ledger types in both themes. The sampling uses actual rendered foreground/background/opacity and glyph interiors, not base tokens alone. These samples do not clear every incomplete axe node or establish all-state/all-font conformance.

Firefox/WebKit executables were unavailable in this environment; this candidate's native browser run is Chromium only. Physical devices and software keyboards, assistive speech, native autofill, OS mail handlers, native-speaker review, a timed reviewer study and field p75 Web Vitals remain unverified. Five original research PDFs remain untagged; this audit preserved their bytes rather than certifying PDF accessibility. No universal WCAG, pixel-parity or “100% correct” claim is made.

### Fresh local measurements and visuals

These are one unthrottled localhost observation per scene before and after, not controlled repeated benchmarks or field measurements. No performance improvement is inferred. Phone LCP varies substantially in this sample; a field claim would need repeated controlled and real-user measurements.

| Scene | LCP before → after | CLS before → after |
|---|---:|---:|
| desktop 1440×900 | 444 → 460 ms | 0.000249 → 0.000286 |
| tablet 768×1024 | 300 → 348 ms | 0.000578 → 0.000664 |
| phone 390×844 | 268 → 1120 ms | 0.000000 → 0.000000 |
| RTL 1440×900 | 620 → 588 ms | 0.000916 → 0.001001 |

All four final captures have document width equal to viewport width and no captured page errors. [Before metrics](full-frontend-audit-evidence/2026-11-04/baseline/metrics.json) · [Final metrics](full-frontend-audit-evidence/2026-11-04/final/metrics.json). Fresh desktop/tablet/phone/RTL PNG pairs, taskbar LTR/RTL captures, short Search, selected-ledger paint and native-zoom/scrolled captures accompany the report. A fixed taskbar appears at the initial viewport position in a full-page screenshot; visitors can scroll the document behind it and reach the reserved end clearance.

## Reproduction

Serve the freshly built `out` with Wrangler at `http://127.0.0.1:4398`, using the repository's static headers/redirects. Commands and complete gate logs are saved in the evidence directory:

```sh
npm run build
npm run lint
npm run typecheck
npm run test:ci
node --test scripts/lib/schema-language-audit.test.mjs scripts/lib/production-audit.test.mjs scripts/lib/static-security.test.mjs scripts/lib/braces-guard.test.mjs scripts/browser-regressions/aero-parity/png-diff.test.mjs scripts/browser-regressions/aero-parity/snapshot-integrity.test.mjs
npm run audit:security
npm run audit:agents
npm run audit:production -- http://127.0.0.1:4398
PORTFOLIO_CHROMIUM_PATH=/usr/bin/chromium npx playwright test --project=chromium
node scripts/browser-regressions/native-zoom.mjs http://127.0.0.1:4398 work/native-zoom-new-cohort / /projects /projects/project-simurgh /resume /contact /fa/projects/project-simurgh /es/projects/project-simurgh /zh/projects/project-simurgh
npm audit --omit=dev --audit-level=high --fetch-retries=0 --fetch-timeout=20000
npm audit --audit-level=high --fetch-retries=0 --fetch-timeout=20000
git diff --check -- . ':(exclude)*.pdf'
```

Text whitespace checking excludes the PDF binary, whose required xref whitespace and compressed bytes are not source formatting errors. PDF correctness is checked separately. The first local HTTP audit invocation mistakenly used an unsupported `--origin=` flag; the documented positional invocation was rerun and passed. Failed fixture runs remain historical evidence and are not included in final pass counts.

## Governance postflight

The following entry was added verbatim to both `AGENT.md` and `CHANGELOG.md`:

```text
### Raouf: 2026-11-04 (Australia/Sydney) — Full frontend audit, updated profile and rounded taskbar

- **Scope**: Audit all authored frontend/source-support files line by line, correct confirmed defects, reconcile both supplied PDFs, provide the explicitly requested phone-free résumé, and round the taskbar across the usable screen width.
- **Summary**: Correct shell appearance/navigation/reading lifecycle, post-commit dossier fragment focus, Contact native fallback and viewport focus, clipboard races, selected-ledger/caption/phone chrome contrast, short Search and taskbar overlap/cutoff. Update five-language profile, education, roles, current positive/null Simurgh evidence and distinct software/preprint records; preserve Aero, artwork, five research PDFs, routes and static export. Strengthen snapshot identity/preservation checks and maintained browser regressions.
- **Files Changed**: Application/components/styles, five locale dictionaries and project/article data, machine summaries, canonical phone-free résumé, related unit/browser/tooling tests, docs/full-frontend-audit-2026-11-04.md and its evidence, AGENT.md and CHANGELOG.md. Exact current-source and export manifests are in the audit report. No dependency or deployment configuration changes in this audit.
- **Verification**: Build 7ZXmp772g5T8B_eREKvhm; 791/791 unit tests, lint/typecheck, 46 Node regressions and static/HTTP/agent/runtime dependency audits pass. Chromium 62/62: 360 responsive observations, 160 route/axe scans with zero violations and 160 incomplete contrast groups, 18 independent-pane and 32 taskbar observations. Real 200%/400% Chromium zoom passes 16 observations across eight routes. Current 278 source and 1,072 export hashes checked; 273 initial census records fully accounted for, generated lock and binaries distinguished, final 264 manual text files span 60,736 lines. Independent source/PDF/privacy/report reviews and failed-run evidence retained.
- **Follow-ups**: Incomplete contrast groups are not cleared globally; finite paint samples are recorded. Physical devices/software keyboards, assistive speech, native mail clients, Firefox/WebKit here, native-speaker review, original research-PDF tagging, reviewer timing and field p75 Web Vitals remain unverified. Optional Go execution skipped because no compiler is available; full dependency audit reports 16 moderate tooling entries, runtime audit zero vulnerabilities. No universal conformance claim. No commit, push, merge or deployment.
```
