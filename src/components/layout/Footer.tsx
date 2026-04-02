"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Shield, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { fadeInUp, staggerContainer } from "@/lib/utils";
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
      <footer className="border-t border-cyan/10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >

            {/* Col 1 — Branding + socials */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <p className="font-mono text-sm text-slate-300 tracking-tight">~/mohammad-raouf-abedini</p>
              <p className="text-xs text-text-body leading-relaxed max-w-xs">
                AI Security Research. Vulnerability research, responsible disclosure, and reducing catastrophic risks from advanced AI.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <motion.a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-body hover:text-cyan transition-colors"
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
                  className="text-text-body hover:text-cyan transition-colors"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="sr-only">LinkedIn</span>
                </motion.a>
                <Link href="/contact" className="text-text-body hover:text-cyan hover:-translate-y-0.5 transition-all">
                  <Mail className="w-4 h-4" />
                  <span className="sr-only">Contact</span>
                </Link>
              </div>
            </motion.div>

            {/* Col 2 — Quick nav */}
            <motion.div variants={fadeInUp}>
              <p className="font-mono text-[10px] text-text-meta tracking-[0.3em] uppercase mb-4">Navigation</p>
              <nav className="grid grid-cols-2 gap-x-6 gap-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs font-mono text-text-body hover:text-cyan transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>

            {/* Col 3 — Status + security */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <p className="font-mono text-[10px] text-text-meta tracking-[0.3em] uppercase mb-4">System</p>
              <div className="space-y-2 text-xs font-mono text-text-meta">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_rgba(167,139,250,0.7)]" />
                  <span>Status: ONLINE</span>
                </div>
                <div>Last Index: {new Date().toLocaleDateString("en-AU", { month: "short", year: "numeric" })}</div>
              </div>
              <a href="/.well-known/security.txt" className="inline-flex items-center text-xs font-mono text-text-meta hover:text-cyan transition-colors">
                <Shield className="w-3 h-3 mr-1.5" />
                security.txt
              </a>
            </motion.div>
          </motion.div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-cyan/8 flex items-center justify-between">
            <p className="text-[10px] font-mono text-text-meta opacity-80">
              &copy; {new Date().getFullYear()} Mohammad Raouf Abedini
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 text-[10px] font-mono text-text-meta hover:text-cyan transition-colors"
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
