"use client";

import { NeonButton } from "@/components/ui/NeonButton";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import {
  ArrowRight, Download, Terminal, Code2, Shield,
  Github, ExternalLink,
} from "lucide-react";
import { projects, writeups, getProjectDescription } from "@/lib/data";
import { motion } from "framer-motion";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerContainerSlow } from "@/lib/utils";
import { DecryptedText } from "@/components/ui/DecryptedText";
import dynamic from "next/dynamic";
const SingularityCanvas = dynamic(() => import("@/components/ui/SingularityCanvas").then(m => ({ default: m.SingularityCanvas })), { ssr: false });
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { cn } from "@/lib/utils";

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
  slug, accentHover, cornerClass, tint, className, children, glowPulse, locale,
}: {
  slug: string;
  accentHover: string;
  cornerClass: string;
  tint?: string;
  className?: string;
  children: React.ReactNode;
  glowPulse?: boolean;
  locale: string;
}) {
  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  return (
    <motion.div
      variants={fadeInUp}
      className={`group relative p-6 border border-cyan/10 bg-[#030712]/60 hover:shadow-[0_8px_32px_rgba(0,245,255,0.12)] ${accentHover} ${tint ?? ""} transition-all duration-300 cursor-pointer${className ? ` ${className}` : ""}`}
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
              "0 0 0px rgba(0,245,255,0)",
              "0 0 30px rgba(0,245,255,0.15), inset 0 0 20px rgba(0,245,255,0.05)",
              "0 0 0px rgba(0,245,255,0)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <Link
        href={getPath(`/projects/${slug}`)}
        className="absolute inset-0"
        aria-label={`View ${slug} case study`}
      />
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function Home() {
  const { locale, t } = useTranslation();

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  const isRTL = locale === 'fa' || locale === 'ar';

  return (
    <div>

      {/* ══════════════════════════════════════════════
          HERO — Singularity
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden -mt-16 pt-16">

        {/* Singularity canvas — accretion disk black hole animation */}
        <SingularityCanvas />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-28">
          <div className={cn("max-w-2xl space-y-10", isRTL && "mr-0 ml-auto text-right")}>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-3 px-4 py-2 border border-cyan/25 bg-cyan/8 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-cyan opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-cyan shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
              </span>
              <span className="font-mono text-cyan/80 text-xs tracking-widest uppercase">
                {t.hero.system_online}
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
                  <DecryptedText text={t.hero.title_prefix} loopInterval={12000} />
                </h1>
                {/* Outline — text-stroke effect */}
                <h1
                  className="text-[clamp(3.5rem,10vw,6rem)] font-bold tracking-tight select-none"
                  style={{ WebkitTextStroke: "1.5px rgba(0,245,255,0.7)", color: "transparent" } as React.CSSProperties}
                >
                  {t.hero.title_cyber}
                </h1>
                <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-cyan tracking-tight pt-2">
                  {t.hero.title_research}
                </h2>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="text-text-body text-lg max-w-md leading-relaxed"
            >
              <span className="text-cyan italic text-sm block mb-2" style={{ animation: "text-blink 6s ease-in-out infinite" }}>{t.hero.philosophy_quote}</span>
              {t.hero.intro}
            </motion.p>

            {/* Stat chips — staggered entrance */}
            <motion.div
              variants={staggerContainerSlow}
              initial="hidden"
              animate="visible"
              className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}
            >
              {[t.hero.evaluator, t.hero.researcher, t.hero.university].map((c) => (
                <motion.span key={c} variants={fadeInUp} className="px-3 py-1 border border-cyan/12 text-text-meta font-mono text-xs">
                  {c}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.68 }}
              className={cn("flex flex-wrap gap-4", isRTL && "justify-end")}
            >
              <NeonButton href={getPath("/projects")} variant="primary">
                <Terminal className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} /> {t.hero.view_projects}
              </NeonButton>
              <NeonButton href={getPath("/resume")} variant="outline">
                <Download className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} /> {t.hero.view_resume}
              </NeonButton>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none z-20"
        >
          <span className="font-mono text-[9px] text-text-meta tracking-[0.4em] uppercase">Scroll</span>
          <motion.div
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-px h-8 bg-gradient-to-b from-cyan/40 to-transparent"
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
                <span className="text-cyan font-mono mr-3 text-glow"><DecryptedText text="01." /></span>{t.nav.projects.startsWith('/') ? t.nav.projects.substring(1) : t.nav.projects}
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="font-mono text-[9px] text-text-meta tracking-widest opacity-60" aria-hidden="true">SEC:01.003</span>
              <Link
                href={getPath("/projects")}
                className="flex items-center gap-2 text-text-body hover:text-cyan transition-colors font-mono text-xs"
              >
                {t.writeups.view_all} <ArrowRight className={cn("w-3 h-3", isRTL ? "rotate-180" : "")} />
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
                  locale={locale}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase self-start`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-cyan border border-cyan/30 px-2 py-0.5 tracking-widest uppercase">{isRTL ? "مقاله IEEE" : "IEEE-FORMAT PAPER"}</span>
                      <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan transition-colors max-w-2xl">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-5 max-w-3xl">
                    {getProjectDescription(p, locale)}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {p.links.repo && (
                      <a
                        href={p.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-xs text-text-body hover:text-cyan transition-colors relative z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-3 h-3" /> {t.common.repo}
                      </a>
                    )}
                    {p.links.doi && (
                      <a
                        href={p.links.doi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-xs text-text-body hover:text-cyan transition-colors relative z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" /> DOI 10.5281/ZENODO.20195135
                      </a>
                    )}
                    <span className="ml-auto flex items-center gap-1.5 font-mono text-xs text-text-meta group-hover:text-cyan transition-colors">
                      {t.common.case_study} <ArrowRight className={cn("w-3 h-3", isRTL ? "rotate-180" : "")} />
                    </span>
                  </div>
                </BentoCard>
              );
            })()}

            {/* Project Simurgh — connected defensive follow-up */}
            {(() => {
              const p = projects["project-simurgh"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard
                  key={p.slug}
                  slug={p.slug}
                  accentHover={s.hover}
                  cornerClass={s.corner}
                  tint={s.tint}
                  className="md:col-span-3"
                  locale={locale}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase self-start`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[10px] text-cyan border border-cyan/30 px-2 py-0.5 tracking-widest uppercase">{isRTL ? "متصل بـ INVISIBLE WINDOW" : "CONNECTED TO INVISIBLE WINDOW"}</span>
                      <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan transition-colors max-w-2xl">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-5 max-w-3xl">
                    {getProjectDescription(p, locale)}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {p.links.repo && (
                      <a
                        href={p.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-xs text-text-body hover:text-cyan transition-colors relative z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-3 h-3" /> {t.common.repo}
                      </a>
                    )}
                    {p.links.doi && (
                      <a
                        href={p.links.doi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-xs text-text-body hover:text-cyan transition-colors relative z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" /> DOI 10.5281/ZENODO.20195198
                      </a>
                    )}
                    <span className="ml-auto flex items-center gap-1.5 font-mono text-xs text-text-meta group-hover:text-cyan transition-colors">
                      {t.common.case_study} <ArrowRight className={cn("w-3 h-3", isRTL ? "rotate-180" : "")} />
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
                  locale={locale}
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
                      {getProjectDescription(p, locale)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {p.tags.map((tag) => (
                        <span key={tag} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4 pointer-events-none">
                      {p.links.demo && (
                        <a
                          href={p.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono text-xs text-text-body hover:text-cyan transition-colors relative z-10 pointer-events-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" /> Demo
                        </a>
                      )}
                      {p.links.repo && (
                        <a
                          href={p.links.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono text-xs text-text-body hover:text-cyan transition-colors relative z-10 pointer-events-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-3 h-3" /> {t.common.repo}
                        </a>
                      )}
                      <span className="ml-auto flex items-center gap-1.5 font-mono text-xs text-text-meta group-hover:text-cyan transition-colors">
                        {t.common.case_study} <ArrowRight className={cn("w-3 h-3", isRTL ? "rotate-180" : "")} />
                      </span>
                    </div>
                </BentoCard>
              );
            })()}

            {/* Syllabus Sync — 1 col */}
            {(() => {
              const p = projects["syllabus-sync"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard key={p.slug} slug={p.slug} accentHover={s.hover} cornerClass={s.corner} tint={s.tint} locale={locale}>
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-4">{getProjectDescription(p, locale)}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {p.links.repo && (
                      <a
                        href={p.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-xs text-text-meta hover:text-cyan transition-colors relative z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-3 h-3" /> {t.common.repo}
                      </a>
                    )}
                  </div>
                </BentoCard>
              );
            })()}

            {/* GitSwitch */}
            {(() => {
              const p = projects["gitswitch"];
              const s = CATEGORY_STYLE[p.category];
              return (
                <BentoCard key={p.slug} slug={p.slug} accentHover={s.hover} cornerClass={s.corner} tint={s.tint} locale={locale}>
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-4">{getProjectDescription(p, locale)}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {tag}
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
                      <Github className="w-3 h-3" /> {t.common.repo}
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
                <BentoCard key={p.slug} slug={p.slug} accentHover={s.hover} cornerClass={s.corner} tint={s.tint} locale={locale}>
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${s.badge} tracking-widest uppercase`}>
                      [{s.prefix}] {p.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-meta">{p.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed mb-4">{getProjectDescription(p, locale)}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {p.links.repo && (
                      <a
                        href={p.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-xs text-text-body hover:text-cyan transition-colors relative z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-3 h-3" /> {t.common.repo}
                      </a>
                    )}
                  </div>
                </BentoCard>
              );
            })()}

          </motion.div>

          {/* Mobile-only View All CTA */}
          <div className="md:hidden mt-8 flex justify-center">
            <Link
              href={getPath("/projects")}
              className="inline-flex items-center gap-2 border border-cyan/25 bg-cyan/5 px-4 py-2 text-cyan/90 hover:text-cyan hover:border-cyan/60 transition-colors font-mono text-xs tracking-widest uppercase"
            >
              {t.common.view_all_projects} <ArrowRight className={cn("w-3 h-3", isRTL ? "rotate-180" : "")} />
            </Link>
          </div>
        </section>
      </AnimatedSection>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ══════════════════════════════════════════════
          PHILOSOPHY
      ══════════════════════════════════════════════ */}
      <AnimatedSection variants={fadeInUp}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
          <div className="flex items-end justify-between mb-10 md:mb-14 border-b border-cyan/10 pb-5">
            <div>
              <p className="font-mono text-[10px] text-text-meta tracking-[0.3em] uppercase mb-2">
                {t.philosophy.subtitle}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-cyan font-mono mr-3 text-glow"><DecryptedText text="02." /></span>{t.philosophy.title}
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
                  style={{ color: "rgba(0,245,255,0.07)" } as React.CSSProperties}
                >
                  R
                </motion.span>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-cyber-dark border border-cyan/15 flex items-center justify-center mb-7 group-hover:border-cyan/40 group-hover:bg-cyan/8 transition-all">
                    <Code2 className="w-5 h-5 text-text-body group-hover:text-cyan transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{t.philosophy.research_title}</h3>
                  <p className="text-text-body leading-relaxed mb-7 text-sm max-w-sm">
                    {t.philosophy.research_body}
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
                  className={cn("absolute -top-4 text-[10rem] font-bold leading-none select-none pointer-events-none", isRTL ? "-left-3" : "-right-3")}
                  style={{ color: "rgba(139,92,246,0.07)" } as React.CSSProperties}
                >
                  S
                </motion.span>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-cyber-dark border border-purple/15 flex items-center justify-center mb-7 group-hover:border-purple/40 group-hover:bg-purple/8 transition-all">
                    <Shield className="w-5 h-5 text-text-body group-hover:text-purple transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{t.philosophy.secure_title}</h3>
                  <p className="text-text-body leading-relaxed mb-7 text-sm max-w-sm">
                    {t.philosophy.secure_body}
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
          <HUDFrame className={cn("bg-gradient-to-r from-cyber-dark via-cyber-dark/60 to-transparent p-8 md:p-12", isRTL ? "border-r-4 border-r-amber" : "border-l-4 border-l-amber")}>
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
                  <span className="font-mono text-sm tracking-widest uppercase text-white">{t.lab.title}</span>
                  <span className="font-mono text-[10px] text-text-meta">{t.lab.subtitle}</span>
                </div>
                <p className="text-text-body max-w-lg text-sm leading-relaxed">
                  {t.lab.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Vulnerability Research", "AI Safety", "Exploit Development", "Responsible Disclosure"].map((lab) => (
                    <span key={lab} className="font-mono text-[10px] text-text-meta border border-cyan/10 px-2.5 py-1">
                      {lab}
                    </span>
                  ))}
                </div>
              </div>
              <NeonButton href={getPath("/lab")} variant="outline" className="shrink-0">
                {t.lab.enter_lab}
              </NeonButton>
            </div>
          </HUDFrame>
        </section>
      </AnimatedSection>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ══════════════════════════════════════════════
          WRITE-UPS
      ══════════════════════════════════════════════ */}
      <AnimatedSection variants={fadeInUp}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 pb-20 md:pb-36">
          <div className="flex items-end justify-between mb-10 md:mb-14 border-b border-cyan/10 pb-5">
            <div>
              <p className="font-mono text-[10px] text-text-meta tracking-[0.3em] uppercase mb-2">
                {t.writeups.subtitle}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-cyan font-mono mr-3 text-glow"><DecryptedText text="03." /></span>{t.writeups.title}
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="font-mono text-[9px] text-text-meta tracking-widest opacity-60" aria-hidden="true">SEC:03.007</span>
              <Link
                href={getPath("/write-ups")}
                className="flex items-center gap-2 text-text-body hover:text-cyan transition-colors font-mono text-xs"
              >
                {t.writeups.view_all} <ArrowRight className={cn("w-3 h-3", isRTL ? "rotate-180" : "")} />
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
              <motion.div key={post.slug} variants={fadeInUp} className="min-w-0">
                <Link
                  href={getPath(`/write-ups/${post.slug}`)}
                  className="group flex items-start sm:items-center justify-between gap-4 sm:gap-6 py-5 px-2 -mx-2 border-b border-cyan/8 hover:border-cyan/20 hover:bg-cyan/[0.03] transition-all"
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
                    <ArrowRight className={cn("w-4 h-4 text-cyan/30 group-hover:text-cyan transition-colors", isRTL ? "rotate-180" : "")} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile-only View All CTA */}
          <div className="md:hidden mt-8 flex justify-center">
            <Link
              href={getPath("/write-ups")}
              className="inline-flex items-center gap-2 border border-cyan/25 bg-cyan/5 px-4 py-2 text-cyan/90 hover:text-cyan hover:border-cyan/60 transition-colors font-mono text-xs tracking-widest uppercase"
            >
              {t.writeups.view_all} <ArrowRight className={cn("w-3 h-3", isRTL ? "rotate-180" : "")} />
            </Link>
          </div>
        </section>
      </AnimatedSection>

    </div>
  );
}
