# Research frontend audit

Freshly read all **38 assigned files /10,611 initial lines** in full, including tests, legacy diagram helpers, every localized copy dictionary, all original-artwork mappings and every CSS rule. Exact bounded read spans, initial/final SHA256 values and file-specific notes are recorded in [research-review.json](research-review.json). All line ranges are covered; the three edited files were reread in full after the fixes. This audit does not reuse credit from the earlier upgrade review.

Two verified defects were fixed after the parent confirmed the fresh baseline:

- `TerminalCommand.tsx`: overlapping clipboard promises could let an older success replace the latest failure, or an older failure replace the latest success. A pending successful promise after unmount also started an orphan confirmation timer. A per-request counter now rejects stale settlements and is invalidated on unmount. Three deferred-promise regressions failed before the fix and pass after it. The latest-failure/stale-success race was also reproduced against the current4398 static export; see [research-terminal-baseline.json](research-terminal-baseline.json).
- `evidence-story-zurvan.css`: the selected typed-node ledger used black body and title text on Aero Night's dark blue fill. It now uses the existing explorer active color pair and the title inherits the row foreground. The fresh export's actual Zurvan type buttons, Simurgh selected stations/explanations and Invisible platform buttons were checked before making the scoped change. Only the Zurvan ledger needed correction. See [research-live-baseline.json](research-live-baseline.json).

A targeted browser check applied the candidate Zurvan stylesheet to the unchanged4398 export and selected all four types in both appearances. Body and title contrast measured **10.23:1 in Aero Night** and **18.56:1 in Aero**; see [research-live-candidate.json](research-live-candidate.json). This is a candidate-CSS check, not a claim that the parent has already rebuilt the export.

Validation completed:

- Seven assigned suites, **113 tests passed**: TerminalCommand/SignalVortex, ProofAtlas, ProjectExplorer, ProjectMotion, ProjectThumbnail, EvidenceStory and GlobalNotFoundContent.
- ESLint passed for both edited TypeScript files. Prettier and scoped `git diff --check` passed for all three edited files.
- Existing focused tests cover original artwork mappings, lazy imports, offscreen disposal, failed-load retry, reduced motion, hidden-document changes, native control selection, source links, locale data and focus behavior.

The source audit checked native links and keyboard controls, selected-project filtering, delayed announcements, async disposal, pointer RAF cleanup, visibility observers, reduced-motion gates, artwork import cache rejection/retry, explicit schematic evidence limits, RTL identifiers/arrows, long-copy wrapping, narrow reading containers and forced-colour fallbacks. No additional concrete defect was established. A modified-click focus-marker observation in Explorer was retained as an observation in the ledger; native link behavior remains intact and no user-visible failure was demonstrated, so it received no speculative fix.

The upgrade, original artwork, five locales, static architecture and Aero styling remain intact. The frontend fixes changed exactly three owned product/test files, adding75 lines overall. The parent subsequently authorized one maintained browser helper, described below. No dependency/configuration/root-log changes, build or full browser matrix were run by this lane. Final compiled-export verification and the broader responsive/history/focus matrix remain with the parent. Full translation-source reading is not a native-language editorial certification.


## Additional native browser zoom verification

The parent subsequently authorized [scripts/browser-regressions/native-zoom.mjs](../../../scripts/browser-regressions/native-zoom.mjs) as a maintained test helper. Its complete248 lines were read and the final SHA256 recorded as a new file with no pre-audit SHA. The ledger now contains38 original files plus this additional source.

Native zoom succeeded through Chromium155's own `chrome://settings/appearance` Page zoom dropdown in a fresh temporary persistent profile. This uses no extension, policy change, user profile, CSS zoom, viewport resizing or CDP pinch/pageScaleFactor command. At an unchanged1280×1024 outer window, the100% baseline has1280×1024 CSS viewport/DPR1;200% produces640×512/DPR2;400% produces320×256/DPR4. `visualViewport.scale` stays1. Explicit assertions enforce those relationships and reject horizontal document/reading-pane overflow or lost scrolling.

Six observations on the current4398 baseline passed: home, Projects index and Simurgh dossier at both200% and400%. Twelve viewport/scrolled captures and geometry are in [native-zoom-maintained](native-zoom-maintained/geometry.json). All document widths equal the corresponding CSS viewport widths, and dossier pane scroll widths equal client widths. The initial-fold screenshots were inspected; the maintained400% scrolled Simurgh screenshot was also inspected and shows readable flowing text. This sample is supplemental browser verification, not field research or a complete accessibility certification.

Earlier extension trials timed out waiting for their service worker. A separate harness issue was reproduced: Playwright `page.screenshot` generated blank scrolled images under native zoom, while a read-only raw CDP screenshot of the same DOM/scroll state rendered correctly. The maintained helper captures pixels with `Page.captureScreenshot` without clip/emulation options. Those diagnostic failures are tooling limitations, not application failures.

ESLint, Prettier and scoped diff checks passed for the new helper. The parent will rerun it against the final export with additional routes/locales; no application build was performed by this lane. See [native-zoom-notes.md](native-zoom-notes.md) for the command.
