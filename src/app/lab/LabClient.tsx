"use client";

import Link from "next/link";
import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlowCard } from "@/components/ui/GlowCard";
import { labExperiments } from "@/lib/data";
import { AlertTriangle, Beaker, GitBranch, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/utils";

export function LabClient() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-screen pt-24 pb-12"
    >
      <ActiveGrid />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <AnimatedSection variants={fadeInUp}>
          <div className="mb-12">
            <div className="flex items-center space-x-2 text-cyan mb-2">
              <Beaker className="w-4 h-4" />
              <span className="font-mono text-xs tracking-widest uppercase text-cyan/70">Experimental Division</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              <DecryptedText text="The Lab" />
            </h1>
            <p className="text-text-body max-w-2xl">
              A collection of <span className="text-cyan">Proof of Concepts</span>, snippets, and unfinished research.
              Code here is volatile and provided &quot;as is&quot; for educational purposes.
            </p>
          </div>
        </AnimatedSection>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labExperiments.map((exp) => (
            <motion.div key={exp.id} variants={fadeInUp}>
              <GlowCard
                glowColor={exp.status === 'ACTIVE' ? 'cyan' : exp.status === 'CONCEPT' ? 'amber' : 'purple'}
                className="p-6 group hover:bg-cyber-gray/50 transition-colors h-full flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="font-mono text-xs text-text-meta">ID: {exp.id}</div>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border ${
                    exp.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                    exp.status === 'CONCEPT' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                    'bg-cyber-gray text-text-body border-cyan/15'
                  }`}>
                    {exp.status}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">{exp.title}</h3>
                <p className="text-text-body text-sm leading-relaxed mb-6 flex-grow">{exp.description}</p>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map(t => (
                      <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 bg-cyan/5 text-text-body rounded">{t}</span>
                    ))}
                  </div>
                  <Link href={`/lab/${exp.id}`} className="flex items-center text-xs font-mono text-cyan hover:underline decoration-dotted">
                    VIEW_ANALYSIS <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </GlowCard>
            </motion.div>
          ))}

          <motion.div variants={fadeInUp}>
            <a
              href="https://github.com/Raoof128"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-dashed border-cyber-gray rounded-lg p-6 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 hover:border-cyan/30 transition-all h-full group cursor-pointer block"
            >
              <div className="w-10 h-10 rounded-full bg-cyber-gray group-hover:bg-cyan/10 flex items-center justify-center mb-3 transition-colors">
                <GitBranch className="w-5 h-5 text-text-body group-hover:text-cyan transition-colors" />
              </div>
              <p className="text-sm text-text-body font-mono group-hover:text-cyan transition-colors">View more on GitHub</p>
            </a>
          </motion.div>
        </motion.div>

        <div className="mt-16 border-t border-cyan/10 pt-8 flex items-center justify-center gap-2 text-xs text-text-meta font-mono">
          <AlertTriangle className="w-3 h-3 text-yellow-600/50" />
          <span>USE_CODE_AT_OWN_RISK</span>
        </div>
      </div>
    </motion.div>
  );
}
