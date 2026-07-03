import type { Metadata } from "next";
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
    title: t.seo.projects_title,
    description: t.seo.projects_description,
    alternates: buildAlternates("/projects", locale),
  };
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
