"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { NeonButton } from "@/components/ui/NeonButton";
import { Send, Lock, AlertTriangle } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/constants";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SecureContactForm() {
  const [status, setStatus] = useState<"IDLE" | "TYPING" | "ENCRYPTING" | "SENT" | "ERROR">("IDLE");
  const [error, setError] = useState<string | null>(null);
  const uniqueId = useId();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const traceId = uniqueId.replace(/:/g, "").slice(0, 6).toUpperCase();

  const handleTyping = () => {
    setStatus("TYPING");
    setError(null);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => setStatus("ENCRYPTING"), 800);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("ERROR");
      setError("All fields are required before transmission.");
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setStatus("ERROR");
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("ENCRYPTING");
    setError(null);

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);

    setTimeout(() => {
      window.location.assign(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);
      setStatus("SENT");
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
              : "bg-cyan-500/50"
        }`}
      />

      <div className="flex justify-between items-center mb-6 font-mono text-xs text-text-body">
        <span>SESSION_ID: <span className="text-slate-300">{traceId}</span></span>
        <span
          className={`flex items-center gap-2 ${
            status === "TYPING"
              ? "text-red-400"
              : status === "ERROR"
                ? "text-amber-400"
                : status === "ENCRYPTING"
                  ? "text-cyan-400"
                  : "text-green-400"
          }`}
        >
          {status === "TYPING" || status === "ERROR" ? <AlertTriangle className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          {status === "TYPING" ? "KEYLOGGING_ACTIVE..." : status === "ENCRYPTING" ? "PAYLOAD_ENCRYPTING..." : status === "SENT" ? "TRANSMISSION_COMPLETE ✓" : status === "ERROR" ? "VALIDATION_ERROR" : "CHANNEL_SECURE"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="contact-name" className="text-xs font-mono text-cyan-500">TARGET_ID (Name)</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              maxLength={80}
              autoComplete="name"
              placeholder="ENTER_IDENTITY"
              onKeyDown={handleTyping}
              className="w-full bg-[#06080d]/60 border border-cyan/15 text-foreground p-2 text-sm focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="contact-email" className="text-xs font-mono text-cyan-500">RETURN_PATH (Email)</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              maxLength={120}
              autoComplete="email"
              placeholder="secure@gateway.io"
              onKeyDown={handleTyping}
              className="w-full bg-[#06080d]/60 border border-cyan/15 text-foreground p-2 text-sm focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="contact-message" className="text-xs font-mono text-cyan-500">PAYLOAD (Message)</label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            maxLength={2000}
            placeholder="TRANSMITTING_ENCRYPTED_PAYLOAD..."
            onKeyDown={handleTyping}
            className="w-full bg-[#06080d]/60 border border-cyan/15 text-foreground p-2 text-sm focus:border-red-500 focus:outline-none transition-colors resize-none"
          />
        </div>

        {error && (
          <p role="alert" aria-live="polite" className="text-xs font-mono text-amber-400">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-[10px] text-text-meta font-mono">
            * Opens your default mail client to send.
          </p>
          <NeonButton type="submit" variant="primary" className="px-6" disabled={status === "ENCRYPTING" || status === "SENT"}>
            <Send className="w-3 h-3 mr-2" /> {status === "ENCRYPTING" ? "ENCRYPTING..." : status === "SENT" ? "SENT ✓" : "TRANSMIT"}
          </NeonButton>
        </div>
      </form>
    </div>
  );
}
