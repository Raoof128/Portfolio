"use client";

import { useId, useRef } from "react";
import { useArtworkPause, type ArtworkProps } from "./artwork-pause";
import "./forma-artwork.css";

/** A kinetic laurel: enamel leaves and brass ribs surround a weighted centre. */
export function FormaArtwork({
  active = true,
  preview = false,
}: ArtworkProps = {}) {
  const artworkId = useId();
  const hostRef = useRef<HTMLDivElement>(null);
  // Keep the same animation nodes mounted so Pause/Play preserves their phase.
  useArtworkPause(hostRef, active && !preview);

  return (
    <div ref={hostRef} className="forma-artwork ui-art" aria-hidden="true">
      <div className="forma-sculpture">
        <svg
          viewBox="0 0 240 240"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <defs>
            {/* Static shading adds depth without animated filters or a frame loop. */}
            <linearGradient id={`${artworkId}-enamel`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b4e4c5" />
              <stop offset="0.38" stopColor="#68b79b" />
              <stop offset="1" stopColor="#226752" />
            </linearGradient>
            <linearGradient id={`${artworkId}-brass`} x1="0" y1="0" x2="1" y2="0.8">
              <stop offset="0" stopColor="#f2dfaa" />
              <stop offset="0.5" stopColor="#c4a66b" />
              <stop offset="1" stopColor="#75613b" />
            </linearGradient>
            <radialGradient id={`${artworkId}-hub`} cx="35%" cy="28%" r="75%">
              <stop offset="0" stopColor="#355e50" />
              <stop offset="1" stopColor="#101f1a" />
            </radialGradient>
            <path
              id={`${artworkId}-leaf`}
              d="M120 91 C94 70 97 37 123 19 C142 49 140 72 120 91Z"
            />
            <path
              id={`${artworkId}-seed`}
              d="M120 105 C99 88 102 64 120 51 C138 70 140 90 120 105Z"
            />
          </defs>
          <g fill="none" stroke="#779782" strokeWidth="0.6" opacity="0.45">
            <circle cx="120" cy="120" r="113" />
            <circle cx="120" cy="120" r="108" strokeDasharray="0.7 5" />
            <circle cx="120" cy="120" r="77" />
          </g>
          <g
            className="forma-crown"
            fill={`url(#${artworkId}-enamel)`}
            stroke="#102b24"
            strokeWidth="1.5"
            strokeLinejoin="round"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <g key={index} transform={`rotate(${index * 30} 120 120)`}>
                <use href={`#${artworkId}-leaf`} />
                <path
                  d="M121 29 Q110 60 120 85 M115 55 L106 47 M115 66 L105 60 M115 56 L129 43 M116 69 L132 59"
                  fill="none"
                  stroke="#c0e6c7"
                  strokeWidth="0.7"
                  opacity="0.65"
                />
                <circle cx="120" cy="12" r="1.4" fill="#dfc48a" stroke="none" />
              </g>
            ))}
          </g>
          <g
            className="forma-seeds"
            fill={`url(#${artworkId}-brass)`}
            stroke="#102b24"
            strokeWidth="1.4"
            strokeLinejoin="round"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <g key={index} transform={`rotate(${index * 45 + 22.5} 120 120)`}>
                <use href={`#${artworkId}-seed`} />
                <path
                  d="M120 61 Q111 83 120 98"
                  fill="none"
                  stroke="#f0dcaa"
                  strokeWidth="0.8"
                />
              </g>
            ))}
          </g>
          <circle
            cx="120"
            cy="120"
            r="35"
            fill="#0f211b"
            stroke="#a58b5a"
            strokeWidth="1"
          />
          <circle
            cx="120"
            cy="120"
            r="31"
            fill={`url(#${artworkId}-hub)`}
            stroke="#547b65"
            strokeWidth="0.7"
          />
          <g
            className="forma-core"
            fill={`url(#${artworkId}-enamel)`}
            stroke="#102b24"
            strokeWidth="1.3"
          >
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <path
                key={angle}
                transform={`rotate(${angle} 120 120)`}
                d="M120 120 C104 113 108 97 120 95 C133 101 132 114 120 120Z"
              />
            ))}
            <circle cx="120" cy="120" r="8" fill={`url(#${artworkId}-brass)`} />
            <circle
              cx="120"
              cy="120"
              r="3"
              fill="#17392c"
              stroke="#e7ce95"
              strokeWidth="0.7"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
