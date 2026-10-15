import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Locale } from "@/i18n";
import { projects, type Project } from "@/lib/data";
import { getOSCopy } from "./os-copy";
import { OSIcon, type PortfolioApp } from "./OSIcon";

const ProofAtlas = dynamic(
  () => import("./ProofAtlas").then((module) => module.ProofAtlas),
  { ssr: true },
);

const apps: PortfolioApp[] = [
  "projects",
  "research",
  "about",
  "resume",
  "contact",
];
const appPaths = {
  projects: "/projects",
  research: "/write-ups",
  about: "/about",
  resume: "/resume",
  contact: "/contact",
};

// Build-time stat callout for the Projects tile: the total and the count per category.
const projectList = Object.values(projects);
const projectCounts = projectList.reduce<Record<Project["category"], number>>(
  (counts, project) => ({
    ...counts,
    [project.category]: counts[project.category] + 1,
  }),
  { OFFENSIVE: 0, DEFENSIVE: 0, ENGINEERING: 0 },
);

export function Desktop({
  locale,
  role,
  interactive,
}: {
  locale: Locale;
  role: string;
  interactive?: boolean;
}) {
  const copy = getOSCopy(locale);
  const path = (value: string) =>
    locale === "en" ? value : `/${locale}${value}`;
  const hints = {
    projects: copy.appProjects,
    research: copy.appResearch,
    about: copy.appAbout,
    resume: copy.appResume,
    contact: copy.appContact,
  };
  return (
    <div className="os-desktop" data-spotlight-field="">
      <div className="os-desktop-identity os-desktop-identity--atlas">
        <section className="os-intro">
          <p className="os-eyebrow">{copy.independentResearch}</p>
          <h1
            tabIndex={-1}
            lang={copy.nameLocale}
            dir={copy.nameLocale === "en" ? "ltr" : "rtl"}
          >
            {copy.givenName} <span>{copy.familyName}.</span>
          </h1>
          <p className="os-role">{role}</p>
          <p className="os-desktop-summary">{copy.summary}</p>
          <div className="os-direct-links">
            <Link className="os-button" href={path("/projects")}>
              {copy.explore}
              <ArrowRight aria-hidden="true" />
            </Link>
            <a
              className="os-button os-button--secondary"
              href="/Mohammad_Raouf_Abedini_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.viewResume}
              <ExternalLink className="os-external-icon" aria-hidden="true" />
            </a>
          </div>
        </section>
        <ProofAtlas
          locale={locale}
          interactive={interactive}
          className="proof-atlas--desktop"
        />
      </div>
      <section className="os-apps" aria-label={copy.appNavigation}>
        <p className="os-section-label">{copy.workspaceHint}</p>
        <div className="os-app-grid">
          {apps.map((app) => (
            <Link
              className="os-app os-rim"
              key={app}
              data-app={app}
              data-spotlight=""
              href={path(appPaths[app])}
            >
              <OSIcon app={app} tile />
              <strong>{copy[app]}</strong>
              <small>{hints[app]}</small>
              {app === "projects" && (
                <span className="os-app-stat">
                  <span className="os-app-stat-figure">
                    {projectList.length}
                  </span>
                  <span className="os-app-stat-breakdown">
                    <span>
                      {copy.categoryOffensive} {projectCounts.OFFENSIVE}
                    </span>
                    <span>
                      {copy.categoryDefensive} {projectCounts.DEFENSIVE}
                    </span>
                    <span>
                      {copy.categoryEngineering} {projectCounts.ENGINEERING}
                    </span>
                  </span>
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>
      <nav className="os-desktop-footer" aria-label={copy.navigation}>
        <Link href={path("/lab")}>
          {copy.experiments}
          <ArrowRight aria-hidden="true" />
        </Link>
        <div>
          <Link href={path("/security-policy")}>{copy.securityPolicy}</Link>
          <Link href={path("/hall-of-fame")}>{copy.hallOfFame}</Link>
        </div>
      </nav>
    </div>
  );
}
