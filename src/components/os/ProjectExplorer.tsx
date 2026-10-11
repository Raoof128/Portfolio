"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Folder, Search } from "lucide-react";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { formatNumber } from "@/i18n/format";
import type { ProjectSummary } from "@/lib/project-summaries";
import { searchEntries } from "@/lib/os-search-query";
import { getOSCopy } from "./os-copy";
import { ProjectThumbnail } from "./ProjectThumbnail";
import { useInitialAppState } from "./application-context";
import "./project-explorer.css";

type ProjectCategory = "ALL" | ProjectSummary["category"];

export function ProjectExplorer({
  summaries,
  selectedSlug,
  children,
}: {
  summaries: ProjectSummary[];
  selectedSlug?: string;
  children?: ReactNode;
}) {
  const { locale, t } = useTranslation();
  const copy = getOSCopy(locale);
  const fieldId = useId();
  const initial = useInitialAppState();
  const categoryLabels = {
    ALL: copy.allCategories,
    ENGINEERING: copy.categoryEngineering,
    DEFENSIVE: copy.categoryDefensive,
    OFFENSIVE: copy.categoryOffensive,
  };
  const [query, setQuery] = useState(
    () => initial.projectQuery?.slice(0, 100) ?? "",
  );
  const [category, setCategory] = useState<ProjectCategory>(() =>
    initial.projectCategory &&
    Object.hasOwn(categoryLabels, initial.projectCategory)
      ? (initial.projectCategory as ProjectCategory)
      : "ALL",
  );
  const allProjects = summaries;
  const getPath = (path: string) =>
    locale === defaultLocale ? path : `/${locale}${path}`;
  const matchingSlugs = new Set(
    searchEntries(
      allProjects.map((project) => ({
        id: project.slug,
        title: project.title,
        aliases: project.searchTitle ? [project.searchTitle] : undefined,
        description: [project.description, ...project.tags]
          .filter(Boolean)
          .join(" "),
        href: "",
        kind: "project" as const,
      })),
      query,
    ).map((entry) => entry.id),
  );
  const visibleProjects = allProjects.filter((project) => {
    // Keep the open dossier discoverable when its saved search or category
    // filter no longer matches the current project.
    if (project.slug === selectedSlug) return true;
    const matchesCategory = category === "ALL" || project.category === category;
    return matchesCategory && matchingSlugs.has(project.slug);
  });

  return (
    <div className="os-project-explorer">
      <aside className="os-explorer-sidebar">
        <Link
          className="os-explorer-index-link"
          href={getPath("/projects")}
          aria-current={!selectedSlug ? "page" : undefined}
        >
          <Folder size={17} aria-hidden="true" />
          <span>{copy.allProjects}</span>
          <span className="os-explorer-count">
            {formatNumber(allProjects.length, locale)}
          </span>
        </Link>
        <div className="os-explorer-controls">
          <label htmlFor={`${fieldId}-search`}>{copy.projectSearch}</label>
          <div className="os-explorer-search">
            <Search size={15} aria-hidden="true" />
            <input
              id={`${fieldId}-search`}
              type="search"
              value={query}
              maxLength={100}
              placeholder={copy.projectSearch}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
          </div>
          <label htmlFor={`${fieldId}-category`}>{copy.allCategories}</label>
          <select
            id={`${fieldId}-category`}
            value={category}
            onChange={(event) => {
              const value = event.target.value;
              if (Object.hasOwn(categoryLabels, value))
                setCategory(value as ProjectCategory);
            }}
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <nav className="os-explorer-project-nav" aria-label={copy.allProjects}>
          {visibleProjects.map((project) => (
            <Link
              key={project.slug}
              href={getPath(`/projects/${project.slug}`)}
              className="os-explorer-project-link"
              aria-current={selectedSlug === project.slug ? "page" : undefined}
            >
              <span
                lang={project.titleLocale}
                dir={project.titleLocale === "en" ? "ltr" : undefined}
              >
                {project.title}
              </span>
              <small>{categoryLabels[project.category]}</small>
            </Link>
          ))}
          {visibleProjects.length === 0 && (
            <p className="os-explorer-empty">{copy.noProjects}</p>
          )}
        </nav>
      </aside>
      <div className="os-explorer-content">
        {children ?? (
          <section className="os-project-index">
            <header className="os-project-index-header">
              <p className="os-project-eyebrow">{copy.selectedWork}</p>
              <h1>{copy.projects}</h1>
              <p>{t.projects_page.subtitle}</p>
            </header>
            <p className="os-explorer-results" role="status">
              {copy.allProjects} ·{" "}
              {formatNumber(visibleProjects.length, locale)} /{" "}
              {formatNumber(allProjects.length, locale)}
            </p>
            <div className="os-project-rows">
              {visibleProjects.map((project, index) => (
                <article
                  className="os-project-row os-project-row-with-preview"
                  key={project.slug}
                >
                  <span className="os-project-row-number" aria-hidden="true">
                    {formatNumber(index + 1, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                  </span>
                  <ProjectThumbnail slug={project.slug} />
                  <div className="os-project-row-summary">
                    <div className="os-project-row-meta">
                      <span>{categoryLabels[project.category]}</span>
                      <time dateTime={project.year}>
                        {formatNumber(Number(project.year), locale, {
                          useGrouping: false,
                        })}
                      </time>
                    </div>
                    <h2>
                      <Link href={getPath(`/projects/${project.slug}`)}>
                        <span
                          lang={project.titleLocale}
                          dir={project.titleLocale === "en" ? "ltr" : undefined}
                        >
                          {project.title}
                        </span>
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </Link>
                    </h2>
                    <p
                      lang={project.descriptionLocale}
                      dir={
                        project.descriptionLocale === locale ? undefined : "ltr"
                      }
                    >
                      {project.description}
                    </p>
                    <ul className="os-project-tags">
                      {project.tags.map((tag) => (
                        <li key={tag}>
                          <bdi>{tag}</bdi>
                        </li>
                      ))}
                    </ul>
                    <Link
                      className="os-project-text-link"
                      href={getPath(`/projects/${project.slug}`)}
                    >
                      {t.common.case_study}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
              {visibleProjects.length === 0 && (
                <p className="os-explorer-empty">{copy.noProjects}</p>
              )}
            </div>
          </section>
        )}
        <footer className="os-explorer-footer">
          <div className="os-explorer-footer-next">
            <div>
              <h2>{copy.contactTitle}</h2>
              <p>{copy.contactDescription}</p>
            </div>
            <Link className="os-project-resource" href={getPath("/contact")}>
              {copy.contact}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="os-explorer-footer-meta">
            <nav aria-label={copy.navigation}>
              <Link href={getPath("/write-ups")}>{copy.research}</Link>
              <Link href={getPath("/security-policy")}>
                {copy.securityPolicy}
              </Link>
              <a href="/feed.xml">RSS</a>
            </nav>
            <span>
              ©{" "}
              {formatNumber(new Date().getUTCFullYear(), locale, {
                useGrouping: false,
              })}{" "}
              <bdi lang={copy.nameLocale}>{copy.fullName}</bdi>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
