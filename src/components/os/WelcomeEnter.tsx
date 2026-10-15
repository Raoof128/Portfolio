"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import "./welcome-enter.css";

/** How long the Enter wait runs before the workspace opens. */
export const WELCOME_LOADER_MS = 3000;

let loaderMs = WELCOME_LOADER_MS;

/** Test hook: change the wait duration; 0 enters immediately. */
export function setWelcomeLoaderDuration(ms: number) {
  loaderMs = ms;
}

/**
 * The welcome Enter button. Pressing it disables the button, moves focus to a
 * polite status line and fills a 2px accent hairline, then opens the workspace
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
      onEnter();
      return;
    }
    setLoading(true);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setLoading(false);
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
        {children}
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
        {loading ? status : ""}
      </p>
    </div>
  );
}
