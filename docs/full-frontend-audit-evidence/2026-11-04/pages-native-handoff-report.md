# Native no-JavaScript mailto browser oracle

The independent contact-owner probe (`ui-nojs-mailto-probe.json`) confirmed that the native form correctly requests a `formSubmissionPost` navigation to the configured mailto recipient with the filled draft encoded in its body. In the headless Chromium fixture, the missing external handler then leads to `chrome-error://chromewebdata/`. Requiring the site URL and form DOM to remain after valid native submission was an unsupported browser-environment assumption, not evidence of a product bug.

The maintained regression now proves the actual native handoff using read-only Chromium CDP events, including action recipient, subject, and exact synthetic field values. It preserves empty-submit required focus, native validity and no-attempt checks, and still forbids any HTTP draft submission. The browser's internal error URL is accepted only after the mailto POST is independently observed. Neither an installed mail app, successful launch nor message delivery is claimed. Only this CDP-based case is explicitly skipped on non-Chromium; other cases remain enabled.

ESLint and the global TypeScript check pass. The final maintained file was fully reread; its exact hash and spans are recorded in `pages-native-handoff-review.json`. Product bytes remain frozen. The parent owns shared browser execution.
