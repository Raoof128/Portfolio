"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Locale, locales } from "@/i18n";
import { getLocalizedPath, getLocaleFromPath } from "@/i18n/navigation";
import { useTranslation } from "@/i18n/provider";
import { Languages } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPath(pathname);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 border border-cyan/15 hover:border-cyan/40 text-[10px] font-mono uppercase tracking-widest text-text-meta hover:text-cyan transition-all bg-cyber-dark/30 rounded-sm"
        aria-label={t.common.select_language}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Languages className="w-3 h-3" />
        <span lang={currentLocale} dir={locales[currentLocale].dir}>
          {locales[currentLocale].label}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 glass-strong border border-cyan/20 shadow-2xl z-50 overflow-hidden"
          >
            <div className="py-1">
              {(Object.keys(locales) as Locale[]).map((locale) => (
                <Link
                  key={locale}
                  href={getLocalizedPath(pathname, locale)}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-2 text-xs font-mono transition-colors hover:bg-cyan/10",
                    currentLocale === locale
                      ? "text-cyan bg-cyan/5"
                      : "text-text-body hover:text-white",
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span lang={locale} dir={locales[locale].dir}>
                      {locales[locale].label}
                    </span>
                    {currentLocale === locale && (
                      <span className="text-[8px] opacity-50">
                        {t.common.language_selected}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
