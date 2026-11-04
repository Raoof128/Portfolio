export type Appearance = "dark" | "light";
export const DEFAULT_APPEARANCE: Appearance = "dark";
/** localStorage key for an explicit appearance choice. Shared by the shell and tests. */
export const appearanceStorageKey = "researchos.appearance.v1";
let fallback: Appearance | null = null;
let writeBlocked = false;

function parseAppearance(value: string | null): Appearance | null {
  return value === "light" || value === "dark" ? value : null;
}

/**
 * The visitor's explicit choice, or null on a fresh visit, for an unrecognised
 * value. When storage is blocked, keep the last manual choice across shell remounts.
 * Callers decide what a missing choice means.
 */
export function readStoredAppearance(): Appearance | null {
  // Reads can remain available after a quota or policy error blocks writes.
  if (writeBlocked) return fallback;
  try {
    return parseAppearance(window.localStorage.getItem(appearanceStorageKey));
  } catch {
    return fallback;
  }
}

export function readAppearance(): Appearance {
  return readStoredAppearance() ?? DEFAULT_APPEARANCE;
}

export function subscribeAppearance(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== appearanceStorageKey && event.key !== null) return;
    fallback = parseAppearance(event.newValue);
    writeBlocked = false;
    callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("researchos:appearance", callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("researchos:appearance", callback);
  };
}

export function writeAppearance(appearance: Appearance) {
  fallback = appearance;
  try {
    window.localStorage.setItem(appearanceStorageKey, appearance);
    writeBlocked = false;
  } catch {
    // Appearance remains usable for this visit when storage is unavailable.
    writeBlocked = true;
  }
  window.dispatchEvent(new Event("researchos:appearance"));
}
