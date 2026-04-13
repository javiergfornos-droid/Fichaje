import ShirtPageClient from "./ShirtPageClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Shirt } from "@/types/shirt";
import type { FitType } from "@/components/shop/ProductSpecs";
import type { FaqItem } from "@/components/shop/FaqAccordion";

// Demo data — in production fetched from Supabase by slug
const DEMO_SHIRTS: Record<string, Shirt> = {
  "arsenal-bruised-banana-1991": { id: "1", club_id: "ars", seller_id: null, slug: "arsenal-bruised-banana-1991", name: "Arsenal Bruised Banana Away", season: "1991-93", type: "Visitante", brand: "Adidas", size: "L", player_name: null, overall: 82, brightness: 78, color_integrity: 85, special_features: 80, stars: 4, price_cents: 45000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: "Camiseta icónica de la temporada 1991-93, conocida por su característico patrón 'bruised banana'.", story: "Un diseño que definió una era del Arsenal y marcó tendencia en los años 90.", created_at: "", updated_at: "" },
  "arsenal-home-2003-04": { id: "2", club_id: "ars", seller_id: null, slug: "arsenal-home-2003-04", name: "Arsenal Home Invincibles", season: "2003-04", type: "Local", brand: "Nike", size: "M", player_name: "Henry", overall: 92, brightness: 90, color_integrity: 94, special_features: 91, stars: 5, price_cents: 85000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: "La camiseta de los Invencibles, usada durante la temporada 2003-04 sin una sola derrota en Premier League.", story: "Henry, Bergkamp, Vieira. Una plantilla legendaria y una temporada irrepetible.", created_at: "", updated_at: "" },
  "barcelona-home-2005-06": { id: "4", club_id: "fcb", seller_id: null, slug: "barcelona-home-2005-06", name: "Barcelona Home UCL Final", season: "2005-06", type: "Local", brand: "Nike", size: "M", player_name: "Ronaldinho", overall: 95, brightness: 92, color_integrity: 96, special_features: 93, stars: 5, price_cents: 120000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: "La camiseta del Barça que conquistó la Champions en París ante el Arsenal.", story: "Ronaldinho en su máximo esplendor, Eto'o, Deco. Fútbol del bueno.", created_at: "", updated_at: "" },
  "juventus-home-1995-96": { id: "6", club_id: "juv", seller_id: null, slug: "juventus-home-1995-96", name: "Juventus Home UCL Winners", season: "1995-96", type: "Local", brand: "Kappa", size: "L", player_name: "Del Piero", overall: 88, brightness: 85, color_integrity: 90, special_features: 86, stars: 5, price_cents: 75000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: "Camiseta de la Juve campeona de la Champions League frente al Ajax en Roma.", story: "La generación de Del Piero, Ravanelli y Vialli levantó la Orejona en 1996.", created_at: "", updated_at: "" },
};

const CLUB_NAMES: Record<string, string> = {
  ars: "Arsenal FC",
  fcb: "FC Barcelona",
  juv: "Juventus FC",
};

// Per-shirt fit hint (in production would live in the DB row)
const SHIRT_FIT: Record<string, FitType> = {
  "arsenal-bruised-banana-1991": "oversized",
  "arsenal-home-2003-04": "regular",
  "barcelona-home-2005-06": "regular",
  "juventus-home-1995-96": "regular",
};

// PDP-scoped FAQ — in production pulled by shirt type / brand
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
 * Shirt detail page (PDP).
 */
export default async function ShirtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const shirt = DEMO_SHIRTS[slug];

  if (!shirt) {
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
            href="/browse"
            className="inline-block mt-2 px-5 py-2.5 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider hover:bg-[#E8C059] no-underline transition-colors"
          >
            Explorar camisetas
          </Link>
        </div>
      </div>
    );
  }

  const clubName = CLUB_NAMES[shirt.club_id] ?? "Club";
  const fit = SHIRT_FIT[slug] ?? "regular";

  // Related products: same club, excluding current shirt (demo fallback)
  const relatedShirts = Object.values(DEMO_SHIRTS).filter(
    (s) => s.id !== shirt.id && (s.club_id === shirt.club_id || s.type === shirt.type)
  ).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 lg:pb-8 pt-4">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex items-center gap-1.5 flex-wrap font-[family-name:var(--font-oswald)] text-[11px] uppercase tracking-wider"
      >
        <Link href="/" className="text-[#888] hover:text-[#D4A843] no-underline">
          Inicio
        </Link>
        <ChevronRight className="w-3 h-3 text-[#444]" aria-hidden />
        <Link href="/browse" className="text-[#888] hover:text-[#D4A843] no-underline">
          Camisetas
        </Link>
        <ChevronRight className="w-3 h-3 text-[#444]" aria-hidden />
        <Link
          href={`/roster/${shirt.club_id}`}
          className="text-[#888] hover:text-[#D4A843] no-underline"
        >
          {clubName}
        </Link>
        <ChevronRight className="w-3 h-3 text-[#444]" aria-hidden />
        <span className="text-[#D0D0D0] truncate max-w-[150px] sm:max-w-none">
          {shirt.name}
        </span>
      </nav>

      <ShirtPageClient
        shirt={shirt}
        clubName={clubName}
        relatedShirts={relatedShirts}
        fit={fit}
        faqItems={DEFAULT_FAQ}
      />
    </div>
  );
}
