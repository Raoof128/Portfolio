import type { Locale } from "@/i18n";

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  kind: "project" | "paper" | "writing" | "experiment" | "action";
  titleLocale?: Locale;
  descriptionLocale?: Locale;
  /** Original titles remain searchable when their displayed prose is translated. */
  aliases?: string[];
}

export type SearchKind = "all" | SearchEntry["kind"];

function normalizeSearchText(value: string): string {
  return (
    value
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      // Persian and Arabic keyboards often emit different forms of the same letters.
      .replace(/ي/gu, "ی")
      .replace(/ك/gu, "ک")
      .replace(/ـ/gu, "")
      .replace(/[٠-٩۰-۹]/gu, (digit) =>
        String(digit.charCodeAt(0) - (digit <= "٩" ? 0x0660 : 0x06f0)),
      )
      .replace(/[\u200c\u200d]/gu, " ")
      .replace(/\s+/gu, " ")
      .trim()
  );
}

/** Match literal tokens, never a query-derived regular expression or markup. */
export function searchEntries(
  entries: readonly SearchEntry[],
  query: string,
  kind: SearchKind = "all",
): SearchEntry[] {
  const normalized = normalizeSearchText(query);
  const tokens = normalized ? normalized.split(" ") : [];

  return (
    entries
      .map((entry, index) => {
        const titles = [entry.title, ...(entry.aliases ?? [])].map(
          normalizeSearchText,
        );
        const text = `${titles.join(" ")} ${normalizeSearchText(entry.description)}`;
        const matches =
          (kind === "all" || entry.kind === kind) &&
          tokens.every((token) => text.includes(token));
        const titleHits = tokens.filter((token) =>
          titles.some((title) => title.includes(token)),
        ).length;
        const score = !normalized
          ? 0
          : titles.includes(normalized)
            ? 3
            : titles.some((title) => title.includes(normalized))
              ? 2
              : titleHits > 0
                ? 1
                : 0;
        return { entry, index, matches, score };
      })
      .filter((result) => result.matches)
      // Preserve source order for ties, including an empty search.
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .map(({ entry }) => entry)
  );
}
