"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Locale, locales } from "@/i18n";
import { getLocalizedPath, getLocaleFromPath } from "@/i18n/navigation";
import { useTranslation } from "@/i18n/provider";
import { Languages } from "lucide-react";
import { useId, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPath(pathname);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const disclosureId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
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
    <div
      className="relative"
      ref={containerRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.preventDefault();
          event.stopPropagation();
          setIsOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 min-h-6 min-w-6 pointer-coarse:min-h-11 pointer-coarse:min-w-11 border border-cyan/15 hover:border-cyan/40 text-xs font-mono text-text-meta hover:text-cyan transition-all bg-cyber-dark/30 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
        aria-label={`${locales[currentLocale].label}, ${t.common.select_language}`}
        aria-expanded={isOpen}
        aria-controls={disclosureId}
      >
        <Languages className="w-3 h-3" aria-hidden="true" />
        <span lang={currentLocale} dir={locales[currentLocale].dir}>
          {locales[currentLocale].label}
        </span>
      </button>

      {isOpen && (
        <motion.nav
          id={disclosureId}
          aria-label={t.common.select_language}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
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
                    <span className="text-xs opacity-50">
                      {t.common.language_selected}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </div>
  );
}
