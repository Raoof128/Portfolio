import type { Locale } from "@/i18n";
import type { Project } from "./data";
import { faProjects } from "./project-content/fa";
import { arProjects } from "./project-content/ar";
import { zhProjects } from "./project-content/zh";
import { esProjects } from "./project-content/es";
import { projectDiagramCopy } from "./project-content/diagram-copy";
import { localizeProjectTerm } from "./project-content/terms";
import type {
  LocalizedProject,
  ProjectSlug,
  ProjectTranslations,
} from "./project-content/types";

const translations: Record<Exclude<Locale, "en">, ProjectTranslations> = {
  fa: faProjects,
  ar: arProjects,
  zh: zhProjects,
  es: esProjects,
};

/** Server-page adapter. Clients receive one dossier, never this registry. */
export function getLocalizedProject(
  project: Project,
  locale: Locale,
): LocalizedProject {
  if (locale === "en")
    return {
      ...project,
      localizedDescription: undefined,
      localizedFullDescription: undefined,
      contentLocale: "en",
      titleLocale: "en",
    };
  const dictionary = translations[locale];
  if (!Object.hasOwn(dictionary, project.slug))
    throw new Error(`Missing project translation: ${locale}/${project.slug}`);
  const content = dictionary[project.slug as ProjectSlug];
  if (project.papers && content.papers?.length !== project.papers.length)
    throw new Error(`Missing paper translation: ${locale}/${project.slug}`);
  return {
    ...project,
    title: content.title ?? project.title,
    titleLocale: content.title ? locale : "en",
    contentLocale: locale,
    description: content.description,
    fullDescription: content.fullDescription,
    localizedDescription: undefined,
    localizedFullDescription: undefined,
    tags: project.tags.map((term) => localizeProjectTerm(term, locale)),
    problem: content.problem,
    solution: content.solution,
    proof: content.proof,
    build: {
      stack: content.stack ?? project.build.stack,
      features: content.features,
    },
    secure: { measures: content.measures },
    papers: project.papers?.map((paper, index) => ({
      ...paper,
      ...content.papers?.[index],
    })),
  };
}

export function getLocalizedProjectTitle(
  project: Project,
  locale: Locale,
): string {
  return getLocalizedProject(project, locale).title;
}

export function getProjectDiagramCopy(locale: Locale) {
  return projectDiagramCopy[locale];
}

export type {
  LocalizedProject,
  ProjectDiagramCopy,
} from "./project-content/types";
