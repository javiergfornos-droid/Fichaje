"use client";

import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { formatPrice } from "@/lib/utils/formatters";
import { track } from "@/lib/analytics";

interface RecentlyViewedProps {
  /** Hide the item with this id (e.g. the current PDP). */
  excludeId?: string;
}

/**
 * Horizontal strip of recently viewed shirts, hydrated from localStorage.
 * Renders nothing if there's nothing to show.
 */
export default function RecentlyViewed({ excludeId }: RecentlyViewedProps) {
  const { t } = useI18n();
  const { items, isHydrated } = useRecentlyViewed();

  if (!isHydrated) return null;
  const filtered = items.filter((i) => i.id !== excludeId);
  if (filtered.length === 0) return null;

  return (
    <section
      aria-label={t("pdp.recentlyViewed")}
      className="border-t border-[#1F1F1F] pt-8 mt-12"
    >
      <h2 className="font-[family-name:var(--font-oswald)] text-lg font-bold text-[#F5F0E8] uppercase tracking-wider mb-4">
        {t("pdp.recentlyViewed")}
      </h2>
      <ul
        className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
        role="list"
      >
        {filtered.map((item) => (
          <li
            key={item.id}
            className="snap-start shrink-0 w-[140px] sm:w-[160px] bg-[#0F0F0F] border border-[#1F1F1F] hover:border-[#D4A843] transition-colors"
          >
            <Link
              href={`/shirt/${item.slug}`}
              onClick={() => track("recently_viewed_click", { id: item.id })}
              className="block no-underline"
            >
              <div className="aspect-square bg-[#141414] border-b border-[#1F1F1F] flex items-center justify-center">
                <span className="text-5xl opacity-70" aria-hidden>
                  👕
                </span>
              </div>
              <div className="p-2.5 space-y-1">
                <p className="font-[family-name:var(--font-oswald)] text-[9px] font-bold text-[#888] uppercase tracking-wider truncate">
                  {item.clubName}
                </p>
                <p className="font-[family-name:var(--font-oswald)] text-[11px] font-bold text-[#F5F0E8] uppercase leading-snug line-clamp-2 min-h-[2.5em]">
                  {item.name}
                </p>
                <p className="font-[family-name:var(--font-jetbrains)] text-xs font-bold text-[#F5F0E8]">
                  {formatPrice(item.priceCents)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
