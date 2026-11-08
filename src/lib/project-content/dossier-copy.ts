import type { Locale } from "@/i18n";

/** Reader guidance derived from the published project descriptions; no new results. */
export const dossierCopy = {
  en: {
    readingPath: "Read the research",
    contribution: "My contribution",
    limitations: "Scope and limitations",
    sources: "Sources",
    htmlSummary: "Read the HTML research summary",
    pdfNote:
      "The original research PDFs may lack accessibility tags. The HTML overview and evidence provide a text summary, not a complete alternative to the papers.",
    scope: {
      "project-simurgh":
        "October 2026 transfer study: 24 tasks, two trials each, three matched controls (credential-only, composed, deny-all) and two models; 288 replayed branches. Llama-3.2-3B restricted-state effects fell from 17/24 to 0/24 with 23/24 useful completions; gpt-6-luna baseline was already 0/24, so its result is null. The 24 restricted trials form six state clusters; per-state Wilson 95% intervals are 43.6–97.0% versus 0.0–39.0%, and part of the gap holds by construction. A separate eight-case OpenAI workflow run initially declined 8/8 because of role placement; the frozen correction completed 2/3 authorised cases and declined 5/5 restricted cases, with one refusal still open. The gate checks 39 Lean 4 proof files for selected mathematical models; those proofs do not establish implementation equivalence. The 19 October 2026 smoke run passed 5,171 root tests. Current study archives use SHA-256 and need native Linux x86_64 with Python 3.12 for full replay; earlier attestations use Ed25519. These are scoped records, not universal safety. Earlier classifier/AgentDojo results and the four-boundary schematic are frozen-stage evidence. Software DOI 10.5281/zenodo.21737792 is distinct from device-integrity preprint DOI 10.5281/zenodo.20374849.",
      "project-zurvan":
        "The source repository is public and includes a Rust MCP read server with Python writes/reference fallback. The 20 October 2026 merged-main receipt reports 3,334 passed, 1 failed and 8 skipped; Z1b sealed-evaluation closure remains open. Suite counts and integration receipts are dated development evidence, not retrieval-quality scores. Images remain pending-visual stubs, and PDF figures are not automatically transcribed. Local storage does not guarantee offline LLM extraction: external processing depends on the configured provider.",
      "invisible-window-research":
        "The results cover controlled, simulated Windows and macOS configurations as of March 2026. Commercial proctoring products and Linux were not tested. The macOS 26 checks used native capture, not browser getDisplayMedia() or a direct ScreenCaptureKit test; behavioural detection results came from a small sample.",
      aion: "The reported 40-question v3 pilot scores retrieval on 34 answerable questions and tests 6 refusal cases. Recall@5 is 0.941, mean citation_support 0.978 and refusals 6/6. A single Gemini 3.1 Flash Lite judge found no answer rows with citation_support < 0.5, but two partial/wrong-citation rows remained at 0.75 and 0.50. This is not a guarantee of correct or hallucination-free answers; check the underlying scripture. Chat credentials use server-side secrets, while optional native voice expects a client-provided OpenAI credential outside that isolation boundary.",
    },
  },
  fa: {
    readingPath: "مسیر مطالعهٔ پژوهش",
    contribution: "سهم من در پروژه",
    limitations: "دامنه و محدودیت‌ها",
    sources: "منابع",
    htmlSummary: "مطالعهٔ خلاصهٔ پژوهش در HTML",
    pdfNote:
      "PDFهای اصلی پژوهش ممکن است برچسب‌های دسترس‌پذیری نداشته باشند. مرور و شواهد HTML خلاصهٔ متنی‌اند، نه جایگزین کامل مقاله‌ها.",
    scope: {
      "project-simurgh":
        "پژوهش انتقال اکتبر 2026: 24 وظیفه، هرکدام دو بار، سه کنترل همسان (فقط اعتبارنامه، ترکیبی و رد همه) و دو مدل؛ 288 شاخهٔ بازاجراشده. آثار تازه در حالت محدود Llama-3.2-3B از 17/24 به 0/24 رسید و 23/24 تکمیل مفید حفظ شد؛ خط پایهٔ gpt-6-luna از ابتدا 0/24 بود، پس نتیجهٔ آن بدون اثر افزوده است. 24 آزمون محدود در شش خوشهٔ وضعیت قرار دارند؛ فاصله‌های Wilson 95% برای هر وضعیت 43.6–97.0% در برابر 0.0–39.0% است و بخشی از تفاوت به‌واسطهٔ طراحی برقرار است. در ثبت جداگانهٔ هشت‌موردی OpenAI، خطای جایگاه نقش ابتدا به رد 8/8 مورد انجامید؛ اصلاح تثبیت‌شده 2/3 مورد مجاز را تکمیل و 5/5 مورد محدود را رد کرد و یک امتناع هنوز حل نشده است. دروازه، 39 فایل اثبات Lean 4 برای مدل‌های ریاضی منتخب را بررسی می‌کند؛ این اثبات‌ها هم‌ارزی پیاده‌سازی را ثابت نمی‌کنند. اجرای اولیهٔ 19 اکتبر 2026، تعداد 5,171 آزمون بستهٔ اصلی را گذراند. بایگانی پژوهش کنونی SHA-256 دارد و بازاجرای کامل به Linux x86_64 بومی با Python 3.12 نیاز دارد؛ گواهی‌های مراحل پیشین از Ed25519 استفاده می‌کنند. این ثبت‌ها محدودند، نه تضمین ایمنی همگانی. نتایج قدیمی دسته‌بند و AgentDojo و نمودار چهارمرزی شواهد مرحلهٔ تثبیت‌شده‌اند. DOI نرم‌افزار 10.5281/zenodo.21737792 با پیش‌چاپ یکپارچگی دستگاه 10.5281/zenodo.20374849 متفاوت است.",
      "project-zurvan":
        "مخزن کد عمومی است و سرور خواندن MCP با Rust را همراه نوشتن و مرجع جایگزین Python دارد. ثبت شاخهٔ اصلی ادغام‌شده در 20 اکتبر 2026، تعداد 3,334 موفق، 1 ناموفق و 8 آزمون اجرا نشده را گزارش می‌کند؛ ارزیابی مهروموم‌شدهٔ Z1b هنوز نهایی نشده است. شمار آزمون و ثبت یکپارچه‌سازی، شواهد توسعهٔ تاریخ‌دارند، نه نمرهٔ کیفیت بازیابی. تصویرها در انتظار بررسی بصری می‌مانند و شکل‌های PDF خودکار رونویسی نمی‌شوند. ذخیرهٔ محلی، استخراج آفلاین LLM را تضمین نمی‌کند؛ پردازش بیرونی به ارائه‌دهندهٔ پیکربندی‌شده بستگی دارد.",
      "invisible-window-research":
        "نتایج به پیکربندی‌های کنترل‌شده و شبیه‌سازی‌شدهٔ Windows و macOS تا مارس ۲۰۲۶ محدودند. محصولات تجاری نظارت و Linux آزموده نشدند. بررسی‌های macOS 26 از ضبط بومی استفاده کردند، نه getDisplayMedia() مرورگر یا آزمون مستقیم ScreenCaptureKit؛ نمونهٔ بررسی تشخیص رفتاری کوچک بود.",
      aion: "مطالعهٔ مقدماتی v3 با 40 پرسش، بازیابی را روی 34 پرسش پاسخ‌پذیر و 6 مورد امتناع می‌سنجد. Recall@5 برابر 0.941، میانگین citation_support برابر 0.978 و امتناع 6/6 است. تنها داور Gemini 3.1 Flash Lite هیچ ردیف پاسخی با citation_support < 0.5 گزارش نکرد، اما دو ردیف ارجاع ناقص یا نادرست با نمرهٔ 0.75 و 0.50 باقی ماند. این تضمین درستی یا نبود توهم نیست؛ متن اصلی را بررسی کنید. اعتبارنامه‌های گفت‌وگو در رازهای سمت سرورند، اما صدای بومی اختیاری به اعتبارنامهٔ OpenAI در کلاینت و بیرون از آن مرز جداسازی نیاز دارد.",
    },
  },
  ar: {
    readingPath: "مسار قراءة البحث",
    contribution: "مساهمتي",
    limitations: "النطاق والقيود",
    sources: "المصادر",
    htmlSummary: "قراءة ملخص البحث بصيغة HTML",
    pdfNote:
      "قد تفتقر ملفات PDF البحثية الأصلية إلى وسوم الإتاحة. يقدم العرض والأدلة بصيغة HTML ملخصًا نصيًا، وليس بديلًا كاملًا للأوراق.",
    scope: {
      "project-simurgh":
        "دراسة النقل في أكتوبر 2026: 24 مهمة بتجربتين لكل منها وثلاثة ضوابط مقارنة متطابقة (بيانات الاعتماد فقط، والمركبة، ورفض الجميع) ونموذجين؛ 288 فرعًا أُعيد تشغيله. انخفضت آثار Llama-3.2-3B المقيّدة من 17/24 إلى 0/24 مع 23/24 إكمالًا مفيدًا؛ خط أساس gpt-6-luna كان أصلًا 0/24، فالنتيجة دون أثر إضافي. التجارب المقيّدة الأربع والعشرون موزعة على ست مجموعات حالات؛ فترات Wilson 95% لكل حالة هي 43.6–97.0% مقابل 0.0–39.0%، وجزء من الفارق قائم بحكم التصميم. رفض تسجيل OpenAI منفصل من ثماني حالات 8/8 أولًا بسبب موضع الدور؛ وأكمل التصحيح المجمّد 2/3 حالات مأذونة ورفض 5/5 حالات مقيّدة، وما زال رفض واحد مفتوحًا. تفحص البوابة 39 ملف إثبات في Lean 4 لنماذج رياضية مختارة؛ ولا تثبت تكافؤ التنفيذ. نجح 5,171 اختبارًا في حزمة المشروع الرئيسية في فحص 19 أكتوبر 2026. تستخدم أرشيفات الدراسة الحالية SHA-256 وتتطلب إعادة التشغيل الكاملة Linux x86_64 أصليًا مع Python 3.12؛ وتستخدم التصديقات السابقة Ed25519. هذه سجلات محدودة وليست ضمان سلامة عامة. نتائج المصنف وAgentDojo الأقدم والمخطط ذو الحدود الأربعة أدلة مرحلة مجمّدة. DOI البرنامج 10.5281/zenodo.21737792 يختلف عن مسودة سلامة الأجهزة 10.5281/zenodo.20374849.",
      "project-zurvan":
        "مستودع المصدر عام، ويضم خادم قراءة MCP بلغة Rust مع كتابة ومرجع بديل بلغة Python. يسجّل فحص الفرع الرئيسي بعد الدمج في 20 أكتوبر 2026 عدد 3,334 اختبارًا ناجحًا و1 فاشلًا و8 اختبارات متخطّاة؛ ولم يُغلق تقييم Z1b المختوم بعد. أعداد الاختبارات وإيصالات التكامل أدلة تطوير مؤرخة وليست درجات جودة استرجاع. تبقى الصور معلّقة للفحص البصري ولا تُنسخ أشكال PDF آليًا. لا يضمن التخزين المحلي استخراج LLM دون اتصال؛ فالمعالجة الخارجية تعتمد على المزوّد المضبوط.",
      "invisible-window-research":
        "تغطي النتائج إعدادات Windows وmacOS مضبوطة ومحاكاة حتى مارس ٢٠٢٦. لم تُختبر منتجات المراقبة التجارية أو Linux. استخدمت فحوص macOS 26 التقاطًا أصليًا، وليس getDisplayMedia() في المتصفح أو اختبارًا مباشرًا لـScreenCaptureKit؛ وكانت عينة كشف السلوك صغيرة.",
      aion: "يقيس اختبار v3 التجريبي من 40 سؤالًا الاسترجاع على 34 سؤالًا قابلًا للإجابة و6 حالات رفض. Recall@5 يساوي 0.941 ومتوسط citation_support يساوي 0.978 والرفض 6/6. لم يسجّل المحكّم الوحيد Gemini 3.1 Flash Lite أي صف إجابة مع citation_support < 0.5، لكن بقي صفّان باستشهاد جزئي أو خاطئ بدرجتي 0.75 و0.50. لا يضمن ذلك الإجابات الصحيحة أو الخالية من الهلوسة؛ راجع النص الأصلي. تستخدم بيانات اعتماد المحادثة أسرار الخادم، بينما يتطلب الصوت الأصلي الاختياري بيانات اعتماد OpenAI لدى العميل خارج حد العزل هذا.",
    },
  },
  es: {
    readingPath: "Leer la investigación",
    contribution: "Mi contribución",
    limitations: "Alcance y limitaciones",
    sources: "Fuentes",
    htmlSummary: "Leer el resumen de investigación en HTML",
    pdfNote:
      "Los PDF de investigación originales pueden carecer de etiquetas de accesibilidad. La descripción y las evidencias en HTML ofrecen un resumen textual, no una alternativa completa a los artículos.",
    scope: {
      "project-simurgh":
        "Estudio de transferencia de octubre de 2026: 24 tareas, dos ensayos cada una, tres controles emparejados (solo credenciales, compuesto y denegar todo) y dos modelos; 288 ramas repetidas. Los efectos restringidos de Llama-3.2-3B bajaron de 17/24 a 0/24 con 23/24 tareas útiles completadas; la base de gpt-6-luna ya era 0/24, por lo que su resultado es nulo. Los 24 ensayos restringidos forman seis grupos de estados; los intervalos Wilson del 95% por estado son 43.6–97.0% frente a 0.0–39.0%, y parte de la diferencia se cumple por construcción. Otra captura OpenAI de ocho casos rechazó inicialmente 8/8 por la ubicación del rol; la corrección congelada completó 2/3 casos autorizados y rechazó 5/5 restringidos, con un rechazo aún abierto. La puerta comprueba 39 archivos de pruebas Lean 4 para modelos matemáticos seleccionados; no establecen equivalencia de implementación. La comprobación del 19 de octubre de 2026 superó 5,171 tests del paquete raíz. Los archivos actuales usan SHA-256 y su reproducción completa requiere Linux x86_64 nativo con Python 3.12; las atestaciones anteriores usan Ed25519. Son registros acotados, no seguridad universal. Los resultados anteriores del clasificador/AgentDojo y el esquema de cuatro límites son evidencia de etapas congeladas. El DOI del software 10.5281/zenodo.21737792 es distinto del de integridad de dispositivos 10.5281/zenodo.20374849.",
      "project-zurvan":
        "El repositorio es público e incluye un servidor MCP de lectura en Rust con escrituras y referencia alternativa en Python. El registro de main tras la fusión, del 20 de octubre de 2026, informa de 3,334 superadas, 1 fallida y 8 omitidas; Z1b sigue sin cerrar su evaluación sellada. Los recuentos e integraciones son evidencia de desarrollo fechada, no puntuaciones de calidad de recuperación. Las imágenes quedan pendientes de revisión visual y las figuras PDF no se transcriben automáticamente. El almacenamiento local no garantiza extracción LLM sin conexión: el procesamiento externo depende del proveedor configurado.",
      "invisible-window-research":
        "Los resultados cubren configuraciones controladas y simuladas de Windows y macOS hasta marzo de 2026. No se probaron productos comerciales de supervisión ni Linux. Las pruebas de macOS 26 usaron captura nativa, no getDisplayMedia() del navegador ni una prueba directa de ScreenCaptureKit; la muestra de detección conductual fue pequeña.",
      aion: "El piloto v3 de 40 preguntas puntúa recuperación en 34 preguntas respondibles y prueba 6 casos de rechazo. Recall@5 es 0.941, citation_support medio 0.978 y rechazos 6/6. Un único juez Gemini 3.1 Flash Lite no registró filas con citation_support < 0.5, pero quedaron dos filas con citas parciales o erróneas a 0.75 y 0.50. No garantiza respuestas correctas ni sin alucinaciones; comprueba el texto original. Las credenciales del chat usan secretos del servidor; la voz nativa opcional necesita una credencial OpenAI del cliente, fuera de ese límite de aislamiento.",
    },
  },
  zh: {
    readingPath: "研究阅读路径",
    contribution: "我的贡献",
    limitations: "范围与局限",
    sources: "来源",
    htmlSummary: "阅读 HTML 研究摘要",
    pdfNote:
      "原始研究 PDF 可能缺少无障碍标签。HTML 概述与证据提供文字摘要，并非论文的完整替代版本。",
    scope: {
      "project-simurgh":
        "2026 年 10 月迁移研究：24 项任务，每项两次试验，三个匹配对照（仅凭证、组合、全部拒绝）与两个模型，共重放 288 个分支。Llama-3.2-3B 受限状态中的新效果由 17/24 降至 0/24，有用任务完成 23/24；gpt-6-luna 基线已为 0/24，因此结果为零增益。24 次受限试验属于六个状态簇；各状态的 Wilson 95% 区间为 43.6–97.0% 与 0.0–39.0%，且部分差异由设计本身保证。另一项含八个案例的 OpenAI 记录最初因角色放置错误拒绝了 8/8；冻结修正版完成了 2/3 个授权案例，并拒绝了 5/5 个受限案例，仍有一次拒绝未解决。门控检查39个用于特定数学模型的 Lean 4 证明文件；这些证明不代表实现等价性。2026 年 10 月 19 日冒烟运行通过5,171项项目根包测试。当前研究归档使用 SHA-256，完整重放需要原生 Linux x86_64 与 Python 3.12；早期证明凭证使用 Ed25519。这些是限定范围的记录，并非通用安全保证。较早的分类器/AgentDojo 结果与四边界图属于冻结阶段证据。软件 DOI 10.5281/zenodo.21737792 与设备完整性预印本 DOI 10.5281/zenodo.20374849 不同。",
      "project-zurvan":
        "源仓库已公开，包含 Rust MCP 读取服务器与 Python 写入及参考后备实现。2026年10月20日合并主分支的记录为3,334项通过、1项失败、8项跳过；Z1b 密封评估仍未结项。测试数量与集成记录是有日期的开发证据，并非检索质量分数。图像保持待视觉处理占位状态，PDF 图表不会自动转录。本地存储不保证 LLM 提取完全离线；外部处理取决于所配置的提供方。",
      "invisible-window-research":
        "结果限于截至 2026 年 3 月的受控、模拟 Windows 与 macOS 配置，未测试商业监考产品或 Linux。macOS 26 使用原生捕获，而非浏览器 getDisplayMedia() 或直接 ScreenCaptureKit 测试；行为检测样本较小。",
      aion: "报告的 v3 试点有40题，其中34题可回答并用于检索评分，6题为拒答案例。Recall@5 为0.941，平均 citation_support 为0.978，拒答6/6。单一 Gemini 3.1 Flash Lite 评审未报告 citation_support < 0.5 的答案行，但仍有两行部分错误或不准确的引用，分数为0.75与0.50。这不保证回答正确或没有幻觉；请核对原文。聊天凭证使用服务器秘密，选配原生语音则需要客户端提供 OpenAI 凭证，处于该隔离边界之外。",
    },
  },
} satisfies Record<
  Locale,
  {
    readingPath: string;
    contribution: string;
    limitations: string;
    sources: string;
    htmlSummary: string;
    pdfNote: string;
    scope: Record<string, string>;
  }
>;

export function getDossierScope(slug: string, locale: Locale): string | null {
  const scope = dossierCopy[locale].scope;
  return Object.hasOwn(scope, slug) ? scope[slug as keyof typeof scope] : null;
}
