"use client";

import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { SimpleMarkdown } from "@/components/ui/SimpleMarkdown";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { formatDate } from "@/i18n/format";
import "@/components/os/supporting-apps.css";

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

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  return (
    <article className="os-support os-writeup">
      <div className="os-writeup-back">
        <Link href={getPath("/write-ups")} className="os-button--secondary">
          <ArrowLeft className="os-flip" aria-hidden="true" size={16} />
          {t.common.back}
        </Link>
      </div>

      <header>
        <div className="os-writeup-meta">
          <span className="os-chip">{post.tag}</span>
          <time dateTime={post.date}>
            <Calendar aria-hidden="true" size={14} />
            {formatDate(post.date, locale)}
          </time>
        </div>

        <h1>{post.title}</h1>

        <p className="os-takeaway os-callout">{post.takeaway}</p>
      </header>

      <div className="os-writeup-body">
        <SimpleMarkdown content={post.content} locale={locale} />
      </div>

      <footer className="os-writeup-footer">
        <span>{t.writeups_detail.end_transmission}</span>
        <span>
          {t.lab_page.id_label} <bdi dir="ltr">{post.slug}</bdi>
        </span>
      </footer>
    </article>
  );
}
