import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Projects",
    description:
      "Deployed tools, research prototypes, and architectural proofs by Mohammad Raouf Abedini.",
    alternates: buildAlternates("/projects", locale),
  };
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
