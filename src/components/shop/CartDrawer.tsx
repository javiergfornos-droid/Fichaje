"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ShoppingBag, Lock, ShieldCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useI18n } from "@/contexts/I18nContext";
import { formatPrice } from "@/lib/utils/formatters";
import FreeShippingProgress, {
  FREE_SHIPPING_THRESHOLD_CENTS,
} from "@/components/shop/FreeShippingProgress";
import OrderSummary from "@/components/shop/OrderSummary";
import { track } from "@/lib/analytics";

/**
 * Slide-in mini-cart. Reinforces the add-to-cart confirmation
 * and offers two parallel paths: keep shopping or go to checkout.
 *
 * - Closed by default; opens via CartDrawerContext.
 * - Mobile: full-width sheet from the right.
 * - Desktop: 420px panel with backdrop.
 */
export default function CartDrawer() {
  const { isOpen, close } = useCartDrawer();
  const { items, count, subtotalCents, removeItem } = useCart();
  const { t } = useI18n();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Trap focus + lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    track("cart_drawer_opened", { count });
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, count]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("nav.cart")}
      className="fixed inset-0 z-[60] flex"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={close}
        aria-label={t("common.close")}
        className="flex-1 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      />

      {/* Panel */}
      <aside
        className="w-full sm:w-[420px] max-w-full bg-[#0A0A0A] border-l border-[#1F1F1F] flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-[slideInRight_0.25s_ease-out]"
      >
        {/* Header */}
        <header className="flex items-center justify-between px-5 h-14 border-b border-[#1F1F1F] shrink-0">
          <h2 className="font-[family-name:var(--font-oswald)] text-base font-bold text-[#F5F0E8] uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#D4A843]" aria-hidden />
            {t("nav.cart")}
            {count > 0 && (
              <span className="text-[#888] font-normal text-sm">({count})</span>
            )}
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label={t("common.close")}
            className="w-11 h-11 flex items-center justify-center text-[#B0B0B0] hover:text-[#F5F0E8] -mr-2"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </header>

        {/* Body */}
        {count === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
            <ShoppingBag className="w-14 h-14 text-[#3A3A3A]" strokeWidth={1.2} aria-hidden />
            <p className="font-[family-name:var(--font-oswald)] text-base font-bold text-[#F5F0E8] uppercase tracking-wider">
              {t("cart.empty.title")}
            </p>
            <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#888] max-w-xs">
              {t("cart.empty.description")}
            </p>
            <Link
              href="/browse"
              onClick={close}
              className="mt-2 px-5 py-3 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider hover:bg-[#E8C059] no-underline transition-colors"
            >
              {t("cart.empty.cta")}
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-5 py-4 border-b border-[#1F1F1F]">
              <FreeShippingProgress
                subtotalCents={subtotalCents}
                thresholdCents={FREE_SHIPPING_THRESHOLD_CENTS}
              />
            </div>

            {/* Items */}
            <ul className="flex-1 overflow-y-auto px-5 divide-y divide-[#1F1F1F]">
              {items.map((item) => (
                <li key={item.shirtId} className="py-4 flex gap-3">
                  <Link
                    href={`/shirt/${item.slug}`}
                    onClick={close}
                    className="shrink-0 w-16 h-16 bg-[#141414] border border-[#2A2A2A] flex items-center justify-center no-underline"
                    aria-label={item.name}
                  >
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl opacity-70" aria-hidden>👕</span>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <p className="font-[family-name:var(--font-oswald)] text-[10px] font-bold text-[#888] uppercase tracking-wider truncate">
                      {item.clubName}
                    </p>
                    <Link
                      href={`/shirt/${item.slug}`}
                      onClick={close}
                      className="font-[family-name:var(--font-oswald)] text-xs font-bold text-[#F5F0E8] uppercase leading-snug line-clamp-2 no-underline hover:text-[#D4A843] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#888] mt-0.5">
                      {item.season} · {t("pdp.size")} {item.size}
                    </p>
                    <div className="flex items-end justify-between mt-auto pt-1">
                      <button
                        type="button"
                        onClick={() => removeItem(item.shirtId)}
                        aria-label={`${t("common.remove")} ${item.name}`}
                        className="font-[family-name:var(--font-oswald)] text-[10px] text-[#888] hover:text-[#D83030] uppercase tracking-wider transition-colors"
                      >
                        {t("common.remove")}
                      </button>
                      <p className="font-[family-name:var(--font-jetbrains)] text-sm font-bold text-[#F5F0E8]">
                        {formatPrice(item.priceCents)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer / summary */}
            <footer className="border-t border-[#1F1F1F] px-5 py-4 space-y-3 shrink-0 bg-[#0A0A0A]">
              <OrderSummary
                subtotalCents={subtotalCents}
                itemCount={count}
                shippingMode="estimate"
              />

              <Link
                href="/checkout"
                onClick={() => {
                  track("cart_drawer_checkout_click", { count });
                  close();
                }}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 px-5 py-3 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider hover:bg-[#E8C059] active:bg-[#C09830] transition-colors no-underline"
              >
                <Lock className="w-4 h-4" aria-hidden />
                {t("cart.payCta")}
              </Link>

              <button
                type="button"
                onClick={() => {
                  track("cart_drawer_continue_click");
                  close();
                }}
                className="w-full min-h-[40px] font-[family-name:var(--font-oswald)] text-[11px] text-[#888] uppercase tracking-wider hover:text-[#D4A843] transition-colors"
              >
                {t("common.continueShopping")}
              </button>

              <div className="flex items-center justify-center gap-1.5 pt-1 border-t border-[#1F1F1F] mt-2">
                <ShieldCheck className="w-3 h-3 text-[#666]" aria-hidden />
                <p className="font-[family-name:var(--font-source-serif)] text-[10px] text-[#666]">
                  Stripe · SSL · 14d
                </p>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
