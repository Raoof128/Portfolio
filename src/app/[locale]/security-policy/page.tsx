import { OSApplicationBridge } from "@/components/os/OSApplicationBridge";
import type { Metadata } from "next";
import { SecurityPolicyClient } from "./SecurityPolicyClient";
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
    title: t.seo.security_policy_title,
    description: t.seo.security_policy_description,
    alternates: buildAlternates("/security-policy", locale),
    openGraph: {
      ...ogBase(locale),
      url: ogUrl("/security-policy", locale),
      title: `${t.seo.security_policy_title} | Mohammad Raouf Abedini`,
      description: t.seo.security_policy_description,
      images: OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.seo.security_policy_title} | Mohammad Raouf Abedini`,
      description: t.seo.security_policy_description,
      images: TWITTER_IMAGE,
    },
  };
}

export default async function SecurityPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  return (
    <OSApplicationBridge locale={locale as Locale} route="/security-policy">
      <SecurityPolicyClient />
    </OSApplicationBridge>
  );
}
