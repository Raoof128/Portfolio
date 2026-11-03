# Element and state coverage

Final artifact `UD_vNX6v9YqmgrvZLWuY7`, built `2026-11-03T09:25:26.070Z`. The live snapshot census observes **568 rendered interactive instances across 15 English/light route-state scenes**. Repeated shell controls are counted repeatedly; this is not a unique-control count. [Exact census](evidence/element-census.json).

The census checks geometry, native content visibility, CSS visibility/opacity, hidden/inert/aria-hidden subtrees and closed `details`, retaining its summary. Off-viewport members are labelled rather than treated as unreachable. It does not prove occlusion, pointer hit testing, accessible names, action success or every component state. `nameHint` is descriptive source text, not screen-reader output.

The pair harness exercises **134 component/state pairs across 38 actual specimens**. It deliberately distinguishes sampled family styling from every literal member, and synthetic supported CSS states from runtime application states. [Measurements](evidence/parity-measurements.json).

| Observed family | Repeated instances | Evidence interpretation |
| --- | ---: | --- |
| Application resize grip | 13 | No 7.css window-manager widget; actual pointer/keyboard/tooltip tests |
| Application window/desktop control | 14 | Shared chrome or application action; specific runtime checks, not all literal members individually paired |
| Atlas selectors | 3 | Direct selected/unselected pairs; desktop layout/reading font remain extensions |
| Contact copy-address | 2 | Direct default/hover/pressed/focus pairs; clipboard status separate |
| Contact submit | 2 | Direct default/hover/pressed/focus pairs; handoff state is application behaviour |
| Contact text fields | 6 | Direct textbox/email/textarea/invalid pairs; validation runtime separate |
| Desktop/taskbar/tray controls | 117 | Windows 7 extension without a complete 7.css counterpart; runtime/state checks separate |
| Dossier tabs | 6 | Tabstrip default/hover/pressed/focus pairs and runtime keyboard checks |
| Evidence platform selectors | 2 | Direct selected/unselected pairs; runtime content switch separate |
| Geometry commands | 10 | Step-button representative paired; footer layout/action checks separate |
| Instant search fields | 8 | Project/Write-ups/global search individually paired; query/navigation runtime separate |
| Language disclosure/navigation | 19 | Desktop extension; open/keyboard/hit-test/palette checks separate |
| Move/resize disclosure | 13 | Direct paired command face; native details semantics and real Tab exit |
| Native caption commands | 45 | Direct paired variants; real window journeys separate |
| Native dropdowns | 8 | Project/Write-ups/404 variants individually paired; OS popup pixels unverified |
| Research/navigation links | 212 | Semantic content links; no invented button/listbox/tree counterpart |
| Shared semantic action adapter | 45 | Document/contact/404 representatives paired; every literal instance not individually compared |
| Simurgh diagram stations | 4 | Direct native-button comparison; authored diagram composition retained |
| Start search navigation/scopes | 13 | Application extension; native input paired, scope/result actions separately exercised |
| Window Back action | 13 | Shared command face; navigation separately exercised |
| Window Copy Link command | 13 | Direct paired default/hover/pressed/focus/disabled face |

## State applicability

| State | What the evidence proves |
| --- | --- |
| Default/hover/pressed/focus | Actual browser pointer/keyboard actions with CSS-state sentinels; focus also checks `document.activeElement`. State capture is styling evidence; scripts are removed from paired specimens. |
| Disabled | Native button/input/select/textarea styling is sampled synthetically where supported. This does not invent a disabled visitor workflow. |
| Inactive/restore | Canonical window classes/glyph variants are sampled synthetically; real window-manager behaviour is covered separately by native journeys. |
| Selected/unselected | Actual captured `aria-pressed`/`aria-selected` values identify evidence/Atlas/station/tab samples. Persistent selected paint is compared with a declared canonical active-button reference; application selection semantics remain. |
| Invalid | Actual failed contact validation is frozen as a route scene; native field paint is compared separately from authored error text. |
| Open/closed/expanded/collapsed | Open controls/language/search scenes are frozen; runtime dismissal, focus return, disclosure and tab behaviour are separate tests. |
| Scrolled | Actual scrollTop=100 is asserted. Scrollbar-only Chromium omits the headless hide-scrollbars flag; measured-thumb hover and held paint transitions are verified. These native pixels are Chromium-specific. |
| Loading/success/failure | Contact/clipboard statuses and window transitions are application behaviour, not invented canonical widget states. Unit/native checks retain their own scope and build identity. |

## Canonical catalogue boundaries

The mapped live canonical families are windows/title bars/captions, ordinary/default buttons and semantic adapters, text/email/textarea fields, instant search, single selects, tabs, fieldset/legend group boxes, table/list-view paint and scrollbars. Native disclosure semantics and plain status/navigation text remain semantic equivalents rather than fake ARIA menu/listbox widgets.

No mounted native checkbox/radio, editable combobox, range slider, ARIA listbox, classic menubar, filesystem tree, determinate progress bar or canonical bitmap spinner was found in the reviewed mounted source/scenes. Those are **not applicable**, not passing states. The balloon-with-tail demo is not mounted; native title hints and the resize label are separate browser/application tooltips.

Desktop/taskbar/Start/welcome, original wallpaper, research diagrams and authored content have no complete official 7.css counterpart. Their embedded native controls are compared where applicable; their full layouts cannot receive an invented exact-pixel parity score. The Atlas and Simurgh controls are explicitly measured rather than disappearing behind the diagram classification.

This ledger accounts for observed families and preserves the remaining limits. It does not certify every literal control/state across all 160 routes, all locales, engines, devices and assistive technology. The broader route, responsive and native-browser tests are reported in [verification](tests.md).
