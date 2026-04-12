"use client";

import { X } from "lucide-react";
import type { ShirtSize, ShirtType } from "@/types/shirt";

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

export interface Filters {
  sizes: ShirtSize[];
  types: ShirtType[];
  brands: string[];
  maxPriceCents: number | null;
  sort: SortKey;
}

interface ProductFiltersProps {
  filters: Filters;
  allSizes: ShirtSize[];
  allTypes: ShirtType[];
  allBrands: string[];
  priceBoundsCents: { min: number; max: number };
  onChange: (next: Filters) => void;
  onClear: () => void;
  resultCount: number;
}

/**
 * Listing filters. Inline on desktop (sticky sidebar), collapsed
 * on mobile (accordion above grid).
 */
export default function ProductFilters({
  filters,
  allSizes,
  allTypes,
  allBrands,
  priceBoundsCents,
  onChange,
  onClear,
  resultCount,
}: ProductFiltersProps) {
  const toggleArray = <T extends string>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const hasActive =
    filters.sizes.length > 0 ||
    filters.types.length > 0 ||
    filters.brands.length > 0 ||
    filters.maxPriceCents !== null;

  const typeLabel: Record<ShirtType, string> = {
    Local: "Local",
    Visitante: "Visitante",
    Especial: "Especial",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wider">
          Filtros
          <span className="ml-2 text-[#888] font-normal">({resultCount})</span>
        </h2>
        {hasActive && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 font-[family-name:var(--font-oswald)] text-[10px] text-[#888] hover:text-[#D4A843] uppercase tracking-wider transition-colors"
          >
            <X className="w-3 h-3" aria-hidden />
            Limpiar
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterGroup title="Ordenar por">
        <select
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as SortKey })}
          aria-label="Ordenar resultados"
          className="w-full min-h-[44px] px-3 bg-[#0F0F0F] border border-[#2A2A2A] text-[#F5F0E8] font-[family-name:var(--font-jetbrains)] text-xs focus:outline-none focus:border-[#D4A843]"
        >
          <option value="featured">Destacados</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="newest">Más recientes</option>
        </select>
      </FilterGroup>

      {/* Size */}
      <FilterGroup title="Talla">
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() =>
                  onChange({ ...filters, sizes: toggleArray(filters.sizes, size) })
                }
                aria-pressed={active}
                className={`min-w-[44px] min-h-[36px] px-2 font-[family-name:var(--font-jetbrains)] text-xs font-bold border-2 transition-colors ${
                  active
                    ? "border-[#D4A843] bg-[#D4A843]/10 text-[#D4A843]"
                    : "border-[#2A2A2A] text-[#B0B0B0] hover:border-[#4A4A4A]"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* Type */}
      <FilterGroup title="Equipación">
        <div className="space-y-1.5">
          {allTypes.map((type) => {
            const active = filters.types.includes(type);
            return (
              <label
                key={type}
                className="flex items-center gap-2 min-h-[32px] cursor-pointer font-[family-name:var(--font-source-serif)] text-sm text-[#D0D0D0] hover:text-[#F5F0E8]"
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() =>
                    onChange({ ...filters, types: toggleArray(filters.types, type) })
                  }
                  className="accent-[#D4A843] w-4 h-4"
                />
                {typeLabel[type]}
              </label>
            );
          })}
        </div>
      </FilterGroup>

      {/* Brand */}
      <FilterGroup title="Marca">
        <div className="space-y-1.5">
          {allBrands.map((brand) => {
            const active = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2 min-h-[32px] cursor-pointer font-[family-name:var(--font-source-serif)] text-sm text-[#D0D0D0] hover:text-[#F5F0E8]"
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() =>
                    onChange({ ...filters, brands: toggleArray(filters.brands, brand) })
                  }
                  className="accent-[#D4A843] w-4 h-4"
                />
                {brand}
              </label>
            );
          })}
        </div>
      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Precio máximo">
        <input
          type="range"
          min={priceBoundsCents.min}
          max={priceBoundsCents.max}
          step={1000}
          value={filters.maxPriceCents ?? priceBoundsCents.max}
          onChange={(e) =>
            onChange({
              ...filters,
              maxPriceCents:
                Number(e.target.value) >= priceBoundsCents.max
                  ? null
                  : Number(e.target.value),
            })
          }
          aria-label="Precio máximo"
          className="w-full accent-[#D4A843]"
        />
        <p className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#B0B0B0] mt-1 flex justify-between">
          <span>{(priceBoundsCents.min / 100).toFixed(0)}&nbsp;€</span>
          <span>
            hasta{" "}
            <strong className="text-[#F5F0E8]">
              {((filters.maxPriceCents ?? priceBoundsCents.max) / 100).toFixed(0)}&nbsp;€
            </strong>
          </span>
        </p>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 border-t border-[#1F1F1F] pt-4">
      <h3 className="font-[family-name:var(--font-oswald)] text-[11px] font-bold text-[#888] uppercase tracking-widest">
        {title}
      </h3>
      {children}
    </div>
  );
}
