# Local security hardening

ResearchOS is a static portfolio. The welcome screen is a presentation control;
it does not authenticate visitors. Contact opens an email draft. This review
covers authored routes, client rendering, public export files and CI delivery.

## Checks to run

Use the pinned Node version in `.nvmrc`, then run these checks sequentially to
keep memory use low:

```sh
npm run test:audit-http
npm run test:security
npm run test:ci
npm run build
npm run audit:security
npm run audit:agents
```

The static security audit defaults to `out`. To verify an artifact after
transferring it, run `node scripts/audit-static-security.mjs /path/to/export`.
The verifier requires only Node built-ins and the two accompanying files in
`scripts/lib`; no dependency installation is necessary.

## Enforced boundaries

- English aliases use known section prefixes. An unknown `/en` root alias
  falls through to 404. Supported aliases retain their query strings, while
  RSC payload rewrites and other languages remain available. The framework
  proxy assigns a pathname on a cloned URL, preserving its original origin.
- Before upload and after download, the static artifact must contain both
  security contact files with matching fields and the required machine/public
  files. The two files may have different explanatory comments.
  Unexpected hidden entries, symlinks, source maps, private source types and
  unapproved public extensions fail the gate. Only `.well-known/security.txt`
  is allowed in the hidden disclosure directory.
  Approved public asset names and generated route/static namespaces also keep
  source/private folders and hosting controls such as `_worker.js` out of the
  export. Adding an authored public asset requires updating this allowlist.
- Upload includes hidden files explicitly. This is safe only together with
  the inventory gate, which rejects unexpected hidden content. A missing
  artifact fails the upload step.
- The header checker validates the complete approved CSP, HSTS and denied
  browser permissions, including duplicate/override directives. Event handler
  attributes, frames, workers and base URL changes are denied. Specific route
  rules cannot remove or override a protected global header. The public
  policy remains suitable for the static Next bootstrap and existing analytics.
- Markdown links accept HTTP(S), single-root relative paths and fragments.
  Other destinations render as ordinary text. External links use a separate
  context with `noopener noreferrer`; authored article content remains trusted.
- CI actions use official immutable commit references, checkout does not retain
  credentials, and Wrangler has an explicit version. Build checks run without
  the Cloudflare token. The deploy job verifies downloaded files before the
  deployment action receives credentials, and production remains main-only.
- Disclosure instructions point to the real canonical contact and do not
  promise a public encryption key that the site does not provide.
  Receiving verification also checks the approved contact and canonical URL
  plus the expiry, rather than relying only on two matching files.

## Limits

Inline script blocks and style attributes remain permitted for this static
application. CSP therefore supplements input validation and escaped rendering;
it does not prove immunity to HTML or script injection. Action and CLI pinning
reduce moving-version risk but do not certify dependency source or every
transitive dependency. The export inventory is an allowlist, not a universal
secret detector or a document privacy certification.

Local redirect reproduction is not proof of production exploitation. Optional
Cloudflare URL normalization can change how repeated slashes/backslashes reach
redirect rules. Remote CI artifact delivery, actual edge behavior, production
headers and deployment have not been executed by this local hardening pass.
No public service or external redirect destination is probed by the local
adversarial checks.

## Primary references

- [Cloudflare Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Cloudflare URL normalization](https://developers.cloudflare.com/rules/normalization/how-it-works/)
- [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)
- [Upload artifact hidden file behavior](https://github.com/actions/upload-artifact)
- [CSP script handler attributes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src-attr)

The dated standalone security validation report retains reproduction evidence,
the exact candidate diff, check logs and the source/export identities outside
Git. Older frontend and backend evidence keeps its original build identity.
