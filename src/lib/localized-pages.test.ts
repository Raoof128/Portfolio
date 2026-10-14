import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { labExperiments, writeups } from "@/lib/data";
import { getLocalizedLabs } from "@/lib/localized-labs";
import {
  getLocalizedWriteups,
  isTranslatableMarkdownLine,
  translateWriteupMarkdown,
} from "@/lib/localized-writing";
import { getPageSupportCopy } from "@/lib/page-support-copy";
import type { Locale } from "@/i18n";
import reviewedSourceRevisions from "@/lib/writing-translations/source-revision.json";

const translatedLocales: Locale[] = ["fa", "ar", "zh", "es"];

function codeBlocks(body: string): string[] {
  return body.match(/```[\s\S]*?```/g) ?? [];
}

function proseLines(body: string): string[] {
  let insideCode = false;
  return body.split("\n").filter((line) => {
    if (line.trim().startsWith("```")) {
      insideCode = !insideCode;
      return false;
    }
    return isTranslatableMarkdownLine(line, insideCode);
  });
}

function inlineCode(body: string): string[] {
  return (body.replace(/```[\s\S]*?```/g, "").match(/`[^`\n]+`/g) ?? []).sort();
}

function numericEvidence(body: string): string[] {
  // Display grouping differs by locale (1,250 vs 1250 vs 1 250); compare digits.
  return (body.match(/\d+(?:[., ]\d+)*/g) ?? [])
    .map((value) => value.replace(/[., ]/g, ""))
    .sort();
}

describe("complete localized page content", () => {
  it("requires a translation review when authored English source changes", () => {
    const revisions: Record<string, string> = reviewedSourceRevisions;
    expect(Object.keys(revisions).sort()).toEqual(
      writeups.map((post) => post.slug).sort(),
    );
    for (const { slug, title, tag, takeaway, content } of writeups) {
      const revision = createHash("sha256")
        .update(JSON.stringify({ title, tag, takeaway, content }))
        .digest("hex");
      expect(
        revision,
        `Review all locale overlays before accepting changed source: ${slug}`,
      ).toBe(revisions[slug]);
    }
  });

  it("keeps the primary paper's tested scope and artifact limits explicit", () => {
    const source = writeups.find(
      (post) => post.slug === "invisible-window-research",
    )!;
    expect(source.updatedAt).toBe("2026-10-10");
    expect(source.content).toContain(
      "controlled laboratory, not commercial products",
    );
    expect(source.content).toContain("Linux X11 and Wayland were not tested");
    expect(source.content).toContain("n = 8");
    expect(source.content).toContain("p = 0.41");
    expect(source.content).toContain("not a browser `getDisplayMedia()` call");
    expect(source.content).toContain("source code is not publicly released");
    expect(source.content).not.toContain("Linux is not vulnerable");
    expect(source.content).not.toContain(
      "Public disclosure after 90-day window",
    );
  });

  it("retains the original English articles and experiments", () => {
    expect(getLocalizedWriteups("en")).toEqual(writeups);
    expect(getLocalizedLabs("en")).toEqual(labExperiments);
  });

  for (const locale of translatedLocales) {
    it(`${locale}: covers every article without replacing evidence or executable examples`, () => {
      const localized = getLocalizedWriteups(locale);
      expect(localized).toHaveLength(writeups.length);
      for (const [index, source] of writeups.entries()) {
        const article = localized[index];
        expect(article.slug).toBe(source.slug);
        expect(article.date).toBe(source.date);
        expect(article.updatedAt).toBe(source.updatedAt);
        expect(article.title).not.toBe(source.title);
        expect(article.takeaway).not.toBe(source.takeaway);
        expect(proseLines(article.content)).toHaveLength(
          proseLines(source.content).length,
        );
        expect(codeBlocks(article.content)).toEqual(codeBlocks(source.content));
        expect(inlineCode(article.content)).toEqual(inlineCode(source.content));
        expect(numericEvidence(article.content)).toEqual(
          numericEvidence(source.content),
        );
        expect(article.content.match(/\]\(([^)]+)\)/g) ?? []).toEqual(
          source.content.match(/\]\(([^)]+)\)/g) ?? [],
        );
        const sourceLines = proseLines(source.content);
        const translatedLines = proseLines(article.content);
        sourceLines.forEach((line, lineIndex) => {
          const translated = translatedLines[lineIndex];
          // Paragraph, list, heading, quote and table structures stay aligned.
          expect(
            translated.match(/^(?:#{2,3}\s|>\s|[-*]\s|\d+\.\s)/)?.[0],
          ).toBe(line.match(/^(?:#{2,3}\s|>\s|[-*]\s|\d+\.\s)/)?.[0]);
          if (line.trim().startsWith("|")) {
            expect(translated.split("|")).toHaveLength(line.split("|").length);
          }
          // Code-only specs may be unchanged; authored prose must be translated.
          if (
            !line.trim().startsWith("|") &&
            line.replace(/`[^`]+`/g, "").length > 90
          ) {
            expect(translated).not.toBe(line);
          }
        });
      }
    });

    it(`${locale}: covers all experiment prose while retaining original source code and status`, () => {
      const localized = getLocalizedLabs(locale);
      expect(localized).toHaveLength(labExperiments.length);
      for (const [index, source] of labExperiments.entries()) {
        const exp = localized[index];
        expect(exp.id).toBe(source.id);
        expect(exp.status).toBe(source.status);
        expect(exp.codeSnippet).toBe(source.codeSnippet);
        expect(exp.tech[0]).toBe(source.tech[0]);
        for (const key of [
          "title",
          "description",
          "objective",
          "constraints",
        ] as const) {
          expect(exp[key]).not.toBe(source[key]);
          expect(exp[key].trim().length).toBeGreaterThan(5);
          expect(numericEvidence(exp[key])).toEqual(
            numericEvidence(source[key]),
          );
        }
      }
    });

    it(`${locale}: explains original-language artifacts and localizes supporting labels`, () => {
      const copy = getPageSupportCopy(locale);
      const original = getPageSupportCopy("en");
      expect(copy.originalEnglishPDF).not.toBe(original.originalEnglishPDF);
      expect(copy.officialCertificateNames).not.toBe(
        original.officialCertificateNames,
      );
      expect(copy.coFounderSociety).not.toBe(original.coFounderSociety);
      expect(Object.keys(copy.aboutLabTags)).toEqual(
        Object.keys(original.aboutLabTags),
      );
    });
  }

  it("fails closed when translated prose is missing or stale rather than mixing languages", () => {
    expect(() =>
      translateWriteupMarkdown("## Header\n\nBody", ["عنوان"]),
    ).toThrow("Missing write-up translation");
    expect(() => translateWriteupMarkdown("Body", ["متن", "اضافی"])).toThrow(
      "line count mismatch",
    );
  });
});
