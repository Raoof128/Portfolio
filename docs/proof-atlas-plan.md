# Proof Atlas delivery ledger

Current handover is recorded in [Portfolio handover](./portfolio-handover-2026-10-12.md).
The final lock-screen export is `RAlsc85jKQO_lr4A2e_Ie`; the performance
measurements below belong to the earlier `T36VJ57GLEBYrLGFmDAY1` export and
were not rerun on the final lock-screen export. This ledger retains its original
historical evidence and partial lifecycle coverage.

This is the acceptance ledger for the ResearchOS V2 Proof Atlas work. A checked item requires current build or test evidence; baseline captures alone do not count as implementation approval. This plan is intentionally concise and remains open until every required gate is reviewed.

## Baseline and scope

- [x] Isolated branch created from `main-research-os-polish-2026-10-11`: `main-proof-atlas-2026-10-11`; approved in-progress search, footer, and appearance fixes preserved. No commit, push, merge, or deployment.
- [x] Frozen local baseline identity recorded: export build ID `pEndLxokmRQcikQpQu1gD`; SHA-256 `9476e0afd3f9da68a64e6ec58631191fd3eaca62c9f5a377e7517fe9a89e59ea` is for `out/_next/static/pEndLxokmRQcikQpQu1gD/_buildManifest.js` in the frozen export. The private source inventory separately records 270 source records; that count is not the hashed export file. The production audit covers 160 routes and the candidate prerendered 168. Browser stayed on the one existing preview at `127.0.0.1:4398`.
- [x] Baseline welcome, project index, Project Simurgh, Project Zurvan, and Invisible Window captured at desktop and 390×844 mobile viewports; desktop workspace captured at desktop. Capture observations are inline in the CUA session; screenshot bytes were not exported to disk because the browser policy rejected the export attempt. See the private evidence record for capture conditions and this limitation.
- [x] Three controlled mobile welcome LCP samples recorded with frozen export; see private `baseline-performance.json`. These are local lab observations, not field Core Web Vitals.
- [x] Root reviewed baseline and rendered candidate states inline; final screenshot export is still unavailable through the browser tool.

## Acceptance ledger

- [x] Three distinct Proof Atlas modes are implemented; root reviewed their state changes and project-specific evidence navigation. Motion-disabled static geometry is covered by focused tests.
- [x] Three evidence stories are implemented, sourced, and linked; root reviewed the rendered stories and focused component tests cover controls, selected states, and localized API labels.
- [x] Welcome supports direct entry and workspace unlock/resume; root confirmed unlock resets scroll and leaves the heading below the sticky header.
- [x] Artwork-to-dossier navigation is immediate and uses a coordinated, reduced-motion-aware entry reveal. It does not claim a shared-art morph or duplicate the animated artwork tree; the shared-element limitation is documented below.
- [x] Shared shell and project discovery received the approved readability, spacing, footer, search, resume, and publications refinements; the corrected 640-row localized route/theme/viewport DOM matrix had no final predicate failures.
- [x] Project discovery covers all 13 projects; tests and root-render review cover filtering, selection, correct project routing, and compact layouts.
- [x] English, Persian, Arabic, Spanish, and Chinese document identity/direction, plus light/dark state, passed the corrected DOM route matrix. Final IAB spot check confirmed Windows/macOS API identifiers render LTR in RTL content.
- [x] 390×844 and 1280×720 matrix checks had no overflow. Root reviewed Persian 320px in both themes and 768px tablet with no horizontal overflow; Enter and Atlas keyboard selection worked. No physical-device or screen-reader claim is made.
- [x] Final IAB review confirmed RTL API identifiers render LTR in visible fa story states, reduced-motion/contrast/transparency media, no stacked story reveal, and correct keyboard entry/Atlas selection routing.
- [x] Motion is progressive enhancement with static readable defaults, reduced-motion suppression, and focus cancellation for dossier choreography; no animation-only information or navigation delay. Dossier reveal starts at 96% opacity so first-frame content remains visible/measurable.
- [x] The final local Simurgh performance retest is recorded below. On build `T36VJ57GLEBYrLGFmDAY1`, three matched runs of `P.os-project-lead` measured 1,664/1,272/1,300 ms (median 1,300; range 1,272–1,664), passing the proposed ≤1.5 s median and ≤2.0 s max lab gate. The immediately preceding Atlas-split candidate `pWlsPfl08X8wFyUpg8iCF` measured 2,124/2,216/2,264 ms (median 2,216). Fresh frozen-export samples were noisy, so this does not establish return to the historical baseline. Final FCP equaled the single buffered LCP entry; the LCP painted area stayed 98,385 px². Transfer remained 391,680 bytes/58 resources. These are local lab observations, not field CWV.
- [x] Static export and local production-style preview pass; 168 routes prerendered and no runtime serving dependency or experimental Next.js navigation integration was introduced.
- [x] Eight representative final screenshots were visually inspected inline: home and each of the three evidence routes on desktop and phone, including Persian and Arabic RTL. CUA exposes no supported durable screenshot export; this is representative visual review, not visual inspection of every matrix case.
- [x] Full unit, type, lint, schema, security, route/export, and local production-audit checks passed; no release, deployment, or commit was performed.

## Rendered and interaction matrix (scoped status)

- [x] Root rendered-review verified each Atlas mode's state, correct project route, and fixed selector overlap; final targeted checks reconfirmed story direction and motion behavior. Zurvan keyboard selection kept the matching dossier URL, and no Atlas controls remained in the selected dossier.
- [x] Root confirmed welcome unlock resets the document to the top, focuses the destination heading without a second scroll jump, and leaves it below the sticky header. Skip-link behavior is covered in source tests.
- [x] Historical `CopyweWtLgJA069LDIXod` review: the 640-row DOM matrix covered five locales, two themes, 1280×720 and 390×844; root separately reviewed Persian at 320px in both themes and a 768px tablet without overflow. The later PEL welcome smoke confirmed its H1, dark appearance, and no overflow at 390px.
- [x] Final focused 80-state DOM matrix on build `T36VJ57GLEBYrLGFmDAY1`: home and three evidence routes × five locales × two themes × desktop/phone. Correct `lang`/`dir`, page and story presence, theme, no horizontal overflow, home Proof Atlas presence, and absence of desktop Selected Work nodes passed in all states. This bounded check is separate from the earlier 640-route matrix.
- [x] Historical build `CopyweWtLgJA069LDIXod`: the export sitemap inventory covered all 160 published localized routes × 2 themes × desktop/phone (640 combinations); exact paths, localized document languages, visible route identity, theme state, and horizontal overflow checks passed. One transient first-navigation dark sample on `/zh/projects/simurghforge` under saved Light was corrected to Light after settling/re-navigation; a later saved-Light visual review showed Light with no visible defect but does not rule out a prepaint flash. Targeted screenshots remain inline-only because this browser session exposes no durable export path.
- [ ] Inactive/minimized lifecycle coverage remains partial: live review confirmed `activeAtlasButtons=0` behind a Zurvan dossier. No pointer animation frame was directly instrumented in the browser; source tests cover its motion gating.
- [x] Historical PEL-targeted IAB review confirmed reduced-motion, contrast, and transparency settings and computed dossier/story/heading animation suppression with opacity 1; focused source tests cover Atlas static geometry and usable controls.
- [x] Final T36 keyboard check focused the Simurgh “Context provenance” boundary and pressed Space; `aria-pressed` changed from false to true. Under reduced-motion emulation, `prefers-reduced-motion: reduce` was true and the dossier's computed animation was `none` with `0s` duration; the emulation was then cleared. Temporary viewport, CPU, network, cache, and media overrides were reset.

### Local performance samples

Three-run, same IAB tab, same route and profile comparisons: Chrome 155; 390×844 CSS px, DPR 1, `mobile:false`, CPU ×4, 150 ms latency, 200,000 B/s down, 93,750 B/s up, browser cache disabled, 10-second buffered performance observation. Values are LCP median (range) in milliseconds.

| Route           | Historical frozen `pEndLxokmRQcikQpQu1gD` | Pre-fix Atlas-split `pWlsPfl08X8wFyUpg8iCF` |         Final `T36VJ57GLEBYrLGFmDAY1` |
| --------------- | ----------------------------------------: | ------------------------------------------: | ------------------------------------: |
| Welcome         |         992 (984–1204), `H1#os-lock-name` |                                 not sampled |                           not sampled |
| Projects        |                       996 (984–1516), `P` |                                 not sampled |                           not sampled |
| Simurgh dossier |     1924 (1888–1968), `P.os-project-lead` |        2216 (2124–2264), same lead selector | 1300 (1272–1664), `P.os-project-lead` |
| Resume          |             1068 (1000–1216), resume text |                                 not sampled |                           not sampled |

Additional candidate diagnostics (three-run LCP median/range; transfer bytes) were: `VAa6E2De2DnCHIRh9YK-f`, 2,192 ms (2,160–2,820), 382,309 bytes; `t89UPB3tErmKfb9y0hbtE`, 3,140 ms (2,200–3,340), 382,239 bytes; final `T36VJ57GLEBYrLGFmDAY1`, 1,300 ms (1,272–1,664), 391,680 bytes. A fresh frozen-export set was 3,504/5,120/3,028 ms (median 3,504), and a fresh pre-fix PEL set was 2,220/2,208/2,232 ms (median 2,220); this variance does not support a definitive historical baseline-return claim. The 744 ms pre-adjustment sample is excluded as non-comparable because its LCP contributor was a sidebar link. The accepted change aligns the fallback reading window's settled geometry with the persistent workspace handoff while retaining the 96%-to-100% dossier opacity fade. Final transfer was 391,680 bytes across 58 resources; the historical frozen transfer was 363,123 bytes, so the final byte count did not fall. These are route-specific local lab data, not field CWV.

## Proposed implementation slices

1. Atlas artwork + welcome entry: Proof Atlas artwork/modes, copy, CSS, and scoped welcome treatment.
2. Evidence stories: sourced story components, copy, CSS, and dossier integration.
3. Shared shell + project discovery: after slices 1–2 release overlapping files, unify `ResearchOS`, `WorkspaceWindows`, project explorer and thumbnails, shared styles, readability, search/filter, dossier continuity, resume/publications, and navigation behavior. Keep ownership coordinated to avoid concurrent edits to shared CSS and lifecycle components.

## Shared-art transition design

Prefer a non-blocking route navigation and a brief coordinated title/evidence entry reveal. The shared shell now has a short dossier content reveal with a reduced-motion override; it makes no shared-element claim and does not duplicate animated artwork. If preserving image continuity materially improves the journey, permit only one disposable overlay made from a static thumbnail snapshot or existing static asset. Key it by project slug and source instance; arm it once from the visible source only, hide that source while active, and do not attach transition IDs to retained or hidden views. After destination commit, measure its visible static cover and animate the overlay with WAAPI; then remove it and reveal the destination. Bound it to a short duration and timeout, ignore stale slug/source tokens, and clean up on completion, navigation mismatch, unmount, visibility interruption, or reduced motion. Destination route loading must never wait for animation. If any lifecycle case is uncertain, retain the coordinated reveal and record the limitation.

## Performance budget proposal

Use the recorded local low-end mobile profile as a regression gate: viewport 390×844 CSS px, DPR 1, `mobile:false`, CPU ×4, 150 ms latency, 200,000 B/s down, 93,750 B/s up, browser cache disabled, 10-second observation window. For three fresh runs on each selected route, target LCP median ≤1.5 s and no run >2.0 s; report FCP, CLS, resource sizes, median, and range. The baseline welcome LCP is text (`H1#os-lock-name`), so preserve text-first rendering and do not make it depend on the hero image. Keep non-home artwork off the critical route path, load decorative media lazily, and avoid new heavyweight animation/canvas dependencies. Revisit the numeric gates if later baseline variance or route scope makes them unsuitable; field good-LCP target remains the separate standard of p75 ≤2.5 s and requires field data.

## Source references

- Next.js static export: <https://nextjs.org/docs/app/guides/static-exports>
- Next.js viewTransition configuration (marked experimental/not recommended for production in indexed official documentation): <https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition>
- React `<ViewTransition>`: <https://react.dev/reference/react/ViewTransition>
- Motion shared layout IDs: <https://motion.dev/docs/react-layout-animations>
- Motion reduced motion: <https://motion.dev/docs/react-use-reduced-motion>
- Cloudflare Pages static serving: <https://developers.cloudflare.com/pages/configuration/serving-pages/>
- MDN View Transition API: <https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API>
- W3C WAI Pause, Stop, Hide: <https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide>
- MDN Web Animations `Element.animate()`: <https://developer.mozilla.org/en-US/docs/Web/API/Element/animate>
- Playwright visual comparisons: <https://playwright.dev/docs/test-snapshots>
