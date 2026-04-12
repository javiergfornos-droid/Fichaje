"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import {
  ISO_NUM_TO_KEY,
  ISO_NUM_TO_FLAG_CODE,
  EUROPE_ISOS,
  AMERICAS_ISOS,
} from "@/lib/geo/country-mapping";

type Continent = "europe" | "americas";

interface CountryFeature {
  key: string;
  iso: string;
  flagCode: string;
  path: string;
  centroid: [number, number];
  pathBoundsWidth: number;
  pathBoundsHeight: number;
}

interface RetroMapProps {
  continent: Continent;
  selectedCountry: string | null;
  onSelectCountry: (id: string) => void;
  clubCountryIds: string[];
  countryInfo: Record<string, { flag: string; name: string }>;
}

const SVG_WIDTH = 800;
const SVG_HEIGHT = 550;

function getProjection(cont: Continent): d3.GeoProjection {
  if (cont === "europe") {
    return d3.geoMercator()
      .center([15, 54])
      .scale(500)
      .translate([SVG_WIDTH / 2, SVG_HEIGHT / 2]);
  }
  return d3.geoMercator()
    .center([-60, -15])
    .scale(280)
    .translate([SVG_WIDTH / 2 + 30, SVG_HEIGHT / 2]);
}

function getContinentIsos(cont: Continent): Set<string> {
  return cont === "europe" ? EUROPE_ISOS : AMERICAS_ISOS;
}

/** Pick flag image resolution based on rendered size */
function flagUrl(code: string, boundsMax: number): string {
  const size = boundsMax > 200 ? 160 : boundsMax > 100 ? 80 : 40;
  return `https://flagcdn.com/w${size}/${code}.png`;
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgRect, setSvgRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  // Measure the SVG's actual rendered position within the container
  useEffect(() => {
    function measure() {
      const svgEl = svgRef.current;
      const containerEl = containerRef.current;
      if (!svgEl || !containerEl) return;
      const containerRect = containerEl.getBoundingClientRect();
      const svgBBox = svgEl.getBoundingClientRect();
      setSvgRect({
        left: svgBBox.left - containerRect.left,
        top: svgBBox.top - containerRect.top,
        width: svgBBox.width,
        height: svgBBox.height,
      });
    }
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [loading, continent]);

  // Load TopoJSON data once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!worldDataRef.current) {
        const response = await fetch("/countries-110m.json");
        const data = (await response.json()) as Topology;
        if (cancelled) return;
        worldDataRef.current = data;
      }
      processFeatures(worldDataRef.current, continent);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reprocess when continent changes
  useEffect(() => {
    if (worldDataRef.current) {
      processFeatures(worldDataRef.current, continent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continent]);

  // Preload flag images for current continent
  useEffect(() => {
    const isos = getContinentIsos(continent);
    isos.forEach((iso) => {
      const code = ISO_NUM_TO_FLAG_CODE[iso];
      if (code) {
        const img = new Image();
        img.src = `https://flagcdn.com/w160/${code}.png`;
      }
    });
  }, [continent]);

  const processFeatures = useCallback(
    (world: Topology, cont: Continent) => {
      const isos = getContinentIsos(cont);
      const projection = getProjection(cont);
      const pathGenerator = d3.geoPath().projection(projection);

      const countriesGeo = topojson.feature(
        world,
        world.objects.countries as GeometryCollection
      );

      const features: CountryFeature[] = [];

      for (const feature of (countriesGeo as { type: "FeatureCollection"; features: Feature<Geometry>[] }).features) {
        const isoNum = String(feature.id);
        if (!isos.has(isoNum)) continue;

        const key = ISO_NUM_TO_KEY[isoNum];
        const flagCode = ISO_NUM_TO_FLAG_CODE[isoNum];
        if (!key || !flagCode) continue;

        const path = pathGenerator(feature);
        const centroid = pathGenerator.centroid(feature);
        const bounds = pathGenerator.bounds(feature);

        if (path && centroid && isFinite(centroid[0]) && isFinite(centroid[1])) {
          const bw = bounds[1][0] - bounds[0][0];
          const bh = bounds[1][1] - bounds[0][1];
          features.push({
            key,
            iso: isoNum,
            flagCode,
            path,
            centroid,
            pathBoundsWidth: bw,
            pathBoundsHeight: bh,
          });
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

  const viewBoxToPixel = useCallback(
    (vx: number, vy: number): { left: number; top: number } | null => {
      if (!svgRect) return null;
      return {
        left: svgRect.left + (vx / SVG_WIDTH) * svgRect.width,
        top: svgRect.top + (vy / SVG_HEIGHT) * svgRect.height,
      };
    },
    [svgRect]
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{
        border: "4px solid #888",
        borderTopColor: "#ccc",
        borderLeftColor: "#ccc",
        borderBottomColor: "#555",
        borderRightColor: "#555",
        background: "#6A8AAC",
      }}>
        <p className="text-[#E8D898] font-mono text-sm animate-pulse">
          Cargando mapa...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Thick beveled 3D frame around the map area */}
      <div
        ref={containerRef}
        className="flex-1 touch-manipulation"
        style={{
          position: "relative",
          overflow: "hidden",
          /* Outer bevel — light top-left, dark bottom-right */
          border: "4px solid #888",
          borderTopColor: "#ccc",
          borderLeftColor: "#ccc",
          borderBottomColor: "#555",
          borderRightColor: "#555",
          /* Inner shadow for depth */
          boxShadow: "inset 0 0 8px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          style={{ backgroundColor: "#6A8AAC", display: "block" }}
          aria-label={`Mapa de ${continent === "europe" ? "EUROPA" : "AMÉRICAS"}`}
        >
          {/* Wave banding pattern for water texture */}
          <defs>
            <pattern
              id="water-waves"
              patternUnits="userSpaceOnUse"
              width="60"
              height="12"
            >
              <path
                d="M0 6 Q15 2 30 6 Q45 10 60 6"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            </pattern>

            {/* Flag patterns */}
            {countryFeatures.map((cf) => (
              <pattern
                key={`pat-${cf.iso}`}
                id={`flag-${cf.iso}`}
                patternUnits="objectBoundingBox"
                width="1"
                height="1"
                patternContentUnits="objectBoundingBox"
              >
                <image
                  href={flagUrl(cf.flagCode, Math.max(cf.pathBoundsWidth, cf.pathBoundsHeight))}
                  width="1"
                  height="1"
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            ))}
          </defs>

          {/* Water wave overlay */}
          <rect
            x="0"
            y="0"
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            fill="url(#water-waves)"
          />

          {/* Country paths with flag pattern fills */}
          {countryFeatures.map((cf) => {
            const hasClubs = countriesWithClubs.has(cf.key);
            const isSelected = cf.key === selectedCountry;
            const isHovered = cf.key === hoveredId;

            let fill: string;
            if (isSelected) {
              fill = "#FFE870";
            } else if (hasClubs) {
              fill = `url(#flag-${cf.iso})`;
            } else {
              fill = "#E8D898"; // Lighter parchment for no-club countries
            }

            return (
              <path
                key={cf.key}
                d={cf.path}
                fill={fill}
                stroke="#3A2A1A"
                strokeWidth={isSelected ? 1.2 : 0.5}
                strokeLinejoin="round"
                style={{
                  cursor: hasClubs ? "pointer" : "default",
                  transition: "stroke-width 0.15s, opacity 0.15s",
                  opacity: isSelected ? 1 : isHovered ? 1 : hasClubs ? 0.9 : 0.7,
                  filter: hasClubs ? "none" : "saturate(0.2) brightness(1.05)",
                }}
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

          {/* Hover brightness overlay */}
          {hoveredId && hoveredId !== selectedCountry && (() => {
            const hovered = countryFeatures.find((cf) => cf.key === hoveredId);
            if (!hovered || !countriesWithClubs.has(hovered.key)) return null;
            return (
              <path
                d={hovered.path}
                fill="rgba(255, 255, 255, 0.15)"
                stroke="none"
                style={{ pointerEvents: "none" }}
              />
            );
          })()}
        </svg>

        {/* Flag pin badges as HTML overlays */}
        {svgRect && countryFeatures
          .filter((cf) => countriesWithClubs.has(cf.key))
          .map((cf) => {
            const isSelected = cf.key === selectedCountry;
            const isHovered = cf.key === hoveredId;
            const info = countryInfo[cf.key];
            if (!info) return null;

            const pos = viewBoxToPixel(cf.centroid[0], cf.centroid[1]);
            if (!pos) return null;

            const scale = isSelected ? 1.15 : isHovered ? 1.08 : 1;

            return (
              <div
                key={`pin-${cf.key}`}
                style={{
                  position: "absolute",
                  left: pos.left,
                  top: pos.top,
                  /* Anchor at bottom-center so pin points to the country */
                  transform: `translate(-50%, -100%) scale(${scale})`,
                  transformOrigin: "bottom center",
                  cursor: "pointer",
                  zIndex: isSelected ? 10 : isHovered ? 5 : 1,
                  pointerEvents: "auto",
                  transition: "transform 0.2s ease-out, filter 0.2s",
                  filter: isSelected
                    ? "drop-shadow(0 0 8px rgba(212,168,67,0.8)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                    : "drop-shadow(0 2px 4px rgba(0,0,0,0.45))",
                }}
                onClick={() => onSelectCountry(cf.key)}
                onMouseEnter={() => setHoveredId(cf.key)}
                onMouseLeave={() => setHoveredId(null)}
                role="button"
                aria-label={`${info.flag} ${info.name}`}
              >
                {/* Pin pole line */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 2,
                    height: 8,
                    background: "linear-gradient(180deg, #888, #444)",
                    borderRadius: "0 0 1px 1px",
                  }}
                />
                {/* Flag frame */}
                <div
                  style={{
                    marginBottom: 6,
                    backgroundColor: isSelected ? "#1a1a2e" : "#fff",
                    border: isSelected
                      ? "2px solid #D4A843"
                      : "2px solid #fff",
                    borderRadius: "2px",
                    padding: 1,
                    boxShadow: isSelected
                      ? "0 0 10px rgba(212,168,67,0.7), inset 0 0 2px rgba(0,0,0,0.2)"
                      : "0 1px 3px rgba(0,0,0,0.35), inset 0 0 1px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className={isSelected ? "animate-pulse-gold" : ""}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://flagcdn.com/w40/${cf.flagCode}.png`}
                    alt={info.name}
                    width={24}
                    height={16}
                    style={{ display: "block", borderRadius: "1px" }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
