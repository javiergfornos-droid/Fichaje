"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import {
  ISO_NUM_TO_KEY,
  EUROPE_ISOS,
  AMERICAS_ISOS,
} from "@/lib/geo/country-mapping";

type Continent = "europe" | "americas";

interface CountryFeature {
  key: string;
  iso: string;
  path: string;
  centroid: [number, number]; // in viewBox coordinates
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

  // Convert viewBox coordinates to pixel position within the container
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

        {/* Flag badges as HTML overlays — positioned using measured SVG dimensions */}
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
