import { writeups } from "@/lib/data";
import { notFound } from "next/navigation";
import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { NeonButton } from "@/components/ui/NeonButton";
import { ArrowLeft, Calendar, Terminal } from "lucide-react";

export function generateStaticParams() {
  return writeups.map((post) => ({
    slug: post.slug,
  }));
}

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = writeups.find((p) => p.slug === slug);
    if (!post) return { title: "Not Found" };
  
    return {
      title: `${post.title} | Raouf Security`,
      description: post.takeaway,
    };
  }

export default async function WriteupPage({ params }: PageProps) {
  const { slug } = await params;
  const post = writeups.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden">
      <ActiveGrid />
      
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Back Link */}
        <div className="mb-8">
          <NeonButton href="/write-ups" variant="outline" className="text-xs px-3 py-1">
            <ArrowLeft className="w-3 h-3 mr-2" /> BACK_TO_ARCHIVE
          </NeonButton>
        </div>

        {/* Header */}
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

        {/* Content */}
        <div className="prose prose-invert prose-cyan max-w-none">
            {/* 
                We use react-markdown here if installed, otherwise simpler rendering.
                The prompt didn't specify installing libraries, but 'react-markdown' is standard.
                However, to be safe and avoid "package not found" without checking package.json, 
                I will stick to basic whitespace rendering or verify if I can use it.
                I will assume I cannot install new packages easily without user permission.
                So I will perform a simple split/map for paragraphs or just whitespace-pre-wrap.
            */}
             <div className="whitespace-pre-wrap font-sans text-zinc-300 leading-relaxed">
                {post.content}
             </div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center text-sm text-zinc-500 font-mono">
            <span>END_OF_TRANSMISSION</span>
            <span>ID: {post.slug.toUpperCase()}</span>
        </div>

      </article>
    </div>
  );
}
