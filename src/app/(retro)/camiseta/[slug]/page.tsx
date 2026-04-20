import ShirtPageClient from "./ShirtPageClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  getShirtBySlug,
  getClubById,
  getShirtsByClub,
  type MockShirt,
} from "@/lib/mocks/clubs-and-shirts";
import type { Shirt, ShirtType as LegacyShirtType } from "@/types/shirt";
import type { FitType } from "@/components/shop/ProductSpecs";
import type { FaqItem } from "@/components/shop/FaqAccordion";

function toLegacyType(t: MockShirt["type"]): LegacyShirtType {
  switch (t) {
    case "local":
      return "Local";
    case "away":
      return "Visitante";
    default:
      return "Especial";
  }
}

/** Bridge MockShirt (new) ↔ Shirt (legacy PDP type) so ShirtPageClient stays untouched. */
function toLegacyShirt(m: MockShirt, clubName: string): Shirt {
  const overall = Math.round(
    (m.stat_condition + m.stat_color + m.stat_integrity + m.stat_iconicity) / 4
  );
  const stars = Math.max(1, Math.min(5, Math.round(m.stat_iconicity / 20)));
  const typeLabel =
    m.type === "local"
      ? "Local"
      : m.type === "away"
        ? "Visitante"
        : m.type === "third"
          ? "Tercera"
          : m.type === "goalkeeper"
            ? "Portero"
            : "Sudadera";
  return {
    id: m.id,
    club_id: m.club_id,
    seller_id: null,
    slug: m.slug,
    name: `${clubName} ${typeLabel} ${m.season}`,
    season: m.season,
    type: toLegacyType(m.type),
    brand: m.brand,
    size: m.size,
    player_name: null,
    overall,
    brightness: m.stat_color,
    color_integrity: m.stat_integrity,
    special_features: m.stat_iconicity,
    stars,
    price_cents: m.price_cents,
    currency: "EUR",
    min_offer_pct: 80,
    is_sold: false,
    is_featured: false,
    is_drop: false,
    drop_date: null,
    description: m.description_es,
    story: null,
    created_at: "",
    updated_at: "",
  };
}

const DEFAULT_FAQ: FaqItem[] = [
  {
    id: "authenticity",
    question: "¿Cómo garantizáis que es original?",
    answer:
      "Cada camiseta pasa por un proceso de autenticación por parte de nuestros expertos. Revisamos etiquetas, tejidos, costuras y serigrafías antes de ponerla a la venta.",
  },
  {
    id: "shipping-time",
    question: "¿Cuándo llegará a casa?",
    answer:
      "Preparamos y enviamos el pedido en 24h laborables. España peninsular 24-48h, resto de Europa 3-5 días laborables.",
  },
  {
    id: "returns",
    question: "¿Puedo devolverla si no me queda bien?",
    answer:
      "Sí. Tienes 14 días desde que recibes el pedido para devolverla en el mismo estado. Reembolsamos el importe íntegro incluido el envío.",
  },
  {
    id: "size",
    question: "¿Las tallas vintage son iguales a las actuales?",
    answer:
      "Las camisetas vintage suelen venir con un corte ligeramente más holgado que las actuales. Consulta la guía de corte para ajustar tu elección.",
  },
];

/**
 * Shirt detail page — reached from /map/[country]/[club] roster rows.
 * Own screen (no map). Features a prominent "← Back to map" CTA at the top.
 */
export default async function CamisetaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mock = getShirtBySlug(slug);

  if (!mock) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="border border-[#2A2A2A] bg-[#0F0F0F] px-8 py-10 text-center space-y-4">
          <p className="font-[family-name:var(--font-oswald)] text-xl text-[#D83030] uppercase tracking-wider">
            Camiseta no encontrada
          </p>
          <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#AAA]">
            Puede que este fichaje ya no esté disponible o que el enlace sea incorrecto.
          </p>
          <Link
            href="/map"
            className="inline-block mt-2 px-5 py-2.5 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider hover:bg-[#E8C059] no-underline transition-colors"
          >
            Volver al mapa
          </Link>
        </div>
      </div>
    );
  }

  const club = getClubById(mock.club_id);
  const clubName = club?.name ?? "Club";
  const countryId = club?.country_id ?? "";
  const legacyShirt = toLegacyShirt(mock, clubName);

  // Related: up to 4 other shirts from the same club
  const related = getShirtsByClub(mock.club_id)
    .filter((s) => s.id !== mock.id)
    .slice(0, 4)
    .map((s) => toLegacyShirt(s, clubName));

  const fit: FitType = "regular";
  const backHref = countryId && club ? `/map/${countryId}/${club.id}` : "/map";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 lg:pb-8 pt-4">
      {/* Back to map button — top-left, prominent */}
      <div className="mb-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-3 px-4 font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-widest text-[#F5F0E8] hover:text-[#D4A843] no-underline"
          style={{
            height: 40,
            borderWidth: 3,
            borderStyle: "outset",
            borderColor: "#4A5A8E",
            background: "linear-gradient(180deg, #2A3A6E, #1A2A5E)",
            boxShadow: "2px 2px 0 rgba(0,0,0,0.45)",
            letterSpacing: "1.5px",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            shapeRendering="crispEdges"
            aria-hidden
            style={{ flexShrink: 0 }}
          >
            <g fill="#D4A843">
              <rect x="6" y="6" width="8" height="4" />
              <rect x="5" y="4" width="2" height="8" />
              <rect x="4" y="5" width="2" height="6" />
              <rect x="3" y="6" width="2" height="4" />
              <rect x="2" y="7" width="2" height="2" />
            </g>
          </svg>
          Volver al mapa
        </Link>
      </div>

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex items-center gap-1.5 flex-wrap font-[family-name:var(--font-oswald)] text-[11px] uppercase tracking-wider"
      >
        <Link href="/" className="text-[#888] hover:text-[#D4A843] no-underline">
          Inicio
        </Link>
        <ChevronRight className="w-3 h-3 text-[#444]" aria-hidden />
        <Link href="/map" className="text-[#888] hover:text-[#D4A843] no-underline">
          Mapa
        </Link>
        {club && (
          <>
            <ChevronRight className="w-3 h-3 text-[#444]" aria-hidden />
            <Link
              href={backHref}
              className="text-[#888] hover:text-[#D4A843] no-underline"
            >
              {clubName}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-[#444]" aria-hidden />
        <span className="text-[#D0D0D0] truncate max-w-[200px] sm:max-w-none">
          {legacyShirt.name}
        </span>
      </nav>

      <ShirtPageClient
        shirt={legacyShirt}
        clubName={clubName}
        relatedShirts={related}
        fit={fit}
        faqItems={DEFAULT_FAQ}
      />
    </div>
  );
}
