"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { fadeInUp } from "@/lib/utils";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/constants";

export function Footer() {
  return (
    <AnimatedSection variants={fadeInUp}>
      <footer className="border-t border-white/10 bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center space-x-6">
            <motion.a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-cyan transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Github className="w-5 h-5" />
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
              <Linkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </motion.a>
            <Link href="/contact" className="text-zinc-500 hover:text-cyan transition-colors">
              <Mail className="w-5 h-5" />
              <span className="sr-only">Contact Page</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-600">
            <span className="hidden md:inline">System Status: ONLINE</span>
            <span className="hidden md:inline mx-2">|</span>
            <span>Last Index: {new Date().toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}</span>
          </div>

          <div>
            <Link href="/.well-known/security.txt" className="flex items-center text-xs font-mono text-zinc-600 hover:text-cyan transition-colors">
              <Shield className="w-3 h-3 mr-2" />
              security.txt
            </Link>
          </div>

        </div>
      </footer>
    </AnimatedSection>
  );
}
