"use client";

import { FolderOpen, Home } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";

export default function NotFound() {
  const { locale, t } = useTranslation();

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path === "/" ? "" : path}`;
  };

  return (
    <section className="os-not-found" aria-labelledby="os-not-found-title">
      <p className="os-not-found-code" dir="ltr">
        404
      </p>
      <h1 id="os-not-found-title">{t.not_found.error_code}</h1>
      <p>{t.not_found.description}</p>
      <div className="os-not-found-actions">
        <Link className="os-button" href={getPath("/")}>
          <Home aria-hidden="true" />
          {t.not_found.return_home}
        </Link>
        <Link className="os-button" href={getPath("/projects")}>
          <FolderOpen aria-hidden="true" />
          {t.not_found.browse_projects}
        </Link>
      </div>
    </section>
  );
}
