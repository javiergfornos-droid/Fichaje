"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import ProductFilters, { type Filters } from "@/components/shop/ProductFilters";
import EmptyState from "@/components/ui/EmptyState";
import { DEMO_CLUB_NAMES } from "@/lib/data/demo-shirts";
import type { Shirt, ShirtSize, ShirtType } from "@/types/shirt";

interface BrowsePageClientProps {
  shirts: Shirt[];
}

/**
 * Browse / product listing page.
 * Desktop: fixed sidebar filters + grid.
 * Mobile: sticky top bar with "Filtros" button that opens a drawer.
 */
export default function BrowsePageClient({ shirts }: BrowsePageClientProps) {
  const priceBoundsCents = useMemo(() => {
    const prices = shirts.map((s) => s.price_cents);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [shirts]);

  const allSizes = useMemo<ShirtSize[]>(
    () => Array.from(new Set(shirts.map((s) => s.size))).sort(),
    [shirts]
  );
  const allTypes = useMemo<ShirtType[]>(
    () => Array.from(new Set(shirts.map((s) => s.type))),
    [shirts]
  );
  const allBrands = useMemo(
    () => Array.from(new Set(shirts.map((s) => s.brand))).sort(),
    [shirts]
  );

  const [filters, setFilters] = useState<Filters>({
    sizes: [],
    types: [],
    brands: [],
    maxPriceCents: null,
    sort: "featured",
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = shirts.filter((s) => {
      if (filters.sizes.length > 0 && !filters.sizes.includes(s.size)) return false;
      if (filters.types.length > 0 && !filters.types.includes(s.type)) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(s.brand)) return false;
      if (filters.maxPriceCents !== null && s.price_cents > filters.maxPriceCents)
        return false;
      return true;
    });

    switch (filters.sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price_cents - b.price_cents);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price_cents - a.price_cents);
        break;
      case "newest":
        result = [...result].sort((a, b) => (a.id < b.id ? 1 : -1));
        break;
      case "featured":
      default:
        result = [...result].sort(
          (a, b) => Number(b.is_featured) - Number(a.is_featured)
        );
    }
    return result;
  }, [shirts, filters]);

  const resetFilters = () =>
    setFilters({
      sizes: [],
      types: [],
      brands: [],
      maxPriceCents: null,
      sort: "featured",
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <header className="mb-5">
        <h1 className="font-[family-name:var(--font-oswald)] text-2xl sm:text-3xl font-bold text-[#F5F0E8] uppercase tracking-wider">
          Explorar camisetas
        </h1>
        <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#B0B0B0] mt-1">
          Piezas únicas, autenticadas, listas para fichar.
        </p>
      </header>

      {/* Mobile filters toggle */}
      <div className="lg:hidden flex items-center justify-between mb-4 border-y border-[#1F1F1F] py-3">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex items-center gap-2 font-[family-name:var(--font-oswald)] text-xs font-bold text-[#F5F0E8] uppercase tracking-wider min-h-[44px] px-3 border border-[#2A2A2A] hover:border-[#D4A843] transition-colors"
          aria-expanded={mobileFiltersOpen}
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden />
          Filtros
        </button>
        <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[#888]">
          {filtered.length} resultados
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <ProductFilters
              filters={filters}
              allSizes={allSizes}
              allTypes={allTypes}
              allBrands={allBrands}
              priceBoundsCents={priceBoundsCents}
              onChange={setFilters}
              onClear={resetFilters}
              resultCount={filtered.length}
            />
          </div>
        </aside>

        {/* Grid */}
        <div>
          {filtered.length === 0 ? (
            <EmptyState
              title="No hemos encontrado camisetas"
              description="Prueba a quitar algún filtro o a subir el precio máximo."
              actionLabel="Quitar filtros"
              actionHref="/browse"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filtered.map((shirt) => (
                <ProductCard
                  key={shirt.id}
                  shirt={shirt}
                  clubName={DEMO_CLUB_NAMES[shirt.club_id]}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Filtros"
        >
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="flex-1 bg-black/60"
            aria-label="Cerrar filtros"
          />
          <div className="w-80 max-w-[90vw] bg-[#0A0A0A] border-l border-[#2A2A2A] p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[family-name:var(--font-oswald)] text-base font-bold text-[#F5F0E8] uppercase tracking-wider">
                Filtros
              </h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-[#B0B0B0] hover:text-[#F5F0E8]"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" aria-hidden />
              </button>
            </div>
            <ProductFilters
              filters={filters}
              allSizes={allSizes}
              allTypes={allTypes}
              allBrands={allBrands}
              priceBoundsCents={priceBoundsCents}
              onChange={setFilters}
              onClear={resetFilters}
              resultCount={filtered.length}
            />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full min-h-[48px] bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider"
            >
              Ver {filtered.length} resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
