"use client";

import { useId } from "react";

export function DandelionSpinner() {
  const artworkId = useId();
  return (
    <div className="dandelion-host" aria-hidden="true">
      <div className="dandelion-bloom">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter
              id={`${artworkId}-dn-glow`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="1.2"
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <path
              id={`${artworkId}-dn-long`}
              fill="none"
              stroke="#FFD1D1"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#${artworkId}-dn-glow)`}
              d="M 50,45 L 50,26 M 50,26 L 50,6 M 50,26 Q 46,20 38,15
                 M 50,26 Q 54,20 62,15 M 50,26 Q 48,18 44,10 M 50,26 Q 52,18 56,10"
            />

            <path
              id={`${artworkId}-dn-med`}
              fill="none"
              stroke="#FF4D4D"
              strokeWidth="0.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#${artworkId}-dn-glow)`}
              d="M 50,45 L 50,30 M 50,30 L 50,15 M 50,30 Q 47,25 40,21
                 M 50,30 Q 53,25 60,21 M 50,30 Q 48,23 45,17 M 50,30 Q 52,23 55,17"
            />

            <path
              id={`${artworkId}-dn-short`}
              fill="none"
              stroke="#B30000"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#${artworkId}-dn-glow)`}
              d="M 50,45 L 50,34 M 50,34 L 50,22 M 50,34 Q 47,30 42,26
                 M 50,34 Q 53,30 58,26 M 50,34 Q 48,28 46,23 M 50,34 Q 52,28 54,23"
            />
          </defs>

          <use href={`#${artworkId}-dn-long`} transform="rotate(0 50 50)" />
          <use href={`#${artworkId}-dn-med`} transform="rotate(30 50 50)" />
          <use href={`#${artworkId}-dn-short`} transform="rotate(60 50 50)" />
          <use href={`#${artworkId}-dn-med`} transform="rotate(90 50 50)" />
          <use href={`#${artworkId}-dn-long`} transform="rotate(120 50 50)" />
          <use href={`#${artworkId}-dn-med`} transform="rotate(150 50 50)" />
          <use href={`#${artworkId}-dn-short`} transform="rotate(180 50 50)" />
          <use href={`#${artworkId}-dn-med`} transform="rotate(210 50 50)" />
          <use href={`#${artworkId}-dn-long`} transform="rotate(240 50 50)" />
          <use href={`#${artworkId}-dn-med`} transform="rotate(270 50 50)" />
          <use href={`#${artworkId}-dn-short`} transform="rotate(300 50 50)" />
          <use href={`#${artworkId}-dn-med`} transform="rotate(330 50 50)" />

          <circle
            cx="50"
            cy="50"
            r="3"
            fill="#B30000"
            filter={`url(#${artworkId}-dn-glow)`}
          />
        </svg>
      </div>

      <style>{`
        .dandelion-host {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0c0303;
        }
        .dandelion-bloom {
          width: min(260px, 50vw);
          height: min(260px, 50vw);
          max-width: 320px;
          max-height: 320px;
          animation: dn-spin 4s linear infinite;
        }
        @keyframes dn-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dandelion-bloom {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
