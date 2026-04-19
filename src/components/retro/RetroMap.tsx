"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import type { Country } from "@/types/country";
import { EUROPE_ISOS, AMERICAS_ISOS } from "@/lib/geo/country-mapping";

type Continent = "europe" | "americas";

interface PolygonEntry {
  iso: string;
  path: string;
  /** DEMO countries sharing this polygon (0 = pure context country, 1 typical, 4 for UK). */
  demoCountries: Country[];
}

interface FlagEntry {
  country: Country;
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
  const [polygonEntries, setPolygonEntries] = useState<PolygonEntry[]>([]);
  const [flagEntries, setFlagEntries] = useState<FlagEntry[]>([]);
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

      // Group DEMO countries by iso (UK has 4 siblings sharing "826")
      const demoByIso = new Map<string, Country[]>();
      for (const c of list) {
        const iso = c.iso_numeric.padStart(3, "0");
        const arr = demoByIso.get(iso) ?? [];
        arr.push(c);
        demoByIso.set(iso, arr);
      }

      // Visible isos = continent ISO set ∪ any demo iso for this continent
      const continentIsos = cont === "europe" ? EUROPE_ISOS : AMERICAS_ISOS;
      const visibleIsos = new Set<string>(continentIsos);
      for (const iso of demoByIso.keys()) visibleIsos.add(iso);

      // Build polygon entries
      const polys: PolygonEntry[] = [];
      for (const iso of visibleIsos) {
        const feature = featureByIso.get(iso);
        if (!feature) continue;
        const path = pathGenerator(feature);
        if (!path) continue;
        polys.push({
          iso,
          path,
          demoCountries: demoByIso.get(iso) ?? [],
        });
      }

      // Build flag entries (one per DEMO country)
      const flags: FlagEntry[] = [];
      for (const c of list) {
        const iso = c.iso_numeric.padStart(3, "0");
        const feature = featureByIso.get(iso);
        if (!feature) continue;
        const polygonCentroid = pathGenerator.centroid(feature) as [
          number,
          number,
        ];
        let flagCenter: [number, number] = polygonCentroid;
        if (c.flag_center) {
          const projected = projection(c.flag_center);
          if (projected) flagCenter = projected as [number, number];
        }
        if (isFinite(flagCenter[0]) && isFinite(flagCenter[1])) {
          flags.push({ country: c, flagCenter });
        }
      }

      setPolygonEntries(polys);
      setFlagEntries(flags);
      setLoading(false);
    },
    []
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

          {/* Country polygons — PC Fútbol yellow/cream palette, dark earth borders.
              Context countries (no DEMO entry) render fully inert as faded cream. */}
          {polygonEntries.map((pe) => {
            const countries = pe.demoCountries;
            const isContext = countries.length === 0;
            const hasClubs = countries.some((c) => activeSet.has(c.id));
            const isSelected = countries.some((c) => c.id === selectedCountry);
            const isHovered = countries.some((c) => c.id === hoveredId);
            const isWiggling = countries.some((c) => c.id === wigglingId);

            // Priority: selected > hover(active only) > active/inactive default.
            // Hover does NOT lift inactive countries — no false affordance.
            let fill = hasClubs ? "#E0C858" : "#C8B048";
            if (isSelected) fill = "#D4A843";
            else if (isHovered && hasClubs) fill = "#FFE870";

            // Representative country for handlers — UK uses first (England).
            const rep = countries[0];
            const onEnter = rep ? () => handleHoverEnter(rep) : undefined;
            const onLeave = rep ? handleHoverLeave : undefined;
            const onClick = rep ? () => handleCountryClick(rep) : undefined;

            return (
              <path
                key={pe.iso}
                d={pe.path}
                className={isWiggling ? "animate-country-wiggle" : undefined}
                fill={fill}
                stroke="#8A7A50"
                strokeWidth={1}
                strokeLinejoin="round"
                style={{
                  cursor: hasClubs ? "pointer" : "default",
                  transition: "fill 0.1s ease-out",
                  pointerEvents: isContext ? "none" : "auto",
                }}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                onPointerDown={onClick}
                role={isContext ? undefined : "button"}
                aria-label={rep?.name}
                tabIndex={isContext ? undefined : 0}
                onKeyDown={(e) => {
                  if (!onClick) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                  }
                }}
              />
            );
          })}
        </svg>

        {/* Flag badges — flag-icons CSS sprites, hard drop shadow, one per DEMO country */}
        {svgRect &&
          flagEntries.map((fe) => {
            const c = fe.country;
            const hasClubs = activeSet.has(c.id);
            const isSelected = c.id === selectedCountry;
            const isHovered = c.id === hoveredId;

            const pos = viewBoxToPixel(fe.flagCenter[0], fe.flagCenter[1]);
            if (!pos) return null;

            return (
              <div
                key={`flag-${c.id}`}
                style={{
                  position: "absolute",
                  left: pos.left,
                  top: pos.top,
                  transform: "translate(-50%, -50%)",
                  cursor: hasClubs ? "pointer" : "default",
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
                      isHovered && !isSelected && hasClubs
                        ? "brightness(1.15)"
                        : "none",
                    opacity: hasClubs ? 1 : 0.8,
                  }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
