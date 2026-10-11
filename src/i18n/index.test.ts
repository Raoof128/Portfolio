import { describe, expect, it } from "vitest";
import {
  getDictionary,
  getLocaleConfig,
  isRTL,
  isLocale,
  resolveLocale,
  locales,
} from "./index";

describe("locale lookup boundaries", () => {
  for (const value of [
    "constructor",
    "__proto__",
    "toString",
    "unknown",
    "EN",
    "",
  ]) {
    it(`falls back to English for unsupported locale ${JSON.stringify(value)}`, async () => {
      expect(await getDictionary(value)).toEqual(await getDictionary("en"));
      expect(getLocaleConfig(value)).toEqual(getLocaleConfig("en"));
      expect(isRTL(value)).toBe(false);
      expect(isLocale(value)).toBe(false);
      expect(resolveLocale(value)).toBe("en");
    });
  }

  for (const locale of Object.keys(locales)) {
    it(`preserves authored locale ${locale}`, async () => {
      expect(isLocale(locale)).toBe(true);
      expect(resolveLocale(locale)).toBe(locale);
      expect((await getDictionary(locale)).seo.home_title_default).toBeTruthy();
      expect(isRTL(locale)).toBe(locale === "fa" || locale === "ar");
    });
  }
});
