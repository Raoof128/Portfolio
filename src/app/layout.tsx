import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { GridBackground } from "@/components/ui/GridBackground";
import { Scanline } from "@/components/ui/Scanline";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mohammad Raouf Abedini | Cybersecurity + Software Engineering",
    template: "%s | Mohammad Raouf Abedini"
  },
  description: "Portfolio of Mohammad Raouf Abedini - Cybersecurity & Software Engineering. Specialized in privacy-first security tools, systems programming, and secure architecture.",
  keywords: ["Cybersecurity", "Software Engineering", "Portfolio", "Mohammad Raouf Abedini", "Raouf", "Next.js", "React", "Rust", "Go", "eBPF"],
  authors: [{ name: "Mohammad Raouf Abedini", url: "https://raouf.sh" }],
  creator: "Mohammad Raouf Abedini",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://raouf.sh",
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
  metadataBase: new URL("https://raouf.sh"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased bg-background text-foreground`}
      >
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
