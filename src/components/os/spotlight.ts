// Showstopper pointer light (v2.0). One mount call adds two listeners:
// 1. The spotlight follows a fine mouse. It writes --mx and --my, relative to the
//    element, once per frame. It is off for touch and pen, for coarse pointers and
//    under reduced motion.
// 2. The dock origin is captured on every pointer press, so the window open
//    animation starts from the dock item that was pressed. It causes no motion,
//    so it is always mounted.
// Both listeners write custom properties only. Motion stays in the stylesheets.

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type Light = {
  readonly x: number;
  readonly y: number;
  readonly item: HTMLElement | null;
  readonly field: HTMLElement | null;
};

function matches(query: string): boolean {
  return typeof window.matchMedia === "function"
    ? window.matchMedia(query).matches
    : false;
}

// Position the light relative to the element's own box, in px.
function place(node: HTMLElement, x: number, y: number): void {
  const rect = node.getBoundingClientRect();
  node.style.setProperty("--mx", `${x - rect.left}px`);
  node.style.setProperty("--my", `${y - rect.top}px`);
}

export function mountSpotlight(): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const root = document.documentElement;
  let frame = 0;
  let latest: Light | null = null;

  const onDockPress = (event: PointerEvent) => {
    if (!(event.target instanceof Element)) return;
    const dockItem = event.target.closest<HTMLElement>(".os-dock a[data-app]");
    if (!dockItem) return;
    const rect = dockItem.getBoundingClientRect();
    const percent = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    root.style.setProperty("--dock-origin-x", `${percent}%`);
    root.style.setProperty("--dock-origin-y", "100%");
  };

  const paint = () => {
    frame = 0;
    if (!latest) return;
    const { x, y, item, field } = latest;
    if (item) place(item, x, y);
    if (field) place(field, x, y);
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    if (!(event.target instanceof Element)) return;
    const item = event.target.closest<HTMLElement>("[data-spotlight]");
    const field = event.target.closest<HTMLElement>("[data-spotlight-field]");
    if (!item && !field) return;
    latest = { x: event.clientX, y: event.clientY, item, field };
    if (!frame) frame = window.requestAnimationFrame(paint);
  };

  const spotlight =
    matches(FINE_POINTER_QUERY) && !matches(REDUCED_MOTION_QUERY);

  document.addEventListener("pointerdown", onDockPress, true);
  if (spotlight) {
    document.addEventListener("pointermove", onMove, { passive: true });
  }

  return () => {
    document.removeEventListener("pointerdown", onDockPress, true);
    document.removeEventListener("pointermove", onMove);
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    latest = null;
  };
}
