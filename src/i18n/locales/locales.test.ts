import { describe, expect, it } from "vitest";
import { getOSCopy } from "@/components/os/os-copy";
import { type Locale, locales } from "@/i18n";
import en from "./en";
import fa from "./fa";
import ar from "./ar";
import zh from "./zh";
import es from "./es";

const dictionaries = { en, fa, ar, zh, es };
const supportedLocales = Object.keys(locales) as Locale[];

function flattenStrings(value: unknown, path = ""): Record<string, string> {
  if (typeof value === "string") return { [path]: value };
  if (!value || typeof value !== "object") {
    throw new Error(`Unexpected translation value at ${path}`);
  }
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, item]) =>
      Object.entries(flattenStrings(item, path ? `${path}.${key}` : key)),
    ),
  );
}

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/٬/g, ",");
}

// Product names, language names and source-code identifiers retain their spelling.
// These are the only dictionary paths whose entire value may match English.
const sourceIdentifiers = new Set([
  "about.hero_title",
  "about.spec3_item4",
  "about.spec3_item5",
  "about.spec4_item3",
  ...Array.from({ length: 8 }, (_, index) => `about.skill_group1_${index + 2}`),
  "about.skill_group2_7",
  "about.skill_group2_8",
  "about.skill_group2_9",
  "about.skill_group3_3",
  ...Array.from({ length: 9 }, (_, index) => `about.skill_group4_${index + 1}`),
  "about.skill_group5_1",
  "about.skill_group5_2",
  "about.skill_group5_3",
  "lab_page.id_label",
  "resume.s03_cat4_desc",
  "resume.proj1_stack",
  "resume.proj3_stack",
  "resume.proj4_tag",
  "resume.proj4_stack",
  "resume.proj5_stack",
  "resume.proj6_tag",
  "contact_form.email_placeholder",
  // Sentence-closing punctuation; identical in several scripts.
  "security_policy.ack_desc_suffix",
]);

describe("translation contracts", () => {
  const englishStrings = flattenStrings(en);
  const englishKeys = Object.keys(englishStrings).sort();
  const shellKeys = Object.keys(getOSCopy("en")).sort();

  it.each(supportedLocales)(
    "%s has complete nonempty dictionary and shell copy",
    (locale) => {
      const dictionary = flattenStrings(dictionaries[locale]);
      expect(Object.keys(dictionary).sort()).toEqual(englishKeys);
      expect(Object.keys(getOSCopy(locale)).sort()).toEqual(shellKeys);
      for (const [key, value] of Object.entries(dictionary)) {
        expect(value.trim(), `${locale}: ${key}`).not.toBe("");
      }
      for (const [key, value] of Object.entries(getOSCopy(locale))) {
        expect(value.trim(), `${locale} shell: ${key}`).not.toBe("");
      }
    },
  );

  it.each(supportedLocales.filter((locale) => locale !== "en"))(
    "%s has no untranslated English UI values",
    (locale) => {
      const dictionary = flattenStrings(dictionaries[locale]);
      const untranslated = Object.entries(dictionary)
        .filter(
          ([key, value]) =>
            value === englishStrings[key] && !sourceIdentifiers.has(key),
        )
        .map(([key]) => key);
      expect(untranslated).toEqual([]);
      const preferredNameKeys = new Set([
        "fullName",
        "givenName",
        "familyName",
        "displayName",
        "nameLocale",
      ]);
      const englishShell = getOSCopy("en");
      const untranslatedShell = Object.entries(getOSCopy(locale))
        .filter(
          ([key, value]) =>
            value === englishShell[key as keyof typeof englishShell] &&
            !preferredNameKeys.has(key),
        )
        .map(([key]) => key);
      expect(untranslatedShell).toEqual([]);
    },
  );

  it.each(supportedLocales)(
    "%s uses the same preferred name and existing Simurgh count",
    (locale) => {
      const copy = getOSCopy(locale);
      expect(copy.fullName).toBe(dictionaries[locale].about.hero_title);
      expect(copy.fullName).toBe(`${copy.givenName} ${copy.familyName}`);
      expect(copy.nameLocale).toBe(
        locale === "fa" || locale === "ar" ? locale : "en",
      );
      if (copy.nameLocale === "fa" || copy.nameLocale === "ar") {
        expect(copy.fullName).toMatch(/\p{Script=Arabic}/u);
      }
      expect(normalizeDigits(dictionaries[locale].about.bio_2)).toContain(
        "3,057",
      );
      expect(normalizeDigits(dictionaries[locale].about.bio_2)).not.toContain(
        "989",
      );
    },
  );
});
