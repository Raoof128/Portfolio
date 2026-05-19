"use client";

import { NeonButton } from "@/components/ui/NeonButton"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { RoyalAbyssCanvas } from "@/components/ui/RoyalAbyssCanvas"
import { FireShieldCanvas } from "@/components/ui/FireShieldCanvas"
import { ThemeInjector } from "@/components/ui/ThemeInjector"
import { ArrowLeft, Github, Play, Shield, Code, CheckCircle, ArrowRight, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"
import { fadeInUp, fadeInRight, fadeInLeft } from "@/lib/utils"

interface Project {
  title: string;
  tags: string[];
  fullDescription: string;
  problem: string;
  solution: string[];
  build: { stack: string[]; features: string[] };
  secure: { measures: string[] };
  proof: string[];
  links: { demo?: string; repo?: string; paper?: string; doi?: string };
}

const IW = "invisible-window-research";
const PS = "project-simurgh";

export function ProjectDetailClient({ project, slug }: { project: Project; slug: string }) {
  const isIW = slug === IW;
  const isPS = slug === PS;

  // Per-page accent theme — content body sections
  const t = isPS
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isPS && <ThemeInjector theme="simurgh" />}
      {isIW && <ThemeInjector theme="invisible-window" />}
      <div className="flex-1 pb-24">
        {/* Project Hero */}
        <AnimatedSection variants={fadeInUp}>
          {isPS ? (
            /* ── Project Simurgh: fire-shield hero ── */
            <section className="border-b border-orange-900/30 overflow-hidden" style={{ background: "#010101" }}>
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <Link href="/projects" className="inline-flex items-center text-sm text-orange-400/70 hover:text-orange-400 pt-6 md:pt-10 mb-6 md:mb-8 transition-colors font-mono">
                  <ArrowLeft size={14} className="mr-2" /> Back to Projects
                </Link>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center pb-10 md:pb-16">
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-wrap gap-2">
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
                      {project.fullDescription}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {project.links.demo   && <NeonButton href={project.links.demo}   external><Play     size={16} className="mr-2" /> Demo</NeonButton>}
                      {project.links.repo   && <NeonButton href={project.links.repo}   variant="secondary" external><Github   size={16} className="mr-2" /> Repo</NeonButton>}
                      {project.links.paper  && <NeonButton href={project.links.paper}  variant="outline" download><FileText  size={16} className="mr-2" /> Paper</NeonButton>}
                      {project.links.doi    && <NeonButton href={project.links.doi}    variant="outline" external><ExternalLink size={16} className="mr-2" /> DOI</NeonButton>}
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
                <Link href="/projects" className="inline-flex items-center text-sm text-[#91A3B0] hover:text-[#00A693] pt-6 md:pt-10 mb-6 md:mb-8 transition-colors font-mono">
                  <ArrowLeft size={14} className="mr-2" /> Back to Projects
                </Link>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center pb-10 md:pb-16">
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-wrap gap-2">
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
                      {project.fullDescription}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {project.links.demo   && <NeonButton href={project.links.demo}   external><Play     size={16} className="mr-2" /> Demo</NeonButton>}
                      {project.links.repo   && <NeonButton href={project.links.repo}   variant="secondary" external><Github   size={16} className="mr-2" /> Repo</NeonButton>}
                      {project.links.paper  && <NeonButton href={project.links.paper}  variant="outline" download><FileText  size={16} className="mr-2" /> Paper</NeonButton>}
                      {project.links.doi    && <NeonButton href={project.links.doi}    variant="outline" external><ExternalLink size={16} className="mr-2" /> DOI</NeonButton>}
                    </div>
                  </div>
                  <div className="relative h-[260px] sm:h-[340px] md:h-[480px] overflow-hidden">
                    <RoyalAbyssCanvas />
                  </div>
                </div>
              </div>
            </section>
          ) : (
            /* ── Default hero ── */
            <section className="border-b border-cyan/12 bg-cyan/5 py-12 md:py-20">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <Link href="/projects" className="inline-flex items-center text-sm text-text-body hover:text-cyan mb-8 transition-colors font-mono">
                  <ArrowLeft size={14} className="mr-2" /> Back to Projects
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex flex-wrap gap-2 mb-4">
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
                      {project.fullDescription}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 md:gap-4 shrink-0">
                    {project.links.demo && (
                      <NeonButton href={project.links.demo} external>
                        <Play size={16} className="mr-2" /> Demo
                      </NeonButton>
                    )}
                    {project.links.repo && (
                      <NeonButton href={project.links.repo} variant="secondary" external>
                        <Github size={16} className="mr-2" /> Repo
                      </NeonButton>
                    )}
                    {project.links.paper && (
                      <NeonButton href={project.links.paper} variant="outline" download>
                        <FileText size={16} className="mr-2" /> Paper
                      </NeonButton>
                    )}
                    {project.links.doi && (
                      <NeonButton href={project.links.doi} variant="outline" external>
                        <ExternalLink size={16} className="mr-2" /> DOI
                      </NeonButton>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </AnimatedSection>

        <div className={`max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 ${isPS ? "bg-[#060200]" : isIW ? "bg-[#02030a]" : ""}`}>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">

            <AnimatedSection variants={fadeInUp}>
              <section className="space-y-4">
                <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                  <span className={t.accent}>01.</span> Problem
                </h2>
                <div className={`prose prose-invert max-w-none text-text-body border-l-2 ${t.border} pl-6`}>
                  <p>{project.problem}</p>
                </div>
              </section>
            </AnimatedSection>

            <AnimatedSection variants={fadeInUp} delay={0.1}>
              <section className="space-y-4">
                <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                  <span className={t.accent}>02.</span> Solution Overview
                </h2>
                <div className={`bg-black/40 border ${t.border} p-6 rounded-sm`}>
                  <ul className="grid gap-3">
                    {project.solution.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <ArrowRight size={16} className={`mt-1 ${t.bullet} shrink-0`} />
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
                    <Code size={20} className={t.accent} /> Build
                  </h2>
                  <div className={`${t.bg} border ${t.border} p-6 h-full`}>
                    <div className="mb-4">
                      <h4 className="text-xs uppercase text-text-body font-mono mb-2">Tech Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.build?.stack.map(tech => (
                          <span key={tech} className={`text-xs border ${t.borderB} px-2 py-1 text-slate-300 ${t.bg}`}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {project.build?.features.map((feat, i) => (
                        <li key={i} className="text-sm text-text-body flex gap-2">
                          <span className={t.bullet}>&bull;</span> {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </AnimatedSection>

              <AnimatedSection variants={fadeInRight} delay={0.1}>
                <section className="space-y-4">
                  <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                    <Shield size={20} className={t.accentSecond} /> Secure
                  </h2>
                  <div className={`${t.bg} border ${t.border} p-6 h-full`}>
                    <ul className="space-y-3">
                      {project.secure?.measures.map((measure, i) => (
                        <li key={i} className="text-sm text-text-body flex gap-2">
                          <CheckCircle size={14} className={`mt-1 ${t.check} shrink-0`} />
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
                  <span className={t.accent}>03.</span> Proof & Verification
                </h2>
                <div className={`border ${t.borderB} ${t.bg} p-6 space-y-4`}>
                  <p className={`font-mono text-sm ${t.accent} mb-4 uppercase tracking-widest border-b ${t.borderB} pb-2 inline-block`}>
                    Verified Claims
                  </p>
                  <ul className="space-y-3">
                    {project.proof.map((proof, i) => (
                      <li key={i} className="font-mono text-sm text-slate-300 flex items-start gap-3">
                        <span className={`${t.bullet} mt-1`}>&gt;</span>
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
                <div className={`border ${t.border} p-6 bg-black/20`}>
                  <h3 className="font-mono font-bold text-white mb-4">Project Links</h3>
                  <div className="space-y-3">
                    {project.links.demo && (
                      <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-between text-sm text-text-body ${t.hover} transition-colors border-b ${t.borderSub} pb-2`}>
                        Watch Demo <Play size={14} />
                      </a>
                    )}
                    {project.links.repo && (
                      <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-between text-sm text-text-body ${t.hover} transition-colors border-b ${t.borderSub} pb-2`}>
                        Source Code <Github size={14} />
                      </a>
                    )}
                    {project.links.paper && (
                      <a href={project.links.paper} download className={`flex items-center justify-between text-sm text-text-body ${t.hover} transition-colors border-b ${t.borderSub} pb-2`}>
                        Download Paper <FileText size={14} />
                      </a>
                    )}
                    {project.links.doi && (
                      <a href={project.links.doi} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-between text-sm text-text-body ${t.hover} transition-colors border-b ${t.borderSub} pb-2`}>
                        DOI Record <ExternalLink size={14} />
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
