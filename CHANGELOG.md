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
