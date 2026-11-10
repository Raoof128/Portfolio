import { afterEach, describe, expect, it } from "vitest";
import { formatDate, formatNumber } from "./format";

describe("localized public display values", () => {
  it("uses the selected locale's number script and grouping", () => {
    expect(formatNumber(3057, "en")).toBe("3,057");
    expect(formatNumber(3057, "fa")).toBe("۳٬۰۵۷");
    expect(formatNumber(3057, "ar")).toBe("٣٬٠٥٧");
    expect(formatNumber(3057, "zh")).toBe("3,057");
    expect(formatNumber(3057, "es")).toBe("3057");
    expect(formatNumber(2026, "fa", { useGrouping: false })).toBe("۲۰۲۶");
  });

  it("formats publication dates consistently and respects the Persian calendar", () => {
    const midnight = new Date("2026-10-10T00:00:00Z");
    expect(formatDate(midnight, "en")).toBe("10 Oct 2026");
    expect(formatDate("2026-10-10", "fa")).toContain("۱۴۰۵");
    expect(formatDate("2026-10-10", "ar")).toContain("٢٠٢٦");
    expect(formatDate("2026-10-10", "zh")).toContain("2026");
    expect(formatDate("2026-10-10", "es")).toContain("2026");
    expect(
      formatDate(midnight, "en", { timeZone: "America/Los_Angeles" }),
    ).toBe("09/10/2026");
  });

  it("does not expose invalid display values", () => {
    expect(formatDate("invalid-date", "fa")).toBe("—");
    expect(formatDate(new Date(NaN), "en")).toBe("—");
    expect(formatNumber(Infinity, "ar")).toBe("—");
  });

  const realNumberFormat = Intl.NumberFormat;
  const realDateTimeFormat = Intl.DateTimeFormat;
  afterEach(() => {
    Intl.NumberFormat = realNumberFormat;
    Intl.DateTimeFormat = realDateTimeFormat;
  });
  /** Replaces an Intl constructor with one that counts how often it is constructed. */
  function countConstructions<T extends object>(
    install: (counting: T) => void,
    real: T,
  ) {
    const count = { calls: 0 };
    install(
      new Proxy(real, {
        construct(target, args) {
          count.calls += 1;
          return Reflect.construct(target as never, args);
        },
      }),
    );
    return count;
  }

  it("builds each formatter once per locale and options, not once per value", () => {
    // Constructing an Intl formatter costs far more than formatting with one, and the
    // windows format dozens of counts and dates on every open.
    const numbers = countConstructions(
      (counting) => (Intl.NumberFormat = counting),
      realNumberFormat,
    );
    const dates = countConstructions(
      (counting) => (Intl.DateTimeFormat = counting),
      realDateTimeFormat,
    );
    for (let i = 0; i < 20; i++) {
      formatNumber(i, "es", { maximumFractionDigits: 3 });
      formatDate(Date.UTC(2026, 0, i + 1), "es", { year: "numeric", month: "long" });
    }
    expect(numbers.calls).toBe(1);
    expect(dates.calls).toBe(1);
    // Different options are a different formatter, and the cached one gives the same text.
    expect(formatNumber(1234.5, "es", { maximumFractionDigits: 0 })).toBe("1235");
    expect(numbers.calls).toBe(2);
    expect(formatNumber(1234.5, "es", { maximumFractionDigits: 0 })).toBe("1235");
    expect(numbers.calls).toBe(2);
  });
});
