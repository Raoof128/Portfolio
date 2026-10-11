# Dependency security maintenance

The private `@researchos/braces-guard` 0.1.0 V4 package is installed in the development graph. Ordinary Node 22 clean installation, three installed dependency tests and the complete portfolio integration quality pipeline pass; full/runtime registry audits report zero advisories. Independent source/archive/installed consumer checks are separate from audit identity. Preserve the earlier build 10 audit, prototype and npm resolution failures as historical evidence. Final frozen export/native evidence is recorded in the handoff report.

## Origin and scope

This local CommonJS fork derives from Jon Schlinkert and contributors’ MIT-licensed `braces` 3.0.3. Keep its original LICENSE, `UPSTREAM_PACKAGE.json` and readable source. `PROVENANCE.json` records upstream commit `74b2db2938fad48a2ea54a9c8bf27a37a62c350d`, tree `29d2dbb8468c07fdd6a16fa542caca1bdc0c47ee`, npm integrity and baseline file hashes. This is a private local remedy for GHSA-vfj7-8cjw-p6xm/CVE-2026-93687, not an official upstream release; do not publish it to the registry.

The candidate imposes fixed tooling-input ceilings:

- Structural depth 128; 20,000 traversed occurrences and produced results. Shared children count repeatedly; child/array/actual parent-walk cycles fail while ordinary AST parent metadata remains valid.
- Aggregate produced strings: 1,048,576 UTF-16 code units, including duplicates before filtering. This is neither a byte nor an RSS bound.
- Safe-integer numeric endpoints; excessive enumerated ranges and oversized padded output are rejected before range allocation. V4 conservatively estimates padded strings and regex separators before `fill-range` runs. Efficient step-one regex compilation of large safe ranges remains supported.

`rangeLimit:false` cannot remove these limits. Excessive inputs raise coded, catchable errors. Arbitrary callbacks, getters/proxies, general regex complexity and allocations outside the guarded package remain outside this assurance. The historical compatibility corpus recorded 11,860 ordinary behavior checks and 764 upstream tests; those counts are not final installed-fork assurance.

## Installation and verification

Keep `vendor/braces-guard/`, the matching `vendor/researchos-braces-guard-0.1.0.tgz` and `vendor/braces-guard-release.json`. The final V4 archive contains exactly 14 distributable source/attribution files; exclude historical packing evidence from the parity inventory. Use root devDependency `@researchos/braces-guard: "file:vendor/researchos-braces-guard-0.1.0.tgz"` and override `braces: "$@researchos/braces-guard"`, preserving the existing Next/ESLint versions and other overrides. [npm override behavior](https://docs.npmjs.com/cli/v10/configuring-npm/package-json/#overrides).

Use ordinary `npm ci`. Require the lock’s relative local tarball path and real SHA512 integrity to match the archive. Verify source→archive→installed-file parity, the declared private identity and absence of an unguarded nested braces copy. No install-time patching, symlink workaround, hand-edited integrity or graph-changing install flags. [Clean installation](https://docs.npmjs.com/cli/v10/commands/npm-ci/), [lock integrity](https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json/).

The durable dependency-security gate must exercise the installed Next ESLint chain: `@next/eslint-plugin-next → fast-glob → micromatch → braces`. Run the real `no-html-link-for-pages` rule with normal brace rootDir patterns and bounded hostile inputs; direct `makeRe` is insufficient because it delegates to picomatch. Keep all existing lint, typecheck, application/schema tests, build, export audit and runtime audit gates. Lint vendor source as Node/CommonJS with standard JavaScript rules; do not globally ignore it or suppress lint failures. Hostile regressions use finite worker deadlines, memory and output caps.

Registry audit results and code assurance are separate. npm’s advisory lookup uses package names/versions; a green audit under a new scope does not certify the patch. Retain the old five-high development-path result, fresh audit JSON and independent source/guard/consumer evidence without relabeling any historical result. [Audit matching](https://docs.npmjs.com/cli/v10/commands/npm-audit/#bulk-advisory-endpoint).

## Update or remove the fork

1. Change readable source and meaningful regressions together. Preserve attribution, origin and intentional compatibility limits; bump the private version for a new patch.
2. Pack that reviewed source into the checked-in tarball, regenerate the lock with npm, then verify archive integrity, source parity and actual transitive resolution. Installation consumes committed bytes; it does not repack them.
3. Run clean `npm ci`, the independent security/Next-consumer tests and the complete existing quality pipeline. Record the exact new source/export identity and audit disposition. Exclude vendor text from Tailwind class scanning separately; verify compiled output instead of assuming prior screenshot or asset identity.
4. Remove the fork only after an official applicable fix passes the same boundary, compatibility, actual Next-consumer, clean-install and application checks. Remove the vendor source, tarball and override together; preserve their historical evidence.

## Lock migration and tooling lifecycle

Updating the old lock directly made npm resolve the relative override inside micromatch. A fresh full install worked but floated unrelated versions, so that graph was rejected. The adopted migration seeds only the two exact npm-generated local package entries and root development metadata into the old graph, then runs ordinary npm lock normalization and default clean `npm ci`. No SRI was invented or changed; every old unrelated package entry is identical. npm adds six optional bundled WASI dependency records.

ESLint 9 is now outside upstream support. Its pinned Next configuration also has plugins whose peers exclude ESLint 10; forcing a major-only upgrade is not supported. A future coordinated tooling upgrade must verify peers, effective rules and the same quality gates. This lifecycle limitation is distinct from the remediated braces finding. [Official version support](https://eslint.org/version-support/).
