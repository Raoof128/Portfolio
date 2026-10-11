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
    eyebrow: "Architecture walkthrough",
    title: "A receipt that can be checked again",
    introduction:
      "Explore the documented containment boundaries and the verification path. This is an illustrative architecture view, not a run trace or a research result.",
    illustrationLabel:
      "Illustrative architecture · no run trace or result shown",
    boundariesLabel: "Select a containment boundary",
    proofPathLabel:
      "Path from a selected boundary to signed evidence and verification",
    detailsTitle: "Boundary explanations",
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
      "The architecture describes metadata-only evidence signed with Ed25519.",
    verifier: "Offline verifier",
    verifierDetail:
      "A producer-independent reviewer can replay decisions offline and check evidence completeness without producer access.",
    sourceNote:
      "The linked VCA repository and reproduction command describe the current agent-containment work. The bundled Simurgh preprint documents an earlier device-integrity stage in the project lineage.",
    repositoryLink: "Current VCA repository",
    reproduceLink: "Reproduce the VCA evidence",
  },
  fa: {
    eyebrow: "مرور معماری",
    title: "رسیدی که می‌توان دوباره بررسی کرد",
    introduction:
      "مرزهای مستند مهار و مسیر راستی‌آزمایی را بررسی کنید. این نمایی توضیحی از معماری است، نه رد اجرای واقعی یا نتیجهٔ پژوهش.",
    illustrationLabel: "معماری توضیحی · بدون نمایش رد اجرا یا نتیجه",
    boundariesLabel: "یک مرز مهار را انتخاب کنید",
    proofPathLabel: "مسیر از مرز انتخاب‌شده تا شواهد امضاشده و راستی‌آزمایی",
    detailsTitle: "توضیح مرزها",
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
      "معماری، شواهد فراداده‌ای و امضاشده با Ed25519 را توصیف می‌کند.",
    verifier: "اعتبارسنج آفلاین",
    verifierDetail:
      "بازبین مستقل از تولیدکننده می‌تواند تصمیم‌ها را آفلاین بازاجرا کند و بدون دسترسی به تولیدکننده، کامل‌بودن شواهد را بسنجد.",
    sourceNote:
      "مخزن VCA و فرمان بازتولیدِ پیوندشده، کار کنونیِ مهار عامل را توضیح می‌دهند. پیش‌چاپ Simurgh همراه سایت، مرحلهٔ قدیمی‌تری از یکپارچگی دستگاه در مسیر تکامل پروژه را ثبت می‌کند.",
    repositoryLink: "مخزن کنونی VCA",
    reproduceLink: "بازتولید شواهد VCA",
  },
  ar: {
    eyebrow: "جولة في البنية المعمارية",
    title: "إيصال يمكن التحقق منه مجددًا",
    introduction:
      "استكشف حدود الاحتواء الموثقة ومسار التحقق. هذا عرض توضيحي للبنية المعمارية، وليس سجل تشغيل أو نتيجة بحثية.",
    illustrationLabel: "بنية توضيحية · لا يعرض سجل تشغيل أو نتيجة",
    boundariesLabel: "اختر حدًا للاحتواء",
    proofPathLabel: "المسار من الحد المحدد إلى الأدلة الموقعة والتحقق",
    detailsTitle: "شرح الحدود",
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
      "تصف البنية أدلة موقعة بـ Ed25519 وتقتصر على البيانات الوصفية.",
    verifier: "مدقق دون اتصال",
    verifierDetail:
      "يمكن لمراجع مستقل عن الجهة المنتجة إعادة تشغيل القرارات دون اتصال والتحقق من اكتمال الأدلة دون الوصول إلى الجهة المنتجة.",
    sourceNote:
      "يصف مستودع VCA المرتبط وأمر إعادة الإنتاج عمل الاحتواء الحالي للوكلاء. أما المسودة المرفقة لمشروع Simurgh فتوثق مرحلة أقدم من سلامة الأجهزة ضمن تطور المشروع.",
    repositoryLink: "مستودع VCA الحالي",
    reproduceLink: "إعادة إنتاج أدلة VCA",
  },
  zh: {
    eyebrow: "架构导览",
    title: "可再次核验的凭证",
    introduction:
      "浏览已记录的遏制边界与核验路径。这是架构示意，不是运行轨迹或研究结果。",
    illustrationLabel: "架构示意 · 未展示运行轨迹或结果",
    boundariesLabel: "选择一个遏制边界",
    proofPathLabel: "从所选边界到签名证据与验证的路径",
    detailsTitle: "边界说明",
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
    signedPackDetail: "该架构描述使用 Ed25519 签名的元数据证据。",
    verifier: "离线验证器",
    verifierDetail:
      "独立于生成方的审查者可以离线重放决策，并在不接触生成方的情况下检查证据是否完整。",
    sourceNote:
      "链接的 VCA 仓库和复现命令描述当前的智能体遏制工作。随附的 Simurgh 预印本记录了项目演进中的早期设备完整性阶段。",
    repositoryLink: "当前 VCA 仓库",
    reproduceLink: "复现 VCA 证据",
  },
  es: {
    eyebrow: "Recorrido por la arquitectura",
    title: "Un recibo que se puede verificar de nuevo",
    introduction:
      "Explore los límites de contención documentados y la ruta de verificación. Es una vista ilustrativa de la arquitectura, no un registro de ejecución ni un resultado de investigación.",
    illustrationLabel: "Arquitectura ilustrativa · sin registros ni resultados",
    boundariesLabel: "Seleccione un límite de contención",
    proofPathLabel:
      "Ruta desde el límite seleccionado hasta la evidencia firmada y su verificación",
    detailsTitle: "Explicación de los límites",
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
      "La arquitectura describe evidencia de metadatos firmada con Ed25519.",
    verifier: "Verificador sin conexión",
    verifierDetail:
      "Una persona revisora independiente del productor puede reproducir las decisiones sin conexión y comprobar que la evidencia esté completa sin acceder al productor.",
    sourceNote:
      "El repositorio de VCA y el comando de reproducción enlazados describen el trabajo actual de contención de agentes. La prepublicación de Simurgh incluida documenta una etapa anterior de integridad de dispositivos en la evolución del proyecto.",
    repositoryLink: "Repositorio actual de VCA",
    reproduceLink: "Reproducir la evidencia de VCA",
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
      "The study reports exclusion in tested Windows 10/11 capture paths that honor the setting.",
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
      sourceDetail: "Markdown · PDF · TXT · images",
      retrievalNode: "Hybrid retrieval",
      retrievalDetail:
        "FTS5 + semantic search · optional graph-neighbour expansion",
      consumerNode: "MCP context",
      consumerDetail: "Search and context tools for an agent",
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
        "This schematic does not claim complete source fidelity, provenance coverage, or retrieval recall. It shows the documented data model and retrieval stages only.",
      repositoryNote:
        "Zurvan’s repository is private; this public-facing schema uses generic labels and contains no corpus records.",
    },
    fa: {
      eyebrow: "دانش و بازیابی",
      title: "یک ایدهٔ نوع‌دار را از منبع تا زمینهٔ عامل دنبال کنید",
      introduction:
        "یک نوع دانش را انتخاب کنید تا رابطهٔ شماتیک آن از سند منبع تا بازیابی روشن شود. برچسب‌های زیر معماری را توضیح می‌دهند، نه نمونه‌ای از پیکرهٔ خصوصی.",
      illustrationLabel:
        "طرح‌وارهٔ توضیحی · بدون نمایش رکوردهای پیکره یا نتیجهٔ بازیابی",
      sourceNode: "سند منبع",
      sourceDetail: "Markdown · PDF · TXT · تصویرها",
      retrievalNode: "بازیابی ترکیبی",
      retrievalDetail: "FTS5 + جست‌وجوی معنایی · گسترش اختیاری همسایه‌های گراف",
      consumerNode: "زمینهٔ MCP",
      consumerDetail: "ابزارهای جست‌وجو و زمینه برای عامل",
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
        "این طرح‌واره کامل‌بودن وفاداری به منبع، پوشش منشأ یا یادآوری بازیابی را ادعا نمی‌کند؛ فقط مدل داده و مراحل مستند بازیابی را نشان می‌دهد.",
      repositoryNote:
        "مخزن Zurvan خصوصی است؛ این طرح‌وارهٔ عمومی از برچسب‌های کلی استفاده می‌کند و رکوردی از پیکره ندارد.",
    },
    ar: {
      eyebrow: "المعرفة والاسترجاع",
      title: "تتبّع فكرة مصنّفة من المصدر إلى سياق الوكيل",
      introduction:
        "اختر نوعًا معرفيًا لتتبّع علاقته التخطيطية من مستند المصدر مرورًا بالاسترجاع. تصف التسميات أدناه البنية، لا مثالًا من مدونة خاصة.",
      illustrationLabel: "مخطط توضيحي · لا يعرض سجلات مدونة أو نتائج استرجاع",
      sourceNode: "مستند مصدر",
      sourceDetail: "Markdown · PDF · TXT · صور",
      retrievalNode: "استرجاع هجين",
      retrievalDetail: "FTS5 + بحث دلالي · توسيع اختياري لجيران الرسم البياني",
      consumerNode: "سياق MCP",
      consumerDetail: "أدوات البحث والسياق للوكيل",
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
        "لا يدّعي هذا المخطط اكتمال الأمانة للمصادر أو تغطية المنشأ أو استدعاء الاسترجاع. بل يعرض نموذج البيانات ومراحل الاسترجاع الموثقة فقط.",
      repositoryNote:
        "مستودع Zurvan خاص؛ يستخدم هذا المخطط العام تسميات عامة ولا يتضمن سجلات من المدونة.",
    },
    zh: {
      eyebrow: "知识与检索",
      title: "追踪一个类型化知识点，从来源到智能体上下文",
      introduction:
        "选择一种知识类型，查看它从来源文档到检索的示意关系。以下标签描述架构，不包含私有语料示例。",
      illustrationLabel: "示意架构 · 未展示语料记录或检索结果",
      sourceNode: "来源文档",
      sourceDetail: "Markdown · PDF · TXT · 图像",
      retrievalNode: "混合检索",
      retrievalDetail: "FTS5 + 语义搜索 · 可选图邻居扩展",
      consumerNode: "MCP 上下文",
      consumerDetail: "供智能体使用的搜索与上下文工具",
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
        "此示意不声称完整保留来源、完整覆盖溯源关系或达到完整检索召回；它只展示文档所述的数据模型和检索阶段。",
      repositoryNote:
        "Zurvan 仓库为私有；此公开架构使用通用标签，不包含语料记录。",
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
      sourceDetail: "Markdown · PDF · TXT · imágenes",
      retrievalNode: "Recuperación híbrida",
      retrievalDetail:
        "FTS5 + búsqueda semántica · expansión opcional de vecinos del grafo",
      consumerNode: "Contexto MCP",
      consumerDetail: "Herramientas de búsqueda y contexto para un agente",
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
        "Este esquema no afirma fidelidad completa a las fuentes, cobertura completa de procedencia ni recuperación exhaustiva. Solo muestra el modelo de datos y las etapas de recuperación documentadas.",
      repositoryNote:
        "El repositorio de Zurvan es privado; este esquema público usa etiquetas genéricas y no contiene registros del corpus.",
    },
  };
