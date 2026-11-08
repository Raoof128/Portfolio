# Reviewer-readiness progress ledger

Resume from this file and `git log` after any context compaction.

## Identity

- Base: `263a0e5` on `claude/dazzling-feynman-cp1q08` (clean). Production serves `38842e2` (built 2026-11-04T07:53:46Z), so it contains none of the round-3 or round-4 changes.
- Baseline export: built 2026-11-08T21:05:12Z from `263a0e5`; served with Wrangler 4.158.0 (Pages semantics) at 127.0.0.1:4398.
- Toolchain: Node 22.23.4, npm 10.9.9, Next 16.4.4, React 19.2.3, 7.css 0.21.1, Playwright 1.64.1, Chromium 153.0.8010.12. Firefox and WebKit are not installed, and installing them is forbidden here.

## Owner decisions preserved

- Arrow-only lock screen at `/`, with the full 3-second wait (handover of 4 Nov 2026). Direct document routes stay immediately readable.
- Australian English applies to English UI copy only. Original research PDFs stay byte-identical.

## Stage log

| Stage | Status | Notes |
| --- | --- | --- |
| Baseline | Done | Repo clean; production identity recorded; lanes sized (247 files) |
| Read-only audits | Done | RR-L1–L5: 253 files / 61,169 lines read completely; RR-B1: 140 loads, axe, lab perf (all Haiku) |
| Opus checks | Done | npm audit: runtime 0, all 8 moderate (high gate passes). SEO crawl: 162 HTML pages, 160 with canonical/og/6 hreflang, JSON-LD all valid, 190/190 internal hrefs return 200 |
| Prioritisation | Done | Opus re-verified each candidate; 6 worker claims disproved (see findings) |
| Implementation | Done | RR-I1 `7c43d0a`/`1351966`, RR-I3 `4f225d4`, RR-I4 `fbb74c4`, RR-I2 `67c2048`; Opus `9f2a8cf`, `52503cf` |
| Integration and verification | Done | Export `fe987e9` (22:00:37Z): all gates green, Playwright 76/76 |
| Independent review | Done | RR-Q1: no regressions; heading off-screen 24 → 0 |
| Final verdict | Done | CONDITIONAL PASS ([final-verdict.md](final-verdict.md)); not deployed |
