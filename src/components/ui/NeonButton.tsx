"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

interface NeonButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  external?: boolean;
  download?: boolean;
  children: React.ReactNode;
}

export function NeonButton({
  href,
  variant = "primary",
  external,
  download,
  className,
  children,
  ...props
}: NeonButtonProps) {

  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 font-mono text-sm font-medium tracking-wide transition-all duration-300 group overflow-hidden focus:outline-none focus:ring-2 focus:ring-cyan/50";

  const variants = {
    primary: "bg-cyan/10 text-cyan border border-cyan/50 hover:bg-cyan/20 hover:border-cyan hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]",
    secondary: "bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500",
    outline: "bg-transparent border border-cyan/30 text-cyan/80 hover:border-cyan hover:text-cyan hover:bg-cyan/5"
  };

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      {variant === "primary" && (
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-cyan/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      )}
    </>
  );

  if (href) {
    if (external || download) {
      return (
        <motion.a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          download={download}
          className={cn(baseStyles, variants[variant], className)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {content}
        </motion.a>
      );
    }
    return (
      <Link href={href} className={cn(baseStyles, variants[variant], className)}>
        {/* Wrap inner content in motion span for spring effect - Link doesn't support motion props */}
        <motion.span
          className="flex items-center gap-2 w-full h-full"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {content}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], className)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {content}
    </motion.button>
  );
}
