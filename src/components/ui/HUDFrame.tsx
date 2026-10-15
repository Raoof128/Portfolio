"use client";

import { cn } from "@/lib/utils";
import React from "react";
import "./ui-surfaces.css";

interface HUDFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  /**
   * Retired: corner brackets are no longer drawn. The prop is still accepted so
   * existing callers compile, and it has no effect.
   */
  corners?: boolean;
}

/** A solid token panel for reading surfaces. It has no glass, glow or brackets. */
export function HUDFrame({
  children,
  className,
  title,
  // Retired prop: destructured only so it is not spread onto the DOM element.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  corners: _corners,
  ...props
}: HUDFrameProps) {
  return (
    <div className={cn("ui-panel", className)} {...props}>
      {title && <div className="ui-panel-title">{title}</div>}
      {children}
    </div>
  );
}
