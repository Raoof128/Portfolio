import type { Metadata } from "next";
import { LabClient } from "./LabClient";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Lab",
    description:
      "Experimental code, PoCs, and cybersecurity research snippets.",
    alternates: buildAlternates("/lab", locale),
    openGraph: {
      title: "Lab | Mohammad Raouf Abedini",
      description:
        "Experimental code, PoCs, and cybersecurity research snippets.",
    },
    twitter: {
      card: "summary",
      title: "Lab | Mohammad Raouf Abedini",
      description:
        "Experimental code, PoCs, and cybersecurity research snippets.",
    },
  };
}

export default function LabPage() {
  return <LabClient />;
}
