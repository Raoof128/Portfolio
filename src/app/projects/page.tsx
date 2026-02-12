"use client";

import { useState } from "react";
import { projects } from "@/lib/data";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/utils";

export default function ProjectsArchive() {
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const categories = ["ALL", "OFFENSIVE", "DEFENSIVE", "ENGINEERING"];

  const filteredProjects = Object.values(projects).filter((p) => {
    const matchesCategory = filter === "ALL" || p.category?.toUpperCase() === filter;
    const matchesSearch = p.title.toLowerCase().includes(query.toLowerCase()) ||
                          p.description.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <AnimatedSection variants={fadeInUp}>
        <div className="border-b border-zinc-800 pb-8">
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

            {/* Filter Flags with animated indicator */}
            <div className="flex flex-wrap gap-2 relative">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="relative px-3 py-1 text-xs font-mono border rounded-sm transition-all border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                >
                  {filter === cat && (
                    <motion.div
                      layoutId="filter-indicator"
                      className="absolute inset-0 bg-cyan-500/10 border border-cyan-500 rounded-sm"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${filter === cat ? "text-cyan-400" : ""}`}>
                    --{cat.toLowerCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* RESULTS GRID */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 pb-20"
      >
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <motion.div
                key={project.slug}
                variants={fadeInUp}
                layout
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="group relative bg-zinc-900/20 border border-white/5 hover:border-cyan-500/30 p-4 md:p-6 transition-all hover:bg-zinc-900/40"
                >
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
                </motion.div>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center border border-dashed border-zinc-800 rounded-lg"
            >
              <p className="text-zinc-500 font-mono">Query returned 0 results.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
