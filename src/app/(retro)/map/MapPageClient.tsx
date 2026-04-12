"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RetroMap from "@/components/retro/RetroMap";
import ClubPanel from "@/components/retro/ClubPanel";
import type { Country } from "@/types/country";
import type { Club } from "@/types/club";

type Continent = "europe" | "americas";

interface MapPageClientProps {
  countries: Country[];
  clubs: Club[];
}

/**
 * Client-side map page — PC Fútbol layout with vertical continent tabs
 * on the left, framed map area, and bottom info bar.
 */
export default function MapPageClient({ countries, clubs }: MapPageClientProps) {
  const [continent, setContinent] = useState<Continent>("europe");
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  const clubCountryIds = useMemo(
    () => [...new Set(clubs.map((c) => c.country_id))],
    [clubs]
  );

  const countryInfo = useMemo(
    () =>
      Object.fromEntries(
        countries.map((c) => [c.id, { flag: c.flag, name: c.name }])
      ),
    [countries]
  );

  const selectedCountry = useMemo(
    () => countries.find((c) => c.id === selectedCountryId) ?? null,
    [countries, selectedCountryId]
  );

  const selectedClubs = useMemo(
    () =>
      selectedCountryId
        ? clubs
            .filter((c) => c.country_id === selectedCountryId)
            .sort((a, b) => a.sort_order - b.sort_order)
        : [],
    [clubs, selectedCountryId]
  );

  return (
    <div className="flex gap-0 h-[calc(100vh-60px)]">
      {/* ── Left vertical continent tabs ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 38,
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
              }}
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
                  fontFamily: "var(--font-oswald)",
                  fontWeight: 700,
                  fontSize: "12px",
                  letterSpacing: "2px",
                  color: isActive ? "#E8C840" : "#5A6A7A",
                  textTransform: "uppercase",
                  position: "relative",
                  zIndex: 1,
                  textShadow: isActive
                    ? "0 1px 2px rgba(0,0,0,0.5)"
                    : "none",
                }}
              >
                {c === "europe" ? "EUROPA" : "SUDAMÉRICA"}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Map + bottom bar ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <RetroMap
          continent={continent}
          selectedCountry={selectedCountryId}
          onSelectCountry={setSelectedCountryId}
          clubCountryIds={clubCountryIds}
          countryInfo={countryInfo}
        />

        {/* Bottom info bar */}
        <div
          style={{
            height: 30,
            background: "linear-gradient(180deg, #2A3A54, #1E2E48)",
            border: "2px solid #1A2640",
            borderTop: "1px solid #3A4A6A",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
          }}
        >
          {selectedCountry ? (
            <span
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "11px",
                color: "#D4CC98",
              }}
            >
              {selectedCountry.flag} {selectedCountry.name} —{" "}
              {selectedClubs.length} CLUB
              {selectedClubs.length !== 1 ? "ES" : ""}
            </span>
          ) : (
            <span
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "11px",
                color: "#6A7A8A",
              }}
            >
              SELECCIONA UN PAÍS
            </span>
          )}
        </div>
      </div>

      {/* ── Club sidebar (right) ── */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            <ClubPanel
              clubs={selectedClubs}
              countryName={selectedCountry.name}
              countryFlag={selectedCountry.flag}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
