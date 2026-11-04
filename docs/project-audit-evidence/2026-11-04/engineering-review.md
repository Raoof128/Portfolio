# Curated engineering project source review

Reviewed on 4 November 2026. All four default-branch heads were pinned before inspection. This is a read-only content review of public source and dated GitHub Actions evidence; no local test, benchmark or deployment was performed.

| Project | Default branch | Pinned HEAD | Visibility |
|---|---|---|---|
| Raoof128/GitSwitch | `master` | `5161409a0bc640b105c2a5438055b009425d6843` | Public, unarchived |
| Raoof128/Syllabus-Sync | `main` | `0fecd0309ed621244cd7e982945025958e5c99a7` | Public, unarchived |
| Raoof128/divan-open-day | `main` | `1f931e7a9491e264b63c13af65cc950bc810383f` | Public, unarchived |
| Raoof128/Nexus_Archive | `codex/bootstrap` | `2628e64bb20e7d5c556fd6607d3a9853481fc791` | Public, unarchived |

## Proposed corrections

Full replacement Project objects and the revised `electron-security` article are in [engineering-replacements.json](engineering-replacements.json). Original display years and the article's publication date are retained; its meaningful revision date is 4 November 2026.

- **GITSWITCH-MANIFEST**: Manifest declares Electron ^39.2.6 and React ^19.2.1; these are dependency ranges, not a measured installed/runtime version. [Source](https://github.com/Raoof128/GitSwitch/blob/5161409a0bc640b105c2a5438055b009425d6843/package.json#L71-L86)
- **GITSWITCH-AI-PROVIDERS**: Gemini, OpenAI, Anthropic and local-model providers plus offline heuristics; model selection is configurable. [Source](https://github.com/Raoof128/GitSwitch/blob/5161409a0bc640b105c2a5438055b009425d6843/README.md#L36-L41)
- **GITSWITCH-MEMORY-ERASURE**: Encrypted safeStorage files and limited JavaScript reference clearing; assigning an empty string is not guaranteed erasure of immutable strings or memory copies. [Source](https://github.com/Raoof128/GitSwitch/blob/5161409a0bc640b105c2a5438055b009425d6843/src/main/secure/key-manager.ts#L96-L132)
- **GITSWITCH-STORAGE-AND-ISOLATION**: Describe safeStorage-encrypted application files, fail-on-unavailable encryption and the source's explicit renderer settings, without a universal security guarantee. [Source](https://github.com/Raoof128/GitSwitch/blob/5161409a0bc640b105c2a5438055b009425d6843/src/main/secure/key-manager.ts#L96-L132)
- **GITSWITCH-DISPLAY-YEAR**: Retain the original display year. Public repository creation and copyright are 2026, but neither proves when development began; no replacement year is established. [Source](https://github.com/Raoof128/GitSwitch/blob/5161409a0bc640b105c2a5438055b009425d6843/LICENSE#L1-L5)
- **ELECTRON-WRITEUP-GUARANTEES**: Replace with source-bounded safeStorage, reference cleanup, multi-provider/cloud-consent and renderer-isolation explanations, documented residual limits and immutable citations. Keep published date and set genuine revision date to 2026-11-04. [Source](https://github.com/Raoof128/GitSwitch/blob/5161409a0bc640b105c2a5438055b009425d6843/src/main/secure/key-manager.ts#L96-L132)
- **SYLLABUS-DATED-TEST-RESULT**: At the pinned revision, the 17 August 2026 test job passed 1,343 tests in 155 files. Same pipeline's separate security job failed at npm audit, so this is not an overall green pipeline. Supplied résumé/profile and README counts are retained as earlier source snapshots, not current executed counts. [Source](https://github.com/Raoof128/Syllabus-Sync/actions/runs/31985225550/job/95258962296)
- **SYLLABUS-AUTH-BOUNDARY**: Protects configured page routes and non-public APIs with explicit public exceptions. Protected API auth failures return 503/401. Implementation evidence does not establish a verified production outcome. [Source](https://github.com/Raoof128/Syllabus-Sync/blob/0fecd0309ed621244cd7e982945025958e5c99a7/lib/middleware.ts#L41-L51)
- **SYLLABUS-PASSKEY-SCOPE**: Passkeys use public-key credentials; password-based and MFA flows also exist, so do not describe the whole application as passwordless. [Source](https://github.com/Raoof128/Syllabus-Sync/blob/0fecd0309ed621244cd7e982945025958e5c99a7/docs/security/SECURITY_POSTURE.md#L77-L91)
- **SYLLABUS-EXTRACTION-EVIDENCE**: Current repository supports the independent student experience platform. README documents a PDF-extraction direction and lists a standalone extractor on the roadmap. No concrete OCR/model-call/LLM prompt-injection implementation was located in the inspected paths/tree; qualify that direction rather than infer absence or retain unsupported implementation guarantees. [Source](https://github.com/Raoof128/Syllabus-Sync/blob/0fecd0309ed621244cd7e982945025958e5c99a7/README.md#L28-L46)
- **SYLLABUS-ROLE-AND-AFFILIATION**: Retain supplied-source co-founder/incubator acceptance; state security/backend co-maintainer role and independent, not officially university-affiliated status. Incubator participation and independent status are compatible. [Source](https://github.com/Raoof128/Syllabus-Sync/blob/0fecd0309ed621244cd7e982945025958e5c99a7/README.md#L172-L177)
- **SYLLABUS-DEPLOYMENT-AND-TARGET**: Normalise repository's canonical case, retain the supplied-source .app demo target, and avoid asserting current availability or actual student usage. The package's .dev homepage differs; proxy blocking prevents origin verification. A separate Worker deployment job succeeded at the pinned revision. No repository evidence substantiates 47,000 as an actual user count. [Source](https://github.com/Raoof128/Syllabus-Sync/blob/0fecd0309ed621244cd7e982945025958e5c99a7/package.json#L163-L171)
- **SYLLABUS-STACK-AND-CHECKS**: Retain TanStack Query (it is present) and add Zustand/Cloudflare Workers via OpenNext/Upstash Redis from source. Describe configured secret scanning separately from the observed security job failure and skipped later steps. [Source](https://github.com/Raoof128/Syllabus-Sync/blob/0fecd0309ed621244cd7e982945025958e5c99a7/package.json#L65-L109)
- **NEXUS-TOKEN-BOUNDARY**: Describe backend-issued HttpOnly SameSite=Strict cookies and the refresh flow; remove the assertion that all access tokens are inaccessible to frontend JavaScript. Do not infer a vulnerability solely from this design. [Source](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/backend/auth_controller.py#L60-L73)
- **NEXUS-ENCRYPTION-CONFIGURATION**: Use configured Fernet encryption for takeaway notes, requiring TAKEAWAY_ENCRYPTION_KEY for writes. Do not broaden this to unconditional chat/database encryption or claim a verified production setting. [Source](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/backend/data_protection.py#L92-L114)
- **NEXUS-JOB-TRACKER**: Mention job applications and job-aware suggestions without treating example recommendations in source as actual employment or partnerships. [Source](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/README.md#L1-L3)
- **NEXUS-CHAT-TRANSPORT**: Use persistent AI chat transcripts with user-scoped sanitisation. User-visible interactive updates are supported; avoid implying a realtime protocol. [Source](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/frontend/src/hooks/useChat.js#L45-L77)
- **NEXUS-LOAD-TEST-SCOPE**: State that Locust scenarios exercise the recommendation endpoint, rather than presenting the scenario itself as performance verification or a measured benchmark. [Source](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/loadtests/locustfile.py#L13-L37)
- **DIVAN-APPLICATION-PRIVACY-SCOPE**: Scope the claim to application collection: no accounts, intention submission, application analytics/tracking cookies or poem-choice database. Acknowledge limited hosting/network connection data and separate provider logging governance. Prefer public release/poem IDs for sessionStorage wording. [Source](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/README.md#L147-L154)
- **DIVAN-ORIGIN-PORT-SCOPE**: Use static origin behind an outbound tunnel, with no host-published application ports. [Source](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/README.md#L48-L52)
- **DIVAN-REVIEW-AND-OFFLINE-SCOPE**: Retain 60 Hafez +60 Rumi =120, source-bound provenance and optional recitation; label review as engineering/source validation. Describe offline use after a verified release is cached. Treat art direction as design intent and tests as engineering evidence, without cultural/manual-AT certification or future ever-ships guarantees. [Source](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/docs/verification/2026-07-16-final-120-corpus-report.md#L5-L13)

## Coverage and source precedence

Every initial leaf field of all four Project objects is assessed in the JSON field matrix, including routes, tags, years, links, stack, features, security measures, descriptions, problem, solution and proof. Array replacements preserve full proposed objects rather than relying on ambiguous patch offsets.

| Project | Initial leaf fields reviewed |
|---|---:|
| divan-open-day | 44 |
| nexus-archive | 42 |
| gitswitch | 35 |
| syllabus-sync | 43 |

The registry contains 44 distinct pinned repository files, with reviewed spans, returned Git blob SHAs and local capture SHA256s. Full captured files were checked against Git blob identity; README range chunks were reconstructed with their original line separators/final newline. Partial files are labelled by their inspected spans. Raw logs, trees and API captures remain in work-only storage.

The supplied résumé and profile support Syllabus's co-founder, security/backend and incubator facts and record an older 503/92 snapshot. The pinned 17 August CI test job records **1,343 tests across 155 files passing**; the same pipeline's separate security job failed at `npm audit`, so this is not a claim that all CI/security gates passed. [Executed test job](https://github.com/Raoof128/Syllabus-Sync/actions/runs/31985225550/job/95258962296)

Demo requests were blocked by the execution environment before origin. Existing demo links are retained; their availability was neither confirmed nor disproved. Source describes Syllabus's `.dev` homepage while the supplied references use `.app`; this unresolved target difference is recorded without inventing an origin redirect.

Current source-code behaviour takes precedence over a cookie-only README goal in Nexus and over broad Electron security wording. Syllabus's independent status is compatible with incubator participation. Divan's application collection boundary is distinct from provider/edge connection data.

## Limits

- This is a portfolio content/source audit, not a complete security assessment or an independent execution of the projects' tests.
- A configured check or load scenario is distinct from a passed run or measured benchmark. Failed audit/build jobs alone do not establish an exploitable vulnerability or application outage.
- Repository files and API metadata can differ; exact source scope and immutable revisions are retained. Test counts are dated historical observations.
- No current OCR implementation was found in inspected Syllabus paths; this is an evidence limit, not proof the feature cannot exist elsewhere.
- GitSwitch verify jobs report success, but their detailed logs returned GitHub 410; README's 57/10 count was not promoted to an independently executed metric.
- Physical devices, manual assistive technology, human/cultural review and production/provider settings were not independently tested.

The JSON contains exact findings, before/after proposals, all-field assessment, immutable citations, source hashes, CI job outcomes and source/PDF reconciliation. No source PDF was modified and no personal contact details, private operator configuration or secrets are reproduced in this report.
