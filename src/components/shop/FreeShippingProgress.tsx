"use client";

import { useEffect, useRef } from "react";
import { Truck } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { formatPrice } from "@/lib/utils/formatters";
import { track } from "@/lib/analytics";

interface FreeShippingProgressProps {
  subtotalCents: number;
  thresholdCents: number;
}

/**
 * Subtle progress bar nudging the buyer toward free shipping.
 * Avoids fake urgency: only states the threshold and shows real progress.
 */
export default function FreeShippingProgress({
  subtotalCents,
  thresholdCents,
}: FreeShippingProgressProps) {
  const { t } = useI18n();
  const reached = subtotalCents >= thresholdCents;
  const percent = Math.min(100, Math.round((subtotalCents / thresholdCents) * 100));
  const remaining = Math.max(0, thresholdCents - subtotalCents);
  const announcedRef = useRef(false);

  useEffect(() => {
    if (reached && !announcedRef.current) {
      announcedRef.current = true;
      track("free_ship_threshold_hit", { thresholdCents });
    }
    if (!reached) announcedRef.current = false;
  }, [reached, thresholdCents]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Truck className="w-4 h-4 text-[#88CC88] shrink-0" aria-hidden />
        <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#D0D0D0] leading-snug">
          {reached
            ? t("cart.freeShipReached")
            : t("cart.freeShipRemaining", { amount: formatPrice(remaining) })}
        </p>
      </div>
      <div
        className="h-1.5 bg-[#1F1F1F] overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso envío gratis"
      >
        <div
          className={`h-full transition-all duration-500 ${
            reached ? "bg-[#88CC88]" : "bg-[#D4A843]"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export const FREE_SHIPPING_THRESHOLD_CENTS = 50000;
