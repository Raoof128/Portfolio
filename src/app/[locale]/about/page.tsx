import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";
import { buildAlternates } from "@/lib/seo";
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
      title: "About | Mohammad Raouf Abedini",
      description: t.seo.about_og_description,
    },
    twitter: {
      card: "summary",
      title: "About | Mohammad Raouf Abedini",
      description: t.seo.about_og_description,
    },
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
