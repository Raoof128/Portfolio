# Artwork, evidence and shared controls lane

Baseline: `2b6d048c42c7feb7ef82e38f5ca519603d40afc6` (branch `work`). Full static review: 53 owned files, 10,519 current lines, hashes in `frontend-artwork-coverage.json`. Root owns browser and cross-browser verification; these source reads do not certify visual quality or screen-reader compatibility.

## ART-01 — Copy failure hidden from sighted visitors

- **Severity:** P2 / medium.
- **Affected route/component:** Simurgh dossier → Reproduce Locally / `TerminalCommand` (all five locales).
- **Source:** `src/components/os/TerminalCommand.tsx`, original lines 81–91 and 129–136; final lines 81–90 and 131–136. Related styling in `src/components/os/terminal.css` is owned by the styles lane.
- **Observed behaviour:** Reject `navigator.clipboard.writeText`, click Copy Commands. Recovery text is placed solely in `.sr-only` and removed after 2.5 seconds. Sighted users receive neither a failure explanation nor instructions for selecting commands. Successful copying also leaves the button label unchanged, with only a check icon.
- **Expected:** Visible copy confirmation and durable recovery help; polite assistive announcement remains available.
- **Reproduction:** Open `/projects/project-simurgh`; deny/unavailable Clipboard API; activate Copy Commands. The baseline `role=status` has `class=sr-only`. Two new assertions fail on the baseline.
- **Root cause:** Status live-region implementation addressed assistive announcements but hid the recovery UI visually and applied success timeout to failure too.
- **Correction:** Mounted visible `.os-terminal-feedback` status row; reuse existing translated messages; show successful button text; expire only success confirmation, leaving failure instructions until retry.
- **Verification:** `TerminalCommand.test.tsx` observed 2 failures before implementation, then three tests passed; added fourth regression verifies rejection persists past 10 seconds, successful retry and eventual success reset. Broader lane test run recorded separately.
- **Result:** Source/test correction implemented. Final browser check should deny clipboard on the Simurgh dossier, inspect visible help and absence of overflow in Persian/Arabic and 320px width.
- **Evidence:** Terminal regression output from this lane; final root browser evidence pending.

## Retained implementation strengths

- All 13 original artwork mappings retained. Canvas renderers cap DPR at 2, use a shared playback controller, render a complete still before animation, pause outside visibility/application activity and reduced motion, and dispose observers/listeners/frames.
- Project thumbnails request only nearby modules, keep text/links usable if art fails, render paused stills, and unmount offscreen art.
- Dossier artwork can pause/resume, follows live motion preferences, offers localised import retry and preserves project content.
- Evidence stories explicitly label illustrations, preserve limits and source links, and avoid simulated result metrics. RTL API identifiers are isolated.
- Explorer supports bounded search/category state, labels controls, debounces result announcements, preserves selected dossier discoverability, and moves focus to page headings after navigation. Existing breadcrumb and phone disclosure fixes are present.
- SecureContactForm accurately describes a mailto draft rather than a sent message; validates/focuses invalid fields, cancels stale draft timers, encodes metadata, preserves values and offers direct-email/copy fallback. It does not promise server submission.
- Markdown rejects executable/authority-like link schemes, isolates code direction, uses semantic headings/lists/tables and makes overflowing regions keyboard-focusable.

## Scoped limitations / retained lower-priority opportunities

- `ProjectCard` is a retained legacy component with tab roles but no arrow-key roving-tab behaviour, and its slug-based IDs can collide for repeated titles. No production caller was established in this lane; it is not claimed as a reproduced live defect. Root may mark dormant code deferred rather than changing unseen UI.
- Screen-reader pronunciation and native software-keyboard behaviour need physical/native assistive verification; unit assertions are not equivalent.
- Random particle placement means canvas screenshot comparisons require deterministic capture fixtures; artwork remains intentionally dynamic.
