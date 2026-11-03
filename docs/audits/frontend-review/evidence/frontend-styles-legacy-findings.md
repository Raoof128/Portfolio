# Legacy CSS review

Identity: HEAD 2b6d048c42c7feb7ef82e38f5ca519603d40afc6. Eight owned stylesheets / 7,146 lines read completely in bounded sequential chunks. Source hashes and reviewed endpoints are in frontend-styles-legacy-coverage.json. No files edited by this helper.

## CSS-L01 (candidate P1, browser confirmation requested)

Affected route: Aero Night /en/projects/project-simurgh and /en/projects.
Source: project-explorer.css dark token block (lines 115-153), navigation default/hover pair (171-214), row hover (464-466), plus win7-explorer.css non-current index header (88-98).
Observed in source: ordinary sidebar entries and list rows retain black/blue/muted text while their hover fill is navy #173a63. Non-current All Projects uses navy pane gradient even at rest but retains black text. Selected rows have a separate white-on-navy pair and are not the issue. Root was asked to measure computed styles and contrast in browser before fixing/reporting.
Root cause candidate: one dark interaction background token serves white reading bodies without a matching hover foreground.
Expected: every actual hover/focus/selected state has a tested foreground/background pair. Preserve selected navy/white and intentional white reading bodies.

## CSS-L02 (candidate P1, browser confirmation requested)

Source: evidence-story-common.css lines 144-166; dark --os-accent-tint in project-explorer.css.
Source behavior: evidence source/reproduce links hover into navy tint while retaining black --os-text. Root asked to inspect a real link with hover.

## CSS-L03 (candidate P1, browser confirmation requested)

Source: evidence-story-zurvan.css lines 76-86 and 109-115; selected node aria-pressed rule in evidence-story-common.css is separate and already supplies selected white-on-navy.
Source behavior: unselected typed node hover and selected ledger use navy tint with black --os-text. Root asked to inspect real nodes/ledger in Aero Night.

## Retained evidence / known limits

Historical gradients/rim recipes remain in loaded legacy sheets but Win7 layers explicitly neutralize many; do not call them visible neon regressions without runtime evidence. Supporting page h1 gradients are neutralized by win7-pages.css. Proof Atlas body palette is explicitly white in both appearances, with HTML node-name alternatives at compact breakpoints. Reading scroll regions preserve focus rings and custom scrollbars, with native Firefox fallback. Reduced motion and forced-colors alternatives are present; source review alone is not assistive-technology verification. Existing dual token architecture and dormant motion recipes are maintenance debt; deleting by initial page CSS coverage would be unsafe.
