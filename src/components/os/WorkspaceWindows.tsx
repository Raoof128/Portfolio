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
import { ArrowLeft, Check } from "lucide-react";
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
import {
  createFlipTransform,
  createUniformFlipOrigin,
  type WindowRect,
} from "./window-geometry";
import "./workspace-windows.css";

/**
 * Strings this component owns. They are not in window-copy or os-copy so the window
 * controls can name the window they act on. `{title}` is replaced with the window title.
 */
type LocalWindowCopy = {
  minimizeWindow: string;
  fullSizeWindow: string;
  closeWindow: string;
  copiedShort: string;
  dismiss: string;
  closedNotice: string;
  reopen: string;
  /** Accessible name of the read-only field that shows a link that could not be copied. */
  addressLabel: string;
};

const localWindowCopy: Record<Locale, LocalWindowCopy> = {
  en: {
    minimizeWindow: "Minimise: {title}",
    fullSizeWindow: "Full Size: {title}",
    closeWindow: "Close: {title}",
    copiedShort: "Copied",
    dismiss: "Dismiss",
    closedNotice: "Closed {title}.",
    reopen: "Reopen",
    addressLabel: "Address to copy",
  },
  fa: {
    minimizeWindow: "کمینه کردن: {title}",
    fullSizeWindow: "اندازهٔ کامل: {title}",
    closeWindow: "بستن: {title}",
    copiedShort: "کپی شد",
    dismiss: "بستن این پیام",
    closedNotice: "{title} بسته شد.",
    reopen: "بازگشایی",
    addressLabel: "نشانی برای کپی کردن",
  },
  ar: {
    minimizeWindow: "تصغير: {title}",
    fullSizeWindow: "الحجم الكامل: {title}",
    closeWindow: "إغلاق: {title}",
    copiedShort: "تم النسخ",
    dismiss: "إخفاء الرسالة",
    closedNotice: "تم إغلاق {title}.",
    reopen: "إعادة فتح",
    addressLabel: "العنوان للنسخ",
  },
  es: {
    minimizeWindow: "Minimizar: {title}",
    fullSizeWindow: "Tamaño completo: {title}",
    closeWindow: "Cerrar: {title}",
    copiedShort: "Copiado",
    dismiss: "Descartar",
    closedNotice: "Se cerró {title}.",
    reopen: "Reabrir",
    addressLabel: "Dirección para copiar",
  },
  zh: {
    minimizeWindow: "最小化：{title}",
    fullSizeWindow: "完整尺寸：{title}",
    closeWindow: "关闭：{title}",
    copiedShort: "已复制",
    dismiss: "关闭提示",
    closedNotice: "已关闭{title}。",
    reopen: "重新打开",
    addressLabel: "要复制的地址",
  },
};

function withTitle(template: string, title: string): string {
  // A replacer function keeps `$` sequences in a window title literal.
  return template.replace("{title}", () => title);
}

/** How long the Copy Link confirmation stays on the button. */
const COPIED_MS = 2000;
/** How long a successful copy message stays. A failure stays until dismissed. */
const SHARE_STATUS_MS = 3500;
/** How long the Reopen notice stays after a window closes. */
const UNDO_MS = 8000;

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

export type WindowActions = {
  focus: (id: string) => void;
  minimize: (id: string) => void;
  restore: (id: string) => void;
  close: (id: string) => void;
};

/** Set once any WorkspaceWindows has committed. Later window mounts are user opens. */
let workspaceCommitted = false;

/**
 * A minimise or close keeps the frame mounted this long so its exit can play. Exits run
 * faster than the 180 ms open (about two thirds), so closing feels responsive.
 */
const LEAVE_MS = 120;
/**
 * The pathname the page was loaded at. A window already on that path was restored at
 * load and does not animate. A window on any other path was opened by the user, even when
 * the workspace mounts in the same commit as the window (a dock click on a fresh desktop).
 */
const initialPathname =
  typeof window === "undefined"
    ? ""
    : window.location.pathname.replace(/\/+$/, "");
/** Keyframes for the window frame, all defined in win7-windows.css. */
const OPEN_ANIMATION = "os-win7-window-open";
const CLOSE_ANIMATION = "os-win7-window-close";
const MINIMIZE_ANIMATION = "os-win7-window-minimize";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

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
  introduced = false,
  onClosed,
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
  /** The workspace had already rendered when this window mounted (a user open). */
  introduced?: boolean;
  /** Called with the window's path and title when the window is closed. */
  onClosed?: (path: string, title: string) => void;
}) {
  const { descriptor, view, initial } = application;
  const pane = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const controlId = useId();
  const copy = getOSCopy(locale);
  const commands = getWindowCopy(locale);
  const local = localWindowCopy[locale];
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
  // The address that could not be copied. It stays on screen until dismissed.
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  // The read-only field that holds that address. It takes focus on failure, so the text
  // is selected and ready to copy from the keyboard.
  const shareField = useRef<HTMLInputElement>(null);
  // The Copy Link button reads "Copied" for a moment, next to the status message.
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Dismissing the failure message removes its button, so focus goes back to Copy Link.
  const copyButton = useRef<HTMLButtonElement>(null);
  // The title's text element, and whether its text is cut off by the ellipsis.
  const titleText = useRef<HTMLDivElement>(null);
  const [truncated, setTruncated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // The URL only changes once the next page is ready, so a followed link marks
  // the gap between the click and the new document.
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  // When the frame's document changes, the wait for the previous one has ended.
  // Clearing during render (not in an effect) stops a stale id from showing the
  // loading hairline again on a later return to the same page.
  // The exit before a minimise or close: the frame stays mounted for LEAVE_MS.
  const [leaving, setLeaving] = useState<"minimizing" | "closing" | null>(null);
  const [settledDocument, setSettledDocument] = useState(descriptor.id);
  if (settledDocument !== descriptor.id) {
    setSettledDocument(descriptor.id);
    setPendingFrom(null);
    // A frame reused for another window must not keep the previous window's exit.
    setLeaving(null);
  }
  const pending = pendingFrom === descriptor.id;
  const shareTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disposed = useRef(false);
  // A window opened in this session (introduced) starts as not previously active, so its
  // first activation moves focus into it, including when it mounts already active (a dock
  // click or a link on the home desktop). A window restored at load starts active, so it
  // does not take focus from the page on first paint.
  const previousActive = useRef(active && !introduced);
  const firstFocus = useRef(true);
  const focusedDocument = useRef(descriptor.id);
  // The element that had focus when this window opened. Focus returns there when the
  // window is minimised or closed, so it never stays on a control that is hidden.
  const opener = useRef<HTMLElement | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The minimise or close that runs once the exit ends (animationend or the fallback timer).
  const leaveDone = useRef<(() => void) | null>(null);
  // The frame's box before a maximise or restore; the next commit animates from it (FLIP).
  const flipFrom = useRef<WindowRect | null>(null);

  useLayoutEffect(() => {
    if (minimized !== reading.minimized) {
      if (minimized) reading.minimize();
      else reading.restore();
    }
  }, [minimized, reading]);

  useLayoutEffect(() => {
    if (!active || minimized || locked) {
      opener.current = null;
      return;
    }
    if (opener.current) return;
    const focused = document.activeElement;
    if (
      focused instanceof HTMLElement &&
      focused !== document.body &&
      !pane.current?.contains(focused)
    )
      opener.current = focused;
  }, [active, minimized, locked]);

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
      // Activation (a taskbar button or a click) moves focus into the window body.
      const heading = pane.current?.querySelector<HTMLElement>("h1");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      } else pane.current?.focus({ preventScroll: true });
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
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  // Runs the pending minimise or close. It runs on animationend, or on the fallback timer if
  // the animation never reports. The frame stays mounted with data-state until then.
  function finishLeave() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
    const done = leaveDone.current;
    leaveDone.current = null;
    done?.();
  }

  // Starts the exit. Reduced motion skips it and runs the change at once.
  function leave(kind: "minimizing" | "closing", done: () => void) {
    if (prefersReducedMotion()) {
      done();
      return;
    }
    setLeaving(kind);
    leaveDone.current = done;
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(finishLeave, LEAVE_MS + 60);
  }

  // FLIP: after a maximise or restore commits, animate transform from the old box to the new one.
  // Only transform runs; width and height change at once. The start scale is uniform, so the
  // frame and its content keep their proportions. Reduced motion skips it.
  useLayoutEffect(() => {
    const from = flipFrom.current;
    const element = pane.current;
    flipFrom.current = null;
    if (
      !from ||
      !element ||
      prefersReducedMotion() ||
      typeof element.animate !== "function"
    )
      return;
    const box = element.getBoundingClientRect();
    const to = { x: box.x, y: box.y, width: box.width, height: box.height };
    const transform = createFlipTransform(
      createUniformFlipOrigin(from, to),
      to,
    );
    if (!transform) return;
    element.animate(
      [
        { transformOrigin: "0 0", transform },
        { transformOrigin: "0 0", transform: "none" },
      ],
      { duration: 180, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
    );
  });

  // Measures whether the title is cut off, so the cut end can show a visible fade
  // (win7-windows.css, data-truncated) as well as the ellipsis. The full title stays in the
  // tooltip and the frame's accessible name.
  useLayoutEffect(() => {
    const element = titleText.current;
    if (!element) return;
    const measure = () =>
      setTruncated(element.scrollWidth > element.clientWidth + 1);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [title]);

  // A failed copy moves focus to its read-only address, selected for copying.
  useEffect(() => {
    if (!shareUrl) return;
    shareField.current?.focus({ preventScroll: true });
    shareField.current?.select();
  }, [shareUrl]);

  // Moves focus off the window before it hides: the opener if it is still reachable,
  // otherwise the dock item for the current app, then the dock home link.
  function returnFocus() {
    const target = [
      opener.current,
      document.querySelector<HTMLElement>(".os-dock a[aria-current='page']"),
      document.querySelector<HTMLElement>(".os-dock-home"),
    ].find(
      (item): item is HTMLElement =>
        !!item &&
        item.isConnected &&
        !item.closest("[inert], [hidden]") &&
        !pane.current?.contains(item),
    );
    target?.focus({ preventScroll: true });
  }

  async function copyLink() {
    const hash =
      active && location.pathname === descriptor.path ? location.hash : "";
    const url = `${location.origin}${descriptor.path}${hash}`;
    if (shareTimer.current) clearTimeout(shareTimer.current);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    try {
      await navigator.clipboard.writeText(url);
      if (disposed.current) return;
      setShareUrl(null);
      setShareStatus(copy.copied);
      setCopied(true);
      copiedTimer.current = setTimeout(() => setCopied(false), COPIED_MS);
      shareTimer.current = setTimeout(
        () => setShareStatus(""),
        SHARE_STATUS_MS,
      );
    } catch {
      if (disposed.current) return;
      // The address is shown in the message, so the visitor can select and copy it by hand.
      // It stays until dismissed.
      setCopied(false);
      setShareUrl(url);
      setShareStatus(copy.copyFailed);
    }
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
  // A user-initiated show runs the one-shot open animation (research-os.css). Windows
  // already open at load never set it, so the first paint is not delayed by an
  // opacity-zero window. A window that mounts after load was opened by the user, so it
  // animates in on its first show. Derived while rendering (not in an effect), so the
  // attribute lands in the same commit.
  const [visibility, setVisibility] = useState(() => ({
    hidden,
    hiddenBefore: hidden || introduced,
    opening: !hidden && introduced,
  }));
  if (visibility.hidden !== hidden) {
    setVisibility({
      hidden,
      hiddenBefore: visibility.hiddenBefore || hidden,
      opening: !hidden && visibility.hiddenBefore,
    });
  }
  const opening = visibility.opening;
  return (
    <section
      ref={pane}
      id={active && !hidden ? "main-content" : namespace}
      role={active && !hidden ? "main" : "region"}
      aria-labelledby={`${controlId}-title`}
      tabIndex={-1}
      // 7.css reads `window`, `glass` and `active` for the Aero frame (win7-windows.css).
      className={`os-window os-workspace-window window glass${active ? " active" : ""}${reading.rect ? " os-window--floating" : ""}`}
      data-window-path={descriptor.path}
      data-active={active}
      data-opening={opening ? "true" : undefined}
      data-state={leaving ?? undefined}
      data-expanded={expanded ? "true" : undefined}
      onAnimationEnd={(event) => {
        // Animations on children bubble up to the frame, so only the frame's own count.
        if (event.target !== event.currentTarget) return;
        if (event.animationName === OPEN_ANIMATION)
          setVisibility((value) => ({ ...value, opening: false }));
        else if (
          leaveDone.current &&
          (event.animationName === CLOSE_ANIMATION ||
            event.animationName === MINIMIZE_ANIMATION)
        )
          finishLeave();
      }}
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
      <div className="os-windowbar title-bar">
        {(loading || pending) && (
          // One 2px accent hairline while the next page loads. The class name
          // stays so the existing pending-state test keeps its hook.
          <div className="os-window-scan" aria-hidden="true" />
        )}
        <div className="os-window-navigation">
          <OSIcon app={app} />
        </div>
        {/* The title names the window (aria-labelledby on the frame). It is not a tab stop:
            keyboard users move through the caption buttons and the page. The pointer drag
            stays on desktop. The full title is in the tooltip; phones wrap it instead. */}
        <div
          id={`${controlId}-title`}
          ref={titleText}
          className={`os-window-title title-bar-text ${reading.desktop ? "os-window-title--movable" : ""}`}
          title={reading.desktop ? `${title} · ${commands.moveWindow}` : title}
          // Set when the text is cut off. The CSS fades the cut end; the tooltip has the rest.
          data-truncated={truncated ? "true" : undefined}
          lang={titleLocale}
          dir={locales[titleLocale].dir}
          onPointerDown={(event) => reading.beginPointer(event, "move")}
          {...reading.pointerHandlers}
        >
          {title}
        </div>
        {/* Caption glyphs come from 7.css (is-minimize, is-maximize, is-restore, is-close).
            Every window carries the same three controls, in Win7 order. Each name includes
            the window title, so a screen reader says which window the command acts on. */}
        <div className="os-window-actions title-bar-controls">
          <button
            type="button"
            className="os-control is-minimize"
            onClick={() => {
              returnFocus();
              leave("minimizing", () => {
                setLeaving(null);
                reading.minimize();
                actions.minimize(descriptor.id);
              });
            }}
            aria-label={withTitle(local.minimizeWindow, title)}
            tabIndex={active ? 0 : -1}
          />
          <button
            type="button"
            className={`os-control os-expand ${expanded ? "is-restore" : "is-maximize"}`}
            onClick={() => {
              const box = pane.current?.getBoundingClientRect();
              flipFrom.current = box
                ? { x: box.x, y: box.y, width: box.width, height: box.height }
                : null;
              if (expanded) reading.restoreSize();
              else reading.maximize();
              setExpanded((value) => !value);
            }}
            // The name is constant; aria-pressed carries the expanded state.
            aria-label={withTitle(local.fullSizeWindow, title)}
            aria-pressed={expanded}
            // Phones already run every window full width, so there is nothing to expand.
            disabled={!reading.desktop}
            tabIndex={active ? 0 : -1}
          />
          <button
            type="button"
            className="os-control os-window-close is-close"
            onClick={() => {
              returnFocus();
              leave("closing", () => {
                actions.close(descriptor.id);
                onClosed?.(descriptor.path, title);
              });
            }}
            aria-label={withTitle(local.closeWindow, title)}
            tabIndex={active ? 0 : -1}
          />
        </div>
      </div>
      {/* The command toolbar sits under the title bar: Back, Copy Link and the Window
          Controls disclosure (desktop only). Back is a parent link, not a history step
          (navigation decision in use-reading-window.ts), so browser Back returns to the
          page just left. */}
      <div className="os-window-toolbar">
        <Link
          className="os-window-back"
          href={parentPath}
          aria-label={copy.back}
          tabIndex={active ? 0 : -1}
        >
          <ArrowLeft aria-hidden="true" />
          <span>{copy.back}</span>
        </Link>
        <button
          type="button"
          ref={copyButton}
          className={`os-control os-window-copy${copied ? " is-copied" : ""}`}
          onClick={copyLink}
          tabIndex={active ? 0 : -1}
        >
          {copied ? (
            <>
              <Check aria-hidden="true" />
              <span>{local.copiedShort}</span>
            </>
          ) : (
            copy.copyLink
          )}
        </button>
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
      </div>
      {/* The live region stays mounted so assistive tech announces updates. */}
      <p className={shareStatus ? "os-share-status" : "sr-only"} role="status">
        {shareStatus}
      </p>
      {shareUrl && (
        // The address the visitor can copy by hand. It is read-only and selectable, and it
        // stays until dismissed, so the recovery never depends on the address bar.
        <div className="os-share-address">
          <input
            ref={shareField}
            type="text"
            readOnly
            dir="ltr"
            className="os-share-url"
            value={shareUrl}
            aria-label={local.addressLabel}
            tabIndex={active ? 0 : -1}
            onFocus={(event) => event.currentTarget.select()}
          />
          <button
            type="button"
            className="os-control os-share-dismiss"
            tabIndex={active ? 0 : -1}
            onClick={() => {
              setShareUrl(null);
              setShareStatus("");
              copyButton.current?.focus();
            }}
          >
            {local.dismiss}
          </button>
        </div>
      )}
      <Activity mode={hidden ? "hidden" : "visible"}>
        <ApplicationStateContext.Provider value={initial}>
          <ApplicationVisibilityContext.Provider
            value={{ active: active && !hidden, namespace }}
          >
            <div
              // Each document starts with fresh state and scroll position.
              key={descriptor.id}
              ref={content}
              className="os-page-content window-body has-scrollbar"
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
          />
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
  // Windows mounted before the first commit were restored at load; later mounts are
  // opened by the user and run the window open animation.
  useEffect(() => {
    workspaceCommitted = true;
  }, []);
  const introduced = workspaceCommitted;
  // While the next page loads, the open window stays current instead of
  // revealing the desktop for a frame.
  const current =
    state.windows.find((item) => item.descriptor.path === pathname) ??
    (navigating ? state.windows[0] : undefined);
  const desktopVisible = !current || current.minimized;
  const local = localWindowCopy[locale];
  // The window that was just closed, offered back for a short time (Reopen).
  const [closedWindow, setClosedWindow] = useState<{
    path: string;
    title: string;
  } | null>(null);
  useEffect(() => {
    if (!closedWindow) return;
    const timer = setTimeout(() => setClosedWindow(null), UNDO_MS);
    return () => clearTimeout(timer);
  }, [closedWindow]);
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
            introduced={
              introduced || !initialPathname.endsWith(item.descriptor.path)
            }
            onClosed={(path, title) => setClosedWindow({ path, title })}
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
      {closedWindow && (
        <div className="os-window-undo" role="status">
          <span>
            <bdi lang={locale} dir={locales[locale].dir}>
              {withTitle(local.closedNotice, closedWindow.title)}
            </bdi>
          </span>
          <Link
            href={closedWindow.path}
            className="os-window-undo-link"
            onClick={() => setClosedWindow(null)}
          >
            {local.reopen}
          </Link>
        </div>
      )}
    </div>
  );
}
