# Route/layout audit lane

Baseline: `2b6d048c42c7feb7ef82e38f5ca519603d40afc6`, branch `work`. No pre-existing tracked modifications. All 42 original owned TypeScript/TSX files plus the new regression test were examined completely, with sequential 1–220/221–425, 1–230/231–451 and 1–260/261–517 chunks for the largest clients. See JSON for exact final hashes and full line coverage.

## ROUTE-01 — Decorative code line numbers enter the accessibility tree

- Severity: P2 / medium.
- Affected route: all five locale variants of `/lab/[id]`.
- Source: `src/app/[locale]/lab/[id]/LabDetailClient.tsx`, lines 101–109 (final).
- Observed: line-number spans were ordinary readable text before every source line. The numbers are presentational and CSS already excludes them from selection, but assistive technology still receives them.
- Expected: read the original code without announcing unrelated gutter numbers; preserve visible numbering, LTR source, English code language and keyboard scrolling.
- Reproduction: render the lab detail client and inspect `.os-code-number` spans. Before correction none had `aria-hidden`. New regression failed in all five locales.
- Root cause: presentational gutter spans lacked an accessibility exclusion.
- Implemented correction: add `aria-hidden="true"` to those spans.
- Verification: new `LabDetailClient.test.tsx` checks original code lines, correct numbering, exclusion, `tabIndex=0`, `dir=ltr`, and code `lang=en` in English/Persian/Arabic/Chinese/Spanish. Red: 5 failed. Green: 5 passed. Broader lane output: `/tmp/frontend-routes-tests.log`.
- Result: source/regression verified. Native screen-reader evaluation remains part of external/manual validation; do not equate DOM testing with screen-reader certification.
- Evidence: `/tmp/frontend-routes-red.log`, `/tmp/frontend-routes-green.log`.

## ROUTE-02 — Legacy language chooser is not ready for remounting unchanged

- Severity: P2 / medium, dormant integration risk; **not a current live visitor defect**.
- Source: `src/components/layout/LanguageSwitcher.tsx`, lines 38–91; `Navbar.tsx` lines 108 and 113.
- Observed: both retained legacy navbar language instances use fixed `language-menu` IDs. `role=menu` is declared without the APG menu arrow/Escape/focus behaviour.
- Runtime scope: source import tracing confirms Navbar is only imported by its own test; ResearchOS owns active language switching instead. No public application route currently mounts Navbar/LanguageSwitcher/Footer.
- Action: defer until remount or removal is authorised and exercised. No unrelated legacy rewrite made.
- Verification: complete source and import inspection; root owns active ResearchOS browser checks.

## Positive / retained evidence

- All detail routes use static params and `dynamicParams=false`; localised metadata and JSON-LD use escaped serialization, reciprocal alternates and original English DOI identities.
- Contact mounts the existing real mail-draft form and preserves copy-address fallback; it does not claim server delivery.
- Resume resource is the existing PDF, and source-backed qualification remains expected November 2026 rather than an invented graduation claim.
- Project source visibility honestly distinguishes private source from public repositories. Ordinary external resources use noopener/noreferrer. Dossiers preserve server-rendered sections with a hydrated tab interface.
- Lab source is already LTR and keyboard focusable. The historic unreadable lab theme cannot be reported from this source alone; browser/contrast evidence is owned by root.
- No confirmed P0/P1 issue in this lane. This is not a claim that all viewport/browser/accessibility gates pass.
