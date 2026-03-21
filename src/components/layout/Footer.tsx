"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Shield, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { fadeInUp } from "@/lib/utils";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/constants";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Lab", href: "/lab" },
  { name: "Write-ups", href: "/write-ups" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <AnimatedSection variants={fadeInUp}>
      <footer className="border-t border-white/10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

            {/* Col 1 — Branding + socials */}
            <div className="space-y-4">
              <p className="font-mono text-sm text-zinc-300 tracking-tight">~/mohammad-raouf-abedini</p>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-xs">
                Cybersecurity &amp; Software Engineering. Security embedded from design to deployment.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <motion.a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-cyan transition-colors"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Github className="w-4 h-4" />
                  <span className="sr-only">GitHub</span>
                </motion.a>
                <motion.a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-cyan transition-colors"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="sr-only">LinkedIn</span>
                </motion.a>
                <Link href="/contact" className="text-zinc-500 hover:text-cyan transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="sr-only">Contact</span>
                </Link>
              </div>
            </div>

            {/* Col 2 — Quick nav */}
            <div>
              <p className="font-mono text-[10px] text-zinc-600 tracking-[0.3em] uppercase mb-4">Navigation</p>
              <nav className="grid grid-cols-2 gap-x-6 gap-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs font-mono text-zinc-500 hover:text-cyan transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 3 — Status + security */}
            <div className="space-y-4">
              <p className="font-mono text-[10px] text-zinc-600 tracking-[0.3em] uppercase mb-4">System</p>
              <div className="space-y-2 text-xs font-mono text-zinc-600">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
                  <span>Status: ONLINE</span>
                </div>
                <div>Last Index: {new Date().toLocaleDateString("en-AU", { month: "short", year: "numeric" })}</div>
              </div>
              <a href="/.well-known/security.txt" className="inline-flex items-center text-xs font-mono text-zinc-600 hover:text-cyan transition-colors">
                <Shield className="w-3 h-3 mr-1.5" />
                security.txt
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] font-mono text-zinc-700">
              &copy; {new Date().getFullYear()} Mohammad Raouf Abedini
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 hover:text-cyan transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3 h-3" />
              TOP
            </button>
          </div>

        </div>
      </footer>
    </AnimatedSection>
  );
}
