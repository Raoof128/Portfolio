"use client";

import { Mail, Download, MapPin, Users } from "lucide-react";
import {
  CONTACT_EMAIL_GMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  ORCID_URL,
} from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import { certifications } from "@/lib/certifications";
import Link from "next/link";
import { defaultLocale } from "@/i18n";
import { formatDate, formatNumber } from "@/i18n/format";
import { getPageSupportCopy } from "@/lib/page-support-copy";
import { useContentId } from "@/components/os/application-context";
import "@/components/os/supporting-apps.css";

function ProjectEntry({
  href,
  name,
  tag,
  year,
  stack,
  description,
}: {
  href: string;
  name: string;
  tag: string;
  year: string;
  stack: string;
  description: string;
}) {
  return (
    <div className="os-resume-item">
      <div className="os-resume-entry-head">
        <h4>
          <Link href={href} className="os-inline-link">
            <bdi dir="ltr" lang="en">
              {name}
            </bdi>
          </Link>
          <span className="os-resume-tag">{tag}</span>
        </h4>
        <span className="os-resume-period">{year}</span>
      </div>
      <p className="os-resume-meta">{stack}</p>
      <p>{description}</p>
    </div>
  );
}

export function ResumeClient() {
  const { t, locale } = useTranslation();
  const copy = getPageSupportCopy(locale);
  const contentId = useContentId();
  // A credential gives only a Gregorian month, not a day. Keep its calendar
  // instead of inventing a Persian-calendar month from an arbitrary date.
  const monthYear = (date: string) =>
    formatDate(date, locale, {
      month: "long",
      year: "numeric",
      calendar: "gregory",
    });
  const issuedDate = (issued: string) => {
    const months: Record<string, string> = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    const [month, year] = issued.split(" ");
    return months[month] && /^\d{4}$/.test(year)
      ? monthYear(`${year}-${months[month]}-01`)
      : issued;
  };
  const getPath = (path: string) =>
    locale === defaultLocale ? path : `/${locale}${path}`;
  const year = (value: number) =>
    formatNumber(value, locale, { useGrouping: false });

  return (
    <div className="os-support os-resume">
      <div className="os-resume-header">
        <h1>{t.resume_page.title}</h1>
        <div className="os-resume-download">
          {/* PDF links open in a new tab, like View Résumé PDF on the desktop, so the reader
              keeps their place on the site. The download attribute still saves the file. */}
          <a
            className="os-button"
            href="/Mohammad_Raouf_Abedini_Resume.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download aria-hidden="true" size={16} />
            {t.resume_page.download}
            <span className="sr-only">{copy.opensInNewTab}</span>
          </a>
          <p className="os-support-note">{copy.originalEnglishPDF}</p>
        </div>
      </div>

      {/* Identity */}
      <div className="os-callout os-resume-identity">
        <div>
          <h2>
            <bdi dir="ltr" lang="en">
              Mohammad Raouf Abedini
            </bdi>
          </h2>
          <p className="os-resume-tagline">{t.resume.tagline}</p>
          <ul className="os-resume-contact">
            <li>
              <MapPin aria-hidden="true" size={16} />
              {t.resume.location}
            </li>
            <li>
              <Mail aria-hidden="true" size={16} />
              <a
                href={`mailto:${CONTACT_EMAIL_GMAIL}`}
                className="os-text-link"
              >
                <bdi dir="ltr">{CONTACT_EMAIL_GMAIL}</bdi>
              </a>
            </li>
          </ul>
        </div>
        <div className="os-resume-links">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="os-text-link"
          >
            <span>github.com/Raoof128</span>
            <span className="sr-only">{copy.opensInNewTab}</span>
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="os-text-link"
          >
            <span>{t.resume.linkedin_profile}</span>
            <span className="sr-only">{copy.opensInNewTab}</span>
          </a>
          <a
            href={ORCID_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="os-text-link"
          >
            <span>{t.resume.orcid_id}</span>
            <span className="sr-only">{copy.opensInNewTab}</span>
          </a>
        </div>
      </div>

      {/* About */}
      <section className="os-resume-section">
        <h3 className="os-resume-heading">{t.resume.s01_heading}</h3>
        <p className="os-resume-bio">{t.resume.s01_bio}</p>
      </section>

      {/* Security Research */}
      <section className="os-resume-section">
        <h3 className="os-resume-heading">{t.resume.s02_heading}</h3>
        <div className="os-resume-item">
          <div className="os-resume-entry-head">
            <h4>
              <Link
                href={getPath("/projects/project-simurgh")}
                className="os-inline-link"
              >
                <bdi dir="ltr" lang="en">
                  Project Simurgh
                </bdi>
              </Link>
            </h4>
            <span className="os-resume-period">{year(2026)}</span>
          </div>
          <p className="os-resume-meta">{t.resume.s02_tech_stack}</p>
          <p>{t.resume.s02_subtitle}</p>
          <ul className="os-bullet-list">
            <li>{t.resume.s02_bullet1}</li>
            <li>{t.resume.s02_bullet2}</li>
            <li>{t.resume.s02_bullet3}</li>
            <li>{t.resume.s02_bullet4}</li>
            <li>{t.resume.s02_bullet5}</li>
          </ul>
        </div>
      </section>

      {/* Technical Proficiencies */}
      <section
        id={contentId("skills")}
        aria-labelledby={contentId("skills-heading")}
        tabIndex={-1}
        className="os-resume-section"
      >
        <h3 id={contentId("skills-heading")} className="os-resume-heading">
          {t.resume.s03_heading}
        </h3>
        <div className="os-resume-grid">
          <div className="os-resume-card">
            <h4>{t.resume.s03_cat1_label}</h4>
            <p>{t.resume.s03_cat1_desc}</p>
          </div>
          <div className="os-resume-card">
            <h4>{t.resume.s03_cat2_label}</h4>
            <p>{t.resume.s03_cat2_desc}</p>
          </div>
          <div className="os-resume-card">
            <h4>{t.resume.s03_cat3_label}</h4>
            <p>{t.resume.s03_cat3_desc}</p>
          </div>
          <div className="os-resume-card">
            <h4>{t.resume.s03_cat4_label}</h4>
            <p>{t.resume.s03_cat4_desc}</p>
          </div>
          <div className="os-resume-card os-resume-card--wide">
            <h4>{t.resume.s03_cat5_label}</h4>
            <p>{t.resume.s03_cat5_desc}</p>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="os-resume-section">
        <h3 className="os-resume-heading">{t.about.education}</h3>
        <div className="os-resume-item os-resume-timeline">
          <div className="os-resume-entry-head">
            <h4>{t.about.degree_bachelor}</h4>
            <span className="os-resume-meta">{copy.university}</span>
          </div>
          <div className="os-resume-period">
            {monthYear("2024-05-01")} – {t.resume.expected_completion}:{" "}
            {monthYear("2026-11-01")}
          </div>
          <p className="os-resume-meta">
            <span className="os-resume-label">
              {t.resume.s04_coursework_label}
            </span>{" "}
            {t.resume.s04_coursework}
          </p>
        </div>
        <div className="os-resume-item os-resume-timeline">
          <div className="os-resume-entry-head">
            <h4>{t.about.degree_diploma}</h4>
            <span className="os-resume-meta">{copy.university}</span>
          </div>
          <div className="os-resume-period">
            {monthYear("2023-07-01")} – {monthYear("2024-05-01")}
          </div>
        </div>
      </section>

      {/* Selected Research & Engineering Projects */}
      <section className="os-resume-section">
        <h3 className="os-resume-heading">{t.resume.s05_heading}</h3>
        <ProjectEntry
          href={getPath("/projects/invisible-window-research")}
          name="The Invisible Window"
          tag={t.resume.proj1_tag}
          year={year(2026)}
          stack={t.resume.proj1_stack}
          description={t.resume.proj1_desc}
        />
        <ProjectEntry
          href={getPath("/projects/aion")}
          name="Aion"
          tag={t.resume.proj2_tag}
          year={year(2026)}
          stack={t.resume.proj2_stack}
          description={t.resume.proj2_desc}
        />
        <ProjectEntry
          href={getPath("/projects/nanomatch")}
          name="NanoMatch"
          tag={t.resume.proj3_tag}
          year={year(2026)}
          stack={t.resume.proj3_stack}
          description={t.resume.proj3_desc}
        />
        <ProjectEntry
          href={getPath("/projects/sentinelflow")}
          name="SentinelFlow"
          tag={t.resume.proj4_tag}
          year={year(2026)}
          stack={t.resume.proj4_stack}
          description={t.resume.proj4_desc}
        />
        <ProjectEntry
          href={getPath("/projects/nexus-archive")}
          name="Nexus Archive"
          tag={t.resume.proj5_tag}
          year={year(2025)}
          stack={t.resume.proj5_stack}
          description={t.resume.proj5_desc}
        />
        <ProjectEntry
          href={getPath("/projects/mehr-guard")}
          name="Mehr Guard"
          tag={t.resume.proj6_tag}
          year={year(2024)}
          stack={t.resume.proj6_stack}
          description={t.resume.proj6_desc}
        />
        <div className="os-callout os-resume-more">
          <p>
            {t.resume.s05_more_projects}{" "}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="os-text-link"
            >
              github.com/Raoof128
              <span className="sr-only">{copy.opensInNewTab}</span>
            </a>
          </p>
        </div>
      </section>

      {/* Professional Experience */}
      <section
        id={contentId("experience")}
        aria-labelledby={contentId("experience-heading")}
        tabIndex={-1}
        className="os-resume-section"
      >
        <h3 id={contentId("experience-heading")} className="os-resume-heading">
          {t.resume.s06_heading}
        </h3>
        <div className="os-resume-item os-resume-timeline">
          <div className="os-resume-entry-head">
            <h4>{t.resume.exp1_title}</h4>
            <span className="os-resume-meta">{t.resume.exp1_employer}</span>
          </div>
          <ul className="os-bullet-list">
            <li>{t.resume.exp1_bullet1}</li>
            <li>{t.resume.exp1_bullet2}</li>
            <li>{t.resume.exp1_bullet3}</li>
          </ul>
        </div>
        <div className="os-resume-item os-resume-timeline">
          <div className="os-resume-entry-head">
            <h4>{t.resume.exp2_title}</h4>
            <span className="os-resume-meta">{t.resume.exp2_employer}</span>
          </div>
          <ul className="os-bullet-list">
            <li>{t.resume.exp2_bullet1}</li>
          </ul>
        </div>
      </section>

      {/* AI Safety & Community */}
      <section className="os-resume-section">
        <h3 className="os-resume-heading">{t.resume.s07_heading}</h3>
        <ul className="os-bullet-list">
          <li>{t.resume.s07_bullet1}</li>
        </ul>
        {/* Volunteering: Macquarie Persian Students Society */}
        <div className="os-resume-item os-resume-timeline os-resume-volunteer">
          <div className="os-resume-entry-head">
            <h4>
              <Users aria-hidden="true" size={16} />
              {copy.coFounderSociety}
            </h4>
            <span className="os-resume-period">
              {year(2026)} – {copy.present}
            </span>
          </div>
          <p className="os-resume-meta">
            {t.resume.volunteer_label} · {copy.education}
          </p>
          <p>{t.resume.s07_bullet2}</p>
        </div>
      </section>

      {/* Licenses & Certifications */}
      <section
        id={contentId("certifications")}
        aria-labelledby={contentId("certifications-heading")}
        tabIndex={-1}
        className="os-resume-section"
      >
        <h3
          id={contentId("certifications-heading")}
          className="os-resume-heading"
        >
          {t.resume.certs_heading}
        </h3>
        <p className="os-prose">{copy.officialCertificateNames}</p>
        {["Anthropic", "Macquarie University"].map((issuer) => {
          const items = certifications.filter((c) => c.issuer === issuer);
          if (items.length === 0) return null;
          return (
            <div key={issuer} className="os-resume-item">
              <h4 className="os-resume-cert-issuer">
                {issuer === "Macquarie University" ? copy.university : issuer}{" "}
                <span>({formatNumber(items.length, locale)})</span>
              </h4>
              <div className="os-resume-grid">
                {items.map((c) => (
                  <div key={c.credentialId} className="os-resume-card">
                    <div className="os-resume-card-head">
                      <p>
                        <bdi dir="ltr" lang="en">
                          {c.name}
                        </bdi>
                      </p>
                      {c.grade && (
                        <span className="os-resume-grade">
                          <bdi dir="ltr">{c.grade}</bdi>
                        </span>
                      )}
                    </div>
                    <p className="os-resume-card-meta">
                      {t.resume.certs_issued} {issuedDate(c.issued)} ·{" "}
                      {t.resume.certs_credential}:{" "}
                      <bdi dir="ltr">{c.credentialId}</bdi>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Additional Info */}
      <section className="os-resume-section">
        <h3 className="os-resume-heading">{t.resume.s08_heading}</h3>
        <ul className="os-resume-plain">
          <li>{t.resume.s08_available}</li>
          <li>{t.resume.s08_languages}</li>
        </ul>
      </section>
    </div>
  );
}
