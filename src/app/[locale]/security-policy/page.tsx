import type { Metadata } from "next";
import { SecurityPolicyClient } from "./SecurityPolicyClient";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Security Policy | Mohammad Raouf Abedini",
    description:
      "Security vulnerability disclosure policy and responsible disclosure guidelines.",
    alternates: buildAlternates("/security-policy", locale),
  };
}

export default function SecurityPolicyPage() {
  return <SecurityPolicyClient />;
}
