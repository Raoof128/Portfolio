# Windows7 fidelity

**2026-11-03 erratum, Operation Aero:** the installed `7.css@0.21.1` scoped stylesheet does include `.win7 .has-scrollbar` rules. The statement below that it omits scrollbars repeated outdated upstream documentation and was incorrect. The new [reference analysis](../../aero-parity/reference-analysis.md) verifies the actual stylesheet and records the correction. The remaining measurements below retain their original build identity.

The current presentation keeps scoped `7.css@0.21.1`, `.window.glass.active`, `.title-bar`, `.title-bar-controls`, caption-class glyphs, native controls, white reading bodies and the Explorer hierarchy. The official demo/documentation and installed integration were examined; the downloaded demo stylesheet retains a0.21.0 banner despite the site's0.21.1 package label. No version was inferred from the banner alone.

[Reference above, candidate below: caption comparison](evidence/caption-reference-above-candidate.png). [Canonical glass fixture](evidence/reference-window.png) uses authoritative demo CSS and standard component markup at a comparable width. The first remote whole-page capture failed to demonstrate loaded styling and is excluded from fidelity proof. These final equivalent component captures use local authoritative bytes in the same Chromium environment.

The candidate preserves Aero blue gradients, inner frame highlights, grouped minimise/maximise/close commands, red Close treatment and app-specific active states. It now supplies a valid `--w7-font` font shorthand, a separate family token and language-aware title font. Segoe UI is used only where installed; no licensed font was redistributed.

Differences remain intentional: the portfolio's caption controls are taller/narrower than the stock demo geometry, touch layouts enlarge targets, content text is larger, and Aero Night uses navy chrome over white reading surfaces. The R monogram replaces any Windows logo; wallpaper is original CSS. Forced-colour symbols use system-coloured borders rather than bitmap assets. Mobile adapts one foreground document to page scrolling. The scope sheet omits scrollbars by upstream design; app scrollbars are maintained separately.

This is close canonical component integration with documented adaptations, not pixel-perfect Windows OS emulation. No unrelated modern dashboard aesthetic or artwork repaint was introduced.

Measured noncurrent Explorer hover pair: rgb(0,61,153) on rgb(23,58,99) was 1.168:1; corrected light hover rgb(229,243,252) gives 8.723:1 for the same link foreground. These opaque pair calculations are scoped to that state, not blanket translucency/contrast certification.
