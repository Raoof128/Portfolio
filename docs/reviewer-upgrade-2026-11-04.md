# ResearchOS reviewer experience upgrade — 4 November 2026

This is a local implementation and verification record. It does not certify the
deployed site, field performance, universal accessibility, or physical devices.
No commit, push, merge or deployment was performed.

## Changes

1. **Useful first visit.** The home route renders Research Highlights immediately,
   with direct Explore Research, View Résumé PDF and Contact links. The optional
   logon remains available through Lock. All five languages use the same components.
   `ResearchOS.tsx`, `Desktop.tsx`, `reviewer-copy.ts`, `win7-desktop.css`.
2. **Reading width controls layout.** Desktop windows can resize to 320px. About,
   résumé, contact and library layouts adapt to their reading container, while
   Explorer collapses secondary navigation below 881px. Tablet reading surfaces
   gain space; phones and short viewports use document flow and safe-area spacing.
   `window-geometry.ts`, `reading-window.css`, `supporting-apps.css`,
   `project-explorer.css`, `win7-explorer.css`, `win7-pages.css`, `win7-windows.css`.
3. **Evidence before architecture.** Dossiers offer Problem → Contribution →
   Evidence → Limitations → Sources links, with problem/contribution preceding the
   diagrams. Simurgh has six selectable architecture stages, including the signed
   pack and independent verifier. This is an illustration based on documented
   components, not a recorded execution, live service or new benchmark.
   `ProjectDetailClient.tsx`, `dossier-reader.css`, `SimurghEvidenceStory.tsx`,
   `evidence-story-copy.ts`, `dossier-copy.ts`.
4. **Qualified claims and readable summaries.** Zurvan's local storage no longer
   implies every LLM extraction stays offline. Aion's 40-question pilot no longer
   promises hallucination-free answers. These changes cover English, Persian,
   Arabic, Spanish and Chinese. HTML summaries explain their scope and the original
   papers' accessibility limits. The six served PDFs, including the résumé, retain
   their original hashes. `data.ts`, `project-content/{fa,ar,es,zh}.ts`.
5. **Restrained artwork arrival.** A 220ms clip/opacity reveal applies to successfully
   loaded original dossier artwork. It reserves layout space, respects reduced
   motion and leaves navigation/focus/history to the existing route system.
   `ProjectMotion.tsx`, `project-motion.css`.

The existing route-backed single reading window, canonical desktop 7.css chrome,
original artwork, opaque reading surfaces and static Cloudflare export are retained.
Package/lock files, Next configuration, deployment workflows and public assets
were not changed.

## Motion compatibility decision

Installed React is 19.2.3, React DOM 19.2.3 and Next.js 16.4.4. The installed React
runtime does not export `ViewTransition`. The current official
[Next.js guide](https://nextjs.org/docs/app/guides/view-transitions), also shipped in
`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`, uses React 19.3.
The [React reference](https://react.dev/reference/react/ViewTransition) describes
React coordinating browser transitions itself.

The implemented fallback is an artwork arrival reveal, **not a positional
thumbnail-to-dossier morph**. No canary, dependency upgrade, experimental flag,
navigation interception or loading delay was introduced. A future positional morph
would require a separate compatible React upgrade and regression evaluation.

## Verification coverage

The existing Playwright/axe workflow was extended with
`scripts/browser-regressions/playwright/reviewer-upgrade.spec.ts`.

| Surface/state | Coverage |
| --- | --- |
| Home | Fresh entry, three actions and visible research focus in five locales × two appearances |
| Reviewer navigation | Sequential keyboard access, projects/contact/flagship links, résumé PDF signature, focus, Back/Forward |
| Responsive route families | Home, Projects, lab detail and Contact across 320, 360, 390, 768, 1024, 1280, 1440, 1920 widths and 640×360 landscape; all locales and appearances |
| Independent reading widths | Actual pointer resize to 320/560/800px inside a 1440px browser for Projects, About, résumé, Contact, Write-ups and Simurgh |
| Explorer boundary | 880/881px content boundary, collapsible navigation and keyboard operation |
| Phone document flow | Résumé scrolls the document at 320×568, 390×844 and 640×360; inner reading pane does not trap scrolling |
| Research | Six Simurgh stages and all five reading-path destinations; focused unit coverage includes all languages and modified-click semantics |
| Preferences | Both appearances, reduced motion, forced colours, increased contrast and reduced transparency |
| Broad routing | Existing sitemap inventory and route/axe scans, including original route families and five-language 404 recovery |
| Original evidence | Served PDF hashes compared directly with the starting Git revision |

Browser validation uses local Wrangler 4.149.0 at `http://127.0.0.1:4398`, including
the authored `_headers` and `_redirects`, Chromium 155.0.8059.79, DPR 1 and local
self-hosted fonts. Connected Browser control tools are not exposed in this task;
the brief explicitly requests the existing Playwright suite. Firefox and WebKit
executables are absent in this environment; historical cross-engine passes are
not promoted to fresh evidence.

## Remaining verification and owner decisions

- Physical phones/tablets, actual software keyboards/autofill, assistive speech,
  complete native browser zoom, and native-speaker review remain unverified.
- 320px reflow and enlarged-layout checks do not stand in for every native 400%
  browser-zoom or text-resizing combination.
- The five original research PDFs remain untagged. The HTML is a scoped summary,
  not a complete accessible paper replacement. Author-level tagging/source work
  remains necessary.
- The approximately 15-second reviewer goal has no user-study measurement.
- Field p75 LCP/INP/CLS are unavailable. Local lab samples cannot establish those
  targets or predict real-device performance.
- Aero Night remains an intentional adaptation. No whole-site pixel-perfect or
  universal WCAG-conformance claim is made.
- Further publication requires the owner's explicit approval under this brief.

## Final source and build identity

- Starting revision: `2057c9b6d427c8b16544494abb90ed6f4ee2c5d2`, branch `work`.
  The implementation is an uncommitted working-tree change; the base commit alone
  does not identify these new bytes.
- Baseline build: `isVAMRDEPLOSbeOsyaBXZ`.
- Verified final build: `8_DzOgMyvNRMGVpb8Ur4D`, built 4 November 2026 at
  11:56:40 Australia/Sydney (`2026-11-04T00:56:40.512Z`).
- Node 24.22.1; Next.js 16.4.4; React/React DOM 19.2.3; 7.css 0.21.1;
  Playwright 1.64.1; Vitest 4.1.12.
- [Source manifest](reviewer-upgrade-evidence/2026-11-04/records/source-manifest.json):
  245 application/public/config/browser-test records, SHA-256
  `ecb407f399458982e3e146d33aca6eed9c3a2df87861cb61f0b6a5d447ffaa2f`.
- [Export manifest](reviewer-upgrade-evidence/2026-11-04/records/export-manifest.json):
  1,072 files, SHA-256
  `f43981f66aae98ebff533aeee539f52d3460d8b1d9cee409ad10d59807b31229`.
  Every source/export record was rechecked after the browser run with zero mismatches.
- [Build metadata](reviewer-upgrade-evidence/2026-11-04/records/build-identity.json)
  retains the exact exported version values, including its existing contentRevision
  field. This report and the manifests identify the current upgrade independently.
- [Original PDF hashes](reviewer-upgrade-evidence/2026-11-04/records/research-artifacts.json)
  confirm all six served PDFs are unchanged from the starting revision.

## Actual command results

| Command | Result |
| --- | --- |
| `npm run lint` | Exit 0, no errors or warnings |
| `npm run typecheck` | Exit 0 |
| `npm run test:ci` | 696/696 tests, 51 files; no failures or unhandled errors |
| `npm run test:schemas` | 6/6 passed |
| `npm run test:audit-http` | 17/17 passed |
| `npm run test:security` | 12/12 passed |
| `npm run test:dependency-security` | 3/3 passed |
| `npm run build` | Exit 0; static export, 168 generated route entries |
| `npm run audit:security` | Passed, 1,072 export files |
| `npm run audit:agents` | Passed, 160 sitemap URLs, zero warnings |
| `npm run audit:production -- http://127.0.0.1:4398` | Local preview passed; production-only www redirect is outside this run |
| `npm audit --omit=dev --audit-level=high` | Zero runtime advisories |
| `npm audit --audit-level=high --fetch-retries=0 --fetch-timeout=20000` | High-threshold gate passed; 16 moderate lint/tooling entries remain |
| `PORTFOLIO_CHROMIUM_PATH=/usr/bin/chromium npm run test:browser -- --project=chromium` | 48/48 passed in 6.7 minutes, zero skipped/flaky cases |
| `git diff --check` | Clean |

The [machine-readable coverage matrix](reviewer-upgrade-evidence/2026-11-04/records/coverage-matrix.json)
contains the test names/results, 360 responsive observations, 160 route observations
and 18 independent-pane observations. All 520 responsive/route observations reported
one visible main landmark. The 160 route axe scans found zero violations and retained
160 incomplete colour-contrast rule groups. The two additional light-theme home/dossier
scans also found zero violations with two incomplete contrast groups. Incomplete
checks are not accessibility passes.

Focused independent review also checked 390px home, 640×360 home, 320px Persian
home and a 320px Simurgh pane. The phone introduction measures about 413px, followed
by a 20px gap rather than the former 792px minimum-height card. A contact email field
kept focus and remained visible during a simulated 844→420px viewport shrink; this
is not physical-keyboard evidence.

CLI logs are preserved in [records](reviewer-upgrade-evidence/2026-11-04/records/).
The initial integrated unit run caught seven failing assertions and 24 JSDOM focus/scroll
errors during dossier integration. The final suite resolved them. The first focused
browser run passed 14/16 and reproduced the inherited phone minimum-height defect;
the corrected final run passed all 48. Those failed-run logs remain labelled separately.
An optional full-audit request was interrupted when it stalled; the bounded rerun
completed with the disclosed 16 moderate tooling entries. No dependency override was
introduced to conceal them.

## Before/after captures

These are full-page review captures, not screenshot goldens or automated parity scores.
Both sets use Chromium 155.0.8059.79, DPR 1, the same viewport sizes and fonts,
light appearance, reduced motion and local Wrangler. Clocks retain their real capture
time. Fixed taskbars appear at the initial viewport boundary in full-page images.

| State | Before | After |
| --- | --- | --- |
| Desktop, 1440×900 | [Capture](reviewer-upgrade-evidence/2026-11-04/before/desktop.png) | [Capture](reviewer-upgrade-evidence/2026-11-04/after/desktop.png) |
| Tablet, 768×1024 | [Capture](reviewer-upgrade-evidence/2026-11-04/before/tablet.png) | [Capture](reviewer-upgrade-evidence/2026-11-04/after/tablet.png) |
| Phone, 390×844 | [Capture](reviewer-upgrade-evidence/2026-11-04/before/phone.png) | [Capture](reviewer-upgrade-evidence/2026-11-04/after/phone.png) |
| Persian RTL, 1440×900 | [Capture](reviewer-upgrade-evidence/2026-11-04/before/rtl.png) | [Capture](reviewer-upgrade-evidence/2026-11-04/after/rtl.png) |

Additional final browser captures show the
[opened flagship](reviewer-upgrade-evidence/2026-11-04/after/reviewer-opened-flagship.png),
[Simurgh reading path](reviewer-upgrade-evidence/2026-11-04/after/simurgh-reading-path-and-walkthrough.png)
and [320px Contact pane](reviewer-upgrade-evidence/2026-11-04/after/_contact-pane-320.png).
No historical screenshot baseline was changed or approved.

## Lab performance measurements

One sample per state, unthrottled local Chromium, a new browser context for each
capture, no mobile CPU/network emulation, and no concurrent test/build load during
the accepted final capture. Server/OS caches are not controlled. These are viewport
emulations on a cloud host, not physical-device or p75 field measurements.
The baseline renders the logon, whereas the final home renders useful research and
the evidence map; the table is not a same-content speed comparison.

| State | Baseline LCP | Final LCP | Baseline CLS | Final CLS |
| --- | ---: | ---: | ---: | ---: |
| Desktop | 344ms | 392ms | 0 | 0.000249 |
| Tablet | 268ms | 300ms | 0 | 0.000578 |
| Phone | 212ms | 260ms | 0 | 0 |
| Persian RTL | 332ms | 604ms | 0.000026 | 0.000916 |

Raw sample observations accompany the
[baseline](reviewer-upgrade-evidence/2026-11-04/before/metrics.json) and
[final](reviewer-upgrade-evidence/2026-11-04/after/metrics.json) captures.
INP and field p75 LCP/INP/CLS were not measured. No Lighthouse score or test timing
is substituted for field evidence. Field targets remain LCP≤2.5s, INP≤200ms and
CLS≤0.1 at the 75th percentile of real visits.


## Agent/changelog entry (verbatim)

```markdown
### Raouf: 2026-11-04 (Australia/Sydney) — Responsive research and reviewer experience

- **Scope**: Implement the supplied ResearchOS upgrade brief while retaining Aero, five languages, one route-backed reading window, original evidence and static export.
- **Summary**: Show Research Highlights and research/résumé/contact actions on first entry; keep logon optional. Reflow reading layouts by container width down to 320px, collapse Explorer below 881px, and correct phone/short-screen document flow. Add scoped dossier reading paths, limitations, six selectable Simurgh architecture stages and qualified cloud/hallucination claims. Use a reduced-motion-aware artwork reveal because installed React 19.2.3 lacks stable ViewTransition support.
- **Files Changed**: ResearchOS/Desktop/ProjectMotion/Simurgh/dossier components, associated responsive CSS and tests, five-language project/evidence copy, window geometry, maintained Playwright specs, docs/reviewer-upgrade-2026-11-04.md and its evidence, AGENT.md and CHANGELOG.md. Dependencies, deployment configuration and original public assets unchanged; exact source/export hashes are recorded in the report.
- **Verification**: Build 8_DzOgMyvNRMGVpb8Ur4D; 696/696 unit tests, lint/typecheck, 38 Node regressions, static/HTTP/agent audits and runtime dependency audit pass. Chromium 48/48 passes: 360 responsive observations, 160 route/axe scans with zero violations and 160 incomplete contrast groups, plus 18 independent-pane observations. All 245 declared source and 1,072 export hashes rechecked; six PDFs byte-identical. Before/after desktop/tablet/phone/RTL captures, single-sample lab measurements and failed-run records retained. Full high-threshold dependency audit passes with 16 moderate tooling entries disclosed.
- **Follow-ups**: Physical devices/software keyboards, assistive speech, full native zoom, Firefox/WebKit in this environment, native-speaker review, PDF tagging, reviewer timing study and field p75 Web Vitals remain unverified. No universal responsiveness, accessibility or pixel-parity claim. No commit, push, merge or deployment.
```
