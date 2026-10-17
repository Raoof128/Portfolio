import type { Metadata } from "next";
import { getDictionary, locales, type Locale } from "@/i18n";
import { getOSCopy } from "@/components/os/os-copy";
import {
  GlobalNotFoundContent,
  type NotFoundCopy,
} from "@/components/os/GlobalNotFoundContent";
import "@/components/os/controls.css";
import "@/components/os/research-os.css";
import "7.css/dist/7.scoped.css";
import "@/components/os/win7-theme.css";
import "./global-not-found.css";

export const metadata: Metadata = {
  description:
    "This page could not be found. Return home or browse the research projects.",
  robots: { index: false, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default async function GlobalNotFound() {
  // Pick only recovery copy on the server, rather than shipping five full dictionaries.
  const entries = await Promise.all(
    (Object.keys(locales) as Locale[]).map(async (locale) => {
      const dictionary = await getDictionary(locale);
      const prefix = locale === "en" ? "" : `/${locale}`;
      const copy: NotFoundCopy = {
        title: dictionary.not_found.error_code,
        description: dictionary.not_found.description,
        home: dictionary.not_found.return_home,
        projects: dictionary.not_found.browse_projects,
        languageLabel: getOSCopy(locale).selectLanguage,
        languageName: locales[locale].label,
        dir: locales[locale].dir,
        // The 404 sits outside the desktop shell, so the main sections are offered here.
        sections: [
          { label: dictionary.nav.projects, href: `${prefix}/projects` },
          { label: dictionary.nav.lab, href: `${prefix}/lab` },
          { label: dictionary.nav.resume, href: `${prefix}/resume` },
          { label: dictionary.nav.contact, href: `${prefix}/contact` },
        ],
      };
      return [locale, copy] as const;
    }),
  );
  const copies = Object.fromEntries(entries) as Record<Locale, NotFoundCopy>;

  // Global 404s bypass the dynamic locale layout and require their own complete document.
  return (
    <html lang="en" dir="ltr" className="os-shell" data-global-not-found="true">
      <body>
        <GlobalNotFoundContent copies={copies} />
      </body>
    </html>
  );
}
