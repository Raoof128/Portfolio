# Manual follow-up of incomplete contrast results

No new significant unreadability was reproduced in the inspected Projects, Project Simurgh and Lab 001 samples. This is a bounded manual follow-up, not clearance of every incomplete result or a WCAG conformance statement.

## Exact artifact and scope

- Next build: `xfHy_bhVfJKii-CA72D9U`; export generated `2026-11-03T07:23:07.345Z`.
- Version metadata identifies base commit `b4cc49de662b3013a97d5497f3fd8daed0df1a20`; the artifact also contains the uncommitted Operation Aero changes. See [export-manifest.json](export-manifest.json) for artifact hashes.
- Input: [route-observations.json](route-observations.json), 160 routes at 1440px, with zero reported axe violations. Incomplete records remain separate from passes.
- Fresh local artifact check: Chromium 155, 1440 × 900, reduced motion; `/projects`, `/projects/project-simurgh` and `/lab/001`, each in light and dark appearance. Thirty computed foreground/ancestor-paint samples were recorded. All six captured screenshots were visually inspected. No stylesheet injection or application changes were used for this follow-up.
- Data, input-file hash and artifact metadata: [contrast-computed-samples.json](contrast-computed-samples.json).

## What axe could not resolve

There are **158 `color-contrast` incomplete rule groups**, containing **6,836 node occurrences** and **528 distinct target selector strings**. These are repeated route/component observations, not 6,836 established defects. Generated IDs, locales and repeated selectors also prevent the distinct-selector count from being a count of unique components.

| Recorded reason | Node occurrences | Common affected targets |
| --- | ---: | --- |
| Background cannot be determined due to a pseudo element | 5,832 | Reading prose/headings, Explorer labels and summaries, code lines/numbers, action buttons, date and running-taskbar labels |
| Background cannot be determined due to a background gradient | 994 | Native button faces, Explorer selected rows, count badges and tags, tabs and other gradient surfaces |
| Content contains only non-text characters | 10 | `.ui-marker` glyphs in the KMP Security write-up across all five locales |

The computed ancestor stacks confirm that canonical `.window.glass::before` layers coexist with opaque white reading surfaces, and native buttons use generated hover/pressed layers. Axe's pseudo-element warning therefore reaches some text whose immediate visible backdrop is an opaque application body. This explains sampled indeterminacy; it does not establish that every node sharing the warning has a satisfactory foreground/background pair.

Taskbar labels/date and title-bar text have a different situation: translucent glass, gradients, wallpaper and overlapping windows affect the painted background. Their ancestor `background-color` values alone do not measure the final local backdrop. The captured positions were readable on visual inspection; no numerical contrast claim is made here for those materials in every position or state.

The ten `.ui-marker` occurrences are the non-text glyph checks on `/write-ups/kmp-security` and its locale variants (English 2, Persian 2, Arabic 2, Chinese 3, Spanish 1). The checker did not determine text contrast for these glyphs. This report does not turn that limitation into a blanket exemption from applicable non-text contrast requirements.

## Measured representative pairs

Ratios below use WCAG relative luminance from the browser's computed sRGB colours. For the sampled monotonic gradients, the least favourable endpoint is used; the translucent light selected-row endpoint is composited over its observed opaque white sidebar. These calculations evaluate the recorded resting paint pairs, not antialiased glyph pixels, every interaction state, or arbitrary underlying glass.

| Sample | Appearance | Foreground / least favourable background | Ratio |
| --- | --- | --- | ---: |
| Explorer summary, category description, dossier lead | Both | `#3d3d3d` / `#ffffff` | 10.86:1 |
| Back and Copy Link | Both | `#000000` / native gradient endpoint `#cfcfcf` | 13.48:1 |
| Secondary resource action | Both | `#222222` / native gradient endpoint `#cfcfcf` | 10.21:1 |
| Primary resource action | Both | `#222222` / default-action endpoint `#a7d9f5` | 10.52:1 |
| Selected All Projects label | Light | `#000000` / `rgba(144,205,245,.9)` over white | 12.95:1 |
| Selected All Projects label | Dark | `#ffffff` / `#2c5d96` | 6.75:1 |
| Count badge | Light | `#000000` / `#e6eef6` | 17.93:1 |
| Project tag | Light | `#000000` / `#eef4fa` | 18.96:1 |
| Count badge and project tag | Dark | `#f1f7ff` / `#1b3a62` | 10.66:1 |
| Lab code | Light | `#14203a` / `#eef3fa` | 14.52:1 |
| Lab header and line numbers | Light | `color(srgb .317804 .357176 .438275)` / `#eef3fa` | 6.11:1 |
| Lab code | Dark | `#dfeaf7` / `#0a1120` | 15.49:1 |
| Lab header and line numbers | Dark | `color(srgb .640627 .679373 .732549)` / `#0a1120` | 8.33:1 |

Each listed pair exceeds 4.5:1 for normal text. The dark appearance retains the opaque white reading body, while its selected navigation, metadata chips and code panel have explicit readable dark pairs. The sampled prior concern about dark Lab code is not reproduced in this final artifact.

## Visual evidence and relationship to other checks

| Route | Light capture | Dark capture |
| --- | --- | --- |
| Projects | [Light](contrast-light-projects.png) | [Dark](contrast-dark-projects.png) |
| Project Simurgh | [Light](contrast-light-projects-project-simurgh.png) | [Dark](contrast-dark-projects-project-simurgh.png) |
| Lab 001 | [Light](contrast-light-lab-001.png) | [Dark](contrast-dark-lab-001.png) |

These actual final-artifact screenshots corroborate the measured reading-body, selected-navigation, tag, resource-action and code-panel samples. They are viewport captures, not proof that every scroll position has been inspected. Long code continues within its scrolling code region; the screenshot edge is not evidence that the entire source is visible simultaneously.

[controls-review.md](controls-review.md) records earlier candidate native input/select states, tab keyboard checks and five-locale coarse-pointer checks. Those observations describe their stated earlier build and are not presented as final-artifact screenshots. [desktop-review.md](desktop-review.md) separately records final forced-colour Atlas checks and welcome checks; these address different states and do not close all route-sweep contrast indeterminacies. The historical frontend accessibility audit is useful context, not evidence for the current artifact.

## Remaining limits

This review sampled common paint families; it did not manually validate all 6,836 occurrences, every locale string, every hover/focus/pressed state, or every drag/overlap position. Translucent glass/taskbar contrast across all positions, the remaining unsampled targets, native assistive-technology behaviour and cross-engine pixel composition remain outside this bounded measurement. Keep the 158 axe groups recorded as **incomplete with representative manual follow-up**, rather than rewriting them as automated passes or confirmed failures.
