"use client";

export function DandelionSpinner() {
  return (
    <div className="dandelion-host" aria-hidden="true">
      <div className="dandelion-bloom">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="dn-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <path id="dn-long" fill="none" stroke="#FFD1D1" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"
              filter="url(#dn-glow)"
              d="M 50,45 L 50,26 M 50,26 L 50,6 M 50,26 Q 46,20 38,15
                 M 50,26 Q 54,20 62,15 M 50,26 Q 48,18 44,10 M 50,26 Q 52,18 56,10" />

            <path id="dn-med" fill="none" stroke="#FF4D4D" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round"
              filter="url(#dn-glow)"
              d="M 50,45 L 50,30 M 50,30 L 50,15 M 50,30 Q 47,25 40,21
                 M 50,30 Q 53,25 60,21 M 50,30 Q 48,23 45,17 M 50,30 Q 52,23 55,17" />

            <path id="dn-short" fill="none" stroke="#B30000" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"
              filter="url(#dn-glow)"
              d="M 50,45 L 50,34 M 50,34 L 50,22 M 50,34 Q 47,30 42,26
                 M 50,34 Q 53,30 58,26 M 50,34 Q 48,28 46,23 M 50,34 Q 52,28 54,23" />
          </defs>

          <use href="#dn-long"  transform="rotate(0 50 50)" />
          <use href="#dn-med"   transform="rotate(30 50 50)" />
          <use href="#dn-short" transform="rotate(60 50 50)" />
          <use href="#dn-med"   transform="rotate(90 50 50)" />
          <use href="#dn-long"  transform="rotate(120 50 50)" />
          <use href="#dn-med"   transform="rotate(150 50 50)" />
          <use href="#dn-short" transform="rotate(180 50 50)" />
          <use href="#dn-med"   transform="rotate(210 50 50)" />
          <use href="#dn-long"  transform="rotate(240 50 50)" />
          <use href="#dn-med"   transform="rotate(270 50 50)" />
          <use href="#dn-short" transform="rotate(300 50 50)" />
          <use href="#dn-med"   transform="rotate(330 50 50)" />

          <circle cx="50" cy="50" r="3" fill="#B30000" filter="url(#dn-glow)" />
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
          animation:
            dn-spring 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
            dn-spin 4s linear infinite;
        }
        @keyframes dn-spring {
          0%   { transform: scale(0) rotate(-65deg); opacity: 0; }
          60%  { transform: scale(1.05) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes dn-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dandelion-bloom {
            animation: dn-fade 2s ease-in-out infinite;
          }
          @keyframes dn-fade {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0.6; }
          }
        }
      `}</style>
    </div>
  );
}
