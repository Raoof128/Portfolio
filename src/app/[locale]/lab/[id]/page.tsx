import { OSApplicationBridge } from "@/components/os/OSApplicationBridge";
import type { Metadata } from "next";
import { labExperiments } from "@/lib/data";
import { getLocalizedLab } from "@/lib/localized-labs";
import { notFound } from "next/navigation";
import {
  buildAlternates,
  LOCALE_PREFIX,
  serializeJsonLd,
  breadcrumbList,
  OG_IMAGES,
  TWITTER_IMAGE,
  ogBase,
} from "@/lib/seo";
import { ORCID_URL, SITE_URL, SITE_LAST_MODIFIED } from "@/lib/constants";
import { resolveLocale, getDictionary, type Locale } from "@/i18n";
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
  const { locale: rawLocale, id } = await params;
  const locale = resolveLocale(rawLocale);
  const sourceExp = labExperiments.find((e) => e.id === id);
  const exp = sourceExp
    ? getLocalizedLab(sourceExp, locale as Locale)
    : undefined;
  const t = await getDictionary(locale as Locale);
  if (!exp) return { title: t.seo.not_found_title };

  const prefix = LOCALE_PREFIX[locale] ?? "";
  const pageUrl = `${SITE_URL}${prefix}/lab/${id}`;

  return {
    title: `${exp.title} | ${t.seo.lab_title}`,
    description: exp.description,
    alternates: buildAlternates(`/lab/${id}`, locale),
    openGraph: {
      ...ogBase(locale),
      url: pageUrl,
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

function buildLabJsonLd(
  exp: (typeof labExperiments)[number],
  locale: string,
  crumbs: { home: string; section: string },
) {
  const prefix = LOCALE_PREFIX[locale] ?? "";
  const pageUrl = `${SITE_URL}${prefix}/lab/${exp.id}`;

  const node = {
    "@type": "TechArticle",
    "@id": `${pageUrl}#experiment`,
    headline: exp.title,
    name: exp.title,
    description: exp.description,
    // No per-experiment publish date exists, so datePublished is omitted
    // rather than reusing the site-wide modification date.
    dateModified: SITE_LAST_MODIFIED,
    inLanguage: locale,
    author: AUTHOR,
    publisher: { "@id": `${SITE_URL}/#person` },
    mainEntityOfPage: { "@id": pageUrl },
    url: pageUrl,
    keywords: exp.tech.join(", "),
    image: `${SITE_URL}/og.png`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    inLanguage: locale,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    primaryImageOfPage: `${SITE_URL}/og.png`,
    mainEntity: { "@id": `${pageUrl}#experiment` },
  };

  const breadcrumb = breadcrumbList([
    { name: crumbs.home, url: `${SITE_URL}${prefix || "/"}` },
    { name: crumbs.section, url: `${SITE_URL}${prefix}/lab` },
    { name: exp.title, url: pageUrl },
  ]);

  return serializeJsonLd({
    "@context": "https://schema.org",
    "@graph": [webPage, node, breadcrumb],
  });
}

export default async function LabExperimentPage({ params }: PageProps) {
  const { locale: rawLocale, id } = await params;
  const locale = resolveLocale(rawLocale);
  const sourceExp = labExperiments.find((e) => e.id === id);
  const exp = sourceExp
    ? getLocalizedLab(sourceExp, locale as Locale)
    : undefined;

  if (!exp) {
    notFound();
  }

  const t = await getDictionary(locale as Locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildLabJsonLd(exp, locale, {
            home: t.nav.home,
            section: t.seo.lab_title,
          }),
        }}
      />
      <OSApplicationBridge locale={locale as Locale} route={`/lab/${id}`}>
        <LabDetailClient exp={exp} />
      </OSApplicationBridge>
    </>
  );
}
