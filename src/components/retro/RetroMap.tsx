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
      <div className="h-full flex items-center justify-center retro-panel-inset">
        <p className="text-[#D4CC98] font-mono text-sm animate-pulse">
          Cargando mapa...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div
        ref={containerRef}
        className="flex-1 retro-panel-inset p-1 touch-manipulation"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          style={{ backgroundColor: "#7CA8C4", display: "block" }}
          aria-label={`Mapa de ${continent === "europe" ? "EUROPA" : "AMÉRICAS"}`}
        >
          {/* Pattern definitions for flag fills */}
          <defs>
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

          {/* Country paths with flag pattern fills */}
          {countryFeatures.map((cf) => {
            const hasClubs = countriesWithClubs.has(cf.key);
            const isSelected = cf.key === selectedCountry;
            const isHovered = cf.key === hoveredId;

            let fill: string;
            if (isSelected) {
              fill = "#FFE870"; // Gold override for selected
            } else {
              fill = `url(#flag-${cf.iso})`;
            }

            return (
              <path
                key={cf.key}
                d={cf.path}
                fill={fill}
                stroke={isSelected ? "#8A6A10" : "#555"}
                strokeWidth={isSelected ? 1.8 : isHovered && hasClubs ? 1 : hasClubs ? 0.6 : 0.4}
                strokeLinejoin="round"
                style={{
                  cursor: hasClubs ? "pointer" : "default",
                  transition: "stroke-width 0.15s, opacity 0.15s",
                  opacity: isSelected ? 1 : isHovered ? 1 : hasClubs ? 0.85 : 1,
                  filter: hasClubs ? "none" : "saturate(0.3) brightness(1.1)",
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
                fill="rgba(255, 255, 255, 0.2)"
                stroke="none"
                style={{ pointerEvents: "none" }}
              />
            );
          })()}
        </svg>

        {/* Flag badges as HTML overlays */}
        {svgRect && countryFeatures
          .filter((cf) => countriesWithClubs.has(cf.key))
          .map((cf) => {
            const isSelected = cf.key === selectedCountry;
            const info = countryInfo[cf.key];
            if (!info) return null;

            const pos = viewBoxToPixel(cf.centroid[0], cf.centroid[1]);
            if (!pos) return null;

            return (
              <div
                key={`flag-${cf.key}`}
                style={{
                  position: "absolute",
                  left: pos.left,
                  top: pos.top,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  zIndex: isSelected ? 10 : 1,
                  pointerEvents: "auto",
                }}
                onClick={() => onSelectCountry(cf.key)}
                role="button"
                aria-label={`${info.flag} ${info.name}`}
              >
                <div
                  style={{
                    backgroundColor: isSelected ? "#1a1a2e" : "#fff",
                    border: isSelected ? "2px solid #D4A843" : "1.5px solid #555",
                    borderRadius: 2,
                    padding: 2,
                    boxShadow: isSelected
                      ? "0 0 10px rgba(212,168,67,0.7)"
                      : "0 1px 3px rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://flagcdn.com/w40/${cf.flagCode}.png`}
                    alt={info.name}
                    width={22}
                    height={15}
                    style={{ display: "block" }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
