/** Club data from the clubs table */
export interface Club {
  id: string;
  country_id: string;
  name: string;
  badge_emoji: string;
  badge_url: string | null;
  color: string;
  sort_order: number;
  created_at: string;
}
