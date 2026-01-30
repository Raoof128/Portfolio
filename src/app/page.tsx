import { NeonButton } from "@/components/ui/NeonButton";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { ProjectCard } from "@/components/ui/ProjectCard";
import Link from "next/link";
import { ArrowRight, Download, Play, Terminal, Shield, Activity } from "lucide-react";

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
            <HUDFrame title="SYSTEM_STATUS" className="backdrop-blur-sm bg-black/40">
              <div className="space-y-6 font-mono text-sm">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-zinc-500">CURRENT_ROLE</span>
                  <span className="text-cyan">SECURITY_ENGINEER</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-zinc-500">LOCATION</span>
                  <span className="text-white">SYDNEY, AU</span>
                </div>
                <div className="space-y-2 pt-2">
                  <span className="text-zinc-500 block text-xs uppercase tracking-widest">Active Stack</span>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="flex items-center text-zinc-300"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Next.js / React</span>
                    <span className="flex items-center text-zinc-300"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>TypeScript</span>
                    <span className="flex items-center text-zinc-300"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Go / Rust</span>
                    <span className="flex items-center text-zinc-300"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>Python</span>
                  </div>
                </div>
                <div className="pt-4 flex items-center gap-3">
                  <div className="h-10 w-full bg-zinc-900 border border-zinc-700 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-cyan/20 w-[70%]" />
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-cyan">
                      SYSTEM_OPTIMAL_70%
                    </div>
                  </div>
                </div>
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
          {/* Mehr Guard */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <ProjectCard
              featured
              title="Mehr Guard"
              description="Advanced security monitoring system with real-time threat detection."
              tags={["Next.js", "Python", "Deep Learning"]}
              buildItems={[
                "Microservices architecture using gRPC",
                "Real-time websocket feeds for alerts",
                "Dashboard optimized for SOC teams"
              ]}
              secureItems={[
                "Zero-trust authentication flow",
                "End-to-end encryption for logs",
                "Privacy-preserving AI models"
              ]}
              links={{
                demo: "https://www.youtube.com/watch?v=n8bheouj4jM",
                caseStudy: "/projects/mehr-guard"
              }}
            />
          </div>

          {/* GitSwitch */}
          <ProjectCard
            title="GitSwitch"
            description="Context-aware git profile switcher for developers."
            tags={["Rust", "CLI", "Productivity"]}
            buildItems={[
              "Native binary performance (Rust)",
              "Cross-platform file system watcher",
              "Shell integration (Zsh/Bash)"
            ]}
            secureItems={[
              "Local-only data storage",
              "Sign commits automatically with GPG",
              "No telemetry"
            ]}
            links={{
              repo: "https://github.com/Raoof128/GitSwitch",
              caseStudy: "/projects/gitswitch"
            }}
          />

          {/* ECRSM */}
          <ProjectCard
            title="ECRSM"
            description="Experimental Container Runtime Security Monitor."
            tags={["eBPF", "Go", "Linux"]}
            buildItems={[
              "Kernel-level observability",
              "Low overhead (<1% CPU)",
              "JSON logging output"
            ]}
            secureItems={[
              "Read-only eBPF probes",
              "Detects shell execution in containers",
              "Rootkit evasion detection"
            ]}
            links={{
              repo: "https://github.com/Raoof128/ECRSM",
              caseStudy: "/projects/ecrsm"
            }}
          />
        </div>
      </section>

      {/* SECTION 3: BUILD | SECURE Philosophy */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-0 border border-white/10 bg-zinc-900/20">
          {/* BUILD */}
          <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 group hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 bg-zinc-800 rounded-sm flex items-center justify-center mb-6 group-hover:bg-cyan/10 group-hover:text-cyan transition-colors">
              <Terminal className="w-6 h-6" />
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
            <div className="w-12 h-12 bg-zinc-800 rounded-sm flex items-center justify-center mb-6 group-hover:bg-cyan/10 group-hover:text-cyan transition-colors">
              <Shield className="w-6 h-6" />
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
                <Activity className="text-cyan w-5 h-5 animate-pulse" />
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
          {[1, 2, 3].map((i) => (
            <Link
              key={i}
              href="/write-ups/example"
              className="block group p-4 border border-transparent hover:border-white/5 hover:bg-white/5 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <h4 className="text-lg font-bold text-zinc-200 group-hover:text-cyan transition-colors">
                  Understanding Memory Safety in Rust from an Attacker&apos;s Perspective
                </h4>
                <span className="font-mono text-xs text-zinc-500">2026-01-15</span>
              </div>
              <p className="mt-2 text-zinc-400 text-sm max-w-3xl">
                An analysis of how Rust&apos;s ownership model mitigates common memory corruption vulnerabilities...
              </p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}