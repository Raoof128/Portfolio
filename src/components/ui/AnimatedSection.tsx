"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { fadeInUp } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  variants?: Variants;
  delay?: number;
  once?: boolean;
  amount?: number;
  className?: string;
}

export function AnimatedSection({
  children,
  variants = fadeInUp,
  delay = 0,
  once = true,
  amount = 0.2,
  className,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
