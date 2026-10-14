import {
  useLayoutEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactElement,
} from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Locale } from "@/i18n";
import { OSApplicationBridge } from "./OSApplicationBridge";
import {
  ApplicationRegistrationContext,
  ApplicationVisibilityContext,
  useContentId,
  useInitialAppState,
  type RegisteredApplication,
} from "./application-context";
import { ResearchOS } from "./ResearchOS";

const navigation = vi.hoisted(() => ({ pathname: "/about", push: vi.fn() }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => navigation,
}));

vi.mock("next/link", () => ({
  default: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props} />
  ),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function ConcreteLeaf({ title }: { title: string }) {
  return <h1>{title}</h1>;
}

function registrationProvider(
  leaf: ReactElement,
  register: (application: RegisteredApplication) => void,
  ready = false,
  locale: Locale = "en",
  route = "/projects",
) {
  return (
    <ApplicationRegistrationContext.Provider value={{ ready, register }}>
      <OSApplicationBridge locale={locale} route={route}>
        {leaf}
      </OSApplicationBridge>
    </ApplicationRegistrationContext.Provider>
  );
}

function BrowserPopulatedLeaf() {
  const container = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = container.current!;
    const query =
      element.querySelector<HTMLInputElement>("input[type=search]")!;
    const category = element.querySelector<HTMLSelectElement>("select")!;
    const subject = element.querySelector<HTMLInputElement>(
      "input[name=subject]",
    )!;
    const message = element.querySelector<HTMLTextAreaElement>("textarea")!;
    // Child layout Effects run before the Bridge's Effect. This simulates the
    // browser-populated DOM boundary; it is not a native pre-hydration test.
    query.value = "simurgh containment";
    category.value = "DEFENSIVE";
    subject.value = "Evidence request";
    message.value = "m".repeat(10010);
    query.focus();
    query.setSelectionRange(2, 9);
    const page = element.closest<HTMLElement>(".os-page-content")!;
    const toolbar =
      page.parentElement!.querySelector<HTMLElement>(".os-windowbar")!;
    vi.spyOn(page, "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ x: 0, y: -300, width: 1000, height: 2000 }),
    );
    vi.spyOn(toolbar, "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ x: 0, y: 58, width: 1000, height: 57 }),
    );
  }, []);
  return (
    <div ref={container}>
      <h1>Project fixture</h1>
      <div className="os-explorer-controls">
        <div className="os-explorer-search">
          <input
            type="search"
            name="project-query"
            aria-label="Project search"
          />
        </div>
        <select aria-label="Project category" defaultValue="ALL">
          <option value="ALL">All</option>
          <option value="DEFENSIVE">Defensive</option>
        </select>
      </div>
      <input name="subject" aria-label="Subject" />
      <textarea name="message" aria-label="Message" />
    </div>
  );
}

function HydratedDraftLeaf() {
  const initial = useInitialAppState();
  const [draft, setDraft] = useState(initial.fields?.draft ?? "");
  return (
    <>
      <h1>Hydration fixture</h1>
      <label>
        Draft
        <input
          name="draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
      </label>
    </>
  );
}

describe("OSApplicationBridge handover contract", () => {
  it("keeps the concrete document readable in the direct SSR fallback", () => {
    const register = vi.fn<(application: RegisteredApplication) => void>();
    const html = renderToString(
      registrationProvider(<ConcreteLeaf title="Server document" />, register),
    );
    expect(html).toContain('<div class="os-app-bridge">');
    expect(html).toContain("<h1>Server document</h1>");
    expect(register).not.toHaveBeenCalled();
  });

  it("publishes the exact immutable concrete leaf rather than its fallback wrapper", () => {
    const register = vi.fn<(application: RegisteredApplication) => void>();
    const leaf = Object.freeze(<ConcreteLeaf title="Independent app" />);
    render(registrationProvider(leaf, register, false, "fa"));
    expect(register).toHaveBeenCalledOnce();
    const publication = register.mock.calls[0][0];
    expect(publication.descriptor).toEqual({
      id: "/fa/projects",
      path: "/fa/projects",
      route: "/projects",
      locale: "fa",
      kind: "projects",
    });
    expect(publication.view).toBe(leaf);
    expect((publication.view as ReactElement).type).toBe(ConcreteLeaf);
    expect(leaf.props).toEqual({ title: "Independent app" });
    expect(
      screen.getByRole("heading", { name: "Independent app" }),
    ).toBeVisible();
  });

  it("captures simulated browser values, caret and reading point before handover", () => {
    const register = vi.fn<(application: RegisteredApplication) => void>();
    render(
      <section>
        <header className="os-windowbar">Toolbar</header>
        <div className="os-page-content">
          {registrationProvider(<BrowserPopulatedLeaf />, register)}
        </div>
      </section>,
    );
    expect(register).toHaveBeenCalledOnce();
    const initial = register.mock.calls[0][0].initial;
    expect(initial).toMatchObject({
      projectQuery: "simurgh containment",
      projectCategory: "DEFENSIVE",
      focusedField: "project-query",
      selectionStart: 2,
      selectionEnd: 9,
      readingOffset: 415,
      fields: {
        "project-query": "simurgh containment",
        subject: "Evidence request",
        message: "m".repeat(10000),
      },
    });
    // A publication is a value snapshot, not a live reference to browser fields.
    (screen.getByRole("searchbox") as HTMLInputElement).value = "changed later";
    (
      screen.getByRole("textbox", { name: "Message" }) as HTMLTextAreaElement
    ).value = "later";
    expect(initial.projectQuery).toBe("simurgh containment");
    expect(initial.fields?.message).toHaveLength(10000);
  });

  it("preserves server-DOM text, focus and caret through real React hydration and handover in jsdom", async () => {
    // This uses renderToString + hydrateRoot, not a simulated child Effect.
    // It proves React/jsdom handover, not Next navigation or native autofill.
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
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    navigation.pathname = "/about";
    navigation.push.mockClear();
    const tree = (
      <ResearchOS locale="en" role="Researcher" entries={[]} skipLabel="Skip">
        <OSApplicationBridge locale="en" route="/about">
          <HydratedDraftLeaf />
        </OSApplicationBridge>
      </ResearchOS>
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(tree);
    document.body.append(container);
    const serverInput = container.querySelector<HTMLInputElement>(
      'input[name="draft"]',
    )!;
    serverInput.value = "Before hydration draft";
    serverInput.focus();
    serverInput.setSelectionRange(3, 7);
    const recoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(container, tree, {
          onRecoverableError: recoverableError,
        });
      });
      const retained = container.querySelector<HTMLInputElement>(
        '[data-window-path="/about"] input[name="draft"]',
      )!;
      expect(retained).not.toBe(serverInput);
      expect(retained.value).toBe("Before hydration draft");
      expect(document.activeElement).toBe(retained);
      expect(retained.selectionStart).toBe(3);
      expect(retained.selectionEnd).toBe(7);
      expect(recoverableError).not.toHaveBeenCalled();
      expect(navigation.push).not.toHaveBeenCalled();
    } finally {
      await act(async () => root?.unmount());
      container.remove();
    }
  });

  it("removes its fallback when ready without republishing or recreating a stable leaf", () => {
    const mounted = vi.fn();
    const removed = vi.fn();
    const register = vi.fn<(application: RegisteredApplication) => void>();
    function LifecycleLeaf() {
      useLayoutEffect(() => {
        mounted();
        return removed;
      }, []);
      return <h1>Fallback lifecycle</h1>;
    }
    const leaf = <LifecycleLeaf />;
    const view = render(registrationProvider(leaf, register));
    expect(mounted).toHaveBeenCalledOnce();
    expect(register).toHaveBeenCalledOnce();
    view.rerender(registrationProvider(leaf, register, true));
    expect(view.container).toBeEmptyDOMElement();
    expect(removed).toHaveBeenCalledOnce();
    view.rerender(registrationProvider(leaf, register, true));
    expect(register).toHaveBeenCalledOnce();
    expect(mounted).toHaveBeenCalledOnce();
    expect(removed).toHaveBeenCalledOnce();
    expect(register.mock.calls[0][0].view).toBe(leaf);
  });

  it.each([
    ["en", "/missing"],
    ["en", "/projects/missing"],
    ["fa", "/fa/projects"],
    ["xx", "/projects"],
  ])("does not publish unsupported locale=%s route=%s", (locale, route) => {
    const register = vi.fn<(application: RegisteredApplication) => void>();
    render(
      registrationProvider(
        <ConcreteLeaf title="Safe fallback" />,
        register,
        false,
        locale as Locale,
        route,
      ),
    );
    expect(register).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Safe fallback" }),
    ).toBeVisible();
  });
});

function FragmentLeaf({ label }: { label: string }) {
  const contentId = useContentId();
  return (
    <div data-testid={label}>
      <a href={`#${contentId("overview")}`}>Overview</a>
      <section
        id={contentId("overview")}
        aria-labelledby={contentId("overview-heading")}
      >
        <h2 id={contentId("overview-heading")}>{label}</h2>
        <label htmlFor={contentId("notes")}>Notes</label>
        <input id={contentId("notes")} defaultValue="retained" />
      </section>
    </div>
  );
}

function FragmentWorkspace({
  locale,
  active,
}: {
  locale: Locale;
  active: "a" | "b";
}) {
  return (
    <div lang={locale} dir={locale === "fa" || locale === "ar" ? "rtl" : "ltr"}>
      {(["a", "b"] as const).map((id) => (
        <ApplicationVisibilityContext.Provider
          key={id}
          value={{ active: active === id, namespace: `pane-${id}` }}
        >
          <FragmentLeaf label={id} />
        </ApplicationVisibilityContext.Provider>
      ))}
    </div>
  );
}

describe("same-locale retained content namespaces", () => {
  it.each<Locale>(["en", "fa", "ar", "zh", "es"])(
    "moves IDs, ARIA references and fragments together in %s without remounting content",
    (locale) => {
      const view = render(<FragmentWorkspace locale={locale} active="a" />);
      const originalA = screen.getByTestId("a").querySelector("input")!;
      originalA.value = "keep this draft";
      const verify = (active: "a" | "b") => {
        const ids = Array.from(
          view.container.querySelectorAll("[id]"),
          (node) => node.id,
        );
        expect(new Set(ids).size).toBe(ids.length);
        for (const id of ["a", "b"] as const) {
          const root = screen.getByTestId(id);
          const prefix = active === id ? "" : `pane-${id}-`;
          const region = root.querySelector("section")!;
          const heading = root.querySelector("h2")!;
          const input = root.querySelector("input")!;
          expect(region.id).toBe(`${prefix}overview`);
          expect(region.getAttribute("aria-labelledby")).toBe(heading.id);
          expect(root.querySelector("a")).toHaveAttribute(
            "href",
            `#${region.id}`,
          );
          expect(root.querySelector("label")).toHaveAttribute("for", input.id);
        }
      };
      verify("a");
      view.rerender(<FragmentWorkspace locale={locale} active="b" />);
      verify("b");
      expect(screen.getByTestId("a").querySelector("input")).toBe(originalA);
      expect(originalA).toHaveValue("keep this draft");
      view.rerender(<FragmentWorkspace locale={locale} active="a" />);
      verify("a");
      expect(originalA).toHaveValue("keep this draft");
    },
  );
});
