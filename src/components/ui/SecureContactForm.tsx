"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { NeonButton } from "@/components/ui/NeonButton";
import { Send, Lock, AlertTriangle } from "lucide-react";
import { CONTACT_EMAIL_GMAIL } from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SecureContactForm() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<
    "IDLE" | "TYPING" | "OPENING" | "DRAFT_OPENED" | "ERROR"
  >("IDLE");
  const [error, setError] = useState<string | null>(null);
  const uniqueId = useId();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const traceId = uniqueId.replace(/:/g, "").slice(0, 6).toUpperCase();

  const handleTyping = () => {
    // Editing after submit cancels the pending draft instead of opening stale text.
    if (draftTimeoutRef.current) {
      clearTimeout(draftTimeoutRef.current);
      draftTimeoutRef.current = null;
    }
    setStatus("TYPING");
    setError(null);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => setStatus("IDLE"), 800);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (draftTimeoutRef.current) {
        clearTimeout(draftTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (draftTimeoutRef.current) {
      clearTimeout(draftTimeoutRef.current);
      draftTimeoutRef.current = null;
    }
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("ERROR");
      setError(t.contact_form.error_required);
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setStatus("ERROR");
      setError(t.contact_form.error_invalid_email);
      return;
    }

    setStatus("OPENING");
    setError(null);

    const subject = encodeURIComponent(`${t.seo.contact_title}: ${name}`);
    const body = encodeURIComponent(
      `${t.contact_form.name_label}: ${name}\n${t.contact_form.email_label}: ${email}\n\n${t.contact_form.message_label}:\n${message}`,
    );

    draftTimeoutRef.current = setTimeout(() => {
      draftTimeoutRef.current = null;
      try {
        window.location.assign(
          `mailto:${CONTACT_EMAIL_GMAIL}?subject=${subject}&body=${body}`,
        );
        setStatus("DRAFT_OPENED");
      } catch {
        setStatus("ERROR");
        setError(t.contact_form.error_open_draft);
      }
    }, 600);
  };

  return (
    <div className="max-w-xl mx-auto p-6 border border-cyan/15 bg-black/40 backdrop-blur-sm rounded-lg relative overflow-hidden">
      {/* Decorative 'Scanner' Bar */}
      <div
        className={`absolute top-0 left-0 w-full h-1 transition-colors duration-300 ${
          status === "TYPING"
            ? "bg-red-500 animate-pulse"
            : status === "ERROR"
              ? "bg-amber-500"
              : "bg-cyan/50"
        }`}
      />

      <div className="flex justify-between items-center mb-6 font-mono text-xs text-text-body">
        <span>
          {t.contact_form.session_id_label}{" "}
          <span className="text-slate-300">{traceId}</span>
        </span>
        <span
          className={`flex items-center gap-2 ${
            status === "TYPING"
              ? "text-red-400"
              : status === "ERROR"
                ? "text-amber-400"
                : status === "OPENING"
                  ? "text-cyan"
                  : "text-green-400"
          }`}
        >
          {status === "TYPING" || status === "ERROR" ? (
            <AlertTriangle className="w-3 h-3" />
          ) : (
            <Lock className="w-3 h-3" />
          )}
          {status === "TYPING"
            ? t.contact_form.status_keylogging
            : status === "OPENING"
              ? t.contact_form.status_encrypting
              : status === "DRAFT_OPENED"
                ? t.contact_form.status_sent
                : status === "ERROR"
                  ? t.contact_form.status_error
                  : t.contact_form.status_secure}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              htmlFor="contact-name"
              className="text-xs font-mono text-cyan"
            >
              {t.contact_form.name_label}
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              maxLength={80}
              autoComplete="name"
              placeholder={t.contact_form.name_placeholder}
              onChange={handleTyping}
              className="w-full bg-[#030712]/60 border border-cyan/15 text-foreground p-3 text-sm focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="contact-email"
              className="text-xs font-mono text-cyan"
            >
              {t.contact_form.email_label}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              maxLength={120}
              autoComplete="email"
              placeholder={t.contact_form.email_placeholder}
              onChange={handleTyping}
              className="w-full bg-[#030712]/60 border border-cyan/15 text-foreground p-3 text-sm focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="contact-message"
            className="text-xs font-mono text-cyan"
          >
            {t.contact_form.message_label}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            maxLength={2000}
            placeholder={t.contact_form.message_placeholder}
            onChange={handleTyping}
            className="w-full bg-[#030712]/60 border border-cyan/15 text-foreground p-3 text-sm focus:border-red-500 focus:outline-none transition-colors resize-none"
          />
        </div>

        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="text-xs font-mono text-amber-400"
          >
            {error}
            {error === t.contact_form.error_open_draft && (
              <a
                href={`mailto:${CONTACT_EMAIL_GMAIL}`}
                dir="ltr"
                className="block mt-2 underline underline-offset-2"
              >
                {CONTACT_EMAIL_GMAIL}
              </a>
            )}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-[10px] text-text-meta font-mono">
            {t.contact_form.mail_client_note}
          </p>
          <NeonButton
            type="submit"
            variant="primary"
            className="px-6"
            disabled={status === "OPENING" || status === "DRAFT_OPENED"}
          >
            <Send className="w-3 h-3 mr-2" />{" "}
            {status === "OPENING"
              ? t.contact_form.cta_encrypting
              : status === "DRAFT_OPENED"
                ? t.contact_form.cta_sent
                : t.contact_form.cta_transmit}
          </NeonButton>
        </div>
      </form>
    </div>
  );
}
