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
                  <p className="text-lg text-cyan font-mono mb-4">AI &amp; Cybersecurity Researcher &middot; Security Engineer &middot; Full-Stack Developer</p>
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
                AI and cybersecurity researcher graduating with a Bachelor of Cyber Security from Macquarie University (November 2026). My work sits at the intersection of artificial intelligence safety and offensive/defensive security — building detection systems that identify threats in real time, evaluating Large Language Model (LLM) outputs for security vulnerabilities, and developing AI-powered tools that make security accessible at scale. I have shipped 70+ independent research and engineering projects, built production systems serving 1,000+ end users, and completed paid AI model evaluation for Anthropic. I bring 7 years of combined experience across security operations, systems programming, and applied machine learning. Fluent in English, Persian (native), and elementary Japanese.
              </p>
            </section>
          </AnimatedSection>

          {/* Research Interests */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">02.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Research Interests</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "AI Safety & LLM Security",
                  "Threat Detection Engineering",
                  "Adversarial Machine Learning",
                  "Network Intrusion Detection",
                  "Phishing & Social Engineering Simulation",
                  "Privacy-Preserving Data Analysis",
                  "Secure Software Architecture",
                  "Offensive Security & Vulnerability Analysis",
                ].map((interest) => (
                  <span key={interest} className="px-3 py-1.5 border border-purple/20 bg-purple/5 text-purple font-mono text-xs hover:border-purple/50 transition-colors">
                    {interest}
                  </span>
                ))}
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
                <motion.div variants={fadeInUp} className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 transition-colors">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Languages</h4>
                  <p className="text-sm text-text-body">Python, C/C++ (C++20/17), TypeScript, JavaScript, Kotlin, SQL, Bash, Go (familiar), Swift (familiar)</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-purple/5 border border-purple/10 rounded-sm hover:border-purple/30 transition-colors">
                  <h4 className="text-purple font-mono text-sm mb-3 font-bold">&gt; AI &amp; ML</h4>
                  <p className="text-sm text-text-body">LLM evaluation &amp; integration, NLP, classification algorithms, generative AI, prompt engineering, AI model benchmarking, data pipelines for ML applications</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 transition-colors">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Security</h4>
                  <p className="text-sm text-text-body">OWASP Top 10, MITRE ATT&amp;CK, NIST Framework, threat modelling, penetration testing (Wireshark, Nmap, Burp Suite), secure code review, incident response, digital forensics</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 transition-colors">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Systems</h4>
                  <p className="text-sm text-text-body">Memory management, custom allocators, data structures (red-black trees, hash maps), performance benchmarking (p50/p99), CMake, Google Test, libpcap, Linux</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-amber/5 border border-amber/10 rounded-sm hover:border-amber/30 transition-colors">
                  <h4 className="text-amber font-mono text-sm mb-3 font-bold">&gt; Cloud &amp; Infrastructure</h4>
                  <p className="text-sm text-text-body">Docker, Terraform, Cloudflare Workers, Vercel, PostgreSQL, GitHub Actions CI/CD, serverless architecture, infrastructure-as-code</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 transition-colors">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Frameworks</h4>
                  <p className="text-sm text-text-body">React, Next.js, FastAPI, Litestar, Electron, Kotlin Multiplatform, OAuth 2.0, REST APIs</p>
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
                  <div className="text-cyan font-mono text-sm mb-2">2024 – 2026 (Expected November)</div>
                  <div className="text-sm text-text-body">
                    <span className="font-bold text-slate-300">Key coursework:</span> Digital Forensics, Network Security, Systems Security, Cloud Computing, Natural Language Processing (NLP) &amp; Machine Learning, Privacy-Preserving Data Analysis, Data Structures &amp; Algorithms
                  </div>
                  <div className="text-sm text-text-body mt-1">Applied research across threat modelling (MITRE ATT&amp;CK), vulnerability assessment, incident analysis, and machine learning classification algorithms</div>
                </div>
                <div className="relative pl-6 border-l border-cyber-gray">
                  <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-amber border-2 border-background"></span>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                    <h4 className="text-white font-bold text-lg">Diploma of Information Technology</h4>
                    <span className="text-text-body font-mono text-sm">Macquarie University</span>
                  </div>
                  <div className="text-text-body font-mono text-sm">2023 – 2024</div>
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
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">SentinelFlow <span className="text-purple font-mono font-normal text-xs ml-2">[IDS RESEARCH]</span></h4>
                    <span className="text-text-body font-mono text-sm">2026</span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">C++17 &middot; libpcap &middot; CMake &middot; Google Test &middot; Linux</p>
                  <p className="text-sm text-text-body">Real-time network intrusion detection system parsing 500K+ packets/second. Multi-layer protocol dissection (Ethernet/IPv4/TCP/UDP/ICMP/DNS) with signature-based detection, stateful analysis (port scans, SYN floods, DNS tunnelling), structured alert logging, and offline PCAP replay for forensic investigation.</p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">NanoMatch <span className="text-purple font-mono font-normal text-xs ml-2">[SYSTEMS RESEARCH]</span></h4>
                    <span className="text-text-body font-mono text-sm">2026</span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">C++20 &middot; CMake &middot; Google Test &middot; Custom Memory Pool</p>
                  <p className="text-sm text-text-body">High-performance matching engine processing 1M+ operations/second with sub-microsecond latency. Red-black tree price levels, FIFO order queues, O(1) hash map lookup, and custom memory pool allocator eliminating heap allocation.</p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-purple transition-colors">PhishPatrol <span className="text-purple font-mono font-normal text-xs ml-2">[AI SECURITY]</span></h4>
                    <span className="text-text-body font-mono text-sm">2024</span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">Python &middot; Generative AI &middot; NLP</p>
                  <p className="text-sm text-text-body">AI-powered phishing simulation and cybersecurity education platform using NLP to generate dynamic, realistic social engineering scenarios. Adopted by 50+ students for interactive security awareness training. Explores LLM misuse vectors for social engineering at scale.</p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">Nexus Archive <span className="text-cyan font-mono font-normal text-xs ml-2">[SECURE ARCHITECTURE]</span></h4>
                    <span className="text-text-body font-mono text-sm">2025</span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">React &middot; Python/Litestar &middot; PostgreSQL &middot; Docker &middot; Terraform</p>
                  <p className="text-sm text-text-body">Secure full-stack data platform with AI recommendation engine, prompt injection isolation, automated security scanning, Row Level Security, encrypted data persistence, and HttpOnly cookie authentication.</p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">Mehr Guard <span className="text-cyan font-mono font-normal text-xs ml-2">[KOTLINCONF]</span></h4>
                    <span className="text-text-body font-mono text-sm">2024</span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">Kotlin Multiplatform &middot; Android &amp; iOS &middot; Local ML</p>
                  <p className="text-sm text-text-body">Offline-first mobile threat detection tool with local machine learning classification for malicious QR codes and URLs. Secure-by-default architecture with zero external data exfiltration. Submitted to KotlinConf.</p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">Syllabus Sync <span className="text-cyan font-mono font-normal text-xs ml-2">[PRODUCTION]</span></h4>
                    <span className="text-text-body font-mono text-sm">2024</span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">TypeScript &middot; Next.js &middot; OAuth 2.0 &middot; CI/CD</p>
                  <p className="text-sm text-text-body">Production SaaS platform with 500+ automated tests across 35 locales, passkey authentication, and zero regressions. Demonstrates secure development lifecycle practices at scale.</p>
                </div>
                <div className="p-3 border border-cyan/10 bg-cyan/5 rounded-sm text-sm text-text-body font-mono">
                  <span className="text-cyan">+70</span> additional public projects at <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">github.com/Raoof128</a>
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
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-purple border-2 border-background"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-lg">AI Model Evaluator</h4>
                  <span className="text-text-body font-mono text-sm">Anthropic &middot; 2024</span>
                </div>
                <p className="text-xs text-text-meta font-mono mb-2">Claude Code Human Preference</p>
                <ul className="mt-2 space-y-1 text-sm text-text-body list-disc list-inside marker:text-text-meta">
                  <li>Systematically evaluated Claude&apos;s LLM-generated code outputs across multiple codebases — benchmarking security, correctness, quality, and reliability against structured rubrics</li>
                  <li>Identified patterns where model outputs could produce security vulnerabilities or harmful code — contributing to Anthropic&apos;s AI safety evaluation pipeline</li>
                </ul>
              </div>

              <div className="relative pl-6 border-l border-cyber-gray">
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-cyan border-2 border-background"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-lg">Freelance Security Engineer &amp; Full-Stack Developer</h4>
                  <span className="text-text-body font-mono text-sm">Self-Employed &middot; 2024 – Present</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-text-body list-disc list-inside marker:text-text-meta">
                  <li>Architected production applications with security-first design serving 1,000+ end users — implementing OWASP Top 10 practices, OAuth 2.0, cryptographic receipt validation, and automated security scanning</li>
                  <li>Integrated LLM capabilities into client applications — building AI-assisted content classification, workflow routing, and automation with prompt isolation and guardrails</li>
                  <li>Engineered CI/CD pipelines with 500+ automated security and integration tests via GitHub Actions, reducing deployment vulnerabilities by ~40%</li>
                  <li>Executed zero-downtime Moodle LMS production migration with documented cutover runbook, staging-to-production swap, and post-deployment security hardening</li>
                </ul>
              </div>

              <div className="relative pl-6 border-l border-cyber-gray">
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-amber border-2 border-background"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-lg">IT Manager &amp; Security Operations</h4>
                  <span className="text-text-body font-mono text-sm">Iran Pharmacy &middot; 2019 – 2024</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-text-body list-disc list-inside marker:text-text-meta">
                  <li>Managed security infrastructure across a multi-site organisation for 5 years — maintaining 99% system uptime through systematic monitoring, incident investigation, and rapid response for 50+ staff</li>
                  <li>Enforced role-based access control and least-privilege policies — investigating and remediating unauthorised access incidents; automated detection workflows reducing manual toil by ~30%</li>
                  <li>Conducted technology evaluations with documented security risk assessments — quantifying threats and translating findings into actionable recommendations</li>
                </ul>
              </div>

              <div className="relative pl-6 border-l border-cyber-gray">
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-text-body border-2 border-background"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-lg">Crew Member</h4>
                  <span className="text-text-body font-mono text-sm">McDonald&apos;s, Sydney &middot; 2022 – 2023</span>
                </div>
                <p className="mt-2 text-sm text-text-body">Delivered high-volume service in a collaborative environment — Australian local work experience demonstrating communication, adaptability, and reliability.</p>
              </div>
            </section>
          </AnimatedSection>

          {/* Teaching & Mentorship */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">07.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Teaching &amp; Mentorship</h3>
              </div>
              <ul className="space-y-2 text-sm text-text-body">
                <li className="flex items-start gap-2"><span className="text-cyan mt-1">&#x25CF;</span> Mentored peers in cybersecurity, threat modelling, secure coding, C/C++ programming, and data structures at Macquarie University — guided students through vulnerability analysis, network security labs, and digital forensics</li>
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
                <div className="flex items-start gap-2"><span className="text-cyan mt-1">&#x25CF;</span> Available from December 2026 &middot; Work rights upon graduation</div>
                <div className="flex items-start gap-2"><span className="text-purple mt-1">&#x25CF;</span> English (Professional Working) &middot; Persian / Farsi (Native) &middot; Japanese (Elementary)</div>
                <div className="flex items-start gap-2"><span className="text-cyan mt-1">&#x25CF;</span> Sydney, Australia</div>
                <div className="flex items-start gap-2"><span className="text-amber mt-1">&#x25CF;</span> raoufabedini.dev</div>
              </div>
            </section>
          </AnimatedSection>

        </motion.div>
      </div>
    </div>
  );
}
