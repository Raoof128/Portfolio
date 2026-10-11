import type { Locale } from "@/i18n";
import { labExperiments, type LabExperiment } from "@/lib/data";

type LabText = Pick<
  LabExperiment,
  "title" | "description" | "objective" | "constraints"
>;

const translations: Record<Exclude<Locale, "en">, Record<string, LabText>> = {
  fa: {
    "001": {
      title: "اثبات مفهوم ثبت فشردن کلیدها با Rust",
      description:
        "نمونه آموزشی ثبت فشردن کلیدها در Windows که کاربرد SetWindowsHookEx و زنجیره‌سازی درست هوک‌ها را برای تحلیل تشخیص نشان می‌دهد.",
      objective:
        "شناخت سوءاستفاده از هوک‌های پیام Windows برای رهگیری اطلاعات ورود و بررسی نحوه تشخیص تزریق هوک توسط EDR.",
      constraints:
        "فقط برای آموزش. پس از راه‌اندازی دوباره باقی نمی‌ماند و خروجی را فقط در stdout ثبت می‌کند.",
    },
    "002": {
      title: "شنود بسته با سوکت خام",
      description:
        "اسکریپت Python با سوکت خام برای دریافت و تجزیه دستی سرآیندهای TCP/IP؛ تشخیص مقدماتی اسکن SYN بدون وابستگی به libpcap.",
      objective:
        "تجزیه دستی سرآیندهای IP/TCP برای شناخت ساختار پروتکل و تشخیص الگوهای اسکن بدون اتکا به Wireshark.",
      constraints:
        "به دسترسی root یا مدیر نیاز دارد. فقط Linux با AF_PACKET؛ در macOS باید از سوکت BPF استفاده شود.",
    },
    "003": {
      title: "ابزار نهان‌نگاری تصویر",
      description:
        "نهان‌نگاری تصویر با کم‌ارزش‌ترین بیت (LSB) در Go؛ قراردادن داده دارای پیشوند طول در کانال قرمز پیکسل‌های PNG.",
      objective:
        "پیاده‌سازی کانال پنهان با تغییر کم‌ارزش‌ترین بیت داده پیکسل‌ها و سپس بررسی بازیابی دقیق داده اصلی.",
      constraints:
        "ظرفیت داده حداکثر (عرض × ارتفاع) / 8 بایت است. در برابر تبدیل دوباره به JPEG یا تغییر اندازه تصویر مقاوم نیست.",
    },
  },
  ar: {
    "001": {
      title: "إثبات مفهوم لتسجيل ضغطات المفاتيح باستخدام Rust",
      description:
        "نموذج تعليمي لتسجيل ضغطات المفاتيح على Windows يوضح استخدام SetWindowsHookEx وتسلسل الخطافات الصحيح لتحليل أساليب الكشف.",
      objective:
        "فهم إساءة استخدام خطافات رسائل Windows لاعتراض بيانات الدخول وكيف تكشف أنظمة EDR حقن الخطافات.",
      constraints:
        "للتعليم فقط. لا يستمر بعد إعادة التشغيل، ويسجّل المخرجات في stdout فقط.",
    },
    "002": {
      title: "التقاط الحزم باستخدام المقابس الخام",
      description:
        "برنامج Python يستخدم مقابس خام لالتقاط ترويسات TCP/IP وتحليلها يدويًا، مع كشف أولي لمسح SYN دون الاعتماد على libpcap.",
      objective:
        "تحليل ترويسات IP/TCP يدويًا لفهم بنية البروتوكولات وكشف أنماط المسح دون الاعتماد على Wireshark.",
      constraints:
        "يتطلب صلاحيات root أو مسؤول. يعمل على Linux فقط باستخدام AF_PACKET؛ يجب استخدام مقبس BPF على macOS.",
    },
    "003": {
      title: "أداة لإخفاء البيانات في الصور",
      description:
        "إخفاء بيانات الصور باستخدام البت الأقل أهمية (LSB) في Go، بإدراج حمولة يسبقها طولها في القناة الحمراء لبكسلات PNG.",
      objective:
        "إنشاء قناة خفية بتعديل أقل بتات بيانات البكسلات أهمية، ثم التحقق من استعادة البيانات الأصلية دون تغيير.",
      constraints:
        "حجم الحمولة محدود بـ (العرض × الارتفاع) / 8 بايت. لا يقاوم إعادة الترميز بصيغة JPEG أو تغيير حجم الصورة.",
    },
  },
  zh: {
    "001": {
      title: "Rust 按键记录概念验证",
      description:
        "用于教学检测分析的 Windows 按键记录示例，演示 SetWindowsHookEx 的使用和正确的钩子链调用。",
      objective:
        "理解 Windows 消息钩子如何被滥用于截取凭据，以及 EDR 如何检测钩子注入。",
      constraints: "仅用于教学。重启后不会保留，仅输出到 stdout。",
    },
    "002": {
      title: "原始套接字抓包工具",
      description:
        "通过原始套接字捕获并手动解析 TCP/IP 首部的 Python 脚本，实现不依赖 libpcap 的基础 SYN 扫描检测。",
      objective:
        "手动解析 IP/TCP 首部，以理解协议结构并在不依赖 Wireshark 的情况下检测扫描模式。",
      constraints:
        "需要 root 或管理员权限。仅适用于 Linux 的 AF_PACKET；macOS 应使用 BPF 套接字。",
    },
    "003": {
      title: "图像隐写工具",
      description:
        "用 Go 实现基于最低有效位（LSB）的图像隐写，将带长度前缀的载荷嵌入 PNG 像素的红色通道。",
      objective:
        "通过修改像素数据的最低有效位实现隐蔽信道，并核验提取结果与原始载荷完全一致。",
      constraints:
        "载荷大小限于（宽度 × 高度）/ 8 字节。不能抵抗 JPEG 重新编码或图像缩放。",
    },
  },
  es: {
    "001": {
      title: "Prueba de concepto de registro de teclas en Rust",
      description:
        "Ejemplo educativo de registro de teclas en Windows que demuestra SetWindowsHookEx y el encadenamiento correcto de hooks para analizar su detección.",
      objective:
        "Comprender cómo se pueden usar indebidamente los hooks de mensajes de Windows para interceptar credenciales y cómo los EDR detectan su inyección.",
      constraints:
        "Solo con fines educativos. No persiste tras reiniciar y registra únicamente en stdout.",
    },
    "002": {
      title: "Capturador de paquetes con sockets sin procesar",
      description:
        "Script de Python que captura y analiza manualmente cabeceras TCP/IP mediante sockets sin procesar. Detecta escaneos SYN básicos sin depender de libpcap.",
      objective:
        "Analizar manualmente cabeceras IP/TCP para comprender los protocolos y detectar patrones de escaneo sin depender de Wireshark.",
      constraints:
        "Requiere privilegios root o de administrador. Solo Linux con AF_PACKET; en macOS debe usarse un socket BPF.",
    },
    "003": {
      title: "Herramienta de esteganografía de imágenes",
      description:
        "Esteganografía de imágenes por bit menos significativo (LSB) en Go. Inserta una carga útil precedida de su longitud en el canal rojo de píxeles PNG.",
      objective:
        "Implementar un canal oculto modificando los bits menos significativos de los píxeles y comprobar la recuperación exacta de la carga original.",
      constraints:
        "La carga se limita a (ancho × alto) / 8 bytes. No resiste la recodificación JPEG ni los cambios de tamaño de la imagen.",
    },
  },
};

const technicalLabels: Record<Locale, Record<string, string>> = {
  en: {},
  fa: {
    Networking: "شبکه",
    "Raw Sockets": "سوکت خام",
    Cryptography: "رمزنگاری",
    "Image Processing": "پردازش تصویر",
  },
  ar: {
    Networking: "الشبكات",
    "Raw Sockets": "المقابس الخام",
    Cryptography: "التشفير",
    "Image Processing": "معالجة الصور",
  },
  zh: {
    Networking: "网络",
    "Raw Sockets": "原始套接字",
    Cryptography: "密码学",
    "Image Processing": "图像处理",
  },
  es: {
    Networking: "Redes",
    "Raw Sockets": "Sockets sin procesar",
    Cryptography: "Criptografía",
    "Image Processing": "Procesamiento de imágenes",
  },
};

export function getLocalizedLab(
  exp: LabExperiment,
  locale: Locale,
): LabExperiment {
  if (locale === "en") return exp;
  const text = translations[locale][exp.id];
  if (!text) throw new Error(`Missing ${locale} lab translation: ${exp.id}`);
  return {
    ...exp,
    ...text,
    tech: exp.tech.map((item) => technicalLabels[locale][item] ?? item),
  };
}

export function getLocalizedLabs(locale: Locale): LabExperiment[] {
  return labExperiments.map((exp) => getLocalizedLab(exp, locale));
}
