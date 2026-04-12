import type { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";
import { DEMO_SHIRTS } from "@/lib/data/demo-shirts";

export const metadata: Metadata = {
  title: "¡FICHAJE! — Buscar",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  return <SearchPageClient query={q} shirts={DEMO_SHIRTS} />;
}
