import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GridBackground } from "@/components/ui/GridBackground";
import { Scanline } from "@/components/ui/Scanline";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
  authors: [{ name: "Mohammad Raouf Abedini", url: "https://raoof128.github.io/Portfolio" }],
  creator: "Mohammad Raouf Abedini",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://raoof128.github.io/Portfolio",
    title: "Mohammad Raouf Abedini | Cybersecurity + Software Engineering",
    description: "Building privacy-first security tools and scalable systems.",
    siteName: "Mohammad Raouf Abedini Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammad Raouf Abedini | Cybersecurity + Software Engineering",
    description: "Building privacy-first security tools and scalable systems.",
    creator: "@Raoof128",
  },
  metadataBase: new URL("https://raoof128.github.io/Portfolio"),
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
    "url": "https://raoof128.github.io/Portfolio",
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
      "https://github.com/Raoof128",
      "https://linkedin.com/in/mohammad-raouf-abedini-885a9226a",
      "https://twitter.com/Raoof128"
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
