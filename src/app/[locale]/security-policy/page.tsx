import type { Metadata } from "next";
import { SecurityPolicyClient } from "./SecurityPolicyClient";
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
    title: t.seo.security_policy_title,
    description: t.seo.security_policy_description,
    alternates: buildAlternates("/security-policy", locale),
  };
}

export default function SecurityPolicyPage() {
  return <SecurityPolicyClient />;
}
