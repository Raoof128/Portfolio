# ResearchOS verification and release handoff

Checked 11 October 2026 (Australia/Sydney). The reviewed private development dependency is now installed. Fresh local integration passes ordinary `npm ci`, lint with zero errors and one existing local temporary-file warning, typecheck, 468 application tests in 33 files, three dependency-security tests, six schema tests, 168 generated pages, the 160-route export audit and full/runtime audits with zero advisories. The final frozen-source/export report records the exact handoff identity; historical captures and results keep their original build labels. Publication still requires explicit approval. Field performance, physical-device, screen-reader and remote CI proof remain separate.
No push, merge, deployment or production mutation has been performed.

## Guarded dependency integration

The exact Node 22.23.3/npm 10.9.9 integration commands passed after ordinary clean
installation. The application suite passes 468/33 (81.94 seconds on the shared
local host); the separate Node dependency-security suite passes three tests.
Source→archive→installed parity, real enabled Next internal-link behavior and
bounded rejection paths are tested. Upstream compatibility checks and clean
private-fixture installs pass separately on Node 22/24. The current full/runtime
audit has zero registry advisories, while private code assurance uses independent
review and meaningful guard tests. See [maintenance](./dependency-security.md).

The final frozen report outside Git records fresh clean installation, exact
postflight source/export hashes, content/style projection and actual native
regression evidence. The following tables preserve the accepted build 10 history;
they do not claim those historical screenshots executed on build 11.

## Historical build 10 candidate identity

| Item                       | Reviewed identity                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| Branch                     | `main-frontend-gauntlet-2026-10-10`                                                              |
| Base HEAD                  | `0efeb54962c60d2f22468ed64221c9f89d01e293`                                                       |
| Working tree               | Uncommitted; existing user work preserved                                                        |
| Final executable candidate | Build 10, `v0EKrWZjehi8UYOrVO-09`                                                                |
| Source manifest            | 236 records, SHA-256 `cc4079335f559372c66c37dd59511d095ab325cfd74609c08127d54da45577db`          |
| Export manifest            | 1,085 file records, independently verified                                                       |
| Postflight documentation   | Updated after the frozen application build, separately recorded                                  |
| Prior frozen report        | Historical; unchanged SHA-256 `09b8fee851e48378d3e1c4eac16cc2fd7ff99224b756087e91faf3519614c440` |

Build 10's 1,085-file export manifest SHA-256 is
`c2a9cdd5473b6cb74909e8ef861a5ecc0303d584619d64781e789cc33f89d4a8`.
The isolated reviewed preview is `http://127.0.0.1:4396/`. Build 9 and its final
report remain frozen. Build 10 changes only the Light Welcome muted foreground:
#43546d normally and #3a4449 when increased contrast is requested. Four new
regression tests preserve contrast margin against measured orbit-stroke backgrounds
and the preference override. Layout, fonts, original artwork, routing and runtime
JavaScript remain unchanged. Five-language Light 320px native review and exact
Spanish glyph-geometry comparison check the affected state. All original captures
keep their actual candidate identities; the Dark matrix is not relabeled build 10.

Independent current source/export review passes 4,133 checks. All 160 linked-style
orders reconstruct build 9 after removing exactly the two gated Light declarations;
43 common JavaScript chunks, 29 fonts and six PDFs match. Fresh content/semantic
projection passes 2,944 checks and independent ordered-style projection passes
2,243. Only the intended Light rules add 128 raw CSS bytes. This is static scope
verification, separate from native captures or timing.

The preceding build 9 application has three changed runtime paths from build 6: thumbnail grid/SVG
sizing, Hall heading wrapping and short-viewport navigation flow. Build 9 appends
one `max-height: 320px` rule to build 8's shell CSS. Independent projection checks
all 160 exported stylesheet orders. The compiler splits one global chunk into two
and emits one additional unused `backdrop-filter` utility from documentation text;
it matches no exported or dynamic application class. Outside the new media query,
removing that qualified unused rule reconstructs the previous effective styles.
All eight matrix heights exceed 320px. This supports scoped reuse, with actual
build identities retained; no earlier screenshot becomes a fresh build 9 capture.

Build 8's seven native focus/restoration predicates remain separately recorded,
including phone restoration from 675 to 672px within an explicit 4px tolerance.
Fresh build 9 actual Chrome 200%/400% zoom and Persian 400% checks pass 14 predicates
for readable text, scrolling, reachable 44px controls, dock access and exact task
restoration. The failing build 8 400% obstruction remains historical diagnosis.
This checkout's older `out/` is not the reviewed isolated export. Documentation
is a Tailwind scanning input: postflight documentation does not promise identical
utility bytes in a future rebuild. Rebuild and audit the exact release checkout.

## Implemented and corrected

The retained application registry contains 31 reading applications per locale,
with direct Next URLs, readable static HTML, route-specific metadata and bounded
session state. Independent windows support stacking, close, minimize/restore,
maximize/restore, pointer movement/resize, keyboard alternatives and viewport
clamping. Phones present one foreground document with ordinary page scrolling.
Welcome/lock, immediate access, clock, dock, search, appearance and RTL are integrated.

Projects retain all 13 dossiers and their original artwork, with search/categories,
on-demand static thumbnails and motion controls on detail pages. Research exposes
seven articles and a separate five-paper library; global search includes papers
and résumé section actions. About, Lab, résumé, Contact, policy, recognition and
404 content remain directly accessible. Contact accurately opens an email draft.

Verified corrections include localized clock semantics, Chinese résumé reflow,
opaque reading-pane arrival, full static RSC fallbacks that preserve open apps,
missing-IntersectionObserver motion suspension and disposed clipboard feedback.
Build 8 also corrects cropped Canvas/SVG index previews and a minor Spanish Hall
heading overrun. Build 9 moves chrome into ordinary document flow at viewport heights
of 320px or less, correcting the actual 400% reading obstruction. Original facts, metrics, 35 code blocks, six PDFs, 13 artwork
modules and 31 reviewed public assets are preserved. The earlier gauntlet's
light-theme/contrast, navigation, content, security and localization repairs retain
their original issue IDs and proof chronology.

The frozen build 9 issue register retains 66 reported IDs: 63 demonstrated defects,
two duplicate reports and one dismissed observation. It records 62 source
corrections with their exact scoped proof and one partially corrected finding
whose upstream dependency advisory remains open. These counts do not mean every
issue has been independently reproduced in every final browser state.

The current build 10 register retains those 66 issue objects verbatim and adds
C3-A11Y-01. Its accounting is 67 reports, 64 distinct demonstrated defects,
63 bounded source corrections, one upstream partial, two duplicates and one
dismissed observation. Five explicit current-disposition overlays append native
evidence without rewriting the historical issue chronology.

The build 10 continuation adds C3-A11Y-01, the bounded Light Welcome contrast
finding. Eight adjacent, text-free stroke samples showed previous computed-text
ratios 4.301–4.401. Native build 10 comparison at the same coordinates has a minimum
5.778 after the correction; slight background changes are recorded. Exact pixels
under opaque glyphs and blanket contrast conformance are not inferred. All five
Light Welcome languages were directly reviewed. The stronger-contrast token and
unchanged neutral-pointer geometry have separate preference proof.

Additional build 9 native proof closes the former pending observations for
minimized descriptions, original project-title language, retained Lab motion,
the 1024×600 desktop boundary and keyboard expand/restore. Five locales pass
75 window predicates and one English Lab002 flow passes eight motion predicates.
Native AX focus followed by Space/Return is not a complete sequential Tab walk
or screen-reader speech check. The new issue register uses current-disposition
overlays while retaining the original issue objects and older pending chronology.

Fresh build 10 directional keyboard resizing passes 15 native predicates in one
English About window; a separate IAB 155 check passes ten for the exact
expanded-true → Left-arrow resize → expanded-false transition. The latter's
illustration is a 673×600 JPEG panel crop, explicitly separate from native Runtime
1024×600 geometry. Native Lab002 pause/restore/resume passes 12 predicates in one
English flow; playback resumes but animation phase preservation is not claimed.

Five fresh Light Welcome axe 4.14 scans have zero executed-rule violations and
nine incomplete results/20 node occurrences:11 gradient,three overlap,one short
text and five skip-link nodes. They remain a separate scoped manual-disposition
supplement. The historical 160 Dark scans/164 incomplete results/2,156 occurrences
are unchanged. Increased-contrast native samples have a minimum 5.223 at the same
eight coordinates because the existing preference also darkens orbit strokes;
the foreground regression uses normal-mode background fixtures, not an AAA claim.

A separate current-build native supplement checks the four Chinese `无` table
cells and seven named Spanish Light Welcome text nodes: 83 predicates pass, with
eight cleanup predicates. The four visible Chinese glyphs have computed contrast
16.033 and sampled adjacent contrast 16.002. Welcome adjacent samples have a
minimum 5.346; a conservative header-material bound is 5.182. A new 24px
same-circle search obtains six eligible PDF backgrounds with minimum 5.881,
without rewriting the earlier 10px search's absence of a qualifying sample.
These named checks leave the original incomplete axe records unchanged and do
not claim exact backgrounds concealed by opaque glyphs or site-wide conformance.

The unresolved high tooling finding is being investigated through a bounded,
scratch-only guard prototype. A fork is feasible in principle; lack of an
official patched release does not alone establish a whole-goal impasse. No
prototype is installed in this reviewed build 10 graph, and no audit result or
owner risk acceptance is inferred from that investigation.

## Historical build 10 executed gates

| Check                          | Result and scope                                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Clean `npm ci`                 | PASS, Node 22.23.3; unchanged lockfile through build 10; build 10 dependencies cloned from the verified build 9 tree, not a fresh install |
| Lint                           | PASS, fresh build 10, zero errors and warnings                                                                                            |
| Typecheck                      | PASS, fresh build 10 standalone TypeScript and Next compilation                                                                           |
| Exact `npm run test:ci`        | PASS, build 10: 468 tests / 33 files / 28.73s, exact default command without CLI overrides                                                |
| Schema unit command            | PASS, fresh build 10, six tests                                                                                                           |
| Coverage                       | PASS, build 6: 464 tests; 89.5% statements / 80.37% branches / 89.04% functions / 90.67% lines                                            |
| Production build               | PASS, build 10: 168 generated pages                                                                                                       |
| Static export audit            | PASS, build 10: 160 canonical routes, zero warnings                                                                                       |
| Content/i18n                   | PASS, fresh build 10: 115 details / 10,086 checks; five dictionaries ×432 leaves; 115 schema-language routes; 605 interface-copy checks   |
| SEO/link/404 export            | PASS, fresh build 10: 160 routes / 12,619 checks                                                                                          |
| Native workspace/navigation    | PASS, build 6 Chrome 154: 65 assertions; unchanged manager independently verified                                                         |
| Affected responsive routes     | PASS, build 8: Projects/Hall ×5 locales ×8 sizes =80 native frames                                                                        |
| Affected axe automation        | PASS for executed rules, ten default axe 4.14 scans, zero violations; ten incomplete results remain manual-review items                   |
| Full route/visual acceptance   | PASS scoped, 1,280 selected frames /160 reviewed routes from builds 6 and 8; qualified later projection preserves actual identities       |
| Native zoom/reflow             | PASS scoped, fresh build 9: 14 actual Chrome 200%/400% and Persian 400% predicates                                                        |
| Emulated touch/skip            | PASS scoped, build 8: 17 touch predicates and actual English skip activation; physical touch separate                                     |
| Original artwork               | PASS in bounded native scope: 13 narrow stills, five scrolled phone views, retained-app proof                                             |
| Safari/Firefox                 | PASS for eight actual Zurvan/Syllabus fresh-filter/retained-window preview observations                                                   |
| Runtime dependency audit       | PASS, fresh continuation audit, zero vulnerabilities                                                                                      |
| Full dependency audit          | FAIL, fresh continuation audit, five high development paths for one unpatched braces advisory; zero critical entries                      |
| Live production audit          | FAIL on the older deployed revision/older schemas; no candidate deployment                                                                |
| Field CWV / INP                | NOT RUN; local samples do not establish field targets                                                                                     |
| Physical touch / screen reader | NOT RUN; emulated/native keyboard coverage is separate                                                                                    |

The final responsive matrix selects per-row native proof with hashes, dimensions,
geometry checks, source identity and independent projection. Its eight sizes are
1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844 and 320×700.
Visual review inspected all 160 route contact sheets/direct frames. The separate
five-locale unlocked-home supplement has 40 frames. All 160 default axe scans have
zero violations for executed rules, with 164 incomplete-rule results and 2,156
node occurrences retained in a manual-disposition ledger. Scoped manual work does
not convert unresolved contrast results to passes. Incomplete axe contrast nodes,
invalid capture geometry, debugger timeouts and aborted attempts are recorded
separately and never counted as passes.

## Performance evidence

Four build 8 one-sample bounded IAB windows use 390×844 CSS, DPR 1, `mobile:false`, 4× CPU,
150ms latency, 200,000 B/s download, 93,750 B/s upload and disabled browser cache.
Late buffered observers record a ten-second window and explicit navigation offset.
Other applications on the shared host are not controlled. All temporary diagnostic,
CPU/network/cache/media/viewport conditions are cleared afterward.

| Route    | LCP (ms) | FCP (ms) | Bounded CLS |
| -------- | -------: | -------: | ----------: |
| Home     |    5,728 |    4,360 |     0.08940 |
| Projects |    4,140 |    2,340 |     0.01171 |
| Simurgh  |    2,752 |    1,768 |           0 |
| Résumé   |    3,276 |    3,128 |     0.03902 |

All local LCP samples exceed 2.5s; bounded CLS is below 0.1. There is no comparable
same-engine controlled production baseline, field CWV, INP or speed-improvement
claim. The homepage's main shift cannot be assigned to an exact source node from
its anonymous raw entry; the separately observed late font does not establish
causation. No new confirmed regression is inferred from a single confounded sample.

A fresh source/timeline review preserves these four actual build 8 measurements.
Welcome identity and text are present in initial HTML, route artwork is already
loaded on demand, and the late font finishes after the dominant recorded shift.
Optional lazy search markup and portrait changes are unproven hypotheses, not
demonstrated regressions. No quality-reducing asset change or architecture rewrite
is justified by these shared-host samples. Field/device measurements remain separate.

Build 9 unique direct modern JavaScript gzip weights are Home 168,234 B, Projects
171,919 B, Simurgh 176,072 B and Résumé 185,134 B. Corresponding CSS is
22,519 /25,225 /26,158 /22,519 B. JavaScript is unchanged from build 8; each listed CSS total adds 926 B.
These exclude runtime prefetch, on-demand artwork,
nomodule polyfills and timings. Twenty-nine continuation-build fonts and six PDFs
match the prior candidate; the pre-redesign full-font baseline is unavailable.
The résumé exceeds an earlier reviewer diagnostic of 185,000 B by 134 B; that
number is not a user/CI performance gate. Historical resource savings stay labeled
with their original earlier candidates.

## Security and remaining limitations

The full audit's development chain is `eslint-config-next → @next/eslint-plugin-next
→ fast-glob → micromatch → braces`, ending at affected `braces` 3.0.3. The
[official advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) has no patched
release in the recorded upstream check. Maintainer disagreement is not withdrawal.
Browser input does not invoke this tooling chain. The historical failing gate
remains recorded; current guard adoption has separate source/consumer proof. No suppression, forced framework downgrade or fabricated risk
acceptance is applied.

The fresh upstream review checked all 37 published braces versions, 43 stable
Next 16 plugin versions and the latest canary. No ordinary published update
resolves the chain. The forced lint-config 14.2.35 suggestion declares ESLint
7/8 peers, excluding the locked ESLint 9.39.2, and was not applied. The original
goal requires no unresolved critical security findings in implemented scope;
it does not literally require zero high entries in a full npm audit. The audit
reports zero critical entries. AS01 was unresolved in that frozen build 10 graph. Current integration remediates
its affected consumer with the independently reviewed private guard; no owner
waiver, suppression or invented runtime exploit claim is used.

Native Safari/Firefox checks use a plaintext-loopback adaptation that removes only
CSP `upgrade-insecure-requests`. Production header and redirect hashes stay intact.
This transport adaptation is not deployed. Representative engine checks do not
establish all-route/eight-size proof in every engine or SVG lens parity.

WCAG 2.2 AA remains the target; scoped axe, keyboard, motion and contrast checks do
not constitute blanket conformance. Physical phones, assistive-technology speech,
autofill, true mobile keyboards, every gesture interruption and final-device
safe areas remain unverified. Independent translation/content review does not
certify native-speaker prose or independently reproduce all research outcomes.
Remote CI, real email delivery and production behavior await their own execution.

## Evidence and deployment usage

Evidence remains outside Git in this task's `frontend-gauntlet/goal-continuation`
visualization folder. Source/export identities, actual logs, composite route and
feature matrices, issue registers, reviewed images, failed attempts and independent
reviews identify the exact candidate. The preceding `final-report.md` is frozen.
The current report is written separately; do not substitute the preceding report.

To review locally, use the Node version in `.nvmrc`, run `npm ci` and `npm run dev`,
and inspect direct routes plus window restoration. To prepare a static release,
run the quality commands in [implementation notes](./research-os-implementation.md#run-and-review),
then `npm run build` and `npm run audit:agents` from the same checkout. The audit
reads that checkout's `out/`; it has no `--dir` override. Serve the export with
Cloudflare-compatible headers and rewrites. `next start` is not an export preview.

Resolve the tracked dependency finding through a verified upstream fix or a
properly validated local fork that preserves the retained checks; neither path
is complete in this build 10 snapshot. Review the exact release source/asset
identity. Remaining field, physical-device
and assistive-technology evidence requires its own execution environment. Push,
merge and deployment require explicit owner authorization. After an authorized
deployment, run `npm run audit:production` against the served revision. A local
build is not proof of deployment or remote CI.
