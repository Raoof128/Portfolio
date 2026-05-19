import type { Metadata } from "next";
import { WriteUpsClient } from "./WriteUpsClient";

export const metadata: Metadata = {
  title: "Write-ups",
  description: "Security research, CTF walkthroughs, and technical articles.",
  openGraph: {
    title: "Write-ups | Mohammad Raouf Abedini",
    description: "Security research, CTF walkthroughs, and technical articles.",
  },
  twitter: {
    card: "summary",
    title: "Write-ups | Mohammad Raouf Abedini",
    description: "Security research, CTF walkthroughs, and technical articles.",
  },
};

export default function WriteUpsPage() {
  return <WriteUpsClient />;
}
