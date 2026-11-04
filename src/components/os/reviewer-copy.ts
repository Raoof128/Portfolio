import type { Locale } from "@/i18n";

const copy: Record<Locale, { highlights: string; explore: string }> = {
  en: { highlights: "Research Highlights", explore: "Explore Research" },
  fa: { highlights: "برگزیده‌های پژوهش", explore: "کاوش در پژوهش‌ها" },
  ar: { highlights: "أبرز الأبحاث", explore: "استكشف الأبحاث" },
  es: {
    highlights: "Investigación destacada",
    explore: "Explorar investigación",
  },
  zh: { highlights: "研究亮点", explore: "探索研究" },
};

export function getReviewerCopy(locale: Locale) {
  return copy[locale];
}
