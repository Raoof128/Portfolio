import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";
import { buildAlternates, OG_IMAGES, TWITTER_IMAGE, ogUrl } from "@/lib/seo";
import { getDictionary, type Locale } from "@/i18n";

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

export default function AboutPage() {
  return <AboutClient />;
}
