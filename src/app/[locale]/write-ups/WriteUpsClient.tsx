"use client";

import { useContentId } from "@/components/os/application-context";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, FileText, Search } from "lucide-react";
import type { Writeup } from "@/lib/data";
import type { PublicationSummary } from "@/lib/publications";
import { formatDate, formatNumber } from "@/i18n/format";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { getOSCopy } from "@/components/os/os-copy";
import { getPageSupportCopy } from "@/lib/page-support-copy";
import "@/components/os/supporting-apps.css";

export function WriteUpsClient({
  posts,
  publications,
  publicationSourceLanguageNote,
}: {
  posts: Omit<Writeup, "content">[];
  publications: PublicationSummary[];
  publicationSourceLanguageNote: string;
}) {
  const topics = [...new Set(posts.map((post) => post.tag))];
  const { locale, t } = useTranslation();
  const contentId = useContentId();
  const copy = getOSCopy(locale);
  const supportCopy = getPageSupportCopy(locale);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const filteredWriteups = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);
    return posts.filter(
      (post) =>
        (!topic || post.tag === topic) &&
        `${post.title} ${post.takeaway} ${post.tag} ${post.slug}`
          .toLocaleLowerCase(locale)
          .includes(normalizedQuery),
    );
  }, [posts, query, topic, locale]);

  const getPath = (path: string) =>
    locale === defaultLocale ? path : `/${locale}${path}`;

  return (
    <div className="os-support os-library">
      <header className="os-library-header">
        <span className="os-support-eyebrow">
          {t.writeups_page.classified_archive}
        </span>
        <h1>{t.writeups_page.title}</h1>
        <p>{t.writeups_page.description}</p>
        <nav className="os-support-actions" aria-label={copy.research}>
          <a
            className="os-button--secondary"
            href={`#${contentId("technical-write-ups")}`}
          >
            {copy.writing} · <bdi>{formatNumber(posts.length, locale)}</bdi>
          </a>
          <a
            className="os-button--secondary"
            href={`#${contentId("research-publications")}`}
          >
            {copy.papers} ·{" "}
            <bdi>{formatNumber(publications.length, locale)}</bdi>
          </a>
        </nav>
      </header>

      <section
        id={contentId("technical-write-ups")}
        aria-labelledby={contentId("technical-write-ups-heading")}
      >
        <h2 id={contentId("technical-write-ups-heading")}>{copy.writing}</h2>
        <div className="os-library-controls">
          <label className="os-library-search">
            <Search aria-hidden="true" size={18} />
            <span className="sr-only">{copy.librarySearch}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.librarySearch}
            />
          </label>
          <label className="os-library-topic">
            <span className="sr-only">{copy.libraryTopic}</span>
            <select
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            >
              <option value="">{copy.allTopics}</option>
              {topics.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <span className="os-library-count" role="status">
            {copy.results}: {formatNumber(filteredWriteups.length, locale)}
          </span>
        </div>

        <div className="os-library-list">
          {filteredWriteups.map((post) => (
            <article key={post.slug} className="os-library-entry">
              <span className="os-library-file" aria-hidden="true">
                <FileText size={20} strokeWidth={1.3} />
              </span>
              <div className="os-library-entry-content">
                <div className="os-library-entry-meta">
                  <time dateTime={post.date}>
                    {formatDate(post.date, locale)}
                  </time>
                  <span>{post.tag}</span>
                </div>
                <h3>
                  <Link href={getPath(`/write-ups/${post.slug}`)}>
                    {post.title}
                  </Link>
                </h3>
                <p>{post.takeaway}</p>
                {/* Visual cue only: the title is the one link to this write-up. */}
                <span className="os-library-read" aria-hidden="true">
                  {copy.readWriteup}
                  <ArrowUpRight className="os-flip" size={16} />
                </span>
              </div>
            </article>
          ))}
          {filteredWriteups.length === 0 && (
            <p className="os-library-empty">{copy.libraryEmpty}</p>
          )}
        </div>
      </section>

      <section
        id={contentId("research-publications")}
        aria-labelledby={contentId("research-publications-heading")}
      >
        <div className="os-support-section-heading">
          <h2 id={contentId("research-publications-heading")}>
            {t.project_detail.research_papers}
          </h2>
          <span className="os-library-count">
            {copy.papers}:{" "}
            <bdi>{formatNumber(publications.length, locale)}</bdi>
          </span>
        </div>
        <p className="os-library-note">{publicationSourceLanguageNote}</p>
        <div className="os-library-list">
          {publications.map((publication) => (
            <article
              className="os-library-entry"
              key={publication.id}
              data-publication={publication.id}
            >
              <span className="os-library-file" aria-hidden="true">
                <FileText size={20} strokeWidth={1.3} />
              </span>
              <div className="os-library-entry-content">
                <div className="os-library-entry-meta">
                  <span>{publication.label}</span>
                  {publication.status && <span>{publication.status}</span>}
                  {publication.venue && (
                    <span lang="en" dir="ltr">
                      {publication.venue}
                    </span>
                  )}
                  {publication.year && (
                    <time dateTime={publication.year}>
                      {formatNumber(Number(publication.year), locale, {
                        useGrouping: false,
                      })}
                    </time>
                  )}
                </div>
                <h3 lang="en" dir="ltr">
                  {/* The new-tab cue is a description, so the link name stays the title. */}
                  <a
                    href={publication.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-describedby={contentId(
                      `publication-new-tab-${publication.id}`,
                    )}
                  >
                    {publication.title}
                    <ArrowUpRight
                      className="os-flip"
                      aria-hidden="true"
                      size={16}
                    />
                  </a>
                </h3>
                {publication.description && (
                  <p lang={publication.descriptionLocale}>
                    {publication.description}
                  </p>
                )}
                <div className="os-library-actions">
                  <Link
                    className="os-button--secondary"
                    href={publication.projectHref}
                  >
                    {t.common.case_study}:{" "}
                    <bdi lang={publication.projectTitleLocale}>
                      {publication.projectTitle}
                    </bdi>
                  </Link>
                  {publication.doi && (
                    <a
                      className="os-button--secondary"
                      href={`https://doi.org/${publication.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-describedby={contentId(
                        `publication-new-tab-${publication.id}`,
                      )}
                    >
                      <bdi lang="en" dir="ltr">
                        DOI: {publication.doi}
                      </bdi>
                    </a>
                  )}
                </div>
                <span
                  id={contentId(`publication-new-tab-${publication.id}`)}
                  className="sr-only"
                >
                  {supportCopy.opensInNewTab}
                </span>
                {/* Visual cue only: the title opens the paper in a new tab. */}
                <span className="os-library-read" aria-hidden="true">
                  {copy.readPaper}
                  <ArrowUpRight className="os-flip" size={16} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
