"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import RetroBtn from "./RetroBtn";
import {
  ISO_NUM_TO_KEY,
  EUROPE_ISOS,
  AMERICAS_ISOS,
} from "@/lib/geo/country-mapping";

type Continent = "europe" | "americas";

interface CountryFeature {
  key: string;       // our internal ID e.g. "spain"
  iso: string;       // ISO numeric string e.g. "724"
  path: string;      // SVG path string from D3
  centroid: [number, number]; // pixel coordinates for flag badge
}

interface RetroMapProps {
  continent: Continent;
  selectedCountry: string | null;
  onSelectCountry: (id: string) => void;
  /** Country IDs that have clubs — only these are interactive */
  clubCountryIds: string[];
  /** Country info keyed by id for flag display */
  countryInfo: Record<string, { flag: string; name: string }>;
}

const SVG_WIDTH = 800;
const SVG_HEIGHT = 550;

const CONTINENT_CONFIG: Record<
  Continent,
  {
    label: string;
    isos: Set<string>;
    projection: () => d3.GeoProjection;
  }
> = {
  europe: {
    label: "EUROPA",
    isos: EUROPE_ISOS,
    projection: () =>
      d3.geoMercator()
        .center([15, 54])
        .scale(500)
        .translate([SVG_WIDTH / 2, SVG_HEIGHT / 2]),
  },
  americas: {
    label: "AMÉRICAS",
    isos: AMERICAS_ISOS,
    projection: () =>
      d3.geoMercator()
        .center([-60, -15])
        .scale(280)
        .translate([SVG_WIDTH / 2 + 30, SVG_HEIGHT / 2]),
  },
};

export default function RetroMap({
  continent,
  selectedCountry,
  onSelectCountry,
  clubCountryIds,
  countryInfo,
}: RetroMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [countryFeatures, setCountryFeatures] = useState<CountryFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const worldDataRef = useRef<Topology | null>(null);

  // Load TopoJSON data once
  useEffect(() => {
    let cancelled = false;
    async function loadWorld() {
      if (worldDataRef.current) return worldDataRef.current;
      const response = await fetch("/countries-110m.json");
      const data = (await response.json()) as Topology;
      if (!cancelled) worldDataRef.current = data;
      return data;
    }
    loadWorld().then((world) => {
      if (!cancelled && world) {
        processFeatures(world, continent);
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reprocess when continent changes (but don't refetch)
  useEffect(() => {
    if (worldDataRef.current) {
      processFeatures(worldDataRef.current, continent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continent]);

  const processFeatures = useCallback(
    (world: Topology, cont: Continent) => {
      const config = CONTINENT_CONFIG[cont];
      const projection = config.projection();
      const pathGenerator = d3.geoPath().projection(projection);

      const countriesGeo = topojson.feature(
        world,
        world.objects.countries as GeometryCollection
      );

      const features: CountryFeature[] = [];

      for (const feature of (countriesGeo as { type: "FeatureCollection"; features: Feature<Geometry>[] }).features) {
        const isoNum = String(feature.id);
        if (!config.isos.has(isoNum)) continue;

        const key = ISO_NUM_TO_KEY[isoNum];
        if (!key) continue;

        const path = pathGenerator(feature);
        const centroid = pathGenerator.centroid(feature);

        if (path && centroid && isFinite(centroid[0]) && isFinite(centroid[1])) {
          features.push({ key, iso: isoNum, path, centroid });
        }
      }

      setCountryFeatures(features);
      setLoading(false);
    },
    []
  );

  const countriesWithClubs = useMemo(
    () => new Set(clubCountryIds),
    [clubCountryIds]
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center retro-panel-inset">
        <p className="text-[#D4CC98] font-mono text-sm animate-pulse">
          Cargando mapa...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* SVG Map with HTML flag overlays */}
      <div
        className="flex-1 retro-panel-inset p-1 overflow-hidden touch-manipulation"
        style={{ position: "relative" }}
      >
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full"
          style={{ backgroundColor: "#7CA8C4" }}
          aria-label={`Mapa de ${CONTINENT_CONFIG[continent].label}`}
        >
          {/* Country paths */}
          {countryFeatures.map((cf) => {
            const hasClubs = countriesWithClubs.has(cf.key);
            const isSelected = cf.key === selectedCountry;
            const isHovered = cf.key === hoveredId;

            let fill = "#D4CC98";
            if (isSelected) fill = "#FFE870";
            else if (isHovered && hasClubs) fill = "#E0D890";

            return (
              <path
                key={cf.key}
                d={cf.path}
                fill={fill}
                stroke={isSelected ? "#8A6A10" : "#7A7A60"}
                strokeWidth={isSelected ? 1.8 : 0.6}
                strokeLinejoin="round"
                style={{ cursor: hasClubs ? "pointer" : "default" }}
                onMouseEnter={() => hasClubs && setHoveredId(cf.key)}
                onMouseLeave={() => setHoveredId(null)}
                onPointerDown={() => hasClubs && onSelectCountry(cf.key)}
                role={hasClubs ? "button" : undefined}
                aria-label={hasClubs ? countryInfo[cf.key]?.name : undefined}
                tabIndex={hasClubs ? 0 : undefined}
                onKeyDown={(e) => {
                  if (hasClubs && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onSelectCountry(cf.key);
                  }
                }}
              />
            );
          })}
        </svg>

        {/* Flag badges as HTML overlays — NEVER use SVG <text> for emoji flags */}
        {countryFeatures
          .filter((cf) => countriesWithClubs.has(cf.key))
          .map((cf) => {
            const isSelected = cf.key === selectedCountry;
            const info = countryInfo[cf.key];
            if (!info) return null;

            return (
              <div
                key={`flag-${cf.key}`}
                style={{
                  position: "absolute",
                  left: `${(cf.centroid[0] / SVG_WIDTH) * 100}%`,
                  top: `${(cf.centroid[1] / SVG_HEIGHT) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  zIndex: isSelected ? 10 : 1,
                }}
                onClick={() => onSelectCountry(cf.key)}
                role="button"
                aria-label={`${info.flag} ${info.name}`}
              >
                <div
                  style={{
                    width: 32,
                    height: 24,
                    backgroundColor: isSelected ? "#1a1a2e" : "#ffffff",
                    border: `${isSelected ? 2 : 1.5}px solid ${isSelected ? "#D4A843" : "#555"}`,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    lineHeight: 1,
                    fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','Twemoji Mozilla',sans-serif",
                    boxShadow: isSelected
                      ? "0 0 10px rgba(212,168,67,0.7)"
                      : "0 1px 3px rgba(0,0,0,0.35)",
                    overflow: "hidden",
                  }}
                >
                  {info.flag}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
