import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n/provider";
import { getDictionary, type Locale } from "@/i18n";
import { buildProjectSummaries } from "@/lib/project-summaries";
import { ProjectExplorer } from "./ProjectExplorer";
import { ProjectThumbnail } from "./ProjectThumbnail";
import { getOSCopy } from "./os-copy";
import * as artworkRegistry from "./project-artwork";
import * as applicationContext from "./application-context";

const requests = vi.hoisted(() => ({
  names: [] as string[],
  disposed: [] as string[],
}));

function MockArt({ active = false, name }: { active?: boolean; name: string }) {
  useEffect(
    () => () => {
      requests.disposed.push(name);
    },
    [name],
  );
  return <div data-artwork={name} data-active={active} />;
}

vi.mock("@/components/ui/RoyalAbyssCanvas", () => {
  requests.names.push("jellyfish");
  return {
    RoyalAbyssCanvas: (props: { active?: boolean }) => (
      <MockArt {...props} name="jellyfish" />
    ),
  };
});
vi.mock("@/components/ui/FireShieldCanvas", () => {
  requests.names.push("shield");
  return {
    FireShieldCanvas: (props: { active?: boolean }) => (
      <MockArt {...props} name="shield" />
    ),
  };
});
vi.mock("@/components/ui/CosmicLoomCanvas", () => ({
  CosmicLoomCanvas: (props: { active?: boolean }) => (
    <MockArt {...props} name="loom" />
  ),
}));
vi.mock("@/components/ui/DnaHelixCanvas", () => ({
  DnaHelixCanvas: (props: { active?: boolean }) => (
    <MockArt {...props} name="dna" />
  ),
}));
vi.mock("@/components/ui/DandelionSpinner", () => ({
  DandelionSpinner: (props: { active?: boolean }) => (
    <MockArt {...props} name="dandelion" />
  ),
}));
vi.mock("@/components/ui/KineticLotus", () => ({
  KineticLotus: (props: { active?: boolean }) => (
    <MockArt {...props} name="lotus" />
  ),
}));
vi.mock("@/components/ui/BlueButterfly", () => ({
  BlueButterfly: (props: { active?: boolean }) => (
    <MockArt {...props} name="butterfly" />
  ),
}));
vi.mock("@/components/ui/KineticAstrolabe", () => ({
  KineticAstrolabe: (props: { active?: boolean }) => (
    <MockArt {...props} name="astrolabe" />
  ),
}));
vi.mock("@/components/ui/CelestialCatcher", () => ({
  CelestialCatcher: (props: { active?: boolean }) => (
    <MockArt {...props} name="catcher" />
  ),
}));
vi.mock("@/components/ui/CosmicOracleEye", () => ({
  CosmicOracleEye: (props: { active?: boolean }) => (
    <MockArt {...props} name="eye" />
  ),
}));
vi.mock("@/components/ui/ConstellationOwl", () => ({
  ConstellationOwl: (props: { active?: boolean }) => (
    <MockArt {...props} name="owl" />
  ),
}));
vi.mock("@/components/ui/KoiPond", () => ({
  KoiPond: (props: { active?: boolean }) => <MockArt {...props} name="koi" />,
}));
vi.mock("@/components/ui/WheelsOfEzekiel", () => ({
  WheelsOfEzekiel: (props: { active?: boolean }) => (
    <MockArt {...props} name="wheels" />
  ),
}));

class ThumbnailObserver {
  static instances: ThumbnailObserver[] = [];
  targets = new Set<Element>();
  observe = vi.fn((target: Element) => this.targets.add(target));
  unobserve = vi.fn((target: Element) => this.targets.delete(target));
  disconnect = vi.fn();
  constructor(
    private callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    ThumbnailObserver.instances.push(this);
  }
  report(visible: boolean) {
    act(() =>
      this.callback(
        [{ isIntersecting: visible } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      ),
    );
  }
}

const locales: Locale[] = ["en", "fa", "ar", "zh", "es"];
const originalIntersectionObserver = globalThis.IntersectionObserver;
beforeEach(() => {
  ThumbnailObserver.instances = [];
  requests.disposed = [];
  globalThis.IntersectionObserver =
    ThumbnailObserver as unknown as typeof IntersectionObserver;
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  globalThis.IntersectionObserver = originalIntersectionObserver;
});

function observersFor(stage: Element) {
  const observers = ThumbnailObserver.instances.filter((observer) =>
    observer.targets.has(stage),
  );
  return {
    nearby: observers.find((observer) => observer.options?.rootMargin)!,
    visible: observers.find((observer) => !observer.options?.rootMargin)!,
  };
}

async function explorer(locale: Locale) {
  const dictionary = await getDictionary(locale);
  const summaries = buildProjectSummaries(locale);
  const copy = getOSCopy(locale);
  const element = (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <ProjectExplorer summaries={summaries} />
    </I18nProvider>
  );
  return { dictionary, summaries, copy, element };
}

describe("original project index previews", () => {
  it("requests only nearby project art, displays it paused in view, and disposes it offscreen", async () => {
    const { container, unmount } = render(
      <ProjectThumbnail slug="project-simurgh" />,
    );
    const stage = container.querySelector(".os-project-thumbnail")!;
    expect(requests.names).toEqual([]);
    expect(container.querySelector("[data-artwork]")).toBeNull();
    const { nearby, visible } = observersFor(stage);
    nearby.report(true);
    await waitFor(() => expect(requests.names).toEqual(["shield"]));
    expect(container.querySelector("[data-artwork]")).toBeNull();
    visible.report(true);
    await waitFor(() =>
      expect(
        container.querySelector('[data-artwork="shield"]'),
      ).toHaveAttribute("data-active", "false"),
    );
    expect(stage).toHaveAttribute("aria-hidden", "true");
    expect(stage).toHaveAttribute("data-preview-state", "still");
    visible.report(false);
    expect(container.querySelector("[data-artwork]")).toBeNull();
    expect(requests.disposed).toContain("shield");
    visible.report(true);
    expect(container.querySelector('[data-artwork="shield"]')).toHaveAttribute(
      "data-active",
      "false",
    );
    expect(requests.names).toEqual(["shield"]);
    unmount();
    expect(
      ThumbnailObserver.instances.every(
        (observer) => observer.disconnect.mock.calls.length === 1,
      ),
    ).toBe(true);
  });

  for (const locale of locales) {
    it(`${locale}: keeps previews, titles, links and combined search/category results aligned`, async () => {
      const { element, summaries, copy } = await explorer(locale);
      const { container } = render(element);
      const footer = container.querySelector<HTMLElement>(
        ".os-explorer-footer",
      )!;
      const prefix = locale === "en" ? "" : `/${locale}`;
      expect(
        within(footer).getByRole("link", { name: copy.contact }),
      ).toHaveAttribute("href", `${prefix}/contact`);
      expect(
        within(footer).getByRole("link", { name: copy.research }),
      ).toHaveAttribute("href", `${prefix}/write-ups`);
      expect(
        within(footer).getByRole("link", { name: copy.securityPolicy }),
      ).toHaveAttribute("href", `${prefix}/security-policy`);
      expect(
        within(footer).getByRole("heading", { name: copy.contactTitle }),
      ).toBeVisible();
      expect(footer).toHaveTextContent(copy.contactDescription);
      const searchedProject = summaries.find(
        (project) => project.slug === "gitswitch",
      )!;
      expect(screen.getAllByRole("article")).toHaveLength(13);
      expect(container.querySelectorAll("[data-project-art]")).toHaveLength(13);
      const cards = screen.getAllByRole("article");
      for (const [index, project] of summaries.entries()) {
        const article = cards[index];
        const heading = within(article).getByRole("heading", {
          name: project.title,
          level: 2,
        });
        expect(article.querySelector("[data-project-art]")).toHaveAttribute(
          "data-project-art",
          project.slug,
        );
        expect(heading.querySelector("span")).toHaveAttribute(
          "lang",
          project.titleLocale,
        );
        const path = `${locale === "en" ? "" : `/${locale}`}/projects/${project.slug}`;
        expect(
          within(article)
            .getAllByRole("link")
            .every((link) => link.getAttribute("href") === path),
        ).toBe(true);
      }
      fireEvent.change(
        screen.getByRole("searchbox", { name: copy.projectSearch }),
        {
          target: {
            value: searchedProject.searchTitle ?? searchedProject.title,
          },
        },
      );
      expect(screen.getAllByRole("article")).toHaveLength(1);
      expect(container.querySelectorAll("[data-project-art]")).toHaveLength(1);
      expect(container.querySelector("[data-project-art]")).toHaveAttribute(
        "data-project-art",
        searchedProject.slug,
      );
      const otherCategory = summaries.find(
        (project) => project.category !== searchedProject.category,
      )!.category;
      fireEvent.change(screen.getByRole("combobox", { name: copy.category }), {
        target: { value: otherCategory },
      });
      expect(screen.queryAllByRole("article")).toHaveLength(0);
      expect(container.querySelectorAll("[data-project-art]")).toHaveLength(0);
      expect(
        screen.getByText(copy.noProjects, { selector: ".os-project-rows p" }),
      ).toBeInTheDocument();
      fireEvent.change(
        screen.getByRole("searchbox", { name: copy.projectSearch }),
        { target: { value: "" } },
      );
      const selected = summaries.filter(
        (project) => project.category === otherCategory,
      );
      expect(screen.getAllByRole("article")).toHaveLength(selected.length);
      expect(container.querySelectorAll("[data-project-art]")).toHaveLength(
        selected.length,
      );
    });
  }

  it.each([
    ["invisible-window-research", "jellyfish"],
    ["project-simurgh", "shield"],
    ["project-zurvan", "loom"],
    ["gitswitch", "dandelion"],
    ["mehr-guard", "dna"],
    ["syllabus-sync", "lotus"],
    ["divan-open-day", "butterfly"],
    ["nexus-archive", "astrolabe"],
    ["nanomatch", "catcher"],
    ["sentinelflow", "eye"],
    ["ecrsm", "owl"],
    ["simurghforge", "koi"],
    ["aion", "wheels"],
  ])("renders the original %s artwork as a still", async (slug, name) => {
    const { container } = render(<ProjectThumbnail slug={slug} />);
    const { nearby, visible } = observersFor(
      container.querySelector(".os-project-thumbnail")!,
    );
    nearby.report(true);
    visible.report(true);
    await waitFor(() =>
      expect(
        container.querySelector(`[data-artwork="${name}"]`),
      ).toHaveAttribute("data-active", "false"),
    );
    expect(container.querySelectorAll("[data-artwork]")).toHaveLength(1);
  });

  it("keeps the row navigable after a failed import and retries on viewport re-entry", async () => {
    const load = vi
      .spyOn(artworkRegistry, "loadProjectArtwork")
      .mockRejectedValueOnce(new Error("Failed to request chunk"))
      .mockResolvedValueOnce((props) => <MockArt {...props} name="retried" />);
    const { element, summaries } = await explorer("es");
    const { container } = render(element);
    const stage = container.querySelector(
      `[data-project-art="${summaries[0].slug}"]`,
    )!;
    const { nearby, visible } = observersFor(stage);
    nearby.report(true);
    visible.report(true);
    await waitFor(() =>
      expect(stage).toHaveAttribute("data-preview-state", "failed"),
    );
    expect(
      screen.getByRole("heading", { name: summaries[0].title }),
    ).toBeInTheDocument();
    expect(stage.closest("article")!.querySelector("a")).toHaveAttribute(
      "href",
      `/es/projects/${summaries[0].slug}`,
    );
    nearby.report(false);
    nearby.report(true);
    await waitFor(() =>
      expect(stage.querySelector('[data-artwork="retried"]')).toHaveAttribute(
        "data-active",
        "false",
      ),
    );
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("ignores a pending chunk result after filtering removes its thumbnail", async () => {
    let resolve!: (component: artworkRegistry.ProjectArtworkComponent) => void;
    vi.spyOn(artworkRegistry, "loadProjectArtwork").mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const { element, copy } = await explorer("en");
    const { container } = render(element);
    const stage = container.querySelector("[data-project-art]")!;
    const { nearby, visible } = observersFor(stage);
    nearby.report(true);
    visible.report(true);
    fireEvent.change(
      screen.getByRole("searchbox", { name: copy.projectSearch }),
      { target: { value: "__not_a_real_project__" } },
    );
    await act(async () =>
      resolve((props) => <MockArt {...props} name="late" />),
    );
    expect(container.querySelector("[data-artwork]")).toBeNull();
    expect(container.querySelector("[data-project-art]")).toBeNull();
    expect(nearby.disconnect).toHaveBeenCalledOnce();
    expect(visible.disconnect).toHaveBeenCalledOnce();
  });

  it("never adds index previews to a dossier or requests unknown/inherited artwork keys", async () => {
    const dictionary = await getDictionary("fa");
    const { container } = render(
      <I18nProvider locale="fa" dictionary={dictionary}>
        <ProjectExplorer
          summaries={buildProjectSummaries("fa")}
          selectedSlug="project-simurgh"
        >
          <h1>Existing dossier</h1>
        </ProjectExplorer>
        <ProjectThumbnail slug="constructor" />
        <ProjectThumbnail slug="unknown" />
      </I18nProvider>,
    );
    expect(
      screen.getByRole("heading", { name: "Existing dossier" }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("[data-project-art]")).toHaveLength(0);
    expect(
      ThumbnailObserver.instances.some((observer) =>
        Array.from(observer.targets).some((target) =>
          target.classList.contains("os-project-thumbnail"),
        ),
      ),
    ).toBe(false);
  });

  it("adopts the active project query/category captured before application bootstrap", async () => {
    const { element, summaries, copy } = await explorer("fa");
    const project = summaries[0];
    vi.spyOn(applicationContext, "useInitialAppState").mockReturnValue({
      projectQuery: project.searchTitle ?? project.title,
      projectCategory: project.category,
    });
    const { container } = render(element);
    expect(
      screen.getByRole("searchbox", { name: copy.projectSearch }),
    ).toHaveValue(project.searchTitle ?? project.title);
    expect(screen.getByRole("combobox", { name: copy.category })).toHaveValue(
      project.category,
    );
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(container.querySelector("[data-project-art]")).toHaveAttribute(
      "data-project-art",
      project.slug,
    );
  });

  it("keeps the open dossier in the project list when restored filters exclude it", async () => {
    const { summaries, copy } = await explorer("en");
    const activeProject = summaries.find(
      (project) => project.slug === "project-simurgh",
    )!;
    const excludedCategory = summaries.find(
      (project) => project.category !== activeProject.category,
    )!.category;
    vi.spyOn(applicationContext, "useInitialAppState").mockReturnValue({
      projectQuery: "no matching project",
      projectCategory: excludedCategory,
    });
    const { container } = render(
      <I18nProvider locale="en" dictionary={await getDictionary("en")}>
        <ProjectExplorer
          summaries={summaries}
          selectedSlug={activeProject.slug}
        >
          <h1>Open dossier</h1>
        </ProjectExplorer>
      </I18nProvider>,
    );

    const selected = container.querySelector(
      `.os-explorer-project-link[href="/projects/${activeProject.slug}"]`,
    );
    expect(selected).toHaveAttribute("aria-current", "page");
    expect(selected).toHaveTextContent(activeProject.title);
    expect(
      screen.getByRole("searchbox", { name: copy.projectSearch }),
    ).toHaveValue("no matching project");
    expect(screen.getByRole("combobox", { name: copy.category })).toHaveValue(
      excludedCategory,
    );
  });

  it("names the open project in the breadcrumb and toggles the phone project list", async () => {
    const { summaries, copy } = await explorer("en");
    const activeProject = summaries.find(
      (project) => project.slug === "project-simurgh",
    )!;
    const { container } = render(
      <I18nProvider locale="en" dictionary={await getDictionary("en")}>
        <ProjectExplorer
          summaries={summaries}
          selectedSlug={activeProject.slug}
        >
          <h1>Open dossier</h1>
        </ProjectExplorer>
      </I18nProvider>,
    );

    const location = screen.getByRole("navigation", { name: "Location" });
    expect(
      within(location).getByRole("link", { name: copy.projects }),
    ).toHaveAttribute("href", "/projects");
    expect(location.querySelector('[aria-current="page"]')).toHaveTextContent(
      activeProject.title,
    );

    // The disclosure starts closed on a dossier so the project comes first.
    const toggle = container.querySelector<HTMLButtonElement>(
      ".os-explorer-nav-toggle",
    )!;
    const panelId = toggle.getAttribute("aria-controls")!;
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(panelId)).toHaveAttribute(
      "data-open",
      "false",
    );
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById(panelId)).toHaveAttribute(
      "data-open",
      "true",
    );
  });

  it("keeps the project list closed on the index so the work comes first on phones", async () => {
    const { summaries, copy } = await explorer("en");
    const { container } = render(
      <I18nProvider locale="en" dictionary={await getDictionary("en")}>
        <ProjectExplorer summaries={summaries} />
      </I18nProvider>,
    );
    const location = screen.getByRole("navigation", { name: "Location" });
    expect(
      within(location).queryByRole("link", { name: copy.projects }),
    ).toBeNull();
    expect(location.querySelector('[aria-current="page"]')).toHaveTextContent(
      copy.allProjects,
    );
    const toggle = container.querySelector(".os-explorer-nav-toggle");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("rejects an invalid bootstrap category and bounds the captured query", async () => {
    const { element, copy } = await explorer("en");
    vi.spyOn(applicationContext, "useInitialAppState").mockReturnValue({
      projectQuery: "x".repeat(500),
      projectCategory: "constructor",
    });
    render(element);
    expect(
      screen.getByRole("searchbox", { name: copy.projectSearch }),
    ).toHaveValue("x".repeat(100));
    expect(screen.getByRole("combobox", { name: copy.category })).toHaveValue(
      "ALL",
    );
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });

  it("uses actual viewport bounds and cleans up the scroll fallback without IntersectionObserver", async () => {
    globalThis.IntersectionObserver =
      undefined as unknown as typeof IntersectionObserver;
    let frame!: FrameRequestCallback;
    const request = vi.fn((callback: FrameRequestCallback) => {
      frame = callback;
      return 7;
    });
    const cancel = vi.fn();
    vi.stubGlobal("requestAnimationFrame", request);
    vi.stubGlobal("cancelAnimationFrame", cancel);
    let top = 2000;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          top,
          bottom: top + 136,
          left: 100,
          right: 236,
          width: 136,
          height: 136,
        }) as DOMRect,
    );
    const { container, unmount } = render(
      <ProjectThumbnail slug="gitswitch" />,
    );
    act(() => frame(0));
    expect(container.querySelector("[data-artwork]")).toBeNull();
    top = 100;
    fireEvent.scroll(window);
    act(() => frame(16));
    await waitFor(() =>
      expect(
        container.querySelector('[data-artwork="dandelion"]'),
      ).toHaveAttribute("data-active", "false"),
    );
    fireEvent.scroll(window);
    unmount();
    expect(cancel).toHaveBeenCalledWith(7);
  });

  it("preserves no-JS server-rendered project content and canonical links in all five locales", async () => {
    for (const locale of locales) {
      const { element, summaries } = await explorer(locale);
      const container = document.createElement("div");
      container.innerHTML = renderToStaticMarkup(element);
      expect(container.querySelectorAll("article")).toHaveLength(13);
      expect(
        container.querySelectorAll("[data-project-art][aria-hidden=true]"),
      ).toHaveLength(13);
      for (const project of summaries) {
        const article = container
          .querySelector(`[data-project-art="${project.slug}"]`)!
          .closest("article")!;
        expect(article.querySelector("h2")).toHaveTextContent(project.title);
        expect(article.querySelector("p")).toHaveTextContent(
          project.description,
        );
        expect(article.querySelector("a")).toHaveAttribute(
          "href",
          `${locale === "en" ? "" : `/${locale}`}/projects/${project.slug}`,
        );
      }
      const ids = Array.from(
        container.querySelectorAll("[id]"),
        (node) => node.id,
      );
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
