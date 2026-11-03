# Accessibility

Target: WCAG2.2AA, including normative24CSS-pixel target minimum/exceptions; larger44px touch targets preferred. No universal conformance claim.

Implemented: forced-colour caption symbols, readable Aero Night Explorer hover/header pairs, meaningful localised desktop command names, decorative line-number exclusion, visible persistent clipboard recovery, preserved keyboard geometry alternatives and truthful workspace entry. No modal trap was imposed on modeless reading windows. Native search remains a modal dialog with dismissal/focus handling.

Final Chromium route scans:160, zero executed-rule violations,158 incomplete rule results; native keyboard/glyph/font journeys also pass in Firefox and WebKit. Counts and limits are in [test results](test-results.md). Raw axe violations and incomplete records are retained in Playwright JSON attachments; incomplete contrast/background checks are not silently called passes. Source tests cover reduced motion, RTL, input labels, high-contrast tokens, gesture cleanup and caption focus. Browser assertions verify visible forced-colour symbols and actual Persian font inheritance.

[Before forced colours](evidence/before-projects-forced.png) · [After](evidence/forced-colours-after.png). The first attempted correction failed visual inspection due to specificity; that failure is retained in the finding record.

Limits: actual screen-reader speech/reading order, native mobile software keyboards/autofill, physical devices and all native zoom settings require separate manual evidence. Research PDFs are original, untagged source documents; the résumé is tagged but no screen-reader reading-order certification is claimed. HTML provides extensive research context but is not asserted to be a full accessible PDF equivalent.
