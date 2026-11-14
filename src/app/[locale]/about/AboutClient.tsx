"use client";

import { useContentId } from "@/components/os/application-context";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BASE_PATH,
  GITHUB_URL,
  LINKEDIN_URL,
  CONTACT_EMAIL_GMAIL,
  ORCID_URL,
} from "@/lib/constants";
import {
  Github,
  Linkedin,
  Mail,
  Shield,
  Brain,
  FileCode2,
  Fingerprint,
  ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { formatDate } from "@/i18n/format";
import { getPageSupportCopy } from "@/lib/page-support-copy";
import "@/components/os/supporting-apps.css";

// The 600 px WebP is the displayed size (the box is 300 CSS px at 2x). The 1200 px
// JPEG and the PNG stay as fallbacks, and the JPEG is also the JSON-LD and OG image.
const PROFILE_PHOTO_SOURCES = [
  `${BASE_PATH}/images/raouf-about-600-7d22ea07.webp`,
  `${BASE_PATH}/Raouf_2.jpg`,
  `${BASE_PATH}/Raouf_2.png`,
] as const;

export function AboutClient() {
  const { locale, t } = useTranslation();
  const contentId = useContentId();
  const copy = getPageSupportCopy(locale);
  const monthYear = (date: string) =>
    formatDate(date, locale, {
      month: "long",
      year: "numeric",
      calendar: "gregory",
    });
  const [photoSourceIndex, setPhotoSourceIndex] = useState(0);
  const [photoLoadFailed, setPhotoLoadFailed] = useState(false);
  const photoSource = PROFILE_PHOTO_SOURCES[photoSourceIndex];

  // The About lists reuse the résumé's four skill lines, so the page and the
  // PDF make the same claims in every language.
  const skillLine = (label: string, items: string) => ({
    label: label.replace(/[:：]\s*$/, ""),
    items: items.split(" · "),
  });
  const specializations = [
    { icon: Brain, ...skillLine(t.resume.skill1_label, t.resume.skill1_desc) },
    {
      icon: FileCode2,
      ...skillLine(t.resume.skill2_label, t.resume.skill2_desc),
    },
    { icon: Shield, ...skillLine(t.resume.skill3_label, t.resume.skill3_desc) },
  ];
  const skillGroups = [
    skillLine(t.resume.skill4_label, t.resume.skill4_desc),
  ].map((group) => ({ label: group.label, skills: group.items }));

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  const handlePhotoError = () => {
    if (photoSourceIndex < PROFILE_PHOTO_SOURCES.length - 1) {
      setPhotoSourceIndex((i) => i + 1);
      return;
    }
    setPhotoLoadFailed(true);
  };

  const handlePhotoRetry = () => {
    setPhotoSourceIndex(0);
    setPhotoLoadFailed(false);
  };

  return (
    <div className="os-support os-about">
      <section
        className="os-about-profile"
        aria-labelledby={contentId("about-heading")}
      >
        <div className="os-about-intro">
          <p className="os-support-eyebrow">{t.about.identity_record}</p>
          <h1 id={contentId("about-heading")}>{t.about.hero_title}</h1>
          <p className="os-about-role">{t.about.hero_subtitle}</p>
          <div className="os-about-bio">
            <p>{t.about.bio_1}</p>
            <p>{t.about.bio_2}</p>
            <p>{t.about.bio_3}</p>
          </div>
          <div className="os-support-actions">
            <Link href={getPath("/contact")} className="os-button">
              {t.about.connect}
              <ArrowUpRight className="os-flip" aria-hidden="true" size={16} />
            </Link>
            <Link href={getPath("/resume")} className="os-button--secondary">
              {t.about.view_resume}
              <ArrowUpRight className="os-flip" aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
        <aside className="os-about-identity">
          <div className="os-about-photo">
            {!photoLoadFailed ? (
              <Image
                key={photoSource}
                src={photoSource}
                alt={t.about.hero_title}
                fill
                sizes="(max-width: 700px) 240px, 300px"
                unoptimized
                // Not the LCP (the intro paragraph is), so no preload. The default lazy
                // load still starts at layout because the photo sits in the first view.
                loading="lazy"
                className="os-about-photo-image"
                onError={handlePhotoError}
              />
            ) : (
              <div className="os-about-photo-fallback">
                <strong>MRA</strong>
                <p>{t.about.photo_unavailable}</p>
                <button
                  type="button"
                  className="os-button--secondary"
                  onClick={handlePhotoRetry}
                >
                  {t.about.retry_photo}
                </button>
              </div>
            )}
          </div>
          <div className="os-about-location">
            <span>{t.about.terminal_subject}</span>
            <span>{t.about.terminal_clearance}</span>
            <span>{t.about.terminal_location}</span>
          </div>
          <div className="os-about-socials">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <Github aria-hidden="true" size={17} />
              <span>github.com/Raoof128</span>
              <span className="sr-only">{copy.opensInNewTab}</span>
              <ArrowUpRight className="os-flip" aria-hidden="true" size={14} />
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <Linkedin aria-hidden="true" size={17} />
              <span>LinkedIn</span>
              <span className="sr-only">{copy.opensInNewTab}</span>
              <ArrowUpRight className="os-flip" aria-hidden="true" size={14} />
            </a>
            <a href={ORCID_URL} target="_blank" rel="noopener noreferrer">
              <Fingerprint aria-hidden="true" size={17} />
              <span>ORCID</span>
              <span className="sr-only">{copy.opensInNewTab}</span>
              <ArrowUpRight className="os-flip" aria-hidden="true" size={14} />
            </a>
            <a href={`mailto:${CONTACT_EMAIL_GMAIL}`}>
              <Mail aria-hidden="true" size={17} />
              <span dir="ltr">{CONTACT_EMAIL_GMAIL}</span>
              <ArrowUpRight className="os-flip" aria-hidden="true" size={14} />
            </a>
          </div>
        </aside>
      </section>

      <dl className="os-about-stats">
        {[
          { value: "5", label: t.about.stats_preprints },
          { value: "100%", label: t.about.stats_evasion },
          { value: "2", label: t.about.stats_vendors },
        ].map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd dir="ltr">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section
        className="os-about-section"
        aria-labelledby={contentId("about-specializations")}
      >
        <h2 id={contentId("about-specializations")}>
          {t.about.specializations}
        </h2>
        <div className="os-about-specializations">
          {specializations.map((spec) => (
            <article key={spec.label} className="os-about-spec">
              <h3>
                <spec.icon aria-hidden="true" size={20} />
                {spec.label}
              </h3>
              <ul>
                {spec.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section
        className="os-about-section"
        aria-labelledby={contentId("about-skills")}
      >
        <h2 id={contentId("about-skills")}>{t.about.skills}</h2>
        <dl className="os-about-skills">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <dt>{group.label}</dt>
              <dd>
                {group.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className="os-about-section"
        aria-labelledby={contentId("about-education")}
      >
        <h2 id={contentId("about-education")}>{t.about.education}</h2>
        <div className="os-about-education">
          <article>
            <span className="os-support-eyebrow">
              <time dateTime="2024-05">{monthYear("2024-05-01")}</time> –{" "}
              <time dateTime="2027-06">{monthYear("2027-06-01")}</time>
            </span>
            <h3>{t.about.degree_bachelor}</h3>
            <p>
              {t.resume.expected_completion}:{" "}
              <time dateTime="2027-06">{monthYear("2027-06-01")}</time>
            </p>
            <p>{copy.university}</p>
            <p>{t.resume.education_final_session}</p>
            <p>{t.about.degree_bachelor_courses}</p>
          </article>
          <article>
            <span className="os-support-eyebrow">
              <time dateTime="2023-07">{monthYear("2023-07-01")}</time> –{" "}
              <time dateTime="2024-05">{monthYear("2024-05-01")}</time>
            </span>
            <h3>{t.about.degree_diploma}</h3>
            <p>{copy.university}</p>
            <p>{t.about.degree_diploma_desc}</p>
          </article>
        </div>
      </section>
    </div>
  );
}
