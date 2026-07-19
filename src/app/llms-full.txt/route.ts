import { projects, writeups, labExperiments } from "@/lib/data";
import { certifications } from "@/lib/certifications";
import {
  SITE_URL,
  SITE_LAST_MODIFIED,
  GITHUB_URL,
  LINKEDIN_URL,
  ORCID_URL,
  TWITTER_URL,
  CONTACT_EMAIL,
  CONTACT_EMAIL_GMAIL,
} from "@/lib/constants";

export const dynamic = "force-static";

// Static identity/summary prose (mirrors the résumé; not stored as structured
// data). Everything below it is generated from the data modules so the corpus
// stays in sync with the site automatically.
const HEADER = `# Mohammad Raouf Abedini — Full Machine-Readable Corpus

> Generated ${SITE_LAST_MODIFIED} from https://raoufabedini.dev
> Canonical: ${SITE_URL}/llms-full.txt · Concise version: ${SITE_URL}/llms.txt
> This is plain UTF-8 text for AI agents, search systems, and retrieval.

## Identity
Name: Mohammad Raouf Abedini (Raouf)
Role: AI Security Researcher · LLM Agent Red-Teaming · Offensive & Defensive Security Engineering
Location: Sydney, Australia · ready to relocate to San Francisco, CA · visa sponsorship required
ORCID: 0009-0000-6214-258X

## Professional Summary
Security researcher building systems that measure and contain the cyber capabilities
of frontier AI. Creator of Project Simurgh, a provider-agnostic containment-attestation
framework that red-teams LLM agents under an adversarial, dishonest-producer threat model
and produces Ed25519-signed, offline-verifiable evidence of what an agent did after a
guardrail miss (138/138 classifier-missed cases contained; live-agent attack success cut
9/140 to 0/140 on AgentDojo; five machine-checked Lean theorems). Evaluated Claude outputs
for exploitable code and guardrail circumvention in Anthropic's safety-evaluation program
(via Alignerr). Shipped detection end to end: on-device phishing ML at 87% F1 and real-time
intrusion detection at 500K+ packets/sec.

## Experience
- AI Safety Evaluator (Claude), Alignerr — Anthropic safety-evaluation program, Jan–Mar 2026.
- Freelance Security Engineer & Full-Stack Developer, Self-Employed, Jan 2024 – Present.
- IT Manager & Security Operations, Iran Pharmacy, 2019–2024.

## Education
- Bachelor of IT (Cyber Security), Macquarie University, Sydney.

## Languages available
Published in 5 languages: English (/), Persian (/fa), Arabic (/ar), Chinese (/zh), Spanish (/es).
`;

function projectBlock(slug: string, p: (typeof projects)[string]): string {
  const lines: string[] = [];
  lines.push(`### ${p.title} [${p.category} · ${p.year}]`);
  lines.push(`URL: ${SITE_URL}/projects/${slug}`);
  lines.push(p.description);
  if (p.tags?.length) lines.push(`Tags: ${p.tags.join(", ")}`);
  const links: string[] = [];
  if (p.links.repo) links.push(`Repo: ${p.links.repo}`);
  if (p.links.demo) links.push(`Demo: ${p.links.demo}`);
  if (links.length) lines.push(links.join(" · "));
  for (const paper of p.papers ?? []) {
    const doi = paper.doi
      ? ` — DOI ${paper.doi} (https://doi.org/${paper.doi})`
      : "";
    lines.push(`Paper: ${paper.title}${doi}`);
  }
  if (p.proof?.length) {
    lines.push("Proof:");
    for (const item of p.proof) lines.push(`- ${item}`);
  }
  return lines.join("\n");
}

export function GET(): Response {
  const parts: string[] = [HEADER];

  const projectEntries = Object.entries(projects);
  parts.push(`## Projects (${projectEntries.length})\n`);
  parts.push(
    projectEntries.map(([slug, p]) => projectBlock(slug, p)).join("\n\n"),
  );

  parts.push(`\n## Write-ups (${writeups.length})\n`);
  parts.push(
    writeups
      .map((w) =>
        [
          `### ${w.title} (${w.date}) [${w.tag}]`,
          `URL: ${SITE_URL}/write-ups/${w.slug}`,
          w.takeaway,
        ].join("\n"),
      )
      .join("\n\n"),
  );

  parts.push(`\n## Lab experiments (${labExperiments.length})\n`);
  parts.push(
    labExperiments
      .map((e) =>
        [
          `### ${e.title} [${e.status}]`,
          `URL: ${SITE_URL}/lab/${e.id}`,
          e.description,
          `Objective: ${e.objective}`,
          `Tech: ${e.tech.join(", ")}`,
        ].join("\n"),
      )
      .join("\n\n"),
  );

  // Research papers with DOIs, deduplicated across projects.
  const papers = new Map<string, string>();
  for (const p of Object.values(projects)) {
    for (const paper of p.papers ?? []) {
      if (paper.doi && !papers.has(paper.doi)) {
        papers.set(
          paper.doi,
          `- ${paper.title} — ${paper.venue ?? "Zenodo"}${paper.year ? " " + paper.year : ""} — DOI ${paper.doi} — https://doi.org/${paper.doi}`,
        );
      }
    }
  }
  parts.push(`\n## Research papers (${papers.size})\n`);
  parts.push([...papers.values()].join("\n"));

  parts.push(`\n## Certifications (${certifications.length})\n`);
  parts.push(
    certifications
      .map(
        (c) =>
          `- ${c.name} — ${c.issuer} (${c.issued})${c.grade ? ` — ${c.grade}` : ""}`,
      )
      .join("\n"),
  );

  parts.push(`\n## Contact
Website: ${SITE_URL}
Email (professional): ${CONTACT_EMAIL_GMAIL}
Security reports (RFC 9116): ${CONTACT_EMAIL} · ${SITE_URL}/.well-known/security.txt
GitHub: ${GITHUB_URL}
LinkedIn: ${LINKEDIN_URL}
X (Twitter): ${TWITTER_URL}
ORCID: ${ORCID_URL}
Résumé: ${SITE_URL}/resume · PDF ${SITE_URL}/Mohammad_Raouf_Abedini_Resume.pdf
Security policy: ${SITE_URL}/security-policy · Hall of fame: ${SITE_URL}/hall-of-fame
`);

  const body = parts.join("\n") + "\n";
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
