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
    default: "Mohammad Raouf Abedini | AI & Cybersecurity Researcher",
    template: "%s | Mohammad Raouf Abedini"
  },
  description: "AI and cybersecurity researcher specializing in AI safety, LLM security evaluation, threat detection engineering, and adversarial machine learning. 70+ research and engineering projects, Anthropic AI evaluator, Macquarie University.",
  keywords: ["AI Safety", "Cybersecurity Research", "LLM Security", "Adversarial Machine Learning", "Threat Detection", "Mohammad Raouf Abedini", "Network Intrusion Detection", "AI Model Evaluation", "Privacy-Preserving Data Analysis", "Offensive Security"],
  authors: [{ name: "Mohammad Raouf Abedini", url: SITE_URL }],
  creator: "Mohammad Raouf Abedini",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    title: "Mohammad Raouf Abedini | AI & Cybersecurity Researcher",
    description: "AI safety, LLM security, and threat detection research. 70+ projects, Anthropic AI evaluator.",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammad Raouf Abedini | AI & Cybersecurity Researcher",
    description: "AI safety, LLM security, and threat detection research. 70+ projects, Anthropic AI evaluator.",
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
    "jobTitle": "AI & Cybersecurity Researcher",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Castle Hill",
      "addressRegion": "NSW",
      "addressCountry": "AU"
    },
    "knowsAbout": [
      { "@type": "Thing", "name": "AI Safety & LLM Security" },
      { "@type": "Thing", "name": "Adversarial Machine Learning" },
      { "@type": "Thing", "name": "Threat Detection Engineering" },
      { "@type": "Thing", "name": "Network Intrusion Detection" },
      { "@type": "Thing", "name": "Offensive Security" },
      { "@type": "Thing", "name": "Privacy-Preserving Data Analysis" },
      { "@type": "Thing", "name": "AI Model Evaluation" },
      { "@type": "Thing", "name": "Cybersecurity" },
      { "@type": "Thing", "name": "Secure Software Architecture" }
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
