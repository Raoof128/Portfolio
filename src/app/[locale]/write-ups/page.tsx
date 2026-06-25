import type { Metadata } from "next";
import { WriteUpsClient } from "./WriteUpsClient";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Write-ups",
    description: "Security research, CTF walkthroughs, and technical articles.",
    alternates: buildAlternates("/write-ups", locale),
    openGraph: {
      title: "Write-ups | Mohammad Raouf Abedini",
      description:
        "Security research, CTF walkthroughs, and technical articles.",
    },
    twitter: {
      card: "summary",
      title: "Write-ups | Mohammad Raouf Abedini",
      description:
        "Security research, CTF walkthroughs, and technical articles.",
    },
  };
}

export default function WriteUpsPage() {
  return <WriteUpsClient />;
}
