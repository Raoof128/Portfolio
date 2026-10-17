import { render } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import { getOSAppDescriptor } from "@/lib/os-app-schema";
import { WorkspaceWindows, type WindowActions } from "./WorkspaceWindows";
import type { WorkspaceState } from "./workspace-model";
import type { RegisteredApplication } from "./application-context";

// A window restored at load: the page was loaded on its own path, so the module reads that path
// when it is imported. vi.hoisted runs before the imports above, so this file gets it first.
vi.hoisted(() => {
  window.history.replaceState(null, "", "/projects/project-simurgh");
});

vi.mock("next/link", () => ({
  default: ({
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a {...props} href={href} />
  ),
}));

describe("workspace window focus at load", () => {
  it("does not take focus from the page for a window restored at load", () => {
    const descriptor = getOSAppDescriptor("/projects/project-simurgh", "en");
    if (!descriptor)
      throw new Error("project-simurgh must be a valid OS route");
    const state: WorkspaceState = {
      locale: "en",
      windows: [{ descriptor, minimized: false }],
      activeId: descriptor.id,
    };
    const application: RegisteredApplication = {
      descriptor,
      view: (
        <article>
          <h1>Project Simurgh</h1>
        </article>
      ),
      initial: {},
    };
    const actions: WindowActions = {
      focus: vi.fn(),
      minimize: vi.fn(),
      restore: vi.fn(),
      close: vi.fn(),
    };
    render(
      <WorkspaceWindows
        state={state}
        applications={new Map([[descriptor.id, application]])}
        pathname={descriptor.path}
        locale="en"
        role="visitor"
        entries={[]}
        actions={actions}
        locked={false}
      />,
    );
    const heading = document.querySelector("section.os-workspace-window h1");
    expect(heading).not.toBeNull();
    expect(document.activeElement).not.toBe(heading);
  });
});
