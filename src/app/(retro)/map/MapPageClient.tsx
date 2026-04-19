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

interface CtaConfig {
  id: string;
  title: string;
  sublabel: string;
  href: string;
  position: React.CSSProperties;
  badge?: string;
}

const CTAS_BY_CONTINENT: Record<Continent, CtaConfig[]> = {
  europe: [
    {
      id: "cartera",
      title: "MI CARTERA DE FICHAJES",
      sublabel: "TUS OJEADAS Y WISHLIST",
      href: "/wishlist",
      position: { top: "8%", left: "25%" },
    },
    {
      id: "drops",
      title: "DAILY DROPS",
      sublabel: "PRÓXIMA CAÍDA EN 04H",
      href: "/drops",
      position: { top: "15%", right: "8%" },
    },
    {
      id: "explorar",
      title: "EXPLORAR TODO",
      sublabel: "247 PIEZAS",
      href: "/browse",
      position: { bottom: "15%", right: "30%" },
    },
    {
      id: "mundial",
      title: "IR AL MUNDIAL",
      sublabel: "SELECCIONES · USA/CAN/MEX 2026",
      href: "/world-hype",
      position: { top: "45%", left: "3%" },
      badge: "NEW",
    },
  ],
  americas: [
    {
      id: "cartera",
      title: "MI CARTERA DE FICHAJES",
      sublabel: "TUS OJEADAS Y WISHLIST",
      href: "/wishlist",
      position: { top: "15%", left: "5%" },
    },
    {
      id: "drops",
      title: "DAILY DROPS",
      sublabel: "PRÓXIMA CAÍDA EN 04H",
      href: "/drops",
      position: { top: "65%", right: "8%" },
    },
    {
      id: "explorar",
      title: "EXPLORAR TODO",
      sublabel: "247 PIEZAS",
      href: "/browse",
      position: { bottom: "25%", left: "10%" },
    },
    {
      id: "mundial",
      title: "IR AL MUNDIAL",
      sublabel: "SELECCIONES · USA/CAN/MEX 2026",
      href: "/world-hype",
      position: { top: "40%", right: "3%" },
      badge: "NEW",
    },
  ],
};

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

  const ctaList = CTAS_BY_CONTINENT[continent];

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

          {/* Floating CTAs — per-continent, positioned over water / empty areas */}
          {ctaList.map((cta) => (
            <CtaFloat key={cta.id} cta={cta} />
          ))}
        </div>

        {/* Onboarding bar — 90px, below map, full width of map column */}
        <OnboardingBar state={onboardingState} />
      </div>
    </div>
  );
}

/**
 * Floating menu button — PC Fútbol style beveled box on the map surface.
 * Compact (160×84) so it fits over water without encroaching on landmass.
 */
function CtaFloat({ cta }: { cta: CtaConfig }) {
  return (
    <div style={{ position: "absolute", ...cta.position, zIndex: 15 }}>
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
          alignItems: "center",
          justifyContent: "center",
          width: 160,
          height: 84,
          borderWidth: 3,
          borderStyle: "outset",
          borderColor: "#4A5A8E",
          background: "linear-gradient(180deg, #1E2A5E, #2A3A6E)",
          boxShadow: "3px 3px 0 rgba(0,0,0,0.45)",
          textDecoration: "none",
          color: "#D4A843",
          padding: 6,
          gap: 4,
          cursor: "pointer",
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
        <span
          style={{
            position: "relative",
            fontFamily: "var(--font-oswald), sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#D4A843",
            textShadow: "1px 1px 0 rgba(0,0,0,0.55)",
            lineHeight: 1.05,
            textAlign: "center",
            padding: "0 4px",
          }}
        >
          {cta.title}
        </span>
        <span
          style={{
            position: "relative",
            fontFamily: "var(--font-vt323), monospace",
            fontSize: "12px",
            letterSpacing: "1px",
            color: "#8AA0C8",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {cta.sublabel}
        </span>
      </Link>
    </div>
  );
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
