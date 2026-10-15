import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { getDictionary, locales, type Locale } from "@/i18n";
import { getOSCopy } from "./os-copy";
import GlobalNotFound, { metadata } from "@/app/global-not-found";
import {
  GlobalNotFoundContent,
  notFoundLocale,
  type NotFoundCopy,
} from "./GlobalNotFoundContent";
import { writeAppearance } from "./appearance";

async function recoveryCopy(): Promise<Record<Locale, NotFoundCopy>> {
  return Object.fromEntries(
    await Promise.all(
      (Object.keys(locales) as Locale[]).map(async (locale) => {
        const dictionary = await getDictionary(locale);
        return [
          locale,
          {
            title: dictionary.not_found.error_code,
            description: dictionary.not_found.description,
            home: dictionary.not_found.return_home,
            projects: dictionary.not_found.browse_projects,
            languageLabel: getOSCopy(locale).selectLanguage,
            languageName: locales[locale].label,
            dir: locales[locale].dir,
          },
        ];
      }),
    ),
  ) as Record<Locale, NotFoundCopy>;
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-appearance");
  writeAppearance("dark");
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.history.replaceState(null, "", "/");
});

describe("global static 404 recovery", () => {
  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "recovers an unmatched %s URL with correct language and paths",
    async (locale) => {
      const copies = await recoveryCopy();
      const prefix = locale === "en" ? "" : `/${locale}`;
      window.history.replaceState(null, "", `${prefix}/missing-document`);
      render(<GlobalNotFoundContent copies={copies} />);
      expect(
        screen.getByRole("heading", { name: copies[locale].title, level: 1 }),
      ).toBeInTheDocument();
      expect(document.documentElement.lang).toBe(locale);
      expect(document.documentElement.dir).toBe(copies[locale].dir);
      expect(document.title).toBe(
        `${copies[locale].title} | Mohammad Raouf Abedini`,
      );
      expect(document.head.querySelectorAll("title")).toHaveLength(1);
      expect(
        screen.getByRole("link", { name: copies[locale].home }),
      ).toHaveAttribute("href", prefix || "/");
      expect(
        screen.getByRole("link", { name: copies[locale].projects }),
      ).toHaveAttribute("href", `${prefix}/projects`);
    },
  );

  it("keeps English and all five ordinary recovery links in server HTML", async () => {
    const copies = await recoveryCopy();
    const html = renderToStaticMarkup(await GlobalNotFound());
    expect(html.match(/<title\b/g)).toHaveLength(1);
    expect(html).toContain(
      `<title>${copies.en.title} | Mohammad Raouf Abedini</title>`,
    );
    expect(metadata).not.toHaveProperty("title");
    expect(metadata.robots).toEqual({ index: false, follow: true });
    for (const locale of Object.keys(locales) as Locale[])
      expect(html).toContain(`hrefLang="${locale}"`);
  });

  it("changes language without navigating to another nonexistent route", async () => {
    const copies = await recoveryCopy();
    window.history.replaceState(null, "", "/fa/missing-document");
    render(<GlobalNotFoundContent copies={copies} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "es" } });
    expect(
      screen.getByRole("heading", { name: copies.es.title }),
    ).toBeInTheDocument();
    expect(document.documentElement.dir).toBe("ltr");
    expect(document.title).toBe(`${copies.es.title} | Mohammad Raouf Abedini`);
    expect(document.head.querySelectorAll("title")).toHaveLength(1);
    expect(window.location.pathname).toBe("/fa/missing-document");
    expect(
      screen.getByRole("link", { name: copies.es.projects }),
    ).toHaveAttribute("href", "/es/projects");
  });

  it("applies saved appearance, follows updates, and restores the document on unmount", async () => {
    const copies = await recoveryCopy();
    window.localStorage.setItem("researchos.appearance.v1", "light");
    document.documentElement.setAttribute("data-appearance", "prior");

    const view = render(<GlobalNotFoundContent copies={copies} />);
    expect(document.documentElement).toHaveAttribute(
      "data-appearance",
      "light",
    );

    act(() => writeAppearance("dark"));
    expect(document.documentElement).toHaveAttribute("data-appearance", "dark");

    view.unmount();
    expect(document.documentElement).toHaveAttribute(
      "data-appearance",
      "prior",
    );
    act(() => writeAppearance("light"));
    expect(document.documentElement).toHaveAttribute(
      "data-appearance",
      "prior",
    );
    document.documentElement.removeAttribute("data-appearance");
  });

  it("draws the mark inline so it takes the theme text colour, not an img", async () => {
    const copies = await recoveryCopy();
    const { container } = render(<GlobalNotFoundContent copies={copies} />);
    const mark = container.querySelector(".global-not-found-mark");
    expect(mark).not.toBeNull();
    expect(mark?.querySelector("img")).toBeNull();
    expect(mark?.querySelector("svg")).toHaveAttribute("fill", "currentColor");
    expect(mark?.querySelector("svg path")).not.toBeNull();
  });

  it("validates the locale as a whole path segment", () => {
    expect(notFoundLocale("/farsi/missing")).toBe("en");
    expect(notFoundLocale("/projects/fa")).toBe("en");
    expect(notFoundLocale("/ar/missing")).toBe("ar");
  });
});
