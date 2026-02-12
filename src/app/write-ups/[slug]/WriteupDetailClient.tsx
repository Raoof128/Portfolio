"use client";

import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArrowLeft, Calendar, Terminal } from "lucide-react";
import { SimpleMarkdown } from "@/components/ui/SimpleMarkdown";
import { fadeInUp } from "@/lib/utils";

interface WriteupPost {
  slug: string;
  title: string;
  tag: string;
  date: string;
  takeaway: string;
  content: string;
}

export function WriteupDetailClient({ post }: { post: WriteupPost }) {
  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden">
      <ActiveGrid />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Back Link */}
        <AnimatedSection variants={fadeInUp}>
          <div className="mb-8">
            <NeonButton href="/write-ups" variant="outline" className="text-xs px-3 py-1">
              <ArrowLeft className="w-3 h-3 mr-2" /> BACK_TO_ARCHIVE
            </NeonButton>
          </div>
        </AnimatedSection>

        {/* Header */}
        <AnimatedSection variants={fadeInUp} delay={0.1}>
          <header className="mb-12 border-b border-white/10 pb-8">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-cyan mb-4">
              <span className="flex items-center gap-1 bg-cyan/10 px-2 py-1 rounded">
                <Terminal className="w-3 h-3" />
                {post.tag}
              </span>
              <span className="flex items-center gap-1 text-zinc-500">
                <Calendar className="w-3 h-3" />
                {post.date}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-zinc-400 font-light border-l-4 border-cyan pl-4 italic">
              {post.takeaway}
            </p>
          </header>
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection variants={fadeInUp} delay={0.2}>
          <div className="prose prose-invert prose-cyan max-w-none">
            <SimpleMarkdown content={post.content} />
          </div>
        </AnimatedSection>

        {/* Footer */}
        <AnimatedSection variants={fadeInUp} delay={0.3}>
          <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center text-sm text-zinc-500 font-mono">
            <span>END_OF_TRANSMISSION</span>
            <span>ID: {post.slug.toUpperCase()}</span>
          </div>
        </AnimatedSection>

      </article>
    </div>
  );
}
