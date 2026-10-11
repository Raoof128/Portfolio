import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  clearLanguageNavigation,
  consumeLanguageNavigation,
  prepareLanguageNavigation,
} from "./language-navigation";

const key = "researchos:language-navigation";

beforeEach(() => {
  clearLanguageNavigation();
  window.sessionStorage.clear();
});
afterEach(() => vi.restoreAllMocks());

describe("one-shot language navigation", () => {
  it("consumes open state only at its destination and only once", () => {
    prepareLanguageNavigation("/fa", true);
    expect(consumeLanguageNavigation("/")).toBeNull();
    expect(consumeLanguageNavigation("/fa")).toBe(true);
    expect(consumeLanguageNavigation("/fa")).toBeNull();
    expect(window.sessionStorage.getItem(key)).toBeNull();
  });

  it("keeps a deliberately locked workspace locked", () => {
    prepareLanguageNavigation("/ar", false);
    expect(consumeLanguageNavigation("/ar")).toBe(false);
  });

  it("reads the handoff after a new locale document loads", () => {
    window.sessionStorage.setItem(
      key,
      JSON.stringify({ path: "/zh", open: true, created: Date.now() }),
    );
    expect(consumeLanguageNavigation("/zh")).toBe(true);
    expect(window.sessionStorage.getItem(key)).toBeNull();
  });

  it("rejects expired intents", () => {
    vi.spyOn(Date, "now").mockReturnValue(100_000);
    prepareLanguageNavigation("/es", true);
    vi.spyOn(Date, "now").mockReturnValue(130_001);
    expect(consumeLanguageNavigation("/es")).toBeNull();
  });

  it.each([
    "{broken",
    "x".repeat(2049),
    JSON.stringify({
      path: "//external.test",
      open: true,
      created: Date.now(),
    }),
    JSON.stringify({ path: "/fa", open: "true", created: Date.now() }),
    JSON.stringify({ path: "/fa", open: true, created: "invalid" }),
  ])("discards malformed storage without throwing", (raw) => {
    window.sessionStorage.setItem(key, raw);
    expect(consumeLanguageNavigation("/fa")).toBeNull();
    expect(window.sessionStorage.getItem(key)).toBeNull();
  });

  it("uses memory when storage access is denied", () => {
    vi.spyOn(window, "sessionStorage", "get").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    prepareLanguageNavigation("/fa", true);
    expect(consumeLanguageNavigation("/fa")).toBe(true);
    expect(consumeLanguageNavigation("/fa")).toBeNull();
  });
});
