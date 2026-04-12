"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: { url: string | null; alt: string }[];
  placeholderEmoji?: string;
}

/**
 * Product image gallery with main image + thumbnails.
 * Mobile: full-width main image, horizontal thumbnail strip underneath.
 * Desktop: same layout, larger main image.
 * Falls back to emoji placeholder while real CDN images are wired up.
 */
export default function ProductGallery({
  images,
  placeholderEmoji = "👕",
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? { url: null, alt: "" };

  return (
    <div className="w-full">
      {/* Main image */}
      <div
        className="relative aspect-square w-full bg-[#141414] border border-[#2A2A2A] overflow-hidden flex items-center justify-center"
        role="img"
        aria-label={active.alt}
      >
        {active.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={active.url}
            alt={active.alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[140px] sm:text-[180px] opacity-70 select-none" aria-hidden>
            {placeholderEmoji}
          </span>
        )}
        <div className="absolute inset-0 pointer-events-none scan-lines opacity-40" />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Imágenes del producto"
        >
          {images.map((img, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Imagen ${i + 1} de ${images.length}`}
                onClick={() => setActiveIndex(i)}
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
    </div>
  );
}
