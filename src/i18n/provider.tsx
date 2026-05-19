"use client";

import { createContext, useContext, ReactNode } from "react";
import { Locale } from "./index";
import { Dictionary } from "./locales/en";

const i18nContext = createContext<{
  locale: Locale;
  t: Dictionary;
} | null>(null);

export function I18nProvider({
  children,
  locale,
  dictionary,
}: {
  children: ReactNode;
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <i18nContext.Provider value={{ locale, t: dictionary }}>
      {children}
    </i18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(i18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
