import {
  StrictMode,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
} from "react";
import Link from "next/link";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { SearchEntry } from "@/lib/os-search-query";
import type { Locale } from "@/i18n";
import { getAtlasCopy } from "./atlas-copy";
import { getOSCopy } from "./os-copy";
import { ResearchOS } from "./ResearchOS";
import { Desktop } from "./Desktop";
import { getWindowCopy } from "./window-copy";
import { OSApplicationBridge } from "./OSApplicationBridge";
import { useContentId, useInitialAppState } from "./application-context";
import { clearLanguageNavigation } from "./language-navigation";

const navigation = vi.hoisted(() => ({ pathname: "/", push: vi.fn() }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => navigation,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    onClick,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a
      {...props}
      href={href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        if (
          !event.defaultPrevented &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault();
          navigation.push(href);
        }
      }}
    />
  ),
}));

const copy = getOSCopy("en");
const entries: SearchEntry[] = [
  {
    id: "project:project-simurgh",
    title: "Simurgh",
    description: "Containment and verifiable evidence",
    href: "/projects/project-simurgh",
    kind: "project",
  },
];

const dialogPrototype = HTMLDialogElement.prototype;
const originalShowModal = Object.getOwnPropertyDescriptor(
  dialogPrototype,
  "showModal",
);
const originalClose = Object.getOwnPropertyDescriptor(dialogPrototype, "close");
let frames: Map<number, FrameRequestCallback>;
let nextFrame: number;

beforeAll(() => {
  // JSDOM has no top layer or focus trap. Model the native open property and
  // queued close event; assert the shell's explicit focus policy separately.
  Object.defineProperty(dialogPrototype, "showModal", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
  });
  Object.defineProperty(dialogPrototype, "close", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      if (!this.open) return;
      this.removeAttribute("open");
      window.setTimeout(() => this.dispatchEvent(new Event("close")), 0);
    },
  });
});

afterAll(() => {
  if (originalShowModal)
    Object.defineProperty(dialogPrototype, "showModal", originalShowModal);
  else Reflect.deleteProperty(dialogPrototype, "showModal");
  if (originalClose)
    Object.defineProperty(dialogPrototype, "close", originalClose);
  else Reflect.deleteProperty(dialogPrototype, "close");
});

beforeEach(() => {
  navigation.pathname = "/";
  navigation.push.mockClear();
  window.localStorage.clear();
  clearLanguageNavigation();
  window.sessionStorage.clear();
  frames = new Map();
  nextFrame = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    const id = ++nextFrame;
    frames.set(id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function flushFrames() {
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(performance.now()));
  });
}

function RetainedApp({ title }: { title: string }) {
  const initial = useInitialAppState();
  const contentId = useContentId();
  const [draft, setDraft] = useState(initial.fields?.draft ?? "");
  return (
    <>
      <h1>{title}</h1>
      <label htmlFor={contentId("app-draft")}>Draft</label>
      <input
        id={contentId("app-draft")}
        name="draft"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <a href={`#${contentId("app-evidence")}`}>Evidence</a>
      <section id={contentId("app-evidence")}>Original evidence</section>
    </>
  );
}

function registeredShell(route: string, title: string) {
  return (
    <ResearchOS
      locale="en"
      role="Researcher"
      entries={entries}
      skipLabel="Skip"
    >
      <OSApplicationBridge locale="en" route={route}>
        <RetainedApp title={title} />
      </OSApplicationBridge>
    </ResearchOS>
  );
}

describe("current application window", () => {
  function desktop() {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }

  it("disposes previous pages and their drafts instead of keeping a history", () => {
    desktop();
    navigation.pathname = "/projects";
    const view = render(registeredShell("/projects", "Project library"));
    const first = view.container.querySelector<HTMLElement>(
      '[data-window-path="/projects"]',
    )!;
    fireEvent.change(within(first).getByRole("textbox", { name: "Draft" }), {
      target: { value: "Old draft" },
    });
    navigation.pathname = "/about";
    view.rerender(registeredShell("/about", "About Raouf"));
    expect(first.isConnected).toBe(false);
    expect(
      view.container.querySelectorAll(".os-workspace-window"),
    ).toHaveLength(1);
    expect(view.container.querySelector(".os-open-windows")).toBeNull();
    navigation.pathname = "/projects";
    view.rerender(registeredShell("/projects", "Project library"));
    const current = view.container.querySelector<HTMLElement>(
      '[data-window-path="/projects"]',
    )!;
    expect(current).not.toBe(first);
    expect(within(current).getByRole("textbox", { name: "Draft" })).toHaveValue(
      "",
    );
    expect(view.container.querySelectorAll('[id="main-content"]')).toHaveLength(
      1,
    );
  });

  it("keeps only the current minimized page and focuses its restore control", () => {
    desktop();
    navigation.pathname = "/about";
    const view = render(registeredShell("/about", "About Raouf"));
    const pane = view.container.querySelector<HTMLElement>(
      '[data-window-path="/about"]',
    )!;
    fireEvent.change(within(pane).getByRole("textbox", { name: "Draft" }), {
      target: { value: "Current draft" },
    });
    fireEvent.click(within(pane).getByRole("button", { name: "Minimize" }));
    flushFrames();
    const restore =
      view.container.querySelector<HTMLButtonElement>(".os-minimized-task")!;
    expect(restore).toHaveFocus();
    expect(restore).toHaveAccessibleDescription(/Minimized/);
    expect(pane).not.toBeVisible();
    fireEvent.click(restore);
    expect(pane).toBeVisible();
    expect(within(pane).getByRole("textbox", { name: "Draft" })).toHaveValue(
      "Current draft",
    );
    expect(view.container.querySelector(".os-minimized-task")).toBeNull();
    fireEvent.click(within(pane).getByRole("button", { name: "Close" }));
    expect(pane.isConnected).toBe(false);
    expect(
      view.container.querySelectorAll(".os-workspace-window"),
    ).toHaveLength(0);
    expect(navigation.push).toHaveBeenLastCalledWith("/");
  });

  it("ignores stale publications and clears the current page on recovery or desktop navigation", () => {
    desktop();
    navigation.pathname = "/about";
    const view = render(registeredShell("/projects", "Stale project"));
    expect(
      view.container.querySelectorAll(".os-workspace-window"),
    ).toHaveLength(0);
    view.rerender(registeredShell("/about", "About Raouf"));
    const pane = view.container.querySelector<HTMLElement>(
      ".os-workspace-window",
    )!;
    navigation.pathname = "/projects/unknown";
    view.rerender(
      <ResearchOS
        locale="en"
        role="Researcher"
        entries={entries}
        skipLabel="Skip"
      >
        <h1>Page unavailable</h1>
      </ResearchOS>,
    );
    expect(
      screen.getByRole("heading", { name: "Page unavailable" }),
    ).toBeVisible();
    expect(pane.isConnected).toBe(false);
    navigation.pathname = "/about";
    view.rerender(registeredShell("/about", "About Raouf"));
    navigation.pathname = "/";
    view.rerender(registeredShell("/", "Desktop"));
    expect(
      view.container.querySelectorAll(".os-workspace-window"),
    ).toHaveLength(0);
    expect(view.container.querySelector(".os-open-windows")).toBeNull();
  });

  it("restores the minimized current app from search without duplicating navigation", () => {
    desktop();
    navigation.pathname = "/projects/project-simurgh";
    const view = render(
      registeredShell("/projects/project-simurgh", "Simurgh evidence"),
    );
    const pane = view.container.querySelector<HTMLElement>(
      '[data-window-path="/projects/project-simurgh"]',
    )!;
    fireEvent.click(within(pane).getByRole("button", { name: "Minimize" }));
    expect(pane).not.toBeVisible();
    const projectsDock = view.container.querySelector(
      '.os-dock [data-app="projects"]',
    );
    expect(projectsDock).toHaveAttribute("data-minimized", "true");
    const { dialog, input } = openSearch();
    fireEvent.change(input, { target: { value: "Simurgh" } });
    navigation.push.mockClear();
    fireEvent.click(within(dialog).getByRole("link", { name: /Simurgh/ }));
    expect(pane).toBeVisible();
    expect(pane).toHaveAttribute("data-active", "true");
    expect(projectsDock).not.toHaveAttribute("data-minimized");
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it.each([
    ["app", "resolve"],
    ["app", "reject"],
    ["shell", "resolve"],
    ["shell", "reject"],
  ] as const)(
    "does not schedule copy feedback after removing the %s while clipboard %s is pending",
    async (scope, settlement) => {
      desktop();
      navigation.pathname = "/about";
      let resolve!: () => void;
      let reject!: (error: Error) => void;
      const promise = new Promise<void>((done, fail) => {
        resolve = done;
        reject = fail;
      });
      const writeText = vi.fn(() => promise);
      const original = Object.getOwnPropertyDescriptor(navigator, "clipboard");
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText },
      });
      try {
        const view = render(
          scope === "app"
            ? registeredShell("/about", "About Raouf")
            : shell("About Raouf"),
        );
        const pane = view.container.querySelector<HTMLElement>(
          scope === "app" ? '[data-window-path="/about"]' : ".os-window",
        )!;
        fireEvent.click(
          within(pane).getByRole("button", { name: copy.copyLink }),
        );
        expect(writeText).toHaveBeenCalledOnce();
        if (scope === "app")
          fireEvent.click(within(pane).getByRole("button", { name: "Close" }));
        else view.unmount();
        expect(pane.isConnected).toBe(false);
        const timer = vi.spyOn(globalThis, "setTimeout");
        await act(async () => {
          if (settlement === "resolve") resolve();
          else reject(new Error("Clipboard unavailable"));
          await promise.catch(() => {});
        });
        expect(timer.mock.calls.some(([, delay]) => delay === 3500)).toBe(
          false,
        );
      } finally {
        if (original) Object.defineProperty(navigator, "clipboard", original);
        else Reflect.deleteProperty(navigator, "clipboard");
      }
    },
  );

  it("navigates to a disposed page fragment through the normal route", () => {
    desktop();
    navigation.pathname = "/write-ups";
    const view = render(registeredShell("/write-ups", "Research papers"));
    navigation.pathname = "/about";
    view.rerender(
      <ResearchOS
        locale="en"
        role="Researcher"
        entries={entries}
        skipLabel="Skip"
      >
        <OSApplicationBridge locale="en" route="/about">
          <h1>About Raouf</h1>
          <Link href="/write-ups#research-publications">Read publications</Link>
        </OSApplicationBridge>
      </ResearchOS>,
    );
    navigation.push.mockClear();
    fireEvent.click(screen.getByRole("link", { name: "Read publications" }));
    expect(navigation.push).toHaveBeenCalledExactlyOnceWith(
      "/write-ups#research-publications",
    );
    expect(
      view.container.querySelector('[data-window-path="/write-ups"]'),
    ).toBeNull();
    navigation.pathname = "/write-ups";
    view.rerender(registeredShell("/write-ups", "Research papers"));
    expect(
      view.container.querySelector('[data-window-path="/write-ups"]'),
    ).toHaveAttribute("data-active", "true");
    expect(
      view.container.querySelectorAll(".os-workspace-window"),
    ).toHaveLength(1);
  });
});

function shell(heading = "Workspace") {
  return (
    <ResearchOS
      locale="en"
      role="Independent researcher"
      entries={entries}
      skipLabel="Skip to main content"
    >
      <h1>{heading}</h1>
      <Link href="/projects">Browse projects</Link>
    </ResearchOS>
  );
}

function desktopElements(container: HTMLElement) {
  const content = container.querySelector<HTMLElement>(".os-content");
  const dock = container.querySelector<HTMLElement>(".os-dock");
  expect(content).not.toBeNull();
  expect(dock).not.toBeNull();
  return { content: content!, dock: dock! };
}

function openSearch() {
  const launcher = screen.getByRole("button", { name: /^Search \(Ctrl/ });
  launcher.focus();
  fireEvent.click(launcher);
  const dialog = screen.getByRole("dialog", { name: copy.search });
  const input = within(dialog).getByRole("searchbox");
  expect(dialog).toHaveAttribute("open");
  expect(input).toHaveFocus();
  return { launcher, dialog, input };
}

describe("ResearchOS workspace lifecycle", () => {
  it.each<Locale>(["en", "fa", "ar", "zh", "es"])(
    "keeps native clocks unnamed with localized reading context in %s",
    (locale) => {
      navigation.pathname = locale === "en" ? "/" : `/${locale}`;
      const { container } = render(
        <ResearchOS
          locale={locale}
          role="Researcher"
          entries={entries}
          skipLabel="Skip"
        >
          <h1>Workspace</h1>
        </ResearchOS>,
      );
      const clocks = container.querySelectorAll(
        ".os-lock-time, .os-top-clock time",
      );
      expect(clocks).toHaveLength(2);
      for (const clock of clocks) {
        // Native time prohibits author naming; its adjacent caption supplies
        // localized context without changing the role or announcing each tick.
        expect(clock).not.toHaveAttribute("aria-label");
        expect(clock).not.toHaveAttribute("aria-labelledby");
        expect(clock).not.toHaveAttribute("role");
        expect(clock).not.toHaveAttribute("aria-live");
        expect(clock.previousElementSibling).toHaveClass("sr-only");
        expect(clock.previousElementSibling).toHaveTextContent(
          getOSCopy(locale).currentTime,
        );
        expect(clock).toHaveAttribute("datetime");
        expect(clock.textContent).not.toBe("");
      }
    },
  );

  it("supports keyboard entry, movement, dismissal and exit for portaled window controls", async () => {
    navigation.pathname = "/projects";
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const { container } = render(shell("Project explorer"));
    const commands = getWindowCopy("en");
    const launcher = screen.getByLabelText(commands.windowControls);
    launcher.focus();
    fireEvent.click(launcher);
    const left = await screen.findByRole("button", { name: commands.moveLeft });
    await waitFor(() => expect(left).toHaveFocus());
    fireEvent.keyDown(left, { key: "ArrowRight" });
    expect(container.querySelector(".os-window")).toHaveClass(
      "os-window--floating",
    );
    fireEvent.keyDown(left, { key: "Tab", shiftKey: true });
    expect(launcher).toHaveFocus();
    expect(
      screen.queryByRole("button", { name: commands.moveLeft }),
    ).toBeNull();
    fireEvent.click(launcher);
    await screen.findByRole("button", { name: commands.done });
    const done = screen.getByRole("button", { name: commands.done });
    done.focus();
    fireEvent.keyDown(done, { key: "Tab" });
    expect(screen.getByRole("button", { name: copy.copyLink })).toHaveFocus();
    fireEvent.keyDown(launcher, { key: "Escape" });
    expect(navigation.push).toHaveBeenCalledWith("/");
  });

  it("unmounts an open portaled menu when minimizing through a keyboard-style click", async () => {
    navigation.pathname = "/projects";
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(shell("Project explorer"));
    fireEvent.click(screen.getByLabelText(getWindowCopy("en").windowControls));
    await screen.findByRole("button", { name: getWindowCopy("en").moveLeft });
    // No preceding pointerdown: hiding must not depend on the outside-click listener.
    fireEvent.click(
      screen.getByRole("button", { name: getWindowCopy("en").minimize }),
    );
    expect(
      screen.queryByRole("button", { name: getWindowCopy("en").moveLeft }),
    ).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^Restore window:/ }));
    flushFrames();
    expect(
      screen.queryByRole("button", { name: getWindowCopy("en").moveLeft }),
    ).toBeNull();
  });

  it("minimizes without navigation, suspends effects and restores the same draft via the dock", async () => {
    navigation.pathname = "/projects";
    const active = vi.fn();
    const suspended = vi.fn();
    function RetainedDocument() {
      const [draft, setDraft] = useState("");
      useEffect(() => {
        active();
        return suspended;
      }, []);
      return (
        <>
          <h1>Project notes</h1>
          <label>
            Draft
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
          </label>
        </>
      );
    }
    const { container } = render(
      <ResearchOS
        locale="en"
        role="Researcher"
        entries={entries}
        skipLabel="Skip to main content"
      >
        <RetainedDocument />
      </ResearchOS>,
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Draft" }), {
      target: { value: "Retain these notes" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: getWindowCopy("en").minimize }),
    );
    flushFrames();
    const task = screen.getByRole("button", { name: /^Restore window:/ });
    expect(task).toHaveFocus();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.queryByRole("textbox", { name: "Draft" })).toBeNull();
    await waitFor(() => expect(suspended).toHaveBeenCalledOnce());
    expect(navigation.push).not.toHaveBeenCalled();
    expect(container.querySelectorAll("#main-content")).toHaveLength(1);
    const dock = container.querySelector<HTMLElement>(".os-dock")!;
    fireEvent.click(within(dock).getByRole("link", { name: copy.projects }));
    flushFrames();
    await waitFor(() => expect(active).toHaveBeenCalledTimes(2));
    expect(screen.getByRole("textbox", { name: "Draft" })).toHaveValue(
      "Retain these notes",
    );
    expect(
      screen.getByRole("heading", { name: "Project notes" }),
    ).toHaveFocus();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("restores a minimized current-URL desktop launcher and ignores Escape on its desktop", () => {
    navigation.pathname = "/projects";
    const { container } = render(shell("Project explorer"));
    fireEvent.click(
      screen.getByRole("button", { name: getWindowCopy("en").minimize }),
    );
    flushFrames();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(navigation.push).not.toHaveBeenCalled();
    const desktop = container.querySelector<HTMLElement>(
      "#os-minimized-desktop",
    )!;
    fireEvent.click(
      within(desktop).getByRole("link", {
        name: /^Projects/,
      }),
    );
    flushFrames();
    expect(
      screen.getByRole("heading", { name: "Project explorer" }),
    ).toHaveFocus();
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("does not transfer hidden state to a new route and retains modified dock clicks", () => {
    navigation.pathname = "/projects";
    const view = render(shell("Project explorer"));
    fireEvent.click(
      screen.getByRole("button", { name: getWindowCopy("en").minimize }),
    );
    const dock = view.container.querySelector<HTMLElement>(".os-dock")!;
    fireEvent.click(within(dock).getByRole("link", { name: copy.projects }), {
      ctrlKey: true,
    });
    expect(
      screen.queryByRole("heading", { name: "Project explorer" }),
    ).toBeNull();
    navigation.pathname = "/contact";
    view.rerender(shell("Contact"));
    flushFrames();
    expect(screen.getByRole("heading", { name: "Contact" })).toBeVisible();
    expect(
      screen.queryByRole("button", { name: /^Restore window:/ }),
    ).toBeNull();
  });

  it("exposes one accessible main landmark through unlock and lock", () => {
    render(shell());
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(
      within(screen.getByRole("main")).getByRole("button", {
        name: getAtlasCopy("en").journeyExplore,
      }),
    ).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", { name: getAtlasCopy("en").journeyExplore }),
    );
    flushFrames();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(
      within(screen.getByRole("main")).getByRole("heading", {
        name: "Workspace",
      }),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: copy.lock }));
    flushFrames();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(
      within(screen.getByRole("main")).getByRole("button", {
        name: getAtlasCopy("en").journeyExplore,
      }),
    ).toBeVisible();
  });

  it.each(["en", "fa", "ar", "zh", "es"] as Locale[])(
    "%s: dock accessible names include every visible label after unlock",
    (locale) => {
      navigation.pathname = locale === "en" ? "/" : `/${locale}`;
      const { container } = render(
        <ResearchOS
          locale={locale}
          role="Independent researcher"
          entries={entries}
          skipLabel="Skip to main content"
        >
          <h1>Workspace</h1>
        </ResearchOS>,
      );
      const { dock } = desktopElements(container);
      expect(dock).toHaveAttribute("hidden");

      fireEvent.click(
        screen.getByRole("button", {
          name: getAtlasCopy(locale).journeyExplore,
        }),
      );
      flushFrames();

      expect(dock).not.toHaveAttribute("hidden");
      const appLinks = dock.querySelectorAll<HTMLAnchorElement>("a[data-app]");
      expect(appLinks).toHaveLength(5);
      for (const link of appLinks) {
        const visibleLabel = link.querySelector(
          ":scope > span:last-child",
        )!.textContent!;
        expect(visibleLabel.trim()).not.toBe("");
        expect(link).toBeVisible();
        expect(link).toHaveAccessibleName(
          expect.stringContaining(visibleLabel),
        );
      }
    },
  );

  it.each(["/", "/en"])(
    "starts %s locked, then reveals and focuses the desktop on Enter",
    (pathname) => {
      navigation.pathname = pathname;
      const { container } = render(shell());
      const { content, dock } = desktopElements(container);

      expect(content).toHaveAttribute("hidden");
      expect(content).toHaveAttribute("inert");
      expect(dock).toHaveAttribute("hidden");
      expect(dock).toHaveAttribute("inert");
      expect(screen.queryByRole("heading", { name: "Workspace" })).toBeNull();
      expect(
        within(dock).queryByRole("link", { name: copy.projects }),
      ).toBeNull();

      fireEvent.click(
        screen.getByRole("button", { name: getAtlasCopy("en").journeyExplore }),
      );
      flushFrames();

      expect(content).not.toHaveAttribute("hidden");
      expect(content).not.toHaveAttribute("inert");
      expect(dock).not.toHaveAttribute("hidden");
      expect(dock).not.toHaveAttribute("inert");
      expect(screen.getByRole("heading", { name: "Workspace" })).toHaveFocus();
      expect(
        within(dock).getByRole("link", { name: copy.projects }),
      ).toBeVisible();
    },
  );

  it("keeps Proof Atlas off the lock screen and interactive on the unlocked desktop", async () => {
    const role = "Independent researcher";
    const { container } = render(
      <ResearchOS
        locale="en"
        role={role}
        entries={entries}
        skipLabel="Skip to main content"
      >
        <Desktop locale="en" role={role} />
      </ResearchOS>,
    );

    expect(container.querySelector(".os-welcome .proof-atlas")).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: getAtlasCopy("en").journeyExplore }),
    );
    flushFrames();

    await waitFor(() => {
      const atlas = container.querySelector(
        ".os-content .proof-atlas--desktop",
      );
      expect(atlas).toHaveAttribute("data-interactive", "true");
      expect(atlas?.closest(".os-content")).not.toHaveAttribute("hidden");
    });
  });

  it("resets a scrolled welcome viewport before focusing the workspace heading", () => {
    const originalScrollY = Object.getOwnPropertyDescriptor(window, "scrollY");
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 640,
    });

    try {
      render(shell());
      fireEvent.click(
        screen.getByRole("button", {
          name: getAtlasCopy("en").journeyExplore,
        }),
      );

      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
      expect(screen.getByRole("heading", { name: "Workspace" })).toHaveFocus();
    } finally {
      if (originalScrollY)
        Object.defineProperty(window, "scrollY", originalScrollY);
      else Reflect.deleteProperty(window, "scrollY");
    }
  });

  it("opens a direct project URL without the intro gate", () => {
    navigation.pathname = "/projects/project-simurgh";
    const { container } = render(shell("Project evidence"));
    const { content, dock } = desktopElements(container);

    expect(
      screen.queryByRole("button", { name: getAtlasCopy("en").journeyExplore }),
    ).toBeNull();
    expect(
      screen.getByRole("heading", { name: "Project evidence" }),
    ).toBeVisible();
    expect(content).not.toHaveAttribute("hidden");
    expect(dock).not.toHaveAttribute("inert");
    expect(
      within(dock).getByRole("link", { name: copy.projects }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("lets the skip link unlock the desktop and focus its heading", () => {
    const { container } = render(shell());
    const { content, dock } = desktopElements(container);
    const skip = screen.getByRole("link", { name: "Skip to main content" });
    expect(content).toHaveAttribute("hidden");
    expect(skip.closest("[inert], [hidden]")).toBeNull();
    expect(skip).toHaveAttribute("href", "#main-content");

    skip.focus();
    fireEvent.click(skip);
    flushFrames();

    expect(
      screen.queryByRole("button", { name: getAtlasCopy("en").journeyExplore }),
    ).toBeNull();
    expect(content).not.toHaveAttribute("hidden");
    expect(content).not.toHaveAttribute("inert");
    expect(dock).not.toHaveAttribute("hidden");
    expect(screen.getByRole("heading", { name: "Workspace" })).toHaveFocus();
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("waits for home to render before focusing Enter after locking a detail", () => {
    navigation.pathname = "/projects/project-simurgh";
    const view = render(shell("Project evidence"));
    fireEvent.click(screen.getByRole("button", { name: copy.lock }));

    expect(navigation.push).toHaveBeenCalledWith("/");
    // Navigation is intentionally delayed: no intro exists on the old route.
    flushFrames();
    expect(
      screen.queryByRole("button", { name: getAtlasCopy("en").journeyExplore }),
    ).toBeNull();

    navigation.pathname = "/";
    view.rerender(shell());
    flushFrames();

    expect(
      screen.getByRole("button", { name: getAtlasCopy("en").journeyExplore }),
    ).toHaveFocus();
    const { content, dock } = desktopElements(view.container);
    expect(content).toHaveAttribute("hidden");
    expect(dock).toHaveAttribute("inert");
    expect(screen.queryByRole("heading", { name: "Workspace" })).toBeNull();
  });
});

describe("ResearchOS keyboard and search", () => {
  it.each(["fa", "ar", "zh", "es", "en"] as Locale[])(
    "keeps an open desktop open across a keyed remount into %s",
    (destination) => {
      const source: Locale = destination === "en" ? "fa" : "en";
      navigation.pathname = source === "en" ? "/" : `/${source}`;
      const localizedShell = (locale: Locale) => (
        <StrictMode>
          <ResearchOS
            key={locale}
            locale={locale}
            role="Researcher"
            entries={entries}
            skipLabel="Skip"
          >
            <h1>Workspace</h1>
          </ResearchOS>
        </StrictMode>
      );
      const { container, rerender } = render(localizedShell(source));
      fireEvent.click(
        screen.getByRole("button", {
          name: getAtlasCopy(source).journeyExplore,
        }),
      );
      fireEvent.click(
        container.querySelector(`.os-language a[lang="${destination}"]`)!,
      );
      const target = destination === "en" ? "/" : `/${destination}`;
      expect(navigation.push).toHaveBeenCalledWith(target);
      navigation.pathname = target;
      rerender(localizedShell(destination));
      expect(container.querySelector(".os-welcome")).toBeNull();
      expect(
        window.sessionStorage.getItem("researchos:language-navigation"),
      ).toBeNull();
      // A later ordinary visit must still get the welcome screen.
      cleanup();
      const fresh = render(localizedShell(destination));
      expect(fresh.container.querySelector(".os-welcome")).toBeVisible();
    },
  );

  it("preserves a deliberately locked language change", () => {
    const { container, rerender } = render(shell());
    fireEvent.click(container.querySelector('.os-language a[lang="fa"]')!);
    navigation.pathname = "/fa";
    rerender(
      <ResearchOS
        key="fa"
        locale="fa"
        role="Researcher"
        entries={entries}
        skipLabel="Skip"
      >
        <h1>Workspace</h1>
      </ResearchOS>,
    );
    expect(container.querySelector(".os-welcome")).toBeVisible();
  });

  it("preserves a detail path, query and section when changing language", () => {
    window.history.replaceState(
      null,
      "",
      "/projects/project-simurgh?view=evidence#methods",
    );
    navigation.pathname = "/projects/project-simurgh";
    const { container } = render(shell("Project evidence"));
    fireEvent.click(container.querySelector('.os-language a[lang="fa"]')!);
    expect(navigation.push).toHaveBeenCalledWith(
      "/fa/projects/project-simurgh?view=evidence#methods",
    );
    window.history.replaceState(null, "", "/");
  });

  it("leaves modified language clicks to the browser without a handoff", () => {
    const { container } = render(shell());
    fireEvent.click(container.querySelector('.os-language a[lang="fa"]')!, {
      ctrlKey: true,
    });
    expect(navigation.push).not.toHaveBeenCalled();
    expect(
      window.sessionStorage.getItem("researchos:language-navigation"),
    ).toBeNull();
  });
  it("dismisses a populated search on the first Escape without leaving the app", async () => {
    navigation.pathname = "/projects/project-simurgh";
    render(shell("Project evidence"));
    const { launcher, dialog, input } = openSearch();
    fireEvent.change(input, { target: { value: "Simurgh" } });
    expect(input).toHaveValue("Simurgh");
    const escape = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });

    fireEvent(input, escape);

    // Cancel the search input's native clear-text action as well as closing.
    expect(escape.defaultPrevented).toBe(true);
    expect(dialog).not.toHaveAttribute("open");
    await waitFor(() => expect(launcher).toHaveFocus());
    expect(navigation.push).not.toHaveBeenCalled();
    expect(navigation.pathname).toBe("/projects/project-simurgh");
    expect(
      screen.getByRole("heading", { name: "Project evidence" }),
    ).toBeVisible();
  });

  it("keeps IME confirmation and candidate arrows from activating search results", () => {
    navigation.pathname = "/about";
    render(shell("About Raouf"));
    const { dialog, input } = openSearch();
    const result = within(dialog).getByRole("link", { name: /Simurgh/ });
    const activate = vi.spyOn(result, "click");

    fireEvent.keyDown(input, { key: "Enter", isComposing: true });
    fireEvent.keyDown(input, { key: "ArrowDown", isComposing: true });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });

    expect(activate).not.toHaveBeenCalled();
    expect(navigation.push).not.toHaveBeenCalled();
    expect(input).toHaveFocus();
    expect(dialog).toHaveAttribute("open");

    fireEvent.keyDown(input, { key: "Enter" });
    expect(activate).toHaveBeenCalledOnce();
    expect(navigation.push).toHaveBeenCalledWith("/projects/project-simurgh");
    expect(dialog).not.toHaveAttribute("open");
  });

  it("moves between search field and results with arrows and restores the launcher on close", async () => {
    render(shell());
    const { launcher, dialog, input } = openSearch();
    const result = within(dialog).getByRole("link", { name: /Simurgh/ });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(result).toHaveFocus();
    fireEvent.keyDown(result, { key: "ArrowUp" });
    expect(input).toHaveFocus();
    fireEvent.click(within(dialog).getByRole("button", { name: copy.close }));

    expect(dialog).not.toHaveAttribute("open");
    await waitFor(() => expect(launcher).toHaveFocus());
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("closes the language menu with Escape without navigating away from a detail", () => {
    navigation.pathname = "/projects/project-simurgh";
    const { container } = render(shell("Project evidence"));
    const menu = container.querySelector<HTMLDetailsElement>(".os-language")!;
    const summary = menu.querySelector("summary")!;
    fireEvent.click(summary);
    expect(menu.open).toBe(true);
    const language = within(menu).getByRole("link", { name: "Español" });
    language.focus();

    fireEvent.keyDown(language, { key: "Escape" });

    expect(menu.open).toBe(false);
    expect(summary).toHaveFocus();
    expect(navigation.push).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Project evidence" }),
    ).toBeVisible();
  });

  it("dismisses an open language menu even when pointer activation leaves focus elsewhere", () => {
    navigation.pathname = "/contact";
    const { container } = render(shell("Contact Raouf"));
    const menu = container.querySelector<HTMLDetailsElement>(".os-language")!;
    const summary = menu.querySelector("summary")!;
    fireEvent.click(summary);
    expect(menu.open).toBe(true);

    fireEvent.keyDown(document.body, { key: "Escape" });

    expect(menu.open).toBe(false);
    expect(summary).toHaveFocus();
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("respects Escape already consumed by another control", () => {
    navigation.pathname = "/contact";
    render(shell("Contact Raouf"));
    const escape = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    escape.preventDefault();

    fireEvent(document.body, escape);

    expect(navigation.push).not.toHaveBeenCalled();
  });
});
