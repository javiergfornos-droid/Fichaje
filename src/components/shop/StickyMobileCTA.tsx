"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils/formatters";

interface StickyMobileCTAProps {
  priceCents: number;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

/**
 * Sticky bottom CTA bar — mobile only (≤ md breakpoint).
 * Appears after the user has scrolled past the in-page primary CTA,
 * so it reinforces the purchase path without blocking content.
 */
export default function StickyMobileCTA({
  priceCents,
  label,
  disabled = false,
  onClick,
}: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      // Show after scrolling ~40% of the viewport height
      const threshold = window.innerHeight * 0.4;
      setVisible(window.scrollY > threshold);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0A0A0A] border-t border-[#2A2A2A] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-200 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider active:bg-[#C09830] disabled:bg-[#4A4A4A] disabled:text-[#888] disabled:cursor-not-allowed transition-colors min-h-[48px]"
      >
        <span className="font-[family-name:var(--font-jetbrains)] text-base">
          {formatPrice(priceCents)}
        </span>
        <span className="flex-1 text-right">{label}</span>
      </button>
    </div>
  );
}
