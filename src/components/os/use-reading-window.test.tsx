import { useRef } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useReadingWindow } from "./use-reading-window";
import { clampWindowRect, getWorkspaceBounds } from "./window-geometry";

let frames: Map<number, FrameRequestCallback>;
let nextFrame: number;
const mediaListeners = new Set<() => void>();

beforeEach(() => {
  frames = new Map();
  nextFrame = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    const id = ++nextFrame;
    frames.set(id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal(
    "PointerEvent",
    class extends MouseEvent {
      pointerId: number;
      isPrimary: boolean;
      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init);
        this.pointerId = init.pointerId ?? 1;
        this.isPrimary = init.isPrimary ?? true;
      }
    },
  );
  vi.spyOn(window, "innerWidth", "get").mockReturnValue(1280);
  vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    matches: window.innerWidth >= 1024 && window.innerHeight >= 600,
    media: query,
    onchange: null,
    addEventListener: (
      _: string,
      listener: EventListenerOrEventListenerObject,
    ) => mediaListeners.add(listener as () => void),
    removeEventListener: (
      _: string,
      listener: EventListenerOrEventListenerObject,
    ) => mediaListeners.delete(listener as () => void),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});
afterEach(() => {
  cleanup();
  mediaListeners.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function Harness({
  path = "/projects",
  active = true,
  initialFloating = false,
}: {
  path?: string;
  active?: boolean;
  initialFloating?: boolean;
}) {
  const content = useRef<HTMLElement>(null);
  const window = useReadingWindow(path, content, { active, initialFloating });
  return (
    <>
      <main
        ref={content}
        data-testid="pane"
        data-rect={JSON.stringify(window.rect)}
        data-minimized={String(window.minimized)}
      >
        <span
          data-testid="drag"
          onPointerDown={(event) => window.beginPointer(event, "move")}
          {...window.pointerHandlers}
        >
          Title
        </span>
      </main>
      <button onClick={() => window.move({ x: 24, y: 12 })}>Move</button>
      <button onClick={() => window.resize({ x: -80, y: -40 })}>Resize</button>
      <button onClick={window.maximize}>Maximize</button>
      <button onClick={window.restoreSize}>Restore size</button>
      <button onClick={window.reset}>Reset</button>
      <button onClick={window.minimize}>Minimize</button>
      <button onClick={window.restore}>Restore</button>
    </>
  );
}
function rect() {
  return JSON.parse(screen.getByTestId("pane").getAttribute("data-rect")!);
}
function flush() {
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(0));
  });
}
function pointerTarget() {
  const target = screen.getByTestId("drag");
  let captured = false;
  target.setPointerCapture = vi.fn(() => {
    captured = true;
  });
  target.hasPointerCapture = vi.fn(() => captured);
  target.releasePointerCapture = vi.fn(() => {
    captured = false;
  });
  return target;
}

function ReadingHarness({ active = true }: { active?: boolean }) {
  const content = useRef<HTMLElement>(null);
  const reading = useReadingWindow("/write-ups/reading-fixture", content, {
    active,
  });
  return (
    <>
      <main
        ref={content}
        data-testid="pane"
        data-rect={JSON.stringify(reading.rect)}
        data-minimized={String(reading.minimized)}
      >
        <header className="os-windowbar" data-testid="reading-toolbar">
          Reading fixture
        </header>
        <div
          className="os-page-content"
          data-testid="reading-content"
          onScroll={reading.onContentScroll}
        >
          <h1>Long article</h1>
          <p>A document that can be read in page flow or a floating pane.</p>
        </div>
      </main>
      <button onClick={() => reading.move({ x: 24, y: 12 })}>Move</button>
      <button onClick={reading.maximize}>Maximize</button>
      <button onClick={reading.restoreSize}>Restore size</button>
      <button onClick={reading.reset}>Reset</button>
      <button onClick={reading.minimize}>Minimize</button>
      <button onClick={reading.restore}>Restore</button>
    </>
  );
}

function mockReadingLayout() {
  let documentScroll = 500;
  const page = screen.getByTestId("reading-content");
  const toolbar = screen.getByTestId("reading-toolbar");
  vi.spyOn(window, "scrollY", "get").mockImplementation(() => documentScroll);
  const scrollTo = vi
    .spyOn(window, "scrollTo")
    .mockImplementation((options: number | ScrollToOptions) => {
      if (typeof options === "object" && options.top !== undefined) {
        documentScroll = options.top;
      }
    });
  // jsdom has no layout. Model the external reading surface, not the hook's
  // offset algorithm: content begins at document y=200, and chrome ends at115.
  vi.spyOn(page, "getBoundingClientRect").mockImplementation(() =>
    DOMRect.fromRect({
      x: 0,
      y: 200 - documentScroll,
      width: 1000,
      height: 2000,
    }),
  );
  vi.spyOn(toolbar, "getBoundingClientRect").mockImplementation(() =>
    DOMRect.fromRect({ x: 0, y: 58, width: 1000, height: 57 }),
  );
  return {
    page,
    scrollTo,
    scrollDocument(top: number) {
      documentScroll = top;
      fireEvent.scroll(window);
    },
  };
}

function changeViewportWidth(width: number) {
  vi.spyOn(window, "innerWidth", "get").mockReturnValue(width);
  act(() => {
    mediaListeners.forEach((listener) => listener());
    window.dispatchEvent(new Event("resize"));
  });
}

describe("reading window gesture lifecycle", () => {
  it("keeps a drag started on an inactive title when that pane is activated", () => {
    const view = render(<Harness active={false} />);
    const target = pointerTarget();
    fireEvent.pointerDown(target, {
      pointerId: 7,
      clientX: 100,
      clientY: 100,
      button: 0,
    });
    const start = rect();
    view.rerender(<Harness active />);
    fireEvent.pointerMove(target, { pointerId: 7, clientX: 125, clientY: 100 });
    fireEvent.pointerUp(target, { pointerId: 7, clientX: 120, clientY: 100 });
    expect(rect().x).toBe(start.x + 20);
    expect(target.releasePointerCapture).toHaveBeenCalledWith(7);
  });
  it("flushes the final release coordinate without waiting for a pending frame", () => {
    render(<Harness />);
    const target = pointerTarget();
    fireEvent.pointerDown(target, {
      pointerId: 7,
      clientX: 100,
      clientY: 100,
      button: 0,
    });
    const initial = rect();
    fireEvent.pointerMove(target, { pointerId: 7, clientX: 125, clientY: 100 });
    expect(rect()).toEqual(initial);
    fireEvent.pointerUp(target, { pointerId: 7, clientX: 120, clientY: 100 });
    expect(rect().x).toBe(initial.x + 20);
    expect(target.releasePointerCapture).toHaveBeenCalledWith(7);
    flush();
    expect(rect().x).toBe(initial.x + 20);
  });

  it.each(["pointercancel", "lostpointercapture", "blur", "Escape"])(
    "discards pending gesture work on %s",
    (interruption) => {
      render(<Harness />);
      const target = pointerTarget();
      fireEvent.pointerDown(target, {
        pointerId: 3,
        clientX: 100,
        clientY: 100,
        button: 0,
      });
      const initial = rect();
      fireEvent.pointerMove(target, {
        pointerId: 3,
        clientX: 155,
        clientY: 100,
      });
      if (interruption === "blur") fireEvent.blur(window);
      else if (interruption === "Escape")
        fireEvent.keyDown(target, { key: "Escape" });
      else
        fireEvent(
          target,
          new PointerEvent(interruption, { bubbles: true, pointerId: 3 }),
        );
      flush();
      expect(rect()).toEqual(initial);
      expect(target.releasePointerCapture).toHaveBeenCalledOnce();
    },
  );

  it("rejects unrelated pointers and restores geometry after minimize without queued drag work", () => {
    render(<Harness />);
    const target = pointerTarget();
    fireEvent.pointerDown(target, {
      pointerId: 3,
      clientX: 100,
      clientY: 100,
      button: 0,
    });
    const initial = rect();
    fireEvent.pointerMove(target, { pointerId: 4, clientX: 200, clientY: 200 });
    expect(frames.size).toBe(0);
    fireEvent.pointerMove(target, { pointerId: 3, clientX: 155, clientY: 100 });
    fireEvent.click(screen.getByText("Minimize"));
    flush();
    expect(screen.getByTestId("pane")).toHaveAttribute(
      "data-minimized",
      "true",
    );
    fireEvent.click(screen.getByText("Restore"));
    expect(rect()).toEqual(initial);
  });

  it("does not cancel capture for another pointer's cancellation or loss", () => {
    render(<Harness />);
    const target = pointerTarget();
    fireEvent.pointerDown(target, {
      pointerId: 3,
      clientX: 100,
      clientY: 100,
      button: 0,
    });
    const initial = rect();
    fireEvent.pointerMove(target, { pointerId: 3, clientX: 120, clientY: 100 });
    fireEvent(
      target,
      new PointerEvent("pointercancel", { bubbles: true, pointerId: 4 }),
    );
    fireEvent(
      target,
      new PointerEvent("lostpointercapture", { bubbles: true, pointerId: 4 }),
    );
    flush();
    expect(rect().x).toBe(initial.x + 20);
    expect(target.releasePointerCapture).not.toHaveBeenCalled();
  });

  it("cannot apply a queued old-route gesture to new route children", () => {
    const view = render(<Harness />);
    const target = pointerTarget();
    fireEvent.pointerDown(target, {
      pointerId: 3,
      clientX: 100,
      clientY: 100,
      button: 0,
    });
    fireEvent.pointerMove(target, { pointerId: 3, clientX: 155, clientY: 100 });
    view.rerender(<Harness path="/contact" />);
    flush();
    expect(rect()).toBeNull();
    expect(screen.getByTestId("pane")).toHaveAttribute(
      "data-minimized",
      "false",
    );
    expect(target.releasePointerCapture).toHaveBeenCalledOnce();
  });

  it("falls back to full-width phone reading and reclamps when desktop returns", () => {
    render(<Harness />);
    fireEvent.click(screen.getByText("Move"));
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(390);
    act(() => {
      mediaListeners.forEach((listener) => listener());
      window.dispatchEvent(new Event("resize"));
    });
    expect(rect()).toBeNull();
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1280);
    act(() => {
      mediaListeners.forEach((listener) => listener());
      window.dispatchEvent(new Event("resize"));
    });
    expect(rect().width).toBeGreaterThanOrEqual(760);
    expect(rect().x + rect().width).toBeLessThanOrEqual(1268);
  });

  it("cleans pointer capture and a pending frame on unmount", () => {
    const view = render(<Harness />);
    const target = pointerTarget();
    fireEvent.pointerDown(target, {
      pointerId: 3,
      clientX: 100,
      clientY: 100,
      button: 0,
    });
    fireEvent.pointerMove(target, { pointerId: 3, clientX: 155, clientY: 100 });
    view.unmount();
    expect(frames.size).toBe(0);
    expect(target.releasePointerCapture).toHaveBeenCalledOnce();
  });
});

describe("expanded window geometry", () => {
  it("restores custom size and position after repeated expansion and minimization", () => {
    render(<Harness initialFloating />);
    fireEvent.click(screen.getByRole("button", { name: "Move" }));
    fireEvent.click(screen.getByRole("button", { name: "Resize" }));
    const normal = rect();
    fireEvent.click(screen.getByRole("button", { name: "Maximize" }));
    const bounds = getWorkspaceBounds({ width: 1280, height: 800 });
    expect(rect()).toEqual({
      x: bounds.left,
      y: bounds.top,
      width: bounds.width,
      height: bounds.height,
    });
    fireEvent.click(screen.getByRole("button", { name: "Maximize" }));
    fireEvent.click(screen.getByRole("button", { name: "Minimize" }));
    fireEvent.click(screen.getByRole("button", { name: "Restore" }));
    fireEvent.click(screen.getByRole("button", { name: "Restore size" }));
    expect(rect()).toEqual(normal);
  });

  it("clamps the saved normal bounds to the live smaller desktop", () => {
    render(<Harness initialFloating />);
    fireEvent.click(screen.getByRole("button", { name: "Move" }));
    const normal = rect();
    fireEvent.click(screen.getByRole("button", { name: "Maximize" }));
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(600);
    changeViewportWidth(1024);
    fireEvent.click(screen.getByRole("button", { name: "Restore size" }));
    expect(rect()).toEqual(
      clampWindowRect(normal, { width: 1024, height: 600 }),
    );
    expect(rect().x + rect().width).toBeLessThanOrEqual(1012);
    expect(rect().y + rect().height).toBeLessThanOrEqual(544);
  });

  it.each(["Move", "Resize", "Reset"])(
    "invalidates the old expanded snapshot on %s",
    (action) => {
      render(<Harness initialFloating />);
      fireEvent.click(screen.getByRole("button", { name: "Maximize" }));
      fireEvent.click(screen.getByRole("button", { name: action }));
      const afterManualChange = rect();
      fireEvent.click(screen.getByRole("button", { name: "Restore size" }));
      expect(rect()).toEqual(afterManualChange);
    },
  );

  it("invalidates the old expanded snapshot after a captured pointer changes geometry", () => {
    render(<Harness initialFloating />);
    fireEvent.click(screen.getByRole("button", { name: "Maximize" }));
    const target = pointerTarget();
    fireEvent.pointerDown(target, {
      pointerId: 7,
      clientX: 100,
      clientY: 100,
      button: 0,
    });
    fireEvent.pointerUp(target, { pointerId: 7, clientX: 120, clientY: 100 });
    const afterPointer = rect();
    fireEvent.click(screen.getByRole("button", { name: "Restore size" }));
    expect(rect()).toEqual(afterPointer);
  });

  it("does not apply a previous document's saved bounds after navigation", () => {
    const view = render(<Harness initialFloating />);
    fireEvent.click(screen.getByRole("button", { name: "Move" }));
    fireEvent.click(screen.getByRole("button", { name: "Maximize" }));
    view.rerender(<Harness initialFloating path="/contact" />);
    const nextDocument = rect();
    fireEvent.click(screen.getByRole("button", { name: "Restore size" }));
    expect(rect()).toEqual(nextDocument);
  });

  it("does not create floating bounds on a phone or discard saved desktop bounds there", () => {
    render(<Harness initialFloating />);
    fireEvent.click(screen.getByRole("button", { name: "Move" }));
    const normal = rect();
    fireEvent.click(screen.getByRole("button", { name: "Maximize" }));
    changeViewportWidth(390);
    fireEvent.click(screen.getByRole("button", { name: "Restore size" }));
    fireEvent.click(screen.getByRole("button", { name: "Maximize" }));
    expect(rect()).toBeNull();
    changeViewportWidth(1280);
    fireEvent.click(screen.getByRole("button", { name: "Restore size" }));
    expect(rect()).toEqual(normal);
  });
});

describe("reading position across layout and visibility changes", () => {
  it("preserves progress made while expanded when the original geometry returns", () => {
    render(<ReadingHarness />);
    const { page, scrollTo } = mockReadingLayout();
    fireEvent.click(screen.getByRole("button", { name: "Move" }));
    const normal = rect();
    page.scrollTop = 275;
    fireEvent.scroll(page);
    fireEvent.click(screen.getByRole("button", { name: "Maximize" }));
    page.scrollTop = 330;
    fireEvent.scroll(page);
    fireEvent.click(screen.getByRole("button", { name: "Restore size" }));
    expect(rect()).toEqual(normal);
    expect(page.scrollTop).toBe(330);
    expect(scrollTo).not.toHaveBeenCalled();
  });
  it("preserves the reading point from document flow into a floating pane and back", () => {
    render(<ReadingHarness />);
    const { page, scrollTo } = mockReadingLayout();

    fireEvent.click(screen.getByRole("button", { name: "Move" }));
    expect(rect()).not.toBeNull();
    // At document scroll500, the first visible reading point is415px into content.
    expect(page.scrollTop).toBe(415);

    page.scrollTop = 275;
    fireEvent.scroll(page);
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(rect()).toBeNull();
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 360 });
    expect(page.getBoundingClientRect().top + 275).toBe(115);
  });

  it("restores the floating reading position after hidden DOM scroll was cleared", () => {
    render(<ReadingHarness />);
    const { page, scrollTo } = mockReadingLayout();
    fireEvent.click(screen.getByRole("button", { name: "Move" }));
    const floatingRect = rect();
    page.scrollTop = 275;
    fireEvent.scroll(page);

    fireEvent.click(screen.getByRole("button", { name: "Minimize" }));
    expect(screen.getByTestId("pane")).toHaveAttribute(
      "data-minimized",
      "true",
    );
    // A hidden browser surface may clear its offset; restoration must reapply it.
    page.scrollTop = 0;
    fireEvent.click(screen.getByRole("button", { name: "Restore" }));

    expect(screen.getByTestId("pane")).toHaveAttribute(
      "data-minimized",
      "false",
    );
    expect(rect()).toEqual(floatingRect);
    expect(page.scrollTop).toBe(275);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("keeps progress made in phone document flow when floating desktop returns", () => {
    render(<ReadingHarness />);
    const { page, scrollDocument } = mockReadingLayout();
    fireEvent.click(screen.getByRole("button", { name: "Move" }));
    page.scrollTop = 275;
    fireEvent.scroll(page);

    changeViewportWidth(390);
    expect(rect()).toBeNull();
    expect(window.scrollY).toBe(360);
    scrollDocument(800);

    changeViewportWidth(1280);
    expect(rect()).not.toBeNull();
    expect(page.scrollTop).toBe(715);
    expect(page.scrollTop).not.toBe(275);
  });

  it("restores a phone document's own reading point when an app becomes active again", () => {
    const view = render(<ReadingHarness />);
    const { scrollDocument } = mockReadingLayout();
    changeViewportWidth(390);
    scrollDocument(800);
    view.rerender(<ReadingHarness active={false} />);
    scrollDocument(150);
    view.rerender(<ReadingHarness active />);
    expect(window.scrollY).toBe(800);
  });
});
