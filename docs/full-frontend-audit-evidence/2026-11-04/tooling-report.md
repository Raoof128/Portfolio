# Frontend verification tooling review

Personally read **21 scripts files / 4,780 original lines** in full. The two maintained Playwright specs (727 original lines) were excluded because the parent explicitly confirmed full reads; that provenance is separate in `tooling-review.json`. All 23 scoped paths, exact read spans, original/current SHA-256 and current/historical classifications are recorded there. Two new helper/test files were fully read after formatting and are separately identified.

## Corrections

**TK-01 — P3, snapshot evidence preservation.** The old `snapshot.mjs --extend` checked version metadata and then rewrote every base route JSON/PNG while the README described adding routes to a frozen phase. Even with the same export, a later capture could replace prior scene bytes. The corrected runner skips existing scenes and carries their original page records/hashes forward. New scene files use exclusive creation unless `--replace` is explicit. Extension/census now requires matching local export digest, existing capture hashes and origin/browser/viewport/DPR/locale/timezone/reduced-motion/colour/appearance conditions before route writes. Earlier snapshots without byte-identity fields require a new phase. Original capture data and historical audit evidence were not changed.

The source catalog now also includes untracked TypeScript/CSS (excluding `work/` scratch), so new implementation files are not omitted before commit. README contract and test command are updated. The index manifest intentionally gains newly captured pages; existing route JSON/PNG bytes and page entries remain unchanged.

**TL-02 — optional tool availability deadline.** The initial Go compiler `version` subprocess ran before the test timeout without its own bound. It now has a five-second timeout and 4 KiB output cap. A deliberately stalled synthetic compiler exercised the actual optional CLI and returned a clean explicit skip after 5,133.4 ms. The published Go sample and its tests are unchanged, and no real Go compilation ran in this lane.

## Validation

`node --test scripts/browser-regressions/aero-parity/snapshot-integrity.test.mjs scripts/browser-regressions/aero-parity/png-diff.test.mjs` — **8 passed, 0 failed**, 1,060.7 ms (`tooling-tests.log`). Four new regressions execute the real snapshot CLI/file writes with an explicitly synthetic browser facade, proving original scene preservation during extension, pre-write browser/export/version/capture rejection, no overwrite of partial captures, untracked source inclusion and deterministic export identity. They do not claim native browser or visual verification. Existing four independent PNG fixtures remain green.

Targeted ESLint returned zero errors/warnings (`ui-tooling-lint.log`); Node syntax checks for the changed CLI and optional Go gate pass; diff whitespace checks pass. `go-probe-timeout.log` preserves the bounded availability-probe result.

## Complete-scope assessment and remaining limits

- Export/HTTP/security/schema gates are current and separate. Static regex checks establish metadata/discoverability expectations, not rendered visibility/accessibility. Production HTTP probes sample three detail families per locale; HEAD equality is expressly not byte identity.
- Fixed CSP/header expectations prevent weakened input policies from certifying themselves. Artifact validation bounds and restricts published namespaces, symlinks, source/private types, execution controls, redirects and disclosure fields. Synthetic placeholder HTML in its fixtures deliberately isolates artifact structure; the separate agent audit owns HTML metadata semantics.
- Braces regressions use the installed real Next consumer chain, exact vendor/tar/lock identities, positive consumer behavior and isolated memory/time-bounded hostile fixtures. No guard worker was executed during this read-only review.
- Controlled parity compares sampled component/state families with disclosed camera/content/font normalization. Raw geometry and image metrics remain separate from the chrome mask. The RGB band of 16 is diagnostic, not an acceptance threshold; alpha is intentionally outside opaque screenshot scope. PNG parsing assumes trusted locally generated supported screenshots.
- Both CUA helpers explicitly preserve the superseded multiple-retained-app model. They were fully read, classified historical and not executed or used for current acceptance. The lens-map script is an offline authoring utility; it was not run and the original asset remains unchanged.
- The new local export digest assumes the configured preview serves that matching local `out/` tree. It is not a remote asset-byte verifier. Native visual/browser and final application build evidence remain with the parent. No dependency, public asset, application build, deployment or root log was changed in this tooling lane.
