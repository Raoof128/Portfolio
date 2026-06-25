import type { Metadata } from "next";
import { HallOfFameClient } from "./HallOfFameClient";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Hall of Fame | Mohammad Raouf Abedini",
    description:
      "Security researchers who have responsibly disclosed vulnerabilities in my projects.",
    alternates: buildAlternates("/hall-of-fame", locale),
  };
}

export default function HallOfFamePage() {
  return <HallOfFameClient />;
}
