# AGENT.md - AI Governance & Instruction Set

This file provides context and rules for AI coding assistants (agents) working on the **Raouf.sh Portfolio**.

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
