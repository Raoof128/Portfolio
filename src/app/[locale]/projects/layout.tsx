import type { Metadata } from "next";
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
    title: t.seo.projects_title,
    description: t.seo.projects_description,
    alternates: buildAlternates("/projects", locale),
    openGraph: {
      url: ogUrl("/projects", locale),
      title: `${t.seo.projects_title} | Mohammad Raouf Abedini`,
      description: t.seo.projects_description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.seo.projects_title} | Mohammad Raouf Abedini`,
      description: t.seo.projects_description,
      images: TWITTER_IMAGE,
    },
  };
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
