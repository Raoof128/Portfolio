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
import { HUDFrame } from "@/components/ui/HUDFrame";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import {
  CONTACT_EMAIL_GMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  ORCID_URL,
} from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import { certifications } from "@/lib/certifications";
import Link from "next/link";
import { defaultLocale } from "@/i18n";
import { formatDate, formatNumber } from "@/i18n/format";
import { getPageSupportCopy } from "@/lib/page-support-copy";
import { useContentId } from "@/components/os/application-context";

export function ResumeClient() {
  const { t, locale } = useTranslation();
  const copy = getPageSupportCopy(locale);
  const contentId = useContentId();
  // A credential gives only a Gregorian month, not a day. Keep its calendar
  // instead of inventing a Persian-calendar month from an arbitrary date.
  const monthYear = (date: string) =>
    formatDate(date, locale, {
      month: "long",
      year: "numeric",
      calendar: "gregory",
    });
  const issuedDate = (issued: string) => {
    const months: Record<string, string> = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    const [month, year] = issued.split(" ");
    return months[month] && /^\d{4}$/.test(year)
      ? monthYear(`${year}-${months[month]}-01`)
      : issued;
  };
  const getPath = (path: string) =>
    locale === defaultLocale ? path : `/${locale}${path}`;

  return (
    <div className="os-legacy os-resume relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              <span className="text-cyan font-mono mr-2">/</span>
              {t.resume_page.title}
            </h1>
            <div className="flex flex-col items-start gap-2">
              <NeonButton
                href="/Mohammad_Raouf_Abedini_Resume.pdf"
                download
                variant="outline"
              >
                <Download className="w-4 h-4" /> {t.resume_page.download}
              </NeonButton>
              <p className="text-xs text-text-body">
                {copy.originalEnglishPDF}
              </p>
            </div>
          </div>
        </AnimatedSection>

        <div className="space-y-6">
          {/* Header */}
          <AnimatedSection>
            <HUDFrame className="p-6 md:p-8 bg-[#030712]/60 backdrop-blur-sm border-l-4 border-l-cyan">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    <bdi dir="ltr" lang="en">
                      Mohammad Raouf Abedini
                    </bdi>
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
                        <bdi dir="ltr">{CONTACT_EMAIL_GMAIL}</bdi>
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
          <AnimatedSection>
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">
                  <bdi>
                    {formatNumber(1, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>
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
          <AnimatedSection>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">
                  <bdi>
                    {formatNumber(2, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {t.resume.s02_heading}
                </h3>
              </div>
              <div className="group">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                  <h4 className="text-white font-bold text-lg">
                    <Link
                      href={getPath("/projects/project-simurgh")}
                      className="os-inline-link"
                    >
                      <bdi dir="ltr" lang="en">
                        Project Simurgh
                      </bdi>
                    </Link>
                  </h4>
                  <span className="text-text-body font-mono text-sm">
                    {formatNumber(2026, locale, { useGrouping: false })}
                  </span>
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
          <AnimatedSection>
            <section
              id={contentId("skills")}
              aria-labelledby={contentId("skills-heading")}
              tabIndex={-1}
              className="space-y-4 scroll-mt-24"
            >
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">
                  <bdi>
                    {formatNumber(3, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>
                <h3
                  id={contentId("skills-heading")}
                  className="text-lg font-bold text-white uppercase tracking-wider"
                >
                  {t.resume.s03_heading}
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,245,255,0.1)] transition-all">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">
                    &gt; {t.resume.s03_cat1_label}
                  </h4>
                  <p className="text-sm text-text-body">
                    {t.resume.s03_cat1_desc}
                  </p>
                </div>
                <div className="p-4 bg-amber/5 border border-amber/10 rounded-sm hover:border-amber/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(245,158,11,0.1)] transition-all">
                  <h4 className="text-amber font-mono text-sm mb-3 font-bold">
                    &gt; {t.resume.s03_cat2_label}
                  </h4>
                  <p className="text-sm text-text-body">
                    {t.resume.s03_cat2_desc}
                  </p>
                </div>
                <div className="p-4 bg-purple/5 border border-purple/10 rounded-sm hover:border-purple/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(139,92,246,0.1)] transition-all">
                  <h4 className="text-purple font-mono text-sm mb-3 font-bold">
                    &gt; {t.resume.s03_cat3_label}
                  </h4>
                  <p className="text-sm text-text-body">
                    {t.resume.s03_cat3_desc}
                  </p>
                </div>
                <div className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,245,255,0.1)] transition-all">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">
                    &gt; {t.resume.s03_cat4_label}
                  </h4>
                  <p className="text-sm text-text-body">
                    {t.resume.s03_cat4_desc}
                  </p>
                </div>
                <div className="p-4 bg-cyan/5 border border-cyan/10 rounded-sm hover:border-cyan/30 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,245,255,0.1)] transition-all md:col-span-2">
                  <h4 className="text-cyan font-mono text-sm mb-3 font-bold">
                    &gt; {t.resume.s03_cat5_label}
                  </h4>
                  <p className="text-sm text-text-body">
                    {t.resume.s03_cat5_desc}
                  </p>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Education */}
          <AnimatedSection>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">
                  <bdi>
                    {formatNumber(4, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>
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
                      {copy.university}
                    </span>
                  </div>
                  <div className="text-cyan font-mono text-sm mb-2">
                    {monthYear("2024-05-01")} – {t.resume.expected_completion}:{" "}
                    {monthYear("2026-11-01")}
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
                      {copy.university}
                    </span>
                  </div>
                  <div className="text-text-body font-mono text-sm">
                    {monthYear("2023-07-01")} – {monthYear("2024-05-01")}
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Selected Research & Engineering Projects */}
          <AnimatedSection>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">
                  <bdi>
                    {formatNumber(5, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {t.resume.s05_heading}
                </h3>
              </div>
              <div className="space-y-6">
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-white font-bold text-lg">
                      <Link
                        href={getPath("/projects/invisible-window-research")}
                        className="os-inline-link"
                      >
                        <bdi dir="ltr" lang="en">
                          The Invisible Window
                        </bdi>
                      </Link>{" "}
                      <span className="text-cyan font-mono font-normal text-xs ml-2">
                        [{t.resume.proj1_tag}]
                      </span>
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      {formatNumber(2026, locale, { useGrouping: false })}
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
                    <h4 className="text-white font-bold text-lg">
                      <Link
                        href={getPath("/projects/aion")}
                        className="os-inline-link"
                      >
                        <bdi dir="ltr" lang="en">
                          Aion
                        </bdi>
                      </Link>{" "}
                      <span className="text-amber font-mono font-normal text-xs ml-2">
                        [{t.resume.proj2_tag}]
                      </span>
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      {formatNumber(2026, locale, { useGrouping: false })}
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
                    <h4 className="text-white font-bold text-lg">
                      <Link
                        href={getPath("/projects/nanomatch")}
                        className="os-inline-link"
                      >
                        <bdi dir="ltr" lang="en">
                          NanoMatch
                        </bdi>
                      </Link>{" "}
                      <span className="text-purple font-mono font-normal text-xs ml-2">
                        [{t.resume.proj3_tag}]
                      </span>
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      {formatNumber(2026, locale, { useGrouping: false })}
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
                    <h4 className="text-white font-bold text-lg">
                      <Link
                        href={getPath("/projects/sentinelflow")}
                        className="os-inline-link"
                      >
                        <bdi dir="ltr" lang="en">
                          SentinelFlow
                        </bdi>
                      </Link>{" "}
                      <span className="text-purple font-mono font-normal text-xs ml-2">
                        [{t.resume.proj4_tag}]
                      </span>
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      {formatNumber(2026, locale, { useGrouping: false })}
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
                    <h4 className="text-white font-bold text-lg">
                      <Link
                        href={getPath("/projects/nexus-archive")}
                        className="os-inline-link"
                      >
                        <bdi dir="ltr" lang="en">
                          Nexus Archive
                        </bdi>
                      </Link>{" "}
                      <span className="text-purple font-mono font-normal text-xs ml-2">
                        [{t.resume.proj5_tag}]
                      </span>
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      {formatNumber(2025, locale, { useGrouping: false })}
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
                    <h4 className="text-white font-bold text-lg">
                      <Link
                        href={getPath("/projects/mehr-guard")}
                        className="os-inline-link"
                      >
                        <bdi dir="ltr" lang="en">
                          Mehr Guard
                        </bdi>
                      </Link>{" "}
                      <span className="text-cyan font-mono font-normal text-xs ml-2">
                        [{t.resume.proj6_tag}]
                      </span>
                    </h4>
                    <span className="text-text-body font-mono text-sm">
                      {formatNumber(2024, locale, { useGrouping: false })}
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
                    className="os-inline-link"
                  >
                    github.com/Raoof128
                  </a>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Professional Experience */}
          <AnimatedSection>
            <section
              id={contentId("experience")}
              aria-labelledby={contentId("experience-heading")}
              tabIndex={-1}
              className="space-y-6 scroll-mt-24"
            >
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">
                  <bdi>
                    {formatNumber(6, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>
                <h3
                  id={contentId("experience-heading")}
                  className="text-lg font-bold text-white uppercase tracking-wider"
                >
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
          <AnimatedSection>
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">
                  <bdi>
                    {formatNumber(7, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>
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
                    {copy.coFounderSociety}
                  </h4>
                  <span className="text-text-body font-mono text-sm">
                    {formatNumber(2026, locale, { useGrouping: false })} –{" "}
                    {copy.present}
                  </span>
                </div>
                <div className="text-purple font-mono text-xs mb-2">
                  {t.resume.volunteer_label} · {copy.education}
                </div>
                <p className="text-sm text-text-body">{t.resume.s07_bullet2}</p>
              </div>
            </section>
          </AnimatedSection>

          {/* Licenses & Certifications */}
          <AnimatedSection>
            <section
              id={contentId("certifications")}
              aria-labelledby={contentId("certifications-heading")}
              tabIndex={-1}
              className="space-y-4 scroll-mt-24"
            >
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">
                  <bdi>
                    {formatNumber(8, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>
                <h3
                  id={contentId("certifications-heading")}
                  className="text-lg font-bold text-white uppercase tracking-wider"
                >
                  {t.resume.certs_heading}
                </h3>
              </div>
              <p className="text-sm text-text-body">
                {copy.officialCertificateNames}
              </p>
              {["Anthropic", "Macquarie University"].map((issuer) => {
                const items = certifications.filter((c) => c.issuer === issuer);
                if (items.length === 0) return null;
                return (
                  <div key={issuer} className="space-y-3">
                    <h4 className="text-cyan font-mono text-sm font-bold">
                      &gt;{" "}
                      {issuer === "Macquarie University"
                        ? copy.university
                        : issuer}{" "}
                      <span className="text-text-meta">
                        ({formatNumber(items.length, locale)})
                      </span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {items.map((c) => (
                        <div
                          key={c.credentialId}
                          className="p-3 border border-cyan/10 bg-cyan/5 rounded-sm hover:border-cyan/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-white font-medium leading-snug">
                              <bdi dir="ltr" lang="en">
                                {c.name}
                              </bdi>
                            </p>
                            {c.grade && (
                              <span className="shrink-0 text-xs font-mono text-cyan border border-cyan/30 bg-cyan/10 px-1.5 py-0.5 rounded-sm">
                                <bdi dir="ltr">{c.grade}</bdi>
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-text-meta font-mono">
                            {t.resume.certs_issued} {issuedDate(c.issued)} ·{" "}
                            {t.resume.certs_credential}:{" "}
                            <bdi dir="ltr">{c.credentialId}</bdi>
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
          <AnimatedSection>
            <section className="space-y-4 pb-8">
              <div className="flex items-center gap-2 border-b border-cyan/12 pb-2">
                <span className="text-cyan font-bold font-mono">
                  <bdi>
                    {formatNumber(9, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>
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
        </div>
      </div>
    </div>
  );
}
