import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "About",
  description: "AI and cybersecurity researcher specializing in AI safety, LLM security, threat detection engineering, and adversarial machine learning.",
  openGraph: {
    title: "About | Mohammad Raouf Abedini",
    description: "AI and cybersecurity researcher specializing in AI safety, LLM security, threat detection engineering, and adversarial machine learning.",
  },
  twitter: {
    card: "summary",
    title: "About | Mohammad Raouf Abedini",
    description: "AI and cybersecurity researcher specializing in AI safety, LLM security, threat detection engineering, and adversarial machine learning.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
