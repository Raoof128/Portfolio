# Changed-source coverage

This pass changed **23 application/style/test files** and **six browser-harness files**. All 29 were examined completely by their owning review lane, with final changed regions independently re-reviewed. The [machine-readable manifest](evidence/source-manifest.json) records hashes, line counts, ownership and build/validation identity. This is 100% of this explicitly declared changed-source scope, not a claim of a second complete repository audit. The prior 268-file full audit remains separately identified in [its ledger](../audits/frontend-review/file-coverage.md).

| Exact source path | Responsibility and action | Coverage / status |
| --- | --- | --- |
| [scripts/browser-regressions/aero-parity/README.md](../../scripts/browser-regressions/aero-parity/README.md) | Reproduction commands, scope, fixture normalisation and snapshot protection. | Complete / verified within recorded scope |
| [scripts/browser-regressions/aero-parity/compare.mjs](../../scripts/browser-regressions/aero-parity/compare.mjs) | Controlled canonical/candidate state specimens, geometry, measured masks, screenshots and differences. | Complete / verified within recorded scope |
| [scripts/browser-regressions/aero-parity/png-diff.mjs](../../scripts/browser-regressions/aero-parity/png-diff.mjs) | Decode opaque browser PNGs and report exact/raw/masked RGB differences with valid overlays. | Complete / verified within recorded scope |
| [scripts/browser-regressions/aero-parity/png-diff.test.mjs](../../scripts/browser-regressions/aero-parity/png-diff.test.mjs) | Independent encoded image fixtures verify four nontrivial metric behaviours. | Complete / verified within recorded scope |
| [scripts/browser-regressions/aero-parity/snapshot.mjs](../../scripts/browser-regressions/aero-parity/snapshot.mjs) | Freeze actual DOM/CSS/fonts and reject unsafe phase replacement or mismatched extension. | Complete / verified within recorded scope |
| [scripts/browser-regressions/playwright/portfolio.spec.ts](../../scripts/browser-regressions/playwright/portfolio.spec.ts) | Native Tab traversal, opaque preferences, forced-colour diagram/breadcrumb checks and Firefox fixture correction. | Complete / verified within recorded scope |
| [src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx](../../src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx) | Use the canonical tab menu structure while retaining keyboard tab behaviour and research content. | Complete / verified within recorded scope |
| [src/components/os/Desktop.tsx](../../src/components/os/Desktop.tsx) | Localised native title hints on caption controls. | Complete / verified within recorded scope |
| [src/components/os/ProjectExplorer.tsx](../../src/components/os/ProjectExplorer.tsx) | Remove the duplicate search magnifier and retain the native search field. | Complete / verified within recorded scope |
| [src/components/os/ProofAtlas.tsx](../../src/components/os/ProofAtlas.tsx) | Apply canonical title/body classes conditionally to the desktop window. | Complete / verified within recorded scope |
| [src/components/os/ReadingWindowControls.tsx](../../src/components/os/ReadingWindowControls.tsx) | Let forward Tab leave the portalled move/resize panel correctly. | Complete / verified within recorded scope |
| [src/components/os/ResearchOS.test.tsx](../../src/components/os/ResearchOS.test.tsx) | Verify meaningful caption names and uncancelled forward Tab behaviour. | Complete / verified within recorded scope |
| [src/components/os/ResearchOS.tsx](../../src/components/os/ResearchOS.tsx) | Align fallback/hydrated caption and command structure; remove duplicate search icon. | Complete / verified within recorded scope |
| [src/components/os/WorkspaceWindows.tsx](../../src/components/os/WorkspaceWindows.tsx) | Localised native title hints for modeless window controls. | Complete / verified within recorded scope |
| [src/components/os/controls.css](../../src/components/os/controls.css) | Consolidate semantic action-link faces using canonical control tokens/states. | Complete / verified within recorded scope |
| [src/components/os/project-explorer.css](../../src/components/os/project-explorer.css) | Remove competing field/tab skins and preserve layout/touch adaptations. | Complete / verified within recorded scope |
| [src/components/os/proof-atlas.css](../../src/components/os/proof-atlas.css) | Remove duplicate window paint and supply readable forced-colour diagram/selection tokens. | Complete / verified within recorded scope |
| [src/components/os/reading-window.css](../../src/components/os/reading-window.css) | Remove redundant native-caption and title paint overrides. | Complete / verified within recorded scope |
| [src/components/os/research-os.css](../../src/components/os/research-os.css) | Remove the replacement scrollbar recipe; reuse installed scoped 7.css. | Complete / verified within recorded scope |
| [src/components/os/theme-switch.css](../../src/components/os/theme-switch.css) | Replace a sliding pill with a beveled push face while retaining switch semantics. | Complete / verified within recorded scope |
| [src/components/os/theme-token-guard.test.ts](../../src/components/os/theme-token-guard.test.ts) | Lower existing raw-colour allowances after deleting duplicate paint; no guard weakening. | Complete / verified within recorded scope |
| [src/components/os/win7-desktop.css](../../src/components/os/win7-desktop.css) | Share native window chrome; restore icon silhouettes and body inset. | Complete / verified within recorded scope |
| [src/components/os/win7-explorer.css](../../src/components/os/win7-explorer.css) | Use native fields/select arrow, one Explorer surface and canonical tab treatment. | Complete / verified within recorded scope |
| [src/components/os/win7-logon.css](../../src/components/os/win7-logon.css) | Remove competing switch skin and preserve welcome typography/touch targets. | Complete / verified within recorded scope |
| [src/components/os/win7-pages.css](../../src/components/os/win7-pages.css) | Remove duplicated action-button faces in favour of the shared adapter. | Complete / verified within recorded scope |
| [src/components/os/win7-taskbar.css](../../src/components/os/win7-taskbar.css) | 40px fine-pointer taskbar, running plates, native Start search and inherited RTL selector. | Complete / verified within recorded scope |
| [src/components/os/win7-theme.css](../../src/components/os/win7-theme.css) | Restore native material/font contracts; opaque preference pseudo-elements; narrow forced current-state selector. | Complete / verified within recorded scope |
| [src/components/os/win7-windows.css](../../src/components/os/win7-windows.css) | Canonical frame/title/caption geometry and tooltip hit area, readable Night caption treatment. | Complete / verified within recorded scope |
| [src/components/os/workspace-windows.css](../../src/components/os/workspace-windows.css) | Canonical 27px title and compact native command toolbar. | Complete / verified within recorded scope |

All changed application hashes still match the final build record. Four validation-only files were refined afterward: the snapshot script/README, comparison mask and browser preference fixture. The current manifest identifies these explicitly; no stale tool hash is represented as current.

Current cumulative accounting is **273 files**: 244 retain byte-identical prior reviews, 24 prior files were re-reviewed after changes, and five new harness files (including its instructions) were reviewed. The machine ledger records this provenance explicitly; no old review is labelled fresh.

The supporting changes are `AGENT.md`, `CHANGELOG.md`, the dated scoped-scrollbar erratum in `docs/audits/frontend-review/windows7-fidelity.md`, and the reports/curated evidence under `docs/aero-parity/`. Binary evidence is actual browser imagery; it is not counted as source-line coverage. No package, lockfile, public research asset, original artwork path or translation source changed in this pass.

Verification is grouped in the [cascade audit](css-cascade-audit.md), [component matrix](visual-parity-matrix.md), [browser results](browser-test-results.md), and the independent [window](evidence/window-review.md), [controls](evidence/controls-review.md), [desktop](evidence/desktop-review.md) and [harness](evidence/harness-independent-review.md) reviews.
