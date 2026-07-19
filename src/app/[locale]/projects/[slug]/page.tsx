import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProjectDescription } from "@/lib/data";
import { ORCID_URL, SITE_LAST_MODIFIED, SITE_URL } from "@/lib/constants";
import {
  buildAlternates,
  LOCALE_PREFIX,
  serializeJsonLd,
  OG_IMAGES,
  TWITTER_IMAGE,
} from "@/lib/seo";
import { getDictionary, defaultLocale, locales, type Locale } from "@/i18n";
import { ProjectDetailClient } from "./ProjectDetailClient";

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
  const { locale, slug } = await params;
  const project = projects[slug];
  const t = await getDictionary(locale as Locale);

  if (!project) {
    return {
      title: t.seo.project_not_found_title,
      description: t.seo.project_not_found_description,
    };
  }

  const description = getProjectDescription(project, locale as Locale);
  return {
    title: `${project.title} | ${t.seo.projects_title}`,
    description,
    alternates: buildAlternates(`/projects/${slug}`, locale),
    openGraph: {
      title: `${project.title} | Mohammad Raouf Abedini`,
      description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Mohammad Raouf Abedini`,
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
) {
  const prefix = LOCALE_PREFIX[locale] ?? "";
  // Locale-aware canonical entity URL — a Persian page identifies itself as the
  // Persian URL, not the English one.
  const pageUrl = `${SITE_URL}${prefix}/projects/${slug}`;
  const description = getProjectDescription(project, locale as Locale);
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
        dateModified: SITE_LAST_MODIFIED,
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
    name: project.title,
    description,
    url: pageUrl,
    inLanguage: lang,
    dateModified: projectDateModified,
    keywords: project.tags.join(", "),
    author: AUTHOR,
    ...(project.links.repo ? { codeRepository: project.links.repo } : {}),
    ...(articles.length
      ? { subjectOf: articles.map((a) => ({ "@id": a["@id"] })) }
      : {}),
  };

  return serializeJsonLd({
    "@context": "https://schema.org",
    "@graph": [projectNode, ...articles],
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = (rawLocale in locales ? rawLocale : defaultLocale) as Locale;
  const project = projects[slug];

  if (!project) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildProjectJsonLd(project, slug, locale),
        }}
      />
      <ProjectDetailClient project={project} slug={slug} />
    </>
  );
}
