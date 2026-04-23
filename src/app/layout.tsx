import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GridBackground } from "@/components/ui/GridBackground";
import { Scanline } from "@/components/ui/Scanline";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  GITHUB_URL,
  LINKEDIN_URL,
  SITE_NAME,
  SITE_URL,
  TWITTER_URL,
} from "@/lib/constants";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mohammad Raouf Abedini | AI Security Researcher",
    template: "%s | Mohammad Raouf Abedini"
  },
  description: "AI security researcher with demonstrated ability to independently discover, validate, and responsibly disclose cross-platform vulnerabilities. Authored 'The Invisible Window' — a 12-page IEEE-format security research paper achieving 100% screen capture evasion. Anthropic AI model evaluator. Motivated by reducing catastrophic risks from advanced AI.",
  keywords: ["AI Security Research", "Vulnerability Research", "Responsible Disclosure", "LLM Security Evaluation", "Cross-Platform Exploit Development", "Mohammad Raouf Abedini", "AI Safety", "Screen Capture Evasion", "Offensive Security", "Python Systems Programming", "Anthropic"],
  authors: [{ name: "Mohammad Raouf Abedini", url: SITE_URL }],
  creator: "Mohammad Raouf Abedini",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    title: "Mohammad Raouf Abedini | AI Security Researcher",
    description: "Vulnerability research, responsible disclosure, and AI safety. Authored 'The Invisible Window'. Anthropic AI evaluator.",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammad Raouf Abedini | AI Security Researcher",
    description: "Vulnerability research, responsible disclosure, and AI safety. Authored 'The Invisible Window'. Anthropic AI evaluator.",
    creator: "@Raoof128",
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Static, trusted JSON-LD structured data for SEO - no user input involved
  const jsonLdString = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mohammad Raouf Abedini",
    "alternateName": "Raouf",
    "url": SITE_URL,
    "jobTitle": "AI Security Researcher",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Castle Hill",
      "addressRegion": "NSW",
      "addressCountry": "AU"
    },
    "knowsAbout": [
      { "@type": "Thing", "name": "Vulnerability Research" },
      { "@type": "Thing", "name": "Responsible Disclosure" },
      { "@type": "Thing", "name": "AI Safety & LLM Security Evaluation" },
      { "@type": "Thing", "name": "Cross-Platform Exploit Development" },
      { "@type": "Thing", "name": "Offensive Security" },
      { "@type": "Thing", "name": "Python & Systems Programming" },
      { "@type": "Thing", "name": "AI Model Evaluation" },
      { "@type": "Thing", "name": "Dual-Use Risk Assessment" },
      { "@type": "Thing", "name": "Reducing Catastrophic AI Risks" }
    ],
    "sameAs": [
      GITHUB_URL,
      LINKEDIN_URL,
      TWITTER_URL
    ]
  });

  return (
    <html lang="en">
      <body
        className={`${chakraPetch.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan focus:text-black focus:font-mono focus:text-sm">
          Skip to main content
        </a>
        <GridBackground />
        <Scanline />
        <Navbar />
        <main id="main-content" className="min-h-screen pt-16 flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
