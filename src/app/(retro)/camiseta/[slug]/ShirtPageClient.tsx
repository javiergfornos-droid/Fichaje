"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Check, ShieldCheck } from "lucide-react";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductSpecs, { type FitType } from "@/components/shop/ProductSpecs";
import ShippingInfo from "@/components/shop/ShippingInfo";
import StickyMobileCTA from "@/components/shop/StickyMobileCTA";
import RelatedProducts from "@/components/shop/RelatedProducts";
import RecentlyViewed from "@/components/shop/RecentlyViewed";
import FaqAccordion, { type FaqItem } from "@/components/shop/FaqAccordion";
import StatBar from "@/components/retro/StatBar";
import Stars from "@/components/retro/Stars";
import { formatPrice } from "@/lib/utils/formatters";
import { getTypeLabel, getMediaColor } from "@/lib/utils/conditions";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/contexts/ToastContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useI18n } from "@/contexts/I18nContext";
import { track as analyticsTrack } from "@/lib/analytics";
import type { Shirt } from "@/types/shirt";

interface ShirtPageClientProps {
  shirt: Shirt;
  clubName: string;
  relatedShirts: Shirt[];
  fit: FitType;
  faqItems: FaqItem[];
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
  fit,
  faqItems,
}: ShirtPageClientProps) {
  const { t } = useI18n();
  const { addItem, hasItem, isHydrated: cartHydrated } = useCart();
  const { toggle: toggleWishlist, has: inWishlist, isHydrated: wishlistHydrated } = useWishlist();
  const { show: showToast } = useToast();
  const { track: trackRecentlyViewed } = useRecentlyViewed();
  const { open: openCartDrawer } = useCartDrawer();
  const [isAdding, setIsAdding] = useState(false);

  const isInCart = cartHydrated && hasItem(shirt.id);
  const isInWishlist = wishlistHydrated && inWishlist(shirt.id);
  const isSold = shirt.is_sold;
  const mediaColor = getMediaColor(shirt.overall);

  // Record view on mount
  useEffect(() => {
    trackRecentlyViewed(shirt, clubName);
    analyticsTrack("product_viewed", {
      id: shirt.id,
      slug: shirt.slug,
      clubId: shirt.club_id,
      priceCents: shirt.price_cents,
    });
  }, [shirt, clubName, trackRecentlyViewed]);

  const galleryImages = [
    { url: null as string | null, alt: `${shirt.name} — ${t("pdp.galleryLabel")} 1` },
    { url: null as string | null, alt: `${shirt.name} — ${t("pdp.galleryLabel")} 2` },
    { url: null as string | null, alt: `${shirt.name} — ${t("pdp.galleryLabel")} 3` },
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
    analyticsTrack("add_to_cart", {
      id: shirt.id,
      slug: shirt.slug,
      priceCents: shirt.price_cents,
    });
    showToast({
      variant: "success",
      title: t("pdp.addedToast"),
      description: shirt.name,
      actionLabel: t("common.viewCart"),
      actionHref: "/cart",
    });
    openCartDrawer();
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
    analyticsTrack(added ? "wishlist_add" : "wishlist_remove", { id: shirt.id });
    showToast({
      variant: "info",
      title: added ? t("pdp.wishlistAddedToast") : t("pdp.wishlistRemovedToast"),
      description: shirt.name,
      actionLabel: added ? t("nav.wishlist") : undefined,
      actionHref: added ? "/wishlist" : undefined,
    });
  };

  const primaryCtaLabel = isSold
    ? t("pdp.soldOut")
    : isInCart
      ? t("pdp.inCart")
      : t("pdp.addToCart");

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
                {t("pdp.conditionTitle")}
              </h2>
              <div
                className="font-[family-name:var(--font-jetbrains)] text-2xl font-bold"
                style={{ color: mediaColor }}
                aria-label={`${t("pdp.statGeneral")} ${shirt.overall}/100`}
              >
                {shirt.overall}
              </div>
            </div>
            <div className="space-y-3">
              <StatBar label={t("pdp.statGeneral")} value={shirt.overall} />
              <StatBar label={t("pdp.statBrightness")} value={shirt.brightness} />
              <StatBar label={t("pdp.statColor")} value={shirt.color_integrity} />
              <StatBar label={t("pdp.statFeatures")} value={shirt.special_features} />
            </div>
            <p className="mt-3 font-[family-name:var(--font-source-serif)] text-xs text-[#888] leading-relaxed">
              {t("pdp.conditionSubtitle")}
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
                <span className="font-bold">{shirt.player_name}</span>
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <p className="font-[family-name:var(--font-jetbrains)] text-3xl sm:text-4xl font-bold text-[#F5F0E8]">
              {formatPrice(shirt.price_cents)}
            </p>
            <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#888]">
              {t("common.vatIncluded")} · {t("common.uniquePiece")}
            </p>
          </div>

          {/* Attributes grid */}
          <dl className="grid grid-cols-3 gap-2 border-t border-[#1F1F1F] pt-4">
            <div>
              <dt className="font-[family-name:var(--font-oswald)] text-[10px] text-[#888] uppercase tracking-wider">
                {t("pdp.size")}
              </dt>
              <dd className="font-[family-name:var(--font-jetbrains)] text-base font-bold text-[#F5F0E8]">
                {shirt.size}
              </dd>
            </div>
            <div>
              <dt className="font-[family-name:var(--font-oswald)] text-[10px] text-[#888] uppercase tracking-wider">
                {t("pdp.type")}
              </dt>
              <dd className="font-[family-name:var(--font-jetbrains)] text-sm text-[#F5F0E8]">
                {getTypeLabel(shirt.type).replace("EQUIPACIÓN ", "")}
              </dd>
            </div>
            <div>
              <dt className="font-[family-name:var(--font-oswald)] text-[10px] text-[#888] uppercase tracking-wider">
                {t("pdp.stock")}
              </dt>
              <dd className="font-[family-name:var(--font-jetbrains)] text-sm">
                {isSold ? (
                  <span className="text-[#D83030] font-bold">{t("pdp.stockSold")}</span>
                ) : (
                  <span className="text-[#88CC88] font-bold">{t("pdp.stockAvailable")}</span>
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
              aria-label={primaryCtaLabel}
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
              className="w-full min-h-[48px] flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-[#2A2A2A] text-[#F5F0E8] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider hover:border-[#D4A843] hover:text-[#D4A843] transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${isInWishlist ? "fill-[#D4A843] text-[#D4A843]" : ""}`}
                aria-hidden
              />
              {isInWishlist ? t("pdp.inWishlist") : t("pdp.addToWishlist")}
            </button>
          </div>

          {/* Shipping + guarantees */}
          <ShippingInfo />

          {/* Product specs (fit / materials / care) */}
          <ProductSpecs fit={fit} />

          {/* Description / story */}
          {(shirt.description || shirt.story) && (
            <section className="border-t border-[#2A2A2A] pt-4 space-y-3">
              <h2 className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wider">
                {t("pdp.story")}
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

          {/* FAQ */}
          {faqItems.length > 0 && (
            <div className="border-t border-[#2A2A2A] pt-4">
              <FaqAccordion items={faqItems} title={t("pdp.faqTitle")} />
            </div>
          )}

          {/* Authentication note */}
          <div className="flex items-start gap-2 border-t border-[#2A2A2A] pt-4">
            <ShieldCheck className="w-4 h-4 text-[#D4A843] mt-0.5 shrink-0" aria-hidden />
            <p className="font-[family-name:var(--font-source-serif)] text-[11px] text-[#888] leading-relaxed">
              {t("pdp.authNote")}
            </p>
          </div>
        </div>
      </div>

      {/* Condition stats — mobile only, below info */}
      <section className="lg:hidden mt-8 border-t border-[#1F1F1F] pt-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-[family-name:var(--font-oswald)] text-lg font-bold text-[#F5F0E8] uppercase tracking-wider">
            {t("pdp.conditionTitle")}
          </h2>
          <div
            className="font-[family-name:var(--font-jetbrains)] text-2xl font-bold"
            style={{ color: mediaColor }}
            aria-label={`${t("pdp.statGeneral")} ${shirt.overall}/100`}
          >
            {shirt.overall}
          </div>
        </div>
        <div className="space-y-3">
          <StatBar label={t("pdp.statGeneral")} value={shirt.overall} />
          <StatBar label={t("pdp.statBrightness")} value={shirt.brightness} />
          <StatBar label={t("pdp.statColor")} value={shirt.color_integrity} />
          <StatBar label={t("pdp.statFeatures")} value={shirt.special_features} />
        </div>
      </section>

      {/* Related products */}
      <RelatedProducts shirts={relatedShirts} />

      {/* Recently viewed */}
      <RecentlyViewed excludeId={shirt.id} />

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
