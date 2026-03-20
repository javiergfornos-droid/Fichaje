"use client";

import { useRouter } from "next/navigation";
import ShirtCardRetro from "@/components/retro/ShirtCardRetro";
import type { Shirt } from "@/types/shirt";

interface ShirtPageClientProps {
  shirt: Shirt;
}

/**
 * Client wrapper for shirt card interactions (offers, buy, cancel).
 */
export default function ShirtPageClient({ shirt }: ShirtPageClientProps) {
  const router = useRouter();

  const handleOffer = (amountCents: number) => {
    // In production: create offer via Server Action / API
    console.log(`Offer submitted: ${amountCents} cents for shirt ${shirt.id}`);
  };

  const handleBuy = () => {
    // In production: create Stripe Checkout session
    console.log(`Buy at full price: ${shirt.price_cents} cents for shirt ${shirt.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ShirtCardRetro
      shirt={shirt}
      onOffer={handleOffer}
      onBuy={handleBuy}
      onCancel={handleCancel}
    />
  );
}
