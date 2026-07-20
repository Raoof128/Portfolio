export const BASE_PATH = "";
export const SITE_ORIGIN = "https://raoufabedini.dev";
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;
export const SITE_NAME = "Mohammad Raouf Abedini — AI Security Researcher";

export const CONTACT_EMAIL = "raoof.r999@outlook.com";
export const CONTACT_EMAIL_GMAIL = "raoof.r12@gmail.com";
export const GITHUB_URL = "https://github.com/Raoof128";
export const LINKEDIN_URL =
  "https://linkedin.com/in/mohammad-raouf-abedini-885a9226a";
export const TWITTER_URL = "https://x.com/Raoofr12";
export const ORCID_URL = "https://orcid.org/0009-0000-6214-258X";

// Bump on meaningful content updates — surfaced as schema.org dateModified so
// AI/answer engines (Perplexity etc.) see the site as recently maintained.
// Kept static (not `new Date()`) to avoid client/server hydration mismatch.
export const SITE_LAST_MODIFIED = "2026-07-20";

// Backward-compatible alias used by legacy imports.
export const basePath = BASE_PATH;
