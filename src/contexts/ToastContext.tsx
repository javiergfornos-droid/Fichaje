"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

interface ToastContextValue {
  toasts: ToastData[];
  show: (toast: Omit<ToastData, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (toast: Omit<ToastData, "id">) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { ...toast, id }]);
      // Auto-dismiss after 3.5s
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toasts, show, dismiss }), [toasts, show, dismiss]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
