"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft, Lock } from "lucide-react";
import CartLineItem from "@/components/shop/CartLineItem";
import OrderSummary from "@/components/shop/OrderSummary";
import EmptyState from "@/components/ui/EmptyState";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/contexts/ToastContext";

/**
 * Cart page. Two-column layout on desktop:
 *   [items list] [sticky order summary + checkout CTA]
 *
 * Empty state offers browse + "saved wishlist" fallback so users
 * never hit a dead end.
 */
export default function CartPageClient() {
  const { items, count, subtotalCents, removeItem, isHydrated } = useCart();
  const { add: addToWishlist } = useWishlist();
  const { show: showToast } = useToast();

  if (!isHydrated) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="animate-pulse space-y-5">
          <div className="h-6 w-40 bg-[#1A1A1A]" />
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8">
            <div className="space-y-4">
              {[0, 1].map((i) => (
                <div key={i} className="h-28 bg-[#141414] border border-[#1F1F1F]" />
              ))}
            </div>
            <div className="h-56 bg-[#141414] border border-[#1F1F1F]" />
          </div>
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <EmptyState
          icon={<ShoppingBag className="w-16 h-16" strokeWidth={1.2} />}
          title="Tu carrito está vacío"
          description="Explora el mapa y ficha camisetas únicas de clubes de todo el mundo."
          actionLabel="Explorar camisetas"
          actionHref="/browse"
        />
      </div>
    );
  }

  const handleMoveToWishlist = (shirtId: string) => {
    const item = items.find((i) => i.shirtId === shirtId);
    if (!item) return;
    addToWishlist({
      shirtId: item.shirtId,
      slug: item.slug,
      name: item.name,
      season: item.season,
      size: item.size,
      priceCents: item.priceCents,
      currency: item.currency,
      clubId: item.clubId,
      clubName: item.clubName,
      imageUrl: item.imageUrl,
    });
    removeItem(shirtId);
    showToast({
      variant: "info",
      title: "Movido a la cartera",
      description: item.name,
      actionLabel: "Ver cartera",
      actionHref: "/wishlist",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10 pb-28 lg:pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-oswald)] text-2xl sm:text-3xl font-bold text-[#F5F0E8] uppercase tracking-wider">
          Tu carrito
          <span className="text-[#888] text-base ml-2 font-normal">
            ({count} {count === 1 ? "artículo" : "artículos"})
          </span>
        </h1>
        <Link
          href="/browse"
          className="hidden sm:inline-flex items-center gap-1.5 font-[family-name:var(--font-oswald)] text-xs text-[#888] uppercase tracking-wider hover:text-[#D4A843] no-underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
          Seguir fichando
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 lg:gap-12 items-start">
        {/* Line items */}
        <div>
          <ul className="border-t border-[#1F1F1F]" aria-label="Artículos del carrito">
            {items.map((item) => (
              <li key={item.shirtId}>
                <CartLineItem item={item} onRemove={removeItem} />
                <button
                  type="button"
                  onClick={() => handleMoveToWishlist(item.shirtId)}
                  className="-mt-2 mb-2 font-[family-name:var(--font-oswald)] text-[11px] text-[#88AACC] hover:text-[#D4A843] uppercase tracking-wider transition-colors"
                >
                  ↯ Mover a la cartera
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <aside
          aria-label="Resumen del pedido"
          className="bg-[#0F0F0F] border border-[#1F1F1F] p-5 lg:sticky lg:top-20"
        >
          <h2 className="font-[family-name:var(--font-oswald)] text-lg font-bold text-[#F5F0E8] uppercase tracking-wider mb-4">
            Resumen
          </h2>
          <OrderSummary
            subtotalCents={subtotalCents}
            itemCount={count}
            shippingMode="estimate"
          />
          <Link
            href="/checkout"
            className="mt-5 w-full min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-base font-bold uppercase tracking-wider hover:bg-[#E8C059] active:bg-[#C09830] transition-colors no-underline"
          >
            <Lock className="w-4 h-4" aria-hidden />
            Pagar el fichaje
          </Link>
          <Link
            href="/wishlist"
            className="mt-2 w-full min-h-[44px] flex items-center justify-center font-[family-name:var(--font-oswald)] text-xs text-[#888] uppercase tracking-wider hover:text-[#D4A843] no-underline transition-colors"
          >
            Poner en cartera y volver luego
          </Link>
          <p className="mt-4 font-[family-name:var(--font-source-serif)] text-[10px] text-[#666] leading-relaxed text-center">
            Pago seguro mediante Stripe.
            <br />
            Cancelación gratuita antes del envío.
          </p>
        </aside>
      </div>
    </div>
  );
}
