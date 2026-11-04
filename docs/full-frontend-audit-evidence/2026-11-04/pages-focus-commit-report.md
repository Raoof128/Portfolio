# Compiled fragment focus timing correction

The first full compiled regression exposed a real race that the earlier tabindex correction and component tests did not cover. In build `2026-11-04T01:50:13.350Z`, the focus callback could run while React still left the requested section hidden, then exit before the section became visible. Native instrumentation retained both the lost-focus sequence and the hidden target queries; another old-build run succeeded when its callback followed the commit, confirming a timing race rather than a universal failure.

ProjectDetailClient now queues the request in state and schedules focus from an effect after the active section update commits. Requests are consumed and pending frames cleaned up. A deterministic early-frame test fails against the old implementation and passes against the correction, while also checking that later keyboard tab navigation retains focus on tabs. All 26 dossier tests, targeted ESLint, the global TypeScript check and owned diff checks pass. Fresh compiled browser verification belongs to the parent.

Two harness errors are corrected separately: each fragment now starts with a genuinely fresh direct load rather than a same-document hash navigation returning a null response; storage preparation ignores the about:blank interstitial. Wallpaper footer tests now target the actual home `nav.os-desktop-footer` in English/Persian, since the retained About route has no footer. Their white-on-hover, actual pending-language and normal/short Search assertions remain intact.

Complete final reread spans and hashes are in `pages-focus-commit-review.json`; earlier failures and successful source checks remain raw artifacts rather than being overwritten or certified as final browser results.
