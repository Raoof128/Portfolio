import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "About",
    description:
      "AI security researcher specializing in vulnerability research, responsible disclosure, AI safety, and cross-platform exploit development. Anthropic AI model evaluator.",
    alternates: buildAlternates("/about", locale),
    openGraph: {
      title: "About | Mohammad Raouf Abedini",
      description:
        "AI security researcher specializing in vulnerability research, responsible disclosure, AI safety, and cross-platform exploit development.",
    },
    twitter: {
      card: "summary",
      title: "About | Mohammad Raouf Abedini",
      description:
        "AI security researcher specializing in vulnerability research, responsible disclosure, AI safety, and cross-platform exploit development.",
    },
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
