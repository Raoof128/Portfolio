import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Transition } from "framer-motion";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Framer Motion preset used by the retained ProjectCard component.
export const hoverSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};
