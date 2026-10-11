const storageKey = "researchos:language-navigation";
const lifetime = 30_000;

type LanguageNavigation = {
  path: string;
  open: boolean;
  created: number;
};

let pending: LanguageNavigation | null = null;

function validPath(path: unknown): path is string {
  return (
    typeof path === "string" &&
    path.length <= 1024 &&
    /^\/(?!\/)[^?#\\\s]*$/.test(path)
  );
}

export function clearLanguageNavigation() {
  pending = null;
  try {
    window.sessionStorage.removeItem(storageKey);
  } catch {
    // Storage can be blocked; the same-document handoff still uses memory.
  }
}

/** One navigation intent, not saved workspace history or an authentication flag. */
export function prepareLanguageNavigation(path: string, open: boolean) {
  clearLanguageNavigation();
  if (!validPath(path)) return;
  pending = { path, open, created: Date.now() };
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(pending));
  } catch {
    // Locale root layouts may reload. Blocked persistence degrades safely.
  }
}

export function consumeLanguageNavigation(path: string): boolean | null {
  let value: unknown = pending;
  if (!value) {
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      if (raw && raw.length <= 2048) value = JSON.parse(raw);
    } catch {
      // Malformed or unavailable storage must not break navigation.
    }
  }
  if (!value || typeof value !== "object") {
    clearLanguageNavigation();
    return null;
  }
  const intent = value as Partial<LanguageNavigation>;
  const age = Date.now() - (intent.created ?? NaN);
  if (
    !validPath(intent.path) ||
    typeof intent.open !== "boolean" ||
    typeof intent.created !== "number" ||
    !Number.isFinite(age) ||
    age < 0 ||
    age > lifetime
  ) {
    clearLanguageNavigation();
    return null;
  }
  // An intermediate render of the old locale must not consume the destination.
  if (intent.path !== path) return null;
  clearLanguageNavigation();
  return intent.open;
}
