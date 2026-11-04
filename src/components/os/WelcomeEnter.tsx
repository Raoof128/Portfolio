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

/** How long arrow activation waits before the workspace opens. */
export const WELCOME_LOADER_MS = 3000;

/** The logon fades over this many milliseconds at the end of the wait (the hand-off). */
const HANDOFF_MS = 120;
/** Session flag: the desktop has been shown in this browser session. */
const SEEN_KEY = "researchos:welcome-seen";

/** The visible orb caption, keyed by locale. It is also the start of the orb's accessible name. */
const welcomeCopy: Record<Locale, { enterWorkspace: string }> = {
  en: { enterWorkspace: "Enter workspace" },
  fa: { enterWorkspace: "ورود به فضای کار" },
  ar: { enterWorkspace: "ادخل مساحة العمل" },
  es: { enterWorkspace: "Entrar al espacio de trabajo" },
  zh: { enterWorkspace: "进入工作空间" },
};

let loaderMs = WELCOME_LOADER_MS;

/** Test hook: change the first-visit wait; 0 enters immediately. */
export function setWelcomeLoaderDuration(ms: number) {
  loaderMs = ms;
}

/**
 * Records that the desktop has been shown in this browser session. This marker
 * never bypasses the profile screen or shortens its entry delay.
 */
export function welcomeSeenThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** Records desktop entry when session storage is available. */
export function markWelcomeSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage can be blocked; the logon then appears on the next visit.
  }
}

/**
 * The orb's accessible name: the visible "Enter workspace" caption, then the lab entry text. The visible
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
  const enterWorkspace = welcomeCopy[locale].enterWorkspace;
  return text ? `${enterWorkspace}: ${text}` : enterWorkspace;
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
 * is 3s for every selection. Reduced motion changes only the decorative animation.
 * Repeated selection and keys cannot shorten the wait. The logon fades over
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
  const entryStarted = useRef(false);
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

  // Hand off only after the complete wait, once the fade's last frame is ready.
  const handOff = useCallback(() => {
    if (handingOff.current) return;
    handingOff.current = true;
    clearTimer(timer);
    clearTimer(handoffTimer);
    const logon = statusLine.current?.closest<HTMLElement>(".os-welcome");
    logon?.setAttribute("data-leaving", "");
    afterLogonFade(logon, arrive);
  }, [arrive]);

  function enter() {
    // A ref also blocks synchronous programmatic double selection before React
    // has committed the disabled button, keeping one timer and one hand-off.
    if (entryStarted.current) return;
    entryStarted.current = true;
    if (loaderMs <= 0) {
      statusLine.current
        ?.closest(".os-shell")
        ?.setAttribute("data-arriving", "");
      onEnterRef.current();
      return;
    }
    const wait = loaderMs;
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
        disabled={loading}
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
        {welcomeCopy[locale].enterWorkspace}
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
