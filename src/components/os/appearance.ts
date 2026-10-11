export type Appearance = "dark" | "light";
export const DEFAULT_APPEARANCE: Appearance = "dark";
const key = "researchos.appearance.v1";
let fallback: Appearance = DEFAULT_APPEARANCE;

export function readAppearance(): Appearance {
  try {
    const stored = window.localStorage.getItem(key);
    // A missing preference is a fresh visit, even after storage was cleared.
    return stored === "light" || stored === "dark"
      ? stored
      : DEFAULT_APPEARANCE;
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
    window.localStorage.setItem(key, appearance);
  } catch {
    // Appearance remains usable for this visit when storage is unavailable.
  }
  window.dispatchEvent(new Event("researchos:appearance"));
}
