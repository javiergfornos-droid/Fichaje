/** Shirt type enum matching DB constraint */
export type ShirtType = "Local" | "Visitante" | "Especial";

/** Shirt size enum matching DB constraint */
export type ShirtSize = "S" | "M" | "L" | "XL" | "XXL";

/** Shirt data from the shirts table */
export interface Shirt {
  id: string;
  club_id: string;
  seller_id: string | null;
  slug: string;
  name: string;
  season: string;
  type: ShirtType;
  brand: string;
  size: ShirtSize;
  player_name: string | null;
  overall: number;
  brightness: number;
  color_integrity: number;
  special_features: number;
  stars: number;
  price_cents: number;
  currency: string;
  min_offer_pct: number;
  is_sold: boolean;
  is_featured: boolean;
  is_drop: boolean;
  drop_date: string | null;
  description: string | null;
  story: string | null;
  created_at: string;
  updated_at: string;
}

/** Shirt image from the shirt_images table */
export interface ShirtImage {
  id: string;
  shirt_id: string;
  url: string;
  alt_text: string | null;
  position: number;
  is_front: boolean;
  is_back: boolean;
  created_at: string;
}
