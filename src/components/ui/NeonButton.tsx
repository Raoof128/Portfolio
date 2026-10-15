"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface NeonButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
> {
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  external?: boolean;
  download?: boolean;
  children: React.ReactNode;
}

/** Attributes shared by the button and anchor renderings (aria-*, onClick, title…). */
type AnchorRestProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target" | "rel" | "download" | "className" | "children"
>;

type ButtonRestProps = Omit<
  NeonButtonProps,
  "href" | "variant" | "external" | "download" | "className" | "children"
>;

// Button-only fields have no anchor equivalent and would be invalid on <a>.
const BUTTON_ONLY_PROPS = [
  "type",
  "disabled",
  "form",
  "formAction",
  "formEncType",
  "formMethod",
  "formNoValidate",
  "formTarget",
  "name",
  "value",
] as const satisfies readonly (keyof ButtonRestProps)[];

function toAnchorProps(props: ButtonRestProps): AnchorRestProps {
  const rest: Record<string, unknown> = { ...props };
  for (const key of BUTTON_ONLY_PROPS) delete rest[key];
  return rest as AnchorRestProps;
}

/**
 * A call to action drawn by the shared control primitive in controls.css. The
 * `data-variant` attribute picks the style: primary fills with the accent, and
 * secondary and outline are hairline outlines. `outline` renders as secondary.
 */
export function NeonButton({
  href,
  variant = "primary",
  external,
  download,
  className,
  children,
  ...props
}: NeonButtonProps) {
  const controlVariant = variant === "primary" ? "primary" : "secondary";
  const baseStyles = "os-document-button";
  const content = <span>{children}</span>;

  if (href) {
    // Everything the two elements share (aria-*, onClick, title, id…) is forwarded.
    const linkProps = toAnchorProps(props);

    if (external || download) {
      return (
        <a
          {...linkProps}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          download={download}
          data-variant={controlVariant}
          className={cn(baseStyles, className)}
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        {...linkProps}
        href={href}
        data-variant={controlVariant}
        className={cn(baseStyles, className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      data-variant={controlVariant}
      className={cn(baseStyles, className)}
      {...props}
    >
      {content}
    </button>
  );
}
