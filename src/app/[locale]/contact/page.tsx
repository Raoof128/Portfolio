import { OSApplicationBridge } from "@/components/os/OSApplicationBridge";
import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";
import { buildAlternates, OG_IMAGES, ogUrl } from "@/lib/seo";
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
      url: ogUrl("/contact", locale),
      title: t.seo.contact_title,
      description,
      images: OG_IMAGES,
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
