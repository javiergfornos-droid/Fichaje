"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/utils/formatters";
import { getTypeLabel } from "@/lib/utils/conditions";
import type { CartItem } from "@/types/cart";

interface CartLineItemProps {
  item: CartItem;
  onRemove: (shirtId: string) => void;
}

/**
 * A single line item in the cart. Each vintage shirt is unique (qty = 1),
 * so there is no quantity stepper — only remove.
 */
export default function CartLineItem({ item, onRemove }: CartLineItemProps) {
  return (
    <article className="flex gap-4 border-b border-[#1F1F1F] py-5">
      {/* Thumbnail */}
      <Link
        href={`/shirt/${item.slug}`}
        aria-label={`Ver ${item.name}`}
        className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-[#141414] border border-[#2A2A2A] flex items-center justify-center no-underline hover:border-[#D4A843] transition-colors"
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl opacity-70" aria-hidden>👕</span>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        <p className="font-[family-name:var(--font-oswald)] text-[10px] font-bold text-[#888] uppercase tracking-wider truncate">
          {item.clubName}
        </p>
        <Link
          href={`/shirt/${item.slug}`}
          className="font-[family-name:var(--font-oswald)] text-sm sm:text-base font-bold text-[#F5F0E8] uppercase leading-snug line-clamp-2 no-underline hover:text-[#D4A843] transition-colors"
        >
          {item.name}
        </Link>
        <p className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#AAA] mt-1">
          {item.season} · {getTypeLabel(item.type).replace("EQUIPACIÓN ", "")} · Talla {item.size}
        </p>
        {item.playerName && (
          <p className="font-[family-name:var(--font-oswald)] text-[10px] text-[#D4A843] uppercase tracking-wider mt-0.5">
            {item.playerName}
          </p>
        )}

        <div className="flex items-end justify-between mt-auto pt-2">
          <button
            type="button"
            onClick={() => onRemove(item.shirtId)}
            aria-label={`Eliminar ${item.name} del carrito`}
            className="inline-flex items-center gap-1 font-[family-name:var(--font-oswald)] text-[11px] uppercase tracking-wider text-[#888] hover:text-[#D83030] transition-colors min-h-[44px] -my-2"
          >
            <X className="w-3.5 h-3.5" aria-hidden />
            Eliminar
          </button>
          <p className="font-[family-name:var(--font-jetbrains)] text-base sm:text-lg font-bold text-[#F5F0E8]">
            {formatPrice(item.priceCents)}
          </p>
        </div>
      </div>
    </article>
  );
}
