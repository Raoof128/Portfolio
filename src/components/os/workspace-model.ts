import type { Locale } from "@/i18n";
import {
  isOSAppDescriptor,
  isOSAppLocale,
  type OSAppDescriptor,
} from "@/lib/os-app-schema";

export interface WorkspaceWindowRecord {
  readonly descriptor: OSAppDescriptor;
  readonly minimized: boolean;
}

export interface WorkspaceState {
  readonly locale: Locale;
  /** Only the current reading page; previous pages are never retained. */
  readonly windows: readonly WorkspaceWindowRecord[];
  readonly activeId: string | null;
}

export type WorkspaceAction =
  | { readonly type: "open"; readonly app: OSAppDescriptor }
  | {
      readonly type: "focus" | "restore" | "minimize" | "close";
      readonly id: string;
    };

export function canOpenWorkspaceWindow(
  state: WorkspaceState,
  descriptor: unknown,
): descriptor is OSAppDescriptor {
  return isOSAppDescriptor(descriptor) && descriptor.locale === state.locale;
}

export function createWorkspaceState(
  locale: Locale,
  initialDescriptor?: OSAppDescriptor | null,
): WorkspaceState {
  if (!isOSAppLocale(locale))
    throw new TypeError("Unsupported workspace locale");
  const state: WorkspaceState = { locale, windows: [], activeId: null };
  return initialDescriptor
    ? workspaceReducer(state, { type: "open", app: initialDescriptor })
    : state;
}

export function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  if (!action || typeof action !== "object") return state;
  if (action.type === "open") {
    if (!canOpenWorkspaceWindow(state, action.app)) return state;
    const current = state.windows[0];
    if (current?.descriptor.id === action.app.id && !current.minimized)
      return state;
    const descriptor = { ...action.app };
    return {
      ...state,
      windows: [{ descriptor, minimized: false }],
      activeId: descriptor.id,
    };
  }
  if (typeof action.id !== "string") return state;
  const current = state.windows[0];
  if (!current || current.descriptor.id !== action.id) return state;
  switch (action.type) {
    case "focus":
    case "restore":
      return current.minimized
        ? {
            ...state,
            windows: [{ ...current, minimized: false }],
            activeId: action.id,
          }
        : state;
    case "minimize":
      return current.minimized
        ? state
        : {
            ...state,
            windows: [{ ...current, minimized: true }],
            activeId: null,
          };
    case "close":
      return createWorkspaceState(state.locale);
    default:
      return state;
  }
}
