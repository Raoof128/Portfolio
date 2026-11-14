# Gmail MCP portfolio addition — 14 November 2026

Added the project below SentinelSSH in all five languages with a public repository
link, localized dossier and unique SVG sealed-courier artwork. Shared motion
controls pause animation without resetting its phase; previews remain still.
Reduced motion, offscreen pausing and scoped SVG IDs follow the existing artwork
lifecycle. No new dependency, external image or animation frame loop was added.

## Sources and claim boundaries

- [Repository README](https://github.com/Raoof128/gmail-mcp/blob/main/README.md)
- [Security policy](https://github.com/Raoof128/gmail-mcp/blob/main/SECURITY.md)
- Installed Next.js client-boundary documentation.

The page attributes the live demonstration to the repository and preserves its
pre-release status and five open external qualification gates. Server-side
allow/ask/deny policy is described without claiming every send requires individual
approval. No Gmail server, credential, mailbox or companion operation was run.

## Verification

- All 771 unit tests passed across 46 files; zero failures or skips.
- Production build: 183 pages; TypeScript and changed-source lint passed.
- Static security: 1,163 files; route audit: 175 URLs, zero warnings.
- Nine browser tests passed in Chromium, Firefox and WebKit. Coverage includes
  all five locale routes, order, search, repository link, responsive preview
  centring, pause/resume phase and reduced-motion stills.
- Desktop and Persian mobile screenshots visually reviewed. The initial screenshot
  helper attempted scrolling during hydration; waiting for the hydrated search
  control corrected the fixture. The browser regressions passed independently.

Physical-device, assistive-technology and native-speaker review were not performed.
CI and live verification follow publication. This is a portfolio addition, not a
fresh audit or qualification of the Gmail MCP application.
