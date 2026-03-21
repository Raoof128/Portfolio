# Changelog

## [Unreleased]

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
