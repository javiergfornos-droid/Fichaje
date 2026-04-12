import type { Metadata } from "next";
import BrowsePageClient from "./BrowsePageClient";
import { DEMO_SHIRTS } from "@/lib/data/demo-shirts";

export const metadata: Metadata = {
  title: "¡FICHAJE! — Explorar camisetas",
};

export default function BrowsePage() {
  return <BrowsePageClient shirts={DEMO_SHIRTS} />;
}
