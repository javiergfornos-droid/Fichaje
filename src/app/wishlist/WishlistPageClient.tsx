"use client";

import Link from "next/link";
import { Heart, X } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/utils/formatters";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { DEMO_SHIRTS } from "@/lib/data/demo-shirts";
import type { WishlistItem } from "@/types/cart";

/**
 * Cartera page. Users save vintage shirts here to revisit later.
 * Each item can be moved into the cart or removed.
 */
export default function WishlistPageClient() {
  const { items, count, remove, isHydrated } = useWishlist();
  const { addItem, hasItem } = useCart();
  const { show: showToast } = useToast();

  if (!isHydrated) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-[#1A1A1A]" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-square bg-[#141414] border border-[#1F1F1F]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <EmptyState
          icon={<Heart className="w-16 h-16" strokeWidth={1.2} />}
          title="Tu cartera está vacía"
          description="Guarda aquí las camisetas que quieres seguir de cerca. Podrás volver a ellas cuando estés listo para fichar."
          actionLabel="Explorar camisetas"
          actionHref="/browse"
        />
      </div>
    );
  }

  const handleMoveToCart = (wishItem: WishlistItem) => {
    // Hydrate full shirt from demo data (in production: fetch by id)
    const full = DEMO_SHIRTS.find((s) => s.id === wishItem.shirtId);
    if (!full) return;

    if (hasItem(wishItem.shirtId)) {
      showToast({
        variant: "info",
        title: "Ya está en tu carrito",
        description: wishItem.name,
        actionLabel: "Ver carrito",
        actionHref: "/cart",
      });
      return;
    }

    addItem({
      shirtId: full.id,
      slug: full.slug,
      name: full.name,
      season: full.season,
      type: full.type,
      size: full.size,
      brand: full.brand,
      playerName: full.player_name,
      priceCents: full.price_cents,
      currency: full.currency,
      clubId: full.club_id,
      clubName: wishItem.clubName,
      imageUrl: wishItem.imageUrl,
    });
    remove(wishItem.shirtId);
    showToast({
      variant: "success",
      title: "Movido al carrito",
      description: wishItem.name,
      actionLabel: "Ver carrito",
      actionHref: "/cart",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <header className="mb-6">
        <h1 className="font-[family-name:var(--font-oswald)] text-2xl sm:text-3xl font-bold text-[#F5F0E8] uppercase tracking-wider">
          Mi cartera
          <span className="text-[#888] text-base ml-2 font-normal">
            ({count} {count === 1 ? "camiseta" : "camisetas"})
          </span>
        </h1>
        <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#B0B0B0] mt-1">
          Camisetas guardadas para más tarde. Piezas únicas — si alguien la ficha antes, ya no estará disponible.
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <li
            key={item.shirtId}
            className="relative bg-[#0F0F0F] border border-[#1F1F1F] hover:border-[#2A2A2A] transition-colors"
          >
            <button
              type="button"
              onClick={() => remove(item.shirtId)}
              aria-label={`Quitar ${item.name} de la cartera`}
              className="absolute top-2 right-2 z-10 w-9 h-9 flex items-center justify-center bg-[#0A0A0A]/80 border border-[#2A2A2A] text-[#888] hover:text-[#D83030] hover:border-[#D83030] transition-colors"
            >
              <X className="w-4 h-4" aria-hidden />
            </button>

            <Link
              href={`/shirt/${item.slug}`}
              className="block aspect-square bg-[#141414] border-b border-[#1F1F1F] flex items-center justify-center no-underline"
            >
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-7xl opacity-70" aria-hidden>👕</span>
              )}
            </Link>

            <div className="p-3 space-y-2">
              <p className="font-[family-name:var(--font-oswald)] text-[10px] font-bold text-[#888] uppercase tracking-wider truncate">
                {item.clubName}
              </p>
              <Link
                href={`/shirt/${item.slug}`}
                className="block font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase leading-snug line-clamp-2 no-underline hover:text-[#D4A843] transition-colors min-h-[2.5em]"
              >
                {item.name}
              </Link>
              <p className="font-[family-name:var(--font-jetbrains)] text-xs text-[#AAA]">
                {item.season} · Talla {item.size}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="font-[family-name:var(--font-jetbrains)] text-base font-bold text-[#F5F0E8]">
                  {formatPrice(item.priceCents)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleMoveToCart(item)}
                className="w-full min-h-[44px] mt-2 px-3 py-2 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-xs font-bold uppercase tracking-wider hover:bg-[#E8C059] active:bg-[#C09830] transition-colors"
              >
                Fichar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
