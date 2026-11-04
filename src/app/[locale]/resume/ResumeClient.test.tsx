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
      const dates = screen.getByText(
        (_, element) =>
          // The Apple 2026 redesign replaced Tailwind class strings with os-resume-* classes.
          element?.tagName === "DIV" &&
          element.classList.contains("os-resume-period") &&
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
      expect(dates.querySelector('time[datetime="2027-06"]')).toBeInTheDocument();
      expect(screen.getByText(dictionary.resume.education_final_session)).toBeVisible();
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
      const alignerr = within(experience).getByRole("heading", { name: dictionary.resume.exp_alignerr_title })
        .closest(".os-resume-item")!;
      expect(alignerr).toHaveTextContent(dictionary.resume.exp_alignerr_employer);
      expect(alignerr.querySelector('time[datetime="2026-01"]')).toBeInTheDocument();
      expect(alignerr.querySelector('time[datetime="2026-03"]')).toBeInTheDocument();
      expect(alignerr).toHaveTextContent(dictionary.resume.s07_bullet1);
      expect(screen.getAllByText(dictionary.resume.s07_bullet1)).toHaveLength(1);

      const syllabus = within(experience).getByRole("heading", { name: dictionary.resume.exp_syllabus_title })
        .closest(".os-resume-item")!;
      expect(syllabus).toHaveTextContent(dictionary.resume.exp_syllabus_employer);
      expect(syllabus).toHaveTextContent(dictionary.resume.exp_syllabus_bullet1);
      expect(syllabus).toHaveTextContent(dictionary.resume.exp_syllabus_bullet2);
      expect(syllabus.querySelector('time[datetime="2026-05"]')).toHaveTextContent(
        formatDate("2026-05-01", locale, { month: "long", year: "numeric", calendar: "gregory" }),
      );
      const startup = within(syllabus as HTMLElement).getByRole("link", { name: /syllabus-sync\.app/ });
      expect(startup).toHaveAttribute("href", "https://syllabus-sync.app");
      expect(startup).toHaveAttribute("target", "_blank");
      expect(startup).toHaveAttribute("rel", "noopener noreferrer");
      expect(screen.getByText(dictionary.resume.s08_available)).toBeVisible();
    },
  );
});
