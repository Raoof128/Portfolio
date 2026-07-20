"use client";

import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArrowLeft, Terminal, AlertTriangle, Cpu } from "lucide-react";
import { fadeInLeft, fadeInRight } from "@/lib/utils";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { cn } from "@/lib/utils";
import type { LabExperiment } from "@/lib/data";

const EXT_MAP: Record<string, string> = {
  rust: "rs",
  python: "py",
  go: "go",
  javascript: "js",
  typescript: "ts",
  c: "c",
  cpp: "cpp",
};

function editorFilename(tech: string[]): string {
  const first = (tech[0] ?? "").toLowerCase();
  return `src/main.${EXT_MAP[first] ?? (first || "code")}`;
}

export function LabDetailClient({ exp }: { exp: LabExperiment }) {
  const { locale, t } = useTranslation();
  const isRTL = locale === "fa" || locale === "ar";

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  const statusLabel = (status: string) =>
    status === "ACTIVE"
      ? t.about.status_active
      : status === "ARCHIVED"
        ? t.about.status_archived
        : t.about.status_concept;

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden">
      <ActiveGrid />

      <div
        className={cn(
          "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
          isRTL && "text-right",
        )}
      >
        {/* Back Link */}
        <div className="mb-6">
          <NeonButton
            href={getPath("/lab")}
            variant="outline"
            className="text-xs px-3 py-1"
          >
            <ArrowLeft
              className={cn("w-3 h-3", isRTL ? "ml-2 rotate-180" : "mr-2")}
            />{" "}
            {t.lab_detail.exit}
          </NeonButton>
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Info */}
          <AnimatedSection
            variants={fadeInLeft}
            className="lg:col-span-4 space-y-6"
          >
            <div className="p-6 bg-[#030712]/60 border border-cyan/12 rounded-lg backdrop-blur-sm">
              <div className="font-mono text-xs text-text-body mb-2">
                {t.lab_detail.experiment_id}: {exp.id}
              </div>
              <h1
                lang={locale === "en" ? undefined : "en"}
                className="text-2xl font-bold text-white mb-4"
              >
                {exp.title}
              </h1>

              <div
                className={`inline-flex items-center gap-2 px-2 py-1 rounded border text-xs font-mono mb-6 ${
                  exp.status === "ACTIVE"
                    ? "bg-green-500/10 text-green-400 border-green-500/30"
                    : exp.status === "CONCEPT"
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                      : "bg-cyber-gray text-text-body border-cyan/15"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${exp.status === "ACTIVE" ? "bg-green-400" : "hidden"}`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      exp.status === "ACTIVE"
                        ? "bg-green-500"
                        : exp.status === "CONCEPT"
                          ? "bg-yellow-500"
                          : "bg-text-body"
                    }`}
                  />
                </span>
                {statusLabel(exp.status)}
              </div>

              <p
                lang={locale === "en" ? undefined : "en"}
                className="text-text-body text-sm leading-relaxed mb-6"
              >
                {exp.description}
              </p>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono text-cyan mb-2 flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> {t.lab_detail.objective}
                  </div>
                  <p
                    lang={locale === "en" ? undefined : "en"}
                    className="text-sm text-slate-300"
                  >
                    {exp.objective}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-mono text-yellow-500 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" />{" "}
                    {t.lab_detail.constraints}
                  </div>
                  <p
                    lang={locale === "en" ? undefined : "en"}
                    className="text-xs text-text-body font-mono bg-black/30 p-2 rounded border border-yellow-500/10"
                  >
                    {exp.constraints}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-dashed border-cyan/15 rounded flex flex-wrap gap-2">
              {exp.tech.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-2 py-1 bg-cyan/5 text-text-body rounded flex items-center gap-1"
                >
                  <Cpu className="w-3 h-3" /> {tech}
                </span>
              ))}
            </div>
          </AnimatedSection>

          {/* Right Column: Code Editor */}
          <AnimatedSection
            variants={fadeInRight}
            delay={0.15}
            className="lg:col-span-8"
          >
            <div className="bg-[#0d0d0d] border border-cyber-gray rounded-lg overflow-hidden font-mono text-sm shadow-2xl">
              {/* Fake Window Header */}
              <div className="bg-cyber-dark border-b border-cyber-gray p-3 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="text-text-body text-xs">
                  {editorFilename(exp.tech)}
                </div>
                <div className="w-10" />
              </div>

              {/* Code Content — valid <pre><code> with block-level line spans
                  (a <div> inside <pre> is invalid HTML). dir=ltr so code never
                  mirrors on RTL locales. */}
              <div className="p-6 overflow-x-auto" dir="ltr">
                <pre className="text-slate-300 leading-relaxed">
                  <code>
                    {exp.codeSnippet.split("\n").map((line, i) => (
                      <span key={i} className="grid grid-cols-[2.5rem_1fr]">
                        <span className="text-text-meta select-none text-right pr-4">
                          {i + 1}
                        </span>
                        <span className="whitespace-pre">{line}</span>
                      </span>
                    ))}
                  </code>
                </pre>
              </div>

              {/* Status Bar */}
              <div className="bg-cyan/10 border-t border-cyan/20 p-2 text-xs text-cyan flex justify-between px-4">
                <span>{t.lab_detail.read_only}</span>
                <span>UTF-8</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
