import type { Metadata } from "next";
import { writeups } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  buildAlternates,
  LOCALE_PREFIX,
  serializeJsonLd,
  breadcrumbList,
  OG_IMAGES,
  TWITTER_IMAGE,
} from "@/lib/seo";
import { ORCID_URL, SITE_URL } from "@/lib/constants";
import { getDictionary, type Locale } from "@/i18n";
import { WriteupDetailClient } from "./WriteupDetailClient";

export function generateStaticParams() {
  return writeups.map((post) => ({
    slug: post.slug,
  }));
}

export const dynamicParams = false;

interface PageProps {
  // Locale is present in params at runtime (parent [locale] segment).
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = writeups.find((p) => p.slug === slug);
  const t = await getDictionary(locale as Locale);
  if (!post) return { title: t.seo.not_found_title };

  const prefix = LOCALE_PREFIX[locale] ?? "";
  const pageUrl = `${SITE_URL}${prefix}/write-ups/${slug}`;

  return {
    title: `${post.title} | ${t.seo.write_ups_title}`,
    description: post.takeaway,
    alternates: buildAlternates(`/write-ups/${slug}`, locale),
    openGraph: {
      type: "article",
      // Locale-aware self URL so og:url matches the page's own canonical.
      url: pageUrl,
      title: `${post.title} | Mohammad Raouf Abedini`,
      description: post.takeaway,
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Mohammad Raouf Abedini`,
      description: post.takeaway,
      images: TWITTER_IMAGE,
    },
  };
}

// Stable ORCID-backed author shared with the global Person node.
const AUTHOR = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Mohammad Raouf Abedini",
  sameAs: [ORCID_URL],
} as const;

function buildWriteupJsonLd(
  post: (typeof writeups)[number],
  locale: string,
  crumbs: { home: string; section: string },
) {
  const prefix = LOCALE_PREFIX[locale] ?? "";
  const pageUrl = `${SITE_URL}${prefix}/write-ups/${post.slug}`;

  const article = {
    "@type": "TechArticle",
    "@id": `${pageUrl}#article`,
    headline: post.title,
    name: post.title,
    description: post.takeaway,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    // The article body is authored in English on every locale route; only the
    // page chrome is translated. Declaring the article "en" keeps the machine
    // fact honest — see the locale-carrying WebPage node below.
    inLanguage: "en",
    author: AUTHOR,
    publisher: { "@id": `${SITE_URL}/#person` },
    mainEntityOfPage: { "@id": pageUrl },
    url: pageUrl,
    keywords: post.tag,
    about: { "@type": "Thing", name: post.tag },
    image: `${SITE_URL}/og.png`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  // The page (navigation, headings, breadcrumb labels) is genuinely localized,
  // so the WebPage entity carries the route locale and links to the shared
  // WebSite. This is where per-page language lives now that WebSite is multilingual.
  const webPage = {
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    inLanguage: locale,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    primaryImageOfPage: `${SITE_URL}/og.png`,
    mainEntity: { "@id": `${pageUrl}#article` },
  };

  const breadcrumb = breadcrumbList([
    { name: crumbs.home, url: `${SITE_URL}${prefix || "/"}` },
    { name: crumbs.section, url: `${SITE_URL}${prefix}/write-ups` },
    { name: post.title, url: pageUrl },
  ]);

  return serializeJsonLd({
    "@context": "https://schema.org",
    "@graph": [webPage, article, breadcrumb],
  });
}

export default async function WriteupPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = writeups.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const t = await getDictionary(locale as Locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildWriteupJsonLd(post, locale, {
            home: t.nav.home,
            section: t.seo.write_ups_title,
          }),
        }}
      />
      <WriteupDetailClient post={post} />
    </>
  );
}
