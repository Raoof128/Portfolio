import { notFound } from "next/navigation"
import { NeonButton } from "@/components/ui/NeonButton"
import { projects } from "@/lib/data"
import { ArrowLeft, Github, Play, Shield, Code, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-24">
        {/* Project Hero */}
        <section className="border-b border-white/10 bg-white/5 py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <Link href="/projects" className="inline-flex items-center text-sm text-zinc-500 hover:text-cyan mb-8 transition-colors font-mono">
              <ArrowLeft size={14} className="mr-2" /> Back to Projects
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-mono text-cyan border border-cyan/30 px-2 py-1 bg-cyan/5">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-mono font-bold text-white">
                  {project.title}
                </h1>
                <p className="text-xl text-zinc-400 leading-relaxed">
                  {project.fullDescription}
                </p>
              </div>

              <div className="flex gap-4 shrink-0">
                {project.links.demo && (
                  <NeonButton href={project.links.demo} external>
                    <Play size={16} className="mr-2" /> Demo
                  </NeonButton>
                )}
                {project.links.repo && (
                  <NeonButton href={project.links.repo} variant="secondary" external>
                    <Github size={16} className="mr-2" /> Repo
                  </NeonButton>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">

            {/* Problem */}
            <section className="space-y-4">
              <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                <span className="text-cyan">01.</span> Problem
              </h2>
              <div className="prose prose-invert max-w-none text-zinc-400 border-l-2 border-white/10 pl-6">
                <p>{project.problem}</p>
              </div>
            </section>

            {/* Solution */}
            <section className="space-y-4">
              <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                <span className="text-cyan">02.</span> Solution Overview
              </h2>
              <div className="bg-black/40 border border-white/10 p-6 rounded-sm">
                <ul className="grid gap-3">
                  {project.solution.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300">
                      <ArrowRight size={16} className="mt-1 text-cyan shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Build & Secure Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Build */}
              <section className="space-y-4">
                <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                  <Code size={20} className="text-cyan" /> Build
                </h2>
                <div className="bg-white/5 border border-white/10 p-6 h-full">
                  <div className="mb-4">
                    <h4 className="text-xs uppercase text-zinc-500 font-mono mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.build?.stack.map(tech => (
                        <span key={tech} className="text-xs border border-white/20 px-2 py-1 text-zinc-300 bg-white/5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {project.build?.features.map((feat, i) => (
                      <li key={i} className="text-sm text-zinc-400 flex gap-2">
                        <span className="text-cyan">•</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Secure */}
              <section className="space-y-4">
                <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                  <Shield size={20} className="text-cyan" /> Secure
                </h2>
                <div className="bg-white/5 border border-white/10 p-6 h-full">
                  <ul className="space-y-3">
                    {project.secure?.measures.map((measure, i) => (
                      <li key={i} className="text-sm text-zinc-400 flex gap-2">
                        <CheckCircle size={14} className="mt-1 text-green-400 shrink-0" />
                        {measure}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* Proof */}
            <section className="space-y-4">
              <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                <span className="text-cyan">03.</span> Proof & Verification
              </h2>
              <div className="border border-cyan/20 bg-cyan/5 p-6 space-y-4">
                <p className="font-mono text-sm text-cyan mb-4 uppercase tracking-widest border-b border-cyan/20 pb-2 inline-block">
                  Verified Claims
                </p>
                <ul className="space-y-3">
                  {project.proof.map((proof, i) => (
                    <li key={i} className="font-mono text-sm text-zinc-300 flex items-start gap-3">
                      <span className="text-cyan mt-1">&gt;</span>
                      {proof}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

          </div>

          {/* Sidebar / Metadata */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24">
              <div className="border border-white/10 p-6 bg-black/20">
                <h3 className="font-mono font-bold text-white mb-4">Project Links</h3>
                <div className="space-y-3">
                  {project.links.demo && (
                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-zinc-400 hover:text-cyan transition-colors border-b border-white/5 pb-2">
                      Watch Demo <Play size={14} />
                    </a>
                  )}
                  {project.links.repo && (
                    <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-zinc-400 hover:text-cyan transition-colors border-b border-white/5 pb-2">
                      Source Code <Github size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
