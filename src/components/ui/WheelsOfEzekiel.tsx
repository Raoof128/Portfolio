"use client";

const VOID = "#06050a";
const GOLD = "#f59e0b";
const RED = "#dc2626";
const WHITE = "#fffdf5";
const CHARCOAL = "#1c1a24";

export function WheelsOfEzekiel() {
  return (
    <div className="woe-host" aria-hidden="true">
      <div className="woe-container">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.9))" }}
        >
          <defs>
            <filter id="woe-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Watcher eye module */}
            <g id="woe-eye">
              <path
                d="M -8,0 Q 0,-6 8,0 Q 0,6 -8,0 Z"
                fill={WHITE}
                stroke={VOID}
                strokeWidth="1.5"
              />
              <circle cx="0" cy="0" r="3" fill={RED} filter="url(#woe-glow)" />
              <circle cx="0" cy="0" r="1.2" fill={GOLD} />
              <path
                className="woe-lid"
                d="M -8.5,0 Q 0,-7 8.5,0 L 8.5,-7 L -8.5,-7 Z"
                fill={CHARCOAL}
              />
            </g>
          </defs>

          {/* Blueprint ambient rings */}
          <g stroke="rgba(245,158,11,0.08)" strokeWidth="0.8" fill="none">
            <circle cx="100" cy="100" r="92" />
            <circle cx="100" cy="100" r="75" strokeDasharray="4,3" />
            <line x1="100" y1="5" x2="100" y2="195" strokeDasharray="3,6" />
            <line x1="5" y1="100" x2="195" y2="100" strokeDasharray="3,6" />
          </g>

          {/* Outer wheel */}
          <g className="woe-outer">
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke={CHARCOAL}
              strokeWidth="6"
            />
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke={GOLD}
              strokeWidth="1.5"
            />
            <circle
              cx="100"
              cy="100"
              r="64"
              fill="none"
              stroke={RED}
              strokeWidth="0.8"
              strokeDasharray="6,4"
            />
            <g transform="translate(100,100)">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((r, i) => (
                <g key={r} transform={`rotate(${r}) translate(0,-70)`}>
                  <use href="#woe-eye" className={`woe-lid-${(i % 3) + 1}`} />
                </g>
              ))}
            </g>
          </g>

          {/* Inner wheel */}
          <g className="woe-inner">
            <circle
              cx="100"
              cy="100"
              r="54"
              fill="none"
              stroke={CHARCOAL}
              strokeWidth="5"
            />
            <circle
              cx="100"
              cy="100"
              r="54"
              fill="none"
              stroke={RED}
              strokeWidth="1.5"
            />
            <circle
              cx="100"
              cy="100"
              r="49"
              fill="none"
              stroke={GOLD}
              strokeWidth="0.8"
              strokeDasharray="2,6"
            />
            <g transform="translate(100,100)">
              {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(
                (r, i) => (
                  <g key={r} transform={`rotate(${r}) translate(0,-54)`}>
                    <use href="#woe-eye" className={`woe-lid-${(i % 3) + 1}`} />
                  </g>
                ),
              )}
            </g>
          </g>

          {/* Divine burning center */}
          <g className="woe-center">
            <polygon
              points="100,75 107,93 125,100 107,107 100,125 93,107 75,100 93,93"
              fill={RED}
              filter="url(#woe-glow)"
            />
            <polygon
              points="100,83 104,96 117,100 104,104 100,117 96,104 83,100 96,96"
              fill={GOLD}
            />
            <circle
              cx="100"
              cy="100"
              r="6"
              fill={WHITE}
              filter="url(#woe-glow)"
            />
            <circle cx="100" cy="100" r="2.5" fill={GOLD} />
          </g>
        </svg>
      </div>

      <style>{`
        .woe-host {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${VOID};
          background-image:
            radial-gradient(circle at center, #1b0f1a 0%, ${VOID} 75%),
            radial-gradient(circle at 50% 120%, rgba(220,38,38,0.08) 0%, transparent 50%);
          perspective: 1000px;
        }
        .woe-container {
          width: min(340px, 72vw);
          height: min(340px, 72vw);
          max-width: 380px;
          max-height: 380px;
          transform-style: preserve-3d;
        }
        .woe-container svg { transform-style: preserve-3d; }

        .woe-outer  { transform-origin: 100px 100px; animation: woe-spin-outer 18s linear infinite; }
        .woe-inner  { transform-origin: 100px 100px; animation: woe-spin-inner 12s linear infinite; }
        .woe-center { transform-origin: 100px 100px; animation: woe-divine 3s ease-in-out infinite alternate; }

        /* Eyelid blink — three staggered groups */
        .woe-lid, use.woe-lid-1 ~ g .woe-lid,
        use.woe-lid-1 .woe-lid { animation: woe-blink 5s ease-in-out infinite; }
        use.woe-lid-2 .woe-lid { animation: woe-blink 5s ease-in-out infinite; animation-delay: 1.5s; }
        use.woe-lid-3 .woe-lid { animation: woe-blink 5s ease-in-out infinite; animation-delay: 3.1s; }

        /* Blink on all eyes via parent class */
        .woe-lid-1 .woe-lid { animation: woe-blink 5s ease-in-out 1.2s infinite; }
        .woe-lid-2 .woe-lid { animation: woe-blink 5s ease-in-out 2.7s infinite; }
        .woe-lid-3 .woe-lid { animation: woe-blink 5s ease-in-out 3.9s infinite; }

        @keyframes woe-spin-outer {
          0%   { transform: rotateX(35deg) rotateY(15deg) rotateZ(0deg); }
          100% { transform: rotateX(35deg) rotateY(15deg) rotateZ(360deg); }
        }
        @keyframes woe-spin-inner {
          0%   { transform: rotateX(-35deg) rotateY(75deg) rotateZ(360deg); }
          100% { transform: rotateX(-35deg) rotateY(75deg) rotateZ(0deg); }
        }
        @keyframes woe-divine {
          0%   { transform: scale(0.9) rotate(0deg);  opacity: 0.8; }
          100% { transform: scale(1.1) rotate(45deg); opacity: 1; }
        }
        @keyframes woe-blink {
          0%, 90%, 94%, 100% { transform: scaleY(1); }
          92%, 96%            { transform: scaleY(0.1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .woe-outer, .woe-inner, .woe-center, .woe-lid { animation: none; transform: none; }
          .woe-container { animation: woe-fade 3s ease-in-out infinite; }
          @keyframes woe-fade { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        }
      `}</style>
    </div>
  );
}
