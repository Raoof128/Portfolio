import { afterEach, describe, expect, it } from "vitest";
import { mountSpotlight } from "./spotlight";

describe("dock origin for the window open animation", () => {
  let unmount: () => void = () => {};
  afterEach(() => {
    unmount();
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("style");
  });

  function pressDockItem(left: number, width: number) {
    document.body.innerHTML =
      '<nav class="os-dock"><a data-app="projects" href="/projects"><span>Projects</span></a></nav>';
    const item = document.querySelector<HTMLElement>("a[data-app]")!;
    item.getBoundingClientRect = () =>
      ({ left, width, top: 0, bottom: 40, right: left + width, height: 40 }) as DOMRect;
    item
      .querySelector("span")!
      .dispatchEvent(new Event("pointerdown", { bubbles: true }));
  }

  it("scopes the origin to windows instead of restyling the whole document", () => {
    unmount = mountSpotlight();
    pressDockItem(window.innerWidth / 4 - 20, 40);
    // An inherited custom property on <html> invalidates every element's style on each press.
    expect(document.documentElement.style.getPropertyValue("--dock-origin-x")).toBe("");
    const rule = document.querySelector("style[data-dock-origin]")?.textContent ?? "";
    expect(rule).toMatch(/\.os-window\s*\{/);
    expect(rule).toContain("--dock-origin-x: 25%");
  });

  it("removes its rule when unmounted", () => {
    unmount = mountSpotlight();
    pressDockItem(0, 40);
    unmount();
    unmount = () => {};
    expect(document.querySelector("style[data-dock-origin]")).toBeNull();
  });
});
