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
Location: Sydney · Relocating to San Francisco, CA · Visa sponsorship required
Contact: raoof.r12@gmail.com · linkedin.com/in/mohammad-raouf-abedini-885a9226a
Links: github.com/Raoof128 · raoufabedini.dev · ORCID 0009-0000-6214-258X

## Professional Summary
Security researcher focused on keeping tool-using AI agents safe and beneficial: builds host-side controls for what an
agent is permitted to do and stress-tests them with matched-control experiments against live models. Sole author of
Project Simurgh, an open-source agent-authorization prototype whose October 2026 study reports a benefit on one
model and a null result on another. Evaluated Claude for exploitable code and guardrail circumvention in Anthropic's
safety-evaluation program via Alignerr. Five sole-author preprints and two coordinated vendor disclosures (Microsoft,
Apple) after seven years in security operations and engineering. Available full-time from December 2026 for a three- to
six-month San Francisco placement.

## Research & Technical Skills
- Empirical AI safety and alignment: matched-control experiment design · adversarial robustness and AI control for tool-using agents · prompt-injection and authority containment · guardrail and classifier evaluation · uncertainty reporting · host-held human-oversight state (delegation, stop, lease)
- Large language models (LLMs) and agent tooling: Claude API and Claude Code · OpenAI Responses API with tool calling · self-hosted Llama (3.2-3B, 3.3-70B) · Llama Guard 4 · AgentDojo · MCP servers
- AI security, safeguards and red-teaming: guardrail-circumvention analysis · red-team scenario design · vulnerability research and coordinated disclosure · offensive proofs of concept · intrusion detection · phishing-detection ML · incident response · MITRE ATT&CK
- Languages and systems: Python · TypeScript · C · C++17/20 · Rust · Kotlin · Lean 4 · SQL · Bash · Docker · GitHub Actions · PostgreSQL · Linux · eBPF

## Research & Open Source
### Project Simurgh — Inspectable Authorization and Containment for AI Agents (Sole Author) · May 2026 – Present
github.com/Raoof128/Project-Simurgh · 92 releases · software DOI 10.5281/zenodo.21737792
- Designed and ran a transfer study (Oct 2026): 24 tasks, two trials each, three matched controls (credential-only,
  composed, deny-all) and two models; 288 replayed branches. On Meta Llama-3.2-3B, composed host controls cut
  restricted-state trials with new effects from 17/24 to 0/24, kept 23/24 useful completions and blocked no valid
  proposal. On OpenAI gpt-6-luna the baseline was already 0/24, so the study reports no incremental protection there.
  Protocol to published package took three days (15–17 Oct 2026).
- Reported uncertainty per cluster: the 24 restricted trials fall into six states, so intervals are per state (Wilson 95%:
  43.6–97.0% versus 0.0–39.0%); part of the gap holds by construction.
- Detected and mitigated a defect in the live OpenAI integration: an eight-case Responses API workflow exposed a
  role-placement error (8/8 declined). Retained the original traces; a frozen developer-role correction completed 2/3
  authorized workflows and declined 5/5 restricted ones, with one refusal still open.
- Captured a live Llama Guard 4 12B input classifier over a 180-case set (frozen stage, 2026) and produced
  containment evidence for all 138 malicious cases it missed, 120 of them downstream injections outside an input-only
  classifier's view; a coverage claim, not a ranking of classifiers.
- Reduced a live Llama-3.3-70B agent's targeted attack success on AgentDojo from 9/140 to 0/140 over pre-
  registered injections in the workspace suite (frozen stage, 2026); the full four-suite deterministic run scored 0/949
  attack success with 949/949 unattacked utility (both scoped as small experiments).
- Built the work to be reproduced: Ed25519-signed evidence archives replay offline in one command; 39 Lean 4
  proofs sit behind a gate that fails on any unproven “sorry” placeholder; 5,171 tests passed in the 19 Oct 2026 smoke
  run.
- Audited 919 of the project's own documents and published all 141 dated findings, including overstatements in
  earlier closeouts, in the README.

### The Invisible Window — Screen-Capture Evasion in WebRTC Proctoring (Sole Author) · Feb 2026 – May 2026
github.com/Raoof128/invisible-window-research · IEEE-format preprint v2.0 · DOI 10.5281/zenodo.20376495
- Found that documented display-affinity APIs on Windows and macOS let a window stay visible on the monitor while
  contributing zero pixels to screen capture: 100% evasion of WebRTC proctoring on every platform tested, including
  macOS 26.
- Disclosed to Microsoft MSRC (Feb 2026) and Apple Product Security (Mar 2026) before publication; both classified
  the behavior as by design. Proof-of-concept code is withheld on dual-use grounds.

### Aion-BibleQA — Retrieval and Citation Faithfulness in a RAG System (Sole Author) · Jun 2026
Preprint · DOI 10.5281/zenodo.20522874
- Built and scored a 40-question benchmark for retrieval quality, citation support and false-premise robustness: R@5 of
  0.941, mean citation support of 0.978, zero unsupported citations and 6/6 false-premise refusals.

### Further Preprints and Shipped Security Tooling · 2024 – 2026
- Banking Shield (DOI 10.5281/zenodo.20675513): machine-checked proofs that privacy-sensitive values never reach
  AI-generated explanations; five-tester dry run, zero leaks.
- Simurgh device-integrity proofs (DOI 10.5281/zenodo.20374849): preprint on privacy-preserving device integrity
  proofs for high-stakes sessions.
- Student-society event pilot (DOI 10.5281/zenodo.20549736): 31 consented sessions; ballot choices excluded from
  records; HMAC-chained audit logs.
- Mehr Guard: offline QR and URL phishing scanner in Kotlin Multiplatform; ensemble ML plus 25 heuristics at 87% F1
  and under 5 ms, 19-scenario red-team mode.
- Systems work (Rust, C++): SentinelSSH, a Rust MCP server that gives AI agents policy-scoped, read-only
  inspection of Linux hosts through 17 typed tools and no shell; SentinelFlow, C++17 intrusion detection (500,000+
  packets/sec, synthetic single-thread benchmark); Project Zurvan, local-first knowledge engine serving claims and
  decisions to agents over MCP (218 tests).

## Professional Experience
### AI Safety Evaluator (Claude) — Alignerr · Jan 2026 – Mar 2026
Anthropic safety-evaluation program · Remote
- Stress-tested Claude's safety guardrails: assessed outputs for exploitable code and harmful patterns, analyzed
  circumvention methods, and delivered rubric-based findings.

### Cofounder — Syllabus-Sync · May 2026 – Present
Macquarie University Incubator startup · Sydney · syllabus-sync.app
- Led the security backend (WebAuthn passkeys, TOTP MFA, Postgres row-level security, tamper-resistant audit
  logging) of a shared Next.js/TypeScript codebase that converts university syllabi into structured data; 503 tests across
  92 files.

### Security Engineer & Full-Stack Developer — Self-Employed (Freelance) · Jan 2024 – Present
Sydney
- Delivered secure web applications for commercial clients with OWASP Top 10 controls and OAuth 2.0; 5.0-star rating
  across 31 Airtasker reviews.

### IT Manager & Security Operations — Iran Pharmacy · Aug 2019 – Jan 2024
50+ staff · Iran
- Investigated unauthorized-access incidents, built automated detection workflows that cut manual triage by about 30%,
  and enforced least-privilege access.

## Education
- Bachelor of Cyber Security — Macquarie University, Sydney · Expected Jun 2027
  Final session Feb–Jun 2027 is fully online · Coursework: Natural Language Processing & Machine Learning
- Diploma of Information Technology — Macquarie University · 2023 – 2024

## Certifications & Credentials
- Anthropic (Jul 2026), 20 courses including: Building with the Claude API · Claude Code in Action · Model Context
  Protocol
- Macquarie University micro-credentials (2026, 93–100%): Security of AI · Application of AI · Data Security &
  Information Privacy · DevSecOps · Identity & Access Management

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
