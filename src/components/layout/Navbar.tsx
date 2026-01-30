"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Terminal, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
    { name: "/projects", path: "/projects" },
    { name: "/lab", path: "/lab" },
    { name: "/write-ups", path: "/write-ups" },
    { name: "/resume", path: "/resume" },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-md h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                {/* Logo / Home */}
                <Link
                    href="/"
                    className="flex items-center space-x-2 group"
                    aria-label="Home"
                >
                    <div className="p-1 border border-transparent group-hover:border-cyan/50 rounded-sm transition-colors">
                        <Terminal className="w-5 h-5 text-cyan" />
                    </div>
                    <span className="font-mono font-bold text-lg tracking-tight text-foreground group-hover:text-cyan transition-colors">
                        ~/mohammad-raouf-abedini
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "font-mono text-sm tracking-wide transition-all duration-200 relative py-1 focus:outline-none focus:text-cyan",
                                    isActive
                                        ? "text-cyan"
                                        : "text-zinc-400 hover:text-cyan"
                                )}
                            >
                                <span className="relative z-10">
                                    {isActive && <span className="mr-2 text-cyan/50">&gt;</span>}
                                    {item.name}
                                </span>
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                )}
                            </Link>
                        );
                    })}

                    <Link
                        href="mailto:contact@raouf.sh" // Placeholder email
                        className="px-4 py-1.5 border border-zinc-700 hover:border-cyan text-xs font-mono uppercase tracking-widest hover:text-cyan hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all bg-zinc-900/50"
                    >
                        Contact
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-zinc-400 hover:text-cyan"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-white/10 p-4 flex flex-col space-y-4 shadow-2xl">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                "block font-mono text-base p-2 hover:bg-white/5",
                                pathname.startsWith(item.path) ? "text-cyan border-l-2 border-cyan bg-white/5" : "text-zinc-400"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link
                        href="mailto:contact@raouf.sh"
                        onClick={() => setMobileOpen(false)}
                        className="block w-full text-center py-3 border border-zinc-700 text-cyan font-mono text-sm"
                    >
                        CONTACT
                    </Link>
                </div>
            )}
        </nav>
    );
}
