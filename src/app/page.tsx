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
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerContainerSlow } from "@/lib/utils";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { TerminalFeed } from "@/components/ui/TerminalFeed";
import { ParticleNetwork } from "@/components/ui/ParticleNetwork";

/* ─── Constants ──────────────────────────────────────────────────────── */

const TICKER = [
  "SYSTEM ONLINE", "AI SECURITY RESEARCH", "VULNERABILITY RESEARCH",
  "RESPONSIBLE DISCLOSURE", "CROSS-PLATFORM EXPLOIT DEVELOPMENT",
  "LLM SECURITY EVALUATION", "AI SAFETY", "ANTHROPIC AI EVALUATOR",
  "PYTHON & SYSTEMS PROGRAMMING", "REDUCING CATASTROPHIC AI RISKS",
  "THE INVISIBLE WINDOW", "70+ PROJECTS SHIPPED", "OFFENSIVE SECURITY",
  "DUAL-USE RISK ASSESSMENT", "CASTLE HILL · NSW · AU",
];

const CATEGORY_STYLE: Record<string, { dot: string; badge: string; hover: string; corner: string; tint: string; prefix: string }> = {
  DEFENSIVE:   { dot: "bg-cyan",   badge: "text-cyan border-cyan/30 bg-cyan/8",     hover: "hover:border-cyan/30",   corner: "border-cyan/25 group-hover:border-cyan/60",   tint: "hover:bg-cyan/[0.04]",   prefix: "SEC" },
  ENGINEERING: { dot: "bg-purple", badge: "text-purple border-purple/30 bg-purple/8", hover: "hover:border-purple/30", corner: "border-purple/25 group-hover:border-purple/60", tint: "hover:bg-purple/[0.04]", prefix: "SYS" },
  OFFENSIVE:   { dot: "bg-amber",  badge: "text-amber border-amber/30 bg-amber/8",   hover: "hover:border-amber/30",  corner: "border-amber/25 group-hover:border-amber/60",  tint: "hover:bg-amber/[0.04]",  prefix: "OPS" },
};

/* ─── Bento Card ─────────────────────────────────────────────────────── */

function BentoCard({
  slug, accentHover, cornerClass, tint, className, children, glowPulse,
}: {
  slug: string;
  accentHover: string;
  cornerClass: string;
  tint?: string;
  className?: string;
  children: React.ReactNode;
  glowPulse?: boolean;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`group relative p-6 border border-cyan/10 bg-[#06080d]/60 hover:shadow-[0_8px_32px_rgba(167,139,250,0.12)] ${accentHover} ${tint ?? ""} transition-all duration-300 cursor-pointer${className ? ` ${className}` : ""}`}
      whileHover={{ y: -6 }}
    >
      {children}
      {/* HUD corner markers */}
      <div className={`absolute top-0 left-0 w-5 h-5 border-t border-l ${cornerClass} transition-colors`} />
      <div className={`absolute bottom-0 right-0 w-5 h-5 border-b border-r ${cornerClass} transition-colors`} />
      {glowPulse && (
        <motion.div
          className="absolute inset-0 -z-10 pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 0px rgba(167,139,250,0)",
              "0 0 30px rgba(167,139,250,0.15), inset 0 0 20px rgba(167,139,250,0.05)",
              "0 0 0px rgba(167,139,250,0)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
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
    <div>

      {/* ══════════════════════════════════════════════
          HERO — Interactive Particle Network
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Interactive particle mesh — mouse-reactive network topology */}
        <ParticleNetwork />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid md:grid-cols-2 gap-12 lg:gap-16 items-center py-20 lg:py-28">

          {/* Left */}
          <div className="space-y-10">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-3 px-4 py-2 border border-cyan/25 bg-cyan/8 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-cyan opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-cyan shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
              </span>
              <span className="font-mono text-cyan/80 text-xs tracking-widest uppercase">
                System Online · Castle Hill, NSW
              </span>
            </motion.div>

            {/* Architectural headline — clip-path reveal */}
            <motion.div
              initial={{ opacity: 0, y: 32, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-mono text-[10px] text-text-meta tracking-[0.4em] uppercase mb-5">
                Mohammad Raouf Abedini
              </p>
              <div className="space-y-0.5 leading-none">
                {/* Solid fill */}
                <h1 className="text-[clamp(3.5rem,10vw,6rem)] font-bold tracking-tight text-white">
                  <DecryptedText text="AI +" loopInterval={12000} />
                </h1>
                {/* Outline — 2026 text-stroke effect */}
                <h1
                  className="text-[clamp(3.5rem,10vw,6rem)] font-bold tracking-tight select-none"
                  style={{ WebkitTextStroke: "1.5px rgba(167,139,250,0.7)", color: "transparent" } as React.CSSProperties}
                >
                  CYBER
                </h1>
                <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-cyan tracking-tight pt-2">
                  Research
                </h2>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="text-text-body text-lg max-w-md leading-relaxed"
            >
              <span className="text-cyan italic text-sm block mb-2" style={{ animation: "text-blink 6s ease-in-out infinite" }}>{`"Seek, and ye shall find" — Matthew 7:7`}</span>
              Independently discovering, validating, and responsibly disclosing cross-platform vulnerabilities.{" "}
              Authored <span className="text-foreground">&ldquo;The Invisible Window&rdquo;</span> &mdash; 100% screen capture evasion.
              Motivated by reducing catastrophic risks from advanced AI.
            </motion.p>

            {/* Stat chips — staggered entrance */}
            <motion.div
              variants={staggerContainerSlow}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2"
            >
              {["Anthropic AI Evaluator", "Vulnerability Researcher", "Macquarie University · Nov 2026"].map((c) => (
                <motion.span key={c} variants={fadeInUp} className="px-3 py-1 border border-cyan/12 text-text-meta font-mono text-xs">
                  {c}
                </motion.span>
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
            className="hidden md:block relative"
          >
            <div className="absolute -inset-px bg-gradient-to-br from-cyan/15 via-transparent to-purple/10 blur-md opacity-60 pointer-events-none" />
            <TerminalFeed />
          </motion.div>
        </div>

        {/* Scroll line + verse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[9px] text-text-meta tracking-[0.4em] uppercase">Scroll</span>
          <motion.div
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-px h-10 bg-gradient-to-b from-cyan/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          TICKER — Kinetic strip
      ══════════════════════════════════════════════ */}
      <div className="border-y border-cyan/10 bg-[#040610] py-3 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        >
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="font-mono text-[11px] text-text-meta tracking-[0.18em] uppercase px-6">
                {item}
              </span>
              <span className="text-cyan/50 text-xs">◆</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════
          BENTO PROJECTS
      ══════════════════════════════════════════════ */}
      <AnimatedSection variants={fadeInUp}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">

          <div className="flex items-end justify-between mb-10 md:mb-14 border-b border-cyan/10 pb-5">
            <div>
              <p className="font-mono text-[10px] text-text-meta tracking-[0.3em] uppercase mb-2">
                Deployed Systems
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-cyan font-mono mr-3 text-glow"><DecryptedText text="01." /></span>Projects
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="font-mono text-[9px] text-text-meta tracking-widest opacity-60" aria-hidden="true">SEC:01.003</span>
              <Link
                href="/projects"
                className="flex items-center gap-2 text-text-body hover:text-cyan transition-colors font-mono text-xs"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Asymmetric 3-col bento */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Invisible Window Research — full width hero */}
            {(() => {
              const p = projects["invisible-window-research"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard
                  key={p.slug}
                  slug={p.slug}
                  accentHover={s.hover}
                  cornerClass={s.corner}
                  tint={s.tint}
                  className="md:col-span-3"
                  glowPulse
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase self-start`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-cyan border border-cyan/30 px-2 py-0.5 tracking-widest">PEER-REVIEWED PAPER</span>
                      <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan transition-colors max-w-2xl">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-5 max-w-3xl">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.tags.map((t) => (
                      <span key={t} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 pointer-events-none">
                    {p.links.repo && (
                      <a
                        href={p.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-xs text-text-body hover:text-cyan transition-colors relative z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-3 h-3" /> Repo
                      </a>
                    )}
                    <span className="ml-auto flex items-center gap-1.5 font-mono text-xs text-text-meta group-hover:text-cyan transition-colors">
                      Case Study <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </BentoCard>
              );
            })()}

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
                  tint={s.tint}
                  className="md:col-span-2"
                >
                  <div className="flex items-start justify-between mb-5">
                      <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                        [{s.prefix}] {p.category}
                      </span>
                      <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-text-body leading-relaxed mb-5 max-w-xl">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {p.tags.map((t) => (
                        <span key={t} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 pointer-events-none">
                      {p.links.demo && (
                        <span className="flex items-center gap-1.5 font-mono text-xs text-text-body group-hover:text-cyan transition-colors pointer-events-auto relative z-10">
                          <ExternalLink className="w-3 h-3" /> Demo
                        </span>
                      )}
                      {p.links.repo && (
                        <a
                          href={p.links.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono text-xs text-text-body hover:text-cyan transition-colors relative z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-3 h-3" /> Repo
                        </a>
                      )}
                      <span className="ml-auto flex items-center gap-1.5 font-mono text-xs text-text-meta group-hover:text-cyan transition-colors">
                        Case Study <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                </BentoCard>
              );
            })()}

            {/* Syllabus Sync — 1 col (right of mehr-guard) */}
            {(() => {
              const p = projects["syllabus-sync"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard key={p.slug} slug={p.slug} accentHover={s.hover} cornerClass={s.corner} tint={s.tint}>
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.links.repo && (
                    <a
                      href={p.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-xs text-text-meta hover:text-cyan transition-colors relative z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-3 h-3" /> Repo
                    </a>
                  )}
                </BentoCard>
              );
            })()}

            {/* GitSwitch */}
            {(() => {
              const p = projects["gitswitch"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard key={p.slug} slug={p.slug} accentHover={s.hover} cornerClass={s.corner} tint={s.tint}>
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.links.repo && (
                    <a
                      href={p.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-xs text-text-meta hover:text-cyan transition-colors relative z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-3 h-3" /> Repo
                    </a>
                  )}
                </BentoCard>
              );
            })()}

            {/* Nexus Archive */}
            {(() => {
              const p = projects["nexus-archive"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard key={p.slug} slug={p.slug} accentHover={s.hover} cornerClass={s.corner} tint={s.tint}>
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.links.repo && (
                    <a
                      href={p.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-xs text-text-meta hover:text-cyan transition-colors relative z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-3 h-3" /> Repo
                    </a>
                  )}
                </BentoCard>
              );
            })()}

            {/* NanoMatch */}
            {(() => {
              const p = projects["nanomatch"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard key={p.slug} slug={p.slug} accentHover={s.hover} cornerClass={s.corner} tint={s.tint}>
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.links.repo && (
                    <a
                      href={p.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-xs text-text-meta hover:text-cyan transition-colors relative z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-3 h-3" /> Repo
                    </a>
                  )}
                </BentoCard>
              );
            })()}

            {/* SentinelFlow */}
            {(() => {
              const p = projects["sentinelflow"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard key={p.slug} slug={p.slug} accentHover={s.hover} cornerClass={s.corner} tint={s.tint}>
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.links.repo && (
                    <a
                      href={p.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-xs text-text-meta hover:text-cyan transition-colors relative z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-3 h-3" /> Repo
                    </a>
                  )}
                </BentoCard>
              );
            })()}

            {/* SimurghForge — 2 cols */}
            {(() => {
              const p = projects["simurghforge"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard
                  key={p.slug}
                  slug={p.slug}
                  accentHover={s.hover}
                  cornerClass={s.corner}
                  tint={s.tint}
                  className="md:col-span-2"
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-5 max-w-xl">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.tags.map((t) => (
                      <span key={t} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 pointer-events-none">
                    {p.links.repo && (
                      <a
                        href={p.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-xs text-text-body hover:text-cyan transition-colors relative z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-3 h-3" /> Repo
                      </a>
                    )}
                    <span className="ml-auto flex items-center gap-1.5 font-mono text-xs text-text-meta group-hover:text-cyan transition-colors">
                      Case Study <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </BentoCard>
              );
            })()}

            {/* Aion */}
            {(() => {
              const p = projects["aion"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard key={p.slug} slug={p.slug} accentHover={s.hover} cornerClass={s.corner} tint={s.tint}>
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.links.repo && (
                    <a
                      href={p.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-xs text-text-meta hover:text-cyan transition-colors relative z-10"
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
                  className={`group relative p-6 border border-cyan/10 bg-[#06080d]/60 hover:bg-cyan/[0.04] hover:shadow-[0_8px_32px_rgba(167,139,250,0.12)] ${s.hover} transition-all duration-300 md:col-span-2 cursor-pointer`}
                  whileHover={{ y: -6 }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                  </div>
                  <div className="md:grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-sm text-text-body leading-relaxed mb-4">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.map((t) => (
                          <span key={t} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <p className="font-mono text-[10px] text-text-meta tracking-widest uppercase mb-3">
                        Security Posture
                      </p>
                      <ul className="space-y-1.5">
                        {p.secure.measures.map((m) => (
                          <li key={m} className="flex items-start gap-2 text-xs text-text-body">
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
                      className="mt-5 flex items-center gap-1.5 font-mono text-xs text-text-meta hover:text-cyan transition-colors relative z-10 w-fit"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-3 h-3" /> Repo
                    </a>
                  )}
                  {/* HUD corners */}
                  <div className={`absolute top-0 left-0 w-5 h-5 border-t border-l ${s.corner} transition-colors`} />
                  <div className={`absolute bottom-0 right-0 w-5 h-5 border-b border-r ${s.corner} transition-colors`} />
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
          <div className="flex items-end justify-between mb-10 md:mb-14 border-b border-cyan/10 pb-5">
            <div>
              <p className="font-mono text-[10px] text-text-meta tracking-[0.3em] uppercase mb-2">
                Operating Principles
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-cyan font-mono mr-3 text-glow"><DecryptedText text="02." /></span>Philosophy
              </h2>
            </div>
            <span className="hidden md:block font-mono text-[9px] text-text-meta tracking-widest opacity-60" aria-hidden="true">SEC:02.001</span>
          </div>

          <div className="grid md:grid-cols-2 gap-0 border border-cyan/10">
            <AnimatedSection variants={fadeInLeft} className="border-b md:border-b-0 md:border-r border-cyan/10">
              <div className="relative p-10 md:p-14 group hover:bg-cyan/[0.03] transition-colors h-full overflow-hidden">
                {/* Ghost letter */}
                <motion.span
                  initial={{ scale: 0.3, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -top-4 -left-3 text-[10rem] font-bold leading-none select-none pointer-events-none"
                  style={{ color: "rgba(167,139,250,0.07)" } as React.CSSProperties}
                >
                  B
                </motion.span>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-cyber-dark border border-cyan/15 flex items-center justify-center mb-7 group-hover:border-cyan/40 group-hover:bg-cyan/8 transition-all">
                    <Code2 className="w-5 h-5 text-text-body group-hover:text-cyan transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">RESEARCH</h3>
                  <p className="text-text-body leading-relaxed mb-7 text-sm max-w-sm">
                    Independently discover, validate, and responsibly disclose vulnerabilities. Measure AI capability uplift, characterise safety boundaries, and publish reproducible findings.
                  </p>
                  <ul className="space-y-2 font-mono text-xs text-text-meta">
                    {["Vulnerability Research & Disclosure", "AI Safety & LLM Evaluation", "Dual-Use Risk Assessment"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="text-cyan">+</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection variants={fadeInRight}>
              <div className="relative p-10 md:p-14 group hover:bg-purple/[0.03] transition-colors h-full overflow-hidden">
                {/* Ghost letter */}
                <motion.span
                  initial={{ scale: 0.3, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                  className="absolute -top-4 -right-3 text-[10rem] font-bold leading-none select-none pointer-events-none text-right"
                  style={{ color: "rgba(16,185,129,0.07)" } as React.CSSProperties}
                >
                  S
                </motion.span>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-cyber-dark border border-purple/15 flex items-center justify-center mb-7 group-hover:border-purple/40 group-hover:bg-purple/8 transition-all">
                    <Shield className="w-5 h-5 text-text-body group-hover:text-purple transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">SECURE</h3>
                  <p className="text-text-body leading-relaxed mb-7 text-sm max-w-sm">
                    Defensive applications that reduce real-world risk. Cross-platform exploit development informs better defences — offensive knowledge applied to protective systems.
                  </p>
                  <ul className="space-y-2 font-mono text-xs text-text-meta">
                    {["Cross-Platform Exploit Development", "Responsible Disclosure (OWASP/FIRST/CISA)", "Defensive Applications"].map((item) => (
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
          <HUDFrame className="bg-gradient-to-r from-cyber-dark via-cyber-dark/60 to-transparent border-l-4 border-l-amber p-8 md:p-12">
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
                  <span className="font-mono text-[10px] text-text-meta">/ active_operations</span>
                </div>
                <p className="text-text-body max-w-lg text-sm leading-relaxed">
                  Hands-on vulnerability research and AI safety experimentation. Current work:{" "}
                  <span className="text-cyan">cross-platform exploit development</span>, AI capability uplift measurement, and{" "}
                  <span className="text-cyan">safety boundary characterisation</span>.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Vulnerability Research", "AI Safety", "Exploit Development", "Responsible Disclosure"].map((lab) => (
                    <span key={lab} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2.5 py-1">
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 pb-20 md:pb-36">
          <div className="flex items-end justify-between mb-10 md:mb-14 border-b border-cyan/10 pb-5">
            <div>
              <p className="font-mono text-[10px] text-text-meta tracking-[0.3em] uppercase mb-2">
                Technical Writing
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-cyan font-mono mr-3 text-glow"><DecryptedText text="03." /></span>Write-ups
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="font-mono text-[9px] text-text-meta tracking-widest opacity-60" aria-hidden="true">SEC:03.007</span>
              <Link
                href="/write-ups"
                className="flex items-center gap-2 text-text-body hover:text-cyan transition-colors font-mono text-xs"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
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
                  className="group flex items-start sm:items-center justify-between gap-6 py-5 px-2 border-b border-cyan/8 hover:border-cyan/20 hover:bg-cyan/[0.03] transition-all -mx-2 px-2"
                >
                  <div className="flex items-start sm:items-center gap-5 min-w-0">
                    <span className="font-mono text-xs text-text-meta shrink-0 mt-0.5 sm:mt-0 w-6 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-slate-300 group-hover:text-white transition-colors truncate">
                        {post.title}
                      </h4>
                      <p className="text-sm text-text-body mt-0.5 hidden sm:block">{post.takeaway}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden md:block font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5 uppercase tracking-wider">
                      {post.tag}
                    </span>
                    <span className="font-mono text-xs text-text-meta tabular-nums">{post.date}</span>
                    <ArrowRight className="w-4 h-4 text-cyan/30 group-hover:text-cyan transition-colors" />
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
