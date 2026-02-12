"use client";

import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArrowLeft, Terminal, AlertTriangle, Cpu } from "lucide-react";
import { fadeInLeft, fadeInRight } from "@/lib/utils";

interface LabExperiment {
  id: string;
  title: string;
  status: string;
  description: string;
  objective: string;
  constraints: string;
  tech: string[];
  codeSnippet: string;
}

export function LabDetailClient({ exp }: { exp: LabExperiment }) {
  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden">
      <ActiveGrid />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Back Link */}
        <div className="mb-6">
          <NeonButton href="/lab" variant="outline" className="text-xs px-3 py-1">
            <ArrowLeft className="w-3 h-3 mr-2" /> EXIT_EXPERIMENT
          </NeonButton>
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-8">

            {/* Left Column: Info */}
            <AnimatedSection variants={fadeInLeft} className="lg:col-span-4 space-y-6">

                <div className="p-6 bg-zinc-900/80 border border-white/10 rounded-lg backdrop-blur-sm">
                    <div className="font-mono text-xs text-zinc-500 mb-2">EXPERIMENT_ID: {exp.id}</div>
                    <h1 className="text-2xl font-bold text-white mb-4">{exp.title}</h1>

                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded border text-xs font-mono mb-6 ${
                         exp.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                         exp.status === 'CONCEPT' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                         'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}>
                        <span className="relative flex h-2 w-2">
                             <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${exp.status === 'ACTIVE' ? 'bg-green-400' : 'hidden'}`}></span>
                             <span className={`relative inline-flex rounded-full h-2 w-2 ${
                                 exp.status === 'ACTIVE' ? 'bg-green-500' :
                                 exp.status === 'CONCEPT' ? 'bg-yellow-500' : 'bg-zinc-500'
                             }`}></span>
                        </span>
                        {exp.status}
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        {exp.description}
                    </p>

                    <div className="space-y-4">
                        <div>
                            <div className="text-xs font-mono text-cyan mb-2 flex items-center gap-2">
                                <Terminal className="w-3 h-3" /> OBJECTIVE
                            </div>
                            <p className="text-sm text-zinc-300">
                                {exp.objective}
                            </p>
                        </div>

                        <div>
                             <div className="text-xs font-mono text-yellow-500 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3" /> CONSTRAINTS
                            </div>
                            <p className="text-xs text-zinc-400 font-mono bg-black/30 p-2 rounded border border-yellow-500/10">
                                {exp.constraints}
                            </p>
                        </div>
                    </div>
                </div>

                 <div className="p-4 border border-dashed border-zinc-800 rounded flex flex-wrap gap-2">
                    {exp.tech.map(t => (
                        <span key={t} className="text-xs font-mono px-2 py-1 bg-white/5 text-zinc-400 rounded flex items-center gap-1">
                            <Cpu className="w-3 h-3" /> {t}
                        </span>
                    ))}
                </div>

            </AnimatedSection>

            {/* Right Column: Code Editor */}
            <AnimatedSection variants={fadeInRight} delay={0.15} className="lg:col-span-8">
                <div className="bg-[#0d0d0d] border border-zinc-800 rounded-lg overflow-hidden font-mono text-sm shadow-2xl">

                    {/* Fake Window Header */}
                    <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex items-center justify-between">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        </div>
                        <div className="text-zinc-500 text-xs">src/main.{exp.tech[0]?.toLowerCase() || 'code'}</div>
                        <div className="w-10"></div>
                    </div>

                    {/* Code Content */}
                    <div className="p-6 overflow-x-auto">
                        <pre className="text-zinc-300 leading-relaxed">
                            {exp.codeSnippet.split('\n').map((line, i) => (
                                <div key={i} className="table-row">
                                    <span className="table-cell text-zinc-700 select-none text-right pr-4">{i + 1}</span>
                                    <span className="table-cell whitespace-pre">{line}</span>
                                </div>
                            ))}
                        </pre>
                    </div>

                    {/* Status Bar */}
                    <div className="bg-cyan-500/10 border-t border-cyan-500/20 p-2 text-xs text-cyan flex justify-between px-4">
                        <span>READ_ONLY_MODE</span>
                        <span>UTF-8</span>
                    </div>
                </div>
            </AnimatedSection>

        </div>
      </main>
    </div>
  );
}
