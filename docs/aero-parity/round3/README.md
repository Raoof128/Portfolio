# Third parity pass

**CONDITIONAL PASS**: see [final verdict](final-verdict.md).

This pass re-measured `38842e2` against unchanged `7.css@0.21.1` with the existing harness. It used a rebuilt round-2 control to separate browser-version drift from real regressions, then fixed each measured root cause. Results:

- **134 controlled state pairs:** 40 → **60 exact** (+1 within a measured 1/255 noise band), with no pair worse.
- **New RTL fix:** Persian and Arabic windows now open clear of the right-hand icon column and intro.
- **Browser suite:** Chromium Playwright 72/72 and 803 unit tests pass.

| Document | Contents |
| --- | --- |
| [plan.md](plan.md) | Reference freeze, classification, control experiment, task ownership |
| [findings.md](findings.md) | R3-01 … R3-13 with root causes and owners |
| [parity-matrix.md](parity-matrix.md) | Component × state results, tolerance justification, coverage limits |
| [final-verdict.md](final-verdict.md) | Identity, models, gates, remaining differences |
| [evidence/](evidence/) | Classification table, before/reference/final crops, RTL and dark captures |

Large raw captures stay under ignored `artifacts/aero-parity/r3-*`. Reproduce them with the commands in the [harness README](../../../scripts/browser-regressions/aero-parity/README.md), using `PORTFOLIO_CHROMIUM_PATH=/opt/pw-browsers/chromium` in this environment.
