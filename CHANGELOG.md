# Changelog

## [Unreleased]

### Raouf: 2026-07-03 (Australia/Sydney) — Full i18n audit: extract ~250 hardcoded strings across app + SEO metadata into 5-locale dictionary

- **Scope**: A file-by-file, component-by-component sweep of the entire codebase for user-facing strings (labels, buttons, placeholders, errors, aria-labels, SEO metadata) that were hardcoded in English instead of routed through the site's existing 5-locale i18n dictionary (`en/fa/ar/es/zh`), per explicit instruction to check every file including configs, metadata, and accessibility labels — not just obvious UI files.
- **Summary**: This was a large, methodical pass following the project's existing i18n architecture (`useTranslation()` hook + `Dictionary` type in `src/i18n/locales/en.ts`, `getDictionary(locale)` for server components) rather than introducing a new pattern. Added ~250 new dictionary keys across 5 new top-level namespaces — `seo` (title/description/OG/Twitter for every page, since SEO metadata was previously English-only regardless of locale), `home` (homepage ticker array, category badges, misc labels), `resume` (the entire résumé document — tagline, 8 sections, 6 project blurbs, all fully hardcoded before), `contact_form` (the contact form component had zero i18n — every label/placeholder/status/error was hardcoded English), `project_card` (an unused-in-production but tested component) — plus extensions to `nav`, `philosophy`, `lab`, `about`, `not_found`, `project_detail`, `lab_page`, `hall_of_fame` for gaps found in already-partially-i18n'd files. Wired 15 component files and 11 server metadata files (`generateMetadata` in the root layout, 8 page/layout files, and 3 dynamic `[slug]`/`[id]` detail pages) to consume the dictionary. Notably fixed two ad-hoc `isRTL ? "hardcoded Persian" : "hardcoded English"` ternaries on the homepage bento cards — these bypassed the dictionary entirely, used the same (Persian) string for both `fa` and `ar` despite being different languages, and never covered `es`/`zh` at all; both now route through proper per-locale keys. Every locale file (`fa.ts`, `ar.ts`, `es.ts`, `zh.ts`) received full, faithful translations for every new key — Persian translated word-for-word per the explicit instruction, matching each file's existing tone (formal, technical proper nouns kept in Latin script per established convention, e.g. `DOI`, `Zenodo`, `Python`, project code names). Two test files (`SecureContactForm.test.tsx`, `ProjectCard.test.tsx`) needed updating to wrap their component under test in `I18nProvider` — a pattern already established by `Footer.test.tsx`/`Navbar.test.tsx` — since those components now call `useTranslation()` for the first time.
- **Explicitly not translated, with reasoning** (per the instruction to flag rather than guess): (1) `TerminalFeed.tsx`'s fake-boot-sequence and ambient-log arrays interleave literal shell commands and real API/constant identifiers (`neofetch --short`, `python3 invisible_window.py --verify`, `WDA_EXCLUDEFROMCAPTURE`, `NSWindow.SharingType.none`) with narrative fragments inside the same strings — splitting these safely without risking a mistranslated literal command/identifier wasn't something to guess at, so the whole component is flagged for a human to manually separate narrative from code. (2) `src/lib/data.ts` (1457 lines: project titles/descriptions/problem/solution/build/secure/proof arrays, paper metadata, and 7 full writeup article bodies) already has a `localizedDescription`/`localizedFullDescription` per-locale hook (confirmed only 16 populated instances across ~30 projects) — translating the full content layer into 4 languages is a large, dedicated content-translation project in its own right, not a string-extraction task, and is out of scope for this pass. (3) A handful of deliberately-literal decorative/technical strings were left as-is, matching existing site conventions: `aria-hidden="true"` HUD serial codes (`SEC:01.003` etc.) match the already-untranslated `01./02./03.` section numbering precedent; `TelemetryViz.tsx`'s node labels (`FIREWALL`, `ENDPOINT`...) sit inside an `aria-hidden="true"` ambient background visualization, same pattern as `SingularityCanvas`; the `/projects` page's `--offensive`/`--defensive` filter buttons are deliberately styled to mimic literal `grep --flag` CLI syntax (matching the also-untranslated `> grep` prompt prefix beside them); `PROD-SYD` (footer environment code) and `UTF-8` (lab-detail status bar) are technical identifiers, not prose. Tech-stack/tool proper nouns inside `AboutClient`'s skills matrix and `ResumeClient` (Python, Docker, Wireshark, MITRE ATT&CK, etc.) and `AboutClient`'s "Active Operations" tag chips (Kerberoasting, YARA, SOAR, KQL...) were extracted into the dictionary but kept as identical values across all 5 locales, since translating tool/technique proper nouns would be incorrect, not just unnecessary.
- **Files Changed**: `src/i18n/locales/en.ts`, `fa.ts`, `ar.ts`, `es.ts`, `zh.ts` (major additions to all 5); `src/app/[locale]/page.tsx`, `not-found.tsx`, `layout.tsx`; `src/app/[locale]/about/{page.tsx,AboutClient.tsx}`; `src/app/[locale]/resume/{page.tsx,ResumeClient.tsx}`; `src/app/[locale]/contact/page.tsx`; `src/app/[locale]/lab/{page.tsx,LabClient.tsx}`, `lab/[id]/{page.tsx,LabDetailClient.tsx}`; `src/app/[locale]/write-ups/{page.tsx}`, `write-ups/[slug]/{page.tsx,WriteupDetailClient.tsx}`; `src/app/[locale]/projects/{layout.tsx}`, `projects/[slug]/{page.tsx,ProjectDetailClient.tsx}`; `src/app/[locale]/security-policy/page.tsx`; `src/app/[locale]/hall-of-fame/{page.tsx,HallOfFameClient.tsx}`; `src/components/layout/Navbar.tsx`; `src/components/ui/SecureContactForm.tsx` + `.test.tsx`; `src/components/ui/ProjectCard.tsx` + `.test.tsx`; `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass (0 errors); `npm run typecheck`: pass — all 5 locale files satisfy the shared `Dictionary` type (TypeScript enforces exact key parity across locales, so a missing translation in any language is a compile error); `npm run test:ci`: 68/68 passing (including the two updated test files); `npm run build`: 155 static pages, zero errors. Spot-verified in the actual built `out/` HTML (not just the dictionary source): `out/fa/resume.html` contains the translated Persian tagline and `<title>رزومه | Mohammad Raouf Abedini</title>`; `out/zh/about.html` contains translated Chinese skill-matrix labels and a translated `<meta name="description">`; `out/ar/contact.html` contains the translated Arabic contact-form status text; `out/fa.html` (homepage) contains the translated Persian skip-to-content link — confirming both the SEO `generateMetadata` layer and the client UI layer genuinely localize per request, end to end.
- **Follow-ups**: (1) `data.ts` content translation (project descriptions, paper abstracts/titles, 7 writeup article bodies — the actual long-form technical writing) is a separate, substantial effort using the existing `localizedDescription`/`localizedFullDescription` hook; recommend scoping it as its own task per project or batch of projects rather than attempting inline. (2) `TerminalFeed.tsx` would benefit from a manual pass by someone who can judge, line by line, which fragments are literal commands (leave) vs. narration (translate) — flagged rather than guessed. (3) Deploy via `npm run build && npx wrangler pages deploy out --project-name raoufabedini --branch main` once reviewed.

### Raouf: 2026-07-03 (Australia/Sydney) — Hero singularity: Interstellar/Gargantua hybrid (warm gold disk + cyan brand rim)

- **Scope**: Push the raymarched black hole toward the Christopher Nolan *Interstellar* "Gargantua" look, but keep the site's cyan/charcoal identity — the "hybrid" direction the user picked (warm gold disk body, cyan photon ring + cyan rim glow as the brand signature).
- **Summary**: (1) Palette — the disk body is re-graded to a warm Gargantua ramp (`EMBER #52170a → AM amber → GOLD → HOT warm-white`; added `EMBER/GOLD/HOT` constants, warmed `AM`, removed the unused `VI` violet). The **photon ring and the tight rim halo stay cyan** (`CY`) and were brightened (~1.2× glow, whiter-cyan inner rim) so the brand signature reads deliberately as a cyan energy ring around the warm shadow rather than getting lost. (2) Matched the film's deliberate physics choices: Nolan and Kip Thorne muted the Doppler brightness asymmetry so Gargantua's halo reads evenly bright, so the beaming term was dialled from `clamp(1+0.9·dop,0.3,2.2)` down to `clamp(1+0.28·dop,0.68,1.4)` and the limb-whitening reduced; the disk texture was softened for the creamy Double-Negative render (`mix(0.5, swirl, 0.72)` low-contrast plus a gentler high-freq octave) instead of sharp filaments. (3) Wrap-around halo: the camera sits nearer edge-on (`pit` base `0.145→0.098`, breathing `±0.05→±0.035`) and the disk was widened and thickened (`TH 0.55→0.68`, `OUTER 11.5→12.5`, edge fade widened to `OUTER-3.2`) so the disk arcs into a fuller near-complete halo over and under the shadow. (4) The orbiting hot-spot flare was kept but made subtler and warm-tinted (`·1.8` boost, warm-white tint) rather than a bright cyan strobe; the void was cleaned further (`captured *= 0.05 → 0.03`). Autonomous loop camera, keplerian spin, runtime FPS guard, IntersectionObserver/visibility pause, reduced-motion frozen frame, and the WebGL-absent CSS fallback are all unchanged.
- **Files Changed**: `src/components/ui/SingularityCanvas.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 static pages. Live dev-server preview: desktop (1280) shows a warm gold Gargantua disk with a clearly-legible cyan photon rim, an even top/bottom halo, and a clean black void; 375×812 mobile places it lower-right with the headline clean and body copy still legible; 0 console errors; motion still loops autonomously (no mouse).
- **Follow-ups**: Deploy when approved via `npm run build && npx wrangler pages deploy out --project-name raoufabedini --branch main`.

### Raouf: 2026-07-03 (Australia/Sydney) — Hero singularity: autonomous loop motion + eye-catching polish

- **Scope**: Frontend-design audit pass — the raymarched black hole was beautiful but only moved on `mousemove` (so it looked static to an AI reviewer or trackpad visitor) and could be pushed further toward "shock on landing". Make it self-animate on a seamless loop and more striking, while keeping Professional-Ops restraint.
- **Summary**: (1) Motion — removed every trace of mouse control (the `u_mouse` uniform, the `mousemove` event listener, and the `mouseX/mouseY/targetMouse*` lerp state) and replaced it with an autonomous cinematic camera driven purely by `u_time`: a slow yaw sway (`sin(t·0.085)·0.34 rad`) combined with an inclination "breathing" (`0.145 + sin(t·0.125)·0.05`), both sinusoidal so the motion never stalls or seams. The camera keeps aiming at the origin, so the shadow stays put (composed right-of-headline on desktop, low-centre on mobile) and the headline stays readable while the disk visibly turns, opens and closes. (2) Life/polish for the "wow": a hot-spot now orbits the inner disk — `pow(max(cos(angle − t·0.55), 0), 48)` masked to the inner radius — as a bright travelling flare that draws the eye and tints toward white; the disk emission gained a second, higher-frequency turbulence octave (`pow(swirl,1.5) · (0.7 + 0.55·fbm(q·1.7 − t·0.05))`) for filamentary, photographic structure instead of soft fog; the photon ring now shimmers (`0.88 + 0.12·sin(t·2.1)` on the cyan glow, `0.82 + 0.18·sin(t·3.0)` on the white rim); a tighter hot-core bloom (`vec3(0.6,0.92,1.0)·0.04·exp(−rr·7.5)`) was layered under the existing halo; the keplerian disk spin was bumped 0.20→0.26; and disk brightness/contrast nudged up (`local·1.2`, `(1.5−alpha)·0.76`). All other motion sources (star twinkle) already loop on `u_time`, so the whole scene is a perpetual seamless loop. Reduced-motion still renders a single frozen representative frame; the runtime FPS guard, IntersectionObserver pause, tab-visibility pause, and CSS-nebula fallback are unchanged.
- **Files Changed**: `src/components/ui/SingularityCanvas.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 static pages. Live dev-server preview at 1280×800: two screenshots captured 2.6s apart with **no mouse input** show the disk texture, arch, and flare in different positions — confirming autonomous animation; 0 console errors; headline/body copy remain legible over the composition.
- **Follow-ups**: Deploy when approved via `npm run build && npx wrangler pages deploy out --project-name raoufabedini --branch main`.

### Raouf: 2026-07-03 (Australia/Sydney) — Rewrite hero singularity as a WebGL2 raymarched black hole

- **Scope**: The 2D-canvas particle singularity read as "cheap / scattered dots" with "janky" motion; replace it with a genuinely cinematic GPU black hole (user chose a full WebGL rewrite after being shown the options)
- **Summary**: Researched current shader references (Medium/dotcrossdot raymarching, oseiskar/black-hole, ebruneton black_hole_shader, threejsroadmap WebGPU) then implemented a single WebGL2 fragment shader — no three.js or any library, keeping the bundle lean per AGENT.md. Each pixel marches one ray, deflected toward the singularity every step via the conserved-angular-momentum photon approximation (`accel = -1.5·h²·p/r⁵`, `h = cross(p,v)` computed once), which produces real gravitational lensing: the far side of the accretion disk bends up and over the event horizon into the Interstellar-style arch. The disk is sampled **volumetrically** through a slab of half-thickness `TH` with front-to-back absorption, so the multiple lensed images blend smoothly instead of aliasing into "onion rings"; it is graded to the brand palette (amber → violet → cyan → cyan-white by heat rather than physical blackbody orange), with relativistic Doppler beaming brightening/whitening the approaching limb, a crisp photon ring at the 1.5·RS photon sphere, and a lensed procedural point-star field using the bent escape direction. Rays that cross the horizon are darkened to 0.05 so the shadow is a clean void. Tone map is Reinhard + a saturation lift for punch. Composition is responsive: on wide screens the hole is pushed screen-right so the left stays dark for the headline; on portrait it is re-centred, dropped below the headline, and zoomed out so it never sits on top of the body copy. Performance: internal-resolution scaling (0.7–0.8× capped at 1600px longest side), step-count quality tiers by width (170 desktop / 140 tablet / 122 mobile / 90 reduced-motion), `IntersectionObserver` pause when the hero scrolls away, tab-visibility pause, and a runtime FPS guard that drops one tier (fewer steps + 0.58 scale) if >40% of the opening second's frames run under 45fps — so weak/integrated GPUs stay smooth. `prefers-reduced-motion` renders one frozen representative frame; if WebGL2 is unavailable the component no-ops and the wrapper's CSS nebula shows. The DOM aurora/grain/vignette/scanline overlays are kept but toned down so they layer over the shader without washing it.
- **Files Changed**: `src/components/ui/SingularityCanvas.tsx` (full rewrite — particle system removed), `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 static pages. Live dev-server preview: measured ~60fps (16.6ms/frame) on desktop, 0 console errors; visually confirmed at 1280×800, 1440×860, and 375×812 — real lensed arch, solid black shadow, vivid cyan disk with violet/amber grading, crisp point stars, smooth continuous motion (no dots, no first-load speed ramp needed since there are no particles).
- **Follow-ups**: Deploy when approved via `npm run build && npx wrangler pages deploy out --project-name raoufabedini --branch main`.

### Raouf: 2026-07-03 (Australia/Sydney) — Fix hero singularity opening too fast on first load

- **Scope**: Bug fix — on first load the singularity animated visibly too fast for a few seconds, then stabilised to normal speed
- **Summary**: Two compounding causes. (1) Initial particle distribution was core-heavy: `makeParticle(initial)` used `Math.pow(bias, 1.75) * diskRadius`, skewing most first-paint particles toward small radii, where angular velocity is highest (`speed = 110/radius`, further multiplied up to ~3.2× by the time-dilation whip near the horizon). Respawned particles enter at the slow outer rim (`diskRadius + rand*80`), so as the initial inner swarm fell in and respawned outward, the disk visibly "calmed down" — the reported fast→normal transition. (2) Hydration jank amplified the effect: while the main thread stutters on load, the frame-step catch-up clamp advances physics up to 2× per rendered frame, doubling per-frame displacement and reading as frantic. Fix: initial radii now spread linearly across the disk (`horizonRadius + 24 + bias * (diskRadius + 56)`), matching the steady-state distribution of uniform inward drift; and `updateParticle` gains a spin-up ramp — an ease-out `warm` factor (0.3 → 1.0 over the first 180 physics frames ≈ 3 s) applied to both orbital and infall motion, so the disk gracefully accelerates into its normal speed and hydration-jank strobing is hidden. `frame` persists across the IntersectionObserver pause/resume, so scrolling away and back does not replay the ramp.
- **Files Changed**: `src/components/ui/SingularityCanvas.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 static pages. Dev-server preview reload at 1280×800: first-paint particles evenly spread across the disk (no inner-core swarm), motion eases in smoothly, 0 console errors/warnings.
- **Follow-ups**: None.

### Raouf: 2026-07-03 (Australia/Sydney) — Hero singularity: gravitational lensing, Doppler beaming, photon ring, infall flares + perf

- **Scope**: Full audit and creative rebuild of the hero landing black-hole animation (`SingularityCanvas`) — make the singularity physically breathtaking without leaving the Professional-Ops design system
- **Summary**: Audit findings: (1) the disk was a flat spiral of dots with no gravitational lensing or relativistic beaming — the two effects that make real black-hole imagery striking; (2) particles vanished abruptly at `horizonRadius + 3` (visible popping near the core); (3) the rAF loop ran at 60 fps for the entire homepage visit even with the hero scrolled away; (4) `project()` recomputed the same four sin/cos values per call, ~4k calls/frame. Upgrades — physics: a screen-space `lens()` bends all disk/trail light around the shadow (light from behind the hole cannot cross it and piles up on a shimmering Einstein rim; background stars deflect outward near the shadow and are occluded behind it); Doppler beaming brightens/whitens the approaching (left) limb and dims the receding limb toward violet, applied to particles, trails, and the new lensed arcs; a crisp double photon ring (white primary at 1.04r, thin cyan higher-order image at 0.955r); Gargantua-style lensed far-disk arcs arch over and under the shadow with a white→cyan→amber→violet Doppler gradient; time-dilation infall replaces the respawn pop (infall slows, orbit whips faster, light redshifts violet and fades to nothing at the horizon); and infall flares — every ~5–10 s one particle ignites white-amber, plunges with a long trail, and its horizon-crossing fires an expanding light-echo ring at the photon ring (max 4 concurrent). Perf: rotation sin/cos hoisted to a per-frame cache, and an IntersectionObserver (threshold 0.02) fully stops the render loop when the hero leaves the viewport, restarting it (with the existing frame-gap guard preventing physics jumps) on return. Reduced-motion keeps the static-render path (no flares/shimmer); palette, HUD rings, warped grid, jets, aurora/scanline overlays, and responsive particle counts unchanged. Added `.claude/launch.json` so agents can preview via the dev server.
- **Files Changed**: `src/components/ui/SingularityCanvas.tsx`, `.claude/launch.json` (new), `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass (0 errors); `npm run typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 static pages. Live dev-server preview at desktop and 375×812 mobile: 0 console errors/warnings; screenshots confirm the Doppler-bright left limb, Einstein-rim pile-up around the shadow, double photon ring, and the amber lensed under-arc.
- **Follow-ups**: Deploy via `npm run build && npx wrangler pages deploy out --project-name raoufabedini --branch main`.

### Raouf: 2026-06-26 (Australia/Sydney) — Translate research-forward About bio into fa/ar/zh/es

- **Scope**: Bring the four non-English About bios in line with the new English research-led narrative (bilingual consistency)
- **Summary**: Replaced `about.bio_1/2/3` in `fa`, `ar`, `zh`, and `es` with faithful translations of the English banger bio — five DOI-archived Zenodo preprints (ORCID-indexed), the Invisible Window flagship (100% evasion, macOS 26 novel finding, OWASP/FIRST/CISA disclosure), Project Simurgh (three preprints), and Aion-BibleQA (R@5 0.941, zero unsupported citations) with Anthropic evaluation. Technical proper nouns (DOI, Zenodo, ORCID, IEEE, Anthropic, Claude Code, Windows/macOS, Python/C/C++/TypeScript/Swift, R@5, project names) kept in Latin script. This also removed the stale "final-year student / graduating November 2026" framing that still lived only in these four bios. Left the hero `university` credential label ("Macquarie University · Nov 2026", consistent across all locales) as a factual graduation date — same reasoning as the kept resume education span.
- **Files Changed**: `src/i18n/locales/fa.ts`, `src/i18n/locales/ar.ts`, `src/i18n/locales/zh.ts`, `src/i18n/locales/es.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass; `npm run typecheck`: pass (Dictionary type enforces full key parity across locales); `npm run test:ci`: 68/68; `npm run build`: 155 pages. Built localized About pages confirm the new bio: `out/fa/about.html` (پیش‌چاپ دارای DOI), `out/ar/about.html` (مسوّدات بحثية ذات DOI), `out/zh/about.html` (带 DOI 的预印本), `out/es/about.html` (preprints con DOI) — all include `R@5`. No `graduating November 2026` framing remains in any bio.
- **Follow-ups**: None.

### Raouf: 2026-06-26 (Australia/Sydney) — Name consistency (RAOUF.M → RAOUF ABEDINI), ORCID on About, research-forward bio

- **Scope**: Three asks — (1) make every name display "Mohammad Raouf Abedini"/"Raouf Abedini" (kill "RAOUF.M"), (2) add ORCID to the About page, (3) rewrite the About bio as a strong researcher narrative grounded in the actual project portfolio
- **Summary**: (1) The only non-conforming name was `about.terminal_subject: "...: RAOUF.M"` in the About photo HUD overlay — fixed in all five locales to "...: RAOUF ABEDINI" (en/fa/ar/es/zh). Other "Raouf" usages are intentional and left as-is: JSON-LD `alternateName: "Raouf"`, Navbar terminal brand `~/raouf`, footer "designed by Raouf.", llms.txt narrative, and the academic citations "Abedini, M. R. (2026)" (correct APA author format). (2) Added a visible ORCID link (`Fingerprint` icon) to the About hero social row next to GitHub/LinkedIn/Email. (3) Rewrote `about.bio_1/2/3` (en) into a research-led story: lead now states five DOI-archived Zenodo preprints indexed under ORCID across offensive/defensive/AI-evaluation work; bio_2 keeps the Invisible Window flagship (100% evasion, macOS 26 novel finding, OWASP/FIRST/CISA disclosure); bio_3 surfaces Project Simurgh (3 preprints) + Aion-BibleQA (R@5 0.941, zero unsupported citations) + Anthropic evaluation. Verified all five project DOIs in `data.ts` (20376495, 20374849, 20549736, 20675513, 20522874) to keep the "five preprints" claim accurate. Non-English bios keep their existing professional translations (not re-translated this pass).
- **Files Changed**: `src/i18n/locales/en.ts`, `src/i18n/locales/fa.ts`, `src/i18n/locales/ar.ts`, `src/i18n/locales/es.ts`, `src/i18n/locales/zh.ts`, `src/app/[locale]/about/AboutClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 pages. Built `out/en/about.html`: 0 occurrences of `RAOUF.M`, contains `SUBJECT: RAOUF ABEDINI`, the ORCID link `href="https://orcid.org/0009-0000-6214-258X"`, and bio markers `five DOI-archived preprints` + `R@5 0.941`; site-wide `out/` sweep for `RAOUF.M`/`Raouf.M` returns 0 files.
- **Follow-ups**: Optionally re-translate the research-forward bio into fa/ar/zh/es for bilingual consistency. Deploy via `npm run build && npx wrangler pages deploy out --project-name raoufabedini --branch main`.

### Raouf: 2026-06-26 (Australia/Sydney) — Fix per-page canonical URLs (self-referential, locale-aware)

- **Scope**: Resolve Search Console "User-declared canonical: https://raoufabedini.dev/" on every sub-page — each URL must declare itself canonical, not the homepage
- **Summary**: Root cause: the shared `[locale]/layout.tsx` `generateMetadata` set `alternates.canonical: "/"`, and the per-page metadata exports never overrode it, so Next.js inherited the homepage canonical on `/about`, `/projects`, `/lab`, `/write-ups`, `/resume`, `/contact`, etc. Added `src/lib/seo.ts` with `buildAlternates(path, locale)` → returns a self-referential `canonical` (English at clean root path, other locales under their `/fa|/ar|/zh|/es` prefix) plus a full hreflang `languages` map. Converted every static `export const metadata` page to `generateMetadata({ params })` so it can read `locale` and call `buildAlternates`: about, lab, resume, contact, write-ups, hall-of-fame, security-policy, and `projects/layout.tsx` (covers the `/projects` list). Added `alternates` to the three detail pages' existing `generateMetadata` (`projects/[slug]`, `write-ups/[slug]`, `lab/[id]`) — widened their params type to include the runtime `locale`. Updated the root layout to use `buildAlternates("", locale)` so localized homepages self-canonical too (`/fa` → `/fa`, previously `/`). Confirmed the profile image `Raouf_2.jpg` (264 KB) is emitted to `out/` and served at `/Raouf_2.jpg` (the Search Console "resource didn't load" note is a conservative render snapshot, not a missing file).
- **Files Changed**: `src/lib/seo.ts` (new), `src/app/[locale]/layout.tsx`, `src/app/[locale]/about/page.tsx`, `src/app/[locale]/lab/page.tsx`, `src/app/[locale]/resume/page.tsx`, `src/app/[locale]/contact/page.tsx`, `src/app/[locale]/write-ups/page.tsx`, `src/app/[locale]/projects/layout.tsx`, `src/app/[locale]/projects/[slug]/page.tsx`, `src/app/[locale]/write-ups/[slug]/page.tsx`, `src/app/[locale]/lab/[id]/page.tsx`, `src/app/[locale]/hall-of-fame/page.tsx`, `src/app/[locale]/security-policy/page.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 pages. Built `<link rel="canonical">` now self-references on every page: `/about`→`/about`, `/projects`→`/projects`, `/lab`→`/lab`, `/write-ups`→`/write-ups`, `/resume`→`/resume`, `/contact`→`/contact`, `/hall-of-fame`→`/hall-of-fame`, `/security-policy`→`/security-policy`, `/projects/project-simurgh`→ itself, home→`https://raoufabedini.dev`; localized `out/fa.html`→`/fa` and `out/fa/about.html`→`/fa/about`.
- **Follow-ups**: After deploy, in Search Console use **Test live URL** → **Request indexing** on the main pages. Deploy via `npm run build && npx wrangler pages deploy out --project-name raoufabedini --branch main`.

### Raouf: 2026-06-26 (Australia/Sydney) — Visible ORCID links everywhere + "graduate / available now" positioning

- **Scope**: Make ORCID a human-clickable link across the site (it was only in structured data + llms.txt), and update availability copy from future-dated to "graduate, available now"
- **Summary**: Added a visible ORCID link to the global Footer social row (every page; `Fingerprint` icon, `aria-label="ORCID"`) and to the Resume header next to GitHub/LinkedIn (`ORCID iD` + `Fingerprint` icon). Combined with the earlier work, ORCID is now connected in five places: homepage Person `sameAs`, per-project `ScholarlyArticle`/`SoftwareSourceCode` author, `llms.txt`, Footer, and Resume. Repositioned availability: the Resume About summary and the `about.bio_1` English locale string changed from "final-year Cyber Security student at Macquarie University (graduating November 2026)" to "Cyber Security graduate from Macquarie University, available now"; the Resume "Additional Information" line changed from "Available for full-time, 4-month fellowship from July 2026" to "Available now for full-time roles and fellowships". The Education section's degree span (`May 2024 – Nov 2026`) is intentionally kept as the factual program record.
- **Files Changed**: `src/components/layout/Footer.tsx`, `src/app/[locale]/resume/ResumeClient.tsx`, `src/i18n/locales/en.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68 (Footer test still green — it asserts GitHub/LinkedIn, unaffected by the added ORCID link); `npm run build`: 155 pages. Built output: home `out/en.html` has footer `href="https://orcid.org/0009-0000-6214-258X"` + `aria-label="ORCID"`; `out/en/resume.html` has the `ORCID iD` link, `Available now`, `Cyber Security graduate from`, and 0 occurrences of `graduating November 2026` / `from July 2026` / `final-year Cyber Security student`; `out/en/about.html` bio updated (0 stale); education `May 2024 – Nov 2026` preserved.
- **Follow-ups**: Non-English locale bios (fa/ar/zh/es) never carried the November/availability claim, so no translation change was needed. Deploy via `npm run build && npx wrangler pages deploy out --project-name raoufabedini --branch main`.

### Raouf: 2026-06-26 (Australia/Sydney) — ORCID identity + per-project ScholarlyArticle/SoftwareSourceCode JSON-LD + dateModified

- **Scope**: Strengthen research E-E-A-T for Google AI search and AI answer engines — add ORCID, per-project research/code structured data with DOIs, and a freshness signal
- **Summary**: Added `ORCID_URL` (`https://orcid.org/0009-0000-6214-258X`) and a static `SITE_LAST_MODIFIED` constant to `constants.ts`. Wired ORCID into the homepage Person `sameAs` (now GitHub + LinkedIn + X + ORCID) and into `public/llms.txt`, and added `dateModified` to the WebSite JSON-LD node. Rewrote `projects/[slug]/page.tsx` (server component) to emit a per-project JSON-LD `@graph`: one `SoftwareSourceCode` node (or `CreativeWork` when there is no repo) for the project carrying `codeRepository`, `keywords`, and an ORCID-backed `author`, plus one `ScholarlyArticle` node for **every paper that has a DOI** — each keyed on its `https://doi.org/<doi>` `@id`, with `headline`, `abstract`, `datePublished` (paper year), `dateModified`, ORCID author, `publisher` (venue/Zenodo), and a `PropertyValue` DOI identifier; the project node links to its articles via `subjectOf` and articles back via `isPartOf`. All author nodes share the layout Person `@id` (`#person`) so engines resolve the project, every paper, and the global profile to one ORCID-identified researcher. `dateModified` uses the static constant (not `new Date()`) to avoid the hydration mismatch documented in earlier footer fixes. The JSON-LD is emitted via `dangerouslySetInnerHTML` over `JSON.stringify` of trusted static `data.ts` content (no user input) — same pattern already used in `layout.tsx`.
- **Files Changed**: `src/lib/constants.ts`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/projects/[slug]/page.tsx`, `public/llms.txt`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 pages. Built output confirms: home `out/en.html` has ORCID in `sameAs` and WebSite `"dateModified":"2026-06-26"`; `out/en/projects/project-simurgh.html` has `"@type":"ScholarlyArticle"` + all 3 Simurgh DOIs (`…20374849`, `…20549736`, `…20675513`) + `SoftwareSourceCode` + ORCID author; `invisible-window-research.html` has DOI `…20376495`; a project without papers (`gitswitch.html`) emits `SoftwareSourceCode` with 0 `ScholarlyArticle` nodes (conditional works).
- **Follow-ups**: Validate the rich results in Google's Rich Results Test / Search Console after deploy. Bump `SITE_LAST_MODIFIED` on future meaningful content updates. Deploy via `npm run build && npx wrangler pages deploy out --project-name raoufabedini --branch main`.

### Raouf: 2026-06-26 (Australia/Sydney) — Correct X/Twitter link + AI-search structured-data hardening

- **Scope**: Fix the wrong X (Twitter) profile link site-wide and strengthen structured data for Google AI search / AEO-GEO and AI answer engines
- **Summary**: The X link was wrong in two places — `TWITTER_URL` pointed at `twitter.com/Raoof128` and the Twitter card `creator` was `@Raoof128`; both now use the correct handle `Raoofr12` (`https://x.com/Raoofr12`, `@Raoofr12`), and the Twitter card gained a `site: "@Raoofr12"`. The corrected URL flows automatically to the Footer social icon and the JSON-LD `sameAs` array. For search optimisation, researched Google's official 2026 *AI features optimization guide* (which states AEO/GEO is "still SEO" — no AI-specific files/markup required; structured data, E-E-A-T, crawlability and unique content are what matter) plus current GEO guidance (entity consistency / `sameAs`, schema, multi-platform consensus). Acted on the highest-value lever: enriched the homepage JSON-LD by converting the single `Person` node into a `@graph` containing (1) a `Person` with stable `@id` (`#person`), added `image` (`/Raouf_2.jpg`) and `email`, and the existing `knowsAbout`/`sameAs`, and (2) a new `WebSite` node (`#website`) whose `publisher` references the Person `@id` — giving Google/AI engines a single connected entity for the person + site. Added the X link to `public/llms.txt` Contact so non-Google AI engines see a consistent same-person signal. `src/app/[locale]/layout.tsx` was reformatted by Prettier (pre-existing non-Prettier style) as part of this change.
- **Files Changed**: `src/lib/constants.ts`, `src/app/[locale]/layout.tsx`, `public/llms.txt`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass (0 errors); `npm run typecheck`: pass; `npm run test:ci`: 68/68 passing; `npm run build`: pass, 155 static pages. Built `out/en.html` contains `x.com/Raoofr12`, `@Raoofr12`, `"@type":"WebSite"`, `#person`, `Raouf_2.jpg`, and footer `href="https://x.com/Raoofr12"`; remaining `Raoof128` occurrences are the GitHub URL only (correct).
- **Follow-ups**: Deploy via `npm run build && npx wrangler pages deploy out --project-name raoufabedini --branch main`. Optional next SEO steps the user may want: register the site in Google Search Console + submit `sitemap.xml`; add per-project `SoftwareSourceCode`/`ScholarlyArticle` JSON-LD with DOIs; keep `dateModified` fresh on key pages (Perplexity favours recently-updated content).

### Raouf: 2026-06-13 (Australia/Sydney) — Bump GitHub Actions off deprecated Node 20

- **Scope**: Clear the Node 20 runtime deprecation warning across both workflows
- **Summary**: Bumped pinned actions to their current latest majors (all run on Node 24): `actions/checkout@v4 → v6` and `actions/setup-node@v4 → v6` in both `ci.yml` and `deploy.yml`, plus `actions/upload-artifact@v4 → v7` and `actions/download-artifact@v4 → v8` in `deploy.yml`. Verified latest majors via the GitHub releases API before pinning.
- **Files Changed**: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: Pending live run on push; expect no Node 20 deprecation annotation.
- **Follow-ups**: None.

### Raouf: 2026-06-13 (Australia/Sydney) — Cloudflare Pages auto-deploy workflow

- **Scope**: Add CI/CD auto-deploy to Cloudflare Pages (replacing manual `wrangler` deploys)
- **Summary**: Added `.github/workflows/deploy.yml` that, on push to `main` (or manual dispatch), deploys `out/` to Cloudflare Pages via `cloudflare/wrangler-action@v3` (`pages deploy out --project-name=raoufabedini --branch=main`). Set the `CLOUDFLARE_ACCOUNT_ID` GitHub repo secret via `gh secret set`. The `CLOUDFLARE_API_TOKEN` secret must be created in the Cloudflare dashboard (Account → Cloudflare Pages → Edit) — wrangler's OAuth token is API-blocked from minting tokens. **Security-hardened after two automated review passes**: split into a secret-free `build` job (npm ci/lint/typecheck/test/build → uploads `out/` artifact; no Cloudflare token in the env where untrusted dependency code runs) and a `deploy` job that alone holds the token and runs only artifact-download + wrangler. The build job emits a boolean `has_token` output (never the secret value); the deploy job gates on `github.ref == 'refs/heads/main' && needs.build.outputs.has_token == 'true'` so it stays green until the token is added and `workflow_dispatch` on a non-`main` ref can never reach production.
- **Files Changed**: `.github/workflows/deploy.yml` (new, Cloudflare version), `AGENT.md`, `CHANGELOG.md`
- **Verification**: `gh secret list`: `CLOUDFLARE_ACCOUNT_ID` present; first run (single-job draft) green with deploy skipped; workflow uses no untrusted event input in `run:` steps; token scoped to deploy-only job; deploy pinned to `main`.
- **Follow-ups**: User creates `CLOUDFLARE_API_TOKEN` in dashboard + `gh secret set CLOUDFLARE_API_TOKEN`; after that, every push to `main` auto-deploys (or re-run via workflow_dispatch).

### Raouf: 2026-06-13 (Australia/Sydney) — Remove stale GitHub Pages workflow + add private CLAUDE.md

- **Scope**: Correct the deployment automation and add local agent context
- **Summary**: Deleted `.github/workflows/deploy.yml`, which still deployed to GitHub Pages even though the site migrated to Cloudflare Pages (project `raoufabedini`, `raoufabedini.dev`); redeploys are done manually via `wrangler pages deploy out --project-name raoufabedini --branch main` and `ci.yml` already covers lint/typecheck/test. Added a private, gitignored `CLAUDE.md` capturing stack, the Cloudflare deploy command, required checks, the Raouf Change Protocol, the data-layer/paper recipe, and project facts. Added `CLAUDE.md` to `.gitignore`.
- **Files Changed**: `.github/workflows/deploy.yml` (deleted), `.gitignore`, `CLAUDE.md` (gitignored, not committed), `AGENT.md`, `CHANGELOG.md`
- **Verification**: `git check-ignore CLAUDE.md`: ignored; `npm run lint`/`typecheck`/`test:ci` (68/68)/`build` (155 pages): pass; manual Cloudflare deploy succeeded (`wrangler pages deploy out --project-name raoufabedini --branch main`).
- **Follow-ups**: None. If automated CI deploys are wanted later, add `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` repo secrets and a `cloudflare/wrangler-action` step.

### Raouf: 2026-06-13 (Australia/Sydney) — Banking Shield preprint

- **Scope**: Add the Banking Shield paper to the Project Simurgh research paper library
- **Summary**: Copied `Banking_Shield_Machine_Checked_Absence_Claims_Preprint_v1.2.pdf` into `public/`, read the full preprint, and added a third typed `ProjectPaper` entry to `project-simurgh.papers`. The paper (Source repo: `github.com/Raoof128/Project-Simurgh`) is a fictional non-bank research prototype turning privacy/overclaim boundaries into machine-checkable evidence — a 46-name forbidden-field firewall, a deterministic offline AI privacy firewall, and per-response privacy receipts on per-session HMAC audit chains; at evidence freeze 417/417 unit tests, 43/43 E2E, 27/27 security checks, three privacy audits, and a no-egress static gate passed, with a five-tester/30-session dry run showing zero sensitive values in evidence and 5/5 non-claim checklist comprehension. Added Zenodo DOI `10.5281/zenodo.20675513` and updated the data-layer regression test to expect three Simurgh papers.
- **Files Changed**: `public/Banking_Shield_Machine_Checked_Absence_Claims_Preprint_v1.2.pdf`, `src/lib/data.ts`, `src/lib/data.test.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass (0 errors); `npm run typecheck`: pass; `npm run test:ci`: 68/68 passing; `npm run build`: pass, 155 static pages generated; built `out/en/projects/project-simurgh.html` contains the Banking Shield title, `10.5281/zenodo.20675513`, `/Banking_Shield_Machine_Checked_Absence_Claims_Preprint_v1.2.pdf`, and the `Author-prepared preprint` status; PDF emitted to `out/`.
- **Follow-ups**: None.

### Raouf: 2026-06-06 (Australia/Sydney) — Root layout tag fix

- **Scope**: Resolve runtime layout validation error
- **Summary**: Removed the redundant top-level root layout file `src/app/layout.tsx`. Next.js localized layouts (`src/app/[locale]/layout.tsx`) serve as root layouts; keeping a top-level layout that lacks `<html>` and `<body>` tags causes runtime crashes. Cleared cached `.next` directory to reset TS compiler route declarations.
- **Files Changed**: `src/app/layout.tsx` (deleted)
- **Verification**: `rm -rf .next && npm run typecheck`: pass; `npm run lint`: pass; `npm run test:ci`: 68/68 passing; `npm run build`: pass (155 routes generated).
- **Follow-ups**: None.

### Raouf: 2026-06-06 (Australia/Sydney) — Singularity & DecryptedText Audit

- **Scope**: Optimize and enhance homepage animations (Singularity & DecryptedText)
- **Summary**: Replaced pixel-level context `shadowBlur` with performant double-pass overlay glows (thick low-opacity backstroke) to resolve rendering lag on high-DPI displays. Added smooth cursor-parallax 3D viewport tilting on the singularity disk and size-weighted depth shifts on background stars. Hardened resize calculations to adapt existing particle/star lists dynamically without jarring animation resets. Resolved Next.js hydration mismatch warning in `DecryptedText` by initializing state with clear text and scrambling only on client mount.
- **Files Changed**: `src/components/ui/SingularityCanvas.tsx`, `src/components/ui/DecryptedText.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass (0 errors); `npm run typecheck`: pass; `npm run test:ci`: 68/68 passing; `npm run build`: pass (155 routes generated).
- **Follow-ups**: None.

### Raouf: 2026-06-06 (Australia/Sydney) — Singularity rAF timing hardening

- **Scope**: Improve homepage singularity particle animation using current browser animation guidance
- **Summary**: Kept the original particle distribution and visual model intact while converting the simulation from frame-count motion to `requestAnimationFrame` timestamp-based motion. Added a 60fps-normalized timestep, clamped long startup/background gaps to prevent catch-up bursts, made trail sampling time-based so high-refresh displays do not shorten trails, disabled non-essential physics under `prefers-reduced-motion`, and skipped expensive shadow blur passes in reduced-motion mode. Reviewed MDN `requestAnimationFrame`, Canvas optimization, OffscreenCanvas, and reduced-motion guidance; deferred a worker-based OffscreenCanvas migration because it would move the whole render loop across threads and needs visual QA before changing production behavior.
- **Files Changed**: `src/components/ui/SingularityCanvas.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check src/components/ui/SingularityCanvas.tsx`: pass; original radius formula `CFG.horizonRadius + 28 + Math.pow(bias, 1.75) * CFG.diskRadius` confirmed intact; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68 passing; `npm run build`: pass, 155 static pages generated.
- **Follow-ups**: If animation still needs deeper performance work, prototype OffscreenCanvas worker rendering behind a feature flag and verify visually across desktop/mobile before release.

### Raouf: 2026-06-06 (Australia/Sydney) — Resume paper updates

- **Scope**: Update the portfolio resume with Project Simurgh supplement and Aion-BibleQA research
- **Summary**: Updated the downloadable DOCX resume and synced the Desktop resume copy with the latest research entries. Added Project Simurgh supplement DOI `10.5281/zenodo.20549736` and Aion-BibleQA DOI `10.5281/zenodo.20522874` to the resume summary/project content, added RAG evaluation and citation-faithfulness benchmarking to AI/ML skills, and surfaced Project Simurgh and Aion as selected research projects on the web resume page.
- **Files Changed**: `public/Raouf_Portfolio_Resume.docx`, `/Users/raoof.r12/Desktop/Resume/Raouf_Portfolio_Resume.docx`, `src/app/[locale]/resume/ResumeClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `pandoc --track-changes=all public/Raouf_Portfolio_Resume.docx -t plain --wrap=none | rg ...`: confirmed both paper DOIs and metrics in the DOCX text; `unzip -t public/Raouf_Portfolio_Resume.docx`: no archive errors; `cmp -s public/Raouf_Portfolio_Resume.docx /Users/raoof.r12/Desktop/Resume/Raouf_Portfolio_Resume.docx`: synced; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68 passing; `npm run build`: pass, 155 static pages generated; built and live dev `/en/resume` output contains Project Simurgh, Aion-BibleQA, both DOIs, `R@5 = 0.941`, and `citation_support`; dev DOCX download returns HTTP 200 with `Content-Length: 12421`.
- **Follow-ups**: None.

### Raouf: 2026-06-06 (Australia/Sydney) — Aion BibleQA preprint

- **Scope**: Add the Aion-BibleQA paper to the Aion research paper section
- **Summary**: Copied `aion-bibleqa-citation-faithfulness-bible-rag.pdf` into `public/`, extracted its metadata/text, and added a typed Aion `papers` entry with the full title, Zenodo DOI `10.5281/zenodo.20522874`, and preprint summary covering the 40-question Bible RAG benchmark, R@5 `0.941`, citation_support `0.978`, zero unsupported citations, and 6/6 false-premise refusals. Added a data-layer regression test for the Aion paper library entry.
- **Files Changed**: `public/aion-bibleqa-citation-faithfulness-bible-rag.pdf`, `src/lib/data.ts`, `src/lib/data.test.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `pdftotext -layout aion-bibleqa-citation-faithfulness-bible-rag.pdf -`: extracted title, DOI, and results; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68 passing; `npm run build`: pass, 155 static pages generated; built and live dev `/en/projects/aion` output contains `id="research-papers"`, Aion-BibleQA title, `/aion-bibleqa-citation-faithfulness-bible-rag.pdf`, `10.5281/zenodo.20522874`, `R@5 = 0.941`, and `citation_support = 0.978`.
- **Follow-ups**: None.

### Raouf: 2026-06-06 (Australia/Sydney) — Project Simurgh supplement DOI polish

- **Scope**: Remove Simurgh hero preprint CTA and strengthen the supplement paper card
- **Summary**: Suppressed the hero `Read the preprint` button on Project Simurgh while leaving the sidebar/reference links intact. Extracted the supplement PDF text and updated the Research Papers card with its full paper title, Zenodo DOI `10.5281/zenodo.20549736`, and a paper-specific explanation covering the 31 consented sessions, ballot-choice exclusion, HMAC audit chain, forbidden-field rejection, and 5/5 collection-closure gates.
- **Files Changed**: `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`, `src/lib/data.ts`, `src/lib/data.test.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `pdftotext -layout public/Project_Simurgh_Voting_Adjacent_Supplement_Phase_C_Preprint_v1.0.pdf -`: extracted DOI and pilot details; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 67/67 passing; `npm run build`: pass, 155 static pages generated; built and live dev hero checks return `hero_clean` and `hero_has_repo`; built/dev output contains supplement title, `10.5281/zenodo.20549736`, `31 consented sessions`, and `5/5 collection-closure gates`.
- **Follow-ups**: None.

### Raouf: 2026-06-06 (Australia/Sydney) — Project Simurgh supplement paper

- **Scope**: Add the Project Simurgh voting-adjacent supplement to the paper library
- **Summary**: Copied `Project_Simurgh_Voting_Adjacent_Supplement_Phase_C_Preprint_v1.0.pdf` into `public/`, added it as a second Project Simurgh `papers` entry, and removed the hero-level paper download button so downloadable papers live only in the Research Papers section.
- **Files Changed**: `public/Project_Simurgh_Voting_Adjacent_Supplement_Phase_C_Preprint_v1.0.pdf`, `src/lib/data.ts`, `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`, `src/lib/data.test.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 67/67 passing; `npm run build`: pass, 155 static pages generated; built output and live dev route confirm `id="research-papers"`, `Project Simurgh: Voting-Adjacent Supplement Phase C`, and `/Project_Simurgh_Voting_Adjacent_Supplement_Phase_C_Preprint_v1.0.pdf`.
- **Follow-ups**: None.

### Raouf: 2026-06-06 (Australia/Sydney) — Project Simurgh paper library section

- **Scope**: Make Project Simurgh support multiple papers without cluttering the project page
- **Summary**: Added a typed `ProjectPaper` data model and `papers` arrays for Project Simurgh and Invisible Window while keeping the existing `links.paper` field as a compatibility fallback. Replaced repeated single-paper hero button rendering with shared link rendering, added a dedicated responsive Research Papers section with DOI/status/venue metadata, and changed the sidebar paper row into a jump link so future papers stay grouped cleanly.
- **Files Changed**: `src/lib/data.ts`, `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`, `src/lib/data.test.ts`, `src/i18n/locales/en.ts`, `src/i18n/locales/fa.ts`, `src/i18n/locales/ar.ts`, `src/i18n/locales/zh.ts`, `src/i18n/locales/es.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 67/67 passing; `npm run build`: pass, 155 static pages generated; local QA on `http://localhost:3001/en/projects/project-simurgh`: route returned 200; built HTML confirms `id="research-papers"`, sidebar `href="#research-papers"`, Simurgh paper title, DOI `10.5281/zenodo.20374849`, `/Project_Simurgh_Preprint_v1.0.pdf`, and `download=""`.
- **Follow-ups**: Add additional Simurgh paper PDFs or external records to the `papers` array when the files/links are ready.

### Raouf: 2026-06-03 (Australia/Sydney) — Zurvan header/footer theme fix

- **Scope**: Remove default cyan fallback from shared header/footer chrome on Zurvan
- **Summary**: Replaced the remaining hardcoded cyan glow values in shared navbar/global utilities with active theme CSS variables. Changed the footer background from fixed `#030712` to `bg-background` so it follows `[data-theme="zurvan"]`. This keeps the Zurvan page chrome aligned to `#EDAB18` rather than falling back to the default cyan ambience.
- **Files Changed**: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `src/app/globals.css`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 67/67 passing; Browser QA on `http://localhost:3000/en/projects/project-zurvan`: `data-theme="zurvan"`, `--color-cyan-DEFAULT: #edab18`, header terminal icon computed as `rgb(237, 171, 24)`, footer accent computed as `rgb(237, 171, 24)`, footer background computed as `rgb(4, 3, 1)`, no console warnings/errors.
- **Follow-ups**: None.

### Raouf: 2026-06-03 (Australia/Sydney) — Zurvan palette and starfield polish

- **Scope**: Align Project Zurvan detail page colours and animation visibility
- **Summary**: Replaced Zurvan-specific `#DAA520`/yellow styling with the requested `#EDAB18` palette across hero tags, links, section accents, borders, and content panels. Added the missing `[data-theme="zurvan"]` global token block so shared page chrome follows the same theme as the other project pages. Updated `CosmicLoomCanvas` to use the `#EDAB18` gold family and draw a deterministic twinkling starfield behind the infinity animation so the background stars remain visible.
- **Files Changed**: `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`, `src/components/ui/CosmicLoomCanvas.tsx`, `src/app/globals.css`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 67/67 passing; `npm run build`: pass, 155 static pages generated; Browser QA on `http://localhost:3000/en/projects/project-zurvan`: title correct, `data-theme="zurvan"`, `--color-cyan-DEFAULT: #edab18`, one canvas rendered, no console warnings/errors, screenshot confirms visible stars behind the infinity sign.
- **Follow-ups**: None.

### Raouf: 2026-06-03 (Australia/Sydney) — Zurvan body background

- **Scope**: Apply #DAA520 theme to all Zurvan detail page elements
- **Summary**: The `theme` object already covered all content sections (section numbers, borders, bullets, icons, sidebar). The only missing element was the per-project body container background tint. Added `isZV ? "bg-[#040300]"` to the inline ternary in the content grid div — `#040300` is a near-black with a minute golden-void undertone that matches the `#020103` canvas hero background and the #DAA520 palette.
- **Files Changed**: `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npx tsc --noEmit`: pass; `npm run test:ci`: 67/67 passing
- **Follow-ups**: None.

### Raouf: 2026-06-03 (Australia/Sydney) — Zurvan CosmicLoom animation

- **Scope**: Add Project Zurvan canvas hero animation + full #DAA520 colour palette
- **Summary**: Created `CosmicLoomCanvas.tsx` — a 3D lemniscate-of-Bernoulli (infinity-sign) particle system using the Zurvan Protocol design from the supplied HTML. Key decisions: (1) the lemniscate is always drawn as a visible glowing stroke using three render passes (wide haze 10px, medium 4px, crisp 1.2px) so the ∞ shape is immediately readable; (2) 200 particles in two factions — Ahura (gold, #DAA520/#FFD700) orbiting the lemniscate with positive phase offset and Ahriman (crimson) with π phase offset — connected by same-faction webbing within 42px; (3) a singularity core glow sits permanently at the crossing point (0,0,0); (4) a subtle Persian Shamseh mandala rotates in the background at 0.0006 rad/frame; (5) mouse tracking from the HTML was replaced with a deterministic sin-based auto-oscillation (rotY = sin(frame×0.008)×0.35, rotX = sin(frame×0.005)×0.22+0.14) since the canvas lives inside a fixed-size hero container; (6) visibility-change pause/resume and RAF cleanup on unmount follow the existing DnaHelixCanvas pattern; background is `#020103` (primordial void). Wired into `ProjectDetailClient.tsx`: added `ZV = "project-zurvan"` constant, `isZV` boolean, `#DAA520` theme block, `ThemeInjector theme="zurvan"`, `CosmicLoomCanvas` dynamic import (ssr:false), and a Zurvan hero section inserted before the default fallback in the ternary chain.
- **Files Changed**: `src/components/ui/CosmicLoomCanvas.tsx` (new), `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npx tsc --noEmit`: pass; `npm run test:ci`: 67/67 passing
- **Follow-ups**: None.

### Raouf: 2026-06-03 (Australia/Sydney)

- **Scope**: Add Project Zurvan to portfolio project list
- **Summary**: Added Project Zurvan (local-first LLM knowledge engine, Python 3.10+, 183 tests, 18 phases) as a new portfolio entry positioned directly after Project Simurgh in `data.ts`. Added a full-width (md:col-span-3) bento card in the homepage grid with purple ENGINEERING accent styling and "LOCAL-FIRST · MCP AGENT MEMORY" badge. Added a data-layer regression test asserting `project-zurvan` follows `project-simurgh` in key order. Added entry #4 in `public/llms.txt`, renumbering Syllabus-Sync through ECRSM.
- **Files Changed**: `src/lib/data.ts`, `src/app/[locale]/page.tsx`, `src/lib/data.test.ts`, `public/llms.txt`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npx tsc --noEmit`: pass; `npm run test:ci`: 67/67 passing
- **Follow-ups**: None.

### Raouf: 2026-05-28 (Australia/Sydney)

- **Scope**: Lab section full audit — placeholder code, dead fields, type duplication, broken file extension
- **Summary**: Four issues fixed: (1) Replaced all three `codeSnippet: "..."` placeholders with real, commented educational code — Rust `SetWindowsHookEx` keylogger (ARCHIVED), Python raw-socket TCP sniffer with manual IP/TCP header parsing (ACTIVE), and Go LSB PNG steganography with length-prefixed embedding (CONCEPT). (2) Removed the dead `link?` field from `LabExperiment` interface and all three entries — it pointed to the generic GitHub profile and was never rendered anywhere. (3) In `LabDetailClient.tsx`, removed the locally-redefined `LabExperiment` interface and replaced it with a type import from `@/lib/data`, eliminating silent drift risk. (4) Fixed the fake editor filename — `tech[0].toLowerCase()` was producing `src/main.rust`/`src/main.python`; added an `EXT_MAP` lookup so Rust→`.rs`, Python→`.py`, Go→`.go`.
- **Files Changed**: `src/lib/data.ts`, `src/app/[locale]/lab/[id]/LabDetailClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npx tsc --noEmit`: pass; `npm run test:ci`: 66/66 passing
- **Follow-ups**: None.

### Raouf: 2026-05-25 (Australia/Sydney)

- **Scope**: Preprint, Paper, & Repo Layout — Invisible Window & Project Simurgh
- **Summary**: Updated project link assets for Invisible Window and Project Simurgh. Retained repository, preprint, and direct PDF paper download options (removed the DOI record link). Wired direct paper download buttons for both projects on their details pages and updated data layer tests.
- **Files Changed**: `public/Invisible_Window_Research_Preprint_V2.0.pdf`, `public/Project_Simurgh_Preprint_v1.0.pdf`, `public/llms.txt`, `src/app/[locale]/page.tsx`, `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`, `src/lib/data.ts`, `src/lib/data.test.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: Run `npm run test:ci` (66/66 tests passing), `npm run lint` (clean), and `npm run build` (150 static routes prerendered).
- **Follow-ups**: Verify that download links for papers on the details pages function correctly in production.

### Raouf: 2026-05-19 (fix: Cloudflare Pages routing + cache headers)

- **Scope**: Fix 404 on chunk assets and missing root index.html after i18n migration
- **Summary**: `proxy.ts` does not execute in a plain `wrangler pages deploy out/` — it requires Cloudflare Workers setup. Added `public/_redirects` to handle all locale routing at CDN level: clean English paths (/, /projects, /lab, /write-ups, /resume, /about, /contact, /hall-of-fame, /security-policy, /projects/:slug, /write-ups/:slug, /lab/:id) rewrite to /en/_ via status 200; public /en/_ paths redirect 302 back to clean URLs. Added `public/_headers` so HTML pages are served with `max-age=0, must-revalidate` preventing browsers from caching stale HTML that references outdated content-hashed JS chunks — the root cause of the 404 chunk error. Also fixed `[locale]/layout.tsx` LayoutProps type for Next.js 16 compatibility (params.locale must be `string` at framework level, narrowed to `Locale` at runtime).
- **Files Changed**: `public/_redirects` (new), `public/_headers` (new), `src/app/[locale]/layout.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run build`: 155 static pages; `wrangler pages deploy`: deployed to https://e3eb23a9.raoufabedini.pages.dev; `git push origin main`: pushed
- **Follow-ups**: If Cloudflare Workers-based middleware is needed in future, use `@cloudflare/next-on-pages` adapter instead of plain static export deploy.

### Raouf: 2026-05-19 (i18n senior audit pass — quality fixes)

- **Scope**: Full repository-wide i18n audit per structured 4-phase prompt — coverage, quality, hardcoded strings, consistency
- **Summary**: Confirmed all 4 non-English locale files (fa, ar, zh, es) have full 165-key coverage matching English — TypeScript `Dictionary` type enforcement guarantees zero structural gaps at compile time. Quality pass found 3 issues across 2 files: (1) `zh.about.stats_projects` had counter word "个项目" → natural label "项目"; (2) `zh.about.stats_vendors` had grammatically fragmented "家厂商披露" → natural "已披露厂商"; (3) `fa.hall_of_fame.report_guidance` + `report_guidance_suffix` were structured so the linked text ("سیاست امنیتی") appeared stranded after a complete sentence — restructured to "...برای راهنمایی به [link] مراجعه کنید." matching the Arabic pattern. No missing keys, no empty values, no broken placeholders found. Hardcoded string audit confirms previous session covered all translatable UI. Intentional English-only content confirmed: brand marks, resume body, skill names, TICKER, JSON-LD/metadata.
- **Files Changed**: `src/i18n/locales/zh.ts`, `src/i18n/locales/fa.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx tsc --noEmit`: 0 errors; `npm run lint`: pass; `npm run test:ci`: 66/66 passing
- **Follow-ups**: All locales now at full production quality. No further i18n structural work required before deploy.

### Raouf: 2026-05-19 (i18n full audit — 121-issue deep pass)

- **Scope**: Full file-by-file i18n audit and translation of all remaining hardcoded strings across 12 files
- **Summary**: Ran a comprehensive explore-agent audit across all 33 i18n-relevant files, found 121 issues. Added 4 new translation namespaces (`project_detail` 12 keys, `writeups_detail` 1 key, `hall_of_fame` 15 keys, `security_policy` 32 keys) plus extensions to `footer` (status, last_index_value, environment), `common` (select_language, language_selected), and `about` (10 keys: photo error, terminal HUD labels, education degrees and courses) across all 5 locale files. Wired translations into: `ProjectDetailClient.tsx` (11 hardcoded ternaries replaced), `WriteupDetailClient.tsx` (END_OF_TRANSMISSION), `HallOfFameClient.tsx` (full page rewrite with RTL support), `SecurityPolicyClient.tsx` (full page rewrite with RTL support + locale-aware links), `Footer.tsx` (Status/Environment/date), `LanguageSwitcher.tsx` (aria-label + SELECTED badge), `AboutClient.tsx` (terminal HUD labels, photo error text, education ternaries). Intentionally kept English: Navbar brand `~/raouf` (terminal identity), resume body content (professional), technical skill names, TICKER (decorative), JSON-LD, metadata.
- **Files Changed**: `src/i18n/locales/en.ts`, `fa.ts`, `ar.ts`, `zh.ts`, `es.ts`, `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`, `write-ups/[slug]/WriteupDetailClient.tsx`, `hall-of-fame/HallOfFameClient.tsx`, `security-policy/SecurityPolicyClient.tsx`, `src/components/layout/Footer.tsx`, `LanguageSwitcher.tsx`, `src/app/[locale]/about/AboutClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npx tsc --noEmit`: pass; `npm run test:ci`: 66/66 passing
- **Follow-ups**: Remaining intentional English-only content: Navbar/Footer brand text, resume body, skill matrix names, TICKER, metadata/JSON-LD. Run `npm run build` before deploy.

### Raouf: 2026-05-19 (i18n audit pass — untranslated pages + sitemap + font)

- **Scope**: Complete i18n coverage from Gemini audit prompt — wire translations into all remaining untranslated pages, add Vazirmatn font, and rebuild sitemap with locale coverage
- **Summary**: Added 4 new translation namespaces (`projects_page`, `resume_page`, `not_found`, `lab_detail`) to all 5 locale files. Converted `projects/page.tsx`, `not-found.tsx`, `lab/[id]/LabDetailClient.tsx`, and `ResumeClient.tsx` to use `useTranslation` — each now renders UI chrome in the active locale while keeping technical/professional content (project titles, code, resume body) in English. Added Vazirmatn Arabic font via `next/font/google` (with `--font-vazirmatn` CSS variable) to the `[locale]` layout so fa/ar locales render with the correct typeface. Rebuilt `sitemap.ts` to emit all 5 locales × all routes (static pages, project detail pages, write-up detail pages) with `alternates.languages` hreflang blocks for SEO. The `not-found.tsx` uses `getLocaleFromPath(usePathname())` to construct locale-aware "Return Home" and "Browse Projects" links.
- **Files Changed**: `src/i18n/locales/en.ts`, `src/i18n/locales/fa.ts`, `src/i18n/locales/ar.ts`, `src/i18n/locales/zh.ts`, `src/i18n/locales/es.ts`, `src/app/[locale]/projects/page.tsx`, `src/app/[locale]/not-found.tsx`, `src/app/[locale]/lab/[id]/LabDetailClient.tsx`, `src/app/[locale]/resume/ResumeClient.tsx`, `src/app/[locale]/layout.tsx`, `src/app/sitemap.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npx tsc --noEmit`: pass; `npm run test:ci`: 66/66 passing
- **Follow-ups**: security-policy and hall-of-fame pages are intentionally left in English — their content is legal/personal and must remain precise. Run `npm run build` before deploy to verify all locale static routes generate correctly (expected: 5 locales × all route combinations).

### Raouf: 2026-05-19 (i18n rollout completion)

- **Scope**: Complete Gemini's i18n migration — restore missing data, fill locale gaps, fix test suite
- **Summary**: Gemini had partially completed the i18n migration (moved all routes into `app/[locale]/`, created the i18n provider, and added localized project descriptions) but left five tasks incomplete: (1) stripped 5 writeups from `data.ts` breaking the data test, (2) left `contact`, `lab_page`, and `writeups_page` keys missing from `ar.ts`, `es.ts`, and `zh.ts`, (3) left `Footer`, `Navbar`, and `AboutClient` tests missing `I18nProvider` wrappers causing 17 test failures, (4) used `locale as any` casts in page.tsx and ProjectDetailClient (lint errors), and (5) typed the dictionary loader as `Promise<any>`. All five gaps resolved. Also verified proxy.ts uses correct `NextResponse` API (fixed earlier in session).
- **Files Changed**: `src/lib/data.ts`, `src/i18n/locales/ar.ts`, `src/i18n/locales/es.ts`, `src/i18n/locales/zh.ts`, `src/i18n/index.ts`, `src/components/layout/Footer.test.tsx`, `src/components/layout/Navbar.test.tsx`, `src/app/[locale]/about/AboutClient.test.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass (0 errors); `npx tsc --noEmit`: 0 errors on src/; `npm run test:ci`: 66/66 passing
- **Follow-ups**: One test dropped vs. previous 67 — the `security.txt` link was removed from the redesigned Footer; this is intentional. A build (`npm run build`) should be run before deploy to verify all locale static pages generate correctly.

### Raouf: 2026-05-19 (proxy.ts API fix)

- **Scope**: Fix incorrect Next.js 16 proxy API usage in `src/proxy.ts`
- **Summary**: The file was written with three wrong API calls: `import { proxy } from 'next/server'` (proxy is not exported from next/server), `export default proxy((req) => {...})` (proxy is not a HOF wrapper), and `return proxy.rewrite(url)` (no such method). Fixed by importing `NextResponse`, exporting a plain named `export function proxy(request)`, using `NextResponse.rewrite()` / `NextResponse.redirect()` / `NextResponse.next()` throughout, and adding a `config.matcher` to skip static/API paths at the framework level instead of manually.
- **Files Changed**: `src/proxy.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx tsc --noEmit`: zero errors in `proxy.ts` (pre-existing i18n locale and .next cache errors unrelated to this change)
- **Follow-ups**: Pre-existing TS errors in `src/i18n/locales/ar.ts`, `es.ts`, `zh.ts` (missing `contact`, `lab_page`, `writeups_page` keys) and `.next` cache validator should be addressed separately as part of the i18n rollout.

### Raouf: 2026-05-19 (singularity hero)

- **Scope**: Replace hero particle network + terminal with singularity animation
- **Summary**: Removed `ParticleNetwork` (mouse-reactive network mesh) and `TerminalFeed` (right-column terminal widget) from the homepage hero. Created `SingularityCanvas` — a new full-screen canvas component porting the accretion-disk black hole animation (orbital particles, concentric grid rings, relativistic jets, HUD rings, feather arcs, aurora/vignette/scanline overlays) into a TypeScript React component with proper cleanup, reduced-motion support, and DPR-aware rendering. Hero layout collapsed from two-column to single-column so the singularity reads as a full-screen backdrop.
- **Files Changed**: `src/components/ui/SingularityCanvas.tsx` (new), `src/app/page.tsx`
- **Verification**: `npm run lint`: pass; `npx tsc --noEmit`: pass; `npm run test:ci`: 67/67 passing
- **Follow-ups**: None.

### Raouf: 2026-05-15 (static visibility fallback)

- **Scope**: Make write-up pages readable when client JavaScript is blocked
- **Summary**: Removed the global page-transition wrapper that emitted route content with `opacity:0` in static HTML, and changed `AnimatedSection` so server-rendered content is visible by default instead of hidden until Framer Motion hydrates. This fixes the failure mode where `/write-ups/invisible-window-research` looks broken if a browser extension blocks a Next.js chunk (`net::ERR_BLOCKED_BY_CLIENT`) or hydration fails before animations can reveal the article.
- **Files Changed**: `src/app/template.tsx`, `src/components/ui/AnimatedSection.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 67/67 passing; `npm run build`: pass (35 generated static pages); generated HTML grep confirms the write-up no longer has the route-level `opacity:0; transform: translateY(12px)` wrapper; Browser static-export QA confirms `/write-ups/invisible-window-research` title, main heading, and first section are visible with no console errors.
- **Follow-ups**: None.

### Raouf: 2026-05-15 (write-up hydration fix)

- **Scope**: Fix Invisible Window write-up hydration error
- **Summary**: Removed render-time `new Date()` calls from the shared footer and replaced them with deterministic static labels. Static export had been baking one footer date into HTML at build time while the client recomputed a different date during hydration on later visits, which can trigger React production error #418 on pages such as `/write-ups/invisible-window-research`. Added footer regression assertions for the stable last-index and copyright text.
- **Files Changed**: `src/components/layout/Footer.tsx`, `src/components/layout/Footer.test.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 67/67 passing; `npm run build`: pass (35 generated static pages); Browser static-export QA on `/write-ups/invisible-window-research`: title/heading present, `Last Index: May 2026` present, no console warnings/errors, screenshot captured; BACK_TO_ARCHIVE navigation to `/write-ups` works with no console errors.
- **Follow-ups**: `net::ERR_BLOCKED_BY_CLIENT` was not reproduced locally and usually indicates a browser extension/content blocker rather than an app error.

### Raouf: 2026-05-15

- **Scope**: Add DOI records and connected Project Simurgh entry
- **Summary**: Added the Zenodo archival DOI for Invisible Window Research (`10.5281/ZENODO.20195135`) to the typed project data model, rendered it as an external DOI button/sidebar link on the project detail page, and surfaced the DOI on the homepage featured project card. Added a separate `Project Simurgh` portfolio entry directly after Invisible Window Research, preserving the existing `simurghforge` entry as a different project. Project Simurgh links to `Raoof128/Project-Simurgh#13-status-license`, uses its README DOI (`10.5281/ZENODO.20195198`), and renders as a connected defensive follow-up on the homepage and `/projects/project-simurgh`. Updated the API/data reference, `public/llms.txt`, and data-layer regression tests.
- **Files Changed**: `src/lib/data.ts`, `src/app/projects/[slug]/ProjectDetailClient.tsx`, `src/app/page.tsx`, `src/lib/data.test.ts`, `docs/API_REFERENCE.md`, `public/llms.txt`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 67/67 passing; `npm run build`: pass (35 generated static pages); built output grep confirms both DOI records and `/projects/project-simurgh` are present.
- **Follow-ups**: None.

### Raouf: 2026-04-23

- **Scope**: Invisible Window Research — Rewrite Project Copy + Add Paper Download
- **Summary**: Replaced every section of `/projects/invisible-window-research` with defensible copy: hero reframed as a "12-page IEEE-format research paper" with explicit `getDisplayMedia()` and macOS 26 hook; problem section tightened to trust-boundary framing; solution overview now covers W3C↔OS-compositor trust boundary, behavioural-detection analysis, five countermeasures, and the full coordinated-disclosure timeline; tech stack rescopes Python to pixel-level forensic verification (replaces the inaccurate MCP reasoning-engine line); build bullets add concrete pixel forensics (80.27% Windows diff; 1,170,560-pixel transparent macOS capture); secure section lists January→March 2026 timeline, PoC-withheld policy, and ACM/IEEE/CISA ethics alignment; proof section adds 10,000+ frame measurement, behavioural stats (gaze p=0.41, n=8), and corrected "published as arXiv preprint". Added a Paper download button (outline variant, FileText icon) next to Repo on the project hero, plus a sidebar link. Extended `Project.links` interface with optional `paper?: string`. Copied `Invisible_Window_Research.pdf` (313 KB) into `public/` for static serving.
- **Files Changed**: `src/lib/data.ts`, `src/app/projects/[slug]/ProjectDetailClient.tsx`, `src/app/about/AboutClient.tsx`, `src/app/resume/ResumeClient.tsx`, `src/app/layout.tsx`, `public/Invisible_Window_Research.pdf` (new), `AGENT.md`, `CHANGELOG.md`
- **Verification**: lint: pass, typecheck: pass, test:ci: 65/65, build: 29 routes, grep on built HTML: 0 `peer-reviewed` on home/about/resume/invisible-window
- **Follow-ups**: Pushed to `main`; Cloudflare Pages auto-redeploys.

### Raouf: 2026-04-23 (5th pass — demo links)

- **Scope**: Add live demo links for Syllabus Sync and Nexus Archive
- **Summary**: Added demo URLs in `src/lib/data.ts` — Syllabus Sync (syllabus-sync-mq.vercel.app) and Nexus Archive (home-notes-app.uk). Project detail pages auto-render Demo buttons from the data. Also added explicit Demo links next to Repo on the homepage bento cards for both, using `flex-wrap items-center gap-4` to keep the layout clean on narrow viewports.
- **Files Changed**: `src/lib/data.ts`, `src/app/page.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: lint: pass, typecheck: pass, test:ci: 65/65, build: 29 routes, both demo URLs present on home + detail HTML.
- **Follow-ups**: None.

### Raouf: 2026-04-23 (4th pass — responsive audit)

- **Scope**: Full file-by-file responsive audit + polish
- **Summary**: Audited every page and shared component for mobile/tablet/desktop behaviour. Home: "PEER-REVIEWED PAPER" bento badge → "IEEE-FORMAT PAPER"; added mobile-only "View All" CTAs at the bottom of the Projects and Write-ups sections (desktop links were `hidden md:flex`); cleaned duplicated `px-2` on writeup rows. About: "Peer-Reviewed Security Analysis" → "IEEE-Format Security Research"; Skills Matrix rows stack on mobile instead of squeezing chips against the 28-unit label column; Active Operations row titles truncate instead of pushing tags off-screen. 404: responsive numeral (`text-7xl sm:text-8xl md:text-9xl`). SimpleMarkdown: added fenced code blocks (with lang badge + horizontal scroll), horizontal rules, tables (full-bleed scroll on mobile), blockquotes, responsive heading sizes, `break-words` on lists/paragraphs — the Invisible Window writeup's code blocks, tables, and HRs now render properly instead of as plain paragraphs. Footer bottom bar now wraps on very narrow viewports.
- **Files Changed**: `src/app/page.tsx`, `src/app/about/AboutClient.tsx`, `src/app/not-found.tsx`, `src/components/ui/SimpleMarkdown.tsx`, `src/components/layout/Footer.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: lint: pass, typecheck: pass, test:ci: 65/65, build: 29 routes, `grep <table|<pre|<hr` on invisible-window writeup HTML confirms tables/code/hrs now render, `grep peer-reviewed` on home/about/resume/invisible-window: 0 matches.
- **Follow-ups**: Verify responsive rendering live in DevTools device toolbar.

### Raouf: 2026-04-23 (3rd pass)

- **Scope**: Pin Invisible Window Research to top of Projects list + manual Cloudflare Pages redeploy
- **Summary**: Reordered the `projects` Record in `src/lib/data.ts` so `"invisible-window-research"` is the first key. `/projects` uses `Object.values(projects)` for its list (order = declaration order), so this is the only source of truth that needed to change. Manually redeployed via `wrangler pages deploy out --project-name raoufabedini --branch main`.
- **Files Changed**: `src/lib/data.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: lint: pass, typecheck: pass, test:ci: 65/65, build: 29 routes; invisible-window-research is key 1 of 11 in data.ts.
- **Follow-ups**: Verify live ordering after deploy.

### Raouf: 2026-04-23 (follow-up)

- **Scope**: Remove residual "peer-reviewed" language + mobile hero button wrap
- **Summary**: Replaced "peer-reviewed" framing with "12-page IEEE-format security research paper" on the About bio, Resume executive-summary, and root `layout.tsx` metadata description (homepage OG/description). Added `flex-wrap` and tighter mobile gap on the project-detail hero button row so Demo/Repo/Paper buttons stack cleanly on narrow viewports.
- **Files Changed**: `src/app/about/AboutClient.tsx`, `src/app/resume/ResumeClient.tsx`, `src/app/layout.tsx`, `src/app/projects/[slug]/ProjectDetailClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: lint: pass, typecheck: pass, test:ci: 65/65, build: 29 routes
- **Follow-ups**: None.

### Raouf: 2026-03-21

- **Scope**: Add Write-Ups for NanoMatch + SentinelFlow
- **Summary**: Added two new technical write-ups based on internet research of repo READMEs and source code. (1) **"Building a Sub-Microsecond Matching Engine in C++20"** — covers three-layer data structure design (sorted map + linked-list queues + hash map), integer prices, pool allocator, order type semantics, and latency profiling. (2) **"Anatomy of a Network Intrusion Detection System"** — covers the capture→parse→detect→alert pipeline, BPF filters, layered protocol dissection with `std::optional`, Snort-inspired rule engine, stateful vs stateless detection (port scans, SYN floods, DNS tunnelling), and zero-copy parsing. Build produces 29 static routes (+2 write-up pages).
- **Files Changed**: `src/lib/data.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: lint: pass, typecheck: pass, test:ci: 65/65, build: 29 routes
- **Follow-ups**: Deploy to Cloudflare Pages.

### Raouf: 2026-03-21

- **Scope**: Add NanoMatch + SentinelFlow Projects
- **Summary**: Added two new C++ systems programming projects. (1) **NanoMatch** — high-performance limit order book and matching engine in C++20, 9.29M ops/sec throughput, 84ns p50 latency, 60+ tests. (2) **SentinelFlow** — real-time network IDS in C++17, 28M+ packets/sec, Snort-inspired rule engine, layered protocol dissection, 27 tests. Homepage grid now 7 projects across 3 rows: Mehr Guard (2-col) + Syllabus Sync, GitSwitch + Nexus Archive + NanoMatch, SentinelFlow + ECRSM (2-col). Build produces 27 static routes.
- **Files Changed**: `src/lib/data.ts`, `src/app/page.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: lint: pass, typecheck: pass, test:ci: 65/65, build: 27 routes
- **Follow-ups**: Deploy to Cloudflare Pages.

### Raouf: 2026-03-21

- **Scope**: Visual & UX Polish — Animation Timing, Hover Effects, Footer, Page Transitions
- **Summary**: 14 visual/UX fixes. Faster animations (orbital 28s→14s, ticker 55s→32s, scanline 8s→4s, stagger 0.1→0.06). Bumped scanline/ticker visibility. Bento cards: glow shadow, cursor-pointer, category bg tints. Section divider glow. Page entrance animations on projects/lab/write-ups. Terminal visible on tablet (md). Footer redesigned: 3-col with nav links, status, copyright, back-to-top. Contact form SENT state with disabled button. Lab placeholder → GitHub link. 65 tests (+2).
- **Files Changed**: `utils.ts`, `page.tsx`, `globals.css`, `Scanline.tsx`, `Footer.tsx`, `Footer.test.tsx`, `SecureContactForm.tsx`, `projects/page.tsx`, `LabClient.tsx`, `WriteUpsClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: lint: pass, typecheck: pass, test:ci: 65/65, build: 25 routes
- **Follow-ups**: Deploy.

### Raouf: 2026-03-21

- **Scope**: Full Portfolio Audit — Content, SEO, Accessibility, Security Fixes
- **Summary**: Fixed 20 audit items. (1) **Content**: Resume now lists all 5 projects, fixed Syllabus-Sync stats, expanded llms.txt from 3→5 projects. (2) **SEO**: Added OG/Twitter cards to 7 pages, fixed writeup metadata template. (3) **Accessibility**: DecryptedText now respects `prefers-reduced-motion` (via `useSyncExternalStore`) and exposes `aria-label`; added skip-to-content link; added `aria-hidden` on decorative elements; added global `prefers-reduced-motion` CSS. (4) **Docs/Security**: Replaced all `raoof128.github.io` URLs with `raoufabedini.dev` in README.md, SECURITY.md, and docs/MEHR_GUARD_README.md; updated README deployment section for Cloudflare.
- **Files Changed**: `ResumeClient.tsx`, `llms.txt`, `README.md`, `SECURITY.md`, `MEHR_GUARD_README.md`, `about/page.tsx`, `lab/page.tsx`, `write-ups/page.tsx`, `resume/page.tsx`, `projects/[slug]/page.tsx`, `write-ups/[slug]/page.tsx`, `DecryptedText.tsx`, `layout.tsx`, `globals.css`, `page.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: lint: pass, typecheck: pass, test:ci: 63/63, build: 25 routes
- **Follow-ups**: Deploy to Cloudflare Pages.

### Raouf: 2026-03-21

- **Scope**: Add Nexus Archive + Syllabus Sync, Remove PhishPatrol
- **Summary**: Added two new projects: (1) **Nexus Archive** — cyberpunk media vault (React 19 + Litestar + Supabase) with hardened cookie auth, encrypted takeaways, AI recommendations. (2) **Syllabus Sync** — AI-native Campus OS (Next.js 16 + Supabase + WebAuthn + LLM OCR) with 503 tests. Pushed Syllabus Sync to `Raoof128/syllabus-sync`. Removed PhishPatrol from data layer and homepage. Homepage grid: Mehr Guard (2-col), Syllabus Sync, GitSwitch, Nexus Archive, ECRSM (2-col). Build produces 25 static routes.
- **Files Changed**: `src/lib/data.ts`, `src/app/page.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass, `npm run typecheck`: pass, `npm run test:ci`: 63/63, `npm run build`: 25 routes
- **Follow-ups**: Deploy to Cloudflare Pages.

### Raouf: 2026-03-08

- **Scope**: Double Scrollbar Fix + Full Responsive Audit
- **Summary**: Fixed double scrollbar caused by `body { overflow-x: hidden }` without matching rule on `html`. Moved `html` scrollbar styles out of `@layer utilities` into a top-level block with `overflow-x: hidden`. Audited all pages one-by-one: fixed `BentoCard` missing `className` prop (Mehr Guard never actually spanned 2 columns — removed inner wrapper div, added `md:col-span-2` to grid cell). Reduced hero/section padding from `py-28` → `py-16 md:py-28` for mobile. Made Navbar logo text responsive (`~/raouf` on mobile, full name on sm+). Fixed nested `<main>` tags in 5 page clients (About, Resume, Lab, WriteUps, ProjectDetail) → changed to `<div>` per HTML spec (only one `<main>` per page).
- **Files Changed**: `src/app/globals.css`, `src/app/page.tsx`, `src/components/layout/Navbar.tsx`, `src/app/about/AboutClient.tsx`, `src/app/resume/ResumeClient.tsx`, `src/app/lab/LabClient.tsx`, `src/app/write-ups/WriteUpsClient.tsx`, `src/app/projects/[slug]/ProjectDetailClient.tsx`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass, `npm run typecheck`: pass, `npm run test:ci`: 63/63, `npm run build`: 24 routes, Cloudflare deploy: success
- **Follow-ups**: None.

### Raouf: 2026-03-08

- **Scope**: About Page Full Redesign — GitHub Profile Content Integration
- **Summary**: Pulled full content from `github.com/Raoof128/Raoof128` README and redesigned `AboutClient.tsx` from scratch with 5 sections. Added AI/ML Security, Cloud & Infra, and Australian Compliance specialization pillars. Added 7-entry Active Operations lab feed with ACTIVE/ARCHIVED/CONCEPT status. Expanded skills matrix to 45+ skills across 5 categories. Improved photo overlay with CLEARANCE/LOCATION labels and green online indicator. Fixed test assertion for new `h1` heading text.
- **Files Changed**: `src/app/about/AboutClient.tsx`, `src/app/about/AboutClient.test.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass, `npm run typecheck`: pass, `npm run test:ci`: 63/63, `npm run build`: pass (24 routes), Cloudflare deploy: success
- **Follow-ups**: Update Lab page to surface the 7 operations listed on About.

### Raouf: 2026-03-08

- **Scope**: Full Site Audit - Content Sync & Data Accuracy
- **Summary**: Conducted full audit across all pages/components against resume DOCX and codebase. Fixed all stale content, added missing project, corrected schema data.
  - **layout.tsx**: Fixed JSON-LD `jobTitle` → "Freelance Full-Stack Developer & Security Engineer", `addressLocality` → "Castle Hill", expanded `knowsAbout` with Kotlin MP, FastAPI, Web/Mobile App Security.
  - **data.ts**: Added PhishPatrol project (4th project, 50+ student deployments). Site now generates 24 static routes.
  - **AboutClient.tsx**: Rewrote bio to reflect 70+ projects / 1,000+ users narrative. Updated tech stack card (Kotlin, Bash, SQL, Burp Suite, Nmap, Docker, FastAPI). Changed stat card from "4+ YRS" → "70+ SHIPPED".
  - **page.tsx**: Sharpened hero description ("70+ projects. 1,000+ users.") and fixed lab teaser to reflect actual lab content (Rust, Python, Go) instead of generic eBPF copy.
- **Files Changed**: `src/app/layout.tsx`, `src/lib/data.ts`, `src/app/about/AboutClient.tsx`, `src/app/page.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass, `npm run typecheck`: pass, `npm run test:ci`: 63/63, `npm run build`: pass (24 routes), Cloudflare deploy: success
- **Follow-ups**: Consider adding Syllabus Sync as a full project entry.

### Raouf: 2026-03-08

- **Scope**: Resume Content Sync from DOCX
- **Summary**: Read `Raouf_Portfolio_Resume.docx` and updated `ResumeClient.tsx` to match. Key additions: new Freelance role (Jan 2024–Present), corrected title at Iran Pharmacy ("IT Manager"), updated Professional Summary, expanded Technical Skills (Kotlin, Bash, SQL, Swift/Go, Burp Suite, Wireshark, Nmap, Docker, FastAPI, OWASP, MITRE ATT&CK, NIST), updated location to Castle Hill, added PhishPatrol project, added Leadership & Community section (Anthropic evaluation, peer mentoring), renumbered sections to 07.
- **Files Changed**: `src/app/resume/ResumeClient.tsx`
- **Verification**: `npm run lint`: pass, `npm run typecheck`: pass, `npm run build`: pass (23 routes), Cloudflare Pages deploy: success
- **Follow-ups**: None.

### Raouf: 2026-03-08

- **Scope**: DevOps - Cloudflare Pages Deployment with Custom Domain
- **Summary**: Migrated production deployment from GitHub Pages to Cloudflare Pages and configured custom domain `raoufabedini.dev`.
  - **Config**: Removed `basePath: "/Portfolio"` from `next.config.ts` (was GitHub Pages-specific; not needed for root custom domain).
  - **Domain rebrand**: Updated `src/lib/constants.ts` — `BASE_PATH` → `""`, `SITE_ORIGIN` → `"https://raoufabedini.dev"`. `SITE_URL` now resolves to `https://raoufabedini.dev`.
  - **Content**: Updated hardcoded `raoof128.github.io/Portfolio` references in `SecurityPolicyClient.tsx`, `public/security.txt`, and `public/llms.txt` to `raoufabedini.dev`.
  - **Tests**: Updated `AboutClient.test.tsx` path assertions (`/Portfolio/Raouf_2.jpg` → `/Raouf_2.jpg`) to match empty `BASE_PATH`.
  - **Deploy**: Created Cloudflare Pages project `raoufabedini`, deployed 229 files from `out/`, attached custom domain via Cloudflare API.
- **Files Changed**:
  - `next.config.ts`
  - `src/lib/constants.ts`
  - `src/app/security-policy/SecurityPolicyClient.tsx`
  - `src/app/about/AboutClient.test.tsx`
  - `public/security.txt`
  - `public/llms.txt`
  - `AGENT.md`
  - `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: pass (63/63)
  - `npm run build`: pass (23 static/SSG routes)
  - Cloudflare Pages deploy: 229 files uploaded, live at `https://89969fd8.raoufabedini.pages.dev`
  - Custom domain `raoufabedini.dev`: attached, status pending DNS propagation
- **Follow-ups**: Wait for DNS to propagate (~1-2 min); verify `https://raoufabedini.dev` is live. Update GitHub Actions `deploy.yml` if keeping GitHub as a CI source.

### Raouf: 2026-03-02

- **Scope**: Full Repository Audit - Quality Gates and Dependency Security
- **Summary**: Completed a comprehensive repository audit and hardening pass.
  - **Structure/docs check**: Verified all required professional assets and engineering configs are present and consistent (`README.md`, `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `docs/ARCHITECTURE.md`, `docs/API_REFERENCE.md`, CI workflows, devcontainer, lint/test configs).
  - **Code quality gates**: Re-ran linting, typechecking, full unit/component suite, and production build to validate release readiness.
  - **Security remediation**: `npm audit` reported high-severity transitive vulnerabilities in `minimatch` and `rollup`; applied `npm audit fix` and updated lockfile to remove vulnerabilities.
- **Files Changed**:
  - `package-lock.json`
  - `AGENT.md`
  - `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: pass (63/63)
  - `npm run build`: pass (23 static/SSG routes)
  - `npm audit --audit-level=moderate`: pass (0 vulnerabilities)
- **Follow-ups**: Maintain periodic dependency maintenance and keep full gate execution mandatory before deployment.

### Raouf: 2026-03-02

- **Scope**: About Page Photo Audit - Reload-Dependent Rendering Fix
- **Summary**: Completed a focused audit of the `About Me` photo module and fixed reload-dependent behavior.
  - **Root issue**: Single-source image failure handling (`Raouf_2.jpg`) could leave the photo section in a persistent fallback state after transient errors.
  - **Reliability fix**: Added deterministic source fallback chain (`/Portfolio/Raouf_2.jpg` -> `/Portfolio/Raouf_2.png`) in `AboutClient`.
  - **Recovery UX**: Added explicit `RETRY_PHOTO` action to recover from fallback state without manual browser refresh.
  - **Test hardening**: Expanded About tests to validate fallback source switching and retry reset behavior.
- **Files Changed**:
  - `src/app/about/AboutClient.tsx`
  - `src/app/about/AboutClient.test.tsx`
  - `AGENT.md`
  - `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run test:ci -- src/app/about/AboutClient.test.tsx`: pass (3/3)
- **Follow-ups**: Execute full suite (`npm run test:ci`) and full static export build (`npm run build`) before release.

### Raouf: 2026-02-25

- **Scope**: Focused Audit & Hardening - About Page and Profile Photo Reliability
- **Summary**: Completed a targeted production audit for About content and profile photo stability.
  - **Root cause identified**: Core About content depended on client animation/hydration state and could appear broken/hidden under inconsistent client execution.
  - **Visibility fix**: Updated About layout composition to ensure bio and profile sections render visibly in static HTML by default.
  - **Photo reliability**: Enforced basePath-aware profile image source for GitHub Pages static hosting and added robust fallback UI (`PHOTO_UNAVAILABLE`) on image load failure.
  - **Quality tests**: Added About-specific tests for heading/photo rendering and fallback path.
  - **Test infra polish**: Updated shared `next/image` mock to strip non-DOM props (`fill`, `priority`, `unoptimized`, `loader`) and keep test logs clean.
- **Files Changed**:
  - `src/app/about/AboutClient.tsx`
  - `src/app/about/page.tsx`
  - `src/app/about/AboutClient.test.tsx` (new)
  - `src/test/setup.ts`
- **Verification**:
  - `npm run lint`: pass (0 warnings/errors)
  - `npm run test:ci`: pass (62/62 tests)
  - `npm run build`: pass (23 static/SSG routes)
  - Static export check: `out/about.html` contains visible About content and `/Portfolio/Raouf_2.jpg`
- **Follow-ups**: Keep fallback pattern for high-visibility media assets and avoid hydration-gated rendering for critical identity content.

### Raouf: 2026-02-25

- **Scope**: Comprehensive Portfolio Audit & Production Hardening
- **Summary**: Completed a full repository audit and implemented production-focused upgrades.
  - **Code quality/accessibility**: Fixed `ProjectCard` ARIA tab-panel wiring with stable DOM-safe IDs and improved accessibility test coverage.
  - **Form hardening**: Added robust input validation, timeout cleanup, error state handling, and test coverage to `SecureContactForm`.
  - **Refactor/maintainability**: Centralized canonical URLs and identity links in `src/lib/constants.ts` and propagated across metadata/routes/components.
  - **Route hardening**: Added static-params strictness and metadata generation for `projects/[slug]`.
  - **Cleanup**: Removed unused scroll logic from `TerminalFeed`.
  - **Professional docs**: Rewrote `README.md`, upgraded `CONTRIBUTING.md`, and added `SECURITY.md`, `docs/ARCHITECTURE.md`, and `docs/API_REFERENCE.md`.
  - **CI/CD & dev tooling**: Added `.github/workflows/ci.yml`, modernized deploy workflow, and added `.editorconfig`, `.nvmrc`, and `.devcontainer/devcontainer.json`.
  - **Security dependencies**: Ran lockfile refresh (`npm audit fix`) to resolve audit findings.
- **Files Changed**:
  - **Source**: `src/lib/constants.ts`, `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/projects/[slug]/page.tsx`, `src/components/ui/ProjectCard.tsx`, `src/components/ui/SecureContactForm.tsx`, `src/components/ui/TerminalFeed.tsx`, `src/components/layout/Footer.tsx`, `src/app/contact/ContactClient.tsx`, `src/app/security-policy/SecurityPolicyClient.tsx`, `src/app/resume/ResumeClient.tsx`
  - **Tests**: `src/components/ui/ProjectCard.test.tsx`, `src/components/ui/SecureContactForm.test.tsx`
  - **Docs/Policy**: `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/ARCHITECTURE.md`, `docs/API_REFERENCE.md`
  - **Automation/Config**: `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`, `.editorconfig`, `.nvmrc`, `.devcontainer/devcontainer.json`, `package-lock.json`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 60/60 tests pass
  - `npm run build`: pass (23 routes static/SSG)
  - `npm audit --audit-level=moderate`: 0 vulnerabilities
- **Follow-ups**: Continue periodic dependency refresh and keep CI quality gates mandatory for PR merges.

### Raouf: 2026-02-02

- **Scope**: A+ Grade Achievement - Testing & Quality Infrastructure
- **Summary**: Achieved A+ project grade by implementing comprehensive testing framework and quality assurance infrastructure. No e2e tests per requirements - focused on unit and component testing.
  - **Testing Framework**: Installed and configured Vitest + React Testing Library with jsdom environment.
  - **Test Coverage**: Created 7 comprehensive test files covering:
    - Data layer validation (projects, writeups, lab experiments)
    - UI components (NeonButton, Card, ProjectCard)
    - Layout components (Navbar, Footer)
    - Utility functions (cn helper)
  - **Pre-commit Hooks**: Added husky + lint-staged to enforce lint and typecheck on every commit.
  - **CI/CD Enhancement**: Updated GitHub Actions workflow to run lint, typecheck, and tests before build.
  - **Scripts**: Added typecheck, test, test:ci, test:coverage, and prepare scripts to package.json.
- **Files Changed**:
  - **New**: `vitest.config.ts`, `src/test/setup.ts`, `src/lib/data.test.ts`, `src/lib/utils.test.ts`, `src/components/ui/NeonButton.test.tsx`, `src/components/ui/Card.test.tsx`, `src/components/ui/ProjectCard.test.tsx`, `src/components/layout/Navbar.test.tsx`, `src/components/layout/Footer.test.tsx`, `.husky/pre-commit`
  - **Modified**: `package.json` (scripts, lint-staged, devDependencies), `.github/workflows/deploy.yml`
- **Verification**:
  - `npm run lint`: 0 errors, 0 warnings
  - `npm run typecheck`: 0 TypeScript errors
  - `npm run test:ci`: 56 tests passing across 7 test files
  - `npm run build`: 23 routes, static export successful
  - `npm audit`: 0 vulnerabilities
- **Follow-ups**: None. Portfolio now at A+ grade standard.

### Raouf: 2026-02-01

- **Scope**: Portfolio Audit - Accessibility, SEO & Security Compliance
- **Summary**: Completed comprehensive portfolio audit and professionalization.
  - **Accessibility**: Fixed form accessibility in `SecureContactForm.tsx` - added `id`, `name`, and `htmlFor` attributes. Replaced `useEffect` with `useId` for pure React rendering.
  - **SEO**: Added proper metadata exports to `contact/page.tsx`.
  - **Security**: Created `/hall-of-fame` page (referenced in `security.txt` Acknowledgments field).
  - **Branding**: Updated LinkedIn URL to actual profile (`linkedin.com/in/mohammad-raouf-abedini-885a9226a`) across all files.
  - **Legal**: Fixed LICENSE copyright to "Mohammad Raouf Abedini".
- **Files Changed**: `src/components/ui/SecureContactForm.tsx`, `src/app/contact/page.tsx`, `src/app/hall-of-fame/page.tsx` (new), `src/components/layout/Footer.tsx`, `README.md`, `public/llms.txt`, `LICENSE`.
- **Verification**: `npm run lint` (clean), `npm run build` (success - 23 routes).

### Raouf: 2026-02-01

- **Scope**: Audit - Documentation Consistency
- **Summary**: Audited all `README.md` and `docs/*` files for accuracy and consistency with the codebase.
  - **Fix**: Corrected `README.md` to describe GitSwitch as an Electron/React app (was incorrectly listed as Rust).
  - **Links**: Updated repository URLs in documentation to point to the `Raoof128` namespace.
- **Files Changed**: `README.md`, `docs/GITSWITCH_README.md`, `docs/ECRSM_README.md`.
- **Verification**: Cross-referenced `data.ts` with documentation.

### Raouf: 2026-02-01

- **Scope**: Audit - Responsiveness & Consistency
- **Summary**: Conducted a full file-by-file audit for mobile responsiveness and content consistency.
  - **Responsiveness**: Fixed grid layouts in `SecureContactForm` and `About` stats to be mobile-first (`grid-cols-1 sm:grid-cols-2`).
  - **Consistency**: Updated `not-found.tsx` to remove old branding references (`root@raouf` -> `root@portfolio`).
  - **Placeholders**: Updated `pgp-key.txt` with a more professional simulated block.
- **Files Changed**: `src/components/ui/SecureContactForm.tsx`, `src/app/about/page.tsx`, `src/app/not-found.tsx`, `public/pgp-key.txt`.
- **Verification**: Code review and build verification.

### Raouf: 2026-02-01

- **Scope**: Fix - CI Build & BasePath
- **Summary**: Resolved GitHub Actions failure (`tar: out: Cannot open`) by taking manual control of the Next.js configuration.
  - **Analysis**: The `actions/configure-pages` step was likely conflicting with `next.config.ts`, causing `output: 'export'` to be ignored.
  - **Fix**: Removed `static_site_generator: next` from the workflow and manually added `basePath: "/Portfolio"` to `next.config.ts`.
- **Files Changed**: `next.config.ts`, `.github/workflows/deploy.yml`.
- **Verification**: Local build passes. Git push to trigger CI.

### Raouf: 2026-02-01

- **Scope**: Fix - Revert Custom Domain & Workflow Patch
- **Summary**: Reverted custom domain configuration to use default GitHub Pages URL. Fixed a typo in the GitHub Actions workflow.
  - **Revert**: Deleted `public/CNAME` and unset custom domain via API. Site is now at `https://raoof128.github.io/Portfolio/`.
  - **Fix**: Corrected `actions/actions/checkout` to `actions/checkout` in `deploy.yml` to resolve build failure.
- **Files Changed**: `.github/workflows/deploy.yml`, `public/CNAME` (deleted).
- **Verification**: `gh api` confirmed `cname: null`. `git push` successful.

### Raouf: 2026-02-01

- **Scope**: DevOps - Custom Domain
- **Summary**: Configured GitHub Pages to use the custom domain `raoof.r12.com`.
  - **Asset**: Created `public/CNAME`.
  - **Config**: Updated GitHub repository settings via CLI to bind the custom domain.
  - **Note**: HTTPS enforcement requires DNS propagation.
- **Files Changed**: `public/CNAME`.
- **Verification**: `gh api` confirmed `cname: "raoof.r12.com"`.

### Raouf: 2026-02-01

- **Scope**: Rebranding & Audit
- **Summary**: Replaced all instances of `raouf.sh` with `raoof128.github.io/Portfolio` (for URLs) or `raoof.r12@gmail.com` (for contact). Conducted full system audit.
  - **Rebranding**: Updated `layout.tsx`, `sitemap.ts`, `robots.ts`, `llms.txt`, `security.txt`, `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
  - **Fix**: Added `export const dynamic = 'force-static'` to `robots.ts` and `sitemap.ts` to fix static export build errors.
  - **Audit**: Passed `npm run lint`, `npm run build`, and `npm audit` (0 vulnerabilities).
- **Files Changed**: `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `public/llms.txt`, `public/security.txt`, `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
- **Verification**: Build successful, site ready for deployment.

### Raouf: 2026-02-01

- **Scope**: DevOps - GitHub Pages Deployment
- **Summary**: Configured the project for static export and automated deployment via GitHub Actions.
  - **Config**: Updated `next.config.ts` with `output: 'export'` and unoptimized images.
  - **Workflow**: Created `.github/workflows/deploy.yml` for automated CI/CD.
  - **Polish**: Implemented custom global scrollbar with cyan neon glow effects.
  - **Deployment**: Switched to `Raoof128` account and enabled GitHub Pages via CLI.
- **Files Changed**: `next.config.ts`, `.github/workflows/deploy.yml`, `src/app/globals.css`.
- **Verification**: `git push` success, GitHub Pages API confirmed activation.

### Raouf: 2026-02-01

- **Scope**: Polish - Lab Section Professionalization
- **Summary**: Upgraded Lab section to be fully functional and professional.
  - **Detail Views**: Created `/lab/[id]` pages to display experiment details with a code editor UI.
  - **Content**: Enriched `data.ts` with realistic code snippets (Rust, Python, Go) for keylogger, packet sniffer, and steganography experiments.
  - **Navigation**: Linked Lab index to detail pages.
- **Files Changed**: `src/lib/data.ts`, `src/app/lab/page.tsx`, `src/app/lab/[id]/page.tsx`.
- **Verification**: `npm run lint` (clean), `npm run build` (success).

### Raouf: 2026-02-01

- **Scope**: Feature Implementation - Lab & Write-ups
- **Summary**: Implemented functional Lab and Write-ups sections.
  - **Lab**: Created a data-driven experiment list in `src/app/lab/page.tsx` pulling from `data.ts`.
  - **Write-ups**: Implemented dynamic routing (`/write-ups/[slug]`) and a clean article reader interface.
  - **Data**: Enriched `data.ts` with placeholder Lab Experiments and Write-up content to enable immediate site functionality.
- **Files Changed**: `src/lib/data.ts`, `src/app/lab/page.tsx`, `src/app/write-ups/page.tsx`, `src/app/write-ups/[slug]/page.tsx`.
- **Verification**: `npm run lint` (clean), `npm run build` (success).

### Raouf: 2026-02-01

- **Scope**: Polish - Placeholder Cleanup
- **Summary**: Replaced visual placeholders with final assets. Updated `Home` page icons and `SecureContactForm` placeholder text to match the "Command Center" theme.
- **Files Changed**: `src/app/page.tsx`, `src/components/ui/SecureContactForm.tsx`.
- **Verification**: `npm run lint` (clean), `npm run build` (success).

### Raouf: 2026-02-01

- **Scope**: Privacy Update
- **Summary**: Removed personal phone number from the Resume page for privacy. Conducted a placeholder audit.
- **Files Changed**: `src/app/resume/page.tsx`.
- **Verification**: `npm run lint` (clean), `npm run build` (success).

### Raouf: 2026-02-01

- **Scope**: Content Expansion - Resume Page
- **Summary**: Implemented the full Resume page (`/resume`) with structured data and "Command Center" styling. Enhanced `NeonButton` to support `download` attribute for PDF downloads.
- **Files Changed**: `src/app/resume/page.tsx`, `src/components/ui/NeonButton.tsx`.
- **Verification**: `npm run lint` (clean), `npm run build` (success).

### Raouf: 2026-02-01

- **Scope**: Content Expansion - About Page
- **Summary**: Created a dedicated `/about` page featuring the user's bio and profile image, integrated with the "Command Center" visual theme. Updated navigation.
- **Files Changed**: `src/app/about/page.tsx`, `src/components/layout/Navbar.tsx`, `public/Raouf_2.png`.
- **Verification**: `npm run lint` (clean), `npm run build` (success).

### Raouf: 2026-01-30

- **Scope**: Project Initialization
- **Summary**: Initial setup of Mohammad Raouf Abedini portfolio based on user blueprint.
- **Changes**:
  - Created `CHANGELOG.md`.
  - Implemented Cyber-ops design system in `globals.css` (variables, animations, custom scrollbar).
  - Created UI components: `GridBackground`, `Scanline`, `NeonButton`, `HUDFrame`, `ProjectCard`.
  - Created Layout components: `Navbar`, `Footer`.
  - Implemented Pages:
    - Home (`/`) with Hero, Featured Projects, Philosophy, Lab Teaser.
    - Projects Index (`/projects`).
    - Lab (`/lab`) placeholder.
    - Write-ups (`/write-ups`) placeholder.
    - Resume (`/resume`) placeholder.
    - Contact (`/contact`) refactor.
  - Added `public/.well-known/security.txt`.
  - Resolved linting errors in pages.

### Raouf: 2026-01-30

- **Scope**: Repository Professionalization
- **Summary**: Created standard professional docs (LICENSE, CONTRIBUTING, CoC, AGENT.md) and pushed to GitHub.
- **Changes**:
  - Added `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `AGENT.md`.
  - Organized project READMEs into `docs/`.
  - Initialized git and pushed to `main` branch.

### Raouf: 2026-01-30

- **Scope**: Rebranding
- **Summary**: Replaced project brand "Raouf.sh" with full name "Mohammad Raouf Abedini" across titles, metadata, and UI components.
- **Changes**:
  - Updated `README.md` and `AGENT.md` project descriptions.
  - Updated `layout.tsx` metadata title and description.
  - Updated `Navbar.tsx` and `Header.tsx` logotype displays.
  - Preserved technical URLs (sitemap, robots, security.txt) to avoid site breakage.

### Raouf: 2026-01-30

- **Scope**: Portfolio Refinement
- **Summary**: Transformed `README.md` from product-focused to identity-focused. Standardized repo naming.
- **Changes**:
  - Rewrote `README.md` to highlight featured work (Mehr Guard, GitSwitch, ECRSM) and engineering philosophy.
  - Fixed repository clone URL in documentation.
  - Verified remote synchronization with the renamed `Portfolio` repo.

### Raouf: 2026-01-30

- **Scope**: High-Impact Polish & Refinement
- **Summary**: Implemented critical structure fixes, data centralization, and "Make it go crazy" performance upgrades.
- **Changes**:
  - **Single Source of Truth**: Centralized project data in `src/lib/data.ts` and refactored Home/Projects pages to consume it.
  - **Structural Fix**: Removed duplicate Header/Footer from dynamic project pages (`[slug]/page.tsx`).
  - **Performance**: Added `VideoFacade.tsx` for click-to-load YouTube (Lighthouse win).
  - **SEO & Social**: Added comprehensive OpenGraph/Twitter cards in `layout.tsx`.
  - **UI Polish**: Added support for external links in `NeonButton`, refined focus styles, and fixed typing in `data.ts`.

### Raouf: 2026-01-30

- **Scope**: Final Audit & Cleanup
- **Summary**: Validated system integrity and cleaned up UI regressions.
- **Changes**:
  - **Audit**: `npm run lint` passing (0 errors). `npm run build` passing (all routes static).
  - **Fix**: Restored "Philosophy" and "Lab" sections in Home page that were temporarily hidden.
  - **Cleanup**: Removed unused imports (`Terminal`, `Shield`, `Activity`) from Home page.

### Raouf: 2026-01-31

- **Scope**: UI Overhaul - Command Center Theme
- **Summary**: Transformed the portfolio into a dynamic "Command Center" with living background, cryptographic text reveals, and terminal boot logs.
- **Changes**:
  - **New Components**:
    - `ActiveGrid`: Tactical map background effect with data packet pulses.
    - `DecryptedText`: Matrix-style text scrambling/descrambling animation.
    - `TerminalFeed`: Auto-scrolling Linux/eBPF boot log simulation.
  - **Home Page Upgrade**:
    - Integrated new components into Hero section.
    - Implemented "Focus Mode" for Featured Projects (dimming non-hovered items).
    - Updated visual hierarchy and typography.

### Raouf: 2026-01-31

- **Scope**: Interactive "Ops" Features
- **Summary**: Added immersive "Keylogger" contact form and "Classified Archive" project database.
- **Changes**:
  - **Contact Page**:
    - Replaced static links with `SecureContactForm`.
    - Added real-time "monitoring/encryption" typing animations.
    - Included "Session ID" generation.
  - **Projects Page**:
    - Implemented "Classified Archive" UI.
    - Added functional Search (grep) and Category filters.
    - Refactored project list into dense "file explorer" rows.
  - **Data**:
    - Enriched project metadata with Categories (OFFENSIVE, DEFENSIVE, ENGINEERING) and Year.

### Raouf: 2026-01-31

- **Scope**: System Audit & Consistency
- **Summary**: Final polish pass ensuring navigation flows correctly and placeholder pages match the new aesthetic.
- **Changes**:
  - **Navigation Fixes**: Redirected all "Contact" calls to action to the new `/contact` page.
  - **Visual Upgrades**:
    - `/lab`: Added "Under Construction" hazard theme.
    - `/write-ups`: Added "Classified Archive" locked theme.
  - **Integrity**: Verified 0 lint errors and full build success.

### Raouf: 2026-01-31

- **Scope**: Polish - Persistent Animations
- **Summary**: Added support for continuous looped descrambling on the main Hero header.
- **Changes**:
  - **Component**: Enhanced `DecryptedText.tsx` to accept `loopInterval` (ms).
  - **Home**: Configured "Cybersecurity" text to re-scramble every 10 seconds.

### Raouf: 2026-01-31

- **Scope**: Security Audit & Animation Tuning
- **Summary**: Security baseline verification and animation timing adjustments.
- **Changes**:
  - **Animation**: Increased frequency of Hero text descramble loop (10s -> 5s).
  - **Security**:
    - Audited dependencies (0 vulnerabilities).
    - Audited HTTP headers (CSP, HSTS active).
    - Fixed broken link in `security.txt` by adding placeholder `pgp-key.txt`.

### Raouf: 2026-01-31

- **Scope**: Polish - UX & Accessibility
- **Summary**: Fixed accessibility gaps and enhanced error handling flows.
- **Changes**:
  - **Accessibility**: Implemented ARIA Tab Pattern in `ProjectCard` for screen reader support.
  - **SEO**: Dynamic generation of `sitemap.xml` covering all sub-routes.
  - **UX**: Custom "404 System Error" page matching the site's command center aesthetic.

### Raouf: 2026-01-31

- **Scope**: SEO & AI Authority (GEO)
- **Summary**: Upgraded the site architecture to be "AI-First" using Generative Engine Optimization techniques.
- **Changes**:
  - **AI Beacon**: Deployed `public/llms.txt` for improved crawler context.
  - **Semantic Authority**: Added structured JSON-LD schema linking Raouf to "Cybersecurity" and "eBPF" knowledge graphs.
  - **Freshness**: Added dynamic "Last Index" timestamp to the footer.
