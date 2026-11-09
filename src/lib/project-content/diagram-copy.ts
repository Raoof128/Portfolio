import type { Locale } from "@/i18n";
import type { ProjectDiagramCopy } from "./types";

export const projectDiagramCopy = {
  en: {
    boundariesTitle: "Earlier frozen four-boundary architecture",
    boundaries: [
      ["Input firewall", "Incoming requests"],
      ["Context-provenance guard", "Retrieved context"],
      ["Tool-invocation gate", "Agent actions"],
      ["Output-leakage firewall", "Outgoing content"],
    ],
    signedPack: "Ed25519-signed evidence pack",
    verifier: "Independent offline verifier",
    containmentNote:
      "This earlier frozen architecture links four boundaries to Ed25519 attestations and offline review. Ed25519-signed evidence archives replay offline in one command. This schematic is not a current run trace or benchmark result.",
    captureTitle: "Physical display and captured frame",
    desktop: "Desktop content",
    excludedWindow: "Excluded window",
    visibleToPerson: "Visible to the person",
    physicalDisplay: "Physical display",
    omittedWindow: "Window omitted",
    capturePipeline: "By the capture pipeline",
    capturedFrame: "Captured frame",
    captureNote:
      "Conceptual illustration of documented OS display-affinity exclusion. These are schematic frames, not recorded screenshots or pixel measurements.",
    provenanceTitle: "From source material to agent context",
    stages: [
      ["Source documents", "MD · text PDF · TXT · image stubs"],
      ["Typed knowledge", "Claims · concepts · entities · decisions"],
      ["Linked local wiki", "SQLite · graph relationships"],
      ["MCP retrieval", "Search · context · agent tools"],
    ],
    provenanceNote:
      "Documents feed structured, linked knowledge that agents can query. Architecture schematic; it does not assert complete retrieval or provenance coverage.",
    stackTitle: "Documented technology stack",
  },
  fa: {
    boundariesTitle: "معماری چهارمرزی تثبیت‌شدهٔ پیشین",
    boundaries: [
      ["دیوارهٔ ورودی", "درخواست‌های ورودی"],
      ["محافظ منشأ زمینه", "زمینهٔ بازیابی‌شده"],
      ["دروازهٔ فراخوانی ابزار", "اقدام‌های عامل"],
      ["دیوارهٔ نشت خروجی", "محتوای خروجی"],
    ],
    signedPack: "بستهٔ شواهد امضاشده با Ed25519",
    verifier: "اعتبارسنج مستقل آفلاین",
    containmentNote:
      "این معماری تثبیت‌شدهٔ پیشین چهار مرز را به گواهی Ed25519 و بازبینی آفلاین پیوند می‌دهد. بایگانی‌های شواهدِ امضاشده با Ed25519 با یک فرمان به‌صورت آفلاین بازاجرا می‌شوند. این طرح رد اجرای کنونی یا نتیجهٔ بنچمارک نیست.",
    captureTitle: "نمایشگر فیزیکی و فریم ضبط‌شده",
    desktop: "محتوای دسکتاپ",
    excludedWindow: "پنجرهٔ مستثناشده",
    visibleToPerson: "قابل‌مشاهده برای کاربر",
    physicalDisplay: "نمایشگر فیزیکی",
    omittedWindow: "پنجره حذف شده است",
    capturePipeline: "در مسیر ضبط صفحه",
    capturedFrame: "فریم ضبط‌شده",
    captureNote:
      "نمای مفهومی از حذف پنجره با API مستند وابستگی نمایش سیستم‌عامل. این فریم‌ها شماتیک‌اند؛ نه تصویر ضبط‌شده و نه اندازه‌گیری پیکسلی.",
    provenanceTitle: "از سند منبع تا زمینهٔ عامل",
    stages: [
      ["اسناد منبع", "MD · PDF/TXT متنی · تصویر در انتظار بررسی"],
      ["دانش نوع‌دار", "ادعا · مفهوم · موجودیت · تصمیم"],
      ["ویکی محلی پیوندخورده", "SQLite · رابطه‌های گراف"],
      ["بازیابی با MCP", "جست‌وجو · زمینه · ابزار عامل"],
    ],
    provenanceNote:
      "اسناد، دانش ساختاریافته و پیوندخورده‌ای می‌سازند که عامل می‌تواند پرس‌وجو کند. این طرح معماری است و پوشش کامل بازیابی یا منشأ را ادعا نمی‌کند.",
    stackTitle: "فناوری‌های مستند پروژه",
  },
  ar: {
    boundariesTitle: "بنية سابقة مجمّدة بأربعة حدود",
    boundaries: [
      ["جدار المدخلات", "الطلبات الواردة"],
      ["حارس منشأ السياق", "السياق المسترجع"],
      ["بوابة استدعاء الأدوات", "أفعال الوكيل"],
      ["جدار تسرّب المخرجات", "المحتوى الصادر"],
    ],
    signedPack: "حزمة أدلة موقّعة بـEd25519",
    verifier: "مدقّق مستقل يعمل دون اتصال",
    containmentNote:
      "تربط هذه البنية السابقة المجمّدة أربعة حدود بتصديقات Ed25519 ومراجعة دون اتصال. تُعاد أرشيفات الأدلة الموقّعة بـ Ed25519 دون اتصال بأمر واحد. ليس المخطط سجل تشغيل حاليًا أو نتيجة قياس أداء.",
    captureTitle: "الشاشة الفعلية والإطار الملتقط",
    desktop: "محتوى سطح المكتب",
    excludedWindow: "نافذة مستبعدة",
    visibleToPerson: "مرئية للمستخدم",
    physicalDisplay: "الشاشة الفعلية",
    omittedWindow: "النافذة محذوفة",
    capturePipeline: "بواسطة مسار الالتقاط",
    capturedFrame: "الإطار الملتقط",
    captureNote:
      "رسم مفاهيمي للاستبعاد الموثّق من التقاط الشاشة على مستوى النظام. الإطارات تخطيطية وليست لقطات مسجّلة أو قياسات للبكسل.",
    provenanceTitle: "من وثائق المصدر إلى سياق الوكيل",
    stages: [
      ["وثائق المصدر", "MD · PDF/TXT نصّي · صور معلّقة"],
      ["معرفة محددة النوع", "ادعاءات · مفاهيم · كيانات · قرارات"],
      ["ويكي محلي مترابط", "SQLite · علاقات الشبكة"],
      ["استرجاع MCP", "بحث · سياق · أدوات الوكيل"],
    ],
    provenanceNote:
      "تنتج الوثائق معرفة منظّمة ومترابطة يستطيع الوكيل الاستعلام عنها. مخطط معماري لا يدّعي تغطية كاملة للاسترجاع أو المنشأ.",
    stackTitle: "التقنيات الموثّقة للمشروع",
  },
  zh: {
    boundariesTitle: "早期冻结的四边界架构",
    boundaries: [
      ["输入防火墙", "传入请求"],
      ["上下文来源守卫", "检索上下文"],
      ["工具调用门", "智能体行为"],
      ["输出泄漏防火墙", "传出内容"],
    ],
    signedPack: "Ed25519 签名证据包",
    verifier: "独立离线验证器",
    containmentNote:
      "这份早期冻结架构将四道边界连接到 Ed25519 证明凭证与离线审查。经 Ed25519 签名的证据归档可通过一条命令离线重放。此图并非当前运行轨迹或基准结果。",
    captureTitle: "物理屏幕与捕获帧",
    desktop: "桌面内容",
    excludedWindow: "被排除的窗口",
    visibleToPerson: "用户可以看到",
    physicalDisplay: "物理屏幕",
    omittedWindow: "窗口被省略",
    capturePipeline: "由捕获管线排除",
    capturedFrame: "捕获帧",
    captureNote:
      "系统显示亲和性排除机制的概念示意，依据公开文档。这些是示意帧，并非录制截图或像素测量。",
    provenanceTitle: "从源文档到智能体上下文",
    stages: [
      ["源文档", "MD · 文本 PDF/TXT · 图像占位"],
      ["类型化知识", "声明 · 概念 · 实体 · 决策"],
      ["链接式本地维基", "SQLite · 图关系"],
      ["MCP 检索", "搜索 · 上下文 · 智能体工具"],
    ],
    provenanceNote:
      "文档形成可供智能体查询的结构化关联知识。这是架构示意图，不表示检索或来源覆盖完整。",
    stackTitle: "有文档支持的技术栈",
  },
  es: {
    boundariesTitle: "Arquitectura anterior congelada de cuatro límites",
    boundaries: [
      ["Cortafuegos de entrada", "Solicitudes entrantes"],
      ["Guardia de procedencia", "Contexto recuperado"],
      ["Puerta de herramientas", "Acciones del agente"],
      ["Cortafuegos de fugas", "Contenido saliente"],
    ],
    signedPack: "Paquete firmado con Ed25519",
    verifier: "Verificador independiente sin conexión",
    containmentNote:
      "Esta arquitectura anterior congelada conecta cuatro límites con atestaciones Ed25519 y revisión sin conexión. Los archivos de evidencia firmados con Ed25519 se reproducen sin conexión con un solo comando. El esquema no es una traza actual ni un resultado de benchmark.",
    captureTitle: "Pantalla física y fotograma capturado",
    desktop: "Contenido del escritorio",
    excludedWindow: "Ventana excluida",
    visibleToPerson: "Visible para la persona",
    physicalDisplay: "Pantalla física",
    omittedWindow: "Ventana omitida",
    capturePipeline: "Por el proceso de captura",
    capturedFrame: "Fotograma capturado",
    captureNote:
      "Ilustración conceptual de la exclusión documentada por afinidad de pantalla del sistema. Son esquemas, no capturas grabadas ni mediciones de píxeles.",
    provenanceTitle: "De las fuentes al contexto del agente",
    stages: [
      ["Documentos fuente", "MD · PDF/TXT con texto · imágenes pendientes"],
      [
        "Conocimiento tipado",
        "Afirmaciones · conceptos · entidades · decisiones",
      ],
      ["Wiki local enlazada", "SQLite · relaciones del grafo"],
      ["Recuperación MCP", "Búsqueda · contexto · herramientas del agente"],
    ],
    provenanceNote:
      "Los documentos generan conocimiento estructurado y enlazado que el agente puede consultar. Esquema de arquitectura; no garantiza cobertura completa de recuperación ni de procedencia.",
    stackTitle: "Stack tecnológico documentado",
  },
} satisfies Record<Locale, ProjectDiagramCopy>;
