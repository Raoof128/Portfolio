"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface HUDFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  corners?: boolean;
}

export function HUDFrame({
  children,
  className,
  title,
  corners = true,
  ...props
}: HUDFrameProps) {
  return (
    <div
      className={cn("relative p-6 border border-cyan/10 glass", className)}
      {...props}
    >
      {/* Title Tag */}
      {title && (
        <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-mono text-cyan/70 tracking-widest uppercase border border-cyan/15">
          {title}
        </div>
      )}

      {/* Decorative corners stay static on reading surfaces. */}
      {corners && (
        <>
          <div
            aria-hidden="true"
            className="absolute -top-[1px] -left-[1px] w-5 h-5 border-t border-l border-cyan"
          >
            <span className="absolute -top-[2px] -left-[2px] w-1 h-1 bg-cyan shadow-[0_0_6px_rgba(0,245,255,0.8)]" />
          </div>
          <div
            aria-hidden="true"
            className="absolute -top-[1px] -right-[1px] w-5 h-5 border-t border-r border-cyan"
          >
            <span className="absolute -top-[2px] -right-[2px] w-1 h-1 bg-cyan shadow-[0_0_6px_rgba(0,245,255,0.8)]" />
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-[1px] -left-[1px] w-5 h-5 border-b border-l border-cyan"
          >
            <span className="absolute -bottom-[2px] -left-[2px] w-1 h-1 bg-cyan shadow-[0_0_6px_rgba(0,245,255,0.8)]" />
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-[1px] -right-[1px] w-5 h-5 border-b border-r border-cyan"
          >
            <span className="absolute -bottom-[2px] -right-[2px] w-1 h-1 bg-cyan shadow-[0_0_6px_rgba(0,245,255,0.8)]" />
          </div>
        </>
      )}

      {children}
    </div>
  );
}
