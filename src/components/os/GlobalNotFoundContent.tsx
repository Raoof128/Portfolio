"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
} from "react";
import type { Locale } from "@/i18n";
import {
  readAppearance,
  DEFAULT_APPEARANCE,
  subscribeAppearance,
  type Appearance,
} from "./appearance";
import { SignalVortex } from "./SignalVortex";

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
const getServerAppearance = (): Appearance => DEFAULT_APPEARANCE;

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
    <main className="global-not-found win7" lang={locale} dir={copy.dir}>
      <title>{`${copy.title} | Mohammad Raouf Abedini`}</title>
      <SignalVortex />
      {/* A Win7-style error dialog: the 404 code sits in the glass title bar. */}
      <div className="window glass active global-not-found-dialog">
        <div className="title-bar">
          <p className="global-not-found-code" dir="ltr">
            404
          </p>
        </div>
        <div className="window-body has-space">
          <span className="global-not-found-mark" aria-hidden="true">
            {/* The approved mark stays decorative; the heading supplies the page name.
                It is drawn inline with the same geometry as /brand/raouf-mark.svg: an
                <img> cannot inherit currentColor and paints black on the dark tile. */}
            <svg
              className="global-not-found-glyph"
              viewBox="0 0 24 24"
              fill="currentColor"
              focusable="false"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 3.5h8.35c4.48 0 7.15 2.3 7.15 6.05 0 2.63-1.4 4.58-3.82 5.5L20.5 20.5h-4.34l-4.27-5.16H7.5v5.16H4V3.5Z M7.5 6.75v5.3h4.65c2.38 0 3.85-.88 3.85-2.65s-1.47-2.65-3.85-2.65H7.5Z M7.5 14.15l2.75-2.1h1.9l-3.45 3.29H7.5v-1.19Z"
              />
            </svg>
          </span>
          <h1>{copy.title}</h1>
          <p className="global-not-found-description">{copy.description}</p>
          <div className="global-not-found-actions">
            <a className="os-button" href={prefix || "/"}>
              {copy.home}
            </a>
            <a
              className="os-button os-button--secondary"
              href={`${prefix}/projects`}
            >
              {copy.projects}
            </a>
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
          <nav
            className="global-not-found-locales"
            aria-label={copy.languageLabel}
          >
            {supportedLocales.map((language) => (
              <a
                key={language}
                className="os-text-link"
                href={language === "en" ? "/" : `/${language}`}
                hrefLang={language}
                lang={language}
                dir={copies[language].dir}
              >
                {copies[language].languageName}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
