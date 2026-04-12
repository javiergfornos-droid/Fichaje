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
import type { CartItem } from "@/types/cart";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  addItem: (item: CartItem) => void;
  removeItem: (shirtId: string) => void;
  clear: () => void;
  hasItem: (shirtId: string) => boolean;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "fichaje.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore corrupted storage
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, isHydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.shirtId === item.shirtId)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((shirtId: string) => {
    setItems((prev) => prev.filter((i) => i.shirtId !== shirtId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const hasItem = useCallback(
    (shirtId: string) => items.some((i) => i.shirtId === shirtId),
    [items]
  );

  const subtotalCents = useMemo(
    () => items.reduce((sum, item) => sum + item.priceCents, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      subtotalCents,
      addItem,
      removeItem,
      clear,
      hasItem,
      isHydrated,
    }),
    [items, subtotalCents, addItem, removeItem, clear, hasItem, isHydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
