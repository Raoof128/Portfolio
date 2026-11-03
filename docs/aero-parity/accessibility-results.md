# Accessibility verification

The visual reconstruction preserves the existing modeless reading-window behaviour, real navigation links, five-language labels, keyboard controls, focus indicators, reduced motion and touch adaptations. No modal trap was added to ordinary application windows. The Start search remains a native modal dialog with its existing focus-return behaviour.

Corrections found during this pass:

- Forward Tab from the move/resize panel now closes it and continues into the document. Reverse Tab returns to the disclosure; Done also returns focus. The browser suite exercises real Tab traversal rather than inferring it from jsdom.
- Canonical 19px caption visuals have a 5px transparent hit extension. Actual pointer clicks below the visible box exercised Maximise, Restore, Minimise and Close. Mobile/coarse targets remain 44px.
- The original preference rule missed 7.css's newly restored glass pseudo-elements. Reduced transparency and increased contrast now use opaque surfaces and remove blur from elements and pseudo-elements. Forced colours uses system-colour opaque frames.
- Persian and Arabic Start-search magnifiers now follow inherited RTL direction, with space reserved at the correct input edge.
- Forced-colour breadcrumb highlighting is restricted to interactive current destinations; a noninteractive current-path label retains normal readable text.
- The original Atlas diagram uses a system-colour palette in forced-colour mode, preserving its evidence lines, labels and distinct line patterns.

Final automated route/axe results and exact build identity are recorded in [browser results](browser-test-results.md). Automated results are bounded evidence, not WCAG certification. Incomplete axe results require human interpretation. Actual screen-reader speech, physical-device interaction and native zoom remain unverified.

## Final measured scope

On export `xfHy_bhVfJKii-CA72D9U`, the 160-route Chromium sweep found zero automated WCAG-tagged axe violations and 158 incomplete colour-contrast groups. Those contain 6,836 repeated node occurrences: 5,832 pseudo-element background indeterminacies, 994 gradient indeterminacies and 10 non-text marker cases. They remain incomplete, not suppressed passes.

Independent final inspection sampled Projects, Simurgh detail and Lab 001 in both themes. Thirteen recorded solid/gradient-endpoint text pairs all exceed 4.5:1: research text 10.86:1, native button faces at least 10.21:1, selected Explorer text at least 6.75:1 and muted code labels at least 6.11:1. Six actual final screenshots were inspected. These samples do not resolve every repeated occurrence or every translucent background combination. [Manual follow-up and exact scope](evidence/contrast-incomplete-review.md), [computed samples](evidence/contrast-computed-samples.json).

Native keyboard/preference journeys passed in all three engines. The Firefox contrast fixture correction is documented with a minimal reproduction; its original failure and unchanged opacity assertions remain visible. Three Atlas diagrams in both forced-colour palettes, both current breadcrumbs, four below-box caption clicks, forward/reverse Tab exit, 44px coarse controls and representative 320px/RTL layouts were separately checked. The 24px effective caption target comprises the native 19px visual face plus a 5px transparent extension.

The earlier five untagged original research PDFs remain an author-level accessibility item; the résumé bytes and navigation passed. Physical screen readers, mobile keyboards/autofill, native 200%/400% zoom and exhaustive screen-position contrast were not tested. The viewport matrix demonstrates reflow at its declared sizes, not a substitute certification for those checks.
