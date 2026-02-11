"use client";

import { useEffect, useState } from "react";
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

export function DecryptedText({ text, className = "", animateOnHover = false, loopInterval = 0 }: DecryptedTextProps) {
  // Initialize with scrambled text to avoid hydration flash
  const [displayText, setDisplayText] = useState(() => scramble(text));
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
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
  }, [text, trigger]);

  // Loop effect
  useEffect(() => {
    if (loopInterval > 0) {
      const loop = setInterval(() => {
        setTrigger(prev => prev + 1);
      }, loopInterval);
      return () => clearInterval(loop);
    }
  }, [loopInterval]);

  return (
    <motion.span
      className={`inline-block whitespace-pre-wrap ${className}`}
      onMouseEnter={() => animateOnHover && setTrigger(prev => prev + 1)}
      suppressHydrationWarning
    >
      {displayText}
    </motion.span>
  );
}
