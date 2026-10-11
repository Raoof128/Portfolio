import { describe, expect, it } from "vitest";
import type { Locale } from "@/i18n";
import { projects } from "./data";
import { buildProjectSummaries } from "./project-summaries";
import {
  getLocalizedProject,
  getProjectDiagramCopy,
} from "./project-localization";
import { projectSlugs } from "./project-content/types";
import { projectTerms } from "./project-content/terms";

const translatedLocales: Locale[] = ["fa", "ar", "zh", "es"];
const technologyTags = new Set([
  "Windows",
  "macOS",
  "WebRTC",
  "Ed25519",
  "AGPL-3.0",
  "Python",
  "LLM",
  "MCP",
  "SQLite",
  "Electron",
  "React",
  "TypeScript",
  "KMP",
  "Android",
  "iOS",
  "Next.js 16",
  "Supabase",
  "WebAuthn",
  "React 19",
  "Vite",
  "i18n / RTL",
  "Litestar",
  "C++20",
  "CMake",
  "Google Test",
  "C++17",
  "libpcap",
  "IDS",
  "eBPF",
  "Go",
  "Tauri v2",
  "Rust",
  "FFmpeg",
  "React Native",
  "Expo",
  "pgvector",
  "Gemini AI",
]);

const invariantTokens = [
  "SetWindowDisplayAffinity",
  "WDA_EXCLUDEFROMCAPTURE",
  "NSWindow.SharingType.none",
  "CGWindowListCreateImage",
  "ScreenCaptureKit",
  "getDisplayMedia()",
  "Ed25519",
  "Llama Guard 4 12B",
  "Llama-3.3-70B",
  "v2.49.0",
  "AGPL-3.0",
  "detector-v2",
  "zurvan_search",
  "zurvan_context",
  "zurvan_remember",
  "zurvan_decision_add",
  "~/.zurvan/projects.json",
  "./judge/verify_offline.sh",
  "/auth/refresh",
  "TAKEAWAY_ENCRYPTION_KEY",
  "SameSite=Strict",
  "O(1)",
  "p50/p99",
  "Market",
  "Markdown",
  "sessionStorage",
  "R@5 = 0.941",
  "citation_support = 0.978",
];

function numericValues(text: string): string[] {
  // Numeric evidence remains Western digits. Ignore letters in a11y/e2e, and
  // punctuation used for display grouping; version/API fidelity is checked below.
  return [
    ...new Set(
      (
        text.match(/\b\d+(?:[.,]\d+)*(?:\/\d+(?:[.,]\d+)*)?(?:%|\+)?/g) ?? []
      ).map((value) => value.replace(/[,+%]/g, "")),
    ),
  ];
}

describe("Complete project localization", () => {
  it("keeps an explicit complete inventory rather than silently omitting new projects", () => {
    expect([...projectSlugs].sort()).toEqual(Object.keys(projects).sort());
    for (const project of Object.values(projects)) {
      for (const tag of project.tags) {
        expect(
          technologyTags.has(tag) || Object.hasOwn(projectTerms, tag),
          tag,
        ).toBe(true);
      }
    }
  });

  it.each(translatedLocales)(
    "provides every narrative field in %s with no English fallback",
    (locale) => {
      for (const source of Object.values(projects)) {
        const result = getLocalizedProject(source, locale);
        expect(result.contentLocale).toBe(locale);
        expect(
          result.description,
          `${locale}/${source.slug}/description`,
        ).not.toBe(source.description);
        expect(
          result.fullDescription,
          `${locale}/${source.slug}/fullDescription`,
        ).not.toBe(source.fullDescription);
        expect(result.problem, `${locale}/${source.slug}/problem`).not.toBe(
          source.problem,
        );
        expect(result.localizedDescription).toBeUndefined();
        expect(result.localizedFullDescription).toBeUndefined();
        for (const [field, originals, translated] of [
          ["solution", source.solution, result.solution],
          ["proof", source.proof, result.proof],
          ["features", source.build.features, result.build.features],
          ["measures", source.secure.measures, result.secure.measures],
        ] as const) {
          expect(translated, `${locale}/${source.slug}/${field}`).toHaveLength(
            originals.length,
          );
          translated.forEach((value, index) => {
            expect(value.trim()).not.toBe("");
            expect(
              value,
              `${locale}/${source.slug}/${field}/${index}`,
            ).not.toBe(originals[index]);
          });
        }
        expect(result.tags).toHaveLength(source.tags.length);
        expect(result.build.stack).toHaveLength(source.build.stack.length);
        source.tags.forEach((tag, index) => {
          expect(result.tags[index]).toBe(
            technologyTags.has(tag)
              ? tag
              : projectTerms[tag][locale as Exclude<Locale, "en">],
          );
        });
      }
    },
  );

  it.each(translatedLocales)(
    "preserves evidence numbers and technical tokens in %s",
    (locale) => {
      for (const source of Object.values(projects)) {
        const result = getLocalizedProject(source, locale);
        const fieldPairs = [
          [source.description, result.description],
          [source.fullDescription, result.fullDescription],
          [source.problem, result.problem],
          ...source.solution.map((value, i) => [value, result.solution[i]]),
          ...source.proof.map((value, i) => [value, result.proof[i]]),
          ...source.build.features.map((value, i) => [
            value,
            result.build.features[i],
          ]),
          ...source.secure.measures.map((value, i) => [
            value,
            result.secure.measures[i],
          ]),
          ...source.build.stack.map((value, i) => [
            value,
            result.build.stack[i],
          ]),
          ...(source.papers ?? []).map((paper, i) => [
            paper.description ?? "",
            result.papers?.[i].description ?? "",
          ]),
        ];
        fieldPairs.forEach(([original, translated]) => {
          for (const value of numericValues(original)) {
            expect(
              numericValues(translated),
              `${locale}/${source.slug}: ${original}`,
            ).toContain(value);
          }
          for (const token of invariantTokens) {
            if (original.includes(token))
              expect(
                translated,
                `${locale}/${source.slug}: ${token}`,
              ).toContain(token);
          }
        });
      }
    },
  );

  it.each(translatedLocales)(
    "preserves original resources and publication identity in %s",
    (locale) => {
      for (const source of Object.values(projects)) {
        const original = JSON.stringify(source);
        const result = getLocalizedProject(source, locale);
        expect(result.links).toEqual(source.links);
        expect(result.citation).toBe(source.citation);
        expect(result.slug).toBe(source.slug);
        expect(result.year).toBe(source.year);
        expect(result.category).toBe(source.category);
        expect(result.papers?.length).toBe(source.papers?.length);
        source.papers?.forEach((paper, i) => {
          const translated = result.papers![i];
          for (const key of [
            "title",
            "href",
            "kind",
            "venue",
            "year",
            "doi",
          ] as const) {
            expect(translated[key]).toBe(paper[key]);
          }
          expect(translated.label).not.toBe(paper.label);
          if (paper.status) expect(translated.status).not.toBe(paper.status);
          if (paper.description)
            expect(translated.description).not.toBe(paper.description);
        });
        expect(JSON.stringify(source)).toBe(original);
      }
    },
  );

  it.each(["en", ...translatedLocales] as Locale[])(
    "ships compact active-locale summaries and diagram labels for %s",
    (locale) => {
      const summaries = buildProjectSummaries(locale);
      expect(summaries).toHaveLength(13);
      summaries.forEach((summary) => {
        expect(summary.descriptionLocale).toBe(locale);
        expect(summary).not.toHaveProperty("proof");
        expect(summary).not.toHaveProperty("localizedDescription");
      });
      const diagram = getProjectDiagramCopy(locale);
      expect(diagram.boundaries).toHaveLength(4);
      expect(diagram.stages).toHaveLength(4);
      if (locale !== "en") {
        const english = getProjectDiagramCopy("en");
        for (const [key, value] of Object.entries(diagram)) {
          if (typeof value === "string")
            expect(value).not.toBe(english[key as keyof typeof english]);
        }
      }
    },
  );

  it("preserves the original English dossier while discarding unused locale maps", () => {
    for (const source of Object.values(projects)) {
      expect(getLocalizedProject(source, "en")).toEqual({
        ...source,
        localizedDescription: undefined,
        localizedFullDescription: undefined,
        contentLocale: "en",
        titleLocale: "en",
      });
    }
  });

  it("rejects a newly added untranslated dossier instead of displaying English", () => {
    expect(() =>
      getLocalizedProject({ ...projects.aion, slug: "untranslated" }, "fa"),
    ).toThrow("Missing project translation");
  });
});
