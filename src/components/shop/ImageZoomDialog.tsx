"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { track } from "@/lib/analytics";

interface ImageZoomDialogProps {
  images: { url: string | null; alt: string }[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
  placeholderEmoji?: string;
}

/**
 * Full-screen image zoom dialog. Click anywhere on the image to toggle
 * a 2× zoom that follows the cursor. Arrow keys + on-screen buttons
 * navigate between gallery images.
 */
export default function ImageZoomDialog({
  images,
  initialIndex,
  open,
  onClose,
  placeholderEmoji = "👕",
}: ImageZoomDialogProps) {
  const { t } = useI18n();
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setIndex(initialIndex);
      setZoomed(false);
      track("image_zoom_opened", { index: initialIndex });
    }
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, images.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, images.length]);

  if (!open) return null;

  const current = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current?.alt ?? "Image"}
      className="fixed inset-0 z-[70] bg-black/95 flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[#1A1A1A] shrink-0">
        <p className="font-[family-name:var(--font-jetbrains)] text-xs text-[#888]">
          {index + 1} / {images.length}
        </p>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="w-11 h-11 flex items-center justify-center text-[#F5F0E8] hover:text-[#D4A843]"
        >
          <X className="w-5 h-5" aria-hidden />
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={index === 0}
            aria-label="Previous"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-[#0A0A0A]/80 border border-[#2A2A2A] text-[#F5F0E8] hover:border-[#D4A843] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden />
          </button>
        )}

        <div
          className="relative w-full h-full max-w-5xl flex items-center justify-center cursor-zoom-in"
          onClick={(e) => {
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            setOrigin({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100,
            });
            setZoomed((z) => !z);
          }}
          onMouseMove={(e) => {
            if (!zoomed) return;
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            setOrigin({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100,
            });
          }}
          style={{ cursor: zoomed ? "zoom-out" : "zoom-in" }}
        >
          {current?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.url}
              alt={current.alt}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{
                transform: zoomed ? "scale(2)" : "scale(1)",
                transformOrigin: `${origin.x}% ${origin.y}%`,
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-[#3A3A3A]">
              <span className="text-[200px] sm:text-[280px] opacity-60 select-none" aria-hidden>
                {placeholderEmoji}
              </span>
              <p className="font-[family-name:var(--font-source-serif)] text-sm">
                {current?.alt}
              </p>
            </div>
          )}
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(i + 1, images.length - 1))}
            disabled={index === images.length - 1}
            aria-label="Next"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-[#0A0A0A]/80 border border-[#2A2A2A] text-[#F5F0E8] hover:border-[#D4A843] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" aria-hidden />
          </button>
        )}
      </div>

      {/* Hint */}
      <p className="text-center font-[family-name:var(--font-jetbrains)] text-[10px] text-[#666] py-3 flex items-center justify-center gap-1.5">
        <ZoomIn className="w-3 h-3" aria-hidden />
        {zoomed ? "Click again to zoom out" : "Click image to zoom"}
      </p>
    </div>
  );
}
