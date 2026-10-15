import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectMotion } from "./ProjectMotion";

const requests = vi.hoisted(() => ({
  names: [] as string[],
  failDandelion: false,
}));

function MockArt({ active = false, name }: { active?: boolean; name: string }) {
  return <div data-artwork={name} data-active={active} />;
}

vi.mock("@/components/ui/FireShieldCanvas", () => {
  requests.names.push("shield");
  return {
    FireShieldCanvas: (props: { active?: boolean }) => (
      <MockArt {...props} name="shield" />
    ),
  };
});
vi.mock("@/components/ui/RoyalAbyssCanvas", () => ({
  RoyalAbyssCanvas: (props: { active?: boolean }) => (
    <MockArt {...props} name="jellyfish" />
  ),
}));
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
  get DandelionSpinner() {
    if (requests.failDandelion) {
      requests.failDandelion = false;
      throw new Error("Network request failed");
    }
    return function DandelionMock(props: { active?: boolean }) {
      return <MockArt {...props} name="dandelion" />;
    };
  },
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

class MotionObserver {
  static instances: MotionObserver[] = [];
  observe = vi.fn();
  disconnect = vi.fn();
  constructor(private callback: IntersectionObserverCallback) {
    MotionObserver.instances.push(this);
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

let hidden: boolean;
let reduced: boolean;
let preferenceCallbacks: Set<() => void>;
const originalIntersectionObserver = globalThis.IntersectionObserver;

beforeEach(() => {
  MotionObserver.instances = [];
  hidden = false;
  reduced = false;
  preferenceCallbacks = new Set();
  globalThis.IntersectionObserver =
    MotionObserver as unknown as typeof IntersectionObserver;
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        media: query,
        get matches() {
          return reduced;
        },
        addEventListener: (_event: string, callback: () => void) =>
          preferenceCallbacks.add(callback),
        removeEventListener: (_event: string, callback: () => void) =>
          preferenceCallbacks.delete(callback),
      }) as unknown as MediaQueryList,
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  globalThis.IntersectionObserver = originalIntersectionObserver;
});

async function revealArtwork(container: HTMLElement, name: string) {
  MotionObserver.instances.at(-2)!.report(true);
  MotionObserver.instances.at(-1)!.report(true);
  return waitFor(() => {
    const artwork = container.querySelector(`[data-artwork="${name}"]`);
    expect(artwork).toBeInTheDocument();
    return artwork!;
  });
}

describe("project artwork loading and controls", () => {
  it("requests only the current project's artwork after approaching its stage", async () => {
    const { container } = render(
      <ProjectMotion slug="project-simurgh" locale="en" />,
    );
    expect(requests.names).toEqual([]);
    expect(
      container.querySelector(".os-motion-placeholder"),
    ).toBeInTheDocument();
    await revealArtwork(container, "shield");
    expect(requests.names).toEqual(["shield"]);
    expect(container.querySelectorAll("[data-artwork]")).toHaveLength(1);
  });

  it("pauses the current pose, then resumes without replacing the artwork", async () => {
    const { container } = render(
      <ProjectMotion slug="project-simurgh" locale="en" />,
    );
    const artwork = await revealArtwork(container, "shield");
    expect(artwork).toHaveAttribute("data-active", "true");
    // English button labels are title case per the ResearchOS spec, so names changed.
    fireEvent.click(screen.getByRole("button", { name: "Pause Animation" }));
    expect(artwork).toHaveAttribute("data-active", "false");
    fireEvent.click(screen.getByRole("button", { name: "Play Animation" }));
    expect(artwork).toHaveAttribute("data-active", "true");
    expect(container.querySelector("[data-artwork]")).toBe(artwork);
  });

  it("keeps the static artwork visible for reduced motion and follows live preference changes", async () => {
    reduced = true;
    const { container } = render(
      <ProjectMotion slug="project-simurgh" locale="fa" />,
    );
    const artwork = await revealArtwork(container, "shield");
    expect(artwork).toHaveAttribute("data-active", "false");
    expect(screen.getByText("ثابت")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    act(() => {
      reduced = false;
      preferenceCallbacks.forEach((callback) => callback());
    });
    expect(artwork).toHaveAttribute("data-active", "true");
    expect(
      screen.getByRole("button", { name: "توقف پویانمایی" }),
    ).toBeInTheDocument();
  });

  it("stops hidden and offscreen artwork and cleans up observers on removal", async () => {
    const { container, unmount } = render(
      <ProjectMotion slug="project-simurgh" locale="en" />,
    );
    const artwork = await revealArtwork(container, "shield");
    MotionObserver.instances.at(-1)!.report(false);
    expect(artwork).toHaveAttribute("data-active", "false");
    act(() => {
      hidden = true;
      document.dispatchEvent(new Event("visibilitychange"));
    });
    MotionObserver.instances.at(-1)!.report(true);
    expect(artwork).toHaveAttribute("data-active", "false");
    act(() => {
      hidden = false;
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(artwork).toHaveAttribute("data-active", "true");
    unmount();
    expect(
      MotionObserver.instances.every(
        (observer) => observer.disconnect.mock.calls.length > 0,
      ),
    ).toBe(true);
    expect(preferenceCallbacks.size).toBe(0);
  });

  it("pauses at the reading-pane clip and cancels its captured-scroll fallback without IntersectionObserver", async () => {
    globalThis.IntersectionObserver =
      undefined as unknown as typeof IntersectionObserver;
    vi.stubGlobal("ResizeObserver", undefined);
    const frames = new Map<number, FrameRequestCallback>();
    let nextFrame = 0;
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      const id = ++nextFrame;
      frames.set(id, callback);
      return id;
    });
    const cancel = vi.fn((id: number) => frames.delete(id));
    vi.stubGlobal("cancelAnimationFrame", cancel);
    let top = 2000;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        const y = this.classList.contains("os-page-content") ? 80 : top;
        const height = this.classList.contains("os-page-content") ? 400 : 120;
        return {
          x: 100,
          y,
          top: y,
          bottom: y + height,
          left: 100,
          right: 500,
          width: 400,
          height,
        } as DOMRect;
      },
    );
    const flush = () =>
      act(() => {
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach((callback) => callback(0));
      });
    const { container, unmount } = render(
      <div className="os-page-content">
        <ProjectMotion slug="project-simurgh" locale="en" />
      </div>,
    );
    flush();
    expect(container.querySelector("[data-artwork]")).toBeNull();
    top = 100;
    fireEvent.scroll(container.firstChild!);
    flush();
    const artwork = await waitFor(() => {
      const element = container.querySelector('[data-artwork="shield"]');
      expect(element).toHaveAttribute("data-active", "true");
      return element!;
    });
    // This stage remains inside the browser viewport, below the pane's clip.
    top = 500;
    fireEvent.scroll(container.firstChild!);
    flush();
    expect(artwork).toHaveAttribute("data-active", "false");
    top = 100;
    fireEvent.scroll(container.firstChild!);
    flush();
    expect(artwork).toHaveAttribute("data-active", "true");
    fireEvent.scroll(container.firstChild!);
    expect(frames.size).toBe(1);
    unmount();
    expect(cancel).toHaveBeenCalledWith(nextFrame);
    expect(frames.size).toBe(0);
    fireEvent.scroll(window);
    expect(frames.size).toBe(0);
  });

  it("keeps the dossier usable after a failed request and retries without reloading", async () => {
    requests.failDandelion = true;
    const { container } = render(
      <>
        <h1>GitSwitch dossier</h1>
        <ProjectMotion slug="gitswitch" locale="en" />
      </>,
    );
    MotionObserver.instances.at(-2)!.report(true);
    MotionObserver.instances.at(-1)!.report(true);
    expect(
      await screen.findByText("Artwork could not load."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "GitSwitch dossier" }),
    ).toBeInTheDocument();
    // Title case for the English retry label, per the ResearchOS spec.
    fireEvent.click(screen.getByRole("button", { name: "Try Again" }));
    await waitFor(() =>
      expect(
        container.querySelector('[data-artwork="dandelion"]'),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("rejects unknown and inherited object keys without requesting artwork", () => {
    const { container, rerender } = render(
      <ProjectMotion slug="unknown" locale="en" />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(<ProjectMotion slug="constructor" locale="en" />);
    expect(container).toBeEmptyDOMElement();
    expect(MotionObserver.instances).toHaveLength(0);
  });

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
  ])("preserves the original %s artwork mapping", async (slug, name) => {
    const { container } = render(<ProjectMotion slug={slug} locale="en" />);
    await revealArtwork(container, name);
    expect(container.querySelectorAll("[data-artwork]")).toHaveLength(1);
  });
});
