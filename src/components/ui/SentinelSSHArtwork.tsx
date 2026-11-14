"use client";

import { useId, useRef } from "react";
import { useArtworkPause, type ArtworkProps } from "./artwork-pause";
import "./sentinel-ssh-artwork.css";

/** An inspection lens: fixed host pins surround a rotating, bounded aperture. */
export function SentinelSSHArtwork({
  active = true,
  preview = false,
}: ArtworkProps = {}) {
  const id = useId();
  const host = useRef<HTMLDivElement>(null);
  useArtworkPause(host, active && !preview);
  return (
    <div ref={host} className="sentinel-artwork ui-art" aria-hidden="true">
      <div className="sentinel-sculpture">
        <svg
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <defs>
            <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#dcf4ef" />
              <stop offset=".36" stopColor="#71aeb1" />
              <stop offset=".7" stopColor="#234958" />
              <stop offset="1" stopColor="#b2d7d3" />
            </linearGradient>
            <radialGradient id={`${id}-glass`} cx="35%" cy="30%" r="75%">
              <stop stopColor="#347985" />
              <stop offset=".55" stopColor="#123844" />
              <stop offset="1" stopColor="#051219" />
            </radialGradient>
            <linearGradient id={`${id}-gold`} x2="1" y2="1">
              <stop stopColor="#ffe6b0" />
              <stop offset="1" stopColor="#a87836" />
            </linearGradient>
          </defs>
          <g fill="none" stroke="#527682" strokeWidth=".7">
            <circle cx="150" cy="150" r="137" opacity=".5" />
            <circle cx="150" cy="150" r="127" strokeDasharray="1 7" />
            <path d="M150 5V36M150 264V295M5 150H36M264 150H295" />
          </g>
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 60} 150 150)`}>
              <path d="M150 35V73" stroke="#4f8b96" strokeWidth="2" />
              <path
                className="sentinel-signal"
                d="M150 39V69"
                stroke="#9ef9df"
                strokeWidth="3"
                strokeDasharray="4 26"
                style={{ animationDelay: `${i * -0.6}s` }}
              />
              <path
                d="M142 20L150 15L158 20V30L150 35L142 30Z"
                fill="#163642"
                stroke={`url(#${id}-metal)`}
                strokeWidth="1.5"
              />
              <circle cx="150" cy="25" r="2" fill="#f8d397" />
            </g>
          ))}
          <circle
            cx="150"
            cy="150"
            r="91"
            fill="#071b24"
            stroke={`url(#${id}-metal)`}
            strokeWidth="7"
          />
          <circle
            cx="150"
            cy="150"
            r="82"
            fill="none"
            stroke="#b58f53"
            strokeWidth="1"
          />
          <g
            className="sentinel-rotor"
            fill={`url(#${id}-metal)`}
            stroke="#071b24"
            strokeWidth="1.5"
          >
            {Array.from({ length: 8 }, (_, i) => (
              <path
                key={i}
                transform={`rotate(${i * 45} 150 150)`}
                d="M150 73A77 77 0 0 1 204 96L177 133L151 112L126 99Z"
              />
            ))}
          </g>
          <circle
            cx="150"
            cy="150"
            r="44"
            fill={`url(#${id}-glass)`}
            stroke={`url(#${id}-gold)`}
            strokeWidth="2"
          />
          <g
            className="sentinel-scan"
            fill="none"
            stroke="#b5e8e1"
            strokeWidth="1.5"
          >
            <path d="M117 150A33 33 0 0 1 150 117M183 150A33 33 0 0 1 150 183" />
            <circle cx="117" cy="150" r="2.5" fill="#d1fff0" />
          </g>
          <path
            d="M150 128L167 135V150Q166 163 150 173Q134 163 133 150V135Z"
            fill="#102a35"
            stroke={`url(#${id}-gold)`}
            strokeWidth="2"
          />
          <path
            d="M142 149L148 155L159 141"
            fill="none"
            stroke="#bcebdc"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M121 124Q145 107 168 125"
            fill="none"
            stroke="#fff"
            strokeOpacity=".14"
            strokeWidth="3"
          />
        </svg>
      </div>
    </div>
  );
}
