"use client";

import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Trophy, Shield, Mail, Users } from "lucide-react";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/utils";
import { motion } from "framer-motion";
import { CONTACT_EMAIL } from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { cn } from "@/lib/utils";

export function HallOfFameClient() {
  const { locale, t } = useTranslation();
  const isRTL = locale === "fa" || locale === "ar";

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden">
      <ActiveGrid />
      <main className={cn("max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", isRTL && "text-right")}>
        <AnimatedSection variants={fadeInUp}>
          <div className="mb-12">
            <div className={cn("flex items-center space-x-2 text-cyan mb-2", isRTL && "flex-row-reverse space-x-reverse")}>
              <Trophy className="w-4 h-4" />
              <span className="font-mono text-xs tracking-widest uppercase text-cyan/70">{t.hall_of_fame.subtitle}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              <DecryptedText text={t.hall_of_fame.title} />
            </h1>
            <p className="text-text-body max-w-2xl">{t.hall_of_fame.description}</p>
          </div>
        </AnimatedSection>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} className="space-y-8">
          <AnimatedSection variants={fadeInUp}>
            <HUDFrame className="p-6 md:p-8 bg-cyan/5 border-l-4 border-l-cyan">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className={cn("text-xl font-bold text-white mb-2 flex items-center gap-2", isRTL && "flex-row-reverse")}>
                    <Shield className="w-5 h-5 text-cyan" /> {t.hall_of_fame.found_vuln_heading}
                  </h2>
                  <p className="text-text-body">
                    {t.hall_of_fame.report_guidance}{" "}
                    <Link href={getPath("/security-policy")} className="text-cyan hover:underline">
                      {t.hall_of_fame.security_policy_link}
                    </Link>{" "}
                    {t.hall_of_fame.report_guidance_suffix}
                  </p>
                </div>
                <NeonButton href={`mailto:${CONTACT_EMAIL}`} variant="primary">
                  <Mail className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} /> {t.hall_of_fame.report_btn}
                </NeonButton>
              </div>
            </HUDFrame>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <HUDFrame className="p-12 bg-[#030712]/60 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyber-gray/50 flex items-center justify-center border border-cyan/15">
                    <Users className="w-8 h-8 text-text-meta" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{t.hall_of_fame.no_entries_title}</h3>
                    <p className="text-text-body max-w-md mx-auto">{t.hall_of_fame.no_entries_desc}</p>
                  </div>
                  <div className="pt-4">
                    <span className="inline-flex items-center text-xs font-mono text-text-meta bg-cyber-gray/50 px-3 py-1 rounded-full">
                      {t.hall_of_fame.awaiting_badge}
                    </span>
                  </div>
                </div>
              </HUDFrame>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <h2 className={cn("text-2xl font-bold text-white flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <span className="text-cyan font-mono">01.</span> {t.hall_of_fame.criteria_title}
              </h2>
              <HUDFrame className="p-6 bg-[#030712]/60">
                <ul className="space-y-2 text-slate-300">
                  {[t.hall_of_fame.criteria_1, t.hall_of_fame.criteria_2, t.hall_of_fame.criteria_3, t.hall_of_fame.criteria_4].map((criterion, i) => (
                    <li key={i} className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                      <span className="text-cyan mt-0.5">{i + 1}.</span>
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </HUDFrame>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <HUDFrame className="p-6 bg-[#030712]/60 border-l-4 border-l-amber">
                <p className="text-text-body text-sm">
                  <span className="text-amber font-bold">Note:</span> {t.hall_of_fame.bounty_note}
                </p>
              </HUDFrame>
            </section>
          </AnimatedSection>
        </motion.div>
      </main>
    </div>
  );
}
