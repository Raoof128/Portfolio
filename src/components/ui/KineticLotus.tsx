"use client";

export function KineticLotus() {
  return (
    <div className="kl-host" aria-hidden="true">
      <div className="kl-container">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path
              id="kl-gold-leaf"
              d="M 100,100 Q 120,55 116,20 C 112,5 88,5 84,20 Q 80,55 100,100 Z"
              fill="#d6b265"
              stroke="#1a1000"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              id="kl-cream-leaf"
              d="M 100,100 Q 112,62 108,32 C 105,20 95,20 92,32 Q 88,62 100,100 Z"
              fill="#fffdf5"
              stroke="#1a1000"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </defs>

          {/* Gold petal layer — clockwise */}
          <g className="kl-gold origin-center">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
              (r) => (
                <use
                  key={r}
                  href="#kl-gold-leaf"
                  transform={`rotate(${r} 100 100)`}
                />
              ),
            )}
          </g>

          {/* Cream petal layer — counter-clockwise, offset 15° */}
          <g className="kl-cream origin-center">
            {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map(
              (r) => (
                <use
                  key={r}
                  href="#kl-cream-leaf"
                  transform={`rotate(${r} 100 100)`}
                />
              ),
            )}
          </g>

          {/* Core */}
          <circle
            className="kl-core origin-center"
            cx="100"
            cy="100"
            r="16"
            fill="#505663"
            stroke="#1a1000"
            strokeWidth="3.5"
          />
        </svg>
      </div>

      <style>{`
        .kl-host {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #080600;
        }
        .kl-container {
          width: min(280px, 70vw);
          height: min(280px, 70vw);
          max-width: 320px;
          max-height: 320px;
        }
        .origin-center {
          transform-origin: 100px 100px;
        }
        .kl-gold {
          animation:
            kl-cw 12s linear infinite,
            kl-breathe-gold 4s ease-in-out infinite;
        }
        .kl-cream {
          animation:
            kl-ccw 9s linear infinite,
            kl-breathe-cream 4s ease-in-out infinite;
        }
        .kl-core {
          animation: kl-pulse 2s ease-in-out infinite alternate;
        }
        @keyframes kl-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes kl-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes kl-breathe-gold {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.1); }
        }
        @keyframes kl-breathe-cream {
          0%, 100% { transform: scale(1.1); }
          50%      { transform: scale(0.88); }
        }
        @keyframes kl-pulse {
          0%   { transform: scale(0.9); }
          100% { transform: scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .kl-gold, .kl-cream, .kl-core { animation: none; }
          .kl-container { animation: kl-fade 2s ease-in-out infinite; }
          @keyframes kl-fade {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0.5; }
          }
        }
      `}</style>
    </div>
  );
}
