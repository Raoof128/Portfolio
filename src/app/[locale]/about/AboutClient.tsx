"use client";

import { useState } from "react";
import Image from "next/image";
import { BASE_PATH, GITHUB_URL, LINKEDIN_URL, CONTACT_EMAIL } from "@/lib/constants";
import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { NeonButton } from "@/components/ui/NeonButton";
import { Github, Linkedin, Mail, Shield, Cpu, Cloud, Brain, FileCode2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/utils";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { cn } from "@/lib/utils";

const PROFILE_PHOTO_SOURCES = [
  `${BASE_PATH}/Raouf_2.jpg`,
  `${BASE_PATH}/Raouf_2.png`,
] as const;

const specializations = [
  {
    icon: Shield,
    label: "Vulnerability Research & Disclosure",
    accent: "cyan",
    accentClass: "text-cyan border-cyan/20 group-hover:border-cyan/60 group-hover:bg-cyan/5",
    iconClass: "text-cyan",
    items: [
      "Cross-Platform Exploit Development (Win32 API, macOS ScreenCaptureKit)",
      "Responsible Disclosure (OWASP/FIRST/CISA Frameworks)",
      "IEEE-Format Security Research",
      "Penetration Testing & Secure Code Review",
      "W3C Screen Capture Specification",
    ],
  },
  {
    icon: Brain,
    label: "AI Safety & LLM Security",
    accent: "purple",
    accentClass: "text-purple border-purple/20 group-hover:border-purple/60 group-hover:bg-purple/5",
    iconClass: "text-purple",
    items: [
      "LLM Integration & Evaluation (Anthropic)",
      "AI-Assisted Vulnerability Research",
      "AI Capability Uplift Measurement",
      "Dual-Use Risk Assessment",
      "Intent-vs-Artefact Safety Boundary Characterisation",
    ],
  },
  {
    icon: Cloud,
    label: "Python & Systems Programming",
    accent: "amber",
    accentClass: "text-amber border-amber/20 group-hover:border-amber/60 group-hover:bg-amber/5",
    iconClass: "text-amber",
    items: [
      "Python (Primary), C, C++, TypeScript, Swift",
      "High-Performance C/C++ Systems (1M+ ops/sec)",
      "Network Packet Processing (libpcap)",
      "Linux (Ubuntu/Kali), CMake, Docker",
      "GitHub Actions CI/CD, Google Test",
    ],
  },
  {
    icon: FileCode2,
    label: "Offensive Security",
    accent: "cyan",
    accentClass: "text-cyan border-cyan/20 group-hover:border-cyan/60 group-hover:bg-cyan/5",
    iconClass: "text-cyan",
    items: [
      "Threat Modelling (MITRE ATT&CK, OWASP Top 10)",
      "Network Intrusion Detection Systems",
      "Wireshark, Nmap, Burp Suite",
      "NLP-Powered Phishing Simulation",
      "NIST Framework & Compliance",
    ],
  },
];

const skillGroups = [
  {
    label: "Languages",
    skills: ["Python (primary)", "C", "C++", "TypeScript", "JavaScript", "Swift", "Kotlin", "Bash", "SQL", "Go (familiar)"],
  },
  {
    label: "Security",
    skills: ["Vulnerability Research", "Cross-Platform Exploit Development", "Threat Modelling", "Secure Code Review", "Penetration Testing", "Responsible Disclosure", "Wireshark", "Nmap", "Burp Suite"],
  },
  {
    label: "AI & ML",
    skills: ["LLM Integration & Evaluation", "AI-Assisted Vulnerability Research", "NLP", "Generative AI Tooling", "ML Model Evaluation", "Dual-Use Risk Assessment"],
  },
  {
    label: "Systems",
    skills: ["Linux (Ubuntu/Kali)", "CMake", "Docker", "Git/GitHub", "GitHub Actions CI/CD", "Google Test", "FastAPI", "Cloudflare Workers", "libpcap"],
  },
  {
    label: "Frameworks",
    skills: ["OWASP Top 10", "MITRE ATT&CK", "NIST", "W3C Screen Capture Spec"],
  },
];

const activeLabs = [
  { id: "001", status: "ACTIVE",   title: "AD Attack & Defence Lab",       tags: ["Purple Team", "Kerberoasting", "DC-Sync"] },
  { id: "002", status: "ACTIVE",   title: "SOC Automation Platform",        tags: ["SOAR", "KQL", "E8 Maturity"] },
  { id: "003", status: "ACTIVE",   title: "AI Red Team Framework",          tags: ["LLM", "Jailbreak", "Adversarial"] },
  { id: "004", status: "ACTIVE",   title: "ML Anomaly Detection Pipeline",  tags: ["Zeek", "Suricata", "Isolation Forest"] },
  { id: "005", status: "ARCHIVED", title: "LEO Satellite Cyber Lab",        tags: ["Uplink Jamming", "Spoofing", "Telemetry"] },
  { id: "006", status: "ARCHIVED", title: "Malware Analysis Sandbox",       tags: ["RE", "YARA", "API Hooking"] },
  { id: "007", status: "CONCEPT",  title: "PQC Migration Auditor",          tags: ["Post-Quantum", "Crypto Inventory"] },
];

const statusStyles: Record<string, string> = {
  ACTIVE:   "text-green-400 border-green-400/30 bg-green-400/5",
  ARCHIVED: "text-text-body border-text-body/30 bg-text-body/5",
  CONCEPT:  "text-amber border-amber/30 bg-amber/5",
};

export function AboutClient() {
  const { locale, t } = useTranslation();
  const [photoSourceIndex, setPhotoSourceIndex] = useState(0);
  const [photoLoadFailed, setPhotoLoadFailed] = useState(false);
  const photoSource = PROFILE_PHOTO_SOURCES[photoSourceIndex];

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  const isRTL = locale === 'fa' || locale === 'ar';

  const handlePhotoError = () => {
    if (photoSourceIndex < PROFILE_PHOTO_SOURCES.length - 1) {
      setPhotoSourceIndex((i) => i + 1);
      return;
    }
    setPhotoLoadFailed(true);
  };

  const handlePhotoRetry = () => {
    setPhotoSourceIndex(0);
    setPhotoLoadFailed(false);
  };

  return (
    <div className={cn("relative min-h-screen pt-24 pb-16", isRTL && "text-right")}>
      <ActiveGrid />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">

        {/* ─── HERO ─── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          {/* Left */}
          <motion.div variants={fadeInUp} className={cn("lg:col-span-7 space-y-8", isRTL && "lg:order-last")}>
            <div className="space-y-3">
              <div className={cn("flex items-center space-x-2", isRTL && "justify-end space-x-reverse")}>
                <span className="h-px w-8 bg-cyan/50" />
                <span className="font-mono text-xs tracking-widest uppercase text-cyan/70">{t.about.identity_record}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                {t.about.hero_title}
              </h1>
              <p className="font-mono text-cyan text-lg tracking-wide">
                {t.about.hero_subtitle}
              </p>
            </div>

            <HUDFrame className="p-6 md:p-8 bg-[#030712]/60 backdrop-blur-sm space-y-4">
              <p className="text-slate-300 leading-relaxed">
                {t.about.bio_1}
              </p>
              <p className="text-text-body leading-relaxed">
                {t.about.bio_2}
              </p>
              <p className="text-text-body leading-relaxed">
                {t.about.bio_3}
              </p>
            </HUDFrame>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "70+", label: t.about.stats_projects, color: "text-cyan" },
                { value: "100%", label: t.about.stats_evasion, color: "text-purple" },
                { value: "3+2", label: t.about.stats_vendors, color: "text-amber" },
              ].map((s) => (
                <div key={s.label} className="border border-cyan/12 p-4 bg-[#030712]/60 hover:border-cyan/20 transition-colors text-center">
                  <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-text-body font-mono uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className={cn("flex flex-wrap gap-3", isRTL && "justify-end")}>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-cyan/12 hover:border-cyan/40 hover:text-cyan hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,245,255,0.15)] text-text-body font-mono text-xs transition-all">
                <Github className="w-3.5 h-3.5" /> github.com/Raoof128
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-cyan/12 hover:border-cyan/40 hover:text-cyan hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,245,255,0.15)] text-text-body font-mono text-xs transition-all">
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 px-4 py-2 border border-cyan/12 hover:border-cyan/40 hover:text-cyan hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,245,255,0.15)] text-text-body font-mono text-xs transition-all">
                <Mail className="w-3.5 h-3.5" /> {CONTACT_EMAIL}
              </a>
            </div>

            <div className={cn("flex flex-wrap gap-3", isRTL && "justify-end")}>
              <NeonButton href={getPath("/contact")} variant="primary">{t.about.connect}</NeonButton>
              <NeonButton href={getPath("/resume")} variant="secondary">{t.about.view_resume}</NeonButton>
            </div>
          </motion.div>

          {/* Right – Photo */}
          <motion.div variants={fadeInUp} className="lg:col-span-5">
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              whileInView={{ clipPath: "inset(0% 0 0 0)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
            <motion.div className="relative group" whileHover={{ scale: 1.015 }} transition={{ type: "spring", stiffness: 200, damping: 22 }}>
              <div className="absolute -inset-0.5 bg-gradient-to-b from-cyan/40 to-purple/20 opacity-40 blur-sm group-hover:opacity-80 transition-opacity duration-500" />
              <HUDFrame className="relative bg-cyber-dark overflow-hidden aspect-[4/5] w-full">
                {!photoLoadFailed ? (
                  <Image
                    key={photoSource}
                    src={photoSource}
                    alt="Mohammad Raouf Abedini"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    unoptimized
                    priority
                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                    onError={handlePhotoError}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-b from-cyber-dark to-black">
                    <div className="text-center font-mono">
                      <p className="text-cyan text-2xl font-bold tracking-widest">MRA</p>
                      <p className="text-text-body text-xs mt-2">{t.about.photo_unavailable}</p>
                      <button type="button"
                        className="mt-4 px-3 py-1 border border-cyan/30 text-cyan/80 text-xs hover:border-cyan hover:text-cyan transition-colors"
                        onClick={handlePhotoRetry}>
                        {t.about.retry_photo}
                      </button>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/95 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 font-mono text-xs text-cyan/80 space-y-0.5">
                  <div className="flex justify-between">
                    <span>{t.about.terminal_subject}</span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                      {t.about.terminal_online}
                    </span>
                  </div>
                  <div>{t.about.terminal_clearance}</div>
                  <div>{t.about.terminal_location}</div>
                </div>
              </HUDFrame>
            </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ─── SPECIALIZATIONS ─── */}
        <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeInUp} className={cn("flex items-center gap-3 border-b border-cyan/12 pb-3 mb-8", isRTL && "flex-row-reverse")}>
            <span className="text-cyan font-bold font-mono text-lg">01.</span>
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">{t.about.specializations}</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {specializations.map((spec) => (
              <motion.div key={spec.label} variants={fadeInUp}>
                <div className={`group h-full p-6 border bg-[#030712]/60 hover:bg-cyan/[0.04] transition-all duration-300 ${spec.accentClass}`}>
                  <div className={cn("flex items-center gap-3 mb-5", isRTL && "flex-row-reverse")}>
                    <spec.icon className={`w-5 h-5 ${spec.iconClass}`} />
                    <h3 className={`font-mono text-sm font-bold uppercase tracking-wide ${spec.iconClass}`}>{spec.label}</h3>
                  </div>
                  <ul className="space-y-2">
                    {spec.items.map((item) => (
                      <li key={item} className={cn("flex items-start gap-2 text-sm text-text-body", isRTL && "flex-row-reverse")}>
                        <ChevronRight className={cn(`w-3.5 h-3.5 mt-0.5 shrink-0 ${spec.iconClass} opacity-60`, isRTL && "rotate-180")} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── SKILLS MATRIX ─── */}
        <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeInUp} className={cn("flex items-center gap-3 border-b border-cyan/12 pb-3 mb-8", isRTL && "flex-row-reverse")}>
            <span className="text-cyan font-bold font-mono text-lg">02.</span>
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">{t.about.skills}</h2>
          </motion.div>
          <div className="space-y-5">
            {skillGroups.map((group) => (
              <motion.div key={group.label} variants={fadeInUp}>
                <div className={cn("flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4", isRTL && "sm:flex-row-reverse")}>
                  <div className={cn("w-28 shrink-0 pt-1", isRTL && "text-right")}>
                    <span className="font-mono text-xs text-text-body uppercase tracking-widest">{group.label}</span>
                  </div>
                  <div className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}>
                    {group.skills.map((skill) => (
                      <span key={skill}
                        className="px-2.5 py-1 border border-cyan/10 bg-cyan/[0.03] hover:border-cyan/40 hover:text-cyan text-text-body font-mono text-xs transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── ACTIVE OPERATIONS ─── */}
        <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeInUp} className={cn("flex items-center gap-3 border-b border-cyan/12 pb-3 mb-8", isRTL && "flex-row-reverse")}>
            <span className="text-cyan font-bold font-mono text-lg">03.</span>
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">{t.about.active_operations}</h2>
            <span className={cn("font-mono text-xs text-text-meta", isRTL ? "mr-auto" : "ml-auto")}>THE_LAB</span>
          </motion.div>
          <div className="space-y-1">
            {activeLabs.map((lab) => (
              <motion.div key={lab.id} variants={fadeInUp}>
                <div className={cn("group flex items-center gap-3 sm:gap-4 p-3 border border-transparent hover:border-cyan/25 hover:bg-cyan/[0.06] transition-all min-w-0", isRTL && "flex-row-reverse")}>
                  <span className="font-mono text-xs text-text-meta w-8 shrink-0">{lab.id}</span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 border uppercase tracking-widest shrink-0 ${statusStyles[lab.status]}`}>
                    {lab.status}
                  </span>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium truncate min-w-0">{lab.title}</span>
                  <div className={cn("hidden sm:flex gap-2 shrink-0", isRTL ? "mr-auto" : "ml-auto")}>
                    {lab.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] text-text-meta bg-cyan/[0.03] px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeInUp} className={cn("mt-6", isRTL && "text-left")}>
            <NeonButton href={getPath("/lab")} variant="outline">
              <Cpu className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} /> {t.lab.enter_lab}
            </NeonButton>
          </motion.div>
        </motion.section>

        {/* ─── EDUCATION QUICK VIEW ─── */}
        <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeInUp} className={cn("flex items-center gap-3 border-b border-cyan/12 pb-3 mb-8", isRTL && "flex-row-reverse")}>
            <span className="text-cyan font-bold font-mono text-lg">04.</span>
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">{t.about.education}</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div variants={fadeInUp}>
              <HUDFrame className="p-5 bg-[#030712]/60 h-full">
                <div className={cn("flex items-start justify-between gap-2 mb-2", isRTL && "flex-row-reverse")}>
                  <h3 className="text-white font-bold">{t.about.degree_bachelor}</h3>
                  <span className="font-mono text-xs text-cyan shrink-0">2024–2026</span>
                </div>
                <p className="text-text-body font-mono text-xs mb-3">Macquarie University · WAM 76.27</p>
                <p className="text-xs text-text-body">{t.about.degree_bachelor_courses}</p>
              </HUDFrame>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <HUDFrame className="p-5 bg-[#030712]/60 h-full">
                <div className={cn("flex items-start justify-between gap-2 mb-2", isRTL && "flex-row-reverse")}>
                  <h3 className="text-white font-bold">{t.about.degree_diploma}</h3>
                  <span className="font-mono text-xs text-amber shrink-0">2023–2024</span>
                </div>
                <p className="text-text-body font-mono text-xs mb-3">Macquarie University · WAM 71.75</p>
                <p className="text-xs text-text-body">{t.about.degree_diploma_desc}</p>
              </HUDFrame>
            </motion.div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
