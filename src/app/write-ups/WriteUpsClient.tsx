"use client";

import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { writeups } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/utils";

export function WriteUpsClient() {
  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden">
      <ActiveGrid />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection variants={fadeInUp}>
          <div className="mb-12">
            <div className="flex items-center space-x-2 text-cyan mb-2">
              <Lock className="w-4 h-4" />
              <span className="font-mono text-xs tracking-widest uppercase text-cyan/70">Classified Archive</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              <DecryptedText text="Write-ups" />
            </h1>
            <p className="text-zinc-400 max-w-2xl">
              Technical analysis, CTF solutions, and engineering logs.
              <br/>
              <span className="text-xs font-mono text-zinc-600"> CLEARANCE_LEVEL: PUBLIC</span>
            </p>
          </div>
        </AnimatedSection>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="space-y-4">
          {writeups.map((post) => (
            <motion.div key={post.slug} variants={fadeInUp}>
              <Link href={`/write-ups/${post.slug}`} className="block group">
                <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                  <HUDFrame className="p-6 bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-cyan/50 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
                          <span className="text-cyan">{post.date}</span>
                          <span>|</span>
                          <span className="px-1.5 py-0.5 bg-white/5 rounded text-zinc-400">{post.tag}</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-cyan transition-colors">{post.title}</h2>
                        <p className="text-zinc-400 max-w-2xl">{post.takeaway}</p>
                      </div>
                      <div className="flex items-center text-zinc-600 group-hover:text-cyan transition-colors">
                        <span className="text-xs font-mono mr-2 hidden md:inline-block">READ_FILE</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </HUDFrame>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
