import type { Locale } from "@/i18n";

const journeyCopy: Record<Locale, { explore: string; review: string }> = {
  en: { explore: "Explore the lab", review: "Review my research" },
  fa: { explore: "کاوش در آزمایشگاه", review: "مرور پژوهش‌ها" },
  ar: { explore: "استكشف المختبر", review: "راجع أبحاثي" },
  es: {
    explore: "Explorar el laboratorio",
    review: "Revisar mi investigación",
  },
  zh: { explore: "探索实验室", review: "查看我的研究" },
};

export function getAtlasJourneyCopy(locale: Locale) {
  return journeyCopy[locale];
}
