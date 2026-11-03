# Visual regression evidence

Baseline captures are from local export `6bEVgZEX1rNmEyqH4_pUo`, built3November2026 at05:37:44UTC. This early baseline export may include initial font-stack edits; it is not claimed as pristine HEAD bytes. Before-state contrast and forced-colours failures were actually captured on it.

Final rendered artifact: `Dfv1QQLfhv_4WAY_tllxC` (2026-11-03T05:58:48.112Z).

Material comparison: [night hover before](evidence/before-projects-night-hover.png) → [after](evidence/projects-night-after.png); [forced colours before](evidence/before-projects-forced.png) → [after](evidence/forced-colours-after.png). [Caption geometry comparison](evidence/caption-reference-above-candidate.png) uses equivalent canonical controls; content/layout differences rule out whole-page pixel equality.

New Playwright screenshots use reduced motion, fixed viewport/locale/timezone and explicit appearance. Animation phase, clock text, platform fonts and rasterisation still vary; there are no blindly regenerated toHaveScreenshot baselines. Captures are attached by state for inspection, with traces retained for failures. A future golden-image gate should approve selected cropped deterministic controls separately per browser, rather than auto-accept all captures.

Historical October captures are not repurposed as current proof. Initial Playwright locator errors and the first unsuccessful forced-colours correction are preserved as failed attempts, not hidden behind later green checks.
