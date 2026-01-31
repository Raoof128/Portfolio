"use client";

import { useState } from "react";
import { projects } from "@/lib/data";
import { NeonButton } from "@/components/ui/NeonButton";
import { Terminal } from "lucide-react";

export default function ProjectsArchive() {
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  // Categories for the filter bar
  const categories = ["ALL", "OFFENSIVE", "DEFENSIVE", "ENGINEERING"];

  // Filter logic
  const filteredProjects = Object.values(projects).filter((p) => {
    const matchesCategory = filter === "ALL" || p.category?.toUpperCase() === filter;
    const matchesSearch = p.title.toLowerCase().includes(query.toLowerCase()) || 
                          p.description.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER: DATABASE QUERY UI */}
      <div className="border-b border-zinc-800 pb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Terminal className="text-cyan-500 w-6 h-6" /> 
          PROJECT_DB
        </h1>
        <p className="text-zinc-400 font-mono text-sm">
          Index of deployed tools, research prototypes, and architectural proofs.
        </p>

        {/* CONTROLS */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
          
          {/* Faux 'Grep' Search */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-zinc-500 font-mono text-xs">&gt; grep</span>
            </div>
            <input
              type="text"
              placeholder="search_query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-16 pr-3 py-2 border border-zinc-700 rounded-sm leading-5 bg-black/50 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm font-mono transition-all"
            />
          </div>

          {/* Filter Flags */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`
                  px-3 py-1 text-xs font-mono border rounded-sm transition-all
                  ${filter === cat 
                    ? "bg-cyan-500/10 border-cyan-500 text-cyan-400" 
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"}
                `}
              >
                --{cat.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS GRID */}
      <div className="grid grid-cols-1 gap-4 pb-20">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div 
              key={project.slug}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
             {/* Row Layout */}
              <div className="group relative bg-zinc-900/20 border border-white/5 hover:border-cyan-500/30 p-4 md:p-6 transition-all hover:bg-zinc-900/40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Title & Tags */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {project.year || "2024"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="text-xs text-zinc-500 font-mono">#{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Description Preview */}
                  <p className="text-sm text-zinc-400 max-w-xl md:text-right line-clamp-2">
                    {project.description}
                  </p>

                  {/* Action */}
                  <div className="shrink-0">
                    <NeonButton href={`/projects/${project.slug}`} variant="outline" className="text-xs h-8 px-4">
                      ACCESS_FILE
                    </NeonButton>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border border-dashed border-zinc-800 rounded-lg">
            <p className="text-zinc-500 font-mono">Query returned 0 results.</p>
          </div>
        )}
      </div>
    </div>
  );
}