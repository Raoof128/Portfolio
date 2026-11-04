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
    en: /was allowed to do/,
    fa: /اختیارات مجاز/,
    ar: /سُمح للوكيل بفعله/,
    zh: /获准执行/,
    es: /acciones permitidas/,
  };

  it.each(supportedLocales)(
    "%s describes attested permissions in the search preview",
    (locale) => {
      expect(dictionaries[locale].seo.home_description).toMatch(
        permissionScope[locale],
      );
    },
  );

  const benchmarkScope: Record<Locale, [RegExp, RegExp, RegExp, RegExp]> = {
    en: [/single-thread/, /synthetic/, /cancellation/, /pure-parse/],
    fa: [/تک‌ریسمانی/, /مصنوعی/, /لغو/, /صرفاً تجزیه/],
    ar: [/أحادي الخيط/, /اصطناعي/, /إلغاء/, /للتحليل فقط/],
    zh: [/单线程/, /合成/, /取消/, /纯解析/],
    es: [/un solo hilo/, /sintético/, /cancelación/, /análisis puro/],
  };

  it.each(supportedLocales)(
    "%s distinguishes synthetic benchmarks from end-to-end processing claims",
    (locale) => {
      const { proj3_desc, proj4_desc } = dictionaries[locale].resume;
      const [singleThread, synthetic, cancellation, pureParse] =
        benchmarkScope[locale];
      expect(proj3_desc).toMatch(singleThread);
      expect(proj3_desc).toMatch(synthetic);
      expect(proj3_desc).toMatch(cancellation);
      expect(proj3_desc).toContain("9.29M");
      expect(proj3_desc).toContain("O(log M)");
      expect(proj3_desc).toContain("p50/p99");
      expect(proj4_desc).toMatch(singleThread);
      expect(proj4_desc).toMatch(synthetic);
      expect(proj4_desc).toMatch(pureParse);
      expect(proj4_desc).toContain("28.4M");
      expect(proj4_desc).toContain("SYN");
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

  const studyScope: Record<
    Locale,
    {
      nullResult: RegExp;
      frozen: RegExp;
      proofFiles: RegExp;
      underAttack: RegExp;
    }
  > = {
    en: {
      nullResult: /no incremental protection/i,
      frozen: /earlier frozen/i,
      proofFiles: /39 Lean 4 proof files/,
      underAttack: /utility under attack 949\/949/,
    },
    fa: {
      nullResult: /بدون حفاظت افزوده/,
      frozen: /مراحل ثابت‌شده قدیمی/,
      proofFiles: /39 فایل اثبات Lean 4/,
      underAttack: /سودمندی زیر حملهٔ 949\/949/,
    },
    ar: {
      nullResult: /لا حماية إضافية/,
      frozen: /مراحل سابقة مجمّدة/,
      proofFiles: /39 ملف إثبات في Lean 4/,
      underAttack: /منفعة تحت الهجوم 949\/949/,
    },
    zh: {
      nullResult: /无额外保护/,
      frozen: /早期冻结/,
      proofFiles: /39个 Lean 4 证明文件/,
      underAttack: /攻击下效用949\/949/,
    },
    es: {
      nullResult: /sin protección incremental/i,
      frozen: /etapas anteriores congeladas/i,
      proofFiles: /39 archivos de pruebas formales en Lean 4/,
      underAttack: /utilidad bajo ataque 949\/949/,
    },
  };

  it.each(supportedLocales)(
    "%s distinguishes the current two-model study, uncertainty and older frozen evidence",
    (locale) => {
      const resume = dictionaries[locale].resume;
      const transfer = normalizeDigits(resume.s02_bullet1);
      for (const token of [
        "24",
        "288",
        "17/24",
        "0/24",
        "23/24",
        "Llama-3.2-3B",
        "OpenAI",
        "gpt-6-luna",
        "2026",
      ]) {
        expect(transfer, `${locale}: current transfer result`).toContain(token);
      }
      expect(transfer).toMatch(studyScope[locale].nullResult);
      const uncertainty = normalizeDigits(resume.s02_bullet2);
      for (const token of ["Wilson", "95%", "43.6–97.0%", "0.0–39.0%"]) {
        expect(uncertainty, `${locale}: per-state uncertainty`).toContain(
          token,
        );
      }
      const integration = normalizeDigits(resume.s02_bullet3);
      for (const token of ["OpenAI", "8/8", "2/3", "5/5", "developer"]) {
        expect(
          integration,
          `${locale}: preserved integration failure`,
        ).toContain(token);
      }
      const frozen = normalizeDigits(resume.s02_bullet4);
      expect(frozen).toMatch(studyScope[locale].frozen);
      expect(frozen).toMatch(studyScope[locale].underAttack);
      expect(normalizeDigits(dictionaries[locale].about.bio_2)).toMatch(
        studyScope[locale].proofFiles,
      );
      for (const token of [
        "138/138",
        "120",
        "9/140",
        "0/140",
        "0/949",
        "949/949",
        "97/97",
        "7/10",
        "6/10",
      ]) {
        expect(frozen, `${locale}: frozen stage`).toContain(token);
      }
      const reproduction = normalizeDigits(resume.s02_bullet5);
      for (const token of ["SHA-256", "Ed25519", "Linux x86_64", "Python 3.12"])
        expect(
          reproduction,
          `${locale}: current and frozen archive scope`,
        ).toContain(token);
      const softwareDoiLabel =
        dictionaries[locale].project_detail.software_doi_record;
      expect(softwareDoiLabel).toContain("DOI");
      expect(softwareDoiLabel).not.toBe(
        dictionaries[locale].project_detail.doi_record,
      );
      for (const token of [
        "39",
        "Lean 4",
        "5,171",
        "19",
        "2026",
        "92",
        "10.5281/zenodo.21737792",
        "10.5281/zenodo.20374849",
      ]) {
        expect(
          reproduction,
          `${locale}: reproducibility and DOI provenance`,
        ).toContain(token);
      }
      const pilot = normalizeDigits(resume.proj2_desc);
      for (const token of [
        "40",
        "34",
        "6/6",
        "0.941",
        "0.978",
        "citation_support < 0.5",
        "0.75",
        "0.50",
        "Gemini 3.1 Flash Lite",
      ])
        expect(pilot, `${locale}: pilot denominator and judge scope`).toContain(
          token,
        );
    },
  );

  const employmentDates: Record<
    Locale,
    { pharmacyEnd: RegExp; available: RegExp; online: RegExp }
  > = {
    en: {
      pharmacyEnd: /Jan 2024/,
      available: /December 2026/,
      online: /fully online/,
    },
    fa: {
      pharmacyEnd: /ژانویه 2024/,
      available: /دسامبر 2026/,
      online: /کاملاً آنلاین/,
    },
    ar: {
      pharmacyEnd: /يناير 2024/,
      available: /ديسمبر 2026/,
      online: /بالكامل عبر الإنترنت/,
    },
    zh: {
      pharmacyEnd: /2024年1月/,
      available: /2026年12月/,
      online: /全程在线/,
    },
    es: {
      pharmacyEnd: /enero de 2024/,
      available: /diciembre de 2026/,
      online: /totalmente en línea/,
    },
  };

  it.each(supportedLocales)(
    "%s keeps profile facts and the dated CI test receipt scoped correctly",
    (locale) => {
      const { about, resume } = dictionaries[locale];
      expect(about.stats_preprints.trim()).not.toBe("");
      expect(about.stats_vendors.trim()).not.toBe("");
      expect(resume.exp_syllabus_employer).toContain("Syllabus-Sync");
      expect(resume.exp_syllabus_bullet1).toContain("WebAuthn");
      expect(resume.exp_syllabus_bullet1).toContain("TOTP");
      expect(resume.exp_syllabus_bullet1).toContain("Postgres");
      expect(resume.exp_syllabus_bullet2).toContain("1,343");
      expect(resume.exp_syllabus_bullet2).toContain("155");
      expect(resume.exp_syllabus_bullet2).toContain("17");
      expect(resume.exp_syllabus_bullet2).toContain("2026");
      expect(resume.exp_syllabus_bullet2).toContain("EDUCATE");
      const separateSecurityFailure: Record<Locale, RegExp> = {
        en: /separate security job failed/,
        fa: /کار امنیتی جداگانه ناموفق/,
        ar: /فشلت مهمة الأمن المنفصلة/,
        zh: /独立安全任务失败/,
        es: /job de seguridad separado falló/,
      };
      expect(resume.exp_syllabus_bullet2).toMatch(
        separateSecurityFailure[locale],
      );
      expect(resume.exp_alignerr_employer).toContain("Alignerr");
      expect(resume.exp_alignerr_employer).toContain("Anthropic");
      expect(resume.s07_bullet1).not.toContain("2024");
      expect(normalizeDigits(resume.exp2_employer)).toMatch(
        employmentDates[locale].pharmacyEnd,
      );
      expect(normalizeDigits(resume.s08_available)).toMatch(
        employmentDates[locale].available,
      );
      expect(resume.education_final_session).toContain("2027");
      expect(resume.education_final_session).toMatch(
        employmentDates[locale].online,
      );
      const experience = normalizeDigits(
        [
          resume.exp1_bullet1,
          resume.exp1_bullet2,
          resume.exp1_bullet3,
          resume.exp2_bullet1,
        ].join(" "),
      );
      expect(experience).not.toMatch(/40\s*[%٪]|1,?000|99\s*[%٪]/);
      for (const token of ["31", "35", "95%", "50", "30%"])
        expect(experience).toContain(token);
      const tooling = normalizeDigits(resume.s05_more_projects);
      for (const token of ["SentinelSSH", "Rust", "MCP", "17", "Linux"])
        expect(tooling).toContain(token);
    },
  );
});
