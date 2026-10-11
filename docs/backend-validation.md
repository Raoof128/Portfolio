# Backend and data validation

ResearchOS exports static files to Cloudflare Pages. Its server components and
GET route handlers run during the Next.js build. Production routing and response
headers come from `public/_redirects` and `public/_headers`. Contact creates an
email draft; there is no submission service, account session or database.

## Input and output boundaries

- One own-property locale guard selects the five authored languages and preserves
  the existing English fallback for unsupported strings. Server page adapters
  normalize parameters before selecting content, metadata or the reading app.
- Project route lookups accept only authored project keys. Inherited object names
  produce the framework's 404 signal. This corrects helper and adapter contracts;
  it does not establish that malformed parameters were exploitable in production.
- Content dates must have the expected ISO date shape, a finite timestamp and a
  matching calendar round-trip. Article revisions cannot predate publication.
- RSS tests parse the emitted XML and check completeness, text, canonical links,
  original publication dates and ordering. Publication facts remain unchanged.
- The deployment fingerprint uses a fixed argument array for Git, a two-second
  deadline and a 4 KiB output cap. Only valid Git/CI commit hashes are published;
  unavailable identity is reported as unknown. Export and HTTP audits reject an
  unknown or malformed fingerprint. A commit match does not identify uncommitted
  source or prove that exact exported bytes are deployed.

## Bounded HTTP audit

Run these commands sequentially with the supported Node version:

Vitest and Next's static generation use one worker to keep local memory use
bounded. Reuse one static preview; the checks do not start a development server.

```bash
npm run test:backend
npm run lint
npm run typecheck
npm run test:ci
npm run test:schemas
npm run build
npm run audit:agents
npm run audit:production -- http://127.0.0.1:4398
```

The last command reuses a static preview that implements the host's redirects and
headers. The default `audit:production` origin is the production website; use it
after an explicitly approved deployment.

Every HTTP request has a ten-second deadline covering headers and body, and a
4 MiB decoded-body limit. Header-only and manual-redirect probes cancel their
bodies. Cleanup also cancels headers arriving after timeout from an abort-ignoring
test transport. The tests use mocked responses and need no HTTP server.

Ordinary probes require a direct response and reject redirects. Deliberate 308
checks compare origin, path and query. A preview retains the site's production
canonical identity and skips the production-only `www` request. Wrong MIME types,
missing configured framing/MIME protections, invalid disclosure-contact expiry
and malformed deployment identity fail the audit. CSP parsing preserves the
first directive and detects duplicates regardless of name casing.

CI and deployment build jobs run the HTTP audit regression suite alongside the
existing application, schema, dependency and export checks. They do not run the
live production audit or expose the deployment token to build tools.

## Evidence and limits

The backend polish has separate dated source/export identities and validation
logs outside Git. The earlier reviewed build 12 packet remains unchanged. Its
historical browser captures retain their original identities.

The checks establish the covered local build, data and HTTP contracts. They do
not establish production deployment, remote CI execution, email delivery, field
performance, physical-device or screen-reader acceptance. Source and current
preview remain uncommitted; publication requires owner approval.

Implementation references: [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports),
[Node 22 AbortController](https://nodejs.org/docs/latest-v22.x/api/globals.html#class-abortcontroller),
[RFC 9116 disclosure contact expiry](https://www.rfc-editor.org/rfc/rfc9116#section-2.5.5).
