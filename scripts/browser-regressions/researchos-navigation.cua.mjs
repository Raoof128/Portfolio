/**
 * Run with a fresh, caller-owned CUA tab at a desktop viewport (1024×600 minimum).
 * The caller saves the returned evidence and closes its tab; this module changes
 * no browser preferences and never creates a browser or an external request.
 */
export async function verifyResearchOSNavigation(tab, origin) {
  const address = new URL(origin);
  if (
    !["http:", "https:"].includes(address.protocol) ||
    !["127.0.0.1", "localhost"].includes(address.hostname) ||
    address.username ||
    address.password ||
    address.pathname !== "/" ||
    address.search ||
    address.hash
  ) {
    throw new Error("Use a bare local preview origin");
  }
  const base = address.origin;
  const evidence = [];
  const observations = [];
  let stage = "initial route";
  const assert = (condition, description, detail) => {
    if (!condition)
      throw new Error(`${description}: ${JSON.stringify(detail)}`);
    evidence.push({ description, passed: true });
  };
  const observe = () => tab.getAXState({ emit: false });
  const pane = (path) =>
    tab.playwright.locator(
      `[data-window-path="${path}"][data-active="true"]:not([hidden])`,
    );
  const waitForPane = async (path) => {
    await pane(path).waitFor({ state: "visible", timeoutMs: 15000 });
    await observe();
  };
  const read = () =>
    tab.playwright.evaluate(() => {
      const visible = (element) =>
        !element.closest('[hidden], [inert], [aria-hidden="true"]') &&
        getComputedStyle(element).display !== "none" &&
        element.getBoundingClientRect().height > 0;
      const ids = [...document.querySelectorAll("[id]")].map((item) => item.id);
      const panes = [...document.querySelectorAll("[data-window-path]")].map(
        (element) => {
          const rect = element.getBoundingClientRect();
          const content = element.querySelector(".os-page-content");
          const anchor = element.querySelector('[id$="research-publications"]');
          const pageRect = content?.getBoundingClientRect();
          const anchorRect = anchor?.getBoundingClientRect();
          return {
            path: element.dataset.windowPath,
            active: element.dataset.active === "true",
            hidden: element.hidden,
            heading: element.querySelector("h1")?.textContent?.trim(),
            rect: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
            contentOffset: content?.scrollTop ?? null,
            contentHeight: content?.clientHeight ?? null,
            publicationAnchor:
              anchorRect && pageRect
                ? {
                    top: anchorRect.top - pageRect.top,
                    height: anchorRect.height,
                  }
                : null,
          };
        },
      );
      return {
        path: location.pathname,
        hash: location.hash,
        viewport: { width: innerWidth, height: innerHeight },
        panes,
        mainCount: [...document.querySelectorAll('main, [role="main"]')].filter(
          visible,
        ).length,
        duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
        dialogOpen: Boolean(document.querySelector(".os-search-dialog[open]")),
      };
    });
  const check = async (description, path) => {
    const state = await read();
    observations.push({ description, ...state });
    assert(state.path === path, `${description}: route`, state);
    assert(state.mainCount === 1, `${description}: one accessible main`, state);
    assert(!state.duplicateIds.length, `${description}: unique IDs`, state);
    const active = state.panes.find((item) => item.active && !item.hidden);
    assert(
      active?.path === path && active.heading,
      `${description}: active app`,
      state,
    );
    return { state, active };
  };
  const dock = () =>
    tab.playwright.getByRole("navigation", {
      name: "Portfolio applications",
      exact: true,
    });
  const searchFor = async (query, href) => {
    await tab.playwright
      .getByRole("button", { name: "Search (Ctrl / ⌘ K)", exact: true })
      .click();
    await observe();
    const dialog = tab.playwright.getByRole("dialog", {
      name: "Search",
      exact: true,
    });
    await dialog
      .getByRole("searchbox", {
        name: "Search projects, papers, and writing",
        exact: true,
      })
      .fill(query);
    await observe();
    const result = dialog
      .getByRole("link")
      .and(dialog.locator(`a[href="${href}"]`));
    await result.waitFor({ state: "visible", timeoutMs: 15000 });
    assert((await result.count()) === 1, "Search result is unambiguous", {
      query,
    });
    await result.click();
    await observe();
  };
  const near = (a, b) =>
    Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 2;
  const sameRect = (a, b) =>
    ["x", "y", "width", "height"].every((key) => near(a[key], b[key]));
  try {
    // A deliberate fresh navigation resets the registry, making history finite.
    if ((await tab.url()) === `${base}/write-ups`) await tab.reload();
    else await tab.goto(`${base}/write-ups`);
    await waitForPane("/write-ups");
    const seeded = await check("Fresh Research", "/write-ups");
    assert(
      seeded.state.panes.length === 1,
      "Fresh route has one registered app",
      seeded.state,
    );
    assert(
      seeded.state.viewport.width >= 1024 &&
        seeded.state.viewport.height >= 600,
      "Desktop viewport supports floating geometry",
      seeded.state.viewport,
    );

    stage = "retained fragment navigation";
    await dock().getByRole("link", { name: "About", exact: true }).click();
    await waitForPane("/about");
    await check("Research to About", "/about");
    await searchFor("publications", "/write-ups#research-publications");
    await waitForPane("/write-ups");
    const publication = await check(
      "Search opens retained Publications",
      "/write-ups",
    );
    assert(
      publication.state.hash === "#research-publications",
      "Publication URL keeps its fragment",
      publication.state,
    );
    assert(
      publication.state.panes.length === 2,
      "Fragment activation reuses the two retained apps",
      publication.state,
    );
    assert(
      publication.active.publicationAnchor &&
        publication.active.publicationAnchor.top >= -2 &&
        publication.active.publicationAnchor.top <
          publication.active.contentHeight,
      "Publication anchor is inside its reading viewport",
      publication.active,
    );
    assert(
      publication.active.contentOffset > 0,
      "Publication navigation moves the retained content",
      publication.active,
    );

    stage = "cached minimized current-app search restoration";
    await pane("/write-ups")
      .getByRole("button", { name: "Minimize", exact: true })
      .click();
    await observe();
    const minimized = await read();
    observations.push({ description: "Minimized Research", ...minimized });
    assert(
      minimized.path === "/write-ups" &&
        minimized.hash === publication.state.hash &&
        minimized.panes.find((item) => item.path === "/write-ups")?.hidden,
      "Minimize preserves the current URL and retains its app",
      minimized,
    );
    await searchFor("Research", "/write-ups");
    await waitForPane("/write-ups");
    const restored = await check(
      "Search restores cached current app",
      "/write-ups",
    );
    assert(
      restored.state.panes.length === 2 && !restored.state.dialogOpen,
      "Search restoration closes the dialog without duplicating apps",
      restored.state,
    );
    assert(
      restored.state.hash === publication.state.hash &&
        near(restored.active.contentOffset, publication.active.contentOffset),
      "Cached restoration preserves fragment and reading offset",
      restored.active,
    );

    stage = "browser history";
    await tab.back();
    await tab.playwright.waitForURL(`${base}/about`, { timeoutMs: 15000 });
    await waitForPane("/about");
    const back = await check("Browser Back restores About", "/about");
    assert(
      back.state.panes.length === 2,
      "Back retains both registered apps",
      back.state,
    );
    await tab.forward();
    await tab.playwright.waitForURL(`${base}/write-ups#research-publications`, {
      timeoutMs: 15000,
    });
    await waitForPane("/write-ups");
    const forward = await check(
      "Browser Forward restores Research",
      "/write-ups",
    );
    assert(
      forward.state.panes.length === 2,
      "Forward reuses both registered apps",
      forward.state,
    );
    assert(
      forward.state.hash === publication.state.hash &&
        near(forward.active.contentOffset, publication.active.contentOffset),
      "Forward keeps the retained fragment reading position",
      forward.active,
    );

    stage = "custom maximize and restore";
    await pane("/write-ups")
      .getByLabel("Window controls", { exact: true })
      .click();
    await observe();
    await tab.playwright
      .getByRole("button", { name: "Decrease width", exact: true })
      .click();
    await tab.playwright
      .getByRole("button", { name: "Decrease height", exact: true })
      .click();
    await tab.playwright
      .getByRole("button", { name: "Move down", exact: true })
      .click();
    await tab.playwright
      .getByRole("button", { name: "Done", exact: true })
      .click();
    await observe();
    const custom = await check("Custom reading geometry", "/write-ups");
    await pane("/write-ups")
      .getByRole("button", { name: "Expand", exact: true })
      .click();
    await observe();
    const expanded = await check("Maximized reading geometry", "/write-ups");
    assert(
      !sameRect(custom.active.rect, expanded.active.rect),
      "Expand changes custom geometry",
      { custom: custom.active, expanded: expanded.active },
    );
    assert(
      near(expanded.active.rect.x, 12) &&
        near(expanded.active.rect.y, 64) &&
        near(expanded.active.rect.width, expanded.state.viewport.width - 24) &&
        near(expanded.active.rect.height, expanded.state.viewport.height - 174),
      "Maximize respects reserved header/dock bounds",
      expanded.active.rect,
    );
    await pane("/write-ups")
      .getByRole("button", { name: "Restore size", exact: true })
      .click();
    await observe();
    const normal = await check(
      "Restored custom reading geometry",
      "/write-ups",
    );
    assert(
      sameRect(custom.active.rect, normal.active.rect),
      "Restore returns custom bounds",
      { custom: custom.active.rect, restored: normal.active.rect },
    );
    assert(
      near(custom.active.contentOffset, normal.active.contentOffset),
      "Restore preserves retained reading offset",
      {
        before: custom.active.contentOffset,
        after: normal.active.contentOffset,
      },
    );
    return {
      origin: base,
      viewport: normal.state.viewport,
      evidence,
      observations,
    };
  } catch (cause) {
    const error = new Error(
      `ResearchOS navigation regression failed during ${stage}`,
      { cause },
    );
    error.evidence = { origin: base, stage, evidence, observations };
    throw error;
  }
}
