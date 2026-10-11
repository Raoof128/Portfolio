"use client";

import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArrowLeft, Calendar, Terminal } from "lucide-react";
import { SimpleMarkdown } from "@/components/ui/SimpleMarkdown";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { cn } from "@/lib/utils";
import { formatDate } from "@/i18n/format";

interface WriteupPost {
  slug: string;
  title: string;
  tag: string;
  date: string;
  takeaway: string;
  content: string;
}

export function WriteupDetailClient({ post }: { post: WriteupPost }) {
  const { locale, t } = useTranslation();
  const isRTL = locale === "fa" || locale === "ar";

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  return (
    <div
      className={cn(
        "os-legacy relative overflow-x-hidden",
        isRTL && "text-right",
      )}
    >
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <AnimatedSection>
          <div className={cn("mb-8 flex", isRTL && "justify-end")}>
            <NeonButton
              href={getPath("/write-ups")}
              variant="outline"
              className="text-xs px-3 py-1"
            >
              <ArrowLeft
                className={cn("w-3 h-3", isRTL ? "ml-2 rotate-180" : "mr-2")}
              />{" "}
              {t.common.back}
            </NeonButton>
          </div>
        </AnimatedSection>

        {/* Header */}
        <AnimatedSection>
          <header className="mb-12 border-b border-cyan/12 pb-8">
            <div
              className={cn(
                "flex flex-wrap items-center gap-4 text-xs font-mono text-cyan mb-4",
                isRTL && "flex-row-reverse",
              )}
            >
              <span className="flex items-center gap-1 bg-cyan/10 px-2 py-1 rounded">
                <Terminal className="w-3 h-3" />
                {post.tag}
              </span>
              <span className="flex items-center gap-1 text-text-body">
                <Calendar className="w-3 h-3" />
                <time dateTime={post.date}>
                  {formatDate(post.date, locale)}
                </time>
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>

            <p
              className={cn(
                "text-xl text-text-body font-light italic pl-4",
                isRTL
                  ? "border-r-4 border-l-0 pr-4 pl-0 border-cyan"
                  : "border-l-4 border-cyan",
              )}
            >
              {post.takeaway}
            </p>
          </header>
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection>
          <div className="prose prose-invert prose-cyan max-w-none">
            <SimpleMarkdown content={post.content} locale={locale} />
          </div>
        </AnimatedSection>

        {/* Footer */}
        <AnimatedSection>
          <div
            className={cn(
              "mt-16 pt-8 border-t border-cyan/12 flex justify-between items-center text-sm text-text-body font-mono",
              isRTL && "flex-row-reverse",
            )}
          >
            <span>{t.writeups_detail.end_transmission}</span>
            <span>
              {t.lab_page.id_label}{" "}
              <bdi dir="ltr">{post.slug.toUpperCase()}</bdi>
            </span>
          </div>
        </AnimatedSection>
      </article>
    </div>
  );
}
