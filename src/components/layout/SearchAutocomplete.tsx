"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X, Clock } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { DEMO_SHIRTS, DEMO_CLUB_NAMES } from "@/lib/data/demo-shirts";
import { formatPrice } from "@/lib/utils/formatters";
import { track } from "@/lib/analytics";
import type { Shirt } from "@/types/shirt";

interface SearchAutocompleteProps {
  /** Whether to render full-width / use mobile spacing. */
  variant?: "desktop" | "mobile";
  /** Called after the user submits / picks something. */
  onSubmitted?: () => void;
  autoFocus?: boolean;
}

const RECENT_KEY = "fichaje.recent-searches.v1";
const MAX_RECENT = 5;
const MAX_SUGGESTIONS = 6;

function matches(shirt: Shirt, q: string): boolean {
  const haystack = [
    shirt.name,
    shirt.season,
    shirt.brand,
    shirt.player_name ?? "",
    DEMO_CLUB_NAMES[shirt.club_id] ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q.toLowerCase());
}

/**
 * Search input + dropdown of live product suggestions and recent searches.
 * Keyboard: Arrow Up/Down to move, Enter to select, Esc to close.
 */
export default function SearchAutocomplete({
  variant = "desktop",
  onSubmitted,
  autoFocus = false,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hydrate recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const persistRecent = (next: string[]) => {
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return DEMO_SHIRTS.filter((s) => matches(s, query.trim())).slice(0, MAX_SUGGESTIONS);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Reset active index when suggestions change
  useEffect(() => setActiveIndex(-1), [query]);

  const submit = (q: string) => {
    const cleaned = q.trim();
    if (!cleaned) return;
    const next = [cleaned, ...recent.filter((r) => r !== cleaned)].slice(0, MAX_RECENT);
    persistRecent(next);
    track("search_submit", { query: cleaned, suggestionCount: suggestions.length });
    if (suggestions.length === 0) {
      track("search_no_results", { query: cleaned });
    }
    setOpen(false);
    onSubmitted?.();
    router.push(`/search?q=${encodeURIComponent(cleaned)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        const s = suggestions[activeIndex];
        track("search_suggestion_click", { id: s.id, slug: s.slug });
        setOpen(false);
        onSubmitted?.();
        router.push(`/shirt/${s.slug}`);
      } else {
        e.preventDefault();
        submit(query);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && (query.trim().length > 0 || recent.length > 0);

  return (
    <div ref={containerRef} className={`relative ${variant === "desktop" ? "flex-1 max-w-xl mx-4" : "w-full"}`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        className="relative"
      >
        <SearchIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666] pointer-events-none"
          aria-hidden
        />
        <input
          autoFocus={autoFocus}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("nav.search.placeholder")}
          aria-label={t("nav.search.label")}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showDropdown}
          aria-activedescendant={
            activeIndex >= 0 ? `suggestion-${suggestions[activeIndex]?.id}` : undefined
          }
          role="combobox"
          className={`w-full pl-10 pr-9 ${variant === "desktop" ? "py-2 text-sm" : "py-3 text-sm"} bg-[#141414] border border-[#2A2A2A] text-[#F5F0E8] font-[family-name:var(--font-source-serif)] placeholder-[#555] focus:border-[#D4A843] focus:outline-none focus:ring-1 focus:ring-[#D4A843] transition-colors`}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveIndex(-1);
            }}
            aria-label={t("common.close")}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-[#666] hover:text-[#F5F0E8]"
          >
            <X className="w-4 h-4" aria-hidden />
          </button>
        )}
      </form>

      {showDropdown && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 mt-1 z-50 bg-[#0A0A0A] border border-[#2A2A2A] shadow-[0_8px_30px_rgba(0,0,0,0.6)] max-h-[70vh] overflow-y-auto"
        >
          {suggestions.length > 0 ? (
            <ul>
              {suggestions.map((s, i) => {
                const active = i === activeIndex;
                return (
                  <li key={s.id} id={`suggestion-${s.id}`} role="option" aria-selected={active}>
                    <Link
                      href={`/shirt/${s.slug}`}
                      onClick={() => {
                        track("search_suggestion_click", { id: s.id, slug: s.slug });
                        setOpen(false);
                        onSubmitted?.();
                      }}
                      className={`flex items-center gap-3 px-4 py-3 no-underline border-b border-[#1A1A1A] last:border-b-0 ${
                        active ? "bg-[#141414]" : "hover:bg-[#141414]"
                      }`}
                    >
                      <div className="shrink-0 w-10 h-10 bg-[#141414] border border-[#2A2A2A] flex items-center justify-center">
                        <span className="text-xl opacity-70" aria-hidden>👕</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-[family-name:var(--font-oswald)] text-[10px] font-bold text-[#888] uppercase tracking-wider truncate">
                          {DEMO_CLUB_NAMES[s.club_id]}
                        </p>
                        <p className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase truncate">
                          {s.name}
                        </p>
                        <p className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#888]">
                          {s.season} · {t("pdp.size")} {s.size}
                        </p>
                      </div>
                      <p className="font-[family-name:var(--font-jetbrains)] text-xs font-bold text-[#F5F0E8] whitespace-nowrap">
                        {formatPrice(s.price_cents)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : query.trim() ? (
            <p className="px-4 py-6 font-[family-name:var(--font-source-serif)] text-sm text-[#888] text-center">
              {t("nav.search.noResults")}
            </p>
          ) : recent.length > 0 ? (
            <div>
              <p className="px-4 py-2 font-[family-name:var(--font-oswald)] text-[10px] text-[#666] uppercase tracking-widest border-b border-[#1A1A1A]">
                {t("nav.search.recentHeader")}
              </p>
              <ul>
                {recent.map((r) => (
                  <li key={r}>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(r);
                        submit(r);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#141414] text-left"
                    >
                      <Clock className="w-4 h-4 text-[#666]" aria-hidden />
                      <span className="font-[family-name:var(--font-source-serif)] text-sm text-[#D0D0D0]">
                        {r}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
