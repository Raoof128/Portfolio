import type { Metadata } from "next";
import { SecurityPolicyClient } from "./SecurityPolicyClient";
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
    title: t.seo.security_policy_title,
    description: t.seo.security_policy_description,
    alternates: buildAlternates("/security-policy", locale),
    openGraph: {
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

export default function SecurityPolicyPage() {
  return <SecurityPolicyClient />;
}
