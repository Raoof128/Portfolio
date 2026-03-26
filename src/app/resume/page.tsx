import type { Metadata } from "next";
import { ResumeClient } from "./ResumeClient";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Mohammad Raouf Abedini — AI & Cybersecurity Researcher, Security Engineer.",
  openGraph: {
    title: "Resume | Mohammad Raouf Abedini",
    description: "Resume of Mohammad Raouf Abedini — AI & Cybersecurity Researcher, Security Engineer.",
  },
  twitter: {
    card: "summary",
    title: "Resume | Mohammad Raouf Abedini",
    description: "Resume of Mohammad Raouf Abedini — AI & Cybersecurity Researcher, Security Engineer.",
  },
};

export default function ResumePage() {
  return <ResumeClient />;
}
