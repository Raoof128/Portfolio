# FORMA animation refinement — 13 November 2026

## Design and implementation

The refinement keeps the existing kinetic-laurel identity and shared project
frame. Twelve veined enamel leaves surround eight brass blades, with engraved
rings and a six-lobed centre. Static gradients supply depth; no filters, canvas,
external image requests, runtime dependencies or React frame loop were added.

The outer layer rotates once in 60 seconds, the inner layer counter-rotates in
40 seconds, and the centre eases through a restrained eight-second breathing
cycle. The complete composition remains visible without motion. Each animated
group explicitly uses the SVG viewBox as its transform reference and shares its
120,120 centre. Unique React IDs scope every reusable path and gradient.

Pause preserves animation phase. The existing artwork lifecycle pauses inactive,
offscreen and hidden-document artwork; thumbnails remain still. Reduced motion
removes all three animations. The decorative SVG is hidden from assistive
technology and cannot take keyboard focus. No dossier or 7.css control styles
were changed.

## Research consulted

Sources were checked on 13 November 2026. The dated specification is a candidate
recommendation, not a guarantee of identical implementation in every browser.

- [SVG 2, 6 October 2026: Animating SVG Documents](https://www.w3.org/TR/2026/CR-SVG2-20261006/animate.html): CSS animations and the Web Animations API are supported animation mechanisms. Used persistent CSS animations inspected through the browser animation API.
- [MDN: transform-box](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-box): makes the transform reference box explicit. Used `view-box` with a common centre rather than each layer's differing bounds.
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion): honours the operating-system preference. Retained a complete still composition.
- [7.css documentation](https://7css.vercel.app/): semantic controls and scoped styling. Existing figure, pause button, tabs, search and page layout are retained.

## Verification

- Revised export: all nine Playwright regressions passed, three each in Chromium,
  Firefox and WebKit. They cover phase-preserving pause/resume, reduced motion,
  search navigation and shared fragment history/focus.
- All 21 artwork motion/thumbnail lifecycle unit tests passed in two files.
- Production build and TypeScript passed (173 generated pages); changed-component
  ESLint passed. Static security audit: 1,099 files passed. Route audit: 165 URLs,
  zero warnings.
- All 16 revised artwork layout combinations passed: Chromium/WebKit ×
  English/Persian × 390/1440 pixels × light/dark. Checked SVG proportions,
  centring, gradient references, duplicate IDs, overflow and reduced motion.
- A 120-frame sample had FORMA median 49.9 ms / p95 83.3 ms and the existing
  Syllabus-Sync median 66.7 ms / p95 100.1 ms, with no page/console errors. The
  machine had load average 13.44 and 12% free memory, so this is not a clean
  performance benchmark or a smooth-frame-rate claim. The sample is retained.
- Desktop and 390-pixel artwork captures were inspected visually. See
  [artwork](polished-animation.png) and [mobile](polished-mobile.png).

## Safari follow-up

Before this refinement, the deployed `ce0ee27` page passed all three WebKit
regressions and the assertions in eight English/Persian, phone/desktop,
light/dark combinations. Installed Safari 27.2 was also checked through its
native UI: opening FORMA, pause/play labels, Evidence tab, arrow-key movement to
Methods, mixed-case search and Escape dismissal worked. Safari WebDriver was
unavailable because remote automation is disabled; no permission was changed.

The eight-case WebKit run logged 54 prefetch-related page errors while navigating
between pages. A focused probe reproduced these during a forced navigation,
including a cancelled request, and recorded none while either page was settled.
This is a documented WebKit/navigation caveat, not a zero-error matrix claim.
Native Safari's UI smoke test predates the visual refinement; the revised artwork
is covered by the WebKit regression run. Physical iPhone/iPad and assistive-
technology checks remain outside this desktop verification.

The first local regression attempt used a preview server without the export's
English route aliases: two tests failed on 404 pages, one was interrupted, six
did not run. After correcting the fixture, all nine passed. An initial layout
probe raced hydration and was corrected to wait for the mounted explorer.

## Reproduce

Serve the static export using the repository's Cloudflare Pages preview setup,
then run:

```sh
npx playwright test forma.spec.ts --workers 1
npx vitest run src/components/os/ProjectMotion.test.tsx src/components/os/ProjectThumbnail.test.tsx
```

Set `PORTFOLIO_PREVIEW_ORIGIN` to test a different preview origin.
