import { projects, writeups, labExperiments } from "@/lib/data";
import { certifications } from "@/lib/certifications";
import en from "@/i18n/locales/en";
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

// The résumé block is generated from the same English strings the /resume page
// renders, so this file cannot drift from the page or from the PDF it mirrors.
function resumeBlock(): string {
  const r = en.resume;
  const bullets = (...items: string[]) => items.map((item) => `- ${item}`);
  return [
    `## ${r.summary_heading}`,
    r.summary,
    "",
    `## ${r.s03_heading}`,
    ...bullets(
      `${r.skill1_label} ${r.skill1_desc}`,
      `${r.skill2_label} ${r.skill2_desc}`,
      `${r.skill3_label} ${r.skill3_desc}`,
      `${r.skill4_label} ${r.skill4_desc}`,
    ),
    "",
    `## ${r.research_heading}`,
    `### ${r.simurgh_title} · ${r.simurgh_period}`,
    r.simurgh_meta,
    ...bullets(
      r.simurgh_b1,
      r.simurgh_b2,
      r.simurgh_b3,
      r.simurgh_b4,
      r.simurgh_b5,
      r.simurgh_b6,
      r.simurgh_b7,
    ),
    "",
    `### ${r.iw_title} · ${r.iw_period}`,
    r.iw_meta,
    ...bullets(r.iw_b1, r.iw_b2),
    "",
    `### ${r.aion_title} · ${r.aion_period}`,
    r.aion_meta,
    ...bullets(r.aion_b1),
    "",
    `### ${r.further_title} · ${r.further_period}`,
    ...bullets(
      r.further_b1,
      r.further_b2,
      r.further_b3,
      r.further_b4,
      r.further_b5,
    ),
    "",
    `## ${r.s06_heading}`,
    `### ${r.alignerr_title} · ${r.alignerr_period}`,
    r.alignerr_meta,
    ...bullets(r.alignerr_b1),
    "",
    `### ${r.syllabus_title} · ${r.syllabus_period}`,
    r.syllabus_meta,
    ...bullets(r.syllabus_b1),
    "",
    `### ${r.freelance_title} · ${r.freelance_period}`,
    r.freelance_meta,
    ...bullets(r.freelance_b1),
    "",
    `### ${r.pharmacy_title} · ${r.pharmacy_period}`,
    r.pharmacy_meta,
    ...bullets(r.pharmacy_b1),
    "",
    `## ${r.education_heading}`,
    `- ${r.edu1_title} · ${r.edu1_period}`,
    `  ${r.edu1_meta}`,
    `- ${r.edu2_title} · ${r.edu2_period}`,
    "",
    `## ${r.certs_heading}`,
    ...bullets(r.cert1, r.cert2),
    "",
  ].join("\n");
}

// Static identity prose. Everything below it is generated from the data modules
// so the corpus stays in sync with the site automatically.
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

${resumeBlock()}
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
        ? `Repo (public record only; the source is private, contact the author to request access): ${p.links.repo}`
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
