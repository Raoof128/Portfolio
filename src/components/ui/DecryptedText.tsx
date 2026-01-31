"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DecryptedTextProps {
  text: string;
  className?: string;
  animateOnHover?: boolean;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

export function DecryptedText({ text, className = "", animateOnHover = false }: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [trigger, setTrigger] = useState(0); // Used to re-trigger animation

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
      iteration += 1 / 2; // Speed control: higher denominator = slower
    }, 30);

    return () => clearInterval(interval);
  }, [text, trigger]);

  return (
    <motion.span 
      className={`inline-block whitespace-pre-wrap ${className}`}
      onMouseEnter={() => animateOnHover && setTrigger(prev => prev + 1)}
    >
      {displayText}
    </motion.span>
  );
}
