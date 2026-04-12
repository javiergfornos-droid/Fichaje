import type { Shirt } from "@/types/shirt";

/**
 * Single source of demo shirts shared across routes until Supabase wiring lands.
 * Keep in sync with roster/[clubId]/page.tsx and shirt/[slug]/page.tsx.
 */

export const DEMO_CLUB_NAMES: Record<string, string> = {
  ars: "Arsenal FC",
  fcb: "FC Barcelona",
  juv: "Juventus FC",
};

export const DEMO_SHIRTS: Shirt[] = [
  { id: "1", club_id: "ars", seller_id: null, slug: "arsenal-bruised-banana-1991", name: "Arsenal Bruised Banana Away", season: "1991-93", type: "Visitante", brand: "Adidas", size: "L", player_name: null, overall: 82, brightness: 78, color_integrity: 85, special_features: 80, stars: 4, price_cents: 45000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: "Camiseta icónica de la temporada 1991-93.", story: "Un diseño que definió una era.", created_at: "", updated_at: "" },
  { id: "2", club_id: "ars", seller_id: null, slug: "arsenal-home-2003-04", name: "Arsenal Home Invincibles", season: "2003-04", type: "Local", brand: "Nike", size: "M", player_name: "Henry", overall: 92, brightness: 90, color_integrity: 94, special_features: 91, stars: 5, price_cents: 85000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: "La camiseta de los Invencibles.", story: "Henry, Bergkamp, Vieira.", created_at: "", updated_at: "" },
  { id: "3", club_id: "ars", seller_id: null, slug: "arsenal-marble-away-1990", name: "Arsenal Marble Away", season: "1990-92", type: "Visitante", brand: "Adidas", size: "XL", player_name: null, overall: 75, brightness: 70, color_integrity: 78, special_features: 72, stars: 3, price_cents: 32000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: false, is_drop: false, drop_date: null, description: null, story: null, created_at: "", updated_at: "" },
  { id: "4", club_id: "fcb", seller_id: null, slug: "barcelona-home-2005-06", name: "Barcelona Home UCL Final", season: "2005-06", type: "Local", brand: "Nike", size: "M", player_name: "Ronaldinho", overall: 95, brightness: 92, color_integrity: 96, special_features: 93, stars: 5, price_cents: 120000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: "La camiseta del Barça campeón de Champions en París.", story: "Ronaldinho en su máximo esplendor.", created_at: "", updated_at: "" },
  { id: "5", club_id: "fcb", seller_id: null, slug: "barcelona-away-kappa-1996", name: "Barcelona Away Kappa", season: "1996-97", type: "Visitante", brand: "Kappa", size: "L", player_name: null, overall: 78, brightness: 74, color_integrity: 80, special_features: 76, stars: 4, price_cents: 38000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: false, is_drop: false, drop_date: null, description: null, story: null, created_at: "", updated_at: "" },
  { id: "6", club_id: "juv", seller_id: null, slug: "juventus-home-1995-96", name: "Juventus Home UCL Winners", season: "1995-96", type: "Local", brand: "Kappa", size: "L", player_name: "Del Piero", overall: 88, brightness: 85, color_integrity: 90, special_features: 86, stars: 5, price_cents: 75000, currency: "EUR", min_offer_pct: 80, is_sold: false, is_featured: true, is_drop: false, drop_date: null, description: "Juve campeona de la Champions League.", story: "Del Piero, Ravanelli, Vialli.", created_at: "", updated_at: "" },
];

export function getShirtBySlug(slug: string): Shirt | undefined {
  return DEMO_SHIRTS.find((s) => s.slug === slug);
}

export function getClubName(clubId: string): string {
  return DEMO_CLUB_NAMES[clubId] ?? "Club";
}
