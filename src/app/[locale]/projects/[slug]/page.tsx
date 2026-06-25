import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data";
import { ORCID_URL, SITE_LAST_MODIFIED, SITE_URL } from "@/lib/constants";
import { buildAlternates } from "@/lib/seo";
import { ProjectDetailClient } from "./ProjectDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Locale is present in params at runtime (parent [locale] segment) for canonical.
interface MetadataProps {
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
}: MetadataProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects[slug];

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project does not exist.",
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.description,
    alternates: buildAlternates(`/projects/${slug}`, locale),
    openGraph: {
      title: `${project.title} | Mohammad Raouf Abedini`,
      description: project.description,
    },
    twitter: {
      card: "summary",
      title: `${project.title} | Mohammad Raouf Abedini`,
      description: project.description,
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

function buildProjectJsonLd(project: (typeof projects)[string], slug: string) {
  const pageUrl = `${SITE_URL}/projects/${slug}`;

  // Each paper that carries a DOI becomes a citable ScholarlyArticle keyed on
  // its DOI — the canonical signal AI answer engines use to attribute research.
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
    description: project.description,
    url: pageUrl,
    inLanguage: "en",
    dateModified: SITE_LAST_MODIFIED,
    keywords: project.tags.join(", "),
    author: AUTHOR,
    ...(project.links.repo ? { codeRepository: project.links.repo } : {}),
    ...(articles.length
      ? { subjectOf: articles.map((a) => ({ "@id": a["@id"] })) }
      : {}),
  };

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [projectNode, ...articles],
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildProjectJsonLd(project, slug) }}
      />
      <ProjectDetailClient project={project} slug={slug} />
    </>
  );
}
