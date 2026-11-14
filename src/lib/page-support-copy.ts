import type { Locale } from "@/i18n";

interface PageSupportCopy {
  university: string;
  weightedAverage: string;
  coFounderSociety: string;
  present: string;
  education: string;
  originalEnglishPDF: string;
  officialCertificateNames: string;
  sourceCode: string;
  opensInNewTab: string;
}

const copy: Record<Locale, PageSupportCopy> = {
  en: {
    university: "Macquarie University",
    weightedAverage: "Weighted average mark (WAM)",
    coFounderSociety: "Co-Founder · Macquarie Persian Students Society",
    present: "Present",
    education: "Education",
    originalEnglishPDF: "Original résumé · English PDF",
    officialCertificateNames:
      "Certificate titles are shown in their original English for verification.",
    sourceCode: "Source code · original language",
    opensInNewTab: "(opens in a new tab)",
  },
  fa: {
    university: "دانشگاه مک‌کواری",
    weightedAverage: "میانگین وزنی نمرات (WAM)",
    coFounderSociety: "هم‌بنیان‌گذار · انجمن دانشجویان ایرانی مک‌کواری",
    present: "اکنون",
    education: "آموزش",
    originalEnglishPDF: "رزومه اصلی · فایل PDF انگلیسی",
    officialCertificateNames:
      "عنوان گواهی‌ها برای امکان راستی‌آزمایی به زبان اصلی انگلیسی نمایش داده می‌شود.",
    sourceCode: "کد منبع · زبان اصلی",
    opensInNewTab: "(در زبانهٔ جدید باز می‌شود)",
  },
  ar: {
    university: "جامعة ماكواري",
    weightedAverage: "المعدل الموزون للدرجات (WAM)",
    coFounderSociety: "شريك مؤسس · جمعية الطلاب الفارسيين في ماكواري",
    present: "الآن",
    education: "التعليم",
    originalEnglishPDF: "السيرة الأصلية · ملف PDF بالإنجليزية",
    officialCertificateNames:
      "تُعرض عناوين الشهادات بلغتها الإنجليزية الأصلية لتسهيل التحقق منها.",
    sourceCode: "الكود المصدري · اللغة الأصلية",
    opensInNewTab: "(يُفتح في تبويب جديد)",
  },
  zh: {
    university: "麦考瑞大学",
    weightedAverage: "加权平均成绩（WAM）",
    coFounderSociety: "联合创始人 · 麦考瑞波斯学生社团",
    present: "至今",
    education: "教育",
    originalEnglishPDF: "原始简历 · 英文 PDF",
    officialCertificateNames: "证书名称保留原始英文，便于核验。",
    sourceCode: "源代码 · 原始语言",
    opensInNewTab: "（在新标签页中打开）",
  },
  es: {
    university: "Universidad Macquarie",
    weightedAverage: "Nota media ponderada (WAM)",
    coFounderSociety:
      "Cofundador · Sociedad de Estudiantes Persas de Macquarie",
    present: "Actualidad",
    education: "Educación",
    originalEnglishPDF: "Currículum original · PDF en inglés",
    officialCertificateNames:
      "Los títulos de los certificados conservan el inglés original para facilitar su verificación.",
    sourceCode: "Código fuente · idioma original",
    opensInNewTab: "(se abre en una pestaña nueva)",
  },
};

export function getPageSupportCopy(locale: Locale): PageSupportCopy {
  return copy[locale];
}
