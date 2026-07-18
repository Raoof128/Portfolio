"use client";

/**
 * Divan — Open Day hero visual: an animated blue-morpho butterfly.
 * Appearance and colours are modelled on the reference blue-butterfly vector
 * (cerulean → cobalt wings, bold black outline, cream marginal spots, amber
 * dots, salmon lower-wing ovals, radial veins, segmented body, antennae).
 * The right wing is authored once (#bf-wing) and mirrored for the left, so both
 * sides flap in perfect symmetry. Pure SVG + CSS; honours reduced-motion.
 */
export function BlueButterfly() {
  return (
    <div className="bf-host" aria-hidden="true">
      <div className="bf-float">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bf-upper" cx="64%" cy="46%" r="72%">
              <stop offset="0%" stopColor="#49b8f5" />
              <stop offset="42%" stopColor="#2a93e0" />
              <stop offset="76%" stopColor="#175bad" />
              <stop offset="100%" stopColor="#0e2f66" />
            </radialGradient>
            <radialGradient id="bf-lower" cx="56%" cy="32%" r="82%">
              <stop offset="0%" stopColor="#39a8ea" />
              <stop offset="52%" stopColor="#1c69bd" />
              <stop offset="100%" stopColor="#0c2a5c" />
            </radialGradient>

            <g id="bf-wing">
              {/* upper wing */}
              <path
                d="M 99,64 C 103,38 118,20 145,19 C 169,18 190,31 189,58 C 189,81 168,97 146,98 C 124,99 106,92 99,84 Z"
                fill="url(#bf-upper)"
                stroke="#0a0a0a"
                strokeWidth="3.4"
                strokeLinejoin="round"
              />
              {/* lower wing */}
              <path
                d="M 99,90 C 118,95 145,103 163,124 C 176,139 174,158 154,160 C 132,162 111,147 103,124 C 100,116 99,104 99,90 Z"
                fill="url(#bf-lower)"
                stroke="#0a0a0a"
                strokeWidth="3.4"
                strokeLinejoin="round"
              />
              {/* veins — upper */}
              <g
                stroke="#0b2447"
                strokeWidth="1.3"
                fill="none"
                opacity="0.55"
                strokeLinecap="round"
              >
                <path d="M 101,80 Q 130,58 178,58" />
                <path d="M 101,78 Q 128,50 160,30" />
                <path d="M 101,82 Q 140,72 186,72" />
                <path d="M 101,84 Q 135,84 182,86" />
              </g>
              {/* veins — lower */}
              <g
                stroke="#0b2447"
                strokeWidth="1.3"
                fill="none"
                opacity="0.5"
                strokeLinecap="round"
              >
                <path d="M 102,98 Q 130,108 158,132" />
                <path d="M 102,104 Q 128,120 150,150" />
                <path d="M 102,110 Q 120,128 132,150" />
              </g>
              {/* cream marginal spots (upper outer edge) */}
              <g fill="#f3ecd6" stroke="#0a0a0a" strokeWidth="0.8">
                <ellipse
                  cx="150"
                  cy="26"
                  rx="4"
                  ry="3.4"
                  transform="rotate(-24 150 26)"
                />
                <ellipse
                  cx="165"
                  cy="31"
                  rx="3.6"
                  ry="3"
                  transform="rotate(-12 165 31)"
                />
                <ellipse
                  cx="177"
                  cy="41"
                  rx="3.2"
                  ry="2.8"
                  transform="rotate(6 177 41)"
                />
                <ellipse
                  cx="184"
                  cy="55"
                  rx="2.8"
                  ry="2.6"
                  transform="rotate(20 184 55)"
                />
              </g>
              {/* amber dots */}
              <g fill="#e3a544">
                <circle cx="139" cy="30" r="2.6" />
                <circle cx="182" cy="70" r="2.3" />
              </g>
              {/* salmon ovals (lower wing tips) */}
              <g fill="#f2a9ba" stroke="#0a0a0a" strokeWidth="0.7">
                <ellipse
                  cx="120"
                  cy="149"
                  rx="3"
                  ry="5"
                  transform="rotate(28 120 149)"
                />
                <ellipse
                  cx="134"
                  cy="152"
                  rx="3"
                  ry="5"
                  transform="rotate(14 134 152)"
                />
                <ellipse
                  cx="147"
                  cy="149"
                  rx="2.6"
                  ry="4.4"
                  transform="rotate(2 147 149)"
                />
              </g>
            </g>
          </defs>

          {/* wings — right authored, left mirrored; both flap in sync */}
          <g className="bf-flap-r">
            <use href="#bf-wing" />
          </g>
          <g className="bf-flap-l">
            <use href="#bf-wing" transform="matrix(-1,0,0,1,200,0)" />
          </g>

          {/* body */}
          <g>
            {/* antennae */}
            <g
              stroke="#0a0a0a"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            >
              <path d="M 98,70 C 92,56 88,48 84,42" />
              <path d="M 102,70 C 108,56 112,48 116,42" />
            </g>
            <circle cx="84" cy="41" r="2" fill="#0a0a0a" />
            <circle cx="116" cy="41" r="2" fill="#0a0a0a" />
            {/* head */}
            <circle
              cx="100"
              cy="72"
              r="5.2"
              fill="#0c1830"
              stroke="#0a0a0a"
              strokeWidth="1.5"
            />
            {/* thorax + abdomen */}
            <path
              d="M 100,78 C 106,80 107,92 105,108 C 104,122 102,136 100,142 C 98,136 96,122 95,108 C 93,92 94,80 100,78 Z"
              fill="#0b1428"
              stroke="#0a0a0a"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* thorax sheen */}
            <ellipse
              cx="100"
              cy="88"
              rx="2.6"
              ry="6"
              fill="#2f9fdf"
              opacity="0.55"
            />
            {/* abdomen segments */}
            <g stroke="#0a0a0a" strokeWidth="0.9" opacity="0.7">
              <path d="M 96,112 H 104" />
              <path d="M 96,120 H 104" />
              <path d="M 97,128 H 103" />
              <path d="M 98,135 H 102" />
            </g>
          </g>
        </svg>
      </div>

      <style>{`
        .bf-host {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0b1026;
        }
        .bf-float {
          width: min(360px, 82vw);
          height: min(360px, 82vw);
          max-width: 400px;
          max-height: 400px;
          animation: bf-float 5s ease-in-out infinite;
        }
        .bf-float svg {
          filter: drop-shadow(0 10px 26px rgba(20, 60, 120, 0.45));
        }
        .bf-flap-r,
        .bf-flap-l {
          transform-box: view-box;
          transform-origin: 100px 100px;
        }
        .bf-flap-r {
          animation: bf-flap 2.4s ease-in-out infinite;
        }
        .bf-flap-l {
          animation: bf-flap 2.4s ease-in-out infinite;
        }
        @keyframes bf-flap {
          0%, 100% { transform: scaleX(1); }
          50%      { transform: scaleX(0.84); }
        }
        @keyframes bf-float {
          0%, 100% { transform: translateY(0) rotate(-1.2deg); }
          50%      { transform: translateY(-9px) rotate(1.2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bf-flap-r, .bf-flap-l, .bf-float { animation: none; }
          .bf-float { animation: bf-fade 3s ease-in-out infinite; }
          @keyframes bf-fade {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0.6; }
          }
        }
      `}</style>
    </div>
  );
}
