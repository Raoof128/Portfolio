import type { Locale } from "@/i18n";

// English labels use title case (design system, section 2, rule 3). Minimise and
// Minimised keep the Australian spelling.
const en = {
  minimize: "Minimise",
  restoreWindow: "Restore Window",
  moveWindow: "Move Window",
  resizeWindow: "Resize Window",
  // Reset clears the saved window rectangle. The reading position is kept.
  resetPosition: "Reset Window Layout",
  windowControls: "Window Controls",
  minimized: "Minimised",
  // Constant name for the expand toggle; state is conveyed by aria-pressed.
  fullSize: "Full Size",
  // Step buttons show these words, and the visible text is their accessible name.
  moveLeft: "Left",
  moveRight: "Right",
  moveUp: "Up",
  moveDown: "Down",
  wider: "Wider",
  narrower: "Narrower",
  taller: "Taller",
  shorter: "Shorter",
  done: "Done",
  moveHint:
    "Use the arrow keys to move. Hold Shift for larger steps. Press Escape to finish.",
  resizeHint:
    "Use the arrow keys to resize. Hold Shift for larger steps. Press Escape to finish.",
} as const;

/** Keep window commands complete in every supported language. */
export type WindowCopy = {
  readonly [Key in keyof typeof en]: string;
};

const copy: Readonly<Record<Locale, WindowCopy>> = {
  en,
  fa: {
    minimize: "کمینه کردن",
    restoreWindow: "بازگرداندن پنجره",
    moveWindow: "جابه‌جایی پنجره",
    resizeWindow: "تغییر اندازهٔ پنجره",
    resetPosition: "بازنشانی اندازه و جای پنجره",
    windowControls: "کنترل‌های پنجره",
    minimized: "کمینه شده",
    fullSize: "اندازهٔ کامل",
    moveLeft: "چپ",
    moveRight: "راست",
    moveUp: "بالا",
    moveDown: "پایین",
    wider: "پهن‌تر",
    narrower: "باریک‌تر",
    taller: "بلندتر",
    shorter: "کوتاه‌تر",
    done: "پایان",
    moveHint:
      "با کلیدهای جهت‌دار پنجره را جابه‌جا کنید. برای گام‌های بزرگ‌تر Shift را نگه دارید. برای پایان، Escape را بزنید.",
    resizeHint:
      "با کلیدهای جهت‌دار اندازهٔ پنجره را تغییر دهید. برای گام‌های بزرگ‌تر Shift را نگه دارید. برای پایان، Escape را بزنید.",
  },
  ar: {
    minimize: "تصغير",
    restoreWindow: "استعادة النافذة",
    moveWindow: "نقل النافذة",
    resizeWindow: "تغيير حجم النافذة",
    resetPosition: "إعادة ضبط حجم النافذة وموضعها",
    windowControls: "أدوات التحكم في النافذة",
    minimized: "مصغّرة",
    fullSize: "الحجم الكامل",
    moveLeft: "اليسار",
    moveRight: "اليمين",
    moveUp: "الأعلى",
    moveDown: "الأسفل",
    wider: "أعرض",
    narrower: "أضيق",
    taller: "أطول",
    shorter: "أقصر",
    done: "تم",
    moveHint:
      "استخدم مفاتيح الأسهم لتحريك النافذة. اضغط باستمرار على Shift لخطوات أكبر. اضغط Escape للإنهاء.",
    resizeHint:
      "استخدم مفاتيح الأسهم لتغيير حجم النافذة. اضغط باستمرار على Shift لخطوات أكبر. اضغط Escape للإنهاء.",
  },
  zh: {
    minimize: "最小化",
    restoreWindow: "恢复窗口",
    moveWindow: "移动窗口",
    resizeWindow: "调整窗口大小",
    resetPosition: "重置窗口大小和位置",
    windowControls: "窗口控制",
    minimized: "已最小化",
    fullSize: "完整尺寸",
    moveLeft: "向左",
    moveRight: "向右",
    moveUp: "向上",
    moveDown: "向下",
    wider: "加宽",
    narrower: "变窄",
    taller: "加高",
    shorter: "变矮",
    done: "完成",
    moveHint: "使用方向键移动窗口。按住 Shift 可增大移动步幅，按 Escape 完成。",
    resizeHint:
      "使用方向键调整窗口大小。按住 Shift 可增大调整幅度，按 Escape 完成。",
  },
  es: {
    minimize: "Minimizar",
    restoreWindow: "Restaurar ventana",
    moveWindow: "Mover ventana",
    resizeWindow: "Cambiar el tamaño de la ventana",
    resetPosition: "Restablecer el tamaño y la posición",
    windowControls: "Controles de la ventana",
    minimized: "Minimizada",
    fullSize: "Tamaño completo",
    moveLeft: "Izquierda",
    moveRight: "Derecha",
    moveUp: "Arriba",
    moveDown: "Abajo",
    wider: "Ensanchar",
    narrower: "Estrechar",
    taller: "Alargar",
    shorter: "Acortar",
    done: "Listo",
    moveHint:
      "Usa las flechas para mover la ventana. Mantén pulsada Shift para desplazamientos mayores. Pulsa Escape para terminar.",
    resizeHint:
      "Usa las flechas para cambiar el tamaño. Mantén pulsada Shift para ajustes mayores. Pulsa Escape para terminar.",
  },
};

export function getWindowCopy(locale: Locale): WindowCopy {
  return copy[locale];
}
