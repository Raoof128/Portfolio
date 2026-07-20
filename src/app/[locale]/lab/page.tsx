import type { Metadata } from "next";
import { LabClient } from "./LabClient";
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
    title: t.seo.lab_title,
    description: t.seo.lab_description,
    alternates: buildAlternates("/lab", locale),
    openGraph: {
      url: ogUrl("/lab", locale),
      title: "Lab | Mohammad Raouf Abedini",
      description: t.seo.lab_description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: "Lab | Mohammad Raouf Abedini",
      description: t.seo.lab_description,
      images: TWITTER_IMAGE,
    },
  };
}

export default function LabPage() {
  return <LabClient />;
}
