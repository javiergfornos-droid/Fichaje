import type { Metadata } from "next";
import WishlistPageClient from "./WishlistPageClient";

export const metadata: Metadata = {
  title: "¡FICHAJE! — Mi cartera",
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
