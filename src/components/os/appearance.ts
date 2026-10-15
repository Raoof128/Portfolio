export type Appearance = "dark" | "light";
export const DEFAULT_APPEARANCE: Appearance = "dark";
/** localStorage key for an explicit appearance choice. Shared by the shell and tests. */
export const appearanceStorageKey = "researchos.appearance.v1";
let fallback: Appearance = DEFAULT_APPEARANCE;

function parseAppearance(value: string | null): Appearance | null {
  return value === "light" || value === "dark" ? value : null;
}

/**
 * The visitor's explicit choice, or null on a fresh visit, for an unrecognised
 * value, or when storage cannot be read. Callers decide what a missing choice means.
 */
export function readStoredAppearance(): Appearance | null {
  try {
    return parseAppearance(window.localStorage.getItem(appearanceStorageKey));
  } catch {
    return null;
  }
}

export function readAppearance(): Appearance {
  try {
    // A missing preference is a fresh visit, even after storage was cleared.
    return (
      parseAppearance(window.localStorage.getItem(appearanceStorageKey)) ??
      DEFAULT_APPEARANCE
    );
  } catch {
    return fallback;
  }
}

export function subscribeAppearance(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("researchos:appearance", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("researchos:appearance", callback);
  };
}

export function writeAppearance(appearance: Appearance) {
  fallback = appearance;
  try {
    window.localStorage.setItem(appearanceStorageKey, appearance);
  } catch {
    // Appearance remains usable for this visit when storage is unavailable.
  }
  window.dispatchEvent(new Event("researchos:appearance"));
}
