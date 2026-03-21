import type { Metadata } from "next";
import { ResumeClient } from "./ResumeClient";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Mohammad Raouf Abedini — Cybersecurity & Full-Stack Development.",
  openGraph: {
    title: "Resume | Mohammad Raouf Abedini",
    description: "Resume of Mohammad Raouf Abedini — Cybersecurity & Full-Stack Development.",
  },
  twitter: {
    card: "summary",
    title: "Resume | Mohammad Raouf Abedini",
    description: "Resume of Mohammad Raouf Abedini — Cybersecurity & Full-Stack Development.",
  },
};

export default function ResumePage() {
  return <ResumeClient />;
}
