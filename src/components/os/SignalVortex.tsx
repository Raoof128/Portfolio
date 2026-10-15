import type { CSSProperties } from "react";
import "./signal-vortex.css";

const RINGS = Array.from({ length: 21 }, (_, index) => index);

/** Decorative 404 art after "ordinary-mouse-17" by NlghtM4re, Uiverse.io (MIT). */
export function SignalVortex() {
  return (
    <div className="signal-vortex" aria-hidden="true">
      {RINGS.map((index) => (
        <span key={index} style={{ "--i": index } as CSSProperties} />
      ))}
    </div>
  );
}
