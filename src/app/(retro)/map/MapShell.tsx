"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import RetroMap from "@/components/retro/RetroMap";
import ClubShirtBadge from "@/components/retro/ClubShirtBadge";
import { DEMO_COUNTRIES } from "@/lib/mocks/countries";
import {
  CLUBS,
  getClubById,
  getClubsByCountry,
  getShirtsByClub,
  type MockClub,
} from "@/lib/mocks/clubs-and-shirts";
import type { Country } from "@/types/country";

type Continent = "europe" | "americas";
type MapState = "default" | "country" | "club";

interface MapShellProps {
  children: React.ReactNode;
}

/**
 * Orchestrates the /map experience across all 3 states:
 *   /map                       → default (100% map)
 *   /map/[country]             → country selected (55% map + right panel)
 *   /map/[country]/[club]      → club selected (35% map top + badges bottom + 65% roster right)
 *
 * RetroMap is used as-is (no internal changes); the shell wraps it from the outside
 * and drives its width, selectedCountry and click handlers.
 */
export default function MapShell({ children }: MapShellProps) {
  const router = useRouter();
  const params = useParams<{ country?: string; club?: string }>();
  const countryId = params?.country;
  const clubId = params?.club;

  const state: MapState = clubId ? "club" : countryId ? "country" : "default";

  const [userContinent, setUserContinent] = useState<Continent>("europe");
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [inactiveMessage, setInactiveMessage] = useState<string | null>(null);

  // Derive continent: follow the URL's country when present, else user's tab.
  const selectedCountry = useMemo(
    () => (countryId ? DEMO_COUNTRIES.find((c) => c.id === countryId) : null),
    [countryId]
  );
  const continent: Continent =
    selectedCountry?.continent ?? userContinent;

  // Clubs that exist in the mocks drive the "active" polygons on the map.
  const activeCountryIds = useMemo(
    () => [...new Set(CLUBS.map((c) => c.country_id))],
    []
  );
  const activeSet = useMemo(() => new Set(activeCountryIds), [activeCountryIds]);

  const clubCountByCountry = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of CLUBS) m[c.country_id] = (m[c.country_id] ?? 0) + 1;
    return m;
  }, []);

  // Inactive click message auto-clears after 2.5s
  useEffect(() => {
    if (!inactiveMessage) return;
    const t = setTimeout(() => setInactiveMessage(null), 2500);
    return () => clearTimeout(t);
  }, [inactiveMessage]);

  const handleActiveClick = (country: Country) => {
    setInactiveMessage(null);
    // If already on /map/<same country>, clicking again doesn't re-navigate
    if (country.id === countryId) return;
    router.push(`/map/${country.id}`);
  };

  const handleInactiveClick = (country: Country) => {
    setInactiveMessage(`SIN CAMISETAS DE ${country.name}`);
  };

  const handleContinentTab = (c: Continent) => {
    setUserContinent(c);
    setInactiveMessage(null);
    setHoveredCountry(null);
    // Leaving any country/club route on tab switch — reset to /map
    if (countryId) router.push("/map");
  };

  // Map width per state — drives the CSS transition.
  const mapLeftWidth =
    state === "default" ? "100%" : state === "country" ? "55%" : "35%";

  // Clubs of the current country (for state 3 badge row + state 2 card count)
  const clubsOfCountry = useMemo(
    () => (countryId ? getClubsByCountry(countryId) : []),
    [countryId]
  );

  const currentClub: MockClub | undefined = clubId
    ? getClubById(clubId)
    : undefined;

  // Onboarding bar resolution
  const onboardingState = useMemo(() => {
    if (inactiveMessage) {
      return {
        kind: "error" as const,
        main: `[!] ${inactiveMessage}`,
        sub: "ELIGE UN PAÍS RESALTADO CON BANDERA",
      };
    }
    if (state === "club" && currentClub) {
      const shirtCount = getShirtsByClub(currentClub.id).length;
      return {
        kind: "default" as const,
        main: `ELIGE UNA CAMISETA DE ${currentClub.short_name} PARA VER SUS DETALLES`,
        sub: `${shirtCount} CAMISETAS · TEMPORADA 1996/97`,
      };
    }
    if (state === "country" && selectedCountry) {
      const clubCount = clubsOfCountry.length;
      return {
        kind: "default" as const,
        main: `ELIGE UN CLUB DE ${selectedCountry.name} PARA VER SUS CAMISETAS`,
        sub: `${clubCount} CLUB${clubCount !== 1 ? "ES" : ""} · TEMPORADA 1996/97`,
      };
    }
    if (hoveredCountry && activeSet.has(hoveredCountry.id)) {
      const clubCount = clubCountByCountry[hoveredCountry.id] ?? 0;
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
  }, [
    inactiveMessage,
    state,
    currentClub,
    selectedCountry,
    clubsOfCountry.length,
    hoveredCountry,
    activeSet,
    clubCountByCountry,
  ]);

  return (
    <div
      className="flex gap-0 max-w-[1400px] mx-auto"
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
              onClick={() => handleContinentTab(c)}
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
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "repeating-linear-gradient(180deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 3px)",
                  pointerEvents: "none",
                }}
              />
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
                  textShadow: isActive ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
                }}
              >
                {c === "europe" ? "EUROPA" : "SUDAMERICA"}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Main content column ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Middle row: left (map + optional badges grid) + right panel */}
        <div className="flex gap-2 flex-1 min-h-0">
          {/* Left column — map + (state 3) club badges row */}
          <div
            style={{
              width: mapLeftWidth,
              flexShrink: 0,
              transition: "width 0.16s ease-out",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              minWidth: 0,
            }}
          >
            {/* Map region */}
            <div
              className="relative min-h-0"
              style={{
                flex: state === "club" ? 6 : 1,
                transition: "flex 0.16s ease-out",
              }}
            >
              <RetroMap
                continent={continent}
                countries={DEMO_COUNTRIES}
                selectedCountry={countryId ?? null}
                activeCountryIds={activeCountryIds}
                onActiveClick={handleActiveClick}
                onInactiveClick={handleInactiveClick}
                onHoverCountry={setHoveredCountry}
              />

              {/* Date-clock — top-left corner, inside the map frame.
                  The contextual back button lives in the right-panel header now
                  (where the user's attention is), not here. */}
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

              {/* Season tag — top-right corner */}
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

              {/* CTA column — default state only, so the contracted maps stay clean */}
              {state === "default" && (
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
              )}
            </div>

            {/* State 3 — club shirt badges grid under the mini-map */}
            {state === "club" && (
              <ClubBadgesRow
                clubs={clubsOfCountry}
                selectedClubId={clubId}
                countryId={countryId!}
              />
            )}
          </div>

          {/* Right panel — injected by child page */}
          {state !== "default" && (
            <div
              key={`${countryId}-${clubId ?? ""}`}
              className="flex-1 min-w-0 animate-slide-fade-in-right"
            >
              {children}
            </div>
          )}
        </div>

        {/* Onboarding / status bar */}
        <OnboardingBar state={onboardingState} />
      </div>
    </div>
  );
}

/* ────────────────────── CTA column (default state) ────────────────────── */

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
            fontFamily:
              "var(--font-press-start), var(--font-oswald), sans-serif",
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
            <rect x="4" y="2" width="8" height="5" />
            <rect x="5" y="7" width="6" height="1" />
            <rect x="7" y="8" width="2" height="3" />
            <rect x="4" y="11" width="8" height="2" />
          </g>
        </svg>
      );
    case "loupe":
      return (
        <svg {...common}>
          <g fill={GOLD}>
            <rect x="2" y="2" width="8" height="1" />
            <rect x="2" y="8" width="8" height="1" />
            <rect x="2" y="2" width="1" height="7" />
            <rect x="9" y="2" width="1" height="7" />
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

/* ────────────────────── Onboarding bar ────────────────────── */

interface OnboardingState {
  kind: "default" | "hover" | "error";
  main: string;
  sub: string;
}

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

function PixelArrow({ color }: { color: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden
      style={{
        flexShrink: 0,
        filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.4))",
      }}
    >
      <g fill={color}>
        <rect x="2" y="6" width="8" height="4" />
        <rect x="9" y="4" width="2" height="8" />
        <rect x="10" y="5" width="2" height="6" />
        <rect x="11" y="6" width="2" height="4" />
        <rect x="12" y="7" width="2" height="2" />
      </g>
    </svg>
  );
}


/* ────────────────────── Club badges row (state 3) ────────────────────── */

function ClubBadgesRow({
  clubs,
  selectedClubId,
  countryId,
}: {
  clubs: MockClub[];
  selectedClubId: string | undefined;
  countryId: string;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #1E2A5E, #0F1A3E)",
        borderWidth: 3,
        borderStyle: "outset",
        borderColor: "#4A5A8E",
        padding: 10,
        overflow: "auto",
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignContent: "flex-start",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3)",
      }}
    >
      {clubs.map((club) => {
        const isSelected = club.id === selectedClubId;
        return (
          <Link
            key={club.id}
            href={`/map/${countryId}/${club.id}`}
            title={club.name}
            aria-label={club.name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 4,
              borderWidth: 3,
              borderStyle: "outset",
              borderColor: isSelected ? "#D4A843" : "#2A3A54",
              background: isSelected
                ? "linear-gradient(180deg, #3A2E10, #1A1808)"
                : "linear-gradient(180deg, #22304F, #0F1A33)",
              textDecoration: "none",
              cursor: "pointer",
              transition: "filter 0.12s, transform 0.12s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.filter =
                "brightness(1.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.filter = "none";
            }}
          >
            <ClubShirtBadge club={club} size={40} />
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: 9,
                color: isSelected ? "#E8C840" : "#8AA0C8",
                letterSpacing: "0.5px",
                marginTop: 2,
                maxWidth: 48,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {club.short_name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
