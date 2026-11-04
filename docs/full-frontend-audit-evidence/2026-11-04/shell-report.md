# Shell frontend audit

Fresh full-file review of all 29 scoped files (8556 initial lines), followed by minimal owned fixes in 11 files. Every initial line span, initial/final SHA256, byte count and audit note is in [shell-review.json](shell-review.json). This is a full scoped source review, not a review of only the previous upgrade diff.

## Findings fixed

| ID | Priority | Defect and resulting behavior |
| --- | --- | --- |
| SHELL-01 | P2 | New documents inherited the previous document reading offset during responsive layout change. Native baseline: Simurgh body.scrollTop600 → Resume body.scrollTop0 →390x844 produced window.scrollY543 and Resume h1 top−408.90625. Focused regression received top360 instead of85. Reset document-owned reading offset on path/initial offset change. |
| SHELL-02 | P2 | SSR handover omitted the separate command toolbar from reading-position measurement. Enhanced existing browser-DOM handover fixture with a38px command toolbar. Initial publication was415 rather than453. Bridge now measures bottommost toolbar with titlebar fallback. |
| SHELL-03 | P2 | Explicit appearance was lost on blocked-storage locale remount and masked later cross-tab changes. Native baseline manual light stayed light after dark storage event; blocked-storage manual light became dark on /fa remount. Shared optional store fallback replaces component override. Failed-write/working-read behavior explicitly preserved. |
| SHELL-04 | P2 | Current workspace state changed on modified/native app-link activation. Before fix, Ctrl-click brand removed current logon and app links with target or download reached their click handler already defaultPrevented. Shared ordinary-primary guard preserves target/download and browser modifiers. |
| SHELL-05 | P2 | App-grid Home handling swallowed browser modifiers and composing input. All five Ctrl/Meta/Alt/Shift/composing Home cases were defaultPrevented and moved focus. Guard now leaves native/composition input untouched. |
| SHELL-06 | P3 | Window Controls portal retained a stale copied appearance attribute. Native programmatic theme activation while disclosure stayed open left shell light / panel data-appearance dark. Removed unnecessary copied attribute because portal is a child of themed shell. This capture proves stale theme metadata, not a contrast failure (sampled panel background remained white by design). |

The Aero shell, prior Research Highlights and direct research/résumé/contact entry, five locales, canonical 7.css, single route-backed window, opaque reading surfaces and static-export architecture remain intact. No CSS, dependency, configuration or public asset was changed in this lane.

## Verification

- All 13scoped test files:212/212 pass, [shell-tests-final.txt](shell-tests-final.txt). Two existing jsdom document-navigation notices are retained in the log.
- Targeted ESLint and Prettier checks on all 11changed owned source/test files exit0: [lint](shell-eslint.txt), [format](shell-format.txt).
- Before-fix failures retained: [six behavioral regressions](shell-regressions-before.txt), [five modified/composing Home cases](shell-desktop-before.txt), [two-row chrome handover](shell-bridge-before.txt).
- Native baseline evidence: [theme](shell-baseline-probe.json), [portal theme metadata](shell-portal-baseline.json), [actual document replacement then phone resize](shell-reading-baseline.json). These captured pre-fix export behavior.

## Scope and limits

Reviewed lifecycles, subscriptions and cleanup; focus through lock/unlock/search/minimize/restore/close; native and modified link activation; route replacement and stale clipboard/exit work; finite geometry, pointer cancellation, keyboard/non-drag alternatives, reduced motion, SSR handover and no-JavaScript route links. Unchanged files retain their exact initial SHA256 and full-file review notes.

Integrated candidate build/native browser verification and the exact final export identity are owned by the parent and baseline reviewer. Their maintained full-audit browser case covers the actual Simurgh 600 → Resume 0 → phone resize scenario, cross-tab and blocked-storage locale theme behavior, and live portal inheritance. No candidate-browser, physical-device, software-keyboard or assistive-technology certification is inferred from these focused source tests.

A separately confirmed Contact viewport-shrink focus issue was sent to opening_tests for a scoped SecureContactForm fix. No duplicate shell hook was added. Parent owns root protocol postflight logs and global check evidence.

## Final no-JavaScript Contact correction

The compiled native fallback exposed the form but hid its submit through the shell’s blanket no-script button rule. The shell now excludes only the native Contact submit while hiding JS-only chrome. A real SSR Contact integration regression checks mailto POST/text/plain, native required/email validation and fallback selectors; it failed before the fix and the complete ResearchOS test file passes73/73 afterwards. Focused lint/format pass. A browser check substituting only the candidate selector into the baseline response confirms visible submit, native Name focus on empty submission and hidden JS-only controls; this is explicitly not final-export proof. The parent owns the rebuilt native test.
