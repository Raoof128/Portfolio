export interface CanvasPlayback {
  setActive(active: boolean): void;
  dispose(): void;
}

/** Keep a complete still frame while stopping all work the reader cannot see. */
export function createCanvasPlayback(
  canvas: HTMLCanvasElement,
  render: (timestamp: number, step: number) => void,
  resize?: () => void,
): CanvasPlayback {
  let active = false;
  let visible = typeof IntersectionObserver === "undefined";
  let disposed = false;
  let frameId: number | null = null;
  let previousTimestamp: number | null = null;
  const reducedMotion =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

  const shouldPlay = () =>
    active && visible && !document.hidden && !reducedMotion?.matches;

  function stop() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    previousTimestamp = null;
  }

  function tick(timestamp: number) {
    frameId = null;
    if (disposed || !shouldPlay()) return;
    // Preserve the original 60Hz pace on faster displays without dropping frames.
    const step =
      previousTimestamp === null
        ? 1
        : Math.min(
            2,
            Math.max(0, (timestamp - previousTimestamp) / (1000 / 60)),
          );
    previousTimestamp = timestamp;
    render(timestamp, step);
    frameId = requestAnimationFrame(tick);
  }

  function sync() {
    if (disposed) return;
    if (!shouldPlay()) stop();
    else if (frameId === null) frameId = requestAnimationFrame(tick);
  }

  function onResize() {
    if (disposed) return;
    resize?.();
    // Resizing clears a canvas. Redraw once even when playback is paused.
    render(performance.now(), 0);
  }

  const intersection =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          ([entry]) => {
            visible = Boolean(entry?.isIntersecting);
            sync();
          },
          { threshold: 0 },
        );
  const resizeObserver =
    resize && typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(onResize)
      : null;

  intersection?.observe(canvas);
  if (resizeObserver) resizeObserver.observe(canvas.parentElement ?? canvas);
  if (resize) window.addEventListener("resize", onResize, { passive: true });
  // A restored 2D context comes back blank at default scale; rebuild it.
  canvas.addEventListener("contextrestored", onResize);
  document.addEventListener("visibilitychange", sync);
  reducedMotion?.addEventListener("change", sync);
  onResize();

  return {
    setActive(nextActive) {
      active = nextActive;
      sync();
    },
    dispose() {
      disposed = true;
      stop();
      intersection?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("contextrestored", onResize);
      document.removeEventListener("visibilitychange", sync);
      reducedMotion?.removeEventListener("change", sync);
    },
  };
}
