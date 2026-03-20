import ShirtPageClient from "./ShirtPageClient";
import Link from "next/link";
import type { Shirt } from "@/types/shirt";

// Demo data — in production fetched from Supabase by slug
const DEMO_SHIRTS: Record<string, Shirt> = {
  "arsenal-bruised-banana-1991": { id: "1", club_id: "ars", seller_id: null, slug: "arsenal-bruised-banana-1991", name: "Arsenal Bruised Banana Away", season: "1991-93", type: "Visitante", brand: "Adidas", size: "L", player_name: null, overall: 82, brightness: 78, color_integrity: 85, special_features: 80, stars: 4, price_cents: 45000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: null, story: null, created_at: "", updated_at: "" },
  "arsenal-home-2003-04": { id: "2", club_id: "ars", seller_id: null, slug: "arsenal-home-2003-04", name: "Arsenal Home Invincibles", season: "2003-04", type: "Local", brand: "Nike", size: "M", player_name: "Henry", overall: 92, brightness: 90, color_integrity: 94, special_features: 91, stars: 5, price_cents: 85000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: null, story: null, created_at: "", updated_at: "" },
  "barcelona-home-2005-06": { id: "4", club_id: "fcb", seller_id: null, slug: "barcelona-home-2005-06", name: "Barcelona Home UCL Final", season: "2005-06", type: "Local", brand: "Nike", size: "M", player_name: "Ronaldinho", overall: 95, brightness: 92, color_integrity: 96, special_features: 93, stars: 5, price_cents: 120000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: null, story: null, created_at: "", updated_at: "" },
  "juventus-home-1995-96": { id: "6", club_id: "juv", seller_id: null, slug: "juventus-home-1995-96", name: "Juventus Home UCL Winners", season: "1995-96", type: "Local", brand: "Kappa", size: "L", player_name: "Del Piero", overall: 88, brightness: 85, color_integrity: 90, special_features: 86, stars: 5, price_cents: 75000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: null, story: null, created_at: "", updated_at: "" },
};

/**
 * Shirt detail page — player card style view.
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
      <div className="flex items-center justify-center h-[calc(100vh-60px)]">
        <div className="retro-dark-panel px-8 py-6 text-center space-y-3">
          <p className="font-[family-name:var(--font-oswald)] text-[#D83030] uppercase">
            Camiseta no encontrada
          </p>
          <Link
            href="/map"
            className="font-[family-name:var(--font-oswald)] text-sm text-[#88AACC] hover:text-[#E8C840] no-underline"
          >
            ← Volver al mapa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-3">
        <Link
          href={`/roster/${shirt.club_id}`}
          className="font-[family-name:var(--font-oswald)] text-xs text-[#88AACC] hover:text-[#E8C840] uppercase no-underline"
        >
          ← Volver a la plantilla
        </Link>
      </div>
      <ShirtPageClient shirt={shirt} />
    </div>
  );
}
