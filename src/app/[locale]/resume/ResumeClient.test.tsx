import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { getDictionary, type Locale } from "@/i18n";
import { formatDate, formatNumber } from "@/i18n/format";
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
      // Every résumé line appears once, in the PDF's order. Screen-reader-only
      // "opens in a new tab" notes are not part of the visible résumé text.
      const visible = container.cloneNode(true) as HTMLElement;
      visible.querySelectorAll(".sr-only").forEach((node) => node.remove());
      const text = visible.textContent ?? "";
      let cursor = -1;
      for (const [key, value] of Object.entries(dictionary.resume)) {
        if (key === "expected_completion" || key === "education_final_session") continue;
        const at = text.indexOf(value, cursor + 1);
        expect(at, `${locale}: resume.${key} in order`).toBeGreaterThan(cursor);
        cursor = at;
      }
      expect(text).toContain(
        "raoof.r12@gmail.com · linkedin.com/in/mohammad-raouf-abedini-885a9226a",
      );
      expect(text).toContain(
        "github.com/Raoof128 · raoufabedini.dev · ORCID 0009-0000-6214-258X",
      );
      expect(text).not.toMatch(/\+61|402 310 686/);
    },
  );
});

describe("expected qualification status", () => {
  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "retains the source-backed expected completion date in %s",
    async (locale) => {
      const dictionary = await getDictionary(locale);
      const expectedDate = formatDate("2027-06-01", locale, {
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
      expect(note.querySelector("time")).toHaveAttribute("datetime", "2027-06");
      const education = screen.getByRole("region", { name: dictionary.about.education });
      expect(within(education).getByText(dictionary.resume.education_final_session)).toBeVisible();
      const diploma = within(education).getByRole("heading", { name: dictionary.about.degree_diploma })
        .closest("article")!;
      expect(diploma.querySelector('time[datetime="2023-07"]')).toHaveTextContent(
        formatDate("2023-07-01", locale, { month: "long", year: "numeric", calendar: "gregory" }),
      );
      expect(diploma.querySelector('time[datetime="2024-05"]')).toHaveTextContent(
        formatDate("2024-05-01", locale, { month: "long", year: "numeric", calendar: "gregory" }),
      );
      for (const unsupportedMark of [76.27, 71.75]) {
        expect(education.textContent).not.toContain(
          formatNumber(unsupportedMark, locale, { minimumFractionDigits: 2 }),
        );
      }
      about.unmount();
      render(provider(<ResumeClient />));
      const degree = screen.getByRole("heading", { name: dictionary.resume.edu1_title })
        .closest(".os-resume-item")!;
      expect(degree).toHaveTextContent(dictionary.resume.edu1_period);
      expect(degree).toHaveTextContent(dictionary.resume.edu1_meta);
    },
  );
});

describe("PDF-backed professional experience", () => {
  it.each(locales)(
    "separates Alignerr evaluation and the current Syllabus-Sync cofounder role in %s",
    async (locale) => {
      const dictionary = await getDictionary(locale);
      render(
        <I18nProvider locale={locale} dictionary={dictionary}>
          <ResumeClient />
        </I18nProvider>,
      );
      const experience = screen.getByRole("region", { name: dictionary.resume.s06_heading });
      const roles = within(experience).getAllByRole("heading", { level: 4 });
      expect(roles.map((role) => role.textContent)).toEqual([
        dictionary.resume.alignerr_title,
        dictionary.resume.syllabus_title,
        dictionary.resume.freelance_title,
        dictionary.resume.pharmacy_title,
      ]);
      const alignerr = roles[0].closest(".os-resume-item")!;
      expect(alignerr).toHaveTextContent(dictionary.resume.alignerr_period);
      expect(alignerr).toHaveTextContent(dictionary.resume.alignerr_meta);
      expect(alignerr).toHaveTextContent(dictionary.resume.alignerr_b1);
      const syllabus = roles[1].closest(".os-resume-item")!;
      expect(syllabus).toHaveTextContent(dictionary.resume.syllabus_period);
      expect(syllabus).toHaveTextContent(dictionary.resume.syllabus_b1);
    },
  );
});
