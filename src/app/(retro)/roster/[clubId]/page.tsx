import RosterTable from "@/components/retro/RosterTable";
import Link from "next/link";
import type { Shirt } from "@/types/shirt";
import type { Club } from "@/types/club";

// Demo data — in production fetched from Supabase
const DEMO_CLUBS: Record<string, Club> = {
  ars: { id: "ars", country_id: "england", name: "Arsenal", badge_emoji: "🔴⚪", badge_url: null, color: "#EF0107", sort_order: 0, created_at: "" },
  fcb: { id: "fcb", country_id: "spain", name: "FC Barcelona", badge_emoji: "🔵🔴", badge_url: null, color: "#004D98", sort_order: 0, created_at: "" },
  juv: { id: "juv", country_id: "italy", name: "Juventus", badge_emoji: "⚪⚫", badge_url: null, color: "#000000", sort_order: 0, created_at: "" },
};

const DEMO_SHIRTS: Record<string, Shirt[]> = {
  ars: [
    { id: "1", club_id: "ars", seller_id: null, slug: "arsenal-bruised-banana-1991", name: "Arsenal Bruised Banana Away", season: "1991-93", type: "Visitante", brand: "Adidas", size: "L", player_name: null, overall: 82, brightness: 78, color_integrity: 85, special_features: 80, stars: 4, price_cents: 45000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: null, story: null, created_at: "", updated_at: "" },
    { id: "2", club_id: "ars", seller_id: null, slug: "arsenal-home-2003-04", name: "Arsenal Home Invincibles", season: "2003-04", type: "Local", brand: "Nike", size: "M", player_name: "Henry", overall: 92, brightness: 90, color_integrity: 94, special_features: 91, stars: 5, price_cents: 85000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: null, story: null, created_at: "", updated_at: "" },
    { id: "3", club_id: "ars", seller_id: null, slug: "arsenal-marble-away-1990", name: "Arsenal Marble Away", season: "1990-92", type: "Visitante", brand: "Adidas", size: "XL", player_name: null, overall: 75, brightness: 70, color_integrity: 78, special_features: 72, stars: 3, price_cents: 32000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: false, is_drop: false, drop_date: null, description: null, story: null, created_at: "", updated_at: "" },
  ],
  fcb: [
    { id: "4", club_id: "fcb", seller_id: null, slug: "barcelona-home-2005-06", name: "Barcelona Home UCL Final", season: "2005-06", type: "Local", brand: "Nike", size: "M", player_name: "Ronaldinho", overall: 95, brightness: 92, color_integrity: 96, special_features: 93, stars: 5, price_cents: 120000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: null, story: null, created_at: "", updated_at: "" },
    { id: "5", club_id: "fcb", seller_id: null, slug: "barcelona-away-kappa-1996", name: "Barcelona Away Kappa", season: "1996-97", type: "Visitante", brand: "Kappa", size: "L", player_name: null, overall: 78, brightness: 74, color_integrity: 80, special_features: 76, stars: 4, price_cents: 38000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: false, is_drop: false, drop_date: null, description: null, story: null, created_at: "", updated_at: "" },
  ],
  juv: [
    { id: "6", club_id: "juv", seller_id: null, slug: "juventus-home-1995-96", name: "Juventus Home UCL Winners", season: "1995-96", type: "Local", brand: "Kappa", size: "L", player_name: "Del Piero", overall: 88, brightness: 85, color_integrity: 90, special_features: 86, stars: 5, price_cents: 75000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: null, story: null, created_at: "", updated_at: "" },
  ],
};

const COUNTRY_INFO: Record<string, { flag: string; name: string }> = {
  england: { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", name: "INGLATERRA" },
  spain: { flag: "🇪🇸", name: "ESPAÑA" },
  italy: { flag: "🇮🇹", name: "ITALIA" },
};

/**
 * Roster page — squad-style shirt listing for a club.
 */
export default async function RosterPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  const club = DEMO_CLUBS[clubId];
  const shirts = DEMO_SHIRTS[clubId] ?? [];

  if (!club) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-60px)]">
        <div className="retro-dark-panel px-8 py-6 text-center space-y-3">
          <p className="font-[family-name:var(--font-oswald)] text-[#D83030] uppercase">
            Club no encontrado
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

  const countryInfo = COUNTRY_INFO[club.country_id] ?? { flag: "🏳️", name: club.country_id.toUpperCase() };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-3">
        <Link
          href="/map"
          className="font-[family-name:var(--font-oswald)] text-xs text-[#88AACC] hover:text-[#E8C840] uppercase no-underline"
        >
          ← Volver al mapa
        </Link>
      </div>
      <RosterTable
        club={club}
        shirts={shirts}
        countryFlag={countryInfo.flag}
        countryName={countryInfo.name}
      />
    </div>
  );
}
