import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Contact | Mohammad Raouf Abedini",
    description:
      "Get in touch with Mohammad Raouf Abedini. Open a secure communication channel for cybersecurity consultations, collaborations, or inquiries.",
    alternates: buildAlternates("/contact", locale),
    openGraph: {
      title: "Contact | Mohammad Raouf Abedini",
      description:
        "Get in touch with Mohammad Raouf Abedini. Open a secure communication channel for cybersecurity consultations, collaborations, or inquiries.",
    },
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
