"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import type { LabExperiment } from "@/lib/data";
import { getPageSupportCopy } from "@/lib/page-support-copy";
import "@/components/os/supporting-apps.css";

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
  const copy = getPageSupportCopy(locale);

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
    <div className="os-support os-lab-detail">
      <div className="os-support-actions">
        <Link href={getPath("/lab")} className="os-button--secondary">
          <ArrowLeft className="os-flip" aria-hidden="true" size={16} />
          {t.lab_detail.exit}
        </Link>
      </div>

      <div className="os-lab-detail-grid">
        {/* Information column */}
        <div className="os-lab-detail-info">
          <div className="os-callout">
            <p className="os-lab-id">
              {t.lab_detail.experiment_id}: <bdi dir="ltr">{exp.id}</bdi>
            </p>
            <h1>{exp.title}</h1>
            <span
              className="os-status"
              data-state={exp.status === "ACTIVE" ? "active" : "inactive"}
            >
              {statusLabel(exp.status)}
            </span>
            <p>{exp.description}</p>

            <div>
              <h2>{t.lab_detail.objective}</h2>
              <p className="os-lab-objective">{exp.objective}</p>
            </div>

            <div>
              <h2>{t.lab_detail.constraints}</h2>
              <p className="os-lab-constraints">{exp.constraints}</p>
            </div>
          </div>

          <ul className="os-lab-tech-list">
            {exp.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>

        {/* Code column. dir=ltr so code never mirrors on RTL locales. */}
        <div className="os-code-panel">
          <div className="os-code-panel-head">
            <span>{copy.sourceCode}</span>
            <bdi dir="ltr">{editorFilename(exp.tech)}</bdi>
          </div>
          <div
            className="os-code-scroll"
            dir="ltr"
            lang={locale}
            tabIndex={0}
            role="region"
            aria-label={copy.sourceCode}
          >
            <pre dir="ltr" lang="en">
              <code>
                {exp.codeSnippet.split("\n").map((line, i) => (
                  <span key={i} className="os-code-line">
                    <span className="os-code-number">{i + 1}</span>
                    <span className="os-code-text">{line}</span>
                  </span>
                ))}
              </code>
            </pre>
          </div>
          <div className="os-code-panel-foot">
            <span>{t.lab_detail.read_only}</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
}
