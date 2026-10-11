import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProjectThumbnail } from "./ProjectThumbnail";
import * as artworkRegistry from "./project-artwork";

const originalIntersectionObserver = globalThis.IntersectionObserver;

function MockArtwork({ active = true }: { active?: boolean }) {
  return <div data-artwork="mock" data-active={active} />;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  globalThis.IntersectionObserver = originalIntersectionObserver;
});

describe("ProjectThumbnail fallback visibility", () => {
  it("does not load clipped artwork, then loads a visible still", async () => {
    globalThis.IntersectionObserver =
      undefined as unknown as typeof IntersectionObserver;
    const frames = new Map<number, FrameRequestCallback>();
    let nextFrame = 0;
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      const id = ++nextFrame;
      frames.set(id, callback);
      return id;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
    const flushFrame = () =>
      act(() => {
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach((callback) => callback(0));
      });

    let stageTop = 600;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        if (this.classList.contains("os-page-content")) {
          return {
            top: 100,
            bottom: 400,
            left: 100,
            right: 500,
            width: 400,
            height: 300,
          } as DOMRect;
        }
        return {
          top: stageTop,
          bottom: stageTop + 136,
          left: 120,
          right: 420,
          width: 300,
          height: 136,
        } as DOMRect;
      },
    );
    const loadArtwork = vi
      .spyOn(artworkRegistry, "loadProjectArtwork")
      .mockResolvedValue(MockArtwork);

    const { container, unmount } = render(
      <div className="os-page-content">
        <ProjectThumbnail slug="gitswitch" />
      </div>,
    );
    flushFrame();

    // The stage is in the viewport but beyond the pane's preload margin.
    expect(container.querySelector("[data-project-art]")).toHaveAttribute(
      "data-preview-state",
      "pending",
    );
    expect(loadArtwork).not.toHaveBeenCalled();
    expect(container.querySelector("[data-artwork]")).toBeNull();

    stageTop = 200;
    fireEvent.scroll(window);
    flushFrame();

    await waitFor(() =>
      expect(container.querySelector('[data-artwork="mock"]')).toHaveAttribute(
        "data-active",
        "false",
      ),
    );
    expect(loadArtwork).toHaveBeenCalledOnce();
    expect(container.querySelector("[data-project-art]")).toHaveAttribute(
      "data-preview-state",
      "still",
    );

    unmount();
    expect(frames.size).toBe(0);
  });
});
