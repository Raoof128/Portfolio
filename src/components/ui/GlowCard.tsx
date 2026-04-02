"use client";

import { motion } from "framer-motion";
import { cn, hoverSpring } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: "cyan" | "amber" | "purple";
  className?: string;
}

const glowColors = {
  cyan: {
    border: "hover:border-cyan/40",
    shadow: "hover:shadow-[0_0_30px_rgba(124,77,189,0.2)]",
    trace: "from-cyan/60 via-transparent to-cyan/60",
  },
  amber: {
    border: "hover:border-amber/40",
    shadow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
    trace: "from-amber/60 via-transparent to-amber/60",
  },
  purple: {
    border: "hover:border-purple/40",
    shadow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    trace: "from-purple/60 via-transparent to-purple/60",
  },
};

export function GlowCard({
  children,
  glowColor = "cyan",
  className,
}: GlowCardProps) {
  const colors = glowColors[glowColor];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={hoverSpring}
      className={cn(
        "relative border border-cyan/8 bg-[#06080d]/60 backdrop-blur-sm transition-all duration-300 hover:bg-cyan/[0.04]",
        colors.border,
        colors.shadow,
        className
      )}
    >
      {/* Border trace beam on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:animate-border-trace",
          colors.trace
        )}
        style={{
          maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      {children}
    </motion.div>
  );
}
