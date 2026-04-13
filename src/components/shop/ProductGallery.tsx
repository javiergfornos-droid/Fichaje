"use client";

import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { track } from "@/lib/analytics";
import ImageZoomDialog from "@/components/shop/ImageZoomDialog";

interface ProductGalleryProps {
  images: { url: string | null; alt: string }[];
  placeholderEmoji?: string;
}

/**
 * Product image gallery with main image + thumbnails.
 * Clicking the main image opens a full-screen zoom dialog.
 * Mobile: full-width main image, horizontal thumbnail strip underneath.
 * Desktop: same layout, larger main image.
 * Falls back to emoji placeholder while real CDN images are wired up.
 */
export default function ProductGallery({
  images,
  placeholderEmoji = "👕",
}: ProductGalleryProps) {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const active = images[activeIndex] ?? { url: null, alt: "" };

  const openZoom = () => {
    setZoomOpen(true);
    track("gallery_image_viewed", { index: activeIndex, source: "main" });
  };

  return (
    <div className="w-full">
      {/* Main image — click to zoom */}
      <button
        type="button"
        onClick={openZoom}
        aria-label={`${active.alt} — ${t("pdp.zoomHint")}`}
        className="group relative aspect-square w-full bg-[#141414] border border-[#2A2A2A] overflow-hidden flex items-center justify-center cursor-zoom-in"
      >
        {active.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={active.url}
            alt={active.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="text-[140px] sm:text-[180px] opacity-70 select-none" aria-hidden>
            {placeholderEmoji}
          </span>
        )}
        <div className="absolute inset-0 pointer-events-none scan-lines opacity-40" />

        {/* Zoom hint chip */}
        <span
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0A0A0A]/80 border border-[#2A2A2A] text-[#F5F0E8] font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          aria-hidden
        >
          <ZoomIn className="w-3 h-3" />
          {t("pdp.zoomHint")}
        </span>
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label={t("pdp.galleryLabel")}
        >
          {images.map((img, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`${t("pdp.imageIndex", { current: String(i + 1), total: String(images.length) })}`}
                onClick={() => {
                  setActiveIndex(i);
                  track("gallery_image_viewed", { index: i, source: "thumbnail" });
                }}
                className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 flex items-center justify-center transition-colors ${
                  isActive
                    ? "border-[#D4A843] bg-[#1A1A1A]"
                    : "border-[#2A2A2A] hover:border-[#4A4A4A] bg-[#0F0F0F]"
                }`}
              >
                {img.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl opacity-70" aria-hidden>
                    {placeholderEmoji}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <ImageZoomDialog
        images={images}
        initialIndex={activeIndex}
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        placeholderEmoji={placeholderEmoji}
      />
    </div>
  );
}
