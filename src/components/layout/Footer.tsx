"use client";

import Link from "next/link";
import { Fingerprint, Github, Linkedin, Mail, Twitter } from "lucide-react";
import {
  CONTACT_EMAIL_GMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  ORCID_URL,
  TWITTER_URL,
} from "@/lib/constants";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";

export function Footer() {
  const { locale, t } = useTranslation();

  const getPath = (path: string) => {
    if (locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };

  const navLinks = [
    { name: t.nav.about, href: "/about" },
    { name: t.nav.projects, href: "/projects" },
    { name: t.nav.lab, href: "/lab" },
    { name: t.nav.writeups, href: "/write-ups" },
    { name: t.nav.resume, href: "/resume" },
    { name: t.nav.contact, href: "/contact" },
  ];

  const socialLinks = [
    { name: "GitHub", href: GITHUB_URL, icon: Github },
    { name: "LinkedIn", href: LINKEDIN_URL, icon: Linkedin },
    { name: "Twitter", href: TWITTER_URL, icon: Twitter },
    { name: "ORCID", href: ORCID_URL, icon: Fingerprint },
    { name: "Email", href: `mailto:${CONTACT_EMAIL_GMAIL}`, icon: Mail },
  ];

  return (
    <footer className="border-t border-cyan/10 bg-background py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand/Identity */}
          <div className="md:col-span-2 space-y-6">
            <Link
              href={getPath("/")}
              className="font-mono font-bold text-lg tracking-tight text-white group"
            >
              ~/mohammad-raouf-abedini
              <span className="text-cyan animate-pulse">_</span>
            </Link>
            <p className="text-text-body text-sm max-w-sm leading-relaxed">
              {t.hero.intro}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-cyan/10 text-text-meta hover:text-cyan hover:border-cyan/40 transition-all bg-cyber-dark/50"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <h4 className="font-mono text-[10px] text-text-meta tracking-[0.3em] uppercase">
              {t.nav.home}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={getPath(link.href)}
                    className="text-sm text-text-body hover:text-cyan transition-colors font-mono"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal/Metadata */}
          <div className="space-y-6">
            <h4 className="font-mono text-[10px] text-text-meta tracking-[0.3em] uppercase">
              {t.footer.status}
            </h4>
            <div className="space-y-4 font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-meta">{t.footer.last_index}:</span>
                <span className="text-cyan">{t.footer.last_index_value}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-meta">{t.footer.environment}:</span>
                <span className="text-purple uppercase">PROD-SYD</span>
              </div>
              <div className="pt-4 border-t border-cyan/5">
                <p className="text-[10px] text-text-meta leading-relaxed">
                  © 2026 Mohammad Raouf Abedini. {t.footer.all_rights_reserved}.
                  <br />
                  <span className="opacity-60">
                    {t.footer.built_with} Next.js, {t.footer.designed_by} Raouf.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
