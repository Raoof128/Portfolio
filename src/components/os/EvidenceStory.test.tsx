import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Locale } from "@/i18n";
import { projectDiagramCopy } from "@/lib/project-content/diagram-copy";
import { getDossierScope } from "@/lib/project-content/dossier-copy";
import {
  invisibleWindowStoryCopy,
  simurghEvidenceStoryCopy,
  zurvanEvidenceStoryCopy,
} from "@/lib/project-content/evidence-story-copy";
// The three story modules replace the retired EvidenceStory barrel (one import path each).
import { InvisibleWindowEvidenceStory } from "./InvisibleWindowEvidenceStory";
import { SimurghEvidenceStory } from "./SimurghEvidenceStory";
import { ZurvanEvidenceStory } from "./ZurvanEvidenceStory";

afterEach(cleanup);

describe("Simurgh evidence walkthrough", () => {
  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "renders the complete illustrative architecture and localized controls in %s",
    (locale) => {
      const copy = simurghEvidenceStoryCopy[locale];
      render(
        <SimurghEvidenceStory
          locale={locale}
          copy={simurghEvidenceStoryCopy[locale]}
        />,
      );

      expect(screen.getByRole("figure")).toHaveAttribute("lang", locale);
      expect(screen.getByRole("figure")).toHaveAttribute(
        "dir",
        locale === "fa" || locale === "ar" ? "rtl" : "ltr",
      );
      expect(screen.getByText(copy.illustrationLabel)).toBeInTheDocument();
      expect(screen.getByText(copy.signedPack)).toBeInTheDocument();
      expect(screen.getByText(copy.verifier)).toBeInTheDocument();
      expect(
        screen.getByRole("list", { name: copy.proofPathLabel }),
      ).toBeInTheDocument();
      for (const boundary of copy.boundaries) {
        expect(
          screen.getByRole("button", { name: new RegExp(boundary.title) }),
        ).toBeInTheDocument();
        expect(screen.getByText(boundary.detail)).toBeInTheDocument();
      }
      expect(
        screen.getByRole("link", { name: copy.repositoryLink }),
      ).toHaveAttribute("href", "https://github.com/Raoof128/Project-Simurgh");
      expect(
        screen.getByRole("link", { name: copy.reproduceLink }),
      ).toHaveAttribute(
        "href",
        "https://github.com/Raoof128/Project-Simurgh/blob/main/scripts/reproduce-vca-chain.sh",
      );
    },
  );

  it("exposes focusable native buttons and highlights the selected boundary-to-verifier path", () => {
    const copy = simurghEvidenceStoryCopy.en;
    render(
      <SimurghEvidenceStory locale="en" copy={simurghEvidenceStoryCopy.en} />,
    );

    const input = screen.getByRole("button", { name: /input firewall/i });
    const tool = screen.getByRole("button", { name: /tool invocation/i });
    expect(input).toHaveAttribute("type", "button");
    expect(input.tabIndex).toBe(0);
    expect(input).toHaveAttribute("aria-pressed", "true");
    expect(tool).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(tool);

    expect(input).toHaveAttribute("aria-pressed", "false");
    expect(tool).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("listitem", { current: "step" })).toHaveTextContent(
      copy.boundaries[2].detail,
    );
    const path = within(
      screen.getByRole("list", { name: copy.proofPathLabel }),
    ).getAllByRole("listitem");
    expect(path[0]).toHaveAttribute("data-path-active", "false");
    expect(path[2]).toHaveAttribute("data-path-active", "true");
    expect(path[4]).toHaveAttribute("data-path-active", "true");
    expect(path[5]).toHaveAttribute("data-path-active", "true");
  });

  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "lets readers follow signed evidence through independent verification in %s",
    (locale) => {
      const copy = simurghEvidenceStoryCopy[locale];
      render(<SimurghEvidenceStory locale={locale} copy={copy} />);
      const path = screen.getByRole("list", { name: copy.proofPathLabel });
      expect(within(path).getAllByRole("button")).toHaveLength(6);
      const pack = screen.getByRole("button", { name: copy.signedPack });
      fireEvent.click(pack);
      expect(pack).toHaveAttribute("aria-pressed", "true");
      expect(
        screen.getByRole("listitem", { current: "step" }),
      ).toHaveTextContent(copy.signedPackDetail);
      const verifier = screen.getByRole("button", { name: copy.verifier });
      fireEvent.click(verifier);
      expect(verifier).toHaveAttribute("aria-pressed", "true");
      expect(pack).toHaveAttribute("aria-pressed", "false");
      expect(
        screen.getByRole("listitem", { current: "step" }),
      ).toHaveTextContent(copy.verifierDetail);
      expect(
        within(path)
          .getAllByRole("listitem")
          .filter((step) => step.dataset.pathActive === "true"),
      ).toHaveLength(1);
      for (const boundary of copy.boundaries)
        expect(screen.getByText(boundary.detail)).toBeVisible();
    },
  );

  it("distinguishes current software from the older device-integrity paper and frozen replay", () => {
    render(
      <SimurghEvidenceStory locale="en" copy={simurghEvidenceStoryCopy.en} />,
    );
    expect(
      screen.getByText(/earlier device-integrity preprint/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /preprint|paper/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /current simurgh repository/i }),
    ).toHaveAttribute("target", "_blank");
    expect(
      screen.getByRole("link", { name: /replay earlier frozen vca evidence/i }),
    ).toHaveAttribute("rel", "noopener noreferrer");
  });

  it.each([
    ["en", /earlier frozen/i],
    ["fa", /تثبیت‌شدهٔ پیشین/],
    ["ar", /سابقة مجمّدة/],
    ["zh", /早期冻结/],
    ["es", /anterior congelada/i],
  ] as const)(
    "retains both reported October outcomes and frozen architecture scope in %s",
    (locale, earlierFrozen) => {
      const copy = simurghEvidenceStoryCopy[locale];
      const { container } = render(
        <SimurghEvidenceStory locale={locale} copy={copy} />,
      );
      const introduction = container.querySelector(
        ".os-evidence-story-heading > p[id]",
      );
      expect(introduction).toHaveTextContent(
        /Llama-3\.2-3B.*17\/24.*0\/24.*23\/24.*gpt-6-luna.*0\/24/,
      );
      expect(screen.getByText(copy.illustrationLabel)).toHaveTextContent(
        earlierFrozen,
      );
      expect(projectDiagramCopy[locale].boundariesTitle).toMatch(earlierFrozen);
      expect(copy.sourceNote).toContain("10.5281/zenodo.21737792");
      expect(copy.sourceNote).toContain("10.5281/zenodo.20374849");
      expect(copy.sourceNote).toContain("Ed25519");
      expect(copy.sourceNote).not.toMatch(/SHA-256|x86_64/);
      expect(copy.signedPackDetail).toMatch(earlierFrozen);

      const scope = getDossierScope("project-simurgh", locale);
      for (const fact of [
        "288",
        "Wilson",
        "43.6–97.0%",
        "0.0–39.0%",
        "8/8",
        "2/3",
        "5/5",
        "39",
        "5,171",
        "19",
        "2026",
      ])
        expect(scope).toContain(fact);
      expect(scope).toContain("Ed25519");
      expect(scope).toContain("Lean 4");
      expect(scope).not.toMatch(/SHA-256|x86_64/);
      const zurvanScope = getDossierScope("project-zurvan", locale);
      for (const token of ["Rust", "Python", "MCP", "218"])
        expect(zurvanScope).toContain(token);
      const pilotScope = getDossierScope("aion", locale);
      for (const token of [
        "40",
        "0.941",
        "0.978",
        "6/6",
        "Aion-BibleQA",
        "OpenAI",
      ])
        expect(pilotScope).toContain(token);
      expect(pilotScope).not.toMatch(/0\.75|citation_support/);
    },
  );

  it("keeps reported outcomes outside the illustrative diagram and adds no simulated result fields", () => {
    const { container } = render(
      <SimurghEvidenceStory locale="en" copy={simurghEvidenceStoryCopy.en} />,
    );
    expect(
      container.querySelector(".os-simurgh-instrument")?.textContent,
    ).not.toMatch(/\b\d+\/\d+\b|\b\d+(?:\.\d+)?\s*(?:ms|%)/i);
    expect(
      container.querySelector("[data-result], [data-measurement]"),
    ).toBeNull();
  });

  it("keeps the full explanation and source links in server-rendered HTML", () => {
    const copy = simurghEvidenceStoryCopy.en;
    const markup = renderToStaticMarkup(
      <SimurghEvidenceStory locale="en" copy={simurghEvidenceStoryCopy.en} />,
    );
    for (const boundary of copy.boundaries) {
      expect(markup).toContain(boundary.title);
      expect(markup).toContain(boundary.detail);
    }
    expect(markup).toContain(copy.signedPackDetail);
    expect(markup).toContain(copy.verifierDetail);
    expect(markup).toContain("https://github.com/Raoof128/Project-Simurgh");
    expect(markup).toContain("reproduce-vca-chain.sh");
  });

  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "keeps both observability panels, source scope, and limits available in %s",
    (locale) => {
      const copy = invisibleWindowStoryCopy[locale];
      render(
        <InvisibleWindowEvidenceStory
          locale={locale}
          copy={invisibleWindowStoryCopy[locale]}
        />,
      );
      expect(screen.getByRole("figure")).toHaveAttribute("lang", locale);
      expect(screen.getByRole("figure")).toHaveAttribute(
        "dir",
        locale === "fa" || locale === "ar" ? "rtl" : "ltr",
      );
      expect(
        screen.getByRole("heading", { name: copy.physicalLabel }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: copy.captureLabel }),
      ).toBeInTheDocument();
      expect(screen.getByText(copy.windowsPathLabel)).toBeInTheDocument();
      expect(screen.getByText(copy.macLimits)).toBeInTheDocument();
      expect(screen.getByText(copy.windowsLimits)).toBeInTheDocument();
      expect(screen.getByText(copy.illustrationLabel)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: copy.paperLink }),
      ).toHaveAttribute("href", "https://doi.org/10.5281/zenodo.20376495");
      // The research repository is private; the paper is the public source.
      expect(
        document.querySelector('a[href*="github.com/Raoof128/invisible-window-research"]'),
      ).toBeNull();
    },
  );

  it("changes the selected capture API while keeping display and capture visible", () => {
    const copy = invisibleWindowStoryCopy.en;
    const { container } = render(
      <InvisibleWindowEvidenceStory
        locale="en"
        copy={invisibleWindowStoryCopy.en}
      />,
    );
    const macButton = screen.getByRole("button", { name: "macOS 14–26" });
    const apiLine = container.querySelector(".os-capture-api");
    expect(apiLine).toHaveTextContent(copy.windowsApi);
    expect(screen.getByText(copy.windowsPathLabel)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: copy.physicalLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: copy.captureLabel }),
    ).toBeInTheDocument();

    fireEvent.click(macButton);

    expect(macButton).toHaveAttribute("aria-pressed", "true");
    expect(apiLine).toHaveTextContent(copy.macApi);
    expect(screen.getByText(copy.macPathLabel)).toBeInTheDocument();
    expect(screen.getByText(copy.macScope)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: copy.physicalLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: copy.captureLabel }),
    ).toBeInTheDocument();
    expect(screen.getByText(copy.macLimits)).toBeInTheDocument();
  });

  it.each(["fa", "ar"] as Locale[])(
    "isolates API identifiers from RTL labels in %s",
    (locale) => {
      const copy = invisibleWindowStoryCopy[locale];
      const { container } = render(
        <InvisibleWindowEvidenceStory
          locale={locale}
          copy={invisibleWindowStoryCopy[locale]}
        />,
      );
      const apiLine = container.querySelector(".os-capture-api");
      const assertIsolatedIdentifier = (api: string) => {
        const [label, ...identifierParts] = api.split(" · ");
        const identifier = apiLine?.querySelector("bdi[dir='ltr']");

        expect(apiLine?.childNodes[0]?.textContent).toBe(label);
        expect(apiLine?.childNodes[1]?.textContent?.trim()).toBe("·");
        expect(identifier).toHaveTextContent(identifierParts.join(" · "));
        expect(apiLine).toHaveTextContent(api);
      };

      expect(screen.getByRole("figure")).toHaveAttribute("dir", "rtl");
      assertIsolatedIdentifier(copy.windowsApi);

      fireEvent.click(screen.getByRole("button", { name: "macOS 14–26" }));
      assertIsolatedIdentifier(copy.macApi);
    },
  );

  it("keeps the disclosure scope and selected API in static HTML", () => {
    const copy = invisibleWindowStoryCopy.en;
    const markup = renderToStaticMarkup(
      <InvisibleWindowEvidenceStory
        locale="en"
        copy={invisibleWindowStoryCopy.en}
      />,
    );
    const [apiLabel, ...identifierParts] = copy.windowsApi.split(" · ");
    expect(markup).toContain(
      `${apiLabel} · <bdi dir="ltr">${identifierParts.join(" · ")}</bdi>`,
    );
    expect(markup).toContain(copy.windowsLimits);
    expect(markup).toContain(copy.macLimits);
    expect(markup).toContain("https://doi.org/10.5281/zenodo.20376495");
  });

  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "keeps Zurvan's generic typed graph and source limits localized in %s",
    (locale) => {
      const copy = zurvanEvidenceStoryCopy[locale];
      render(
        <ZurvanEvidenceStory
          locale={locale}
          copy={zurvanEvidenceStoryCopy[locale]}
        />,
      );
      expect(screen.getByRole("figure")).toHaveAttribute("lang", locale);
      expect(screen.getByText(copy.sourceNode)).toBeInTheDocument();
      expect(screen.getByText(copy.retrievalNode)).toBeInTheDocument();
      expect(screen.getByText(copy.consumerNode)).toBeInTheDocument();
      expect(screen.getByText(copy.illustrationLabel)).toBeInTheDocument();
      expect(screen.getByText(copy.limitations)).toBeInTheDocument();
      for (const node of copy.nodeTypes) {
        expect(
          screen.getByRole("button", { name: node.name }),
        ).toBeInTheDocument();
        expect(screen.getByText(node.detail)).toBeInTheDocument();
      }
      expect(screen.getByText(copy.repositoryNote)).toBeInTheDocument();
      const publicRepository: Record<Locale, RegExp> = {
        en: /repository is public/,
        fa: /مخزن Zurvan عمومی/,
        ar: /مستودع Zurvan عام/,
        zh: /Zurvan 仓库现为公开/,
        es: /repositorio de Zurvan es público/,
      };
      const imageStub: Record<Locale, RegExp> = {
        en: /image stubs/,
        fa: /تصویر در انتظار بررسی/,
        ar: /صور معلّقة/,
        zh: /图像占位/,
        es: /imágenes pendientes/,
      };
      expect(copy.repositoryNote).toMatch(publicRepository[locale]);
      expect(copy.sourceDetail).toMatch(imageStub[locale]);
      expect(copy.consumerDetail).toContain("Rust");
      expect(copy.consumerDetail).toContain("Python");
    },
  );

  it("updates typed graph selection without hiding any explanation", () => {
    const copy = zurvanEvidenceStoryCopy.en;
    render(
      <ZurvanEvidenceStory locale="en" copy={zurvanEvidenceStoryCopy.en} />,
    );
    const graph = screen.getByRole("group", { name: copy.relationshipsLabel });
    expect(within(graph).getAllByRole("button")).toHaveLength(4);
    const entityButton = screen.getByRole("button", { name: "Entity" });
    expect(
      screen.getByText("Claim", { selector: ".os-zurvan-typed strong" }),
    ).toBeInTheDocument();
    expect(graph.querySelector(".os-zurvan-edge-retrieval")).toHaveAttribute(
      "data-selected-type",
      "0",
    );

    fireEvent.click(entityButton);

    expect(entityButton).toHaveAttribute("aria-pressed", "true");
    expect(entityButton).toHaveAttribute("data-selected", "true");
    expect(
      screen.getByText("Entity", { selector: ".os-zurvan-typed strong" }),
    ).toBeInTheDocument();
    expect(graph.querySelector(".os-zurvan-edge-retrieval")).toHaveAttribute(
      "data-selected-type",
      "2",
    );
    expect(screen.getByRole("listitem", { current: "step" })).toHaveTextContent(
      copy.nodeTypes[2].detail,
    );
    for (const node of copy.nodeTypes) {
      expect(screen.getByText(node.detail)).toBeInTheDocument();
    }
  });

  it("does not introduce retrieval metrics or expose corpus query data", () => {
    const { container } = render(
      <ZurvanEvidenceStory locale="en" copy={zurvanEvidenceStoryCopy.en} />,
    );
    expect(container.textContent).not.toMatch(
      /\b\d+(?:\.\d+)?\s*(?:%|ms|queries|documents)\b/i,
    );
    expect(container.textContent).not.toMatch(
      /real-mcp-safety|trace-\d{8}|eval\/provenance/i,
    );
  });
});
