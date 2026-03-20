/**
 * Supabase database types placeholder.
 * Generate with: npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      countries: {
        Row: {
          id: string;
          name: string;
          flag: string;
          continent: string;
          geo_points: Json;
          flag_center: Json;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          flag: string;
          continent: string;
          geo_points: Json;
          flag_center: Json;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          flag?: string;
          continent?: string;
          geo_points?: Json;
          flag_center?: Json;
          sort_order?: number;
          created_at?: string;
        };
      };
      clubs: {
        Row: {
          id: string;
          country_id: string;
          name: string;
          badge_emoji: string;
          badge_url: string | null;
          color: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id: string;
          country_id: string;
          name: string;
          badge_emoji: string;
          badge_url?: string | null;
          color: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          country_id?: string;
          name?: string;
          badge_emoji?: string;
          badge_url?: string | null;
          color?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      shirts: {
        Row: {
          id: string;
          club_id: string;
          seller_id: string | null;
          slug: string;
          name: string;
          season: string;
          type: string;
          brand: string;
          size: string;
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
        };
        Insert: {
          id?: string;
          club_id: string;
          seller_id?: string | null;
          slug: string;
          name: string;
          season: string;
          type: string;
          brand: string;
          size: string;
          player_name?: string | null;
          overall: number;
          brightness: number;
          color_integrity: number;
          special_features: number;
          stars: number;
          price_cents: number;
          currency?: string;
          min_offer_pct?: number;
          is_sold?: boolean;
          is_featured?: boolean;
          is_drop?: boolean;
          drop_date?: string | null;
          description?: string | null;
          story?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["shirts"]["Insert"]>;
      };
      offers: {
        Row: {
          id: string;
          shirt_id: string;
          user_id: string;
          amount_cents: number;
          status: string;
          created_at: string;
          responded_at: string | null;
        };
        Insert: {
          id?: string;
          shirt_id: string;
          user_id: string;
          amount_cents: number;
          status?: string;
        };
        Update: Partial<Database["public"]["Tables"]["offers"]["Insert"]>;
      };
    };
  };
}
