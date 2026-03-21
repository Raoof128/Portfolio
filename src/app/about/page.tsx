import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "About",
  description: "Cybersecurity student and developer specializing in offensive security, digital forensics, and applied cryptography.",
  openGraph: {
    title: "About | Mohammad Raouf Abedini",
    description: "Cybersecurity student and developer specializing in offensive security, digital forensics, and applied cryptography.",
  },
  twitter: {
    card: "summary",
    title: "About | Mohammad Raouf Abedini",
    description: "Cybersecurity student and developer specializing in offensive security, digital forensics, and applied cryptography.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
