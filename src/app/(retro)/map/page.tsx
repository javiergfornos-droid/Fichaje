import MapPageClient from "./MapPageClient";
import type { Country } from "@/types/country";

export const metadata = {
  title: "¡FICHAJE! — Mapa de fichajes",
};

// Demo countries — in production this comes from Supabase
const DEMO_COUNTRIES: Country[] = [
  // Europe — countries with clubs
  { id: "portugal", name: "PORTUGAL", flag: "🇵🇹", continent: "europe", iso_numeric: "620", sort_order: 0, created_at: "" },
  { id: "spain", name: "ESPAÑA", flag: "🇪🇸", continent: "europe", iso_numeric: "724", sort_order: 1, created_at: "" },
  { id: "france", name: "FRANCIA", flag: "🇫🇷", continent: "europe", iso_numeric: "250", sort_order: 2, created_at: "" },
  { id: "england", name: "INGLATERRA", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", continent: "europe", iso_numeric: "826", sort_order: 3, created_at: "" },
  { id: "netherlands", name: "PAÍSES BAJOS", flag: "🇳🇱", continent: "europe", iso_numeric: "528", sort_order: 4, created_at: "" },
  { id: "germany", name: "ALEMANIA", flag: "🇩🇪", continent: "europe", iso_numeric: "276", sort_order: 5, created_at: "" },
  { id: "italy", name: "ITALIA", flag: "🇮🇹", continent: "europe", iso_numeric: "380", sort_order: 6, created_at: "" },
  // Americas — countries with clubs
  { id: "argentina", name: "ARGENTINA", flag: "🇦🇷", continent: "americas", iso_numeric: "32", sort_order: 0, created_at: "" },
  { id: "brazil", name: "BRASIL", flag: "🇧🇷", continent: "americas", iso_numeric: "76", sort_order: 1, created_at: "" },
];

// Demo clubs data — in production this comes from Supabase
const DEMO_CLUBS = [
  { id: "ars", country_id: "england", name: "Arsenal", badge_emoji: "🔴⚪", badge_url: null, color: "#EF0107", sort_order: 0, created_at: "" },
  { id: "mufc", country_id: "england", name: "Manchester United", badge_emoji: "🔴⚫", badge_url: null, color: "#DA291C", sort_order: 1, created_at: "" },
  { id: "lfc", country_id: "england", name: "Liverpool", badge_emoji: "🔴", badge_url: null, color: "#C8102E", sort_order: 2, created_at: "" },
  { id: "fcb", country_id: "spain", name: "FC Barcelona", badge_emoji: "🔵🔴", badge_url: null, color: "#004D98", sort_order: 0, created_at: "" },
  { id: "rma", country_id: "spain", name: "Real Madrid", badge_emoji: "⚪", badge_url: null, color: "#FEBE10", sort_order: 1, created_at: "" },
  { id: "atm", country_id: "spain", name: "Atlético de Madrid", badge_emoji: "🔴⚪", badge_url: null, color: "#CE3524", sort_order: 2, created_at: "" },
  { id: "juv", country_id: "italy", name: "Juventus", badge_emoji: "⚪⚫", badge_url: null, color: "#000000", sort_order: 0, created_at: "" },
  { id: "acm", country_id: "italy", name: "AC Milan", badge_emoji: "🔴⚫", badge_url: null, color: "#FB090B", sort_order: 1, created_at: "" },
  { id: "int", country_id: "italy", name: "Inter Milan", badge_emoji: "🔵⚫", badge_url: null, color: "#010E80", sort_order: 2, created_at: "" },
  { id: "bay", country_id: "germany", name: "Bayern München", badge_emoji: "🔴⚪", badge_url: null, color: "#DC052D", sort_order: 0, created_at: "" },
  { id: "bvb", country_id: "germany", name: "Borussia Dortmund", badge_emoji: "🟡⚫", badge_url: null, color: "#FDE100", sort_order: 1, created_at: "" },
  { id: "psg", country_id: "france", name: "Paris Saint-Germain", badge_emoji: "🔵🔴", badge_url: null, color: "#004170", sort_order: 0, created_at: "" },
  { id: "om", country_id: "france", name: "Olympique de Marseille", badge_emoji: "⚪🔵", badge_url: null, color: "#2FAEE0", sort_order: 1, created_at: "" },
  { id: "ben", country_id: "portugal", name: "Benfica", badge_emoji: "🔴⚪", badge_url: null, color: "#FF0000", sort_order: 0, created_at: "" },
  { id: "fcp", country_id: "portugal", name: "FC Porto", badge_emoji: "🔵⚪", badge_url: null, color: "#003F87", sort_order: 1, created_at: "" },
  { id: "aja", country_id: "netherlands", name: "Ajax", badge_emoji: "🔴⚪", badge_url: null, color: "#D2122E", sort_order: 0, created_at: "" },
  { id: "boc", country_id: "argentina", name: "Boca Juniors", badge_emoji: "🔵🟡", badge_url: null, color: "#003DA5", sort_order: 0, created_at: "" },
  { id: "riv", country_id: "argentina", name: "River Plate", badge_emoji: "⚪🔴", badge_url: null, color: "#E31937", sort_order: 1, created_at: "" },
  { id: "fla", country_id: "brazil", name: "Flamengo", badge_emoji: "🔴⚫", badge_url: null, color: "#D12325", sort_order: 0, created_at: "" },
  { id: "san", country_id: "brazil", name: "Santos", badge_emoji: "⚪⚫", badge_url: null, color: "#000000", sort_order: 1, created_at: "" },
];

/**
 * Map view page — the interactive retro world map.
 */
export default function MapPage() {
  return (
    <MapPageClient
      countries={DEMO_COUNTRIES}
      clubs={DEMO_CLUBS}
    />
  );
}
