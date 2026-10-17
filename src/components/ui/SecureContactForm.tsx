"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import { AlertTriangle, Copy, Lock, Mail, Pencil } from "lucide-react";
import { CONTACT_EMAIL_GMAIL } from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import type { Locale } from "@/i18n";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX = 80;
const EMAIL_MAX = 120;
const MESSAGE_MAX = 2000;

type Field = "name" | "email" | "message";
type FieldErrors = Partial<Record<Field, string>>;
type Phase = "IDLE" | "TYPING" | "OPENING" | "HANDOFF" | "INVALID" | "FAILED";
type CopyState = "idle" | "copied" | "failed";

/* Component-local strings for the parts of the form that have no entry in the shared
   dictionary. Labels, placeholders and the open-failure message still come from
   contact_form. Persian and Arabic are written as natural copy, not word-for-word. */
export interface SecureContactCopy {
  heading: string;
  requiredLegend: string;
  emailHelp: string;
  characters: string;
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  messageRequired: string;
  statusIdle: string;
  statusEditing: string;
  statusOpening: string;
  statusHandoff: string;
  statusCheck: string;
  statusFailed: string;
  handoffHint: string;
  submit: string;
  submitBusy: string;
  openAgain: string;
  addressLabel: string;
  copyAddress: string;
  addressCopied: string;
  copyFailed: string;
}

export const SECURE_CONTACT_COPY: Record<Locale, SecureContactCopy> = {
  en: {
    heading: "Send a message",
    requiredLegend: "Fields marked * are required.",
    emailHelp: "Used only so I can reply to you.",
    characters: "{count} of {max} characters used",
    nameRequired: "Enter your name.",
    emailRequired: "Enter your email address.",
    emailInvalid: "Enter a valid email address, such as you@example.com.",
    messageRequired: "Write a message before preparing the draft.",
    statusIdle: "Email draft ready",
    statusEditing: "Editing draft",
    statusOpening: "Opening your email app…",
    statusHandoff: "Your email app should open with the draft.",
    statusCheck: "Check the fields marked below",
    statusFailed: "The draft did not open",
    handoffHint: "If nothing opened, copy the address below.",
    submit: "Prepare email draft",
    submitBusy: "Opening…",
    openAgain: "Open again",
    addressLabel: "Email address",
    copyAddress: "Copy address",
    addressCopied: "Address copied.",
    copyFailed: "Could not copy. Select the address below instead.",
  },
  fa: {
    heading: "ارسال پیام",
    requiredLegend: "فیلدهایی که با * مشخص شده‌اند الزامی هستند.",
    emailHelp: "فقط برای پاسخ دادن به شما استفاده می‌شود.",
    characters: "{count} از {max} نویسه استفاده شده",
    nameRequired: "لطفاً نام خود را وارد کنید.",
    emailRequired: "لطفاً نشانی ایمیل خود را وارد کنید.",
    emailInvalid: "نشانی ایمیل معتبری وارد کنید، مثلاً you@example.com.",
    messageRequired: "پیش از آماده‌سازی پیش‌نویس، پیامی بنویسید.",
    statusIdle: "پیش‌نویس ایمیل آماده است",
    statusEditing: "در حال ویرایش پیش‌نویس",
    statusOpening: "در حال باز کردن برنامه ایمیل…",
    statusHandoff: "برنامه ایمیل شما باید پیش‌نویس را باز کند.",
    statusCheck: "فیلدهای مشخص‌شده را بررسی کنید",
    statusFailed: "پیش‌نویس باز نشد",
    handoffHint: "اگر چیزی باز نشد، نشانی زیر را کپی کنید.",
    submit: "آماده‌سازی پیش‌نویس ایمیل",
    submitBusy: "در حال باز کردن…",
    openAgain: "دوباره باز کردن",
    addressLabel: "نشانی ایمیل",
    copyAddress: "کپی نشانی",
    addressCopied: "نشانی کپی شد.",
    copyFailed: "کپی انجام نشد. نشانی زیر را دستی انتخاب کنید.",
  },
  ar: {
    heading: "أرسل رسالة",
    requiredLegend: "الحقول المعلَّمة بعلامة * إلزامية.",
    emailHelp: "يُستخدم فقط للرد عليك.",
    characters: "تم استخدام {count} من {max} حرفًا",
    nameRequired: "أدخل اسمك.",
    emailRequired: "أدخل عنوان بريدك الإلكتروني.",
    emailInvalid: "أدخل عنوان بريد إلكتروني صالحًا، مثل you@example.com.",
    messageRequired: "اكتب رسالة قبل تجهيز المسودة.",
    statusIdle: "مسودة البريد جاهزة",
    statusEditing: "جارٍ تحرير المسودة",
    statusOpening: "جارٍ فتح تطبيق البريد…",
    statusHandoff: "يُفترض أن يفتح تطبيق البريد لديك المسودة.",
    statusCheck: "راجع الحقول المعلَّمة أدناه",
    statusFailed: "تعذّر فتح المسودة",
    handoffHint: "إذا لم يُفتح شيء، فانسخ العنوان أدناه.",
    submit: "تجهيز مسودة البريد",
    submitBusy: "جارٍ الفتح…",
    openAgain: "أعد الفتح",
    addressLabel: "عنوان البريد",
    copyAddress: "نسخ العنوان",
    addressCopied: "تم نسخ العنوان.",
    copyFailed: "تعذّر النسخ. حدِّد العنوان أدناه يدويًا.",
  },
  es: {
    heading: "Enviar un mensaje",
    requiredLegend: "Los campos marcados con * son obligatorios.",
    emailHelp: "Solo lo uso para responderte.",
    characters: "{count} de {max} caracteres usados",
    nameRequired: "Escribe tu nombre.",
    emailRequired: "Escribe tu correo electrónico.",
    emailInvalid:
      "Escribe una dirección de correo válida, por ejemplo you@example.com.",
    messageRequired: "Escribe un mensaje antes de preparar el borrador.",
    statusIdle: "Borrador de correo listo",
    statusEditing: "Editando el borrador",
    statusOpening: "Abriendo tu aplicación de correo…",
    statusHandoff: "Tu aplicación de correo debería abrir el borrador.",
    statusCheck: "Revisa los campos marcados abajo",
    statusFailed: "No se pudo abrir el borrador",
    handoffHint: "Si no se abrió nada, copia la dirección de abajo.",
    submit: "Preparar borrador de correo",
    submitBusy: "Abriendo…",
    openAgain: "Volver a abrir",
    addressLabel: "Dirección de correo",
    copyAddress: "Copiar dirección",
    addressCopied: "Dirección copiada.",
    copyFailed: "No se pudo copiar. Selecciona la dirección de abajo.",
  },
  zh: {
    heading: "发送留言",
    requiredLegend: "标有 * 的字段为必填项。",
    emailHelp: "仅用于回复你。",
    characters: "已输入 {count} / {max} 个字符",
    nameRequired: "请输入你的姓名。",
    emailRequired: "请输入你的邮箱地址。",
    emailInvalid: "请输入有效的邮箱地址，例如 you@example.com。",
    messageRequired: "准备草稿前请先写一条留言。",
    statusIdle: "邮件草稿已就绪",
    statusEditing: "正在编辑草稿",
    statusOpening: "正在打开你的邮件应用…",
    statusHandoff: "你的邮件应用应会打开这份草稿。",
    statusCheck: "请检查下方标出的字段",
    statusFailed: "草稿未能打开",
    handoffHint: "如果没有打开，请复制下方的地址。",
    submit: "准备邮件草稿",
    submitBusy: "正在打开…",
    openAgain: "再次打开",
    addressLabel: "邮箱地址",
    copyAddress: "复制地址",
    addressCopied: "地址已复制。",
    copyFailed: "复制失败，请手动选择下方的地址。",
  },
};

const FIELDS: Field[] = ["name", "email", "message"];

function validateField(
  field: Field,
  value: string,
  s: SecureContactCopy,
): string | undefined {
  if (field === "name") return value ? undefined : s.nameRequired;
  if (field === "email") {
    if (!value) return s.emailRequired;
    return EMAIL_PATTERN.test(value) ? undefined : s.emailInvalid;
  }
  return value ? undefined : s.messageRequired;
}

function readValues(form: HTMLFormElement): Record<Field, string> {
  const data = new FormData(form);
  return {
    name: String(data.get("name") ?? "").trim(),
    email: String(data.get("email") ?? "").trim(),
    message: String(data.get("message") ?? "").trim(),
  };
}

function strings(locale: Locale): SecureContactCopy {
  return SECURE_CONTACT_COPY[locale] ?? SECURE_CONTACT_COPY.en;
}

/* Copies the contact address. The result is announced in a polite status region that
   stays mounted, so the feedback reaches screen readers. */
export function CopyAddressControl() {
  const { locale } = useTranslation();
  const s = strings(locale);
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL_GMAIL);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <span className="os-secure-copy">
      <button
        type="button"
        className="os-button os-button--secondary"
        onClick={copyAddress}
      >
        <Copy aria-hidden="true" size={14} />
        {s.copyAddress}
      </button>
      <span role="status" className="os-secure-copy-status">
        {copyState === "copied"
          ? s.addressCopied
          : copyState === "failed"
            ? s.copyFailed
            : ""}
      </span>
    </span>
  );
}

export function SecureContactForm() {
  const { t, locale } = useTranslation();
  const s = strings(locale);
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fieldRefs = useRef<
    Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | null>>
  >({});

  const clearTimers = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (draftTimeoutRef.current) {
      clearTimeout(draftTimeoutRef.current);
      draftTimeoutRef.current = null;
    }
  };

  // Unmounting cancels both the typing timer and any pending draft.
  useEffect(() => {
    const typingTimeout = typingTimeoutRef;
    const draftTimeout = draftTimeoutRef;
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (draftTimeout.current) clearTimeout(draftTimeout.current);
    };
  }, []);

  const handleTyping = () => {
    // Editing after submit cancels the pending draft instead of opening stale text.
    if (draftTimeoutRef.current) {
      clearTimeout(draftTimeoutRef.current);
      draftTimeoutRef.current = null;
    }
    setPhase("TYPING");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
      setPhase((current) => (current === "TYPING" ? "IDLE" : current));
    }, 800);
  };

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageLength(event.currentTarget.value.length);
    handleTyping();
    clearPassingError("message")(event);
  };

  // After the first submit, a field that now passes drops its error while the user types, so the
  // error row does not disappear on blur and move the submit button under the pointer. Errors are
  // raised only on submit and on blur, never while typing.
  const clearPassingError =
    (field: Field) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const form = event.currentTarget.form;
      if (!submitted || !form) return;
      if (validateField(field, readValues(form)[field], s)) return;
      setFieldErrors((current) =>
        current[field] ? { ...current, [field]: undefined } : current,
      );
    };

  // After the first submit, each field is checked again when the user leaves it.
  const handleBlur =
    (field: Field) =>
    (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const form = event.currentTarget.form;
      if (!submitted || !form) return;
      const message = validateField(field, readValues(form)[field], s);
      setFieldErrors((current) => ({ ...current, [field]: message }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // While the draft is opening, a repeat submit (Enter or a second click) is ignored, so the
    // pending timer is not restarted.
    if (phase === "OPENING") return;
    clearTimers();
    setSubmitted(true);

    // Native validation is off (noValidate), so every rule runs here and the
    // messages stay in the form's own language.
    const values = readValues(event.currentTarget);
    const errors: FieldErrors = {};
    for (const field of FIELDS) {
      const message = validateField(field, values[field], s);
      if (message) errors[field] = message;
    }
    setFieldErrors(errors);

    const firstInvalid = FIELDS.find((field) => errors[field]);
    if (firstInvalid) {
      setPhase("INVALID");
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setPhase("OPENING");
    const subject = encodeURIComponent(
      `${t.seo.contact_title}: ${values.name}`,
    );
    const body = encodeURIComponent(
      `${t.contact_form.name_label}: ${values.name}\n${t.contact_form.email_label}: ${values.email}\n\n${t.contact_form.message_label}:\n${values.message}`,
    );

    draftTimeoutRef.current = setTimeout(() => {
      draftTimeoutRef.current = null;
      try {
        window.location.assign(
          `mailto:${CONTACT_EMAIL_GMAIL}?subject=${subject}&body=${body}`,
        );
        // A mailto link cannot tell us whether a mail app took it, so the
        // handoff says what should happen and offers the address as a fallback.
        setPhase("HANDOFF");
      } catch {
        setPhase("FAILED");
      }
    }, 600);
  };

  const tone = phase === "INVALID" || phase === "FAILED" ? "error" : "neutral";
  const statusText: Record<Phase, string> = {
    IDLE: s.statusIdle,
    TYPING: s.statusEditing,
    OPENING: s.statusOpening,
    HANDOFF: s.statusHandoff,
    INVALID: s.statusCheck,
    FAILED: s.statusFailed,
  };
  const StatusIcon =
    phase === "TYPING"
      ? Pencil
      : phase === "OPENING" || phase === "HANDOFF"
        ? Mail
        : tone === "error"
          ? AlertTriangle
          : Lock;
  const showFallback = phase === "HANDOFF" || phase === "FAILED";
  const submitLabel =
    phase === "OPENING"
      ? s.submitBusy
      : phase === "HANDOFF"
        ? s.openAgain
        : s.submit;

  const describedBy = (...ids: Array<string | false | undefined>) =>
    ids.filter(Boolean).join(" ") || undefined;

  return (
    <div className="os-secure-contact" data-tone={tone}>
      <div className="os-secure-head">
        <h2 className="os-secure-title">{s.heading}</h2>
      </div>
      <p role="status" className="os-secure-status" data-phase={phase}>
        <StatusIcon aria-hidden="true" size={14} />
        {statusText[phase]}
      </p>

      <form onSubmit={handleSubmit} noValidate className="os-secure-form">
        <p className="os-secure-legend">{s.requiredLegend}</p>

        <div className="os-secure-grid">
          <div className="os-secure-field">
            <div className="os-secure-label-row">
              <label htmlFor="contact-name">{t.contact_form.name_label}</label>
              <span className="os-secure-required" aria-hidden="true">
                *
              </span>
            </div>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              maxLength={NAME_MAX}
              autoComplete="name"
              placeholder={t.contact_form.name_placeholder}
              aria-invalid={fieldErrors.name ? true : undefined}
              aria-describedby={describedBy(
                fieldErrors.name && "contact-name-error",
              )}
              ref={(element) => {
                fieldRefs.current.name = element;
              }}
              onChange={(event) => {
                handleTyping();
                clearPassingError("name")(event);
              }}
              onBlur={handleBlur("name")}
            />
            {fieldErrors.name && (
              <p id="contact-name-error" className="os-secure-error">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="os-secure-field">
            <div className="os-secure-label-row">
              <label htmlFor="contact-email">
                {t.contact_form.email_label}
              </label>
              <span className="os-secure-required" aria-hidden="true">
                *
              </span>
            </div>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              maxLength={EMAIL_MAX}
              autoComplete="email"
              inputMode="email"
              dir="ltr"
              placeholder={t.contact_form.email_placeholder}
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={describedBy(
                "contact-email-help",
                fieldErrors.email && "contact-email-error",
              )}
              ref={(element) => {
                fieldRefs.current.email = element;
              }}
              onChange={(event) => {
                handleTyping();
                clearPassingError("email")(event);
              }}
              onBlur={handleBlur("email")}
            />
            <p id="contact-email-help" className="os-secure-help">
              {s.emailHelp}
            </p>
            {fieldErrors.email && (
              <p id="contact-email-error" className="os-secure-error">
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>

        <div className="os-secure-field">
          <div className="os-secure-label-row">
            <label htmlFor="contact-message">
              {t.contact_form.message_label}
            </label>
            <span className="os-secure-required" aria-hidden="true">
              *
            </span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            maxLength={MESSAGE_MAX}
            placeholder={t.contact_form.message_placeholder}
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={describedBy(
              "contact-message-count",
              fieldErrors.message && "contact-message-error",
            )}
            ref={(element) => {
              fieldRefs.current.message = element;
            }}
            onChange={handleMessageChange}
            onBlur={handleBlur("message")}
          />
          <p id="contact-message-count" className="os-secure-help">
            {s.characters
              .replace("{count}", String(messageLength))
              .replace("{max}", String(MESSAGE_MAX))}
          </p>
          {fieldErrors.message && (
            <p id="contact-message-error" className="os-secure-error">
              {fieldErrors.message}
            </p>
          )}
        </div>

        {showFallback && (
          <div className="os-secure-fallback">
            {phase === "FAILED" && (
              <p role="alert" className="os-secure-error">
                {t.contact_form.error_open_draft}
              </p>
            )}
            <p className="os-secure-hint">{s.handoffHint}</p>
            <p className="os-secure-address">
              <span>{s.addressLabel}</span>{" "}
              <a href={`mailto:${CONTACT_EMAIL_GMAIL}`} dir="ltr">
                {CONTACT_EMAIL_GMAIL}
              </a>
            </p>
            <CopyAddressControl />
          </div>
        )}

        <div className="os-secure-footer">
          <p className="os-secure-note">{t.contact_form.mail_client_note}</p>
          {/* aria-disabled, not disabled: a disabled button drops keyboard focus while the
              draft opens, and focus should stay on the action. */}
          <button
            type="submit"
            className="os-button"
            aria-disabled={phase === "OPENING" || undefined}
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
