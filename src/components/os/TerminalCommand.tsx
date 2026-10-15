"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, SquareTerminal } from "lucide-react";
import type { Locale } from "@/i18n";

const terminalCopy: Record<
  Locale,
  { title: string; copy: string; copied: string; failed: string }
> = {
  en: {
    title: "Reproduce locally",
    copy: "Copy commands",
    copied: "Commands copied",
    failed: "Select the commands to copy them",
  },
  fa: {
    title: "بازتولید روی رایانهٔ خودتان",
    copy: "کپی فرمان‌ها",
    copied: "فرمان‌ها کپی شد",
    failed: "فرمان‌ها را انتخاب و کپی کنید",
  },
  ar: {
    title: "أعد الإنتاج محليًا",
    copy: "نسخ الأوامر",
    copied: "تم نسخ الأوامر",
    failed: "حدّد الأوامر وانسخها",
  },
  es: {
    title: "Reproducir en local",
    copy: "Copiar comandos",
    copied: "Comandos copiados",
    failed: "Selecciona los comandos para copiarlos",
  },
  zh: {
    title: "在本地复现",
    copy: "复制命令",
    copied: "命令已复制",
    failed: "请选择并复制这些命令",
  },
};

/**
 * Terminal card after "smooth-quail-87" by ilkhoeri, Uiverse.io (MIT). Shows
 * real shell commands; the copy button copies them verbatim.
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
    <div className="os-terminal" dir="ltr">
      <div className="os-terminal-head">
        <p className="os-terminal-title" lang={locale}>
          <SquareTerminal size={16} aria-hidden="true" />
          {labels.title}
        </p>
        <button
          type="button"
          className="os-terminal-copy"
          aria-label={labels.copy}
          data-copied={status === "copied" || undefined}
          onClick={copyCommands}
        >
          {status === "copied" ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}
        </button>
      </div>
      <pre className="os-terminal-body">
        {commands.map((command) => (
          <code key={command}>
            <span className="os-terminal-prompt" aria-hidden="true">
              ${" "}
            </span>
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
