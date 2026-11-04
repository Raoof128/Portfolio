# Portfolio release handover — 4 November 2026

This handover records the current lock-screen correction followed by the
initial release evidence. Earlier audit reports and the
[12 October handover](portfolio-handover-2026-10-12.md) retain their original
builds, measurements and limitations. Their earlier no-deployment statements
describe those historical stages.

## Current lock-screen release

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

## Full local Zurvan ingestion

The pinned release repository contains 1,028 tracked files: 792 UTF-8 text
files and 236 binary assets. The ingestion preserves every Git file in an
immutable archive, verifies each Git blob and SHA-256, stores all text in
full and extracts all PDF page text layers. Binary assets retain their
original bytes and searchable metadata. Visual interpretation and image OCR
are not claimed. The five local documentation amendments are preserved
separately from the pinned release snapshot.

Zurvan entry points:

- `wiki/note-portfolio-current-handover-2026-11-04.md`
- `wiki/note-portfolio-full-ingestion-2026-11-04.md`
- The ingestion inventory links every original file to its source page, hash
  and GitHub source URL. Older Portfolio knowledge remains historical.

Later release changes use a fresh full archive and per-file inventory, with
delta source pages for changed files and reuse of byte-identical source pages.
Archives, manifests, verification helpers and receipts remain private local
artifacts, outside the website. Source preservation and derived-index freshness
are separate checks: use the current private receipt and `zurvan_status` before
relying on retrieval. No Zurvan public push is part of this task.

## Maintenance

Run Git commands from the Portfolio checkout. The existing workflow still
deploys pushes to `main`. A direct release uses the verified static `out/`
artifact with `wrangler pages deploy out --project-name=raoufabedini
--branch=main`, followed by `node scripts/audit-production.mjs` for each
production origin. Verify `version.json` and actual served bytes; a successful
push or upload alone is insufficient release evidence.
