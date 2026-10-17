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
// Keep desktop reading panes wide enough until they gain container queries. 720px
// is the narrowest that still fits beside the icon column at 1024px (see
// createCascadedWindowRect).
export const WINDOW_MIN_WIDTH = 720;
export const WINDOW_MIN_HEIGHT = 240;
export const FLOATING_VIEWPORT_MIN_WIDTH = 1024;
export const FLOATING_VIEWPORT_MIN_HEIGHT = 600;

const EDGE_INSET = 12;
const HEADER_RESERVE = 64;
/** The Win7 taskbar (--win7-taskbar-h, 52px in win7-taskbar.css) plus a 4px gap, so frames
 * stop above it. Keep this in step with that token. */
const TASKBAR_RESERVE = 56;
/**
 * The desktop shortcut row (--os-footer-h, 48px in win7-desktop.css) sits 16px above the
 * taskbar and stays visible behind every window, so frames stop above it too.
 */
const FOOTER_RESERVE = 64;
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
  const bottom = Math.max(top, height - TASKBAR_RESERVE - FOOTER_RESERVE);

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

/** Each window opened on the desktop steps this far down and right of the one before it. */
export const CASCADE_STEP = 28;
/** Fallback for the desktop icon column's right edge when it cannot be measured. */
export const ICON_COLUMN_EDGE_FALLBACK = 240;
/** Clear space between the icon column and the first window. */
const ICON_COLUMN_GAP = 24;
const CASCADE_SLOTS = 6;
const PREFERRED_WIDTH = 1000;

/**
 * The first placement of a floating window. Each window starts CASCADE_STEP further
 * right and down than the one before, measured from the desktop icon column's right
 * edge plus a gutter, so no window opens over the icons. Its width shrinks to the room
 * left after that offset, and the result is clamped, so a short or narrow viewport still
 * keeps the window inside the work area.
 */
export function createCascadedWindowRect(
  viewport: WindowViewport,
  placement: number,
  iconColumnEdge: number = ICON_COLUMN_EDGE_FALLBACK,
): WindowRect {
  const bounds = getWorkspaceBounds(viewport);
  const defaults = createDefaultWindowRect(viewport);
  const minimumWidth = Math.min(WINDOW_MIN_WIDTH, bounds.width);
  const minimumLeft = Math.max(
    bounds.left,
    finiteOr(iconColumnEdge, ICON_COLUMN_EDGE_FALLBACK) + ICON_COLUMN_GAP,
  );
  const slot = Math.max(0, Math.floor(finiteOr(placement, 0))) % CASCADE_SLOTS;
  const offset = slot * CASCADE_STEP;
  const x = minimumLeft + offset;
  const width = clamp(
    Math.min(PREFERRED_WIDTH, defaults.width, bounds.right - x),
    minimumWidth,
    bounds.width,
  );
  const height = Math.max(WINDOW_MIN_HEIGHT, defaults.height - 32);

  return clampWindowRect(
    {
      x,
      y: bounds.top + 16 + offset,
      width,
      height,
    },
    viewport,
  );
}

/**
 * The old box, stretched to the new box's aspect ratio at the larger of the two factors.
 * A FLIP from this box scales uniformly, so text and screenshots keep their proportions while
 * the frame moves. Only the transform is animated; the new box is committed at once.
 */
export function createUniformFlipOrigin(
  from: WindowRect,
  to: WindowRect,
): WindowRect {
  if (
    !Number.isFinite(from.x) ||
    !Number.isFinite(from.y) ||
    from.width <= 0 ||
    from.height <= 0 ||
    to.width <= 0 ||
    to.height <= 0
  )
    return from;
  const factor = Math.max(from.width / to.width, from.height / to.height);
  return {
    x: from.x,
    y: from.y,
    width: to.width * factor,
    height: to.height * factor,
  };
}

/**
 * The transform that maps a window's new box back onto its old one, for a FLIP
 * animation with a top-left origin. Only transform is animated; the size is committed at
 * once. Returns null when nothing visibly moves or a rectangle is not usable.
 */
export function createFlipTransform(
  from: WindowRect,
  to: WindowRect,
): string | null {
  const values = [from, to].flatMap((rect) => [
    rect.x,
    rect.y,
    rect.width,
    rect.height,
  ]);
  if (
    !values.every((value) => Number.isFinite(value)) ||
    from.width <= 0 ||
    from.height <= 0 ||
    to.width <= 0 ||
    to.height <= 0
  )
    return null;
  const scaleX = from.width / to.width;
  const scaleY = from.height / to.height;
  const dx = from.x - to.x;
  const dy = from.y - to.y;
  if (
    Math.abs(dx) < 0.5 &&
    Math.abs(dy) < 0.5 &&
    Math.abs(scaleX - 1) < 0.001 &&
    Math.abs(scaleY - 1) < 0.001
  )
    return null;
  return `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
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
