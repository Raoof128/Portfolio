"use client";

import {
  Mail,
  Github,
  Linkedin,
  MapPin,
  Download,
  Fingerprint,
  Users,
} from "lucide-react";
import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { NeonButton } from "@/components/ui/NeonButton";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { fadeInUp, staggerContainer } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_GMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  ORCID_URL,
} from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import { certifications } from "@/lib/certifications";

export function ResumeClient() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <ActiveGrid />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection variants={fadeInUp}>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              <span className="text-cyan font-mono mr-2">/</span>
              <DecryptedText text={t.resume_page.title} />
            </h1>
            <NeonButton
              href="/Mohammad_Raouf_Abedini_Resume.pdf"
              download
              variant="outline"
            >
              <Download className="w-4 h-4" /> {t.resume_page.download}
            </NeonButton>
          </div>
        </AnimatedSection>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="space-y-6"
        >
          {/* Header */}
          <AnimatedSection variants={fadeInUp}>
            <HUDFrame className="p-6 md:p-8 bg-[#030712]/60 backdrop-blur-sm border-l-4 border-l-cyan">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Mohammad Raouf Abedini
                  </h2>
                  <p className="text-lg text-cyan font-mono mb-4">
                    {t.resume.tagline}
                  </p>
                  <div className="flex flex-col gap-2 text-text-body text-sm font-mono">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-text-body" />{" "}
                      {t.resume.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-text-body shrink-0" />
                      <a
                        href={`mailto:${CONTACT_EMAIL_GMAIL}`}
                        className="hover:text-cyan transition-colors"
                      >
                        {CONTACT_EMAIL_GMAIL}
                      </a>
                      <span className="text-text-meta opacity-40">·</span>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="hover:text-cyan transition-colors"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 justify-center md:items-end">
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-body hover:text-cyan transition-colors text-sm font-mono group"
                  >
                    <span>github.com/Raoof128</span>{" "}
                    <Github className="w-4 h-4 group-hover:animate-pulse" />
                  </a>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-body hover:text-cyan transition-colors text-sm font-mono group"
                  >
                    <span>{t.resume.linkedin_profile}</span>{" "}
                    <Linkedin className="w-4 h-4 group-hover:animate-pulse" />
                  </a>
                  <a
                    href={ORCID_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-body hover:text-cyan transition-colors text-sm font-mono group"
                  >
                    <span>{t.resume.orcid_id}</span>{" "}
                    <Fingerprint className="w-4 h-4 group-hover:animate-pulse" />
                  </a>
                </div>
              </div>
            </HUDFrame>
          </AnimatedSection>

          {/* About */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">01.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {t.resume.s01_heading}
                </h3>
              </div>
              <p className="text-text-body leading-relaxed max-w-3xl">
                {t.resume.s01_bio}
              </p>
            </section>
          </AnimatedSection>

          {/* Security Research */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">02.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {t.resume.s02_heading}
                </h3>
              </div>
              <div className="group">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                  <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">
                    Project Simurgh
                  </h4>
                  <span className="text-text-body font-mono text-sm">2026</span>
                </div>
                <p className="text-xs text-text-meta font-mono mb-2">
                  {t.resume.s02_tech_stack}
                </p>
                <p className="text-sm text-text-body italic mb-3">
                  {t.resume.s02_subtitle}
                </p>
                <ul className="space-y-2 text-sm text-text-body list-disc list-inside marker:text-text-meta">
                  <li>{t.resume.s02_bullet1}</li>
                  <li>{t.resume.s02_bullet2}</li>
                  <li>{t.resume.s02_bullet3}</li>
                  <li>{t.resume.s02_bullet4}</li>
                  <li>{t.resume.s02_bullet5}</li>
                </ul>
              </div>
            </section>
          </AnimatedSection>

          {/* Technical Proficiencies */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">03.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {t.resume.s03_heading}
                </h3>
              </div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-4"
              >
                <motion.div
                  variants={fadeInUp}
                  className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,245,255,0.1)] transition-all"
                >
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">
                    &gt; {t.resume.s03_cat1_label}
                  </h4>
                  <p className="text-sm text-text-body">
                    {t.resume.s03_cat1_desc}
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="p-4 bg-amber/5 border border-amber/10 rounded-sm hover:border-amber/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(245,158,11,0.1)] transition-all"
                >
                  <h4 className="text-amber font-mono text-sm mb-3 font-bold">
                    &gt; {t.resume.s03_cat2_label}
                  </h4>
                  <p className="text-sm text-text-body">
                    {t.resume.s03_cat2_desc}
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="p-4 bg-purple/5 border border-purple/10 rounded-sm hover:border-purple/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(139,92,246,0.1)] transition-all"
                >
                  <h4 className="text-purple font-mono text-sm mb-3 font-bold">
                    &gt; {t.resume.s03_cat3_label}
                  </h4>
                  <p className="text-sm text-text-body">
                    {t.resume.s03_cat3_desc}
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,245,255,0.1)] transition-all"
                >
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">
                    &gt; {t.resume.s03_cat4_label}
                  </h4>
                  <p className="text-sm text-text-body">
                    {t.resume.s03_cat4_desc}
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,245,255,0.1)] transition-all md:col-span-2"
                >
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">
                    &gt; {t.resume.s03_cat5_label}
                  </h4>
                  <p className="text-sm text-text-body">
                    {t.resume.s03_cat5_desc}
                  </p>
                </motion.div>
              </motion.div>
            </section>
          </AnimatedSection>

          {/* Education */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">04.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {t.about.education}
                </h3>
              </div>
              <div className="space-y-6">
                <div className="relative pl-6 border-l border-cyber-gray">
                  <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-cyan border-2 border-background"></span>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                    <h4 className="text-white font-bold text-lg">
                      {t.about.degree_bachelor}
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      Macquarie University
                    </span>
                  </div>
                  <div className="text-cyan font-mono text-sm mb-2">
                    May 2024 – Nov 2026
                  </div>
                  <div className="text-sm text-text-body">
                    <span className="font-bold text-slate-300">
                      {t.resume.s04_coursework_label}
                    </span>{" "}
                    {t.resume.s04_coursework}
                  </div>
                </div>
                <div className="relative pl-6 border-l border-cyber-gray">
                  <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-amber border-2 border-background"></span>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                    <h4 className="text-white font-bold text-lg">
                      {t.about.degree_diploma}
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      Macquarie University
                    </span>
                  </div>
                  <div className="text-text-body font-mono text-sm">
                    Jul 2023 – May 2024
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Selected Research & Engineering Projects */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">05.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {t.resume.s05_heading}
                </h3>
              </div>
              <div className="space-y-6">
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">
                      The Invisible Window{" "}
                      <span className="text-cyan font-mono font-normal text-xs ml-2">
                        [{t.resume.proj1_tag}]
                      </span>
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      2026
                    </span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">
                    {t.resume.proj1_stack}
                  </p>
                  <p className="text-sm text-text-body">
                    {t.resume.proj1_desc}
                  </p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-amber transition-colors">
                      Aion{" "}
                      <span className="text-amber font-mono font-normal text-xs ml-2">
                        [{t.resume.proj2_tag}]
                      </span>
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      2026
                    </span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">
                    {t.resume.proj2_stack}
                  </p>
                  <p className="text-sm text-text-body">
                    {t.resume.proj2_desc}
                  </p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">
                      NanoMatch{" "}
                      <span className="text-purple font-mono font-normal text-xs ml-2">
                        [{t.resume.proj3_tag}]
                      </span>
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      2026
                    </span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">
                    {t.resume.proj3_stack}
                  </p>
                  <p className="text-sm text-text-body">
                    {t.resume.proj3_desc}
                  </p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">
                      SentinelFlow{" "}
                      <span className="text-purple font-mono font-normal text-xs ml-2">
                        [{t.resume.proj4_tag}]
                      </span>
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      2026
                    </span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">
                    {t.resume.proj4_stack}
                  </p>
                  <p className="text-sm text-text-body">
                    {t.resume.proj4_desc}
                  </p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-purple transition-colors">
                      Nexus Archive{" "}
                      <span className="text-purple font-mono font-normal text-xs ml-2">
                        [{t.resume.proj5_tag}]
                      </span>
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      2025
                    </span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">
                    {t.resume.proj5_stack}
                  </p>
                  <p className="text-sm text-text-body">
                    {t.resume.proj5_desc}
                  </p>
                </div>
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan transition-colors">
                      Mehr Guard{" "}
                      <span className="text-cyan font-mono font-normal text-xs ml-2">
                        [{t.resume.proj6_tag}]
                      </span>
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      2024
                    </span>
                  </div>
                  <p className="text-xs text-text-meta font-mono mb-1">
                    {t.resume.proj6_stack}
                  </p>
                  <p className="text-sm text-text-body">
                    {t.resume.proj6_desc}
                  </p>
                </div>
                <div className="p-3 border border-cyan/10 bg-cyan/5 rounded-sm text-sm text-text-body font-mono">
                  {t.resume.s05_more_projects}{" "}
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan hover:underline"
                  >
                    github.com/Raoof128
                  </a>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Professional Experience */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">06.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {t.resume.s06_heading}
                </h3>
              </div>

              <div className="relative pl-6 border-l border-cyber-gray">
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-cyan border-2 border-background"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-lg">
                    {t.resume.exp1_title}
                  </h4>
                  <span className="text-text-body font-mono text-sm">
                    {t.resume.exp1_employer}
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-text-body list-disc list-inside marker:text-text-meta">
                  <li>{t.resume.exp1_bullet1}</li>
                  <li>{t.resume.exp1_bullet2}</li>
                  <li>{t.resume.exp1_bullet3}</li>
                </ul>
              </div>

              <div className="relative pl-6 border-l border-cyber-gray">
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-amber border-2 border-background"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-lg">
                    {t.resume.exp2_title}
                  </h4>
                  <span className="text-text-body font-mono text-sm">
                    {t.resume.exp2_employer}
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-text-body list-disc list-inside marker:text-text-meta">
                  <li>{t.resume.exp2_bullet1}</li>
                </ul>
              </div>
            </section>
          </AnimatedSection>

          {/* AI Safety & Community */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">07.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {t.resume.s07_heading}
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-text-body">
                <li className="flex items-start gap-2">
                  <span className="text-purple mt-1">&#x25CF;</span>{" "}
                  {t.resume.s07_bullet1}
                </li>
              </ul>

              {/* Volunteering — Macquarie Persian Students Society */}
              <div className="relative pl-6 border-l border-cyber-gray">
                <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-purple border-2 border-background"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-white font-bold text-base flex items-center gap-2">
                    <Users size={16} className="text-purple shrink-0" />
                    Co-Founder · Macquarie Persian Students Society
                  </h4>
                  <span className="text-text-body font-mono text-sm">
                    2026 – Present
                  </span>
                </div>
                <div className="text-purple font-mono text-xs mb-2">
                  {t.resume.volunteer_label} · Education
                </div>
                <p className="text-sm text-text-body">{t.resume.s07_bullet2}</p>
              </div>
            </section>
          </AnimatedSection>

          {/* Licenses & Certifications */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">08.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {t.resume.certs_heading}
                </h3>
              </div>
              {["Anthropic", "Macquarie University"].map((issuer) => {
                const items = certifications.filter((c) => c.issuer === issuer);
                if (items.length === 0) return null;
                return (
                  <div key={issuer} className="space-y-3">
                    <h4 className="text-cyan font-mono text-sm font-bold">
                      &gt; {issuer}{" "}
                      <span className="text-text-meta">({items.length})</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {items.map((c) => (
                        <div
                          key={c.credentialId}
                          className="p-3 border border-cyan/10 bg-cyan/5 rounded-sm hover:border-cyan/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-white font-medium leading-snug">
                              {c.name}
                            </p>
                            {c.grade && (
                              <span className="shrink-0 text-xs font-mono text-cyan border border-cyan/30 bg-cyan/10 px-1.5 py-0.5 rounded-sm">
                                {c.grade}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-text-meta font-mono">
                            {t.resume.certs_issued} {c.issued} ·{" "}
                            {t.resume.certs_credential}: {c.credentialId}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          </AnimatedSection>

          {/* Additional Info */}
          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4 pb-8">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">09.</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {t.resume.s08_heading}
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-text-body">
                <div className="flex items-start gap-2">
                  <span className="text-cyan mt-1">&#x25CF;</span>{" "}
                  {t.resume.s08_available}
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple mt-1">&#x25CF;</span>{" "}
                  {t.resume.s08_languages}
                </div>
              </div>
            </section>
          </AnimatedSection>
        </motion.div>
      </div>
    </div>
  );
}
