"use client";

import { NeonButton } from "@/components/ui/NeonButton";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import {
  ArrowRight, Download, Terminal, Code2, Shield,
  Github, ExternalLink,
} from "lucide-react";
import { projects, writeups } from "@/lib/data";
import { motion } from "framer-motion";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from "@/lib/utils";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { TerminalFeed } from "@/components/ui/TerminalFeed";

/* ─── Constants ──────────────────────────────────────────────────────── */

const TICKER = [
  "SYSTEM ONLINE", "70+ PROJECTS SHIPPED", "1,000+ USERS SERVED",
  "CASTLE HILL · NSW · AU", "LLM RED TEAMING", "ESSENTIAL EIGHT COMPLIANCE",
  "KOTLIN MULTIPLATFORM", "SOC AUTOMATION", "ACTIVE DIRECTORY LABS",
  "OFFENSIVE SECURITY", "AWS · AZURE · GCP", "WAM 76+", "NOV 2026 GRADUATE",
  "THREAT INTELLIGENCE", "ZERO TRUST ARCHITECTURE",
];

const CATEGORY_STYLE: Record<string, { dot: string; badge: string; hover: string; corner: string }> = {
  DEFENSIVE:   { dot: "bg-cyan",   badge: "text-cyan border-cyan/25 bg-cyan/5",     hover: "hover:border-cyan/30",   corner: "border-cyan/20 group-hover:border-cyan/50"   },
  ENGINEERING: { dot: "bg-purple", badge: "text-purple border-purple/25 bg-purple/5", hover: "hover:border-purple/30", corner: "border-purple/20 group-hover:border-purple/50" },
  OFFENSIVE:   { dot: "bg-amber",  badge: "text-amber border-amber/25 bg-amber/5",   hover: "hover:border-amber/30",  corner: "border-amber/20 group-hover:border-amber/50"  },
};

/* ─── Bento Card ─────────────────────────────────────────────────────── */

function BentoCard({
  slug, accentHover, cornerClass, children,
}: {
  slug: string;
  accentHover: string;
  cornerClass: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`group relative p-6 border border-white/8 bg-zinc-900/40 hover:bg-zinc-900/70 ${accentHover} transition-all duration-300`}
      whileHover={{ y: -3 }}
    >
      {children}
      {/* HUD corner markers */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t border-l ${cornerClass} transition-colors`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r ${cornerClass} transition-colors`} />
      <Link
        href={`/projects/${slug}`}
        className="absolute inset-0"
        aria-label={`View ${slug} case study`}
      />
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO — Orbital Command Center
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Orbital rings */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-end pr-0 lg:pr-24">
          {[780, 580, 400, 240].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                border: `1px ${i % 2 === 0 ? "dashed" : "solid"} ${
                  i % 2 === 0 ? "rgba(6,182,212,0.07)" : "rgba(139,92,246,0.05)"
                }`,
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 28 + i * 12, repeat: Infinity, ease: "linear" }}
            />
          ))}
          {/* Radar pulses */}
          {[0, 1.4, 2.8].map((delay) => (
            <motion.div
              key={delay}
              className="absolute rounded-full border border-cyan/8"
              initial={{ width: 40, height: 40, opacity: 0.8 }}
              animate={{ width: 700, height: 700, opacity: 0 }}
              transition={{ duration: 4, repeat: Infinity, delay, ease: "easeOut" }}
            />
          ))}
          {/* Centre pip */}
          <div className="absolute w-2 h-2 rounded-full bg-cyan shadow-[0_0_16px_rgba(6,182,212,0.9)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-16 items-center py-28">

          {/* Left */}
          <div className="space-y-10">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-3 px-4 py-2 border border-cyan/20 bg-cyan/5 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-cyan opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-cyan" />
              </span>
              <span className="font-mono text-cyan/80 text-xs tracking-widest uppercase">
                System Online · Castle Hill, NSW
              </span>
            </motion.div>

            {/* Architectural headline */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="font-mono text-[10px] text-zinc-600 tracking-[0.4em] uppercase mb-5">
                Mohammad Raouf Abedini
              </p>
              <div className="space-y-0.5 leading-none">
                {/* Solid fill */}
                <h1 className="text-[clamp(3.5rem,10vw,6rem)] font-bold tracking-tight text-white">
                  <DecryptedText text="CYBER" loopInterval={5000} />
                </h1>
                {/* Outline — 2026 text-stroke effect */}
                <h1
                  className="text-[clamp(3.5rem,10vw,6rem)] font-bold tracking-tight select-none"
                  style={{ WebkitTextStroke: "1.5px rgba(6,182,212,0.45)", color: "transparent" } as React.CSSProperties}
                >
                  SECURITY
                </h1>
                <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-cyan tracking-tight pt-2">
                  + Engineering
                </h2>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="text-zinc-400 text-lg max-w-md leading-relaxed"
            >
              70+ projects. 1,000+ users. Security embedded from{" "}
              <span className="text-zinc-200">design to deployment</span> — across
              mobile, web, and kernel space.
            </motion.p>

            {/* Stat chips */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.58 }}
              className="flex flex-wrap gap-2"
            >
              {["Nov 2026 Graduate", "Macquarie University", "WAM 76+"].map((c) => (
                <span key={c} className="px-3 py-1 border border-white/10 text-zinc-500 font-mono text-xs">
                  {c}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.68 }}
              className="flex flex-wrap gap-4"
            >
              <NeonButton href="/projects" variant="primary">
                <Terminal className="w-4 h-4" /> View Projects
              </NeonButton>
              <NeonButton href="/resume" variant="secondary">
                <Download className="w-4 h-4" /> Resume
              </NeonButton>
            </motion.div>
          </div>

          {/* Right — Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.75 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-px bg-gradient-to-br from-cyan/15 via-transparent to-purple/10 blur-md opacity-60 pointer-events-none" />
            <TerminalFeed />
          </motion.div>
        </div>

        {/* Scroll line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[9px] text-zinc-700 tracking-[0.4em] uppercase">Scroll</span>
          <motion.div
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-px h-10 bg-gradient-to-b from-zinc-600 to-transparent"
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          TICKER — Kinetic strip
      ══════════════════════════════════════════════ */}
      <div className="border-y border-white/8 bg-zinc-950 py-3 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        >
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="font-mono text-[11px] text-zinc-600 tracking-[0.18em] uppercase px-6">
                {item}
              </span>
              <span className="text-cyan/25 text-xs">◆</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════
          BENTO PROJECTS
      ══════════════════════════════════════════════ */}
      <AnimatedSection variants={fadeInUp}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">

          <div className="flex items-end justify-between mb-14 border-b border-white/5 pb-5">
            <div>
              <p className="font-mono text-[10px] text-zinc-600 tracking-[0.3em] uppercase mb-2">
                Deployed Systems
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-cyan font-mono mr-3">01.</span>Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden md:flex items-center gap-2 text-zinc-500 hover:text-cyan transition-colors font-mono text-xs"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Asymmetric 3-col bento */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Mehr Guard — 2 cols */}
            {(() => {
              const p = projects["mehr-guard"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard
                  key={p.slug}
                  slug={p.slug}
                  accentHover={s.hover}
                  cornerClass={s.corner}
                >
                  <div className="md:col-span-2 [grid-column:span_2_/_span_2]">
                    <div className="flex items-start justify-between mb-5">
                      <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                        {p.category}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-600">{p.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-5 max-w-xl">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {p.tags.map((t) => (
                        <span key={t} className="font-mono text-[10px] text-zinc-600 border border-white/8 px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 pointer-events-none">
                      {p.links.demo && (
                        <span className="flex items-center gap-1.5 font-mono text-xs text-zinc-500 group-hover:text-cyan transition-colors pointer-events-auto relative z-10">
                          <ExternalLink className="w-3 h-3" /> Demo
                        </span>
                      )}
                      {p.links.repo && (
                        <a
                          href={p.links.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-cyan transition-colors relative z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-3 h-3" /> Repo
                        </a>
                      )}
                      <span className="ml-auto flex items-center gap-1.5 font-mono text-xs text-zinc-600 group-hover:text-cyan transition-colors">
                        Case Study <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </BentoCard>
              );
            })()}

            {/* PhishPatrol — 1 col (right of mehr-guard) */}
            {(() => {
              const p = projects["phishpatrol"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard key={p.slug} slug={p.slug} accentHover={s.hover} cornerClass={s.corner}>
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-600">{p.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="font-mono text-[10px] text-zinc-600 border border-white/8 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </BentoCard>
              );
            })()}

            {/* GitSwitch */}
            {(() => {
              const p = projects["gitswitch"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard key={p.slug} slug={p.slug} accentHover={s.hover} cornerClass={s.corner}>
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-600">{p.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="font-mono text-[10px] text-zinc-600 border border-white/8 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.links.repo && (
                    <a
                      href={p.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-xs text-zinc-600 hover:text-cyan transition-colors relative z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-3 h-3" /> Repo
                    </a>
                  )}
                </BentoCard>
              );
            })()}

            {/* ECRSM — spans 2 cols on desktop */}
            {(() => {
              const p = projects["ecrsm"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <motion.div
                  key={p.slug}
                  variants={fadeInUp}
                  className={`group relative p-6 border border-white/8 bg-zinc-900/40 hover:bg-zinc-900/70 ${s.hover} transition-all duration-300 md:col-span-2`}
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-600">{p.year}</span>
                  </div>
                  <div className="md:grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-4">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.map((t) => (
                          <span key={t} className="font-mono text-[10px] text-zinc-600 border border-white/8 px-2 py-0.5">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <p className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase mb-3">
                        Security Posture
                      </p>
                      <ul className="space-y-1.5">
                        {p.secure.measures.map((m) => (
                          <li key={m} className="flex items-start gap-2 text-xs text-zinc-500">
                            <span className="text-amber mt-0.5 shrink-0">›</span>
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {p.links.repo && (
                    <a
                      href={p.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 flex items-center gap-1.5 font-mono text-xs text-zinc-600 hover:text-cyan transition-colors relative z-10 w-fit"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-3 h-3" /> Repo
                    </a>
                  )}
                  {/* HUD corners */}
                  <div className={`absolute top-0 left-0 w-4 h-4 border-t border-l ${s.corner} transition-colors`} />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r ${s.corner} transition-colors`} />
                  <Link href={`/projects/${p.slug}`} className="absolute inset-0" aria-label="View ECRSM" />
                </motion.div>
              );
            })()}
          </motion.div>
        </section>
      </AnimatedSection>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ══════════════════════════════════════════════
          PHILOSOPHY — Ghost letter depth trick
      ══════════════════════════════════════════════ */}
      <AnimatedSection variants={fadeInUp}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="flex items-end justify-between mb-14 border-b border-white/5 pb-5">
            <div>
              <p className="font-mono text-[10px] text-zinc-600 tracking-[0.3em] uppercase mb-2">
                Operating Principles
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-cyan font-mono mr-3">02.</span>Philosophy
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-0 border border-white/8">
            <AnimatedSection variants={fadeInLeft} className="border-b md:border-b-0 md:border-r border-white/8">
              <div className="relative p-10 md:p-14 group hover:bg-white/[0.02] transition-colors h-full overflow-hidden">
                {/* Ghost letter */}
                <span
                  className="absolute -top-4 -left-3 text-[10rem] font-bold leading-none select-none pointer-events-none"
                  style={{ color: "rgba(6,182,212,0.04)" } as React.CSSProperties}
                >
                  B
                </span>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-zinc-900 border border-white/8 flex items-center justify-center mb-7 group-hover:border-cyan/40 group-hover:bg-cyan/5 transition-all">
                    <Code2 className="w-5 h-5 text-zinc-400 group-hover:text-cyan transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">BUILD</h3>
                  <p className="text-zinc-400 leading-relaxed mb-7 text-sm max-w-sm">
                    Software should be performant, maintainable, and delightful. Clean architecture, modern patterns, and developer experience — built to last.
                  </p>
                  <ul className="space-y-2 font-mono text-xs text-zinc-600">
                    {["Scalable Architecture", "Performance First", "Type Safety"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="text-cyan">+</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection variants={fadeInRight}>
              <div className="relative p-10 md:p-14 group hover:bg-white/[0.02] transition-colors h-full overflow-hidden">
                {/* Ghost letter */}
                <span
                  className="absolute -top-4 -right-3 text-[10rem] font-bold leading-none select-none pointer-events-none text-right"
                  style={{ color: "rgba(139,92,246,0.04)" } as React.CSSProperties}
                >
                  S
                </span>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-zinc-900 border border-white/8 flex items-center justify-center mb-7 group-hover:border-purple/40 group-hover:bg-purple/5 transition-all">
                    <Shield className="w-5 h-5 text-zinc-400 group-hover:text-purple transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">SECURE</h3>
                  <p className="text-zinc-400 leading-relaxed mb-7 text-sm max-w-sm">
                    Security isn&apos;t an afterthought. Threat modelling, defensible architecture, and safe defaults — applied from day zero.
                  </p>
                  <ul className="space-y-2 font-mono text-xs text-zinc-600">
                    {["Threat Modelling", "Privacy by Design", "Defensive Coding"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="text-purple">+</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </AnimatedSection>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ══════════════════════════════════════════════
          LAB TEASER
      ══════════════════════════════════════════════ */}
      <AnimatedSection variants={fadeInUp}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <HUDFrame className="bg-gradient-to-r from-zinc-900 via-zinc-900/60 to-transparent border-l-4 border-l-cyan p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-amber font-mono text-xs"
                  >
                    ◆
                  </motion.span>
                  <span className="font-mono text-sm tracking-widest uppercase text-white">THE_LAB</span>
                  <span className="font-mono text-[10px] text-zinc-600">/ active_operations</span>
                </div>
                <p className="text-zinc-400 max-w-lg text-sm leading-relaxed">
                  Hands-on security research. Current work:{" "}
                  <span className="text-cyan">Rust</span> keylogger analysis, raw socket sniffing, and{" "}
                  <span className="text-cyan">Go</span> steganography tooling.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["AD Attack Lab", "SOC Automation", "AI Red Team", "ML Anomaly Detection"].map((lab) => (
                    <span key={lab} className="font-mono text-[10px] text-zinc-500 border border-white/8 px-2.5 py-1">
                      {lab}
                    </span>
                  ))}
                </div>
              </div>
              <NeonButton href="/lab" variant="outline" className="shrink-0">
                ENTER_LAB
              </NeonButton>
            </div>
          </HUDFrame>
        </section>
      </AnimatedSection>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ══════════════════════════════════════════════
          WRITE-UPS — Editorial numbered list
      ══════════════════════════════════════════════ */}
      <AnimatedSection variants={fadeInUp}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 pb-36">
          <div className="flex items-end justify-between mb-14 border-b border-white/5 pb-5">
            <div>
              <p className="font-mono text-[10px] text-zinc-600 tracking-[0.3em] uppercase mb-2">
                Technical Writing
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-cyan font-mono mr-3">03.</span>Write-ups
              </h2>
            </div>
            <Link
              href="/write-ups"
              className="hidden md:flex items-center gap-2 text-zinc-500 hover:text-cyan transition-colors font-mono text-xs"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-0"
          >
            {writeups.map((post, i) => (
              <motion.div key={post.slug} variants={fadeInUp}>
                <Link
                  href={`/write-ups/${post.slug}`}
                  className="group flex items-start sm:items-center justify-between gap-6 py-5 px-2 border-b border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all -mx-2 px-2"
                >
                  <div className="flex items-start sm:items-center gap-5 min-w-0">
                    <span className="font-mono text-xs text-zinc-700 shrink-0 mt-0.5 sm:mt-0 w-6 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-zinc-300 group-hover:text-white transition-colors truncate">
                        {post.title}
                      </h4>
                      <p className="text-sm text-zinc-600 mt-0.5 hidden sm:block">{post.takeaway}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden md:block font-mono text-[10px] text-zinc-600 border border-white/8 px-2 py-0.5 uppercase tracking-wider">
                      {post.tag}
                    </span>
                    <span className="font-mono text-xs text-zinc-600 tabular-nums">{post.date}</span>
                    <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-cyan transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </AnimatedSection>

    </div>
  );
}
