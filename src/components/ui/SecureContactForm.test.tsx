import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  CopyAddressControl,
  SECURE_CONTACT_COPY,
  SecureContactForm,
} from "./SecureContactForm";
import { I18nProvider } from "@/i18n/provider";
import type { Locale } from "@/i18n";
import en, { type Dictionary } from "@/i18n/locales/en";
import fa from "@/i18n/locales/fa";
import ar from "@/i18n/locales/ar";
import zh from "@/i18n/locales/zh";
import es from "@/i18n/locales/es";
import { CONTACT_EMAIL_GMAIL } from "@/lib/constants";

function renderForm(locale: Locale = "en", dictionary: Dictionary = en) {
  return render(
    <I18nProvider locale={locale} dictionary={dictionary}>
      <SecureContactForm />
    </I18nProvider>,
  );
}

function fillDraft(dictionary: Dictionary = en) {
  fireEvent.change(screen.getByLabelText(dictionary.contact_form.name_label), {
    target: { value: "Raouf & Co" },
  });
  fireEvent.change(screen.getByLabelText(dictionary.contact_form.email_label), {
    target: { value: "raouf@example.com" },
  });
  fireEvent.change(
    screen.getByLabelText(dictionary.contact_form.message_label),
    {
      target: { value: "Hello! سلام? subject=other & body=other" },
    },
  );
}

function submitDraft(locale: Locale = "en") {
  const form = screen
    .getByRole("button", { name: SECURE_CONTACT_COPY[locale].submit })
    .closest("form");
  expect(form).not.toBeNull();
  fireEvent.submit(form as HTMLFormElement);
}

describe("SecureContactForm", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders all required input fields", () => {
    renderForm();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("does not show a draft reference, since no server record exists", () => {
    renderForm();

    expect(screen.queryByText(/draft id/i)).not.toBeInTheDocument();
    expect(document.querySelector(".os-secure-trace")).toBeNull();
  });

  it("marks required fields and shows the message limit", () => {
    renderForm();

    expect(screen.getByLabelText(en.contact_form.name_label)).toBeRequired();
    expect(screen.getByLabelText(en.contact_form.email_label)).toBeRequired();
    expect(screen.getByLabelText(en.contact_form.message_label)).toBeRequired();
    expect(
      screen.getByText(SECURE_CONTACT_COPY.en.requiredLegend),
    ).toBeInTheDocument();
    expect(screen.getByText("0 of 2000 characters used")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAccessibleDescription(
      SECURE_CONTACT_COPY.en.emailHelp,
    );
  });

  it("shows the draft editing state while the user is typing", () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "A" },
    });
    expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
  });

  it("runs validation itself, so empty submits reach the component", () => {
    renderForm();
    const form = screen
      .getByRole("button", { name: SECURE_CONTACT_COPY.en.submit })
      .closest("form");
    expect(form).toHaveAttribute("novalidate");

    submitDraft();

    expect(screen.getByLabelText(/name/i)).toHaveFocus();
    expect(screen.getByLabelText(/name/i)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText(/name/i)).toHaveAccessibleDescription(
      SECURE_CONTACT_COPY.en.nameRequired,
    );
  });

  it("ties an invalid email error to its field and moves focus there", () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Raouf" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Hello from tests" },
    });

    submitDraft();

    const email = screen.getByLabelText(/email/i);
    expect(email).toHaveFocus();
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription(/valid email address/i);
    expect(screen.getByLabelText(/name/i)).not.toHaveAttribute("aria-invalid");
  });

  it("treats a whitespace-only name as missing", () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "   " },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "raouf@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Hello from tests" },
    });
    submitDraft();

    expect(screen.getByLabelText(/name/i)).toHaveAccessibleDescription(
      SECURE_CONTACT_COPY.en.nameRequired,
    );
  });

  it("drops a field's error as soon as its value passes, without waiting for blur", () => {
    renderForm();
    submitDraft();

    const message = screen.getByLabelText(/message/i);
    expect(message).toHaveAttribute("aria-invalid", "true");

    fireEvent.change(message, { target: { value: "Hello from tests" } });

    expect(message).not.toHaveAttribute("aria-invalid");
  });

  describe("email draft lifecycle", () => {
    const openDraft = vi.fn();

    beforeEach(() => {
      vi.useFakeTimers();
      openDraft.mockReset();
      const actualWindow = window;
      // JSDOM's Location methods are immutable, so replace only this external boundary.
      vi.stubGlobal(
        "window",
        new Proxy(actualWindow, {
          get(target, property) {
            if (property === "location") return { assign: openDraft };
            return Reflect.get(target, property, target);
          },
        }),
      );
    });

    afterEach(() => {
      cleanup();
      vi.clearAllTimers();
      vi.useRealTimers();
      vi.unstubAllGlobals();
    });

    it("opens one encoded draft and reports a handoff, not a sent email", () => {
      renderForm();
      fillDraft();
      submitDraft();

      expect(screen.getByRole("button", { name: /opening/i })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      act(() => vi.advanceTimersByTime(600));

      expect(openDraft).toHaveBeenCalledTimes(1);
      const destination = new URL(openDraft.mock.calls[0][0]);
      expect(destination.protocol).toBe("mailto:");
      expect(destination.pathname).toBe(CONTACT_EMAIL_GMAIL);
      expect(destination.searchParams.get("subject")).toBe(
        `${en.seo.contact_title}: Raouf & Co`,
      );
      expect(destination.searchParams.get("body")).toBe(
        "Name: Raouf & Co\nEmail: raouf@example.com\n\nMessage:\nHello! سلام? subject=other & body=other",
      );
      expect([...destination.searchParams.keys()]).toEqual(["subject", "body"]);

      act(() => vi.advanceTimersByTime(1000));
      expect(
        screen.getByText(SECURE_CONTACT_COPY.en.statusHandoff),
      ).toBeInTheDocument();
      expect(
        screen.getByText(SECURE_CONTACT_COPY.en.handoffHint),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: SECURE_CONTACT_COPY.en.openAgain }),
      ).toBeEnabled();
      expect(openDraft).toHaveBeenCalledTimes(1);
    });

    it("keeps focus on the submit button while the draft opens, and ignores a repeat submit", () => {
      renderForm();
      fillDraft();
      const button = screen.getByRole("button", {
        name: SECURE_CONTACT_COPY.en.submit,
      });
      button.focus();
      submitDraft();

      const opening = screen.getByRole("button", { name: /opening/i });
      expect(opening).toHaveFocus();

      act(() => vi.advanceTimersByTime(300));
      fireEvent.submit(opening.closest("form") as HTMLFormElement);
      act(() => vi.advanceTimersByTime(300));

      // The repeat submit must not restart the 600 ms timer, so one draft opens at 600 ms.
      expect(openDraft).toHaveBeenCalledTimes(1);
    });

    it("opens the draft again from the Open again action", () => {
      renderForm();
      fillDraft();
      submitDraft();
      act(() => vi.advanceTimersByTime(600));

      fireEvent.submit(
        screen
          .getByRole("button", { name: SECURE_CONTACT_COPY.en.openAgain })
          .closest("form") as HTMLFormElement,
      );
      act(() => vi.advanceTimersByTime(600));

      expect(openDraft).toHaveBeenCalledTimes(2);
    });

    it.each([
      ["fa", fa],
      ["ar", ar],
      ["zh", zh],
      ["es", es],
    ] as const)(
      "localizes %s draft metadata while preserving supplied values",
      (locale, dictionary) => {
        renderForm(locale, dictionary);
        fillDraft(dictionary);
        submitDraft(locale);

        act(() => vi.advanceTimersByTime(600));
        const destination = new URL(openDraft.mock.calls[0][0]);
        expect(destination.pathname).toBe(CONTACT_EMAIL_GMAIL);
        expect(destination.searchParams.get("subject")).toBe(
          `${dictionary.seo.contact_title}: Raouf & Co`,
        );
        expect(destination.searchParams.get("body")).toBe(
          `${dictionary.contact_form.name_label}: Raouf & Co\n${dictionary.contact_form.email_label}: raouf@example.com\n\n${dictionary.contact_form.message_label}:\nHello! سلام? subject=other & body=other`,
        );
        expect([...destination.searchParams.keys()]).toEqual([
          "subject",
          "body",
        ]);
      },
    );

    it("cancels a pending draft when the form unmounts", () => {
      const { unmount } = renderForm();
      fillDraft();
      submitDraft();
      unmount();

      act(() => vi.advanceTimersByTime(1000));
      expect(openDraft).not.toHaveBeenCalled();
    });

    it("cancels stale text when the draft is edited before it opens", () => {
      renderForm();
      fillDraft();
      submitDraft();
      fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: "Updated after submit" },
      });

      act(() => vi.advanceTimersByTime(1000));
      expect(openDraft).not.toHaveBeenCalled();
      expect(
        screen.getByRole("button", { name: SECURE_CONTACT_COPY.en.submit }),
      ).toBeEnabled();

      submitDraft();
      act(() => vi.advanceTimersByTime(600));
      expect(openDraft).toHaveBeenCalledTimes(1);
      expect(
        new URL(openDraft.mock.calls[0][0]).searchParams.get("body"),
      ).toContain("Updated after submit");
    });

    it("provides a direct email fallback when opening the draft fails", () => {
      openDraft.mockImplementationOnce(() => {
        throw new Error("Navigation blocked");
      });
      renderForm();
      fillDraft();
      submitDraft();

      act(() => vi.advanceTimersByTime(600));
      expect(screen.getByRole("alert")).toHaveTextContent(
        en.contact_form.error_open_draft,
      );
      expect(
        screen.getByRole("link", { name: CONTACT_EMAIL_GMAIL }),
      ).toHaveAttribute("href", `mailto:${CONTACT_EMAIL_GMAIL}`);
      expect(
        screen.getByRole("button", { name: SECURE_CONTACT_COPY.en.submit }),
      ).toBeEnabled();
    });
  });

  describe("copy address", () => {
    const originalClipboard = Object.getOwnPropertyDescriptor(
      navigator,
      "clipboard",
    );

    afterEach(() => {
      cleanup();
      if (originalClipboard) {
        Object.defineProperty(navigator, "clipboard", originalClipboard);
      } else {
        delete (navigator as { clipboard?: unknown }).clipboard;
      }
    });

    it("copies the address and announces the result", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText },
        configurable: true,
      });
      render(
        <I18nProvider locale="en" dictionary={en}>
          <CopyAddressControl />
        </I18nProvider>,
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: SECURE_CONTACT_COPY.en.copyAddress,
        }),
      );

      expect(
        await screen.findByText(SECURE_CONTACT_COPY.en.addressCopied),
      ).toBeInTheDocument();
      expect(writeText).toHaveBeenCalledWith(CONTACT_EMAIL_GMAIL);
    });

    it("reports when the clipboard is unavailable", async () => {
      delete (navigator as { clipboard?: unknown }).clipboard;
      render(
        <I18nProvider locale="en" dictionary={en}>
          <CopyAddressControl />
        </I18nProvider>,
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: SECURE_CONTACT_COPY.en.copyAddress,
        }),
      );

      expect(
        await screen.findByText(SECURE_CONTACT_COPY.en.copyFailed),
      ).toBeInTheDocument();
    });
  });
});
