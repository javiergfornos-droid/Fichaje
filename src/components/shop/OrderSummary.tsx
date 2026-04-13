"use client";

import { useI18n } from "@/contexts/I18nContext";
import { formatPrice } from "@/lib/utils/formatters";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/components/shop/FreeShippingProgress";

interface OrderSummaryProps {
  subtotalCents: number;
  itemCount: number;
  shippingMode?: "estimate" | "calculated";
  shippingCents?: number;
  discountCents?: number;
  couponCode?: string;
}

const STANDARD_SHIPPING_CENTS = 599;

/**
 * Deterministic order summary used in cart, drawer and checkout.
 * Free shipping kicks in above the shared threshold.
 */
export default function OrderSummary({
  subtotalCents,
  itemCount,
  shippingMode = "estimate",
  shippingCents,
  discountCents = 0,
  couponCode,
}: OrderSummaryProps) {
  const { t } = useI18n();
  const isFreeShipping = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const resolvedShipping =
    shippingCents ?? (isFreeShipping ? 0 : STANDARD_SHIPPING_CENTS);
  const totalCents = Math.max(0, subtotalCents + resolvedShipping - discountCents);
  const itemLabel = itemCount === 1 ? t("common.result") : t("common.results");

  return (
    <dl className="space-y-3">
      <div className="flex justify-between items-baseline">
        <dt className="font-[family-name:var(--font-source-serif)] text-sm text-[#B0B0B0]">
          {t("cart.subtotal")} ({itemCount} {itemLabel})
        </dt>
        <dd className="font-[family-name:var(--font-jetbrains)] text-sm text-[#F5F0E8]">
          {formatPrice(subtotalCents)}
        </dd>
      </div>

      {discountCents > 0 && (
        <div className="flex justify-between items-baseline">
          <dt className="font-[family-name:var(--font-source-serif)] text-sm text-[#88CC88]">
            {couponCode ? `${t("cart.coupon.applied")} · ${couponCode}` : t("cart.coupon.applied")}
          </dt>
          <dd className="font-[family-name:var(--font-jetbrains)] text-sm text-[#88CC88]">
            −{formatPrice(discountCents)}
          </dd>
        </div>
      )}

      <div className="flex justify-between items-baseline">
        <dt className="font-[family-name:var(--font-source-serif)] text-sm text-[#B0B0B0]">
          {t("cart.shipping")}{" "}
          {shippingMode === "estimate" && (
            <span className="text-[#666] text-[11px]">({t("cart.shippingEstimated")})</span>
          )}
        </dt>
        <dd className="font-[family-name:var(--font-jetbrains)] text-sm">
          {resolvedShipping === 0 ? (
            <span className="text-[#88CC88] font-bold">{t("common.free")}</span>
          ) : (
            <span className="text-[#F5F0E8]">{formatPrice(resolvedShipping)}</span>
          )}
        </dd>
      </div>

      <div className="flex justify-between items-baseline border-t border-[#2A2A2A] pt-3">
        <dt className="font-[family-name:var(--font-oswald)] text-base font-bold text-[#F5F0E8] uppercase tracking-wider">
          {t("cart.total")}
        </dt>
        <dd className="font-[family-name:var(--font-jetbrains)] text-xl font-bold text-[#F5F0E8]">
          {formatPrice(totalCents)}
        </dd>
      </div>
      <p className="font-[family-name:var(--font-source-serif)] text-[10px] text-[#666] leading-relaxed text-right">
        {t("common.vatIncluded")}
      </p>
    </dl>
  );
}
