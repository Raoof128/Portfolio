import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { getDictionary, type Locale } from "@/i18n";
import { I18nProvider } from "@/i18n/provider";
import { CONTACT_EMAIL_GMAIL } from "@/lib/constants";
import { projects, type ProjectPaper } from "@/lib/data";
import {
  getLocalizedProject,
  getProjectDiagramCopy,
} from "@/lib/project-localization";
import { ProjectDetailClient } from "./ProjectDetailClient";
import {
  dossierCopy,
  getDossierScope,
} from "@/lib/project-content/dossier-copy";

vi.mock("@/components/os/ProjectExplorer", () => ({
  ProjectExplorer: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("@/components/os/ProjectMotion", () => ({ ProjectMotion: () => null }));
vi.mock("@/components/os/ProjectDiagram", () => ({
  ProjectDiagram: () => <div data-testid="project-diagram" />,
}));
afterEach(() => {
  cleanup();
  // Each dossier starts from its own URL, even if an earlier assertion failed.
  window.history.replaceState(null, "", "/");
});

describe("project source availability", () => {
  it("waits for the section commit before focusing when an animation frame arrives early", async () => {
    window.history.replaceState(null, "", "/");
    const dictionary = await getDictionary("en");
    const project = getLocalizedProject(projects["project-simurgh"], "en");
    const frame = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });
    const cancel = vi
      .spyOn(window, "cancelAnimationFrame")
      .mockImplementation(() => {});
    try {
      const { container } = render(
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
      const target = container.querySelector("#methods")!;
      expect(target).not.toBeVisible();
      window.history.replaceState(null, "", "/#methods");
      fireEvent(window, new HashChangeEvent("hashchange"));
      expect(target).toBeVisible();
      expect(target).toHaveFocus();
      const methodsTab = container.querySelector<HTMLElement>(
        '[role="tab"][aria-controls="methods"]',
      )!;
      methodsTab.focus();
      const tablist = screen.getByRole("tablist");
      fireEvent.keyDown(tablist, { key: "ArrowLeft" });
      expect(
        container.querySelector('[role="tab"][aria-controls="evidence"]'),
      ).toHaveFocus();
      fireEvent.keyDown(tablist, { key: "ArrowRight" });
      expect(methodsTab).toHaveFocus();
    } finally {
      frame.mockRestore();
      cancel.mockRestore();
      window.history.replaceState(null, "", "/");
    }
  });

  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "distinguishes current Simurgh software from the earlier source papers in %s",
    async (locale) => {
      const dictionary = await getDictionary(locale);
      const project = getLocalizedProject(projects["project-simurgh"], locale);
      const { container } = render(
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
      const resources = screen.getByRole("group", {
        name: dictionary.project_detail.project_links,
      });
      const primary = within(resources).getByRole("link", {
        name: dictionary.project_detail.source_code,
      });
      expect(primary).toHaveAttribute(
        "href",
        "https://github.com/Raoof128/Project-Simurgh",
      );
      expect(primary).toHaveClass("os-button");
      expect(resources.querySelectorAll("a.os-button")).toHaveLength(1);
      expect(
        within(resources).getByRole("link", {
          name: dictionary.project_detail.software_doi_record,
        }),
      ).toHaveAttribute("href", "https://doi.org/10.5281/zenodo.21737792");
      expect(
        within(resources).queryByRole("link", {
          name: dictionary.project_detail.download_paper,
        }),
      ).not.toBeInTheDocument();
      expect(
        resources.querySelector('a[href="/Project_Simurgh_Preprint_v1.0.pdf"]'),
      ).toBeNull();
      expect(
        resources.querySelector(
          'a[href="https://doi.org/10.5281/zenodo.20374849"]',
        ),
      ).toBeNull();

      fireEvent.click(
        container.querySelector('[role="tab"][aria-controls="evidence"]')!,
      );
      const library = container.querySelector(".os-project-paper-library")!;
      expect(library).toBeVisible();
      expect(library.querySelectorAll("article")).toHaveLength(3);
      expect(
        within(library as HTMLElement).getByText(project.papers![0].label),
      ).toBeVisible();
      expect(
        library.querySelector('a[href="/Project_Simurgh_Preprint_v1.0.pdf"]'),
      ).toBeVisible();
      expect(
        library.querySelector(
          'a[href="https://doi.org/10.5281/zenodo.20374849"]',
        ),
      ).toBeVisible();
      expect(container.querySelector(".os-project-citation")).toHaveTextContent(
        project.citation!,
      );
    },
  );

  it("keeps the publication DOI label when no software kind is supplied", async () => {
    const dictionary = await getDictionary("en");
    const base = getLocalizedProject(
      projects["invisible-window-research"],
      "en",
    );
    const project = {
      ...base,
      links: { ...base.links, doi: "https://doi.org/10.5281/zenodo.20376495" },
    };
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
    const resources = screen.getByRole("group", {
      name: dictionary.project_detail.project_links,
    });
    expect(
      within(resources).getByRole("link", {
        name: dictionary.project_detail.doi_record,
      }),
    ).toHaveAttribute("href", project.links.doi);
    expect(
      within(resources).queryByRole("link", {
        name: dictionary.project_detail.software_doi_record,
      }),
    ).not.toBeInTheDocument();
  });

  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "moves focus into direct section fragments in %s",
    async (locale) => {
      window.history.replaceState(null, "", "/");
      const dictionary = await getDictionary(locale);
      const project = getLocalizedProject(projects["project-simurgh"], locale);
      const { container } = render(
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
      try {
        for (const [id, section] of [
          ["methods", "methods"],
          ["methods-heading", "methods"],
          ["research-papers", "evidence"],
          ["evidence", "evidence"],
          ["overview", "overview"],
        ]) {
          window.history.replaceState(null, "", `/#${id}`);
          fireEvent(window, new HashChangeEvent("hashchange"));
          const target = container.querySelector(`#${id}`)!;
          await waitFor(() => expect(target).toHaveFocus());
          expect(target).toBeVisible();
          expect(target).toHaveAttribute("tabindex", "-1");
          expect(
            container.querySelector(`[data-dossier-section="${section}"]`),
          ).not.toHaveAttribute("hidden");
        }
      } finally {
        window.history.replaceState(null, "", "/");
      }
    },
  );

  it("preserves the current reading tab and focus when opening anchors in another context", async () => {
    window.history.replaceState(null, "", "/");
    const dictionary = await getDictionary("en");
    const project = getLocalizedProject(projects["project-simurgh"], "en");
    const readerCopy = dossierCopy.en;
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
    const backgroundClicks = [
      { ctrlKey: true },
      { metaKey: true },
      { shiftKey: true },
      { altKey: true },
      { button: 1 },
    ];
    const openElsewhere = async (link: HTMLElement) => {
      link.focus();
      for (const init of backgroundClicks) {
        // JSDOM has no tabs. Suppress its same-page default after React handles the
        // event, modelling a browser that sends this navigation to another context.
        document.addEventListener("click", (event) => event.preventDefault(), {
          once: true,
        });
        fireEvent.click(link, init);
        await new Promise<void>((resolve) =>
          window.requestAnimationFrame(() => resolve()),
        );
        expect(link).toHaveFocus();
      }
    };
    const limitsLink = screen.getByRole("link", {
      name: readerCopy.limitations,
    });
    await openElsewhere(limitsLink);
    expect(
      screen.getByRole("heading", { name: dictionary.project_detail.problem }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: readerCopy.limitations }),
    ).not.toBeInTheDocument();

    fireEvent.click(limitsLink);
    const limits = screen.getByRole("heading", {
      name: readerCopy.limitations,
    });
    await waitFor(() => expect(limits).toHaveFocus());
    const summary = screen.getByRole("link", { name: readerCopy.htmlSummary });
    await openElsewhere(summary);
    expect(limits).toBeVisible();
    expect(
      screen.queryByRole("heading", {
        name: dictionary.project_detail.problem,
      }),
    ).not.toBeInTheDocument();

    fireEvent.click(summary);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", {
          name: dictionary.project_detail.problem,
        }),
      ).toHaveFocus(),
    );
  });

  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "opens the scoped reading path and HTML summary in %s",
    async (locale) => {
      const dictionary = await getDictionary(locale);
      const project = getLocalizedProject(projects["project-simurgh"], locale);
      const readerCopy = dossierCopy[locale];
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
      const problem = screen.getByRole("heading", {
        name: dictionary.project_detail.problem,
      });
      expect(
        problem.compareDocumentPosition(screen.getByTestId("project-diagram")) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      const limitsLink = screen.getByRole("link", {
        name: readerCopy.limitations,
      });
      fireEvent.click(limitsLink);
      const limits = screen.getByRole("heading", {
        name: readerCopy.limitations,
      });
      expect(limits).toBeVisible();
      expect(
        screen.getByText(getDossierScope(project.slug, locale)!),
      ).toBeVisible();
      await waitFor(() => expect(limits).toHaveFocus());
      expect(screen.getByText(readerCopy.pdfNote)).toBeVisible();
      fireEvent.click(
        screen.getByRole("link", { name: readerCopy.htmlSummary }),
      );
      expect(
        screen.getByRole("heading", {
          name: dictionary.project_detail.problem,
        }),
      ).toBeVisible();
      fireEvent.click(limitsLink);
      fireEvent.click(
        screen.getByRole("link", { name: readerCopy.contribution }),
      );
      await waitFor(() =>
        expect(
          screen.getByRole("heading", { name: readerCopy.contribution }),
        ).toHaveFocus(),
      );
    },
  );

  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "labels private source honestly and provides an email request in %s",
    async (locale) => {
      const dictionary = await getDictionary(locale);
      const localized = getLocalizedProject(projects["project-zurvan"], locale);
      const project = {
        ...localized,
        links: { ...localized.links, repoVisibility: "private" as const },
      };
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

  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "links the current public Zurvan source in %s",
    async (locale) => {
      const dictionary = await getDictionary(locale);
      const project = getLocalizedProject(projects["project-zurvan"], locale);
      render(
        <I18nProvider locale={locale} dictionary={dictionary}>
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
        screen.getByRole("link", {
          name: dictionary.project_detail.source_code,
        }),
      ).toHaveAttribute("href", project.links.repo);
      expect(
        screen.queryByText(dictionary.project_detail.private_source_note),
      ).not.toBeInTheDocument();
    },
  );

  it("opens paper PDFs in a new tab, as the resume PDF does, without forcing a download", async () => {
    const dictionary = await getDictionary("en");
    const project = getLocalizedProject(projects["project-simurgh"], "en");
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
    const pdfLinks = Array.from(document.querySelectorAll("a")).filter((a) =>
      (a.getAttribute("href") ?? "").endsWith(".pdf"),
    );
    expect(pdfLinks.length).toBeGreaterThan(0);
    for (const link of pdfLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link).not.toHaveAttribute("download");
    }
  });

  it("keeps an external paper record in a new tab", async () => {
    const dictionary = await getDictionary("en");
    const base = getLocalizedProject(projects["project-simurgh"], "en");
    const externalPaper: ProjectPaper = {
      title: "External record",
      label: "Record",
      href: "https://example.org/record",
      kind: "external",
    };
    const project = { ...base, papers: [externalPaper] };
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
    const link = document.querySelector('a[href="https://example.org/record"]');
    expect(link).toHaveAttribute("target", "_blank");
    expect(link?.getAttribute("rel")).toContain("noopener");
    expect(link).not.toHaveAttribute("download");
  });
});
