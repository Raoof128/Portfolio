# Changelog

## [Unreleased]

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
