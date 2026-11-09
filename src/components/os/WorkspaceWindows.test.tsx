import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
  const frame = (next = descriptor) => (
    <WorkspaceWindows
      state={{
        ...state,
        windows: [{ descriptor: next, minimized: false }],
        activeId: next.id,
      }}
      applications={new Map([[next.id, { ...application, descriptor: next }]])}
      pathname={next.path}
      locale="en"
      role="visitor"
      entries={[]}
      actions={actions}
      locked={false}
    />
  );
  const result = render(frame());
  return {
    ...result,
    actions,
    navigate: (next: OSAppDescriptor) => result.rerender(frame(next)),
  };
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

  it.each(["close", "minimize"] as const)(
    "cancels the previous document's pending %s when the frame navigates",
    (action) => {
      vi.useFakeTimers();
      try {
        const view = renderWindow();
        fireEvent.click(screen.getByRole("button", {
          name: action === "close" ? /^Close: / : /^Minimise: /,
        }));
        expect(view.actions[action]).not.toHaveBeenCalled();
        view.navigate(getOSAppDescriptor("/about", "en")!);
        act(() => vi.advanceTimersByTime(200));
        expect(view.actions[action]).not.toHaveBeenCalled();
        expect(screen.getByRole("main")).toBeVisible();
      } finally {
        vi.useRealTimers();
      }
    },
  );
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

  it("clears the previous page's failed-copy address when the retained frame navigates", async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    const view = renderWindow();
    fireEvent.click(screen.getByRole("button", { name: "Copy Link" }));
    await screen.findByRole("textbox", { name: "Address to copy" });
    view.navigate(getOSAppDescriptor("/about", "en")!);
    expect(
      screen.queryByRole("textbox", { name: "Address to copy" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy Link" })).toBeVisible();
  });

  it.each(["resolve", "reject"] as const)(
    "ignores a clipboard request that %ss after the retained frame navigates",
    async (settlement) => {
      let resolveCopy!: () => void;
      let rejectCopy!: (error: Error) => void;
      setClipboard(
        () => new Promise<void>((resolve, reject) => {
          resolveCopy = resolve;
          rejectCopy = reject;
        }),
      );
      const view = renderWindow();
      fireEvent.click(screen.getByRole("button", { name: "Copy Link" }));
      view.navigate(getOSAppDescriptor("/about", "en")!);
      await act(async () => {
        if (settlement === "resolve") resolveCopy();
        else rejectCopy(new Error("denied"));
      });
      expect(
        screen.queryByRole("textbox", { name: "Address to copy" }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Copy Link" })).toBeVisible();
    },
  );
});

describe("Full Screen command", () => {
  const original = {
    enabled: Object.getOwnPropertyDescriptor(document, "fullscreenEnabled"),
    element: Object.getOwnPropertyDescriptor(document, "fullscreenElement"),
    exit: Object.getOwnPropertyDescriptor(document, "exitFullscreen"),
    request: Object.getOwnPropertyDescriptor(
      Element.prototype,
      "requestFullscreen",
    ),
  };
  function restore(
    target: object,
    key: string,
    descriptor: PropertyDescriptor | undefined,
  ) {
    if (descriptor) Object.defineProperty(target, key, descriptor);
    else Reflect.deleteProperty(target, key);
  }
  afterEach(() => {
    restore(document, "fullscreenEnabled", original.enabled);
    restore(document, "fullscreenElement", original.element);
    restore(document, "exitFullscreen", original.exit);
    restore(Element.prototype, "requestFullscreen", original.request);
  });

  /** A minimal Fullscreen API: the requesting element becomes the fullscreen element. */
  function installFullScreen() {
    let current: Element | null = null;
    const setCurrent = (element: Element | null) => {
      current = element;
    };
    const change = () => document.dispatchEvent(new Event("fullscreenchange"));
    Object.defineProperty(document, "fullscreenEnabled", {
      configurable: true,
      value: true,
    });
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      get: () => current,
    });
    Object.defineProperty(document, "exitFullscreen", {
      configurable: true,
      value: vi.fn(async () => {
        current = null;
        change();
      }),
    });
    Object.defineProperty(Element.prototype, "requestFullscreen", {
      configurable: true,
      value: vi.fn(async function (this: Element) {
        setCurrent(this);
        change();
      }),
    });
  }

  it("is not offered where the browser cannot enter full screen", () => {
    Object.defineProperty(document, "fullscreenEnabled", {
      configurable: true,
      value: false,
    });
    renderWindow();
    expect(screen.queryByRole("button", { name: "Full Screen" })).toBeNull();
  });

  it("puts the window frame in full screen and back, reporting the state", async () => {
    installFullScreen();
    const { container } = renderWindow();
    const frame = container.querySelector("[data-window-path]");
    const enter = screen.getByRole("button", { name: "Full Screen" });
    expect(enter).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(enter);
    const exit = await screen.findByRole("button", { name: "Exit Full Screen" });
    expect(document.fullscreenElement).toBe(frame);
    expect(frame).toHaveAttribute("data-fullscreen", "true");
    expect(exit).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(exit);
    expect(
      await screen.findByRole("button", { name: "Full Screen" }),
    ).toBeVisible();
    expect(document.fullscreenElement).toBeNull();
    expect(frame).not.toHaveAttribute("data-fullscreen");
  });

  it("follows a full screen exit made outside the button, such as Esc", async () => {
    installFullScreen();
    renderWindow();
    fireEvent.click(screen.getByRole("button", { name: "Full Screen" }));
    await screen.findByRole("button", { name: "Exit Full Screen" });
    await act(async () => {
      await document.exitFullscreen();
    });
    expect(screen.getByRole("button", { name: "Full Screen" })).toBeVisible();
  });
});
