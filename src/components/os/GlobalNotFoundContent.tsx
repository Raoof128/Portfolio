"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
} from "react";
import Image from "next/image";
import type { Locale } from "@/i18n";
import {
  readAppearance,
  subscribeAppearance,
  type Appearance,
} from "./appearance";

export interface NotFoundCopy {
  title: string;
  description: string;
  home: string;
  projects: string;
  languageLabel: string;
  languageName: string;
  dir: "ltr" | "rtl";
}

const supportedLocales: Locale[] = ["en", "fa", "ar", "zh", "es"];

export function notFoundLocale(pathname: string): Locale {
  const firstSegment = pathname.split("/")[1];
  return supportedLocales.includes(firstSegment as Locale)
    ? (firstSegment as Locale)
    : "en";
}

function subscribeToPath(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

const getPathLocale = () => notFoundLocale(window.location.pathname);
const getServerLocale = (): Locale => "en";
const getServerAppearance = (): Appearance => "dark";

export function GlobalNotFoundContent({
  copies,
}: {
  copies: Record<Locale, NotFoundCopy>;
}) {
  // Static hosting supplies the same 404 document for every unmatched URL.
  // English remains a usable server/no-script fallback; hydration selects the path locale.
  const pathLocale = useSyncExternalStore(
    subscribeToPath,
    getPathLocale,
    getServerLocale,
  );
  const appearance = useSyncExternalStore(
    subscribeAppearance,
    readAppearance,
    getServerAppearance,
  );
  const [selectedLocale, setLocale] = useState<Locale | null>(null);
  const locale = selectedLocale ?? pathLocale;

  const copy = copies[locale];
  const prefix = locale === "en" ? "" : `/${locale}`;

  useEffect(() => {
    const html = document.documentElement;
    const previous = {
      lang: html.lang,
      dir: html.dir,
      appearance: html.getAttribute("data-appearance"),
    };
    html.lang = locale;
    html.dir = copy.dir;
    html.setAttribute("data-appearance", appearance);
    return () => {
      html.lang = previous.lang;
      html.dir = previous.dir;
      if (previous.appearance === null) html.removeAttribute("data-appearance");
      else html.setAttribute("data-appearance", previous.appearance);
    };
  }, [locale, copy, appearance]);

  const changeLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    const selected = event.currentTarget.value;
    if (supportedLocales.includes(selected as Locale))
      setLocale(selected as Locale);
  };

  return (
    <main className="global-not-found" lang={locale} dir={copy.dir}>
      <title>{`${copy.title} | Mohammad Raouf Abedini`}</title>
      <span className="global-not-found-mark" aria-hidden="true">
        {/* The approved mark remains decorative; the heading supplies the page name. */}
        <Image src="/brand/raouf-mark.svg" width={36} height={36} alt="" />
      </span>
      <p className="global-not-found-code" dir="ltr">
        404
      </p>
      <h1>{copy.title}</h1>
      <p className="global-not-found-description">{copy.description}</p>
      <div className="global-not-found-actions">
        <a href={prefix || "/"}>{copy.home}</a>
        <a href={`${prefix}/projects`}>{copy.projects}</a>
      </div>
      <div className="global-not-found-language">
        <label htmlFor="not-found-language">{copy.languageLabel}</label>
        <select
          id="not-found-language"
          value={locale}
          onChange={changeLanguage}
        >
          {supportedLocales.map((language) => (
            <option
              key={language}
              value={language}
              lang={language}
              dir={copies[language].dir}
            >
              {copies[language].languageName}
            </option>
          ))}
        </select>
      </div>
      {/* Ordinary localized home links provide recovery even without JavaScript. */}
      <nav className="global-not-found-locales" aria-label={copy.languageLabel}>
        {supportedLocales.map((language) => (
          <a
            key={language}
            href={language === "en" ? "/" : `/${language}`}
            hrefLang={language}
            lang={language}
            dir={copies[language].dir}
          >
            {copies[language].languageName}
          </a>
        ))}
      </nav>
    </main>
  );
}
