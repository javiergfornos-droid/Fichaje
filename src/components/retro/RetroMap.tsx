"use client";

import { useState, useMemo } from "react";
import RetroBtn from "./RetroBtn";
import { geoToSvgEurope, geoToSvgAmericas, geoPointsToSvgPath } from "@/lib/geo/projections";
import type { CountryGeoData } from "@/lib/geo/country-paths";

interface RetroMapProps {
  countries: CountryGeoData[];
  selectedCountryId: string | null;
  clubCountryIds: string[];
  onSelectCountry: (id: string) => void;
}

type Continent = "europe" | "americas";

const CONTINENT_CONFIG: Record<Continent, {
  viewBox: string;
  projection: (lon: number, lat: number) => [number, number];
}> = {
  europe: { viewBox: "0 0 700 500", projection: geoToSvgEurope },
  americas: { viewBox: "0 0 600 730", projection: geoToSvgAmericas },
};

/**
 * Interactive SVG map with continent tabs — PC Fútbol retro style.
 */
export default function RetroMap({
  countries,
  selectedCountryId,
  clubCountryIds,
  onSelectCountry,
}: RetroMapProps) {
  const [continent, setContinent] = useState<Continent>("europe");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const config = CONTINENT_CONFIG[continent];
  const visibleCountries = useMemo(
    () => countries.filter((c) => c.continent === continent),
    [countries, continent]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Continent tabs */}
      <div className="flex gap-2 mb-3">
        <RetroBtn
          variant={continent === "europe" ? "gold" : "default"}
          onClick={() => setContinent("europe")}
        >
          Europa
        </RetroBtn>
        <RetroBtn
          variant={continent === "americas" ? "gold" : "default"}
          onClick={() => setContinent("americas")}
        >
          Américas
        </RetroBtn>
      </div>

      {/* SVG Map */}
      <div className="flex-1 retro-panel-inset p-1 overflow-hidden">
        <svg
          viewBox={config.viewBox}
          className="w-full h-full"
          style={{ backgroundColor: "#7CA8C4" }}
        >
          {/* Country polygons */}
          {visibleCountries.map((country) => {
            const hasClubs = clubCountryIds.includes(country.id);
            const isSelected = country.id === selectedCountryId;
            const isHovered = country.id === hoveredId;

            let fill = "#D4CC98";
            if (isSelected) fill = "#FFE870";
            else if (isHovered && hasClubs) fill = "#E8DC90";

            const points = geoPointsToSvgPath(country.geo_points, config.projection);

            return (
              <g key={country.id}>
                <polygon
                  points={points}
                  fill={fill}
                  stroke={isSelected ? "#8A6A10" : "#8A8260"}
                  strokeWidth={isSelected ? 2 : 0.8}
                  style={{ cursor: hasClubs ? "pointer" : "default" }}
                  onMouseEnter={() => hasClubs && setHoveredId(country.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => hasClubs && onSelectCountry(country.id)}
                />
              </g>
            );
          })}

          {/* Flag badges */}
          {visibleCountries
            .filter((c) => clubCountryIds.includes(c.id))
            .map((country) => {
              const [cx, cy] = config.projection(
                country.flag_center[0],
                country.flag_center[1]
              );
              const isSelected = country.id === selectedCountryId;

              return (
                <g
                  key={`flag-${country.id}`}
                  onClick={() => onSelectCountry(country.id)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={cx - 14}
                    y={cy - 10}
                    width={28}
                    height={20}
                    rx={2}
                    fill={isSelected ? "#1a1a2e" : "#ffffff"}
                    stroke={isSelected ? "#D4A843" : "#888"}
                    strokeWidth={isSelected ? 1.5 : 0.5}
                    className={isSelected ? "animate-pulse-gold" : ""}
                  />
                  <text
                    x={cx}
                    y={cy + 5}
                    textAnchor="middle"
                    fontSize={12}
                    className="select-none pointer-events-none"
                  >
                    {country.flag}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>
    </div>
  );
}
