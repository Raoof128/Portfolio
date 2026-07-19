import type { Metadata } from "next";
import { labExperiments } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  buildAlternates,
  LOCALE_PREFIX,
  serializeJsonLd,
  breadcrumbList,
  OG_IMAGES,
  TWITTER_IMAGE,
} from "@/lib/seo";
import { ORCID_URL, SITE_URL, SITE_LAST_MODIFIED } from "@/lib/constants";
import { getDictionary, type Locale } from "@/i18n";
import { LabDetailClient } from "./LabDetailClient";

export function generateStaticParams() {
  return labExperiments.map((exp) => ({
    id: exp.id,
  }));
}

export const dynamicParams = false;

interface PageProps {
  // Locale is present in params at runtime (parent [locale] segment).
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const exp = labExperiments.find((e) => e.id === id);
  const t = await getDictionary(locale as Locale);
  if (!exp) return { title: t.seo.not_found_title };

  return {
    title: `${exp.title} | ${t.seo.lab_title}`,
    description: exp.description,
    alternates: buildAlternates(`/lab/${id}`, locale),
    openGraph: {
      title: `${exp.title} | Mohammad Raouf Abedini`,
      description: exp.description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: `${exp.title} | Mohammad Raouf Abedini`,
      description: exp.description,
      images: TWITTER_IMAGE,
    },
  };
}

const AUTHOR = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Mohammad Raouf Abedini",
  sameAs: [ORCID_URL],
} as const;

function buildLabJsonLd(exp: (typeof labExperiments)[number], locale: string) {
  const prefix = LOCALE_PREFIX[locale] ?? "";
  const pageUrl = `${SITE_URL}${prefix}/lab/${exp.id}`;

  const node = {
    "@type": "TechArticle",
    "@id": `${pageUrl}#experiment`,
    headline: exp.title,
    name: exp.title,
    description: exp.description,
    datePublished: SITE_LAST_MODIFIED,
    dateModified: SITE_LAST_MODIFIED,
    inLanguage: locale,
    author: AUTHOR,
    publisher: { "@id": `${SITE_URL}/#person` },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    url: pageUrl,
    keywords: exp.tech.join(", "),
    image: `${SITE_URL}/og.png`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const breadcrumb = breadcrumbList([
    { name: "Home", url: `${SITE_URL}${prefix || "/"}` },
    { name: "Lab", url: `${SITE_URL}${prefix}/lab` },
    { name: exp.title, url: pageUrl },
  ]);

  return serializeJsonLd({
    "@context": "https://schema.org",
    "@graph": [node, breadcrumb],
  });
}

export default async function LabExperimentPage({ params }: PageProps) {
  const { locale, id } = await params;
  const exp = labExperiments.find((e) => e.id === id);

  if (!exp) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildLabJsonLd(exp, locale) }}
      />
      <LabDetailClient exp={exp} />
    </>
  );
}
