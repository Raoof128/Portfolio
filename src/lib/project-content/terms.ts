import type { Locale } from "@/i18n";

type Translation = Record<Exclude<Locale, "en">, string>;

/** Translate concepts; product names, API identifiers and licences stay exact. */
export const projectTerms: Record<string, Translation> = {
  "Security Research": {
    fa: "پژوهش امنیت",
    ar: "أبحاث أمنية",
    zh: "安全研究",
    es: "Investigación de seguridad",
  },
  "Responsible Disclosure": {
    fa: "افشای مسئولانه",
    ar: "إفصاح مسؤول",
    zh: "负责任披露",
    es: "Divulgación responsable",
  },
  PoC: {
    fa: "اثبات مفهوم",
    ar: "إثبات مفهوم",
    zh: "概念验证",
    es: "Prueba de concepto",
  },
  "Containment Attestation": {
    fa: "گواهی مهار",
    ar: "إثبات الاحتواء",
    zh: "遏制证明",
    es: "Atestación de contención",
  },
  "Agentic AI Safety": {
    fa: "ایمنی عامل‌های هوش مصنوعی",
    ar: "سلامة وكلاء الذكاء الاصطناعي",
    zh: "智能体 AI 安全",
    es: "Seguridad de agentes de IA",
  },
  "Prompt-Injection": {
    fa: "تزریق دستور",
    ar: "حقن التعليمات",
    zh: "提示注入",
    es: "Inyección de instrucciones",
  },
  "LLM Red-Teaming": {
    fa: "آزمون هجومی LLM",
    ar: "اختبارات هجومية للـLLM",
    zh: "LLM 红队测试",
    es: "Pruebas adversariales de LLM",
  },
  "Knowledge Graph": {
    fa: "گراف دانش",
    ar: "شبكة المعرفة",
    zh: "知识图谱",
    es: "Grafo de conocimiento",
  },
  "Local-first": {
    fa: "محلی‌محور",
    ar: "محلي أولًا",
    zh: "本地优先",
    es: "Prioridad local",
  },
  "AI Agents": {
    fa: "عامل‌های هوش مصنوعی",
    ar: "وكلاء الذكاء الاصطناعي",
    zh: "AI 智能体",
    es: "Agentes de IA",
  },
  AI: { fa: "هوش مصنوعی", ar: "ذكاء اصطناعي", zh: "人工智能", es: "IA" },
  "Dev Tool": {
    fa: "ابزار توسعه",
    ar: "أداة تطوير",
    zh: "开发工具",
    es: "Herramienta de desarrollo",
  },
  "Security Tool": {
    fa: "ابزار امنیت",
    ar: "أداة أمنية",
    zh: "安全工具",
    es: "Herramienta de seguridad",
  },
  Desktop: { fa: "دسکتاپ", ar: "سطح المكتب", zh: "桌面", es: "Escritorio" },
  Web: { fa: "وب", ar: "الويب", zh: "网页", es: "Web" },
  "MQ Incubator Startup": {
    fa: "استارتاپ مرکز رشد MQ",
    ar: "شركة ناشئة في حاضنة MQ",
    zh: "MQ 孵化器初创项目",
    es: "Startup de la Incubadora MQ",
  },
  "AI/LLM": {
    fa: "هوش مصنوعی / LLM",
    ar: "ذكاء اصطناعي / LLM",
    zh: "AI / 大语言模型",
    es: "IA / LLM",
  },
  "Offline-First": {
    fa: "آفلاین‌محور",
    ar: "دون اتصال أولًا",
    zh: "离线优先",
    es: "Prioridad sin conexión",
  },
  "Privacy by Design": {
    fa: "حریم خصوصی در طراحی",
    ar: "خصوصية بالتصميم",
    zh: "隐私源于设计",
    es: "Privacidad por diseño",
  },
  "Full-Stack": {
    fa: "توسعهٔ کامل وب",
    ar: "تطوير متكامل",
    zh: "全栈",
    es: "Desarrollo integral",
  },
  HFT: {
    fa: "معاملات پربسامد",
    ar: "تداول عالي التردد",
    zh: "高频交易",
    es: "Negociación de alta frecuencia",
  },
  "Systems Programming": {
    fa: "برنامه‌نویسی سامانه",
    ar: "برمجة الأنظمة",
    zh: "系统编程",
    es: "Programación de sistemas",
  },
  "Network Security": {
    fa: "امنیت شبکه",
    ar: "أمن الشبكات",
    zh: "网络安全",
    es: "Seguridad de redes",
  },
  Kernel: { fa: "هسته", ar: "النواة", zh: "内核", es: "Kernel" },
  "Runtime Security": {
    fa: "امنیت زمان اجرا",
    ar: "أمن وقت التشغيل",
    zh: "运行时安全",
    es: "Seguridad en ejecución",
  },
};

export function localizeProjectTerm(term: string, locale: Locale): string {
  return locale === "en" ? term : (projectTerms[term]?.[locale] ?? term);
}
