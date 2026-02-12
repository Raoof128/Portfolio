"use client";

import Image from "next/image";
import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Terminal, Shield, Cpu, Network } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInLeft, fadeInRight, fadeInUp, staggerContainer } from "@/lib/utils";

export function AboutClient() {
  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden">
      <ActiveGrid />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* LEFT COLUMN */}
          <AnimatedSection variants={fadeInLeft} className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-cyan mb-2">
                <span className="h-px w-8 bg-cyan/50"></span>
                <span className="font-mono text-xs tracking-widest uppercase text-cyan/70">Identity Record</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                <DecryptedText text="About Me" />
              </h1>
            </div>

            <HUDFrame className="p-6 md:p-8 bg-zinc-900/50 backdrop-blur-sm">
              <p className="text-lg text-zinc-300 leading-relaxed">
                Hey, I&apos;m <span className="text-white font-semibold">Raouf</span>.
              </p>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                I&apos;m a cybersecurity student at <span className="text-cyan">Macquarie University</span> building production-grade security tools and exploring the intersection of AI and security. Currently in my final year with a <span className="text-white">76+ WAM</span>, specializing in offensive security, digital forensics, and applied cryptography.
              </p>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                I&apos;ve spent 4+ years in IT support solving real-world technical problems, and now I&apos;m channeling that experience into creating secure, reliable applications. My projects like <span className="text-cyan">MehrGuard</span> (offline security scanner) and contributions to Syllabus Sync showcase my commitment to security-first development.
              </p>
            </HUDFrame>

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                <Terminal className="w-5 h-5 text-cyan" />
                <h2 className="text-2xl font-bold text-white">What I Do</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                I build tools that matter. Whether it&apos;s automating security workflows, analyzing vulnerabilities, or creating user-focused applications, I approach every project with a methodical, security-aware mindset.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 border border-white/5 bg-white/5 rounded-sm hover:border-cyan/30 transition-colors group">
                  <div className="flex items-center gap-2 mb-2 text-zinc-200 font-mono text-sm group-hover:text-cyan">
                    <Cpu className="w-4 h-4" /> Tech Stack
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">Python, JavaScript/TypeScript, C/C++</p>
                </div>
                <div className="p-4 border border-white/5 bg-white/5 rounded-sm hover:border-cyan/30 transition-colors group">
                  <div className="flex items-center gap-2 mb-2 text-zinc-200 font-mono text-sm group-hover:text-cyan">
                    <Network className="w-4 h-4" /> Environments
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">Linux/Windows, Cloud Arch, Mobile Dev</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                <Shield className="w-5 h-5 text-cyan" />
                <h2 className="text-2xl font-bold text-white">What Drives Me</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                I&apos;m fascinated by how systems break and how to make them unbreakable. From red teaming to incident response, I love the challenge of thinking like an attacker to build better defenses.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Based in <span className="text-white">Sydney</span>, I&apos;m seeking opportunities in SOC operations, cloud security, or systems engineering where I can apply my skills to real-world security challenges.
              </p>
            </div>

            <div className="pt-4">
              <NeonButton href="/contact" variant="primary">
                Let&apos;s Connect
              </NeonButton>
            </div>
          </AnimatedSection>

          {/* RIGHT COLUMN */}
          <AnimatedSection variants={fadeInRight} delay={0.2} className="lg:col-span-5 space-y-8">
            <motion.div className="relative group" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
              <div className="absolute -inset-0.5 bg-gradient-to-b from-cyan/50 to-transparent opacity-50 blur-sm group-hover:opacity-100 transition-opacity duration-500"></div>
              <HUDFrame className="relative bg-zinc-900 overflow-hidden aspect-[4/5] w-full">
                <Image src="/Raouf_2.jpg" alt="Mohammad Raouf Abedini" fill className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale hover:grayscale-0" priority />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="font-mono text-xs text-cyan/80">
                    <div className="flex flex-col">
                      <span>SUBJECT: RAOUF.M</span>
                      <span>ID: SEC-01-2026</span>
                      <span>STATUS: ACTIVE</span>
                    </div>
                  </div>
                  <div className="h-8 w-8 border border-cyan/30 flex items-center justify-center">
                    <div className="w-1 h-1 bg-cyan animate-ping"></div>
                  </div>
                </div>
              </HUDFrame>
            </motion.div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div variants={fadeInUp} className="border border-white/10 p-3 bg-zinc-900/50 hover:border-amber/30 transition-colors">
                <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Experience</div>
                <div className="text-2xl font-bold text-white font-mono">4+ <span className="text-amber text-sm">YRS</span></div>
              </motion.div>
              <motion.div variants={fadeInUp} className="border border-white/10 p-3 bg-zinc-900/50 hover:border-purple/30 transition-colors">
                <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Academics</div>
                <div className="text-2xl font-bold text-white font-mono">76+ <span className="text-purple text-sm">WAM</span></div>
              </motion.div>
            </motion.div>
          </AnimatedSection>
        </div>
      </main>
    </div>
  );
}
