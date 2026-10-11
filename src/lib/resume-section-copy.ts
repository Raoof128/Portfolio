import type { Locale } from "@/i18n";

export type ResumeSection = "skills" | "experience" | "certifications";

// Compact search labels mirror the existing résumé headings. Keep the complete
// locale dictionaries on their current server boundary rather than importing
// them into the search index; a parity regression prevents wording drift.
const labels = {
  en: {
    skills: "Technical Proficiencies",
    experience: "Professional Experience",
    certifications: "Licences & Certifications",
  },
  fa: {
    skills: "توانمندی‌های فنی",
    experience: "سوابق حرفه‌ای",
    certifications: "مجوزها و گواهی‌نامه‌ها",
  },
  ar: {
    skills: "الكفاءات التقنية",
    experience: "الخبرة المهنية",
    certifications: "التراخيص والشهادات",
  },
  zh: {
    skills: "技术能力",
    experience: "职业经历",
    certifications: "许可证与认证",
  },
  es: {
    skills: "Competencias técnicas",
    experience: "Experiencia profesional",
    certifications: "Licencias y certificaciones",
  },
} satisfies Record<Locale, Record<ResumeSection, string>>;

export function getResumeSectionCopy(locale: Locale) {
  return labels[locale];
}
