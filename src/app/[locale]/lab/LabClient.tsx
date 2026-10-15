"use client";

import Link from "next/link";
import type { LabExperiment } from "@/lib/data";
import { AlertTriangle, Beaker, GitBranch, ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { getPageSupportCopy } from "@/lib/page-support-copy";
import "@/components/os/supporting-apps.css";

export function LabClient({
  experiments,
}: {
  experiments: Omit<LabExperiment, "codeSnippet">[];
}) {
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
    <div className="os-support os-lab">
      <div className="os-lab-header">
        <span className="os-eyebrow-row">
          <Beaker aria-hidden="true" size={16} />
          {t.lab_page.experimental_division}
        </span>
        <h1>{t.lab_page.title}</h1>
        <p className="os-prose">
          {t.lab_page.description_1} <strong>{t.lab_page.description_2}</strong>
          {t.lab_page.description_3}
        </p>
      </div>

      <div className="os-lab-grid">
        {experiments.map((exp) => (
          <article key={exp.id} className="os-lab-card">
            <div className="os-lab-card-head">
              <span className="os-lab-id">
                {t.lab_page.id_label} <bdi dir="ltr">{exp.id}</bdi>
              </span>
              <span
                className="os-status"
                data-state={exp.status === "ACTIVE" ? "active" : "inactive"}
              >
                {statusLabel(exp.status)}
              </span>
            </div>
            <h2>{exp.title}</h2>
            <p>{exp.description}</p>
            <ul className="os-lab-tech">
              {exp.tech.map((tech) => (
                <li key={tech} className="os-chip">
                  {tech}
                </li>
              ))}
            </ul>
            <Link
              href={getPath(`/lab/${exp.id}`)}
              className="os-text-link os-lab-analysis"
            >
              {t.lab_page.view_analysis}
              {/* Forward arrow: up-right in LTR, mirrored to up-left in RTL. */}
              <ArrowUpRight className="os-flip" aria-hidden="true" size={14} />
            </Link>
          </article>
        ))}

        <a
          href="https://github.com/Raoof128"
          target="_blank"
          rel="noopener noreferrer"
          className="os-lab-card os-lab-card--link"
        >
          <GitBranch aria-hidden="true" size={20} />
          <p>{t.lab_page.more_on_github}</p>
          <span className="sr-only">{copy.opensInNewTab}</span>
        </a>
      </div>

      <div className="os-lab-footnote">
        <AlertTriangle aria-hidden="true" size={16} />
        <p>{t.lab_page.risk_disclaimer}</p>
      </div>
    </div>
  );
}
