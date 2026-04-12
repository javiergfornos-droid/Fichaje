import Link from "next/link";
import Stars from "@/components/retro/Stars";
import { formatPrice } from "@/lib/utils/formatters";
import { getTypeLabel } from "@/lib/utils/conditions";
import type { Shirt } from "@/types/shirt";

interface ProductCardProps {
  shirt: Shirt;
  clubName?: string;
}

/**
 * Product listing/grid card. Used on browse, search, wishlist, and related products.
 */
export default function ProductCard({ shirt, clubName }: ProductCardProps) {
  return (
    <Link
      href={`/shirt/${shirt.slug}`}
      className="group block no-underline bg-[#0F0F0F] border border-[#1F1F1F] hover:border-[#D4A843] transition-colors"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#141414] border-b border-[#1F1F1F] flex items-center justify-center overflow-hidden">
        <span className="text-7xl opacity-80 group-hover:scale-105 transition-transform select-none" aria-hidden>
          👕
        </span>
        {shirt.is_sold && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="font-[family-name:var(--font-oswald)] text-xs font-bold text-[#D83030] uppercase tracking-wider border-2 border-[#D83030] px-3 py-1">
              Fichado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        {clubName && (
          <p className="font-[family-name:var(--font-oswald)] text-[10px] font-bold text-[#888] uppercase tracking-wider truncate">
            {clubName}
          </p>
        )}
        <h3 className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase leading-snug line-clamp-2 min-h-[2.5em]">
          {shirt.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#E8C840]">
            {shirt.season}
          </span>
          <Stars count={shirt.stars} size="sm" />
        </div>
        <div className="flex items-center justify-between pt-1.5">
          <span className="font-[family-name:var(--font-jetbrains)] text-sm font-bold text-[#F5F0E8]">
            {formatPrice(shirt.price_cents)}
          </span>
          <span className="font-[family-name:var(--font-oswald)] text-[10px] text-[#888] uppercase">
            Talla {shirt.size} · {getTypeLabel(shirt.type).slice(0, 3)}
          </span>
        </div>
      </div>
    </Link>
  );
}
