// Dock origin (Win7 Aero edition). The pointer light is retired, so this file only
// records where a dock item was pressed. The window open animation in
// workspace-windows.css reads --dock-origin-x and --dock-origin-y, with a centred
// fallback. Only custom properties are written here, and no motion runs.
//
// The properties are set by one rule scoped to the windows, not on <html>: an inherited
// custom property changed on the root invalidates the style of every element in the
// document, which cost a full-page restyle on each dock press, right as a window opened.

export function mountSpotlight(): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  let rule: HTMLStyleElement | null = null;

  const onDockPress = (event: PointerEvent) => {
    if (!(event.target instanceof Element)) return;
    const dockItem = event.target.closest<HTMLElement>(".os-dock a[data-app]");
    if (!dockItem) return;
    const rect = dockItem.getBoundingClientRect();
    const percent = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    if (!rule) {
      rule = document.createElement("style");
      rule.dataset.dockOrigin = "";
      document.head.append(rule);
    }
    rule.textContent = `.os-window { --dock-origin-x: ${percent}%; --dock-origin-y: 100%; }`;
  };

  document.addEventListener("pointerdown", onDockPress, true);

  return () => {
    document.removeEventListener("pointerdown", onDockPress, true);
    rule?.remove();
    rule = null;
  };
}
