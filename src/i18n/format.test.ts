import { describe, expect, it } from "vitest";
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
});
