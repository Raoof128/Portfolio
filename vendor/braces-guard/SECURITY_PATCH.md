# ResearchOS local braces guard fork

This MIT-licensed fork is based on Jon Schlinkert and contributors' `braces` 3.0.3. The original LICENSE and package metadata are retained in LICENSE and UPSTREAM_PACKAGE.json. Exact upstream commit, npm integrity and baseline source hashes are in PROVENANCE.json.

GHSA-vfj7-8cjw-p6xm / CVE-2026-93687 is still listed against upstream <=3.0.3 with no official patched release. This is a private, locally reviewed code remedy. A successful registry audit after replacing the dependency identity does not assess or certify this fork's code.

## Guard behavior

- Parser brace and parenthesis pushes, direct child AST traversal, internal nested arrays, and the actual expand parent walks are capped at depth 128. Active-path sets reject cycles while allowing shared acyclic subtrees and ordinary child-to-parent metadata.
- Each AST/array traversal permits at most 20,000 visited occurrences. Sharing does not evade the work cap. Array wrapper levels and occurrences count, so some arrays approach the traversal cap before exactly 20,000 leaves.
- Unsupported nonprimitive AST value/ranges/commas and numeric step/rangeLimit fields are rejected before native coercion. Legitimate primitive numeric strings and the original callback behavior remain. Arbitrary executable getters, proxies and transform functions are outside the threat model.
- Numeric range endpoints must be safe integers. Enumerated ranges (including stepped regex compilation) are capped at 20,000 outputs before fill-range runs. Padded enumerated range text is conservatively bounded before fill-range materializes or joins it. Efficient step-one regex compilation of a large safe range is preserved.
- Cartesian expansion and top-level input arrays are capped before results are inserted and before noempty/nodupes filtering. Every produced collection is limited to 1,048,576 UTF-16 code units across strings, including duplicate strings and shared ropes. This bounds composed literal-prefix expansion before Set hashing can materialize a large payload. It is a code-unit ceiling, not a byte or RSS limit.
- The original 10,000-code-unit parser input ceiling remains a hard bound when maxLength is NaN.

These are intentional finite tooling-input ceilings: rangeLimit:false cannot disable them. They are not unrestricted upstream API equivalence. Deep legitimate structures, unsafe numeric endpoints and oversized results are rejected. This does not sandbox callbacks, prove general regular-expression complexity bounds, or cap all allocations made by callers or other packages.

## Error handling

Guard failures are ordinary catchable errors. Recursive depth, cycles, visits, ranges and output limits use RangeError with ERR_BRACES_DEPTH, ERR_BRACES_CYCLE, ERR_BRACES_VISITS, ERR_BRACES_RANGE or ERR_BRACES_OUTPUT. Unsupported coercion fields use TypeError with ERR_BRACES_AST_FIELD or ERR_BRACES_OPTION. Existing syntax/range errors retain their normal types; the fixed input ceiling raises the upstream SyntaxError.

## Local package adoption

Use the checked-in readable source and matching npm tarball. A direct private scoped file: devDependency plus an npm $ reference override replaces transitive braces without changing the framework/linter versions. Verify source/tarball/installed-module parity, clean npm ci and the actual Next ESLint rule chain. Do not publish this private package or present it as an official braces version.

No vulnerable baseline is exercised during project CI: baseline failure demonstrations are preserved only in external bounded-process evidence. Durable tests exercise the installed guarded module, provenance, positive behavior and bounded hostile inputs.
