"use client";

import { useEffect } from "react";

export function ThemeInjector({ theme }: { theme: string }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    return () => document.documentElement.removeAttribute("data-theme");
  }, [theme]);
  return null;
}
