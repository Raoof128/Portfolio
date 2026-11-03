# Portfolio frontend review — 3 November 2026

Implementation and evidence for the Windows 7 Aero review. Baseline branch `work`, HEAD `2b6d048c42c7feb7ef82e38f5ca519603d40afc6`; production reported the same commit before changes. The working candidate includes uncommitted changes. No push, merge or deployment occurred.

Start with [release readiness](release-readiness.md), [findings](findings.md), [file coverage](file-coverage.md) and [test results](test-results.md). Machine source identity: [source manifest](source-manifest.json). Historical build claims remain historical in [reconciliation](evidence/frontend-historical-review.md).

## Reproduce

Use the existing isolated checkout; no worktree is necessary. Node22 >=22.13 or24 and npm >=10. Run `npm ci`, lint, typecheck, CI/schema/backend/dependency-security/security tests, coverage and `npm run build`. Then run artifact audits. Network requires npm registry and Google Fonts endpoints; preserve TLS/checksum verification and the custom private braces guard.

Serve `out/` with `npx --yes wrangler@4.149.0 pages dev out --ip 127.0.0.1 --port 4398`. Run `npm run audit:production -- http://127.0.0.1:4398`, then `npm run test:browser -- --project=chromium`. Install engines with `npx playwright install`; normally `npx playwright install-deps` prepares their system libraries. Set `PORTFOLIO_CHROMIUM_PATH=/usr/bin/chromium` to use the cloud machine's installed Chromium. Preview origin is configurable via `PORTFOLIO_PREVIEW_ORIGIN`. WebKit requires an HTTPS preview because CSP upgrade-insecure-requests also upgrades loopback assets in that engine. Use Wrangler --local-protocol https with an ephemeral local certificate/key; set PORTFOLIO_PREVIEW_ORIGIN=https://127.0.0.1:4400 and PORTFOLIO_LOCAL_TLS=1 for that fixture. This explicit certificate-error exception is unavailable for remote preview origins and is not production TLS proof. Do not run multiple Playwright processes against the same output/reporter directories.

The old CUA helpers assert a superseded multiple-retained-app model. They are retained and explicitly deprecated, not counted as current passes. The new Playwright suite is a real Node CLI. Screenshot captures are review artifacts, not unreviewed automatically accepted golden images. JSON results, traces and full screenshot cohorts live under ignored `artifacts/frontend-review/`; representative before/after images and compact raw CLI evidence are retained here.

Optional executable lab gate: `PORTFOLIO_GO_BINARY=/path/to/go node --test scripts/lib/lab-go-snippet.test.mjs`. Website development does not require Go. A skipped wrapper without Go is not an executed Go test.

## Review boundaries

268 applicable source/config/asset files have complete inspection records. Source reading does not imply every native browser state was exercised. Component inventories explicitly identify automation, rendered checks and remaining manual states. No blanket WCAG certification, native-speaker certification, field CWV, physical-device or production-deployment claim is made.
