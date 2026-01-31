import { NeonButton } from "@/components/ui/NeonButton";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { ProjectCard } from "@/components/ui/ProjectCard";
import Link from "next/link";
import { ArrowRight, Download, Terminal } from "lucide-react";
import { projects, writeups } from "@/lib/data";

// NEW IMPORTS
import { DecryptedText } from "@/components/ui/DecryptedText";
import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { TerminalFeed } from "@/components/ui/TerminalFeed";

export default function Home() {
  return (
    <div className="space-y-24 pb-24 overflow-x-hidden">
      
      {/* --- SECTION 1: HERO --- */}
      <section className="relative pt-12 md:pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center">
        
        {/* 1. Living Background */}
        <ActiveGrid />

        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Left: Intro */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-3 px-3 py-1 bg-cyan-500/5 border border-cyan-500/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="font-mono text-cyan-400 text-xs tracking-widest uppercase">
                System Online
              </span>
            </div>

            {/* 2. Decrypted Header */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              <DecryptedText text="Cybersecurity" /> <br />
              <span className="text-cyan-500 block mt-2">+ Engineering</span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
              Building <span className="text-zinc-200">privacy-first</span> security tools and scalable runtime systems.
              Operating at the edge of offensive security and distributed architecture.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <NeonButton href="/projects" variant="primary">
                <Terminal className="w-4 h-4 mr-2" /> EXECUTE_PROJECTS
              </NeonButton>
              <NeonButton href="/resume" variant="secondary">
                <Download className="w-4 h-4 mr-2" /> EXPORT_RESUME
              </NeonButton>
            </div>
          </div>

          {/* Right: The Terminal Feed */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 hidden lg:block">
            {/* Decorative Frame around the terminal */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur opacity-30" />
            <TerminalFeed />
          </div>
        </div>
      </section>


      {/* --- SECTION 2: FEATURED PROJECTS (Focus Mode) --- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            <span className="text-cyan-500 font-mono mr-3">01.</span>Deployed Systems
          </h2>
          <Link href="/projects" className="hidden md:flex items-center text-zinc-400 hover:text-cyan-400 transition-colors font-mono text-sm">
            VIEW_ALL_LOGS <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* FOCUS MODE TRICK: 
          group/grid on container. 
          group-hover/grid:opacity-50 on container hover makes everything transparent.
          hover:!opacity-100 on specific card brings it back.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 group/grid">
          {Object.values(projects).map((project) => (
            <div 
              key={project.slug} 
              className={`
                transition-all duration-500 ease-out
                group-hover/grid:opacity-40 group-hover/grid:scale-95 hover:!opacity-100 hover:!scale-100
                ${project.slug === "mehr-guard" ? "col-span-1 md:col-span-2 lg:col-span-3" : ""}
              `}
            >
              <ProjectCard
                featured={project.slug === "mehr-guard"}
                title={project.title}
                description={project.description}
                tags={project.tags}
                buildItems={project.build.features.slice(0, 3)}
                secureItems={project.secure.measures.slice(0, 3)}
                links={project.links}
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: BUILD | SECURE Philosophy */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-0 border border-white/10 bg-zinc-900/20">
          {/* BUILD */}
          <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 group hover:bg-white/5 transition-colors">
            {/* BUILD ICON PLACEHOLDER */}
            <div className="w-12 h-12 bg-zinc-800 rounded-sm flex items-center justify-center mb-6 group-hover:bg-cyan/10 group-hover:text-cyan transition-colors">
              <span className="font-mono text-xl font-bold">&lt;/&gt;</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">BUILD</h3>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Software should be performant, maintainable, and delightful to use. I focus on clean architecture, modern patterns, and developer experience.
            </p>
            <ul className="space-y-2 font-mono text-sm text-zinc-500">
              <li className="flex items-center"><span className="text-cyan mr-2">+</span> Scalable Architecture</li>
              <li className="flex items-center"><span className="text-cyan mr-2">+</span> Performance Optimization</li>
              <li className="flex items-center"><span className="text-cyan mr-2">+</span> Type Safety</li>
            </ul>
          </div>

          {/* SECURE */}
          <div className="p-8 md:p-12 group hover:bg-white/5 transition-colors">
            {/* SECURE ICON PLACEHOLDER */}
            <div className="w-12 h-12 bg-zinc-800 rounded-sm flex items-center justify-center mb-6 group-hover:bg-cyan/10 group-hover:text-cyan transition-colors">
              <span className="font-mono text-xl font-bold">#</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">SECURE</h3>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Security isn&apos;t an afterthought. It&apos;s built-in. I apply threat modelling, defensible network architecture, and safe defaults to every system.
            </p>
            <ul className="space-y-2 font-mono text-sm text-zinc-500">
              <li className="flex items-center"><span className="text-cyan mr-2">+</span> Threat Modelling</li>
              <li className="flex items-center"><span className="text-cyan mr-2">+</span> Privacy by Design</li>
              <li className="flex items-center"><span className="text-cyan mr-2">+</span> Defensive Coding</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 4: LAB TEASER */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HUDFrame className="bg-gradient-to-r from-zinc-900 via-zinc-900/50 to-transparent border-l-4 border-l-cyan">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-cyan font-mono animate-pulse">●</span>
                <h3 className="font-mono text-lg text-white">THE_LAB</h3>
              </div>
              <p className="text-zinc-400 max-w-2xl">
                Exploring the depths of systems programming and security engineering.
                Current focus: <span className="text-cyan">eBPF</span> runtime visibility and kernel-level tracing.
              </p>
            </div>
            <NeonButton href="/lab" variant="outline" className="min-w-[150px]">
              ENTER LAB
            </NeonButton>
          </div>
        </HUDFrame>
      </section>

      {/* SECTION 5: LATEST WRITE-UPS */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            <span className="text-cyan font-mono mr-3">03.</span>Latest Transmissions
          </h2>
        </div>

        <div className="space-y-1">
          {writeups.map((post) => (
            <Link
              key={post.slug}
              href={`/write-ups/${post.slug}`}
              className="block group p-4 border border-transparent hover:border-white/5 hover:bg-white/5 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <h4 className="text-lg font-bold text-zinc-200 group-hover:text-cyan transition-colors">
                  {post.title}
                </h4>
                <span className="font-mono text-xs text-zinc-500">{post.date}</span>
              </div>
              <p className="mt-2 text-zinc-400 text-sm max-w-3xl">
                {post.takeaway}
              </p>
            </Link>
          ))}
        </div>
      </section>
      
    </div>
  );
}
