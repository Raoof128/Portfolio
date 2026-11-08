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
| Read-only audits | Running | RR-L1 OS components, RR-L2 app/ui/lib, RR-L3 OS CSS, RR-L4 content, RR-L5 tests/scripts/config, RR-B1 browser matrix + axe + lab performance (all Haiku) |
| Opus checks | Done | npm audit: runtime 0, all 8 moderate (high gate passes). SEO crawl: 162 HTML pages, 160 with canonical/og/6 hreflang, JSON-LD all valid, 190/190 internal hrefs return 200 |
| Prioritisation | Pending | |
| Implementation | Pending | |
| Integration and verification | Pending | |
| Independent review | Pending | |
| Final verdict | Pending | |
