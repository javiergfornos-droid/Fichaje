"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RetroMap from "@/components/retro/RetroMap";
import type { Country } from "@/types/country";
import type { Club } from "@/types/club";

type Continent = "europe" | "americas";

interface MapPageClientProps {
  countries: Country[];
  clubs: Club[];
}

type CtaIconId = "wallet" | "trophy" | "loupe" | "bolt";

interface CtaConfig {
  id: string;
  title: string;
  sublabel: string;
  href: string;
  gradient: string;
  icon: CtaIconId;
  badge?: string;
}

/** Ordered top → bottom, identical in both continents. */
const CTAS: CtaConfig[] = [
  {
    id: "cartera",
    title: "MI CARTERA DE FICHAJES",
    sublabel: "TUS OJEADAS Y WISHLIST",
    href: "/wishlist",
    gradient: "linear-gradient(180deg, #2A3A6E, #1A2A5E)",
    icon: "wallet",
  },
  {
    id: "mundial",
    title: "IR AL MUNDIAL",
    sublabel: "SELECCIONES · USA/CAN/MEX 2026",
    href: "/world-hype",
    gradient: "linear-gradient(180deg, #3A4A7E, #2A3A6E)",
    icon: "trophy",
    badge: "NEW",
  },
  {
    id: "explorar",
    title: "EXPLORAR TODO",
    sublabel: "247 PIEZAS",
    href: "/browse",
    gradient: "linear-gradient(180deg, #1E2A5E, #0F1A3E)",
    icon: "loupe",
  },
  {
    id: "drops",
    title: "DAILY DROPS",
    sublabel: "PRÓXIMA CAÍDA EN 04H",
    href: "/drops",
    gradient: "linear-gradient(180deg, #3A4A7E, #2A3A6E)",
    icon: "bolt",
  },
];

const CLUB_COUNT_BY_COUNTRY_DEFAULT = 0;

/**
 * Client-side map page — PC Fútbol layout with vertical continent tabs on the left,
 * framed map area with floating menu CTAs, and an onboarding instruction bar below.
 */
export default function MapPageClient({ countries, clubs }: MapPageClientProps) {
  const [continent, setContinent] = useState<Continent>("europe");
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [inactiveMessage, setInactiveMessage] = useState<string | null>(null);

  const activeCountryIds = useMemo(
    () => [...new Set(clubs.map((c) => c.country_id))],
    [clubs]
  );
  const activeSet = useMemo(() => new Set(activeCountryIds), [activeCountryIds]);

  const clubCountByCountry = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of clubs) {
      counts[c.country_id] = (counts[c.country_id] ?? 0) + 1;
    }
    return counts;
  }, [clubs]);

  useEffect(() => {
    if (!inactiveMessage) return;
    const timer = setTimeout(() => setInactiveMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [inactiveMessage]);

  const handleActiveClick = (country: Country) => {
    setSelectedCountryId(country.id);
    setInactiveMessage(null);
    // TODO: replace with router.push(`/fichaje/pais/${country.id}`)
    console.log({ slug: country.id });
  };

  const handleInactiveClick = (country: Country) => {
    setInactiveMessage(`SIN CAMISETAS DE ${country.name}`);
  };

  // Onboarding bar state resolution: inactive-message wins, then hover on active, otherwise default
  const onboardingState = useMemo(() => {
    if (inactiveMessage) {
      return {
        kind: "error" as const,
        main: `[!] ${inactiveMessage}`,
        sub: "ELIGE UN PAÍS RESALTADO CON BANDERA",
      };
    }
    if (hoveredCountry && activeSet.has(hoveredCountry.id)) {
      const clubCount =
        clubCountByCountry[hoveredCountry.id] ?? CLUB_COUNT_BY_COUNTRY_DEFAULT;
      return {
        kind: "hover" as const,
        main: `CLICK PARA VER CAMISETAS DE ${hoveredCountry.name}`,
        sub: `${clubCount} CLUB${clubCount !== 1 ? "ES" : ""} · ${clubCount * 3} CAMISETAS`,
      };
    }
    return {
      kind: "default" as const,
      main: "HAZ CLICK EN UN PAÍS PARA VER SUS CAMISETAS",
      sub: "Fichajes de clubes · 30 países · 247 camisetas disponibles",
    };
  }, [inactiveMessage, hoveredCountry, activeSet, clubCountByCountry]);

  return (
    <div
      className="flex gap-0 max-w-[1200px] mx-auto"
      style={{
        paddingTop: 16,
        height: "calc(100vh - 56px - 32px - 2rem)",
      }}
    >
      {/* ── Left vertical continent tabs ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 42,
          gap: 2,
        }}
      >
        {(["europe", "americas"] as Continent[]).map((c) => {
          const isActive = continent === c;
          return (
            <button
              key={c}
              onClick={() => {
                setContinent(c);
                setSelectedCountryId(null);
                setInactiveMessage(null);
                setHoveredCountry(null);
              }}
              className={isActive ? "animate-tab-pulse" : undefined}
              style={{
                flex: 1,
                position: "relative",
                background: isActive
                  ? "linear-gradient(90deg, #8B2010, #3A1008 60%)"
                  : "linear-gradient(90deg, #2A3A54, #1E2E48)",
                border: "2px solid #1A2640",
                borderRight: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: 0,
                transition: "filter 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.filter =
                    "brightness(1.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.filter = "none";
                }
              }}
            >
              {/* Red accent stripe on left edge */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: isActive
                    ? "linear-gradient(180deg, #FF4020, #CC3018, #8B2010)"
                    : "linear-gradient(180deg, #4A2818, #3A1808)",
                }}
              />
              {/* Horizontal scan-line texture */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "repeating-linear-gradient(180deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 3px)",
                  pointerEvents: "none",
                }}
              />
              {/* Vertical text */}
              <span
                style={{
                  writingMode: "vertical-lr",
                  transform: "rotate(180deg)",
                  fontFamily:
                    "var(--font-press-start), var(--font-oswald), sans-serif",
                  fontWeight: 700,
                  fontSize: "10px",
                  letterSpacing: "8px",
                  color: isActive ? "#E8C840" : "#5A6A7A",
                  textTransform: "uppercase",
                  position: "relative",
                  zIndex: 1,
                  textShadow: isActive
                    ? "0 1px 2px rgba(0,0,0,0.5)"
                    : "none",
                }}
              >
                {c === "europe" ? "EUROPA" : "SUDAMERICA"}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Map + onboarding bar column ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Relative wrapper for map + overlays (date box, season box, CTAs) */}
        <div className="relative flex-1 min-h-0">
          <RetroMap
            continent={continent}
            countries={countries}
            selectedCountry={selectedCountryId}
            activeCountryIds={activeCountryIds}
            onActiveClick={handleActiveClick}
            onInactiveClick={handleInactiveClick}
            onHoverCountry={setHoveredCountry}
          />

          {/* Date-clock — top-left corner, inside the map frame */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              zIndex: 20,
              background: "linear-gradient(180deg, #2A3A54, #1A2A44)",
              border: "2px outset #4a5a7a",
              padding: "2px 10px",
              fontFamily: "var(--font-vt323), monospace",
              fontSize: "18px",
              lineHeight: 1,
              color: "#E8DCC8",
              letterSpacing: "1px",
              boxShadow: "2px 2px 0 rgba(0,0,0,0.5)",
            }}
          >
            SEP-15 <span style={{ color: "#8A9AAA" }}>|</span> 1996
          </div>

          {/* Season tag — top-right corner, inside the map frame */}
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 20,
              background: "linear-gradient(180deg, #2A3A54, #1A2A44)",
              border: "2px outset #4a5a7a",
              padding: "3px 10px",
              fontFamily: "var(--font-oswald), sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              color: "#E8C840",
              letterSpacing: "2px",
              textTransform: "uppercase",
              boxShadow: "2px 2px 0 rgba(0,0,0,0.5)",
            }}
          >
            Temporada 1996/97
          </div>

          {/* Floating CTAs — vertical column over the ocean: Atlántico izquierdo (EU)
              or Atlántico derecho (SA). Same order, size and spacing on both continents. */}
          <div
            style={{
              position: "absolute",
              top: "8%",
              bottom: "15%",
              [continent === "europe" ? "left" : "right"]: "2.5%",
              width: 180,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              zIndex: 15,
            }}
          >
            {CTAS.map((cta) => (
              <CtaButton key={cta.id} cta={cta} />
            ))}
          </div>
        </div>

        {/* Onboarding bar — 90px, below map, full width of map column */}
        <OnboardingBar state={onboardingState} />
      </div>
    </div>
  );
}

/**
 * Vertical-column CTA button — PC Fútbol style beveled 180×80 box with pixel icon + label + sublabel.
 */
function CtaButton({ cta }: { cta: CtaConfig }) {
  return (
    <div style={{ position: "relative" }}>
      {cta.badge && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: -8,
            right: -6,
            zIndex: 2,
            background: "#C82828",
            color: "#FFF3E0",
            fontFamily: "var(--font-press-start), var(--font-oswald), sans-serif",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "1px",
            padding: "3px 6px",
            border: "2px solid #7A1010",
            boxShadow: "2px 2px 0 rgba(0,0,0,0.5)",
            textTransform: "uppercase",
          }}
        >
          {cta.badge}
        </span>
      )}
      <Link
        href={cta.href}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 180,
          height: 80,
          padding: 12,
          borderWidth: 3,
          borderStyle: "outset",
          borderColor: "#4A5A8E",
          background: cta.gradient,
          boxShadow: "3px 3px 0 rgba(0,0,0,0.45)",
          textDecoration: "none",
          color: "#D4A843",
          overflow: "hidden",
          position: "relative",
          transition: "filter 0.12s, transform 0.12s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.filter = "brightness(1.15)";
          el.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.filter = "none";
          el.style.transform = "translateY(0)";
        }}
      >
        {/* Scanline texture overlay */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(180deg, transparent 0 2px, rgba(0,0,0,0.12) 2px 3px)",
            pointerEvents: "none",
          }}
        />
        {/* Row 1: pixel icon + title */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            minWidth: 0,
          }}
        >
          <CtaIcon icon={cta.icon} />
          <span
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#D4A843",
              textShadow: "1px 1px 0 rgba(0,0,0,0.55)",
              lineHeight: 1.05,
              flex: 1,
              minWidth: 0,
            }}
          >
            {cta.title}
          </span>
        </div>
        {/* Row 2: sublabel */}
        <span
          style={{
            position: "relative",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "10px",
            letterSpacing: "0.5px",
            color: "#F5F0E8",
            opacity: 0.75,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {cta.sublabel}
        </span>
      </Link>
    </div>
  );
}

/** Inline 16×16 pixel-art icons for the CTAs — gold silhouette, no anti-aliasing. */
function CtaIcon({ icon }: { icon: CtaIconId }) {
  const GOLD = "#D4A843";
  const SHADOW = "#1A2A5E";
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    shapeRendering: "crispEdges" as const,
    style: { flexShrink: 0, imageRendering: "pixelated" as const },
    "aria-hidden": true,
  };
  switch (icon) {
    case "wallet":
      return (
        <svg {...common}>
          <g fill={GOLD}>
            <rect x="2" y="4" width="12" height="9" />
          </g>
          <g fill={SHADOW}>
            <rect x="4" y="6" width="8" height="1" />
            <rect x="4" y="8" width="8" height="1" />
            <rect x="4" y="10" width="5" height="1" />
          </g>
        </svg>
      );
    case "trophy":
      return (
        <svg {...common}>
          <g fill={GOLD}>
            {/* Cup body */}
            <rect x="4" y="2" width="8" height="5" />
            {/* Cup bottom rim */}
            <rect x="5" y="7" width="6" height="1" />
            {/* Stem */}
            <rect x="7" y="8" width="2" height="3" />
            {/* Base */}
            <rect x="4" y="11" width="8" height="2" />
          </g>
        </svg>
      );
    case "loupe":
      return (
        <svg {...common}>
          <g fill={GOLD}>
            {/* Hollow ring */}
            <rect x="2" y="2" width="8" height="1" />
            <rect x="2" y="8" width="8" height="1" />
            <rect x="2" y="2" width="1" height="7" />
            <rect x="9" y="2" width="1" height="7" />
            {/* Diagonal handle */}
            <rect x="10" y="9" width="2" height="2" />
            <rect x="11" y="10" width="2" height="2" />
            <rect x="12" y="11" width="2" height="2" />
            <rect x="13" y="12" width="2" height="2" />
          </g>
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <g fill={GOLD}>
            <rect x="8" y="1" width="3" height="2" />
            <rect x="6" y="3" width="3" height="2" />
            <rect x="4" y="5" width="5" height="2" />
            <rect x="7" y="7" width="4" height="2" />
            <rect x="5" y="9" width="3" height="2" />
            <rect x="3" y="11" width="3" height="2" />
          </g>
        </svg>
      );
  }
}

interface OnboardingState {
  kind: "default" | "hover" | "error";
  main: string;
  sub: string;
}

/**
 * 90px onboarding / status bar under the map — updates dynamically with hover & error states.
 */
function OnboardingBar({ state }: { state: OnboardingState }) {
  const isError = state.kind === "error";
  return (
    <div
      style={{
        height: 90,
        marginTop: 2,
        background: isError
          ? "linear-gradient(180deg, #3A0E08, #1E0604)"
          : "linear-gradient(180deg, #1E2A5E, #0F1A3E)",
        borderWidth: 3,
        borderStyle: "outset",
        borderColor: isError ? "#8B2010" : "#4A5A8E",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 20px",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.25)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scan-line texture */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(180deg, transparent 0 2px, rgba(0,0,0,0.1) 2px 3px)",
          pointerEvents: "none",
        }}
      />
      {/* 8-bit pixel arrow pointing at the map */}
      <PixelArrow color={isError ? "#FFB8A0" : "#D4A843"} />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 4,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            fontWeight: 700,
            fontSize: "22px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: isError ? "#FFB8A0" : "#F5F0E8",
            lineHeight: 1.05,
            textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
          }}
        >
          {state.main}
        </span>
        <span
          style={{
            fontFamily: "var(--font-vt323), monospace",
            fontSize: "14px",
            letterSpacing: "1px",
            color: isError ? "#F0A888" : "#D4A843",
            opacity: 0.85,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {state.sub}
        </span>
      </div>
    </div>
  );
}

/** Inline SVG 8-bit arrow pointing right — no emojis. */
function PixelArrow({ color }: { color: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden
      style={{ flexShrink: 0, filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.4))" }}
    >
      <g fill={color}>
        {/* shaft */}
        <rect x="2" y="6" width="8" height="4" />
        {/* stepped arrowhead */}
        <rect x="9" y="4" width="2" height="8" />
        <rect x="10" y="5" width="2" height="6" />
        <rect x="11" y="6" width="2" height="4" />
        <rect x="12" y="7" width="2" height="2" />
      </g>
    </svg>
  );
}
