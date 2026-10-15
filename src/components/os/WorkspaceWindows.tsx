"use client";

import {
  Activity,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowLeft,
  Copy,
  Maximize2,
  Minimize2,
  Minus,
  X,
} from "lucide-react";
import { locales, type Locale } from "@/i18n";
import type { SearchEntry } from "@/lib/os-search-query";
import type { OSAppDescriptor } from "@/lib/os-app-schema";
import { getOSCopy } from "./os-copy";
import { getWindowCopy } from "./window-copy";
import { OSIcon, type PortfolioApp } from "./OSIcon";
import { Desktop } from "./Desktop";
import { ReadingWindowControls } from "./ReadingWindowControls";
import { useReadingWindow } from "./use-reading-window";
import {
  ApplicationStateContext,
  ApplicationVisibilityContext,
  type RegisteredApplication,
} from "./application-context";
import type { WorkspaceState } from "./workspace-model";
import "./workspace-windows.css";

export function appForDescriptor(descriptor: OSAppDescriptor): PortfolioApp {
  if (descriptor.route.startsWith("/projects")) return "projects";
  if (
    descriptor.route.startsWith("/write-ups") ||
    descriptor.route.startsWith("/lab")
  )
    return "research";
  if (descriptor.route === "/resume") return "resume";
  if (descriptor.route === "/contact") return "contact";
  return "about";
}

type WindowActions = {
  focus: (id: string) => void;
  minimize: (id: string) => void;
  restore: (id: string) => void;
  close: (id: string) => void;
};

function ApplicationWindow({
  application,
  active,
  minimized,
  placement,
  locale,
  entries,
  actions,
  locked,
  loading = false,
}: {
  application: RegisteredApplication;
  active: boolean;
  minimized: boolean;
  placement: number;
  locale: Locale;
  entries: SearchEntry[];
  actions: WindowActions;
  locked: boolean;
  /** The next page is still loading into this frame. */
  loading?: boolean;
}) {
  const { descriptor, view, initial } = application;
  const pane = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const controlId = useId();
  const copy = getOSCopy(locale);
  const commands = getWindowCopy(locale);
  const reading = useReadingWindow(descriptor.path, pane, {
    active: active && !minimized && !locked,
    initialFloating: true,
    initialReadingOffset: initial.readingOffset,
    placement,
    // A plain click on the title keeps the expanded state; movement ends it.
    onGesture: () => setExpanded(false),
    // Moving to another page swaps the document, not the window around it.
    retainGeometry: true,
  });
  const app = appForDescriptor(descriptor);
  const entry = entries.find((item) => item.href === descriptor.path);
  const title =
    entry?.title ??
    (descriptor.route.startsWith("/lab") ? copy.experiments : copy[app]);
  const titleLocale = entry?.titleLocale ?? locale;
  const namespace = `pane-${descriptor.route.replace(/[^a-z0-9-]/gi, "-")}`;
  const home = locale === "en" ? "/" : `/${locale}`;
  const parent = descriptor.route.startsWith("/projects/")
    ? "/projects"
    : descriptor.route.startsWith("/write-ups/")
      ? "/write-ups"
      : descriptor.route.startsWith("/lab/")
        ? "/lab"
        : "";
  const parentPath = parent
    ? `${locale === "en" ? "" : `/${locale}`}${parent}`
    : home;
  const [shareStatus, setShareStatus] = useState("");
  const [expanded, setExpanded] = useState(false);
  // The URL only changes once the next page is ready, so a followed link marks
  // the gap between the click and the new document.
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  // When the frame's document changes, the wait for the previous one has ended.
  // Clearing during render (not in an effect) stops a stale id from showing the
  // loading hairline again on a later return to the same page.
  const [settledDocument, setSettledDocument] = useState(descriptor.id);
  if (settledDocument !== descriptor.id) {
    setSettledDocument(descriptor.id);
    setPendingFrom(null);
  }
  const pending = pendingFrom === descriptor.id;
  const shareTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disposed = useRef(false);
  const previousActive = useRef(active);
  const firstFocus = useRef(true);
  const focusedDocument = useRef(descriptor.id);

  useLayoutEffect(() => {
    if (minimized !== reading.minimized) {
      if (minimized) reading.minimize();
      else reading.restore();
    }
  }, [minimized, reading]);

  useLayoutEffect(() => {
    // A new document in the retained frame takes focus like a newly opened one.
    if (focusedDocument.current !== descriptor.id) {
      focusedDocument.current = descriptor.id;
      previousActive.current = false;
    }
    if (!active || minimized || locked) {
      previousActive.current = false;
      return;
    }
    if (firstFocus.current && initial.focusedField) {
      const field =
        initial.focusedField === "project-query"
          ? pane.current?.querySelector<HTMLInputElement>(
              ".os-explorer-search input",
            )
          : Array.from(
              pane.current?.querySelectorAll<
                HTMLInputElement | HTMLTextAreaElement
              >("input[name], textarea[name]") ?? [],
            ).find((item) => item.name === initial.focusedField);
      field?.focus({ preventScroll: true });
      if (field && initial.selectionStart !== undefined) {
        try {
          field.setSelectionRange(
            initial.selectionStart ?? 0,
            initial.selectionEnd ?? initial.selectionStart ?? 0,
          );
        } catch {
          /* Email and other non-text input types have no caret API. */
        }
      }
    } else if (!previousActive.current) {
      const heading = pane.current?.querySelector<HTMLElement>("h1");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
    firstFocus.current = false;
    previousActive.current = true;
  }, [active, minimized, locked, initial, descriptor.id]);

  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(() => setPendingFrom(null), 8000);
    return () => clearTimeout(timer);
  }, [pending]);

  useEffect(() => {
    disposed.current = false;
    return () => {
      disposed.current = true;
      if (shareTimer.current) clearTimeout(shareTimer.current);
    };
  }, []);

  async function copyLink() {
    try {
      const hash =
        active && location.pathname === descriptor.path ? location.hash : "";
      await navigator.clipboard.writeText(
        `${location.origin}${descriptor.path}${hash}`,
      );
      if (disposed.current) return;
      setShareStatus(copy.copied);
    } catch {
      if (disposed.current) return;
      setShareStatus(copy.copyFailed);
    }
    if (shareTimer.current) clearTimeout(shareTimer.current);
    shareTimer.current = setTimeout(() => setShareStatus(""), 3500);
  }

  function resizeKeys(event: KeyboardEvent<HTMLButtonElement>) {
    if (
      event.defaultPrevented ||
      event.nativeEvent.isComposing ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    )
      return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      reading.stopGesture();
      pane.current?.focus();
      return;
    }
    const step = event.shiftKey ? 48 : 12;
    const delta = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    }[event.key];
    if (delta) {
      event.preventDefault();
      event.stopPropagation();
      setExpanded(false);
      reading.resize(delta);
    }
  }

  const hidden = minimized || locked || (!reading.desktop && !active);
  return (
    <section
      ref={pane}
      id={active && !hidden ? "main-content" : namespace}
      role={active && !hidden ? "main" : "region"}
      aria-labelledby={`${controlId}-title`}
      tabIndex={-1}
      className={`os-window os-workspace-window ${reading.rect ? "os-window--floating" : ""}`}
      data-window-path={descriptor.path}
      data-active={active}
      hidden={hidden}
      style={
        reading.rect
          ? {
              left: reading.rect.x,
              top: reading.rect.y,
              width: reading.rect.width,
              height: reading.rect.height,
              zIndex: 30 + placement,
            }
          : undefined
      }
      onClickCapture={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const link = (event.target as Element).closest?.("a[href]");
        if (!(link instanceof HTMLAnchorElement) || link.target) return;
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin || url.pathname === descriptor.path)
          return;
        if (link.hasAttribute("download") || /\.[a-z0-9]+$/i.test(url.pathname))
          return;
        setPendingFrom(descriptor.id);
      }}
      onPointerDownCapture={() => {
        if (!active) actions.focus(descriptor.id);
      }}
    >
      <div className="os-windowbar">
        {(loading || pending) && (
          // One 2px accent hairline while the next page loads. The class name
          // stays so the existing pending-state test keeps its hook.
          <div className="os-window-scan" aria-hidden="true" />
        )}
        <div className="os-window-navigation">
          {/* The visible word is part of the name, so the name matches what sighted users read. */}
          <Link
            className="os-window-back"
            href={parentPath}
            tabIndex={active ? 0 : -1}
          >
            <ArrowLeft aria-hidden="true" />
            <span>{copy.back}</span>
          </Link>
          <OSIcon app={app} />
        </div>
        <button
          type="button"
          onClick={() => actions.focus(descriptor.id)}
          // The title names the landmark; the drag affordance is advisory.
          title={reading.desktop ? commands.moveWindow : undefined}
          id={`${controlId}-title`}
          className={`os-window-title ${reading.desktop ? "os-window-title--movable" : ""}`}
          lang={titleLocale}
          dir={locales[titleLocale].dir}
          onPointerDown={(event) => reading.beginPointer(event, "move")}
          {...reading.pointerHandlers}
        >
          {title}
        </button>
        <div className="os-window-actions">
          {active && reading.desktop && !hidden && (
            <ReadingWindowControls
              locale={locale}
              onMove={(delta) => {
                setExpanded(false);
                reading.move(delta);
              }}
              onResize={(delta) => {
                setExpanded(false);
                reading.resize(delta);
              }}
              onReset={() => {
                setExpanded(false);
                reading.reset();
              }}
              floating={!!reading.rect}
            />
          )}
          <button
            className="os-control"
            onClick={copyLink}
            aria-label={copy.copyLink}
            tabIndex={active ? 0 : -1}
          >
            <Copy aria-hidden="true" />
          </button>
          <button
            className="os-control"
            onClick={() => {
              reading.minimize();
              actions.minimize(descriptor.id);
            }}
            aria-label={commands.minimize}
            tabIndex={active ? 0 : -1}
          >
            <Minus aria-hidden="true" />
          </button>
          {reading.desktop && (
            <button
              className="os-control os-expand"
              onClick={() => {
                if (expanded) reading.restoreSize();
                else reading.maximize();
                setExpanded((value) => !value);
              }}
              // The name is constant; aria-pressed carries the expanded state.
              aria-label={commands.fullSize}
              aria-pressed={expanded}
              tabIndex={active ? 0 : -1}
            >
              {expanded ? (
                <Minimize2 aria-hidden="true" />
              ) : (
                <Maximize2 aria-hidden="true" />
              )}
            </button>
          )}
          <button
            className="os-control os-window-close"
            onClick={() => actions.close(descriptor.id)}
            aria-label={copy.close}
            tabIndex={active ? 0 : -1}
          >
            <X aria-hidden="true" />
          </button>
        </div>
      </div>
      {/* The live region stays mounted so assistive tech announces updates. */}
      <p className={shareStatus ? "os-share-status" : "sr-only"} role="status">
        {shareStatus}
      </p>
      <Activity mode={hidden ? "hidden" : "visible"}>
        <ApplicationStateContext.Provider value={initial}>
          <ApplicationVisibilityContext.Provider
            value={{ active: active && !hidden, namespace }}
          >
            <div
              // Each document starts with fresh state and scroll position.
              key={descriptor.id}
              ref={content}
              className="os-page-content"
              inert={!active}
              onScroll={reading.onContentScroll}
            >
              {view}
            </div>
          </ApplicationVisibilityContext.Provider>
        </ApplicationStateContext.Provider>
      </Activity>
      {active && reading.rect && !hidden && (
        <>
          <span id={`${controlId}-resize`} className="sr-only">
            {commands.resizeHint}
          </span>
          <button
            className="os-control os-window-resize"
            aria-label={commands.resizeWindow}
            aria-describedby={`${controlId}-resize`}
            onPointerDown={(event) => reading.beginPointer(event, "resize")}
            {...reading.pointerHandlers}
            onKeyDown={resizeKeys}
          >
            <ArrowDownRight aria-hidden="true" />
          </button>
        </>
      )}
    </section>
  );
}

function MinimizedTask({
  current,
  entries,
  locale,
  onRestore,
}: {
  current: WorkspaceState["windows"][number];
  entries: SearchEntry[];
  locale: Locale;
  onRestore: () => void;
}) {
  const commands = getWindowCopy(locale);
  const copy = getOSCopy(locale);
  const entry = entries.find((item) => item.href === current.descriptor.path);
  const title = entry?.title ?? copy[appForDescriptor(current.descriptor)];
  const titleLocale = entry?.titleLocale ?? locale;
  return (
    <button
      className="os-minimized-task"
      data-window-id={current.descriptor.id}
      type="button"
      aria-label={`${commands.restoreWindow}: ${title}`}
      aria-describedby={`current-minimized-${locale}`}
      onClick={onRestore}
    >
      <OSIcon app={appForDescriptor(current.descriptor)} />
      <span>
        <strong>
          <bdi lang={titleLocale} dir={locales[titleLocale].dir}>
            {title}
          </bdi>
        </strong>
        <small id={`current-minimized-${locale}`}>{commands.minimized}</small>
      </span>
    </button>
  );
}

export function WorkspaceWindows({
  state,
  applications,
  pathname,
  locale,
  role,
  entries,
  actions,
  locked,
  navigating = false,
}: {
  state: WorkspaceState;
  applications: ReadonlyMap<string, RegisteredApplication>;
  pathname: string;
  locale: Locale;
  role: string;
  entries: SearchEntry[];
  actions: WindowActions;
  locked: boolean;
  /** The route moved to another window page that has not registered yet. */
  navigating?: boolean;
}) {
  // While the next page loads, the open window stays current instead of
  // revealing the desktop for a frame.
  const current =
    state.windows.find((item) => item.descriptor.path === pathname) ??
    (navigating ? state.windows[0] : undefined);
  const desktopVisible = !current || current.minimized;
  return (
    <div className="os-workspace">
      <main
        id={desktopVisible && !locked ? "main-content" : undefined}
        className="os-main os-workspace-desktop"
        inert={!desktopVisible}
        aria-hidden={!desktopVisible}
        tabIndex={-1}
      >
        <Desktop
          locale={locale}
          role={role}
          interactive={desktopVisible && !locked}
        />
      </main>
      {state.windows.map((item, index) => {
        const application = applications.get(item.descriptor.id);
        if (!application) return null;
        return (
          <ApplicationWindow
            // One window frame persists across pages; only its document changes.
            key={index}
            application={application}
            active={state.activeId === item.descriptor.id && !desktopVisible}
            minimized={item.minimized}
            placement={index}
            locale={locale}
            entries={entries}
            actions={actions}
            locked={locked}
            loading={navigating}
          />
        );
      })}
      {current?.minimized && (
        <MinimizedTask
          current={current}
          entries={entries}
          locale={locale}
          onRestore={() => actions.restore(current.descriptor.id)}
        />
      )}
    </div>
  );
}
