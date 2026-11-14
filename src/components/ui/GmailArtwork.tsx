"use client";

import { useId, useRef } from "react";
import { useArtworkPause, type ArtworkProps } from "./artwork-pause";
import "./gmail-artwork.css";

/** A sealed courier carries a letter between two bounded transfer rails. */
export function GmailArtwork({
  active = true,
  preview = false,
}: ArtworkProps = {}) {
  const id = useId();
  const host = useRef<HTMLDivElement>(null);
  useArtworkPause(host, active && !preview);
  return (
    <div ref={host} className="gmail-artwork ui-art" aria-hidden="true">
      <div className="gmail-sculpture">
        <svg
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <defs>
            <linearGradient id={`${id}-paper`} x1="0" y1="0" x2=".8" y2="1">
              <stop stopColor="#fff1d5" />
              <stop offset="1" stopColor="#b99b7e" />
            </linearGradient>
            <linearGradient id={`${id}-copper`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#f6ce9b" />
              <stop offset=".4" stopColor="#b76a4c" />
              <stop offset="1" stopColor="#653b35" />
            </linearGradient>
            <radialGradient id={`${id}-wax`} cx="35%" cy="30%">
              <stop stopColor="#ce705f" />
              <stop offset="1" stopColor="#763e40" />
            </radialGradient>
          </defs>
          <g fill="none" stroke="#ae846c" strokeWidth=".7" opacity=".5">
            <rect x="27" y="27" width="246" height="246" rx="50" />
            <rect
              x="34"
              y="34"
              width="232"
              height="232"
              rx="45"
              strokeDasharray="1 7"
            />
            <path d="M58 72H242M58 228H242M150 16V43M150 257V284" />
          </g>
          <path
            d="M58 72H242M242 228H58"
            stroke="#e6ba8f"
            strokeWidth="2"
            strokeDasharray="5 179"
            className="gmail-transfer"
          />
          {[58, 242].map((x) => (
            <g key={x} fill="#24191d" stroke="#c49b77">
              <circle cx={x} cy="72" r="5" />
              <circle cx={x} cy="228" r="5" />
            </g>
          ))}
          <g className="gmail-courier">
            <g
              fill={`url(#${id}-copper)`}
              stroke="#482c2d"
              strokeWidth="1.5"
              strokeLinejoin="round"
            >
              <path d="M88 132L40 104L48 143L88 160Z" />
              <path d="M85 150L29 136L48 165L88 175Z" />
              <path d="M87 169L39 164L63 185L93 181Z" />
              <path d="M212 132L260 104L252 143L212 160Z" />
              <path d="M215 150L271 136L252 165L212 175Z" />
              <path d="M213 169L261 164L237 185L207 181Z" />
            </g>
            <path
              d="M82 120L150 89L218 120V187H82Z"
              fill="#714a42"
              stroke="#e9c59f"
              strokeWidth="1.4"
            />
            <rect
              x="105"
              y="96"
              width="90"
              height="77"
              rx="3"
              fill={`url(#${id}-paper)`}
            />
            <g stroke="#897262" strokeWidth="2">
              <path d="M119 111H169M119 120H181M119 129H158" />
            </g>
            <path
              d="M82 120L150 163L218 120V187H82Z"
              fill={`url(#${id}-paper)`}
              stroke="#725043"
              strokeWidth="1.2"
            />
            <path
              d="M82 187L137 149M218 187L163 149"
              fill="none"
              stroke="#725043"
              strokeWidth="1.2"
            />
            <path
              d="M84 121L150 164L216 121"
              fill="none"
              stroke="#fff5de"
              strokeOpacity=".7"
              strokeWidth="2"
            />
            <circle
              cx="150"
              cy="162"
              r="18"
              fill={`url(#${id}-wax)`}
              stroke="#e7b289"
              strokeWidth="1.5"
            />
            <g
              className="gmail-seal"
              fill="none"
              stroke="#f2c39b"
              strokeWidth="1"
            >
              <circle cx="150" cy="162" r="13" strokeDasharray="3 4" />
            </g>
            <path
              d="M143 162L148 167L158 155"
              fill="none"
              stroke="#ffe6ba"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <g fill="#e6ba8f">
            <path d="M144 61L150 55L156 61L150 67Z" />
            <path d="M144 239L150 233L156 239L150 245Z" />
          </g>
        </svg>
      </div>
    </div>
  );
}
