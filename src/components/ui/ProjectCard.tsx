"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HUDFrame } from "./HUDFrame";
import { NeonButton } from "./NeonButton";
import { ArrowUpRight, Github, Lock, Database, Play } from "lucide-react";
import Link from "next/link";

export interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  buildItems: string[];
  secureItems: string[];
  links: {
    demo?: string;
    repo?: string;
    caseStudy?: string;
  };
  featured?: boolean;
}

export function ProjectCard({ title, description, tags, buildItems, secureItems, links, featured = false }: ProjectCardProps) {
  const [activeTab, setActiveTab] = useState<"build" | "secure">("build");

  return (
    <HUDFrame className={cn("flex flex-col h-full", featured ? "lg:col-span-2" : "")} title="PROJECT_MODULE">
      <div className="flex-1 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold font-mono tracking-tight text-white">{title}</h3>
            <p className="mt-2 text-zinc-400 leading-relaxed max-w-xl">{description}</p>
          </div>
          {featured && <div className="hidden sm:block text-xs font-mono text-cyan/70 border border-cyan/30 px-2 py-1">FEATURED_OP</div>}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs font-mono text-zinc-500 bg-zinc-900/50 px-2 py-1 border border-zinc-800">
              {tag}
            </span>
          ))}
        </div>

        {/* Tabs Control */}
        <div className="mt-6 flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("build")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-mono transition-colors border-b-2",
              activeTab === "build"
                ? "border-cyan text-cyan bg-cyan/5"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Database className="w-3 h-3" /> BUILD
          </button>
          <button
            onClick={() => setActiveTab("secure")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-mono transition-colors border-b-2",
              activeTab === "secure"
                ? "border-cyan text-cyan bg-cyan/5"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Lock className="w-3 h-3" /> SECURE
          </button>
        </div>

        {/* Tab Content */}
        <div className="h-40 overflow-y-auto pr-2 custom-scrollbar pt-4">
          <ul className="space-y-2">
            {(activeTab === "build" ? buildItems : secureItems).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-cyan mt-1">▹</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-4">
        {links.demo && (
          <NeonButton href={links.demo} variant="primary" className="text-xs py-2 px-4">
            <Play className="w-3 h-3 mr-2" /> WATCH DEMO
          </NeonButton>
        )}
        {links.repo && (
          <NeonButton href={links.repo} variant="secondary" className="text-xs py-2 px-4">
            <Github className="w-3 h-3 mr-2" /> REPO
          </NeonButton>
        )}
        {links.caseStudy && (
          <Link
            href={links.caseStudy}
            className="flex items-center text-xs font-mono text-zinc-500 hover:text-cyan ml-auto transition-colors"
          >
            READ CASE STUDY <ArrowUpRight className="w-3 h-3 ml-1" />
          </Link>
        )}
      </div>
    </HUDFrame>
  );
}
