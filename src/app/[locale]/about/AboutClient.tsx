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
  Cloud,
  Brain,
  FileCode2,
  Fingerprint,
  ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { formatDate, formatNumber } from "@/i18n/format";
import { getPageSupportCopy } from "@/lib/page-support-copy";
import "@/components/os/supporting-apps.css";

const PROFILE_PHOTO_SOURCES = [
  `${BASE_PATH}/Raouf_2.jpg`,
  `${BASE_PATH}/Raouf_2.png`,
] as const;

export function AboutClient() {
  const { locale, t } = useTranslation();
  const contentId = useContentId();
  const copy = getPageSupportCopy(locale);
  const [photoSourceIndex, setPhotoSourceIndex] = useState(0);
  const [photoLoadFailed, setPhotoLoadFailed] = useState(false);
  const photoSource = PROFILE_PHOTO_SOURCES[photoSourceIndex];

  const specializations = [
    {
      icon: Shield,
      label: t.about.spec1_label,
      items: [
        t.about.spec1_item1,
        t.about.spec1_item2,
        t.about.spec1_item3,
        t.about.spec1_item4,
        t.about.spec1_item5,
      ],
    },
    {
      icon: Brain,
      label: t.about.spec2_label,
      items: [
        t.about.spec2_item1,
        t.about.spec2_item2,
        t.about.spec2_item3,
        t.about.spec2_item4,
        t.about.spec2_item5,
      ],
    },
    {
      icon: Cloud,
      label: t.about.spec3_label,
      items: [
        t.about.spec3_item1,
        t.about.spec3_item2,
        t.about.spec3_item3,
        t.about.spec3_item4,
        t.about.spec3_item5,
      ],
    },
    {
      icon: FileCode2,
      label: t.about.spec4_label,
      items: [
        t.about.spec4_item1,
        t.about.spec4_item2,
        t.about.spec4_item3,
        t.about.spec4_item4,
        t.about.spec4_item5,
      ],
    },
  ];

  const skillGroups = [
    {
      label: t.about.skill_group1_label,
      skills: [
        t.about.skill_group1_1,
        t.about.skill_group1_2,
        t.about.skill_group1_3,
        t.about.skill_group1_4,
        t.about.skill_group1_5,
        t.about.skill_group1_6,
        t.about.skill_group1_7,
        t.about.skill_group1_8,
        t.about.skill_group1_9,
        t.about.skill_group1_10,
      ],
    },
    {
      label: t.about.skill_group2_label,
      skills: [
        t.about.skill_group2_1,
        t.about.skill_group2_2,
        t.about.skill_group2_3,
        t.about.skill_group2_4,
        t.about.skill_group2_5,
        t.about.skill_group2_6,
        t.about.skill_group2_7,
        t.about.skill_group2_8,
        t.about.skill_group2_9,
      ],
    },
    {
      label: t.about.skill_group3_label,
      skills: [
        t.about.skill_group3_1,
        t.about.skill_group3_2,
        t.about.skill_group3_3,
        t.about.skill_group3_4,
        t.about.skill_group3_5,
        t.about.skill_group3_6,
      ],
    },
    {
      label: t.about.skill_group4_label,
      skills: [
        t.about.skill_group4_1,
        t.about.skill_group4_2,
        t.about.skill_group4_3,
        t.about.skill_group4_4,
        t.about.skill_group4_5,
        t.about.skill_group4_6,
        t.about.skill_group4_7,
        t.about.skill_group4_8,
        t.about.skill_group4_9,
      ],
    },
    {
      label: t.about.skill_group5_label,
      skills: [
        t.about.skill_group5_1,
        t.about.skill_group5_2,
        t.about.skill_group5_3,
        t.about.skill_group5_4,
      ],
    },
  ];

  const statusLabel = (status: string) =>
    status === "ACTIVE"
      ? t.about.status_active
      : status === "ARCHIVED"
        ? t.about.status_archived
        : t.about.status_concept;

  // "OPS-" prefix keeps these work-stream labels distinct from the real
  // /lab/001... experiment IDs, which they previously appeared to reference.
  const activeLabs = [
    { id: "OPS-01", status: "ACTIVE", title: t.about.ops_lab1_title },
    { id: "OPS-02", status: "ACTIVE", title: t.about.ops_lab2_title },
    { id: "OPS-03", status: "ACTIVE", title: t.about.ops_lab3_title },
    { id: "OPS-04", status: "ACTIVE", title: t.about.ops_lab4_title },
    { id: "OPS-05", status: "ARCHIVED", title: t.about.ops_lab5_title },
    { id: "OPS-06", status: "ARCHIVED", title: t.about.ops_lab6_title },
    { id: "OPS-07", status: "CONCEPT", title: t.about.ops_lab7_title },
  ].map((lab) => ({ ...lab, tags: copy.aboutLabTags[lab.id] }));

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
    <div className="os-about">
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
            <Link href={getPath("/contact")} className="os-support-primary">
              {t.about.connect}
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
            <Link href={getPath("/resume")} className="os-support-link">
              {t.about.view_resume}
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
        <aside className="os-about-identity">
          <div className="os-about-photo">
            {!photoLoadFailed ? (
              <Image
                key={photoSource}
                src={photoSource}
                alt="Mohammad Raouf Abedini"
                fill
                sizes="(max-width: 700px) 240px, 300px"
                unoptimized
                priority
                className="os-about-photo-image"
                onError={handlePhotoError}
              />
            ) : (
              <div className="os-about-photo-fallback">
                <strong>MRA</strong>
                <p>{t.about.photo_unavailable}</p>
                <button
                  type="button"
                  className="os-support-link"
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
              <ArrowUpRight aria-hidden="true" size={14} />
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <Linkedin aria-hidden="true" size={17} />
              <span>LinkedIn</span>
              <ArrowUpRight aria-hidden="true" size={14} />
            </a>
            <a href={ORCID_URL} target="_blank" rel="noopener noreferrer">
              <Fingerprint aria-hidden="true" size={17} />
              <span>ORCID</span>
              <ArrowUpRight aria-hidden="true" size={14} />
            </a>
            <a href={`mailto:${CONTACT_EMAIL_GMAIL}`}>
              <Mail aria-hidden="true" size={17} />
              <span dir="ltr">{CONTACT_EMAIL_GMAIL}</span>
              <ArrowUpRight aria-hidden="true" size={14} />
            </a>
          </div>
        </aside>
      </section>

      <dl className="os-about-stats">
        {[
          { value: "70+", label: t.about.stats_projects },
          { value: "100%", label: t.about.stats_evasion },
          { value: "3+2", label: t.about.stats_vendors },
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
        aria-labelledby={contentId("about-operations")}
      >
        <div className="os-support-section-heading">
          <h2 id={contentId("about-operations")}>
            {t.about.active_operations}
          </h2>
          <Link href={getPath("/lab")} className="os-support-link">
            {t.lab.enter_lab}
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="os-about-labs">
          {activeLabs.map((lab) => (
            <article key={lab.id}>
              <span className="os-about-lab-id" dir="ltr">
                {lab.id}
              </span>
              <div>
                <h3>{lab.title}</h3>
                <p>{lab.tags.join(" · ")}</p>
              </div>
              <span className="os-about-status" data-status={lab.status}>
                {statusLabel(lab.status)}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="os-about-section"
        aria-labelledby={contentId("about-education")}
      >
        <h2 id={contentId("about-education")}>{t.about.education}</h2>
        <div className="os-about-education">
          <article>
            <span className="os-support-eyebrow" dir="ltr">
              {formatNumber(2024, locale, { useGrouping: false })}–
              {formatNumber(2026, locale, { useGrouping: false })}
            </span>
            <h3>{t.about.degree_bachelor}</h3>
            <p>
              {t.resume.expected_completion}:{" "}
              <time dateTime="2026-11">
                {formatDate("2026-11-01", locale, {
                  month: "long",
                  year: "numeric",
                  calendar: "gregory",
                })}
              </time>
            </p>
            <p>
              {copy.university} · {copy.weightedAverage}{" "}
              <bdi>
                {formatNumber(76.27, locale, { minimumFractionDigits: 2 })}
              </bdi>
            </p>
            <p>{t.about.degree_bachelor_courses}</p>
          </article>
          <article>
            <span className="os-support-eyebrow" dir="ltr">
              {formatNumber(2023, locale, { useGrouping: false })}–
              {formatNumber(2024, locale, { useGrouping: false })}
            </span>
            <h3>{t.about.degree_diploma}</h3>
            <p>
              {copy.university} · {copy.weightedAverage}{" "}
              <bdi>
                {formatNumber(71.75, locale, { minimumFractionDigits: 2 })}
              </bdi>
            </p>
            <p>{t.about.degree_diploma_desc}</p>
          </article>
        </div>
      </section>
    </div>
  );
}
