"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Check, ShieldCheck } from "lucide-react";
import ProductGallery from "@/components/shop/ProductGallery";
import ShippingInfo from "@/components/shop/ShippingInfo";
import StickyMobileCTA from "@/components/shop/StickyMobileCTA";
import RelatedProducts from "@/components/shop/RelatedProducts";
import StatBar from "@/components/retro/StatBar";
import Stars from "@/components/retro/Stars";
import { formatPrice } from "@/lib/utils/formatters";
import { getTypeLabel, getMediaColor } from "@/lib/utils/conditions";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/contexts/ToastContext";
import type { Shirt } from "@/types/shirt";

interface ShirtPageClientProps {
  shirt: Shirt;
  clubName: string;
  relatedShirts: Shirt[];
}

/**
 * Product detail page (PDP). Primary conversion surface.
 *
 * Layout:
 *  - Desktop: two columns (gallery | info block with CTAs).
 *  - Mobile:  stacked, with sticky bottom CTA after scroll.
 *
 * Gamification (condition stats, stars, overall media) is preserved below
 * the fold so it supports the decision without competing with the buy path.
 */
export default function ShirtPageClient({
  shirt,
  clubName,
  relatedShirts,
}: ShirtPageClientProps) {
  const { addItem, hasItem, isHydrated: cartHydrated } = useCart();
  const { toggle: toggleWishlist, has: inWishlist, isHydrated: wishlistHydrated } = useWishlist();
  const { show: showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const isInCart = cartHydrated && hasItem(shirt.id);
  const isInWishlist = wishlistHydrated && inWishlist(shirt.id);
  const isSold = shirt.is_sold;
  const mediaColor = getMediaColor(shirt.overall);

  const galleryImages = [
    { url: null as string | null, alt: `${shirt.name} — frontal` },
    { url: null as string | null, alt: `${shirt.name} — trasera` },
    { url: null as string | null, alt: `${shirt.name} — detalle` },
  ];

  const handleAddToCart = () => {
    if (isSold || isInCart) return;
    setIsAdding(true);
    addItem({
      shirtId: shirt.id,
      slug: shirt.slug,
      name: shirt.name,
      season: shirt.season,
      type: shirt.type,
      size: shirt.size,
      brand: shirt.brand,
      playerName: shirt.player_name,
      priceCents: shirt.price_cents,
      currency: shirt.currency,
      clubId: shirt.club_id,
      clubName,
      imageUrl: null,
    });
    showToast({
      variant: "success",
      title: "Fichaje añadido al carrito",
      description: shirt.name,
      actionLabel: "Ver carrito",
      actionHref: "/cart",
    });
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist({
      shirtId: shirt.id,
      slug: shirt.slug,
      name: shirt.name,
      season: shirt.season,
      size: shirt.size,
      priceCents: shirt.price_cents,
      currency: shirt.currency,
      clubId: shirt.club_id,
      clubName,
      imageUrl: null,
    });
    showToast({
      variant: "info",
      title: added ? "Añadido a la cartera" : "Quitado de la cartera",
      description: shirt.name,
      actionLabel: added ? "Ver cartera" : undefined,
      actionHref: added ? "/wishlist" : undefined,
    });
  };

  const primaryCtaLabel = isSold
    ? "Fichado"
    : isInCart
      ? "En el carrito"
      : "Fichar";

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6 lg:gap-10">
        {/* ── LEFT · Gallery ───────────────────────────────── */}
        <div>
          <ProductGallery images={galleryImages} />

          {/* Condition stats — gamification (desktop visible, mobile hidden here) */}
          <section className="hidden lg:block mt-8 border-t border-[#1F1F1F] pt-6">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-[family-name:var(--font-oswald)] text-lg font-bold text-[#F5F0E8] uppercase tracking-wider">
                Estado de la camiseta
              </h2>
              <div
                className="font-[family-name:var(--font-jetbrains)] text-2xl font-bold"
                style={{ color: mediaColor }}
                aria-label={`Valoración general ${shirt.overall} sobre 100`}
              >
                {shirt.overall}
              </div>
            </div>
            <div className="space-y-3">
              <StatBar label="Estado general" value={shirt.overall} />
              <StatBar label="Brillo" value={shirt.brightness} />
              <StatBar label="Integridad color" value={shirt.color_integrity} />
              <StatBar label="Características" value={shirt.special_features} />
            </div>
            <p className="mt-3 font-[family-name:var(--font-source-serif)] text-xs text-[#888] leading-relaxed">
              Evaluación realizada por nuestros expertos antes del fichaje.
              Cada camiseta es una pieza única, irrepetible.
            </p>
          </section>
        </div>

        {/* ── RIGHT · Info + CTAs ──────────────────────────── */}
        <div className="space-y-5">
          {/* Club */}
          <div>
            <Link
              href={`/roster/${shirt.club_id}`}
              className="inline-block font-[family-name:var(--font-oswald)] text-[11px] font-bold text-[#D4A843] uppercase tracking-[0.15em] no-underline hover:underline"
            >
              {clubName}
            </Link>
          </div>

          {/* Title + stars */}
          <div className="space-y-2">
            <h1 className="font-[family-name:var(--font-oswald)] text-2xl sm:text-3xl font-bold text-[#F5F0E8] uppercase leading-tight">
              {shirt.name}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-[family-name:var(--font-jetbrains)] text-sm text-[#E8C840]">
                {shirt.season}
              </span>
              <span className="text-[#444]" aria-hidden>·</span>
              <span className="font-[family-name:var(--font-oswald)] text-xs text-[#AAA] uppercase tracking-wider">
                {shirt.brand}
              </span>
              <span className="text-[#444]" aria-hidden>·</span>
              <Stars count={shirt.stars} size="sm" />
            </div>
            {shirt.player_name && (
              <p className="font-[family-name:var(--font-oswald)] text-sm text-[#D4A843] uppercase tracking-wider">
                Jugador: <span className="font-bold">{shirt.player_name}</span>
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <p className="font-[family-name:var(--font-jetbrains)] text-3xl sm:text-4xl font-bold text-[#F5F0E8]">
              {formatPrice(shirt.price_cents)}
            </p>
            <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#888]">
              IVA incl. · Pieza única
            </p>
          </div>

          {/* Attributes grid */}
          <dl className="grid grid-cols-3 gap-2 border-t border-[#1F1F1F] pt-4">
            <div>
              <dt className="font-[family-name:var(--font-oswald)] text-[10px] text-[#888] uppercase tracking-wider">
                Talla
              </dt>
              <dd className="font-[family-name:var(--font-jetbrains)] text-base font-bold text-[#F5F0E8]">
                {shirt.size}
              </dd>
            </div>
            <div>
              <dt className="font-[family-name:var(--font-oswald)] text-[10px] text-[#888] uppercase tracking-wider">
                Tipo
              </dt>
              <dd className="font-[family-name:var(--font-jetbrains)] text-sm text-[#F5F0E8]">
                {getTypeLabel(shirt.type).replace("EQUIPACIÓN ", "")}
              </dd>
            </div>
            <div>
              <dt className="font-[family-name:var(--font-oswald)] text-[10px] text-[#888] uppercase tracking-wider">
                Stock
              </dt>
              <dd className="font-[family-name:var(--font-jetbrains)] text-sm">
                {isSold ? (
                  <span className="text-[#D83030] font-bold">Agotado</span>
                ) : (
                  <span className="text-[#88CC88] font-bold">1 disponible</span>
                )}
              </dd>
            </div>
          </dl>

          {/* Primary CTA */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isSold || isInCart || isAdding}
              aria-label={isSold ? "Agotado" : isInCart ? "Ya está en tu carrito" : `Fichar ${shirt.name}`}
              className="w-full min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-base font-bold uppercase tracking-wider hover:bg-[#E8C059] active:bg-[#C09830] disabled:bg-[#2A2A2A] disabled:text-[#666] disabled:cursor-not-allowed transition-colors"
            >
              {isInCart && <Check className="w-5 h-5" aria-hidden />}
              {primaryCtaLabel}
            </button>

            {/* Secondary CTA */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              aria-pressed={isInWishlist}
              aria-label={isInWishlist ? "Quitar de la cartera" : "Poner en cartera"}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-[#2A2A2A] text-[#F5F0E8] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider hover:border-[#D4A843] hover:text-[#D4A843] transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${isInWishlist ? "fill-[#D4A843] text-[#D4A843]" : ""}`}
                aria-hidden
              />
              {isInWishlist ? "En tu cartera" : "Poner en cartera"}
            </button>
          </div>

          {/* Shipping + guarantees */}
          <ShippingInfo />

          {/* Description / story */}
          {(shirt.description || shirt.story) && (
            <section className="border-t border-[#2A2A2A] pt-4 space-y-3">
              <h2 className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wider">
                Historia
              </h2>
              {shirt.description && (
                <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#D0D0D0] leading-relaxed">
                  {shirt.description}
                </p>
              )}
              {shirt.story && (
                <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#AAA] leading-relaxed italic">
                  {shirt.story}
                </p>
              )}
            </section>
          )}

          {/* Authentication note */}
          <div className="flex items-start gap-2 border-t border-[#2A2A2A] pt-4">
            <ShieldCheck className="w-4 h-4 text-[#D4A843] mt-0.5 shrink-0" aria-hidden />
            <p className="font-[family-name:var(--font-source-serif)] text-[11px] text-[#888] leading-relaxed">
              Todas las piezas pasan por un proceso de autenticación y
              evaluación de estado antes de entrar al mercado.
            </p>
          </div>
        </div>
      </div>

      {/* Condition stats — mobile only, below info */}
      <section className="lg:hidden mt-8 border-t border-[#1F1F1F] pt-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-[family-name:var(--font-oswald)] text-lg font-bold text-[#F5F0E8] uppercase tracking-wider">
            Estado
          </h2>
          <div
            className="font-[family-name:var(--font-jetbrains)] text-2xl font-bold"
            style={{ color: mediaColor }}
            aria-label={`Valoración general ${shirt.overall} sobre 100`}
          >
            {shirt.overall}
          </div>
        </div>
        <div className="space-y-3">
          <StatBar label="Estado general" value={shirt.overall} />
          <StatBar label="Brillo" value={shirt.brightness} />
          <StatBar label="Integridad color" value={shirt.color_integrity} />
          <StatBar label="Características" value={shirt.special_features} />
        </div>
      </section>

      {/* Related products */}
      <RelatedProducts shirts={relatedShirts} />

      {/* Mobile sticky CTA — reinforces purchase path after scrolling */}
      <StickyMobileCTA
        priceCents={shirt.price_cents}
        label={primaryCtaLabel}
        disabled={isSold || isInCart}
        onClick={handleAddToCart}
      />
    </>
  );
}
