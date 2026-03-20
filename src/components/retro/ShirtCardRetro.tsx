"use client";

import StatBar from "./StatBar";
import Stars from "./Stars";
import OfferPanel from "./OfferPanel";
import { getMediaColor, getTypeLabel } from "@/lib/utils/conditions";
import { formatPrice } from "@/lib/utils/formatters";
import type { Shirt } from "@/types/shirt";

interface ShirtCardRetroProps {
  shirt: Shirt;
  onOffer: (amountCents: number) => void;
  onBuy: () => void;
  onCancel: () => void;
}

/**
 * Player card style shirt detail view mimicking PC Fútbol player information screen.
 */
export default function ShirtCardRetro({ shirt, onOffer, onBuy, onCancel }: ShirtCardRetroProps) {
  const mediaColor = getMediaColor(shirt.overall);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="retro-dark-panel px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#3a4a6a] flex items-center justify-center text-xl">
            👕
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-oswald)] text-xl font-bold text-[#F5F0E8]">
              {shirt.name}
            </h1>
            <p className="font-[family-name:var(--font-oswald)] text-xs text-[#88AACC] uppercase">
              {getTypeLabel(shirt.type)}
            </p>
          </div>
        </div>
        <div
          className="font-[family-name:var(--font-jetbrains)] text-3xl font-bold"
          style={{ color: mediaColor }}
        >
          {shirt.overall}
        </div>
      </div>

      {/* Body — two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-3">
          {/* Shirt image placeholder */}
          <div className="retro-dark-panel aspect-square flex items-center justify-center scan-lines relative">
            <span className="text-8xl opacity-80">👕</span>
          </div>

          {/* 2×2 info grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "TEMPORADA", value: shirt.season },
              { label: "TIPO", value: shirt.type },
              { label: "MARCA", value: shirt.brand },
              { label: "TALLA", value: shirt.size },
            ].map((item) => (
              <div key={item.label} className="retro-dark-panel px-3 py-2">
                <p className="font-[family-name:var(--font-oswald)] text-[10px] text-[#88AACC] uppercase">
                  {item.label}
                </p>
                <p className="font-[family-name:var(--font-jetbrains)] text-sm text-[#F5F0E8] font-bold">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Player name */}
          {shirt.player_name && (
            <div className="border-2 border-[#D4A843] bg-[#D4A843]/10 px-3 py-2 text-center">
              <span className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#D4A843] uppercase">
                {shirt.player_name}
              </span>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Condition section */}
          <div>
            <h3 className="font-[family-name:var(--font-oswald)] text-xs uppercase text-[#88AACC] mb-2">
              Estado de la camiseta
            </h3>
            <div className="space-y-2">
              <StatBar label="Estado general" value={shirt.overall} />
              <StatBar label="Brillo" value={shirt.brightness} />
              <StatBar label="Integridad color" value={shirt.color_integrity} />
              <StatBar label="Características" value={shirt.special_features} />
            </div>
          </div>

          {/* Stars */}
          <div className="text-center">
            <Stars count={shirt.stars} size="lg" />
          </div>

          {/* Price box */}
          <div className="retro-dark-panel p-4 text-center border-3 border-inset">
            <p className="font-[family-name:var(--font-jetbrains)] text-2xl font-bold text-[#E8C840]">
              {formatPrice(shirt.price_cents)}
            </p>
            <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#88AACC] mt-1">
              Pieza única · IVA incl.
            </p>
          </div>
        </div>
      </div>

      {/* Offer section */}
      <OfferPanel
        priceCents={shirt.price_cents}
        minOfferPct={shirt.min_offer_pct}
        onOffer={onOffer}
        onBuy={onBuy}
        onCancel={onCancel}
      />
    </div>
  );
}
