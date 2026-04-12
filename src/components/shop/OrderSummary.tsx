import { formatPrice } from "@/lib/utils/formatters";

interface OrderSummaryProps {
  subtotalCents: number;
  itemCount: number;
  /** Show a simple estimate label rather than a hard charge (for cart page). */
  shippingMode?: "estimate" | "calculated";
  shippingCents?: number;
}

const FREE_SHIPPING_THRESHOLD_CENTS = 50000;
const STANDARD_SHIPPING_CENTS = 599;

/**
 * Deterministic order summary used in both cart + checkout.
 * Free shipping kicks in above 500€.
 */
export default function OrderSummary({
  subtotalCents,
  itemCount,
  shippingMode = "estimate",
  shippingCents,
}: OrderSummaryProps) {
  const isFreeShipping = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const resolvedShipping =
    shippingCents ?? (isFreeShipping ? 0 : STANDARD_SHIPPING_CENTS);
  const totalCents = subtotalCents + resolvedShipping;

  return (
    <dl className="space-y-3">
      <div className="flex justify-between items-baseline">
        <dt className="font-[family-name:var(--font-source-serif)] text-sm text-[#B0B0B0]">
          Subtotal ({itemCount} {itemCount === 1 ? "artículo" : "artículos"})
        </dt>
        <dd className="font-[family-name:var(--font-jetbrains)] text-sm text-[#F5F0E8]">
          {formatPrice(subtotalCents)}
        </dd>
      </div>
      <div className="flex justify-between items-baseline">
        <dt className="font-[family-name:var(--font-source-serif)] text-sm text-[#B0B0B0]">
          Envío{" "}
          {shippingMode === "estimate" && (
            <span className="text-[#666] text-[11px]">(estimado)</span>
          )}
        </dt>
        <dd className="font-[family-name:var(--font-jetbrains)] text-sm">
          {resolvedShipping === 0 ? (
            <span className="text-[#88CC88] font-bold">Gratis</span>
          ) : (
            <span className="text-[#F5F0E8]">{formatPrice(resolvedShipping)}</span>
          )}
        </dd>
      </div>
      {!isFreeShipping && (
        <p className="font-[family-name:var(--font-source-serif)] text-[11px] text-[#888] leading-relaxed">
          Añade {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents)} más
          para envío gratis en España peninsular.
        </p>
      )}
      <div className="flex justify-between items-baseline border-t border-[#2A2A2A] pt-3">
        <dt className="font-[family-name:var(--font-oswald)] text-base font-bold text-[#F5F0E8] uppercase tracking-wider">
          Total
        </dt>
        <dd className="font-[family-name:var(--font-jetbrains)] text-xl font-bold text-[#F5F0E8]">
          {formatPrice(totalCents)}
        </dd>
      </div>
      <p className="font-[family-name:var(--font-source-serif)] text-[10px] text-[#666] leading-relaxed text-right">
        IVA incluido
      </p>
    </dl>
  );
}
