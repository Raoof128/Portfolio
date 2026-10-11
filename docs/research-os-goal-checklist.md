# ResearchOS goal: execution and acceptance checklist

The source goal is the user-supplied `pasted-text-1.txt` attachment dated
9 October 2026. The preceding frontend gauntlet is historical evidence. The
complete goal requires implemented applications and actual acceptance proof.
Work remains on `main-frontend-gauntlet-2026-10-10`, based on
`0efeb54962c60d2f22468ed64221c9f89d01e293` plus preserved uncommitted work.
Push, merge, deployment and production changes need explicit owner approval.

## UI evidence baseline and current integration

Build 10 is the immutable UI evidence baseline. The current guarded integration
and final frozen source/export are identified in the handoff report.

The historical frozen executable candidate is **build 10** (`v0EKrWZjehi8UYOrVO-09`). Its
236-file source manifest SHA-256 is
`cc4079335f559372c66c37dd59511d095ab325cfd74609c08127d54da45577db`.
It passes the exact 468-test default CI command, clean lint, typecheck, six schema tests, 168 generated pages and the
160-route export audit; its export has 1,085 hashed files. Seven documentation
records are updated separately after freezing the application. Documentation can
supply Tailwind utility candidates, so a future release must be rebuilt and audited.
Six original PDFs, research claims, 13 artworks and five languages are preserved.

Build 10 repairs C3-A11Y-01: Light Welcome muted text crossing decorative orbit
strokes. The welcome-only token changes from #536781 to #43546d; increased-contrast
preferences keep #3a4449. Three measured-background regressions and one preference
regression pass. Five-language Light 320px native views preserve readable layout;
Spanish per-character geometry matches build 9. Sampled neighboring stroke contrast
improves from a minimum 4.301 to 5.778; exact backgrounds underneath opaque glyphs
are not claimed. The original diagnostic and all prior frozen reports remain saved.

Fresh Light default axe checks are a separate five-scan cohort:zero executed-rule
violations, nine incomplete results and20 node occurrences retain bounded manual
dispositions. They are not added to or substituted for the historical Dark cohort.
Increased-contrast actual samples remain above4.5 (minimum5.223); existing stronger
orbit strokes mean this is not a pixel-by-pixel improvement or blanket AAA claim.

A separate native supplement passes 83 predicates for four Chinese table cells
and seven named Spanish Light Welcome text nodes, plus eight cleanup predicates.
Their computed/adjacent backgrounds and qualified header-material bound remain
separate from the raw incomplete axe records. No new text defect was confirmed.

Scoped default acceptance is complete: **150 build 6 routes +ten build 8 routes**,
each at eight sizes, give 1,280 native Chrome frames and 160 reviewed routes.
The separate unlocked-home cohort adds 40 frames. All 160 default axe scans have
zero violations for executed rules; 164 incomplete results/2,156 node occurrences
retain exact manual dispositions. Build 8 also has 17 emulated-touch predicates
and native English skip activation. Build 9 actual 200%/400% and Persian 400% checks
pass 14 predicates after correcting the short-height reading obstruction.
Five-language build 9 1024×600 native window checks add 75 predicates for Space/Return
expand/restore, translated minimized descriptions, title language and focus. One
retained English Lab002 motion check adds eight predicates. These are bounded
native observations, not sequential Tab or assistive-technology speech proof.
Build 10 additionally passes15 directional keyboard resize predicates,12 native
Lab pause/restore/resume predicates and ten for the exact expanded-to-arrow-resize
state transition. The latter's native Runtime geometry and cropped JPEG illustration
have separate scope. Animation phase preservation is not claimed.

Independent build 9 source/content/style projection qualifies reuse only where
the low-height query is inactive and the extra documentation-generated utility
matches no app element. Old screenshots keep their actual identities. The old
400% failure, invalid captures and strict initial projection failure remain saved.

Fresh build 10 semantic/source checks pass 2,944 assertions. Its ordered compiled
CSS/JavaScript projection passes 2,243 checks across all 160 routes, subtracting
only the two verified Light Welcome declarations. Dark default matrix styles
remain byte-equivalent to build 9. Fresh Light proof is separate; neither prior
Light captures nor the earlier Dark frames become fresh build 10 screenshots.

**Local integration gates: PASS.** The reviewed private development dependency is now installed. Fresh local integration passes ordinary `npm ci`, lint with zero errors and one existing local temporary-file warning, typecheck, 468 application tests in 33 files, three dependency-security tests, six schema tests, 168 generated pages, the 160-route export audit and full/runtime audits with zero advisories. The final frozen-source/export report records the exact handoff identity; historical captures and results keep their original build labels. Publication still requires explicit approval. Field performance, physical-device, screen-reader and remote CI proof remain separate.

The upstream advisory remains recorded; its private guard is an attributed local
remedy with explicit input limits, not an official patched release or npm source
certification. See [maintenance](./dependency-security.md). Frozen builds 9/10 and
all prior failed attempts remain unchanged.

## Feature coverage

| Requirement                                            | Implemented behavior                                                                            | Actual proof and limit                                                                                                    |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Original identity, semantic tokens, appearances, glass | Monogram, vivid app identities, opaque reading surfaces, public CSS/SVG dock                    | Scoped native appearances/material fallback proof; no all-engine lens parity                                              |
| Welcome/lock, immediate skip, clock/date               | Direct access and localized captioned TIME elements                                             | Build 6 native unlock/clock semantics; welcome is not authentication                                                      |
| Apps/dock/launch/close/stacking                        | Closed locale inventory of 31 independent reading apps                                          | 65 build 6 native Chrome helper assertions; qualified source/compiled projection to 9                                     |
| Minimize/restore retaining state                       | Stable keyed apps, localized tasks, React Activity lifecycle                                    | Native repeated restoration/query/focus samples and focused tests                                                         |
| Drag/resize and viewport safety                        | Bounded/coalesced pointer capture plus step/keyboard alternatives                               | Native held-pointer clamp/resize and desktop/phone transition; not every mid-gesture interruption                         |
| Maximize/restore/reset                                 | Saves prior rectangle, clamps restore, reset uses defaults                                      | Native exact same-viewport restore helper; resized-view clamping is separate                                              |
| Preferences/motion                                     | Appearance only persisted; reduced motion/transparency/contrast/forced colours                  | Native bounded preference/focus checks; diagnostics restored                                                              |
| Deep links/refresh/history                             | Next owns navigation/metadata and complete fragment hrefs                                       | Native history/search/fragments and build 6 RSC-fallback fault test; no custom loader                                     |
| Pre-hydration reading/input                            | Concrete SSR bridge transfers supported bounded fields/caret/offset                             | JSDOM hydration tests plus native11-script pause/release query/caret proof; not autofill                                  |
| Phones/tablets                                         | One foreground document, ordinary scrolling, retained reading offsets, reserved dock/task space | 1,280 default +40 unlocked-home frames; 17 emulated-touch and 14 fresh zoom/reflow predicates                             |
| About/skills/experience/certifications                 | Existing About and résumé sections with direct section actions                                  | Export/content checks and native navigation; these are sections, not fabricated separate apps                             |
| Explorer/13 project dossiers                           | Literal search/category/evidence links, original-art stills/detail playback                     | All 13 narrow native art fits and five phone art checks; updated five-locale indexes×eight sizes pass                     |
| Research/publications/Lab                              | Seven filtered articles, separate five-paper library, three experiments                         | Original PDFs/links/source preserved; native publication search/fragment actions; no per-paper library filter             |
| Résumé/Contact/policy/recognition                      | Direct URLs, original résumé PDF, honest email-draft behavior                                   | Export/URI/SEO checks, narrow Chinese résumé proof; actual mail sending not exercised                                     |
| Original routes/404/resources                          | 160 canonical routes, readable static HTML and machine resources                                | 160-route build 9 audit, 115 detailed content checks, scoped no-JS proof                                                  |
| English/Persian/Arabic/Chinese/Spanish                 | Complete localized content, names/dates/numbers, RTL and original identifiers                   | 432 dictionary leaves per locale, 605 interface-copy checks, 115 schema-language routes; not native-speaker certification |

Window geometry, filters, drafts and reading positions are in-memory state for
the mounted locale workspace. Reloading or changing locale resets them. No frame,
new app-data endpoint, tracker, custom fetching protocol or extra window-manager
dependency is introduced.

## Mandatory gates

| Gate                             | Current status                                                                                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clean installation               | PASS, Node 22.23.3; unchanged lock6–10; dependencies10 cloned from verified9 tree, not a fresh10 install                                              |
| Lint/typecheck                   | PASS, fresh build 10 lint has zero errors/warnings; standalone TypeScript and Next compilation pass                                                   |
| Exact default CI                 | PASS, build 10:468 tests/33 files/28.73s, no CLI overrides                                                                                            |
| Schemas/coverage                 | PASS, fresh10 six schema tests; named build 6 coverage464/33 retains actual identity, no fresh10 coverage claim                                       |
| Build/static output              | PASS, build 10:168 generated pages,160 canonical routes,0 warnings                                                                                    |
| Window/navigation regression     | PASS, build 6 native Chrome65 assertions with qualified unchanged-source projection                                                                   |
| All routes/locales ×eight sizes  | PASS scoped,1,280 selected native frames; actual6/8 identities with qualified later projection                                                        |
| Chromium/Firefox/Safari          | Chrome default matrix complete;8 Safari27.0.1/Firefox Nightly(Gecko) eight artwork observations; representative cross-engine scope                    |
| WCAG2.2AA target                 | Scoped automation/keyboard/motion/contrast/manual work;164 raw incomplete results remain; no blanket conformance                                      |
| Visual/design review             | 160 default routes +40 unlocked-home frames reviewed;9 zoom14/window75/Lab8 predicates;10 affected Light views reviewed in five languages             |
| SEO/content/documents            | PASS, fresh10:160 routes/12,619 checks;115 details/10,086 checks;6PDF/13art hashes, five dictionaries and605 interface checks                         |
| Field LCP≤2.5s/INP≤200ms/CLS≤0.1 | NOT RUN; four build 8 local diagnostic windows all LCP>2.5s; no field/INP/speed claim                                                                 |
| Secrets/HTML/headers/services    | Scoped review passes; production header bytes unchanged; static email-draft boundary honest                                                           |
| Dependencies                     | Current integration full/runtime auditPASS0; private guard has separate source/consumer tests; historical5high retained                               |
| Independent final gauntlet       | Source/export/content/style/native reviews recorded with exact limits; final report preserves historical failed gates and current integration results |
| Production/remoteCI              | Not deployed/executed; historical production audit fails for old revision and8 old language schemas                                                   |

Invalid scaled/clip-mutated screenshots, late incorrect instrumentation,
unsupported methods, interrupted calls and partial frames remain outside accepted
coverage. Incomplete axe checks stay incomplete unless a relevant manual check
is actually recorded. Resource weights are not CWV. An unavailable external check
stays blocked or not run with its precise reason.

## Evidence and review usage

Evidence is outside Git in this task's `frontend-gauntlet/goal-continuation`
visualization directory. The current report, machine issue register, feature and
route matrices, log files, source/export manifests, screenshots and independent
reviews retain actual source/build identities. The preceding `final-report.md`
remains frozen. [Verification and release handoff](./research-os-verification.md)
records the current gates, timings, known limits and deployment usage.

The supported helpers are
`scripts/browser-regressions/researchos-workspace.cua.mjs` and
`researchos-navigation.cua.mjs`. Invoke their exported verification functions in
an owned Codex CUA tab at a desktop CSS viewport of at least1024×600, against a
fresh static export. They return actual assertion evidence and use supported
locator readiness. They are not Node CLIs, external browser drivers, full route
matrices or autofill tests. See the invocation/cleanup in
[Run and review](./research-os-implementation.md#run-and-review).

Use Node from `.nvmrc`, then `npm ci`, lint, typecheck, CI tests, dependency-security, schema/coverage,
build and `npm run audit:agents` from the same checkout. The export audit reads
that checkout's `out/`; there is no `--dir` override. Preview with the existing
headers/rewrites; `next start` is not a static-export server. An authorized release
must rebuild/validate the actual deploy artifact and verify served production
with `npm run audit:production` afterward.

## Completion audit

- [x] Independent application implementation and all existing content integrated.
- [x] Source/export/content integrity and scoped native behavior checked.
- [x] Exact 468-test CI, clean lint/typecheck, schemas, build and 160-route audit pass.
- [x] Scoped composite responsive/visual/manual acceptance and prior cleanup complete.
- [x] Required local integration gates pass; AS01 remediated with reviewed private guard and installed-consumer proof.
- [x] Frozen build 9 report/doc reconciliation complete and unchanged.
- [x] Build 10 snapshot remains immutable; dependency remediation integrated with separate provenance, tests and audit evidence.

**Handoff uses the final frozen-source report.** Exact postflight export and native
acceptance are recorded there; old frames are never relabeled as fresh captures.
Production and external field/device checks require their own authorized execution.
