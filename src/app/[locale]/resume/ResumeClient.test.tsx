import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { getDictionary, type Locale } from "@/i18n";
import { formatDate } from "@/i18n/format";
import { I18nProvider } from "@/i18n/provider";
import { AboutClient } from "../about/AboutClient";
import { ResumeClient } from "./ResumeClient";
import { ApplicationVisibilityContext } from "@/components/os/application-context";

const locales: Locale[] = ["en", "fa", "ar", "zh", "es"];

afterEach(cleanup);

describe("discoverable résumé interfaces", () => {
  it.each(locales)(
    "preserves section text and ARIA references while foreground anchors change to retained-window IDs in %s",
    async (locale) => {
      const dictionary = await getDictionary(locale);
      const sections = {
        skills: dictionary.resume.s03_heading,
        experience: dictionary.resume.s06_heading,
        certifications: dictionary.resume.certs_heading,
      };
      const view = (active: boolean) => (
        <I18nProvider locale={locale} dictionary={dictionary}>
          <ApplicationVisibilityContext.Provider
            value={{ active, namespace: "pane--resume" }}
          >
            <ResumeClient />
          </ApplicationVisibilityContext.Provider>
        </I18nProvider>
      );
      const { container, rerender } = render(view(true));
      const originalText = container.textContent;
      for (const active of [true, false, true]) {
        rerender(view(active));
        expect(container.textContent).toBe(originalText);
        for (const [section, heading] of Object.entries(sections)) {
          const id = active ? section : `pane--resume-${section}`;
          const region = screen.getByRole("region", { name: heading });
          expect(region).toHaveAttribute("id", id);
          expect(region).toHaveAttribute("tabindex", "-1");
          expect(region).toHaveAttribute("aria-labelledby", `${id}-heading`);
          expect(region.querySelector("h3")).toHaveAttribute(
            "id",
            `${id}-heading`,
          );
          expect(region.querySelector("h3")).toHaveTextContent(heading);
          expect(
            document.getElementById(
              active ? `pane--resume-${section}` : section,
            ),
          ).toBeNull();
        }
        const ids = [...container.querySelectorAll("[id]")].map(
          (node) => node.id,
        );
        expect(new Set(ids).size).toBe(ids.length);
      }
    },
  );

  it.each(locales)(
    "server-renders public section fragments and original content without JavaScript in %s",
    async (locale) => {
      const dictionary = await getDictionary(locale);
      const markup = renderToStaticMarkup(
        <I18nProvider locale={locale} dictionary={dictionary}>
          <ResumeClient />
        </I18nProvider>,
      );
      const container = document.createElement("div");
      container.innerHTML = markup;
      for (const [section, heading] of [
        ["skills", dictionary.resume.s03_heading],
        ["experience", dictionary.resume.s06_heading],
        ["certifications", dictionary.resume.certs_heading],
      ]) {
        const target = container.querySelector(`#${section}`);
        expect(target).not.toBeNull();
        expect(target).toHaveAttribute("aria-labelledby", `${section}-heading`);
        expect(target?.querySelector("h3")).toHaveTextContent(heading);
      }
      expect(
        container.querySelector('a[href="/Mohammad_Raouf_Abedini_Resume.pdf"]'),
      ).not.toBeNull();
      expect(container.textContent).toContain(dictionary.resume.s03_cat1_desc);
      expect(container.textContent).toContain(dictionary.resume.exp1_bullet1);
      expect(container.textContent).toContain(
        dictionary.resume.expected_completion,
      );
    },
  );
});

describe("expected qualification status", () => {
  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "retains the source-backed expected completion date in %s",
    async (locale) => {
      const dictionary = await getDictionary(locale);
      const expectedDate = formatDate("2026-11-01", locale, {
        month: "long",
        year: "numeric",
        calendar: "gregory",
      });
      const provider = (child: React.ReactNode) => (
        <I18nProvider locale={locale} dictionary={dictionary}>
          {child}
        </I18nProvider>
      );
      const about = render(provider(<AboutClient />));
      const note = screen.getByText(
        (_, element) =>
          element?.tagName === "P" &&
          element.textContent?.startsWith(
            `${dictionary.resume.expected_completion}:`,
          ) === true,
      );
      expect(note).toHaveTextContent(expectedDate);
      expect(note.querySelector("time")).toHaveAttribute("datetime", "2026-11");
      about.unmount();
      render(provider(<ResumeClient />));
      const dates = screen.getByText(
        (_, element) =>
          element?.tagName === "DIV" &&
          element.className === "text-cyan font-mono text-sm mb-2" &&
          element.textContent?.includes(
            dictionary.resume.expected_completion,
          ) === true,
      );
      expect(dates).toHaveTextContent(expectedDate);
      expect(dates).toHaveTextContent(
        formatDate("2024-05-01", locale, {
          month: "long",
          year: "numeric",
          calendar: "gregory",
        }),
      );
    },
  );
});
