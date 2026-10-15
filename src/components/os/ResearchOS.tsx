"use client";

import {
  Activity,
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
  ArrowDownRight,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  BookOpen,
  FileText,
  FlaskConical,
  FolderOpen,
  Globe,
  Languages,
  LockKeyhole,
  Maximize2,
  Minimize2,
  Minus,
  Search,
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
import { WelcomeEnter } from "./WelcomeEnter";
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
      <span>{copy.timeZone}</span>
      <span className="sr-only">{copy.currentTime}</span>
      <time dir="ltr" dateTime={now?.toISOString()}>
        {time}
      </time>
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
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<SearchEntry["kind"] | "all">("all");
  const [shareStatus, setShareStatus] = useState("");
  const searchDialog = useRef<HTMLDialogElement>(null);
  const searchField = useRef<HTMLInputElement>(null);
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
  useLayoutEffect(() => {
    if (getLocaleFromPath(pathname) !== locale) return;
    const open = consumeLanguageNavigation(pathname);
    // Restore only an explicit language change before the hydrated shell paints.
    // Ordinary visits still start on the welcome screen.
    if (open !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot state across a locale-root remount
      setLockedPath(open ? null : home);
    }
  }, [home, locale, pathname]);
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
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
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

  function focusWorkspaceWindow(id: string, destination?: string) {
    const application = workspace.applications.get(id);
    if (!application) return;
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
    const target = returnFocus.current;
    if (target?.isConnected && !target.closest("[inert], [hidden]"))
      target.focus();
  }

  return (
    <ApplicationRegistrationContext.Provider
      value={{ ready: workspaceReady, register: registerApplication }}
    >
      <div className="os-shell" data-appearance={appearance}>
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
              enterWorkspace();
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
              className="os-control"
              onClick={openSearch}
              aria-label={copy.search}
              aria-keyshortcuts={shortcutKeys}
            >
              <Search aria-hidden="true" />
              <span>{copy.search}</span>
              <kbd aria-hidden="true">{shortcutText}</kbd>
            </button>
            {!locked && (
              <button
                className="os-control"
                onClick={lockWorkspace}
                aria-label={copy.lock}
              >
                <LockKeyhole aria-hidden="true" />
                <span>{copy.lock}</span>
              </button>
            )}
            {/* Power switch after "quick-moth-22" by vinodjangid07, Uiverse.io (MIT). */}
            <button
              type="button"
              role="switch"
              className="os-theme-switch"
              aria-checked={appearance === "dark"}
              aria-label={copy.darkAppearance}
              onClick={() => {
                const next = appearance === "dark" ? "light" : "dark";
                writeAppearance(next);
                setSessionAppearance(next);
              }}
            >
              <svg viewBox="0 0 512 512" aria-hidden="true">
                <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z" />
              </svg>
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
              <summary
                aria-label={`${copy.selectLanguage}: ${locales[locale].label}`}
              >
                <Languages aria-hidden="true" />
                <span lang={locale}>{locales[locale].label}</span>
                <ChevronDown aria-hidden="true" />
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
                src="/images/raouf-welcome.webp"
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
                onEnter={enterWorkspace}
                status={copy.welcomeStatus}
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
          className="os-content"
          hidden={locked}
          inert={locked && hydrated}
          onClickCapture={(event) => {
            if (
              workspaceReady &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.shiftKey &&
              !event.altKey
            ) {
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
                : `os-window ${reading.rect ? "os-window--floating" : expanded ? "os-window--expanded" : ""}`
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
            {!workspaceDisplayed && !isHome && (
              <div className="os-windowbar os-windowbar--route">
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
                  className={`os-window-title ${reading.desktop ? "os-window-title--movable" : ""}`}
                  id="os-window-title"
                  lang={pageEntry?.titleLocale ?? locale}
                  dir={locales[pageEntry?.titleLocale ?? locale].dir}
                  onPointerDown={(event) => reading.beginPointer(event, "move")}
                  {...reading.pointerHandlers}
                >
                  {windowTitle}
                </span>
                <div className="os-window-actions">
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
                  <button
                    className="os-control"
                    onClick={minimizeReadingWindow}
                    aria-label={windowCopy.minimize}
                  >
                    <Minus aria-hidden="true" />
                  </button>
                  <button
                    className="os-control os-expand"
                    onClick={() => {
                      reading.reset();
                      setExpanded((value) => !value);
                    }}
                    // The name is constant; aria-pressed carries the expanded state.
                    aria-label={windowCopy.fullSize}
                    aria-pressed={expanded}
                  >
                    {expanded ? (
                      <Minimize2 aria-hidden="true" />
                    ) : (
                      <Maximize2 aria-hidden="true" />
                    )}
                  </button>
                  <Link
                    className="os-control os-window-close"
                    href={home}
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
                className="os-page-content"
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
                >
                  <ArrowDownRight aria-hidden="true" />
                </button>
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
            aria-label={copy.desktop}
            aria-current={isHome ? "page" : undefined}
          >
            <OSMark />
          </Link>
          <span className="os-dock-divider" aria-hidden="true" />
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
            return (
              <Link
                key={app}
                href={getPath(appPaths[app])}
                className="os-dock-app"
                data-app={app}
                aria-label={accessibleLabel}
                aria-current={!isHome && activeApp === app ? "page" : undefined}
                data-minimized={
                  workspaceReady
                    ? workspace.model.windows.some(
                        (item) =>
                          item.minimized &&
                          appForDescriptor(item.descriptor) === app,
                      )
                      ? "true"
                      : undefined
                    : reading.minimized && activeApp === app
                      ? "true"
                      : undefined
                }
                onClick={(event) => {
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
            <input
              ref={searchField}
              type="search"
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchPlaceholder}
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
                const label = (
                  <>
                    <span
                      className="os-search-result-icon"
                      data-kind={entry.kind}
                    >
                      <ResultIcon aria-hidden="true" />
                    </span>
                    <span className="os-search-result-copy">
                      <span className="os-result-kind">
                        {scopeLabels[entry.kind]}
                      </span>
                      <strong
                        lang={entry.titleLocale ?? locale}
                        dir={locales[entry.titleLocale ?? locale].dir}
                      >
                        {entry.title}
                      </strong>
                      <small
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
                        onClick={selectResult}
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        className="os-search-result"
                        href={entry.href}
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
