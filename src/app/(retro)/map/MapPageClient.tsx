"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RetroMap from "@/components/retro/RetroMap";
import ClubPanel from "@/components/retro/ClubPanel";
import type { CountryGeoData } from "@/lib/geo/country-paths";
import type { Club } from "@/types/club";

interface MapPageClientProps {
  countries: CountryGeoData[];
  clubs: Club[];
}

/**
 * Client-side map page orchestrating country selection and club panel.
 */
export default function MapPageClient({ countries, clubs }: MapPageClientProps) {
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  const clubCountryIds = useMemo(
    () => [...new Set(clubs.map((c) => c.country_id))],
    [clubs]
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
      <div className="flex-1 min-w-0">
        <RetroMap
          countries={countries}
          selectedCountryId={selectedCountryId}
          clubCountryIds={clubCountryIds}
          onSelectCountry={setSelectedCountryId}
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
