import { labExperiments } from "@/lib/data";
import { notFound } from "next/navigation";
import { buildAlternates } from "@/lib/seo";
import { getDictionary, type Locale } from "@/i18n";
import { LabDetailClient } from "./LabDetailClient";

export function generateStaticParams() {
  return labExperiments.map((exp) => ({
    id: exp.id,
  }));
}

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ id: string }>;
}

// Locale is present in params at runtime (parent [locale] segment) for canonical.
interface MetadataProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: MetadataProps) {
  const { locale, id } = await params;
  const exp = labExperiments.find((e) => e.id === id);
  const t = await getDictionary(locale as Locale);
  if (!exp) return { title: t.seo.not_found_title };

  return {
    title: `${exp.title} | ${t.seo.lab_title}`,
    description: exp.description,
    alternates: buildAlternates(`/lab/${id}`, locale),
  };
}

export default async function LabExperimentPage({ params }: PageProps) {
  const { id } = await params;
  const exp = labExperiments.find((e) => e.id === id);

  if (!exp) {
    notFound();
  }

  return <LabDetailClient exp={exp} />;
}
