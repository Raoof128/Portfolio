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
    <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden">
      <ActiveGrid />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            <HUDFrame className="p-6 md:p-8 bg-zinc-900/80 backdrop-blur-sm border-l-4 border-l-cyan">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Mohammad Raouf Abedini</h2>
                  <p className="text-lg text-cyan font-mono mb-4">Cyber Security &amp; Full-Stack Development &mdash; Nov 2026 Graduate</p>
                  <div className="flex flex-col gap-2 text-zinc-400 text-sm font-mono">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-zinc-500" /> Castle Hill, NSW, Australia</div>
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-zinc-500" /> {CONTACT_EMAIL}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 justify-center md:items-end">
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-cyan transition-colors text-sm font-mono group">
                    <span>github.com/Raoof128</span> <Github className="w-4 h-4 group-hover:animate-pulse" />
                  </a>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-cyan transition-colors text-sm font-mono group">
                    <span>linkedin.com/in/mohammad-raouf-abedini</span> <Linkedin className="w-4 h-4 group-hover:animate-pulse" />
                  </a>
                </div>
              </div>
            </HUDFrame>
          </AnimatedSection>

          {/* Professional Summary */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan font-bold font-mono">01.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Professional Summary</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed max-w-3xl">
                Final-year Cyber Security student at Macquarie University with 70+ independent projects spanning web application security, mobile app security, full-stack development, and AI tooling. Proficient in Python, TypeScript, and Kotlin, with a track record of shipping production applications serving 1,000+ end users and embedding security across the entire development lifecycle — from threat modelling and secure code review through to deployment and incident remediation. Proven ability to build real-world tools, mentor peers, and operate effectively across security and engineering disciplines.
              </p>
            </section>
          </AnimatedSection>

          {/* Technical Skills */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan font-bold font-mono">02.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Technical Skills</h3>
              </div>
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-4">
                <motion.div variants={fadeInUp} className="p-4 bg-white/5 border border-white/5 rounded-sm hover:border-cyan/30 transition-colors">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Languages</h4>
                  <p className="text-sm text-zinc-400">Python, TypeScript, Kotlin, JavaScript, C, C++, Bash, SQL; Swift &amp; Go (familiar)</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-white/5 border border-white/5 rounded-sm hover:border-cyan/30 transition-colors">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Security</h4>
                  <p className="text-sm text-zinc-400">Web &amp; Mobile App Security, Penetration Testing, Threat Modelling, Secure Code Review, Vulnerability Assessment, Incident Response, Network Security</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-white/5 border border-white/5 rounded-sm hover:border-cyan/30 transition-colors">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Frameworks</h4>
                  <p className="text-sm text-zinc-400">OWASP Top 10, MITRE ATT&amp;CK, NIST Cybersecurity Framework</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-white/5 border border-white/5 rounded-sm hover:border-cyan/30 transition-colors">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Tools &amp; Platforms</h4>
                  <p className="text-sm text-zinc-400">Burp Suite, Wireshark, Nmap, Git/GitHub, Docker, Linux (Kali/Ubuntu), Next.js, React, FastAPI, Vercel, Cloudflare</p>
                </motion.div>
              </motion.div>
            </section>
          </AnimatedSection>

          {/* Education */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan font-bold font-mono">03.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Education</h3>
              </div>
              <div className="space-y-6">
                <div className="relative pl-6 border-l border-zinc-800">
                  <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-cyan border-2 border-zinc-900"></span>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                    <h4 className="text-white font-bold text-lg">Bachelor of Cyber Security</h4>
                    <span className="text-zinc-500 font-mono text-sm">Macquarie University</span>
                  </div>
                  <div className="text-cyan font-mono text-sm mb-2">May 2024 – Nov 2026 (Expected) &middot; WAM: 76.27</div>
                  <div className="text-sm text-zinc-400">
                    <span className="font-bold text-zinc-300">Coursework:</span> Digital Forensics, Privacy-Preserving Data Analysis, Network Security, Systems Security, Cloud Computing, NLP &amp; Machine Learning
                  </div>
                  <div className="text-sm text-zinc-500 mt-1">Key focus: Security Operations (SOC), Secure Software Development, Cloud Security, Ethical Hacking</div>
                </div>
                <div className="relative pl-6 border-l border-zinc-800">
                  <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-amber border-2 border-zinc-900"></span>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                    <h4 className="text-white font-bold text-lg">Diploma of Information Technology</h4>
                    <span className="text-zinc-500 font-mono text-sm">Macquarie University</span>
                  </div>
                  <div className="text-zinc-500 font-mono text-sm">Jul 2023 – May 2024 &middot; WAM: 71.75</div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Experience */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan font-bold font-mono">04.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Experience</h3>
              </div>

              <div className="relative pl-6 border-l border-zinc-800">
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-cyan border-2 border-zinc-900"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-lg">Freelance Full-Stack Developer &amp; Security Engineer</h4>
                  <span className="text-zinc-500 font-mono text-sm">Self-Employed &middot; Jan 2024 – Present</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-zinc-400 list-disc list-inside marker:text-zinc-600">
                  <li>Architected production web applications with security-first design using TypeScript, Next.js, FastAPI, and Cloudflare, serving 1,000+ end users across live deployments.</li>
                  <li>Engineered a secure iOS in-app purchase bridge with StoreKit 2 and Cloudflare Workers, implementing cryptographic receipt validation and tamper-resistant API design.</li>
                  <li>Executed a full Moodle LMS production migration with a documented cutover runbook, staging-to-production swap, and post-deployment security hardening — achieving zero downtime.</li>
                  <li>Developed Syllabus Sync with OAuth 2.0, passkey authentication, and 500+ automated tests across 35 locales, embedding security from design through deployment.</li>
                </ul>
              </div>

              <div className="relative pl-6 border-l border-zinc-800">
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-amber border-2 border-zinc-900"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-lg">IT Manager</h4>
                  <span className="text-zinc-500 font-mono text-sm">Iran Pharmacy, Tehran &middot; Aug 2019 – May 2024</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-zinc-400 list-disc list-inside marker:text-zinc-600">
                  <li>Configured and secured hardware, software, and network infrastructure across the organisation, maintaining 99% system uptime over 5 years.</li>
                  <li>Enforced role-based access control (RBAC) and least-privilege policies, eliminating unauthorised access incidents across all user accounts.</li>
                  <li>Diagnosed and resolved 50+ technical faults; evaluated new technologies with security risk assessments, streamlining workflows by ~30%.</li>
                </ul>
              </div>

              <div className="relative pl-6 border-l border-zinc-800">
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-zinc-600 border-2 border-zinc-900"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-lg">Crew Member</h4>
                  <span className="text-zinc-500 font-mono text-sm">McDonald&apos;s, Sydney &middot; Aug 2022 – Feb 2023</span>
                </div>
                <p className="mt-2 text-sm text-zinc-400">Delivered consistent, high-quality service in a high-volume, fast-paced environment — developed strong communication, teamwork, and accountability under pressure.</p>
              </div>
            </section>
          </AnimatedSection>

          {/* Projects */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan font-bold font-mono">05.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Featured Projects</h3>
              </div>
              <div className="space-y-6">
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">Mehr Guard <span className="text-zinc-500 font-normal text-sm">&mdash; Kotlin Multiplatform (Android &amp; iOS)</span></h4>
                  </div>
                  <p className="text-sm text-zinc-400">Built an offline QR code / URL threat scanner for Android and iOS with secure-by-default, local-first architecture. Submitted to KotlinConf — operates fully air-gapped with no data exfiltration.</p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">PhishPatrol <span className="text-zinc-500 font-normal text-sm">&mdash; Web, Interactive Game</span></h4>
                  </div>
                  <p className="text-sm text-zinc-400">Designed and launched an interactive cybersecurity education game teaching phishing awareness and social engineering recognition; deployed to 50+ students with measurable improvement in threat recognition.</p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">GitSwitch <span className="text-zinc-500 font-normal text-sm">&mdash; Electron, React</span></h4>
                  </div>
                  <p className="text-sm text-zinc-400">Engineered a multi-account Git identity management desktop app featuring secure credential handling and complete identity isolation between developer contexts.</p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">Syllabus Sync <span className="text-zinc-500 font-normal text-sm">&mdash; Next.js, FastAPI, OAuth 2.0</span></h4>
                  </div>
                  <p className="text-sm text-zinc-400">Full-stack academic planning tool with passkey authentication, 500+ automated security tests across 35 locales, and continuous security hardening baked into the CI/CD pipeline.</p>
                </div>
                <div className="p-3 border border-white/5 bg-white/5 rounded-sm text-sm text-zinc-500 font-mono">
                  <span className="text-cyan">+70</span> security &amp; AI projects at <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">github.com/Raoof128</a>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Leadership */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan font-bold font-mono">06.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Leadership &amp; Community</h3>
              </div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-start gap-2"><span className="text-cyan mt-1">&#x25CF;</span> Mentored peers in Cyber Security and secure coding practices at Macquarie University, guiding students through digital security fundamentals and technical troubleshooting.</li>
                <li className="flex items-start gap-2"><span className="text-purple mt-1">&#x25CF;</span> Completed AI model security evaluation for Anthropic (Claude Code Human Preference), benchmarking outputs across multiple codebases for security correctness and reliability.</li>
              </ul>
            </section>
          </AnimatedSection>

          {/* Additional Info */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4 pb-8">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan font-bold font-mono">07.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Additional Information</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-zinc-400">
                <div className="flex items-start gap-2"><span className="text-cyan mt-1">&#x25CF;</span> Eligible to work full-time in Australia (no restrictions)</div>
                <div className="flex items-start gap-2"><span className="text-purple mt-1">&#x25CF;</span> Trilingual: English (Professional), Persian (Native), Japanese (Elementary)</div>
                <div className="flex items-start gap-2"><span className="text-cyan mt-1">&#x25CF;</span> Strong customer-focused communication skills</div>
                <div className="flex items-start gap-2"><span className="text-amber mt-1">&#x25CF;</span> Calm and methodical under pressure</div>
              </div>
            </section>
          </AnimatedSection>

        </motion.div>
      </main>
    </div>
  );
}
