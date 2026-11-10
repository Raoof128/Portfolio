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

// Sources for the figures quoted here (checked 11 Nov 2026):
// Simurgh: README "Measured results" (Phase 17 transfer study) and
// docs/research/provenance-phase-19j (frozen-gate replay of recorded proposals, 10 Nov 2026).
// Invisible Window: the IEEE-format preprint and its vendor disclosures.
// Zurvan: README capability table (MCP read-only by default, opt-in write mode, audit traces).
const copy: Record<Locale, AtlasCopy> = {
  en: {
    eyebrow: "Proof Atlas · Selected research",
    heading: "Where the evidence connects",
    selectProject: "Select a Research Map",
    openEvidence: "Open Project Evidence",
    welcomeCaption:
      "Three research paths. Each line follows a documented relationship.",
    journeyExplore: "Explore the Lab",
    journeyReview: "Review My Projects",
    nodeLabels: {
      proposal: "Proposal",
      host: "Host state",
      gate: "Composed gate",
      receiver: "Receiver",
      blocked: "Blocked",
      snapshot: "Snapshot",
      replay: "Offline replay",
      window: "Flagged window",
      compositor: "Compositor",
      screen: "Physical display",
      capture: "Capture path",
      documents: "Documents",
      claim: "Claim",
      concept: "Concept",
      entity: "Entity",
      decision: "Decision",
      vault: "Local store",
      search: "Search",
      neighbors: "Neighbours",
      mcp: "MCP tools",
      write: "Opt-in write",
      trace: "Audit trace",
    },
    projects: {
      "project-simurgh": {
        title: "Project Simurgh",
        summary:
          "Oct 2026 matched controls: Llama-3.2-3B restricted trials with new effects 17/24 → 0/24, useful completions 23/24; gpt-6-luna baseline 0/24, no incremental protection. Nov 2026 replay: of 269 recorded restricted-state sends, 0 landed behind composed controls and 220 behind the credential gate alone.",
      },
      "invisible-window-research": {
        title: "Invisible Window",
        summary:
          "One flagged window, two outputs: documented display-affinity APIs on Windows and macOS keep it on the monitor while the tested capture path receives none of its pixels.",
      },
      "project-zurvan": {
        title: "Project Zurvan",
        summary:
          "Documents become typed, linked knowledge that agents search over MCP. Writing back to the store is opt-in, and retrieval can leave a replayable local trace.",
      },
    },
    diagramDescription: {
      "project-simurgh":
        "Current control boundary: a model's tool proposal and trusted host state (delegation, stop, lease and credential) meet at a composed authorisation gate. An admitted action reaches an owned receiver; a restricted one is blocked. The gate's decision record and the receiver's snapshots feed an archive that replays offline. This is a schematic, not a run trace.",
      "invisible-window-research":
        "A window flagged through a documented display-affinity API passes through the operating-system compositor, which feeds two outputs: the physical display, where the window stays visible, and the tested capture path, whose frame leaves it out.",
      "project-zurvan":
        "Documents branch into claims, concepts, entities, and decisions; those typed nodes link to a local knowledge store, then to hybrid search, graph-neighbour expansion, and MCP tools. A dashed return path marks opt-in writes from MCP tools back to the store, and retrieval can write a local audit trace.",
    },
    qualifier: {
      "project-simurgh":
        "Schematic of the documented control boundary, not a run trace. The credential-only arm cannot see stop, lease or alert state, so part of the gap holds by construction. The replay used recorded proposals from three small local models; no model was asked to defeat the gate.",
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
    journeyReview: "مرور پروژه‌ها",
    nodeLabels: {
      proposal: "پیشنهاد",
      host: "وضعیت میزبان",
      gate: "دروازه ترکیبی",
      receiver: "گیرنده",
      blocked: "مسدود",
      snapshot: "تصویر لحظه‌ای",
      replay: "بازپخش آفلاین",
      window: "پنجره نشان‌دار",
      compositor: "ترکیب‌گر",
      screen: "نمایشگر فیزیکی",
      capture: "مسیر ضبط",
      documents: "اسناد",
      claim: "ادعا",
      concept: "مفهوم",
      entity: "موجودیت",
      decision: "تصمیم",
      vault: "مخزن محلی",
      search: "جست‌وجو",
      neighbors: "همسایه‌ها",
      mcp: "ابزارهای MCP",
      write: "نوشتن اختیاری",
      trace: "رد ممیزی",
    },
    projects: {
      "project-simurgh": {
        title: "پروژه سیمرغ",
        summary:
          "کنترل‌های همسان، اکتبر 2026: آزمون‌های محدود Llama-3.2-3B با آثار تازه از 17/24 به 0/24؛ تکمیل مفید 23/24. خط پایهٔ gpt-6-luna برابر 0/24 بود؛ حفاظت افزوده‌ای گزارش نشد. بازپخش نوامبر 2026: از 269 ارسالِ ثبت‌شده در وضعیت محدود، پشت کنترل‌های ترکیبی هیچ‌کدام اثر نگذاشت و پشت دروازهٔ اعتبارنامه به‌تنهایی 220 مورد اثر گذاشت.",
      },
      "invisible-window-research": {
        title: "پنجره نامرئی",
        summary:
          "یک پنجرهٔ نشان‌دار، دو خروجی: APIهای مستند نمایش در Windows و macOS پنجره را روی نمایشگر نگه می‌دارند، اما مسیر ضبطِ آزموده‌شده هیچ پیکسلی از آن دریافت نمی‌کند.",
      },
      "project-zurvan": {
        title: "پروژه زروان",
        summary:
          "اسناد به دانش ساختاریافته و پیوندخورده‌ای تبدیل می‌شوند که عامل‌ها از راه MCP در آن جست‌وجو می‌کنند. نوشتن در مخزن اختیاری است و بازیابی می‌تواند ردی محلی و قابل بازپخش به جا بگذارد.",
      },
    },
    diagramDescription: {
      "project-simurgh":
        "مرز کنترل کنونی: پیشنهاد ابزارِ مدل و وضعیت مورد اعتماد میزبان (تفویض، توقف، مهلت و اعتبارنامه) در دروازهٔ مجوز ترکیبی به هم می‌رسند. اقدام پذیرفته‌شده به گیرندهٔ تحت مالکیت می‌رسد و اقدام محدود مسدود می‌شود. سابقهٔ تصمیم دروازه و تصویرهای لحظه‌ای گیرنده به بایگانی‌ای می‌روند که آفلاین بازپخش می‌شود. این نمودار طرح‌واره است؛ رد اجرا نیست.",
      "invisible-window-research":
        "پنجره‌ای که با API مستند نمایش نشان‌دار شده از ترکیب‌گر سیستم‌عامل می‌گذرد و به دو خروجی می‌رسد: نمایشگر فیزیکی که پنجره در آن دیده می‌شود و مسیر ضبط آزموده‌شده که قاب آن پنجره را ندارد.",
      "project-zurvan":
        "اسناد به ادعاها، مفاهیم، موجودیت‌ها و تصمیم‌ها شاخه می‌شوند؛ این گره‌های نوع‌دار به مخزن دانش محلی و سپس به جست‌وجوی ترکیبی، گسترش به گره‌های مجاور در گراف و ابزارهای MCP پیوند دارند. مسیر برگشتِ خط‌چین، نوشتن اختیاری از ابزارهای MCP به مخزن را نشان می‌دهد و بازیابی می‌تواند رد ممیزی محلی بنویسد.",
    },
    qualifier: {
      "project-simurgh":
        "طرح‌وارهٔ مرز کنترل مستند است؛ رد اجرا نیست. شاخهٔ «فقط اعتبارنامه» وضعیت توقف، مهلت و هشدار را نمی‌بیند، پس بخشی از این فاصله از خودِ طراحی می‌آید. بازپخش از پیشنهادهای ثبت‌شدهٔ سه مدل کوچک محلی استفاده کرد و از هیچ مدلی خواسته نشد دروازه را دور بزند.",
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
    journeyReview: "راجع مشاريعي",
    nodeLabels: {
      proposal: "الاقتراح",
      host: "حالة المضيف",
      gate: "البوابة المركّبة",
      receiver: "المستقبِل",
      blocked: "محظور",
      snapshot: "لقطة",
      replay: "إعادة تشغيل محلية",
      window: "نافذة موسومة",
      compositor: "المُركِّب",
      screen: "الشاشة الفعلية",
      capture: "مسار الالتقاط",
      documents: "المستندات",
      claim: "ادعاء",
      concept: "مفهوم",
      entity: "كيان",
      decision: "قرار",
      vault: "مخزن محلي",
      search: "بحث",
      neighbors: "الجوار",
      mcp: "أدوات MCP",
      write: "كتابة اختيارية",
      trace: "سجل تدقيق",
    },
    projects: {
      "project-simurgh": {
        title: "مشروع سيمرغ",
        summary:
          "ضوابط مقارنة متطابقة، أكتوبر 2026: تجارب Llama-3.2-3B المقيّدة ذات آثار جديدة 17/24 → 0/24، وإكمال مفيد 23/24؛ خط أساس gpt-6-luna هو 0/24، دون حماية إضافية. إعادة تشغيل نوفمبر 2026: من 269 إرسالًا مسجّلًا في حالة مقيّدة، لم يُحدث أيٌّ منها أثرًا خلف الضوابط المركّبة، وأحدث 220 أثرًا خلف بوابة بيانات الاعتماد وحدها.",
      },
      "invisible-window-research": {
        title: "النافذة غير المرئية",
        summary:
          "نافذة موسومة واحدة ومخرجان: واجهات عرض موثّقة في Windows وmacOS تُبقي النافذة على الشاشة، بينما لا يتلقى مسار الالتقاط المختبر أي بكسل منها.",
      },
      "project-zurvan": {
        title: "مشروع زروان",
        summary:
          "تتحول المستندات إلى معرفة مترابطة ومصنفة يبحث فيها الوكلاء عبر MCP. الكتابة إلى المخزن اختيارية، ويمكن أن يترك الاسترجاع سجلًا محليًا قابلًا لإعادة التشغيل.",
      },
    },
    diagramDescription: {
      "project-simurgh":
        "حدّ التحكم الحالي: يلتقي اقتراح الأداة الصادر عن النموذج وحالة المضيف الموثوقة (التفويض والإيقاف والمهلة وبيانات الاعتماد) عند بوابة تفويض مركّبة. يصل الفعل المقبول إلى مستقبِل مملوك، ويُحظر الفعل المقيّد. يغذّي سجل قرار البوابة ولقطات المستقبِل أرشيفًا يُعاد تشغيله دون اتصال. هذا مخطط توضيحي وليس سجل تشغيل.",
      "invisible-window-research":
        "نافذة موسومة عبر واجهة عرض موثّقة تمر بمُركِّب نظام التشغيل الذي يغذّي مخرجين: الشاشة الفعلية حيث تبقى النافذة مرئية، ومسار الالتقاط المختبر الذي يخلو إطاره منها.",
      "project-zurvan":
        "تتفرع المستندات إلى ادعاءات ومفاهيم وكيانات وقرارات؛ وترتبط هذه العقد المصنفة بمخزن معرفة محلي ثم بالبحث الهجين وتوسيع البحث إلى العقد المجاورة في الرسم البياني وأدوات MCP. يمثّل مسار العودة المتقطع الكتابة الاختيارية من أدوات MCP إلى المخزن، ويمكن أن يكتب الاسترجاع سجل تدقيق محليًا.",
    },
    qualifier: {
      "project-simurgh":
        "مخطط لحدّ التحكم الموثّق وليس سجل تشغيل. ذراع «بيانات الاعتماد فقط» لا يرى حالة الإيقاف أو المهلة أو التنبيه، لذا يعود جزء من الفارق إلى التصميم نفسه. استخدمت إعادة التشغيل اقتراحات مسجّلة من ثلاثة نماذج محلية صغيرة، ولم يُطلب من أي نموذج تجاوز البوابة.",
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
    journeyReview: "Revisar mis proyectos",
    nodeLabels: {
      proposal: "Propuesta",
      host: "Estado del anfitrión",
      gate: "Puerta compuesta",
      receiver: "Receptor",
      blocked: "Bloqueado",
      snapshot: "Instantánea",
      replay: "Reproducción local",
      window: "Ventana marcada",
      compositor: "Compositor",
      screen: "Pantalla física",
      capture: "Ruta de captura",
      documents: "Documentos",
      claim: "Afirmación",
      concept: "Concepto",
      entity: "Entidad",
      decision: "Decisión",
      vault: "Almacén local",
      search: "Búsqueda",
      neighbors: "Vecinos",
      mcp: "Herramientas MCP",
      write: "Escritura opcional",
      trace: "Traza de auditoría",
    },
    projects: {
      "project-simurgh": {
        title: "Proyecto Simurgh",
        summary:
          "Controles emparejados, oct. 2026: ensayos restringidos con efectos nuevos en Llama-3.2-3B 17/24 → 0/24, tareas útiles completadas 23/24; base gpt-6-luna 0/24, sin protección incremental. Reproducción de nov. 2026: de 269 envíos registrados en estado restringido, ninguno surtió efecto tras los controles compuestos y 220 lo hicieron tras la puerta de credenciales sola.",
      },
      "invisible-window-research": {
        title: "Ventana Invisible",
        summary:
          "Una ventana marcada, dos salidas: APIs de pantalla documentadas en Windows y macOS la mantienen en el monitor mientras la ruta de captura probada no recibe ninguno de sus píxeles.",
      },
      "project-zurvan": {
        title: "Proyecto Zurvan",
        summary:
          "Los documentos se convierten en conocimiento tipado y enlazado que los agentes consultan mediante MCP. Escribir en el almacén es opcional, y la recuperación puede dejar una traza local reproducible.",
      },
    },
    diagramDescription: {
      "project-simurgh":
        "Límite de control actual: la propuesta de herramienta del modelo y el estado de confianza del anfitrión (delegación, parada, vigencia y credenciales) se encuentran en una puerta de autorización compuesta. Una acción admitida llega a un receptor propio; una restringida queda bloqueada. El registro de decisión de la puerta y las instantáneas del receptor alimentan un archivo que se reproduce sin conexión. Es un esquema, no una traza de ejecución.",
      "invisible-window-research":
        "Una ventana marcada mediante una API de pantalla documentada pasa por el compositor del sistema operativo, que alimenta dos salidas: la pantalla física, donde la ventana sigue visible, y la ruta de captura probada, cuyo fotograma la omite.",
      "project-zurvan":
        "Los documentos se ramifican en afirmaciones, conceptos, entidades y decisiones; esos nodos tipados enlazan con un almacén local y después con búsqueda híbrida, expansión de vecinos del grafo y herramientas MCP. Una ruta de retorno discontinua marca la escritura opcional desde las herramientas MCP al almacén, y la recuperación puede escribir una traza de auditoría local.",
    },
    qualifier: {
      "project-simurgh":
        "Esquema del límite de control documentado, no una traza de ejecución. El brazo de solo credenciales no ve el estado de parada, vigencia ni alerta, así que parte de la diferencia se debe al propio diseño. La reproducción usó propuestas registradas de tres modelos locales pequeños; a ningún modelo se le pidió vencer la puerta.",
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
    journeyReview: "查看我的项目",
    nodeLabels: {
      proposal: "提案",
      host: "主机状态",
      gate: "组合关口",
      receiver: "接收端",
      blocked: "已拦截",
      snapshot: "快照",
      replay: "离线重放",
      window: "已标记窗口",
      compositor: "合成器",
      screen: "物理显示器",
      capture: "捕获路径",
      documents: "文档",
      claim: "声明",
      concept: "概念",
      entity: "实体",
      decision: "决策",
      vault: "本地知识库",
      search: "检索",
      neighbors: "图邻居",
      mcp: "MCP 工具",
      write: "可选写入",
      trace: "审计轨迹",
    },
    projects: {
      "project-simurgh": {
        title: "Simurgh 项目",
        summary:
          "2026 年 10 月匹配对照：Llama-3.2-3B 受限状态中新产生效果的试验由 17/24 降至 0/24，有用任务完成 23/24；gpt-6-luna 基线已为 0/24，未见额外保护。2026 年 11 月重放：在 269 次已记录的受限状态发送中，组合控制之后无一产生效果，仅凭证关口之后有 220 次产生效果。",
      },
      "invisible-window-research": {
        title: "隐形窗口",
        summary:
          "一个已标记窗口，两路输出：Windows 和 macOS 上有文档支持的显示 API 让窗口留在显示器上，而经过测试的捕获路径收不到它的任何像素。",
      },
      "project-zurvan": {
        title: "Zurvan 项目",
        summary:
          "文档转化为分类并相互关联的知识，供智能体通过 MCP 检索。写回知识库需要主动开启，检索可以留下可重放的本地轨迹。",
      },
    },
    diagramDescription: {
      "project-simurgh":
        "当前控制边界：模型的工具提案与受信任的主机状态（委托、停止、租约和凭证）在组合授权关口汇合。获准的操作到达自有接收端，受限的操作被拦截。关口的决策记录与接收端快照汇入可离线重放的归档。这是示意图，不是运行轨迹。",
      "invisible-window-research":
        "通过有文档支持的显示 API 标记的窗口经过操作系统合成器，合成器送出两路输出：窗口仍然可见的物理显示器，以及画面中没有该窗口的已测试捕获路径。",
      "project-zurvan":
        "文档分支提取为声明、概念、实体和决策；这些分类节点连接到本地知识库，再连接混合检索、图邻居扩展和 MCP 工具。虚线回路表示从 MCP 工具到知识库的可选写入，检索可以写入本地审计轨迹。",
    },
    qualifier: {
      "project-simurgh":
        "这是已记录控制边界的示意图，不是运行轨迹。仅凭证对照组看不到停止、租约或告警状态，因此部分差距源于设计本身。重放使用三个小型本地模型的已记录提案；没有要求任何模型去攻破关口。",
      "invisible-window-research":
        "仅测试受控的模拟配置，未测试商业监考产品。macOS 26 使用原生捕获路径。",
      "project-zurvan": "这是基于已记录架构的示意图，不代表任何私有语料库。",
    },
  },
};

export function getAtlasCopy(locale: Locale): AtlasCopy {
  return copy[locale];
}
