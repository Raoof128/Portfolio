"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
  type RefObject,
} from "react";
import {
  canFloatWindows,
  clampWindowRect,
  createDefaultWindowRect,
  getWorkspaceBounds,
  moveWindowRect,
  resizeWindowRect,
  type WindowDelta,
  type WindowRect,
} from "./window-geometry";

const desktopQuery = "(min-width: 1024px) and (min-height: 600px)";
const subscribeDesktop = (notify: () => void) => {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const readDesktop = () => window.matchMedia(desktopQuery).matches;
const serverDesktop = () => false;
const viewport = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

type WindowState = {
  path: string;
  minimized: boolean;
  rect: WindowRect | null;
};
type Gesture = {
  pointerId: number;
  target: HTMLElement;
  operation: "move" | "resize";
  start: WindowRect;
  x: number;
  y: number;
  moved: boolean;
};

function readReadingOffset(document: HTMLElement | null, floating: boolean) {
  const page = document?.querySelector<HTMLElement>(".os-page-content");
  const bar = document?.querySelector<HTMLElement>(".os-windowbar");
  if (!page || !bar) return null;
  return floating
    ? page.scrollTop
    : Math.max(
        0,
        bar.getBoundingClientRect().bottom - page.getBoundingClientRect().top,
      );
}

/** Keep a reading document mounted during minimization; geometry is session-only. */
export function useReadingWindow(
  path: string,
  content: RefObject<HTMLElement | null>,
  options: {
    readonly active?: boolean;
    readonly initialFloating?: boolean;
    readonly initialReadingOffset?: number;
    readonly placement?: number;
    /** Runs once a pointer gesture actually moves; a plain press never fires it. */
    readonly onGesture?: () => void;
  } = {},
) {
  const active = options.active ?? true;
  const onGesture = useRef(options.onGesture);
  useEffect(() => {
    onGesture.current = options.onGesture;
  });
  const [state, setState] = useState<WindowState>({
    path,
    minimized: false,
    rect: null,
  });
  // Route children are a live Next.js outlet, not immutable app snapshots.
  // Never apply the previous document's hidden state or geometry to a new route.
  if (state.path !== path) setState({ path, minimized: false, rect: null });
  const current =
    state.path === path ? state : { path, minimized: false, rect: null };
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    readDesktop,
    serverDesktop,
  );
  const gesture = useRef<Gesture | null>(null);
  const frame = useRef<number | null>(null);
  const pending = useRef<WindowRect | null>(null);
  const preMaximizeRect = useRef<{ path: string; rect: WindowRect } | null>(
    null,
  );
  const readingOffset = useRef(options.initialReadingOffset ?? 0);
  const previousLayout = useRef({
    path,
    floating: false,
    minimized: false,
    active,
  });
  const floating = desktop && current.rect !== null;

  useEffect(() => {
    // A route-owned hook may be reused for another document. Its saved normal
    // bounds belong only to the previous document, unlike a retained app hook.
    if (preMaximizeRect.current?.path !== path) preMaximizeRect.current = null;
  }, [path]);

  function rememberOffset() {
    const offset = readReadingOffset(content.current, floating);
    if (offset !== null) readingOffset.current = offset;
  }

  useEffect(() => {
    if (floating || current.minimized || !active) return;
    const onDocumentScroll = () => {
      const offset = readReadingOffset(content.current, false);
      if (offset !== null) readingOffset.current = offset;
    };
    window.addEventListener("scroll", onDocumentScroll, { passive: true });
    return () => window.removeEventListener("scroll", onDocumentScroll);
  }, [floating, current.minimized, content, active]);

  useLayoutEffect(() => {
    const previous = previousLayout.current;
    const page =
      content.current?.querySelector<HTMLElement>(".os-page-content");
    if (
      previous.path === path &&
      active &&
      !current.minimized &&
      page &&
      (previous.floating !== floating || previous.minimized || !previous.active)
    ) {
      if (floating) page.scrollTop = readingOffset.current;
      else {
        const barHeight =
          content.current
            ?.querySelector<HTMLElement>(".os-windowbar")
            ?.getBoundingClientRect().height ?? 57;
        window.scrollTo({
          top: Math.max(
            0,
            page.getBoundingClientRect().top +
              window.scrollY +
              readingOffset.current -
              58 -
              barHeight,
          ),
        });
      }
    }
    previousLayout.current = {
      path,
      floating,
      minimized: current.minimized,
      active,
    };
  }, [path, floating, current.minimized, content, active]);

  if (options.initialFloating && desktop && !current.rect) {
    const area = viewport();
    const base = createDefaultWindowRect(area);
    const offset = ((options.placement ?? 0) % 5) * 20;
    const width = Math.min(1000, base.width);
    const height = Math.max(240, base.height - 32);
    setState({
      path,
      minimized: current.minimized,
      rect: clampWindowRect(
        {
          x: (area.width - width) / 2 + offset,
          y: base.y + 16 + offset,
          width,
          height,
        },
        area,
      ),
    });
  }

  const stopGesture = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    pending.current = null;
    const previous = gesture.current;
    gesture.current = null;
    if (previous?.target.hasPointerCapture?.(previous.pointerId)) {
      try {
        previous.target.releasePointerCapture(previous.pointerId);
      } catch {
        // A disconnected element or an already-ended pointer needs no release.
      }
    }
  }, []);

  useEffect(() => {
    // Navigating, locking/minimizing, switching to phone layout or unmounting
    // interrupts capture and discards work queued for the previous document.
    return stopGesture;
  }, [path, desktop, current.minimized, stopGesture]);

  useEffect(() => {
    // Activating a background title may start a new drag in the same event.
    // Only deactivation cancels it; activation must not release that capture.
    if (!active) stopGesture();
  }, [active, stopGesture]);

  useEffect(() => {
    const onResize = () => {
      stopGesture();
      setState((value) =>
        value.rect
          ? { ...value, rect: clampWindowRect(value.rect, viewport()) }
          : value,
      );
    };
    const onBlur = () => stopGesture();
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (gesture.current && event.key === "Escape" && !event.isComposing) {
        event.preventDefault();
        event.stopImmediatePropagation();
        stopGesture();
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("blur", onBlur);
    // Capture Escape before the route shell interprets it as a close action.
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [stopGesture]);

  function initialRect() {
    if (current.rect) return clampWindowRect(current.rect, viewport());
    rememberOffset();
    const box = content.current?.getBoundingClientRect();
    return box && box.width > 0
      ? clampWindowRect(
          { x: box.x, y: box.y, width: box.width, height: box.height },
          viewport(),
        )
      : createDefaultWindowRect(viewport());
  }

  function step(operation: "move" | "resize", delta: WindowDelta) {
    if (!desktop || !canFloatWindows(viewport())) return;
    stopGesture();
    preMaximizeRect.current = null;
    const initial = initialRect();
    setState((value) => ({
      path,
      minimized: false,
      rect: (operation === "move" ? moveWindowRect : resizeWindowRect)(
        value.path === path && value.rect ? value.rect : initial,
        delta,
        viewport(),
      ),
    }));
  }

  function beginPointer(
    event: PointerEvent<HTMLElement>,
    operation: "move" | "resize",
  ) {
    if (
      !desktop ||
      !canFloatWindows(viewport()) ||
      event.button !== 0 ||
      event.isPrimary === false ||
      gesture.current
    )
      return;
    const start = initialRect();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // The pointer ended before capture; keyboard and step controls still work.
      return;
    }
    event.preventDefault();
    gesture.current = {
      pointerId: event.pointerId,
      target: event.currentTarget,
      operation,
      start,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
    setState({ path, minimized: false, rect: start });
  }

  function updatePointer(event: PointerEvent<HTMLElement>) {
    const active = gesture.current;
    if (!active || event.pointerId !== active.pointerId) return;
    const delta = { x: event.clientX - active.x, y: event.clientY - active.y };
    if (!active.moved) {
      // A press without movement is a click: keep the saved normal bounds.
      if (delta.x === 0 && delta.y === 0) return;
      active.moved = true;
      preMaximizeRect.current = null;
      onGesture.current?.();
    }
    pending.current = (
      active.operation === "move" ? moveWindowRect : resizeWindowRect
    )(active.start, delta, viewport());
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const rect = pending.current;
      pending.current = null;
      if (rect && gesture.current) setState({ path, minimized: false, rect });
    });
  }

  function endPointer(event: PointerEvent<HTMLElement>) {
    if (gesture.current?.pointerId !== event.pointerId) return;
    // Commit the release coordinate even if the final animation frame is pending.
    updatePointer(event);
    if (pending.current)
      setState({ path, minimized: false, rect: pending.current });
    stopGesture();
  }

  function cancelPointer(event: PointerEvent<HTMLElement>) {
    if (gesture.current?.pointerId === event.pointerId) stopGesture();
  }

  return {
    minimized: current.minimized,
    rect: desktop ? current.rect : null,
    desktop,
    minimize: () => {
      rememberOffset();
      stopGesture();
      setState({ ...current, minimized: true });
    },
    restore: () => setState({ ...current, minimized: false }),
    reset: () => {
      rememberOffset();
      stopGesture();
      preMaximizeRect.current = null;
      setState({ path, minimized: false, rect: null });
    },
    maximize: () => {
      if (!desktop || !canFloatWindows(viewport())) return;
      rememberOffset();
      stopGesture();
      // Repeated expand requests must not replace the reader's original bounds
      // with the maximized rectangle. Minimize/lock leave this snapshot intact.
      if (preMaximizeRect.current?.path !== path) {
        preMaximizeRect.current = { path, rect: initialRect() };
      }
      const bounds = getWorkspaceBounds(viewport());
      setState({
        path,
        minimized: false,
        rect: {
          x: bounds.left,
          y: bounds.top,
          width: bounds.width,
          height: bounds.height,
        },
      });
    },
    restoreSize: () => {
      if (!desktop || !canFloatWindows(viewport())) return;
      const saved = preMaximizeRect.current;
      if (!saved || saved.path !== path) return;
      rememberOffset();
      stopGesture();
      preMaximizeRect.current = null;
      // The display may have shrunk while this app was expanded or minimized.
      setState({
        path,
        minimized: false,
        rect: clampWindowRect(saved.rect, viewport()),
      });
    },
    move: (delta: WindowDelta) => step("move", delta),
    resize: (delta: WindowDelta) => step("resize", delta),
    beginPointer,
    pointerHandlers: {
      onPointerMove: updatePointer,
      onPointerUp: endPointer,
      onPointerCancel: cancelPointer,
      onLostPointerCapture: cancelPointer,
    },
    onContentScroll: () => rememberOffset(),
    stopGesture,
  };
}
