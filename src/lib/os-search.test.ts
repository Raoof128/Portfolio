import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getOSCopy } from "@/components/os/os-copy";
import { getDictionary, type Locale } from "@/i18n";
import { getResumeSectionCopy } from "./resume-section-copy";
import { getOSAppDescriptor } from "./os-app-schema";
import { projects } from "./data";
import {
  buildSearchEntries,
  searchEntries,
  type SearchEntry,
} from "./os-search";

const fixture: SearchEntry[] = [
  {
    id: "body",
    title: "Security notes",
    description: "A résumé and café discussion.",
    href: "/write-ups/notes",
    kind: "writing",
  },
  {
    id: "title",
    title: "Résumé: Café research",
    description: "Professional work.",
    href: "/resume",
    kind: "action",
  },
  {
    id: "unicode",
    title: "پژوهش هوش مصنوعی · 人工智能研究",
    description: "روش‌های ارزیابی",
    href: "/fa/projects",
    kind: "project",
  },
];

describe("ResearchOS search", () => {
  it("ranks title matches ahead of description matches, ignoring accents and case", () => {
    expect(
      searchEntries(fixture, "  RESUME\t cafe  ").map((entry) => entry.id),
    ).toEqual(["title", "body"]);
    expect(searchEntries(fixture, "re\u0301sume\u0301")[0].id).toBe("title");
  });

  it("supports non-Latin text and joins words separated by Unicode whitespace", () => {
    expect(searchEntries(fixture, "مصنوعی\u00a0پژوهش")[0].id).toBe("unicode");
    expect(searchEntries(fixture, "人工智能")[0].id).toBe("unicode");
    expect(searchEntries(fixture, "روش های")[0].id).toBe("unicode");
  });

  it("accepts common Arabic/Persian keyboard letter and numeral variants", () => {
    const entry: SearchEntry = {
      id: "keyboard",
      title: "کارهای پژوهشی",
      description: "ارزیابی 138 مورد",
      href: "/fa/projects",
      kind: "project",
    };
    expect(searchEntries([entry], "كارهـاي پژوهشي ۱۳۸")).toEqual([entry]);
    expect(searchEntries([entry], "١٣٨")).toEqual([entry]);
  });

  it.each([".*", "[", "(a+)+$", "<script>alert(1)</script>", "$(whoami)"])(
    "treats the hostile-looking query %s as literal text",
    (query) => {
      expect(searchEntries(fixture, query)).toEqual([]);
    },
  );

  it("can find punctuation literally rather than treating it as a wildcard", () => {
    const literal: SearchEntry = {
      id: "literal",
      title: "A note about .* syntax",
      description: "Text only",
      href: "/write-ups/literal",
      kind: "writing",
    };
    expect(searchEntries([...fixture, literal], ".*")).toEqual([literal]);
  });

  it("finds a translated project by its original title without changing its displayed language", () => {
    const project: SearchEntry = {
      id: "translated",
      title: "پژوهش پنجره نامرئی",
      aliases: ["Invisible Window Research"],
      description: "آزمایش در محیط کنترل‌شده",
      titleLocale: "fa",
      descriptionLocale: "fa",
      href: "/fa/projects/invisible-window-research",
      kind: "project",
    };
    const match = searchEntries([project], "Invisible Window")[0];
    expect(match).toBe(project);
    expect(match.titleLocale).toBe("fa");
    expect(searchEntries([project], "نامرئی")).toEqual([project]);
  });

  it("returns only the selected kind and keeps stable source order for empty queries", () => {
    expect(searchEntries(fixture, "\t\n")).toEqual(fixture);
    expect(
      searchEntries(fixture, "resume", "writing").map((entry) => entry.id),
    ).toEqual(["body"]);
    expect(searchEntries(fixture, "unknown-content")).toEqual([]);
  });

  it("does not sort or mutate the provided index or its entries", () => {
    const input = Object.freeze(
      fixture.map((entry) => Object.freeze({ ...entry })),
    );
    const before = JSON.stringify(input);
    const results = searchEntries(input, "resume");
    expect(results).not.toBe(input);
    expect(JSON.stringify(input)).toBe(before);
    expect(results[0]).toBe(input[1]);
  });
});

describe("ResearchOS public index", () => {
  const locales: Locale[] = ["en", "fa", "ar", "zh", "es"];

  it.each(locales)(
    "finds the publications interface by its common English name in %s",
    (locale) => {
      const entries = buildSearchEntries(locale);
      const action = entries.find(
        (entry) => entry.id === "action:publications",
      );
      expect(searchEntries(entries, "Research publications")).toContain(action);
      expect(action?.titleLocale).toBe(locale);
      expect(action?.href).toBe(
        `${locale === "en" ? "" : `/${locale}`}/write-ups#research-publications`,
      );
    },
  );

  it.each(locales)(
    "discovers all three résumé interfaces through exact localized section URLs in %s",
    async (locale) => {
      const dictionary = await getDictionary(locale);
      const labels = getResumeSectionCopy(locale);
      expect(labels).toEqual({
        skills: dictionary.resume.s03_heading,
        experience: dictionary.resume.s06_heading,
        certifications: dictionary.resume.certs_heading,
      });
      const entries = buildSearchEntries(locale);
      const prefix = locale === "en" ? "" : `/${locale}`;
      for (const section of [
        "skills",
        "experience",
        "certifications",
      ] as const) {
        const action = entries.find(
          (entry) => entry.id === `action:${section}`,
        );
        expect(action).toMatchObject({
          kind: "action",
          title: labels[section],
          titleLocale: locale,
          descriptionLocale: locale,
          href: `${prefix}/resume#${section}`,
        });
        expect(searchEntries(entries, labels[section])).toContain(action);
        expect(
          getOSAppDescriptor(action!.href.split("#")[0], locale),
        ).toMatchObject({ route: "/resume", locale });
      }
      expect(new Set(entries.map((entry) => entry.id)).size).toBe(
        entries.length,
      );
    },
  );

  it.each(locales)(
    "builds real content routes for %s without localizing asset URLs",
    (locale) => {
      const entries = buildSearchEntries(locale);
      const prefix = locale === "en" ? "" : `/${locale}`;
      expect(
        entries.find((entry) => entry.id === "project:project-simurgh")?.href,
      ).toBe(`${prefix}/projects/project-simurgh`);
      expect(entries.find((entry) => entry.id === "action:resume")?.href).toBe(
        `${prefix}/resume`,
      );
      expect(
        entries.find((entry) => entry.id === "paper:project-simurgh:0")?.href,
      ).toBe("/Project_Simurgh_Preprint_v1.0.pdf");
      expect(
        entries.find((entry) => entry.id === "action:resume-pdf")?.href,
      ).toBe("/Mohammad_Raouf_Abedini_Resume.pdf");
      expect(new Set(entries.map((entry) => entry.id)).size).toBe(
        entries.length,
      );
      expect(entries.filter((entry) => entry.kind === "project")).toHaveLength(
        Object.keys(projects).length,
      );
    },
  );

  it("indexes only public summaries and existing safe paper/download references", () => {
    const entries = buildSearchEntries("en");
    for (const entry of entries) {
      const expectedKeys = [
        "description",
        "descriptionLocale",
        "href",
        "id",
        "kind",
        "title",
        "titleLocale",
      ];
      if (entry.id === "action:publications") {
        expectedKeys.push("aliases");
        expect(entry.aliases).toEqual([
          "Research publications",
          "Publications",
        ]);
      }
      expect(Object.keys(entry).sort()).toEqual(expectedKeys.sort());
      expect(entry.href).toMatch(/^(?:\/(?!\/)|https:\/\/)/);
      if (entry.href.startsWith("/") && entry.href.endsWith(".pdf")) {
        expect(
          existsSync(resolve(process.cwd(), "public", entry.href.slice(1))),
        ).toBe(true);
      }
    }
    expect(entries.some((entry) => entry.kind === "paper")).toBe(true);
    expect(entries.some((entry) => entry.kind === "experiment")).toBe(true);
    expect(entries.some((entry) => entry.kind === "writing")).toBe(true);
  });

  it.each(["fa", "ar", "zh", "es"] as Locale[])(
    "indexes translated prose for %s while preserving official paper titles",
    (locale) => {
      const source = buildSearchEntries("en");
      const localized = buildSearchEntries(locale);
      for (const entry of localized) {
        const original = source.find((item) => item.id === entry.id)!;
        expect(entry.descriptionLocale).toBe(locale);
        expect(entry.description).not.toBe(original.description);
        if (entry.kind === "paper") {
          expect(entry.title).toBe(original.title);
          expect(entry.titleLocale).toBe("en");
        } else if (["writing", "experiment"].includes(entry.kind)) {
          expect(entry.title).not.toBe(original.title);
          expect(entry.titleLocale).toBe(locale);
          expect(searchEntries(localized, entry.title)).toContain(entry);
          expect(searchEntries(localized, original.title)).toContain(entry);
        }
      }
    },
  );

  it.each(locales)("provides complete nonempty OS labels for %s", (locale) => {
    const labels = getOSCopy(locale);
    expect(Object.keys(labels).sort()).toEqual(
      Object.keys(getOSCopy("en")).sort(),
    );
    for (const text of Object.values(labels))
      expect(text.trim().length).toBeGreaterThan(0);
  });
});
