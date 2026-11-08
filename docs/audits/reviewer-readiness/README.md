# Reviewer-readiness audit (8 Nov 2026)

**CONDITIONAL PASS.** A full-portfolio audit, repair and verification, orchestrated by Claude Opus 5.5 with Claude Haiku 5.5 workers. None of it is deployed: production still serves `38842e2`.

| Document | Contents |
| --- | --- |
| [final-verdict.md](final-verdict.md) | Identity, models, every gate, A–J acceptance, adversarial review, deployment recommendation |
| [findings-and-fixes.md](findings-and-fixes.md) | Every fixed finding with reproduction, root cause, tests and commit; claims disproved |
| [unresolved-risks.md](unresolved-risks.md) | Open engineering risks, owner decisions, verification gaps |
| [reviews.md](reviews.md) | Architecture, design, responsive, accessibility, security, performance, content, SEO |
| [source-inventory.md](source-inventory.md) | Per-lane coverage; full ledger in [evidence/source-coverage.tsv](evidence/source-coverage.tsv) |
| [progress-ledger.md](progress-ledger.md) | Stage log for resumption |
| [evidence/](evidence/) | Before/after captures, QA comparison, performance and keyboard-journey data |

Earlier, still-valid work lives in [frontend-review](../frontend-review/README.md) (4 Nov) and the [Aero parity passes](../../aero-parity/README.md).

**Commands that reproduce the gates** (Chromium path for this container):

```bash
npm ci && npm run lint && npm run typecheck && npm run test:ci && npm run test:tooling
```

```bash
npm run build && npm run audit:security && npm run audit:agents
```

```bash
npx wrangler pages dev out --port 4398
```

```bash
PORTFOLIO_CHROMIUM_PATH=/opt/pw-browsers/chromium npx playwright test --project=chromium --trace off
```
