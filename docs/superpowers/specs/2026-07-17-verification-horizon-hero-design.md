# The Verification Horizon — Hero Design Specification

**Date:** 2026-07-17 (Australia/Sydney)
**Branch:** `feat/verification-horizon-hero`
**Status:** Approved for implementation (Phase 0 complete)

## 1. Creative direction

A physically convincing dark singularity whose accretion structure is built from
**evidence rather than matter**: signed fragments, cryptographic receipt geometry,
verification-graph nodes, Merkle-like branches, fine data paths. Unverified
fragments distort and dissolve at the event horizon; verified fragments stabilise
into a precise electric-cyan luminous ring. During the loop's quiet pulse
(seconds ~4–6) gravitational lensing hints at a feather-like Simurgh topology —
discovered, not displayed.

**Message: claims disappear, evidence survives.**

Style: scientific-cinematic, premium research-film finish, deep navy-black base
(site bg `#030712` / `#09090b`), electric cyan (`#06b6d4`/`#00f5ff` family)
principal light, restrained ultraviolet secondary, tiny warm-white proof
highlights. Excluded: padlocks, hoodies, code rain, dashboards, baked text,
logos, watermarks, fantasy illustration.

All readable text remains HTML (i18n, 5 locales). Media carries zero typography.

## 2. Current-state audit (Phase 0 findings)

- Hero: `src/app/[locale]/page.tsx` §HERO renders `<HeroVideo />` behind a
  `max-w-2xl` text column (left in LTR, mirrored right for fa/ar via RTL layout;
  video mirrors with `scaleX(-1)`).
- `src/components/ui/HeroVideo.tsx`: single 16:9 asset (`hero-singularity.*`,
  1920×1080, 8.75 s, 24 fps; mp4 6.7 MB, webm 2.5 MB, poster 237 KB jpg),
  `object-cover`, muted/playsInline autoplay, IntersectionObserver pause,
  reduced-motion → poster, `aria-hidden`, scrim + scanline layers.
- Weaknesses of current state: one landscape asset centre-cropped on portrait
  phones (subject half-lost), generic "AI black hole" with no connection to
  Raouf's research identity, poster is jpg only, no data-saver consideration,
  single scrim tuned for desktop only.
- CSP (`public/_headers`): `media-src 'self'`, `img-src 'self' data: blob:` —
  local assets satisfy policy; **no CSP change needed**.
- Checks: prettier · eslint · tsc · vitest (68) · next build (static export,
  ~152 pages). Deploy: `npx wrangler pages deploy out --project-name
  raoufabedini --branch main` (manual, after approval).

## 3. Generation strategy

| Stage | Tool | Notes |
|---|---|---|
| Master stills | OpenAI `gpt-image-2` (verified available) | 3 concept families × ≥3 desktop (1536×1024-class 16:9 nearest) + ≥3 portrait (1024×1536-class 9:16 nearest); native compositions, never blind-crop |
| Motion | Gemini `gemini-omni-flash-preview` (verified available) | image-to-video, 8 s, 24 fps, locked camera; ≤3 conversational refinement rounds per composition |
| Fallback | `veo-3.1-generate-preview` (verified available) | Only if Omni fails loop/coherence gates after 3 rounds; first+last-frame control; must be recorded in manifest + changelog |
| Loop + encode | ffmpeg/ffprobe local | measured loop point (perceptual similarity), optional short crossfade blend, VP9 + H.264 faststart, no audio |

Concept families: **A. Verification Horizon** (evidence accretion ring — expected
winner), **B. Invisible Window** (lensing geometric window-planes), **C. Proof
Engine** (proof graph as gravitational structure). Scored 1–10 on: originality,
portfolio relevance, scientific credibility, text-safety, mobile composition,
motion potential, loop potential, artefact absence, colour compatibility,
2-second emotional impact. Scorecard: `artifacts/hero-review/concept-scorecard.md`.

## 4. Responsive art direction

**Desktop master (16:9)** — singularity ~72 % x / ~43 % y; activity confined to
right 42 %; left 48 % dark and quiet (text-safe for `max-w-2xl` column);
moderate star density; ring fully visible; survives `object-cover` on
1440×900 → 2560×1440 and ultrawide.

**Mobile master (9:16)** — independently composed; smaller full-circle
singularity upper-centre/upper-right; bright activity above the body copy;
central + lower regions quiet; nothing critical near browser chrome.

**RTL** — both masters must read correctly mirrored (`scaleX(-1)`): no
directional glyphs, no asymmetric readable symbols.

## 5. Asset matrix & budgets

```
public/hero-verification-desktop.webm   ≤ 4.0 MB  VP9,  1920×1080, 24 fps
public/hero-verification-desktop.mp4    ≤ 7.0 MB  H.264 +faststart
public/hero-verification-desktop-poster.avif ≤ 250 KB
public/hero-verification-desktop-poster.jpg  ≤ 250 KB
public/hero-verification-mobile.webm    ≤ 2.5 MB  VP9,  1080×1920, 24 fps
public/hero-verification-mobile.mp4     ≤ 4.5 MB  H.264 +faststart
public/hero-verification-mobile-poster.avif  ≤ 180 KB
public/hero-verification-mobile-poster.jpg   ≤ 180 KB
```

Budgets are perceptual targets — dark-gradient banding is a gate failure; if a
budget fights banding, quality wins and the overage is documented. Masters and
raw generations retained in `artifacts/hero-masters/` (gitignored) with
`asset-manifest.json` (model IDs, timestamps, dims, checksums, encode commands,
prompt version, fallback status — no secrets).

## 6. Animation timeline (8 s loop)

- 0–4 s: slow accretion rotation; fragments orbit; occasional unverified
  fragment stretches and dissolves near the horizon.
- 4–6 s: quiet cyan pulse through the ring; subtle feather topology appears in
  the lensing and fades.
- 6–8 s: motion settles back toward the opening state (loop-friendly tail).
- Camera locked. No cuts, zoom, exposure pumping, or new uncaused objects.

## 7. Component architecture

`HeroVideo.tsx` keeps its contract (client-only, `aria-hidden`, autoplay
handling, IO pause, reduced-motion, RTL mirror) and gains:

1. Orientation-based source selection — one `<video>` element whose sources are
   chosen via a `matchMedia("(orientation: portrait)")` state (re-evaluated on
   change) so only one file downloads/decodes; `key` swap forces clean reload on
   orientation flip.
2. Poster-first paint: `<img>` poster layer (avif→jpg via `<picture>`) always
   painted under the video; video opacity 0 → 1 only after `canplay`+first
   `timeupdate`/`requestVideoFrameCallback` — no black flash.
3. Data-saver: `navigator.connection.saveData === true` → poster only.
4. Reduced-motion: never autoplay (existing behaviour preserved).
5. Scrim retuned per breakpoint (desktop keeps left-biased scrim; portrait gets
   bottom-weighted scrim protecting copy below the singularity).
6. No WebGL/canvas, no new dependencies.

## 8. Accessibility requirements

Decorative only: `aria-hidden="true"`, no focusable elements, no motion under
`prefers-reduced-motion`, headline contrast over the quiet region ≥ WCAG AA
(scrim guarantees), all text remains HTML.

## 9. Verification gates

Visual: circular undistorted singularity at all 6 viewports (390×844, 430×932,
768×1024, 1440×900, 1920×1080, 2560×1440); quiet text-safe region; no
first→last jump visible across 10 consecutive loops; no watermark/text/artefacts;
no severe banding; mobile intentionally composed; RTL coherent; en+fa+ar pass.

Technical: prettier/lint/typecheck/test:ci (68)/build all green; no hydration or
console errors; no CLS from media; poster before playback; only one video
downloaded per viewport; CSP unchanged and satisfied.

## 10. Deployment & rollback

- Deploy (after gates + approval): `npm run build && npx wrangler pages deploy
  out --project-name raoufabedini --branch main`.
- Rollback: previous assets `public/hero-singularity.*` are retained in git
  history on `main`; revert the integration commit(s) and redeploy. Old assets
  are removed from `public/` only in the final integration commit, so a single
  `git revert` restores them.

---

## Addendum — Phase 3 tournament result (2026-07-17)

18 candidates generated with `gpt-image-2` (3 families × 3 desktop + 3 portrait;
native compositions per orientation). Full scoring in
`artifacts/hero-review/concept-scorecard.md` (local, with contact sheets and all
raw candidates preserved).

**Winners: A-desktop-3 (80/100) + A-portrait-3 (79/100)** — Verification
Horizon family: photon ring + equatorial accretion disk built from glyph-like
evidence fragments and verification-graph filaments; singularity ~72 %/45 %
(desktop) and ~68 %/30 % (portrait); text-safe regions genuinely dark.
Runner-up alternates: A-desktop-1 / A-portrait-1. Family B (Invisible Window)
failed text-safety and physical credibility; Family C (Proof Engine) scored low
on 2-second impact. Expected winner matched outcome; comparison was scored
honestly per dimension before selection.
