# Content, i18n and data review — 3 November 2026 (Australia/Sydney)

Baseline: `2b6d048c42c7feb7ef82e38f5ca519603d40afc6`. All assigned `src/i18n/**`, `src/lib/**` and `src/test/setup.ts` files examined in entirety, plus the new Go verification helper. Sequential large-file reads were completed; truncated Persian reads were followed by the omitted ranges. See SHA256 ledger `/tmp/frontend-content-coverage.json`. Structural review of translations does not imply native-speaker editorial certification. Research evidence was preserved and not independently re-executed.

## C-LAB-01 — Medium/P2 — published Go example reports success on failure (fixed)

- Route/component: `/lab/003` and all locale equivalents, source-code display.
- Source: `src/lib/data.ts`, original lines 1510–1554; final lines 1510–1584.
- Observed: a 2×2 PNG is too small for the 14-byte HIDDEN_MESSAGE plus 4-byte length prefix. `embed` modifies some pixels, returns an error ignored by main, which writes an incomplete PNG and prints `Done — payload embedded into stego.png`. Missing/invalid source and output I/O errors are ignored too.
- Expected: reject capacity before mutation; propagate open/decode/embed/create/encode/close failures; print success only after a completed PNG output.
- Reproduction: compile exact Go codeSnippet. Run with a 2×2 `cover.png`. Baseline two tests fail: nonmutation and nonzero CLI exit.
- Root cause: capacity tested after writing; errors discarded with `_`.
- Correction: preflight capacity and 32-bit prefix limit; `run() error` checks each operation; main prints stderr and exits nonzero on failure. All languages continue receiving the same original executable sample through the existing adapter.
- Verification: `PORTFOLIO_GO_BINARY=/tmp/frontend-go-toolchain/go/bin/go node --test scripts/lib/lab-go-snippet.test.mjs` passes one Node wrapper containing four Go tests and four invalid-input subcases. Covers exact capacity, nonzero image origin, decoded byte parity, failure nonmutation, missing/invalid/tiny PNGs and unwritable output.
- Evidence: `/tmp/frontend-lab-red.log`, `/tmp/frontend-lab-green.log`. Go 1.27.3 downloaded from official go.dev; archive SHA256 matched official metadata. No Go dependency added to the app or npm workflow; explicit optional helper skips honestly when a Go compiler is absent.

## C-TYPE-01 — Low/P3 — body fallback stack diverges from Win7 title stack (fixed)

- Source: `src/i18n/index.ts:14,36`.
- Observed: en/es put system-ui and Apple typography ahead of Segoe UI, so an installed Segoe UI is bypassed on some platforms.
- Expected: installed Segoe UI is preferred, with legal system fallback; preserve Persian, Arabic and Chinese stacks.
- Correction: prefer `"Segoe UI", Tahoma` before existing system fallbacks for English/Spanish, coordinated with style lane tokens.
- Verification: complete changed-source re-review; 197 content/i18n tests pass after sample correction (14 files; Vitest 4.1.12; 12.05 seconds). Rendering/font availability on Linux cannot certify Windows glyph rasterisation.

## C-CLAIM-01 — Medium/P2 owner evidence required — Zurvan privacy scope

- Source: `src/lib/data.ts:268,282`, mirrored in four project overlays.
- Observable source tension: stack lists OpenAI/Anthropic/Mock LLM providers while security copy states document content is never sent to cloud services.
- Need: inspect actual private Zurvan provider configuration and extraction/egress boundary before changing the claim. Cloud provider options alone do not prove documents leave the device, so this is an unresolved claim-verification risk, not a confirmed false statement.
- Action: authored claim preserved; root report should qualify external-review readiness accordingly.

## C-CLAIM-02 — Medium/P2 owner evidence required — Aion general guarantee

- Source: `src/lib/data.ts:901`, mirrored in four project overlays.
- Observable text: Hybrid RAG 'ensures answers ... not hallucinated', while bundled paper description gives finite 40-question pilot results with zero unsupported citations.
- Need: qualify scope with owner research review; retrieval does not itself establish a universal absence of hallucination. Existing numeric results and authored claims preserved, no unapproved benchmark invention.

## Positive evidence

- Locale boundary lookup rejects inherited property strings; translated dossier and write-up omissions fail closed.
- Five complete language inventories and stable source-code/publication identity paths retained.
- Search is literal, normalises Arabic/Persian keyboard variants, ranks title matches, and retains original-title aliases for translated prose.
- JSON-LD serializer escapes `<`; public index ships compact summaries, not all locale narratives.
- Original DOI titles/PDFs remain English and are labelled accordingly; temporary windows do not retain all translated data on the client.
- Dates are UTC stable, Persian calendar/Arabic numeral display is intentional, identifiers and source snippets retain original text.

## Dependency change second review

Reviewed root package.json diff and machine-compared lock entries against baseline: matching Next+eslint-config-next move 16.3.8→16.4.4, matching Vitest+coverage move 4.1.11→4.1.12, Playwright/axe added. React and 7.css unchanged. Private local guard resolution/integrity unchanged. Lock refresh also includes @typescript-eslint family, nested minimatch/brace-expansion, zod, eslint-plugin-react-hooks and related utility updates; do not describe this as only four lock entry changes. Runtime compatibility needs root build/browser/test evidence.
