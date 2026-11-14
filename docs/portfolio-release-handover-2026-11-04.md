# Portfolio release handover — updated 14 November 2026

This handover records the latest verified release followed by earlier
release evidence. Earlier audit reports and the
[12 October handover](portfolio-handover-2026-10-12.md) retain their original
builds, measurements and limitations. Their earlier no-deployment statements
describe those historical stages.

## Gmail MCP addition (14 November 2026)

Gmail MCP now follows SentinelSSH in all five languages. Current explorer and
dossier navigation order is Zurvan → Aion → SentinelSSH → Gmail MCP → FORMA.
The new dossier links the public repository and preserves its documented
pre-release status and five open external qualification gates. A bespoke
sealed-courier SVG uses the shared motion controls and reduced-motion stills.
All 771 unit tests and nine Chromium/Firefox/WebKit checks passed locally;
see [the addition audit](audits/gmail-mcp-2026-11-14/README.md).

## Aion ordering update (14 November 2026)

The owner requested Aion immediately below Zurvan. Current explorer and dossier
navigation order is Zurvan → Aion → SentinelSSH → FORMA in all five languages.
The earlier direct Zurvan → SentinelSSH adjacency below is historical.
All 64 focused tests and three browser tests passed across Chromium, Firefox
and WebKit; production build and changed-source lint passed. This release also
publishes the previously local SentinelSSH release-log updates.

## SentinelSSH addition (14 November 2026)

The verified release `deda2793d92e26584689f91cba966257dee59bf4` adds SentinelSSH immediately below Zurvan, followed by FORMA,
in all five locales. A custom SVG inspection lens supports the existing motion
controls and reduced-motion stills. The dossier links the public repository and
states its observer-mode development status and gateway enforcement boundary.
All 771 unit tests, nine local and nine live Chromium/Firefox/WebKit browser tests passed. See
[the addition audit](audits/sentinel-ssh-2026-11-14/README.md). This release also
publishes the documentation updates prepared after the mobile/reload release
below; their earlier local-only status describes that preparation stage.

Both production domains reported this commit, built `2026-11-14T00:17:29.963Z`.
[CI 43532873052](https://github.com/Raoof128/Portfolio/actions/runs/43532873052)
and [deployment 43532873019](https://github.com/Raoof128/Portfolio/actions/runs/43532873019)
succeeded, and both production audits passed. The private Zurvan record is
`wiki/note-portfolio-sentinelssh-release-handover-2026-11-14.md`; older handovers
link to it. These post-release log edits are local and uncommitted.


## Verified release: mobile controls and reload (14 November 2026)

At verification, both production domains served application commit
`c25af79c14aac6f1367cd4583809c05499e1a3af` (built
`2026-11-13T23:44:37.882Z`). The preceding `36aaa80` centres the mobile
minimise glyph; `c25af79` preserves an entered desktop across reloads in the
same tab. A fresh session and an explicit Lock retain the welcome screen; the
arrow still starts the three-second entry on that screen. With JavaScript
enabled but session storage unavailable, reload falls back to the welcome
screen; the no-JavaScript fallback keeps content readable. A bounded early
restore avoids showing the welcome screen while the returning page hydrates.

[CI 43529115694](https://github.com/Raoof128/Portfolio/actions/runs/43529115694)
and [deployment 43529115610](https://github.com/Raoof128/Portfolio/actions/runs/43529115610)
passed; CI ran 771 tests in 46 files. Production audits passed on both
domains. Six local export checks passed in Chromium, Firefox and WebKit,
including delayed hydration and explicit locking. On production, Chromium
and Firefox passed; the two strict WebKit checks reached the expected UI but
failed their error assertions during rapid reload while background prefetches
were cancelled. A slower WebKit interaction completed without those errors.
Physical-device verification remains open. Documentation updates following
this verification were subsequently published in `deda279`.

## Earlier release: résumé alignment (9 November 2026)

At the time, `main` was at `16cc419485385a343da079428cd8de94186c0e09`, live on
both production origins (deploy workflow
[42541382082](https://github.com/Raoof128/Portfolio/actions/runs/42541382082),
https://3e4b1102.raoufabedini.pages.dev, content revision 2026-11-09).

- The whole site follows the Anthropic Research Resident résumé. /resume
  mirrors the PDF line by line in five languages, and the downloadable PDF is
  that résumé without the phone number.
- Conflicting figures and wording elsewhere (projects, write-ups, About,
  llms files) now use the résumé's; see the 9 November entry in
  [CHANGELOG](../CHANGELOG.md) for the list.
- Open for the owner: the public `poc/` folder in invisible-window-research
  contradicts "withheld"; one 92.8% micro-credential grade sits under the
  résumé's 93–100%; About-page lab list is not on the résumé.

## Reviewer readiness and Aero round 3 (9 November 2026)

At the time, `main` was at `e7de6a8461076fb7dc232138e5887ca16d4a1641`, a fast-forward of
the `claude/dazzling-feynman-cp1q08` branch (15 commits from `38842e2`). It was
live on both production origins, deployed by GitHub workflow
[42534569341](https://github.com/Raoof128/Portfolio/actions/runs/42534569341)
as https://ba41077e.raoufabedini.pages.dev; `version.json` reports build time
`2026-11-08T23:20:47.560Z`.

- Changes: third Aero parity pass, short-screen dock scroll fix, whole dock
  labels with locale hyphenation, corrected vendor wording and qualified
  claims, redirect-loop and hreflang audit checks, dead modules and starter
  SVGs removed. Details: [Aero round 3](aero-parity/round3/final-verdict.md)
  and [reviewer readiness](audits/reviewer-readiness/final-verdict.md).
- Verification: 753/753 unit tests, all required node suites, build, static
  and agent audits locally; CI and deploy workflows passed; the production
  audit passed on both origins.
- Open: the owner-decision list and verification gaps in
  [unresolved risks](audits/reviewer-readiness/unresolved-risks.md). Entry
  behavior is unchanged: only the **Enter workspace** arrow opens the desktop.

## Historical arrow-only entry (4 November 2026)

The owner requested removal of profile login. The portrait and name are now a
passive display; only the **Enter workspace** arrow starts entry. The full
three-second loader, welcome screen on home loads/reloads at that time, status/focus,
reduced-motion behavior, five languages and direct document access remain.

The maintained regression clicks the name and portrait to confirm neither
starts loading, then checks that the arrow waits the full 3,000 ms. The
browser helper checks there is one entry button and measures the arrow's wait.

Local verification: all 797 application tests and the 89 focused entry tests
passed, along with typecheck and changed-source ESLint. Release fingerprints
and served behavior are checked independently when publishing.

## Earlier profile-click release evidence

The profile-click trigger described below is historical and superseded by the
arrow-only flow above. Its measurements retain their original build scope.

Application commit `cadf8810535d16feb30fa0a1f94699312705f932` restores the home
profile screen on loads and reloads. Selecting the portrait/name or **Enter
workspace** starts a full three-second loader. Returning sessions, reduced
motion, repeated clicks and Enter/Escape cannot shorten it. Direct document
links remain readable; in-app desktop navigation retains the workspace.

- Exact candidate artifact: [workflow 41777872338](https://github.com/Raoof128/Portfolio/actions/runs/41777872338),
  built `2026-11-04T05:15:58.927Z`, content revision `2026-11-04`.
- Direct Wrangler 4.149.0 production deployment:
  `196a82a7-84b2-48c6-af2c-c5bac4207d22`,
  [deployment receipt](https://196a82a7.raoufabedini.pages.dev).
- The fix was fast-forward merged without rewriting history. Its local and
  remote tips equalled `main` before deletion; remote readback showed only
  `main`. Later documentation commits and automatic rebuilds carry their own
  `version.json` fingerprints.
- Seven regressions failed against the original application. The fix passed
  all 797 tests across 52 files, lint, typecheck, dependency/schema/HTTP/security
  regressions, the production build and static/agent audits. The export has
  1,072 files and 160 audited sitemap URLs.
- Chrome preview measurements after profile selection: ordinary 3,082 ms;
  same-session home return 3,075 ms; reduced-motion keyboard entry 3,027 ms;
  Persian at 320px 3,074 ms. Focus reached the desktop H1. Enter/Escape during
  the first wait could not skip it. These are individual lab observations.
- Persian at 320px retained RTL without horizontal overflow. Arabic, Chinese
  and Spanish home screens at 320px showed the profile screen with no visible
  desktop or horizontal overflow. A direct Simurgh dossier opened immediately.
- Both production HTTP audits passed. Chrome measured 3,072 ms on the live
  custom domain, with the desktop hidden before selection. There were no
  browser errors; delayed stylesheet-preload warnings were observed.
- Runtime dependencies have zero reported vulnerabilities. The full tooling
  audit retains 16 moderate advisories; the high-severity gate passed.

The native profile button preserves the artwork and locale copy. A synchronous
guard prevents duplicate timers; loading disables repeat entry, and unmount
cleanup cancels pending timers. Reduced-motion CSS still suppresses decorative
animation. No dependency, credential, network API or deployment-policy changes.

## Initial release source and production identity

- Repository: [Raoof128/Portfolio](https://github.com/Raoof128/Portfolio).
- Released source: `main` at `17d28c0fe814a0ceed97e454cc92df1e58ffafbf`,
  `feat(portfolio): polish ResearchOS and refresh project evidence`.
- Production: [raoufabedini.dev](https://raoufabedini.dev) and
  [raoufabedini.pages.dev](https://raoufabedini.pages.dev).
- Direct Wrangler production deployment:
  `3a6465f3-739f-4b48-badf-509191d0c40f`,
  [deployment receipt](https://3a6465f3.raoufabedini.pages.dev).
- Deployed artifact fingerprint: content revision `2026-11-04`, built
  `2026-11-04T04:03:27.737Z`; both production domains returned matching
  `version.json` bytes.
- The exact artifact from fresh
  [workflow run 41770595724](https://github.com/Raoof128/Portfolio/actions/runs/41770595724)
  was downloaded, revalidated and uploaded directly using Wrangler 4.149.0.
  Build processes did not receive deployment credentials.
- GitHub and `git ls-remote --heads origin` showed only `main`; there were no
  open pull requests or additional local branches. No merge or deletion was
  necessary, and no source history was rewritten.

The local source checkout is the `portfolio/` directory inside the `new-port`
reference workspace. The parent directory is not a Git repository. This
handover and the related documentation amendments are local changes made after
the release; they are not part of commit `17d28c0` or the deployed artifact.

## What the initial release contains

- Research Highlights and research, résumé and contact actions on first entry;
  optional logon (superseded by the lock-screen correction above); the existing
  Aero artwork and desktop identity.
- Responsive reading layouts down to 320px, a rounded taskbar, navigation,
  focus, clipboard and document-flow corrections.
- All five languages (`en`, `fa`, `ar`, `es`, `zh`), including RTL. Australian
  English spelling applies to English copy only.
- Thirteen source-reconciled projects, seven articles and three lab records
  per locale; updated machine summaries and software/paper DOI distinctions.
- The phone-free downloadable résumé, SHA-256
  `deb6da26ebd0ab540dc6404cca5d49eb7338aba0e4111dccb1686bd620461ece`.

The detailed source work is recorded in the
[reviewer upgrade](reviewer-upgrade-2026-11-04.md),
[frontend audit](full-frontend-audit-2026-11-04.md), and
[project source audit](project-audit-2026-11-04.md). Their browser and visual
results belong to the builds named in those reports and are not presented as
a new production browser audit.

## Initial release verification

- Fresh workflow: 795 unit tests passed, plus dependency, schema, HTTP and
  static-security regressions; lint, typecheck and production build passed.
- Static artifact: 1,072 files passed the security audit; all 160 sitemap
  URLs passed the agent audit with zero warnings.
- Dependency checks: zero runtime vulnerabilities. The full tooling audit
  retains 16 moderate advisories; the required high-severity gate passed.
- Post-deployment HTTP audits passed on both production domains, checking
  deployment identity, metadata, redirects, security headers, machine files,
  language schemas, disclosure expiry and crawler reachability.
- All 62 additional live release checks passed. These covered root/version
  responses, all six public PDFs and 20 referenced JavaScript/CSS assets per
  production origin, an RSC payload, genuine 404 responses and the immutable
  deployment URL. Compared asset, PDF, RSC and version bytes matched the
  reviewed source or artifact.

This release does not add physical-device, native-speaker, assistive-technology
or field Web Vitals evidence. Earlier incomplete contrast checks, PDF tagging
limitations and dated upstream failed/open receipts retain their stated scope.

## Historical full local Zurvan ingestion

The pinned release repository contains 1,028 tracked files: 792 UTF-8 text
files and 236 binary assets. The ingestion preserves every Git file in an
immutable archive, verifies each Git blob and SHA-256, stores all text in
full and extracts all PDF page text layers. Binary assets retain their
original bytes and searchable metadata. Visual interpretation and image OCR
are not claimed. The five local documentation amendments are preserved
separately from the pinned release snapshot.

Zurvan entry points:

- `wiki/note-portfolio-sentinelssh-release-handover-2026-11-14.md` (latest release record)
- `wiki/note-portfolio-mobile-and-reload-release-handover-2026-.md` (earlier release record)
- `wiki/note-portfolio-current-handover-2026-11-04.md`
- `wiki/note-portfolio-full-ingestion-2026-11-04.md`
- The ingestion inventory links every original file to its source page, hash
  and GitHub source URL. Older Portfolio knowledge remains historical.

Earlier release changes used a fresh full archive and per-file inventory, with
delta source pages for changed files and reuse of byte-identical source pages.
Archives, manifests, verification helpers and receipts remain private local
artifacts, outside the website. Source preservation and derived-index freshness
are separate checks: use the current private receipt and `zurvan_status` before
relying on retrieval. The 14 November release has a private handover and
decision; no complete source-tree ingestion for `c25af79` is claimed. No
Zurvan public push is part of this task.

## Maintenance

Run Git commands from the Portfolio checkout. The existing workflow still
deploys pushes to `main`. A direct release uses the verified static `out/`
artifact with `wrangler pages deploy out --project-name=raoufabedini
--branch=main`, followed by `node scripts/audit-production.mjs` for each
production origin. Verify `version.json` and actual served bytes; a successful
push or upload alone is insufficient release evidence.
