import type { Locale } from "@/i18n";
import { getLocalizedPath } from "@/i18n/navigation";
import { projects, type ProjectPaper } from "./data";
import { getLocalizedProject } from "./project-localization";

/** Public server-derived summaries, without the full project narrative/artwork. */
export interface PublicationSummary {
  id: string;
  title: string;
  titleLocale: "en";
  description?: string;
  descriptionLocale: Locale;
  label: string;
  status?: string;
  venue?: string;
  year?: string;
  doi?: string;
  href: string;
  kind: ProjectPaper["kind"];
  projectSlug: string;
  projectTitle: string;
  projectTitleLocale: Locale;
  projectHref: string;
}

/** Used by server pages; clients import only the erased summary type. */
export function getPublicationSummaries(locale: Locale): PublicationSummary[] {
  return Object.values(projects).flatMap((sourceProject) => {
    if (!sourceProject.papers?.length) return [];
    const project = getLocalizedProject(sourceProject, locale);
    return sourceProject.papers.map((paper, index) => {
      const localizedPaper = project.papers?.[index];
      if (!localizedPaper)
        throw new Error(
          `Missing publication: ${locale}/${sourceProject.slug}/${index}`,
        );
      return {
        id: `paper:${sourceProject.slug}:${index}`,
        // Publication identity and links always come from the original record.
        // The locale adapter supplies descriptive prose and interface metadata.
        title: paper.title,
        titleLocale: "en" as const,
        description: localizedPaper.description,
        descriptionLocale: locale,
        label: localizedPaper.label,
        status: localizedPaper.status,
        venue: paper.venue,
        year: paper.year,
        doi: paper.doi,
        href: paper.href,
        kind: paper.kind,
        projectSlug: sourceProject.slug,
        projectTitle: project.title,
        projectTitleLocale: project.titleLocale,
        projectHref: getLocalizedPath(
          `/projects/${sourceProject.slug}`,
          locale,
        ),
      };
    });
  });
}

const sourceLanguageNotes: Record<Locale, string> = {
  en: "Original titles and PDFs are in English.",
  fa: "عنوان‌های اصلی و فایل‌های PDF به زبان انگلیسی هستند.",
  ar: "العناوين الأصلية وملفات PDF باللغة الإنجليزية.",
  zh: "原始标题与 PDF 文件为英文。",
  es: "Los títulos originales y los archivos PDF están en inglés.",
};

export function getPublicationSourceLanguageNote(locale: Locale): string {
  return sourceLanguageNotes[locale];
}
