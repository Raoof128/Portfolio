# Findings and implemented corrections

The historical107 records are reconciled separately; they are not107 current defects. Detailed reproduction, root cause, exact affected source, correction and red/green evidence are retained in the lane finding records below.

| ID | Severity | Current correction | Evidence |
| --- | --- | --- | --- |
| CSS-01 | P1 | Restore visible system-coloured caption glyphs under forced colours; correct pseudo-selector specificity | [Styles](evidence/frontend-styles-findings.md), before/after images |
| CSS-02 | P1 | Pair Explorer night hover with the white reading surface; pair noncurrent All Projects header text with its dark gradient | Styles record, measured browser colours |
| WIN-02/WIN-04 | P1 | Clear stale copied addresses and cancel old close/minimise callbacks when retained frame changes document | [Window findings](evidence/frontend-windows-findings.md), failing regressions then194 lane tests |
| DEP-01 | P1 dependency maintenance | Upgrade Next+ESLint config16.3.8→16.4.4 and Vitest+coverage4.1.11→4.1.12; refresh compatible Zod/tooling transitive graph | Audit baseline21 advisories→16 moderate, runtime0; guard tests |
| CSS-03/C-TYPE-01 | P2 | Valid7.css font shorthand, installed Segoe UI preference, locale-aware caption/body font stacks | Styles/content records, Persian browser font assertion |
| WIN-01/WIN-03 | P2 | Truthful workspace-entry captions in five locales and named desktop window controls | Window findings, locale and focus regressions |
| ROUTE-01 | P2 | Exclude decorative lab line numbers from assistive reading, preserve focusable original source | [Route findings](evidence/frontend-routes-findings.md), five-locale regression |
| ART-01 | P2 | Visible, localised terminal clipboard confirmation and persistent recovery | [Artwork findings](evidence/frontend-artwork-findings.md), copy failure/success lifecycle tests |
| C-LAB-01 | P2 | Check Go sample capacity before mutation; fail honestly on input/output errors | [Content findings](evidence/frontend-content-findings.md), executable Go red/green logs |
| SETUP-01 | P2 | Correct devcontainer Node20 image to official supported Node22 tag; review hidden launch/hook configuration | Official MCR manifest200; Node engine contract, frozen install; container lifecycle unrun |
| TEST-01 | P2 | Add real Playwright/axe suite; label obsolete CUA assertions honestly | [Independent suite review](evidence/frontend-browser-independent-review.md) |

No modeless application focus trap, additional window-manager framework, server-only deployment feature, authored research replacement or proprietary Windows asset was introduced. No forced dependency-major downgrade/upgrade was used to hide the remaining minimatch advisory.

Unresolved risks are enumerated in [unresolved risks](unresolved-risks.md), with limitations separate from reproducible source defects.
