"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RetroMap from "@/components/retro/RetroMap";
import RetroBtn from "@/components/retro/RetroBtn";
import ClubPanel from "@/components/retro/ClubPanel";
import type { Country } from "@/types/country";
import type { Club } from "@/types/club";

type Continent = "europe" | "americas";

interface MapPageClientProps {
  countries: Country[];
  clubs: Club[];
}

/**
 * Client-side map page orchestrating continent tabs, country selection, and club panel.
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
    <div className="flex gap-4 h-[calc(100vh-60px)]">
      {/* Map area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Continent tabs */}
        <div className="flex gap-2 mb-3">
          {(["europe", "americas"] as Continent[]).map((c) => (
            <RetroBtn
              key={c}
              size="sm"
              variant={continent === c ? "gold" : "default"}
              onClick={() => {
                setContinent(c);
                setSelectedCountryId(null);
              }}
            >
              {c === "europe" ? "EUROPA" : "AMÉRICAS"}
            </RetroBtn>
          ))}
        </div>

        <RetroMap
          continent={continent}
          selectedCountry={selectedCountryId}
          onSelectCountry={setSelectedCountryId}
          clubCountryIds={clubCountryIds}
          countryInfo={countryInfo}
        />
      </div>

      {/* Club sidebar */}
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
