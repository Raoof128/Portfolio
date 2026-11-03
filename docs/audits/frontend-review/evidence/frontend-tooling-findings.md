# Tooling / configuration review

Complete static review of 19 files / 2,761 current source lines: validation scripts and helpers/tests, CI and deployment workflows, Next/TypeScript/ESLint/Vitest/PostCSS configuration. Exact final hashes and reviewed ranges in `frontend-tooling-coverage.json`. No implementation change made in this lane. Browser regression scripts remain root-owned.

- Static export remains conditional on production, bounded to one static-generation worker; images are intentionally unoptimised for static-host compatibility.
- Browser policy and disclosure audits compare against fixed approved expectations, reject duplicate overrides, unsafe redirect authorities/splats, nonregular artifact entries, symlinks and unexpected source/private/public namespaces. The artifact gate bounds traversal and inspects both disclosure copies.
- HTTP audit primitives have finite header/body deadlines, bounded decoded payloads, controlled redirects, accurate loopback preview handling and no unsolicited production request during preview checks. Tests exercise failures rather than merely matching implementation structure.
- Full RSC payload resolution is checked against actual first-match static-host rules for all sitemap routes; sitemap/rendered-page inventory, canonical/OG/schema/language parity and global 404 fallbacks are checked.
- CI/deployment action revisions are pinned. Build job has no deployment secrets, deploy job does not install/build application code and revalidates transferred artifacts before receiving the token in the deployment action. The published Pages target remains explicitly gated to main.
- Custom braces guard tests establish archive/source/installed parity and exercise a real Next ESLint consumer with bounded hostile-input subprocesses. Registry audit identity remains distinct from private-source assurance.
- Lens map generator is bounded and emits an explicitly sized/checksummed PNG. It is not rerun by the audit lane because no visual asset regeneration is justified.
- Root must report actual audit advisory failures rather than interpreting green source checks as a clean dependency graph. No automatic npm audit fix or check weakening is appropriate.

Limits: this is source/config review, not remote CI execution, Cloudflare account verification, or proof of deployed bytes. No dependency advisory exploitability has been established by these reads.
