"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Applies the visitor's reduced-motion setting to every framer-motion component under the
 * app. Without this, a framer-motion animation would ignore prefers-reduced-motion, because
 * the CSS guard only covers CSS transitions and animations.
 */
export function MotionPreferences({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
