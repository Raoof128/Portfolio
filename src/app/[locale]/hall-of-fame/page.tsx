import { OSApplicationBridge } from "@/components/os/OSApplicationBridge";
import type { Metadata } from "next";
import { HallOfFameClient } from "./HallOfFameClient";
import {
  buildAlternates,
  OG_IMAGES,
  TWITTER_IMAGE,
  ogBase,
  ogUrl,
} from "@/lib/seo";
import { resolveLocale, getDictionary, type Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const t = await getDictionary(locale as Locale);
  return {
    title: t.seo.hall_of_fame_title,
    description: t.seo.hall_of_fame_description,
    alternates: buildAlternates("/hall-of-fame", locale),
    openGraph: {
      ...ogBase(locale),
      url: ogUrl("/hall-of-fame", locale),
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

export default async function HallOfFamePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  return (
    <OSApplicationBridge locale={locale as Locale} route="/hall-of-fame">
      <HallOfFameClient />
    </OSApplicationBridge>
  );
}
