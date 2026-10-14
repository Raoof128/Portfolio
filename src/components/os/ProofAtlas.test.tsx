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
  it("changes topology and destination for each documented research map", () => {
    const { container } = render(<ProofAtlas locale="en" interactive />);
    const svg = container.querySelector("svg")!;
    const simurghPathCount = svg.querySelectorAll(".proof-atlas-edge").length;
    expect(simurghPathCount).toBe(8);
    expect(
      screen.getByRole("link", { name: /open project evidence/i }),
    ).toHaveAttribute("href", "/projects/project-simurgh");

    fireEvent.click(screen.getByRole("button", { name: "Invisible Window" }));
    expect(
      screen.getByRole("button", { name: "Invisible Window" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(svg.querySelectorAll(".proof-atlas-edge")).toHaveLength(2);
    expect(svg.querySelectorAll(".proof-atlas-plane")).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: /open project evidence/i }),
    ).toHaveAttribute("href", "/projects/invisible-window-research");

    fireEvent.click(screen.getByRole("button", { name: "Project Zurvan" }));
    expect(svg.querySelectorAll(".proof-atlas-edge")).toHaveLength(12);
    expect(svg.querySelectorAll(".proof-atlas-node")).toHaveLength(9);
    expect(
      screen.getByRole("link", { name: /open project evidence/i }),
    ).toHaveAttribute("href", "/projects/project-zurvan");
    expect(svg.querySelectorAll(".proof-atlas-edge").length).not.toBe(
      simurghPathCount,
    );
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
    expect(svg?.querySelectorAll(".proof-atlas-edge")).toHaveLength(8);
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
    expect(container.querySelectorAll(".proof-atlas-edge")).toHaveLength(8);
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
});
