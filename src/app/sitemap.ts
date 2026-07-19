import { MetadataRoute } from "next";
import { projects, writeups, labExperiments } from "@/lib/data";
import { SITE_URL, SITE_LAST_MODIFIED } from "@/lib/constants";

export const dynamic = "force-static";

// Non-English locale prefixes (English is served at the clean root path).
const LOCALE_PREFIXES = ["/fa", "/ar", "/zh", "/es"] as const;

// Controlled site-level revision date — NOT `new Date()`. Using build time made
// every page look freshly updated on every deploy; a fixed content date keeps
// `lastModified` honest. Write-ups carry their own publication dates; projects
// may override via `project.updatedAt`.
const SITE_DATE = new Date(SITE_LAST_MODIFIED);

// Every canonical public route, per locale. Order is deterministic.
const STATIC_ROUTES = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.8 },
  { path: "/lab", changeFrequency: "monthly", priority: 0.7 },
  { path: "/write-ups", changeFrequency: "weekly", priority: 0.7 },
  { path: "/resume", changeFrequency: "monthly", priority: 0.5 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/security-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/hall-of-fame", changeFrequency: "yearly", priority: 0.3 },
] as const;

// hreflang alternates for a locale-agnostic path: clean English + every locale
// prefix + `x-default` (Google's neutral selector → clean English).
function alternatesFor(path: string) {
  const en = `${SITE_URL}${path || "/"}`;
  return {
    languages: {
      en,
      ...Object.fromEntries(
        LOCALE_PREFIXES.map((p) => [p.slice(1), `${SITE_URL}${p}${path}`]),
      ),
      "x-default": en,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const pushLocalized = (
    path: string,
    lastModified: Date,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: number,
  ) => {
    // Canonical English (clean path) carries the hreflang alternates.
    entries.push({
      url: `${SITE_URL}${path || "/"}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: alternatesFor(path),
    });
    // One entry per non-English locale — each carries the SAME full alternate
    // cluster (Google requires reciprocal, self-inclusive hreflang on every
    // member of the set, not just the English canonical).
    for (const prefix of LOCALE_PREFIXES) {
      entries.push({
        url: `${SITE_URL}${prefix}${path}`,
        lastModified,
        changeFrequency,
        priority: Math.round(priority * 0.9 * 100) / 100,
        alternates: alternatesFor(path),
      });
    }
  };

  // Static routes (home, projects, lab, write-ups, resume, about, contact,
  // security-policy, hall-of-fame).
  for (const { path, changeFrequency, priority } of STATIC_ROUTES) {
    pushLocalized(path, SITE_DATE, changeFrequency, priority);
  }

  // Project detail pages.
  for (const project of Object.values(projects)) {
    const lastModified = project.updatedAt
      ? new Date(project.updatedAt)
      : SITE_DATE;
    pushLocalized(`/projects/${project.slug}`, lastModified, "monthly", 0.8);
  }

  // Lab experiment detail pages.
  for (const exp of labExperiments) {
    pushLocalized(`/lab/${exp.id}`, SITE_DATE, "monthly", 0.6);
  }

  // Write-up detail pages (real publication dates).
  for (const post of writeups) {
    pushLocalized(
      `/write-ups/${post.slug}`,
      new Date(post.date),
      "monthly",
      0.7,
    );
  }

  return entries;
}
