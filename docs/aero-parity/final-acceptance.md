# Final acceptance

This records the first-pass candidate. See [the completed second pass](round2/README.md) for the latest reviewed build.

**CONDITIONAL PASS — suitable for owner and technical/recruiter review, with the stated differences and limits.** No known reproducible P0/P1 introduced by this pass remains unresolved within the executed scope. This is not an unqualified WCAG certification, physical Windows rendering guarantee or production-deployment verdict.

Exact reviewed export: **`xfHy_bhVfJKii-CA72D9U`**, built **2026-11-03T07:23:07.345Z**. Source base: **`b4cc49de662b3013a97d5497f3fd8daed0df1a20` plus the Operation Aero working-tree changes**. Its 23 changed application hashes and all 1,072 exported-file hashes were revalidated after testing. The [final integrity check](evidence/final-integrity.json) reports no source/export hash mismatch or broken report link. Final validation-tool hashes are separately recorded in [the current manifest](evidence/source-manifest.json), so the commit token alone is not misrepresented as an identity for uncommitted bytes.

## Acceptance gates

| Requirement | Verdict | Evidence and limit |
| --- | --- | --- |
| Relevant component/source review | Pass for declared scope | 23 application files and six harness files completely reviewed; integration/reference files inspected; independent final review. Prior 268-file audit remains separate. [Exact paths](source-changes.md) |
| Correct canonical integration | Pass | Unchanged scoped 7.css, restored glass/material contracts, native frame/caption/search/select/tab/scrollbar rules; competing skins removed at their source |
| Controlled visual parity | Conditional pass | 56 component-state pairs; 23 non-focus caption states pixel-identical. One low-severity body-highlight stacking difference and documented accessibility/content adaptations remain. [Measurements](visual-parity-matrix.md) |
| Navigation/windows/responsiveness | Pass in tested scope | Chromium 32/32 and final Firefox/WebKit 12/12; 360 responsive observations; 160 direct routes; keyboard, pointer, history, search, languages, theme, PDF and contact journeys |
| Accessibility | Conditional pass | No axe violations across 160 routes; actual keyboard and preference-mode fixes verified. 158 incomplete contrast result groups require bounded manual interpretation. Screen-reader speech, physical device/zoom and original research PDF tagging remain limitations. [Results](accessibility-results.md) |
| Engineering/artifact checks | Pass locally | Lint, typecheck, 674 unit tests, schema/dependency/security checks, image-tool tests, 168-route production build and local artifact/HTTP audits pass. Original failure records retained. |
| Exact final screenshot identity | Pass | Final captures and export manifests identify the same build. Intermediate/baseline images are explicitly labelled. [Before/after](before-after-evidence.md) |

## Improvements and remaining differences

The reconstruction restores the 27px title bar, 108×20px caption group, native 29×19px minimise/maximise/restore and 48×19px Close faces. Shared windows now use canonical glass, border, radius, shadow and 6px body margins. Search/select/tab/button styles and scrollbars consume the existing framework. The taskbar has a 40px fine-pointer band and bordered running states. The original icons, research artwork, evidence and five languages remain.

Independent review additionally corrected actual forward-Tab escape, Persian/Arabic search positioning, opacity/blur in preference modes, the forced-colour breadcrumb and all three Atlas diagrams. Touch targets and readable 16px research bodies take precedence over historical 12px desktop geometry.

The final frame mask has **310 of 23,191 sampled pixels above a 16/255 channel-difference reporting band**: 92 title-halo pixels from the retained app icon and 218 pixels on a one-pixel body-top highlight. Baseline had 21,306 of 22,975 above-band pixels. Different measured label bounds explain the differing sample counts. Raw image differences are also retained; the band is not a pass threshold. The remaining stacking difference is P3 and deliberately documented rather than hidden by a broader mask.

Buttons/fields/tabs retain a 24px target floor versus native 23px, stronger focus indicators, multilingual fonts and coarse-pointer 44px targets. Aero Night, Start, desktop/taskbar and original wallpaper are portfolio extensions. [All deliberate differences](unresolved-differences.md).

## Remaining risks and release recommendation

- **P2, pre-existing:** five untagged original research PDFs; author evidence/qualification for absolute Zurvan/Aion wording; 16 moderate development lint-graph advisory entries at the prior unchanged-lockfile audit. None is silently marked resolved by this visual pass.
- **P3:** the measured one-pixel frame highlight overlap. No significant visual mismatch remains unexplained in the compared components.
- **Verification limits:** native Windows/Segoe rasterisation, real screen-reader speech, physical touch/mobile keyboards, native OS zoom, exhaustive per-control cross-engine states, field INP/Core Web Vitals and production/remote CI. A single WebKit timing failure passed in isolation and the final single-worker run; its cause remains unproven and the trace is retained.

The candidate is ready for the owner's visual and technical approval using these reports and screenshots. Review the disclosed content/document matters before presenting the entire portfolio as universally accessible or independently substantiated. Production approval remains a separate owner action. **No new commit, push, merge, deployment or environment publication was performed during this implementation pass.**
