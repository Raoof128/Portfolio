import Link from "next/link";
import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { labExperiments } from "@/lib/data";
import { AlertTriangle, Beaker, GitBranch, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Lab | Mohammad Raouf Abedini",
  description: "Experimental code, PoCs, and cybersecurity research snippets.",
};

export default function LabPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden">
      <ActiveGrid />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-12">
           <div className="flex items-center space-x-2 text-cyan mb-2">
            <Beaker className="w-4 h-4" />
            <span className="font-mono text-xs tracking-widest uppercase text-cyan/70">Experimental Division</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            <DecryptedText text="The Lab" />
          </h1>
          <p className="text-zinc-400 max-w-2xl">
             A collection of <span className="text-cyan">Proof of Concepts</span>, snippets, and unfinished research. 
             Code here is volatile and provided &quot;as is&quot; for educational purposes.
          </p>
        </div>

        {/* Experiments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {labExperiments.map((exp) => (
            <HUDFrame key={exp.id} className="p-6 bg-zinc-900/50 backdrop-blur-sm group hover:bg-zinc-800/50 transition-colors h-full flex flex-col">
              
              <div className="flex justify-between items-start mb-4">
                <div className="font-mono text-xs text-zinc-600">ID: {exp.id}</div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border ${
                  exp.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                  exp.status === 'CONCEPT' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                  'bg-zinc-800 text-zinc-500 border-zinc-700'
                }`}>
                  {exp.status}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">
                {exp.title}
              </h3>
              
              <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-grow">
                {exp.description}
              </p>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map(t => (
                    <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 bg-white/5 text-zinc-400 rounded">
                      {t}
                    </span>
                  ))}
                </div>

                <Link href={`/lab/${exp.id}`} className="flex items-center text-xs font-mono text-cyan hover:underline decoration-dotted">
                    VIEW_ANALYSIS <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Link>
              </div>

            </HUDFrame>
          ))}

          {/* New Experiment Placeholder */}
          <div className="border border-dashed border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
               <GitBranch className="w-5 h-5 text-zinc-500" />
            </div>
            <p className="text-sm text-zinc-500 font-mono">MORE_EXPERIMENTS_PENDING...</p>
          </div>

        </div>

        {/* Warning Footer */}
        <div className="mt-16 border-t border-white/5 pt-8 flex items-center justify-center gap-2 text-xs text-zinc-600 font-mono">
          <AlertTriangle className="w-3 h-3 text-yellow-600/50" />
          <span>USE_CODE_AT_OWN_RISK</span>
        </div>

      </main>
    </div>
  );
}
