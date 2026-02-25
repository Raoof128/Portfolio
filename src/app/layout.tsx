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
    default: "Mohammad Raouf Abedini | Cybersecurity + Software Engineering",
    template: "%s | Mohammad Raouf Abedini"
  },
  description: "Portfolio of Mohammad Raouf Abedini - Cybersecurity & Software Engineering. Specialized in privacy-first security tools, systems programming, and secure architecture.",
  keywords: ["Cybersecurity", "Software Engineering", "Portfolio", "Mohammad Raouf Abedini", "Raouf", "Next.js", "React", "Rust", "Go", "eBPF"],
  authors: [{ name: "Mohammad Raouf Abedini", url: SITE_URL }],
  creator: "Mohammad Raouf Abedini",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    title: "Mohammad Raouf Abedini | Cybersecurity + Software Engineering",
    description: "Building privacy-first security tools and scalable systems.",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammad Raouf Abedini | Cybersecurity + Software Engineering",
    description: "Building privacy-first security tools and scalable systems.",
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
    "jobTitle": "Cybersecurity Specialist",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sydney",
      "addressRegion": "NSW",
      "addressCountry": "AU"
    },
    "knowsAbout": [
      { "@type": "Thing", "name": "Cybersecurity" },
      { "@type": "Thing", "name": "eBPF (Extended Berkeley Packet Filter)" },
      { "@type": "Thing", "name": "Network Security" },
      { "@type": "Thing", "name": "Rust Programming Language" },
      { "@type": "Thing", "name": "Next.js" },
      { "@type": "Thing", "name": "Penetration Testing" }
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
        <GridBackground />
        <Scanline />
        <Navbar />
        <main className="min-h-screen pt-16 flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
