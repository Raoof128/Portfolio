# Deliberate differences and limits

These are explicit scope boundaries, not an assertion that unrelated whole pages should produce identical screenshots.

| Area | Difference from the canonical demo | Reason and verification |
| --- | --- | --- |
| Frame/body boundary | P3: 218 above-band pixels on a one-pixel top highlight; 92 additional title-halo pixels reflect the app icon | Independently reproduced stacking cause; full raw and measured-mask evidence retained in the parity matrix. Frozen final app intentionally retains this minor difference. |
| Reading body | White surface and 16px research prose rather than the demo's grey 12px body | Existing readability decision; actual content and all five languages preserved. Frame-only image measurements exclude document content. |
| Fine-pointer captions | Native 19px visible height, with a transparent 5px extension below | A 24px effective target without changing the native glyph or face. Real clicks in the extension were exercised for every window command. |
| Ordinary desktop controls | 24px minimum rather than 23px | Small target-size adaptation; geometry is reported separately from surface pixel comparison. |
| Mobile and coarse pointers | Enlarged 44px controls, 52px taskbar, wrapping/reflow | Essential touch and multilingual usability. Native desktop dimensions are not forced into narrow screens. |
| Focus | Static visible focus rings instead of relying on a subtle native glow or pulse | Keyboard visibility, reduced-motion support and forced-colour compatibility. |
| Night appearance | Navy frame tint and readable caption backing over white document bodies | A portfolio extension; Windows 7/7.css does not define this exact theme. |
| Desktop and taskbar | Original wallpaper, R monogram, portfolio app icons, task destinations and Start search | 7.css supplies controls, not a complete desktop. The taskbar's 40px fine-pointer band and running plates follow documented Windows 7 conventions. No Microsoft wallpaper or icon pack was added. |
| Fonts | Installed Segoe UI where available, system fallback on this Linux host, Vazirmatn and Chinese stacks | No proprietary font redistribution. Controlled pairs use the same available font; they do not certify Windows rasterisation. |
| Progressive fallback | Server-rendered Close remains a functional navigation link | Preserves no-JavaScript navigation. The hydrated window manager uses native caption buttons. |
| Scrollbars | Native 7.css WebKit pseudo-elements; standard-property fallback in Firefox | Browser support differs. A Chromium scrollbar capture cannot prove identical Firefox rendering. |
| Preference modes | Opaque/system-colour frames and diagrams | Accessibility takes precedence over historical glass. Reduced-transparency, increased-contrast and forced-colour paths have separate checks. |

The prior audit's original PDF accessibility work, research-claim evidence questions and moderate development-tool advisories remain recorded in [unresolved risks](../audits/frontend-review/unresolved-risks.md). This visual pass does not silently resolve those owner/content matters.

Physical Windows hardware, native screen-reader speech, physical touch devices and operating-system zoom are outside the available test environment. Viewport reflow is reported as viewport reflow. No whole-site perfection score, field Core Web Vitals claim or production-deployment claim is made.
