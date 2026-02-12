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

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects[slug]

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}
