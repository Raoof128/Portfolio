import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProofAtlas } from "./ProofAtlas";
import { getAtlasCopy } from "./atlas-copy";

type MediaQueryStub = MediaQueryList & {
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
};

const originalMatchMedia = window.matchMedia;
const originalHardwareConcurrency = navigator.hardwareConcurrency;
const originalRequestAnimationFrame = window.requestAnimationFrame;
const originalCancelAnimationFrame = window.cancelAnimationFrame;

function configureMedia({
  reducedMotion = false,
  finePointer = true,
}: {
  reducedMotion?: boolean;
  finePointer?: boolean;
} = {}) {
  const matchesFor = (query: string) => {
    if (query.includes("prefers-reduced-motion")) return reducedMotion;
    if (query.includes("pointer") || query.includes("hover"))
      return finePointer;
    return false;
  };
  const matchMedia = vi.fn((media: string) => {
    const result = {
      matches: matchesFor(media),
      media,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    } as unknown as MediaQueryStub;
    return result;
  });
  vi.stubGlobal("matchMedia", matchMedia);
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: matchMedia,
  });
  Object.defineProperty(navigator, "hardwareConcurrency", {
    configurable: true,
    value: 8,
  });
}

function installAnimationFrameMocks() {
  let nextFrame = 0;
  const request = vi.fn(() => ++nextFrame);
  const cancel = vi.fn();
  vi.stubGlobal("requestAnimationFrame", request);
  vi.stubGlobal("cancelAnimationFrame", cancel);
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: request,
  });
  Object.defineProperty(window, "cancelAnimationFrame", {
    configurable: true,
    value: cancel,
  });
  return { request, cancel };
}

beforeEach(() => {
  configureMedia();
  installAnimationFrameMocks();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: originalMatchMedia,
  });
  Object.defineProperty(navigator, "hardwareConcurrency", {
    configurable: true,
    value: originalHardwareConcurrency,
  });
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: originalRequestAnimationFrame,
  });
  Object.defineProperty(window, "cancelAnimationFrame", {
    configurable: true,
    value: originalCancelAnimationFrame,
  });
});

describe("Proof Atlas", () => {
  it.each([
    ["en", /not a run trace/i],
    ["fa", /رد اجرا نیست/],
    ["ar", /ليس سجل تشغيل/],
    ["es", /no una traza de ejecución/i],
    ["zh", /不是运行轨迹/],
  ] as const)(
    "shows the published benefit, null result and replay beside the control-boundary schematic in %s",
    (locale, notARunTrace) => {
      const { container } = render(<ProofAtlas locale={locale} interactive />);
      expect(container.querySelector(".proof-atlas-summary")).toHaveTextContent(
        /Llama-3\.2-3B.*17\/24.*0\/24.*23\/24.*gpt-6-luna.*0\/24.*269.*220/,
      );
      expect(
        container.querySelector(".proof-atlas-qualifier"),
      ).toHaveTextContent(notARunTrace);
      expect(container.querySelector("svg desc")).toHaveTextContent(
        notARunTrace,
      );
      // Host state, composed gate and receiver; one refused path and two evidence drops.
      expect(
        container.querySelectorAll(".proof-atlas-node--boundary"),
      ).toHaveLength(3);
      expect(container.querySelectorAll(".proof-atlas-edge")).toHaveLength(6);
      expect(
        container.querySelectorAll(".proof-atlas-edge--blocked"),
      ).toHaveLength(1);
      expect(
        container.querySelectorAll(".proof-atlas-edge--evidence"),
      ).toHaveLength(2);
      expect(container.querySelectorAll(".proof-atlas-archive")).toHaveLength(
        1,
      );
    },
  );

  it("changes topology and destination for each documented research map", () => {
    const { container } = render(<ProofAtlas locale="en" interactive />);
    const svg = container.querySelector("svg")!;
    const simurghPathCount = svg.querySelectorAll(".proof-atlas-edge").length;
    expect(simurghPathCount).toBe(6);
    expect(
      screen.getByRole("link", { name: /open project evidence/i }),
    ).toHaveAttribute("href", "/projects/project-simurgh");

    fireEvent.click(screen.getByRole("button", { name: "Invisible Window" }));
    expect(
      screen.getByRole("button", { name: "Invisible Window" }),
    ).toHaveAttribute("aria-pressed", "true");
    // Flagged window to compositor, then one edge to each output plane.
    expect(svg.querySelectorAll(".proof-atlas-edge")).toHaveLength(3);
    expect(svg.querySelectorAll(".proof-atlas-plane")).toHaveLength(2);
    expect(svg.querySelectorAll(".proof-atlas-flagged-window")).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: /open project evidence/i }),
    ).toHaveAttribute("href", "/projects/invisible-window-research");

    fireEvent.click(screen.getByRole("button", { name: "Project Zurvan" }));
    // The original twelve, plus the audit-trace drop; the opt-in write is a return path.
    expect(svg.querySelectorAll(".proof-atlas-edge")).toHaveLength(13);
    expect(svg.querySelectorAll(".proof-atlas-node")).toHaveLength(11);
    expect(svg.querySelectorAll(".proof-atlas-return path")).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: /open project evidence/i }),
    ).toHaveAttribute("href", "/projects/project-zurvan");
    expect(svg.querySelectorAll(".proof-atlas-edge").length).not.toBe(
      simurghPathCount,
    );
  });

  it("paints every node label after the connector layer so its halo masks crossings", () => {
    // New guard for the label halo: a label painted before the connectors would be struck through.
    const { container } = render(<ProofAtlas locale="en" interactive />);
    const svg = container.querySelector("svg")!;
    const connectors = svg.querySelector(".proof-atlas-lines")!;
    const labels = svg.querySelectorAll(".proof-atlas-node text");
    expect(labels.length).toBeGreaterThan(0);
    for (const label of labels) {
      expect(
        connectors.compareDocumentPosition(label) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });

  it("keeps the gate and receiver names above their plates, clear of the evidence drops", () => {
    // Below the plate, each name would sit on the connector that drops to its record.
    const { container } = render(<ProofAtlas locale="es" interactive />);
    for (const name of ["Puerta compuesta", "Receptor"]) {
      const label = Array.from(container.querySelectorAll("svg text")).find(
        (text) => text.textContent === name,
      );
      expect(label).toBeDefined();
      expect(Number(label!.getAttribute("y"))).toBeLessThan(0);
    }
  });

  it.each([
    ["en", "start"],
    ["fa", "end"],
    ["ar", "end"],
  ] as const)(
    "starts the replay name beside its pack in %s",
    (locale, anchor) => {
      // In a right-to-left run `end` is the left edge, so the name never covers the pack.
      const { container } = render(<ProofAtlas locale={locale} interactive />);
      const label = container.querySelector(".proof-atlas-node--archive text")!;
      expect(label).toHaveTextContent(getAtlasCopy(locale).nodeLabels.replay);
      expect(label).toHaveAttribute("text-anchor", anchor);
      expect(Number(label.getAttribute("x"))).toBeGreaterThan(31);
    },
  );

  it("names every drawn node in every language", () => {
    for (const locale of ["en", "fa", "ar", "es", "zh"] as const) {
      const { container, unmount } = render(
        <ProofAtlas locale={locale} interactive />,
      );
      const labels = getAtlasCopy(locale).nodeLabels;
      for (const project of [0, 1, 2]) {
        fireEvent.click(
          container.querySelectorAll(".proof-atlas-option")[project],
        );
        const listed = [
          ...container.querySelectorAll(".proof-atlas-node-labels li"),
        ].map((item) => item.textContent);
        expect(listed.length).toBeGreaterThan(3);
        // A missing translation would fall back to the English map label.
        for (const name of listed)
          expect(Object.values(labels)).toContain(name);
      }
      unmount();
    }
  });

  it("exposes the localized diagram description through the SVG accessible name", () => {
    const { container } = render(<ProofAtlas locale="fa" interactive />);
    const svg = screen.getByRole("img");
    const labelledBy = svg.getAttribute("aria-labelledby")!;
    expect(document.getElementById(labelledBy)?.tagName.toLowerCase()).toBe(
      "title",
    );
    const description = document.getElementById(
      svg.getAttribute("aria-describedby")!,
    );

    expect(description?.tagName.toLowerCase()).toBe("desc");
    expect(description).toHaveTextContent(
      getAtlasCopy("fa").diagramDescription["project-simurgh"],
    );
    expect(container.querySelectorAll("svg title")).toHaveLength(1);
  });

  it.each([
    ["en", "ltr"],
    ["fa", "rtl"],
    ["ar", "rtl"],
    ["es", "ltr"],
    ["zh", "ltr"],
  ] as const)("renders a static, localized %s first frame", (locale, dir) => {
    const markup = renderToStaticMarkup(
      <ProofAtlas locale={locale} interactive />,
    );
    const parser = new DOMParser();
    const document = parser.parseFromString(markup, "text/html");
    const atlas = document.querySelector(".proof-atlas");
    const svg = document.querySelector("svg");
    const describedBy = svg?.getAttribute("aria-describedby") ?? "";

    expect(atlas?.getAttribute("lang")).toBe(locale);
    expect(atlas?.getAttribute("dir")).toBe(dir);
    expect(atlas?.getAttribute("data-motion-enabled")).toBe("false");
    expect(atlas?.getAttribute("data-project")).toBe("project-simurgh");
    expect(svg?.querySelectorAll(".proof-atlas-edge")).toHaveLength(6);
    expect(document.getElementById(describedBy)?.textContent).toBe(
      getAtlasCopy(locale).diagramDescription["project-simurgh"],
    );
  });

  it("keeps decorative and inactive maps free of controls and pointer work", () => {
    const { container, rerender } = render(
      <ProofAtlas locale="en" decorative />,
    );
    const svg = container.querySelector("svg")!;
    expect(container.querySelector(".proof-atlas")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".proof-atlas-caption")).toHaveTextContent(
      /not a run trace/i,
    );
    expect(container.querySelector("button")).toBeNull();
    expect(container.querySelector(".proof-atlas")).toHaveAttribute(
      "data-interactive",
      "false",
    );
    const matchMedia = window.matchMedia as ReturnType<typeof vi.fn>;
    for (const result of matchMedia.mock.results) {
      expect(result.value.addEventListener).not.toHaveBeenCalled();
    }
    fireEvent.pointerMove(svg, {
      pointerType: "mouse",
      clientX: 12,
      clientY: 20,
    });
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();

    rerender(<ProofAtlas locale="en" interactive={false} />);
    expect(container.querySelector("button")).toBeNull();
    expect(container.querySelector(".proof-atlas")).toHaveAttribute(
      "data-interactive",
      "false",
    );
    expect(container.querySelector(".proof-atlas-caption")).toHaveTextContent(
      /not a run trace/i,
    );
  });

  it.each([
    ["reduced motion", { reducedMotion: true, finePointer: true }],
    ["coarse pointer", { reducedMotion: false, finePointer: false }],
  ] as const)("does not schedule pointer RAF under %s", (_label, media) => {
    configureMedia(media);
    const { container } = render(<ProofAtlas locale="en" interactive />);
    expect(container.querySelector(".proof-atlas")).toHaveAttribute(
      "data-motion-enabled",
      "false",
    );
    expect(container.querySelectorAll(".proof-atlas-edge")).toHaveLength(6);
    fireEvent.pointerMove(container.querySelector("svg")!, {
      pointerType: "mouse",
      clientX: 120,
      clientY: 80,
    });
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it.each(["deactivate", "unmount"] as const)(
    "cancels a queued pointer frame on %s",
    (action) => {
      const { request, cancel } = installAnimationFrameMocks();
      const { container, rerender, unmount } = render(
        <ProofAtlas locale="en" interactive />,
      );
      fireEvent.pointerMove(container.querySelector("svg")!, {
        pointerType: "mouse",
        clientX: 120,
        clientY: 80,
      });
      expect(request).toHaveBeenCalledTimes(1);

      act(() => {
        if (action === "deactivate") {
          rerender(<ProofAtlas locale="en" interactive={false} />);
        } else {
          unmount();
        }
      });

      expect(cancel).toHaveBeenCalledWith(1);
    },
  );

  it("lists the figure's node names in HTML for phones, in the same order as the drawing", () => {
    const { container } = render(<ProofAtlas locale="en" interactive />);
    const drawn = [...container.querySelectorAll(".proof-atlas-node text")].map(
      (node) => node.textContent?.trim(),
    );
    const listed = [
      ...container.querySelectorAll(".proof-atlas-node-labels li"),
    ].map((item) => item.textContent?.trim());
    expect(listed.length).toBeGreaterThan(0);
    expect(listed).toEqual(drawn);
  });

  it("keeps the desktop window title to the heading and moves the eyebrow into the body", () => {
    const { container } = render(
      <ProofAtlas
        locale="en"
        interactive
        className="proof-atlas--desktop window glass active"
      />,
    );
    const titleBar = container.querySelector(".proof-atlas-heading")!;
    expect(titleBar).toHaveClass("title-bar");
    expect(titleBar.querySelector(".proof-atlas-eyebrow")).toBeNull();
    expect(titleBar.querySelector("h2")).toHaveTextContent(
      getAtlasCopy("en").heading,
    );
    const kicker = container.querySelector(
      ".proof-atlas-body .proof-atlas-kicker",
    );
    expect(kicker).toHaveTextContent(getAtlasCopy("en").eyebrow);
    const arrow = container.querySelector(".proof-atlas-link svg");
    expect(arrow).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".proof-atlas-link")).not.toHaveTextContent(
      "↗",
    );
  });
});
