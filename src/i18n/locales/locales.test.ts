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
  "lab_page.id_label",
  // Résumé lines made only of names, years or code identifiers.
  "resume.skill4_desc",
  "resume.further_period",
  "resume.edu2_period",
  // "Preprint · DOI …" is the same word in Spanish.
  "resume.aion_meta",
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

  it.each(supportedLocales)(
    "%s keeps evaluation provenance explicit in metadata and introductory copy",
    (locale) => {
      const dictionary = dictionaries[locale];
      for (const value of [
        dictionary.seo.home_description,
        dictionary.seo.home_og_description,
        dictionary.seo.about_description,
        dictionary.hero.intro,
        dictionary.about.bio_1,
      ]) {
        expect(value).toContain("Anthropic");
        expect(value).toContain("Alignerr");
      }
    },
  );

  const permissionScope: Record<Locale, RegExp> = {
    en: /is permitted to do/,
    fa: /اختیارات مجاز/,
    ar: /يُسمح للوكيل بفعله/,
    zh: /获准执行/,
    es: /lo que se permite hacer a un agente/,
  };

  it.each(supportedLocales)(
    "%s describes attested permissions in the search preview",
    (locale) => {
      expect(dictionaries[locale].seo.home_description).toMatch(
        permissionScope[locale],
      );
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
    "%s uses the same preferred name and current dated Simurgh proof and test counts",
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
      const currentStudy = normalizeDigits(dictionaries[locale].about.bio_2);
      expect(currentStudy).toContain("5,171");
      expect(currentStudy).toMatch(/(?:^|\D)39(?:\D|$)/);
      expect(currentStudy).toContain("Lean 4");
      expect(currentStudy).toMatch(/(?:^|\D)92(?:\D|$)/);
      expect(currentStudy).not.toMatch(/3,057|989/);
    },
  );

  // The web résumé mirrors the PDF line by line. Every translated line must keep
  // each number, DOI and named system that its English line states, so a
  // translation can neither drop nor alter a résumé fact.
  const namedTokens = [
    "Project Simurgh",
    "Invisible Window",
    "Aion-BibleQA",
    "Banking Shield",
    "Mehr Guard",
    "SentinelSSH",
    "SentinelFlow",
    "Project Zurvan",
    "Syllabus-Sync",
    "Alignerr",
    "Anthropic",
    "Claude",
    "OpenAI",
    "Llama-3.2-3B",
    "Llama-3.3-70B",
    "Llama Guard 4",
    "gpt-6-luna",
    "AgentDojo",
    "MCP",
    "Ed25519",
    "Lean 4",
    "WebAuthn",
    "TOTP",
    "Postgres",
    "OWASP Top 10",
    "OAuth 2.0",
    "Airtasker",
    "MITRE ATT&CK",
    "MSRC",
    "Kotlin Multiplatform",
    "HMAC",
    "Wilson",
    "R@5",
    "F1",
    "sorry",
  ];

  it.each(supportedLocales.filter((locale) => locale !== "en"))(
    "%s résumé keeps every number, DOI and named system of each English line",
    (locale) => {
      const english = en.resume as Record<string, string>;
      const translated = dictionaries[locale].resume as Record<string, string>;
      for (const [key, value] of Object.entries(english)) {
        if (key === "expected_completion") continue;
        const target = normalizeDigits(translated[key]);
        for (const doi of value.match(/10\.5281\/zenodo\.\d+/g) ?? [])
          expect(target, `${locale}: resume.${key} DOI`).toContain(doi);
        for (const name of namedTokens.filter((token) => value.includes(token)))
          expect(target, `${locale}: resume.${key} ${name}`).toContain(name);
        const numbers = value
          .replace(/10\.5281\/zenodo\.\d+/g, "")
          .match(/\d+(?:\.\d+)?/g);
        for (const number of numbers ?? [])
          expect(
            target.replace(/(\d),(?=\d{3}\b)/g, "$1"),
            `${locale}: resume.${key} number ${number}`,
          ).toContain(number);
      }
    },
  );

  it.each(supportedLocales)(
    "%s states the résumé's figures for the facts that changed",
    (locale) => {
      const resume = dictionaries[locale].resume;
      const facts: Array<[string, string[]]> = [
        [resume.syllabus_b1, ["503", "92", "WebAuthn", "TOTP", "Postgres"]],
        [resume.further_b5, ["500,000+", "218", "17", "SentinelSSH"]],
        [resume.further_b4, ["25", "87%", "5", "19"]],
        [resume.aion_b1, ["40", "0.941", "0.978", "6/6"]],
        [resume.simurgh_b5, ["9/140", "0/140", "0/949", "949/949"]],
        [resume.simurgh_b6, ["Ed25519", "39", "Lean 4", "5,171"]],
        [resume.simurgh_b7, ["919", "141", "README"]],
        [resume.freelance_b1, ["OWASP Top 10", "OAuth 2.0", "5.0", "31"]],
        [resume.pharmacy_b1, ["30%"]],
      ];
      for (const [line, tokens] of facts) {
        const text = normalizeDigits(line);
        for (const token of tokens) expect(text).toContain(token);
        expect(text).not.toMatch(/1,343|155|28\.4|3,334|0\.75|97\/97|7\/10|x86_64|SHA-256/);
      }
      expect(resume.education_final_session).toContain("2027");
    },
  );
});
