// Dock origin (Win7 Aero edition). The pointer light is retired, so this file only
// records where a dock item was pressed. The window open animation in
// workspace-windows.css reads --dock-origin-x and --dock-origin-y, with a centred
// fallback. Only custom properties are written here, and no motion runs.

export function mountSpotlight(): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const root = document.documentElement;

  const onDockPress = (event: PointerEvent) => {
    if (!(event.target instanceof Element)) return;
    const dockItem = event.target.closest<HTMLElement>(".os-dock a[data-app]");
    if (!dockItem) return;
    const rect = dockItem.getBoundingClientRect();
    const percent = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    root.style.setProperty("--dock-origin-x", `${percent}%`);
    root.style.setProperty("--dock-origin-y", "100%");
  };

  document.addEventListener("pointerdown", onDockPress, true);

  return () => {
    document.removeEventListener("pointerdown", onDockPress, true);
  };
}
