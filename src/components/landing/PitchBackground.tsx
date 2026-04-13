/**
 * Vintage 1980s football-game pitch background.
 *
 * Rendered as a fixed, heavily blurred SVG behind the landing content so
 * the mower stripes, centre circle and penalty box hint at a football
 * pitch without competing with CTAs. A dark radial vignette on top
 * preserves the Stadium Archive contrast.
 */
export default function PitchBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* Base solid — acts as fallback + keeps edges dark during blur bleed */}
      <div className="absolute inset-0 bg-[#0E2A14]" />

      {/* SVG pitch, heavily blurred */}
      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full blur-[60px] sm:blur-[90px] scale-110"
      >
        <defs>
          {/* Mower stripes — alternating light/dark green bands */}
          <pattern
            id="pitch-stripes"
            x="0"
            y="0"
            width="200"
            height="1000"
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="100" height="1000" fill="#2C6A30" />
            <rect x="100" y="0" width="100" height="1000" fill="#1F5024" />
          </pattern>
        </defs>

        {/* Pitch grass */}
        <rect x="0" y="0" width="1600" height="1000" fill="url(#pitch-stripes)" />

        {/* Touchlines */}
        <rect
          x="60"
          y="60"
          width="1480"
          height="880"
          fill="none"
          stroke="#E8F0D8"
          strokeWidth="8"
        />

        {/* Halfway line */}
        <line
          x1="800"
          y1="60"
          x2="800"
          y2="940"
          stroke="#E8F0D8"
          strokeWidth="8"
        />

        {/* Centre circle + spot */}
        <circle
          cx="800"
          cy="500"
          r="130"
          fill="none"
          stroke="#E8F0D8"
          strokeWidth="8"
        />
        <circle cx="800" cy="500" r="10" fill="#E8F0D8" />

        {/* Left penalty area */}
        <rect
          x="60"
          y="280"
          width="230"
          height="440"
          fill="none"
          stroke="#E8F0D8"
          strokeWidth="8"
        />
        <rect
          x="60"
          y="380"
          width="90"
          height="240"
          fill="none"
          stroke="#E8F0D8"
          strokeWidth="8"
        />
        <circle cx="200" cy="500" r="10" fill="#E8F0D8" />

        {/* Right penalty area */}
        <rect
          x="1310"
          y="280"
          width="230"
          height="440"
          fill="none"
          stroke="#E8F0D8"
          strokeWidth="8"
        />
        <rect
          x="1450"
          y="380"
          width="90"
          height="240"
          fill="none"
          stroke="#E8F0D8"
          strokeWidth="8"
        />
        <circle cx="1400" cy="500" r="10" fill="#E8F0D8" />
      </svg>

      {/* Dark gradient overlay — keeps CTAs legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.85) 70%, rgba(10,10,10,0.95) 100%)",
        }}
      />

      {/* Subtle CRT scan lines to reinforce the vintage 80s game feel */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)",
        }}
      />
    </div>
  );
}
