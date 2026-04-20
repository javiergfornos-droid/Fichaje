import type { MockClub } from "@/lib/mocks/clubs-and-shirts";

interface ClubShirtBadgeProps {
  club: Pick<MockClub, "primary_color" | "secondary_color" | "shirt_style">;
  size?: number;
  outlined?: boolean;
}

/**
 * 8-bit style shirt icon built from the club's colors + shirt_style.
 * One SVG path for the silhouette (sleeves + body + V-neck), then pattern overlays.
 * No external images, no anti-aliasing.
 */
export default function ClubShirtBadge({
  club,
  size = 48,
  outlined = true,
}: ClubShirtBadgeProps) {
  const { primary_color, secondary_color, shirt_style } = club;
  const stroke = outlined ? "#000" : "none";
  const sw = 0.6;

  // Pattern overlays drawn inside the body region (x: 2-14, y: 1-14)
  let pattern: React.ReactNode = null;
  if (shirt_style === "striped_vertical") {
    pattern = (
      <>
        <rect x={5} y={1} width={3} height={13} fill={secondary_color} />
        <rect x={11} y={1} width={3} height={13} fill={secondary_color} />
      </>
    );
  } else if (shirt_style === "striped_horizontal") {
    pattern = (
      <rect x={2} y={5.5} width={12} height={4} fill={secondary_color} />
    );
  } else if (shirt_style === "halves") {
    pattern = <rect x={8} y={1} width={6} height={13} fill={secondary_color} />;
  } else if (shirt_style === "quartered") {
    pattern = (
      <>
        <rect x={8} y={1} width={6} height={6.5} fill={secondary_color} />
        <rect x={2} y={7.5} width={6} height={6.5} fill={secondary_color} />
      </>
    );
  }

  // Shirt outline: sleeves at the top sides, body below, miter joins
  const d = "M0 1 L16 1 L16 4 L14 4 L14 14 L2 14 L2 4 L0 4 Z";

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      style={{
        imageRendering: "pixelated",
        display: "block",
        flexShrink: 0,
      }}
      aria-hidden
    >
      {/* Primary fill */}
      <path d={d} fill={primary_color} stroke="none" />
      {/* Pattern overlay */}
      {pattern}
      {/* V-neck collar — dark triangular notch */}
      <polygon points="6.4,1 9.6,1 8,3" fill="#000" />
      {/* Outer outline last so pattern never bleeds past silhouette */}
      {outlined && (
        <path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="miter"
        />
      )}
    </svg>
  );
}
