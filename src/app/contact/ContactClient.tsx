"use client";

import { SecureContactForm } from "@/components/ui/SecureContactForm"
import { Github, Linkedin } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { fadeInUp } from "@/lib/utils"
import { motion } from "framer-motion"
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/constants"

export function ContactClient() {
  return (
    <div className="flex-1 container mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl space-y-8">
        <AnimatedSection variants={fadeInUp}>
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-white">
              Open <span className="text-cyan-500">Secure Channel</span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">
              Initiate encrypted communication.
              <br className="hidden md:block" />
              Response times vary based on operational load.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection variants={fadeInUp} delay={0.15}>
          <SecureContactForm />
        </AnimatedSection>

        <AnimatedSection variants={fadeInUp} delay={0.3}>
          <div className="flex justify-center gap-6 pt-4 border-t border-white/5">
            <motion.a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center text-zinc-500 hover:text-cyan-400 transition-colors font-mono text-xs" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Github className="w-4 h-4 mr-2" /> GITHUB_FREQ
            </motion.a>
            <motion.a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="flex items-center text-zinc-500 hover:text-cyan-400 transition-colors font-mono text-xs" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Linkedin className="w-4 h-4 mr-2" /> LINKEDIN_FREQ
            </motion.a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
