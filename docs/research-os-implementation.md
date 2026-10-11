# ResearchOS implementation

Current implementation and export status is summarized in the
[12 October Portfolio handover](./portfolio-handover-2026-10-12.md). The
implementation history and evidence identities below remain unchanged.

ResearchOS now renders one current application window inside the
existing Next.js portfolio. Each reading view keeps its real, shareable route;
Next navigation continues to own page metadata and browser history. The welcome
screen is a navigation interaction, not authentication. Direct project, article,
résumé and contact URLs open their content immediately.

## Current continuation status

Build 10 below is the immutable UI evidence baseline. Current guarded tooling
integration and the final frozen export are identified in the handoff report.

The earlier independent-window implementation has been superseded by one current
page on 11 October 2026: no opened-page history strip or retained previous pages.
Original-artwork and publication-library features remain implemented. Historical
window/retention evidence below describes those earlier builds only. Frozen build 10 passes the exact default CI
command with 468 tests in 33 files, clean lint, typecheck, six schema tests,
168 generated pages and the 160-route static audit. Build 6 coverage retains its
actual identity; independent reviewers qualify reuse of unchanged behavior.

The new welcome-only Light text token corrects measured contrast over decorative
orbit strokes without changing geometry or artwork. Four regression tests cover
three measured backgrounds and increased-contrast preferences. Native Light
320px views are reviewed in all five languages; the Spanish comparison preserves
glyph geometry and records a sampled contrast minimum of 5.778, previously 4.301.
Five-language build 9 window semantics/keyboard checks add 75 predicates and one
retained Lab motion flow adds eight; these retain their actual source identity.
Fresh build 10 adds15 directional resize,12 Lab pause/restore/resume and ten exact
expanded-to-arrow-resize predicates. Five Light axe scans have zero executed-rule
violations while retaining nine incomplete results/20 node occurrences; bounded
manual dispositions do not establish blanket conformance.

Default native visual acceptance has 1,280 selected frames covering 160 routes
at eight sizes, with a separate 40-frame unlocked-home cohort. Actual captures
remain labeled builds6/8. The qualified build 9 projection accounts for its
inactive short-height query and unused documentation-generated utility. Fresh9
native 200%/400% English and 400% Persian checks pass14 reflow/control predicates.
Build 8 focus, original-artwork,17 emulated-touch and representative Safari/Firefox
checks remain scoped evidence. See the [goal checklist](./research-os-goal-checklist.md).

Four build 8 local timing windows are bounded diagnostics: all observed LCP values
exceed2.5s and bounded CLS is below0.1. Field CWV, INP and a comparable baseline are
unavailable; no speed-improvement claim is made. Temporary diagnostic conditions
are cleared. The historical build 10 full audit fails for five high paths sharing
one upstream braces advisory. Current integration installs the reviewed private
guard and passes full/runtime audits with zero advisories plus its three installed
dependency regression tests. Physical-device, screen-reader, remote CI and
production proof remain unverified. No push, merge or deployment occurred. [Verification and release handoff](./research-os-verification.md) records
exact identities, results and limits. The preceding report remains frozen.

## Experience

- Welcome screen with the Sydney clock, portrait, immediate Enter/skip action and
  direct links to featured work and the served résumé PDF.
- Desktop with five application launchers, featured projects and links to the
  Lab, disclosure policy and recognition archive.
- One current desktop reading window with parent navigation, copy-link
  feedback, minimize/restore, close and bounded title dragging/resize. Expand
  saves the current rectangle; Restore returns to it, clamped to the current
  viewport. Reset window layout returns to the default geometry.
- No opened-page history strip. Navigating to another page or the desktop disposes
  the previous view and local state. Minimize keeps only the current page at its
  current URL and exposes one temporary restore control; close returns home.
- Native modal search across projects, original paper records, articles,
  experiments and page/section actions. Ctrl/Cmd+K opens it, arrows move to
  results, Enter selects and Escape dismisses with focus restoration. Composition
  confirmation does not activate a result.
- Project explorer with 13 dossiers, literal search and category filters,
  Overview/Evidence/Methods anchors, documented schematics and original-artwork
  previews. The visible heading and links carry each preview's information;
  decorative previews are not extra focus targets.
- Each dossier includes its original identity: nine SVG/CSS artworks and four
  Canvas artworks. The dossier and index share on-demand module loading, with
  static index thumbnails, localized dossier Pause/Play/retry controls and
  reduced-motion stills. Hidden, offscreen and paused dossier artwork stops
  running; navigating away disposes the previous page and its effects.
- Research contains separate technical-article and original-publication sections.
  The text/topic filter applies to articles. Publications are browsable, preserve
  original English titles/PDFs and are indexed in global search; no per-paper
  library filter is implemented.
- About, skills, professional experience, certifications, résumé download and
  Contact remain accessible through ordinary routes. Global search also opens
  the résumé's named skills, experience and certification sections. Contact
  opens an email draft; sending happens in the visitor's email application.
- Phones and short viewports show one foreground document with ordinary page
  scrolling and an open-window task strip. Desktop dragging does not shrink into
  a phone interaction. Reading positions survive app switches and size changes
  within the mounted workspace.
- Dark/light appearances, five locales, RTL, clear focus and motion/material
  preferences share the approved monogram, vivid app colours and opaque reading
  surfaces. Glass remains on navigation and controls.

## Keyboard and pointer controls

On a floating desktop, drag the title or resize handle. **Window controls** opens
an anchored nonmodal panel with real directional/size buttons, so dragging is not
required. Arrow keys move or resize within the selected control group; Shift uses
a larger step. Escape closes the panel and restores focus to its launcher; Done
also closes it. The resize handle supports arrows and Escape. Pointer capture and
queued frames are cancelled on interruption, deactivation, minimization, viewport
change and unmount.

Tabbing to an inactive window title does not change its route or activate it.
Enter/Space or pointer activation raises that app. Only the active app's remaining
toolbar controls and document content participate in keyboard interaction.
Minimized tasks expose a localized state description and retain the title's
language/direction. The visible foreground provides one main landmark; retained
background reading content is inert and has namespaced IDs.

## Original monogram and public-web Liquid Glass

The header and dock use an original solid R monogram with a diagonal aperture,
also supplied as a reusable SVG and four-size favicon. It follows the selected
appearance through `currentColor` and stays legible at small sizes.

Telegram's Android [glass component](https://github.com/DrKLO/Telegram/blob/f2908b14133bbffbf7ab04f641ecb5bfaf533242/TMessagesProj/src/main/java/org/telegram/ui/Components/blur3/LiquidGlassEffect.java)
uses public `RuntimeShader`/`RenderEffect` APIs. Its
[shader](https://github.com/DrKLO/Telegram/blob/f2908b14133bbffbf7ab04f641ecb5bfaf533242/TMessagesProj/src/main/res/raw/liquid_glass_shader.agsl)
bends backdrop sampling near rounded edges and overlays translucent tint. The
entire iOS implementation is not private-API-free: its
[legacy glass](https://github.com/TelegramMessenger/Telegram-iOS/blob/f1dd7a2dbd02cbbf513e75d5695d8d36d1cf5838/submodules/TelegramUI/Components/GlassBackgroundComponent/Sources/LegacyGlassView.swift)
accesses undocumented Core Animation classes. These are source observations,
not claims about which paths a particular shipped app runs.

The web material is original CSS. No Telegram source was copied. The dock itself
owns its native blur, translucent tint, one-pixel border and one soft exterior
shadow. It has no separate background element, gradient sheen or inset bevels.
The first repair removed a duplicate SVG filter pass but its separate decorated
material still looked like stacked plates; the follow-up puts the entire material
on the navigation element. Selected apps keep their active dot; filled hover and
keyboard-focus feedback remain. The entrance animates only transform, and focus
outlines can extend beyond the surface. Navigation bars keep ordinary CSS blur.

The 11 October repair removes the second masked SVG backdrop layer. It sampled
and displaced the already tinted material, producing a doubled six-pixel rim.
The original normal-map asset and generator remain as historical source material;
the active dock no longer loads the map or mounts an SVG filter definition.
This is a web glass treatment, not Apple's native Liquid Glass renderer.

There is no animation loop, screen capture, Canvas, shader library, external request
or private API in this material. Reduced transparency and increased contrast use
an opaque surface and disable the blur; forced colors use system colors and remove
the decorative shadow. Reduced motion suppresses transitions and arrival animation.
The opaque unsupported-filter fallback checks both standard and prefixed forms,
so older Safari can continue using its supported prefixed blur. Keep prefixed
backdrop declarations before standard declarations for the current CSS compiler.

Current primary guidance checked on 11 October 2026:
[MDN backdrop filters](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter),
[CSSWG filter effects](https://drafts.csswg.org/filter-effects-2/#BackdropRoot),
[WebKit's unprefixed support](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/)
and [Apple materials](https://developer.apple.com/design/human-interface-guidelines/materials).
Rendered validation remains scoped to the tested browser and viewports; native
Apple material parity and physical-device proof are not claimed.

Historical 10 October 2026 glass-revision measurements, before independent
windows, add **296 gzip bytes of direct homepage JavaScript** and
**584 gzip bytes of CSS** versus the preceding performance pass, plus the separate
6,134-byte map. Existing font preloads and portrait sizes are unchanged. These are
artifact resource sizes, not a browser timing or Core Web Vitals result. Chromium
checks cover both appearances, desktop/phone/RTL sizing, actual lens A/B rendering
and accessibility material fallbacks. At that revision, all 150 tests, the
168-page build and the 160-URL agent audit passed; the initial concurrent test run
hit five timeout failures before the sequential rerun passed. That check used the
local production preview at `http://127.0.0.1:4383/`.

## Historical colour and hierarchy review

The revised palette uses midnight navy and crisp white reading surfaces, cyan/blue
links, white-on-blue primary actions, and vivid blue, teal, amber, violet and coral
app identities. App colour carries through the desktop, dock and window icon;
visible labels and the current-page indicator provide additional navigation cues.
Featured work has restrained blue/teal/violet edges, and static diffused colour
fields give the wallpaper depth without an image request or continuous animation.
The original project artwork retains its own colours.

Current official design and developer guidance was consulted on 10 October 2026:

- [Apple WWDC26 design refinements](https://developer.apple.com/videos/play/wwdc2026/102/)
  add brighter highlights, stronger glass separation and colour to navigation
  icons; accessibility preferences remain part of the material design.
- [Apple branding](https://developer.apple.com/design/human-interface-guidelines/branding)
  and [app icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
  support distinctive content/app identities with restrained navigation chrome.
- [Material colour roles](https://m3.material.io/styles/color/the-color-system)
  and [web.dev CSS colour themes](https://web.dev/articles/baseline-in-action-color-theme)
  inform semantic surface, text, link and action pairs. The web.dev article was
  published in December 2025 and remains current guidance, not a 2026 publication.
- [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
  inform text and icon checks. Solid reading text/secondary text pairs exceed
  4.5:1; primary action text exceeds 5:1 and app glyphs exceed 3:1 at both
  gradient endpoints. Glass uses separate secondary text to allow for changing
  backdrops. These scoped checks do not establish site-wide WCAG conformance.

UI/UX Pro Max and frontend-design guidance were applied to this visual revision.
No new dependency, project-artwork preload or animation loop was introduced.

The colour revision adds **9 gzip bytes of direct homepage JavaScript** and
**595 gzip bytes of CSS** compared with the preceding glass revision.
Eager fonts, portrait and lens-map sizes are unchanged. Light/dark native
scrollbars now follow the appearance instead of inheriting the legacy
black track. Chromium checks cover the final export at 1280px, 390px
and 320px Persian RTL, material preferences and forced-colour focus.
At that revision, all 150 tests, the 168-page build and 160-URL audit passed.

## Historical language sweep and taskbar repair

The localization sweep adds complete Persian, Arabic, Chinese and Spanish prose
for all 13 dossiers, seven articles and three experiments. Titles, summaries,
evidence, methods, diagrams, tags, metadata and article schemas now use the route
language. The shared dictionaries have 428 matching, nonempty leaf values. A
separate reviewer read every translated dossier, article and experiment for
natural wording, technical meaning and factual qualifiers.

The adapters resolve the selected language on the server. Lists and global search
receive compact summaries; detail clients receive one translated document and its
diagram copy. Missing content fails the build instead of silently falling back to
English. Tests preserve numeric evidence, code examples, inline API identifiers,
URLs, citations and publication dates, and record the reviewed English source
revision. Search accepts accent differences, Arabic/Persian keyboard variants,
local numerals and original-title aliases through literal token matching.

UI dates and counts use `Intl`; Persian dates use the Persian calendar, while
Arabic numerals are pinned to avoid different ICU defaults. Date-only publication
values use UTC. Standalone project and résumé years use localized digits with
unchanged machine-readable dates. Paper counts use a neutral label and isolated
count, avoiding language-specific singular/plural agreement. RTL paragraphs and diagrams follow the reading direction; code,
DOIs and original citations remain isolated LTR content. Original English PDFs and
credential titles are clearly labeled, while brands and technology names retain
their official spelling.

The factual review checked Invisible Window against the served 13-page preprint,
especially Sections V-E, VI and VII. Its dossier, article and related short copy
now describe simulated laboratory configurations, no commercial-product testing,
native capture tools for macOS 26, untested Linux, limited behavioral statistics
and the March 2026 tested-version boundary. The article's disclosure timeline and
withheld PoC availability match the paper; the original publication date remains
and the corrected article revision is dated 10 October 2026.

The earlier taskbar revision introduced separate blur/tint and edge-refraction
siblings with a mounted SVG definition. The 11 October repair described above
replaces them with one stable native surface painted directly on the dock. Compact translated labels
and bounded 44px targets remain, alongside reduced transparency, increased
contrast, forced colors and unsupported-filter fallbacks.

Guidance checked for this sweep includes Microsoft's
[Persian](https://download.microsoft.com/download/3/e/c/3ec58a9a-70ff-4a31-8cfd-d185983111be/fas-irn-StyleGuide.pdf),
[Arabic](https://download.microsoft.com/download/5/6/d/56d1774f-ac3f-4ad9-80af-a6dfd5df419d/ara-sau-StyleGuide.pdf),
[Chinese](https://download.microsoft.com/download/1/5/9/159cb91c-b61b-4385-97ca-80ccc7ff1fa0/zho-chn-StyleGuide.pdf)
and [Spanish](https://download.microsoft.com/download/4/3/1/431d9836-40dc-4f2b-aafc-def5c7b5d0f3/spa-neu-StyleGuide.pdf)
localization style guides,
[W3C language/direction metadata](https://www.w3.org/TR/string-meta/),
[W3C bidirectional text](https://www.w3.org/International/questions/qa-bidi-unicode-controls),
[MDN date formatting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
and [public backdrop filters](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter).
The W3C language metadata document is a 2026 draft; the other references are
current guidance, not claimed as new 2026 publications.

That earlier sweep passed ESLint (zero errors, one existing unrelated warning),
TypeScript, all 215 tests in 22 files, the 168-page static build and the 160-route
agent audit with zero warnings. An independent rendered-export review covered all
115 detail routes with 10,051 checks: translated narrative/metadata, 170 project
links, 25 original-paper PDF links, 690 hreflang URLs and 35 original code blocks
(20 article fences and 15 lab examples). The code blocks match their sources
character-for-character. The translation review was performed by independent
agents; it does not constitute native-speaker certification.

A separate historical review covered the other 45 routes with 7,594 checks, including
776 UI/accessibility attributes and all ten corrected security-report email
anchors. The export audit now validates contact URI recipients: it rejected all
ten malformed links in the previous artifact and passes on the corrected build.
The project indexes also pass 130 visible-year/machine-date checks across 65 rows.
All 44 JavaScript files and exported detail HTML pass full narrative/inactive
locale boundary checks.

Production Chromium checks cover all five languages at 320px, six 44×49px dock
targets contained inside the glass, no tested document-width overflow, Persian
RTL diagrams, article/code direction, original-title search and both appearances.
Reduced transparency and increased contrast produce an opaque material; forced
colors use the system Canvas. Native lens A/B checks during development changed
the bevel while leaving the checked centre pixels identical. Temporary test
patterns, styles, media emulation and viewport overrides were removed. The final
production desktop warning/error log for that earlier sweep was empty. Safari/Firefox and deployed
behaviour remain unverified.

Compared with the immediately preceding colour export using the resource method
below, home modern JavaScript is 169,770→170,539 gzip bytes (+769), and home CSS
is 20,602→20,797 gzip bytes (+195). Project-list JavaScript is 171,323→172,205 B;
the Simurgh dossier is 176,482→176,898 B. Eager font bytes (40,480 B), welcome
portrait (118,458 B) and the separate lens map (6,134 B) are unchanged. These are
declared artifact weights, not browser timings or Core Web Vitals.

## Implementation and safeguards

Server pages select the active locale and compact list/search props. The shared
shell receives these props rather than importing all document prose. `Desktop`
is now rendered within the client window workspace; the search catalog builder
and localized document adapters remain on the server.

`OSApplicationBridge` wraps one concrete page client element. Its SSR fallback
keeps the document readable before hydration. A layout Effect captures initial
project query/category, bounded named field values, focused input/caret and
reading offset, then publishes the concrete leaf and snapshot. The workspace
holds only the current element under its canonical-route key; it never caches Next's
live router outlet. The initial state context is consumed by supported clients.
React `renderToString`/`hydrateRoot` tests prove text/focus/caret handover in JSDOM,
not native autofill or a complete Next browser navigation cycle.

`workspace-model` holds at most one validated current page, with minimize/restore
and close. `os-app-schema` validates the closed 31-route inventory per locale.
The application map is replaced on navigation, and home/recovery routes clear it.
Previous documents, drafts and geometry are unmounted, never accumulated.
`WorkspaceWindows` renders the current view and, only while minimized, one restore
button. There is no opened-window strip. Native Next routing still owns browser
back/forward, fragments and metadata; no custom history or network loader is added.
Minimized/locked content suspends effects with React `Activity`; navigation disposes
it entirely. The controls portal belongs only to the current visible desktop page.

`use-reading-window` records reading offsets separately from bounded geometry,
restores them on reactivation and desktop/phone transitions, and retains the
pre-maximize rectangle until restore or reset. `window-geometry` reserves the
header/dock and clamps dimensions after viewport changes. Floating windows require
at least a 1024×600 viewport; smaller or shorter views use page scrolling. Lab
layout has a pane-container breakpoint, and project previews respond to their
available content width. Mobile bottom space reserves the task strip and dock.
Build 8 native geometry checks confirm all 13 narrow preview stages and five phone art views. Canvas children use bounded grid tracks; square SVG artwork sizes from the available stage height, avoiding intrinsic-height cropping.

At viewport heights of320px or less, shell/navigation/title/task/dock controls
enter document flow, so browser zoom leaves reading content and controls reachable
through ordinary scrolling. The rule uses no extra script, API or dependency.

Window state, geometry, filters, draft values and reading positions live only in
the mounted locale workspace. Reloading or leaving that locale resets them.
Appearance is the only preference stored locally. Clipboard/storage operations
have fallbacks; pointer work, observers and feedback timers have cleanup. Search
uses literal normalized text rather than query-derived markup or regular
expressions. The native dialog supplies modal behavior and focus restoration.

Static HTML plus the existing `noscript` styles preserve ordinary navigation and
reading when JavaScript is disabled; window management requires hydration. The
minute-aligned Sydney clocks, public assets, Cloudflare static-export routing,
security headers and JSON-LD/canonical/hreflang contracts remain. Contact has no
form backend, account session or claimed encrypted transport. No analytics or
third-party UI service was introduced.

## Verification status

The frozen application candidate is build 10 (`v0EKrWZjehi8UYOrVO-09`) on
`main-frontend-gauntlet-2026-10-10`, based on
`0efeb54962c60d2f22468ed64221c9f89d01e293` plus preserved uncommitted work.
Its 236-record source manifest SHA-256 is
`cc4079335f559372c66c37dd59511d095ab325cfd74609c08127d54da45577db`.
The isolated export has 1,085 hashed files. The checkout's older `out/` is not this
export. Seven postflight documentation changes are separately identified.
Documentation is part of Tailwind scanning input; rebuild the exact release tree.

Build 10 passes **468 default CI tests in 33 files**, clean lint/typecheck, six
schema tests, **168 generated pages** and **160 audited canonical routes with
zero warnings**. Build 6 coverage retains its identity; the new runtime delta
from build 9 is CSS-only and affects Light Welcome muted text.
Coverage is89.5% statements/80.37% branches/89.04% functions/90.67% lines; it is
not a fresh build 10 coverage execution.

Native Chrome workspace/navigation helpers passed65 assertions on build 6.
Build 8 adds7 focus/phone-restoration predicates,17 emulated-touch predicates and
actual English Welcome skip activation. Physical touch and assistive speech are
separate. Actual build 9 Chrome200%/400% and Persian400% reflow pass14 predicates,
including ordinary scrolling,44px controls and exact minimized-task restoration.
The old8 low-height obstruction remains preserved as diagnosis.

The completed default matrix selects1,280 native frames:150 routes on build 6 and
10 Projects/Hall routes on build 8, each at8 sizes. All160 routes were visually
reviewed. The unlocked five-locale Home supplement adds40 frames. All160 default
axe4.14 scans have zero executed-rule violations;164 incomplete results/2,156 node
occurrences keep scoped manual dispositions. They are not blanket WCAG conformance.
Independent9 projection checks all linked CSS orders, source and semantic content.
The new height query is inactive at every recorded matrix size; the sole extra
unused Tailwind utility matches no app element. No old capture is relabeled9.

All13 original artworks have bounded native still/geometry proof and5 scrolled
phone-art views. Safari27.0.1 and Firefox Nightly(Gecko) have8 original Zurvan/
Syllabus fresh-filter/retained-window observations on build 8. The plaintext-local
preview removes only CSP upgrade-insecure-requests; production headers are unchanged.
Safari captures are genuine JPEG, Firefox crops PNG. This is representative engine
coverage, not every route/size/pose in each engine or SVG backdrop filter parity.

Fresh build 10 checks pass115 detail routes/10,086 content checks,160 routes/12,619 SEO/
link checks,115 schema-language routes,five 432-leaf dictionaries and605 interface
copy checks. Six PDFs,13 artwork modules,31 public assets,research facts and35 code
blocks are preserved. Agent translation review is not native-speaker certification.

Build 8 local one-sample Home/Projects/Simurgh/Résumé LCP is5,728/4,140/2,752/3,276ms;
bounded CLS is0.08940/0.01171/0/0.03902. Conditions:390×844 CSS,DPR1,mobilefalse,
CPU4×,latency150ms,download200,000B/s,cache disabled,ten-second late-buffered window,
shared host. No field,INP,controlled baseline or speed claim follows. Build 9 direct
modern JSgzip totals remain168,234/171,919/176,072/185,134B; CSS adds926B per listed
route. Browser diagnostic conditions are restored. Resource weights are not CWV.

Historical build 10 retains its five-high full audit. Current local integration
passes the full/runtime audits with zero advisories after installing the
attributed private guard; code assurance remains separate from registry identity.
Older production and remote CI have no candidate execution. No push, merge,
deployment, audit suppression or owner waiver has occurred.
[Dependency maintenance](./dependency-security.md) records the actual patch limits.
See [verification and limitations](./research-os-verification.md) before release.

## Historical measured loading weight

These 10 October 2026 measurements precede the independent-window continuation.
They are not current resource budgets. Compared with that preceding ResearchOS
export using unique direct asset
references, gzip level 9 per JavaScript/CSS file, and raw font/image bytes:

| Resource                           |        Before |        After | Reduction |
| ---------------------------------- | ------------: | -----------: | --------: |
| Home modern-browser JavaScript     |     215,323 B |    169,465 B |     21.3% |
| Projects modern-browser JavaScript |     252,036 B |    171,018 B |     32.1% |
| Simurgh modern-browser JavaScript  |     254,663 B |    176,177 B |     30.8% |
| Eager font preloads                | 136,352 B (7) | 40,480 B (1) |     70.3% |
| Welcome portrait                   |     270,547 B |    118,458 B |     56.2% |

Home CSS increases by 1,069 gzip bytes for the visual/accessibility polish. The
homepage client manifest contains no project-artwork component references.
These figures exclude the nomodule polyfill, runtime prefetch, artwork loaded on
demand, cache effects and timings. Arabic/Persian fonts still load when used.
They establish smaller declared resources, not field Core Web Vitals or an
equivalent percentage improvement in page speed.

## Guidance consulted

Applied the installed UI/UX Pro Max, frontend-design and React performance
guidelines while preserving the approved ResearchOS design. Current official
documentation was checked on 10 October 2026; changes remain compatible with the
then-installed Next.js 16.2.6 and React 19.2.3. The current package pins Next.js
16.3.8 and React 19.2.3; current gates must use the checked-in lockfile:

- [Next.js client boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components),
  [lazy loading](https://nextjs.org/docs/app/guides/lazy-loading),
  [font preloads](https://nextjs.org/docs/app/api-reference/components/font),
  [prefetching](https://nextjs.org/docs/app/guides/prefetching).
- [web.dev animation performance](https://web.dev/articles/animations-guide) and
  [Chrome native dialog transitions](https://developer.chrome.com/blog/entry-exit-animations).
- [Apple materials](https://developer.apple.com/design/human-interface-guidelines/materials):
  glass controls and stable reading surfaces; respect accessibility preferences.
- [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
  and [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion).

## Run and review

From the repository, use the supported Node version in `.nvmrc`:

```sh
npm ci
npm run dev
```

Open the printed URL. Enter the workspace, open Projects, set a filter, then open
About and return to Projects through its dock; expect a fresh page. Test minimize, expand,
restore, close and the Window controls panel. For production rendering, build and
serve `out/` with a static host that implements `public/_redirects` and
`public/_headers`; `next start` is not a static-export preview.

Current executable gates:

```sh
npm run lint
npm run typecheck
npm run test:ci
npm run test:schemas
npm run test:dependency-security
npm run test:coverage
npm run build
npm run audit:agents
npm audit --omit=dev --audit-level=high
npm audit --audit-level=high
```

### Codex CUA workspace regression

Historical build 6 helper `scripts/browser-regressions/researchos-workspace.cua.mjs` exports
`verifyResearchOSWorkspace(tab, origin)`. It is an English desktop regression
helper for a local static preview, not a Node CLI or an external Playwright
browser runner. Use an owned Codex CUA browser tab; leave user tabs untouched.
Choose an actual desktop CSS viewport of at least 1024×600 (1280×720 was used for
the first native flow). If changing metrics, use the tab-scoped documented
`Emulation.setDeviceMetricsOverride` capability and restore it afterward.

Initialize the tab in one CUA invocation and read its returned API documentation:

```js
let qaTab = await cua.createBrowserTab("chrome", "http://127.0.0.1:4383/", {
  sessionName: "🧪 ResearchOS",
});
```

In a subsequent CUA invocation, import the helper from the actual checkout path:

```js
const { verifyResearchOSWorkspace } =
  await import("/absolute/path/to/Portfolio/scripts/browser-regressions/researchos-workspace.cua.mjs");
nodeRepl.write(await verifyResearchOSWorkspace(qaTab, "http://127.0.0.1:4383"));
```

The current CUA API supports the helper's `tab.goto/reload/url`,
`getAXState({emit:false})`, locator `click/fill/waitFor` and read-only
`tab.playwright.evaluate`. The helper observes AX state after navigation/actions
and uses `locator.waitFor({state:"visible"})` for hydrated app panes, rather than
assuming a completed navigation means the workspace is mounted. It reloads an
already-current Projects URL before the flow, so it begins with a fresh session.
Run it against the latest rebuilt export. It returns assertion evidence for app
retention, filters, unique IDs, dock activation, bounded click-step geometry,
minimize/restore, portal disposal and close/survivor navigation.

The current helper passed 11 assertions against build 6 in Chrome 154 at an
actual 1280×800 CSS viewport. The companion
`scripts/browser-regressions/researchos-navigation.cua.mjs` exports
`verifyResearchOSNavigation(tab, origin)`, with the same local, owned-tab and
desktop requirements. It passed 54 assertions for retained publication search,
same-URL restoration, fragment reading offsets, Back/Forward history and exact
saved geometry after maximize/restore. Invoke it in a separate CUA call:

```js
const { verifyResearchOSNavigation } =
  await import("/absolute/path/to/Portfolio/scripts/browser-regressions/researchos-navigation.cua.mjs");
nodeRepl.write(
  await verifyResearchOSNavigation(qaTab, "http://127.0.0.1:4383"),
);
```

Capture viewport proofs through the documented native CDP capability, checking
actual viewport and pane geometry before and after capture. The current Chrome
provider's explicit-clip capture changed desktop geometry; accepted matrix
captures use no clip and reject changed geometry. Failed capture cohorts remain
preserved and are excluded from visual passes.
Keep its result separate from manual pointer dragging, pre-hydration typing,
mobile offsets, RTL, themes, reduced motion, accessibility and the full route
matrix. Save viewport/origin/build identity with results. Close the owned tab and
restore temporary appearance, media and viewport settings when finished.

Deployment uses the existing Pages workflow and requires explicit authorization.
After an authorized deployment, `npm run audit:production` checks the actual
served result. Local checks do not establish that deployment occurred.
