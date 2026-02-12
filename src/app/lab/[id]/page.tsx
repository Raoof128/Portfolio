import { labExperiments } from "@/lib/data";
import { notFound } from "next/navigation";
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

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const exp = labExperiments.find((e) => e.id === id);
    if (!exp) return { title: "Not Found" };

    return {
      title: `${exp.title} | Lab`,
      description: exp.description,
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
