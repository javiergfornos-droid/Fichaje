import SuccessPageClient from "./SuccessPageClient";

export const metadata = {
  title: "¡FICHAJE! — ¡Fichaje completado!",
};

/**
 * Checkout success page — shown after a successful Stripe payment.
 */
export default function SuccessPage() {
  return <SuccessPageClient />;
}
