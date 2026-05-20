"use client";

export function KineticAstrolabe() {
  return (
    <div className="ka-host" aria-hidden="true">
      <div className="ka-container">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path id="ka-tooth"
              d="M 94,15 L 106,15 L 103,27 L 97,27 Z"
              fill="#06b6d4" stroke="#05070a" strokeWidth="3.5" strokeLinejoin="round" />
            <path id="ka-crescent"
              d="M -5,-10 A 10 10 0 0 1 -5,10 A 7 7 0 0 0 -5,-10 Z"
              fill="#a5f3fc" stroke="#05070a" strokeWidth="3" strokeLinejoin="round" />
            <path id="ka-star"
              d="M 0,-7 L 1.8,-1.8 L 7,0 L 1.8,1.8 L 0,7 L -1.8,1.8 L -7,0 L -1.8,-1.8 Z"
              fill="#06b6d4" stroke="#05070a" strokeWidth="2.5" strokeLinejoin="round" />
            <path id="ka-ray"
              d="M 100,100 C 108,82 93,68 100,50 C 107,68 92,82 100,100 Z"
              fill="#06b6d4" stroke="#05070a" strokeWidth="3.5" strokeLinejoin="round" />
          </defs>

          {/* Outer gear — clockwise */}
          <g className="ka-gear origin-center">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#05070a" strokeWidth="4" />
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(r => (
              <use key={r} href="#ka-tooth" transform={`rotate(${r} 100 100)`} />
            ))}
            <circle cx="100" cy="100" r="72" fill="none" stroke="#05070a" strokeWidth="3.5" />
          </g>

          {/* Astral ring — counter-clockwise */}
          <g className="ka-astral origin-center">
            <circle cx="100" cy="100" r="54" fill="none" stroke="#05070a" strokeWidth="3.5" />
            <g transform="translate(100,100)">
              {[0,90,180,270].map(r => (
                <g key={r} transform={`rotate(${r}) translate(0,-54)`}>
                  <use href="#ka-crescent" transform={`rotate(${-r})`} />
                </g>
              ))}
              {[45,135,225,315].map(r => (
                <g key={r} transform={`rotate(${r}) translate(0,-54)`}>
                  <use href="#ka-star" />
                </g>
              ))}
            </g>
          </g>

          {/* Sun core — slow clockwise + breathe */}
          <g className="ka-sun origin-center">
            {[0,45,90,135,180,225,270,315].map(r => (
              <use key={r} href="#ka-ray" transform={`rotate(${r} 100 100)`} />
            ))}
            <circle cx="100" cy="100" r="23" fill="#a5f3fc" stroke="#05070a" strokeWidth="3.5" />
            <path d="M 91,98 Q 95,102 98,98" fill="none" stroke="#05070a" strokeWidth="3" strokeLinecap="round" />
            <path d="M 102,98 Q 105,102 109,98" fill="none" stroke="#05070a" strokeWidth="3" strokeLinecap="round" />
            <polygon points="100,81 103,87 100,93 97,87" fill="#4b5563" stroke="#05070a" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
        </svg>
      </div>

      <style>{`
        .ka-host {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0e12;
        }
        .ka-container {
          width: min(300px, 70vw);
          height: min(300px, 70vw);
          max-width: 340px;
          max-height: 340px;
        }
        .origin-center { transform-origin: 100px 100px; }
        .ka-gear   { animation: ka-cw 24s linear infinite; }
        .ka-astral { animation: ka-ccw 16s linear infinite; }
        .ka-sun    { animation: ka-cw 32s linear infinite, ka-breathe 5s ease-in-out infinite alternate; }
        @keyframes ka-cw  { from { transform: rotate(0deg); }    to { transform: rotate(360deg); } }
        @keyframes ka-ccw { from { transform: rotate(0deg); }    to { transform: rotate(-360deg); } }
        @keyframes ka-breathe {
          0%   { transform: scale(0.92); }
          100% { transform: scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ka-gear, .ka-astral, .ka-sun { animation: none; }
          .ka-container { animation: ka-fade 2s ease-in-out infinite; }
          @keyframes ka-fade { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        }
      `}</style>
    </div>
  );
}
