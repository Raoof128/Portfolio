# Reviewer-readiness lane reviews

One file per lane would have repeated the same evidence, so the requested architecture, design, responsive, accessibility, security, performance, content and SEO reviews are sections here. Each links its evidence.

## Architecture (RR-L1, RR-L2, RR-L5)

- **Sound:** a route-backed static export with one window manager. No `dangerouslySetInnerHTML`, `innerHTML` or `eval`; JSON-LD is escaped. Every timer, observer and rAF has cleanup. Server/client snapshots are hydration-consistent. All five locales are statically generated. Canvases cap DPR at 2 and pause for reduced motion and hidden tabs.
- **Fixed:** the dock reveal scrolled the page (RR-F01); 17 dead files and about 213 dead CSS/copy lines removed (RR-F06); audit scripts that could not fail on loops or wrong hreflang URLs (RR-F07/F08); orphaned tooling tests (RR-F09).
- **Open (P3):** a duplicate hidden Desktop tree, duplicated route→app mapping, three clipboard helpers, effect-dependency nits. See [unresolved risks](unresolved-risks.md).

## Design and Aero fidelity

- 7.css parity was measured in the [third parity pass](../../aero-parity/round3/README.md): 60 exact plus 1 within the noise band, out of 134 controlled state pairs. This pass changed no canonical control styling.
- **Polish fixed:** the narrow dock labels split mid-word ("Project/s", "Proyec|tos"). English now fits; Spanish hyphenates at dictionary points ([before](evidence/dock-labels-320-before.png) / [after](evidence/dock-labels-320-final.png)). The desktop category caption no longer reads like a ranking.
- **First impression** ([1440 capture](evidence/desktop-1440-final.jpg)): name, research focus, a one-sentence statement and three primary actions (Explore Research, Résumé PDF, Contact) sit above the fold beside the evidence map. The owner-approved lock screen and 3-second entry are unchanged.

## Responsive (RR-B1 → RR-Q1)

- 14 routes × 10 viewports (320×568 to 1920×1080, including 640×360) = 140 loads, before and after. Horizontal overflow is 0 in both. **Heading not in the first viewport: 24 → 0.** The cause was RR-F01; [before](evidence/simurgh-320-before.png) / [after](evidence/simurgh-320-after.png).
- RTL: Persian and Arabic first windows now mirror (round 3). The dock fix keeps scrollY at 0 at 320×568, 640×360 and 1024×768 in fa/ar.
- The existing Playwright reflow, coarse-pointer, 880/881px boundary and five-language cases pass.

## Accessibility

- axe-core 4.14 (WCAG 2a/2aa/21aa/22aa tags) at 1440×900 and 390×844 across 14 routes: **0 violations** before and after. `color-contrast` is reported incomplete once per run because of the translucent glass; earlier passes reviewed that manually.
- **WCAG 2.5.8:** applying the real spacing rule, only the 16px resize grip is undersized, and it has an equivalent full-size control (Move and Resize panel). Phones: 0 failures.
- **Keyboard** ([journey](evidence/keyboard-journey.json)): lock screen → Enter → desktop → Projects → project → Résumé → Contact with keyboard only. Focus never dropped to `<body>` after the first Tab. The skip link deliberately bypasses the lock screen (WCAG 2.4.1).
- Reduced motion and forced colours match and were spot-checked. Not verified: screen-reader speech, real devices, OS zoom.

## Security

- Runtime `npm audit`: 0 vulnerabilities; all dependencies: 8 moderate (dev tooling only, down from 16); the high-severity gate passes.
- Static artifact audit passes (1,067 files). The CSP, HSTS, frame-ancestors, Permissions-Policy and COOP headers are unchanged. The redirect audit now detects loops.
- Removed five unreferenced, publicly served boilerplate SVGs. External links all carry `rel="noopener noreferrer"`. No server-only APIs were added.
- Open: browser suites are not in CI; a missing deploy token skips silently; no CSP `report-to` (P3).

## Performance (lab only; [baseline](evidence/perf-baseline.json) vs [final](evidence/perf-final.json))

390×844, 4× CPU, 1.6 Mbps, 150 ms; medians of 3 cold loads, Chromium 153 on Linux.

| Route | LCP before → after (ms) | CLS |
| --- | --- | --- |
| /projects | 2,988 → 2,904 | 0 |
| /projects/project-simurgh | 3,444 → 3,420 | 0 |
| /resume | 1,260 → 1,220 | 0 |
| /contact | 1,084 → 1,068 | 0 |
| /about | 976 → 1,072 (within run spread) | 0 |

The two routes above 2.5 s were diagnosed: FCP is about 1.0 s, and the late LCP comes from the hydration remount of the window title, not slow content. The fix is architectural and recorded as a P2 risk. No field data exists.

## Content credibility (RR-L4)

- 55 claims inventoried. Every metric is consistent across all five locales (Simurgh 17/24→0/24, 23/24, 288; DOIs). Locale key parity is 369/369. All six PDFs exist and their page counts match the copy; all DOIs resolve.
- **Fixed:** the vendor-classification error in all bios (RR-F02), KotlinConf "presented" → "submitted" (RR-F03), Aion cost absolutes (RR-F04), and translation hygiene (RR-F05).
- Previously flagged Zurvan "no-cloud" and Aion "non-hallucination" absolutes are no longer present.
- Owner items (Nexus year, metrics without evidence, Limitations coverage) are listed in [unresolved risks](unresolved-risks.md).

## SEO and discoverability

- 162 HTML pages: 160 have a canonical, `og:image`, and 6 hreflang links (5 locales plus x-default). Every hreflang URL now passes a strict URL-level audit. All JSON-LD parses. The sitemap lists 160 URLs; robots, RSS and llms files are present.
- All 190 unique internal links return 200 under real Pages routing.
- Every research page opens directly from a shared or search URL without entering the desktop (direct routes are server-rendered).
- Open (P3): 73 meta descriptions exceed about 160 characters (truncated in results, not invalid).
