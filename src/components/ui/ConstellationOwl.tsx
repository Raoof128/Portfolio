"use client";

const BG      = "#07030e";
const MAGENTA = "#d946ef";
const LIME    = "#39ff14";
const FAINT   = "rgba(57,255,20,0.1)";
const STAR    = "#ffffff";

export function ConstellationOwl() {
  return (
    <div className="owl-host" aria-hidden="true">
      <div className="owl-container">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="owl-glow-m" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="owl-glow-l" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Blueprint grid */}
          <g stroke={FAINT} strokeWidth="0.5" fill="none">
            <circle cx="100" cy="105" r="90" strokeDasharray="3,3" />
            <circle cx="100" cy="105" r="70" />
            <line x1="100" y1="10" x2="100" y2="200" strokeDasharray="4,4" />
            <line x1="10" y1="105" x2="190" y2="105" strokeDasharray="4,4" />
          </g>

          {/* Swinging tail */}
          <g className="owl-tail">
            <line x1="100" y1="140" x2="85"  y2="175" stroke={LIME}    strokeWidth="1" />
            <line x1="100" y1="140" x2="100" y2="182" stroke={MAGENTA} strokeWidth="1.2" />
            <line x1="100" y1="140" x2="115" y2="175" stroke={LIME}    strokeWidth="1" />
            <line x1="85"  y1="175" x2="100" y2="182" stroke={FAINT}   strokeWidth="0.8" />
            <line x1="115" y1="175" x2="100" y2="182" stroke={FAINT}   strokeWidth="0.8" />
            <circle cx="85"  cy="175" r="2.5" fill={STAR} filter="url(#owl-glow-l)" />
            <circle cx="115" cy="175" r="2.5" fill={STAR} filter="url(#owl-glow-l)" />
            <circle cx="100" cy="182" r="3.5" fill={STAR} filter="url(#owl-glow-m)" />
          </g>

          {/* Left wing */}
          <g className="owl-wing-l" stroke={LIME} strokeWidth="1" fill="none">
            <path d="M 65,95 L 30,110 L 15,135 L 45,130 L 65,110 Z" />
            <line x1="65" y1="95"  x2="15" y2="135" stroke={FAINT} />
            <line x1="30" y1="110" x2="45" y2="130" stroke={FAINT} />
            <circle cx="30" cy="110" r="2" fill={STAR} filter="url(#owl-glow-l)" />
            <circle cx="15" cy="135" r="3" fill={STAR} filter="url(#owl-glow-l)" />
            <circle cx="45" cy="130" r="2" fill={STAR} />
          </g>

          {/* Right wing */}
          <g className="owl-wing-r" stroke={LIME} strokeWidth="1" fill="none">
            <path d="M 135,95 L 170,110 L 185,135 L 155,130 L 135,110 Z" />
            <line x1="135" y1="95"  x2="185" y2="135" stroke={FAINT} />
            <line x1="170" y1="110" x2="155" y2="130" stroke={FAINT} />
            <circle cx="170" cy="110" r="2" fill={STAR} filter="url(#owl-glow-l)" />
            <circle cx="185" cy="135" r="3" fill={STAR} filter="url(#owl-glow-l)" />
            <circle cx="155" cy="130" r="2" fill={STAR} />
          </g>

          {/* Static body chassis */}
          <g stroke={MAGENTA} strokeWidth="1" fill="none">
            <path d="M 100,45 L 75,50 L 60,80 L 62,110 L 100,142 L 138,110 L 140,80 L 125,50 Z" />
            <line x1="100" y1="45"  x2="100" y2="80"  strokeDasharray="2,2" />
            <line x1="75"  y1="50"  x2="100" y2="80" />
            <line x1="125" y1="50"  x2="100" y2="80" />
            <line x1="60"  y1="80"  x2="100" y2="80"  stroke={FAINT} />
            <line x1="140" y1="80"  x2="100" y2="80"  stroke={FAINT} strokeWidth="0.8" />
            <line x1="62"  y1="110" x2="100" y2="142" stroke={FAINT} />
            <line x1="138" y1="110" x2="100" y2="142" stroke={FAINT} />
            <circle cx="100" cy="45"  r="2" fill={STAR} />
            <circle cx="75"  cy="50"  r="2" fill={STAR} />
            <circle cx="125" cy="50"  r="2" fill={STAR} />
            <circle cx="60"  cy="80"  r="2" fill={STAR} />
            <circle cx="140" cy="80"  r="2" fill={STAR} />
            <circle cx="100" cy="142" r="3" fill={STAR} filter="url(#owl-glow-m)" />
          </g>

          {/* Ears */}
          <path d="M 72,48 L 50,32 L 62,55"  fill="none" stroke={MAGENTA} strokeWidth="1" />
          <path d="M 128,48 L 150,32 L 138,55" fill="none" stroke={MAGENTA} strokeWidth="1" />
          <circle cx="50"  cy="32" r="2.5" fill={STAR} filter="url(#owl-glow-m)" />
          <circle cx="150" cy="32" r="2.5" fill={STAR} filter="url(#owl-glow-m)" />

          {/* Beak */}
          <polygon points="100,74 103,66 97,66" fill={MAGENTA} />

          {/* Chest chart ring 1 — CW */}
          <g className="owl-ring1" stroke={LIME} strokeWidth="1" fill="none">
            <circle cx="100" cy="120" r="16" strokeDasharray="4,2" />
            <line x1="100" y1="104" x2="100" y2="136" stroke={FAINT} />
            <line x1="84"  y1="120" x2="116" y2="120" stroke={FAINT} />
          </g>

          {/* Chest chart ring 2 — CCW */}
          <g className="owl-ring2" stroke={MAGENTA} strokeWidth="0.8" fill="none">
            <circle cx="100" cy="120" r="10" />
            <polygon points="100,111 108,124 92,124" stroke={MAGENTA} strokeWidth="0.8" />
            <circle cx="100" cy="120" r="2.5" fill={STAR} filter="url(#owl-glow-m)" />
          </g>

          {/* Left eye */}
          <g className="owl-eye" style={{ transformOrigin: "82px 68px" }}>
            <circle cx="82" cy="68" r="9" fill="none" stroke={LIME} strokeWidth="0.8" />
            <circle cx="82" cy="68" r="6" fill="rgba(57,255,20,0.2)" filter="url(#owl-glow-l)" />
            <circle cx="82" cy="68" r="2" fill={STAR} />
          </g>

          {/* Right eye */}
          <g className="owl-eye" style={{ transformOrigin: "118px 68px" }}>
            <circle cx="118" cy="68" r="9" fill="none" stroke={LIME} strokeWidth="0.8" />
            <circle cx="118" cy="68" r="6" fill="rgba(57,255,20,0.2)" filter="url(#owl-glow-l)" />
            <circle cx="118" cy="68" r="2" fill={STAR} />
          </g>
        </svg>
      </div>

      <style>{`
        .owl-host {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${BG};
          background-image:
            radial-gradient(circle at 20% 30%, rgba(57,255,20,0.06) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(217,70,239,0.06) 0%, transparent 40%);
        }
        .owl-container {
          width: min(320px, 70vw);
          height: min(320px, 70vw);
          max-width: 360px;
          max-height: 360px;
        }
        .owl-tail   { transform-origin: 100px 145px; animation: owl-swing 4s ease-in-out infinite alternate; }
        .owl-wing-l { transform-origin:  65px  95px; animation: owl-flap-l 5s ease-in-out infinite alternate; }
        .owl-wing-r { transform-origin: 135px  95px; animation: owl-flap-r 5s ease-in-out infinite alternate; }
        .owl-ring1  { transform-origin: 100px 120px; animation: owl-cw  20s linear infinite; }
        .owl-ring2  { transform-origin: 100px 120px; animation: owl-ccw 12s linear infinite; }
        .owl-eye    { animation: owl-pulse 3s ease-in-out infinite alternate; }

        @keyframes owl-swing  { 0% { transform: rotate(-10deg); } 100% { transform: rotate(10deg); } }
        @keyframes owl-flap-l { 0% { transform: rotate(-8deg) scaleX(0.95); } 100% { transform: rotate(5deg)  scaleX(1.05); } }
        @keyframes owl-flap-r { 0% { transform: rotate(8deg)  scaleX(0.95); } 100% { transform: rotate(-5deg) scaleX(1.05); } }
        @keyframes owl-cw     { from { transform: rotate(0deg); }    to { transform: rotate(360deg); } }
        @keyframes owl-ccw    { from { transform: rotate(0deg); }    to { transform: rotate(-360deg); } }
        @keyframes owl-pulse  { 0% { opacity: 0.5; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1.1); } }

        @media (prefers-reduced-motion: reduce) {
          .owl-tail, .owl-wing-l, .owl-wing-r, .owl-ring1, .owl-ring2, .owl-eye { animation: none; }
          .owl-container { animation: owl-fade 2.5s ease-in-out infinite; }
          @keyframes owl-fade { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        }
      `}</style>
    </div>
  );
}
