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
import type { WishlistItem } from "@/types/cart";

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  add: (item: WishlistItem) => void;
  remove: (shirtId: string) => void;
  toggle: (item: WishlistItem) => boolean; // returns true if added, false if removed
  has: (shirtId: string) => boolean;
  clear: () => void;
  isHydrated: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "fichaje.wishlist.v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, isHydrated]);

  const add = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.shirtId === item.shirtId)) return prev;
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((shirtId: string) => {
    setItems((prev) => prev.filter((i) => i.shirtId !== shirtId));
  }, []);

  const has = useCallback(
    (shirtId: string) => items.some((i) => i.shirtId === shirtId),
    [items]
  );

  const toggle = useCallback(
    (item: WishlistItem): boolean => {
      const exists = items.some((i) => i.shirtId === item.shirtId);
      if (exists) {
        setItems((prev) => prev.filter((i) => i.shirtId !== item.shirtId));
        return false;
      }
      setItems((prev) => [...prev, item]);
      return true;
    },
    [items]
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      add,
      remove,
      toggle,
      has,
      clear,
      isHydrated,
    }),
    [items, add, remove, toggle, has, clear, isHydrated]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
