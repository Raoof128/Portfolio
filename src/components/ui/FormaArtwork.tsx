/** The training motif stays still in previews and when motion is paused. */
export function FormaArtwork({
  active = true,
}: {
  active?: boolean;
  preview?: boolean;
}) {
  return (
    <svg viewBox="0 0 480 320" width="100%" height="100%" aria-hidden="true">
      <rect width="480" height="320" fill="#12201d" />
      <circle
        cx="240"
        cy="160"
        r="112"
        fill="none"
        stroke="#29413a"
        strokeWidth="2"
      >
        {active && (
          <animate
            attributeName="r"
            values="104;112;104"
            dur="6s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle
        cx="240"
        cy="160"
        r="88"
        fill="none"
        stroke="#29413a"
        strokeWidth="2"
      />
      <g transform="rotate(-30 240 160)" fill="#d8ed9c">
        <rect x="150" y="150" width="180" height="20" rx="10" />
        <rect x="145" y="107" width="26" height="106" rx="8" />
        <rect x="119" y="126" width="20" height="68" rx="6" />
        <rect x="309" y="107" width="26" height="106" rx="8" />
        <rect x="341" y="126" width="20" height="68" rx="6" />
      </g>
    </svg>
  );
}
