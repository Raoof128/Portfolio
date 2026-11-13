"use client";

import { useId, useRef } from "react";
import { useArtworkPause, type ArtworkProps } from "./artwork-pause";
import "./forma-artwork.css";

/** A kinetic laurel: repeated leaves turn around a steady, weighted centre. */
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
        <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path
              id={`${artworkId}-leaf`}
              d="M120 40 C94 27 95 8 120 7 C143 16 143 37 120 58 C117 50 117 44 120 40Z"
            />
            <path
              id={`${artworkId}-seed`}
              d="M120 68 C105 57 106 42 120 37 C137 49 134 65 120 79Z"
            />
          </defs>
          <g
            className="forma-crown"
            fill="#65bfa0"
            stroke="#102b24"
            strokeWidth="3"
            strokeLinejoin="round"
          >
            {Array.from({ length: 16 }, (_, index) => (
              <g key={index} transform={`rotate(${index * 22.5} 120 120)`}>
                <use
                  href={`#${artworkId}-leaf`}
                  fill={index % 2 ? "#a7d9b1" : "#65bfa0"}
                />
                <path
                  d="M120 22 Q128 36 120 53"
                  fill="none"
                  strokeWidth="1.5"
                />
              </g>
            ))}
          </g>
          <g
            className="forma-seeds"
            fill="#d7b873"
            stroke="#102b24"
            strokeWidth="3"
            strokeLinejoin="round"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <use
                key={index}
                href={`#${artworkId}-seed`}
                transform={`rotate(${index * 30} 120 120)`}
              />
            ))}
          </g>
          <circle
            cx="120"
            cy="120"
            r="39"
            fill="#12201d"
            stroke="#b8d7b0"
            strokeWidth="2"
          />
          <g
            className="forma-core"
            fill="#e6ce91"
            stroke="#102b24"
            strokeWidth="3"
          >
            {[0, 90, 180, 270].map((angle) => (
              <path
                key={angle}
                transform={`rotate(${angle} 120 120)`}
                d="M120 116 C94 102 103 83 120 87 C137 83 146 102 120 116Z"
              />
            ))}
            <circle cx="120" cy="120" r="11" fill="#65bfa0" />
          </g>
        </svg>
      </div>
    </div>
  );
}
