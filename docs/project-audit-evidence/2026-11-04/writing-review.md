# Writing translations freshness review — 4 November 2026

All seven frozen English articles are reconciled in Persian, Arabic, Chinese and Spanish. Only the four writing JSON overlays and their source-revision manifest changed in this lane. No remaining actionable semantic defect was found in the final review.

There are 192 translated prose lines per locale: 125 changed/new and 67 exact-unchanged source lines reused from the fully reviewed initial translations. Across four locales, all 768 final prose values pass numeric, inline-token, source-link and Markdown structure parity. All title, tag and takeaway values were reviewed. Current and frozen experiments, source-level controls, repository reports, historical results and unverified runtime properties stay distinct.

## Scope and review record

The complete initial files and all seven initial/final English article bodies were read before assembly. After assembly, all four 243-line overlays and the 9-line manifest were fully reread in bounded physical-line chunks (981 final lines total). Exact initial/final spans and hashes are recorded in [writing-review.json](writing-review.json). English was read as complete logical articles projected from `data.ts`; this does not assert a new complete read of unrelated source data.

| File | Physical lines, initial → final | Initial SHA-256 | Final SHA-256 |
| --- | --- | --- | --- |
| fa.json | 248 → 243 | `86f213ad9194096b7cf9030f35af28499bae6efec1ae68d3bb351c32fa3268c4` | `35fcae901d35a62f106aa8b954b30af4129c51cc9b434b1348128250f22007eb` |
| ar.json | 248 → 243 | `3d7ed432a9255dd818296878f1ee7c5493e143c8ae91fd9cead83974f974807a` | `90b4262dc39b93584aa1cd8b70def782a87657d9194d7120c32e6da2c286689c` |
| zh.json | 248 → 243 | `b08e2543b20322b1fbd05fb14447c3b67dbbf9b82110c5c9b937e7af10321679` | `b9e166d9013eb24c78dd472738784aec8bec239eb4e6393f10dc9f190cbcd522` |
| es.json | 248 → 243 | `0e0b54fc83fb0019b8d46f32c37e3281494a1338f25fa4b8f2a8cfdee53332ae` | `418204f4922ce87f1fb4b096993cb7a1b89c85068471d63db1710990fd049e6f` |
| source-revision.json | 9 → 9 | `7adeebe4c7d319b21626b9cd85de7cf1841cedc2ed1b00a397aa36a4bffe8392` | `059ed9ca0228b6ef1821b9bab4331768b854aba169bf872e65a053bda057756e` |

## Semantic review

- **project-simurgh-containment**: Separated current SHA-256 source/member-bound archives from earlier Ed25519 stages; retained positive and null October model results, state-level uncertainty and role-placement failure. Corrected frozen live benign utility 7/10→6/10 and deterministic 949/949 under-attack plus 97/97 benign utility, explicitly without a real LLM. Preserved Linux/Python/full-history/dependency conditions, dated tests/releases, selected earlier-model proof scope, distinct DOI records, current licence and trusted-system/replication caveats.
- **invisible-window-research**: Current neutral title, best-effort compatible-path API scope, Windows forensic/browser distinctions, macOS native versus browser/ScreenCaptureKit distinctions and vendor by-design classifications. Current public Windows/macOS PoC sources and harnesses distinguished from the historical withholding statement; lab/product/Linux and n/p limits retained.
- **nanomatch-deep-dive**: Expected O(1) identifier lookup distinguished from O(log M) cancellation; cancel/re-add modification and time-priority loss explicit. Standalone allocator does not establish an allocation-free matching path. Repository measurements scoped to insertion versus mixed synthetic workload, with host/compiler/raw-run omissions and no audit rerun or new CI result.
- **sentinelflow-deep-dive**: Basic matcher skips threshold-bearing rules; stateful detectors have separate fixed thresholds. Canonical replacement example retained. Repeated 54-byte synthetic parser-only throughput separated from live capture/detection/alerting, test declaration counts separated from a historical pass and a fresh execution.
- **ecrsm-deep-dive**: Perf-buffer rather than ring-buffer; missing runtime attach call and intended rather than proven telemetry path. SSE rather than stale WebSocket wording, limited process/Kubernetes metadata attribution, privileged/hostPID/capabilities deployment and educational-only boundaries explicit. No unverified low-overhead, detection or privacy guarantee.
- **kmp-security**: Shared source does not prove platform parity. Offline judge runs unit checks without blocking network; no claim of monitored zero-network execution. Desktop-JVM engine median excludes camera/UI; F1/test counts remain scoped, repository-reported and not independently reproduced.
- **electron-security**: Current Electron multiprocess boundary and IPC review scope. safeStorage is encrypted application storage backed by available OS protection; local string-reference cleanup is not memory erasure. Multiple cloud/local/offline AI paths, explicit consent, limited redaction and distinct outbound services documented; package versions and residual risks retained.

The SentinelFlow fence intentionally changes from the unsupported threshold-bearing SSH brute-force rule to the canonical simple SSH connection alert. All other six articles' fenced-code lists are byte-identical to the initial English snapshot. The runtime adapter retains the canonical English fences in every localized article. Root English source remained frozen during translation assembly and compared deeply equal to the approved snapshot.

## Verification

- 500 changed/new draft prose values: zero exact per-line numeric, inline-token, URL or Markdown/table mismatches.
- All 768 assembled prose values and metadata numeric contracts checked before writing; seven revision hashes derive from the final English title/tag/takeaway/content contract.
- Existing `localized-pages.test.ts` + `data.test.ts`: **40/40 tests pass** in two files; full adapter evidence, structure and no-fallback assertions run. Parent repaired the old withholding assertion; no other stale expectation surfaced.
- All five JSON files pass Prettier. Owned-path `git diff --check` is clean.
- Logs: [writing-tests.log](writing-tests.log), [writing-format.log](writing-format.log); assembly accounting and canonical code correction: [writing-finalisation.json](writing-finalisation.json).

This lane did not run an integrated build/browser suite or execute upstream projects/benchmarks. Repository-reported and historical evidence is explicitly labelled in the article translations. Independent native-speaker review remains unperformed. Parent owns final integrated build and rendered validation.
