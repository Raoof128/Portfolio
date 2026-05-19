"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Terminal, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/provider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { defaultLocale } from "@/i18n";

export function Navbar() {
    const pathname = usePathname();
    const { locale, t } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: t.nav.about, path: "/about" },
        { name: t.nav.projects, path: "/projects" },
        { name: t.nav.lab, path: "/lab" },
        { name: t.nav.writeups, path: "/write-ups" },
        { name: t.nav.resume, path: "/resume" },
    ];

    const getPath = (path: string) => {
        if (locale === defaultLocale) return path;
        return `/${locale}${path}`;
    };

    const isPathActive = (path: string) => {
        const localizedPath = getPath(path);
        if (path === "/") {
            return pathname === localizedPath || pathname === "/en";
        }
        return pathname.startsWith(localizedPath);
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-40 border-b h-16 transition-all duration-300",
                scrolled
                    ? "border-cyan/10 glass-strong"
                    : "border-transparent bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                {/* Logo / Home */}
                <Link
                    href={getPath("/")}
                    className="flex items-center space-x-2 group"
                    aria-label={t.nav.home}
                >
                    <div className="p-1 border border-transparent group-hover:border-cyan/50 rounded-sm transition-colors">
                        <Terminal className="w-5 h-5 text-cyan" />
                    </div>
                    <span className="font-mono font-bold text-sm md:text-base lg:text-lg tracking-tight text-foreground group-hover:text-cyan transition-colors">
                        <span className="sm:hidden">~/raouf</span>
                        <span className="hidden sm:inline">~/mohammad-raouf-abedini</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                    {navItems.map((item) => {
                        const isActive = isPathActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                href={getPath(item.path)}
                                className={cn(
                                    "font-mono text-sm tracking-wide transition-all duration-200 relative py-1 focus:outline-none focus:text-cyan",
                                    isActive
                                        ? "text-cyan"
                                        : "text-text-body hover:text-cyan"
                                )}
                            >
                                <span className="relative z-10">
                                    {isActive && <span className={cn(locale === 'fa' || locale === 'ar' ? "ml-2" : "mr-2", "text-cyan/50")}>&gt;</span>}
                                    {item.name}
                                </span>
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-indicator"
                                        className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan shadow-[0_0_8px_rgba(0,245,255,0.8)]"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}

                    <Link
                        href={getPath("/contact")}
                        className="px-4 py-1.5 border border-cyan/15 hover:border-cyan text-xs font-mono uppercase tracking-widest hover:text-cyan hover:shadow-[0_0_15px_rgba(0,245,255,0.25)] transition-all bg-cyber-dark/50"
                    >
                        {t.nav.contact}
                    </Link>

                    <div className="border-l border-cyan/10 h-6 mx-2" />
                    
                    <LanguageSwitcher />
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <LanguageSwitcher />
                    <button
                        className="p-2 text-text-body hover:text-cyan"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-menu"
                    >
                        {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu with AnimatePresence */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-16 left-0 right-0 glass-strong border-b border-cyan/10 p-4 flex flex-col space-y-4 shadow-2xl"
                        role="navigation"
                        aria-label="Mobile navigation"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={getPath(item.path)}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "block font-mono text-base py-3 px-3 hover:bg-cyan/5",
                                    isPathActive(item.path) 
                                      ? cn("text-cyan bg-cyan/5", locale === 'fa' || locale === 'ar' ? "border-r-2 border-cyan" : "border-l-2 border-cyan") 
                                      : "text-text-body"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href={getPath("/contact")}
                            onClick={() => setMobileOpen(false)}
                            className="block w-full text-center py-3 border border-cyan/20 text-cyan font-mono text-sm hover:bg-cyan/5 transition-colors"
                        >
                            {t.nav.contact.toUpperCase()}
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
