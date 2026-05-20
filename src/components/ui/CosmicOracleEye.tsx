"use client";

const BG    = "#11150c";
const PAGE  = "#b2d270";
const DECK  = "#6b8e23";
const LINE  = "#080a05";
const SPINE = "#485f18";

export function CosmicOracleEye() {
  return (
    <div className="coe-host" aria-hidden="true">
      <div className="coe-container">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path id="coe-lash"
              d="M 100,95 Q 112,65 107,35 Q 97,55 100,95 Z"
              fill={DECK} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
            <path id="coe-tooth"
              d="M 96,62 L 104,62 L 102,70 L 98,70 Z"
              fill={SPINE} stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" />
            <path id="coe-star"
              d="M 0,-8 L 2,-2 L 8,0 L 2,2 L 0,8 L -2,2 L -8,0 L -2,-2 Z"
              fill={PAGE} stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" />
          </defs>

          {/* Pendulum */}
          <g className="coe-pendulum">
            <line x1="100" y1="130" x2="100" y2="175" stroke={LINE} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="100" cy="142" r="4.5" fill={DECK} stroke={LINE} strokeWidth="2.5" />
            <g transform="translate(100,175)">
              <path d="M 0,-15 C 10,-5 12,5 0,18 C -12,5 -10,-5 0,-15 Z"
                fill={PAGE} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
              <circle cx="0" cy="2" r="3.5" fill={DECK} stroke={LINE} strokeWidth="2" />
            </g>
          </g>

          {/* Lashes sunburst */}
          <g className="coe-lashes">
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(r => (
              <use key={r} href="#coe-lash" transform={`rotate(${r} 100 95)`} />
            ))}
          </g>

          {/* Static eye casing */}
          <path d="M 35,95 Q 100,38 165,95 Q 100,152 35,95 Z"
            fill={PAGE} stroke={LINE} strokeWidth="4" strokeLinejoin="round" />
          <path d="M 35,95 L 45,95" stroke={LINE} strokeWidth="3" strokeLinecap="round" />
          <path d="M 165,95 L 155,95" stroke={LINE} strokeWidth="3" strokeLinecap="round" />

          {/* Iris gear */}
          <g className="coe-iris">
            <circle cx="100" cy="95" r="26" fill={BG} stroke={LINE} strokeWidth="3.5" />
            {[0,45,90,135,180,225,270,315].map(r => (
              <use key={r} href="#coe-tooth" transform={`rotate(${r} 100 95)`} />
            ))}
          </g>

          {/* Pupil */}
          <g className="coe-pupil">
            <circle cx="100" cy="95" r="14" fill={DECK} stroke={LINE} strokeWidth="3" />
            <use href="#coe-star" transform="translate(100,95)" />
          </g>

          {/* Tear accent dots */}
          <circle cx="60"  cy="132" r="3" fill={SPINE} stroke={LINE} strokeWidth="2" />
          <circle cx="140" cy="132" r="3" fill={SPINE} stroke={LINE} strokeWidth="2" />
        </svg>
      </div>

      <style>{`
        .coe-host {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${BG};
        }
        .coe-container {
          width: min(300px, 70vw);
          height: min(300px, 70vw);
          max-width: 340px;
          max-height: 340px;
        }
        .coe-lashes  { transform-origin: 100px 95px;  animation: coe-cw  25s linear     infinite; }
        .coe-iris    { transform-origin: 100px 95px;  animation: coe-ccw 12s linear     infinite; }
        .coe-pupil   { transform-origin: 100px 95px;  animation: coe-cw  8s  linear     infinite,
                                                                  coe-breathe 3s ease-in-out infinite alternate; }
        .coe-pendulum { transform-origin: 100px 130px; animation: coe-swing 3s ease-in-out infinite alternate; }

        @keyframes coe-cw      { from { transform: rotate(0deg); }    to { transform: rotate(360deg); } }
        @keyframes coe-ccw     { from { transform: rotate(0deg); }    to { transform: rotate(-360deg); } }
        @keyframes coe-breathe { 0% { transform: scale(0.85); }       100% { transform: scale(1.15); } }
        @keyframes coe-swing   { 0% { transform: rotate(-16deg); }    100% { transform: rotate(16deg); } }

        @media (prefers-reduced-motion: reduce) {
          .coe-lashes, .coe-iris, .coe-pupil, .coe-pendulum { animation: none; }
          .coe-container { animation: coe-fade 2.5s ease-in-out infinite; }
          @keyframes coe-fade { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        }
      `}</style>
    </div>
  );
}
