# Divan and Nexus pinned-source review

Reviewed on 4 November 2026. Read-only source and metadata review; no product edits, remote writes, remote setup commands, builds or project tests were performed.

| Repository | Default branch | Pinned head | Visibility |
| --- | --- | --- | --- |
| Raoof128/divan-open-day | `main` | `1f931e7a9491e264b63c13af65cc950bc810383f` | Public; unarchived |
| Raoof128/Nexus_Archive | `codex/bootstrap` | `2628e64bb20e7d5c556fd6607d3a9853481fc791` | Public; unarchived |

The accompanying JSON accounts for every initial field: 44 Divan leaves and 42 Nexus leaves. Its source registry records exact Git blob SHA, local SHA256, source-byte SHA256, reviewed spans and pinned permalinks. Some earlier local fetch captures include one extra terminal LF; removing that capture artefact exactly reproduces the registered Git blob. Raw captures remain work-only.

## Confirmed copy changes

### NEXUS-TOKEN-BOUNDARY

The absolute claim that there are no frontend-readable tokens is contradicted by pinned implementation. HttpOnly cookies are set, but login and refresh also return the access token in JSON. The frontend stores the login response in its JavaScript session context.

Recommended wording scope: Describe backend-issued HttpOnly SameSite=Strict cookies and the refresh flow; remove the assertion that all access tokens are inaccessible to frontend JavaScript. Do not infer a vulnerability solely from this design.

Affected fields: `secure.measures[0]`, `solution[1]`.

- [backend/auth_controller.py:60–73](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/backend/auth_controller.py#L60-L73): “access_token=access_token if include_token else None”.
- [backend/auth_controller.py:76–99](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/backend/auth_controller.py#L76-L99): “"httponly": True”.
- [backend/auth_controller.py:139–147](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/backend/auth_controller.py#L139-L147): “include_token=True”.
- [backend/auth_controller.py:172–180](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/backend/auth_controller.py#L172-L180): “include_token=True”.
- [frontend/src/context/AuthContext.jsx:56–64](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/frontend/src/context/AuthContext.jsx#L56-L64): “setSession(authenticatedSession)”.

### NEXUS-ENCRYPTION-CONFIGURATION

Takeaway encryption is a configured Fernet feature, not evidence that a particular deployment has its key set. Takeaway writes fail closed without the key; chat encryption is separately conditional and returns plaintext when unconfigured.

Recommended wording scope: Use configured Fernet encryption for takeaway notes, requiring TAKEAWAY_ENCRYPTION_KEY for writes. Do not broaden this to unconditional chat/database encryption or claim a verified production setting.

Affected fields: `description`, `secure.measures[3]`, `solution[3]`.

- [backend/data_protection.py:92–114](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/backend/data_protection.py#L92-L114): “TAKEAWAY_ENCRYPTION_KEY must be configured before storing takeaways”.
- [backend/data_protection.py:117–128](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/backend/data_protection.py#L117-L128): “Encrypt chat content when a field-level encryption key is configured.”.
- [docs/operations.md:17–18](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/docs/operations.md#L17-L18): “takeaway writes require TAKEAWAY_ENCRYPTION_KEY”.

### NEXUS-JOB-TRACKER

The current repository describes and implements a job-tracking extension in addition to the media vault. Portfolio copy omits this current capability.

Recommended wording scope: Mention job applications and job-aware suggestions without treating example recommendations in source as actual employment or partnerships.

Affected fields: `description`, `fullDescription`, `build.features[2]`.

- [README.md:1–3](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/README.md#L1-L3): “personal media vault and job tracker”.
- [supabase/migrations/20260324000000_add_job_media_type.sql:1–3](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/supabase/migrations/20260324000000_add_job_media_type.sql#L1-L3): “ALTER TYPE media_type ADD VALUE IF NOT EXISTS 'job'”.
- [backend/services.py:207–220](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/backend/services.py#L207-L220): “job applications from my tracker”.

### NEXUS-CHAT-TRANSPORT

The inspected chat path uses HTTP GET/POST requests, TanStack Query, optimistic local updates and cache invalidation. This does not substantiate a realtime subscription or streamed transport claim.

Recommended wording scope: Use persistent AI chat transcripts with user-scoped sanitisation. User-visible interactive updates are supported; avoid implying a realtime protocol.

Affected fields: `build.features[1]`.

- [frontend/src/hooks/useChat.js:45–77](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/frontend/src/hooks/useChat.js#L45-L77): “apiFetch(`/chat/sessions/${sessionId}/messages`”.
- [backend/chat_controller.py:153–173](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/backend/chat_controller.py#L153-L173): “@post("/sessions/{session_id:str}/messages")”.

### NEXUS-LOAD-TEST-SCOPE

A Locust scenario is present for authenticated recommendation requests. No benchmark result or measured performance outcome was located in the pinned repository tree and reviewed docs.

Recommended wording scope: State that Locust scenarios exercise the recommendation endpoint, rather than presenting the scenario itself as performance verification or a measured benchmark.

Affected fields: `proof[2]`.

- [loadtests/locustfile.py:13–37](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/loadtests/locustfile.py#L13-L37): “Exercise the media suggestion endpoint with authenticated traffic.”.
- [README.md:80–90](https://github.com/Raoof128/Nexus_Archive/blob/2628e64bb20e7d5c556fd6607d3a9853481fc791/README.md#L80-L90): “make load-test”.

### DIVAN-APPLICATION-PRIVACY-SCOPE

The application does not collect intentions, transmit poem selections to an app database, or include analytics/tracking code. The same repository explicitly distinguishes provider/edge connection data and a separately governed logging/retention boundary. Absolute nothing-is-transmitted, collecting-nothing and complete-privacy wording overstates that boundary.

Recommended wording scope: Scope the claim to application collection: no accounts, intention submission, application analytics/tracking cookies or poem-choice database. Acknowledge limited hosting/network connection data and separate provider logging governance. Prefer public release/poem IDs for sessionStorage wording.

Affected fields: `description`, `secure.measures[0]`, `secure.measures[1]`, `fullDescription`, `problem`, `proof[0]`.

- [README.md:147–154](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/README.md#L147-L154): “A hosting provider and network edge may process limited connection data”.
- [src/pages/PrivacyPage.tsx:15–20](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/src/pages/PrivacyPage.tsx#L15-L20): “may process limited technical network information”.
- [src/pages/PrivacyPage.tsx:38–41](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/src/pages/PrivacyPage.tsx#L38-L41): “These values are not transmitted by the application.”.
- [src/pages/PrivacyPage.tsx:54–60](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/src/pages/PrivacyPage.tsx#L54-L60): “rather than a zero-logging claim”.

### DIVAN-ORIGIN-PORT-SCOPE

The origin is served behind an outbound tunnel and the Compose definition has no host-published application port. The public website still has an inbound HTTPS interface; no inbound surface is broader than the configuration establishes.

Recommended wording scope: Use static origin behind an outbound tunnel, with no host-published application ports.

Affected fields: `secure.measures[5]`.

- [README.md:48–52](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/README.md#L48-L52): “Unprivileged static container behind an outbound tunnel”.
- [ops/compose.yml:3–20](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/ops/compose.yml#L3-L20): “expose:”.
- [docs/deployment-runbook.md:169–175](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/docs/deployment-runbook.md#L169-L175).

### DIVAN-REVIEW-AND-OFFLINE-SCOPE

The 120-record count and engineering source/provenance checks are supported. The dated corpus report explicitly uses machine/source authority rather than human approval; cultural sign-off and manual assistive-technology evidence are not established. Offline readiness is a verified cache/release state, not guaranteed by every initial navigation.

Recommended wording scope: Retain 60 Hafez +60 Rumi =120, source-bound provenance and optional recitation; label review as engineering/source validation. Describe offline use after a verified release is cached. Treat art direction as design intent and tests as engineering evidence, without cultural/manual-AT certification or future ever-ships guarantees.

Affected fields: `description`, `build.features[0]`, `fullDescription`, `solution[3]`, `proof[1]`, `proof[2]`, `proof[3]`.

- [docs/verification/2026-07-16-final-120-corpus-report.md:5–13](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/docs/verification/2026-07-16-final-120-corpus-report.md#L5-L13): “All 120 carry current source-bound machine authority”.
- [README.md:174–182](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/README.md#L174-L182): “Repository tests and local browser checks are engineering evidence.”.
- [src/pages/PrivacyPage.tsx:44–51](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/src/pages/PrivacyPage.tsx#L44-L51): “offline readiness must come from the verified application state”.
- [README.md:11–14](https://github.com/Raoof128/divan-open-day/blob/1f931e7a9491e264b63c13af65cc950bc810383f/README.md#L11-L14): “optional recitation”.

## Status and source limits

Both exact-head workflow runs were completed with failure: [Divan quality gate](https://github.com/Raoof128/divan-open-day/actions/runs/29635610906) failed while its OSV scan succeeded; [Nexus CI](https://github.com/Raoof128/Nexus_Archive/actions/runs/24304573805) has failed backend/frontend jobs and successful operations/secrets jobs. These are workflow observations, not proof of runtime failure or a vulnerability. Existing suite/CI text should name configured checks or dated results without implying current green CI.

Both public demo GETs were blocked by the execution environment proxy before reaching the sites (tunnel 403). Availability remains unverified. The Divan demo URL is in its pinned README. The existing Nexus demo URL was not found in the reviewed repository documentation, so it requires a successful external live check before any availability claim.

The provided résumé/profile text has no Divan/Nexus/Open Day/poetry keyword match; no project fact or removal decision is inferred from that absence. Neither reference is copied into this public-fact report.

The reviewed Divan deployment note documents historical provider/edge limitations, and the current Privacy page keeps logging/retention as a separate operational boundary. This review does not assert that any particular analytics or logging setting is enabled today. Private operational details are deliberately omitted.

The 120-record corpus, engineering source checks and toolchain remain valid scoped facts. They do not establish cultural sign-off, manual assistive-technology certification, university endorsement, zero provider logging or present live runtime state. Nexus encryption and deployment controls require their documented configuration; its Terraform is explicitly a scaffold. No new metric, performance result, affiliation or production guarantee is added.

All field decisions and source hashes are in `nexus-divan-review.json`. Source captures and full tree/API responses remain under `engineering-raw/` for internal review only.
