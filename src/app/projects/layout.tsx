import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Deployed tools, research prototypes, and architectural proofs by Mohammad Raouf Abedini.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
