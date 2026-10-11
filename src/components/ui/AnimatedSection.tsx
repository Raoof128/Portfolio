import type { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedSection({ children, className }: AnimatedSectionProps) {
  // ResearchOS reading surfaces are always visible. Their old motion was
  // already disabled by CSS; avoid downloading a runtime and observing each
  // paragraph for an effect the approved design does not display.
  return <div className={className}>{children}</div>;
}
