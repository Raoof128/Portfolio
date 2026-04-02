"use client";

import { Mail, Github, Linkedin, MapPin, Download } from "lucide-react";
import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { NeonButton } from "@/components/ui/NeonButton";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { fadeInUp, staggerContainer } from "@/lib/utils";
import { motion } from "framer-motion";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants";

export function ResumeClient() {
  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <ActiveGrid />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection variants={fadeInUp}>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              <span className="text-cyan font-mono mr-2">/</span>
              <DecryptedText text="Resume" />
            </h1>
            <NeonButton href="/Raouf_Portfolio_Resume.docx" download variant="outline">
              <Download className="w-4 h-4" /> Download Resume
            </NeonButton>
          </div>
        </AnimatedSection>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} className="space-y-6">

          {/* Header */}
          <AnimatedSection variants={fadeInUp}>
            <HUDFrame className="p-6 md:p-8 bg-[#06080d]/60 backdrop-blur-sm border-l-4 border-l-cyan">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Mohammad Raouf Abedini</h2>
                  <p className="text-lg text-cyan font-mono mb-4">AI Security Researcher &middot; Vulnerability Research &middot; Offensive Security &middot; Python &amp; Systems Programming</p>
                  <div className="flex flex-col gap-2 text-text-body text-sm font-mono">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-text-body" /> Castle Hill, Sydney, NSW, Australia</div>
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-text-body" /> {CONTACT_EMAIL}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 justify-center md:items-end">
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-body hover:text-cyan transition-colors text-sm font-mono group">
                    <span>github.com/Raoof128</span> <Github className="w-4 h-4 group-hover:animate-pulse" />
                  </a>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-body hover:text-cyan transition-colors text-sm font-mono group">
                    <span>LinkedIn Profile</span> <Linkedin className="w-4 h-4 group-hover:animate-pulse" />
                  </a>
                </div>
              </div>
            </HUDFrame>
          </AnimatedSection>

          {/* About */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">01.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">About</h3>
              </div>
              <p className="text-text-body leading-relaxed max-w-3xl">
                AI security researcher and final-year Cyber Security student at Macquarie University (graduating November 2026) with demonstrated ability to independently discover, validate, and responsibly disclose cross-platform vulnerabilities. Authored &ldquo;The Invisible Window&rdquo; &mdash; a peer-reviewed-format security analysis demonstrating 100% screen capture evasion on Windows 10/11 and macOS 14&ndash;26 using documented OS-level APIs, with a novel finding that Apple&apos;s macOS 15 mitigation remains ineffective on macOS 26. Fluent in Python with production experience across C/C++, TypeScript, and Swift. Completed AI model evaluation for Anthropic (Claude Code Human Preference), benchmarking LLM code outputs for quality, security, and reliability. Motivated by reducing catastrophic risks from advanced AI &mdash; eager to measure capability uplift, characterise safety boundaries, and develop defensive applications.
              </p>
            </section>
          </AnimatedSection>

          {/* Security Research */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">02.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Security Research</h3>
              </div>
              <div className="group">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                  <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">The Invisible Window</h4>
                  <span className="text-text-body font-mono text-sm">2026</span>
                </div>
                <p className="text-xs text-text-meta font-mono mb-2">C, Swift, Python, Win32 API, ScreenCaptureKit, WebRTC</p>
                <p className="text-sm text-text-body italic mb-3">Exploiting OS-Level Display Affinity to Bypass WebRTC Proctoring Systems</p>
                <ul className="space-y-2 text-sm text-text-body list-disc list-inside marker:text-text-meta">
                  <li>Discovered and formalised a cross-platform trust boundary violation between the W3C Screen Capture API and the OS compositing pipeline &mdash; achieving 100% evasion across all tested platforms with zero visual artefacts over 10,000+ analysed frames</li>
                  <li>Uncovered a novel empirical finding on macOS 26.3.1: Apple&apos;s documented ScreenCaptureKit mitigation (macOS 15) remains ineffective &mdash; contradicting prevailing community and vendor assumptions through pixel-level forensic verification</li>
                  <li>Executed coordinated responsible disclosure to three proctoring vendors (ProctorU, Proctorio, Respondus) and two OS vendors (Microsoft, Apple) following OWASP/FIRST/CISA disclosure frameworks within a 90-day window</li>
                  <li>Documented measurable AI capability uplift: a single researcher with introductory security knowledge used Claude Opus 4.6 to produce validated cross-platform PoCs in a single research session &mdash; the model independently identified the operationally critical distinction between WDA_MONITOR and WDA_EXCLUDEFROMCAPTURE from API documentation</li>
                  <li>Characterised intent-vs-artefact safety boundary: model correctly distinguished research intent from misuse intent at the prompt level, but resulting artefacts (working PoC code) are transferable regardless of framing &mdash; a finding directly relevant to ASL threshold calibration</li>
                </ul>
              </div>
            </section>
          </AnimatedSection>

          {/* Technical Proficiencies */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">03.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Technical Proficiencies</h3>
              </div>
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-4">
                <motion.div variants={fadeInUp} className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(167,139,250,0.1)] transition-all">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Languages</h4>
                  <p className="text-sm text-text-body">Python (primary), C, C++, TypeScript, JavaScript, Swift, Kotlin, Bash, SQL, Go (familiar)</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-amber/5 border border-amber/10 rounded-sm hover:border-amber/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(245,158,11,0.1)] transition-all">
                  <h4 className="text-amber font-mono text-sm mb-3 font-bold">&gt; Security &amp; Offensive</h4>
                  <p className="text-sm text-text-body">Vulnerability research, cross-platform exploit development (Win32 API, macOS ScreenCaptureKit), threat modelling, secure code review, penetration testing, responsible disclosure (OWASP/FIRST/CISA), Wireshark, Nmap, Burp Suite</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-purple/5 border border-purple/10 rounded-sm hover:border-purple/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(16,185,129,0.1)] transition-all">
                  <h4 className="text-purple font-mono text-sm mb-3 font-bold">&gt; AI &amp; ML</h4>
                  <p className="text-sm text-text-body">Large Language Model (LLM) integration &amp; evaluation, AI-assisted vulnerability research, Natural Language Processing (NLP), generative AI tooling, ML model evaluation, dual-use risk assessment</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(167,139,250,0.1)] transition-all">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Systems &amp; Tools</h4>
                  <p className="text-sm text-text-body">Linux (Ubuntu/Kali), CMake, Docker, Git/GitHub, GitHub Actions CI/CD, Google Test, FastAPI, Cloudflare Workers, libpcap</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(167,139,250,0.1)] transition-all md:col-span-2">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Frameworks</h4>
                  <p className="text-sm text-text-body">Open Web Application Security Project (OWASP) Top 10, MITRE ATT&amp;CK, National Institute of Standards and Technology (NIST) Framework, W3C Screen Capture Specification</p>
                </motion.div>
              </motion.div>
            </section>
          </AnimatedSection>

          {/* Education */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">04.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Education</h3>
              </div>
              <div className="space-y-6">
                <div className="relative pl-6 border-l border-cyber-gray">
                  <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-cyan border-2 border-background"></span>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                    <h4 className="text-white font-bold text-lg">Bachelor of Cyber Security</h4>
                    <span className="text-text-body font-mono text-sm">Macquarie University</span>
                  </div>
                  <div className="text-cyan font-mono text-sm mb-2">May 2024 – Nov 2026</div>
                  <div className="text-sm text-text-body">
                    <span className="font-bold text-slate-300">Coursework:</span> Digital Forensics, Network Security, Systems Security, Cloud Computing, Natural Language Processing (NLP) &amp; Machine Learning, Privacy-Preserving Data Analysis
                  </div>
                </div>
                <div className="relative pl-6 border-l border-cyber-gray">
                  <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-amber border-2 border-background"></span>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                    <h4 className="text-white font-bold text-lg">Diploma of Information Technology</h4>
                    <span className="text-text-body font-mono text-sm">Macquarie University</span>
                  </div>
                  <div className="text-text-body font-mono text-sm">Jul 2023 – May 2024</div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Selected Research & Engineering Projects */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">05.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Selected Research &amp; Engineering Projects</h3>
              </div>
              <div className="space-y-6">
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">NanoMatch <span className="text-purple font-mono font-normal text-xs ml-2">[SYSTEMS]</span></h4>
                    <span className="text-text-body font-mono text-sm">2026</span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">C++20 &middot; CMake &middot; Google Test</p>
                  <p className="text-sm text-text-body">Engineered high-performance matching engine processing 1M+ orders/second with sub-microsecond latency &mdash; implemented red-black tree price levels, custom memory pool allocator, and comprehensive test suite with p50/p99 latency benchmarks.</p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">SentinelFlow <span className="text-purple font-mono font-normal text-xs ml-2">[IDS]</span></h4>
                    <span className="text-text-body font-mono text-sm">2026</span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">C++17 &middot; libpcap &middot; CMake &middot; Google Test &middot; Linux</p>
                  <p className="text-sm text-text-body">Built real-time network packet processing engine parsing 500K+ packets/second &mdash; protocol dissection (Ethernet/IPv4/TCP/UDP/ICMP/DNS), signature-based detection engine, and stateful analysis (port scans, SYN floods).</p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-purple transition-colors">Nexus Archive <span className="text-purple font-mono font-normal text-xs ml-2">[FULL-STACK]</span></h4>
                    <span className="text-text-body font-mono text-sm">2025</span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">Python/Litestar &middot; React &middot; PostgreSQL &middot; Docker &middot; Terraform</p>
                  <p className="text-sm text-text-body">Shipped full-stack data platform with AI recommendation engine, event-driven API design, rate limiting, and automated security scanning &mdash; end-to-end ownership from database schema to deployment infrastructure.</p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">Mehr Guard <span className="text-cyan font-mono font-normal text-xs ml-2">[KOTLINCONF]</span></h4>
                    <span className="text-text-body font-mono text-sm">2024</span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">Kotlin Multiplatform &middot; Local ML &middot; Android &amp; iOS</p>
                  <p className="text-sm text-text-body">Built cross-platform offline threat detection tool with local ML-based classification &mdash; submitted to KotlinConf global developer conference.</p>
                </div>
                <div className="p-3 border border-cyan/10 bg-cyan/5 rounded-sm text-sm text-text-body font-mono">
                  70+ additional public projects on GitHub covering vulnerability research, systems programming, AI/ML tooling, and cloud infrastructure: <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">github.com/Raoof128</a>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Professional Experience */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">06.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Professional Experience</h3>
              </div>

              <div className="relative pl-6 border-l border-cyber-gray">
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-cyan border-2 border-background"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-lg">Freelance Full-Stack Developer &amp; Security Engineer</h4>
                  <span className="text-text-body font-mono text-sm">Self-Employed &middot; Jan 2024 – Present</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-text-body list-disc list-inside marker:text-text-meta">
                  <li>Architected production web applications with security-first design for multiple clients using Python, TypeScript, and Cloudflare Workers &mdash; serving 1,000+ end users with zero-downtime operation</li>
                  <li>Engineered CI/CD pipelines and automated test suites (500+ tests across 35 locales) via GitHub Actions &mdash; reducing deployment failures by approximately 40% through systematic quality assurance</li>
                  <li>Integrated LLM capabilities into client applications, building AI-powered automation tools that empowered non-technical users to manage content workflows independently</li>
                </ul>
              </div>

              <div className="relative pl-6 border-l border-cyber-gray">
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-amber border-2 border-background"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-lg">IT Manager</h4>
                  <span className="text-text-body font-mono text-sm">Iran Pharmacy &middot; Aug 2019 – May 2024</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-text-body list-disc list-inside marker:text-text-meta">
                  <li>Managed technology infrastructure across a multi-site organisation for 5 years &mdash; maintaining 99% system uptime, enforcing role-based access control (RBAC), and automating operational workflows via Python/Bash scripting (~30% reduction in manual tasks)</li>
                </ul>
              </div>
            </section>
          </AnimatedSection>

          {/* AI Safety & Community */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">07.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">AI Safety &amp; Community</h3>
              </div>
              <ul className="space-y-2 text-sm text-text-body">
                <li className="flex items-start gap-2"><span className="text-purple mt-1">&#x25CF;</span> Completed AI model evaluation for Anthropic (Claude Code Human Preference) &mdash; benchmarked LLM code outputs across multiple codebases for quality, security, correctness, and reliability</li>
                <li className="flex items-start gap-2"><span className="text-purple mt-1">&#x25CF;</span> Proposed three concrete research directions to Anthropic&apos;s Fellows team: systematic uplift measurement across vulnerability classes, intent-vs-artefact safety boundary generalisation testing, and defensive application development &mdash; all building on empirical findings from the Invisible Window case study</li>
                <li className="flex items-start gap-2"><span className="text-cyan mt-1">&#x25CF;</span> Mentored peers in cybersecurity, C/C++ programming, and systems-level problem-solving at Macquarie University &mdash; collaborative technical guidance across coursework, lab environments, and secure coding practices</li>
              </ul>
            </section>
          </AnimatedSection>

          {/* Additional Info */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4 pb-8">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">08.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Additional Information</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-text-body">
                <div className="flex items-start gap-2"><span className="text-cyan mt-1">&#x25CF;</span> Available for full-time, 4-month fellowship from July 2026</div>
                <div className="flex items-start gap-2"><span className="text-purple mt-1">&#x25CF;</span> English (Professional Working) &middot; Persian (Native) &middot; Japanese (Elementary)</div>
              </div>
            </section>
          </AnimatedSection>

        </motion.div>
      </div>
    </div>
  );
}
