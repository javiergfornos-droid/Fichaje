import RetroBar from "@/components/retro/RetroBar";

/**
 * Layout for the retro PC Fútbol interface.
 * Applies the blue-grey gradient background and metallic top bar.
 */
export default function RetroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(180deg, #5B6B8A, #3D4F6F 30%, #2C3E5A)",
      }}
    >
      <RetroBar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
