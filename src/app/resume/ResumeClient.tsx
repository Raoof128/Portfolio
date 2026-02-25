"use client";

import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { HUDFrame } from "@/components/ui/HUDFrame";
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
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              <span className="text-cyan font-mono mr-2">/</span>
              <DecryptedText text="Resume" />
            </h1>
          </div>
        </AnimatedSection>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} className="space-y-6">

          <AnimatedSection variants={fadeInUp}>
            <HUDFrame className="p-6 md:p-8 bg-zinc-900/80 backdrop-blur-sm border-l-4 border-l-cyan">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Mohammad Raouf Abedini</h2>
                  <p className="text-lg text-cyan font-mono mb-4">Systems Support Analyst | Cybersecurity Student</p>
                  <div className="flex flex-col gap-2 text-zinc-400 text-sm font-mono">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-zinc-500" /> Sydney, NSW, Australia</div>
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

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan font-bold font-mono">01.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Professional Summary</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed max-w-3xl">
                Final-year Cybersecurity student at Macquarie University (WAM: 76.27) with 4+ years of IT support experience in system troubleshooting, incident response, and security operations. Proven ability to diagnose technical issues, maintain system reliability, and support end users across diverse environments. Strong technical foundation in Python, Linux/Windows systems, and security tools with a methodical, security-first approach to problem-solving.
              </p>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan font-bold font-mono">02.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Technical Skills</h3>
              </div>
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-4">
                <motion.div variants={fadeInUp} className="p-4 bg-white/5 border border-white/5 rounded-sm hover:border-cyan/30 transition-colors">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Security & Systems</h4>
                  <ul className="space-y-1.5 text-sm text-zinc-400 list-disc list-inside marker:text-zinc-600">
                    <li>Offensive security, digital forensics, applied cryptography</li>
                    <li>Incident response, vulnerability assessment, hardening</li>
                    <li>SIEM tools, log analysis, security monitoring</li>
                    <li>Windows and Linux environments (PowerShell, Bash)</li>
                  </ul>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-white/5 border border-white/5 rounded-sm hover:border-cyan/30 transition-colors">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Development & Tools</h4>
                  <ul className="space-y-1.5 text-sm text-zinc-400 list-disc list-inside marker:text-zinc-600">
                    <li>Python (scripting, automation, diagnostics)</li>
                    <li>JavaScript, TypeScript, C, C++</li>
                    <li>Git/GitHub version control workflows</li>
                    <li>API integration and web technologies</li>
                  </ul>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-white/5 border border-white/5 rounded-sm hover:border-cyan/30 transition-colors">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; Networking & Infra</h4>
                  <ul className="space-y-1.5 text-sm text-zinc-400 list-disc list-inside marker:text-zinc-600">
                    <li>Core protocols (TCP/IP, DNS, HTTP/S)</li>
                    <li>Network troubleshooting, data communications</li>
                    <li>System availability, monitoring, reliability</li>
                  </ul>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-4 bg-white/5 border border-white/5 rounded-sm hover:border-cyan/30 transition-colors">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">&gt; IT Support & Ops</h4>
                  <ul className="space-y-1.5 text-sm text-zinc-400 list-disc list-inside marker:text-zinc-600">
                    <li>Level 1-2 technical support, issue triage</li>
                    <li>Hardware/software troubleshooting, root cause analysis</li>
                    <li>Documentation, ticketing systems, procedures</li>
                    <li>User training and stakeholder communication</li>
                  </ul>
                </motion.div>
              </motion.div>
            </section>
          </AnimatedSection>

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
                    <span className="text-zinc-500 font-mono text-sm">Macquarie University, Sydney</span>
                  </div>
                  <div className="text-cyan font-mono text-sm mb-2">Expected 2026 | WAM: 76.27</div>
                  <div className="text-sm text-zinc-400">
                    <span className="font-bold text-zinc-300">Relevant Coursework:</span> Offensive Security (HD: 85), Digital Forensics (D: 83), Applied Cryptography (HD: 88), Data Privacy & InfoSec (D: 75), AI for Text/Vision (D: 81), Cyber Security Mgmt (D: 83).
                  </div>
                </div>
                <div className="relative pl-6 border-l border-zinc-800">
                  <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-amber border-2 border-zinc-900"></span>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                    <h4 className="text-white font-bold text-lg">Diploma of Information Technology</h4>
                    <span className="text-zinc-500 font-mono text-sm">Macquarie University</span>
                  </div>
                  <div className="text-zinc-500 font-mono text-sm">Completed: June 2024 | WAM: 71.75</div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan font-bold font-mono">04.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Projects</h3>
              </div>
              <div className="space-y-6">
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">MehrGuard &mdash; Offline QR & URL Security Scanner</h4>
                    <a href="https://github.com/Raoof128/Raoof128.github.io" className="text-xs font-mono text-zinc-500 hover:text-cyan underline decoration-dotted">github.com/Raoof128/Raoof128.github.io</a>
                  </div>
                  <ul className="space-y-1 text-sm text-zinc-400 list-disc list-inside marker:text-zinc-600">
                    <li>Built and tested security application emphasizing reliability, offline functionality, and correct system behavior.</li>
                    <li>Diagnosed and resolved edge case issues related to input validation, unexpected user data, and cross-platform stability.</li>
                    <li>Implemented comprehensive error handling and defensive programming practices.</li>
                    <li>Produced detailed technical documentation covering system architecture and troubleshooting.</li>
                  </ul>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">Syllabus Sync &mdash; Student Productivity Platform</h4>
                    <span className="text-xs font-mono text-zinc-500">Systems Support & Junior Developer</span>
                  </div>
                  <ul className="space-y-1 text-sm text-zinc-400 list-disc list-inside marker:text-zinc-600">
                    <li>Supported live web application by identifying, reproducing, and resolving 15+ functional and UI issues monthly.</li>
                    <li>Investigated user-reported bugs, applied fixes, and verified outcomes through systematic testing.</li>
                    <li>Maintained system stability across feature updates and deployments.</li>
                    <li>Collaborated with development team using GitHub issues, pull requests, and agile workflows.</li>
                  </ul>
                </div>
              </div>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan font-bold font-mono">05.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Experience</h3>
              </div>
              <div className="relative pl-6 border-l border-zinc-800">
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-cyan border-2 border-zinc-900"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-lg">Information Technology Support Technician</h4>
                  <span className="text-zinc-500 font-mono text-sm">Iran Pharmacy | Aug 2019 &ndash; May 2024</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-zinc-400 list-disc list-inside marker:text-zinc-600">
                  <li>Delivered Level 1-2 IT support across 50+ workstations, printers, networks, and local systems.</li>
                  <li>Resolved 20+ daily technical issues including OS errors, software faults, and performance problems (98% satisfaction).</li>
                  <li>Installed, configured, and updated software while maintaining workstation health and security compliance.</li>
                  <li>Managed new device setup, user onboarding, and account provisioning for 10+ monthly new users.</li>
                  <li>Produced clear technical documentation and escalated complex issues following established procedures.</li>
                </ul>
              </div>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4 pb-8">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan font-bold font-mono">06.</span>
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
