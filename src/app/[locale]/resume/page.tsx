import type { Metadata } from "next";
import { ResumeClient } from "./ResumeClient";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Resume",
    description:
      "Resume of Mohammad Raouf Abedini — AI Security Researcher, Vulnerability Research, Offensive Security, Python & Systems Programming.",
    alternates: buildAlternates("/resume", locale),
    openGraph: {
      title: "Resume | Mohammad Raouf Abedini",
      description:
        "Resume of Mohammad Raouf Abedini — AI Security Researcher, Vulnerability Research, Offensive Security.",
    },
    twitter: {
      card: "summary",
      title: "Resume | Mohammad Raouf Abedini",
      description:
        "Resume of Mohammad Raouf Abedini — AI Security Researcher, Vulnerability Research, Offensive Security.",
    },
  };
}

export default function ResumePage() {
  return <ResumeClient />;
}
