import Link from "next/link";
import Stars from "./Stars";
import { getTypeBadgeColor, getTypeAbbr } from "@/lib/utils/conditions";
import { formatPrice } from "@/lib/utils/formatters";
import type { Shirt } from "@/types/shirt";
import type { Club } from "@/types/club";

interface RosterTableProps {
  club: Club;
  shirts: Shirt[];
  countryFlag: string;
  countryName: string;
}

/**
 * Squad-style shirt roster table mimicking PC Fútbol squad screen.
 */
export default function RosterTable({ club, shirts, countryFlag, countryName }: RosterTableProps) {
  return (
    <div className="space-y-0">
      {/* Club header */}
      <div className="retro-dark-panel px-4 py-3 flex items-center gap-4">
        <span className="text-3xl">{club.badge_emoji}</span>
        <div>
          <h1 className="font-[family-name:var(--font-oswald)] text-[22px] font-bold text-[#F5F0E8] uppercase">
            {club.name}
          </h1>
          <p className="font-[family-name:var(--font-oswald)] text-xs text-[#88AACC]">
            {countryFlag} {countryName} · {shirts.length} camiseta{shirts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Table header */}
      <div className="retro-panel-inset grid grid-cols-[40px_1fr_80px_60px_100px_90px_40px] items-center px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-[#555] font-[family-name:var(--font-oswald)]">
        <span />
        <span>Camiseta</span>
        <span>Temp.</span>
        <span>Talla</span>
        <span>Calidad</span>
        <span>Precio</span>
        <span />
      </div>

      {/* Shirt rows */}
      {shirts.map((shirt, i) => (
        <Link
          key={shirt.id}
          href={`/shirt/${shirt.slug}`}
          className={`grid grid-cols-[40px_1fr_80px_60px_100px_90px_40px] items-center px-2 py-2 no-underline hover:bg-[#E8F0FF] transition-colors ${
            i % 2 === 0 ? "bg-[#F8F8F8]" : "bg-[#EEEEEE]"
          }`}
        >
          {/* Type badge */}
          <div className="flex justify-center">
            <span
              className="inline-block w-5 h-5 text-[10px] font-bold text-white text-center leading-5 rounded-sm font-[family-name:var(--font-oswald)]"
              style={{ backgroundColor: getTypeBadgeColor(shirt.type) }}
            >
              {getTypeAbbr(shirt.type)}
            </span>
          </div>

          {/* Name */}
          <span className="font-[family-name:var(--font-oswald)] text-sm text-[#1a1a2e] truncate">
            {shirt.name}
          </span>

          {/* Season */}
          <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[#E8C840]">
            {shirt.season}
          </span>

          {/* Size */}
          <span className="font-[family-name:var(--font-oswald)] text-xs text-[#555] text-center">
            {shirt.size}
          </span>

          {/* Stars */}
          <Stars count={shirt.stars} size="sm" />

          {/* Price */}
          <span
            className={`font-[family-name:var(--font-jetbrains)] text-xs font-bold text-right ${
              shirt.price_cents > 40000 ? "text-[#D4A843]" : "text-[#333]"
            }`}
          >
            {formatPrice(shirt.price_cents)}
          </span>

          {/* Arrow */}
          <span className="text-[#aaa] text-center">›</span>
        </Link>
      ))}

      {shirts.length === 0 && (
        <div className="bg-[#F8F8F8] p-8 text-center">
          <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#888]">
            No hay camisetas disponibles para este club
          </p>
        </div>
      )}
    </div>
  );
}
