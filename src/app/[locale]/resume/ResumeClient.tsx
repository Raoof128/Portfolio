"use client";

import { Download } from "lucide-react";
import {
  CONTACT_EMAIL_GMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  ORCID_URL,
  SITE_URL,
} from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import { getPageSupportCopy } from "@/lib/page-support-copy";
import { useContentId } from "@/components/os/application-context";
import "@/components/os/supporting-apps.css";

// The web résumé mirrors the downloadable PDF line by line: the same sections,
// entries, bullets and order. Change the PDF and this page together.

// DOIs and web addresses stay left-to-right inside Persian and Arabic lines;
// without isolation the bidi algorithm reorders "10.5281/zenodo.…" around the slash.
const LTR_TOKEN =
  /(10\.5281\/zenodo\.\d+|[a-z0-9-]+(?:\.[a-z0-9-]+)+\/[\w./-]+|[a-z0-9-]+\.(?:app|dev|com)\b)/gi;

function Line({ text }: { text: string }) {
  return (
    <>
      {text.split(LTR_TOKEN).map((part, index) =>
        index % 2 === 1 ? (
          <bdi key={index} dir="ltr">
            {part}
          </bdi>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Entry({
  title,
  period,
  meta,
  bullets,
}: {
  title: string;
  period: string;
  meta?: string;
  bullets: string[];
}) {
  return (
    <div className="os-resume-item os-resume-timeline">
      <div className="os-resume-entry-head">
        <h4>{title}</h4>
        <span className="os-resume-period">{period}</span>
      </div>
      {meta && (
        <p className="os-resume-meta">
          <Line text={meta} />
        </p>
      )}
      {bullets.length > 0 && (
        <ul className="os-bullet-list">
          {bullets.map((bullet) => (
            <li key={bullet}>
              <Line text={bullet} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function External({ href, label, note }: { href: string; label: string; note: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="os-text-link">
      <bdi dir="ltr">{label}</bdi>
      <span className="sr-only">{note}</span>
    </a>
  );
}

export function ResumeClient() {
  const { t, locale } = useTranslation();
  const r = t.resume;
  const copy = getPageSupportCopy(locale);
  const contentId = useContentId();
  const siteHost = new URL(SITE_URL).host;

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

      {/* Identity: name, title line, location line, contact line, links line. */}
      <div className="os-callout os-resume-identity">
        <div>
          <h2>
            <bdi dir="ltr" lang="en">
              Mohammad Raouf Abedini
            </bdi>
          </h2>
          <p className="os-resume-tagline">{r.tagline}</p>
          <p className="os-resume-meta">{r.location}</p>
          <p className="os-resume-meta" data-resume-line="contact">
            <a href={`mailto:${CONTACT_EMAIL_GMAIL}`} className="os-text-link">
              <bdi dir="ltr">{CONTACT_EMAIL_GMAIL}</bdi>
            </a>{" "}
            ·{" "}
            <External
              href={LINKEDIN_URL}
              label="linkedin.com/in/mohammad-raouf-abedini-885a9226a"
              note={copy.opensInNewTab}
            />
          </p>
          <p className="os-resume-meta" data-resume-line="links">
            <External href={GITHUB_URL} label="github.com/Raoof128" note={copy.opensInNewTab} />{" "}
            · <External href={SITE_URL} label={siteHost} note={copy.opensInNewTab} /> ·{" "}
            <External
              href={ORCID_URL}
              label="ORCID 0009-0000-6214-258X"
              note={copy.opensInNewTab}
            />
          </p>
        </div>
      </div>

      <section className="os-resume-section">
        <h3 className="os-resume-heading">{r.summary_heading}</h3>
        <p className="os-resume-bio">{r.summary}</p>
      </section>

      <section
        id={contentId("skills")}
        aria-labelledby={contentId("skills-heading")}
        tabIndex={-1}
        className="os-resume-section"
      >
        <h3 id={contentId("skills-heading")} className="os-resume-heading">
          {r.s03_heading}
        </h3>
        <ul className="os-resume-lines">
          {(
            [
              [r.skill1_label, r.skill1_desc],
              [r.skill2_label, r.skill2_desc],
              [r.skill3_label, r.skill3_desc],
              [r.skill4_label, r.skill4_desc],
            ] as const
          ).map(([label, desc]) => (
            <li key={label}>
              <span className="os-resume-label">{label}</span> {desc}
            </li>
          ))}
        </ul>
      </section>

      <section className="os-resume-section">
        <h3 className="os-resume-heading">{r.research_heading}</h3>
        <Entry
          title={r.simurgh_title}
          period={r.simurgh_period}
          meta={r.simurgh_meta}
          bullets={[
            r.simurgh_b1,
            r.simurgh_b2,
            r.simurgh_b3,
            r.simurgh_b4,
            r.simurgh_b5,
            r.simurgh_b6,
            r.simurgh_b7,
          ]}
        />
        <Entry title={r.iw_title} period={r.iw_period} meta={r.iw_meta} bullets={[r.iw_b1, r.iw_b2]} />
        <Entry title={r.aion_title} period={r.aion_period} meta={r.aion_meta} bullets={[r.aion_b1]} />
        <Entry
          title={r.further_title}
          period={r.further_period}
          bullets={[r.further_b1, r.further_b2, r.further_b3, r.further_b4, r.further_b5]}
        />
      </section>

      <section
        id={contentId("experience")}
        aria-labelledby={contentId("experience-heading")}
        tabIndex={-1}
        className="os-resume-section"
      >
        <h3 id={contentId("experience-heading")} className="os-resume-heading">
          {r.s06_heading}
        </h3>
        <Entry
          title={r.alignerr_title}
          period={r.alignerr_period}
          meta={r.alignerr_meta}
          bullets={[r.alignerr_b1]}
        />
        <Entry
          title={r.syllabus_title}
          period={r.syllabus_period}
          meta={r.syllabus_meta}
          bullets={[r.syllabus_b1]}
        />
        <Entry
          title={r.freelance_title}
          period={r.freelance_period}
          meta={r.freelance_meta}
          bullets={[r.freelance_b1]}
        />
        <Entry
          title={r.pharmacy_title}
          period={r.pharmacy_period}
          meta={r.pharmacy_meta}
          bullets={[r.pharmacy_b1]}
        />
      </section>

      <section className="os-resume-section">
        <h3 className="os-resume-heading">{r.education_heading}</h3>
        <Entry title={r.edu1_title} period={r.edu1_period} meta={r.edu1_meta} bullets={[]} />
        <Entry title={r.edu2_title} period={r.edu2_period} bullets={[]} />
      </section>

      <section
        id={contentId("certifications")}
        aria-labelledby={contentId("certifications-heading")}
        tabIndex={-1}
        className="os-resume-section"
      >
        <h3 id={contentId("certifications-heading")} className="os-resume-heading">
          {r.certs_heading}
        </h3>
        <ul className="os-resume-lines">
          <li>
            <Line text={r.cert1} />
          </li>
          <li>
            <Line text={r.cert2} />
          </li>
        </ul>
      </section>
    </div>
  );
}
