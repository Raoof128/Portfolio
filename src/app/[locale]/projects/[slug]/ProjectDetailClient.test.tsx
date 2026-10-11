import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { getDictionary, type Locale } from "@/i18n";
import { I18nProvider } from "@/i18n/provider";
import { CONTACT_EMAIL_GMAIL } from "@/lib/constants";
import { projects } from "@/lib/data";
import {
  getLocalizedProject,
  getProjectDiagramCopy,
} from "@/lib/project-localization";
import { ProjectDetailClient } from "./ProjectDetailClient";

vi.mock("@/components/os/ProjectExplorer", () => ({
  ProjectExplorer: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("@/components/os/ProjectMotion", () => ({ ProjectMotion: () => null }));
vi.mock("@/components/os/ProjectDiagram", () => ({
  ProjectDiagram: () => null,
}));
afterEach(cleanup);

describe("project source availability", () => {
  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "labels private source honestly and provides an email request in %s",
    async (locale) => {
      const dictionary = await getDictionary(locale);
      const project = getLocalizedProject(projects["project-zurvan"], locale);
      render(
        <I18nProvider locale={locale} dictionary={dictionary}>
          <ProjectDetailClient
            project={project}
            slug={project.slug}
            summaries={[]}
            diagramCopy={getProjectDiagramCopy(locale)}
            evidenceStory={null}
          />
        </I18nProvider>,
      );
      expect(
        screen.getByText(dictionary.project_detail.private_source_note),
      ).toBeInTheDocument();
      const link = screen.getByRole("link", {
        name: dictionary.project_detail.request_source,
      });
      const href = link.getAttribute("href")!;
      expect(href.startsWith(`mailto:${CONTACT_EMAIL_GMAIL}?subject=`)).toBe(
        true,
      );
      expect(decodeURIComponent(href.split("subject=")[1])).toBe(
        `${dictionary.project_detail.request_source}: Project Zurvan`,
      );
      expect(
        screen.queryByRole("link", {
          name: dictionary.project_detail.source_code,
        }),
      ).not.toBeInTheDocument();
      expect(
        document.querySelector(`a[href="${project.links.repo}"]`),
      ).toBeNull();
    },
  );

  it("retains ordinary public-source links", async () => {
    const dictionary = await getDictionary("en");
    const project = getLocalizedProject(projects.gitswitch, "en");
    render(
      <I18nProvider locale="en" dictionary={dictionary}>
        <ProjectDetailClient
          project={project}
          slug={project.slug}
          summaries={[]}
          diagramCopy={getProjectDiagramCopy("en")}
          evidenceStory={null}
        />
      </I18nProvider>,
    );
    expect(
      screen.getByRole("link", { name: dictionary.project_detail.source_code }),
    ).toHaveAttribute("href", project.links.repo);
    expect(
      screen.queryByText(dictionary.project_detail.private_source_note),
    ).not.toBeInTheDocument();
  });
});
