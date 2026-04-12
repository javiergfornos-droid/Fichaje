interface RetroBarProps {
  viewName?: string;
}

/**
 * Slim contextual sub-bar for retro pages.
 * The global SiteHeader handles branding & navigation —
 * this bar only shows the current section and season phase.
 */
export default function RetroBar({ viewName = "MAPA" }: RetroBarProps) {
  return (
    <div
      className="flex items-center justify-between px-4"
      style={{
        height: 32,
        background: "linear-gradient(180deg, #2A3A54, #1E2E48)",
        borderBottom: "1px solid #1A2640",
      }}
    >
      <span className="font-[family-name:var(--font-oswald)] text-xs font-bold text-[#8A9AAA] uppercase tracking-widest">
        {viewName}
      </span>

      <span className="font-[family-name:var(--font-jetbrains)] text-[10px] font-bold text-[#E8C840] tracking-wider">
        TEMPORADA 2025-26
      </span>
    </div>
  );
}
