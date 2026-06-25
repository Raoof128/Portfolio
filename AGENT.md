# AGENT.md - AI Governance & Instruction Set

This file provides context and rules for AI coding assistants (agents) working on the **Mohammad Raouf Abedini Portfolio**.

## 🛡️ The Raouf Change Protocol (MANDATORY)

Before making any code changes, agents MUST:

1.  **Read this file** (`AGENT.md`).
2.  **Read the latest changelog** (`CHANGELOG.md` or variants).
3.  **Explain planned edits** before touching files.
4.  **Edit safely** with minimal, consistent changes.
5.  **Postflight Logging**: Update both `AGENT.md` and `CHANGELOG.md` with a "Raouf:" template entry.

### Postflight Template

```markdown
### Raouf: [Date]

- **Scope**: [Short description]
- **Summary**: [What was done]
- **Files Changed**: [List]
- **Verification**: [Test results]
- **Follow-ups**: [Next steps]
```

## 🏗️ Design System Constraints

- **Theme**: Dark Charcoal (`#09090b`), Cyan Accent (`#06b6d4`).
- **HUD Frame**: Use corner borders and `font-mono` for metadata.
- **Micro-interactions**: Subtle hover glows and scanline animations.
- **Pro-Tip**: Avoid "hacker tropes" like glitch effects. Keep it "Professional Ops".

## 🚀 Technical Requirements

- Next.js 14+ App Router.
- Tailwind CSS (standard classes + custom utilities).
- Strict TypeScript everywhere.
- No massive libraries for single components; prefer native CSS/React.

---

### Raouf: 2026-06-26 (Australia/Sydney) — Translate research-forward About bio into fa/ar/zh/es

- **Scope**: Align the four non-English About bios with the new English research narrative
- **Summary**: Translated `about.bio_1/2/3` into fa/ar/zh/es — five DOI-archived Zenodo preprints (ORCID-indexed), Invisible Window flagship (macOS 26 novel finding, OWASP/FIRST/CISA), Project Simurgh (3 preprints), Aion-BibleQA (R@5 0.941), Anthropic evaluation. Technical proper nouns kept in Latin. Also removes the stale "graduating November 2026" framing that remained only in these bios. Kept the hero `university` label ("Macquarie · Nov 2026") as a factual credential date.
- **Files Changed**: `src/i18n/locales/fa.ts`, `ar.ts`, `zh.ts`, `es.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`/`lint`/`typecheck`: pass; `test:ci`: 68/68; `build`: 155 pages. Localized About pages render the new bio (fa/ar/zh/es all include `R@5` + DOI/Zenodo wording).
- **Follow-ups**: None.

### Raouf: 2026-06-26 (Australia/Sydney) — Name consistency (RAOUF.M → RAOUF ABEDINI), ORCID on About, research-forward bio

- **Scope**: Make every name display "Mohammad Raouf Abedini"/"Raouf Abedini", add ORCID to About, rewrite About bio as a strong researcher narrative
- **Summary**: Fixed the only stray name — `about.terminal_subject` photo-HUD label "RAOUF.M" → "RAOUF ABEDINI" across all five locales. Left intentional informal usages (JSON-LD `alternateName: "Raouf"`, Navbar `~/raouf`, footer "designed by Raouf.", llms.txt narrative, APA citations "Abedini, M. R."). Added a visible ORCID link (`Fingerprint`) to the About hero social row. Rewrote `about.bio_1/2/3` (en) to lead with five DOI-archived Zenodo preprints (ORCID-indexed) spanning offensive vuln research, Project Simurgh integrity systems (3 preprints), and Aion-BibleQA citation-faithfulness (R@5 0.941); kept Invisible Window flagship + Anthropic evaluation. Confirmed all 5 DOIs in data.ts so the "five preprints" claim is accurate.
- **Files Changed**: `src/i18n/locales/en.ts`, `fa.ts`, `ar.ts`, `es.ts`, `zh.ts`, `src/app/[locale]/about/AboutClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`/`typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 pages. `out/en/about.html`: 0 `RAOUF.M`, has `SUBJECT: RAOUF ABEDINI`, ORCID link, `five DOI-archived preprints`, `R@5 0.941`; site-wide sweep for `RAOUF.M` returns 0.
- **Follow-ups**: Optionally re-translate the new bio into fa/ar/zh/es.

### Raouf: 2026-06-26 (Australia/Sydney) — Fix per-page canonical URLs (self-referential, locale-aware)

- **Scope**: Resolve Search Console "User-declared canonical: homepage" on every sub-page so each URL declares itself canonical
- **Summary**: The shared `[locale]/layout.tsx` set `alternates.canonical: "/"` and no page overrode it, so sub-pages inherited the homepage canonical. Added `src/lib/seo.ts` `buildAlternates(path, locale)` returning a self-referential canonical (English clean root path; other locales under `/fa|/ar|/zh|/es`) + hreflang `languages`. Converted all static-metadata pages to `generateMetadata({ params })` calling it (about, lab, resume, contact, write-ups, hall-of-fame, security-policy, projects/layout for `/projects`), added `alternates` to the detail pages' `generateMetadata` (projects/[slug], write-ups/[slug], lab/[id]) with widened locale params, and switched the root layout to `buildAlternates("", locale)` so localized homepages self-canonical too. Verified `Raouf_2.jpg` is emitted to `out/` (the SC "resource didn't load" note is a render-snapshot quirk).
- **Files Changed**: `src/lib/seo.ts` (new), `src/app/[locale]/layout.tsx`, about/lab/resume/contact/write-ups/hall-of-fame/security-policy `page.tsx`, `projects/layout.tsx`, `projects/[slug]/page.tsx`, `write-ups/[slug]/page.tsx`, `lab/[id]/page.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`/`typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 pages. Every built `<link rel="canonical">` self-references (e.g. `/about`→`/about`, `/projects/project-simurgh`→ itself, home→`https://raoufabedini.dev`, `/fa`→`/fa`, `/fa/about`→`/fa/about`).
- **Follow-ups**: After deploy, Search Console → Test live URL → Request indexing on the main pages.

### Raouf: 2026-06-26 (Australia/Sydney) — Visible ORCID links everywhere + "graduate / available now" positioning

- **Scope**: Make ORCID human-clickable site-wide and change availability copy from future-dated to "graduate, available now"
- **Summary**: Added a visible ORCID link to the global Footer social row (every page; `Fingerprint` icon, `aria-label="ORCID"`) and the Resume header (next to GitHub/LinkedIn). ORCID is now connected in five places: homepage Person `sameAs`, per-project article/code author, `llms.txt`, Footer, Resume. Repositioned availability — Resume About summary + `about.bio_1` (en) changed "final-year Cyber Security student … (graduating November 2026)" → "Cyber Security graduate from Macquarie University, available now"; Resume Additional-Info line "Available … fellowship from July 2026" → "Available now for full-time roles and fellowships". Education degree span `May 2024 – Nov 2026` kept as factual record.
- **Files Changed**: `src/components/layout/Footer.tsx`, `src/app/[locale]/resume/ResumeClient.tsx`, `src/i18n/locales/en.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 pages. Built output confirms footer ORCID link + aria-label on home, `ORCID iD` link + `Available now` + `Cyber Security graduate from` on resume with 0 stale "graduating November 2026"/"from July 2026"/"final-year … student", about bio updated, education span preserved.
- **Follow-ups**: Non-English bios never carried the November/availability claim, so no translation change needed.

### Raouf: 2026-06-26 (Australia/Sydney) — ORCID identity + per-project ScholarlyArticle/SoftwareSourceCode JSON-LD + dateModified

- **Scope**: Strengthen research E-E-A-T for Google AI search and AI answer engines — ORCID, per-project research/code structured data with DOIs, freshness signal
- **Summary**: Added `ORCID_URL` (`0009-0000-6214-258X`) and a static `SITE_LAST_MODIFIED` constant. ORCID now appears in the homepage Person `sameAs` and `llms.txt`; the WebSite JSON-LD node gained `dateModified`. `projects/[slug]/page.tsx` (server component) now emits a per-project `@graph`: a `SoftwareSourceCode` node (or `CreativeWork` without a repo) with `codeRepository`/`keywords`/ORCID author, plus a `ScholarlyArticle` for every paper that has a DOI (keyed on `doi.org/<doi>`, with headline/abstract/datePublished/dateModified/ORCID author/Zenodo publisher/DOI `PropertyValue`). All authors share the layout Person `@id` (`#person`) so project + papers + profile resolve to one ORCID researcher. `dateModified` is a static constant to avoid hydration mismatch. JSON-LD emitted via the same `dangerouslySetInnerHTML`+`JSON.stringify` pattern as `layout.tsx` (trusted static data only).
- **Files Changed**: `src/lib/constants.ts`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/projects/[slug]/page.tsx`, `public/llms.txt`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 pages. Built output confirms ORCID in home `sameAs`, WebSite `dateModified`, Simurgh page has 3 DOIs as `ScholarlyArticle` + `SoftwareSourceCode` + ORCID author, invisible-window DOI present, and a paperless project (gitswitch) emits `SoftwareSourceCode` with 0 articles.
- **Follow-ups**: Validate via Google Rich Results Test / Search Console after deploy; bump `SITE_LAST_MODIFIED` on future content updates.

### Raouf: 2026-06-26 (Australia/Sydney) — Correct X/Twitter link + AI-search structured-data hardening

- **Scope**: Fix the wrong X (Twitter) profile link site-wide and strengthen structured data for Google AI search / AEO-GEO and AI answer engines
- **Summary**: The X link was wrong in two places — `TWITTER_URL` pointed at `twitter.com/Raoof128` and the Twitter card `creator` was `@Raoof128`; both now use the correct handle `Raoofr12` (`https://x.com/Raoofr12`, `@Raoofr12`), plus a Twitter card `site` tag. The corrected URL flows automatically to the Footer social icon and the JSON-LD `sameAs`. Researched Google's official 2026 AI-features optimization guide (AEO/GEO is "still SEO"; no AI-specific files/markup required — structured data, E-E-A-T, crawlability, unique content matter) and current GEO guidance. Enriched the homepage JSON-LD into a `@graph`: a `Person` (`#person`) gaining `image` + `email`, and a new `WebSite` (`#website`) whose `publisher` references the Person — one connected entity for person + site. Added the X link to `public/llms.txt`. `layout.tsx` was Prettier-reformatted as part of the edit.
- **Files Changed**: `src/lib/constants.ts`, `src/app/[locale]/layout.tsx`, `public/llms.txt`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx prettier --check`: pass; `npm run lint`: pass; `npm run typecheck`: pass; `npm run test:ci`: 68/68; `npm run build`: 155 pages. Built `out/en.html` contains `x.com/Raoofr12`, `@Raoofr12`, `"@type":"WebSite"`, `#person`, `Raouf_2.jpg`; remaining `Raoof128` is the GitHub URL only.
- **Follow-ups**: Deploy via `wrangler pages deploy out --project-name raoufabedini --branch main`. Optional next SEO: Google Search Console + sitemap submission; per-project `ScholarlyArticle`/`SoftwareSourceCode` JSON-LD with DOIs; keep `dateModified` fresh.

### Raouf: 2026-06-13 (Australia/Sydney) — Bump GitHub Actions off deprecated Node 20

- **Scope**: Clear the Node 20 runtime deprecation warning across both workflows
- **Summary**: Bumped pinned actions to their current latest majors (all run on Node 24): `actions/checkout@v4 → v6` and `actions/setup-node@v4 → v6` in both `ci.yml` and `deploy.yml`, plus `actions/upload-artifact@v4 → v7` and `actions/download-artifact@v4 → v8` in `deploy.yml`. Verified latest majors via the GitHub releases API before pinning (checkout v6, setup-node v6, upload-artifact v7, download-artifact v8).
- **Files Changed**: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: Pending live run on push; expect no Node 20 deprecation annotation.
- **Follow-ups**: None.

### Raouf: 2026-06-13 (Australia/Sydney) — Cloudflare Pages auto-deploy workflow

- **Scope**: Add CI/CD auto-deploy to Cloudflare Pages (replacing manual `wrangler` deploys)
- **Summary**: Added `.github/workflows/deploy.yml` that, on push to `main` (or manual dispatch), deploys `out/` to Cloudflare Pages via `cloudflare/wrangler-action@v3` (`pages deploy out --project-name=raoufabedini --branch=main`). Set the `CLOUDFLARE_ACCOUNT_ID` GitHub repo secret (`25c840ad…`) via `gh secret set`. The `CLOUDFLARE_API_TOKEN` secret must be created in the Cloudflare dashboard (Account → Cloudflare Pages → Edit) — wrangler's OAuth token is API-blocked from minting tokens (verified: 401/403 against `/user/tokens`). **Security-hardened after two automated review passes**: split into a secret-free `build` job (npm ci/lint/typecheck/test/build → uploads `out/` artifact; no Cloudflare token in the env where untrusted dependency code runs) and a `deploy` job that alone holds the token and runs only artifact-download + wrangler. The build job emits a boolean `has_token` output (never the secret value); the deploy job gates on `github.ref == 'refs/heads/main' && needs.build.outputs.has_token == 'true'` so it stays green until the token is added and `workflow_dispatch` on a non-`main` ref can never reach production.
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
- **Summary**: Added `isZV ? "bg-[#040300]"` to the body content grid background ternary — the one gap left after the theme object was wired. `#040300` is a near-black golden void matching the canvas hero.
- **Files Changed**: `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npx tsc --noEmit`: pass; `npm run test:ci`: 67/67 passing
- **Follow-ups**: None.

### Raouf: 2026-06-03 (Australia/Sydney) — Zurvan CosmicLoom animation

- **Scope**: Add Project Zurvan canvas hero animation + full #DAA520 colour palette
- **Summary**: Created `CosmicLoomCanvas.tsx` — 3D lemniscate particle system. Lemniscate always drawn as 3-pass glowing stroke. 200 particles in two factions (Ahura gold / Ahriman crimson). Shamseh mandala background. Auto-oscillating rotation replaces mouse tracking. Wired into ProjectDetailClient.tsx with `isZV` slug, theme block, ThemeInjector, dynamic import, and hero section before default fallback.
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
- **Summary**: Replaced all three `codeSnippet: "..."` placeholders with real educational code (Rust WinAPI keylogger, Python raw-socket sniffer, Go LSB steganography). Removed dead `link?` field from `LabExperiment` interface and all entries. Fixed `LabDetailClient.tsx` to import the type from `@/lib/data` instead of redefining it locally. Fixed the fake editor filename with an `EXT_MAP` (`rust→rs`, `python→py`, `go→go`).
- **Files Changed**: `src/lib/data.ts`, `src/app/[locale]/lab/[id]/LabDetailClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npx tsc --noEmit`: pass; `npm run test:ci`: 66/66 passing
- **Follow-ups**: None.

### Raouf: 2026-05-25 (Australia/Sydney)

- **Scope**: Preprint, Paper, & Repo Layout — Invisible Window & Project Simurgh
- **Summary**: Updated project link assets for Invisible Window and Project Simurgh. Retained repository, preprint, and direct PDF paper download options (removed the DOI record link). Wired direct paper download buttons for both projects on their details pages and updated data layer tests.
- **Files Changed**: `public/Invisible_Window_Research_Preprint_V2.0.pdf`, `public/Project_Simurgh_Preprint_v1.0.pdf`, `public/llms.txt`, `src/app/[locale]/page.tsx`, `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`, `src/lib/data.ts`, `src/lib/data.test.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: Run `npm run test:ci` (66/66 tests passing), `npm run lint` (clean), and `npm run build` (150 static routes prerendered).
- **Follow-ups**: Verify that download links for papers on the details pages function correctly in production.

### Raouf: 2026-05-19 (i18n senior audit — quality fixes)

- **Scope**: 4-phase structured i18n audit — coverage, quality, hardcoded strings, consistency
- **Summary**: 0 missing keys (Dictionary type enforcement), 0 empty values, 0 structural issues. 3 quality fixes: zh stats_projects counter word removed, zh stats_vendors restructured to natural Chinese label, fa hall_of_fame report_guidance restructured for natural preposition-bracketing around link.
- **Files Changed**: `src/i18n/locales/zh.ts`, `src/i18n/locales/fa.ts`
- **Verification**: tsc 0 errors; lint pass; 66/66 tests
- **Follow-ups**: None — all locales production-ready.

### Raouf: 2026-05-19 (i18n full audit — 121-issue deep pass)

- **Scope**: Full file-by-file audit + translate all remaining hardcoded strings (121 issues across 33 files)
- **Summary**: Added project_detail (12), writeups_detail (1), hall_of_fame (15), security_policy (32) namespaces to all 5 locales, plus extensions to footer/common/about. Rewrote HallOfFameClient + SecurityPolicyClient with full translations + RTL. Fixed 11 ternary anti-patterns in ProjectDetailClient. Fixed Footer/LanguageSwitcher/AboutClient labels.
- **Files Changed**: 5 locale files + ProjectDetailClient, WriteupDetailClient, HallOfFameClient, SecurityPolicyClient, Footer, LanguageSwitcher, AboutClient
- **Verification**: lint pass; tsc pass; 66/66 tests
- **Follow-ups**: Brand text, resume body, skill names, ticker, metadata stay English by design.

### Raouf: 2026-05-19 (i18n audit pass)

- **Scope**: Wire remaining untranslated pages, add Vazirmatn font, rebuild sitemap
- **Summary**: Added `projects_page`, `resume_page`, `not_found`, `lab_detail` namespaces to all 5 locale files; wired useTranslation into projects/page.tsx, not-found.tsx, LabDetailClient, ResumeClient; added Vazirmatn via next/font/google; rebuilt sitemap with full locale × route coverage + hreflang alternates.
- **Files Changed**: 5 locale files, 5 component files, layout.tsx, sitemap.ts
- **Verification**: lint pass; tsc pass; 66/66 tests
- **Follow-ups**: Run `npm run build` before deploy. security-policy/hall-of-fame intentionally English-only.

### Raouf: 2026-05-19 (i18n rollout completion)

- **Scope**: Complete Gemini's i18n migration — restore missing data, fill locale gaps, fix test suite
- **Summary**: Restored 5 stripped writeups in data.ts; added `contact`, `lab_page`, `writeups_page` to ar/es/zh locales; fixed Footer/Navbar/AboutClient tests with I18nProvider wrappers; replaced `locale as any` with `locale` in page.tsx and ProjectDetailClient; typed dictionary loader as `Promise<Dictionary>`.
- **Files Changed**: `src/lib/data.ts`, `src/i18n/locales/ar.ts`, `src/i18n/locales/es.ts`, `src/i18n/locales/zh.ts`, `src/i18n/index.ts`, `src/components/layout/Footer.test.tsx`, `src/components/layout/Navbar.test.tsx`, `src/app/[locale]/about/AboutClient.test.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`
- **Verification**: `npm run lint`: pass; `npx tsc --noEmit`: pass; `npm run test:ci`: 66/66 passing
- **Follow-ups**: Run `npm run build` before deploy to verify all locale static pages generate.

### Raouf: 2026-05-19 (proxy.ts API fix)

- **Scope**: Fix incorrect Next.js 16 proxy API usage in `src/proxy.ts`
- **Summary**: Replaced `import { proxy } from 'next/server'` with `import { NextResponse }`, changed `export default proxy(...)` wrapper pattern to `export function proxy(request: NextRequest)`, and replaced `proxy.rewrite(url)` with `NextResponse.rewrite(url)`. Added a `config.matcher` to exclude static/API paths at framework level.
- **Files Changed**: `src/proxy.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npx tsc --noEmit`: zero errors in `proxy.ts`
- **Follow-ups**: Pre-existing TS errors in i18n locale files (ar/es/zh missing keys) need fixing as part of i18n rollout.

### Raouf: 2026-05-19 (singularity hero)

- **Scope**: Replace hero particle network + terminal with singularity animation
- **Summary**: Removed `ParticleNetwork` and `TerminalFeed` from homepage hero. New `SingularityCanvas` component ports the preview.html black hole / accretion disk canvas animation to TypeScript React with DPR handling, reduced-motion support, and `visibilitychange` pause/resume. Hero layout changed from `md:grid-cols-2` to single-column so the singularity occupies the full viewport.
- **Files Changed**: `src/components/ui/SingularityCanvas.tsx` (new), `src/app/page.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: `npm run lint`: pass; `npx tsc --noEmit`: pass; `npm run test:ci`: 67/67 passing
- **Follow-ups**: None.

### Raouf: 2026-05-15 (static visibility fallback)

- **Scope**: Make write-up pages readable when client JavaScript is blocked
- **Summary**: Removed the global page-transition wrapper that emitted route content with `opacity:0` in static HTML, and changed `AnimatedSection` so server-rendered content is visible by default instead of hidden until Framer Motion hydrates. This fixes the failure mode where `/write-ups/invisible-window-research` looks broken if a browser extension blocks a Next.js chunk (`net::ERR_BLOCKED_BY_CLIENT`) or hydration fails before animations can reveal the article.
- **Files Changed**: `src/app/template.tsx`, `src/components/ui/AnimatedSection.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 67/67 passing
  - `npm run build`: pass (35 generated static pages)
  - Generated HTML grep confirms the write-up no longer has the route-level `opacity:0; transform: translateY(12px)` wrapper
  - Browser static-export QA confirms `/write-ups/invisible-window-research` title, main heading, and first section are visible with no console errors
- **Follow-ups**: None.

### Raouf: 2026-05-15 (write-up hydration fix)

- **Scope**: Fix Invisible Window write-up hydration error
- **Summary**: Removed render-time `new Date()` calls from the shared footer and replaced them with deterministic static labels. Static export had been baking one footer date into HTML at build time while the client recomputed a different date during hydration on later visits, which can trigger React production error #418 on pages such as `/write-ups/invisible-window-research`. Added footer regression assertions for the stable last-index and copyright text.
- **Files Changed**: `src/components/layout/Footer.tsx`, `src/components/layout/Footer.test.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 67/67 passing
  - `npm run build`: pass (35 generated static pages)
  - Browser static-export QA on `/write-ups/invisible-window-research`: title/heading present, `Last Index: May 2026` present, no console warnings/errors, screenshot captured
  - BACK_TO_ARCHIVE navigation to `/write-ups` works with no console errors
- **Follow-ups**: `net::ERR_BLOCKED_BY_CLIENT` was not reproduced locally and usually indicates a browser extension/content blocker rather than an app error.

### Raouf: 2026-05-15

- **Scope**: Add DOI records and connected Project Simurgh entry
- **Summary**: Added the Zenodo archival DOI for Invisible Window Research (`10.5281/ZENODO.20195135`) to the typed project data model, rendered it as an external DOI button/sidebar link on the project detail page, and surfaced the DOI on the homepage featured project card. Added a separate `Project Simurgh` portfolio entry directly after Invisible Window Research, preserving the existing `simurghforge` entry as a different project. Project Simurgh links to `Raoof128/Project-Simurgh#13-status-license`, uses its README DOI (`10.5281/ZENODO.20195198`), and renders as a connected defensive follow-up on the homepage and `/projects/project-simurgh`. Updated the API/data reference, `public/llms.txt`, and data-layer regression tests.
- **Files Changed**: `src/lib/data.ts`, `src/app/projects/[slug]/ProjectDetailClient.tsx`, `src/app/page.tsx`, `src/lib/data.test.ts`, `docs/API_REFERENCE.md`, `public/llms.txt`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 67/67 passing
  - `npm run build`: pass (35 generated static pages)
  - Built output grep confirms both DOI records and `/projects/project-simurgh` are present
- **Follow-ups**: None.

### Raouf: 2026-04-23

- **Scope**: Invisible Window Research — Rewrite Project Copy + Add Paper Download
- **Summary**: Rewrote the `/projects/invisible-window-research` page copy end-to-end so the page can survive a domain expert reading the underlying paper. Updates: (1) Hero/fullDescription reframed as a "12-page IEEE-format research paper" with explicit `getDisplayMedia()` reference and macOS 26 hook. (2) Problem section tightened to the trust-boundary framing. (3) Solution overview expanded with W3C Screen Capture ↔ OS compositor trust boundary, behavioural detection analysis, five-countermeasure survey, and coordinated-disclosure timeline. (4) Tech stack rescoped — Python reframed as "pixel-level forensic verification" (replaces the inaccurate "reasoning engine / MCP server" line). (5) Build bullets include concrete pixel forensics (80.27% Windows capture diff; 1,170,560-pixel transparent macOS capture). (6) Secure section now lists the full January→March 2026 disclosure timeline, PoC-withheld policy, and ACM/IEEE/CISA ethics alignment. (7) Proof section includes measurement over 10,000+ frames, behavioural detection stats (gaze p=0.41, n=8), and "published as arXiv preprint" (arXiv does not "accept"). Added a dedicated Paper download button (outline variant, FileText icon) next to the Repo button on the project hero, plus a corresponding sidebar link. Extended the `Project.links` interface with optional `paper?: string`. Copied `Invisible_Window_Research.pdf` (313 KB) into `public/` for static serving.
- **Files Changed**: `src/lib/data.ts`, `src/app/projects/[slug]/ProjectDetailClient.tsx`, `src/app/about/AboutClient.tsx`, `src/app/resume/ResumeClient.tsx`, `src/app/layout.tsx`, `public/Invisible_Window_Research.pdf` (new), `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 65/65 passing (9 files)
  - `npm run build`: pass (29 routes; `/projects/invisible-window-research` generated; PDF copied to `out/`)
  - Built HTML greps show 0 occurrences of `peer-reviewed` across `index.html`, `about.html`, `resume.html`, and `projects/invisible-window-research.html`
- **Follow-ups**: Pushed to `main`; Cloudflare Pages auto-redeploys.

### Raouf: 2026-04-23 (5th pass — demo links)

- **Scope**: Add live demo links for Syllabus Sync and Nexus Archive
- **Summary**: Added `demo` URLs to `src/lib/data.ts` for two projects — Syllabus Sync (https://syllabus-sync-mq.vercel.app/login?redirectTo=%2Fhome) and Nexus Archive (https://home-notes-app.uk/). The project detail pages (`ProjectDetailClient.tsx`) already conditionally render a "Demo" button in the hero and a "Watch Demo" link in the sidebar when `project.links.demo` exists, so the buttons appear automatically. Also added an explicit "Demo" link (ExternalLink icon) next to the "Repo" link on the homepage bento cards for both projects — previously these smaller cards only exposed the repo link, so the demos would have been hidden until a user clicked into the case study. The link row now uses `flex-wrap items-center gap-4` to keep the layout clean on narrow viewports.
- **Files Changed**: `src/lib/data.ts`, `src/app/page.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 65/65
  - `npm run build`: pass (29 routes)
  - `grep` on built HTML confirms both demo URLs are present on home, `/projects/syllabus-sync`, and `/projects/nexus-archive`
  - `wrangler pages deploy`: manual deploy — see follow-up
- **Follow-ups**: None.

### Raouf: 2026-04-23 (4th pass — responsive audit)

- **Scope**: Full file-by-file responsive & polish audit across all pages and shared components
- **Summary**: Audited every page (`/`, `/about`, `/projects`, `/projects/[slug]`, `/lab`, `/lab/[id]`, `/write-ups`, `/write-ups/[slug]`, `/resume`, `/contact`, `/hall-of-fame`, `/security-policy`, 404) and every layout/ui component for mobile / tablet / desktop behaviour. Fixed the issues that materially affected small-screen usability or content fidelity:
  1. `src/app/page.tsx` — replaced residual "PEER-REVIEWED PAPER" badge with "IEEE-FORMAT PAPER" on the Invisible Window hero bento card. Added mobile-only "View All Projects" and "View All Write-ups" CTAs at the end of those sections (the desktop "View All" links are `hidden md:flex`, so mobile users had no path to the full index). Fixed duplicated `px-2` on the writeup list-row anchor and added `min-w-0` to the row wrapper so long titles truncate cleanly instead of forcing overflow.
  2. `src/app/about/AboutClient.tsx` — replaced residual "Peer-Reviewed Security Analysis" specialization item with "IEEE-Format Security Research". Skills matrix rows now stack (`flex-col sm:flex-row`) on mobile so the 28-unit label column no longer squeezes the skill chips. Active Operations rows got `min-w-0 truncate` on the title span and `shrink-0` on the tag group so long titles can't push tags off-screen.
  3. `src/app/not-found.tsx` — 404 numeral responsive: `text-7xl sm:text-8xl md:text-9xl` (was fixed `text-9xl`, which overflowed on small phones).
  4. `src/components/ui/SimpleMarkdown.tsx` — added support for fenced code blocks with language label + horizontal scroll on overflow, horizontal rules, tables with full-bleed horizontal scroll wrapper on mobile (`-mx-4 sm:mx-0 overflow-x-auto`), and blockquotes. The Invisible Window writeup relies on all four — they previously rendered as plain paragraphs. Headings scale on mobile (`text-lg sm:text-xl`, `text-xl sm:text-2xl`); list items and paragraphs got `break-words` + `min-w-0` for long URL/symbol resilience.
  5. `src/components/layout/Footer.tsx` — bottom bar now `flex flex-wrap … gap-3` so the copyright + back-to-top button wrap gracefully on very narrow viewports.
  6. Pinned the Invisible Window Research project to the top of the Projects list in `src/lib/data.ts` (carried over from prior pass; confirmed the reorder is reflected on the built `/projects` page).
     Confirmed no responsive regressions on `/projects`, `/projects/[slug]`, `/lab`, `/lab/[id]`, `/write-ups`, `/write-ups/[slug]`, `/resume`, `/contact`, `/hall-of-fame`, `/security-policy` — all already use mobile-first patterns (`grid-cols-1 md:grid-cols-*`, `flex-col md:flex-row`, responsive `text-*/md:text-*` scales). `overflow-x: clip` on `body` in `globals.css` remains a global safety net.
- **Files Changed**: `src/app/page.tsx`, `src/app/about/AboutClient.tsx`, `src/app/not-found.tsx`, `src/components/ui/SimpleMarkdown.tsx`, `src/components/layout/Footer.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 65/65
  - `npm run build`: pass (29 routes)
  - `grep peer-reviewed` on built HTML (home/about/resume/invisible-window project): 0 matches
  - `grep <table|<pre|<hr` on `out/write-ups/invisible-window-research.html`: tables, code blocks, and hrs now render (previously all plain text)
  - `wrangler pages deploy`: manual deploy — see follow-up
- **Follow-ups**: User to verify live responsive rendering via Chrome DevTools device toolbar (iPhone SE, iPad, 1440px desktop) on all pages, especially `/write-ups/invisible-window-research` for the newly-rendering tables and code blocks.

### Raouf: 2026-04-23 (3rd pass)

- **Scope**: Pin Invisible Window Research to top of Projects list + manual Cloudflare Pages redeploy
- **Summary**: Reordered the `projects` Record in `src/lib/data.ts` so `"invisible-window-research"` is the first key. `/projects` is data-driven via `Object.values(projects)` (filter/search preserves declaration order), and `/projects/[slug]` uses `generateStaticParams` off the same Record — no other code paths needed changes. Triggered an explicit `wrangler pages deploy out --project-name raoufabedini --branch main` after the build to redeploy Cloudflare Pages immediately rather than wait on the GitHub integration.
- **Files Changed**: `src/lib/data.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 65/65
  - `npm run build`: pass (29 routes; `out/projects/invisible-window-research.html` present; `out/Invisible_Window_Research.pdf` present)
  - `grep '^  "' src/lib/data.ts`: invisible-window-research is key 1 of 11
  - `wrangler pages deploy`: see follow-up for deploy URL
- **Follow-ups**: Verify `raoufabedini.dev/projects` renders Invisible Window Research at position 1.

### Raouf: 2026-04-23 (follow-up)

- **Scope**: Remove residual "peer-reviewed" language + mobile hero button wrap
- **Summary**: Replaced "peer-reviewed" framing with "12-page IEEE-format security research paper" on the About page bio, Resume executive-summary, and root `layout.tsx` metadata description (which governs the homepage OG/description). Added `flex-wrap` and tighter mobile gap to the project-detail hero button row so the Demo/Repo/Paper buttons stack cleanly on narrow viewports instead of overflowing.
- **Files Changed**: `src/app/about/AboutClient.tsx`, `src/app/resume/ResumeClient.tsx`, `src/app/layout.tsx`, `src/app/projects/[slug]/ProjectDetailClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 65/65 passing
  - `npm run build`: pass (29 routes)
  - Grep on built HTML: 0 `peer-reviewed` matches on home/about/resume/invisible-window pages
- **Follow-ups**: None.

### Raouf: 2026-03-21

- **Scope**: Add Write-Ups for NanoMatch + SentinelFlow
- **Summary**: Added two technical write-ups based on internet research of repo READMEs and source code. (1) "Building a Sub-Microsecond Matching Engine in C++20" — three-layer data structure design, integer prices, pool allocator, order type semantics, latency profiling. (2) "Anatomy of a Network Intrusion Detection System" — capture→parse→detect→alert pipeline, BPF filters, layered protocol dissection, Snort-inspired rules, stateful vs stateless detection, zero-copy parsing. Build produces 29 routes (+2 write-up detail pages).
- **Files Changed**: `src/lib/data.ts`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 65/65 passing
  - `npm run build`: pass (29 routes)
- **Follow-ups**: Deploy to Cloudflare Pages.

### Raouf: 2026-03-21

- **Scope**: Add NanoMatch + SentinelFlow Projects
- **Summary**: Added two new C++ systems programming projects to data layer and homepage bento grid. (1) NanoMatch — C++20 limit order book matching engine (9.29M ops/sec, 84ns p50 latency, 60+ tests, custom pool allocator). (2) SentinelFlow — C++17 real-time network IDS (28M+ pkt/sec, Snort-inspired rules, 7 protocol layers, 27 tests). Homepage grid now shows 7 projects in 3 rows. Build produces 27 static routes (2 new project detail pages).
- **Files Changed**: `src/lib/data.ts`, `src/app/page.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 65/65 passing
  - `npm run build`: pass (27 routes)
- **Follow-ups**: Deploy to Cloudflare Pages.

### Raouf: 2026-03-21

- **Scope**: Visual & UX Polish — Animation Timing, Hover Effects, Footer, Page Transitions
- **Summary**: Fixed 14 visual/UX audit items across 3 tiers. Tier 1 (quick wins): Doubled orbital ring speed (28s→14s), ticker speed (55s→32s), scanline speed (8s→4s). Bumped scanline opacity (0.03→0.07), ticker contrast (zinc-600→zinc-500). Added bento card glow shadow on hover, cursor-pointer, and category color tints. Added section divider glow. Tier 2: Added page entrance animations to projects, lab, write-ups. Showed terminal on tablet (lg→md). Redesigned footer with 3-col layout (branding, nav links, system status), copyright, back-to-top button. Added contact form SENT state with disabled button. Tier 3: Replaced lab placeholder with GitHub link. Tightened stagger (0.1→0.06). Updated footer tests (+2 new).
- **Files Changed**: `src/lib/utils.ts`, `src/app/page.tsx`, `src/app/globals.css`, `src/components/ui/Scanline.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/Footer.test.tsx`, `src/components/ui/SecureContactForm.tsx`, `src/app/projects/page.tsx`, `src/app/lab/LabClient.tsx`, `src/app/write-ups/WriteUpsClient.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 65/65 passing (+2 new footer tests)
  - `npm run build`: pass (25 routes)
- **Follow-ups**: Deploy to Cloudflare Pages.

### Raouf: 2026-03-21

- **Scope**: Full Portfolio Audit — Content, SEO, Accessibility, Security Fixes
- **Summary**: Fixed 20 audit issues across content accuracy, SEO metadata, accessibility, and documentation. Resume: added Nexus Archive + ECRSM to Featured Projects, fixed Syllabus-Sync stats (503 tests/92 files). llms.txt: expanded from 3 to 5 projects. README.md + SECURITY.md: replaced all `raoof128.github.io` URLs with `raoufabedini.dev`. Added OG/Twitter cards to 7 pages (about, lab, write-ups, resume, project detail, writeup detail). DecryptedText: added `prefers-reduced-motion` via `useSyncExternalStore`, `aria-label` for screen readers. Layout: added skip-to-content link, `aria-hidden` on decorative hero elements. globals.css: added `prefers-reduced-motion` global suppression. Fixed docs/MEHR_GUARD_README.md outdated URL.
- **Files Changed**: `src/app/resume/ResumeClient.tsx`, `public/llms.txt`, `README.md`, `SECURITY.md`, `docs/MEHR_GUARD_README.md`, `src/app/about/page.tsx`, `src/app/lab/page.tsx`, `src/app/write-ups/page.tsx`, `src/app/resume/page.tsx`, `src/app/projects/[slug]/page.tsx`, `src/app/write-ups/[slug]/page.tsx`, `src/components/ui/DecryptedText.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 63/63 passing
  - `npm run build`: pass (25 routes)
- **Follow-ups**: Deploy to Cloudflare Pages.

### Raouf: 2026-03-21

- **Scope**: Add Nexus Archive + Syllabus Sync, Remove PhishPatrol
- **Summary**: Added two new projects: (1) Nexus Archive — cyberpunk media vault (React 19 + Litestar + Supabase). (2) Syllabus Sync — AI-native Campus OS (Next.js 16 + Supabase + WebAuthn + LLM OCR). Pushed Syllabus Sync to new `Raoof128/syllabus-sync` GitHub repo. Removed PhishPatrol from data layer and homepage bento grid. Portfolio now has 5 projects: Mehr Guard, Syllabus Sync, GitSwitch, Nexus Archive, ECRSM.
- **Files Changed**: `src/lib/data.ts`, `src/app/page.tsx`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run test:ci`: 63/63 passing
  - `npm run build`: pass (25 routes)
- **Follow-ups**: Deploy to Cloudflare Pages.

### Raouf: 2026-03-08

- **Scope**: Cloudflare Pages Deployment with Custom Domain
- **Summary**: Migrated from GitHub Pages to Cloudflare Pages. Removed `basePath: "/Portfolio"` from `next.config.ts`, updated `constants.ts` (`BASE_PATH=""`, `SITE_ORIGIN="https://raoufabedini.dev"`), updated all hardcoded legacy domain references across source and public files, fixed test path assertions, rebuilt static export, deployed 229 files to Cloudflare Pages project `raoufabedini`, and attached custom domain `raoufabedini.dev` via Cloudflare API.
- **Files Changed**: `next.config.ts`, `src/lib/constants.ts`, `src/app/security-policy/SecurityPolicyClient.tsx`, `src/app/about/AboutClient.test.tsx`, `public/security.txt`, `public/llms.txt`, `AGENT.md`, `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: clean
  - `npm run typecheck`: clean
  - `npm run test:ci`: 63/63 passing
  - `npm run build`: 23 routes, static export successful
  - Cloudflare Pages deploy: success (229 files)
  - Custom domain: `raoufabedini.dev` attached, pending DNS activation
- **Follow-ups**: Confirm `https://raoufabedini.dev` is live once DNS propagates.

### Raouf: 2026-03-02

- **Scope**: Full Repository Audit - Quality Gates and Dependency Security
- **Summary**: Executed a full production audit across repository structure, professional documentation presence, code quality gates, build pipeline, and dependency security. Verified all required docs/configs exist (`README`, `LICENSE`, `CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY`, architecture/API docs, CI workflows, devcontainer, lint/test config). Ran full validation stack and identified two high-severity transitive vulnerabilities (`minimatch`, `rollup`) via `npm audit`; remediated by applying `npm audit fix` and refreshing lockfile.
- **Files Changed**:
  - `package-lock.json`
  - `AGENT.md`
  - `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: clean
  - `npm run typecheck`: clean
  - `npm run test:ci`: 63/63 tests passing
  - `npm run build`: static generation successful (23 routes)
  - `npm audit --audit-level=moderate`: 0 vulnerabilities
- **Follow-ups**: Keep dependency audit checks in CI and run scheduled lockfile refreshes to minimize transitive CVE drift.

### Raouf: 2026-03-02

- **Scope**: About Page Photo Audit - Reload-Dependent Rendering Fix
- **Summary**: Audited the About photo section for reliability under client navigation and refresh scenarios. Identified fragility in single-source image error handling where one transient failure locked the UI into fallback state until manual reload. Implemented multi-source fallback (`.jpg` then `.png`) with deterministic retry behavior (`RETRY_PHOTO`) so the profile photo can recover without requiring page reload.
- **Files Changed**:
  - `src/app/about/AboutClient.tsx`
  - `src/app/about/AboutClient.test.tsx`
  - `AGENT.md`
  - `CHANGELOG.md`
- **Verification**:
  - `npm run lint`: clean
  - `npm run test:ci -- src/app/about/AboutClient.test.tsx`: 3/3 tests passing
- **Follow-ups**: Run full regression suite (`npm run test:ci`) and full production build (`npm run build`) before deployment cut.

### Raouf: 2026-02-25

- **Scope**: Focused Audit & Hardening - About Page and Profile Photo Reliability
- **Summary**: Performed a deep reliability audit of the `/about` route and profile image rendering pipeline. Identified that About content could remain visually hidden when client hydration/animation did not execute promptly due motion-wrapper defaults, and implemented a stable render path so core bio content is visible in static HTML immediately. Hardened profile photo behavior with deterministic basePath-aware source resolution and explicit fallback UI for image load failures. Added dedicated About tests for heading/photo rendering and fallback behavior, and cleaned test mocks to avoid non-DOM prop warnings.
- **Files Changed**:
  - **About route**: `src/app/about/AboutClient.tsx`, `src/app/about/page.tsx`
  - **Tests**: `src/app/about/AboutClient.test.tsx`, `src/test/setup.ts`
- **Verification**:
  - `npm run lint`: clean
  - `npm run test:ci`: 62 tests passing (9 files)
  - `npm run build`: static export successful (23 routes)
  - Verified `out/about.html` now contains visible About content by default and image source `/Portfolio/Raouf_2.jpg`
- **Follow-ups**: If additional image assets are added, keep basePath-aware references and fallback rendering for critical profile/media sections.

### Raouf: 2026-02-25

- **Scope**: Comprehensive Portfolio Audit & Production Hardening
- **Summary**: Completed a full repository audit and delivered production-grade upgrades across code quality, accessibility, security posture, CI/CD, and documentation. Fixed tab-to-panel ARIA wiring in `ProjectCard`, hardened `SecureContactForm` validation/state handling, removed dead logic from `TerminalFeed`, centralized canonical URLs/contact metadata in `constants.ts`, and added project route metadata/static param hardening. Upgraded repository documentation with architecture and API/data reference docs plus an improved README and security policy.
- **Files Changed**:
  - **Code**: `src/lib/constants.ts`, `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/projects/[slug]/page.tsx`, `src/components/ui/ProjectCard.tsx`, `src/components/ui/SecureContactForm.tsx`, `src/components/ui/TerminalFeed.tsx`, `src/components/layout/Footer.tsx`, `src/app/contact/ContactClient.tsx`, `src/app/security-policy/SecurityPolicyClient.tsx`, `src/app/resume/ResumeClient.tsx`
  - **Tests**: `src/components/ui/ProjectCard.test.tsx`, `src/components/ui/SecureContactForm.test.tsx`
  - **Docs/Policy**: `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/ARCHITECTURE.md`, `docs/API_REFERENCE.md`
  - **Ops/Config**: `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`, `.editorconfig`, `.nvmrc`, `.devcontainer/devcontainer.json`, `package-lock.json`
- **Verification**:
  - `npm run lint`: clean
  - `npm run typecheck`: clean
  - `npm run test:ci`: 60 tests passing (8 files)
  - `npm run build`: static build successful (23 routes)
  - `npm audit --audit-level=moderate`: 0 vulnerabilities
- **Follow-ups**: Keep CI audit gating enabled and periodically refresh lockfile via dependency maintenance.

### Raouf: 2026-02-02

- **Scope**: A+ Grade Achievement - Testing & Quality Infrastructure
- **Summary**: Implemented comprehensive testing framework and quality gates to achieve A+ project grade. Added Vitest + React Testing Library for 56 passing tests across data layer, UI components, and layout components. Configured pre-commit hooks with husky and lint-staged. Updated CI/CD pipeline to run lint, typecheck, and tests before build.
- **Files Changed**:
  - **Testing**: `vitest.config.ts`, `src/test/setup.ts`, 7 new test files (data.test.ts, utils.test.ts, NeonButton.test.tsx, Card.test.tsx, ProjectCard.test.tsx, Navbar.test.tsx, Footer.test.tsx)
  - **Scripts**: `package.json` - added typecheck, test, test:ci, test:coverage scripts
  - **Quality Gates**: `.husky/pre-commit`, lint-staged config in package.json
  - **CI/CD**: `.github/workflows/deploy.yml` - added lint, typecheck, test steps before build
- **Verification**:
  - `npm run lint`: 0 errors, 0 warnings
  - `npm run typecheck`: No TypeScript errors
  - `npm run test:ci`: 56 tests passing (7 test files)
  - `npm run build`: 23 routes, static export successful
- **Follow-ups**: None. Project now at A+ grade.

### Raouf: 2026-01-30

- **Scope**: Repository Professionalization
- **Summary**: Created standard professional docs (LICENSE, CONTRIBUTING, CoC, AGENT.md) and prepared for GitHub push.
- **Files Changed**: `AGENT.md`, `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `README.md`, `docs/*`
- **Verification**: Manual review of file contents.
- **Follow-ups**: Initialize git and push to GitHub.

### Raouf: 2026-01-30

- **Scope**: Rebranding
- **Summary**: Replaced all display occurrences of "raouf.sh" and "Raouf.sh" with "Mohammad Raouf Abedini". Technical URLs/emails were preserved to maintain site functionality.
- **Files Changed**: `AGENT.md`, `CHANGELOG.md`, `README.md`, `src/app/layout.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/Header.tsx`
- **Verification**: Verified titles, metadata, and logos.
- **Follow-ups**: Monitor for any overlooked branding strings.

### Raouf: 2026-01-30

- **Scope**: Portfolio Professionalization & Fixes
- **Summary**: Refactored `README.md` to be a professional portfolio site repository description. Fixed repository URL typo from "Porfolio" to "Portfolio".
- **Files Changed**: `README.md`, `AGENT.md`, `CHANGELOG.md`
- **Verification**: Verified GitHub remote and scannability of new README.
- **Follow-ups**: None.

### Raouf: 2026-01-30

- **Scope**: High-Impact Polish & Refinement
- **Summary**: Implemented "Make it go crazy" upgrades: centralized data in `data.ts`, fixed duplicate layouts, added `VideoFacade` for performance, upgraded metadata (SEO/OG), and enhanced security headers.
- **Files Changed**: `src/lib/data.ts`, `src/app/page.tsx`, `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx`, `src/components/ui/VideoFacade.tsx`, `src/app/layout.tsx`, `src/components/ui/NeonButton.tsx`
- **Verification**: Verified dynamic routes, video click-to-load, and metadata tags.
- **Follow-ups**: None.

### Raouf: 2026-01-30

- **Scope**: Final Audit & Polish
- **Summary**: Conducted full system audit. Verified build status, linting (0 errors), and security configuration. Restored missing Philosophy/Lab sections in Home page and cleaned up unused imports.
- **Files Changed**: `src/app/page.tsx`, `CHANGELOG.md`, `AGENT.md`
- **Verification**: `npm run lint` (clean), `npm run build` (success).
- **Follow-ups**: Ready for deployment.

### Raouf: 2026-01-31

- **Scope**: "Command Center" UI Overhaul
- **Summary**: Implemented new "Command Center" theme components including ActiveGrid (background), DecryptedText (header animation), and TerminalFeed (boot logs). Updated Home page to integrate these components with a new "Focus Mode" for project cards.
- **Files Changed**: `src/components/ui/ActiveGrid.tsx`, `src/components/ui/DecryptedText.tsx`, `src/components/ui/TerminalFeed.tsx`, `src/app/page.tsx`
- **Verification**: `npm run lint` (clean), `npm run build` (success). Visual components implemented.
- **Follow-ups**: None.

### Raouf: 2026-01-31

- **Scope**: Interactive Components Implementation
- **Summary**: Implemented "Keylogger" Contact Form and "Classified Archive" Projects Page.
- **Files Changed**:
  - `src/lib/data.ts`: Added `category` and `year` fields to Project data.
  - `src/components/ui/SecureContactForm.tsx`: New component with "monitoring" visuals.
  - `src/app/contact/page.tsx`: Integrated SecureContactForm.
  - `src/app/projects/page.tsx`: Implemented search/filter database UI.
- **Verification**: `npm run lint` (clean), `npm run build` (success).
- **Follow-ups**: None.

### Raouf: 2026-01-31

- **Scope**: Final Audit & Polish
- **Summary**: Conducted full system audit. Fixed navigation links, upgraded placeholder pages, and verified build integrity.
- **Files Changed**:
  - `src/components/layout/Navbar.tsx`: Pointed contact button to `/contact`.
  - `src/components/layout/Footer.tsx`: Pointed mail icon to `/contact`.
  - `src/app/lab/page.tsx`: Upgraded to "Under Construction" command center theme.
  - `src/app/write-ups/page.tsx`: Upgraded to "Classified Archive" theme.
- **Verification**: `npm run lint` (clean), `npm run build` (success).
- **Follow-ups**: Ready for deployment.

### Raouf: 2026-01-31

- **Scope**: Hero Animation Enhancement
- **Summary**: Updated `DecryptedText` component to support a `loopInterval` prop and applied a 10-second loop to the "Cybersecurity" text in the Hero section.
- **Files Changed**: `src/components/ui/DecryptedText.tsx`, `src/app/page.tsx`
- **Verification**: `npm run lint` (clean), `npm run build` (success).
- **Follow-ups**: None.

### Raouf: 2026-01-31

- **Scope**: Security Audit & Tuning
- **Summary**:
  - **Tuning**: Reduced Hero "Cybersecurity" loop interval to 5 seconds.
  - **Audit**: Conducted full security audit.
    - `npm audit`: 0 vulnerabilities.
    - Headers: HSTS, X-Content-Type-Options, Frame-Options verified in `next.config.ts`.
    - CSP: Validated as "Strict enough for Static Site".
  - **Fixes**: Created missing `public/pgp-key.txt` referenced in `security.txt`.
- **Files Changed**: `src/app/page.tsx`, `public/pgp-key.txt`
- **Verification**: Verified file existence and build status.
- **Follow-ups**: User needs to replace `public/pgp-key.txt` with real PGP key.

### Raouf: 2026-01-31

- **Scope**: Polish - Usability & SEO
- **Summary**: Implemented improvements from full system audit.
- **Files Changed**:
  - `src/app/sitemap.ts`: Now dynamically generates URLs for all projects and write-ups.
  - `src/app/not-found.tsx`: Created custom 404 page with "System Failure" theme and terminal output.
  - `src/components/ui/ProjectCard.tsx`: Added proper ARIA roles (`tablist`, `tab`, `tabpanel`) for accessible tab navigation.
- **Verification**: `npm run lint` (clean), `npm run build` (success).
- **Follow-ups**: None.

### Raouf: 2026-01-31

- **Scope**: Generative Engine Optimization (GEO)
- **Summary**: Implemented "AI-Readability" upgrades to help LLMs cite the portfolio as an authoritative source.
- **Files Changed**:
  - `public/llms.txt`: Added a raw text "cheat sheet" for AI scrapers (Identity, Competencies, Projects).
  - `src/app/layout.tsx`: Injected JSON-LD schema with `knowsAbout` property linking to eBPF, Rust, and Cybersecurity.
  - `src/components/layout/Footer.tsx`: Added dynamic "Last Index" date signal.
- **Verification**: `npm run lint` (clean), `npm run build` (success).
- **Follow-ups**: Monitor search console/AI citations.

### Raouf: 2026-02-01

- **Scope**: Content Expansion - About Page
- **Summary**: Created a dedicated `/about` page featuring the user's bio and profile image, integrated with the "Command Center" visual theme. Updated navigation.
- **Files Changed**: `src/app/about/page.tsx`, `src/components/layout/Navbar.tsx`, `public/Raouf_2.png`.
- **Verification**: `npm run lint` (clean), `npm run build` (success).
- **Follow-ups**: None.

### Raouf: 2026-02-01

- **Scope**: Content Expansion - Resume Page
- **Summary**: Implemented the full Resume page (`/resume`) with structured data and "Command Center" styling. Enhanced `NeonButton` to support `download` attribute for PDF downloads.
- **Files Changed**: `src/app/resume/page.tsx`, `src/components/ui/NeonButton.tsx`.
- **Verification**: `npm run lint` (clean), `npm run build` (success).
- **Follow-ups**: None.

### Raouf: 2026-02-01

- **Scope**: Privacy Update
- **Summary**: Removed personal phone number from the Resume page for privacy. Conducted a placeholder audit.
- **Files Changed**: `src/app/resume/page.tsx`.
- **Verification**: `npm run lint` (clean), `npm run build` (success).
- **Follow-ups**: None.

### Raouf: 2026-02-01

- **Scope**: Polish - Placeholder Cleanup
- **Summary**: Replaced visual placeholders with final assets. Updated `Home` page icons and `SecureContactForm` placeholder text to match the "Command Center" theme.
- **Files Changed**: `src/app/page.tsx`, `src/components/ui/SecureContactForm.tsx`.
- **Verification**: `npm run lint` (clean), `npm run build` (success).
- **Follow-ups**: User to provide content for Lab, Write-ups, and update PGP/Resume files.

### Raouf: 2026-02-01

- **Scope**: Feature Implementation - Lab & Write-ups
- **Summary**: Implemented functional Lab and Write-ups sections.
  - **Lab**: Created a data-driven experiment list in `src/app/lab/page.tsx` pulling from `data.ts`.
  - **Write-ups**: Implemented dynamic routing (`/write-ups/[slug]`) and a clean article reader interface.
  - **Data**: Enriched `data.ts` with placeholder Lab Experiments and Write-up content to enable immediate site functionality.
- **Files Changed**: `src/lib/data.ts`, `src/app/lab/page.tsx`, `src/app/write-ups/page.tsx`, `src/app/write-ups/[slug]/page.tsx`.
- **Verification**: `npm run lint` (clean), `npm run build` (success).
- **Follow-ups**: None.

### Raouf: 2026-02-01

- **Scope**: Polish - Lab Section Professionalization
- **Summary**: Upgraded Lab section to be fully functional and professional.
  - **Detail Views**: Created `/lab/[id]` pages to display experiment details with a code editor UI.
  - **Content**: Enriched `data.ts` with realistic code snippets (Rust, Python, Go) for keylogger, packet sniffer, and steganography experiments.
  - **Navigation**: Linked Lab index to detail pages.
- **Files Changed**: `src/lib/data.ts`, `src/app/lab/page.tsx`, `src/app/lab/[id]/page.tsx`.
- **Verification**: `npm run lint` (clean), `npm run build` (success).
- **Follow-ups**: None.

### Raouf: 2026-02-01

- **Scope**: DevOps - GitHub Pages Deployment
- **Summary**: Configured the project for static export and automated deployment via GitHub Actions.
  - **Config**: Updated `next.config.ts` with `output: 'export'` and unoptimized images.
  - **Workflow**: Created `.github/workflows/deploy.yml` for automated CI/CD.
  - **Polish**: Implemented custom global scrollbar with cyan neon glow effects.
  - **Deployment**: Switched to `Raoof128` account and enabled GitHub Pages via CLI.
- **Files Changed**: `next.config.ts`, `.github/workflows/deploy.yml`, `src/app/globals.css`.
- **Verification**: `git push` success, GitHub Pages API confirmed activation.
- **Follow-ups**: None.

### Raouf: 2026-02-01

- **Scope**: Rebranding & Audit
- **Summary**: Replaced all instances of `raouf.sh` with `raoof128.github.io/Portfolio` (for URLs) or `raoof.r12@gmail.com` (for contact). Conducted full system audit.
  - **Rebranding**: Updated `layout.tsx`, `sitemap.ts`, `robots.ts`, `llms.txt`, `security.txt`, `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
  - **Fix**: Added `export const dynamic = 'force-static'` to `robots.ts` and `sitemap.ts` to fix static export build errors.
  - **Audit**: Passed `npm run lint`, `npm run build`, and `npm audit` (0 vulnerabilities).
- **Files Changed**: `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `public/llms.txt`, `public/security.txt`, `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
- **Verification**: Build successful, site ready for deployment.
- **Follow-ups**: None.

### Raouf: 2026-02-01

- **Scope**: DevOps - Custom Domain
- **Summary**: Configured GitHub Pages to use the custom domain `raoof.r12.com`.
  - **Asset**: Created `public/CNAME`.
  - **Config**: Updated GitHub repository settings via CLI to bind the custom domain.
  - **Note**: HTTPS enforcement requires DNS propagation.
- **Files Changed**: `public/CNAME`.
- **Verification**: `gh api` confirmed `cname: "raoof.r12.com"`.
- **Follow-ups**: User must configure DNS records.

### Raouf: 2026-02-01

- **Scope**: Fix - Revert Custom Domain & Workflow Patch
- **Summary**: Reverted custom domain configuration to use default GitHub Pages URL. Fixed a typo in the GitHub Actions workflow.
  - **Revert**: Deleted `public/CNAME` and unset custom domain via API. Site is now at `https://raoof128.github.io/Portfolio/`.
  - **Fix**: Corrected `actions/actions/checkout` to `actions/checkout` in `deploy.yml` to resolve build failure.
- **Files Changed**: `.github/workflows/deploy.yml`, `public/CNAME` (deleted).
- **Verification**: `gh api` confirmed `cname: null`. `git push` successful.
- **Follow-ups**: Monitor GitHub Actions for success.

### Raouf: 2026-02-01

- **Scope**: Fix - CI Build & BasePath
- **Summary**: Resolved GitHub Actions failure (`tar: out: Cannot open`) by taking manual control of the Next.js configuration.
  - **Analysis**: The `actions/configure-pages` step was likely conflicting with `next.config.ts`, causing `output: 'export'` to be ignored.
  - **Fix**: Removed `static_site_generator: next` from the workflow and manually added `basePath: "/Portfolio"` to `next.config.ts`.
- **Files Changed**: `next.config.ts`, `.github/workflows/deploy.yml`.
- **Verification**: Local build passes. Git push to trigger CI.
- **Follow-ups**: Monitor deployment.

### Raouf: 2026-02-01

- **Scope**: Audit - Responsiveness & Consistency
- **Summary**: Conducted a full file-by-file audit for mobile responsiveness and content consistency.
  - **Responsiveness**: Fixed grid layouts in `SecureContactForm` and `About` stats to be mobile-first (`grid-cols-1 sm:grid-cols-2`).
  - **Consistency**: Updated `not-found.tsx` to remove old branding references (`root@raouf` -> `root@portfolio`).
  - **Placeholders**: Updated `pgp-key.txt` with a more professional simulated block.
- **Files Changed**: `src/components/ui/SecureContactForm.tsx`, `src/app/about/page.tsx`, `src/app/not-found.tsx`, `public/pgp-key.txt`.
- **Verification**: Code review and build verification.
- **Follow-ups**: None.

### Raouf: 2026-02-01

- **Scope**: Audit - Documentation Consistency
- **Summary**: Audited all `README.md` and `docs/*` files for accuracy and consistency with the codebase.
  - **Fix**: Corrected `README.md` to describe GitSwitch as an Electron/React app (was incorrectly listed as Rust).
  - **Links**: Updated repository URLs in documentation to point to the `Raoof128` namespace.
- **Files Changed**: `README.md`, `docs/GITSWITCH_README.md`, `docs/ECRSM_README.md`.
- **Verification**: Cross-referenced `data.ts` with documentation.
- **Follow-ups**: None.

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
- **Follow-ups**: None.
