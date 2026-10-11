export interface WindowRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface WindowViewport {
  readonly width: number;
  readonly height: number;
}

/** Pointer and keyboard movement use physical CSS pixels, including in RTL. */
export interface WindowDelta {
  readonly x: number;
  readonly y: number;
}

export interface WorkspaceBounds {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
}

// Existing document grids respond to the viewport rather than their container.
// Keep desktop reading panes wide enough until they gain container queries.
export const WINDOW_MIN_WIDTH = 760;
export const WINDOW_MIN_HEIGHT = 240;
export const FLOATING_VIEWPORT_MIN_WIDTH = 1024;
export const FLOATING_VIEWPORT_MIN_HEIGHT = 600;

const EDGE_INSET = 12;
const HEADER_RESERVE = 64;
const DOCK_RESERVE = 110;
const DEFAULT_WIDTH = 1190;
const DEFAULT_HEIGHT = 720;

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function canFloatWindows(viewport: WindowViewport): boolean {
  return (
    Number.isFinite(viewport.width) &&
    Number.isFinite(viewport.height) &&
    viewport.width >= FLOATING_VIEWPORT_MIN_WIDTH &&
    viewport.height >= FLOATING_VIEWPORT_MIN_HEIGHT
  );
}

export function getWorkspaceBounds(viewport: WindowViewport): WorkspaceBounds {
  const width = Math.max(0, finiteOr(viewport.width, 0));
  const height = Math.max(0, finiteOr(viewport.height, 0));
  // Tiny or unavailable viewports collapse the usable area instead of creating
  // negative dimensions or guessing a screen size during hydration.
  const left = Math.min(EDGE_INSET, width / 2);
  const top = Math.min(HEADER_RESERVE, height);
  const right = Math.max(left, width - EDGE_INSET);
  const bottom = Math.max(top, height - DOCK_RESERVE);

  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}

export function createDefaultWindowRect(viewport: WindowViewport): WindowRect {
  const bounds = getWorkspaceBounds(viewport);
  const width = Math.min(DEFAULT_WIDTH, bounds.width);
  const height = Math.min(DEFAULT_HEIGHT, bounds.height);

  return {
    x: bounds.left + (bounds.width - width) / 2,
    y: bounds.top + (bounds.height - height) / 2,
    width,
    height,
  };
}

/** Use after viewport changes and before trusting persisted geometry. */
export function clampWindowRect(
  rect: WindowRect,
  viewport: WindowViewport,
): WindowRect {
  const bounds = getWorkspaceBounds(viewport);
  const defaults = createDefaultWindowRect(viewport);
  const width = clamp(
    finiteOr(rect.width, defaults.width),
    Math.min(WINDOW_MIN_WIDTH, bounds.width),
    bounds.width,
  );
  const height = clamp(
    finiteOr(rect.height, defaults.height),
    Math.min(WINDOW_MIN_HEIGHT, bounds.height),
    bounds.height,
  );

  return {
    x: clamp(
      finiteOr(rect.x, bounds.left + (bounds.width - width) / 2),
      bounds.left,
      bounds.right - width,
    ),
    y: clamp(
      finiteOr(rect.y, bounds.top + (bounds.height - height) / 2),
      bounds.top,
      bounds.bottom - height,
    ),
    width,
    height,
  };
}

/** Deltas are relative to the gesture's starting rectangle, not its last frame. */
export function moveWindowRect(
  rect: WindowRect,
  delta: WindowDelta,
  viewport: WindowViewport,
): WindowRect {
  const start = clampWindowRect(rect, viewport);
  const bounds = getWorkspaceBounds(viewport);

  return {
    ...start,
    // Saturate even when adding two valid finite numbers overflows to infinity.
    x: clamp(
      start.x + finiteOr(delta.x, 0),
      bounds.left,
      bounds.right - start.width,
    ),
    y: clamp(
      start.y + finiteOr(delta.y, 0),
      bounds.top,
      bounds.bottom - start.height,
    ),
  };
}

/** Resize from the southeast corner while keeping the top-left anchor stable. */
export function resizeWindowRect(
  rect: WindowRect,
  delta: WindowDelta,
  viewport: WindowViewport,
): WindowRect {
  const start = clampWindowRect(rect, viewport);
  const bounds = getWorkspaceBounds(viewport);

  return {
    ...start,
    width: clamp(
      start.width + finiteOr(delta.x, 0),
      Math.min(WINDOW_MIN_WIDTH, bounds.width),
      bounds.right - start.x,
    ),
    height: clamp(
      start.height + finiteOr(delta.y, 0),
      Math.min(WINDOW_MIN_HEIGHT, bounds.height),
      bounds.bottom - start.y,
    ),
  };
}
