import { describe, expect, it } from "vitest";
import type { Locale } from "@/i18n";
import {
  getOSAppDescriptorForRoute,
  osAppLocales,
  osAppRoutes,
  type OSAppDescriptor,
} from "@/lib/os-app-schema";
import {
  canOpenWorkspaceWindow,
  createWorkspaceState,
  workspaceReducer,
  type WorkspaceAction,
  type WorkspaceState,
} from "./workspace-model";

const app = (route: string, locale: Locale = "en") =>
  getOSAppDescriptorForRoute(route, locale)!;
const ids = (state: WorkspaceState) =>
  state.windows.map((record) => record.descriptor.id);

function expectInvariants(state: WorkspaceState) {
  expect(new Set(ids(state)).size).toBe(state.windows.length);
  expect(state.windows.length).toBeLessThanOrEqual(1);
  for (const record of state.windows) {
    expect(record.descriptor.locale).toBe(state.locale);
    expect(canOpenWorkspaceWindow(state, record.descriptor)).toBe(true);
  }
  const visible = state.windows.filter((record) => !record.minimized);
  if (visible.length === 0) expect(state.activeId).toBeNull();
  else expect(state.activeId).toBe(visible.at(-1)?.descriptor.id);
}

describe("current-page OS workspace model", () => {
  it("creates an empty fixed-locale workspace or initializes a valid app", () => {
    expect(createWorkspaceState("fa")).toEqual({
      locale: "fa",
      windows: [],
      activeId: null,
    });
    expect(createWorkspaceState("fa", app("/about", "fa"))).toEqual({
      locale: "fa",
      windows: [{ descriptor: app("/about", "fa"), minimized: false }],
      activeId: "/fa/about",
    });
    expect(createWorkspaceState("fa", app("/about", "en"))).toEqual(
      createWorkspaceState("fa"),
    );
    expect(() => createWorkspaceState("fr" as Locale)).toThrow(TypeError);
  });

  it("replaces the current page and rejects later actions on an old page", () => {
    let state = createWorkspaceState("en", app("/about"));
    state = workspaceReducer(state, { type: "open", app: app("/contact") });
    expect(ids(state)).toEqual(["/contact"]);
    expect(state.activeId).toBe("/contact");
    for (const type of ["focus", "restore", "minimize", "close"] as const)
      expect(workspaceReducer(state, { type, id: "/about" })).toBe(state);
  });

  it("minimizes and restores the current page without creating any history", () => {
    for (const type of ["open", "focus", "restore"] as const) {
      const descriptor = app("/contact");
      let state = createWorkspaceState("en", descriptor);
      state = workspaceReducer(state, { type: "minimize", id: descriptor.id });
      expect(state.windows).toEqual([{ descriptor, minimized: true }]);
      expect(state.activeId).toBeNull();
      state = workspaceReducer(
        state,
        type === "open"
          ? { type, app: descriptor }
          : { type, id: descriptor.id },
      );
      expect(state.windows).toEqual([{ descriptor, minimized: false }]);
      expect(state.activeId).toBe(descriptor.id);
      expect(
        workspaceReducer(state, { type: "close", id: descriptor.id }),
      ).toEqual(createWorkspaceState("en"));
    }
  });

  it("returns the original state for invalid routes, mixed locales and unknown actions or IDs", () => {
    const state = createWorkspaceState("fa", app("/contact", "fa"));
    for (const descriptor of [
      app("/about", "en"),
      app("/about", "ar"),
      { ...app("/about", "fa"), route: "/unknown" },
      { ...app("/about", "fa"), kind: "project" },
      { ...app("/about", "fa"), id: "__proto__" },
      null,
    ]) {
      expect(canOpenWorkspaceWindow(state, descriptor)).toBe(false);
      expect(
        workspaceReducer(state, {
          type: "open",
          app: descriptor as OSAppDescriptor,
        }),
      ).toBe(state);
    }
    for (const type of ["focus", "restore", "minimize", "close"] as const) {
      expect(workspaceReducer(state, { type, id: "/fa/unknown" })).toBe(state);
      expect(workspaceReducer(state, { type, id: "__proto__" })).toBe(state);
    }
    for (const action of [
      null,
      {},
      { type: "reset" },
      { type: "close", id: 1 },
    ]) {
      expect(workspaceReducer(state, action as WorkspaceAction)).toBe(state);
    }
  });

  it("stays bounded to one page across every approved route and locale", () => {
    for (const locale of osAppLocales) {
      let state = createWorkspaceState(locale);
      for (const route of osAppRoutes) {
        const descriptor = app(route, locale);
        state = workspaceReducer(state, { type: "open", app: descriptor });
        expect(ids(state)).toEqual([descriptor.id]);
        expectInvariants(state);
      }
    }
  });

  it("does not mutate frozen input state, records or caller descriptors", () => {
    const supplied = app("/about");
    const state = createWorkspaceState("en", supplied);
    expect(state.windows[0].descriptor).not.toBe(supplied);
    const snapshot = JSON.stringify(state);
    for (const record of state.windows) {
      Object.freeze(record.descriptor);
      Object.freeze(record);
    }
    Object.freeze(state.windows);
    Object.freeze(state);
    const opened = workspaceReducer(state, {
      type: "open",
      app: Object.freeze(app("/contact")),
    });
    const minimized = workspaceReducer(state, {
      type: "minimize",
      id: "/about",
    });
    const closed = workspaceReducer(state, { type: "close", id: "/about" });
    expect(JSON.stringify(state)).toBe(snapshot);
    expect(opened.windows).toHaveLength(1);
    expect(minimized.windows[0].minimized).toBe(true);
    expect(closed.windows).toHaveLength(0);
  });

  it("preserves identity for focus, restore and minimize no-ops", () => {
    const active = createWorkspaceState("zh", app("/lab/001", "zh"));
    expect(
      workspaceReducer(active, { type: "focus", id: active.activeId! }),
    ).toBe(active);
    expect(
      workspaceReducer(active, { type: "restore", id: active.activeId! }),
    ).toBe(active);
    const minimized = workspaceReducer(active, {
      type: "minimize",
      id: active.activeId!,
    });
    expect(
      workspaceReducer(minimized, { type: "minimize", id: "/zh/lab/001" }),
    ).toBe(minimized);
  });

  it("maintains invariants through a deterministic long action sequence", () => {
    let state = createWorkspaceState("es");
    let seed = 173;
    for (let step = 0; step < 1_000; step += 1) {
      seed = (seed * 1_103_515_245 + 12_345) >>> 0;
      const descriptor = app(osAppRoutes[seed % osAppRoutes.length], "es");
      const type = (["open", "focus", "minimize", "restore", "close"] as const)[
        (seed >>> 5) % 5
      ];
      state = workspaceReducer(
        state,
        type === "open"
          ? { type, app: descriptor }
          : { type, id: descriptor.id },
      );
      expectInvariants(state);
    }
  });
});
