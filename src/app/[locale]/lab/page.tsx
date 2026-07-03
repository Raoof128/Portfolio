import type { Metadata } from "next";
import { LabClient } from "./LabClient";
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
    title: t.seo.lab_title,
    description: t.seo.lab_description,
    alternates: buildAlternates("/lab", locale),
    openGraph: {
      title: "Lab | Mohammad Raouf Abedini",
      description: t.seo.lab_description,
    },
    twitter: {
      card: "summary",
      title: "Lab | Mohammad Raouf Abedini",
      description: t.seo.lab_description,
    },
  };
}

export default function LabPage() {
  return <LabClient />;
}
