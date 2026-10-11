import Link from "next/link";
import { ArrowRight, ExternalLink, FolderOpen } from "lucide-react";
import type { Locale } from "@/i18n";
import { getOSCopy } from "./os-copy";
import { OSIcon, type PortfolioApp } from "./OSIcon";

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

export function Desktop({ locale, role }: { locale: Locale; role: string }) {
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
  const featured = [
    {
      slug: "project-simurgh",
      title: "Project Simurgh",
      description: copy.featuredSimurgh,
    },
    {
      slug: "invisible-window-research",
      title: "Invisible Window",
      description: copy.featuredInvisible,
    },
    {
      slug: "project-zurvan",
      title: "Project Zurvan",
      description: copy.featuredZurvan,
    },
  ];
  return (
    <div className="os-desktop">
      <div className="os-desktop-identity">
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
              href="/Mohammad_Raouf_Abedini_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.viewResume}
              <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </section>
        <aside className="os-featured" aria-label={copy.selectedWork}>
          <div className="os-featured-heading">
            <FolderOpen aria-hidden="true" />
            {copy.selectedWork}
          </div>
          {featured.map((project) => (
            <Link
              key={project.slug}
              data-project={project.slug}
              href={path(`/projects/${project.slug}`)}
            >
              <span>
                <strong lang="en" dir="ltr">
                  {project.title}
                </strong>
                <small>{project.description}</small>
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </aside>
      </div>
      <section className="os-apps" aria-label={copy.appNavigation}>
        <p className="os-section-label">{copy.workspaceHint}</p>
        <div className="os-app-grid">
          {apps.map((app) => (
            <Link
              className="os-app"
              key={app}
              data-app={app}
              href={path(appPaths[app])}
            >
              <OSIcon app={app} dimensional />
              <strong>{copy[app]}</strong>
              <small>{hints[app]}</small>
            </Link>
          ))}
        </div>
      </section>
      <nav className="os-desktop-footer" aria-label={copy.research}>
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
