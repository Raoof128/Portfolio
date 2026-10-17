"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { SignalVortex } from "@/components/os/SignalVortex";

export default function NotFound() {
  const { locale, t } = useTranslation();

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path === "/" ? "" : path}`;
  };

  // A Win7 message box inside the shell: the 404 code sits in the glass title bar, the
  // error icon and the message share the body, and the default button comes first.
  return (
    <section
      className="os-not-found window glass active"
      aria-labelledby="os-not-found-title"
    >
      <div className="title-bar">
        <p className="os-not-found-code" dir="ltr">
          404
        </p>
      </div>
      <div className="window-body has-space">
        <SignalVortex />
        <div className="os-not-found-message">
          <span className="os-not-found-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
              <circle cx="12" cy="12" r="11" />
              <path
                className="os-not-found-cross"
                d="M8.1 6.7 12 10.6l3.9-3.9 1.4 1.4-3.9 3.9 3.9 3.9-1.4 1.4-3.9-3.9-3.9 3.9-1.4-1.4 3.9-3.9-3.9-3.9z"
              />
            </svg>
          </span>
          <div className="os-not-found-text">
            <h1 id="os-not-found-title">{t.not_found.error_code}</h1>
            <p>{t.not_found.description}</p>
          </div>
        </div>
        <div className="os-not-found-actions">
          <Link className="os-button" href={getPath("/")}>
            {t.not_found.return_home}
          </Link>
          <Link
            className="os-button os-button--secondary"
            href={getPath("/projects")}
          >
            {t.not_found.browse_projects}
          </Link>
        </div>
        {/* Section links, so recovery does not depend on the taskbar or the desktop icons. */}
        <nav className="os-not-found-sections">
          {[
            { label: t.nav.projects, href: getPath("/projects") },
            { label: t.nav.lab, href: getPath("/lab") },
            { label: t.nav.resume, href: getPath("/resume") },
            { label: t.nav.contact, href: getPath("/contact") },
          ].map((section) => (
            <Link
              key={section.href}
              className="os-text-link"
              href={section.href}
            >
              {section.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
