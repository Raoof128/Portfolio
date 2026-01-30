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
