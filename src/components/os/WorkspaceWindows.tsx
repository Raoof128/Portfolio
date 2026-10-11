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
}: {
  application: RegisteredApplication;
  active: boolean;
  minimized: boolean;
  placement: number;
  locale: Locale;
  entries: SearchEntry[];
  actions: WindowActions;
  locked: boolean;
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
  const shareTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disposed = useRef(false);
  const previousActive = useRef(active);
  const firstFocus = useRef(true);

  useLayoutEffect(() => {
    if (minimized !== reading.minimized) {
      if (minimized) reading.minimize();
      else reading.restore();
    }
  }, [minimized, reading]);

  useLayoutEffect(() => {
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
  }, [active, minimized, locked, initial]);

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
      onPointerDownCapture={() => {
        if (!active) actions.focus(descriptor.id);
      }}
    >
      <div className="os-windowbar">
        <div className="os-window-navigation">
          <Link
            className="os-window-back"
            href={parentPath}
            aria-label={copy.back}
            tabIndex={active ? 0 : -1}
          >
            <ArrowLeft aria-hidden="true" />
          </Link>
          <OSIcon app={app} />
          <button
            type="button"
            onClick={() => actions.focus(descriptor.id)}
            aria-label={`${commands.restoreWindow}: ${title}`}
            id={`${controlId}-title`}
            className={`os-window-title ${reading.desktop ? "os-window-title--movable" : ""}`}
            lang={titleLocale}
            dir={locales[titleLocale].dir}
            onPointerDown={(event) => {
              setExpanded(false);
              reading.beginPointer(event, "move");
            }}
            {...reading.pointerHandlers}
          >
            {title}
          </button>
        </div>
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
              aria-label={expanded ? copy.restore : copy.expand}
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
      {shareStatus && (
        <p className="os-share-status" role="status">
          {shareStatus}
        </p>
      )}
      <Activity mode={hidden ? "hidden" : "visible"}>
        <ApplicationStateContext.Provider value={initial}>
          <ApplicationVisibilityContext.Provider
            value={{ active: active && !hidden, namespace }}
          >
            <div
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
            onPointerDown={(event) => {
              setExpanded(false);
              reading.beginPointer(event, "resize");
            }}
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

export function WorkspaceWindows({
  state,
  applications,
  pathname,
  locale,
  role,
  entries,
  actions,
  locked,
}: {
  state: WorkspaceState;
  applications: ReadonlyMap<string, RegisteredApplication>;
  pathname: string;
  locale: Locale;
  role: string;
  entries: SearchEntry[];
  actions: WindowActions;
  locked: boolean;
}) {
  const commands = getWindowCopy(locale);
  const copy = getOSCopy(locale);
  const current = state.windows.find(
    (item) => item.descriptor.path === pathname,
  );
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
            key={item.descriptor.id}
            application={application}
            active={state.activeId === item.descriptor.id && !desktopVisible}
            minimized={item.minimized}
            placement={index}
            locale={locale}
            entries={entries}
            actions={actions}
            locked={locked}
          />
        );
      })}
      {current?.minimized && (
        <button
          className="os-minimized-task"
          data-window-id={current.descriptor.id}
          type="button"
          aria-label={`${commands.restoreWindow}: ${entries.find((entry) => entry.href === current.descriptor.path)?.title ?? copy[appForDescriptor(current.descriptor)]}`}
          aria-describedby={`current-minimized-${locale}`}
          onClick={() => actions.restore(current.descriptor.id)}
        >
          <OSIcon app={appForDescriptor(current.descriptor)} />
          <span>
            <strong>
              <bdi>
                {entries.find((entry) => entry.href === current.descriptor.path)
                  ?.title ?? copy[appForDescriptor(current.descriptor)]}
              </bdi>
            </strong>
            <small id={`current-minimized-${locale}`}>
              {commands.minimized} · {commands.restoreWindow}
            </small>
          </span>
        </button>
      )}
    </div>
  );
}
