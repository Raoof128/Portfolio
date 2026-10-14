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
  aboutLabTags: Record<string, string[]>;
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
    aboutLabTags: {
      "OPS-01": ["Purple Team", "Kerberoasting", "DC-Sync"],
      "OPS-02": ["SOAR", "KQL", "E8 Maturity"],
      "OPS-03": ["LLM", "Jailbreak", "Adversarial"],
      "OPS-04": ["Zeek", "Suricata", "Isolation Forest"],
      "OPS-05": ["Uplink Jamming", "Spoofing", "Telemetry"],
      "OPS-06": ["RE", "YARA", "API Hooking"],
      "OPS-07": ["Post-Quantum", "Crypto Inventory"],
    },
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
    aboutLabTags: {
      "OPS-01": ["تیم بنفش", "Kerberoasting", "DC-Sync"],
      "OPS-02": ["SOAR", "KQL", "بلوغ Essential Eight"],
      "OPS-03": ["مدل زبانی بزرگ", "جیلبریک", "آزمون خصمانه"],
      "OPS-04": ["Zeek", "Suricata", "جنگل جداسازی"],
      "OPS-05": ["اخلال پیوند بالارونده", "جعل هویت", "دور‌سنجی"],
      "OPS-06": ["مهندسی معکوس", "YARA", "هوک‌گذاری API"],
      "OPS-07": ["رمزنگاری پساکوانتومی", "فهرست دارایی‌های رمزنگاری"],
    },
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
    aboutLabTags: {
      "OPS-01": ["الفريق البنفسجي", "Kerberoasting", "DC-Sync"],
      "OPS-02": ["SOAR", "KQL", "نضج Essential Eight"],
      "OPS-03": ["نماذج اللغة الكبيرة", "تجاوز الحماية", "اختبارات خصومية"],
      "OPS-04": ["Zeek", "Suricata", "غابة العزل"],
      "OPS-05": ["تشويش الوصلة الصاعدة", "انتحال الهوية", "القياس عن بُعد"],
      "OPS-06": ["الهندسة العكسية", "YARA", "خطافات API"],
      "OPS-07": ["تشفير ما بعد الكم", "حصر أصول التشفير"],
    },
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
    aboutLabTags: {
      "OPS-01": ["紫队", "Kerberoasting", "DC-Sync"],
      "OPS-02": ["SOAR", "KQL", "Essential Eight 成熟度"],
      "OPS-03": ["大语言模型", "越狱", "对抗测试"],
      "OPS-04": ["Zeek", "Suricata", "孤立森林"],
      "OPS-05": ["上行链路干扰", "欺骗", "遥测"],
      "OPS-06": ["逆向工程", "YARA", "API 钩子"],
      "OPS-07": ["后量子密码学", "密码资产清单"],
    },
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
    aboutLabTags: {
      "OPS-01": ["Equipo morado", "Kerberoasting", "DC-Sync"],
      "OPS-02": ["SOAR", "KQL", "Madurez de Essential Eight"],
      "OPS-03": ["Modelos de lenguaje", "Jailbreak", "Pruebas adversariales"],
      "OPS-04": ["Zeek", "Suricata", "Bosque de aislamiento"],
      "OPS-05": [
        "Interferencia de enlace ascendente",
        "Suplantación",
        "Telemetría",
      ],
      "OPS-06": ["Ingeniería inversa", "YARA", "Hooks de API"],
      "OPS-07": ["Criptografía poscuántica", "Inventario criptográfico"],
    },
  },
};

export function getPageSupportCopy(locale: Locale): PageSupportCopy {
  return copy[locale];
}
