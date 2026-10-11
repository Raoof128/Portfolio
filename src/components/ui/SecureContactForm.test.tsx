import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { SecureContactForm } from "./SecureContactForm";
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

function submitDraft(dictionary: Dictionary = en) {
  const form = screen
    .getByRole("button", { name: dictionary.contact_form.cta_transmit })
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

  it("shows the draft editing state while the user is typing", () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "A" },
    });
    expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
  });

  it("shows a validation message for invalid email addresses", () => {
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

    expect(screen.getByRole("alert")).toHaveTextContent(/valid email address/i);
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

    it("opens one encoded draft and preserves the result after typing timers expire", () => {
      renderForm();
      fillDraft();
      submitDraft();

      expect(screen.getByRole("button", { name: /opening/i })).toBeDisabled();
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
      expect(screen.getByText(en.contact_form.status_sent)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /draft opened/i }),
      ).toBeDisabled();
      expect(openDraft).toHaveBeenCalledTimes(1);
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
        submitDraft(dictionary);

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
        screen.getByRole("button", { name: /open email draft/i }),
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
        screen.getByRole("button", { name: /open email draft/i }),
      ).toBeEnabled();
    });
  });
});
