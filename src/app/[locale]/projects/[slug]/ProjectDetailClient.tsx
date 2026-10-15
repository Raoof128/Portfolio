"use client";

import { useContentId } from "@/components/os/application-context";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Download, FileText } from "lucide-react";
import type { ProjectPaper } from "@/lib/data";
import type {
  LocalizedProject,
  ProjectDiagramCopy,
} from "@/lib/project-localization";
import type { ProjectSummary } from "@/lib/project-summaries";
import type {
  InvisibleWindowStoryCopy,
  SimurghEvidenceStoryCopy,
  ZurvanEvidenceStoryCopy,
} from "@/lib/project-content/evidence-story-copy";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { formatNumber } from "@/i18n/format";
import dynamic from "next/dynamic";
import { CONTACT_EMAIL_GMAIL } from "@/lib/constants";
import { ProjectExplorer } from "@/components/os/ProjectExplorer";
import { ProjectDiagram } from "@/components/os/ProjectDiagram";
import "@/components/os/evidence-story-common.css";
import { ProjectMotion } from "@/components/os/ProjectMotion";
import { getOSCopy } from "@/components/os/os-copy";

const SimurghEvidenceStory = dynamic(
  () =>
    import("@/components/os/SimurghEvidenceStory").then(
      (module) => module.SimurghEvidenceStory,
    ),
  { ssr: true },
);
const InvisibleWindowEvidenceStory = dynamic(
  () =>
    import("@/components/os/InvisibleWindowEvidenceStory").then(
      (module) => module.InvisibleWindowEvidenceStory,
    ),
  { ssr: true },
);
const ZurvanEvidenceStory = dynamic(
  () =>
    import("@/components/os/ZurvanEvidenceStory").then(
      (module) => module.ZurvanEvidenceStory,
    ),
  { ssr: true },
);

type EvidenceStory =
  | { kind: "simurgh"; copy: SimurghEvidenceStoryCopy }
  | { kind: "invisible-window"; copy: InvisibleWindowStoryCopy }
  | { kind: "zurvan"; copy: ZurvanEvidenceStoryCopy };

/** One primary action per dossier header; every other resource stays secondary. */
function ResourceLink({
  href,
  children,
  download = false,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  download?: boolean;
  primary?: boolean;
}) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      className={primary ? "os-button" : "os-project-resource"}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      download={download || undefined}
    >
      {children}
      {download ? (
        <Download size={15} aria-hidden="true" />
      ) : (
        <ArrowUpRight className="os-icon-flip" size={15} aria-hidden="true" />
      )}
    </a>
  );
}

export function ProjectDetailClient({
  project,
  slug,
  summaries,
  diagramCopy,
  evidenceStory,
}: {
  project: LocalizedProject;
  slug: string;
  summaries: ProjectSummary[];
  diagramCopy: ProjectDiagramCopy;
  evidenceStory: EvidenceStory | null;
}) {
  const { locale, t } = useTranslation();
  const contentId = useContentId();
  const copy = getOSCopy(locale);
  const getPath = (path: string) =>
    locale === defaultLocale ? path : `/${locale}${path}`;
  const categoryLabels = {
    ENGINEERING: copy.categoryEngineering,
    DEFENSIVE: copy.categoryDefensive,
    OFFENSIVE: copy.categoryOffensive,
  };
  const descriptionLocale = project.contentLocale;
  const paperEntries: ProjectPaper[] =
    project.papers ??
    (project.links.paper
      ? [
          {
            title: project.title,
            label: t.project_detail.paper,
            href: project.links.paper,
            kind: "download",
          },
        ]
      : []);

  return (
    <ProjectExplorer selectedSlug={slug} summaries={summaries}>
      <article
        className="os-project-dossier"
        lang={project.contentLocale}
        dir={locale === "fa" || locale === "ar" ? "rtl" : "ltr"}
      >
        <div className="os-project-intro">
          <header className="os-project-dossier-header">
            <div className="os-project-row-meta">
              <span>{categoryLabels[project.category]}</span>
              <time dateTime={project.year}>
                {formatNumber(Number(project.year), locale, {
                  useGrouping: false,
                })}
              </time>
            </div>
            <h1
              lang={project.titleLocale}
              dir={project.titleLocale === "en" ? "ltr" : undefined}
            >
              {project.title}
            </h1>
            <p
              className="os-project-lead"
              lang={descriptionLocale}
              dir={
                descriptionLocale === "fa" || descriptionLocale === "ar"
                  ? "rtl"
                  : "ltr"
              }
            >
              {project.fullDescription}
            </p>
            <ul className="os-project-tags">
              {project.tags.map((tag) => (
                <li key={tag}>
                  <bdi>{tag}</bdi>
                </li>
              ))}
            </ul>
            <div
              className="os-project-resources"
              role="group"
              aria-label={t.project_detail.project_links}
            >
              {project.links.paper && (
                <ResourceLink href={project.links.paper} download primary>
                  {t.project_detail.download_paper}
                </ResourceLink>
              )}
              {project.links.repo && (
                <ResourceLink
                  primary={!project.links.paper}
                  href={
                    project.links.repoVisibility === "private"
                      ? `mailto:${CONTACT_EMAIL_GMAIL}?subject=${encodeURIComponent(`${t.project_detail.request_source}: ${project.title}`)}`
                      : project.links.repo
                  }
                >
                  {project.links.repoVisibility === "private"
                    ? t.project_detail.request_source
                    : t.project_detail.source_code}
                </ResourceLink>
              )}
              {project.links.demo && (
                <ResourceLink href={project.links.demo}>
                  {t.project_detail.demo}
                </ResourceLink>
              )}
              {project.links.preprint && (
                <ResourceLink href={project.links.preprint}>
                  {t.project_detail.read_preprint}
                </ResourceLink>
              )}
              {project.links.doi && (
                <ResourceLink href={project.links.doi}>
                  {t.project_detail.doi_record}
                </ResourceLink>
              )}
              {project.links.caseStudy && (
                <Link
                  className="os-project-resource"
                  href={getPath(project.links.caseStudy)}
                >
                  {t.common.case_study}
                  <ArrowUpRight
                    className="os-icon-flip"
                    size={15}
                    aria-hidden="true"
                  />
                </Link>
              )}
            </div>
            {project.links.repoVisibility === "private" && (
              <p>{t.project_detail.private_source_note}</p>
            )}
          </header>
          <ProjectMotion slug={slug} locale={locale} />
        </div>

        {/* Anchors keep all evidence available to readers and crawlers without JavaScript. */}
        <nav
          className="os-project-section-nav"
          aria-label={copy.projectArchitecture}
        >
          <a href={`#${contentId("overview")}`}>{copy.overview}</a>
          <a href={`#${contentId("evidence")}`}>{copy.evidence}</a>
          <a href={`#${contentId("methods")}`}>{copy.methods}</a>
        </nav>

        <section
          id={contentId("overview")}
          className="os-project-section"
          aria-labelledby={contentId("overview-heading")}
        >
          <p className="os-project-eyebrow">
            {formatNumber(1, locale, {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}{" "}
            / {copy.overview}
          </p>
          {evidenceStory?.kind === "simurgh" ? (
            <SimurghEvidenceStory locale={locale} copy={evidenceStory.copy} />
          ) : evidenceStory?.kind === "invisible-window" ? (
            <InvisibleWindowEvidenceStory
              locale={locale}
              copy={evidenceStory.copy}
            />
          ) : evidenceStory?.kind === "zurvan" ? (
            <ZurvanEvidenceStory locale={locale} copy={evidenceStory.copy} />
          ) : (
            <ProjectDiagram
              project={project}
              slug={slug}
              copy={diagramCopy}
              locale={locale}
            />
          )}
          <h2 id={contentId("overview-heading")}>{t.project_detail.problem}</h2>
          <p>{project.problem}</p>
          <h3>{t.project_detail.solution_overview}</h3>
          <ol className="os-project-numbered-list">
            {project.solution.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </section>

        <section
          id={contentId("evidence")}
          className="os-project-section"
          aria-labelledby={contentId("evidence-heading")}
        >
          <p className="os-project-eyebrow">
            {formatNumber(2, locale, {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}{" "}
            / {copy.evidence}
          </p>
          <h2 id={contentId("evidence-heading")}>{t.project_detail.proof}</h2>
          <ul className="os-project-evidence-list">
            {project.proof.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          {paperEntries.length > 0 && (
            <div
              id={contentId("research-papers")}
              className="os-project-paper-library"
            >
              <div className="os-project-paper-heading">
                <h3>{t.project_detail.research_papers}</h3>
                <span>
                  {t.project_detail.papers}:{" "}
                  <bdi>{formatNumber(paperEntries.length, locale)}</bdi>
                </span>
              </div>
              {paperEntries.map((paper, index) => (
                <article
                  key={`${index}-${paper.href}`}
                  className="os-project-paper"
                >
                  <div className="os-project-row-meta">
                    <span>{paper.label}</span>
                    {paper.status && <span>{paper.status}</span>}
                  </div>
                  <h4 lang="en" dir="ltr">
                    {paper.title}
                  </h4>
                  {paper.description && <p>{paper.description}</p>}
                  <div className="os-project-row-meta" lang="en" dir="ltr">
                    {paper.venue && <span>{paper.venue}</span>}
                    {paper.year && (
                      <time dateTime={paper.year}>{paper.year}</time>
                    )}
                    {paper.doi && (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {paper.doi}
                      </a>
                    )}
                  </div>
                  <ResourceLink
                    href={paper.href}
                    download={paper.kind === "download"}
                  >
                    <FileText size={15} aria-hidden="true" />
                    {paper.kind === "download"
                      ? t.project_detail.download_paper
                      : t.project_detail.open_record}
                  </ResourceLink>
                </article>
              ))}
            </div>
          )}
          {project.citation && (
            <aside
              className="os-project-citation"
              aria-labelledby={contentId("citation-heading")}
            >
              <h3 id={contentId("citation-heading")}>
                {t.project_detail.cite_this_work}
              </h3>
              <p lang="en" dir="ltr">
                {project.citation}
              </p>
            </aside>
          )}
        </section>

        <section
          id={contentId("methods")}
          className="os-project-section"
          aria-labelledby={contentId("methods-heading")}
        >
          <p className="os-project-eyebrow">
            {formatNumber(3, locale, {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}{" "}
            / {copy.methods}
          </p>
          <h2 id={contentId("methods-heading")}>{t.project_detail.build}</h2>
          <h3>{t.project_detail.tech_stack}</h3>
          <ul className="os-project-stack-list">
            {project.build.stack.map((technology) => (
              <li key={technology}>
                <bdi>{technology}</bdi>
              </li>
            ))}
          </ul>
          <ul className="os-project-method-list">
            {project.build.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <h3>{t.project_detail.secure}</h3>
          <ul className="os-project-method-list">
            {project.secure.measures.map((measure, index) => (
              <li key={index}>{measure}</li>
            ))}
          </ul>
        </section>
      </article>
    </ProjectExplorer>
  );
}
