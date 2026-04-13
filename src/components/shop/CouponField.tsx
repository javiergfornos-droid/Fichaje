"use client";

import { useState } from "react";
import { Tag, Check, X } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { track } from "@/lib/analytics";

export interface AppliedCoupon {
  code: string;
  discountCents: number;
}

interface CouponFieldProps {
  applied: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
  /** Subtotal used to compute % codes. */
  subtotalCents: number;
}

/**
 * Discreet coupon field. Hidden behind a small "got a code?" link
 * to avoid making non-coupon shoppers feel they're missing out.
 *
 * Demo codes:
 *   FICHAJE10  → 10% off
 *   VINTAGE25  → 25 € off
 */
export default function CouponField({
  applied,
  onApply,
  onRemove,
  subtotalCents,
}: CouponFieldProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(Boolean(applied));
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;

    let discountCents = 0;
    if (normalized === "FICHAJE10") {
      discountCents = Math.round(subtotalCents * 0.1);
    } else if (normalized === "VINTAGE25") {
      discountCents = 2500;
    }

    if (discountCents <= 0) {
      setError(t("cart.coupon.invalid"));
      track("coupon_invalid", { code: normalized });
      return;
    }

    onApply({ code: normalized, discountCents });
    setCode("");
    track("coupon_applied", { code: normalized, discountCents });
  };

  if (applied) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-2 border border-[#88CC88]/40 bg-[#88CC88]/5">
        <div className="flex items-center gap-2 min-w-0">
          <Check className="w-4 h-4 text-[#88CC88] shrink-0" aria-hidden />
          <p className="font-[family-name:var(--font-jetbrains)] text-xs text-[#F5F0E8] truncate">
            <span className="font-bold">{applied.code}</span> · {t("cart.coupon.applied")}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${t("common.remove")} ${applied.code}`}
          className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#D83030] transition-colors"
        >
          <X className="w-4 h-4" aria-hidden />
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          track("coupon_toggled", { open: true });
        }}
        className="inline-flex items-center gap-1.5 font-[family-name:var(--font-oswald)] text-[11px] text-[#888] hover:text-[#D4A843] uppercase tracking-wider transition-colors"
      >
        <Tag className="w-3 h-3" aria-hidden />
        {t("cart.coupon.toggle")}
      </button>
    );
  }

  return (
    <form onSubmit={handleApply} className="space-y-1.5">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          placeholder={t("cart.coupon.placeholder")}
          aria-label={t("cart.coupon.placeholder")}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "coupon-error" : undefined}
          className={`flex-1 min-h-[40px] px-3 bg-[#0F0F0F] border ${
            error ? "border-[#D83030]" : "border-[#2A2A2A]"
          } text-[#F5F0E8] font-[family-name:var(--font-jetbrains)] text-xs uppercase placeholder:text-[#555] focus:outline-none focus:border-[#D4A843]`}
        />
        <button
          type="submit"
          className="min-h-[40px] px-4 border border-[#2A2A2A] hover:border-[#D4A843] text-[#F5F0E8] font-[family-name:var(--font-oswald)] text-[11px] font-bold uppercase tracking-wider transition-colors"
        >
          {t("cart.coupon.apply")}
        </button>
      </div>
      {error && (
        <p
          id="coupon-error"
          role="alert"
          className="font-[family-name:var(--font-source-serif)] text-[11px] text-[#D83030]"
        >
          {error}
        </p>
      )}
    </form>
  );
}
