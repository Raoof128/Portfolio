import { cleanup, render as renderComponent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCanvasPlayback } from "./canvas-playback";
import { RoyalAbyssCanvas } from "./RoyalAbyssCanvas";
import { FireShieldCanvas } from "./FireShieldCanvas";
import { DnaHelixCanvas } from "./DnaHelixCanvas";
import { CosmicLoomCanvas } from "./CosmicLoomCanvas";

class VisibilityObserver {
  static instances: VisibilityObserver[] = [];
  disconnect = vi.fn();
  observe = vi.fn();
  constructor(private callback: IntersectionObserverCallback) {
    VisibilityObserver.instances.push(this);
  }
  report(visible: boolean) {
    this.callback(
      [{ isIntersecting: visible } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

class SizeObserver {
  static instances: SizeObserver[] = [];
  disconnect = vi.fn();
  observe = vi.fn();
  constructor(private callback: ResizeObserverCallback) {
    SizeObserver.instances.push(this);
  }
  report() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

let frames: Map<number, FrameRequestCallback>;
let nextFrame: number;
let hidden: boolean;
let reduced: boolean;
let preferenceCallbacks: Set<() => void>;
const originalIntersectionObserver = globalThis.IntersectionObserver;

function runFrame(timestamp: number) {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(timestamp));
}

function changePreference(nextReduced: boolean) {
  reduced = nextReduced;
  preferenceCallbacks.forEach((callback) => callback());
}

beforeEach(() => {
  frames = new Map();
  nextFrame = 0;
  hidden = false;
  reduced = false;
  preferenceCallbacks = new Set();
  VisibilityObserver.instances = [];
  SizeObserver.instances = [];
  globalThis.IntersectionObserver =
    VisibilityObserver as unknown as typeof IntersectionObserver;
  vi.stubGlobal("ResizeObserver", SizeObserver);
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      const id = ++nextFrame;
      frames.set(id, callback);
      return id;
    }),
  );
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn((id: number) => frames.delete(id)),
  );
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

describe("canvas playback lifecycle", () => {
  it("draws a complete still immediately and waits for visibility before scheduling", () => {
    const draw = vi.fn();
    const resize = vi.fn();
    const playback = createCanvasPlayback(
      document.createElement("canvas"),
      draw,
      resize,
    );
    expect(resize).toHaveBeenCalledOnce();
    expect(draw).toHaveBeenCalledWith(expect.any(Number), 0);
    playback.setActive(true);
    expect(frames.size).toBe(0);
    VisibilityObserver.instances[0].report(true);
    expect(frames.size).toBe(1);
    playback.dispose();
  });

  it("pauses in place and resumes without creating duplicate loops", () => {
    const draw = vi.fn();
    const playback = createCanvasPlayback(
      document.createElement("canvas"),
      draw,
    );
    VisibilityObserver.instances[0].report(true);
    playback.setActive(true);
    playback.setActive(true);
    expect(frames.size).toBe(1);
    runFrame(16);
    expect(draw).toHaveBeenLastCalledWith(16, 1);
    expect(frames.size).toBe(1);
    playback.setActive(false);
    expect(frames.size).toBe(0);
    runFrame(32);
    expect(draw).toHaveBeenCalledTimes(2);
    playback.setActive(true);
    expect(frames.size).toBe(1);
    playback.dispose();
  });

  it("does no continuing work offscreen or in a hidden document", () => {
    const playback = createCanvasPlayback(
      document.createElement("canvas"),
      vi.fn(),
    );
    VisibilityObserver.instances[0].report(true);
    playback.setActive(true);
    VisibilityObserver.instances[0].report(false);
    expect(frames.size).toBe(0);
    hidden = true;
    VisibilityObserver.instances[0].report(true);
    expect(frames.size).toBe(0);
    hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    expect(frames.size).toBe(1);
    hidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
    expect(frames.size).toBe(0);
    playback.dispose();
  });

  it("preserves the original 60Hz pace on 120Hz displays and resets paused gaps", () => {
    const draw = vi.fn();
    const playback = createCanvasPlayback(
      document.createElement("canvas"),
      draw,
    );
    VisibilityObserver.instances[0].report(true);
    playback.setActive(true);
    runFrame(0);
    runFrame(1000 / 120);
    expect(draw.mock.calls.at(-1)![1]).toBeCloseTo(0.5);
    runFrame(1000 / 60);
    expect(draw.mock.calls.at(-1)![1]).toBeCloseTo(0.5);
    runFrame(200);
    expect(draw.mock.calls.at(-1)![1]).toBe(2);
    playback.setActive(false);
    playback.setActive(true);
    runFrame(5000);
    expect(draw).toHaveBeenLastCalledWith(5000, 1);
    playback.dispose();
  });

  it("respects reduced motion initially and when changed during playback", () => {
    reduced = true;
    const draw = vi.fn();
    const playback = createCanvasPlayback(
      document.createElement("canvas"),
      draw,
    );
    VisibilityObserver.instances[0].report(true);
    playback.setActive(true);
    expect(draw).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
    changePreference(false);
    expect(frames.size).toBe(1);
    changePreference(true);
    expect(frames.size).toBe(0);
    playback.dispose();
  });

  it("restores a paused still after resize and disconnects every subscription", () => {
    const draw = vi.fn();
    const resize = vi.fn();
    const playback = createCanvasPlayback(
      document.createElement("canvas"),
      draw,
      resize,
    );
    SizeObserver.instances[0].report();
    expect(draw).toHaveBeenCalledTimes(2);
    expect(draw).toHaveBeenLastCalledWith(expect.any(Number), 0);
    expect(frames.size).toBe(0);
    playback.dispose();
    expect(VisibilityObserver.instances[0].disconnect).toHaveBeenCalledOnce();
    expect(SizeObserver.instances[0].disconnect).toHaveBeenCalledOnce();
    expect(preferenceCallbacks.size).toBe(0);
    window.dispatchEvent(new Event("resize"));
    SizeObserver.instances[0].report();
    document.dispatchEvent(new Event("visibilitychange"));
    playback.setActive(true);
    expect(draw).toHaveBeenCalledTimes(2);
    expect(frames.size).toBe(0);
  });
});

describe("original canvas artwork static rendering", () => {
  it.each([
    ["Royal Abyss", RoyalAbyssCanvas],
    ["Fire Shield", FireShieldCanvas],
    ["DNA Helix", DnaHelixCanvas],
    ["Cosmic Loom", CosmicLoomCanvas],
  ])(
    "renders %s visibly without a running loop for reduced motion",
    (_name, Artwork) => {
      reduced = true;
      const gradient = { addColorStop: vi.fn() };
      const painted = vi.fn();
      const context = new Proxy({} as CanvasRenderingContext2D, {
        get: (_target, key) =>
          key === "createLinearGradient" || key === "createRadialGradient"
            ? () => gradient
            : painted,
        set: () => true,
      });
      vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
        context,
      );
      const { container } = renderComponent(<Artwork active />);
      expect(container.querySelector("canvas")).toBeInTheDocument();
      expect(painted.mock.calls.length).toBeGreaterThan(30);
      expect(frames.size).toBe(0);
    },
  );
});
