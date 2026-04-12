import type { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "¡FICHAJE! — Carrito",
};

export default function CartPage() {
  return <CartPageClient />;
}
