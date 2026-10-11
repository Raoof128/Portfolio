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
    aboutLabTags: {
      "001": ["Purple Team", "Kerberoasting", "DC-Sync"],
      "002": ["SOAR", "KQL", "E8 Maturity"],
      "003": ["LLM", "Jailbreak", "Adversarial"],
      "004": ["Zeek", "Suricata", "Isolation Forest"],
      "005": ["Uplink Jamming", "Spoofing", "Telemetry"],
      "006": ["RE", "YARA", "API Hooking"],
      "007": ["Post-Quantum", "Crypto Inventory"],
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
    aboutLabTags: {
      "001": ["تیم بنفش", "Kerberoasting", "DC-Sync"],
      "002": ["SOAR", "KQL", "بلوغ Essential Eight"],
      "003": ["مدل زبانی بزرگ", "جیلبریک", "آزمون خصمانه"],
      "004": ["Zeek", "Suricata", "جنگل جداسازی"],
      "005": ["اخلال پیوند بالارونده", "جعل هویت", "دور‌سنجی"],
      "006": ["مهندسی معکوس", "YARA", "هوک‌گذاری API"],
      "007": ["رمزنگاری پساکوانتومی", "فهرست دارایی‌های رمزنگاری"],
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
    aboutLabTags: {
      "001": ["الفريق البنفسجي", "Kerberoasting", "DC-Sync"],
      "002": ["SOAR", "KQL", "نضج Essential Eight"],
      "003": ["نماذج اللغة الكبيرة", "تجاوز الحماية", "اختبارات خصومية"],
      "004": ["Zeek", "Suricata", "غابة العزل"],
      "005": ["تشويش الوصلة الصاعدة", "انتحال الهوية", "القياس عن بُعد"],
      "006": ["الهندسة العكسية", "YARA", "خطافات API"],
      "007": ["تشفير ما بعد الكم", "حصر أصول التشفير"],
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
    aboutLabTags: {
      "001": ["紫队", "Kerberoasting", "DC-Sync"],
      "002": ["SOAR", "KQL", "Essential Eight 成熟度"],
      "003": ["大语言模型", "越狱", "对抗测试"],
      "004": ["Zeek", "Suricata", "孤立森林"],
      "005": ["上行链路干扰", "欺骗", "遥测"],
      "006": ["逆向工程", "YARA", "API 钩子"],
      "007": ["后量子密码学", "密码资产清单"],
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
    aboutLabTags: {
      "001": ["Equipo morado", "Kerberoasting", "DC-Sync"],
      "002": ["SOAR", "KQL", "Madurez de Essential Eight"],
      "003": ["Modelos de lenguaje", "Jailbreak", "Pruebas adversariales"],
      "004": ["Zeek", "Suricata", "Bosque de aislamiento"],
      "005": [
        "Interferencia de enlace ascendente",
        "Suplantación",
        "Telemetría",
      ],
      "006": ["Ingeniería inversa", "YARA", "Hooks de API"],
      "007": ["Criptografía poscuántica", "Inventario criptográfico"],
    },
  },
};

export function getPageSupportCopy(locale: Locale): PageSupportCopy {
  return copy[locale];
}
