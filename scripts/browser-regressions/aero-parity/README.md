# Controlled Aero comparisons

This diagnostic harness compares **actual exported component markup and CSS** with the installed, untouched `7.css@0.21.1` scoped stylesheet. It does not compare whole portfolio pages with an unrelated documentation layout and does not generate an automatic “parity score”.

Start the exact static export under the project's local Wrangler preview, then run from the repository root:

```sh
PORTFOLIO_CHROMIUM_PATH=/usr/bin/chromium node scripts/browser-regressions/aero-parity/snapshot.mjs before
node scripts/browser-regressions/aero-parity/compare.mjs before
# Make the implementation change, rebuild, and serve the new export.
node scripts/browser-regressions/aero-parity/snapshot.mjs final
node scripts/browser-regressions/aero-parity/compare.mjs final
node --test scripts/browser-regressions/aero-parity/png-diff.test.mjs
```

`PORTFOLIO_PREVIEW_ORIGIN` defaults to `http://127.0.0.1:4398`. Chromium's executable can be selected with `PORTFOLIO_CHROMIUM_PATH`. The browser must be able to launch in the execution environment. No additional image-processing dependency is required. Use `AERO_COMPONENT=close` to rerun a single component; that writes a separate results file and does not replace the full matrix result.

The snapshot stores four actual routes, their rendered HTML and stylesheet text, whole-page screenshots, application source hashes, Git identity, exported version identity, browser version and capture conditions. Existing phase snapshots are protected from accidental overwrite. Choose a new phase name, or use `--replace` explicitly. `--extend` may add routes to a snapshot only when its export identity still matches; the identity is checked before any route or screenshot write. Font assets are copied into the snapshot's `fonts/` directory by the comparison pass; run that pass while the matching export is available. Subsequent comparisons use those frozen bytes and record their hashes.

The comparison writes 56 reference/candidate pairs across 13 component families, plus 50:50 overlays, highlighted differences and JSON measurements under `artifacts/aero-parity/<phase>/comparisons/`. This directory is intentionally ignored. Curated report evidence belongs under `docs/aero-parity/`.

## What is controlled

- Chromium version, 1440 × 900 viewport, DPR 1, browser zoom 1, light colour scheme, matched `#90b5d0` glass-chrome or white document-control backdrop and static animation state match.
- Actual candidate classes, pseudo-elements, ancestor selectors and inherited tokens remain. Scripts are removed from the visual specimen. Unrelated pixels and ancestor backgrounds are hidden by the camera layer; this is disclosed fixture isolation, not application styling.
- The reference uses the candidate's explicit font family through 7.css's documented `--w7-font` variable; the reference retains its native 9pt size and weight. Identical frozen font-face data is available to both documents. This prevents an unrelated Linux fallback from masquerading as a material defect.
- Window specimens have the same external 640 × 240 box and body fill. Original live geometry remains recorded. Window-label/icon and reading-body content differences are excluded from a separately reported chrome mask; raw whole-image metrics remain available.
- Caption and button dimensions remain intrinsic. Fluid search/text fields use a common 320px outer width, selects 240px and tab lists 640px. Original live dimensions and natural heights are retained. Tab labels and document-action icon/text content match.
- Hover, pressed and keyboard-focus states use actual browser actions. Captures occur with the specimen tab in front. Nonvisual custom-property sentinels assert the CSS pseudo-state before capture. This Chromium build applies pointer CSS while `Element.matches(':hover')`/`:active` reports false even in a minimal bare-button reproduction, so those DOM methods are not used as the state oracle. Focus also checks `document.activeElement`. Tab-list interactions target its second tab, not its nonfocusable container.
- Disabled caption/button/input/select specimens exercise supported styling. Synthetic restore and inactive specimens exercise the corresponding classes without claiming a React window-manager test; the separate native journey suite supplies that evidence.

## Reading the measurements

Every pair includes original/live and isolated bounding boxes, computed element/`::before`/`::after` styles and explicit differences. No image is resized. The image utility reports exact differing pixels, pixels with a maximum RGB channel delta greater than 16/255, and mean absolute RGB channel delta. **16 is a reporting band, not an acceptance threshold.** Geometry changes remain recorded even when colours look alike. Images use an opaque capture background; alpha compositing is outside the metric's scope.

The frame chrome mask includes the 7px frame edges, 28px title strip and bottom edge, excluding the union of measured text-node Range and icon bounds with 10px glow padding. The exclusion is clipped to preserve the outer frame edge, and all measured bounds are recorded. It explicitly excludes reading content and exterior shadow; inspect raw pairs and separate caption crops as well. A zero count applies only to that exact specimen, state, browser, font and camera condition. It does not establish whole-site parity, accessibility conformance or cross-platform identity.

The PNG utility's independent encoded fixtures verify identical pixels, known black/white channel deltas, unequal image geometry and decoded overlay/difference outputs. Keep failed fixture calibration attempts separate from accepted application evidence. Do not regenerate old snapshots to disguise regressions.

## Expanded second-pass scope

`--expanded` freezes 15 real route/state scenes, including an unmatched 404, open
window controls/language/search, contact validation feedback and the entered desktop.
The corresponding comparison adds 25 genuine mounted specimens to the original 13:
**134 state pairs across 38 specimens**. The extra cases cover email/textarea/error,
Write-ups inputs, standalone 404 chrome/actions/language, global search, window
commands/grouping, evidence selectors, terminal copy, table cells and scrollbars.
These specimens are samples of component families, not every instance on every route.

```sh
node scripts/browser-regressions/aero-parity/snapshot.mjs round2-final --expanded
node scripts/browser-regressions/aero-parity/compare.mjs round2-final
node scripts/browser-regressions/aero-parity/snapshot.mjs round2-final --expanded --refresh-census
```

An expanded phase cannot be downgraded by a later `--extend` lacking `--expanded`.
An appearance mismatch is also rejected before capture. `--refresh-census` requires
an existing matching export/appearance and writes only `interactive-census.json`;
it never rewrites frozen HTML, stylesheets, PNGs or their manifest. It cannot combine
with `--extend` or `--replace`.

The census excludes hidden, inert and aria-hidden subtrees, checks native content
visibility and closed `details` (while keeping its summary), and records off-viewport
items separately. Its `nameHint` is descriptive text, not a calculated accessible
name. A member's presence does not prove it was activated, unobscured, individually
pixel-compared or screen-reader tested. Coverage reports must keep these distinct.

Reference groupboxes inherit their UI font from an ordinary canonical window/body,
rather than accidentally inheriting the browser's Times New Roman default. Groupbox
content and scrollbar content/geometry are explicitly normalised; state paint and
actual live geometry remain recorded. Research tables keep their authored reading
font, and persistent evidence selection is compared to the canonical active button
face. Those adaptations remain visible in raw measurements.

The scrollbar specimen explicitly relaunches Chromium without Playwright's default
`--hide-scrollbars`; other specimens retain normal headless conditions. It captures
real thumb/arrow paint, targets the thumb centre, asserts scrollTop100, and checks
that holding the pointer changes native thumb paint from hover. A blank crop cannot
pass as native scrollbar evidence. The actual application body retains reading
clearance/paper tokens, so scrollbar thumb proportions and track colours are reported
rather than falsely called identical.
