"use client";

const BG    = "#161115";
const PAGE  = "#ff6b9d";
const DECK  = "#cc1b5d";
const LINE  = "#0d0509";
const SPINE = "#5c4d56";

export function CelestialCatcher() {
  return (
    <div className="cc-host" aria-hidden="true">
      <div className="cc-container">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path id="cc-tooth"
              d="M 95,78 L 105,78 L 103,88 L 97,88 Z"
              fill={DECK} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
            <path id="cc-star"
              d="M 0,-6 L 1.5,-1.5 L 6,0 L 1.5,1.5 L 0,6 L -1.5,1.5 L -6,0 L -1.5,-1.5 Z"
              fill={PAGE} stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" />
          </defs>

          {/* Floating clouds */}
          <g className="cc-cloud-l" fill={BG} stroke={LINE} strokeWidth="3">
            <path d="M 25,120 C 15,120 10,130 15,138 C 10,145 18,155 28,152 C 35,155 45,150 43,140 C 48,132 40,120 25,120 Z" opacity="0.4" />
          </g>
          <g className="cc-cloud-r" fill={BG} stroke={LINE} strokeWidth="3">
            <path d="M 170,70 C 160,70 155,78 160,86 C 155,93 162,101 172,98 C 178,101 188,96 186,88 C 191,80 182,70 170,70 Z" opacity="0.4" />
          </g>

          {/* Pendulum */}
          <g className="cc-pendulum">
            <line x1="100" y1="60" x2="100" y2="155" stroke={LINE} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="100" cy="90" r="4" fill={PAGE} stroke={LINE} strokeWidth="2.5" />
            <g transform="translate(100,155)">
              <polygon points="0,-14 12,0 0,14 -12,0" fill={DECK} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
              <circle cx="0" cy="0" r="4" fill={PAGE} stroke={LINE} strokeWidth="2.5" />
            </g>
          </g>

          {/* Moon cradle */}
          <g className="cc-moon">
            <path d="M 140,40 C 90,40 60,75 60,120 C 60,165 90,200 140,200 C 105,180 90,150 90,120 C 90,90 105,60 140,40 Z"
              fill={PAGE} stroke={LINE} strokeWidth="3.5" strokeLinejoin="round" />
            <circle cx="88" cy="72"  r="3.5" fill={SPINE} stroke={LINE} strokeWidth="2.5" />
            <circle cx="88" cy="168" r="3.5" fill={SPINE} stroke={LINE} strokeWidth="2.5" />

            {/* Secondary gear */}
            <g className="cc-gear-s">
              <circle cx="132" cy="115" r="12" fill="none" stroke={LINE} strokeWidth="3" />
              <circle cx="132" cy="115" r="4"  fill={SPINE} stroke={LINE} strokeWidth="2.5" />
              <line x1="132" y1="100" x2="132" y2="130" stroke={LINE} strokeWidth="2.5" />
              <line x1="117" y1="115" x2="147" y2="115" stroke={LINE} strokeWidth="2.5" />
            </g>

            {/* Primary gear */}
            <g className="cc-gear-p">
              <circle cx="100" cy="105" r="22" fill="none" stroke={LINE} strokeWidth="3.5" />
              <circle cx="100" cy="105" r="14" fill={BG}   stroke={LINE} strokeWidth="3" />
              {[0,45,90,135,180,225,270,315].map(r => (
                <use key={r} href="#cc-tooth" transform={`rotate(${r} 100 105)`} />
              ))}
              <line x1="100" y1="91" x2="100" y2="119" stroke={LINE} strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Floating stars */}
            <g transform="translate(100,105)">
              <g transform="rotate(30) translate(0,-50)"><use href="#cc-star" /></g>
              <g transform="rotate(150) translate(0,-50)"><use href="#cc-star" transform="scale(0.8)" /></g>
            </g>
          </g>

          {/* Fixed suspension */}
          <circle cx="100" cy="53" r="10" fill="none" stroke={LINE} strokeWidth="3.5" />
          <rect x="96" y="32" width="8" height="15" rx="3" fill={SPINE} stroke={LINE} strokeWidth="3" />
        </svg>
      </div>

      <style>{`
        .cc-host {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${BG};
        }
        .cc-container {
          width: min(300px, 70vw);
          height: min(300px, 70vw);
          max-width: 340px;
          max-height: 340px;
        }
        .cc-moon      { transform-origin: 100px 105px; animation: cc-sway   6s  ease-in-out infinite alternate; }
        .cc-pendulum  { transform-origin: 100px  60px; animation: cc-swing  3s  ease-in-out infinite alternate; }
        .cc-gear-p    { transform-origin: 100px 105px; animation: cc-cw     15s linear    infinite; }
        .cc-gear-s    { transform-origin: 132px 115px; animation: cc-ccw    10s linear    infinite; }
        .cc-cloud-l   { animation: cc-drift-l 5s ease-in-out infinite alternate; }
        .cc-cloud-r   { animation: cc-drift-r 6s ease-in-out infinite alternate; }

        @keyframes cc-sway    { 0% { transform: rotate(-8deg); }  100% { transform: rotate(8deg); } }
        @keyframes cc-swing   { 0% { transform: rotate(-18deg); } 100% { transform: rotate(18deg); } }
        @keyframes cc-cw      { from { transform: rotate(0deg); }  to { transform: rotate(360deg); } }
        @keyframes cc-ccw     { from { transform: rotate(0deg); }  to { transform: rotate(-360deg); } }
        @keyframes cc-drift-l { 0% { transform: translate(-3px,2px); }  100% { transform: translate(3px,-2px); } }
        @keyframes cc-drift-r { 0% { transform: translate(3px,-1px); }  100% { transform: translate(-3px,1px); } }

        @media (prefers-reduced-motion: reduce) {
          .cc-moon, .cc-pendulum, .cc-gear-p, .cc-gear-s, .cc-cloud-l, .cc-cloud-r { animation: none; }
          .cc-container { animation: cc-fade 2.5s ease-in-out infinite; }
          @keyframes cc-fade { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        }
      `}</style>
    </div>
  );
}
