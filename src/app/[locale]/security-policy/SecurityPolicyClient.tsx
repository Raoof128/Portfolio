"use client";

import { Check, AlertTriangle, Clock, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import "@/components/os/supporting-apps.css";

export function SecurityPolicyClient() {
  const { locale, t } = useTranslation();
  const reportLink = `mailto:${CONTACT_EMAIL}`;

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  return (
    <div className="os-support os-policy">
      <div className="os-page-intro">
        <span className="os-eyebrow-row">
          <Shield aria-hidden="true" size={16} />
          {t.security_policy.subtitle}
        </span>
        <h1>{t.security_policy.title}</h1>
        <p className="os-prose">{t.security_policy.description}</p>
      </div>

      <div className="os-callout os-report">
        <div>
          <h2>
            <Mail aria-hidden="true" size={20} />
            {t.security_policy.report_heading}
          </h2>
          <p>
            {t.security_policy.report_intro}{" "}
            <a href={reportLink} className="os-text-link">
              <bdi dir="ltr">{CONTACT_EMAIL}</bdi>
            </a>
          </p>
        </div>
        <a href={reportLink} className="os-button">
          <Mail aria-hidden="true" size={16} />
          {t.security_policy.send_report}
        </a>
      </div>

      <section className="os-policy-section">
        <h2>{t.security_policy.scope_title}</h2>
        <div className="os-callout">
          <p className="os-prose">{t.security_policy.scope_desc}</p>
          <ul className="os-check-list">
            <li>
              <Check aria-hidden="true" size={16} />
              <span>
                <code dir="ltr">raoufabedini.dev</code> —{" "}
                {t.security_policy.scope_site}
              </span>
            </li>
            <li>
              <Check aria-hidden="true" size={16} />
              <span>
                {t.security_policy.scope_repos}{" "}
                <code dir="ltr">github.com/Raoof128</code>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="os-policy-section">
        <h2>{t.security_policy.what_title}</h2>
        <div className="os-policy-grid">
          <div className="os-callout">
            <h3>
              <Check aria-hidden="true" size={18} />
              {t.security_policy.in_scope}
            </h3>
            <ul className="os-bullet-list">
              {[
                t.security_policy.in_1,
                t.security_policy.in_2,
                t.security_policy.in_3,
                t.security_policy.in_4,
                t.security_policy.in_5,
                t.security_policy.in_6,
              ].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="os-callout">
            <h3>
              <AlertTriangle aria-hidden="true" size={18} />
              {t.security_policy.out_of_scope}
            </h3>
            <ul className="os-bullet-list">
              {[
                t.security_policy.out_1,
                t.security_policy.out_2,
                t.security_policy.out_3,
                t.security_policy.out_4,
                t.security_policy.out_5,
                t.security_policy.out_6,
              ].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="os-policy-section">
        <h2>{t.security_policy.timeline_title}</h2>
        <div className="os-callout">
          <ol className="os-timeline">
            {[
              {
                icon: Clock,
                heading: t.security_policy.t1_heading,
                desc: t.security_policy.t1_desc,
              },
              {
                icon: Shield,
                heading: t.security_policy.t2_heading,
                desc: t.security_policy.t2_desc,
              },
              {
                icon: Check,
                heading: t.security_policy.t3_heading,
                desc: t.security_policy.t3_desc,
              },
            ].map(({ icon: Icon, heading, desc }, i) => (
              <li key={i}>
                <span className="os-timeline-icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <div>
                  <h3>{heading}</h3>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="os-policy-section">
        <h2>{t.security_policy.guidelines_title}</h2>
        <div className="os-callout">
          <ol className="os-numbered-list">
            {[
              t.security_policy.g1,
              t.security_policy.g2,
              t.security_policy.g3,
              t.security_policy.g4,
              t.security_policy.g5,
            ].map((guideline, i) => (
              <li key={i}>{guideline}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="os-policy-section">
        <h2>{t.security_policy.ack_title}</h2>
        <div className="os-callout">
          <p className="os-prose">
            {t.security_policy.ack_desc}{" "}
            <Link href={getPath("/hall-of-fame")} className="os-text-link">
              {t.security_policy.ack_hall_of_fame}
            </Link>
            {t.security_policy.ack_desc_suffix}
          </p>
          <p className="os-support-note">{t.security_policy.ack_note}</p>
        </div>
      </section>
    </div>
  );
}
