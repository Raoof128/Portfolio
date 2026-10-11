import { OSApplicationBridge } from "@/components/os/OSApplicationBridge";
import { ProjectExplorer } from "@/components/os/ProjectExplorer";
import { resolveLocale, type Locale } from "@/i18n";
import { buildProjectSummaries } from "@/lib/project-summaries";

export default async function ProjectsArchive({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  return (
    <OSApplicationBridge locale={locale as Locale} route="/projects">
      <ProjectExplorer summaries={buildProjectSummaries(locale)} />
    </OSApplicationBridge>
  );
}
