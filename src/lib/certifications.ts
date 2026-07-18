// Licenses & certifications shown on the résumé page.
// Names / issuers / credential IDs / grades are locale-invariant data
// (only the section heading and field labels are translated, in the resume dictionary).

export interface Certification {
  name: string;
  issuer: string;
  issued: string; // e.g. "Jul 2026"
  credentialId: string;
  grade?: string; // e.g. "99.20%"
}

export const certifications: Certification[] = [
  // ── Anthropic ──
  {
    name: "AI Fluency for Students",
    issuer: "Anthropic",
    issued: "Jul 2026",
    credentialId: "acmpujtbn2xu",
  },
  {
    name: "AI Fluency for Educators",
    issuer: "Anthropic",
    issued: "Jul 2026",
    credentialId: "7x8msbzn49rt",
  },
  {
    name: "Introduction to Model Context Protocol",
    issuer: "Anthropic",
    issued: "Jul 2026",
    credentialId: "yhi68u4mqt5x",
  },
  {
    name: "Building with the Claude API",
    issuer: "Anthropic",
    issued: "Jul 2026",
    credentialId: "juoae2qtmggo",
  },
  {
    name: "AI Fluency: Framework & Foundations",
    issuer: "Anthropic",
    issued: "Jul 2026",
    credentialId: "645j7by2uo75",
  },
  {
    name: "Claude Code in Action",
    issuer: "Anthropic",
    issued: "Jul 2026",
    credentialId: "7kfqpyogooec",
  },
  {
    name: "Introduction to Claude Cowork",
    issuer: "Anthropic",
    issued: "Jul 2026",
    credentialId: "bsqfvrbkpv2s",
  },
  {
    name: "Claude Platform 101",
    issuer: "Anthropic",
    issued: "Jul 2026",
    credentialId: "q8dcrer7o2pa",
  },
  {
    name: "Claude Code 101",
    issuer: "Anthropic",
    issued: "Jul 2026",
    credentialId: "oyf4ic48wnd5",
  },
  {
    name: "Claude 101",
    issuer: "Anthropic",
    issued: "Jul 2026",
    credentialId: "hyagrxaidsbe",
  },
  // ── Macquarie University ──
  {
    name: "Cyber Security: GRC Part 2 — Risk Management and Compliance",
    issuer: "Macquarie University",
    issued: "Jun 2026",
    credentialId: "JL4SAS9JOR8C",
    grade: "99.20%",
  },
  {
    name: "Cyber Security: GRC Part 1 — Governance",
    issuer: "Macquarie University",
    issued: "Jun 2026",
    credentialId: "3G4JP3GKROWQ",
    grade: "95%",
  },
  {
    name: "Cyber Security: Mobile Security",
    issuer: "Macquarie University",
    issued: "Jun 2026",
    credentialId: "W7FRQ19BPTNM",
    grade: "99.28%",
  },
  {
    name: "Cyber Security: Applied Cryptography",
    issuer: "Macquarie University",
    issued: "Jun 2026",
    credentialId: "OVVCSLEB8ATT",
    grade: "98.56%",
  },
  {
    name: "Cyber Security: Data Security and Information Privacy",
    issuer: "Macquarie University",
    issued: "Jun 2026",
    credentialId: "K54QIRP9VVE9",
    grade: "97.84%",
  },
  {
    name: "Cyber Security: Digital Forensics",
    issuer: "Macquarie University",
    issued: "Jun 2026",
    credentialId: "YX5P82YME6FQ",
    grade: "95%",
  },
  {
    name: "Cyber Security: Identity Access Management and Authentication",
    issuer: "Macquarie University",
    issued: "Jun 2026",
    credentialId: "P1RJQUGSCM59",
    grade: "100%",
  },
  {
    name: "Cyber Security: DevSecOps",
    issuer: "Macquarie University",
    issued: "Jun 2026",
    credentialId: "GJEBDPIA0A6P",
    grade: "99.10%",
  },
  {
    name: "Cyber Security: Application of AI",
    issuer: "Macquarie University",
    issued: "Jun 2026",
    credentialId: "U2KSU5H0O0BV",
    grade: "99.20%",
  },
  {
    name: "Cyber Security: Security of AI",
    issuer: "Macquarie University",
    issued: "May 2026",
    credentialId: "DNZVZ3A7RVR1",
    grade: "95.50%",
  },
  {
    name: "Cyber Security: Essentials for Managers and Leaders",
    issuer: "Macquarie University",
    issued: "May 2026",
    credentialId: "LOBWM8KXGSZS",
    grade: "99.40%",
  },
  {
    name: "Cyber Security: Essentials for Workplace",
    issuer: "Macquarie University",
    issued: "May 2026",
    credentialId: "QT8ZBJIJ2HHO",
    grade: "92.80%",
  },
  {
    name: "Cyber Security: Essentials",
    issuer: "Macquarie University",
    issued: "May 2026",
    credentialId: "RNALWEYYSXO7",
    grade: "96%",
  },
];
