import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";
import {
  buildAlternates,
  OG_IMAGES,
  TWITTER_IMAGE,
  ogUrl,
  serializeJsonLd,
} from "@/lib/seo";
import { getDictionary, type Locale } from "@/i18n";
import {
  GITHUB_URL,
  LINKEDIN_URL,
  ORCID_URL,
  SITE_LAST_MODIFIED,
  SITE_URL,
  TWITTER_URL,
} from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getDictionary(locale as Locale);
  return {
    title: t.seo.about_title,
    description: t.seo.about_description,
    alternates: buildAlternates("/about", locale),
    openGraph: {
      url: ogUrl("/about", locale),
      title: "About | Mohammad Raouf Abedini",
      description: t.seo.about_og_description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: "About | Mohammad Raouf Abedini",
      description: t.seo.about_og_description,
      images: TWITTER_IMAGE,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getDictionary(locale as Locale);
  const pageUrl = ogUrl("/about", locale);
  const profilePageJsonLd = serializeJsonLd({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${pageUrl}#profile-page`,
    url: pageUrl,
    inLanguage: locale,
    dateModified: SITE_LAST_MODIFIED,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Mohammad Raouf Abedini",
      alternateName: "Raouf",
      description: t.seo.about_description,
      image: `${SITE_URL}/Raouf_2.jpg`,
      sameAs: [GITHUB_URL, LINKEDIN_URL, TWITTER_URL, ORCID_URL],
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: profilePageJsonLd }}
      />
      <AboutClient />
    </>
  );
}
