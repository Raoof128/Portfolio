# Changelog

## [Unreleased]

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
