export interface Project {
  slug: string;
  title: string;
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
    description: "Privacy-first offline QR & URL security scanner built with Kotlin Multiplatform. 100% offline analysis with 5 platform targets.",
    tags: ["KMP", "Security Tool", "Android", "iOS", "Desktop", "Web"],
    links: {
      demo: "https://www.youtube.com/watch?v=n8bheouj4jM",
      // Repo link inferred from clone command in README
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
  "ecrsm": {
    slug: "ecrsm",
    title: "ECRSM",
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
}

export const writeups = [
  {
    slug: "ecrsm-deep-dive",
    title: "Deep Dive: eBPF Runtime Monitoring",
    date: "2025-01-15",
    tag: "eBPF",
    takeaway: "How to build safe, read-only kernel probes for container security."
  },
  {
    slug: "kmp-security",
    title: "Building Offline-First Security Tools with KMP",
    date: "2025-01-02",
    tag: "Kotlin",
    takeaway: "Sharing 100% of security logic across Android, iOS, and Web."
  },
  {
    slug: "electron-security",
    title: "Securing Electron Apps: A Practical Guide",
    date: "2024-12-20",
    tag: "Electron",
    takeaway: "Handling secrets and IPC securely in modern desktop apps."
  }
]
