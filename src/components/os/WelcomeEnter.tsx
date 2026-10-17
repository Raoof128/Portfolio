"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n";
import "./welcome-enter.css";

/** How long the first Enter wait runs in a session before the workspace opens. */
export const WELCOME_LOADER_MS = 3000;
/** The shorter wait under reduced motion, and for a logon shown again in the session (after Lock). */
export const WELCOME_SHORT_MS = 600;

/** The logon fades over this many milliseconds at the end of the wait (the hand-off). */
const HANDOFF_MS = 120;
/** Session flag: the desktop has been shown in this browser session. */
const SEEN_KEY = "researchos:welcome-seen";

/** The visible orb caption, keyed by locale. It is also the start of the orb's accessible name. */
const welcomeCopy: Record<Locale, { signIn: string }> = {
  en: { signIn: "Sign in" },
  fa: { signIn: "ورود" },
  ar: { signIn: "تسجيل الدخول" },
  es: { signIn: "Iniciar sesión" },
  zh: { signIn: "登录" },
};

let loaderMs = WELCOME_LOADER_MS;

/** Test hook: change the first-visit wait; 0 enters immediately. */
export function setWelcomeLoaderDuration(ms: number) {
  loaderMs = ms;
}

/**
 * True once the desktop has been shown in this browser session. A reload or a return home then
 * goes straight to the desktop. Blocked storage reads as not seen, so the logon simply shows.
 */
export function welcomeSeenThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** Records that the desktop has been shown this session. A failed write only means the logon shows again. */
export function markWelcomeSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage can be blocked; the logon then appears on the next visit.
  }
}

function prefersReducedMotion(): boolean {
  try {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch {
    return false;
  }
}

/**
 * The orb's accessible name: the visible "Sign in" caption, then the lab entry text. The visible
 * label is part of the name (WCAG 2.5.3), so speech input can say what the sighted user reads.
 */
function accessibleName(locale: Locale, children: ReactNode): string {
  const text = Children.toArray(children)
    .filter(
      (child): child is string | number =>
        typeof child === "string" || typeof child === "number",
    )
    .join("")
    .trim();
  const signIn = welcomeCopy[locale].signIn;
  return text ? `${signIn}: ${text}` : signIn;
}

function clearTimer(ref: MutableRefObject<number | null>) {
  if (ref.current !== null) window.clearTimeout(ref.current);
  ref.current = null;
}

/**
 * Runs `done` once the logon has finished its fade. The fade uses forwards fill, so a
 * finished animation still lists here and settles at once. With no running animation
 * (reduced motion, jsdom, engines without the Web Animations API) `done` runs
 * synchronously. A cap stops a stuck animation from holding the hand-off.
 */
function afterLogonFade(
  logon: HTMLElement | null | undefined,
  done: () => void,
) {
  const animations = logon?.getAnimations?.() ?? [];
  if (animations.length === 0) {
    done();
    return;
  }
  const settled = Promise.all(
    animations.map((animation) => animation.finished.catch(() => undefined)),
  );
  const cap = new Promise<void>((resolve) =>
    window.setTimeout(resolve, HANDOFF_MS + 200),
  );
  void Promise.race([settled, cap]).then(() => {
    // Two frames: the last fade frame paints before the desktop mounts.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(done);
    });
  });
}

/**
 * The welcome Enter button. Pressing it starts a short wait: focus moves to a polite status
 * line, the rest of the user tile goes inert and a dot-sequence busy indicator runs. The wait
 * is 3s on the first visit of a session and about 0.6s under reduced motion or when the logon is
 * shown again in the session (after Lock). A return home goes straight to the desktop instead.
 * A second press, or Enter or Escape while the wait runs, ends it at once. The logon fades over
 * the last 120ms of the wait; the desktop mounts only after that fade has painted its last frame.
 */
export function WelcomeEnter({
  onEnter,
  status,
  children,
  locale = "en",
}: {
  onEnter: () => void;
  /** Localised status line announced while the wait runs. */
  status: string;
  /** The lab entry text. It is visually hidden and ends the orb's accessible name. */
  children: ReactNode;
  locale?: Locale;
}) {
  const [loading, setLoading] = useState(false);
  const [waitMs, setWaitMs] = useState(WELCOME_LOADER_MS);
  const timer = useRef<number | null>(null);
  const handoffTimer = useRef<number | null>(null);
  const cancelled = useRef(false);
  const handingOff = useRef(false);
  const statusLine = useRef<HTMLParagraphElement>(null);
  const onEnterRef = useRef(onEnter);

  useEffect(() => {
    onEnterRef.current = onEnter;
  });

  useEffect(() => {
    cancelled.current = false;
    return () => {
      cancelled.current = true;
      clearTimer(timer);
      clearTimer(handoffTimer);
    };
  }, []);

  useEffect(() => {
    // The status line takes focus while the wait runs, so focus is never lost to the body.
    if (loading) statusLine.current?.focus({ preventScroll: true });
  }, [loading]);

  useEffect(() => {
    // The status line sits inside the user tile, so the tile's other children are made
    // inert for the wait: the shortcuts and the portrait cannot take focus or clicks.
    // The stage stays live because it holds the status line, which keeps focus.
    const profile =
      statusLine.current?.closest<HTMLElement>(".os-lock-profile");
    if (!profile) return;
    for (const child of Array.from(profile.children)) {
      if (child.classList.contains("os-enter-stage")) continue;
      if (loading) child.setAttribute("inert", "");
      else child.removeAttribute("inert");
    }
  }, [loading]);

  const arrive = useCallback(() => {
    if (cancelled.current) return;
    setLoading(false);
    statusLine.current?.closest(".os-shell")?.setAttribute("data-arriving", "");
    onEnterRef.current();
  }, []);

  // Ends the wait: the logon fades and the desktop arrives. It runs when the wait finishes, or at
  // once when the visitor presses the orb again or presses Enter or Escape during the wait.
  const handOff = useCallback(() => {
    if (handingOff.current) return;
    handingOff.current = true;
    clearTimer(timer);
    clearTimer(handoffTimer);
    const logon = statusLine.current?.closest<HTMLElement>(".os-welcome");
    logon?.setAttribute("data-leaving", "");
    afterLogonFade(logon, arrive);
  }, [arrive]);

  useEffect(() => {
    if (!loading) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (event.key !== "Enter" && event.key !== "Escape") return;
      // Only keys aimed at the wait skip it; the header controls keep their own keys.
      const stage = statusLine.current?.closest(".os-enter-stage");
      const target = event.target;
      if (
        target instanceof Node &&
        target !== document.body &&
        !stage?.contains(target)
      )
        return;
      event.preventDefault();
      handOff();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [loading, handOff]);

  function enter() {
    if (loading) {
      handOff();
      return;
    }
    if (loaderMs <= 0) {
      statusLine.current
        ?.closest(".os-shell")
        ?.setAttribute("data-arriving", "");
      onEnterRef.current();
      return;
    }
    // A logon shown again in the session (after Lock), or reduced motion, takes the short wait.
    const short = welcomeSeenThisSession() || prefersReducedMotion();
    const wait = Math.min(loaderMs, short ? WELCOME_SHORT_MS : loaderMs);
    handingOff.current = false;
    setWaitMs(wait);
    setLoading(true);
    const logon = statusLine.current?.closest<HTMLElement>(".os-welcome");
    handoffTimer.current = window.setTimeout(
      () => {
        handoffTimer.current = null;
        logon?.setAttribute("data-leaving", "");
      },
      Math.max(0, wait - HANDOFF_MS),
    );
    timer.current = window.setTimeout(() => {
      timer.current = null;
      handOff();
    }, wait);
  }

  return (
    <div className="os-enter-stage" data-loading={loading || undefined}>
      <button
        className="os-enter"
        id="os-enter"
        type="button"
        aria-busy={loading || undefined}
        aria-label={accessibleName(locale, children)}
        onClick={enter}
      >
        {/* The text is visually hidden, so the Aero face shows the arrow alone. The
            button's aria-label carries the name (the caption plus this text). */}
        {Children.map(children, (child) =>
          typeof child === "string" || typeof child === "number" ? (
            <span className="os-enter-label">{child}</span>
          ) : (
            child
          ),
        )}
      </button>
      {/* The visible cue under the arrow. It is named by the button's aria-label, so it stays
          aria-hidden here, and it stays in the same place while the wait runs. */}
      <span className="os-enter-caption" lang={locale} aria-hidden="true">
        {welcomeCopy[locale].signIn}
      </span>
      <div className="os-enter-progress" aria-hidden="true">
        {/* The track carries the wait duration and the dots take their timing from it,
            so a shorter wait shows the same sequence. animation-duration does not
            inherit by default, so the track sets the duration for the dots. */}
        <span
          className="os-enter-track"
          style={
            {
              animationDuration: `${waitMs}ms`,
              "--os-wait": `${waitMs}ms`,
            } as CSSProperties
          }
        >
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
      {/* The status region stays mounted so the first message is announced. */}
      <p
        ref={statusLine}
        className="os-enter-status"
        role="status"
        tabIndex={-1}
      >
        {loading ? status : ""}
      </p>
    </div>
  );
}
