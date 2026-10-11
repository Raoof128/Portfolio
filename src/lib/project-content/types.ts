import type { Locale } from "@/i18n";
import type { Project, ProjectPaper } from "../data";

export const projectSlugs = [
  "invisible-window-research",
  "project-simurgh",
  "project-zurvan",
  "gitswitch",
  "mehr-guard",
  "syllabus-sync",
  "divan-open-day",
  "nexus-archive",
  "nanomatch",
  "sentinelflow",
  "ecrsm",
  "simurghforge",
  "aion",
] as const;

export type ProjectSlug = (typeof projectSlugs)[number];
export type ProjectContentTranslation = {
  title?: string;
  description: string;
  fullDescription: string;
  problem: string;
  solution: string[];
  proof: string[];
  features: string[];
  measures: string[];
  /** Only stacks with explanatory prose need an override; names stay verbatim. */
  stack?: string[];
  /** Official publication titles/citations and identifiers remain verbatim. */
  papers?: Pick<ProjectPaper, "label" | "status" | "description">[];
};
export type ProjectTranslations = Record<
  ProjectSlug,
  ProjectContentTranslation
>;
export type LocalizedProject = Project & {
  contentLocale: Locale;
  titleLocale: Locale;
};

export interface ProjectDiagramCopy {
  boundariesTitle: string;
  boundaries: [string, string][];
  signedPack: string;
  verifier: string;
  containmentNote: string;
  captureTitle: string;
  desktop: string;
  excludedWindow: string;
  visibleToPerson: string;
  physicalDisplay: string;
  omittedWindow: string;
  capturePipeline: string;
  capturedFrame: string;
  captureNote: string;
  provenanceTitle: string;
  stages: [string, string][];
  provenanceNote: string;
  stackTitle: string;
}
