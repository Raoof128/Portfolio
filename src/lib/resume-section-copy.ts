import type { Locale } from "@/i18n";

export type ResumeSection = "skills" | "experience" | "certifications";

// Compact search labels mirror the existing résumé headings. Keep the complete
// locale dictionaries on their current server boundary rather than importing
// them into the search index; a parity regression prevents wording drift.
const labels = {
  en: {
    skills: "Research & Technical Skills",
    experience: "Professional Experience",
    certifications: "Certifications & Credentials",
  },
  fa: {
    skills: "مهارت‌های پژوهشی و فنی",
    experience: "سوابق حرفه‌ای",
    certifications: "گواهی‌نامه‌ها و مدارک",
  },
  ar: {
    skills: "المهارات البحثية والتقنية",
    experience: "الخبرة المهنية",
    certifications: "الشهادات والمؤهلات",
  },
  zh: {
    skills: "研究与技术技能",
    experience: "职业经历",
    certifications: "证书与资质",
  },
  es: {
    skills: "Habilidades de investigación y técnicas",
    experience: "Experiencia profesional",
    certifications: "Certificaciones y credenciales",
  },
} satisfies Record<Locale, Record<ResumeSection, string>>;

export function getResumeSectionCopy(locale: Locale) {
  return labels[locale];
}
