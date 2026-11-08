import type { Locale } from "@/i18n";

export interface SimurghEvidenceStoryCopy {
  eyebrow: string;
  title: string;
  introduction: string;
  illustrationLabel: string;
  boundariesLabel: string;
  proofPathLabel: string;
  detailsTitle: string;
  boundaries: { title: string; detail: string }[];
  signedPack: string;
  signedPackDetail: string;
  verifier: string;
  verifierDetail: string;
  sourceNote: string;
  repositoryLink: string;
  reproduceLink: string;
}

export interface InvisibleWindowStoryCopy {
  eyebrow: string;
  title: string;
  introduction: string;
  illustrationLabel: string;
  platformLabel: string;
  physicalLabel: string;
  physicalDetail: string;
  captureLabel: string;
  captureScopeLabel: string;
  windowsPathLabel: string;
  macPathLabel: string;
  windowsApi: string;
  windowsScope: string;
  macApi: string;
  macScope: string;
  windowsLimits: string;
  macLimits: string;
  limitationsTitle: string;
  limitations: string[];
  sourceNote: string;
  paperLink: string;
  repositoryLink: string;
}

export interface ZurvanEvidenceStoryCopy {
  eyebrow: string;
  title: string;
  introduction: string;
  illustrationLabel: string;
  sourceNode: string;
  sourceDetail: string;
  retrievalNode: string;
  retrievalDetail: string;
  consumerNode: string;
  consumerDetail: string;
  nodeTypesLabel: string;
  nodeTypes: { name: string; detail: string }[];
  relationshipsLabel: string;
  sourceRelationship: string;
  retrievalRelationship: string;
  detailsTitle: string;
  limitations: string;
  repositoryNote: string;
}

export const simurghEvidenceStoryCopy: Record<
  Locale,
  SimurghEvidenceStoryCopy
> = {
  en: {
    eyebrow: "Current study and earlier architecture",
    title: "A receipt that can be checked again",
    introduction:
      "The current prototype checks tool proposals against host-held delegation, stop, lease and credential state. In the October 2026 matched-control study, composed host controls reduced Llama-3.2-3B restricted-state trials with new effects from 17/24 to 0/24, with 23/24 useful completions. gpt-6-luna already had a 0/24 baseline, so no incremental protection was found.",
    illustrationLabel:
      "Earlier frozen four-boundary architecture · not a current study run trace",
    boundariesLabel: "Select a step in the evidence path",
    proofPathLabel:
      "Path from a selected boundary to signed evidence and verification",
    detailsTitle: "Evidence path explanations",
    boundaries: [
      {
        title: "Input firewall",
        detail:
          "The first boundary screens incoming instructions before they reach the agent.",
      },
      {
        title: "Context provenance",
        detail:
          "This boundary checks instructions carried in retrieved or tool-returned context.",
      },
      {
        title: "Tool invocation",
        detail:
          "The authority gate checks whether a proposed tool action is allowed by policy.",
      },
      {
        title: "Output leakage",
        detail:
          "The final boundary checks outgoing content for disallowed disclosure before export.",
      },
    ],
    signedPack: "Signed evidence pack",
    signedPackDetail:
      "This earlier frozen architecture describes metadata-only evidence signed with Ed25519.",
    verifier: "Offline verifier",
    verifierDetail:
      "A producer-independent reviewer can replay decisions offline and check evidence completeness without producer access.",
    sourceNote:
      "Current study archives use SHA-256 and replay on native Linux x86_64 with Python 3.12. The diagram and VCA command describe an earlier frozen Ed25519 attestation stage, not a replay of the October transfer study. Current software DOI: 10.5281/zenodo.21737792; earlier device-integrity preprint: 10.5281/zenodo.20374849.",
    repositoryLink: "Current Simurgh repository",
    reproduceLink: "Replay earlier frozen VCA evidence",
  },
  fa: {
    eyebrow: "پژوهش کنونی و معماری پیشین",
    title: "رسیدی که می‌توان دوباره بررسی کرد",
    introduction:
      "نمونهٔ کنونی، پیشنهادهای ابزار را با وضعیت اختیار واگذارشده، توقف، مهلت و اعتبارنامهٔ نگه‌داری‌شده در میزبان می‌سنجد. در پژوهش اکتبر 2026 با کنترل‌های همسان، کنترل‌های ترکیبی میزبان آزمون‌های Llama-3.2-3B در حالت محدود با آثار تازه را از 17/24 به 0/24 رساند و 23/24 تکمیل مفید حفظ شد. خط پایهٔ gpt-6-luna از ابتدا 0/24 بود؛ حفاظت افزوده‌ای یافت نشد.",
    illustrationLabel:
      "معماری چهارمرزی تثبیت‌شدهٔ پیشین · نه رد اجرای پژوهش کنونی",
    boundariesLabel: "یک گام از مسیر شواهد را انتخاب کنید",
    proofPathLabel: "مسیر از مرز انتخاب‌شده تا شواهد امضاشده و راستی‌آزمایی",
    detailsTitle: "توضیح مسیر شواهد",
    boundaries: [
      {
        title: "فایروال ورودی",
        detail:
          "مرز نخست، دستورهای ورودی را پیش از رسیدن به عامل بررسی می‌کند.",
      },
      {
        title: "خاستگاه زمینه",
        detail:
          "این مرز دستورهایی را بررسی می‌کند که از محتوای بازیابی‌شده یا بازگشتی از ابزار آمده‌اند.",
      },
      {
        title: "فراخوانی ابزار",
        detail:
          "دروازهٔ اختیار بررسی می‌کند که آیا اقدام پیشنهادی ابزار طبق سیاست مجاز است یا نه.",
      },
      {
        title: "نشت خروجی",
        detail:
          "مرز پایانی، محتوای خروجی را پیش از صدور از نظر افشای غیرمجاز بررسی می‌کند.",
      },
    ],
    signedPack: "بستهٔ شواهد امضاشده",
    signedPackDetail:
      "این معماری تثبیت‌شدهٔ پیشین، شواهد صرفاً فراداده‌ای و امضاشده با Ed25519 را توصیف می‌کند.",
    verifier: "اعتبارسنج آفلاین",
    verifierDetail:
      "بازبین مستقل از تولیدکننده می‌تواند تصمیم‌ها را آفلاین بازاجرا کند و بدون دسترسی به تولیدکننده، کامل‌بودن شواهد را بسنجد.",
    sourceNote:
      "بایگانی پژوهش کنونی از SHA-256 استفاده می‌کند و روی Linux x86_64 بومی با Python 3.12 بازاجرا می‌شود. نمودار و فرمان VCA، گواهی Ed25519 در مرحلهٔ تثبیت‌شدهٔ پیشین را توضیح می‌دهند، نه بازاجرای پژوهش انتقال اکتبر. DOI نرم‌افزار کنونی: 10.5281/zenodo.21737792؛ پیش‌چاپ قدیمی یکپارچگی دستگاه: 10.5281/zenodo.20374849.",
    repositoryLink: "مخزن کنونی Simurgh",
    reproduceLink: "بازاجرای شواهد VCA تثبیت‌شدهٔ پیشین",
  },
  ar: {
    eyebrow: "الدراسة الحالية والبنية السابقة",
    title: "إيصال يمكن التحقق منه مجددًا",
    introduction:
      "يفحص النموذج الحالي مقترحات الأدوات مقابل حالة التفويض والإيقاف والمهلة وبيانات الاعتماد المحفوظة على المضيف. في دراسة أكتوبر 2026 بضوابط مقارنة متطابقة، خفّضت ضوابط المضيف المركبة تجارب Llama-3.2-3B المقيّدة ذات الآثار الجديدة من 17/24 إلى 0/24 مع 23/24 إكمالًا مفيدًا. كان خط أساس gpt-6-luna أصلًا 0/24، لذا لم تُرصد حماية إضافية.",
    illustrationLabel:
      "بنية سابقة مجمّدة بأربعة حدود · ليست سجل تشغيل الدراسة الحالية",
    boundariesLabel: "اختر خطوة في مسار الأدلة",
    proofPathLabel: "المسار من الحد المحدد إلى الأدلة الموقعة والتحقق",
    detailsTitle: "شرح مسار الأدلة",
    boundaries: [
      {
        title: "جدار حماية المدخلات",
        detail: "يفحص الحد الأول التعليمات الواردة قبل وصولها إلى الوكيل.",
      },
      {
        title: "مصدر السياق",
        detail:
          "يفحص هذا الحد التعليمات التي يحملها المحتوى المسترجع أو المُعاد من الأدوات.",
      },
      {
        title: "استدعاء الأدوات",
        detail:
          "تتحقق بوابة الصلاحيات مما إذا كان إجراء الأداة المقترح مسموحًا به وفق السياسة.",
      },
      {
        title: "تسرب المخرجات",
        detail:
          "يفحص الحد الأخير المحتوى الصادر بحثًا عن إفصاح غير مسموح به قبل تصديره.",
      },
    ],
    signedPack: "حزمة أدلة موقعة",
    signedPackDetail:
      "تصف بنية سابقة مجمّدة أدلة موقعة بـ Ed25519 تقتصر على البيانات الوصفية.",
    verifier: "مدقق دون اتصال",
    verifierDetail:
      "يمكن لمراجع مستقل عن الجهة المنتجة إعادة تشغيل القرارات دون اتصال والتحقق من اكتمال الأدلة دون الوصول إلى الجهة المنتجة.",
    sourceNote:
      "تستخدم أرشيفات الدراسة الحالية SHA-256 وتُعاد على Linux x86_64 أصلي مع Python 3.12. يصف المخطط وأمر VCA مرحلة تصديق Ed25519 سابقة مجمّدة، لا إعادة دراسة النقل في أكتوبر. DOI البرنامج الحالي: 10.5281/zenodo.21737792؛ مسودة سلامة الأجهزة السابقة: 10.5281/zenodo.20374849.",
    repositoryLink: "مستودع Simurgh الحالي",
    reproduceLink: "إعادة تشغيل أدلة VCA السابقة المجمّدة",
  },
  zh: {
    eyebrow: "当前研究与早期架构",
    title: "可再次核验的凭证",
    introduction:
      "当前原型依据宿主保存的委派、停止、租期及凭证状态检查工具提案。2026 年 10 月的匹配对照研究中，组合宿主控制将 Llama-3.2-3B 在受限状态下产生新效果的试验从 17/24 降至 0/24，并保留 23/24 次有用任务完成。gpt-6-luna 的基线已为 0/24，因此未发现额外保护。",
    illustrationLabel: "早期冻结的四边界架构 · 并非当前研究的运行轨迹",
    boundariesLabel: "选择证据路径中的步骤",
    proofPathLabel: "从所选边界到签名证据与验证的路径",
    detailsTitle: "证据路径说明",
    boundaries: [
      {
        title: "输入防火墙",
        detail: "第一道边界会在指令到达智能体之前进行检查。",
      },
      {
        title: "上下文来源",
        detail: "此边界检查来自检索内容或工具返回内容中的指令。",
      },
      {
        title: "工具调用",
        detail: "权限门检查拟议的工具操作是否符合策略。",
      },
      {
        title: "输出泄漏",
        detail: "最后一道边界会在导出前检查输出内容是否包含不允许披露的信息。",
      },
    ],
    signedPack: "签名证据包",
    signedPackDetail: "这份早期冻结架构描述使用 Ed25519 签名的纯元数据证据。",
    verifier: "离线验证器",
    verifierDetail:
      "独立于生成方的审查者可以离线重放决策，并在不接触生成方的情况下检查证据是否完整。",
    sourceNote:
      "当前研究归档使用 SHA-256，可在原生 Linux x86_64 与 Python 3.12 环境重放。图示与 VCA 命令描述早期冻结的 Ed25519 证明凭证阶段，并非重跑10月迁移研究。当前软件 DOI：10.5281/zenodo.21737792；早期设备完整性预印本：10.5281/zenodo.20374849。",
    repositoryLink: "当前 Simurgh 仓库",
    reproduceLink: "重放早期冻结的 VCA 证据",
  },
  es: {
    eyebrow: "Estudio actual y arquitectura anterior",
    title: "Un recibo que se puede verificar de nuevo",
    introduction:
      "El prototipo actual comprueba cada propuesta de herramienta frente al estado de delegación, parada, vigencia y credenciales conservado en el host. En el estudio de octubre de 2026 con controles emparejados, los controles compuestos del host redujeron los ensayos restringidos de Llama-3.2-3B con efectos nuevos de 17/24 a 0/24, con 23/24 tareas útiles completadas. gpt-6-luna ya tenía una base de 0/24, por lo que no se observó protección incremental.",
    illustrationLabel:
      "Arquitectura anterior congelada de cuatro límites · no es una traza del estudio actual",
    boundariesLabel: "Selecciona un paso del recorrido de evidencias",
    proofPathLabel:
      "Ruta desde el límite seleccionado hasta la evidencia firmada y su verificación",
    detailsTitle: "Explicación del recorrido de evidencias",
    boundaries: [
      {
        title: "Cortafuegos de entrada",
        detail:
          "El primer límite revisa las instrucciones entrantes antes de que lleguen al agente.",
      },
      {
        title: "Procedencia del contexto",
        detail:
          "Este límite revisa las instrucciones incluidas en el contenido recuperado o devuelto por herramientas.",
      },
      {
        title: "Invocación de herramientas",
        detail:
          "La puerta de autoridad comprueba si la acción propuesta para una herramienta está permitida por la política.",
      },
      {
        title: "Fuga de salida",
        detail:
          "El límite final revisa el contenido saliente para detectar divulgaciones no permitidas antes de exportarlo.",
      },
    ],
    signedPack: "Paquete de evidencia firmado",
    signedPackDetail:
      "Esta arquitectura anterior congelada describe evidencias de metadatos firmadas con Ed25519.",
    verifier: "Verificador sin conexión",
    verifierDetail:
      "Una persona revisora independiente del productor puede reproducir las decisiones sin conexión y comprobar que la evidencia esté completa sin acceder al productor.",
    sourceNote:
      "Los archivos actuales del estudio usan SHA-256 y se reproducen en Linux x86_64 nativo con Python 3.12. El esquema y el comando VCA describen una etapa anterior congelada de atestaciones Ed25519; no repiten el estudio de transferencia de octubre. DOI del software actual: 10.5281/zenodo.21737792; preprint anterior de integridad de dispositivos: 10.5281/zenodo.20374849.",
    repositoryLink: "Repositorio actual de Simurgh",
    reproduceLink: "Repetir las evidencias VCA anteriores congeladas",
  },
};

export const invisibleWindowStoryCopy: Record<
  Locale,
  InvisibleWindowStoryCopy
> = {
  en: {
    eyebrow: "Capture observability",
    title: "What appears on the display may differ from the captured frame",
    introduction:
      "Choose a platform to inspect the documented window-affinity setting and the capture scope described by the study. Both panels remain visible for comparison.",
    illustrationLabel:
      "Illustrative schematic · not a recorded screenshot or pixel measurement",
    platformLabel: "Select a tested platform",
    physicalLabel: "Physical display",
    physicalDetail: "The window remains visible to the person at the display.",
    captureLabel: "Captured frame",
    captureScopeLabel: "Documented setting and tested capture scope",
    windowsPathLabel: "Windows capture path",
    macPathLabel: "macOS capture path",
    windowsApi: "Windows · SetWindowDisplayAffinity / WDA_EXCLUDEFROMCAPTURE",
    windowsScope:
      "The study reports exclusion in tested Windows 10/11 capture paths that honour the setting.",
    macApi: "macOS · NSWindow.SharingType.none",
    macScope:
      "The study reports exclusion in tested native capture paths across macOS 14–26.",
    windowsLimits:
      "Windows 10/11 lab configurations were tested; this does not establish behaviour in every browser or commercial proctoring product.",
    macLimits:
      "For macOS 26, the study used CGWindowListCreateImage and screencapture. It did not test browser getDisplayMedia() or directly test ScreenCaptureKit on macOS 26.",
    limitationsTitle: "Study scope and limits",
    limitations: [
      "The evaluations used simulated configurations, not commercial proctoring products.",
      "Linux was not tested. Findings describe software versions tested through March 2026 and may change after patches.",
    ],
    sourceNote:
      "The diagram explains a documented display/capture boundary; the panels contain no measured or recorded output.",
    paperLink: "Read the research preprint",
    repositoryLink: "View the research repository",
  },
  fa: {
    eyebrow: "مشاهده‌پذیری ضبط",
    title: "آنچه روی نمایشگر دیده می‌شود ممکن است با فریم ضبط‌شده فرق کند",
    introduction:
      "برای بررسی تنظیم مستندِ ویژگی پنجره و دامنهٔ ضبطِ گزارش‌شده در پژوهش، یک سکو را انتخاب کنید. هر دو پنل برای مقایسه دیده می‌شوند.",
    illustrationLabel:
      "نمای شماتیک توضیحی · نه تصویر ضبط‌شده و نه اندازه‌گیری پیکسل",
    platformLabel: "یک سکوی آزموده‌شده را انتخاب کنید",
    physicalLabel: "نمایشگر فیزیکی",
    physicalDetail:
      "پنجره برای شخصی که به نمایشگر نگاه می‌کند قابل مشاهده می‌ماند.",
    captureLabel: "فریم ضبط‌شده",
    captureScopeLabel: "تنظیم مستند و دامنهٔ ضبط آزموده‌شده",
    windowsPathLabel: "مسیر ضبط Windows",
    macPathLabel: "مسیر ضبط macOS",
    windowsApi: "Windows · SetWindowDisplayAffinity / WDA_EXCLUDEFROMCAPTURE",
    windowsScope:
      "پژوهش حذف پنجره را در مسیرهای ضبط آزموده‌شدهٔ Windows 10/11 که این تنظیم را رعایت می‌کنند گزارش می‌کند.",
    macApi: "macOS · NSWindow.SharingType.none",
    macScope:
      "پژوهش حذف پنجره را در مسیرهای ضبط بومی آزموده‌شده در macOS 14–26 گزارش می‌کند.",
    windowsLimits:
      "پیکربندی‌های آزمایشگاهی Windows 10/11 آزموده شدند؛ این نتیجه رفتار همهٔ مرورگرها یا محصولات تجاری نظارت را ثابت نمی‌کند.",
    macLimits:
      "برای macOS 26، پژوهش از CGWindowListCreateImage و screencapture استفاده کرد. getDisplayMedia() مرورگر یا ScreenCaptureKit به‌طور مستقیم در macOS 26 آزموده نشد.",
    limitationsTitle: "دامنه و محدودیت‌های پژوهش",
    limitations: [
      "ارزیابی‌ها با پیکربندی‌های شبیه‌سازی‌شده انجام شدند، نه محصولات تجاری نظارت.",
      "Linux آزموده نشد. یافته‌ها نسخه‌های نرم‌افزاری آزموده‌شده تا مارس ۲۰۲۶ را توصیف می‌کنند و ممکن است پس از اصلاحات تغییر کنند.",
    ],
    sourceNote:
      "نمودار مرز مستند میان نمایش و ضبط را توضیح می‌دهد؛ پنل‌ها خروجی اندازه‌گیری‌شده یا ضبط‌شده ندارند.",
    paperLink: "خواندن پیش‌چاپ پژوهش",
    repositoryLink: "مشاهدهٔ مخزن پژوهش",
  },
  ar: {
    eyebrow: "قابلية رصد الالتقاط",
    title: "قد يختلف ما يظهر على الشاشة عما يظهر في الإطار الملتقط",
    introduction:
      "اختر منصة لفحص إعداد نافذة موثق ونطاق الالتقاط الذي تصفه الدراسة. يظل العرضان ظاهرين للمقارنة.",
    illustrationLabel: "مخطط توضيحي · ليس لقطة شاشة مسجلة أو قياسًا للبكسلات",
    platformLabel: "اختر منصة مختبرة",
    physicalLabel: "الشاشة الفعلية",
    physicalDetail: "تظل النافذة مرئية للشخص أمام الشاشة.",
    captureLabel: "الإطار الملتقط",
    captureScopeLabel: "الإعداد الموثق ونطاق الالتقاط المختبر",
    windowsPathLabel: "مسار الالتقاط في Windows",
    macPathLabel: "مسار الالتقاط في macOS",
    windowsApi: "Windows · SetWindowDisplayAffinity / WDA_EXCLUDEFROMCAPTURE",
    windowsScope:
      "تذكر الدراسة استبعاد النافذة في مسارات الالتقاط المختبرة على Windows 10/11 التي تحترم الإعداد.",
    macApi: "macOS · NSWindow.SharingType.none",
    macScope:
      "تذكر الدراسة استبعاد النافذة في مسارات الالتقاط الأصلية المختبرة على macOS 14–26.",
    windowsLimits:
      "اختُبرت إعدادات مختبرية على Windows 10/11؛ ولا يثبت ذلك السلوك في كل متصفح أو منتج مراقبة تجاري.",
    macLimits:
      "استخدمت الدراسة في macOS 26 أداتي CGWindowListCreateImage وscreencapture. ولم تختبر getDisplayMedia() في المتصفح أو ScreenCaptureKit مباشرةً على macOS 26.",
    limitationsTitle: "نطاق الدراسة وحدودها",
    limitations: [
      "استخدمت التقييمات إعدادات محاكاة، لا منتجات مراقبة تجارية.",
      "لم يُختبر Linux. تصف النتائج إصدارات البرمجيات المختبرة حتى مارس 2026 وقد تتغير بعد التحديثات.",
    ],
    sourceNote:
      "يوضح الرسم حدًا موثقًا بين العرض والالتقاط؛ ولا تعرض اللوحتان مخرجات مقاسة أو مسجلة.",
    paperLink: "اقرأ المسودة البحثية",
    repositoryLink: "عرض مستودع البحث",
  },
  zh: {
    eyebrow: "捕获可观测性",
    title: "屏幕上显示的内容可能与捕获帧不同",
    introduction:
      "选择一个平台，查看研究所述的窗口亲和设置和捕获范围。两个面板始终并列，便于比较。",
    illustrationLabel: "示意图 · 非录制截图或像素测量",
    platformLabel: "选择已测试的平台",
    physicalLabel: "物理显示器",
    physicalDetail: "窗口对显示器前的人仍然可见。",
    captureLabel: "捕获帧",
    captureScopeLabel: "文档所述设置与已测试的捕获范围",
    windowsPathLabel: "Windows 捕获路径",
    macPathLabel: "macOS 捕获路径",
    windowsApi: "Windows · SetWindowDisplayAffinity / WDA_EXCLUDEFROMCAPTURE",
    windowsScope:
      "研究报告称，在遵循此设置的已测试 Windows 10/11 捕获路径中，窗口会被排除。",
    macApi: "macOS · NSWindow.SharingType.none",
    macScope:
      "研究报告称，在 macOS 14–26 已测试的原生捕获路径中，窗口会被排除。",
    windowsLimits:
      "测试对象是 Windows 10/11 实验室配置；这不代表所有浏览器或商业监考产品的行为。",
    macLimits:
      "macOS 26 测试使用 CGWindowListCreateImage 和 screencapture；未在 macOS 26 上测试浏览器 getDisplayMedia() 或直接测试 ScreenCaptureKit。",
    limitationsTitle: "研究范围与限制",
    limitations: [
      "评估使用模拟配置，而非商业监考产品。",
      "未测试 Linux。结论描述截至 2026 年 3 月测试的软件版本，后续补丁可能改变行为。",
    ],
    sourceNote: "图示解释文档记录的显示与捕获边界；面板不展示测量或录制输出。",
    paperLink: "阅读研究预印本",
    repositoryLink: "查看研究仓库",
  },
  es: {
    eyebrow: "Observabilidad de captura",
    title: "Lo que aparece en pantalla puede diferir del fotograma capturado",
    introduction:
      "Elija una plataforma para consultar el ajuste documentado de afinidad de ventana y el alcance de captura descrito por el estudio. Ambos paneles permanecen visibles para compararlos.",
    illustrationLabel:
      "Esquema ilustrativo · no es una captura grabada ni una medición de píxeles",
    platformLabel: "Seleccione una plataforma probada",
    physicalLabel: "Pantalla física",
    physicalDetail: "La ventana sigue visible para quien mira la pantalla.",
    captureLabel: "Fotograma capturado",
    captureScopeLabel: "Ajuste documentado y alcance de captura probado",
    windowsPathLabel: "Ruta de captura de Windows",
    macPathLabel: "Ruta de captura de macOS",
    windowsApi: "Windows · SetWindowDisplayAffinity / WDA_EXCLUDEFROMCAPTURE",
    windowsScope:
      "El estudio informa de exclusión en las rutas probadas de Windows 10/11 que respetan el ajuste.",
    macApi: "macOS · NSWindow.SharingType.none",
    macScope:
      "El estudio informa de exclusión en rutas nativas probadas de macOS 14–26.",
    windowsLimits:
      "Se probaron configuraciones de laboratorio en Windows 10/11; esto no establece el comportamiento de todos los navegadores o productos comerciales de supervisión.",
    macLimits:
      "Para macOS 26, el estudio usó CGWindowListCreateImage y screencapture. No probó getDisplayMedia() en navegador ni ScreenCaptureKit directamente en macOS 26.",
    limitationsTitle: "Alcance y límites del estudio",
    limitations: [
      "Las evaluaciones usaron configuraciones simuladas, no productos comerciales de supervisión.",
      "No se probó Linux. Los hallazgos describen versiones probadas hasta marzo de 2026 y pueden cambiar con parches.",
    ],
    sourceNote:
      "El esquema explica una frontera documentada entre visualización y captura; los paneles no contienen salidas medidas ni grabadas.",
    paperLink: "Leer la prepublicación de investigación",
    repositoryLink: "Ver el repositorio de investigación",
  },
};

export const zurvanEvidenceStoryCopy: Record<Locale, ZurvanEvidenceStoryCopy> =
  {
    en: {
      eyebrow: "Knowledge and retrieval",
      title: "Follow a typed idea from source to agent context",
      introduction:
        "Select a knowledge type to trace its schematic relationship from a source document through retrieval. The labels below describe architecture, not a private-corpus example.",
      illustrationLabel:
        "Illustrative schema · no corpus records or retrieval results shown",
      sourceNode: "Source document",
      sourceDetail: "MD · text PDF · TXT · image stubs",
      retrievalNode: "Hybrid retrieval",
      retrievalDetail:
        "FTS5 + semantic search · optional graph-neighbour expansion",
      consumerNode: "MCP context",
      consumerDetail: "Rust read tools · Python write bridge",
      nodeTypesLabel: "Select a typed knowledge node",
      nodeTypes: [
        {
          name: "Claim",
          detail:
            "A claim node preserves a statement as structured knowledge linked back to source material.",
        },
        {
          name: "Concept",
          detail:
            "A concept node connects a topic to related knowledge across the local wiki.",
        },
        {
          name: "Entity",
          detail:
            "An entity node represents a named subject that can connect claims and concepts.",
        },
        {
          name: "Decision",
          detail:
            "A decision node records a decision as a typed item that can be retrieved with related context.",
        },
      ],
      relationshipsLabel: "Illustrative relationship path",
      sourceRelationship:
        "extracted from source material; links accumulate across sources",
      retrievalRelationship:
        "retrieved by hybrid search; graph neighbours can add related context",
      detailsTitle: "What the selected type means",
      limitations:
        "This schematic does not claim complete source fidelity, provenance coverage, or retrieval recall. It shows the documented data model and retrieval stages only. Images remain pending-visual stubs without automatic OCR; PDF figures need a separate visual pass.",
      repositoryNote:
        "Zurvan’s repository is public. This schematic uses generic labels and contains no corpus records; the Rust MCP read server keeps a Python write bridge and reference fallback.",
    },
    fa: {
      eyebrow: "دانش و بازیابی",
      title: "یک ایدهٔ نوع‌دار را از منبع تا زمینهٔ عامل دنبال کنید",
      introduction:
        "یک نوع دانش را انتخاب کنید تا رابطهٔ شماتیک آن از سند منبع تا بازیابی روشن شود. برچسب‌های زیر معماری را توضیح می‌دهند، نه نمونه‌ای از پیکرهٔ خصوصی.",
      illustrationLabel:
        "طرح‌وارهٔ توضیحی · بدون نمایش رکوردهای پیکره یا نتیجهٔ بازیابی",
      sourceNode: "سند منبع",
      sourceDetail: "MD · PDF/TXT متنی · تصویر در انتظار بررسی",
      retrievalNode: "بازیابی ترکیبی",
      retrievalDetail: "FTS5 + جست‌وجوی معنایی · گسترش اختیاری همسایه‌های گراف",
      consumerNode: "زمینهٔ MCP",
      consumerDetail: "ابزار خواندن Rust · پل نوشتن Python",
      nodeTypesLabel: "یک گرهٔ دانشِ نوع‌دار را انتخاب کنید",
      nodeTypes: [
        {
          name: "ادعا",
          detail:
            "گرهٔ ادعا یک گزاره را به‌صورت دانش ساخت‌یافته و پیوندخورده به منبع نگه می‌دارد.",
        },
        {
          name: "مفهوم",
          detail:
            "گرهٔ مفهوم، موضوع را به دانش مرتبط در ویکی محلی پیوند می‌دهد.",
        },
        {
          name: "موجودیت",
          detail:
            "گرهٔ موجودیت، موضوع نام‌دار را بازنمایی می‌کند که می‌تواند به ادعاها و مفهوم‌ها پیوند بخورد.",
        },
        {
          name: "تصمیم",
          detail:
            "گرهٔ تصمیم، تصمیم را به‌عنوان موردی نوع‌دار ثبت می‌کند تا همراه زمینهٔ مرتبط بازیابی شود.",
        },
      ],
      relationshipsLabel: "مسیر رابطهٔ توضیحی",
      sourceRelationship:
        "استخراج از محتوای منبع؛ پیوندها میان منابع انباشته می‌شوند",
      retrievalRelationship:
        "بازیابی با جست‌وجوی ترکیبی؛ همسایه‌های گراف می‌توانند زمینهٔ مرتبط بیفزایند",
      detailsTitle: "معنای نوع انتخاب‌شده",
      limitations:
        "این طرح‌واره کامل‌بودن وفاداری به منبع، پوشش منشأ یا یادآوری بازیابی را ادعا نمی‌کند؛ فقط مدل داده و مراحل مستند بازیابی را نشان می‌دهد. تصویرها بدون OCR خودکار در انتظار بررسی بصری می‌مانند؛ شکل‌های PDF به بررسی بصری جداگانه نیاز دارند.",
      repositoryNote:
        "مخزن Zurvan عمومی است. این طرح‌واره برچسب‌های کلی دارد و رکوردی از پیکره نشان نمی‌دهد؛ سرور خواندن MCP با Rust، پل نوشتن و مرجع جایگزین Python را حفظ می‌کند.",
    },
    ar: {
      eyebrow: "المعرفة والاسترجاع",
      title: "تتبّع فكرة مصنّفة من المصدر إلى سياق الوكيل",
      introduction:
        "اختر نوعًا معرفيًا لتتبّع علاقته التخطيطية من مستند المصدر مرورًا بالاسترجاع. تصف التسميات أدناه البنية، لا مثالًا من مدونة خاصة.",
      illustrationLabel: "مخطط توضيحي · لا يعرض سجلات مدونة أو نتائج استرجاع",
      sourceNode: "مستند مصدر",
      sourceDetail: "MD · PDF/TXT نصّي · صور معلّقة",
      retrievalNode: "استرجاع هجين",
      retrievalDetail: "FTS5 + بحث دلالي · توسيع اختياري لجيران الرسم البياني",
      consumerNode: "سياق MCP",
      consumerDetail: "أدوات قراءة Rust · جسر كتابة Python",
      nodeTypesLabel: "اختر عقدة معرفة مصنّفة",
      nodeTypes: [
        {
          name: "ادعاء",
          detail: "تحفظ عقدة الادعاء عبارةً كمعرفة منظمة مرتبطة بمادة المصدر.",
        },
        {
          name: "مفهوم",
          detail:
            "تربط عقدة المفهوم موضوعًا بمعرفة ذات صلة عبر الويكي المحلية.",
        },
        {
          name: "كيان",
          detail:
            "تمثل عقدة الكيان موضوعًا مسمى يمكن ربطه بالادعاءات والمفاهيم.",
        },
        {
          name: "قرار",
          detail:
            "تسجل عقدة القرار قرارًا كعنصر مصنّف يمكن استرجاعه مع السياق ذي الصلة.",
        },
      ],
      relationshipsLabel: "مسار علاقات توضيحي",
      sourceRelationship: "استخراج من مادة المصدر؛ تتراكم الروابط عبر المصادر",
      retrievalRelationship:
        "استرجاع عبر البحث الهجين؛ وقد يضيف جيران الرسم سياقًا ذا صلة",
      detailsTitle: "معنى النوع المحدد",
      limitations:
        "لا يدّعي هذا المخطط اكتمال الأمانة للمصادر أو تغطية المنشأ أو استدعاء الاسترجاع. بل يعرض نموذج البيانات ومراحل الاسترجاع الموثقة فقط. تبقى الصور عناصر معلّقة للفحص البصري دون OCR تلقائي؛ وتحتاج أشكال PDF إلى فحص بصري منفصل.",
      repositoryNote:
        "مستودع Zurvan عام. يستخدم المخطط تسميات عامة ولا يتضمن سجلات من المدونة؛ يحتفظ خادم قراءة MCP بلغة Rust بجسر كتابة ومرجع بديل بلغة Python.",
    },
    zh: {
      eyebrow: "知识与检索",
      title: "追踪一个类型化知识点，从来源到智能体上下文",
      introduction:
        "选择一种知识类型，查看它从来源文档到检索的示意关系。以下标签描述架构，不包含私有语料示例。",
      illustrationLabel: "示意架构 · 未展示语料记录或检索结果",
      sourceNode: "来源文档",
      sourceDetail: "MD · 文本 PDF/TXT · 图像占位",
      retrievalNode: "混合检索",
      retrievalDetail: "FTS5 + 语义搜索 · 可选图邻居扩展",
      consumerNode: "MCP 上下文",
      consumerDetail: "Rust 读取工具 · Python 写入桥接",
      nodeTypesLabel: "选择一种类型化知识节点",
      nodeTypes: [
        {
          name: "主张",
          detail: "主张节点将陈述保存为结构化知识，并关联回来源材料。",
        },
        {
          name: "概念",
          detail: "概念节点将主题连接到本地知识库中的相关知识。",
        },
        { name: "实体", detail: "实体节点表示可与主张和概念相连的具名对象。" },
        {
          name: "决策",
          detail: "决策节点将决策记录为类型化条目，可与相关上下文一起检索。",
        },
      ],
      relationshipsLabel: "示意关系路径",
      sourceRelationship: "从来源材料提取；链接会跨来源累积",
      retrievalRelationship: "由混合搜索检索；图邻居可补充相关上下文",
      detailsTitle: "所选类型的含义",
      limitations:
        "此示意不声称完整保留来源、完整覆盖溯源关系或达到完整检索召回；它只展示文档所述的数据模型和检索阶段。图像仍为待视觉处理的占位条目，不进行自动 OCR；PDF 图表需要单独查看。",
      repositoryNote:
        "Zurvan 仓库现为公开。此示意使用通用标签，不含语料记录；Rust MCP 读取服务器保留 Python 写入桥接与参考后备实现。",
    },
    es: {
      eyebrow: "Conocimiento y recuperación",
      title:
        "Siga una idea tipada desde la fuente hasta el contexto del agente",
      introduction:
        "Seleccione un tipo de conocimiento para seguir su relación esquemática desde un documento fuente hasta la recuperación. Las etiquetas describen la arquitectura, no un ejemplo del corpus privado.",
      illustrationLabel:
        "Esquema ilustrativo · sin registros del corpus ni resultados de recuperación",
      sourceNode: "Documento fuente",
      sourceDetail: "MD · PDF/TXT con texto · imágenes pendientes",
      retrievalNode: "Recuperación híbrida",
      retrievalDetail:
        "FTS5 + búsqueda semántica · expansión opcional de vecinos del grafo",
      consumerNode: "Contexto MCP",
      consumerDetail: "Lecturas Rust · puente de escritura Python",
      nodeTypesLabel: "Seleccione un nodo de conocimiento tipado",
      nodeTypes: [
        {
          name: "Afirmación",
          detail:
            "Un nodo de afirmación conserva una declaración como conocimiento estructurado vinculado al material fuente.",
        },
        {
          name: "Concepto",
          detail:
            "Un nodo de concepto conecta un tema con conocimiento relacionado en la wiki local.",
        },
        {
          name: "Entidad",
          detail:
            "Un nodo de entidad representa un sujeto con nombre que puede vincular afirmaciones y conceptos.",
        },
        {
          name: "Decisión",
          detail:
            "Un nodo de decisión registra una decisión como elemento tipado que se puede recuperar con contexto relacionado.",
        },
      ],
      relationshipsLabel: "Ruta de relaciones ilustrativa",
      sourceRelationship:
        "extraído del material fuente; los vínculos se acumulan entre fuentes",
      retrievalRelationship:
        "recuperado mediante búsqueda híbrida; los vecinos del grafo pueden añadir contexto relacionado",
      detailsTitle: "Qué significa el tipo seleccionado",
      limitations:
        "Este esquema no afirma fidelidad completa a las fuentes, cobertura completa de procedencia ni recuperación exhaustiva. Solo muestra el modelo de datos y las etapas de recuperación documentadas. Las imágenes quedan pendientes de revisión visual, sin OCR automático; las figuras PDF necesitan una revisión visual aparte.",
      repositoryNote:
        "El repositorio de Zurvan es público. El esquema usa etiquetas genéricas y no contiene registros del corpus; el servidor MCP de lectura en Rust conserva un puente de escritura y una referencia alternativa en Python.",
    },
  };
