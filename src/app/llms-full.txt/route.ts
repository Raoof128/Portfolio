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
const HEADER = `# Mohammad Raouf Abedini: Full Machine-Readable Corpus

> Generated ${SITE_LAST_MODIFIED} from ${SITE_URL}
> Canonical: ${SITE_URL}/llms-full.txt · Concise version: ${SITE_URL}/llms.txt
> This is plain UTF-8 text for AI agents, search systems, and retrieval.

## Identity
Name: Mohammad Raouf Abedini (Raouf)
Role: AI Security Researcher · Adversarial Robustness & AI Control · Empirical Safety Evaluation
Location: Sydney, Australia · relocating to San Francisco, CA · visa sponsorship required
Availability: Full-time from December 2026 for a three- to six-month San Francisco research placement
ORCID: 0009-0000-6214-258X

## Professional Summary
Raouf builds and tests host-side controls for what tool-using AI agents are permitted
to do. He is the sole author of Project Simurgh, an inspectable agent-authorisation
prototype evaluated with matched controls. Its October 2026 transfer study reports
a benefit on Llama-3.2-3B and no incremental protection on gpt-6-luna, whose baseline
was already clean. He evaluated Claude for exploitable code and guardrail
circumvention in Anthropic's safety-evaluation program via Alignerr (Jan–Mar 2026).
He reports five sole-author preprints and coordinated disclosures to Microsoft and
Apple, following seven years in security operations and engineering.

## Current Simurgh evidence — author-reported October 2026 study
- Design: 24 tasks, two trials each, three matched controls (credential-only,
  composed, deny-all), two models and 288 replayed branches.
- Llama-3.2-3B: composed host controls reduced restricted-state trials with new
  effects from 17/24 to 0/24, retained 23/24 useful completions and blocked no valid
  proposal in that study.
- OpenAI gpt-6-luna: the baseline was already 0/24; no incremental protection
  was demonstrated on this model in this experiment.
- Uncertainty: 24 restricted trials fall into six states. Per-state Wilson 95%
  intervals were 43.6–97.0% versus 0.0–39.0%; part of the gap holds by construction.
- Integration limitation: an eight-case OpenAI Responses API workflow exposed a
  role-placement error (8/8 declined). Original traces were retained. A frozen
  developer-role correction completed 2/3 authorised workflows and declined 5/5
  restricted workflows, with one refusal still open.
- Reproducibility: current study archives bind files and source revisions with
  SHA-256; earlier frozen attestations use Ed25519. Current replay needs native
  Linux x86_64 and Python 3.12, with dependencies installed before offline use.
  The repository has 39 Lean 4 proof-model files, not 39 implementation-correctness
  theorems; its gate rejects unproven “sorry” placeholders. The 19 Oct 2026 smoke
  run passed 5,171 tests. The reported snapshot contains 92 releases.
- Software DOI: 10.5281/zenodo.21737792. This software record is distinct from the
  earlier device-integrity preprint, DOI 10.5281/zenodo.20374849.
- Self-audit: 919 project documents audited; 141 dated findings published,
  including overstatements in earlier closeouts.

## Earlier frozen Simurgh stages — separate scoped experiments
- A 180-case Llama Guard 4 12B input-classifier capture missed 138 malicious cases;
  containment evidence covers all 138. Of these, 120 were downstream injections
  outside an input-only classifier's view. This is coverage evidence, not a ranking
  of classifiers.
- The AgentDojo workspace experiment reduced targeted attack success on a live
  Llama-3.3-70B agent from 9/140 to 0/140, while benign utility fell from 7/10 to
  6/10. The separate four-suite deterministic run, without a real LLM, reported
  0/949 attack success, 949/949 utility under attack and 97/97 benign utility.
  These are scoped experiments, not guarantees for arbitrary agents or attacks.

## Experience
- AI Safety Evaluator (Claude), Alignerr: Anthropic safety-evaluation program, Jan–Mar 2026.
- Cofounder, Syllabus-Sync: Macquarie University Incubator startup, May 2026 – Present;
  security backend including WebAuthn, TOTP MFA, Postgres RLS and audit logging;
  the 17 August 2026 CI test job passed 1,343 tests across 155 files; its separate
  security job failed, so this is not a claim that the overall pipeline passed.
- Security Engineer & Full-Stack Developer, Self-Employed (Freelance), Jan 2024 – Present;
  5.0-star rating across 31 Airtasker reviews (profile reports 35 completed tasks).
- IT Manager & Security Operations, Iran Pharmacy, Aug 2019 – Jan 2024; 50+ staff;
  automated workflows reduced manual triage by about 30%.

## Education
- Bachelor of Cyber Security, Macquarie University, Sydney; expected June 2027.
  Final session February–June 2027 is fully online; coursework includes Natural
  Language Processing and Machine Learning.
- Diploma of Information Technology, Macquarie University, July 2023 – May 2024.

## Further systems work
- SentinelSSH: Rust MCP server for policy-scoped, read-only Linux-host inspection
  through 17 typed tools and no shell. No repository URL is asserted here.
- SentinelFlow: repository-reported 28.4M packets/sec in a single-thread synthetic
  SYN-ACK packet-header parsing benchmark over 5M repeated packets, not full IDS throughput.

## Languages available
Published in 5 languages: English (/), Persian (/fa), Arabic (/ar), Chinese (/zh), Spanish (/es).

`;

function projectBlock(slug: string, p: (typeof projects)[string]): string {
  const lines: string[] = [];
  lines.push(`### ${p.title} [${p.category} · ${p.year}]`);
  lines.push(`URL: ${SITE_URL}/projects/${slug}`);
  lines.push(p.description);
  lines.push(p.fullDescription);
  lines.push(`Build stack: ${p.build.stack.join(", ")}`);
  lines.push("Features:", ...p.build.features.map((item) => `- ${item}`));
  lines.push(
    "Security and limitations:",
    ...p.secure.measures.map((item) => `- ${item}`),
  );
  if (p.tags?.length) lines.push(`Tags: ${p.tags.join(", ")}`);
  const links: string[] = [];
  if (p.links.repo)
    links.push(
      p.links.repoVisibility === "private"
        ? `Repo (private; contact the author to request access): ${p.links.repo}`
        : `Repo: ${p.links.repo}`,
    );
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
          `### ${w.title} [${w.tag}]`,
          `Published: ${w.date}${w.updatedAt ? ` · Updated: ${w.updatedAt}` : ""}`,
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
