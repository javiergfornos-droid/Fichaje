import type { Metadata } from "next";
import CheckoutPageClient from "./CheckoutPageClient";

export const metadata: Metadata = {
  title: "¡FICHAJE! — Checkout",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
