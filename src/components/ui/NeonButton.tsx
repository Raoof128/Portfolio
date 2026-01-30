import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

export function NeonButton({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: NeonButtonProps) {

  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 font-mono text-sm font-medium tracking-wide transition-all duration-300 group overflow-hidden focus:outline-none focus:ring-2 focus:ring-cyan/50";

  const variants = {
    primary: "bg-cyan/10 text-cyan border border-cyan/50 hover:bg-cyan/20 hover:border-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    secondary: "bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500",
    outline: "bg-transparent border border-cyan/30 text-cyan/80 hover:border-cyan hover:text-cyan hover:bg-cyan/5"
  };

  const content = (
    <>
      {/* Glitch/Scan effect overlay (optional, keeping clean for now) */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      {variant === "primary" && (
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-cyan/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseStyles, variants[variant], className)}>
        {content}
      </Link>
    );
  }

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {content}
    </button>
  );
}
