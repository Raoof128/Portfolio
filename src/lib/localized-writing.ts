import type { Locale } from "@/i18n";
import { writeups, type Writeup } from "@/lib/data";
import fa from "@/lib/writing-translations/fa.json";
import ar from "@/lib/writing-translations/ar.json";
import zh from "@/lib/writing-translations/zh.json";
import es from "@/lib/writing-translations/es.json";

export interface WriteupTranslation {
  title: string;
  tag: string;
  takeaway: string;
  lines: string[];
}

const translations: Record<
  Exclude<Locale, "en">,
  Record<string, WriteupTranslation>
> = {
  fa,
  ar,
  zh,
  es,
};

export function isTranslatableMarkdownLine(
  line: string,
  insideCode: boolean,
): boolean {
  const trimmed = line.trim();
  return (
    !insideCode &&
    trimmed !== "" &&
    !/^[-*]{3,}$/.test(trimmed) &&
    !(/^\|[\s:|-]+\|$/.test(trimmed) && trimmed.includes("-"))
  );
}

/** Keep executable examples and structural separators identical to the source.
 * Translation coverage is checked before returning a body: omissions fail the
 * static build instead of silently falling back to English on a localized page.
 */
export function translateWriteupMarkdown(
  content: string,
  translatedLines: string[],
): string {
  let insideCode = false;
  let index = 0;
  const result = content.split("\n").map((line) => {
    if (line.trim().startsWith("```")) {
      insideCode = !insideCode;
      return line;
    }
    if (!isTranslatableMarkdownLine(line, insideCode)) return line;
    const translation = translatedLines[index++];
    if (!translation?.trim())
      throw new Error(`Missing write-up translation at line ${index}`);
    return translation;
  });
  if (index !== translatedLines.length)
    throw new Error("Write-up translation/source line count mismatch");
  return result.join("\n");
}

export function getLocalizedWriteup(post: Writeup, locale: Locale): Writeup {
  if (locale === "en") return post;
  const translation = translations[locale][post.slug];
  if (!translation) throw new Error(`Missing ${locale} write-up: ${post.slug}`);
  return {
    ...post,
    title: translation.title,
    tag: translation.tag,
    takeaway: translation.takeaway,
    content: translateWriteupMarkdown(post.content, translation.lines),
  };
}

export function getLocalizedWriteups(locale: Locale): Writeup[] {
  return writeups.map((post) => getLocalizedWriteup(post, locale));
}
