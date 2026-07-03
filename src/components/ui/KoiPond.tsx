"use client";

const CRIMSON = "#d14c3d";
const OCHRE = "#df9f43";
const INK = "#242220";
const WATER = "#56aed7";

export function KoiPond() {
  return (
    <div className="koi-host" aria-hidden="true">
      <div className="koi-container">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(0 10px 25px rgba(36,34,32,0.12))" }}
        >
          <defs>
            <filter id="koi-sumi" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.05"
                numOctaves="4"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="2.8"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          {/* Ripples */}
          <g stroke={WATER} strokeWidth="1.2" fill="none" opacity="0.7">
            <circle cx="100" cy="100" r="60" className="koi-ripple koi-r1" />
            <circle cx="100" cy="100" r="60" className="koi-ripple koi-r2" />
          </g>

          {/* Subtle guide rings */}
          <g stroke="rgba(36,34,32,0.02)" strokeWidth="1" fill="none">
            <circle cx="100" cy="100" r="74" />
            <circle cx="100" cy="100" r="56" strokeDasharray="6,4" />
          </g>

          {/* ── Koi 1: Crimson ── */}
          <g className="koi-orbit">
            <g transform="translate(100,100) translate(0,-56)">
              <g style={{ filter: "url(#koi-sumi)" }}>
                <path
                  className="koi-fin-l"
                  d="M 15,-8 Q 10,-24 -5,-25 Q 5,-12 15,-8 Z"
                  fill={CRIMSON}
                  opacity="0.65"
                  stroke={INK}
                  strokeWidth="0.8"
                />
                <path
                  className="koi-fin-r"
                  d="M 15,8 Q 10,24 -5,25 Q 5,12 15,8 Z"
                  fill={CRIMSON}
                  opacity="0.65"
                  stroke={INK}
                  strokeWidth="0.8"
                />
                <path
                  d="M 28,0 C 26,-7 14,-11 0,-11 C -4,-11 -8,-6 -10,0 C -8,6 -4,11 0,11 C 14,11 26,7 28,0 Z"
                  fill={CRIMSON}
                  stroke={INK}
                  strokeWidth="1.5"
                />
                <path
                  d="M 14,-6 Q 8,-4 6,-7"
                  fill="none"
                  stroke={INK}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 16,5 Q 10,3 8,6"
                  fill="none"
                  stroke={INK}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  className="koi-barbel"
                  d="M 28,-1 Q 38,-4 42,-1"
                  fill="none"
                  stroke={INK}
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  className="koi-barbel"
                  d="M 28,1 Q 38,4 42,1"
                  fill="none"
                  stroke={INK}
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </g>
              <g className="koi-s1" style={{ filter: "url(#koi-sumi)" }}>
                <path
                  d="M 0,-11 C -3,-11 -10,-8 -14,-7 C -10,0 -10,0 -14,7 C -10,8 -3,11 0,11 Z"
                  fill={CRIMSON}
                  stroke={INK}
                  strokeWidth="1.5"
                />
                <path d="M -4,-8 Q -8,-1 -11,-4 Z" fill={INK} opacity="0.9" />
                <g className="koi-s2">
                  <path
                    d="M -14,-7 C -16,-6 -22,-4 -26,-3 C -24,0 -24,0 -26,3 C -22,4 -16,6 -14,7 Z"
                    fill={CRIMSON}
                    stroke={INK}
                    strokeWidth="1.5"
                  />
                  <path d="M -16,4 Q -20,1 -22,3 Z" fill={INK} opacity="0.95" />
                  <g className="koi-s3">
                    <path
                      d="M -26,-3 C -28,-2 -32,-1 -35,-0.5 C -34,0 -34,0 -35,0.5 C -32,1 -28,2 -26,3 Z"
                      fill={CRIMSON}
                      stroke={INK}
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                    <g className="koi-tail">
                      <path
                        d="M -35,0 Q -45,-12 -62,-16 Q -50,0 -66,0 Q -50,0 -62,16 Q -45,12 -35,0 Z"
                        fill={CRIMSON}
                        opacity="0.45"
                        stroke={INK}
                        strokeWidth="0.8"
                      />
                      <path
                        d="M -35,0 Q -42,-7 -54,-8 Q -45,0 -58,0 Q -45,0 -54,8 Q -42,7 -35,0 Z"
                        fill={INK}
                        opacity="0.8"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>

          {/* ── Koi 2: Ochre (180° offset) ── */}
          <g className="koi-orbit" transform="rotate(180 100 100)">
            <g
              transform="translate(100,100) translate(0,-56)"
              className="koi-fish2"
            >
              <g style={{ filter: "url(#koi-sumi)" }}>
                <path
                  className="koi-fin-l"
                  d="M 15,-8 Q 10,-24 -5,-25 Q 5,-12 15,-8 Z"
                  fill={OCHRE}
                  opacity="0.65"
                  stroke={INK}
                  strokeWidth="0.8"
                />
                <path
                  className="koi-fin-r"
                  d="M 15,8 Q 10,24 -5,25 Q 5,12 15,8 Z"
                  fill={OCHRE}
                  opacity="0.65"
                  stroke={INK}
                  strokeWidth="0.8"
                />
                <path
                  d="M 28,0 C 26,-7 14,-11 0,-11 C -4,-11 -8,-6 -10,0 C -8,6 -4,11 0,11 C 14,11 26,7 28,0 Z"
                  fill={OCHRE}
                  stroke={INK}
                  strokeWidth="1.5"
                />
                <path
                  d="M 14,-6 Q 8,-4 6,-7"
                  fill="none"
                  stroke={INK}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 16,5 Q 10,3 8,6"
                  fill="none"
                  stroke={INK}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  className="koi-barbel"
                  d="M 28,-1 Q 38,-4 42,-1"
                  fill="none"
                  stroke={INK}
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  className="koi-barbel"
                  d="M 28,1 Q 38,4 42,1"
                  fill="none"
                  stroke={INK}
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </g>
              <g className="koi-s1" style={{ filter: "url(#koi-sumi)" }}>
                <path
                  d="M 0,-11 C -3,-11 -10,-8 -14,-7 C -10,0 -10,0 -14,7 C -10,8 -3,11 0,11 Z"
                  fill={OCHRE}
                  stroke={INK}
                  strokeWidth="1.5"
                />
                <path d="M -3,-5 Q -6,3 -10,1 Z" fill={INK} opacity="0.9" />
                <g className="koi-s2">
                  <path
                    d="M -14,-7 C -16,-6 -22,-4 -26,-3 C -24,0 -24,0 -26,3 C -22,4 -16,6 -14,7 Z"
                    fill={OCHRE}
                    stroke={INK}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M -18,-4 Q -22,-1 -24,-3 Z"
                    fill={INK}
                    opacity="0.95"
                  />
                  <g className="koi-s3">
                    <path
                      d="M -26,-3 C -28,-2 -32,-1 -35,-0.5 C -34,0 -34,0 -35,0.5 C -32,1 -28,2 -26,3 Z"
                      fill={OCHRE}
                      stroke={INK}
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                    <g className="koi-tail">
                      <path
                        d="M -35,0 Q -45,-12 -62,-16 Q -50,0 -66,0 Q -50,0 -62,16 Q -45,12 -35,0 Z"
                        fill={OCHRE}
                        opacity="0.45"
                        stroke={INK}
                        strokeWidth="0.8"
                      />
                      <path
                        d="M -35,0 Q -42,-7 -54,-8 Q -45,0 -58,0 Q -45,0 -54,8 Q -42,7 -35,0 Z"
                        fill={INK}
                        opacity="0.8"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      <style>{`
        .koi-host {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f7fa;
          background-image:
            radial-gradient(circle at center, #f0f7fa 20%, #cbe3f0 100%),
            radial-gradient(circle at 30% 20%, rgba(86,174,215,0.45) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(223,159,67,0.06) 0%, transparent 50%);
        }
        .koi-container {
          width: min(340px, 80vw);
          height: min(340px, 80vw);
          max-width: 380px;
          max-height: 380px;
        }
        /* orbit */
        .koi-orbit { transform-origin: 100px 100px; animation: koi-swim 14s linear infinite; }
        /* spine chain */
        .koi-s1    { transform-origin:   0px 0px;   animation: koi-sway1 2.4s ease-in-out infinite alternate; }
        .koi-s2    { transform-origin: -14px 0px;   animation: koi-sway2 2.4s ease-in-out infinite alternate; animation-delay: -0.4s; }
        .koi-s3    { transform-origin: -14px 0px;   animation: koi-sway3 2.4s ease-in-out infinite alternate; animation-delay: -0.8s; }
        .koi-tail  { transform-origin: -12px 0px;   animation: koi-tail  2.4s ease-in-out infinite alternate; animation-delay: -1.2s; }
        /* fins */
        .koi-fin-l { transform-origin:  15px -8px;  animation: koi-fin 2.4s ease-in-out infinite alternate; }
        .koi-fin-r { transform-origin:  15px  8px;  animation: koi-fin 2.4s ease-in-out infinite alternate; animation-delay: -0.5s; }
        .koi-barbel{ transform-origin:  28px  0px;  animation: koi-whisker 1.6s ease-in-out infinite alternate; }
        /* ripples */
        .koi-ripple { transform-origin: 100px 100px; animation: koi-ripple 5s cubic-bezier(0.1,0.8,0.3,1) infinite; opacity: 0; }
        .koi-r1 { animation-delay: 0s; }
        .koi-r2 { animation-delay: 2.5s; }
        /* fish2 delay offsets */
        .koi-fish2 .koi-s1    { animation-delay: -0.8s; }
        .koi-fish2 .koi-s2    { animation-delay: -1.2s; }
        .koi-fish2 .koi-s3    { animation-delay: -1.6s; }
        .koi-fish2 .koi-tail  { animation-delay: -2.0s; }
        .koi-fish2 .koi-fin-l { animation-delay: -0.9s; }
        .koi-fish2 .koi-fin-r { animation-delay: -1.4s; }

        @keyframes koi-swim    { from { transform: rotate(0deg); }     to { transform: rotate(360deg); } }
        @keyframes koi-sway1   { 0% { transform: rotate(-7deg); }      100% { transform: rotate(7deg); } }
        @keyframes koi-sway2   { 0% { transform: rotate(-10deg); }     100% { transform: rotate(10deg); } }
        @keyframes koi-sway3   { 0% { transform: rotate(-14deg); }     100% { transform: rotate(14deg); } }
        @keyframes koi-tail    { 0% { transform: rotate(-18deg) skewX(-4deg); } 100% { transform: rotate(18deg) skewX(4deg); } }
        @keyframes koi-fin     { 0% { transform: rotate(-12deg) scaleY(0.9); }  100% { transform: rotate(15deg) scaleY(1.1); } }
        @keyframes koi-whisker { 0% { transform: rotate(-10deg); }     100% { transform: rotate(10deg); } }
        @keyframes koi-ripple  { 0% { transform: scale(0.4); opacity: 0; } 10% { opacity: 0.45; } 100% { transform: scale(1.3); opacity: 0; } }

        @media (prefers-reduced-motion: reduce) {
          .koi-orbit, .koi-s1, .koi-s2, .koi-s3, .koi-tail,
          .koi-fin-l, .koi-fin-r, .koi-barbel, .koi-ripple { animation: none; transform: none; }
          .koi-container { animation: koi-fade 2.5s ease-in-out infinite; }
          @keyframes koi-fade { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        }
      `}</style>
    </div>
  );
}
