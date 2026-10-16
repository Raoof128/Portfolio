"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import "./welcome-enter.css";

/** How long the Enter wait runs before the workspace opens. */
export const WELCOME_LOADER_MS = 3000;

/** The logon fades over this many milliseconds at the end of the wait (the hand-off). */
const HANDOFF_MS = 180;

let loaderMs = WELCOME_LOADER_MS;

/** Test hook: change the wait duration; 0 enters immediately. */
export function setWelcomeLoaderDuration(ms: number) {
  loaderMs = ms;
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
 * The welcome Enter button. Pressing it disables the button, moves focus to a
 * polite status line, makes the rest of the user tile inert and shows a dot-sequence
 * busy indicator. The logon fades over the last 180ms of the wait; the desktop mounts
 * only after that fade has painted its last frame, so the logon never pops out early.
 */
export function WelcomeEnter({
  onEnter,
  status,
  children,
}: {
  onEnter: () => void;
  /** Localised status line announced while the wait runs. */
  status: string;
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const timer = useRef<number | null>(null);
  const handoffTimer = useRef<number | null>(null);
  const cancelled = useRef(false);
  const statusLine = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    cancelled.current = false;
    return () => {
      cancelled.current = true;
      if (timer.current !== null) window.clearTimeout(timer.current);
      if (handoffTimer.current !== null)
        window.clearTimeout(handoffTimer.current);
    };
  }, []);

  useEffect(() => {
    // A disabled button drops focus, so the status line takes it while the wait runs.
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

  function arrive() {
    if (cancelled.current) return;
    setLoading(false);
    statusLine.current?.closest(".os-shell")?.setAttribute("data-arriving", "");
    onEnter();
  }

  function enter() {
    if (loading) return;
    if (loaderMs <= 0) {
      statusLine.current
        ?.closest(".os-shell")
        ?.setAttribute("data-arriving", "");
      onEnter();
      return;
    }
    setLoading(true);
    const logon = statusLine.current?.closest<HTMLElement>(".os-welcome");
    handoffTimer.current = window.setTimeout(
      () => {
        handoffTimer.current = null;
        logon?.setAttribute("data-leaving", "");
      },
      Math.max(0, loaderMs - HANDOFF_MS),
    );
    timer.current = window.setTimeout(() => {
      timer.current = null;
      afterLogonFade(logon, arrive);
    }, loaderMs);
  }

  return (
    <div className="os-enter-stage" data-loading={loading || undefined}>
      <button
        className="os-enter"
        id="os-enter"
        type="button"
        disabled={loading}
        aria-busy={loading || undefined}
        onClick={enter}
      >
        {/* The text keeps the accessible name but is visually hidden, so the
            Aero face shows the arrow alone. */}
        {Children.map(children, (child) =>
          typeof child === "string" || typeof child === "number" ? (
            <span className="os-enter-label">{child}</span>
          ) : (
            child
          ),
        )}
      </button>
      <div className="os-enter-progress" aria-hidden="true">
        {/* The track carries the wait duration; the five dots inherit it, since
            animation-duration does not inherit by default. */}
        <span
          className="os-enter-track"
          style={{ animationDuration: `${WELCOME_LOADER_MS}ms` }}
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
