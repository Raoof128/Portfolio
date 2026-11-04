# Project surface consistency audit

Read-only review of all 13 existing projects across 5 locales, before the canonical live-source update. No product edits or full browser-suite rerun. `surfaces-review.json` records exact hashes, read spans and every project; `surfaces-structural-evidence.json` retains the checked source data.

All 65 project copies have nonblank narrative/array fields and matching source array lengths. Explicit project and artwork inventories both contain the same 13 slugs. All 5 research PDF assets exist and retain recorded hashes. All 7 write-ups have4 nonblank locale overlays and matching source revision hashes. Paper titles/DOIs/paths remain source identities across locales.

- **SURF-01 (P2, project-zurvan)**: Persian/Spanish full descriptions strengthen no cloud lock-in to no cloud dependence, while the source and the same dossier limits allow configured OpenAI/Anthropic extraction. Evidence: `src/lib/project-content/fa.ts:128`, `src/lib/project-content/es.ts:128`, `src/lib/data.ts:295`. Translate vendor lock-in/local storage precisely and retain the external-provider caveat; do not promise offline extraction.
- **SURF-02 (P2, nanomatch)**: Dossier correctly qualifies hash lookup/cancellation as expected O(1); article takeaway, direct-lookup paragraph and unordered_map table omit the expected/average-case qualifier in English and all four translations. Machine corpus/search inherit the article takeaway. Evidence: `src/lib/data.ts:635`, `src/lib/data.ts:1157`, `src/lib/data.ts:1167`, `src/lib/data.ts:1175`. Use expected/average hash complexity consistently; keep list erase and free-list operations distinct from hash worst-case behavior.
- **SURF-03 (P2, gitswitch)**: Security article states Gemini is the only outbound egress, despite the same article discussing GitHub tokens and the product being a remote Git client. This exclusivity is absent from the dossier and needs checking against pinned Git/GitHub integration. Evidence: `src/lib/data.ts:1396`. Remove exclusivity or enumerate actual Git/GitHub/provider egress after source-owner verification; do not assert network isolation from token storage controls.
- **SURF-04 (P2, ecrsm)**: Dossier proof names perf-buffer transport; article data path says ring buffer twice. These can mean different BPF transports, so source should decide which description is current. Evidence: `src/lib/data.ts:769`, `src/lib/data.ts:1306`, `src/lib/data.ts:1307`. Use the actual pinned transport consistently, or explain separate stages if both are used. Do not infer a runtime benchmark from the terminology.
- **SURF-05 (P3, project-simurgh)**: Header and machine prose distinguish current software DOI21737792 from older paper20374849, but the SoftwareSourceCode JSON-LD node has no identifier/sameAs for links.doi; only older ScholarlyArticle DOI nodes are modeled. Evidence: `src/app/[locale]/projects/[slug]/page.tsx:134`, `src/app/[locale]/projects/[slug]/page.tsx:143`. If extending machine identity, add the software DOI as the software entity identifier/sameAs without recasting it as a ScholarlyArticle or changing original paper dates.

| Project | Locale copies | Diagram / Atlas | Related article | Findings |
|---|---:|---|---|---|
| invisible-window-research |5| Dedicated schematic + Atlas | invisible-window-research | No internal surface disagreement identified |
| project-simurgh |5| Dedicated schematic + Atlas | project-simurgh-containment | SURF-05 |
| project-zurvan |5| Dedicated schematic + Atlas | No dedicated article | SURF-01 |
| gitswitch |5| Localized stack + artwork | electron-security | SURF-03 |
| mehr-guard |5| Localized stack + artwork | kmp-security | No internal surface disagreement identified |
| syllabus-sync |5| Localized stack + artwork | No dedicated article | No internal surface disagreement identified |
| divan-open-day |5| Localized stack + artwork | No dedicated article | No internal surface disagreement identified |
| nexus-archive |5| Localized stack + artwork | No dedicated article | No internal surface disagreement identified |
| nanomatch |5| Localized stack + artwork | nanomatch-deep-dive | SURF-02 |
| sentinelflow |5| Localized stack + artwork | sentinelflow-deep-dive | No internal surface disagreement identified |
| ecrsm |5| Localized stack + artwork | ecrsm-deep-dive | SURF-04 |
| simurghforge |5| Localized stack + artwork | No dedicated article | No internal surface disagreement identified |
| aion |5| Localized stack + artwork | No dedicated article | No internal surface disagreement identified |

Explorer, Search and SEO consume the localized canonical adapters; project/card counts are derived. The three-project Atlas is intentionally selected research, not an incomplete13-project index. Its current Simurgh positive/null summary and frozen architecture qualifier are explicit in all 5 languages. The older paper identities remain distinct from the software DOI. SentinelSSH remains supporting work without a new route.

Source-owner proposals have already identified factual currency changes (including public Zurvan access, dated mixed test outcomes, image-ingestion limits, public Invisible Window PoCs, Aion provider/key scope, and Mehr Guard benchmark/offline limits). Those are authoritative-source work, not additional verification performed by this surface lane. Canonical changes must be propagated without flattening failed/skipped/open receipts into all-pass claims. No claim of fresh browser behavior or native-speaker review is made here.

The next authorized step is localization in only the four project overlays after root sends the canonical data freeze.
