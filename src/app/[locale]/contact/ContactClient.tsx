"use client";

import { SecureContactForm } from "@/components/ui/SecureContactForm";
import { Github, Linkedin, Mail } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { fadeInUp } from "@/lib/utils";
import { motion } from "framer-motion";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function ContactClient() {
  const { locale, t } = useTranslation();
  const isRTL = locale === "fa" || locale === "ar";

  return (
    <div
      className={cn(
        "flex-1 container mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center min-h-screen",
        isRTL && "text-right",
      )}
    >
      <div className="w-full max-w-2xl space-y-8">
        <AnimatedSection variants={fadeInUp}>
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-white">
              {t.contact.title_1}{" "}
              <span className="text-cyan">{t.contact.title_2}</span>
            </h1>
            <p className="text-text-body text-sm md:text-base max-w-lg mx-auto">
              {t.contact.subtitle_1}
              <br className="hidden md:block" />
              {t.contact.subtitle_2}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection variants={fadeInUp} delay={0.15}>
          <SecureContactForm />
        </AnimatedSection>

        <AnimatedSection variants={fadeInUp} delay={0.3}>
          <div
            className={cn(
              "flex flex-wrap justify-center gap-6 pt-4 border-t border-cyan/10",
              isRTL && "flex-row-reverse",
            )}
          >
            <motion.a
              href="mailto:raoof.r12@gmail.com"
              className="flex items-center text-text-body hover:text-cyan transition-colors font-mono text-xs"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Mail className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />{" "}
              raoof.r12@gmail.com
            </motion.a>
            <motion.a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-text-body hover:text-cyan transition-colors font-mono text-xs"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Github className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />{" "}
              GitHub
            </motion.a>
            <motion.a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-text-body hover:text-cyan transition-colors font-mono text-xs"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Linkedin className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />{" "}
              LinkedIn
            </motion.a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
