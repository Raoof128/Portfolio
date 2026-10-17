import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getOSAppDescriptor, type OSAppDescriptor } from "@/lib/os-app-schema";
import { WorkspaceWindows, type WindowActions } from "./WorkspaceWindows";
import type { WorkspaceState } from "./workspace-model";
import type { RegisteredApplication } from "./application-context";

vi.mock("next/link", () => ({
  default: ({
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a {...props} href={href} />
  ),
}));

function projectDescriptor(): OSAppDescriptor {
  const descriptor = getOSAppDescriptor("/projects/project-simurgh", "en");
  if (!descriptor) throw new Error("project-simurgh must be a valid OS route");
  return descriptor;
}
const descriptor = projectDescriptor();

function renderWindow() {
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
        <p>Reading body</p>
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
  return render(
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
}

function setClipboard(writeText: (value: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

afterEach(() => {
  Reflect.deleteProperty(navigator, "clipboard");
});

describe("workspace window focus", () => {
  it("moves focus into a window that opens while the workspace is showing", () => {
    renderWindow();
    // The window mounts already active. Its heading takes focus, not the page body.
    const heading = document.querySelector("section.os-workspace-window h1");
    expect(heading).not.toBeNull();
    expect(document.activeElement).toBe(heading);
  });
});

describe("workspace window controls", () => {
  it("names each caption control after its window", () => {
    renderWindow();
    expect(
      screen.getByRole("button", { name: /^Minimise: / }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Full Size: / }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Close: / }),
    ).toBeInTheDocument();
  });

  it("keeps the window title out of the tab order", () => {
    renderWindow();
    const title = document.querySelector(".os-window-title");
    expect(title?.tagName).toBe("DIV");
    expect(title?.closest("button")).toBeNull();
  });

  it("keeps Back as a parent link", () => {
    // The navigation decision (use-reading-window.ts): Back goes to the parent page by link.
    renderWindow();
    expect(document.querySelector("a.os-window-back")).toHaveAttribute(
      "href",
      "/projects",
    );
  });
});

describe("Copy Link feedback", () => {
  it("shows Copied on the button after a successful copy", async () => {
    setClipboard(vi.fn().mockResolvedValue(undefined));
    renderWindow();
    fireEvent.click(screen.getByRole("button", { name: "Copy Link" }));
    expect(
      await screen.findByRole("button", { name: "Copied" }),
    ).toBeInTheDocument();
  });

  it("shows the address in a read-only, selectable field when copying fails", async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    renderWindow();
    fireEvent.click(screen.getByRole("button", { name: "Copy Link" }));
    const field = await screen.findByRole("textbox", {
      name: "Address to copy",
    });
    expect(field).toHaveAttribute("readonly");
    expect(field).toHaveValue(`${location.origin}${descriptor.path}`);
    await waitFor(() => expect(field).toHaveFocus());
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(
      screen.queryByRole("textbox", { name: "Address to copy" }),
    ).not.toBeInTheDocument();
  });
});
