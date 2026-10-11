import type { Locale } from "@/i18n";

const en = {
  minimize: "Minimize",
  restoreWindow: "Restore window",
  moveWindow: "Move window",
  resizeWindow: "Resize window",
  // The retained API key resets both geometry dimensions and the reading layout.
  resetPosition: "Reset window layout",
  windowControls: "Window controls",
  minimized: "Minimized",
  moveLeft: "Move left",
  moveRight: "Move right",
  moveUp: "Move up",
  moveDown: "Move down",
  wider: "Increase width",
  narrower: "Decrease width",
  taller: "Increase height",
  shorter: "Decrease height",
  done: "Done",
  moveHint:
    "Use the arrow keys to move. Hold Shift for larger steps. Press Escape to finish.",
  resizeHint:
    "Use the arrow keys to resize. Hold Shift for larger steps. Press Escape to finish.",
  readingWindow: "Reading window",
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
    moveLeft: "جابه‌جایی به چپ",
    moveRight: "جابه‌جایی به راست",
    moveUp: "جابه‌جایی به بالا",
    moveDown: "جابه‌جایی به پایین",
    wider: "افزایش عرض",
    narrower: "کاهش عرض",
    taller: "افزایش ارتفاع",
    shorter: "کاهش ارتفاع",
    done: "پایان",
    moveHint:
      "با کلیدهای جهت‌دار پنجره را جابه‌جا کنید. برای گام‌های بزرگ‌تر Shift را نگه دارید. برای پایان، Escape را بزنید.",
    resizeHint:
      "با کلیدهای جهت‌دار اندازهٔ پنجره را تغییر دهید. برای گام‌های بزرگ‌تر Shift را نگه دارید. برای پایان، Escape را بزنید.",
    readingWindow: "پنجرهٔ مطالعه",
  },
  ar: {
    minimize: "تصغير",
    restoreWindow: "استعادة النافذة",
    moveWindow: "نقل النافذة",
    resizeWindow: "تغيير حجم النافذة",
    resetPosition: "إعادة ضبط حجم النافذة وموضعها",
    windowControls: "أدوات التحكم في النافذة",
    minimized: "مصغّرة",
    moveLeft: "نقل إلى اليسار",
    moveRight: "نقل إلى اليمين",
    moveUp: "نقل إلى الأعلى",
    moveDown: "نقل إلى الأسفل",
    wider: "زيادة العرض",
    narrower: "تقليل العرض",
    taller: "زيادة الارتفاع",
    shorter: "تقليل الارتفاع",
    done: "تم",
    moveHint:
      "استخدم مفاتيح الأسهم لتحريك النافذة. اضغط باستمرار على Shift لخطوات أكبر. اضغط Escape للإنهاء.",
    resizeHint:
      "استخدم مفاتيح الأسهم لتغيير حجم النافذة. اضغط باستمرار على Shift لخطوات أكبر. اضغط Escape للإنهاء.",
    readingWindow: "نافذة القراءة",
  },
  zh: {
    minimize: "最小化",
    restoreWindow: "恢复窗口",
    moveWindow: "移动窗口",
    resizeWindow: "调整窗口大小",
    resetPosition: "重置窗口大小和位置",
    windowControls: "窗口控制",
    minimized: "已最小化",
    moveLeft: "向左移动",
    moveRight: "向右移动",
    moveUp: "向上移动",
    moveDown: "向下移动",
    wider: "增加宽度",
    narrower: "减小宽度",
    taller: "增加高度",
    shorter: "减小高度",
    done: "完成",
    moveHint: "使用方向键移动窗口。按住 Shift 可增大移动步幅，按 Escape 完成。",
    resizeHint:
      "使用方向键调整窗口大小。按住 Shift 可增大调整幅度，按 Escape 完成。",
    readingWindow: "阅读窗口",
  },
  es: {
    minimize: "Minimizar",
    restoreWindow: "Restaurar ventana",
    moveWindow: "Mover ventana",
    resizeWindow: "Cambiar el tamaño de la ventana",
    resetPosition: "Restablecer el tamaño y la posición",
    windowControls: "Controles de la ventana",
    minimized: "Minimizada",
    moveLeft: "Mover a la izquierda",
    moveRight: "Mover a la derecha",
    moveUp: "Mover hacia arriba",
    moveDown: "Mover hacia abajo",
    wider: "Aumentar el ancho",
    narrower: "Reducir el ancho",
    taller: "Aumentar la altura",
    shorter: "Reducir la altura",
    done: "Listo",
    moveHint:
      "Usa las flechas para mover la ventana. Mantén pulsada Shift para desplazamientos mayores. Pulsa Escape para terminar.",
    resizeHint:
      "Usa las flechas para cambiar el tamaño. Mantén pulsada Shift para ajustes mayores. Pulsa Escape para terminar.",
    readingWindow: "Ventana de lectura",
  },
};

export function getWindowCopy(locale: Locale): WindowCopy {
  return copy[locale];
}
