"use client";

import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Trophy, Shield, Mail, Users } from "lucide-react";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/utils";
import { motion } from "framer-motion";

export function HallOfFameClient() {
  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden">
      <ActiveGrid />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection variants={fadeInUp}>
          <div className="mb-12">
            <div className="flex items-center space-x-2 text-cyan mb-2">
              <Trophy className="w-4 h-4" />
              <span className="font-mono text-xs tracking-widest uppercase text-cyan/70">Recognition</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              <DecryptedText text="Hall of Fame" />
            </h1>
            <p className="text-zinc-400 max-w-2xl">Recognizing security researchers who have helped improve the security of my projects through responsible disclosure.</p>
          </div>
        </AnimatedSection>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} className="space-y-8">
          <AnimatedSection variants={fadeInUp}>
            <HUDFrame className="p-6 md:p-8 bg-cyan-500/5 border-l-4 border-l-cyan">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Shield className="w-5 h-5 text-cyan" /> Found a Vulnerability?</h2>
                  <p className="text-zinc-400">Report it responsibly and get recognized here. Check my{" "}<Link href="/security-policy" className="text-cyan hover:underline">security policy</Link>{" "}for guidelines.</p>
                </div>
                <NeonButton href="mailto:raoof.r12@gmail.com" variant="primary"><Mail className="w-4 h-4 mr-2" /> REPORT</NeonButton>
              </div>
            </HUDFrame>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <HUDFrame className="p-12 bg-zinc-900/50 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700"><Users className="w-8 h-8 text-zinc-600" /></div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">No Entries Yet</h3>
                    <p className="text-zinc-500 max-w-md mx-auto">This page is waiting for its first security researcher. Find a vulnerability, report it responsibly, and become the first to be recognized.</p>
                  </div>
                  <div className="pt-4"><span className="inline-flex items-center text-xs font-mono text-zinc-600 bg-zinc-800/50 px-3 py-1 rounded-full">AWAITING_FIRST_ENTRY</span></div>
                </div>
              </HUDFrame>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2"><span className="text-cyan font-mono">01.</span> Recognition Criteria</h2>
              <HUDFrame className="p-6 bg-zinc-900/50">
                <p className="text-zinc-400 mb-4">To be listed in the Hall of Fame, researchers must:</p>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2"><span className="text-cyan mt-0.5">1.</span><span>Report a valid, in-scope security vulnerability</span></li>
                  <li className="flex items-start gap-2"><span className="text-cyan mt-0.5">2.</span><span>Follow responsible disclosure guidelines</span></li>
                  <li className="flex items-start gap-2"><span className="text-cyan mt-0.5">3.</span><span>Allow reasonable time for the issue to be fixed</span></li>
                  <li className="flex items-start gap-2"><span className="text-cyan mt-0.5">4.</span><span>Not publicly disclose the vulnerability before coordination</span></li>
                </ul>
              </HUDFrame>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <HUDFrame className="p-6 bg-zinc-900/50 border-l-4 border-l-amber">
                <p className="text-zinc-400 text-sm"><span className="text-amber font-bold">Note:</span> This is a personal portfolio project. While I deeply appreciate security research efforts, no monetary bounties are offered. Recognition in this Hall of Fame is the primary acknowledgment for valid reports.</p>
              </HUDFrame>
            </section>
          </AnimatedSection>
        </motion.div>
      </main>
    </div>
  );
}
