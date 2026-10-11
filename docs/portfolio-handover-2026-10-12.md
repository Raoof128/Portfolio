# Portfolio handover — 12 October 2026

This handover records the current local state of the Portfolio work on
`main-proof-atlas-2026-10-11`. It consolidates the dated logs and evidence
without replacing their original identities. The working tree is intentionally
dirty; no commit, push, merge, or deployment was made for this handover.

## Project history at a glance

The full entry-by-entry record remains in `CHANGELOG.md`; this timeline groups
its major phases so later handoffs keep their context:

- **January 2026 — Command Center foundation.** The portfolio moved from a
  conventional project page toward an animated Command Center, with searchable
  categorized project records, a contact form, lab/write-up areas, sitemap,
  `llms.txt`, structured identity data, security headers, and accessibility
  fixes. Several early visual metaphors and simulated contact states were later
  replaced or toned down; they are historical design decisions, not current
  service behavior.
- **March–May — Project, paper, and publishing foundation.** NanoMatch and
  SentinelFlow, technical write-ups, project DOI and paper records, responsive
  rendering, and static-export hydration fixes were added. The site moved to
  Cloudflare Pages; the obsolete GitHub Pages workflow was removed. Five-locale
  routing and dictionaries were introduced and audited, including translated
  navigation, sitemap alternates, and Arabic/Persian RTL layout. Research copy
  was revised to describe Invisible Window as an IEEE-format paper rather than
  claiming peer review. The footer date was made deterministic to prevent a
  static/client hydration mismatch.
- **June–July — Research identity, auditability, and security.** Research
  identity and project publication metadata expanded; the résumé and site copy
  were reconciled for the Frontier Red Team application, with explicit
  credibility qualifiers and an honest Claude/Alignerr relationship. SEO and
  agent-discovery work added locale-aware canonical/OG data, reciprocal
  alternates, `ProfilePage` identity, `version.json`, and a live audit tool.
  Security work removed a placeholder encryption-key promise, checked CSP and
  disclosure contact behavior, hardened redirects and artifact inventories,
  with later October continuation covering bounded HTTP audit deadlines/bodies,
  locale/project-key/date validation and secret-free build jobs. The portfolio remains a static site;
  contact opens an email draft and is not a submission API.
- **October 9–11 — ResearchOS and acceptance evidence.** The desktop workspace
  evolved through route-backed single-window behavior, direct URLs, browser
  history semantics, responsive reading, five-locale RTL, keyboard
  alternatives, appearance preferences, search, footer navigation, and
  non-stacked glass surfaces. Original project artwork was preserved. The
  proof work added Atlas modes and sourced Simurgh, Zurvan, and Invisible Window
  evidence stories. The desktop Selected Work project list was removed; Atlas
  was then removed from the welcome lock while retained after unlock. The
  final welcome behavior and local export gates are detailed below. Build 10,
  export `CopyweWtLgJA069LDIXod`, and earlier browser captures retain their own
  historical evidence identities.

## Current decisions and state

- Keep all five authored languages: English, Persian, Arabic, Spanish, and
  Chinese. Australian English spelling applies to English copy only. The
  11 October copy audit's open question about the language scope is resolved.
  No English-only migration edits were made, and the translations remain.
- Proof Atlas was removed from the welcome/lock screen only. The unlocked
  desktop Atlas and project evidence remain. The desktop Selected Work list was
  removed; the interactive evidence sections remain.
- The final recorded local export is `RAlsc85jKQO_lr4A2e_Ie`, built from
  `00ce522dc4c247a15a0fcfb42a280c20c1935cf4`. This is the tested local
  candidate, not a deployment claim. `out/version.json` reads commit
  `00ce522dc4c247a15a0fcfb42a280c20c1935cf4`, content revision `2026-10-11`,
  and build time `2026-10-11T12:45:47.096Z`. The build ID is separately
  recorded in the delivery evidence; `version.json` does not carry that field. The checkout has additional uncommitted changes, so the fingerprint
  must not be read as proof those dirty source changes are represented in the
  export or as proof of deployed bytes.
- The displayed locale identifiers remain `en`, `fa`, `ar`, `es`, and `zh`.
  The accepted language decision is Australian English (`en-AU` / `en_AU`)
  for English copy only. The Persian and Arabic name rendering remains
  `محمد رؤوف عابدینی` and `محمد رؤوف عابديني`; the selected Persian spelling
  for Raouf is رؤوف.
- Fresh visits default to Dark; an explicitly saved Light preference persists.
  The portfolio keeps its 13 project artwork assets and five authored language
  sets. The footer's “Last Index JUL 2026” label remains unresolved because its
  intended meaning and date source were unclear in the audit; it was not
  changed.
- The prior local preview address was `127.0.0.1:4398`, but no listener is
  currently running there. No new server was started as part of this handover.

## Chronology and evidence

The 11 October Proof Atlas delivery implemented three Atlas modes and three
sourced evidence stories, with localized copy, responsive presentation,
keyboard entry and project navigation. Its final dossier performance fix
aligned the fallback window with the persistent workspace geometry and
preserved the visible 96%-to-100% opacity reveal. Removing Selected Work
deleted the desktop project list and orphan styles only. The detailed plan and
historical matrices remain in [the Proof Atlas ledger](./proof-atlas-plan.md).

That implementation's export `T36VJ57GLEBYrLGFmDAY1` passed 571 tests in 43
files, typecheck, lint (zero errors and one existing `.remember/tmp/last-ndc.ts`
warning), a 168-route build, the 160-route agent audit, 1,094-file static
security audit, security and dependency-security suites, local HTTP audit, and
diff check. Its bounded matrix covered home plus three evidence routes, five
languages, two appearances, and desktop/phone. Eight representative images
were reviewed. On the matched Chrome 155 mobile profile, the `P.os-project-lead`
LCP runs were 1,664/1,272/1,300 ms (median 1,300 ms); transfer was 391,680
bytes over 58 resources. These are local lab results, not field CWV. The
historical 640-row matrix belongs to export `CopyweWtLgJA069LDIXod`; it is not
the final export's matrix.

The subsequent lock-screen change removed only the welcome Atlas render,
lock-only styles, and unused dynamic import. It retained the unlocked Atlas,
visibility context, and Divan qualifiers for optional recitation and offline
use after first load. Export `RAlsc85jKQO_lr4A2e_Ie` passed 572 tests in 43
files; typecheck; lint with zero errors and the same existing warning; 168
generated routes; 160-route agent audit with zero warnings; 1,094-file static
security audit; and local HTTP audit. Browser review passed 20 lock states
(five languages × two themes × desktop/phone) and keyboard entry plus Atlas
selection to the Persian Zurvan route. Arabic short-landscape scrolling and
overflow were checked. Console warning/error logs were empty. This browser
review was not a comprehensive native-speaker review; screenshots were
inline-only.

The source-copy audit is documented in
[copy-audit-2026-10-11.md](./copy-audit-2026-10-11.md). It applied Australian
spelling to English prose, made targeted corrections in the other four
languages, and preserved the translations. Its machine text checks covered
`public/llms.txt` and the exported `llms-full.txt`; they are not authorship
proof or a complete rendered-string scan. The copy auditor did not build or run
tests; those checks were conducted separately as described above.

## Backend and security contract carried forward

This remains a static Next.js export for Cloudflare Pages. Locale selection is
restricted to the five own authored keys with the existing English fallback;
project lookup accepts authored project keys and sends inherited or unpublished
keys through the framework 404 path. Dates require an ISO-shaped value, finite
timestamp, calendar round-trip, and a revision date no earlier than publication.
RSS output is checked for completeness, text, canonical links, source
publication dates, and ordering. The `version.json` generator uses a fixed Git
argument list, two-second deadline, 4 KiB output cap, and validated commit
hashes; its commit fingerprint alone cannot prove dirty source or exact deployed
bytes.

The HTTP audit bounds requests at ten seconds and decoded bodies at 4 MiB,
cancels header-only bodies, rejects unexpected redirects and MIME types, and
checks canonical/redirect behavior, configured headers, disclosure-contact
expiry, and deployment identity. CI runs these local contract tests without
exposing deployment credentials to build steps; the live production audit is a
separate operation. Static artifact checks enforce an allowlist for public
files, reject unexpected hidden files, symlinks, source maps and private source
types, and verify disclosure contact assets. CSP checks include duplicate or
overriding directives and restrictions on event handlers, frames, workers, and
base URLs. These are bounded application/export checks, not a universal secret
detector, and inline script/style remain allowed for the app. Full details and
limitations are in [backend validation](./backend-validation.md) and
[security hardening](./security-hardening.md).

## Current limits and outstanding work

- No performance rerun was made on `RAlsc85jKQO_lr4A2e_Ie`; the 1,300 ms
  median belongs to `T36VJ57GLEBYrLGFmDAY1` and must retain that identity.
- The live production audit previously recorded 69 mismatches, including
  deployed fingerprint `50ad6ac7` versus local `00ce522d` and stale CSP and
  non-English schema observations. That state has not been reverified or
  deployed from this checkout.
- Physical-device, screen-reader, remote-CI, and field Core Web Vitals evidence
  is absent. Existing native browser and automated results do not establish
  those forms of acceptance.
- The Atlas plan retains partial inactive/minimized lifecycle coverage: no
  browser pointer animation frame was directly instrumented. The motion gate
  has source tests.
- The local tree remains intentionally uncommitted. The evidence above does
  not authorize publication or deployment.

## Source records

Use the dated entries in [AGENT.md](../AGENT.md) and
[CHANGELOG.md](../CHANGELOG.md), [the copy audit](./copy-audit-2026-10-11.md),
[the Atlas ledger](./proof-atlas-plan.md), and the broader ResearchOS records:
[verification](./research-os-verification.md),
[implementation](./research-os-implementation.md),
[goal checklist](./research-os-goal-checklist.md),
[backend validation](./backend-validation.md), and
[security hardening](./security-hardening.md). Older measurements and branch
identities in these records remain historical evidence and should not be
silently relabeled as current.

## Zurvan synchronization receipt

On 12 October, the complete changelog was copied into six private historical
reference pages and the complete agent log into five parts. README, this
handover and eight current technical reports were also copied, giving 21
source-reference pages. A separate hash manifest and one accepted decision
(`project: portfolio`) preserve source identity and the final language/layout
preferences. Snapshot hashes identify the files before this receipt was added.
The private CLAUDE context was updated locally and was not mirrored.

Current entry: `wiki/note-portfolio-current-handover-2026-10-12.md`.
Manifest: `wiki/note-portfolio-synchronization-manifest-2026-10-12.md`.
Decision: `wiki/decisions/portfolio-retain-five-languages-with-australian-en.md`.
The six history pages reconstruct to SHA-256
`0ddf9ef9f435d736f8868652efa82bb71add52af28862df2431f3f01c52b562e`
(266,461 UTF-8 bytes). These are preserved source records, not new test or
deployment results. Retrieval verification is recorded in the postflight logs.

Postflight: all copied source hashes and byte counts matched. Zurvan graph
rebuilt to 11,754 nodes / 10,764 edges; the real all-MiniLM-L6-v2 search
index is fresh at 302,277 chunks / 11,750 files. MCP readback and keyword
retrieval confirmed the new records. Current-document links and diff check
passed. These final synchronization receipts are local postflight additions,
separate from the hashed source snapshots.
