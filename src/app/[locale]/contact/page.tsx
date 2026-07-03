import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";
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
    title: t.seo.contact_title,
    description: t.seo.contact_description,
    alternates: buildAlternates("/contact", locale),
    openGraph: {
      title: t.seo.contact_title,
      description: t.seo.contact_description,
    },
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
