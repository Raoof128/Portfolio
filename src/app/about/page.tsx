import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "About",
  description: "AI security researcher specializing in vulnerability research, responsible disclosure, AI safety, and cross-platform exploit development. Anthropic AI model evaluator.",
  openGraph: {
    title: "About | Mohammad Raouf Abedini",
    description: "AI security researcher specializing in vulnerability research, responsible disclosure, AI safety, and cross-platform exploit development.",
  },
  twitter: {
    card: "summary",
    title: "About | Mohammad Raouf Abedini",
    description: "AI security researcher specializing in vulnerability research, responsible disclosure, AI safety, and cross-platform exploit development.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
