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
  title: string;
  sublabel: string;
  href: string;
  position: React.CSSProperties;
}

const CTA_LIST: CtaConfig[] = [
  {
    title: "MI COLECCIÓN",
    sublabel: "4 CAMISETAS",
    href: "/wishlist",
    position: { top: "5%", left: "30%" },
  },
  {
    title: "DAILY DROPS",
    sublabel: "PRÓXIMA CAÍDA EN 04H",
    href: "/drops",
    position: { top: "15%", right: "8%" },
  },
  {
    title: "EXPLORAR TODO",
    sublabel: "247 PIEZAS",
    href: "/browse",
    position: { bottom: "15%", right: "30%" },
  },
];

/**
 * Client-side map page — PC Fútbol layout with vertical continent tabs on the left,
 * framed map area with floating menu CTAs, and bottom info bar.
 */
export default function MapPageClient({ countries, clubs }: MapPageClientProps) {
  const [continent, setContinent] = useState<Continent>("europe");
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [inactiveMessage, setInactiveMessage] = useState<string | null>(null);

  const activeCountryIds = useMemo(
    () => [...new Set(clubs.map((c) => c.country_id))],
    [clubs]
  );

  const selectedCountry = useMemo(
    () => countries.find((c) => c.id === selectedCountryId) ?? null,
    [countries, selectedCountryId]
  );

  const selectedClubsCount = useMemo(
    () =>
      selectedCountryId
        ? clubs.filter((c) => c.country_id === selectedCountryId).length
        : 0,
    [clubs, selectedCountryId]
  );

  useEffect(() => {
    if (!inactiveMessage) return;
    const timer = setTimeout(() => setInactiveMessage(null), 2000);
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

  return (
    <div className="flex gap-0 h-[calc(100vh-56px-32px-2rem)] sm:h-[calc(100vh-64px-32px-2rem)] max-w-[1200px] mx-auto">
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

      {/* ── Map + bottom bar column ── */}
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

          {/* Floating CTAs — 3 navigation buttons positioned over empty areas of the map */}
          {CTA_LIST.map((cta) => (
            <CtaFloat key={cta.title} cta={cta} />
          ))}
        </div>

        {/* Bottom info bar */}
        <div
          style={{
            height: 32,
            background: inactiveMessage
              ? "linear-gradient(180deg, #5A2018, #3A1008)"
              : "linear-gradient(180deg, #2A3A54, #1E2E48)",
            border: "2px solid #1A2640",
            borderTop: "1px solid #3A4A6A",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            transition: "background 0.2s",
          }}
        >
          {inactiveMessage ? (
            <span
              style={{
                fontFamily: "var(--font-vt323), monospace",
                fontSize: "18px",
                color: "#FFB8A0",
                letterSpacing: "1px",
              }}
            >
              [!] {inactiveMessage}
            </span>
          ) : selectedCountry ? (
            <span
              style={{
                fontFamily: "var(--font-vt323), monospace",
                fontSize: "18px",
                color: "#D4CC98",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                className={`fi fi-${selectedCountry.iso_code}`}
                style={{
                  display: "inline-block",
                  width: 20,
                  height: 14,
                  border: "1px solid #000",
                  imageRendering: "pixelated",
                }}
              />
              {selectedCountry.name} — {selectedClubsCount} CLUB
              {selectedClubsCount !== 1 ? "ES" : ""}
            </span>
          ) : (
            <span
              style={{
                fontFamily: "var(--font-vt323), monospace",
                fontSize: "18px",
                color: "#6A7A8A",
                letterSpacing: "1px",
              }}
            >
              SELECCIONA UN PAÍS
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Floating menu button — PC Fútbol style beveled box on the map surface.
 */
function CtaFloat({ cta }: { cta: CtaConfig }) {
  return (
    <Link
      href={cta.href}
      style={{
        position: "absolute",
        ...cta.position,
        zIndex: 15,
        width: 180,
        height: 100,
        borderWidth: 3,
        borderStyle: "outset",
        borderColor: "#4A5A8E",
        background: "linear-gradient(180deg, #1E2A5E, #2A3A6E)",
        boxShadow: "3px 3px 0 rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        color: "#D4A843",
        padding: 8,
        gap: 6,
        cursor: "pointer",
        overflow: "hidden",
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
          fontSize: "18px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#D4A843",
          textShadow: "1px 1px 0 rgba(0,0,0,0.55)",
          lineHeight: 1,
        }}
      >
        {cta.title}
      </span>
      <span
        style={{
          position: "relative",
          fontFamily: "var(--font-vt323), monospace",
          fontSize: "13px",
          letterSpacing: "1px",
          color: "#8AA0C8",
          textTransform: "uppercase",
        }}
      >
        {cta.sublabel}
      </span>
    </Link>
  );
}
