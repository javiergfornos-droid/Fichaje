"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import { DEMO_CLUB_NAMES } from "@/lib/data/demo-shirts";
import type { Shirt } from "@/types/shirt";

interface SearchPageClientProps {
  query: string;
  shirts: Shirt[];
}

function matchesQuery(shirt: Shirt, q: string): boolean {
  const haystack = [
    shirt.name,
    shirt.season,
    shirt.brand,
    shirt.player_name ?? "",
    DEMO_CLUB_NAMES[shirt.club_id] ?? "",
    shirt.type,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q.toLowerCase());
}

export default function SearchPageClient({ query, shirts }: SearchPageClientProps) {
  const router = useRouter();
  const [input, setInput] = useState(query);

  const results = useMemo(() => {
    if (!query) return [];
    return shirts.filter((s) => matchesQuery(s, query));
  }, [shirts, query]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <header className="mb-6">
        <h1 className="font-[family-name:var(--font-oswald)] text-2xl sm:text-3xl font-bold text-[#F5F0E8] uppercase tracking-wider">
          Buscar camisetas
        </h1>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(input.trim())}`);
          }}
          className="mt-4 relative"
        >
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]"
            aria-hidden
          />
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Club, temporada, jugador…"
            aria-label="Buscar"
            className="w-full min-h-[52px] pl-10 pr-4 bg-[#0F0F0F] border border-[#2A2A2A] text-[#F5F0E8] font-[family-name:var(--font-jetbrains)] text-sm placeholder:text-[#555] focus:outline-none focus:border-[#D4A843]"
          />
        </form>
      </header>

      {!query ? (
        <EmptyState
          icon={<SearchIcon className="w-14 h-14" strokeWidth={1.2} />}
          title="¿Qué camiseta buscas?"
          description="Prueba con el nombre de un club, un jugador o una temporada. Por ejemplo: Arsenal 1991, Ronaldinho, Juventus."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="w-14 h-14" strokeWidth={1.2} />}
          title={`Sin resultados para "${query}"`}
          description="Revisa la ortografía, prueba con menos palabras o explora el catálogo completo."
          actionLabel="Explorar camisetas"
          actionHref="/browse"
        />
      ) : (
        <>
          <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#888] mb-4">
            {results.length} {results.length === 1 ? "resultado" : "resultados"} para{" "}
            <strong className="text-[#F5F0E8]">&ldquo;{query}&rdquo;</strong>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {results.map((shirt) => (
              <ProductCard
                key={shirt.id}
                shirt={shirt}
                clubName={DEMO_CLUB_NAMES[shirt.club_id]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
