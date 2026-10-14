import { OSApplicationBridge } from "@/components/os/OSApplicationBridge";
import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";
import {
  buildAlternates,
  OG_IMAGES,
  TWITTER_IMAGE,
  ogBase,
  ogUrl,
} from "@/lib/seo";
import { resolveLocale, getDictionary, type Locale } from "@/i18n";
import { getOSCopy } from "@/components/os/os-copy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const t = await getDictionary(locale);
  const copy = getOSCopy(locale);
  const description = `${copy.contactDescription} ${copy.emailDraftNote}`;
  return {
    title: t.seo.contact_title,
    description,
    alternates: buildAlternates("/contact", locale),
    openGraph: {
      ...ogBase(locale),
      url: ogUrl("/contact", locale),
      title: `${t.seo.contact_title} | Mohammad Raouf Abedini`,
      description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.seo.contact_title} | Mohammad Raouf Abedini`,
      description,
      images: TWITTER_IMAGE,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  return (
    <OSApplicationBridge locale={locale as Locale} route="/contact">
      <ContactClient />
    </OSApplicationBridge>
  );
}
