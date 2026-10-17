"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Folder,
  Search,
} from "lucide-react";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale, type Locale } from "@/i18n";
import { formatNumber } from "@/i18n/format";
import type { ProjectSummary } from "@/lib/project-summaries";
import { searchEntries } from "@/lib/os-search-query";
import { getOSCopy } from "./os-copy";
import { ProjectThumbnail } from "./ProjectThumbnail";
import { useInitialAppState } from "./application-context";
import { useCopyrightYear } from "./use-copyright-year";
import "./project-explorer.css";

type ProjectCategory = "ALL" | ProjectSummary["category"];

/** Component-local strings that are not in the shared OS copy. */
const explorerCopy: Readonly<Record<Locale, { location: string }>> = {
  en: { location: "Location" },
  fa: { location: "مسیر" },
  ar: { location: "المسار" },
  zh: { location: "当前位置" },
  es: { location: "Ubicación" },
};

/** A project link was chosen. The explorer that mounts next moves focus to its heading. */
let pendingHeadingFocusAt = 0;
const HEADING_FOCUS_WINDOW_MS = 2000;
function markProjectNavigation() {
  pendingHeadingFocusAt = Date.now();
}

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
  const copyrightYear = useCopyrightYear();
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
  const selectedProject = selectedSlug
    ? allProjects.find((project) => project.slug === selectedSlug)
    : undefined;
  // On narrow screens the project list sits behind a disclosure. It starts closed on
  // every route, so the index or dossier comes first and the visitor opens the list to
  // browse. Wide screens ignore the disclosure and keep the list visible. The reset
  // happens during render when the selection changes, not in an effect.
  const [navState, setNavState] = useState({
    slug: selectedSlug,
    open: false,
  });
  if (navState.slug !== selectedSlug) {
    setNavState({ slug: selectedSlug, open: false });
  }
  const navOpen = navState.open;
  const navPanelId = `${fieldId}-nav`;
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

  const resultsLabel = `${copy.allProjects} · ${formatNumber(visibleProjects.length, locale)} / ${formatNumber(allProjects.length, locale)}`;
  // Screen readers hear the count once typing pauses, not on every keystroke.
  const [announcedResults, setAnnouncedResults] = useState(resultsLabel);
  useEffect(() => {
    const timer = window.setTimeout(
      () => setAnnouncedResults(resultsLabel),
      500,
    );
    return () => window.clearTimeout(timer);
  }, [resultsLabel]);

  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // The sticky navigation pane may be no taller than the window body that scrolls
  // it. Measure that body (or the viewport on a standalone page) into a custom
  // property, so the pane keeps its title and category visible at any window size.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scroller = root.closest<HTMLElement>(".os-page-content");
    const measure = () => {
      const height = scroller ? scroller.clientHeight : window.innerHeight;
      root.style.setProperty("--explorer-scroll-h", `${Math.floor(height)}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    const observer =
      typeof ResizeObserver === "undefined" || !scroller
        ? null
        : new ResizeObserver(measure);
    if (scroller) observer?.observe(scroller);
    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, []);

  // Choosing a project swaps the dossier. Focus moves to its heading so screen
  // reader and keyboard users hear the new page, and the fade is pure CSS.
  const mountedSlug = useRef(selectedSlug);
  useEffect(() => {
    const navigated =
      Date.now() - pendingHeadingFocusAt <= HEADING_FOCUS_WINDOW_MS;
    const changed = mountedSlug.current !== selectedSlug;
    mountedSlug.current = selectedSlug;
    if (!navigated && !changed) return;
    pendingHeadingFocusAt = 0;
    contentRef.current?.querySelector<HTMLElement>("h1")?.focus();
  }, [selectedSlug]);

  return (
    <div className="os-project-explorer" ref={rootRef}>
      {/* The window title is the only title above the content. The address bar is a
          breadcrumb: Projects links back to the index, and the open project is the last crumb. */}
      <div className="os-explorer-commandbar">
        <nav
          className="os-explorer-address"
          aria-label={explorerCopy[locale].location}
        >
          <Folder size={15} aria-hidden="true" />
          {selectedProject ? (
            <Link
              className="os-explorer-crumb-link"
              href={getPath("/projects")}
            >
              {copy.projects}
            </Link>
          ) : (
            <span>{copy.projects}</span>
          )}
          <ChevronRight
            className="os-icon-flip os-explorer-crumb"
            size={12}
            aria-hidden="true"
          />
          {selectedProject ? (
            <span
              className="os-explorer-crumb-current"
              aria-current="page"
              lang={selectedProject.titleLocale}
              dir={selectedProject.titleLocale === "en" ? "ltr" : undefined}
            >
              {selectedProject.title}
            </span>
          ) : (
            <span aria-current="page">{copy.allProjects}</span>
          )}
        </nav>
      </div>
      <div className="os-explorer-layout">
        <aside className="os-explorer-sidebar">
          {/* Narrow screens only: the project list is a disclosure. Wide screens hide it
              and keep the whole panel visible as the sticky navigation pane. */}
          <button
            type="button"
            className="os-explorer-nav-toggle"
            aria-expanded={navOpen}
            aria-controls={navPanelId}
            onClick={() =>
              setNavState((state) => ({ ...state, open: !state.open }))
            }
          >
            <Folder size={17} aria-hidden="true" />
            <span>{copy.allProjects}</span>
            <span className="os-explorer-count">
              {formatNumber(allProjects.length, locale)}
            </span>
            {selectedProject && (
              <span
                className="os-explorer-nav-toggle-current"
                lang={selectedProject.titleLocale}
                dir={selectedProject.titleLocale === "en" ? "ltr" : undefined}
              >
                {selectedProject.title}
              </span>
            )}
            <ChevronDown
              className="os-explorer-nav-toggle-icon"
              size={16}
              aria-hidden="true"
            />
          </button>
          <div
            id={navPanelId}
            className="os-explorer-nav-panel"
            data-open={navOpen ? "true" : "false"}
          >
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
              <label htmlFor={`${fieldId}-category`}>{copy.category}</label>
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
              <p className="sr-only" role="status">
                {announcedResults}
              </p>
            </div>
            <nav
              className="os-explorer-project-nav"
              aria-label={copy.allProjects}
            >
              {visibleProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={getPath(`/projects/${project.slug}`)}
                  className="os-explorer-project-link"
                  aria-current={
                    selectedSlug === project.slug ? "page" : undefined
                  }
                  onClick={markProjectNavigation}
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
          </div>
        </aside>
        <div className="os-explorer-content" ref={contentRef}>
          <div key={selectedSlug ?? "index"} className="os-explorer-view">
            {children ?? (
              <section className="os-project-index">
                <header className="os-project-index-header">
                  <p className="os-project-eyebrow">{copy.selectedWork}</p>
                  {/* The caption and the breadcrumb already name the view, so the
                      heading is kept for structure and screen readers only. */}
                  <h1 tabIndex={-1} className="sr-only">
                    {copy.projects}
                  </h1>
                  <p>{t.projects_page.subtitle}</p>
                </header>
                <p className="os-explorer-results">{resultsLabel}</p>
                <div className="os-project-rows">
                  {visibleProjects.map((project) => (
                    <article
                      className="os-project-row os-project-row-with-preview"
                      key={project.slug}
                    >
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
                          {/* The single link stretches over the whole card (see CSS). */}
                          <Link
                            href={getPath(`/projects/${project.slug}`)}
                            onClick={markProjectNavigation}
                          >
                            <span
                              lang={project.titleLocale}
                              dir={
                                project.titleLocale === "en" ? "ltr" : undefined
                              }
                            >
                              {project.title}
                            </span>
                            <ArrowUpRight
                              className="os-icon-flip"
                              size={18}
                              aria-hidden="true"
                            />
                          </Link>
                        </h2>
                        <p
                          lang={project.descriptionLocale}
                          dir={
                            project.descriptionLocale === locale
                              ? undefined
                              : "ltr"
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
                      </div>
                    </article>
                  ))}
                  {visibleProjects.length === 0 && (
                    <p className="os-explorer-empty">{copy.noProjects}</p>
                  )}
                </div>
              </section>
            )}
          </div>
          <footer className="os-explorer-footer">
            <div className="os-explorer-footer-next">
              <div>
                <h2>{copy.contactTitle}</h2>
                <p>{copy.contactDescription}</p>
              </div>
              <Link className="os-project-resource" href={getPath("/contact")}>
                {copy.contact}
                <ArrowUpRight
                  className="os-icon-flip"
                  size={16}
                  aria-hidden="true"
                />
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
                © {formatNumber(copyrightYear, locale, { useGrouping: false })}{" "}
                <bdi lang={copy.nameLocale}>{copy.fullName}</bdi>
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
