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
  const [svgRect, setSvgRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

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
    return () => {
      cancelled = true;
    };
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
        img.src = `https://flagcdn.com/w40/${code}.png`;
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

      for (const feature of (
        countriesGeo as {
          type: "FeatureCollection";
          features: Feature<Geometry>[];
        }
      ).features) {
        const isoNum = String(feature.id);
        if (!isos.has(isoNum)) continue;

        const key = ISO_NUM_TO_KEY[isoNum];
        const flagCode = ISO_NUM_TO_FLAG_CODE[isoNum];
        if (!key || !flagCode) continue;

        const path = pathGenerator(feature);
        const centroid = pathGenerator.centroid(feature);

        if (
          path &&
          centroid &&
          isFinite(centroid[0]) &&
          isFinite(centroid[1])
        ) {
          features.push({
            key,
            iso: isoNum,
            flagCode,
            path,
            centroid,
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
      <div
        className="h-full flex items-center justify-center"
        style={{
          border: "6px solid #1A2640",
          boxShadow: "inset 0 0 0 2px #3A4A6A",
          background:
            "linear-gradient(180deg, #A8C8E0 0%, #7AA0C0 40%, #5878A0 100%)",
        }}
      >
        <p className="text-[#E8D898] font-mono text-sm animate-pulse">
          Cargando mapa...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Thick dark navy frame — matches PC Fútbol reference */}
      <div
        ref={containerRef}
        className="flex-1 touch-manipulation"
        style={{
          position: "relative",
          overflow: "hidden",
          border: "6px solid #1A2640",
          boxShadow:
            "inset 0 0 0 2px #3A4A6A, inset 0 0 12px rgba(0,0,0,0.3)",
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
            {/* Water gradient — light blue top, darker bottom */}
            <linearGradient
              id="water-grad"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#A8C8E0" />
              <stop offset="40%" stopColor="#7AA0C0" />
              <stop offset="100%" stopColor="#5878A0" />
            </linearGradient>

            {/* Subtle halftone/dither texture for retro feel */}
            <pattern
              id="dither"
              patternUnits="userSpaceOnUse"
              width="4"
              height="4"
            >
              <rect width="4" height="4" fill="transparent" />
              <rect x="0" y="0" width="1" height="1" fill="rgba(0,0,0,0.03)" />
              <rect x="2" y="2" width="1" height="1" fill="rgba(0,0,0,0.03)" />
            </pattern>
          </defs>

          {/* Water background with gradient */}
          <rect
            x="0"
            y="0"
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            fill="url(#water-grad)"
          />

          {/* Dither texture overlay on water */}
          <rect
            x="0"
            y="0"
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            fill="url(#dither)"
          />

          {/* Country paths — solid golden yellow, dark borders */}
          {countryFeatures.map((cf) => {
            const hasClubs = countriesWithClubs.has(cf.key);
            const isSelected = cf.key === selectedCountry;
            const isHovered = cf.key === hoveredId;

            return (
              <path
                key={cf.key}
                d={cf.path}
                fill={isSelected ? "#FFE870" : "#E0C858"}
                stroke="#8A7A50"
                strokeWidth={isSelected ? 1.2 : 0.6}
                strokeLinejoin="round"
                style={{
                  cursor: hasClubs ? "pointer" : "default",
                  transition: "fill 0.15s",
                  opacity: isHovered && hasClubs ? 0.9 : 1,
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

          {/* Hover highlight overlay */}
          {hoveredId &&
            hoveredId !== selectedCountry &&
            (() => {
              const hovered = countryFeatures.find(
                (cf) => cf.key === hoveredId
              );
              if (!hovered || !countriesWithClubs.has(hovered.key)) return null;
              return (
                <path
                  d={hovered.path}
                  fill="rgba(255, 255, 255, 0.12)"
                  stroke="none"
                  style={{ pointerEvents: "none" }}
                />
              );
            })()}
        </svg>

        {/* Flag badges — flat rectangles with dark border, placed on centroids */}
        {svgRect &&
          countryFeatures
            .filter((cf) => countriesWithClubs.has(cf.key))
            .map((cf) => {
              const isSelected = cf.key === selectedCountry;
              const isHovered = cf.key === hoveredId;
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
                    zIndex: isSelected ? 10 : isHovered ? 5 : 1,
                    pointerEvents: "auto",
                  }}
                  onClick={() => onSelectCountry(cf.key)}
                  onMouseEnter={() => setHoveredId(cf.key)}
                  onMouseLeave={() => setHoveredId(null)}
                  role="button"
                  aria-label={`${info.flag} ${info.name}`}
                >
                  <div
                    style={{
                      border: isSelected
                        ? "2px solid #D4A843"
                        : isHovered
                          ? "2px solid #555"
                          : "1.5px solid #333",
                      background: "#1E2A40",
                      padding: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isSelected
                        ? "0 0 6px rgba(212,168,67,0.6)"
                        : "none",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://flagcdn.com/w40/${cf.flagCode}.png`}
                      alt={info.name}
                      width={24}
                      height={16}
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
