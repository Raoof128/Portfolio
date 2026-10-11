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
import {
  invisibleWindowStoryCopy,
  simurghEvidenceStoryCopy,
  zurvanEvidenceStoryCopy,
} from "@/lib/project-content/evidence-story-copy";
import {
  InvisibleWindowEvidenceStory,
  SimurghEvidenceStory,
  ZurvanEvidenceStory,
} from "./EvidenceStory";

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

  it("links to the live VCA sources and labels the bundled preprint as historical lineage", () => {
    render(
      <SimurghEvidenceStory locale="en" copy={simurghEvidenceStoryCopy.en} />,
    );
    expect(
      screen.getByText(/earlier device-integrity stage/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /preprint|paper/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /current vca repository/i }),
    ).toHaveAttribute("target", "_blank");
    expect(
      screen.getByRole("link", { name: /reproduce the vca evidence/i }),
    ).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("contains no simulated measurements or result fields", () => {
    const { container } = render(
      <SimurghEvidenceStory locale="en" copy={simurghEvidenceStoryCopy.en} />,
    );
    expect(container.textContent).not.toMatch(
      /\b\d+\/\d+\b|\b\d+(?:\.\d+)?\s*(?:ms|%)/i,
    );
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
      expect(
        screen.getByRole("link", { name: copy.repositoryLink }),
      ).toHaveAttribute(
        "href",
        "https://github.com/Raoof128/invisible-window-research",
      );
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
