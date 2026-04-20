"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ClubShirtBadge from "@/components/retro/ClubShirtBadge";
import type { MockShirt, MockClub } from "@/lib/mocks/clubs-and-shirts";
import { getShirtMedia } from "@/lib/utils/shirt-helpers";
import { useI18n } from "@/contexts/I18nContext";

// ─── Palette (saturated PC Fútbol) ─────────────────────────
const NAVY = "#1E2A5E";
const CREAM = "#F5F0E8";
const GOLD = "#D4A843";
const GOLD_LIGHT = "#F0DA68";
const RED = "#C82828";
const BLACK = "#0A0A0A";
const BG_GREY = "#D0D0D0";

// Attribute box colors
const BOX_YEAR = "#A8C848";
const BOX_TYPE = "#D8A878";
const BOX_SIZE = "#A8C0E0";
const BOX_BRAND = "#B8A0D0";
const BOX_COMP = "#D0D0D0";
const BOX_COND = "#E0B8B8";

// Offer row colors
const OFFER_RED = "#D82020";
const OFFER_ORANGE = "#E8802A";
const OFFER_BLUE = "#3A5EA0";

// ─── Small helpers ─────────────────────────────────────────
const OUTSET = (w = 2) => `${w}px outset`;

/** Bevel colors matching Win95 (light top/left, dark bottom/right). */
const bevelOutset = (w = 2) => ({
  borderWidth: w,
  borderStyle: "solid" as const,
  borderTopColor: "#E8E8E8",
  borderLeftColor: "#E8E8E8",
  borderRightColor: "#606060",
  borderBottomColor: "#606060",
});

const bevelInset = (w = 2) => ({
  borderWidth: w,
  borderStyle: "solid" as const,
  borderTopColor: "#606060",
  borderLeftColor: "#606060",
  borderRightColor: "#E8E8E8",
  borderBottomColor: "#E8E8E8",
});

// Color thresholds for stat bars + MEDIA box
function statBarColor(v: number): string {
  if (v >= 90) return GOLD;
  if (v >= 80) return "#50A030";
  if (v >= 70) return "#E8C040";
  if (v >= 60) return "#E8802A";
  return "#D04040";
}
function statBarFg(v: number): string {
  // Use cream on dark/gold, black on light yellow-greens
  return v >= 70 && v < 90 ? "#1A1408" : CREAM;
}

function formatEuro(cents: number): string {
  return `€${(cents / 100).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function typeLabelEs(t: MockShirt["type"]): string {
  switch (t) {
    case "local": return "LOCAL";
    case "away": return "VISITANTE";
    case "third": return "TERCERA";
    case "goalkeeper": return "PORTERO";
    case "sweatshirt": return "SUDADERA";
  }
}

function conditionLabel(v: number): string {
  if (v >= 85) return "EXCELENTE";
  if (v >= 70) return "MUY BUENA";
  return "BUENA";
}

// ─── 8-bit pixel sprites (rect-based, no anti-aliasing) ────

/** Coin with € — for the BUY NOW CTA. 24x24. */
function PixelCoinEuro({ size = 24, color = "#1A1A1A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" shapeRendering="crispEdges" aria-hidden>
      <g fill={color} style={{ imageRendering: "pixelated" }}>
        {/* Coin ring (outline only, approximate circle) */}
        <rect x={8} y={2} width={8} height={2} />
        <rect x={6} y={4} width={2} height={2} />
        <rect x={16} y={4} width={2} height={2} />
        <rect x={4} y={6} width={2} height={4} />
        <rect x={18} y={6} width={2} height={4} />
        <rect x={2} y={10} width={2} height={4} />
        <rect x={20} y={10} width={2} height={4} />
        <rect x={4} y={14} width={2} height={4} />
        <rect x={18} y={14} width={2} height={4} />
        <rect x={6} y={18} width={2} height={2} />
        <rect x={16} y={18} width={2} height={2} />
        <rect x={8} y={20} width={8} height={2} />
        {/* Euro symbol inside */}
        <rect x={10} y={6} width={4} height={2} />
        <rect x={8} y={8} width={2} height={2} />
        <rect x={8} y={10} width={6} height={2} />
        <rect x={8} y={12} width={2} height={2} />
        <rect x={8} y={14} width={6} height={2} />
        <rect x={8} y={16} width={2} height={2} />
        <rect x={10} y={18} width={4} height={2} />
      </g>
    </svg>
  );
}

/** Paper with double horizontal arrow — for the MAKE OFFER CTA. 28x28. */
function PixelOfferPaper({ size = 28, color = "#1A1A1A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" shapeRendering="crispEdges" aria-hidden>
      <g fill={color} style={{ imageRendering: "pixelated" }}>
        {/* Paper outline */}
        <rect x={4} y={2} width={20} height={2} />
        <rect x={4} y={24} width={20} height={2} />
        <rect x={4} y={4} width={2} height={20} />
        <rect x={22} y={4} width={2} height={20} />
        {/* Top decorative line */}
        <rect x={7} y={7} width={10} height={2} />
        {/* Double arrow ← shaft → */}
        <rect x={6} y={14} width={2} height={2} />
        <rect x={8} y={12} width={2} height={2} />
        <rect x={8} y={16} width={2} height={2} />
        <rect x={8} y={14} width={12} height={2} />
        <rect x={20} y={14} width={2} height={2} />
        <rect x={18} y={12} width={2} height={2} />
        <rect x={18} y={16} width={2} height={2} />
        {/* Bottom decorative line */}
        <rect x={7} y={20} width={8} height={2} />
      </g>
    </svg>
  );
}

/** Binoculars — for the WISHLIST / SCOUT CTA. 20x20. */
function PixelBinoculars({ size = 20, color = GOLD }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" shapeRendering="crispEdges" aria-hidden>
      <g fill={color} style={{ imageRendering: "pixelated" }}>
        {/* Left eyepiece — hollow square */}
        <rect x={2} y={4} width={6} height={2} />
        <rect x={2} y={6} width={2} height={8} />
        <rect x={6} y={6} width={2} height={8} />
        <rect x={2} y={14} width={6} height={2} />
        {/* Right eyepiece — hollow square */}
        <rect x={12} y={4} width={6} height={2} />
        <rect x={12} y={6} width={2} height={8} />
        <rect x={16} y={6} width={2} height={8} />
        <rect x={12} y={14} width={6} height={2} />
        {/* Bridge between eyepieces */}
        <rect x={8} y={8} width={4} height={2} />
        <rect x={8} y={10} width={4} height={2} />
      </g>
    </svg>
  );
}

function PixelTruck({ size = 20, color = GOLD }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" shapeRendering="crispEdges" aria-hidden>
      <g fill={color}>
        <rect x={1} y={6} width={10} height={8} />
        <rect x={11} y={8} width={6} height={6} />
        <rect x={13} y={6} width={2} height={2} />
      </g>
      <g fill="#1A1408">
        <rect x={3} y={14} width={4} height={3} />
        <rect x={12} y={14} width={4} height={3} />
      </g>
      <g fill={color}>
        <rect x={4} y={15} width={2} height={1} />
        <rect x={13} y={15} width={2} height={1} />
      </g>
    </svg>
  );
}

function PixelReturn({ size = 20, color = "#50A030" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" shapeRendering="crispEdges" aria-hidden>
      <g fill={color}>
        <rect x={6} y={3} width={8} height={2} />
        <rect x={4} y={5} width={2} height={2} />
        <rect x={14} y={5} width={2} height={2} />
        <rect x={2} y={7} width={2} height={6} />
        <rect x={16} y={7} width={2} height={4} />
        <rect x={4} y={13} width={2} height={2} />
        <rect x={6} y={15} width={4} height={2} />
        <rect x={8} y={9} width={2} height={2} />
        <rect x={6} y={11} width={2} height={2} />
        <rect x={10} y={11} width={2} height={2} />
      </g>
    </svg>
  );
}

function PixelShield({ size = 20, color = "#3A5EA0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" shapeRendering="crispEdges" aria-hidden>
      <g fill={color}>
        <rect x={4} y={2} width={12} height={2} />
        <rect x={3} y={4} width={14} height={6} />
        <rect x={4} y={10} width={12} height={3} />
        <rect x={5} y={13} width={10} height={2} />
        <rect x={7} y={15} width={6} height={2} />
        <rect x={9} y={17} width={2} height={1} />
      </g>
      <g fill={CREAM}>
        <rect x={9} y={6} width={2} height={6} />
        <rect x={7} y={8} width={6} height={2} />
      </g>
    </svg>
  );
}

function PixelK({ size = 20, color = RED }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" shapeRendering="crispEdges" aria-hidden>
      <g fill={color}>
        <rect x={3} y={3} width={3} height={14} />
        <rect x={13} y={3} width={3} height={3} />
        <rect x={11} y={5} width={3} height={3} />
        <rect x={9} y={7} width={3} height={2} />
        <rect x={6} y={9} width={4} height={2} />
        <rect x={9} y={11} width={3} height={2} />
        <rect x={11} y={12} width={3} height={3} />
        <rect x={13} y={14} width={3} height={3} />
      </g>
    </svg>
  );
}

// ─── Zoom dialog (Win95 window style) ──────────────────────
function ZoomDialog({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visualizando imagen"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 90vw)",
          background: "#C0C0C0",
          ...bevelOutset(4),
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 24,
            background: NAVY,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 6px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-press-start), monospace",
              fontSize: 10,
              color: CREAM,
              letterSpacing: 1,
            }}
          >
            VISUALIZANDO IMAGEN
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              width: 20,
              height: 20,
              background: "#C0C0C0",
              ...bevelOutset(2),
              fontFamily: "var(--font-press-start), monospace",
              fontSize: 10,
              color: "#1A1408",
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
          >
            X
          </button>
        </div>
        {/* Content */}
        <div
          style={{
            background: "#000",
            aspectRatio: "1 / 1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#1A1A1A",
              border: "2px dashed #606060",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-press-start), monospace",
              fontSize: 14,
              color: "#606060",
              letterSpacing: 2,
            }}
          >
            SIN FOTO DISPONIBLE
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Attribute box (SUB-BLOQUE 4.2) ────────────────────────
function AttributeBox({
  label,
  value,
  bg,
}: {
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <div
      style={{
        height: 64,
        background: bg,
        ...bevelOutset(2),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 6px",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-press-start), monospace",
          fontSize: 9,
          color: BLACK,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-bebas-neue), sans-serif",
          fontSize: 22,
          color: BLACK,
          fontWeight: 700,
          letterSpacing: 1,
          lineHeight: 1.1,
          marginTop: 2,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Stat row (SUB-BLOQUE 4.4) ─────────────────────────────
function StatRow({ label, value }: { label: string; value: number }) {
  const color = statBarColor(value);
  const fg = statBarFg(value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "3px 0" }}>
      <span
        style={{
          width: 100,
          fontFamily: "var(--font-oswald), sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color: BLACK,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 16,
          background: "#2A2A2A",
          ...bevelInset(1),
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-vt323), monospace",
              fontSize: 14,
              color: fg,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {value}
          </span>
        </div>
      </div>
      <span
        style={{
          width: 40,
          textAlign: "right",
          fontFamily: "var(--font-bebas-neue), sans-serif",
          fontSize: 20,
          color: BLACK,
          fontWeight: 700,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Offer row (SUB-BLOQUE 4.6) ────────────────────────────
function OfferRow({
  label,
  bg,
  children,
}: {
  label: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        height: 48,
        background: bg,
        ...bevelOutset(2),
        display: "flex",
        alignItems: "center",
        padding: "0 10px 0 14px",
        gap: 10,
        boxShadow: "2px 2px 0 rgba(0,0,0,0.4)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-press-start), monospace",
          fontSize: 11,
          color: CREAM,
          fontWeight: 700,
          letterSpacing: 1,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Trust badge (SUB-BLOQUE 4.8) ──────────────────────────
function TrustBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      style={{
        height: 64,
        background: BG_GREY,
        ...bevelOutset(2),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: "6px 4px",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
      }}
    >
      {icon}
      <span
        style={{
          fontFamily: "var(--font-press-start), monospace",
          fontSize: 8,
          color: BLACK,
          fontWeight: 700,
          letterSpacing: 0.5,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Accordion (BLOQUE 5) ──────────────────────────────────
function Accordion({
  title,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          height: 48,
          background: "#C8C8C8",
          ...bevelOutset(2),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          cursor: "pointer",
          boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
        }}
        aria-expanded={isOpen}
      >
        <span
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: BLACK,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            color: GOLD,
            fontSize: 14,
            fontWeight: 700,
          }}
          aria-hidden
        >
          {isOpen ? "▼" : "►"}
        </span>
      </button>
      {isOpen && (
        <div
          style={{
            background: "#DCDCDC",
            ...bevelInset(2),
            padding: 16,
            fontFamily: "var(--font-source-serif), serif",
            fontSize: 14,
            color: "#1A1A1A",
            lineHeight: 1.55,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main client component ─────────────────────────────────
interface ShirtPageClientProps {
  shirt: MockShirt;
  club: MockClub | null;
  countryName: string;
  backHref: string;
}

export default function ShirtPageClient({
  shirt,
  club,
  countryName,
  backHref,
}: ShirtPageClientProps) {
  const { locale, t } = useI18n();
  const price = shirt.price_cents;
  const media = getShirtMedia(shirt);
  const mediaColor = statBarColor(media);
  const mediaFg = statBarFg(media);

  const photos = shirt.photos ?? [];
  const slotCount = 5;
  const [activePhoto, setActivePhoto] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const minOffer = Math.round((price * shirt.min_offer_pct) / 100);
  const [offerCents, setOfferCents] = useState<number>(price);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);

  const [openAcc, setOpenAcc] = useState<Set<string>>(new Set());
  const toggleAcc = useCallback((key: string) => {
    setOpenAcc((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const adjustOffer = (deltaCents: number) => {
    setOfferCents((prev) => Math.max(0, prev + deltaCents));
  };

  const onSubmitOffer = () => {
    if (offerCents < minOffer) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      console.log("DIRECTOR DEPORTIVO: ESA OFERTA NO HAY POR DÓNDE COGERLA");
      return;
    }
    console.log("Oferta enviada:", offerCents);
  };

  const onBuyClick = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 120);
    console.log("Comprando: " + shirt.slug);
  };

  const onWishlistClick = () => {
    console.log("Wishlist: " + shirt.slug);
  };

  const clubName = club?.name ?? "Club desconocido";
  const title = `${club?.short_name ?? clubName} ${shirt.season}`.toUpperCase();
  // Longer display title for Bloque 1: club + season + (banana-like suffix if present)
  const fullTitle = `${clubName} ${shirt.season} ${shirt.brand}`.toUpperCase();
  const breadcrumb = [
    "INICIO",
    "CAMISETAS",
    (club?.name ?? "").toUpperCase(),
    title,
  ]
    .filter(Boolean)
    .join(" > ");

  const description = locale === "en" ? shirt.description_en : shirt.description_es;

  const hasKitlegit = Boolean(shirt.kitlegit_url);
  const trustCount = 3 + (hasKitlegit ? 1 : 0);

  const descLabel = locale === "en" ? "DESCRIPTION" : "DESCRIPCIÓN";
  const seasonLabel = locale === "en" ? "ABOUT THE SEASON" : "SOBRE LA TEMPORADA";
  const historyLabel = locale === "en" ? "CLUB HISTORY" : "HISTORIAL DEL CLUB";

  return (
    <div
      style={{
        background: BG_GREY,
        backgroundImage:
          "repeating-linear-gradient(2deg, #D0D0D0 0px, #D0D0D0 2px, #C8C8C8 3px, #D0D0D0 5px)",
        minHeight: "calc(100vh - 60px)",
        padding: "16px 0",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
        {/* ─── Back to map ─────────────────────────────── */}
        <div style={{ marginBottom: 12 }}>
          <Link
            href={backHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              height: 40,
              padding: "0 16px",
              background: "linear-gradient(180deg, #2A3A6E, #1A2A5E)",
              border: OUTSET(3),
              borderColor: "#4A5A8E",
              color: CREAM,
              fontFamily: "var(--font-oswald), sans-serif",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
              textDecoration: "none",
              boxShadow: "2px 2px 0 rgba(0,0,0,0.45)",
            }}
          >
            <svg width={14} height={14} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden>
              <g fill={GOLD}>
                <rect x={6} y={6} width={8} height={4} />
                <rect x={5} y={4} width={2} height={8} />
                <rect x={4} y={5} width={2} height={6} />
                <rect x={3} y={6} width={2} height={4} />
                <rect x={2} y={7} width={2} height={2} />
              </g>
            </svg>
            {locale === "en" ? "BACK TO MAP" : "VOLVER AL MAPA"}
          </Link>
        </div>

        {/* ═══════════════════════════════════════════════════
            BLOQUE 1 — TÍTULO DEL PRODUCTO
            ═══════════════════════════════════════════════ */}
        <div
          style={{
            height: 72,
            background: NAVY,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            position: "relative",
            borderBottom: "3px solid transparent",
            borderImage: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}) 1`,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 20,
              fontFamily: "var(--font-press-start), monospace",
              fontSize: 9,
              color: "#8A9AAA",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {breadcrumb}
          </span>
          <h1
            style={{
              margin: 0,
              width: "100%",
              textAlign: "center",
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: 32,
              color: CREAM,
              letterSpacing: 3,
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}
          >
            {fullTitle}
          </h1>
        </div>
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`,
          }}
        />

        {/* ═══════════════════════════════════════════════════
            BLOQUE 2 — BLOQUE PRINCIPAL (58/42)
            ═══════════════════════════════════════════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "58fr 42fr",
            gap: 20,
            padding: 20,
            background: "#0A0A0A",
            ...bevelOutset(3),
            marginTop: 16,
          }}
        >
          {/* ═══════════════════════════════════════════════
              BLOQUE 3 — GALERÍA
              ══════════════════════════════════════════ */}
          <div>
            {/* Main photo */}
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              aria-label="Ampliar foto"
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                background: "#000",
                ...bevelOutset(3),
                position: "relative",
                overflow: "hidden",
                padding: 0,
                cursor: "pointer",
                display: "block",
              }}
            >
              {photos[activePhoto] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photos[activePhoto]}
                  alt={`${clubName} ${shirt.season}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 20,
                    background: "#1A1A1A",
                    border: "2px dashed #606060",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: 14,
                    color: "#606060",
                    letterSpacing: 2,
                    textAlign: "center",
                    padding: 12,
                  }}
                >
                  SIN FOTO DISPONIBLE
                </div>
              )}
              {/* Scanlines overlay */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 3px)",
                  opacity: 0.35,
                  pointerEvents: "none",
                }}
              />
            </button>

            {/* Thumbnails */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 8,
                marginTop: 12,
              }}
            >
              {Array.from({ length: slotCount }).map((_, i) => {
                const isActive = i === activePhoto;
                const photo = photos[i];
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhoto(i)}
                    aria-label={`Foto ${i + 1}`}
                    aria-pressed={isActive}
                    style={{
                      aspectRatio: "1 / 1",
                      background: "#1A1A1A",
                      borderWidth: isActive ? 3 : 2,
                      borderStyle: "solid",
                      borderTopColor: isActive ? "#F0DA68" : "#E8E8E8",
                      borderLeftColor: isActive ? "#F0DA68" : "#E8E8E8",
                      borderRightColor: isActive ? "#8A7A20" : "#606060",
                      borderBottomColor: isActive ? "#8A7A20" : "#606060",
                      padding: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt={`Miniatura ${i + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span
                        style={{
                          color: "#606060",
                          fontFamily: "var(--font-press-start), monospace",
                          fontSize: 14,
                        }}
                      >
                        —
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Counter */}
            <p
              style={{
                marginTop: 10,
                fontFamily: "var(--font-press-start), monospace",
                fontSize: 9,
                color: "#A0A0A0",
                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              FOTOS DE LA PIEZA · {activePhoto + 1} / {slotCount}
            </p>
          </div>

          {/* ═══════════════════════════════════════════════
              BLOQUE 4 — COLUMNA DERECHA
              ══════════════════════════════════════════ */}
          <div
            style={{
              position: "relative",
              paddingLeft: 48,
            }}
          >
            {/* SUB 4.1 — vertical label */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 40,
                height: "100%",
                background: "#1A1A1A",
                ...bevelInset(1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  transform: "rotate(-90deg)",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-press-start), monospace",
                  fontSize: 11,
                  color: RED,
                  fontWeight: 700,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                }}
              >
                INFORMACIÓN DE LA CAMISETA
              </span>
            </div>

            {/* SUB 4.2 — attribute grid 2×3 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "64px 64px 64px",
                gap: 8,
              }}
            >
              <AttributeBox label="AÑO" value={String(shirt.year)} bg={BOX_YEAR} />
              <AttributeBox label="TIPO" value={typeLabelEs(shirt.type)} bg={BOX_TYPE} />
              <AttributeBox label="TALLA" value={shirt.size} bg={BOX_SIZE} />
              <AttributeBox label="MARCA" value={shirt.brand.toUpperCase()} bg={BOX_BRAND} />
              <AttributeBox
                label="COMPETICIÓN"
                value={(shirt.competition ?? "PREMIER LEAGUE").toUpperCase()}
                bg={BOX_COMP}
              />
              <AttributeBox
                label="CONDICIÓN"
                value={conditionLabel(shirt.stat_condition)}
                bg={BOX_COND}
              />
            </div>

            {/* SUB 4.3 — club + status badges */}
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <div
                style={{
                  height: 48,
                  background: "#2A2A2A",
                  ...bevelOutset(2),
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 12px",
                }}
              >
                {club && <ClubShirtBadge club={club} size={32} />}
                <span
                  style={{
                    fontFamily: "var(--font-oswald), sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: CREAM,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {clubName}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  justifyContent: "center",
                }}
              >
                {shirt.match_worn && (
                  <StatusBadge label="MATCH WORN" bg={RED} fg={CREAM} />
                )}
                {shirt.kitlegit_url && (
                  <StatusBadge label="CERTIFICADO KITLEGIT" bg={GOLD} fg={BLACK} />
                )}
                {!shirt.match_worn && !shirt.kitlegit_url && (
                  <StatusBadge label="PIEZA ÚNICA" bg="#50A030" fg={CREAM} />
                )}
              </div>
            </div>

            {/* SUB 4.4 — stats panel */}
            <div
              style={{
                marginTop: 12,
                background: "#C8D8E8",
                ...bevelInset(2),
                padding: 16,
                display: "flex",
                gap: 14,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: 11,
                    color: BLACK,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  STATS
                </h2>
                <StatRow label="CONDICIÓN" value={shirt.stat_condition} />
                <StatRow label="COLOR" value={shirt.stat_color} />
                <StatRow label="INTEGRIDAD" value={shirt.stat_integrity} />
                <StatRow label="ICONICIDAD" value={shirt.stat_iconicity} />
                <div style={{ borderTop: "2px solid #2A2A2A", marginTop: 8 }} />
              </div>

              {/* MEDIA box */}
              <div
                style={{
                  width: 80,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  alignSelf: "flex-end",
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: mediaColor,
                    ...bevelOutset(3),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-bebas-neue), sans-serif",
                    fontSize: 42,
                    color: mediaFg,
                    fontWeight: 700,
                    lineHeight: 1,
                    boxShadow: "2px 2px 0 rgba(0,0,0,0.4)",
                  }}
                >
                  {media}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: 9,
                    color: BLACK,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  MEDIA
                </span>
              </div>
            </div>

            {/* SUB 4.5 — Price + PAGAR TRASPASO button */}
            <div
              style={{
                marginTop: 12,
                background: "#0A0A0A",
                ...bevelOutset(3),
                padding: "20px 16px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-bebas-neue), sans-serif",
                    fontSize: 52,
                    color: GOLD,
                    fontWeight: 700,
                    letterSpacing: 2,
                    lineHeight: 1,
                  }}
                >
                  {formatEuro(price)}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: 9,
                    color: CREAM,
                    opacity: 0.7,
                    letterSpacing: 1,
                  }}
                >
                  IVA INCLUIDO · PIEZA ÚNICA
                </div>
              </div>

              <GoldCta
                label={t("shirt.cta.buy_now")}
                hint={t("shirt.cta.buy_now_hint")}
                icon={<PixelCoinEuro size={24} color="#1A1A1A" />}
                onClick={onBuyClick}
                height={64}
                labelSize={22}
                width={200}
                flashing={flash}
              />
            </div>

            {/* SUB 4.6 — Offer section */}
            <div
              style={{
                marginTop: 12,
                background: "#2A2A2A",
                padding: "20px 16px 20px 48px",
                position: "relative",
                ...bevelOutset(2),
              }}
            >
              {/* Vertical OFERTA label */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 32,
                  height: "100%",
                  background: RED,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    transform: "rotate(-90deg)",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: 11,
                    color: CREAM,
                    fontWeight: 700,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                  }}
                >
                  OFERTA
                </span>
              </div>

              <div
                className={shake ? "animate-shake" : ""}
                style={{ display: "flex", flexDirection: "column", gap: 6 }}
              >
                <OfferRow label="TU OFERTA" bg={OFFER_RED}>
                  <button
                    type="button"
                    onClick={() => adjustOffer(-1000)}
                    aria-label="Reducir 10€"
                    style={arrowBtnStyle}
                  >
                    ◄
                  </button>
                  <div
                    style={{
                      width: 120,
                      height: 30,
                      background: "#0A0A0A",
                      ...bevelInset(2),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      type="number"
                      min={0}
                      value={Math.round(offerCents / 100)}
                      onChange={(e) => {
                        const v = Math.max(0, Number(e.target.value) || 0);
                        setOfferCents(v * 100);
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "transparent",
                        border: 0,
                        outline: "none",
                        textAlign: "center",
                        fontFamily: "var(--font-vt323), monospace",
                        fontSize: 20,
                        color: GOLD,
                        letterSpacing: 1,
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => adjustOffer(1000)}
                    aria-label="Aumentar 10€"
                    style={arrowBtnStyle}
                  >
                    ►
                  </button>
                </OfferRow>

                <OfferRow label="PRECIO DE LISTA" bg={OFFER_ORANGE}>
                  <span
                    style={{
                      fontFamily: "var(--font-vt323), monospace",
                      fontSize: 20,
                      color: CREAM,
                      paddingRight: 6,
                    }}
                  >
                    {formatEuro(price)}
                  </span>
                </OfferRow>

                <OfferRow label="ENVÍO APROX." bg={OFFER_BLUE}>
                  <span
                    style={{
                      fontFamily: "var(--font-vt323), monospace",
                      fontSize: 18,
                      color: CREAM,
                      paddingRight: 6,
                    }}
                  >
                    €15,00 · ESPAÑA
                  </span>
                </OfferRow>
              </div>

              {/* HACER OFERTA — primary CTA inside OFERTA panel */}
              <div style={{ marginTop: 12 }}>
                <GoldCta
                  label={t("shirt.cta.make_offer")}
                  hint={t("shirt.cta.make_offer_hint")}
                  icon={<PixelOfferPaper size={28} color="#1A1A1A" />}
                  onClick={onSubmitOffer}
                  height={72}
                  labelSize={26}
                  width="100%"
                />
              </div>
            </div>

            {/* SUB 4.7 — MANDAR UN OJEADOR (wishlist, tertiary) */}
            <div style={{ marginTop: 12 }}>
              <GhostCta
                label={t("shirt.cta.wishlist")}
                hint={t("shirt.cta.wishlist_hint")}
                icon={<PixelBinoculars size={20} color={GOLD} />}
                onClick={onWishlistClick}
                height={56}
                labelSize={18}
              />
            </div>

            {/* SUB 4.8 — Trust badges */}
            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: `repeat(${trustCount}, 1fr)`,
                gap: 8,
              }}
            >
              <TrustBadge icon={<PixelTruck color={GOLD} />} label="ENVÍO 24-48H" />
              <TrustBadge icon={<PixelReturn color="#50A030" />} label="DEVOL. 14 DÍAS" />
              <TrustBadge icon={<PixelShield color="#3A5EA0" />} label="AUTENTICIDAD" />
              {hasKitlegit && <TrustBadge icon={<PixelK color={RED} />} label="KITLEGIT" />}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            BLOQUE 5 — ACCORDIONS
            ═══════════════════════════════════════════════ */}
        <div style={{ background: "#B8B8B8", padding: "20px 0 0 0", marginTop: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Accordion
              title={descLabel}
              isOpen={openAcc.has("desc")}
              onToggle={() => toggleAcc("desc")}
            >
              {description.split(/\n+/).map((p, i) => (
                <p key={i} style={{ margin: i === 0 ? "0 0 10px 0" : "10px 0" }}>
                  {p}
                </p>
              ))}
            </Accordion>

            <Accordion
              title={seasonLabel}
              isOpen={openAcc.has("season")}
              onToggle={() => toggleAcc("season")}
            >
              <p style={{ margin: 0 }}>
                {locale === "en"
                  ? `This piece corresponds to the ${shirt.season} season. Detailed information about this season will be available soon.`
                  : `Esta pieza corresponde a la temporada ${shirt.season}. La información detallada sobre esta temporada estará disponible próximamente.`}
              </p>
            </Accordion>

            <Accordion
              title={historyLabel}
              isOpen={openAcc.has("history")}
              onToggle={() => toggleAcc("history")}
            >
              <p style={{ margin: 0 }}>
                {locale === "en"
                  ? `Club history and honours during ${clubName}'s ${shirt.season} era coming soon.`
                  : `Próximamente incluiremos información sobre el palmarés y hitos del ${clubName} durante esta época.`}
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {zoomOpen && <ZoomDialog onClose={() => setZoomOpen(false)} />}
      {/* Hidden suppressor for unused country var — kept for future breadcrumb expansion */}
      <span style={{ display: "none" }} aria-hidden>{countryName}</span>
    </div>
  );
}

// Small status badge used inside SUB 4.3
function StatusBadge({
  label,
  bg,
  fg,
}: {
  label: string;
  bg: string;
  fg: string;
}) {
  return (
    <div
      style={{
        height: 22,
        background: bg,
        ...bevelOutset(2),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 6px",
        fontFamily: "var(--font-press-start), monospace",
        fontSize: 9,
        color: fg,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  );
}

const arrowBtnStyle: React.CSSProperties = {
  width: 28,
  height: 30,
  background: "linear-gradient(180deg, #D8D8D8, #A8A8A8)",
  borderWidth: 2,
  borderStyle: "solid",
  borderTopColor: "#F0F0F0",
  borderLeftColor: "#F0F0F0",
  borderRightColor: "#606060",
  borderBottomColor: "#606060",
  cursor: "pointer",
  fontFamily: "var(--font-press-start), monospace",
  fontSize: 10,
  color: BLACK,
  fontWeight: 700,
  lineHeight: 1,
  padding: 0,
};

// ─── CTA buttons (label + hint + pixel icon) ───────────────

/** Two-line CTA label block (used inside both gold + ghost variants). */
function CtaBody({
  icon,
  label,
  hint,
  labelSize,
  labelColor,
  hintColor,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  labelSize: number;
  labelColor: string;
  hintColor: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        width: "100%",
        height: "100%",
        padding: "0 12px",
      }}
    >
      <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
        {icon}
      </span>
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          lineHeight: 1,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            fontSize: labelSize,
            fontWeight: 700,
            color: labelColor,
            letterSpacing: 3,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-vt323), monospace",
            fontSize: 12,
            color: labelColor,
            opacity: 0.75,
            letterSpacing: 0.5,
            textTransform: "lowercase",
            lineHeight: 1,
            marginTop: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          ({hint})
        </span>
        {/* hintColor applied via inherited color + opacity — kept here for API symmetry */}
        <span style={{ display: "none" }} aria-hidden>
          {hintColor}
        </span>
      </span>
    </div>
  );
}

/** Gold gradient primary CTA — PAGAR TRASPASO / HACER OFERTA. */
function GoldCta({
  label,
  hint,
  icon,
  onClick,
  height,
  labelSize,
  width = "100%",
  flashing = false,
}: {
  label: string;
  hint: string;
  icon: React.ReactNode;
  onClick: () => void;
  height: number;
  labelSize: number;
  width?: number | string;
  flashing?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        height,
        width,
        background: "linear-gradient(180deg, #E8C840, #C4A030)",
        borderWidth: 3,
        borderStyle: "solid",
        borderTopColor: "#F8E880",
        borderLeftColor: "#F8E880",
        borderRightColor: "#907020",
        borderBottomColor: "#907020",
        cursor: "pointer",
        color: "#1A1A1A",
        padding: 0,
        boxShadow: flashing
          ? "inset 0 0 0 9999px rgba(255,255,255,0.75)"
          : "3px 3px 0 rgba(0,0,0,0.4)",
        transition: "box-shadow 120ms",
        flexShrink: 0,
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "linear-gradient(0deg, #E8C840, #C4A030)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "linear-gradient(180deg, #E8C840, #C4A030)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "linear-gradient(180deg, #E8C840, #C4A030)";
      }}
    >
      <CtaBody
        icon={icon}
        label={label}
        hint={hint}
        labelSize={labelSize}
        labelColor="#1A1A1A"
        hintColor="#1A1A1A"
      />
    </button>
  );
}

/** Ghost transparent CTA — MANDAR UN OJEADOR. */
function GhostCta({
  label,
  hint,
  icon,
  onClick,
  height,
  labelSize,
}: {
  label: string;
  hint: string;
  icon: React.ReactNode;
  onClick: () => void;
  height: number;
  labelSize: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        height,
        width: "100%",
        background: "transparent",
        borderWidth: 2,
        borderStyle: "solid",
        borderTopColor: "#A8A8A8",
        borderLeftColor: "#A8A8A8",
        borderRightColor: "#606060",
        borderBottomColor: "#606060",
        color: "#E8DCC8",
        cursor: "pointer",
        padding: 0,
        transition: "background 100ms",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#3A3A3A";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      <CtaBody
        icon={icon}
        label={label}
        hint={hint}
        labelSize={labelSize}
        labelColor="#E8DCC8"
        hintColor="#E8DCC8"
      />
    </button>
  );
}
