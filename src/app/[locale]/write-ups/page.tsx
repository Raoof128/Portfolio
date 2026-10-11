import { OSApplicationBridge } from "@/components/os/OSApplicationBridge";
import type { Metadata } from "next";
import { WriteUpsClient } from "./WriteUpsClient";
import { buildAlternates, OG_IMAGES, TWITTER_IMAGE, ogUrl } from "@/lib/seo";
import { resolveLocale, getDictionary, type Locale } from "@/i18n";
import { getLocalizedWriteups } from "@/lib/localized-writing";
import {
  getPublicationSourceLanguageNote,
  getPublicationSummaries,
} from "@/lib/publications";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const t = await getDictionary(locale as Locale);
  return {
    title: t.seo.write_ups_title,
    description: t.seo.write_ups_description,
    alternates: buildAlternates("/write-ups", locale),
    openGraph: {
      url: ogUrl("/write-ups", locale),
      title: t.seo.write_ups_title,
      description: t.seo.write_ups_description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.write_ups_title,
      description: t.seo.write_ups_description,
      images: TWITTER_IMAGE,
    },
  };
}

export default async function WriteUpsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const posts = getLocalizedWriteups(locale as Locale).map(
    ({ slug, title, date, updatedAt, tag, takeaway }) => ({
      slug,
      title,
      date,
      updatedAt,
      tag,
      takeaway,
    }),
  );
  return (
    <OSApplicationBridge locale={locale as Locale} route="/write-ups">
      <WriteUpsClient
        posts={posts}
        publications={getPublicationSummaries(locale as Locale)}
        publicationSourceLanguageNote={getPublicationSourceLanguageNote(
          locale as Locale,
        )}
      />
    </OSApplicationBridge>
  );
}
