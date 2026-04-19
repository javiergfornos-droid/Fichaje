"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import type { Country } from "@/types/country";

type Continent = "europe" | "americas";

interface RenderCountry {
  country: Country;
  path: string;
  centroid: [number, number];
  flagCenter: [number, number];
}

interface RetroMapProps {
  continent: Continent;
  countries: Country[];
  selectedCountry: string | null;
  activeCountryIds: string[];
  onActiveClick: (country: Country) => void;
  onInactiveClick: (country: Country) => void;
  onHoverCountry?: (country: Country | null) => void;
}

const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;

function getProjection(cont: Continent): d3.GeoProjection {
  if (cont === "europe") {
    return d3
      .geoMercator()
      .center([12, 54])
      .scale(620)
      .translate([SVG_WIDTH / 2, SVG_HEIGHT / 2]);
  }
  return d3
    .geoMercator()
    .center([-62, -25])
    .scale(460)
    .translate([SVG_WIDTH / 2, SVG_HEIGHT / 2]);
}

export default function RetroMap({
  continent,
  countries,
  selectedCountry,
  activeCountryIds,
  onActiveClick,
  onInactiveClick,
  onHoverCountry,
}: RetroMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [wigglingId, setWigglingId] = useState<string | null>(null);
  const [renderCountries, setRenderCountries] = useState<RenderCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const worldDataRef = useRef<Topology | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgRect, setSvgRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  // Filter visible countries for the current continent
  const visibleCountries = useMemo(
    () => countries.filter((c) => c.continent === continent),
    [countries, continent]
  );

  const activeSet = useMemo(
    () => new Set(activeCountryIds),
    [activeCountryIds]
  );

  // Measure SVG position
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

  // Load TopoJSON once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!worldDataRef.current) {
        const response = await fetch("/countries-110m.json");
        const data = (await response.json()) as Topology;
        if (cancelled) return;
        worldDataRef.current = data;
      }
      processFeatures(worldDataRef.current, continent, visibleCountries);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reprocess when continent or country list changes
  useEffect(() => {
    if (worldDataRef.current) {
      processFeatures(worldDataRef.current, continent, visibleCountries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continent, visibleCountries]);

  const processFeatures = useCallback(
    (world: Topology, cont: Continent, list: Country[]) => {
      const projection = getProjection(cont);
      const pathGenerator = d3.geoPath().projection(projection);

      const countriesGeo = topojson.feature(
        world,
        world.objects.countries as GeometryCollection
      );
      const allFeatures = (
        countriesGeo as {
          type: "FeatureCollection";
          features: Feature<Geometry>[];
        }
      ).features;

      // Index polygons by 3-digit zero-padded iso_numeric
      const featureByIso = new Map<string, Feature<Geometry>>();
      for (const f of allFeatures) {
        const raw = String(f.id ?? "");
        const padded = raw.padStart(3, "0");
        featureByIso.set(padded, f);
      }

      const rendered: RenderCountry[] = [];
      for (const c of list) {
        const isoKey = c.iso_numeric.padStart(3, "0");
        const feature = featureByIso.get(isoKey);
        if (!feature) continue;

        const path = pathGenerator(feature);
        const polygonCentroid = pathGenerator.centroid(feature) as [
          number,
          number,
        ];

        // Flag placement: override wins (UK sub-nations), otherwise projected centroid
        let flagCenter: [number, number];
        if (c.flag_center) {
          const projected = projection(c.flag_center);
          if (projected) {
            flagCenter = projected as [number, number];
          } else {
            flagCenter = polygonCentroid;
          }
        } else {
          flagCenter = polygonCentroid;
        }

        if (
          path &&
          isFinite(polygonCentroid[0]) &&
          isFinite(polygonCentroid[1])
        ) {
          rendered.push({
            country: c,
            path,
            centroid: polygonCentroid,
            flagCenter,
          });
        }
      }

      setRenderCountries(rendered);
      setLoading(false);
    },
    []
  );

  // Dedupe polygons by iso_numeric — UK sub-nations share "826"
  const polygons = useMemo(() => {
    const seen = new Set<string>();
    const out: RenderCountry[] = [];
    for (const r of renderCountries) {
      if (seen.has(r.country.iso_numeric)) continue;
      seen.add(r.country.iso_numeric);
      out.push(r);
    }
    return out;
  }, [renderCountries]);

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

  const handleCountryClick = useCallback(
    (country: Country) => {
      if (activeSet.has(country.id)) {
        onActiveClick(country);
      } else {
        onInactiveClick(country);
        setWigglingId(country.id);
        setTimeout(() => setWigglingId(null), 250);
      }
    },
    [activeSet, onActiveClick, onInactiveClick]
  );

  const handleHoverEnter = useCallback(
    (country: Country) => {
      setHoveredId(country.id);
      onHoverCountry?.(country);
    },
    [onHoverCountry]
  );

  const handleHoverLeave = useCallback(() => {
    setHoveredId(null);
    onHoverCountry?.(null);
  }, [onHoverCountry]);

  if (loading) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{
          border: "6px solid #1A2640",
          boxShadow: "inset 0 0 0 2px #3A4A6A",
          background: "#6890B8",
        }}
      >
        <p
          className="text-[#E8D898] text-sm animate-pulse"
          style={{ fontFamily: "var(--font-vt323), monospace" }}
        >
          Cargando mapa...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Thick navy frame with flat water + diagonal stripes */}
      <div
        ref={containerRef}
        className="flex-1 touch-manipulation"
        style={{
          position: "relative",
          overflow: "hidden",
          border: "6px solid #1A2640",
          boxShadow:
            "inset 0 0 0 2px #3A4A6A, inset 2px 2px 0 rgba(0,0,0,0.35)",
          backgroundColor: "#6890B8",
          backgroundImage:
            "repeating-linear-gradient(2deg, rgba(88,120,160,0.3) 0 4px, rgba(104,144,184,0) 4px 8px)",
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block" }}
          aria-label={`Mapa de ${continent === "europe" ? "EUROPA" : "SUDAMÉRICA"}`}
        >
          <defs>
            {/* Halftone/dither texture for retro feel */}
            <pattern
              id="dither"
              patternUnits="userSpaceOnUse"
              width="4"
              height="4"
            >
              <rect width="4" height="4" fill="transparent" />
              <rect x="0" y="0" width="1" height="1" fill="rgba(0,0,0,0.04)" />
              <rect x="2" y="2" width="1" height="1" fill="rgba(0,0,0,0.04)" />
            </pattern>
          </defs>

          {/* Dither overlay on the water */}
          <rect
            x="0"
            y="0"
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            fill="url(#dither)"
          />

          {/* Country polygons — PC Fútbol yellow/cream palette, dark earth borders */}
          {polygons.map((rc) => {
            const c = rc.country;
            const hasClubs = activeSet.has(c.id);
            const isSelected = c.id === selectedCountry;
            const isHovered = c.id === hoveredId;
            const isWiggling = c.id === wigglingId;

            // Priority: selected > hover > active-default > inactive-default
            let fill = hasClubs ? "#E0C858" : "#C8B048";
            if (isHovered) fill = "#FFE870";
            if (isSelected) fill = "#D4A843";

            return (
              <path
                key={c.iso_numeric}
                d={rc.path}
                className={isWiggling ? "animate-country-wiggle" : undefined}
                fill={fill}
                stroke="#8A7A50"
                strokeWidth={1}
                strokeLinejoin="round"
                style={{
                  cursor: "pointer",
                  transition: "fill 0.1s ease-out",
                }}
                onMouseEnter={() => handleHoverEnter(c)}
                onMouseLeave={handleHoverLeave}
                onPointerDown={() => handleCountryClick(c)}
                role="button"
                aria-label={c.name}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCountryClick(c);
                  }
                }}
              />
            );
          })}
        </svg>

        {/* Flag badges — flag-icons CSS sprites, hard drop shadow, positioned over centroids or overrides */}
        {svgRect &&
          renderCountries.map((rc) => {
            const c = rc.country;
            const hasClubs = activeSet.has(c.id);
            const isSelected = c.id === selectedCountry;
            const isHovered = c.id === hoveredId;

            const pos = viewBoxToPixel(rc.flagCenter[0], rc.flagCenter[1]);
            if (!pos) return null;

            return (
              <div
                key={`flag-${c.id}`}
                style={{
                  position: "absolute",
                  left: pos.left,
                  top: pos.top,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  zIndex: isSelected ? 10 : isHovered ? 5 : 1,
                  pointerEvents: "auto",
                }}
                onClick={() => handleCountryClick(c)}
                onMouseEnter={() => handleHoverEnter(c)}
                onMouseLeave={handleHoverLeave}
                role="button"
                aria-label={c.name}
              >
                <span
                  className={`fi fi-${c.iso_code}`}
                  style={{
                    display: "inline-block",
                    width: 28,
                    height: 20,
                    border: isSelected
                      ? "1.5px solid #D4A843"
                      : "1.5px solid #000",
                    boxShadow: isSelected
                      ? "2px 2px 0 rgba(0,0,0,0.5), 0 0 0 1px #D4A843"
                      : "2px 2px 0 rgba(0,0,0,0.5)",
                    imageRendering: "pixelated",
                    filter:
                      isHovered && !isSelected
                        ? "brightness(1.15)"
                        : "none",
                    opacity: hasClubs ? 1 : 0.85,
                  }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
