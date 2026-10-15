"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import "./welcome-enter.css";

/** How long the loader plays after Enter is pressed, before the workspace opens. */
export const WELCOME_LOADER_MS = 3000;

let loaderMs = WELCOME_LOADER_MS;

/** Test hook: change the loader duration; 0 enters immediately. */
export function setWelcomeLoaderDuration(ms: number) {
  loaderMs = ms;
}

/**
 * The welcome Enter button. Pressing it turns the button into the loader, then
 * opens the workspace once the loader has played.
 */
export function WelcomeEnter({
  onEnter,
  children,
}: {
  onEnter: () => void;
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const timer = useRef<number | null>(null);
  const maskId = `welcome-loader-${useId().replace(/:/g, "")}`;

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

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
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        onClick={enter}
      >
        {children}
      </button>
      {/* Loader after "young-walrus-64" by andrew-manzyk, Uiverse.io (MIT). */}
      <div className="os-welcome-loader" aria-hidden="true">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <defs>
            <mask id={maskId}>
              <polygon points="0,0 100,0 100,100 0,100" fill="black" />
              <polygon points="25,25 75,25 50,75" fill="white" />
              <polygon points="50,25 75,75 25,75" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
            </mask>
          </defs>
        </svg>
        <div
          className="os-welcome-loader-box"
          style={{ mask: `url(#${maskId})`, WebkitMask: `url(#${maskId})` }}
        />
      </div>
    </div>
  );
}
