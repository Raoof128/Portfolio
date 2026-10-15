import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_APPEARANCE,
  appearanceStorageKey,
  readAppearance,
  readStoredAppearance,
  writeAppearance,
} from "./appearance";

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("workspace appearance", () => {
  it("starts fresh visits in dark, including after a light preference is removed", () => {
    expect(DEFAULT_APPEARANCE).toBe("dark");
    expect(readAppearance()).toBe("dark");
    writeAppearance("light");
    expect(readAppearance()).toBe("light");
    window.localStorage.clear();
    expect(readAppearance()).toBe("dark");
  });

  it("retains explicit preferences and rejects unrecognized values", () => {
    for (const preference of ["dark", "light"] as const) {
      window.localStorage.setItem("researchos.appearance.v1", preference);
      expect(readAppearance()).toBe(preference);
    }
    window.localStorage.setItem("researchos.appearance.v1", "system");
    expect(readAppearance()).toBe("dark");
  });

  it("keeps manual theme selection usable when persistence is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage unavailable", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage unavailable", "SecurityError");
    });
    writeAppearance("dark");
    expect(readAppearance()).toBe("dark");
    writeAppearance("light");
    expect(readAppearance()).toBe("light");
    writeAppearance("dark");
  });

  it("exports the storage key that the shell reads through readStoredAppearance", () => {
    // The shell must not keep its own copy of the key; the literal is pinned here once.
    expect(appearanceStorageKey).toBe("researchos.appearance.v1");
    expect(readStoredAppearance()).toBeNull();
    window.localStorage.setItem(appearanceStorageKey, "light");
    expect(readStoredAppearance()).toBe("light");
    window.localStorage.setItem(appearanceStorageKey, "system");
    expect(readStoredAppearance()).toBeNull();
  });

  it("reports no stored choice when storage cannot be read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage unavailable", "SecurityError");
    });
    expect(readStoredAppearance()).toBeNull();
  });
});
