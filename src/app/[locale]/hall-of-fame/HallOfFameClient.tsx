"use client";

import { Trophy, Shield, Mail, Users } from "lucide-react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import "@/components/os/supporting-apps.css";

export function HallOfFameClient() {
  const { locale, t } = useTranslation();

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  return (
    <div className="os-support os-hall">
      <div className="os-page-intro">
        <span className="os-eyebrow-row">
          <Trophy aria-hidden="true" size={16} />
          {t.hall_of_fame.subtitle}
        </span>
        <h1>{t.hall_of_fame.title}</h1>
        <p className="os-prose">{t.hall_of_fame.description}</p>
      </div>

      <div className="os-callout os-report">
        <div>
          <h2>
            <Shield aria-hidden="true" size={20} />
            <span>{t.hall_of_fame.found_vuln_heading}</span>
          </h2>
          <p>
            {t.hall_of_fame.report_guidance}{" "}
            <Link href={getPath("/security-policy")} className="os-text-link">
              {t.hall_of_fame.security_policy_link}
            </Link>{" "}
            {t.hall_of_fame.report_guidance_suffix}
          </p>
        </div>
        <a href={`mailto:${CONTACT_EMAIL}`} className="os-button">
          <Mail aria-hidden="true" size={16} />
          {t.hall_of_fame.report_btn}
        </a>
      </div>

      <section className="os-policy-section">
        {/* Empty state: the honest copy is kept, with a status dot and text. */}
        <div className="os-callout os-empty-state">
          <span className="os-empty-icon" aria-hidden="true">
            <Users size={24} />
          </span>
          <div>
            <h2>{t.hall_of_fame.no_entries_title}</h2>
            <p>{t.hall_of_fame.no_entries_desc}</p>
          </div>
          <span className="os-status" data-state="inactive">
            {t.hall_of_fame.awaiting_badge}
          </span>
        </div>
      </section>

      <section className="os-policy-section">
        <h2>{t.hall_of_fame.criteria_title}</h2>
        <div className="os-callout">
          <ol className="os-numbered-list">
            {[
              t.hall_of_fame.criteria_1,
              t.hall_of_fame.criteria_2,
              t.hall_of_fame.criteria_3,
              t.hall_of_fame.criteria_4,
            ].map((criterion, i) => (
              <li key={i}>{criterion}</li>
            ))}
          </ol>
        </div>
      </section>

      <div className="os-callout os-policy-note">
        <p className="os-support-note">
          <strong>{t.hall_of_fame.note_label}</strong>{" "}
          {t.hall_of_fame.bounty_note}
        </p>
      </div>
    </div>
  );
}
