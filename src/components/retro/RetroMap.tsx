"use client";

import { useState, useMemo } from "react";
import RetroBtn from "./RetroBtn";
import {
  geoToSvgEurope,
  geoToSvgAmericas,
  geoPointsToSvgPath,
} from "@/lib/geo/projections";
import type { CountryGeoData } from "@/lib/geo/country-paths";

interface RetroMapProps {
  countries: CountryGeoData[];
  selectedCountryId: string | null;
  clubCountryIds: string[];
  onSelectCountry: (id: string) => void;
}

type Continent = "europe" | "americas";

const CONTINENT_CONFIG: Record<
  Continent,
  {
    label: string;
    viewBox: string;
    projection: (lon: number, lat: number) => [number, number];
  }
> = {
  europe: {
    label: "EUROPA",
    viewBox: "0 0 700 500",
    projection: geoToSvgEurope,
  },
  americas: {
    label: "AMÉRICAS",
    viewBox: "0 0 600 730",
    projection: geoToSvgAmericas,
  },
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
    [countries, continent],
  );

  return (
    <div className="h-full flex flex-col">
      {/* Continent tabs */}
      <div className="flex gap-2 mb-3">
        {(["europe", "americas"] as Continent[]).map((c) => (
          <RetroBtn
            key={c}
            size="sm"
            variant={continent === c ? "gold" : "default"}
            onClick={() => setContinent(c)}
          >
            {CONTINENT_CONFIG[c].label}
          </RetroBtn>
        ))}
      </div>

      {/* SVG Map */}
      <div className="flex-1 retro-panel-inset p-1 overflow-hidden touch-manipulation">
        <svg
          viewBox={config.viewBox}
          className="w-full h-full"
          style={{ backgroundColor: "#7CA8C4" }}
          aria-label={`Mapa de ${config.label}`}
        >
          {/* SVG filter for pulsing gold glow on selected badge */}
          <defs>
            <filter id="gold-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
              <feFlood floodColor="#D4A843" floodOpacity="0.8" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Country polygons */}
          {visibleCountries.map((country) => {
            const hasClubs = clubCountryIds.includes(country.id);
            const isSelected = country.id === selectedCountryId;
            const isHovered = country.id === hoveredId;

            let fill = "#D4CC98";
            if (isSelected) fill = "#FFE870";
            else if (isHovered && hasClubs) fill = "#E8DC90";

            const points = geoPointsToSvgPath(
              country.geo_points,
              config.projection,
            );

            return (
              <polygon
                key={country.id}
                points={points}
                fill={fill}
                stroke={isSelected ? "#8A6A10" : "#8A8260"}
                strokeWidth={isSelected ? 2 : 0.8}
                strokeLinejoin="round"
                style={{ cursor: hasClubs ? "pointer" : "default" }}
                onMouseEnter={() => hasClubs && setHoveredId(country.id)}
                onMouseLeave={() => setHoveredId(null)}
                onPointerDown={() => hasClubs && onSelectCountry(country.id)}
                role={hasClubs ? "button" : undefined}
                aria-label={hasClubs ? country.name : undefined}
                tabIndex={hasClubs ? 0 : undefined}
                onKeyDown={(e) => {
                  if (hasClubs && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onSelectCountry(country.id);
                  }
                }}
              />
            );
          })}

          {/* Flag badges — only for countries that have clubs */}
          {visibleCountries
            .filter((c) => clubCountryIds.includes(c.id))
            .map((country) => {
              const [cx, cy] = config.projection(
                country.flag_center[0],
                country.flag_center[1],
              );
              const isSelected = country.id === selectedCountryId;

              return (
                <g
                  key={`flag-${country.id}`}
                  onPointerDown={() => onSelectCountry(country.id)}
                  style={{ cursor: "pointer" }}
                  filter={isSelected ? "url(#gold-glow)" : undefined}
                  role="button"
                  aria-label={`${country.flag} ${country.name}`}
                >
                  {/* Pulsing glow ring for selected country */}
                  {isSelected && (
                    <rect
                      x={cx - 16}
                      y={cy - 12}
                      width={32}
                      height={24}
                      rx={3}
                      fill="none"
                      stroke="#D4A843"
                      strokeWidth={1.5}
                      opacity={0.7}
                    >
                      <animate
                        attributeName="opacity"
                        values="0.3;0.9;0.3"
                        dur="1.8s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-width"
                        values="1;2.5;1"
                        dur="1.8s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  )}

                  {/* Badge background */}
                  <rect
                    x={cx - 14}
                    y={cy - 10}
                    width={28}
                    height={20}
                    rx={2}
                    fill={isSelected ? "#1a1a2e" : "#ffffff"}
                    stroke={isSelected ? "#D4A843" : "#888"}
                    strokeWidth={isSelected ? 1.5 : 0.5}
                  />

                  {/* Flag emoji */}
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
