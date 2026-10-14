"use client";

import { useSyncExternalStore } from "react";
import { SITE_LAST_MODIFIED } from "@/lib/constants";

// Static HTML is rendered at build time. Hydration must reuse that year so the
// footer never produces a text mismatch after 1 January; the live year follows.
const buildYear = Number(SITE_LAST_MODIFIED.slice(0, 4));
const subscribe = () => () => {};
const readYear = () => new Date().getUTCFullYear();
const readBuildYear = () => buildYear;

export function useCopyrightYear(): number {
  return useSyncExternalStore(subscribe, readYear, readBuildYear);
}
