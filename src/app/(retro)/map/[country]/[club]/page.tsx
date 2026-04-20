"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ClubShirtBadge from "@/components/retro/ClubShirtBadge";
import {
  getClubById,
  getShirtsByClub,
  formatShirtPrice,
  type MockShirt,
  type ShirtType,
} from "@/lib/mocks/clubs-and-shirts";
import { getShirtMedia } from "@/lib/utils/shirt-helpers";

/** Colored type badge for the roster — maps type → color + short label. */
const TYPE_BADGE: Record<
  ShirtType,
  { label: string; bg: string; fg: string }
> = {
  local:      { label: "L",  bg: "#30A040", fg: "#FFFFFF" },
  away:       { label: "V",  bg: "#2E6DB4", fg: "#FFFFFF" },
  third:      { label: "3",  bg: "#D03030", fg: "#FFFFFF" },
  goalkeeper: { label: "P",  bg: "#E8C840", fg: "#1A1408" },
  sweatshirt: { label: "SW", bg: "#7A3AB8", fg: "#FFFFFF" },
};

/** PC Fútbol "ME" (media) rating — colored square with big number. */
function MeBox({ value }: { value: number }) {
  let bg = "#D4A843"; // gold >= 90
  let fg = "#1A1408";
  if (value < 60) {
    bg = "#D04040";
    fg = "#FFFFFF";
  } else if (value < 70) {
    bg = "#E8802A";
    fg = "#FFFFFF";
  } else if (value < 80) {
    bg = "#E8C040";
    fg = "#1A1408";
  } else if (value < 90) {
    bg = "#50A030";
    fg = "#FFFFFF";
  }
  return (
    <div
      style={{
        width: 32,
        height: 32,
        background: bg,
        color: fg,
        border: "2px outset #8A7A50",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-oswald), sans-serif",
        fontWeight: 700,
        fontSize: 16,
        boxShadow: "1px 1px 0 rgba(0,0,0,0.35)",
      }}
    >
      {value}
    </div>
  );
}

/**
 * State 3 — right-side panel: header + roster table of shirts for the selected club.
 */
export default function ClubRosterPage() {
  const { country, club: clubId } = useParams<{ country: string; club: string }>();
  const club = getClubById(clubId);
  const shirts = club ? getShirtsByClub(club.id) : [];

  if (!club) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1E2A5E",
          border: "3px outset #4A5A8E",
          color: "#FFB8A0",
          fontFamily: "var(--font-oswald), sans-serif",
          textTransform: "uppercase",
          letterSpacing: 2,
          padding: 24,
        }}
      >
        Club no encontrado
        <Link
          href={`/map/${country}`}
          style={{
            marginLeft: 12,
            color: "#D4A843",
            fontFamily: "var(--font-oswald), sans-serif",
            textDecoration: "underline",
          }}
        >
          ← Volver
        </Link>
      </div>
    );
  }

  // Sort shirts by year desc (newer first)
  const sorted = [...shirts].sort((a, b) => b.year - a.year);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#F5F0E8",
        border: "3px outset #8A7A50",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >
      {/* Roster header */}
      <div
        style={{
          height: 40,
          background: "linear-gradient(180deg, #1E2A5E, #0F1A3E)",
          borderBottom: "2px solid #D4A843",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 14px",
        }}
      >
        <ClubShirtBadge club={club} size={24} />
        <span
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#F5F0E8",
            textTransform: "uppercase",
            letterSpacing: 2,
            flex: 1,
          }}
        >
          {club.name}
        </span>
        <span
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: 11,
            color: "#D4A843",
            letterSpacing: 1,
          }}
        >
          {shirts.length} SHIRTS
        </span>
      </div>

      {/* Table */}
      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {/* Column header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "90px 50px 40px 1fr 50px 48px 90px 20px",
            alignItems: "center",
            padding: "6px 10px",
            background: "#D8C8A0",
            borderBottom: "2px inset #8A7A50",
            fontFamily: "var(--font-oswald), sans-serif",
            fontSize: 10,
            fontWeight: 700,
            color: "#5A4820",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <span>Año</span>
          <span>Tipo</span>
          <span>Badge</span>
          <span>Marca</span>
          <span>Talla</span>
          <span>ME</span>
          <span style={{ textAlign: "right" }}>Precio</span>
          <span />
        </div>

        {/* Rows */}
        {sorted.map((shirt, idx) => (
          <RosterRow
            key={shirt.id}
            shirt={shirt}
            club={club}
            zebra={idx % 2 === 0}
          />
        ))}

        {sorted.length === 0 && (
          <div
            style={{
              padding: 24,
              textAlign: "center",
              fontFamily: "var(--font-vt323), monospace",
              fontSize: 18,
              color: "#5A4820",
            }}
          >
            Sin camisetas disponibles en este club.
          </div>
        )}
      </div>
    </div>
  );
}

function RosterRow({
  shirt,
  club,
  zebra,
}: {
  shirt: MockShirt;
  club: Parameters<typeof ClubShirtBadge>[0]["club"];
  zebra: boolean;
}) {
  const badge = TYPE_BADGE[shirt.type];
  return (
    <Link
      href={`/camiseta/${shirt.slug}`}
      style={{
        display: "grid",
        gridTemplateColumns: "90px 50px 40px 1fr 50px 48px 90px 20px",
        alignItems: "center",
        padding: "8px 10px",
        background: zebra ? "#F8F8F8" : "#EEEEEE",
        textDecoration: "none",
        color: "#1A1408",
        borderBottom: "1px solid #D8C8A0",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "#E8F0FF";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = zebra
          ? "#F8F8F8"
          : "#EEEEEE";
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 12,
          color: "#B8860B",
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        {shirt.season}
      </span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 22,
          background: badge.bg,
          color: badge.fg,
          fontFamily: "var(--font-oswald), sans-serif",
          fontWeight: 700,
          fontSize: 11,
          border: "1.5px solid #1A1408",
          boxShadow: "1px 1px 0 rgba(0,0,0,0.25)",
          letterSpacing: 0.5,
        }}
      >
        {badge.label}
      </span>
      <ClubShirtBadge club={club} size={24} />
      <span
        style={{
          fontFamily: "var(--font-oswald), sans-serif",
          fontSize: 13,
          color: "#1A1408",
          letterSpacing: 0.5,
        }}
      >
        {shirt.brand}
      </span>
      <span
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 12,
          color: "#5A4820",
          fontWeight: 700,
        }}
      >
        {shirt.size}
      </span>
      <MeBox value={getShirtMedia(shirt)} />
      <span
        style={{
          textAlign: "right",
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 13,
          color: "#B8860B",
          fontWeight: 700,
        }}
      >
        {formatShirtPrice(shirt.price_cents)}
      </span>
      <span
        style={{
          color: "#AAA",
          fontSize: 16,
          textAlign: "center",
          fontFamily: "var(--font-oswald), sans-serif",
        }}
      >
        ›
      </span>
    </Link>
  );
}
