import type { Metadata } from "next";
import { notFound } from "next/navigation"
import { projects } from "@/lib/data"
import { ProjectDetailClient } from "./ProjectDetailClient"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({
    slug,
  }))
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects[slug]

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project does not exist.",
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects[slug]

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}
