"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import "./welcome-enter.css";

/** How long the Enter wait runs before the workspace opens. */
export const WELCOME_LOADER_MS = 3000;

let loaderMs = WELCOME_LOADER_MS;

/** Test hook: change the wait duration; 0 enters immediately. */
export function setWelcomeLoaderDuration(ms: number) {
  loaderMs = ms;
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

/** Follows the reduced-motion preference. Without matchMedia (jsdom) it never changes. */
function subscribeMotion(listener: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

/** The spinner animates unless reduced motion is requested. */
function readCanAnimate() {
  return (
    typeof window.matchMedia !== "function" ||
    !window.matchMedia(reducedMotionQuery).matches
  );
}

/** The server render carries no animation; the client decides after hydration. */
function serverCanAnimate() {
  return false;
}

/**
 * The welcome Enter button. Pressing it disables the button, moves focus to a
 * polite status line and fills a Win7 progress bar, then opens the workspace
 * once the wait has played.
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
  const statusLine = useRef<HTMLParagraphElement>(null);
  const canAnimate = useSyncExternalStore(
    subscribeMotion,
    readCanAnimate,
    serverCanAnimate,
  );

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    // A disabled button drops focus, so the status line takes it while the wait runs.
    if (loading) statusLine.current?.focus({ preventScroll: true });
  }, [loading]);

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
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setLoading(false);
      statusLine.current
        ?.closest(".os-shell")
        ?.setAttribute("data-arriving", "");
      onEnter();
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
        {/* The duration sits on the animated span; animation-duration does not inherit. */}
        <span style={{ animationDuration: `${WELCOME_LOADER_MS}ms` }} />
      </div>
      {/* The status region stays mounted so the first message is announced. */}
      <p
        ref={statusLine}
        className="os-enter-status"
        role="status"
        tabIndex={-1}
      >
        {loading && (
          <span
            className={canAnimate ? "spinner animate" : "spinner"}
            aria-hidden="true"
          />
        )}
        {loading ? status : ""}
      </p>
    </div>
  );
}
