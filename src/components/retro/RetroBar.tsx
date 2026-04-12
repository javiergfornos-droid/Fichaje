import Link from "next/link";

interface RetroBarProps {
  viewName?: string;
}

/**
 * Compact top bar — dark panel matching the PC Fútbol frame aesthetic.
 * Shows logo, view name, and season badge.
 */
export default function RetroBar({ viewName = "MAPA" }: RetroBarProps) {
  return (
    <div
      className="flex items-center justify-between px-4"
      style={{
        height: 40,
        background: "linear-gradient(180deg, #2A3A54, #1E2E48)",
        borderBottom: "2px solid #1A2640",
        boxShadow: "0 1px 0 #3A4A6A inset",
      }}
    >
      <Link
        href="/"
        className="font-[family-name:var(--font-oswald)] text-lg font-bold text-[#E8C840] hover:text-[#FFE870] transition-colors no-underline"
      >
        ¡FICHAJE!
      </Link>

      <span className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#8A9AAA] uppercase tracking-wider">
        {viewName}
      </span>

      <span className="font-[family-name:var(--font-jetbrains)] text-xs font-bold text-[#E8C840]">
        TEMPORADA 2025-26
      </span>
    </div>
  );
}
