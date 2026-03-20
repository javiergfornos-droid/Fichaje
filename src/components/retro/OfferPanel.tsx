"use client";

import { useState, useCallback } from "react";
import RetroBtn from "./RetroBtn";
import { formatPrice } from "@/lib/utils/formatters";

interface OfferPanelProps {
  priceCents: number;
  minOfferPct: number;
  onOffer: (amountCents: number) => void;
  onBuy: () => void;
  onCancel: () => void;
}

/**
 * Offer section with ◄► buttons, percentage quick-picks, and validation.
 */
export default function OfferPanel({
  priceCents,
  minOfferPct,
  onOffer,
  onBuy,
  onCancel,
}: OfferPanelProps) {
  const minAmount = Math.ceil((priceCents * minOfferPct) / 100);
  const [amountCents, setAmountCents] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shaking, setShaking] = useState(false);

  const adjustAmount = useCallback(
    (delta: number) => {
      setAmountCents((prev) => Math.max(0, Math.min(priceCents, prev + delta)));
      setError(null);
    },
    [priceCents]
  );

  const setPercentage = useCallback(
    (pct: number) => {
      setAmountCents(Math.round((priceCents * pct) / 100));
      setError(null);
    },
    [priceCents]
  );

  const handleOffer = useCallback(() => {
    if (amountCents < minAmount) {
      setError(`⚠️ Mínimo: ${formatPrice(minAmount)} (${minOfferPct}%)`);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return;
    }
    setSuccess(true);
    onOffer(amountCents);
  }, [amountCents, minAmount, minOfferPct, onOffer]);

  if (success) {
    return (
      <div className="retro-dark-panel p-4 text-center">
        <span className="text-[#30C040] text-2xl">✓</span>
        <p className="font-[family-name:var(--font-oswald)] text-[#30C040] mt-2">
          ¡Oferta de {formatPrice(amountCents)} enviada!
        </p>
        <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#88AACC] mt-1">
          Te notificaremos cuando el vendedor responda.
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-[#4a5a7a] p-4 space-y-3">
      <p className="font-[family-name:var(--font-oswald)] text-xs uppercase text-[#88AACC]">
        Tu oferta (€):
      </p>

      {/* Amount display with ◄► controls */}
      <div className="flex items-center gap-2">
        <RetroBtn size="sm" onClick={() => adjustAmount(-1000)}>
          ◄
        </RetroBtn>
        <div
          className={`flex-1 retro-dark-panel px-4 py-2 text-center ${shaking ? "animate-shake" : ""} ${error ? "border-[#D83030]" : ""}`}
        >
          <span className="font-[family-name:var(--font-jetbrains)] text-lg font-bold text-[#E8C840]">
            {formatPrice(amountCents)}
          </span>
        </div>
        <RetroBtn size="sm" onClick={() => adjustAmount(1000)}>
          ►
        </RetroBtn>
      </div>

      {error && (
        <p className="font-[family-name:var(--font-jetbrains)] text-xs text-[#D83030] text-center">
          {error}
        </p>
      )}

      {/* Percentage quick-picks */}
      <div className="flex gap-1 justify-center">
        {[80, 85, 90, 95, 100].map((pct) => (
          <RetroBtn
            key={pct}
            size="sm"
            variant={amountCents === Math.round((priceCents * pct) / 100) ? "gold" : "default"}
            onClick={() => setPercentage(pct)}
          >
            {pct}%
          </RetroBtn>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <RetroBtn variant="default" className="flex-1" onClick={onCancel}>
          Cancelar
        </RetroBtn>
        <RetroBtn
          variant="gold"
          className="flex-1"
          onClick={handleOffer}
          disabled={amountCents === 0}
        >
          Hacer oferta
        </RetroBtn>
        <RetroBtn variant="green" className="flex-1" onClick={onBuy}>
          Comprar · {formatPrice(priceCents)}
        </RetroBtn>
      </div>
    </div>
  );
}
