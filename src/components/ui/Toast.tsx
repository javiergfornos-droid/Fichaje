"use client";

import Link from "next/link";
import { X, Check, AlertCircle, Info } from "lucide-react";
import { useToast, type ToastVariant } from "@/contexts/ToastContext";

const variantStyles: Record<
  ToastVariant,
  { border: string; icon: React.ReactNode; accent: string }
> = {
  success: {
    border: "#30C040",
    icon: <Check className="w-4 h-4 text-[#30C040]" strokeWidth={3} />,
    accent: "#30C040",
  },
  error: {
    border: "#D83030",
    icon: <AlertCircle className="w-4 h-4 text-[#D83030]" strokeWidth={2.5} />,
    accent: "#D83030",
  },
  info: {
    border: "#88AACC",
    icon: <Info className="w-4 h-4 text-[#88AACC]" strokeWidth={2.5} />,
    accent: "#88AACC",
  },
};

/**
 * Toast container — renders stacked toasts in the bottom-right corner
 * (top-center on mobile). Non-blocking, auto-dismissing, and accessible.
 */
export default function ToastViewport() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed z-[100] pointer-events-none left-0 right-0 top-4 flex flex-col items-center gap-2 px-4 sm:left-auto sm:right-4 sm:top-auto sm:bottom-4 sm:items-end sm:px-0"
    >
      {toasts.map((toast) => {
        const styles = variantStyles[toast.variant];
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto w-full sm:w-[360px] max-w-full bg-[#0F0F14] border-l-4 shadow-[0_8px_24px_rgba(0,0,0,0.6)] animate-slide-in-toast"
            style={{ borderLeftColor: styles.accent }}
          >
            <div className="flex items-start gap-3 p-3 pr-10 relative">
              <div className="mt-0.5">{styles.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wide">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#B0B0B0] mt-0.5">
                    {toast.description}
                  </p>
                )}
                {toast.actionLabel && toast.actionHref && (
                  <Link
                    href={toast.actionHref}
                    onClick={() => dismiss(toast.id)}
                    className="inline-block mt-2 font-[family-name:var(--font-oswald)] text-xs font-bold uppercase tracking-wider no-underline"
                    style={{ color: styles.accent }}
                  >
                    {toast.actionLabel} →
                  </Link>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="absolute top-2 right-2 text-[#666] hover:text-[#F5F0E8] transition-colors p-1"
                aria-label="Cerrar notificación"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
