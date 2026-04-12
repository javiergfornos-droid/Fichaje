import Link from "next/link";

interface RetroBarProps {
  viewName?: string;
}

/**
 * Top bar rebuilt as three separate floating pods with gaps
 * showing the metallic blue gradient background (PC Fútbol style).
 *
 * Pod 1 (left): ¡FICHAJE! logo + user info
 * Pod 2 (center): Date display with torn-edge style
 * Pod 3 (right): Season phase badge
 */
export default function RetroBar({ viewName = "MAPA" }: RetroBarProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase();

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      {/* Pod 1: Logo + User info */}
      <div
        className="flex items-center gap-3 px-4 py-2"
        style={{
          background: "linear-gradient(180deg, #d0d0d0, #a8a8a8)",
          border: "3px outset #c0c0c0",
          borderRadius: "2px",
        }}
      >
        <Link
          href="/"
          className="font-[family-name:var(--font-oswald)] text-xl font-bold text-[#1a1a2e] hover:text-[#D4A843] transition-colors no-underline"
        >
          ¡FICHAJE!
        </Link>
        <div
          style={{
            width: "1px",
            height: "24px",
            background: "linear-gradient(180deg, transparent, #888, transparent)",
          }}
        />
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "2px",
              background: "linear-gradient(135deg, #3D4F6F, #2C3E5A)",
              border: "1.5px solid #5a6a8a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: "#aabbcc",
            }}
          >
            ?
          </div>
          <span className="font-[family-name:var(--font-jetbrains)] text-xs font-bold text-[#3D4F6F] uppercase">
            INVITADO
          </span>
        </div>
      </div>

      {/* Pod 2: Date box with torn-edge style */}
      <div
        className="flex-1 flex items-center justify-center px-4 py-2"
        style={{
          background: "linear-gradient(180deg, #c8c0a8, #b0a888)",
          border: "3px outset #c8b888",
          borderRadius: "2px",
          position: "relative",
        }}
      >
        {/* Torn edge decorations */}
        <div
          style={{
            position: "absolute",
            left: 4,
            top: "50%",
            transform: "translateY(-50%)",
            width: 6,
            height: "70%",
            background:
              "repeating-linear-gradient(180deg, transparent, transparent 3px, #a09870 3px, #a09870 4px)",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 4,
            top: "50%",
            transform: "translateY(-50%)",
            width: 6,
            height: "70%",
            background:
              "repeating-linear-gradient(180deg, transparent, transparent 3px, #a09870 3px, #a09870 4px)",
            opacity: 0.5,
          }}
        />
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#3A2A1A] uppercase tracking-wider">
            {viewName}
          </span>
          <span style={{ color: "#6A5A3A", fontSize: "10px" }}>|</span>
          <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[#5A4A2A]">
            {dateStr}
          </span>
        </div>
      </div>

      {/* Pod 3: Season phase */}
      <div
        className="flex items-center px-4 py-2"
        style={{
          background: "linear-gradient(180deg, #2A3A54, #1E2E48)",
          border: "3px outset #4a5a7a",
          borderRadius: "2px",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#88CC88",
              boxShadow: "0 0 6px #88CC8888",
            }}
          />
          <span className="font-[family-name:var(--font-jetbrains)] text-xs font-bold text-[#E8C840]">
            TEMPORADA 2025-26
          </span>
        </div>
      </div>
    </div>
  );
}
