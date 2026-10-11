"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { OSAppDescriptor } from "@/lib/os-app-schema";

export type InitialAppState = {
  readonly projectQuery?: string;
  readonly projectCategory?: string;
  readonly fields?: Readonly<Record<string, string>>;
  readonly readingOffset?: number;
  readonly focusedField?: "project-query" | string;
  readonly selectionStart?: number | null;
  readonly selectionEnd?: number | null;
};

export type RegisteredApplication = {
  readonly descriptor: OSAppDescriptor;
  // This is the concrete page Client element, never Next's live router outlet.
  readonly view: ReactNode;
  readonly initial: InitialAppState;
};

export const ApplicationRegistrationContext = createContext<{
  ready: boolean;
  register: (application: RegisteredApplication) => void;
}>({ ready: false, register: () => {} });

export const ApplicationStateContext = createContext<InitialAppState>({});
export const ApplicationVisibilityContext = createContext({
  active: true,
  namespace: "",
});

export function useInitialAppState() {
  return useContext(ApplicationStateContext);
}

export function useApplicationActive() {
  return useContext(ApplicationVisibilityContext).active;
}

/** Foreground IDs keep direct fragment URLs; retained documents are namespaced. */
export function useContentId() {
  const { active, namespace } = useContext(ApplicationVisibilityContext);
  return (id: string) => (active || !namespace ? id : `${namespace}-${id}`);
}
