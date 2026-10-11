"use client";

import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: "cyan" | "amber" | "purple";
  className?: string;
}

const glowColors = {
  cyan: {
    border: "hover:border-cyan/40",
    shadow: "hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]",
  },
  amber: {
    border: "hover:border-amber/40",
    shadow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
  },
  purple: {
    border: "hover:border-purple/40",
    shadow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]",
  },
};

export function GlowCard({
  children,
  glowColor = "cyan",
  className,
}: GlowCardProps) {
  const colors = glowColors[glowColor];

  return (
    <div
      className={cn(
        "os-reading-card relative border border-cyan/8 bg-[#030712]/60 backdrop-blur-sm transition-[border-color,box-shadow,transform,opacity] duration-150 hover:bg-cyan/[0.04]",
        colors.border,
        colors.shadow,
        className,
      )}
    >
      {children}
    </div>
  );
}
