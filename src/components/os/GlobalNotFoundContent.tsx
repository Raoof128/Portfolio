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
      {/* A Win7 message box: the error icon, the message and the buttons share one dialog,
          and the 404 code sits in the glass title bar. The icon is decorative. */}
      <div className="window glass active global-not-found-dialog">
        <div className="title-bar">
          <p className="global-not-found-code" dir="ltr">
            404
          </p>
        </div>
        <div className="window-body has-space">
          <div className="global-not-found-message">
            <span className="global-not-found-mark" aria-hidden="true">
              <svg
                className="global-not-found-glyph"
                viewBox="0 0 24 24"
                fill="currentColor"
                focusable="false"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="11" />
                <path
                  className="global-not-found-cross"
                  d="M8.1 6.7 12 10.6l3.9-3.9 1.4 1.4-3.9 3.9 3.9 3.9-1.4 1.4-3.9-3.9-3.9 3.9-1.4-1.4 3.9-3.9-3.9-3.9z"
                />
              </svg>
            </span>
            <div className="global-not-found-text">
              <h1>{copy.title}</h1>
              <p className="global-not-found-description">{copy.description}</p>
            </div>
          </div>
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
