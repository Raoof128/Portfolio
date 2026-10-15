"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import "./welcome-enter.css";

/** How long the arrival loader plays before it turns into the Enter button. */
export const WELCOME_LOADER_MS = 3000;

// Once per page load: returning to the welcome screen shows the button at once.
let loaderPlayed = false;

/** Test hook: replay the arrival loader as on a fresh page load. */
export function resetWelcomeLoader() {
  loaderPlayed = false;
}

/**
 * Plays the arrival loader, then reveals the Enter button in its place. The
 * button stays mounted and reachable throughout; only its appearance waits, and
 * keyboard focus reveals it immediately.
 */
export function WelcomeEnter({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(() => !loaderPlayed);
  const maskId = `welcome-loader-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => {
      loaderPlayed = true;
      setLoading(false);
    }, WELCOME_LOADER_MS);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div className="os-enter-stage" data-loading={loading || undefined}>
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
      {children}
    </div>
  );
}
