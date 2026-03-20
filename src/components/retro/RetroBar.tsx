import Link from "next/link";

interface RetroBarProps {
  viewName?: string;
}

/**
 * Metallic top navigation bar in the PC Fútbol retro style.
 * Shows ¡FICHAJE! logo (returns to landing), current view, and season badge.
 */
export default function RetroBar({ viewName = "MAPA" }: RetroBarProps) {
  return (
    <div className="retro-panel-inset flex items-center justify-between px-4 py-2">
      <Link
        href="/"
        className="font-[family-name:var(--font-oswald)] text-xl font-bold text-[#1a1a2e] hover:text-[#D4A843] transition-colors no-underline"
      >
        ¡FICHAJE!
      </Link>

      <span className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#2C3E5A] uppercase tracking-wider">
        {viewName}
      </span>

      <div className="retro-dark-panel px-3 py-1 rounded-sm">
        <span className="font-[family-name:var(--font-jetbrains)] text-xs font-bold text-[#E8C840]">
          TEMPORADA 2025-26
        </span>
      </div>
    </div>
  );
}
