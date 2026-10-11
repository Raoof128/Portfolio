import { OSApplicationBridge } from "@/components/os/OSApplicationBridge";
import type { Metadata } from "next";
import { ResumeClient } from "./ResumeClient";
import { buildAlternates, OG_IMAGES, TWITTER_IMAGE, ogUrl } from "@/lib/seo";
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
    title: t.seo.resume_title,
    description: t.seo.resume_description,
    alternates: buildAlternates("/resume", locale),
    openGraph: {
      url: ogUrl("/resume", locale),
      title: t.seo.resume_title,
      description: t.seo.resume_og_description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.resume_title,
      description: t.seo.resume_og_description,
      images: TWITTER_IMAGE,
    },
  };
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  return (
    <OSApplicationBridge locale={locale as Locale} route="/resume">
      <ResumeClient />
    </OSApplicationBridge>
  );
}
