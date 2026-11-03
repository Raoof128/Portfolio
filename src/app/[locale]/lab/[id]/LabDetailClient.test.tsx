import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { getDictionary, type Locale } from "@/i18n";
import { I18nProvider } from "@/i18n/provider";
import { getPageSupportCopy } from "@/lib/page-support-copy";
import { labExperiments } from "@/lib/data";
import { getLocalizedLab } from "@/lib/localized-labs";
import { LabDetailClient } from "./LabDetailClient";

describe("accessible lab source listing", () => {
  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "%s keeps source keyboard reachable without announcing decorative line numbers",
    async (locale) => {
      const dictionary = await getDictionary(locale);
      const experiment = getLocalizedLab(labExperiments[0], locale);
      render(
        <I18nProvider locale={locale} dictionary={dictionary}>
          <LabDetailClient exp={experiment} />
        </I18nProvider>,
      );
      const listing = screen.getByRole("region", {
        name: getPageSupportCopy(locale).sourceCode,
      });
      expect(listing).toHaveAttribute("tabindex", "0");
      expect(listing).toHaveAttribute("dir", "ltr");
      expect(listing.querySelector("pre")).toHaveAttribute("lang", "en");
      const lines = experiment.codeSnippet.split("\n");
      const numbers = [...listing.querySelectorAll(".os-code-number")];
      expect(numbers).toHaveLength(lines.length);
      for (const [index, number] of numbers.entries()) {
        expect(number).toHaveTextContent(String(index + 1));
        expect(number).toHaveAttribute("aria-hidden", "true");
      }
      expect(
        [...listing.querySelectorAll(".os-code-text")].map(
          (line) => line.textContent,
        ),
      ).toEqual(lines);
    },
  );
});
