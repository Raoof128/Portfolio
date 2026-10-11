/** Execute with the documented Codex CUA tab API, not an external browser driver. */
export async function verifyResearchOSWorkspace(tab, origin) {
  const address = new URL(origin);
  if (!["127.0.0.1", "localhost"].includes(address.hostname))
    throw new Error("Use a local preview origin");
  const evidence = [];
  const assert = (condition, description) => {
    if (!condition) throw new Error(description);
    evidence.push({ description, passed: true });
  };
  const observe = async () => {
    await tab.getAXState({ emit: false });
  };
  const read = () =>
    tab.playwright.evaluate(() => {
      const panes = [...document.querySelectorAll("[data-window-path]")].map(
        (pane) => {
          const rect = pane.getBoundingClientRect();
          const search = pane.querySelector(".os-explorer-search input");
          return {
            path: pane.dataset.windowPath,
            active: pane.dataset.active === "true",
            hidden: pane.hidden,
            query: search?.value,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          };
        },
      );
      const ids = [...document.querySelectorAll("[id]")].map(
        (element) => element.id,
      );
      return {
        path: location.pathname,
        width: innerWidth,
        height: innerHeight,
        panes,
        duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
        focusTag: document.activeElement?.tagName,
        panelCount: document.querySelectorAll(".os-window-controls-panel")
          .length,
      };
    });
  if ((await tab.url()) === `${origin}/projects`) await tab.reload();
  else await tab.goto(`${origin}/projects`);
  await observe();
  await tab.playwright
    .locator('[data-window-path="/projects"]')
    .waitFor({ state: "visible" });
  await tab.playwright
    .getByRole("searchbox", { name: "Search projects", exact: true })
    .fill("zurvan");
  await observe();
  await tab.playwright
    .getByRole("navigation", { name: "Portfolio applications", exact: true })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await observe();
  await tab.playwright
    .locator('[data-window-path="/about"]')
    .waitFor({ state: "visible" });
  let state = await read();
  assert(
    state.path === "/about" && state.panes.length === 2,
    "Opening About retains the Projects app",
  );
  assert(
    state.panes.find((pane) => pane.path === "/projects")?.query === "zurvan",
    "Inactive project search remains intact",
  );
  assert(
    state.duplicateIds.length === 0,
    "Two retained apps have unique DOM IDs",
  );
  await tab.playwright
    .getByRole("navigation", { name: "Portfolio applications", exact: true })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await observe();
  state = await read();
  assert(
    state.path === "/projects" &&
      state.panes.find((pane) => pane.path === "/projects")?.active,
    "Dock activation raises the retained app and updates its URL",
  );
  assert(
    state.panes.find((pane) => pane.path === "/projects")?.query === "zurvan",
    "Revisiting preserves the query",
  );
  await tab.playwright
    .locator('#main-content summary[aria-label="Window controls"]')
    .click();
  await observe();
  await tab.playwright
    .getByRole("button", { name: "Decrease height", exact: true })
    .click();
  await tab.playwright
    .getByRole("button", { name: "Move down", exact: true })
    .click();
  await observe();
  state = await read();
  const active = state.panes.find((pane) => pane.active);
  assert(
    active &&
      active.x >= 12 &&
      active.y >= 64 &&
      active.x + active.width <= state.width - 12.1 + 0.2 &&
      active.y + active.height <= state.height - 110.1 + 0.2,
    "Step controls keep the reading window within safe bounds",
  );
  await tab.playwright
    .getByRole("button", { name: "Done", exact: true })
    .click();
  await tab.playwright
    .locator("#main-content")
    .getByRole("button", { name: "Minimize", exact: true })
    .click();
  await observe();
  state = await read();
  assert(
    state.panes.find((pane) => pane.path === "/projects")?.hidden,
    "Minimize hides only the requested pane",
  );
  assert(state.panelCount === 0, "Minimize leaves no detached control portal");
  await tab.playwright
    .locator('.os-open-windows [data-window-id="/projects"]')
    .click();
  await observe();
  state = await read();
  assert(
    !state.panes.find((pane) => pane.path === "/projects")?.hidden &&
      state.panes.find((pane) => pane.path === "/projects")?.query === "zurvan",
    "Task restoration retains filters and content",
  );
  await tab.playwright
    .locator("#main-content")
    .getByRole("button", { name: "Close", exact: true })
    .click();
  await observe();
  state = await read();
  assert(
    state.path === "/about" &&
      state.panes.length === 1 &&
      state.panes[0].path === "/about",
    "Close disposes one app and navigates to the surviving app",
  );
  assert(state.duplicateIds.length === 0, "Remaining app has unique DOM IDs");
  return {
    origin,
    viewport: { width: state.width, height: state.height },
    evidence,
  };
}
