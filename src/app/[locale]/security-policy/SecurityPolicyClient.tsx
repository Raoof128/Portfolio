"use client";

import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import {
  Shield,
  AlertTriangle,
  Mail,
  Clock,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/utils";
import { motion } from "framer-motion";
import { CONTACT_EMAIL } from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { cn } from "@/lib/utils";

export function SecurityPolicyClient() {
  const { locale, t } = useTranslation();
  const isRTL = locale === "fa" || locale === "ar";
  const reportLink = `mailto:${CONTACT_EMAIL}`;

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden">
      <ActiveGrid />
      <main
        className={cn(
          "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
          isRTL && "text-right",
        )}
      >
        <AnimatedSection variants={fadeInUp}>
          <div className="mb-12">
            <div
              className={cn(
                "flex items-center space-x-2 text-cyan mb-2",
                isRTL && "flex-row-reverse space-x-reverse",
              )}
            >
              <Shield className="w-4 h-4" />
              <span className="font-mono text-xs tracking-widest uppercase text-cyan/70">
                {t.security_policy.subtitle}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              <DecryptedText text={t.security_policy.title} />
            </h1>
            <p className="text-text-body max-w-2xl">
              {t.security_policy.description}
            </p>
          </div>
        </AnimatedSection>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="space-y-8"
        >
          <AnimatedSection variants={fadeInUp}>
            <HUDFrame className="p-6 md:p-8 bg-cyan/5 border-l-4 border-l-cyan">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2
                    className={cn(
                      "text-xl font-bold text-white mb-2 flex items-center gap-2",
                      isRTL && "flex-row-reverse",
                    )}
                  >
                    <Mail className="w-5 h-5 text-cyan" />{" "}
                    {t.security_policy.report_heading}
                  </h2>
                  <p className="text-text-body">
                    {t.security_policy.report_intro}{" "}
                    <a href={reportLink} className="text-cyan hover:underline">
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </div>
                <NeonButton href={reportLink} variant="primary">
                  <Mail className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />{" "}
                  {t.security_policy.send_report}
                </NeonButton>
              </div>
            </HUDFrame>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <h2
                className={cn(
                  "text-2xl font-bold text-white flex items-center gap-2",
                  isRTL && "flex-row-reverse",
                )}
              >
                <span className="text-cyan font-mono">01.</span>{" "}
                {t.security_policy.scope_title}
              </h2>
              <HUDFrame className="p-6 bg-[#030712]/60">
                <p className="text-text-body mb-4">
                  {t.security_policy.scope_desc}
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li
                    className={cn(
                      "flex items-start gap-2",
                      isRTL && "flex-row-reverse",
                    )}
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                    <span>
                      <code className="text-cyan">raoufabedini.dev</code> —{" "}
                      {t.security_policy.scope_site}
                    </span>
                  </li>
                  <li
                    className={cn(
                      "flex items-start gap-2",
                      isRTL && "flex-row-reverse",
                    )}
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                    <span>
                      {t.security_policy.scope_repos}{" "}
                      <code className="text-cyan">github.com/Raoof128</code>
                    </span>
                  </li>
                </ul>
              </HUDFrame>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <h2
                className={cn(
                  "text-2xl font-bold text-white flex items-center gap-2",
                  isRTL && "flex-row-reverse",
                )}
              >
                <span className="text-cyan font-mono">02.</span>{" "}
                {t.security_policy.what_title}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <HUDFrame className="p-6 bg-[#030712]/60">
                  <h3
                    className={cn(
                      "text-lg font-bold text-white mb-3 flex items-center gap-2",
                      isRTL && "flex-row-reverse",
                    )}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />{" "}
                    {t.security_policy.in_scope}
                  </h3>
                  <ul className="space-y-2 text-sm text-text-body">
                    {[
                      t.security_policy.in_1,
                      t.security_policy.in_2,
                      t.security_policy.in_3,
                      t.security_policy.in_4,
                      t.security_policy.in_5,
                      t.security_policy.in_6,
                    ].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </HUDFrame>
                <HUDFrame className="p-6 bg-[#030712]/60">
                  <h3
                    className={cn(
                      "text-lg font-bold text-white mb-3 flex items-center gap-2",
                      isRTL && "flex-row-reverse",
                    )}
                  >
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />{" "}
                    {t.security_policy.out_of_scope}
                  </h3>
                  <ul className="space-y-2 text-sm text-text-body">
                    {[
                      t.security_policy.out_1,
                      t.security_policy.out_2,
                      t.security_policy.out_3,
                      t.security_policy.out_4,
                      t.security_policy.out_5,
                      t.security_policy.out_6,
                    ].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </HUDFrame>
              </div>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <h2
                className={cn(
                  "text-2xl font-bold text-white flex items-center gap-2",
                  isRTL && "flex-row-reverse",
                )}
              >
                <span className="text-cyan font-mono">03.</span>{" "}
                {t.security_policy.timeline_title}
              </h2>
              <HUDFrame className="p-6 bg-[#030712]/60">
                <div className="space-y-4">
                  {[
                    {
                      icon: Clock,
                      heading: t.security_policy.t1_heading,
                      desc: t.security_policy.t1_desc,
                    },
                    {
                      icon: Shield,
                      heading: t.security_policy.t2_heading,
                      desc: t.security_policy.t2_desc,
                    },
                    {
                      icon: CheckCircle,
                      heading: t.security_policy.t3_heading,
                      desc: t.security_policy.t3_desc,
                    },
                  ].map(({ icon: Icon, heading, desc }, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-4",
                        isRTL && "flex-row-reverse",
                      )}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan/10 border border-cyan/30 shrink-0">
                        <Icon className="w-5 h-5 text-cyan" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{heading}</h4>
                        <p className="text-text-body text-sm">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </HUDFrame>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <h2
                className={cn(
                  "text-2xl font-bold text-white flex items-center gap-2",
                  isRTL && "flex-row-reverse",
                )}
              >
                <span className="text-cyan font-mono">04.</span>{" "}
                {t.security_policy.guidelines_title}
              </h2>
              <HUDFrame className="p-6 bg-[#030712]/60">
                <ul className="space-y-3 text-text-body">
                  {[
                    t.security_policy.g1,
                    t.security_policy.g2,
                    t.security_policy.g3,
                    t.security_policy.g4,
                    t.security_policy.g5,
                  ].map((guideline, i) => (
                    <li
                      key={i}
                      className={cn(
                        "flex items-start gap-2",
                        isRTL && "flex-row-reverse",
                      )}
                    >
                      <span className="text-cyan mt-1">{i + 1}.</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </HUDFrame>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <h2
                className={cn(
                  "text-2xl font-bold text-white flex items-center gap-2",
                  isRTL && "flex-row-reverse",
                )}
              >
                <span className="text-cyan font-mono">05.</span>{" "}
                {t.security_policy.encrypted_title}
              </h2>
              <HUDFrame className="p-6 bg-[#030712]/60">
                <p className="text-text-body mb-4">
                  {t.security_policy.encrypted_desc}
                </p>
                <Link
                  href="/pgp-key.txt"
                  className={cn(
                    "inline-flex items-center text-cyan hover:underline font-mono text-sm",
                    isRTL && "flex-row-reverse gap-2",
                  )}
                >
                  <ExternalLink
                    className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")}
                  />
                  {t.security_policy.pgp_link}
                </Link>
              </HUDFrame>
            </section>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <section className="space-y-4">
              <h2
                className={cn(
                  "text-2xl font-bold text-white flex items-center gap-2",
                  isRTL && "flex-row-reverse",
                )}
              >
                <span className="text-cyan font-mono">06.</span>{" "}
                {t.security_policy.ack_title}
              </h2>
              <HUDFrame className="p-6 bg-[#030712]/60">
                <p className="text-text-body mb-4">
                  {t.security_policy.ack_desc}{" "}
                  <Link
                    href={getPath("/hall-of-fame")}
                    className="text-cyan hover:underline"
                  >
                    {t.security_policy.ack_hall_of_fame}
                  </Link>
                  .
                </p>
                <p className="text-text-body text-sm font-mono">
                  {t.security_policy.ack_note}
                </p>
              </HUDFrame>
            </section>
          </AnimatedSection>
        </motion.div>
      </main>
    </div>
  );
}
