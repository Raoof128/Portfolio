import type { Metadata } from "next";
import { ResumeClient } from "./ResumeClient";
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
    title: t.seo.resume_title,
    description: t.seo.resume_description,
    alternates: buildAlternates("/resume", locale),
    openGraph: {
      title: "Resume | Mohammad Raouf Abedini",
      description: t.seo.resume_og_description,
    },
    twitter: {
      card: "summary",
      title: "Resume | Mohammad Raouf Abedini",
      description: t.seo.resume_og_description,
    },
  };
}

export default function ResumePage() {
  return <ResumeClient />;
}
