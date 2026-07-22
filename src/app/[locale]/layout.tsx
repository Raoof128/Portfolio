import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono, Vazirmatn } from "next/font/google";
import "../globals.css";
import { GridBackground } from "@/components/ui/GridBackground";
import { Scanline } from "@/components/ui/Scanline";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  CONTACT_EMAIL_GMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  ORCID_URL,
  SITE_LAST_MODIFIED,
  SITE_NAME,
  SITE_URL,
  TWITTER_URL,
} from "@/lib/constants";
import {
  Locale,
  getLocaleConfig,
  locales,
  getDictionary,
  defaultLocale,
} from "@/i18n";
import { I18nProvider } from "@/i18n/provider";
import {
  buildAlternates,
  serializeJsonLd,
  OG_IMAGE,
  LOCALE_PREFIX,
} from "@/lib/seo";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateStaticParams() {
  return Object.keys(locales).map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale in locales ? rawLocale : defaultLocale) as Locale;
  const t = await getDictionary(locale);

  return {
    title: {
      default: t.seo.home_title_default,
      template: "%s | Mohammad Raouf Abedini",
    },
    description: t.seo.home_description,
    keywords: [
      t.seo.keyword_1,
      t.seo.keyword_2,
      t.seo.keyword_3,
      t.seo.keyword_4,
      t.seo.keyword_5,
      "Mohammad Raouf Abedini",
      t.seo.keyword_6,
      t.seo.keyword_7,
      t.seo.keyword_8,
      t.seo.keyword_9,
      "Anthropic",
    ],
    authors: [{ name: "Mohammad Raouf Abedini", url: SITE_URL }],
    creator: "Mohammad Raouf Abedini",
    openGraph: {
      type: "website",
      locale:
        locale === "fa"
          ? "fa_IR"
          : locale === "ar"
            ? "ar_SA"
            : locale === "zh"
              ? "zh_CN"
              : locale === "es"
                ? "es_ES"
                : "en_AU",
      // Locale-aware canonical URL so the Persian homepage advertises its own
      // /fa URL as og:url, not the English apex.
      url: `${SITE_URL}${LOCALE_PREFIX[locale] || ""}` || SITE_URL,
      title: t.seo.home_title_default,
      description: t.seo.home_og_description,
      siteName: SITE_NAME,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.home_title_default,
      description: t.seo.home_og_description,
      creator: "@Raoofr12",
      site: "@Raoofr12",
      images: ["/og.png"],
    },
    metadataBase: new URL(SITE_URL),
    // Homepage self-canonical (locale-aware: en → "/", fa → "/fa", …). Sub-pages
    // override this with their own canonical via generateMetadata + buildAlternates.
    // RSS feed advertised site-wide for feed-reader/agent discovery.
    alternates: {
      ...buildAlternates("", locale),
      types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale in locales ? rawLocale : defaultLocale) as Locale;
  const config = getLocaleConfig(locale);
  const dictionary = await getDictionary(locale);

  const jsonLdString = serializeJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Mohammad Raouf Abedini",
        alternateName: "Raouf",
        url: SITE_URL,
        image: `${SITE_URL}/Raouf_2.jpg`,
        // Public professional contact (Gmail). The Outlook address is the
        // security-reporting contact only (see /.well-known/security.txt).
        email: `mailto:${CONTACT_EMAIL_GMAIL}`,
        jobTitle: "AI Security Researcher",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Sydney",
          addressRegion: "NSW",
          addressCountry: "AU",
        },
        // Currently enrolled (degree runs to Nov 2026) → `affiliation`, not
        // `alumniOf`. Switch to `alumniOf` after graduation so machine facts
        // never claim a completed degree ahead of time.
        affiliation: {
          "@type": "CollegeOrUniversity",
          name: "Macquarie University",
          sameAs: "https://www.mq.edu.au/",
        },
        knowsAbout: [
          { "@type": "Thing", name: "LLM Agent Red-Teaming" },
          { "@type": "Thing", name: "Verifiable Containment Attestation" },
          { "@type": "Thing", name: "AI Safety & LLM Security Evaluation" },
          { "@type": "Thing", name: "Vulnerability Research" },
          { "@type": "Thing", name: "Responsible Disclosure" },
          {
            "@type": "Thing",
            name: "Offensive & Defensive Security Engineering",
          },
          { "@type": "Thing", name: "AI Model Evaluation" },
          { "@type": "Thing", name: "Dual-Use Risk Assessment" },
          { "@type": "Thing", name: "Reducing Catastrophic AI Risks" },
        ],
        sameAs: [GITHUB_URL, LINKEDIN_URL, TWITTER_URL, ORCID_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: ["Raouf Abedini", "raoufabedini.dev"],
        // One WebSite entity available in all five locales. A single shared
        // @id must not carry a per-locale `inLanguage` (that made the same
        // entity contradict itself across pages); locale is expressed on each
        // page's WebPage node instead.
        inLanguage: Object.keys(locales),
        dateModified: SITE_LAST_MODIFIED,
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  });

  return (
    <html lang={locale} dir={config.dir}>
      <body
        className={`${chakraPetch.variable} ${jetbrainsMono.variable} ${vazirmatn.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: config.fontFamily } as React.CSSProperties}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan focus:text-black focus:font-mono focus:text-sm"
        >
          {dictionary.seo.skip_to_content}
        </a>
        <GridBackground />
        <Scanline />
        <I18nProvider locale={locale} dictionary={dictionary}>
          <Navbar />
          <main id="main-content" className="min-h-screen pt-16 flex flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </main>
        </I18nProvider>
      </body>
    </html>
  );
}
