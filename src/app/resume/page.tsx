import type { Metadata } from "next";
import { ResumeClient } from "./ResumeClient";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Mohammad Raouf Abedini — AI Security Researcher, Vulnerability Research, Offensive Security, Python & Systems Programming.",
  openGraph: {
    title: "Resume | Mohammad Raouf Abedini",
    description: "Resume of Mohammad Raouf Abedini — AI Security Researcher, Vulnerability Research, Offensive Security.",
  },
  twitter: {
    card: "summary",
    title: "Resume | Mohammad Raouf Abedini",
    description: "Resume of Mohammad Raouf Abedini — AI Security Researcher, Vulnerability Research, Offensive Security.",
  },
};

export default function ResumePage() {
  return <ResumeClient />;
}
