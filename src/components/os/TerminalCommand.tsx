"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, SquareTerminal } from "lucide-react";
import type { Locale } from "@/i18n";
import "./terminal.css";

const terminalCopy: Record<
  Locale,
  {
    title: string;
    copy: string;
    copied: string;
    failed: string;
    region: string;
  }
> = {
  en: {
    title: "Reproduce Locally",
    copy: "Copy Commands",
    copied: "Commands copied",
    failed: "Select the commands to copy them",
    region: "Reproduction commands",
  },
  fa: {
    title: "بازتولید روی رایانهٔ خودتان",
    copy: "کپی فرمان‌ها",
    copied: "فرمان‌ها کپی شد",
    failed: "فرمان‌ها را انتخاب و کپی کنید",
    region: "فرمان‌های بازتولید",
  },
  ar: {
    title: "أعد الإنتاج محليًا",
    copy: "نسخ الأوامر",
    copied: "تم نسخ الأوامر",
    failed: "حدّد الأوامر وانسخها",
    region: "أوامر إعادة الإنتاج",
  },
  es: {
    title: "Reproducir en local",
    copy: "Copiar comandos",
    copied: "Comandos copiados",
    failed: "Selecciona los comandos para copiarlos",
    region: "Comandos de reproducción",
  },
  zh: {
    title: "在本地复现",
    copy: "复制命令",
    copied: "命令已复制",
    failed: "请选择并复制这些命令",
    region: "复现命令",
  },
};

/**
 * Flat code card that shows real shell commands. The copy button copies them
 * verbatim; the command region is keyboard-focusable and named, so long lines
 * can be scrolled without a pointer.
 *
 * Restyled from "smooth-quail-87" by ilkhoeri, Uiverse.io (MIT). The Uiverse
 * skin itself is retired; only the card structure survives, in terminal.css.
 */
export function TerminalCommand({
  locale,
  commands,
}: {
  locale: Locale;
  commands: readonly string[];
}) {
  const labels = terminalCopy[locale];
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copyCommands() {
    try {
      await navigator.clipboard.writeText(commands.join("\n"));
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    // The card follows the page direction so the localised title and button sit
    // correctly in RTL; only the command block is forced LTR below.
    <div className="os-terminal">
      <div className="os-terminal-head">
        <p className="os-terminal-title" lang={locale}>
          <SquareTerminal size={16} aria-hidden="true" />
          {labels.title}
        </p>
        <button
          type="button"
          className="os-button--secondary os-terminal-copy"
          data-copied={status === "copied" || undefined}
          onClick={copyCommands}
        >
          {status === "copied" ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}
          {labels.copy}
        </button>
      </div>
      {/* The prompt is drawn by CSS (::before), so copied text is only the commands. */}
      <pre
        className="os-terminal-body"
        dir="ltr"
        role="region"
        aria-label={labels.region}
        tabIndex={0}
      >
        {commands.map((command) => (
          <code key={command}>
            <span className="os-terminal-typed">{command}</span>
          </code>
        ))}
      </pre>
      <p className="sr-only" role="status">
        {status === "copied"
          ? labels.copied
          : status === "failed"
            ? labels.failed
            : ""}
      </p>
    </div>
  );
}
