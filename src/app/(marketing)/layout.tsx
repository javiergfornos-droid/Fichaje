import PitchBackground from "@/components/landing/PitchBackground";

/**
 * Layout for the marketing/landing pages.
 *
 * A vintage 1980s football-game pitch (mower stripes, centre circle, boxes)
 * is rendered as a blurred fixed background behind the content so the
 * Stadium Archive CTAs stay the focal point. `isolate` scopes the
 * stacking context so the pitch sits above the global body background.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate min-h-screen text-[#F5F0E8]">
      <PitchBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
