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
