"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ClubShirtBadge from "@/components/retro/ClubShirtBadge";
import ContextualBackButton from "@/components/retro/ContextualBackButton";
import { DEMO_COUNTRIES } from "@/lib/mocks/countries";
import {
  getClubsByCountry,
  getShirtsByClub,
} from "@/lib/mocks/clubs-and-shirts";

/**
 * State 2 — right-side panel listing all clubs of the selected country.
 */
export default function CountryPage() {
  const { country } = useParams<{ country: string }>();
  const countryObj = DEMO_COUNTRIES.find((c) => c.id === country);
  const clubs = getClubsByCountry(country);

  if (!countryObj) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #E8DCC8, #C8B898)",
          border: "3px outset #8A7A50",
          padding: 24,
          fontFamily: "var(--font-oswald), sans-serif",
          color: "#5A4820",
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        País no encontrado
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #E8DCC8, #C8B898)",
        border: "3px outset #D4C090",
        boxShadow: "inset 0 0 0 1px rgba(90,72,32,0.2)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 16px",
          borderBottom: "2px solid #8A7A50",
          background: "linear-gradient(180deg, #D4C090, #B8A070)",
        }}
      >
        <ContextualBackButton href="/map" label="VOLVER AL MAPA" />
        <span
          className={`fi fi-${countryObj.iso_code}`}
          style={{
            display: "inline-block",
            width: 48,
            height: 32,
            border: "1.5px solid #000",
            boxShadow: "2px 2px 0 rgba(0,0,0,0.45)",
            imageRendering: "pixelated",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#1A1408",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: 3,
              lineHeight: 1,
              textShadow: "1px 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            {countryObj.name}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 12,
              color: "#5A4820",
              margin: "4px 0 0 0",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {clubs.length} CLUB{clubs.length !== 1 ? "ES" : ""}
          </p>
        </div>
      </div>

      {/* Club card grid */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          padding: 14,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          alignContent: "flex-start",
        }}
      >
        {clubs.map((club) => {
          const shirtCount = getShirtsByClub(club.id).length;
          return (
            <Link
              key={club.id}
              href={`/map/${country}/${club.id}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: 12,
                background: "linear-gradient(180deg, #F4EBD3, #D8C8A0)",
                border: "2px outset #B8A070",
                boxShadow: "2px 2px 0 rgba(0,0,0,0.35)",
                textDecoration: "none",
                cursor: "pointer",
                transition: "transform 0.12s, filter 0.12s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.filter = "brightness(1.08)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.filter = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              <ClubShirtBadge club={club} size={64} />
              <span
                style={{
                  fontFamily: "var(--font-oswald), sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1A1408",
                  textAlign: "center",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  lineHeight: 1.1,
                }}
              >
                {club.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-vt323), monospace",
                  fontSize: 12,
                  color: "#B8860B",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {shirtCount} CAMISETA{shirtCount !== 1 ? "S" : ""}
              </span>
            </Link>
          );
        })}

        {clubs.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: 24,
              textAlign: "center",
              fontFamily: "var(--font-vt323), monospace",
              fontSize: 18,
              color: "#5A4820",
            }}
          >
            Aún no hay clubes disponibles en este país.
          </div>
        )}
      </div>
    </div>
  );
}
