"use client";

import {
  Activity,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  BookOpen,
  FileText,
  FlaskConical,
  FolderOpen,
  Globe,
  Languages,
  LockKeyhole,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { locales, type Locale } from "@/i18n";
import { getLocalizedPath, getLocaleFromPath } from "@/i18n/navigation";
import {
  clearLanguageNavigation,
  consumeLanguageNavigation,
  prepareLanguageNavigation,
} from "./language-navigation";
import { formatDate, formatNumber } from "@/i18n/format";
import { searchEntries, type SearchEntry } from "@/lib/os-search-query";
import { getOSCopy } from "./os-copy";
import {
  markWelcomeSeen,
  WelcomeEnter,
  welcomeSeenThisSession,
} from "./WelcomeEnter";
import "./controls.css";
import "./theme-switch.css";
import { OSIcon, OSMark, type PortfolioApp } from "./OSIcon";
import { Desktop } from "./Desktop";
import { ProofAtlasVisibilityContext } from "./proof-atlas-context";
import { ReadingWindowControls } from "./ReadingWindowControls";
import { useReadingWindow } from "./use-reading-window";
import { useCopyrightYear } from "./use-copyright-year";
import { getWindowCopy } from "./window-copy";
import { getAtlasJourneyCopy } from "./atlas-journey-copy";
import {
  ApplicationRegistrationContext,
  type RegisteredApplication,
} from "./application-context";
import { WorkspaceWindows, appForDescriptor } from "./WorkspaceWindows";
import { createWorkspaceState, workspaceReducer } from "./workspace-model";
import { getOSAppDescriptor } from "@/lib/os-app-schema";
import {
  DEFAULT_APPEARANCE,
  readStoredAppearance,
  subscribeAppearance,
  writeAppearance,
  type Appearance,
} from "./appearance";
import "./research-os.css";
import "./liquid-glass.css";
import "./reading-window.css";
import "7.css/dist/7.scoped.css";
import "./win7-theme.css";
import "./win7-logon.css";
import "./win7-taskbar.css";
import "./win7-desktop.css";
import "./win7-windows.css";
import "./win7-explorer.css";
import "./win7-pages.css";
import "./win7-polish.css";
import { mountSpotlight } from "./spotlight";
import {
  readMinuteClock,
  serverMinuteClock,
  subscribeMinuteClock,
} from "./minute-clock";

const apps: PortfolioApp[] = [
  "projects",
  "research",
  "about",
  "resume",
  "contact",
];
const appPaths = {
  projects: "/projects",
  research: "/write-ups",
  about: "/about",
  resume: "/resume",
  contact: "/contact",
};
const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const serverAppearance = (): Appearance => DEFAULT_APPEARANCE;
function systemColorScheme(): MediaQueryList | null {
  return typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;
}

function subscribeSystemAppearance(callback: () => void) {
  const query = systemColorScheme();
  query?.addEventListener?.("change", callback);
  return () => query?.removeEventListener?.("change", callback);
}

/** A first visit follows `prefers-color-scheme`; without it the shell stays dark. */
function readSystemAppearance(): Appearance {
  return systemColorScheme()?.matches === false ? "light" : "dark";
}

/** Platform-correct shortcut: ⌘K on Apple platforms, Ctrl K elsewhere. */
function readApplePlatform(): boolean {
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}
const searchIcons = {
  project: FolderOpen,
  paper: BookOpen,
  writing: FileText,
  experiment: FlaskConical,
  action: Globe,
};

/** Escape closes the window it is pressed in. The hint is read by screen readers and kept off screen. */
const escapeHintCopy: Record<Locale, string> = {
  en: "Press Escape to close this window.",
  fa: "برای بستن این پنجره، کلید Escape را فشار دهید.",
  ar: "اضغط Escape لإغلاق هذه النافذة.",
  es: "Pulsa Escape para cerrar esta ventana.",
  zh: "按 Esc 关闭此窗口。",
};

/** How long a requested focus move waits for its window to render before it gives up. */
const OPEN_FOCUS_MS = 4000;
/** Session key for the page a lock left, so the next unlock can reopen it. */
const lastPathKey = "researchos:last-path";

/** A path as the shell compares it: the English root has no prefix, other locales keep theirs. */
function routeKey(href: string): string {
  return href.split(/[?#]/)[0].replace(/^\/en(?=\/|$)/, "") || "/";
}

function rememberLastPath(path: string | null) {
  try {
    if (path) window.sessionStorage.setItem(lastPathKey, path);
    else window.sessionStorage.removeItem(lastPathKey);
  } catch {
    // Storage can be blocked; the unlock then lands on home, as before.
  }
}

/** Reads and clears the path a lock left. Storage that cannot be read gives no path. */
function recallLastPath(): string | null {
  try {
    const path = window.sessionStorage.getItem(lastPathKey);
    window.sessionStorage.removeItem(lastPathKey);
    return path;
  } catch {
    return null;
  }
}

/**
 * The surface focus should land in for a requested page: the active window that shows it, or the
 * route's own main element when the page is not a window. Null while that page is not on screen.
 */
function openedSurface(
  path: string,
  routeMain: HTMLElement | null,
): HTMLElement | null {
  const frame = document.querySelector<HTMLElement>(
    "section.os-workspace-window[data-active='true']",
  );
  if (frame) {
    if (routeKey(frame.dataset.windowPath ?? "") !== path) return null;
    return frame.querySelector<HTMLElement>(".os-page-content") ?? frame;
  }
  return routeMain && !routeMain.hidden ? routeMain : null;
}

/**
 * A language switch remounts the shell for the new locale, so its focus request and crossfade
 * cross the remount in session storage. The entry is short-lived and read once.
 */
const languageCarryKey = "researchos:language-carry";

function carryLanguageSwitch(href: string) {
  try {
    window.sessionStorage.setItem(
      languageCarryKey,
      JSON.stringify({ path: routeKey(href), at: Date.now() }),
    );
  } catch {
    // Storage can be blocked; focus then stays where the browser leaves it.
  }
}

function takeLanguageSwitch(): string | null {
  try {
    const raw = window.sessionStorage.getItem(languageCarryKey);
    window.sessionStorage.removeItem(languageCarryKey);
    if (!raw || raw.length > 512) return null;
    const value = JSON.parse(raw) as { path?: unknown; at?: unknown };
    if (typeof value.path !== "string" || typeof value.at !== "number")
      return null;
    return Date.now() - value.at <= OPEN_FOCUS_MS ? value.path : null;
  } catch {
    return null;
  }
}

function reducedMotionPreferred(): boolean {
  try {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch {
    return false;
  }
}

/** How long the shell carries data-theme-switching after a theme change (theme-switch.css). */
const THEME_SWITCH_MS = 240;
const themeSwitchTimers = new WeakMap<HTMLElement, number>();

/**
 * Marks the shell for the colour cross-fade from the theme switch that was pressed. The attribute
 * is set for THEME_SWITCH_MS and then removed; under reduced motion it is never set, so the flip is
 * instant. Set in the same task as the appearance change, so the transition uses the new colours.
 */
function beginThemeSwitch(from: HTMLElement) {
  const shell = from.closest<HTMLElement>(".os-shell");
  if (!shell || reducedMotionPreferred()) return;
  const previous = themeSwitchTimers.get(shell);
  if (previous !== undefined) window.clearTimeout(previous);
  shell.setAttribute("data-theme-switching", "");
  const timer = window.setTimeout(() => {
    shell.removeAttribute("data-theme-switching");
    themeSwitchTimers.delete(shell);
  }, THEME_SWITCH_MS + 20);
  themeSwitchTimers.set(shell, timer);
}

function appForPath(path: string): PortfolioApp {
  if (path.startsWith("/projects")) return "projects";
  if (path.startsWith("/write-ups") || path.startsWith("/lab"))
    return "research";
  if (path.startsWith("/resume")) return "resume";
  if (path.startsWith("/contact")) return "contact";
  return "about";
}

const sydneyDateOptions: Intl.DateTimeFormatOptions = {
  timeZone: "Australia/Sydney",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

/**
 * Long welcome date. Intl gives fa-IR a Latin comma and the weekday last; the
 * Persian pattern is weekday first with the Persian comma (U+060C). ar already
 * formats that way, so both share one path. Other locales keep formatDate output.
 */
function formatSydneyDate(now: Date, locale: Locale): string {
  if (locale !== "fa" && locale !== "ar") {
    return formatDate(now, locale, sydneyDateOptions);
  }
  const parts = new Intl.DateTimeFormat(
    locale === "fa" ? "fa-IR" : "ar-u-nu-arab",
    sydneyDateOptions,
  ).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("weekday")}، ${part("day")} ${part("month")} ${part("year")}`;
}

function SydneyClock({
  locale,
  welcome = false,
}: {
  locale: Locale;
  welcome?: boolean;
}) {
  const timestamp = useSyncExternalStore(
    subscribeMinuteClock,
    readMinuteClock,
    serverMinuteClock,
  );
  const now = timestamp === null ? null : new Date(timestamp);
  const copy = getOSCopy(locale);
  const options = { timeZone: "Australia/Sydney" };
  const time = now
    ? formatDate(now, locale, {
        ...options,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "—:—";
  const date = now ? formatSydneyDate(now, locale) : undefined;
  // Short date for the taskbar clock, from the same formatDate helper and no new copy. Before
  // hydration it holds a dash, so the server render and the first client render both keep a
  // date line and the tray does not change height when the clock starts.
  const shortDate = now
    ? formatDate(now, locale, { ...options, dateStyle: "medium" })
    : "—";
  return welcome ? (
    <div className="os-lock-clock">
      <p className="os-eyebrow">{copy.timeZone}</p>
      <time className="os-lock-date" dateTime={now?.toISOString()}>
        {date ?? copy.welcome}
      </time>
      <span className="sr-only">{copy.currentTime}</span>
      <time className="os-lock-time" dir="ltr" dateTime={now?.toISOString()}>
        {time}
      </time>
    </div>
  ) : (
    <span className="os-top-clock">
      <span className="sr-only">{copy.timeZone}</span>
      <span className="sr-only">{copy.currentTime}</span>
      <time dir="ltr" dateTime={now?.toISOString()}>
        {time}
      </time>
      {/* A span rather than a second time, so each clock keeps one time element. */}
      {shortDate && <span className="os-top-date">{shortDate}</span>}
    </span>
  );
}

export function ResearchOS({
  children,
  locale,
  role,
  entries,
  skipLabel,
}: {
  children: ReactNode;
  locale: Locale;
  role: string;
  entries: SearchEntry[];
  skipLabel: string;
}) {
  const router = useRouter();
  const rawPath = usePathname();
  const pathname = rawPath.replace(/^\/en(?=\/|$)/, "") || "/";
  const home = locale === "en" ? "/" : `/${locale}`;
  const relativePath =
    locale === "en" ? pathname : pathname.slice(home.length) || "/";
  const isHome = pathname === home || pathname === `${home}/`;
  const copy = getOSCopy(locale);
  const atlasJourneyCopy = getAtlasJourneyCopy(locale);
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const storedAppearance = useSyncExternalStore(
    subscribeAppearance,
    readStoredAppearance,
    () => null,
  );
  const systemAppearance = useSyncExternalStore(
    subscribeSystemAppearance,
    readSystemAppearance,
    serverAppearance,
  );
  // An explicit choice persists; a first visit follows the system colour scheme.
  // The session value keeps a toggle working when storage cannot be written.
  const [sessionAppearance, setSessionAppearance] = useState<Appearance | null>(
    null,
  );
  const appearance = sessionAppearance ?? storedAppearance ?? systemAppearance;
  const applePlatform = useSyncExternalStore(
    emptySubscribe,
    readApplePlatform,
    serverSnapshot,
  );
  const shortcutText = applePlatform ? "⌘ K" : "Ctrl K";
  const shortcutKeys = applePlatform ? "Meta+K" : "Control+K";
  const [lockedPath, setLockedPath] = useState<string | null>(
    isHome ? pathname : null,
  );
  // The language being switched to while its route loads. It clears itself when the locale changes.
  const [languageSwitch, setLanguageSwitch] = useState<{
    from: Locale;
    to: Locale;
  } | null>(null);
  const languageArrival = useRef(false);
  const contentLayer = useRef<HTMLDivElement>(null);
  // The page the visitor just opened, so focus can move into it once it has rendered.
  const [focusRequest, setFocusRequest] = useState<{ path: string } | null>(
    null,
  );
  const firstLayoutPass = useRef(true);
  useLayoutEffect(() => {
    // The shell remounts for the new locale after a language switch: pick up its focus request
    // and the crossfade it was waiting for.
    const path = takeLanguageSwitch();
    if (!path) return;
    languageArrival.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot state across a locale-root remount
    setFocusRequest({ path });
  }, []);
  useEffect(() => mountSpotlight(), []);
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<SearchEntry["kind"] | "all">("all");
  const [shareStatus, setShareStatus] = useState("");
  const searchDialog = useRef<HTMLDialogElement>(null);
  const searchField = useRef<HTMLInputElement>(null);
  // The tray Search button. Focus returns here when nothing else had focus at open.
  const searchLauncher = useRef<HTMLButtonElement>(null);
  const dockStrip = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLElement>(null);
  const desktopContent = useRef<HTMLElement>(null);
  const minimizedTask = useRef<HTMLButtonElement>(null);
  const pendingWorkspacePath = useRef<string | null>(null);
  const reading = useReadingWindow(pathname, content);
  const copyrightYear = useCopyrightYear();
  const windowCopy = getWindowCopy(locale);
  const [workspace, setWorkspace] = useState(() => ({
    initialized: false,
    lastPath: pathname,
    model: createWorkspaceState(locale),
    applications: new Map<string, RegisteredApplication>(),
  }));
  const workspaceReady = workspace.initialized;
  const workspaceDisplayed =
    workspaceReady && (isHome || !!getOSAppDescriptor(pathname, locale));
  if (workspace.lastPath !== pathname) {
    const descriptor = getOSAppDescriptor(pathname, locale);
    const retained = descriptor && workspace.applications.has(descriptor.id);
    // Moving between window pages keeps the open window until the next page
    // registers and replaces its document; resetting here closed and reopened it.
    if (descriptor && !retained && workspace.model.windows.length > 0)
      setWorkspace({ ...workspace, lastPath: pathname });
    else
      setWorkspace({
        ...workspace,
        lastPath: pathname,
        model: retained
          ? workspaceReducer(workspace.model, {
              type: "focus",
              id: descriptor.id,
            })
          : createWorkspaceState(locale),
        applications: retained
          ? new Map([
              [descriptor.id, workspace.applications.get(descriptor.id)!],
            ])
          : new Map(),
      });
  }
  const registerApplication = useCallback(
    (application: RegisteredApplication) => {
      if (
        application.descriptor.path !== pathname ||
        application.descriptor.locale !== locale
      )
        return;
      pendingWorkspacePath.current = null;
      setWorkspace((value) => {
        // Keep only the current page. Navigating away disposes its view and drafts.
        const current = value.applications.get(application.descriptor.id);
        const applications = new Map([
          [application.descriptor.id, current ?? application],
        ]);
        return {
          ...value,
          initialized: true,
          applications,
          model: workspaceReducer(value.model, {
            type: "open",
            app: application.descriptor,
          }),
        };
      });
    },
    [pathname, locale],
  );
  const currentWorkspaceWindow = workspace.model.windows.find(
    (item) => item.descriptor.path === pathname,
  );
  const workspaceNavigating =
    !currentWorkspaceWindow &&
    workspace.model.windows.length > 0 &&
    !!getOSAppDescriptor(pathname, locale);
  const returnFocus = useRef<HTMLElement | null>(null);
  const focusAfterUnlock = useRef(false);
  const previousPath = useRef(pathname);
  const shareTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disposed = useRef(false);
  const lockRequested = useRef(false);
  const languageMenu = useRef<HTMLDetailsElement>(null);
  const locked = lockedPath === pathname;
  useEffect(() => {
    // Any shown desktop counts as seen for this session, so a reload goes straight to it.
    if (!locked) markWelcomeSeen();
  }, [locked]);
  useLayoutEffect(() => {
    const first = firstLayoutPass.current;
    firstLayoutPass.current = false;
    if (getLocaleFromPath(pathname) !== locale) return;
    const open = consumeLanguageNavigation(pathname);
    // Restore only an explicit language change before the hydrated shell paints.
    // Ordinary visits still start on the welcome screen.
    if (open !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot state across a locale-root remount
      setLockedPath(open ? null : home);
      return;
    }
    // A return to home in the same session goes straight to the desktop. Only the first render
    // checks it, so a lock (which also lands on home) still shows the logon.
    if (first && isHome && welcomeSeenThisSession()) {
      setLockedPath(null);
    }
  }, [home, isHome, locale, pathname]);
  const activeApp = appForPath(relativePath);
  const getPath = (path: string) =>
    locale === "en" ? path : `/${locale}${path}`;
  const results = useMemo(
    () => searchEntries(entries, query, scope),
    [entries, query, scope],
  );
  const resultCountText = `${formatNumber(Math.min(results.length, 30), locale)}${results.length > 30 ? ` / ${formatNumber(results.length, locale)}` : ""} · ${copy.searchResults}`;
  const [announcedCount, setAnnouncedCount] = useState("");
  useEffect(() => {
    // Announce the count once typing pauses for 500ms, not on every keystroke.
    const timer = window.setTimeout(
      () => setAnnouncedCount(resultCountText),
      500,
    );
    return () => window.clearTimeout(timer);
  }, [resultCountText]);
  const pageEntry = entries.find((entry) => entry.href === pathname);
  const windowTitle =
    pageEntry?.title ??
    (relativePath.startsWith("/lab") ? copy.experiments : copy[activeApp]);
  const parentPath = relativePath.startsWith("/projects/")
    ? getPath("/projects")
    : relativePath.startsWith("/write-ups/")
      ? getPath("/write-ups")
      : relativePath.startsWith("/lab/")
        ? getPath("/lab")
        : home;
  const scopeLabels = {
    all: copy.all,
    project: copy.projects,
    paper: copy.papers,
    writing: copy.writing,
    experiment: copy.experiments,
    action: copy.actions,
  };

  const focusContent = useCallback(() => {
    const activeContent =
      document.getElementById("main-content") ??
      desktopContent.current ??
      content.current;
    const heading = activeContent?.querySelector<HTMLElement>("h1");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    } else activeContent?.focus({ preventScroll: true });
  }, []);

  function enterWorkspace() {
    clearLanguageNavigation();
    focusAfterUnlock.current = true;
    setLockedPath(null);
  }

  // The logon's Enter and skip link unlock the desktop. A lock remembers the page it left, so the
  // unlock reopens it (a per-viewer convenience). Start, brand and close links do not reopen it.
  function unlockFromLogon() {
    const stored = recallLastPath();
    const reopen =
      stored &&
      stored !== pathname &&
      isHome &&
      getOSAppDescriptor(stored, locale)
        ? stored
        : null;
    startTransition(() => enterWorkspace());
    if (reopen) {
      rememberOpenTarget(reopen);
      router.push(reopen);
    }
  }

  // Records the page a visitor just asked to open, so focus can move into it once it renders.
  function rememberOpenTarget(href: string) {
    setFocusRequest({ path: routeKey(href) });
  }

  useLayoutEffect(() => {
    if (locked || !focusAfterUnlock.current) return;
    focusAfterUnlock.current = false;
    // The main content was hidden while the welcome screen was active. Reset
    // scroll only after it is visible, then move focus without a second jump.
    if (window.scrollY > 0) window.scrollTo({ top: 0 });
    focusContent();
  }, [locked, focusContent]);

  const openSearch = useCallback(() => {
    const dialog = searchDialog.current;
    if (!dialog || dialog.open) return;
    // BODY is what focus rests on when nothing is focused (Ctrl/Cmd+K from a bare page). It
    // is not a useful place to return to, so restoreSearchFocus falls back to the launcher.
    const active = document.activeElement;
    returnFocus.current =
      active instanceof HTMLElement && active !== document.body ? active : null;
    setQuery("");
    setScope("all");
    dialog.showModal();
    searchField.current?.focus();
  }, []);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (locked) return;
    const frame = requestAnimationFrame(() => {
      if (!workspaceReady) window.scrollTo({ top: 0 });
      focusContent();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, locked, focusContent, workspaceReady]);

  // A requested focus move lapses after OPEN_FOCUS_MS if the page never shows.
  useEffect(() => {
    if (!focusRequest) return;
    const expire = window.setTimeout(
      () => setFocusRequest(null),
      OPEN_FOCUS_MS,
    );
    return () => window.clearTimeout(expire);
  }, [focusRequest]);

  // Moves focus into the window or page the visitor just opened (dock, Proof Atlas link, search
  // result, language switch, reopened window). It waits until that document is the one on
  // screen, so focus never lands in the page it replaces.
  useEffect(() => {
    if (!focusRequest || locked || focusRequest.path !== pathname) return;
    const frame = requestAnimationFrame(() => {
      const surface = openedSurface(focusRequest.path, content.current);
      if (!surface) return;
      setFocusRequest(null);
      // Focus already inside the new window (the visitor moved on) is left alone.
      if (surface.contains(document.activeElement)) return;
      const heading = surface.querySelector<HTMLElement>("h1");
      if (heading) heading.tabIndex = -1;
      (heading ?? surface).focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [focusRequest, locked, pathname]);

  // Crossfade in the new locale's content once it has rendered after a language switch.
  useEffect(() => {
    if (!languageArrival.current) return;
    languageArrival.current = false;
    const layer = contentLayer.current;
    if (
      !layer ||
      reducedMotionPreferred() ||
      typeof layer.animate !== "function"
    )
      return;
    layer.animate([{ opacity: 0.35 }, { opacity: 1 }], {
      duration: 180,
      easing: "ease-out",
    });
  }, [locale]);

  // A language switch that never lands clears its pending state after a few seconds.
  useEffect(() => {
    if (!languageSwitch) return;
    const timer = window.setTimeout(() => setLanguageSwitch(null), 6000);
    return () => window.clearTimeout(timer);
  }, [languageSwitch]);

  function focusWorkspaceWindow(id: string, destination?: string) {
    const application = workspace.applications.get(id);
    if (!application) return;
    rememberOpenTarget(destination ?? application.descriptor.path);
    setWorkspace((value) => ({
      ...value,
      model: workspaceReducer(value.model, { type: "restore", id }),
    }));
    const href = destination ?? application.descriptor.path;
    const pathChange = pathname !== application.descriptor.path;
    const hashChange =
      href.includes("#") && location.hash !== href.slice(href.indexOf("#"));
    // A fragment on the current page never re-registers the application, so the
    // pending path cannot de-duplicate it; only a page change is pending.
    if (pathChange ? pendingWorkspacePath.current !== href : hashChange) {
      if (pathChange) pendingWorkspacePath.current = href;
      router.push(href);
    }
  }

  const closeWorkspaceWindow = useCallback(
    (id: string) => {
      const next = workspaceReducer(workspace.model, { type: "close", id });
      setWorkspace((value) => {
        const applications = new Map(value.applications);
        applications.delete(id);
        return {
          ...value,
          applications,
          model: workspaceReducer(value.model, { type: "close", id }),
        };
      });
      if (
        currentWorkspaceWindow?.descriptor.id === id ||
        workspace.model.activeId === id
      ) {
        const nextPath =
          next.windows.find((item) => item.descriptor.id === next.activeId)
            ?.descriptor.path ?? home;
        pendingWorkspacePath.current = nextPath;
        router.push(nextPath);
      }
    },
    [workspace.model, currentWorkspaceWindow, home, router],
  );

  useEffect(() => {
    if (!locked || !lockRequested.current) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("os-enter")?.focus({ preventScroll: true });
      lockRequested.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [locked]);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (event.key === "Escape" && languageMenu.current?.open) {
        event.preventDefault();
        languageMenu.current.open = false;
        languageMenu.current.querySelector<HTMLElement>("summary")?.focus();
        return;
      }
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k" &&
        !event.altKey &&
        !event.shiftKey
      ) {
        event.preventDefault();
        openSearch();
      } else if (
        event.key === "Escape" &&
        !isHome &&
        !(workspaceReady
          ? currentWorkspaceWindow?.minimized
          : reading.minimized) &&
        !searchDialog.current?.open
      ) {
        const target = event.target as HTMLElement | null;
        if (
          target?.closest("input, textarea, select, [contenteditable='true']")
        )
          return;
        // Escape closes the window only from its chrome (the title bar and toolbar). Page content,
        // the desktop and the body keep their own keys, so a stray Escape never leaves the page.
        if (!target?.closest(".os-windowbar, .os-window-toolbar")) return;
        event.preventDefault();
        if (workspaceDisplayed && workspace.model.activeId)
          closeWorkspaceWindow(workspace.model.activeId);
        else router.push(home);
      }
    };
    const closeLanguage = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !languageMenu.current?.contains(event.target)
      ) {
        if (languageMenu.current) languageMenu.current.open = false;
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", closeLanguage);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", closeLanguage);
    };
  }, [
    openSearch,
    home,
    isHome,
    reading.minimized,
    router,
    workspaceReady,
    workspaceDisplayed,
    workspace.model.activeId,
    currentWorkspaceWindow,
    closeWorkspaceWindow,
  ]);

  useEffect(() => {
    disposed.current = false;
    return () => {
      disposed.current = true;
      if (shareTimer.current) clearTimeout(shareTimer.current);
    };
  }, []);

  function lockWorkspace() {
    clearLanguageNavigation();
    reading.stopGesture();
    searchDialog.current?.close();
    rememberLastPath(isHome ? null : pathname);
    lockRequested.current = true;
    setLockedPath(home);
    if (!isHome) router.push(home);
  }

  function changeLanguage(
    event: MouseEvent<HTMLAnchorElement>,
    language: Locale,
  ) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    if (languageMenu.current) languageMenu.current.open = false;
    if (language === locale) return;
    const target = getLocalizedPath(pathname, language);
    // The chip shows the pending state at once; the content crossfades when the new locale renders.
    setLanguageSwitch({ from: locale, to: language });
    languageArrival.current = true;
    rememberOpenTarget(target);
    carryLanguageSwitch(target);
    prepareLanguageNavigation(target, !locked);
    router.push(`${target}${window.location.search}${window.location.hash}`);
  }

  function restoreReadingWindow() {
    reading.restore();
    requestAnimationFrame(focusContent);
  }

  function minimizeReadingWindow() {
    reading.minimize();
    requestAnimationFrame(() => minimizedTask.current?.focus());
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (disposed.current) return;
      setShareStatus(copy.copied);
    } catch {
      if (disposed.current) return;
      setShareStatus(copy.copyFailed);
    }
    if (shareTimer.current) clearTimeout(shareTimer.current);
    shareTimer.current = setTimeout(() => setShareStatus(""), 3500);
  }

  function selectResult(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    setLockedPath(null);
    searchDialog.current?.close();
    const href = event.currentTarget.getAttribute("href");
    const descriptor = href
      ? getOSAppDescriptor(href.split("#")[0], locale)
      : null;
    if (descriptor && workspace.applications.has(descriptor.id)) {
      event.preventDefault();
      focusWorkspaceWindow(descriptor.id, href!);
      requestAnimationFrame(focusContent);
    } else if (href === pathname) {
      if (reading.minimized) reading.restore();
      requestAnimationFrame(focusContent);
    }
  }

  function searchKeys(event: KeyboardEvent<HTMLElement>) {
    // Confirming an IME candidate must not open a result or move focus.
    if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)
      return;
    if (event.key === "Escape") {
      // Search inputs consume Escape to clear text; dismiss consistently instead.
      event.preventDefault();
      event.stopPropagation();
      searchDialog.current?.close();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const links = Array.from(
        searchDialog.current?.querySelectorAll<HTMLAnchorElement>(
          ".os-search-result",
        ) ?? [],
      );
      if (!links.length) return;
      event.preventDefault();
      const index = links.indexOf(document.activeElement as HTMLAnchorElement);
      if (event.key === "ArrowUp" && index <= 0) searchField.current?.focus();
      else
        links[
          (index + (event.key === "ArrowDown" ? 1 : -1) + links.length) %
            links.length
        ]?.focus();
    } else if (event.key === "Enter" && event.target === searchField.current) {
      event.preventDefault();
      searchDialog.current
        ?.querySelector<HTMLAnchorElement>(".os-search-result")
        ?.click();
    }
  }

  function restoreSearchFocus() {
    const usable = (element: HTMLElement | null): element is HTMLElement =>
      !!element &&
      element.isConnected &&
      element !== document.body &&
      !element.closest("[inert], [hidden]");
    if (usable(returnFocus.current)) returnFocus.current.focus();
    else if (usable(searchLauncher.current)) searchLauncher.current.focus();
  }

  // Overflow cue for the pin strip. The strip scrolls when the pins are wider than the room
  // between the orb and the tray; a fade shows on each side that still hides pins. Physical
  // sides are used, so RTL reads the same. Only the hidden sides are marked.
  useEffect(() => {
    const strip = dockStrip.current;
    if (!strip) return;
    const update = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      const rtl = getComputedStyle(strip).direction === "rtl";
      // Hidden pins on the physical left. In RTL scrollLeft runs from 0 to -max.
      const hiddenLeft = rtl ? max + strip.scrollLeft : strip.scrollLeft;
      const hiddenRight = max - hiddenLeft;
      strip.toggleAttribute("data-fade-l", hiddenLeft > 2);
      strip.toggleAttribute("data-fade-r", hiddenRight > 2);
    };
    update();
    strip.addEventListener("scroll", update, { passive: true });
    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(update) : null;
    observer?.observe(strip);
    Array.from(strip.children).forEach((child) => observer?.observe(child));
    window.addEventListener("resize", update);
    return () => {
      strip.removeEventListener("scroll", update);
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [locale]);

  // The strip starts at the first pin, so a later page's pin can begin off screen. Scrolling
  // the pressed pin in (nearest edge) keeps the page the visitor is on visible in the bar.
  useEffect(() => {
    const current = dockStrip.current?.querySelector<HTMLElement>(
      ".os-dock-app[aria-current='page']",
    );
    if (current && typeof current.scrollIntoView === "function")
      current.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [pathname, locale]);

  return (
    <ApplicationRegistrationContext.Provider
      value={{ ready: workspaceReady, register: registerApplication }}
    >
      <div className="os-shell win7" data-appearance={appearance}>
        <a
          href={
            !workspaceDisplayed && reading.minimized
              ? "#os-minimized-desktop"
              : "#main-content"
          }
          className="os-skip-link"
          onClick={(event) => {
            if (locked) {
              event.preventDefault();
              unlockFromLogon();
            }
          }}
        >
          {skipLabel}
        </a>
        <div className="os-wallpaper" aria-hidden="true" />
        <header className="os-topbar">
          <Link className="os-brand" href={home} onClick={enterWorkspace}>
            <OSMark />
            <strong
              lang={copy.nameLocale}
              dir={copy.nameLocale === "en" ? "ltr" : "rtl"}
            >
              {copy.displayName}
            </strong>
            <span>ResearchOS</span>
          </Link>
          <div className="os-top-actions">
            <button
              ref={searchLauncher}
              className="os-control"
              onClick={openSearch}
              aria-label={copy.search}
              aria-keyshortcuts={shortcutKeys}
            >
              <Search aria-hidden="true" />
              <span>{copy.search}</span>
              <kbd aria-hidden="true">{shortcutText}</kbd>
            </button>
            {/* Theme switch: the thumb carries the glyph for the current theme (sun in
                light, moon in dark), and the visible state label sits beside it. */}
            <button
              type="button"
              role="switch"
              className="os-theme-switch"
              aria-checked={appearance === "dark"}
              aria-label={copy.darkAppearance}
              onClick={(event) => {
                const next = appearance === "dark" ? "light" : "dark";
                beginThemeSwitch(event.currentTarget);
                writeAppearance(next);
                setSessionAppearance(next);
              }}
            >
              {appearance === "dark" ? (
                <Moon aria-hidden="true" />
              ) : (
                <Sun aria-hidden="true" />
              )}
            </button>
            {/* Visible state beside the switch on wide screens; the name stays static. */}
            <span className="os-theme-state" aria-hidden="true">
              {appearance === "dark" ? copy.dark : copy.light}
            </span>
            <details
              ref={languageMenu}
              className="os-language"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  event.stopPropagation();
                  event.currentTarget.open = false;
                  event.currentTarget
                    .querySelector<HTMLElement>("summary")
                    ?.focus();
                }
              }}
            >
              {/* CSS attr() reads the summary's own attribute, so the code lives here. */}
              <summary
                aria-label={`${copy.selectLanguage}: ${locales[locale].label}`}
                aria-busy={languageSwitch?.from === locale ? true : undefined}
                data-locale-code={locale.toUpperCase()}
              >
                <Languages aria-hidden="true" />
                <span lang={locale}>{locales[locale].label}</span>
              </summary>
              <nav aria-label={copy.selectLanguage}>
                {(Object.keys(locales) as Locale[]).map((language) => (
                  <Link
                    key={language}
                    href={getLocalizedPath(pathname, language)}
                    onClick={(event) => changeLanguage(event, language)}
                    lang={language}
                    dir={locales[language].dir}
                    aria-current={locale === language ? "true" : undefined}
                  >
                    {locales[language].label}
                    {locale === language && <Check aria-hidden="true" />}
                  </Link>
                ))}
              </nav>
            </details>
            <SydneyClock locale={locale} />
            {/* Lock is last in the tray: it sits at the far edge, apart from search and theme,
                so it is never next to a pin. The tooltip names it for pointer users. */}
            {!locked && (
              <button
                className="os-control os-tray-lock"
                onClick={lockWorkspace}
                aria-label={copy.lock}
                title={copy.lock}
              >
                <LockKeyhole aria-hidden="true" />
                <span>{copy.lock}</span>
              </button>
            )}
          </div>
        </header>
        {locked && (
          <section
            className="os-welcome"
            role="main"
            aria-labelledby="os-lock-name"
          >
            <SydneyClock locale={locale} welcome />
            <div className="os-lock-profile">
              <Image
                src="/images/raouf-welcome-168-2ae922a8.webp"
                alt=""
                width={84}
                height={84}
                priority
                className="os-lock-portrait"
              />
              <h1
                id="os-lock-name"
                lang={copy.nameLocale}
                dir={copy.nameLocale === "en" ? "ltr" : "rtl"}
              >
                {copy.fullName}
              </h1>
              <p className="os-role">{role}</p>
              <p className="os-lock-intro">{copy.intro}</p>
              <WelcomeEnter
                onEnter={unlockFromLogon}
                status={copy.welcomeStatus}
                locale={locale}
              >
                {atlasJourneyCopy.explore}
                <ArrowRight aria-hidden="true" />
              </WelcomeEnter>
              <nav className="os-lock-shortcuts" aria-label={copy.selectedWork}>
                <Link
                  className="os-text-link"
                  href={getPath("/projects")}
                  onClick={() => setLockedPath(null)}
                >
                  {atlasJourneyCopy.review}
                </Link>
                <a
                  className="os-text-link"
                  href="/Mohammad_Raouf_Abedini_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {copy.viewResume}
                  <ExternalLink
                    className="os-external-icon"
                    aria-hidden="true"
                  />
                </a>
              </nav>
            </div>
            <p className="os-lock-caption">
              <bdi lang={copy.nameLocale}>{copy.displayName}</bdi> / ResearchOS
              <span>·</span>
              {copy.personalPortfolio}
            </p>
          </section>
        )}
        <div
          ref={contentLayer}
          className="os-content"
          hidden={locked}
          inert={locked && hydrated}
          onClickCapture={(event) => {
            const plain =
              !event.ctrlKey &&
              !event.metaKey &&
              !event.shiftKey &&
              !event.altKey;
            if (plain) {
              // A link to a window page moves focus into that window once it renders.
              const link =
                event.target instanceof Element
                  ? event.target.closest("a")
                  : null;
              const href = link?.getAttribute("href");
              if (
                href?.startsWith("/") &&
                getOSAppDescriptor(href.split("#")[0], locale)
              )
                rememberOpenTarget(href);
            }
            if (workspaceReady && plain) {
              const link =
                event.target instanceof Element
                  ? event.target.closest("a")
                  : null;
              const href = link?.getAttribute("href");
              if (href?.startsWith("/")) {
                const descriptor = getOSAppDescriptor(
                  href.split("#")[0],
                  locale,
                );
                if (descriptor && workspace.applications.has(descriptor.id)) {
                  event.preventDefault();
                  focusWorkspaceWindow(descriptor.id, href);
                  return;
                }
              }
            }
            if (
              !reading.minimized ||
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            const link =
              event.target instanceof Element
                ? event.target.closest("a")
                : null;
            if (link?.getAttribute("href") === pathname) {
              event.preventDefault();
              restoreReadingWindow();
            }
          }}
        >
          {workspaceReady && (
            <div hidden={!workspaceDisplayed} inert={!workspaceDisplayed}>
              <WorkspaceWindows
                state={workspace.model}
                applications={workspace.applications}
                pathname={pathname}
                locale={locale}
                role={role}
                entries={entries}
                locked={locked || !workspaceDisplayed}
                navigating={workspaceNavigating}
                actions={{
                  focus: focusWorkspaceWindow,
                  restore: focusWorkspaceWindow,
                  close: closeWorkspaceWindow,
                  minimize: (id) => {
                    setWorkspace((value) => ({
                      ...value,
                      model: workspaceReducer(value.model, {
                        type: "minimize",
                        id,
                      }),
                    }));
                    requestAnimationFrame(() => {
                      Array.from(
                        document.querySelectorAll<HTMLButtonElement>(
                          ".os-minimized-task",
                        ),
                      )
                        .find((button) => button.dataset.windowId === id)
                        ?.focus();
                    });
                  },
                }}
              />
            </div>
          )}
          {!workspaceDisplayed && !isHome && reading.minimized && (
            <>
              <main
                id="os-minimized-desktop"
                ref={desktopContent}
                tabIndex={-1}
                className="os-main"
              >
                <Desktop locale={locale} role={role} interactive={!locked} />
              </main>
              <button
                ref={minimizedTask}
                className="os-minimized-task"
                onClick={restoreReadingWindow}
                aria-label={`${windowCopy.restoreWindow}: ${windowTitle}`}
              >
                <OSIcon app={activeApp} />
                <span>
                  <strong>
                    <bdi
                      lang={pageEntry?.titleLocale ?? locale}
                      dir={locales[pageEntry?.titleLocale ?? locale].dir}
                    >
                      {windowTitle}
                    </bdi>
                  </strong>
                  <small>{windowCopy.minimized}</small>
                </span>
              </button>
            </>
          )}
          <main
            id={workspaceDisplayed ? undefined : "main-content"}
            ref={content}
            tabIndex={-1}
            className={
              isHome
                ? "os-main"
                : `os-window window glass active ${reading.rect ? "os-window--floating" : expanded ? "os-window--expanded" : ""}`
            }
            hidden={workspaceDisplayed || reading.minimized}
            inert={(workspaceDisplayed || reading.minimized) && hydrated}
            style={
              !isHome && reading.rect
                ? {
                    left: reading.rect.x,
                    top: reading.rect.y,
                    width: reading.rect.width,
                    height: reading.rect.height,
                  }
                : undefined
            }
          >
            {!isHome && (
              <span id="os-escape-hint" className="sr-only">
                {escapeHintCopy[locale]}
              </span>
            )}
            {!workspaceDisplayed && !isHome && (
              <div className="os-windowbar os-windowbar--route title-bar">
                <div className="os-window-navigation">
                  {/* The name stays "Back" on phones, where the visible word is hidden. */}
                  <Link
                    className="os-window-back"
                    href={parentPath}
                    aria-label={copy.back}
                  >
                    <ArrowLeft aria-hidden="true" />
                    <span>{copy.back}</span>
                  </Link>
                  <OSIcon app={activeApp} />
                </div>
                <span
                  className={`os-window-title title-bar-text ${reading.desktop ? "os-window-title--movable" : ""}`}
                  id="os-window-title"
                  lang={pageEntry?.titleLocale ?? locale}
                  dir={locales[pageEntry?.titleLocale ?? locale].dir}
                  onPointerDown={(event) => reading.beginPointer(event, "move")}
                  {...reading.pointerHandlers}
                >
                  {windowTitle}
                </span>
                <div className="os-window-actions title-bar-controls">
                  {reading.desktop && !reading.minimized && !locked && (
                    <ReadingWindowControls
                      locale={locale}
                      onMove={reading.move}
                      onResize={reading.resize}
                      onReset={reading.reset}
                      floating={!!reading.rect}
                    />
                  )}
                  <button
                    className="os-control"
                    onClick={copyLink}
                    aria-label={copy.copyLink}
                  >
                    <Copy aria-hidden="true" />
                  </button>
                  {/* Caption glyphs come from 7.css (is-minimize, is-maximize, is-restore). */}
                  <button
                    className="os-control is-minimize"
                    onClick={minimizeReadingWindow}
                    aria-label={windowCopy.minimize}
                  />
                  <button
                    className={`os-control os-expand ${expanded ? "is-restore" : "is-maximize"}`}
                    onClick={() => {
                      reading.reset();
                      setExpanded((value) => !value);
                    }}
                    // The name is constant; aria-pressed carries the expanded state.
                    aria-label={windowCopy.fullSize}
                    aria-pressed={expanded}
                  />
                  <Link
                    className="os-control os-window-close"
                    href={home}
                    aria-keyshortcuts="Escape"
                    aria-describedby={isHome ? undefined : "os-escape-hint"}
                    onClick={enterWorkspace}
                    // The name contains the visible word "Desktop" (WCAG 2.5.3).
                    aria-label={`${copy.close}: ${copy.desktop}`}
                  >
                    <X aria-hidden="true" />
                    <span>{copy.desktop}</span>
                  </Link>
                </div>
              </div>
            )}
            {/* The live region stays mounted so assistive tech announces updates. */}
            <p
              className={shareStatus ? "os-share-status" : "sr-only"}
              role="status"
            >
              {shareStatus}
            </p>
            <Activity mode={reading.minimized ? "hidden" : "visible"}>
              <div
                className="os-page-content window-body has-scrollbar"
                onScroll={reading.onContentScroll}
              >
                <ProofAtlasVisibilityContext.Provider
                  value={isHome && !locked && !workspaceDisplayed}
                >
                  {children}
                </ProofAtlasVisibilityContext.Provider>
              </div>
            </Activity>
            {!isHome && reading.rect && (
              <>
                <span id="os-resize-handle-hint" className="sr-only">
                  {windowCopy.resizeHint}
                </span>
                <button
                  className="os-control os-window-resize"
                  aria-label={windowCopy.resizeWindow}
                  aria-describedby="os-resize-handle-hint"
                  onPointerDown={(event) =>
                    reading.beginPointer(event, "resize")
                  }
                  {...reading.pointerHandlers}
                  onKeyDown={(event) => {
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
                      focusContent();
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
                      reading.resize(delta);
                    }
                  }}
                />
              </>
            )}
          </main>
          {!workspaceDisplayed &&
            !isHome &&
            !reading.minimized &&
            !reading.rect && (
              <footer className="os-page-footer">
                <Link href={getPath("/security-policy")}>
                  {copy.securityPolicy}
                </Link>
                <Link href={getPath("/hall-of-fame")}>{copy.hallOfFame}</Link>
                <a href="/feed.xml">RSS</a>
                <span>
                  ©{" "}
                  {formatNumber(copyrightYear, locale, { useGrouping: false })}{" "}
                  <bdi lang={copy.nameLocale}>{copy.familyName}</bdi>
                </span>
              </footer>
            )}
        </div>
        <nav
          className="os-dock"
          hidden={locked}
          aria-label={copy.appNavigation}
          inert={locked && hydrated}
        >
          <Link
            className="os-dock-home"
            href={home}
            onClick={enterWorkspace}
            aria-label={copy.startOrb}
            title={copy.startOrb}
            aria-current={isHome ? "page" : undefined}
          >
            <OSMark />
          </Link>
          <span className="os-dock-divider" aria-hidden="true" />
          {/* The pins scroll inside this strip, not the bar, so the strip ends where the
              tray begins and no pin can run under the tray chips. */}
          <div className="os-dock-strip" ref={dockStrip}>
            {apps.map((app) => {
              const dockLabel =
                app === "research"
                  ? copy.dockResearch
                  : app === "resume"
                    ? copy.dockResume
                    : copy[app];
              const accessibleLabel =
                dockLabel === copy[app]
                  ? dockLabel
                  : `${dockLabel} (${copy[app]})`;
              // A minimised app is not the current page: its window is hidden, so the
              // pressed look and aria-current go, and only the minimised dot remains.
              const appWindows = workspaceReady
                ? workspace.model.windows.filter(
                    (item) => appForDescriptor(item.descriptor) === app,
                  )
                : [];
              const running = workspaceReady
                ? appWindows.length > 0
                : !isHome && activeApp === app;
              const minimized = workspaceReady
                ? appWindows.some((item) => item.minimized)
                : reading.minimized && activeApp === app;
              const hiddenOnly = workspaceReady
                ? appWindows.length > 0 &&
                  appWindows.every((item) => item.minimized)
                : reading.minimized;
              const current = !isHome && activeApp === app && !hiddenOnly;
              return (
                <Link
                  key={app}
                  href={getPath(appPaths[app])}
                  // Hover and press start the route fetch, so a first visit does not wait for
                  // the page chunk after the click. The window still opens on the same timing.
                  onPointerEnter={() => router.prefetch(getPath(appPaths[app]))}
                  onPointerDown={() => router.prefetch(getPath(appPaths[app]))}
                  className={[
                    "os-dock-app",
                    running ? "is-running" : "",
                    minimized ? "is-minimized" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  data-app={app}
                  aria-label={accessibleLabel}
                  aria-current={current ? "page" : undefined}
                  data-minimized={minimized ? "true" : undefined}
                  onClick={(event) => {
                    if (
                      !event.ctrlKey &&
                      !event.metaKey &&
                      !event.shiftKey &&
                      !event.altKey
                    )
                      rememberOpenTarget(getPath(appPaths[app]));
                    if (
                      workspaceReady &&
                      !event.ctrlKey &&
                      !event.metaKey &&
                      !event.shiftKey &&
                      !event.altKey
                    ) {
                      const openWindow = [...workspace.model.windows]
                        .reverse()
                        .find(
                          (item) => appForDescriptor(item.descriptor) === app,
                        );
                      // Restore a minimised page or refocus the app root; a dossier
                      // still lets the link reach the list it advertises.
                      if (
                        openWindow &&
                        (openWindow.minimized ||
                          openWindow.descriptor.path === getPath(appPaths[app]))
                      ) {
                        event.preventDefault();
                        focusWorkspaceWindow(openWindow.descriptor.id);
                        return;
                      }
                    }
                    if (
                      reading.minimized &&
                      activeApp === app &&
                      !event.ctrlKey &&
                      !event.metaKey &&
                      !event.shiftKey &&
                      !event.altKey
                    ) {
                      event.preventDefault();
                      restoreReadingWindow();
                    }
                  }}
                >
                  <OSIcon app={app} />
                  <span>{dockLabel}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        <dialog
          className="os-search-dialog"
          ref={searchDialog}
          aria-labelledby="os-search-title"
          onClose={restoreSearchFocus}
          onKeyDown={searchKeys}
          onClick={(event) => {
            if (event.target === event.currentTarget)
              event.currentTarget.close();
          }}
        >
          <div className="os-search-heading">
            <div>
              <h2 id="os-search-title">{copy.search}</h2>
              <p>{copy.searchHint}</p>
            </div>
            <button
              className="os-control"
              onClick={() => searchDialog.current?.close()}
              aria-label={copy.close}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <div className="os-search-field">
            <Search aria-hidden="true" />
            {/* A visible label, not only the placeholder, which disappears once text is typed. */}
            <label className="os-search-label" htmlFor="os-search-input">
              {copy.search}
            </label>
            {/* No aria-label here: it would override the visible label above, and the name
                must be the text a sighted user reads (WCAG 2.5.3). */}
            <input
              id="os-search-input"
              ref={searchField}
              type="search"
              placeholder={copy.searchPlaceholder}
              aria-controls="os-search-results"
              value={query}
              maxLength={200}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                className="os-control"
                onClick={() => {
                  setQuery("");
                  searchField.current?.focus();
                }}
                aria-label={copy.clearSearch}
              >
                <X aria-hidden="true" />
              </button>
            )}
          </div>
          <div
            className="os-search-scopes"
            role="group"
            aria-label={copy.searchScopes}
          >
            {(Object.keys(scopeLabels) as (SearchEntry["kind"] | "all")[]).map(
              (kind) => (
                <button
                  key={kind}
                  aria-pressed={scope === kind}
                  onClick={() => setScope(kind)}
                >
                  {scopeLabels[kind]}
                </button>
              ),
            )}
          </div>
          <p className="os-search-count">
            <bdi dir="ltr">
              {formatNumber(Math.min(results.length, 30), locale)}
              {results.length > 30 &&
                ` / ${formatNumber(results.length, locale)}`}
            </bdi>
            {` · ${copy.searchResults}`}
          </p>
          {/* Announced once after typing pauses, not on every keystroke. */}
          <p className="sr-only" role="status">
            {announcedCount}
          </p>
          <div className="os-search-body">
            <ul className="os-search-results" id="os-search-results">
              {results.slice(0, 30).map((entry) => {
                const ResultIcon = searchIcons[entry.kind];
                const external =
                  /^(https?:|mailto:)/.test(entry.href) ||
                  /\.pdf(?:$|\?)/i.test(entry.href);
                // The name is the kind and the title; the description is read after it, so a
                // long abstract never runs into the name.
                const resultId = `os-search-result-${entry.id.replace(/[^A-Za-z0-9_-]/g, "-")}`;
                const label = (
                  <>
                    <span
                      className="os-search-result-icon"
                      data-kind={entry.kind}
                    >
                      <ResultIcon aria-hidden="true" />
                    </span>
                    <span className="os-search-result-copy">
                      <span className="os-result-kind" id={`${resultId}-kind`}>
                        {scopeLabels[entry.kind]}
                      </span>
                      <strong
                        id={`${resultId}-title`}
                        lang={entry.titleLocale ?? locale}
                        dir={locales[entry.titleLocale ?? locale].dir}
                      >
                        {entry.title}
                      </strong>
                      <small
                        id={`${resultId}-desc`}
                        lang={entry.descriptionLocale ?? locale}
                        dir={locales[entry.descriptionLocale ?? locale].dir}
                      >
                        {entry.description}
                      </small>
                    </span>
                    <ArrowRight
                      className="os-search-result-arrow"
                      aria-hidden="true"
                    />
                  </>
                );
                return (
                  <li key={entry.id}>
                    {external ? (
                      <a
                        className="os-search-result"
                        href={entry.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-labelledby={`${resultId}-kind ${resultId}-title`}
                        aria-describedby={`${resultId}-desc`}
                        onClick={selectResult}
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        className="os-search-result"
                        href={entry.href}
                        aria-labelledby={`${resultId}-kind ${resultId}-title`}
                        aria-describedby={`${resultId}-desc`}
                        onClick={selectResult}
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            {!results.length && (
              <div className="os-search-empty">
                <Search aria-hidden="true" />
                <h3>{copy.noResults}</h3>
                <p>{query}</p>
                <button
                  className="os-button os-button--secondary"
                  onClick={() => {
                    setQuery("");
                    setScope("all");
                    searchField.current?.focus();
                  }}
                >
                  {copy.clearSearch}
                </button>
              </div>
            )}
          </div>
          <div className="os-search-bottom">
            <span>
              <kbd>↑ ↓</kbd> {copy.navigation}
            </span>
            <span>
              <kbd>Enter</kbd> {copy.open}
            </span>
            <span>
              <kbd>Esc</kbd> {copy.close}
            </span>
          </div>
        </dialog>
        <noscript>
          {/* Tailwind's base-layer hidden rule is important. Important layered
            rules outrank unlayered rules, so the fallback must share its layer. */}
          <style>{`@layer base{.os-shell .os-welcome{display:none!important}.os-shell .os-content[hidden]{display:block!important}.os-shell .os-dock[hidden]{display:flex!important}.os-shell button{display:none!important}}`}</style>
        </noscript>
      </div>
    </ApplicationRegistrationContext.Provider>
  );
}
