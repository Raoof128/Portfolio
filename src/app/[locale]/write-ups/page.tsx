import type { Metadata } from "next";
import { WriteUpsClient } from "./WriteUpsClient";
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
    title: t.seo.write_ups_title,
    description: t.seo.write_ups_description,
    alternates: buildAlternates("/write-ups", locale),
    openGraph: {
      url: ogUrl("/write-ups", locale),
      title: "Write-ups | Mohammad Raouf Abedini",
      description: t.seo.write_ups_description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: "Write-ups | Mohammad Raouf Abedini",
      description: t.seo.write_ups_description,
      images: TWITTER_IMAGE,
    },
  };
}

export default function WriteUpsPage() {
  return <WriteUpsClient />;
}
