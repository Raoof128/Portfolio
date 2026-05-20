"use client";

import { NeonButton } from "@/components/ui/NeonButton"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { RoyalAbyssCanvas } from "@/components/ui/RoyalAbyssCanvas"
import { FireShieldCanvas } from "@/components/ui/FireShieldCanvas"
import { DandelionSpinner } from "@/components/ui/DandelionSpinner"
import { DnaHelixCanvas } from "@/components/ui/DnaHelixCanvas"
import { KineticLotus } from "@/components/ui/KineticLotus"
import { ThemeInjector } from "@/components/ui/ThemeInjector"
import { ArrowLeft, Github, Play, Shield, Code, CheckCircle, ArrowRight, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"
import { fadeInUp, fadeInRight, fadeInLeft } from "@/lib/utils"
import { Project, getProjectFullDescription } from "@/lib/data"
import { useTranslation } from "@/i18n/provider"
import { defaultLocale } from "@/i18n"
import { cn } from "@/lib/utils"

const IW = "invisible-window-research";
const PS = "project-simurgh";
const GS = "gitswitch";
const MG = "mehr-guard";
const SS = "syllabus-sync";

export function ProjectDetailClient({ project, slug }: { project: Project; slug: string }) {
  const { locale, t } = useTranslation();
  const dictionary = t;
  const isIW = slug === IW;
  const isPS = slug === PS;
  const isGS = slug === GS;
  const isMG = slug === MG;
  const isSS = slug === SS;
  const isRTL = locale === 'fa' || locale === 'ar';

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  // Per-page accent theme — content body sections
  const theme = isPS
    ? {
        accent:       "text-orange-400",
        accentSecond: "text-orange-300",
        border:       "border-orange-500/20",
        borderB:      "border-orange-500/30",
        borderSub:    "border-orange-500/15",
        bg:           "bg-orange-500/5",
        hover:        "hover:text-orange-400",
        bullet:       "text-orange-400",
        check:        "text-orange-300",
      }
    : isIW
    ? {
        accent:       "text-[#00A693]",
        accentSecond: "text-[#317873]",
        border:       "border-[#00A693]/20",
        borderB:      "border-[#00A693]/30",
        borderSub:    "border-[#00A693]/15",
        bg:           "bg-[#00A693]/5",
        hover:        "hover:text-[#00A693]",
        bullet:       "text-[#00A693]",
        check:        "text-[#6ffdf2]",
      }
    : isGS
    ? {
        accent:       "text-[#FF4D4D]",
        accentSecond: "text-[#FFD1D1]",
        border:       "border-[#FF4D4D]/20",
        borderB:      "border-[#FF4D4D]/30",
        borderSub:    "border-[#FF4D4D]/15",
        bg:           "bg-[#FF4D4D]/5",
        hover:        "hover:text-[#FF4D4D]",
        bullet:       "text-[#FF4D4D]",
        check:        "text-[#FFD1D1]",
      }
    : isMG
    ? {
        accent:       "text-[#FF007F]",
        accentSecond: "text-[#ff66b2]",
        border:       "border-[#FF007F]/20",
        borderB:      "border-[#FF007F]/30",
        borderSub:    "border-[#FF007F]/15",
        bg:           "bg-[#FF007F]/5",
        hover:        "hover:text-[#FF007F]",
        bullet:       "text-[#FF007F]",
        check:        "text-[#ff66b2]",
      }
    : isSS
    ? {
        accent:       "text-[#d6b265]",
        accentSecond: "text-[#f0c87a]",
        border:       "border-[#d6b265]/20",
        borderB:      "border-[#d6b265]/30",
        borderSub:    "border-[#d6b265]/15",
        bg:           "bg-[#d6b265]/5",
        hover:        "hover:text-[#d6b265]",
        bullet:       "text-[#d6b265]",
        check:        "text-[#f0c87a]",
      }
    : {
        accent:       "text-cyan",
        accentSecond: "text-purple",
        border:       "border-cyan/12",
        borderB:      "border-cyan/20",
        borderSub:    "border-cyan/10",
        bg:           "bg-cyan/5",
        hover:        "hover:text-cyan",
        bullet:       "text-cyan",
        check:        "text-green-400",
      };

  const localizedFullDescription = getProjectFullDescription(project, locale);

  return (
    <div className={cn("min-h-screen bg-background flex flex-col", isRTL && "text-right")}>
      {isPS && <ThemeInjector theme="simurgh" />}
      {isIW && <ThemeInjector theme="invisible-window" />}
      {isGS && <ThemeInjector theme="gitswitch" />}
      {isMG && <ThemeInjector theme="mehr-guard" />}
      {isSS && <ThemeInjector theme="syllabus-sync" />}
      <div className="flex-1 pb-24">
        {/* Project Hero */}
        <AnimatedSection variants={fadeInUp}>
          {isPS ? (
            /* ── Project Simurgh: fire-shield hero ── */
            <section className="border-b border-orange-900/30 overflow-hidden" style={{ background: "#010101" }}>
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <Link href={getPath("/projects")} className="inline-flex items-center text-sm text-orange-400/70 hover:text-orange-400 pt-6 md:pt-10 mb-6 md:mb-8 transition-colors font-mono">
                  <ArrowLeft size={14} className={cn(isRTL ? "ml-2 rotate-180" : "mr-2")} /> {dictionary.common.back}
                </Link>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center pb-10 md:pb-16">
                  <div className="space-y-4 md:space-y-6">
                    <div className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}>
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono text-orange-400 border border-orange-500/40 bg-orange-500/5 px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold text-white leading-tight">
                      {project.title}
                    </h1>
                    <p className="text-base md:text-lg text-orange-200/60 leading-relaxed">
                      {localizedFullDescription}
                    </p>
                    <div className={cn("flex flex-wrap gap-3", isRTL && "justify-end")}>
                      {project.links.demo   && <NeonButton href={project.links.demo}   external><Play     size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> Demo</NeonButton>}
                      {project.links.repo   && <NeonButton href={project.links.repo}   variant="secondary" external><Github   size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> {dictionary.common.repo}</NeonButton>}
                      {project.links.paper  && <NeonButton href={project.links.paper}  variant="outline" download><FileText  size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> Paper</NeonButton>}
                      {project.links.doi    && <NeonButton href={project.links.doi}    variant="outline" external><ExternalLink size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> DOI</NeonButton>}
                    </div>
                  </div>
                  <div className="relative h-[260px] sm:h-[340px] md:h-[480px] overflow-hidden">
                    <FireShieldCanvas />
                  </div>
                </div>
              </div>
            </section>
          ) : isIW ? (
            /* ── Invisible Window: jellyfish hero ── */
            <section className="border-b border-blue-900/30 overflow-hidden" style={{ background: "#05020a" }}>
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <Link href={getPath("/projects")} className="inline-flex items-center text-sm text-[#91A3B0] hover:text-[#00A693] pt-6 md:pt-10 mb-6 md:mb-8 transition-colors font-mono">
                  <ArrowLeft size={14} className={cn(isRTL ? "ml-2 rotate-180" : "mr-2")} /> {dictionary.common.back}
                </Link>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center pb-10 md:pb-16">
                  <div className="space-y-4 md:space-y-6">
                    <div className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}>
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono text-[#00A693] border border-[#00A693]/40 bg-[#00A693]/5 px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold text-white leading-tight">
                      {project.title}
                    </h1>
                    <p className="text-base md:text-lg text-[#91A3B0] leading-relaxed">
                      {localizedFullDescription}
                    </p>
                    <div className={cn("flex flex-wrap gap-3", isRTL && "justify-end")}>
                      {project.links.demo   && <NeonButton href={project.links.demo}   external><Play     size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> Demo</NeonButton>}
                      {project.links.repo   && <NeonButton href={project.links.repo}   variant="secondary" external><Github   size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> {dictionary.common.repo}</NeonButton>}
                      {project.links.paper  && <NeonButton href={project.links.paper}  variant="outline" download><FileText  size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> Paper</NeonButton>}
                      {project.links.doi    && <NeonButton href={project.links.doi}    variant="outline" external><ExternalLink size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> DOI</NeonButton>}
                    </div>
                  </div>
                  <div className="relative h-[260px] sm:h-[340px] md:h-[480px] overflow-hidden">
                    <RoyalAbyssCanvas />
                  </div>
                </div>
              </div>
            </section>
          ) : isGS ? (
            /* ── GitSwitch: dandelion hero ── */
            <section className="border-b border-red-900/30 overflow-hidden" style={{ background: "#0c0303" }}>
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <Link href={getPath("/projects")} className="inline-flex items-center text-sm text-[#FF4D4D]/70 hover:text-[#FF4D4D] pt-6 md:pt-10 mb-6 md:mb-8 transition-colors font-mono">
                  <ArrowLeft size={14} className={cn(isRTL ? "ml-2 rotate-180" : "mr-2")} /> {dictionary.common.back}
                </Link>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center pb-10 md:pb-16">
                  <div className="space-y-4 md:space-y-6">
                    <div className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}>
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono text-[#FF4D4D] border border-[#FF4D4D]/40 bg-[#FF4D4D]/5 px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold text-white leading-tight">
                      {project.title}
                    </h1>
                    <p className="text-base md:text-lg text-red-200/60 leading-relaxed">
                      {localizedFullDescription}
                    </p>
                    <div className={cn("flex flex-wrap gap-3", isRTL && "justify-end")}>
                      {project.links.demo   && <NeonButton href={project.links.demo}   external><Play     size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> Demo</NeonButton>}
                      {project.links.repo   && <NeonButton href={project.links.repo}   variant="secondary" external><Github   size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> {dictionary.common.repo}</NeonButton>}
                      {project.links.paper  && <NeonButton href={project.links.paper}  variant="outline" download><FileText  size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> Paper</NeonButton>}
                      {project.links.doi    && <NeonButton href={project.links.doi}    variant="outline" external><ExternalLink size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> DOI</NeonButton>}
                    </div>
                  </div>
                  <div className="relative h-[260px] sm:h-[340px] md:h-[480px] overflow-hidden">
                    <DandelionSpinner />
                  </div>
                </div>
              </div>
            </section>
          ) : isMG ? (
            /* ── Mehr Guard: DNA helix hero ── */
            <section className="border-b border-pink-900/30 overflow-hidden" style={{ background: "#030308" }}>
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <Link href={getPath("/projects")} className="inline-flex items-center text-sm text-[#FF007F]/70 hover:text-[#FF007F] pt-6 md:pt-10 mb-6 md:mb-8 transition-colors font-mono">
                  <ArrowLeft size={14} className={cn(isRTL ? "ml-2 rotate-180" : "mr-2")} /> {dictionary.common.back}
                </Link>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center pb-10 md:pb-16">
                  <div className="space-y-4 md:space-y-6">
                    <div className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}>
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono text-[#FF007F] border border-[#FF007F]/40 bg-[#FF007F]/5 px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold text-white leading-tight">
                      {project.title}
                    </h1>
                    <p className="text-base md:text-lg text-pink-200/60 leading-relaxed">
                      {localizedFullDescription}
                    </p>
                    <div className={cn("flex flex-wrap gap-3", isRTL && "justify-end")}>
                      {project.links.demo   && <NeonButton href={project.links.demo}   external><Play     size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> Demo</NeonButton>}
                      {project.links.repo   && <NeonButton href={project.links.repo}   variant="secondary" external><Github   size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> {dictionary.common.repo}</NeonButton>}
                      {project.links.paper  && <NeonButton href={project.links.paper}  variant="outline" download><FileText  size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> Paper</NeonButton>}
                      {project.links.doi    && <NeonButton href={project.links.doi}    variant="outline" external><ExternalLink size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> DOI</NeonButton>}
                    </div>
                  </div>
                  <div className="relative h-[260px] sm:h-[340px] md:h-[480px] overflow-hidden rounded-sm">
                    <DnaHelixCanvas />
                  </div>
                </div>
              </div>
            </section>
          ) : isSS ? (
            /* ── Syllabus-Sync: kinetic lotus hero ── */
            <section className="border-b border-yellow-900/30 overflow-hidden" style={{ background: "#080600" }}>
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <Link href={getPath("/projects")} className="inline-flex items-center text-sm text-[#d6b265]/70 hover:text-[#d6b265] pt-6 md:pt-10 mb-6 md:mb-8 transition-colors font-mono">
                  <ArrowLeft size={14} className={cn(isRTL ? "ml-2 rotate-180" : "mr-2")} /> {dictionary.common.back}
                </Link>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center pb-10 md:pb-16">
                  <div className="space-y-4 md:space-y-6">
                    <div className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}>
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono text-[#d6b265] border border-[#d6b265]/40 bg-[#d6b265]/5 px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold text-white leading-tight">
                      {project.title}
                    </h1>
                    <p className="text-base md:text-lg text-yellow-200/60 leading-relaxed">
                      {localizedFullDescription}
                    </p>
                    <div className={cn("flex flex-wrap gap-3", isRTL && "justify-end")}>
                      {project.links.demo   && <NeonButton href={project.links.demo}   external><Play     size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> Demo</NeonButton>}
                      {project.links.repo   && <NeonButton href={project.links.repo}   variant="secondary" external><Github   size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> {dictionary.common.repo}</NeonButton>}
                      {project.links.paper  && <NeonButton href={project.links.paper}  variant="outline" download><FileText  size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> Paper</NeonButton>}
                      {project.links.doi    && <NeonButton href={project.links.doi}    variant="outline" external><ExternalLink size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> DOI</NeonButton>}
                    </div>
                  </div>
                  <div className="relative h-[260px] sm:h-[340px] md:h-[480px] overflow-hidden">
                    <KineticLotus />
                  </div>
                </div>
              </div>
            </section>
          ) : (
            /* ── Default hero ── */
            <section className="border-b border-cyan/12 bg-cyan/5 py-12 md:py-20">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <Link href={getPath("/projects")} className="inline-flex items-center text-sm text-text-body hover:text-cyan mb-8 transition-colors font-mono">
                  <ArrowLeft size={14} className={cn(isRTL ? "ml-2 rotate-180" : "mr-2")} /> {dictionary.common.back}
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4 max-w-3xl">
                    <div className={cn("flex flex-wrap gap-2 mb-4", isRTL && "justify-end")}>
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono text-cyan border border-cyan/30 px-2 py-1 bg-cyan/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-mono font-bold text-white">
                      {project.title}
                    </h1>
                    <p className="text-xl text-text-body leading-relaxed">
                      {localizedFullDescription}
                    </p>
                  </div>
                  <div className={cn("flex flex-wrap gap-3 md:gap-4 shrink-0", isRTL && "justify-end")}>
                    {project.links.demo && (
                      <NeonButton href={project.links.demo} external>
                        <Play size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> Demo
                      </NeonButton>
                    )}
                    {project.links.repo && (
                      <NeonButton href={project.links.repo} variant="secondary" external>
                        <Github size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> {dictionary.common.repo}
                      </NeonButton>
                    )}
                    {project.links.paper && (
                      <NeonButton href={project.links.paper} variant="outline" download>
                        <FileText size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> Paper
                      </NeonButton>
                    )}
                    {project.links.doi && (
                      <NeonButton href={project.links.doi} variant="outline" external>
                        <ExternalLink size={16} className={cn(isRTL ? "ml-2" : "mr-2")} /> DOI
                      </NeonButton>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </AnimatedSection>

        <div className={cn(`max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 ${isPS ? "bg-[#060200]" : isIW ? "bg-[#02030a]" : isGS ? "bg-[#0a0202]" : isMG ? "bg-[#030308]" : isSS ? "bg-[#080600]" : ""}`, isRTL && "direction-rtl")}>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">

            <AnimatedSection variants={fadeInUp}>
              <section className="space-y-4">
                <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                  <span className={theme.accent}>01.</span> {t.project_detail.problem}
                </h2>
                <div className={cn(`prose prose-invert max-w-none text-text-body border-l-2 ${theme.border} pl-6`, isRTL && "border-l-0 border-r-2 pr-6 pl-0")}>
                  <p>{project.problem}</p>
                </div>
              </section>
            </AnimatedSection>

            <AnimatedSection variants={fadeInUp} delay={0.1}>
              <section className="space-y-4">
                <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                  <span className={theme.accent}>02.</span> {t.project_detail.solution_overview}
                </h2>
                <div className={`bg-black/40 border ${theme.border} p-6 rounded-sm`}>
                  <ul className="grid gap-3">
                    {project.solution.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <ArrowRight size={16} className={cn(`mt-1 ${theme.bullet} shrink-0`, isRTL && "rotate-180")} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedSection variants={fadeInLeft}>
                <section className="space-y-4">
                  <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                    <Code size={20} className={theme.accent} /> {t.project_detail.build}
                  </h2>
                  <div className={`${theme.bg} border ${theme.border} p-6 h-full`}>
                    <div className="mb-4">
                      <h4 className="text-xs uppercase text-text-body font-mono mb-2">{t.project_detail.tech_stack}</h4>
                      <div className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}>
                        {project.build?.stack.map(tech => (
                          <span key={tech} className={`text-xs border ${theme.borderB} px-2 py-1 text-slate-300 ${theme.bg}`}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {project.build?.features.map((feat, i) => (
                        <li key={i} className="text-sm text-text-body flex gap-2">
                          <span className={theme.bullet}>&bull;</span> {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </AnimatedSection>

              <AnimatedSection variants={fadeInRight} delay={0.1}>
                <section className="space-y-4">
                  <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                    <Shield size={20} className={theme.accentSecond} /> {t.project_detail.secure}
                  </h2>
                  <div className={`${theme.bg} border ${theme.border} p-6 h-full`}>
                    <ul className="space-y-3">
                      {project.secure?.measures.map((measure, i) => (
                        <li key={i} className="text-sm text-text-body flex gap-2">
                          <CheckCircle size={14} className={cn(`mt-1 ${theme.check} shrink-0`, isRTL && "order-last ml-2")} />
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </AnimatedSection>
            </div>

            <AnimatedSection variants={fadeInUp} delay={0.15}>
              <section className="space-y-4">
                <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                  <span className={theme.accent}>03.</span> {t.project_detail.proof}
                </h2>
                <div className={`border ${theme.borderB} ${theme.bg} p-6 space-y-4`}>
                  <p className={`font-mono text-sm ${theme.accent} mb-4 uppercase tracking-widest border-b ${theme.borderB} pb-2 inline-block`}>
                    {t.project_detail.verified_claims}
                  </p>
                  <ul className="space-y-3">
                    {project.proof.map((proof, i) => (
                      <li key={i} className="font-mono text-sm text-slate-300 flex items-start gap-3">
                        <span className={cn(`${theme.bullet} mt-1`, isRTL && "rotate-180")}>&gt;</span>
                        {proof}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </AnimatedSection>

          </div>

          {/* Sidebar */}
          <AnimatedSection variants={fadeInRight} delay={0.2} className="lg:col-span-4">
            <div className="space-y-8">
              <div className="sticky top-24">
                <div className={`border ${theme.border} p-6 bg-black/20`}>
                  <h3 className="font-mono font-bold text-white mb-4">{t.project_detail.project_links}</h3>
                  <div className="space-y-3">
                    {project.links.demo && (
                      <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-between text-sm text-text-body ${theme.hover} transition-colors border-b ${theme.borderSub} pb-2`}>
                        {t.project_detail.watch_demo} <Play size={14} className={cn(isRTL && "order-first")} />
                      </a>
                    )}
                    {project.links.repo && (
                      <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-between text-sm text-text-body ${theme.hover} transition-colors border-b ${theme.borderSub} pb-2`}>
                        {t.project_detail.source_code} <Github size={14} className={cn(isRTL && "order-first")} />
                      </a>
                    )}
                    {project.links.paper && (
                      <a href={project.links.paper} download className={`flex items-center justify-between text-sm text-text-body ${theme.hover} transition-colors border-b ${theme.borderSub} pb-2`}>
                        {t.project_detail.download_paper} <FileText size={14} className={cn(isRTL && "order-first")} />
                      </a>
                    )}
                    {project.links.doi && (
                      <a href={project.links.doi} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-between text-sm text-text-body ${theme.hover} transition-colors border-b ${theme.borderSub} pb-2`}>
                        {t.project_detail.doi_record} <ExternalLink size={14} className={cn(isRTL && "order-first")} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </div>
  )
}
