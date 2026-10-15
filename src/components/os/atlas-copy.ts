import type { Locale } from "@/i18n";

export type AtlasProject =
  "project-simurgh" | "invisible-window-research" | "project-zurvan";

type AtlasCopy = {
  eyebrow: string;
  heading: string;
  selectProject: string;
  openEvidence: string;
  welcomeCaption: string;
  journeyExplore: string;
  journeyReview: string;
  nodeLabels: Record<string, string>;
  projects: Record<AtlasProject, { title: string; summary: string }>;
  diagramDescription: Record<AtlasProject, string>;
  qualifier: Partial<Record<AtlasProject, string>>;
};

const copy: Record<Locale, AtlasCopy> = {
  en: {
    eyebrow: "Proof Atlas · Selected research",
    heading: "Where the evidence connects",
    selectProject: "Select a Research Map",
    openEvidence: "Open Project Evidence",
    welcomeCaption:
      "Three research paths. Each line follows a documented relationship.",
    journeyExplore: "Explore the Lab",
    journeyReview: "Review My Research",
    nodeLabels: {
      agent: "Agent",
      input: "Input",
      context: "Context",
      tool: "Tool gate",
      output: "Output",
      "input-proof": "Receipt",
      "context-proof": "Receipt",
      "tool-proof": "Receipt",
      "output-proof": "Receipt",
      screen: "Physical display",
      visible: "Visible window",
      capture: "Capture path",
      frame: "Captured frame",
      documents: "Documents",
      claim: "Claim",
      concept: "Concept",
      entity: "Entity",
      decision: "Decision",
      vault: "Local store",
      search: "Search",
      neighbors: "Neighbours",
      mcp: "MCP tools",
    },
    projects: {
      "project-simurgh": {
        title: "Project Simurgh",
        summary:
          "An agent passes four defensive boundaries. Each emits signed evidence for an independent offline review.",
      },
      "invisible-window-research": {
        title: "Invisible Window",
        summary:
          "The physical display and the tested capture path can report different states.",
      },
      "project-zurvan": {
        title: "Project Zurvan",
        summary:
          "Documents become typed, linked knowledge that search and agents can retrieve.",
      },
    },
    diagramDescription: {
      "project-simurgh":
        "The agent crosses the input firewall, context-provenance guard, tool-invocation gate, and output-leakage firewall. Each boundary branches to its own signed evidence receipt.",
      "invisible-window-research":
        "Two separate planes compare the physical display, where a window remains visible, with a tested capture path that can exclude it.",
      "project-zurvan":
        "Documents branch into claims, concepts, entities, and decisions; those typed nodes link to a local knowledge store, then to hybrid search, graph-neighbour expansion, and MCP tools.",
    },
    qualifier: {
      "project-simurgh":
        "Architecture schematic based on documented components; no run trace is shown.",
      "invisible-window-research":
        "Controlled simulated configurations only; no commercial proctoring products were tested. macOS 26 used native capture paths.",
      "project-zurvan":
        "This is an illustrative map of documented architecture, not a visualisation of a private corpus.",
    },
  },
  fa: {
    eyebrow: "اطلس شواهد · پژوهش منتخب",
    heading: "پیوند میان شواهد",
    selectProject: "انتخاب نقشه پژوهش",
    openEvidence: "مشاهده شواهد پروژه",
    welcomeCaption: "سه مسیر پژوهشی؛ هر خط یک رابطه مستند را نشان می‌دهد.",
    journeyExplore: "کاوش در آزمایشگاه",
    journeyReview: "مرور پژوهش‌ها",
    nodeLabels: {
      agent: "عامل",
      input: "ورودی",
      context: "زمینه",
      tool: "دروازه ابزار",
      output: "خروجی",
      "input-proof": "رسید",
      "context-proof": "رسید",
      "tool-proof": "رسید",
      "output-proof": "رسید",
      screen: "نمایشگر فیزیکی",
      visible: "پنجره قابل مشاهده",
      capture: "مسیر ضبط",
      frame: "قاب ضبط‌شده",
      documents: "اسناد",
      claim: "ادعا",
      concept: "مفهوم",
      entity: "موجودیت",
      decision: "تصمیم",
      vault: "مخزن محلی",
      search: "جست‌وجو",
      neighbors: "همسایه‌ها",
      mcp: "ابزارهای MCP",
    },
    projects: {
      "project-simurgh": {
        title: "پروژه سیمرغ",
        summary:
          "عامل از چهار مرز دفاعی عبور می‌کند. هر مرز شواهدی امضاشده برای بازبینی مستقل آفلاین ارائه می‌دهد.",
      },
      "invisible-window-research": {
        title: "پنجره نامرئی",
        summary:
          "نمایشگر فیزیکی و مسیر ضبطِ آزموده‌شده ممکن است وضعیت‌های متفاوتی نشان دهند.",
      },
      "project-zurvan": {
        title: "پروژه زروان",
        summary:
          "اسناد به دانش ساختاریافته و پیوندخورده‌ای تبدیل می‌شوند که سامانه‌های جست‌وجو و عامل‌ها می‌توانند بازیابی کنند.",
      },
    },
    diagramDescription: {
      "project-simurgh":
        "عامل از فایروال ورودی، نگهبان منشأ زمینه، دروازه فراخوانی ابزار و فایروال نشت خروجی عبور می‌کند. هر مرز به رسید شواهد امضاشده خود پیوند دارد.",
      "invisible-window-research":
        "دو صفحه جداگانه نمایشگر فیزیکی را که پنجره در آن دیده می‌شود با مسیر ضبط آزموده‌شده‌ای مقایسه می‌کنند که ممکن است آن را حذف کند.",
      "project-zurvan":
        "اسناد به ادعاها، مفاهیم، موجودیت‌ها و تصمیم‌ها شاخه می‌شوند؛ این گره‌های نوع‌دار به مخزن دانش محلی و سپس به جست‌وجوی ترکیبی، گسترش به گره‌های مجاور در گراف و ابزارهای MCP پیوند دارند.",
    },
    qualifier: {
      "project-simurgh":
        "نقشه‌ای از معماری و اجزای مستند است؛ هیچ رد اجرای واقعی نمایش داده نمی‌شود.",
      "invisible-window-research":
        "فقط پیکربندی‌های شبیه‌سازی‌شده کنترل‌شده آزموده شدند؛ محصول تجاری نظارت بر آزمون ارزیابی نشد. در macOS 26 از مسیرهای ضبط بومی استفاده شد.",
      "project-zurvan":
        "این نقشه‌ای نمایشی از معماری مستند است و مخزن خصوصی را نشان نمی‌دهد.",
    },
  },
  ar: {
    eyebrow: "أطلس الأدلة · أبحاث مختارة",
    heading: "روابط الأدلة",
    selectProject: "اختر خريطة بحثية",
    openEvidence: "افتح أدلة المشروع",
    welcomeCaption: "ثلاثة مسارات بحثية؛ يمثّل كل خط علاقة موثقة.",
    journeyExplore: "استكشف المختبر",
    journeyReview: "راجع أبحاثي",
    nodeLabels: {
      agent: "الوكيل",
      input: "الإدخال",
      context: "السياق",
      tool: "بوابة الأدوات",
      output: "الإخراج",
      "input-proof": "إيصال",
      "context-proof": "إيصال",
      "tool-proof": "إيصال",
      "output-proof": "إيصال",
      screen: "الشاشة الفعلية",
      visible: "نافذة مرئية",
      capture: "مسار الالتقاط",
      frame: "الإطار الملتقط",
      documents: "المستندات",
      claim: "ادعاء",
      concept: "مفهوم",
      entity: "كيان",
      decision: "قرار",
      vault: "مخزن محلي",
      search: "بحث",
      neighbors: "الجوار",
      mcp: "أدوات MCP",
    },
    projects: {
      "project-simurgh": {
        title: "مشروع سيمرغ",
        summary:
          "يعبر الوكيل أربعة حدود دفاعية، ويقدّم كل حد دليلاً موقّعاً يمكن لمراجع مستقل التحقق منه دون اتصال.",
      },
      "invisible-window-research": {
        title: "النافذة غير المرئية",
        summary:
          "قد تعرض الشاشة الفعلية ومسار الالتقاط المختبر حالتين مختلفتين.",
      },
      "project-zurvan": {
        title: "مشروع زروان",
        summary:
          "تتحول المستندات إلى معرفة مترابطة ومصنفة يمكن لأنظمة البحث والوكلاء استرجاعها.",
      },
    },
    diagramDescription: {
      "project-simurgh":
        "يعبر الوكيل جدار الإدخال وحارس منشأ السياق وبوابة استدعاء الأدوات وجدار تسرب الإخراج. ويرتبط كل حد بإيصال أدلة موقّع خاص به.",
      "invisible-window-research":
        "تقارن لوحتان منفصلتان بين الشاشة الفعلية، حيث تبقى النافذة مرئية، ومسار التقاط مختبر قد يستبعدها.",
      "project-zurvan":
        "تتفرع المستندات إلى ادعاءات ومفاهيم وكيانات وقرارات؛ وترتبط هذه العقد المصنفة بمخزن معرفة محلي ثم بالبحث الهجين وتوسيع البحث إلى العقد المجاورة في الرسم البياني وأدوات MCP.",
    },
    qualifier: {
      "project-simurgh":
        "مخطط للبنية والمكونات الموثقة؛ لا يعرض سجلاً لتشغيل فعلي.",
      "invisible-window-research":
        "اقتصر الاختبار على إعدادات محاكاة مضبوطة؛ ولم تُختبر منتجات مراقبة تجارية. استخدم macOS 26 مسارات التقاط أصلية.",
      "project-zurvan":
        "هذه خريطة توضيحية للبنية الموثقة وليست عرضاً لمجموعة وثائق خاصة.",
    },
  },
  es: {
    eyebrow: "Atlas de pruebas · Investigación",
    heading: "Conexiones entre evidencias",
    selectProject: "Elige un mapa de investigación",
    openEvidence: "Abrir evidencias del proyecto",
    welcomeCaption:
      "Tres rutas de investigación; cada línea sigue una relación documentada.",
    journeyExplore: "Explorar el laboratorio",
    journeyReview: "Revisar mi investigación",
    nodeLabels: {
      agent: "Agente",
      input: "Entrada",
      context: "Contexto",
      tool: "Puerta de herramientas",
      output: "Salida",
      "input-proof": "Comprobante",
      "context-proof": "Comprobante",
      "tool-proof": "Comprobante",
      "output-proof": "Comprobante",
      screen: "Pantalla física",
      visible: "Ventana visible",
      capture: "Ruta de captura",
      frame: "Fotograma capturado",
      documents: "Documentos",
      claim: "Afirmación",
      concept: "Concepto",
      entity: "Entidad",
      decision: "Decisión",
      vault: "Almacén local",
      search: "Búsqueda",
      neighbors: "Vecinos",
      mcp: "Herramientas MCP",
    },
    projects: {
      "project-simurgh": {
        title: "Proyecto Simurgh",
        summary:
          "Un agente cruza cuatro límites defensivos. Cada uno genera evidencia firmada para una revisión independiente sin conexión.",
      },
      "invisible-window-research": {
        title: "Ventana Invisible",
        summary:
          "La pantalla física y la ruta de captura probada pueden mostrar estados distintos.",
      },
      "project-zurvan": {
        title: "Proyecto Zurvan",
        summary:
          "Los documentos se convierten en conocimiento tipado y enlazado que pueden recuperar la búsqueda y los agentes.",
      },
    },
    diagramDescription: {
      "project-simurgh":
        "El agente cruza el firewall de entrada, el control de procedencia del contexto, la puerta de herramientas y el firewall de salida. Cada límite genera su propio recibo de evidencia firmada.",
      "invisible-window-research":
        "Dos planos separados comparan la pantalla física, donde la ventana sigue visible, con una ruta de captura probada que puede excluirla.",
      "project-zurvan":
        "Los documentos se ramifican en afirmaciones, conceptos, entidades y decisiones; esos nodos tipados enlazan con un almacén local y después con búsqueda híbrida, expansión de vecinos del grafo y herramientas MCP.",
    },
    qualifier: {
      "project-simurgh":
        "Esquema de la arquitectura documentada; no muestra una ejecución real.",
      "invisible-window-research":
        "Solo se probaron configuraciones simuladas y controladas; no se evaluaron productos comerciales. macOS 26 usó rutas de captura nativas.",
      "project-zurvan":
        "Es un mapa ilustrativo de la arquitectura documentada, no una visualización de un corpus privado.",
    },
  },
  zh: {
    eyebrow: "证据图谱 · 精选研究",
    heading: "证据之间的联系",
    selectProject: "选择研究图谱",
    openEvidence: "查看项目证据",
    welcomeCaption: "三条研究路径；每条连线都对应有文档依据的关系。",
    journeyExplore: "探索实验室",
    journeyReview: "查看我的研究",
    nodeLabels: {
      agent: "智能体",
      input: "输入",
      context: "上下文",
      tool: "工具关口",
      output: "输出",
      "input-proof": "回执",
      "context-proof": "回执",
      "tool-proof": "回执",
      "output-proof": "回执",
      screen: "物理显示器",
      visible: "可见窗口",
      capture: "捕获路径",
      frame: "捕获画面",
      documents: "文档",
      claim: "声明",
      concept: "概念",
      entity: "实体",
      decision: "决策",
      vault: "本地知识库",
      search: "检索",
      neighbors: "图邻居",
      mcp: "MCP 工具",
    },
    projects: {
      "project-simurgh": {
        title: "Simurgh 项目",
        summary:
          "智能体经过四道防护边界，每道边界都会生成供独立离线审查的签名证据。",
      },
      "invisible-window-research": {
        title: "隐形窗口",
        summary: "物理显示器与经过测试的捕获路径可能呈现不同状态。",
      },
      "project-zurvan": {
        title: "Zurvan 项目",
        summary: "文档转化为分类并相互关联的知识，供搜索与智能体检索。",
      },
    },
    diagramDescription: {
      "project-simurgh":
        "智能体依次经过输入防火墙、上下文来源防护、工具调用关口和输出防火墙。每道边界都分支生成独立的签名证据回执。",
      "invisible-window-research":
        "两个独立平面对比物理显示器（窗口仍然可见）与可能排除该窗口的已测试捕获路径。",
      "project-zurvan":
        "文档分支提取为声明、概念、实体和决策；这些分类节点连接到本地知识库，再连接混合检索、图邻居扩展和 MCP 工具。",
    },
    qualifier: {
      "project-simurgh": "依据已记录组件绘制的架构示意图，不展示实际运行轨迹。",
      "invisible-window-research":
        "仅测试受控的模拟配置，未测试商业监考产品。macOS 26 使用原生捕获路径。",
      "project-zurvan": "这是基于已记录架构的示意图，不代表任何私有语料库。",
    },
  },
};

export function getAtlasCopy(locale: Locale): AtlasCopy {
  return copy[locale];
}
