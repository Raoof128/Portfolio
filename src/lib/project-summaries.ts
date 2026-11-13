import type { Locale } from "@/i18n";
import { projects, type Project } from "./data";
import { getLocalizedProject } from "./project-localization";

export interface ProjectSummary {
  slug: string;
  title: string;
  titleLocale: Locale;
  searchTitle?: string;
  category: Project["category"];
  year: string;
  description: string;
  descriptionLocale: Locale;
  tags: string[];
}

/** Called by server pages; client explorers import only the summary type. */
export function buildProjectSummaries(locale: Locale): ProjectSummary[] {
  const summaries = Object.values(projects).map((source) => {
    const project = getLocalizedProject(source, locale);
    return {
      slug: project.slug,
      title: project.title,
      titleLocale: project.titleLocale,
      searchTitle: source.title === project.title ? undefined : source.title,
      category: project.category,
      year: project.year,
      description: project.description,
      descriptionLocale: locale,
      tags: [...project.tags],
    };
  });

  // The explorer has an editorial order independent of site-wide search ranking.
  const formaIndex = summaries.findIndex((project) => project.slug === "forma");
  const zurvanIndex = summaries.findIndex((project) => project.slug === "project-zurvan");
  if (formaIndex !== -1 && zurvanIndex !== -1) {
    const [forma] = summaries.splice(formaIndex, 1);
    const position = summaries.findIndex((project) => project.slug === "project-zurvan");
    summaries.splice(position + 1, 0, forma);
  }
  return summaries;
}
