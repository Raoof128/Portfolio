/** Additional specimens point to actual mounted controls. Static content has only meaningful states. */
const fieldStates = ["default", "hover", "focus", "disabled"];
const buttonStates = ["default", "hover", "pressed", "focus"];
export const round2Specimens = [
  {
    "id": "atlas-toggle",
    "page": "desktop",
    "candidate": ".proof-atlas--desktop .proof-atlas-option[aria-pressed=\"false\"]",
    "reference": ".specimen",
    "markup": "<button class=\"specimen\"></button>",
    "states": buttonStates,
    "matchContent": true,
    "canonicalFamily": "button; desktop map layout and larger label are extensions"
  },
  {
    "id": "atlas-toggle-selected",
    "page": "desktop",
    "candidate": ".proof-atlas--desktop .proof-atlas-option[aria-pressed=\"true\"]",
    "reference": ".specimen",
    "markup": "<button class=\"specimen active\"></button>",
    "states": [
      "default",
      "focus"
    ],
    "matchContent": true,
    "canonicalFamily": "selected button compared with canonical active face"
  },
  {
    "id": "simurgh-station",
    "page": "project-detail",
    "candidate": ".os-simurgh-instrument-control[aria-pressed=\"false\"]",
    "reference": ".specimen",
    "markup": "<button class=\"specimen\"></button>",
    "states": buttonStates,
    "matchContent": true,
    "canonicalFamily": "native button reference; authored diagram-station composition is an extension"
  },
  {
    "id": "simurgh-station-selected",
    "page": "project-detail",
    "candidate": ".os-simurgh-instrument-control[aria-pressed=\"true\"]",
    "reference": ".specimen",
    "markup": "<button class=\"specimen active\"></button>",
    "states": [
      "default",
      "focus"
    ],
    "matchContent": true,
    "canonicalFamily": "native active button reference; selected diagram-station composition is an extension"
  },
  {
    "id": "contact-submit",
    "page": "contact",
    "candidate": ".os-secure-form button[type=\"submit\"]",
    "reference": ".specimen",
    "markup": "<button class=\"specimen default\"></button>",
    "states": buttonStates,
    "matchContent": true,
    "canonicalFamily": "default button; mail-client handoff is a separately tested application state"
  },
  {
    "id": "contact-copy-address",
    "page": "contact",
    "candidate": ".os-secure-copy button",
    "reference": ".specimen",
    "markup": "<button class=\"specimen\"></button>",
    "states": buttonStates,
    "matchContent": true,
    "canonicalFamily": "button; copied/failed feedback is a separately tested application state"
  },
  {
    "id": "contact-email",
    "page": "contact",
    "candidate": "#contact-email",
    "reference": ".specimen",
    "markup": "<input class=\"specimen\" type=\"email\" placeholder=\"you@example.com\">",
    "states": fieldStates,
    "width": 320,
    "matchPlaceholder": true,
    "canonicalFamily": "textbox"
  },
  {
    "id": "contact-textarea",
    "page": "contact",
    "candidate": "#contact-message",
    "reference": ".specimen",
    "markup": "<textarea class=\"specimen\" rows=\"4\" placeholder=\"Your message...\"></textarea>",
    "states": fieldStates,
    "width": 320,
    "matchPlaceholder": true,
    "canonicalFamily": "textbox"
  },
  {
    "id": "contact-invalid",
    "page": "contact-invalid",
    "candidate": "#contact-name",
    "reference": ".specimen",
    "markup": "<input class=\"specimen\" type=\"text\" required aria-invalid=\"true\" placeholder=\"Your name\">",
    "states": [
      "default",
      "focus"
    ],
    "width": 320,
    "matchPlaceholder": true,
    "canonicalFamily": "textbox; authored error feedback has no distinct canonical face"
  },
  {
    "id": "writeups-search",
    "page": "writeups",
    "candidate": ".os-library-search input",
    "reference": ".specimen",
    "markup": "<div class=\"searchbox\"><input class=\"specimen\" type=\"search\"><button aria-label=\"Search\"></button></div>",
    "states": fieldStates,
    "width": 320,
    "matchPlaceholder": true,
    "canonicalFamily": "searchbox"
  },
  {
    "id": "writeups-select",
    "page": "writeups",
    "candidate": ".os-library-topic select",
    "reference": ".specimen",
    "markup": "<select class=\"specimen\"></select>",
    "states": fieldStates,
    "width": 240,
    "matchOptions": true,
    "canonicalFamily": "dropdown"
  },
  {
    "id": "not-found-window",
    "page": "not-found",
    "candidate": ".global-not-found-dialog",
    "reference": ".window",
    "markup": "<section class=\"window glass active\"><div class=\"title-bar\"><div class=\"title-bar-text\">404</div></div><div class=\"window-body has-space\"><p>Aero window specimen</p></div></section>",
    "states": [
      "default"
    ],
    "window": true,
    "canonicalFamily": "window"
  },
  {
    "id": "not-found-titlebar",
    "page": "not-found",
    "candidate": ".global-not-found-dialog > .title-bar",
    "reference": ".title-bar",
    "markup": "<section class=\"window glass active\"><div class=\"title-bar\"><div class=\"title-bar-text\">404</div></div><div class=\"window-body has-space\"><p>Aero window specimen</p></div></section>",
    "states": [
      "default"
    ],
    "chrome": true,
    "canonicalFamily": "titlebar"
  },
  {
    "id": "not-found-select",
    "page": "not-found",
    "candidate": "#not-found-language",
    "reference": ".specimen",
    "markup": "<select class=\"specimen\"></select>",
    "states": fieldStates,
    "width": 240,
    "matchOptions": true,
    "canonicalFamily": "dropdown"
  },
  {
    "id": "not-found-action",
    "page": "not-found",
    "candidate": ".global-not-found-actions .os-button",
    "reference": ".specimen",
    "markup": "<button class=\"specimen default\"></button>",
    "states": buttonStates,
    "matchContent": true,
    "canonicalFamily": "default button"
  },
  {
    "id": "global-search-field",
    "page": "global-search",
    "candidate": "#os-search-input",
    "reference": ".specimen",
    "markup": "<div class=\"searchbox\"><input class=\"specimen\" type=\"search\"><button aria-label=\"Search\"></button></div>",
    "states": fieldStates,
    "width": 320,
    "matchPlaceholder": true,
    "matchValue": true,
    "canonicalFamily": "searchbox"
  },
  {
    "id": "window-disclosure",
    "page": "projects",
    "candidate": "[data-window-path][data-active=\"true\"] .os-window-controls > summary",
    "reference": ".specimen",
    "markup": "<button class=\"specimen\"></button>",
    "states": buttonStates,
    "matchContent": true,
    "canonicalFamily": "button face; native details disclosure semantics retained"
  },
  {
    "id": "window-step-button",
    "page": "window-controls",
    "candidate": ".os-window-step",
    "reference": ".specimen",
    "markup": "<button class=\"specimen\"></button>",
    "states": [
      "default",
      "hover",
      "pressed",
      "focus",
      "disabled"
    ],
    "matchContent": true,
    "canonicalFamily": "button"
  },
  {
    "id": "window-groupbox",
    "page": "window-controls",
    "candidate": ".os-window-controls-panel fieldset",
    "reference": ".specimen",
    "markup": "<div class=\"window\"><div class=\"window-body\"><fieldset class=\"specimen\"><legend>Move Window</legend><p>Aero group specimen</p></fieldset></div></div>",
    "states": [
      "default"
    ],
    "width": 320,
    "height": 140,
    "sample": "groupbox",
    "canonicalFamily": "groupbox"
  },
  {
    "id": "evidence-toggle",
    "page": "evidence",
    "candidate": ".os-story-platform-options button[aria-pressed=\"false\"]",
    "reference": ".specimen",
    "markup": "<button class=\"specimen\"></button>",
    "states": buttonStates,
    "matchContent": true,
    "canonicalFamily": "button; persistent selection is an extension"
  },
  {
    "id": "evidence-toggle-selected",
    "page": "evidence",
    "candidate": ".os-story-platform-options button[aria-pressed=\"true\"]",
    "reference": ".specimen",
    "markup": "<button class=\"specimen active\"></button>",
    "states": [
      "default",
      "focus"
    ],
    "matchContent": true,
    "canonicalFamily": "selected button compared with canonical active face"
  },
  {
    "id": "terminal-copy",
    "page": "project-detail",
    "candidate": ".os-terminal-copy",
    "reference": ".specimen",
    "markup": "<button class=\"specimen\"></button>",
    "states": buttonStates,
    "matchContent": true,
    "canonicalFamily": "button; copy status text remains application content"
  },
  {
    "id": "markdown-table-header",
    "page": "writeup-detail",
    "candidate": ".ui-markdown table:first-of-type th:first-child",
    "reference": ".specimen",
    "markup": "<table><thead><tr><th class=\"specimen\"></th><th>Value</th></tr></thead></table>",
    "states": [
      "default"
    ],
    "width": 240,
    "matchContent": true,
    "canonicalFamily": "listview table header"
  },
  {
    "id": "markdown-table-cell",
    "page": "writeup-detail",
    "candidate": ".ui-markdown table:first-of-type td:first-child",
    "reference": ".specimen",
    "markup": "<table><tbody><tr><td class=\"specimen\"></td><td>Value</td></tr></tbody></table>",
    "states": [
      "default"
    ],
    "width": 240,
    "matchContent": true,
    "canonicalFamily": "listview table cell"
  },
  {
    "id": "window-scrollbar",
    "page": "projects",
    "candidate": "[data-window-path][data-active=\"true\"] > .window-body",
    "reference": ".specimen",
    "markup": "<div class=\"window\"><div class=\"window-body has-scrollbar specimen\"></div></div>",
    "states": [
      "default",
      "scrolled",
      "hover",
      "pressed"
    ],
    "width": 320,
    "height": 180,
    "sample": "scrollbar",
    "canonicalFamily": "has-scrollbar"
  }
];
