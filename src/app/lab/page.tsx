import type { Metadata } from "next";
import { LabClient } from "./LabClient";

export const metadata: Metadata = {
  title: "Lab",
  description: "Experimental code, PoCs, and cybersecurity research snippets.",
  openGraph: {
    title: "Lab | Mohammad Raouf Abedini",
    description: "Experimental code, PoCs, and cybersecurity research snippets.",
  },
  twitter: {
    card: "summary",
    title: "Lab | Mohammad Raouf Abedini",
    description: "Experimental code, PoCs, and cybersecurity research snippets.",
  },
};

export default function LabPage() {
  return <LabClient />;
}
