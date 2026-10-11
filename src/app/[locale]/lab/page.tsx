import { OSApplicationBridge } from "@/components/os/OSApplicationBridge";
import type { Metadata } from "next";
import { LabClient } from "./LabClient";
import { buildAlternates, OG_IMAGES, TWITTER_IMAGE, ogUrl } from "@/lib/seo";
import { resolveLocale, getDictionary, type Locale } from "@/i18n";
import { getLocalizedLabs } from "@/lib/localized-labs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const t = await getDictionary(locale as Locale);
  return {
    title: t.seo.lab_title,
    description: t.seo.lab_description,
    alternates: buildAlternates("/lab", locale),
    openGraph: {
      url: ogUrl("/lab", locale),
      title: t.seo.lab_title,
      description: t.seo.lab_description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.lab_title,
      description: t.seo.lab_description,
      images: TWITTER_IMAGE,
    },
  };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const experiments = getLocalizedLabs(locale as Locale).map(
    ({ id, title, status, description, tech, objective, constraints }) => ({
      id,
      title,
      status,
      description,
      tech,
      objective,
      constraints,
    }),
  );
  return (
    <OSApplicationBridge locale={locale as Locale} route="/lab">
      <LabClient experiments={experiments} />
    </OSApplicationBridge>
  );
}
