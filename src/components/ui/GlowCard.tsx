"use client";

import { cn } from "@/lib/utils";
import "./ui-surfaces.css";

interface GlowCardProps {
  children: React.ReactNode;
  /** Retired: every card uses the single accent, so a hue choice is not drawn. */
  glowColor?: "cyan" | "amber" | "purple";
  className?: string;
}

/** A solid card. Hover changes only the hairline border; there is no glow or glass. */
export function GlowCard({ children, className }: GlowCardProps) {
  return (
    <div
      className={cn("os-reading-card ui-card ui-card--interactive", className)}
    >
      {children}
    </div>
  );
}
