import type { Metadata } from "next";
import { HallOfFameClient } from "./HallOfFameClient";
import { buildAlternates, OG_IMAGES, TWITTER_IMAGE } from "@/lib/seo";
import { getDictionary, type Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getDictionary(locale as Locale);
  return {
    title: t.seo.hall_of_fame_title,
    description: t.seo.hall_of_fame_description,
    alternates: buildAlternates("/hall-of-fame", locale),
    openGraph: {
      title: `${t.seo.hall_of_fame_title} | Mohammad Raouf Abedini`,
      description: t.seo.hall_of_fame_description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.seo.hall_of_fame_title} | Mohammad Raouf Abedini`,
      description: t.seo.hall_of_fame_description,
      images: TWITTER_IMAGE,
    },
  };
}

export default function HallOfFamePage() {
  return <HallOfFameClient />;
}
