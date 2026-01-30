import { NeonButton } from "@/components/ui/NeonButton";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { ProjectCard } from "@/components/ui/ProjectCard";
import Link from "next/link";
import { ArrowRight, Download, Play, Terminal, Shield, Activity } from "lucide-react";
import { projects, writeups } from "@/lib/data";
import { VideoFacade } from "@/components/ui/VideoFacade";

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      {/* SECTION 1: HERO */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Intro */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-block px-3 py-1 bg-cyan/10 border border-cyan/20 rounded-sm">
              <span className="font-mono text-cyan text-sm tracking-widest">&gt; whoami</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Cybersecurity <span className="text-cyan">+</span> <br />
              Software Engineering
            </h1>

            <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
              I build privacy-first security tools, developer productivity apps, and runtime visibility systems.
              Focusing on the intersection of <span className="text-white font-medium">offensive security</span> and <span className="text-white font-medium">scalable architecture</span>.
            </p>

            <div className="flex flex-wrap gap-4">
              <NeonButton href="/projects" variant="primary">
                RUN: PROJECTS
              </NeonButton>
              <NeonButton href="/resume" variant="secondary">
                <Download className="w-4 h-4 mr-2" /> RESUME
              </NeonButton>
              <NeonButton href="https://www.youtube.com/watch?v=n8bheouj4jM" variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white">
                <Play className="w-4 h-4 mr-2" /> DEMO
              </NeonButton>
            </div>
          </div>



          {/* Right: HUD Panel */}
          <div className="relative animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
            <HUDFrame title="LIVE_DEMO_FEED" className="backdrop-blur-sm bg-black/40 p-4">
              <VideoFacade videoId="n8bheouj4jM" title="Mehr Guard Demo" />

              <div className="mt-4 flex justify-between items-center font-mono text-xs text-zinc-500">
                <span>TARGET: ANDROID/IOS</span>
                <span className="text-cyan">STATUS: ONLINE</span>
              </div>
            </HUDFrame>
          </div>
        </div>
      </section>


      {/* SECTION 2: FEATURED PROJECTS */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            <span className="text-cyan font-mono mr-3">01.</span>Featured Projects
          </h2>
          <Link href="/projects" className="hidden md:flex items-center text-cyan font-mono text-sm hover:underline">
            VIEW_ALL <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(projects).map((project) => (
            <div key={project.slug} className={project.slug === "mehr-guard" ? "col-span-1 md:col-span-2 lg:col-span-3" : ""}>
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

      {/* ... (Philosophy and Lab sections are fine) ... */}

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