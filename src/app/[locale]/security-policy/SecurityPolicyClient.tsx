"use client";

import { HUDFrame } from "@/components/ui/HUDFrame";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Shield, AlertTriangle, Mail, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { formatNumber } from "@/i18n/format";

export function SecurityPolicyClient() {
  const { locale, t } = useTranslation();
  const reportLink = `mailto:${CONTACT_EMAIL}`;

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  return (
    <div className="os-legacy relative overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <div className="mb-12">
            <div className="flex items-center space-x-2 text-cyan mb-2">
              <Shield className="w-4 h-4" />
              <span className="font-mono text-xs tracking-widest uppercase text-cyan/70">
                {t.security_policy.subtitle}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              {t.security_policy.title}
            </h1>
            <p className="text-text-body max-w-2xl">
              {t.security_policy.description}
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-8">
          <AnimatedSection>
            <HUDFrame className="p-6 md:p-8 bg-cyan/5 border-s-4 border-s-cyan">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-cyan" />{" "}
                    {t.security_policy.report_heading}
                  </h2>
                  <p className="text-text-body">
                    {t.security_policy.report_intro}{" "}
                    <a href={reportLink} className="os-inline-link">
                      <bdi dir="ltr">{CONTACT_EMAIL}</bdi>
                    </a>
                  </p>
                </div>
                <NeonButton href={reportLink} variant="primary">
                  <Mail className="w-4 h-4 me-2" />{" "}
                  {t.security_policy.send_report}
                </NeonButton>
              </div>
            </HUDFrame>
          </AnimatedSection>

          <AnimatedSection>
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-cyan font-mono">
                  <bdi>
                    {formatNumber(1, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>{" "}
                {t.security_policy.scope_title}
              </h2>
              <HUDFrame className="p-6 bg-[#030712]/60">
                <p className="text-text-body mb-4">
                  {t.security_policy.scope_desc}
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                    <span>
                      <code className="text-cyan" dir="ltr">
                        raoufabedini.dev
                      </code>{" "}
                      — {t.security_policy.scope_site}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                    <span>
                      {t.security_policy.scope_repos}{" "}
                      <code className="text-cyan" dir="ltr">
                        github.com/Raoof128
                      </code>
                    </span>
                  </li>
                </ul>
              </HUDFrame>
            </section>
          </AnimatedSection>

          <AnimatedSection>
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-cyan font-mono">
                  <bdi>
                    {formatNumber(2, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>{" "}
                {t.security_policy.what_title}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <HUDFrame className="p-6 bg-[#030712]/60">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
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
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
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

          <AnimatedSection>
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-cyan font-mono">
                  <bdi>
                    {formatNumber(3, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>{" "}
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
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan/10 border border-cyan/30 shrink-0">
                        <Icon className="w-5 h-5 text-cyan" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{heading}</h3>
                        <p className="text-text-body text-sm">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </HUDFrame>
            </section>
          </AnimatedSection>

          <AnimatedSection>
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-cyan font-mono">
                  <bdi>
                    {formatNumber(4, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>{" "}
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
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan mt-1">
                        {formatNumber(i + 1, locale)}.
                      </span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </HUDFrame>
            </section>
          </AnimatedSection>

          <AnimatedSection>
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-cyan font-mono">
                  <bdi>
                    {formatNumber(5, locale, {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    .
                  </bdi>
                </span>{" "}
                {t.security_policy.ack_title}
              </h2>
              <HUDFrame className="p-6 bg-[#030712]/60">
                <p className="text-text-body mb-4">
                  {t.security_policy.ack_desc}{" "}
                  <Link
                    href={getPath("/hall-of-fame")}
                    className="os-inline-link"
                  >
                    {t.security_policy.ack_hall_of_fame}
                  </Link>
                  {t.security_policy.ack_desc_suffix}
                </p>
                <p className="text-text-body text-sm font-mono">
                  {t.security_policy.ack_note}
                </p>
              </HUDFrame>
            </section>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
