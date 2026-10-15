"use client";

import { useContentId } from "@/components/os/application-context";

import Link from "next/link";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  ShieldCheck,
} from "lucide-react";
import {
  CONTACT_EMAIL_GMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  ORCID_URL,
} from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { getOSCopy } from "@/components/os/os-copy";
import { getPageSupportCopy } from "@/lib/page-support-copy";
import "@/components/os/supporting-apps.css";

export function ContactClient() {
  const { locale, t } = useTranslation();
  const contentId = useContentId();
  const copy = getOSCopy(locale);
  const supportCopy = getPageSupportCopy(locale);
  const securityPath =
    locale === defaultLocale
      ? "/security-policy"
      : `/${locale}/security-policy`;

  return (
    <div className="os-support os-contact">
      <div className="os-contact-intro">
        <span className="os-contact-mark" aria-hidden="true">
          <Mail size={32} strokeWidth={1.3} />
        </span>
        <h1>{copy.contactTitle}</h1>
        <p>{copy.contactDescription}</p>
      </div>

      <div className="os-contact-email">
        <span className="os-support-eyebrow">{t.contact_form.email_label}</span>
        {/* The address is shown as text so there is one mailto action per view. */}
        <p className="os-contact-address" dir="ltr">
          {CONTACT_EMAIL_GMAIL}
        </p>
        <a href={`mailto:${CONTACT_EMAIL_GMAIL}`} className="os-button">
          {copy.openEmail}
          <ArrowUpRight className="os-flip" aria-hidden="true" size={17} />
        </a>
        <p className="os-contact-note">{copy.emailDraftNote}</p>
      </div>

      <section
        className="os-contact-socials"
        aria-labelledby={contentId("contact-elsewhere")}
      >
        <h2 id={contentId("contact-elsewhere")}>{copy.contactElsewhere}</h2>
        <div>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <Github aria-hidden="true" size={20} />
            <span>GitHub</span>
            <span className="sr-only">{supportCopy.opensInNewTab}</span>
            <ArrowUpRight className="os-flip" aria-hidden="true" size={16} />
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <Linkedin aria-hidden="true" size={20} />
            <span>LinkedIn</span>
            <span className="sr-only">{supportCopy.opensInNewTab}</span>
            <ArrowUpRight className="os-flip" aria-hidden="true" size={16} />
          </a>
          <a href={ORCID_URL} target="_blank" rel="noopener noreferrer">
            <span className="os-contact-orcid" aria-hidden="true">
              iD
            </span>
            <span>ORCID</span>
            <span className="sr-only">{supportCopy.opensInNewTab}</span>
            <ArrowUpRight className="os-flip" aria-hidden="true" size={16} />
          </a>
        </div>
      </section>

      <Link href={securityPath} className="os-contact-security">
        <ShieldCheck aria-hidden="true" size={18} />
        {copy.securityPolicy}
        <ArrowUpRight className="os-flip" aria-hidden="true" size={15} />
      </Link>
    </div>
  );
}
