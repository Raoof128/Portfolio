"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";

interface DecryptedTextProps {
  text: string;
  className?: string;
  animateOnHover?: boolean;
  loopInterval?: number;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

function scramble(text: string): string {
  return text.split("").map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(reducedMotionQuery);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function DecryptedText({ text, className = "", animateOnHover = false, loopInterval = 0 }: DecryptedTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayText, setDisplayText] = useState(() => scramble(text));
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(() =>
        text.split("").map((letter, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 30);

    return () => clearInterval(interval);
  }, [text, trigger, prefersReducedMotion]);

  // Loop effect
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (loopInterval > 0) {
      const loop = setInterval(() => {
        setTrigger(prev => prev + 1);
      }, loopInterval);
      return () => clearInterval(loop);
    }
  }, [loopInterval, prefersReducedMotion]);

  const shown = prefersReducedMotion ? text : displayText;

  return (
    <motion.span
      className={`inline-block whitespace-pre-wrap ${className}`}
      onMouseEnter={() => animateOnHover && !prefersReducedMotion && setTrigger(prev => prev + 1)}
      suppressHydrationWarning
      aria-label={text}
    >
      <span aria-hidden="true" suppressHydrationWarning>{shown}</span>
    </motion.span>
  );
}
