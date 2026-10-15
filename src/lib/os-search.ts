import type { Locale } from "@/i18n";
import { getLocalizedPath } from "@/i18n/navigation";
import { getOSCopy } from "@/components/os/os-copy";
import { labExperiments, projects, writeups } from "@/lib/data";
import { getLocalizedProject } from "@/lib/project-localization";
import { getLocalizedWriteups } from "@/lib/localized-writing";
import { getLocalizedLabs } from "@/lib/localized-labs";
import type { SearchEntry } from "./os-search-query";
import { getResumeSectionCopy } from "./resume-section-copy";

export { searchEntries } from "./os-search-query";
export type { SearchEntry, SearchKind } from "./os-search-query";

/** Build on the server; only these short public summaries belong in the client index. */
export function buildSearchEntries(locale: Locale): SearchEntry[] {
  const copy = getOSCopy(locale);
  const resumeSections = getResumeSectionCopy(locale);
  const entries: SearchEntry[] = [];
  const path = (pathname: string) => getLocalizedPath(pathname, locale);

  for (const sourceProject of Object.values(projects)) {
    const project = getLocalizedProject(sourceProject, locale);
    entries.push({
      id: `project:${project.slug}`,
      title: project.title,
      description: project.description,
      href: path(`/projects/${project.slug}`),
      kind: "project",
      titleLocale: project.titleLocale,
      descriptionLocale: project.contentLocale,
      ...(project.title !== sourceProject.title
        ? { aliases: [sourceProject.title] }
        : {}),
    });
    for (const [index, paper] of (project.papers ?? []).entries()) {
      entries.push({
        id: `paper:${project.slug}:${index}`,
        title: paper.title,
        description: [project.title, paper.description, paper.venue, paper.year]
          .filter(Boolean)
          .join(" · "),
        // Downloads are root assets, not localized pages. Preserve their source URLs.
        href: paper.href,
        kind: "paper",
        titleLocale: "en",
        descriptionLocale: locale,
      });
    }
  }

  entries.push(
    ...getLocalizedWriteups(locale).map((writeup, index): SearchEntry => ({
      id: `writing:${writeup.slug}`,
      title: writeup.title,
      description: writeup.takeaway,
      href: path(`/write-ups/${writeup.slug}`),
      kind: "writing",
      titleLocale: locale,
      descriptionLocale: locale,
      ...(locale !== "en" ? { aliases: [writeups[index].title] } : {}),
    })),
    ...getLocalizedLabs(locale).map((experiment, index): SearchEntry => ({
      id: `experiment:${experiment.id}`,
      title: experiment.title,
      description: experiment.description,
      href: path(`/lab/${experiment.id}`),
      kind: "experiment",
      titleLocale: locale,
      descriptionLocale: locale,
      ...(locale !== "en" ? { aliases: [labExperiments[index].title] } : {}),
    })),
  );

  const actions = [
    ["projects", copy.projects, copy.appProjects, path("/projects")],
    ["research", copy.research, copy.appResearch, path("/write-ups")],
    [
      "publications",
      copy.papers,
      copy.appResearch,
      `${path("/write-ups")}#research-publications`,
    ],
    ["about", copy.about, copy.appAbout, path("/about")],
    ["resume", copy.resume, copy.appResume, path("/resume")],
    [
      "skills",
      resumeSections.skills,
      copy.appResume,
      `${path("/resume")}#skills`,
    ],
    [
      "experience",
      resumeSections.experience,
      copy.appResume,
      `${path("/resume")}#experience`,
    ],
    [
      "certifications",
      resumeSections.certifications,
      copy.appResume,
      `${path("/resume")}#certifications`,
    ],
    ["contact", copy.contact, copy.appContact, path("/contact")],
    ["lab", copy.experiments, copy.appResearch, path("/lab")],
    ["security", copy.securityPolicy, copy.evidence, path("/security-policy")],
    ["recognition", copy.hallOfFame, copy.about, path("/hall-of-fame")],
    [
      "resume-pdf",
      copy.downloadResume,
      copy.appResume,
      "/Mohammad_Raouf_Abedini_Resume.pdf",
    ],
  ];
  entries.push(
    ...actions.map(([id, title, description, href]): SearchEntry => ({
      id: `action:${id}`,
      title,
      description,
      href,
      kind: "action",
      titleLocale: locale,
      descriptionLocale: locale,
      ...(id === "publications"
        ? { aliases: ["Research publications", "Publications"] }
        : {}),
    })),
  );
  return entries;
}
