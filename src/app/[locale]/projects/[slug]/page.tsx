import { OSApplicationBridge } from "@/components/os/OSApplicationBridge";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data";
import { buildProjectSummaries } from "@/lib/project-summaries";
import {
  getLocalizedProject,
  getProjectDiagramCopy,
} from "@/lib/project-localization";
import { ORCID_URL, SITE_LAST_MODIFIED, SITE_URL } from "@/lib/constants";
import {
  buildAlternates,
  LOCALE_PREFIX,
  serializeJsonLd,
  breadcrumbList,
  OG_IMAGES,
  TWITTER_IMAGE,
  ogBase,
} from "@/lib/seo";
import { resolveLocale, getDictionary, type Locale } from "@/i18n";
import { ProjectDetailClient } from "./ProjectDetailClient";
import {
  invisibleWindowStoryCopy,
  simurghEvidenceStoryCopy,
  zurvanEvidenceStoryCopy,
} from "@/lib/project-content/evidence-story-copy";

interface PageProps {
  // Locale is present in params at runtime (parent [locale] segment).
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({
    slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const project = Object.hasOwn(projects, slug) ? projects[slug] : undefined;
  const t = await getDictionary(locale as Locale);

  if (!project) {
    return {
      title: t.seo.project_not_found_title,
      description: t.seo.project_not_found_description,
    };
  }

  const localizedProject = getLocalizedProject(project, locale as Locale);
  const description = localizedProject.description;
  const prefix = LOCALE_PREFIX[locale] ?? "";
  const pageUrl = `${SITE_URL}${prefix}/projects/${slug}`;
  return {
    title: `${localizedProject.title} | ${t.seo.projects_title}`,
    description,
    alternates: buildAlternates(`/projects/${slug}`, locale),
    openGraph: {
      ...ogBase(locale),
      url: pageUrl,
      title: `${localizedProject.title} | Mohammad Raouf Abedini`,
      description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: `${localizedProject.title} | Mohammad Raouf Abedini`,
      description,
      images: TWITTER_IMAGE,
    },
  };
}

// Person reference shared by the global Person node (layout) and every
// scholarly work, so Google/AI engines resolve them to one ORCID-backed author.
const AUTHOR = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Mohammad Raouf Abedini",
  sameAs: [ORCID_URL],
} as const;

function buildProjectJsonLd(
  project: (typeof projects)[string],
  slug: string,
  locale: string,
  crumbs: { home: string; section: string; conditionsOfAccess: string },
) {
  const prefix = LOCALE_PREFIX[locale] ?? "";
  // Locale-aware canonical entity URL — a Persian page identifies itself as the
  // Persian URL, not the English one.
  const pageUrl = `${SITE_URL}${prefix}/projects/${slug}`;
  const localizedProject = getLocalizedProject(project, locale as Locale);
  const description = localizedProject.description;
  const lang = locale;
  const projectDateModified = project.updatedAt ?? SITE_LAST_MODIFIED;

  // Each paper that carries a DOI becomes a citable ScholarlyArticle keyed on
  // its DOI — a stable, language-independent identifier. The PDFs are English,
  // so the article node keeps inLanguage "en" regardless of page locale.
  const articles = (project.papers ?? [])
    .filter((paper) => Boolean(paper.doi))
    .map((paper) => {
      const doiUrl = `https://doi.org/${paper.doi}`;
      return {
        "@type": "ScholarlyArticle",
        "@id": doiUrl,
        headline: paper.title,
        name: paper.title,
        ...(paper.description ? { abstract: paper.description } : {}),
        ...(paper.year ? { datePublished: paper.year } : {}),
        // A website revision does not establish that the original DOI paper changed.
        inLanguage: "en",
        author: AUTHOR,
        publisher: { "@type": "Organization", name: paper.venue ?? "Zenodo" },
        url: doiUrl,
        sameAs: doiUrl,
        identifier: {
          "@type": "PropertyValue",
          propertyID: "DOI",
          value: paper.doi,
        },
        isPartOf: { "@id": `${pageUrl}#project` },
      };
    });

  const projectNode = {
    "@type": project.links.repo ? "SoftwareSourceCode" : "CreativeWork",
    "@id": `${pageUrl}#project`,
    name: localizedProject.title,
    description,
    url: pageUrl,
    inLanguage: lang,
    dateModified: projectDateModified,
    keywords: localizedProject.tags.join(", "),
    author: AUTHOR,
    ...(project.links.repo ? { codeRepository: project.links.repo } : {}),
    ...(project.links.repoVisibility === "private"
      ? { conditionsOfAccess: crumbs.conditionsOfAccess }
      : {}),
    ...(articles.length
      ? { subjectOf: articles.map((a) => ({ "@id": a["@id"] })) }
      : {}),
  };

  const breadcrumb = breadcrumbList([
    { name: crumbs.home, url: `${SITE_URL}${prefix || "/"}` },
    { name: crumbs.section, url: `${SITE_URL}${prefix}/projects` },
    { name: localizedProject.title, url: pageUrl },
  ]);

  return serializeJsonLd({
    "@context": "https://schema.org",
    "@graph": [projectNode, breadcrumb, ...articles],
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const project = Object.hasOwn(projects, slug) ? projects[slug] : undefined;

  if (!project) {
    notFound();
  }

  const t = await getDictionary(locale);
  const evidenceStory =
    slug === "project-simurgh"
      ? { kind: "simurgh" as const, copy: simurghEvidenceStoryCopy[locale] }
      : slug === "invisible-window-research"
        ? {
            kind: "invisible-window" as const,
            copy: invisibleWindowStoryCopy[locale],
          }
        : slug === "project-zurvan"
          ? { kind: "zurvan" as const, copy: zurvanEvidenceStoryCopy[locale] }
          : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildProjectJsonLd(project, slug, locale, {
            home: t.nav.home,
            section: t.seo.projects_title,
            // Localised alongside the node's `inLanguage`, not fixed English.
            conditionsOfAccess: t.seo.conditions_of_access,
          }),
        }}
      />
      <OSApplicationBridge
        locale={locale as Locale}
        route={`/projects/${slug}`}
      >
        <ProjectDetailClient
          project={getLocalizedProject(project, locale)}
          slug={slug}
          summaries={buildProjectSummaries(locale)}
          diagramCopy={getProjectDiagramCopy(locale)}
          evidenceStory={evidenceStory}
        />
      </OSApplicationBridge>
    </>
  );
}
