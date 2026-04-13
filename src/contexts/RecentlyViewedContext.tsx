"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Shirt } from "@/types/shirt";

/**
 * Minimal projection of a shirt we keep in localStorage for the
 * "Recently viewed" feature. Avoids bloating storage and stays
 * resilient to schema changes.
 */
export interface RecentShirt {
  id: string;
  slug: string;
  name: string;
  season: string;
  clubId: string;
  clubName: string;
  priceCents: number;
  size: string;
  viewedAt: number;
}

interface RecentlyViewedContextValue {
  items: RecentShirt[];
  track: (shirt: Shirt, clubName: string) => void;
  clear: () => void;
  isHydrated: boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);
const STORAGE_KEY = "fichaje.recent.v1";
const MAX_ITEMS = 12;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RecentShirt[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, isHydrated]);

  const track = useCallback((shirt: Shirt, clubName: string) => {
    setItems((prev) => {
      const next: RecentShirt = {
        id: shirt.id,
        slug: shirt.slug,
        name: shirt.name,
        season: shirt.season,
        clubId: shirt.club_id,
        clubName,
        priceCents: shirt.price_cents,
        size: shirt.size,
        viewedAt: Date.now(),
      };
      const filtered = prev.filter((i) => i.id !== shirt.id);
      return [next, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, track, clear, isHydrated }),
    [items, track, clear, isHydrated]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx)
    throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return ctx;
}
