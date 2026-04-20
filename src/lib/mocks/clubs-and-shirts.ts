/**
 * Mock clubs + shirts — shared across all /map routes and the ficha page.
 * Club list is hand-curated. Shirts are generated deterministically per club
 * (2-3 per club, varied year / brand / type / stats) so every slug is unique
 * and stable across renders.
 */

export type ShirtStyle =
  | "solid"
  | "striped_vertical"
  | "striped_horizontal"
  | "quartered"
  | "halves";

export type ShirtType =
  | "local"
  | "away"
  | "third"
  | "goalkeeper"
  | "sweatshirt";

export type ShirtSize = "S" | "M" | "L" | "XL" | "XXL";

export interface MockClub {
  id: string;
  country_id: string;
  name: string;
  short_name: string;
  category: "clubs" | "national_teams";
  primary_color: string;
  secondary_color: string;
  shirt_style: ShirtStyle;
  founded_year: number;
}

export interface MockShirt {
  id: string;
  slug: string;
  club_id: string;
  year: number;
  season: string;
  type: ShirtType;
  brand: string;
  size: ShirtSize;
  competition?: string;
  price_cents: number;
  min_offer_pct: number;
  stat_condition: number;
  stat_color: number;
  stat_integrity: number;
  stat_iconicity: number;
  match_worn?: boolean;
  kitlegit_url?: string | null;
  description_es: string;
  description_en: string;
  photos: string[];
}

export const CLUBS: MockClub[] = [
  // ── Spain ──
  { id: "fc-barcelona",             country_id: "spain",   name: "FC Barcelona",            short_name: "BARCELONA",   category: "clubs", primary_color: "#004D98", secondary_color: "#A50044", shirt_style: "striped_vertical",   founded_year: 1899 },
  { id: "real-madrid",              country_id: "spain",   name: "Real Madrid",             short_name: "REAL MADRID", category: "clubs", primary_color: "#FFFFFF", secondary_color: "#FEBE10", shirt_style: "solid",              founded_year: 1902 },
  { id: "atletico-madrid",          country_id: "spain",   name: "Atlético de Madrid",      short_name: "ATLETI",      category: "clubs", primary_color: "#CB3524", secondary_color: "#FFFFFF", shirt_style: "striped_vertical",   founded_year: 1903 },
  { id: "valencia-cf",              country_id: "spain",   name: "Valencia CF",             short_name: "VALENCIA",    category: "clubs", primary_color: "#FF6600", secondary_color: "#000000", shirt_style: "solid",              founded_year: 1919 },
  { id: "sevilla-fc",               country_id: "spain",   name: "Sevilla FC",              short_name: "SEVILLA",     category: "clubs", primary_color: "#FFFFFF", secondary_color: "#CB0C0F", shirt_style: "solid",              founded_year: 1890 },
  { id: "real-sporting",            country_id: "spain",   name: "Real Sporting",           short_name: "SPORTING",    category: "clubs", primary_color: "#E41E20", secondary_color: "#FFFFFF", shirt_style: "striped_vertical",   founded_year: 1905 },
  { id: "deportivo-coruna",         country_id: "spain",   name: "Deportivo de La Coruña",  short_name: "DEPOR",       category: "clubs", primary_color: "#2E6DB4", secondary_color: "#FFFFFF", shirt_style: "striped_vertical",   founded_year: 1906 },
  { id: "real-betis",               country_id: "spain",   name: "Real Betis",              short_name: "BETIS",       category: "clubs", primary_color: "#00954C", secondary_color: "#FFFFFF", shirt_style: "striped_vertical",   founded_year: 1907 },
  // ── England ──
  { id: "manchester-united",        country_id: "england", name: "Manchester United",       short_name: "MAN UNITED",  category: "clubs", primary_color: "#DA020E", secondary_color: "#FFE500", shirt_style: "solid",              founded_year: 1878 },
  { id: "liverpool-fc",             country_id: "england", name: "Liverpool FC",            short_name: "LIVERPOOL",   category: "clubs", primary_color: "#C8102E", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1892 },
  { id: "arsenal-fc",               country_id: "england", name: "Arsenal FC",              short_name: "ARSENAL",     category: "clubs", primary_color: "#EF0107", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1886 },
  { id: "newcastle-united",         country_id: "england", name: "Newcastle United",        short_name: "NEWCASTLE",   category: "clubs", primary_color: "#241F20", secondary_color: "#FFFFFF", shirt_style: "striped_vertical",   founded_year: 1892 },
  { id: "chelsea-fc",               country_id: "england", name: "Chelsea FC",              short_name: "CHELSEA",     category: "clubs", primary_color: "#034694", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1905 },
  { id: "tottenham",                country_id: "england", name: "Tottenham Hotspur",       short_name: "TOTTENHAM",   category: "clubs", primary_color: "#FFFFFF", secondary_color: "#132257", shirt_style: "solid",              founded_year: 1882 },
  { id: "manchester-city",          country_id: "england", name: "Manchester City",         short_name: "MAN CITY",    category: "clubs", primary_color: "#6CABDD", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1880 },
  { id: "leeds-united",             country_id: "england", name: "Leeds United",            short_name: "LEEDS",       category: "clubs", primary_color: "#FFFFFF", secondary_color: "#FFCD00", shirt_style: "solid",              founded_year: 1919 },
  // ── Italy ──
  { id: "ac-milan",                 country_id: "italy",   name: "AC Milan",                short_name: "MILAN",       category: "clubs", primary_color: "#FB090B", secondary_color: "#000000", shirt_style: "striped_vertical",   founded_year: 1899 },
  { id: "inter-milan",              country_id: "italy",   name: "Inter Milan",             short_name: "INTER",       category: "clubs", primary_color: "#010E80", secondary_color: "#000000", shirt_style: "striped_vertical",   founded_year: 1908 },
  { id: "juventus",                 country_id: "italy",   name: "Juventus",                short_name: "JUVE",        category: "clubs", primary_color: "#FFFFFF", secondary_color: "#000000", shirt_style: "striped_vertical",   founded_year: 1897 },
  { id: "as-roma",                  country_id: "italy",   name: "AS Roma",                 short_name: "ROMA",        category: "clubs", primary_color: "#8E1F2F", secondary_color: "#F0BC42", shirt_style: "solid",              founded_year: 1927 },
  { id: "ss-lazio",                 country_id: "italy",   name: "SS Lazio",                short_name: "LAZIO",       category: "clubs", primary_color: "#87CEEB", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1900 },
  { id: "ssc-napoli",               country_id: "italy",   name: "SSC Napoli",              short_name: "NAPOLI",      category: "clubs", primary_color: "#12A0D7", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1926 },
  { id: "fiorentina",               country_id: "italy",   name: "Fiorentina",              short_name: "FIORENTINA",  category: "clubs", primary_color: "#582C83", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1926 },
  { id: "parma",                    country_id: "italy",   name: "Parma Calcio",            short_name: "PARMA",       category: "clubs", primary_color: "#FFDF00", secondary_color: "#0066B2", shirt_style: "quartered",          founded_year: 1913 },
  // ── Germany ──
  { id: "bayern-munich",            country_id: "germany", name: "Bayern München",          short_name: "BAYERN",      category: "clubs", primary_color: "#DC052D", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1900 },
  { id: "borussia-dortmund",        country_id: "germany", name: "Borussia Dortmund",       short_name: "DORTMUND",    category: "clubs", primary_color: "#FDE100", secondary_color: "#000000", shirt_style: "solid",              founded_year: 1909 },
  { id: "werder-bremen",            country_id: "germany", name: "Werder Bremen",           short_name: "BREMEN",      category: "clubs", primary_color: "#1D9053", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1899 },
  { id: "vfb-stuttgart",            country_id: "germany", name: "VfB Stuttgart",           short_name: "STUTTGART",   category: "clubs", primary_color: "#FFFFFF", secondary_color: "#E32219", shirt_style: "solid",              founded_year: 1893 },
  { id: "hamburger-sv",             country_id: "germany", name: "Hamburger SV",            short_name: "HAMBURG",     category: "clubs", primary_color: "#FFFFFF", secondary_color: "#0A3F91", shirt_style: "solid",              founded_year: 1887 },
  { id: "bayer-leverkusen",         country_id: "germany", name: "Bayer 04 Leverkusen",     short_name: "LEVERKUSEN",  category: "clubs", primary_color: "#E32221", secondary_color: "#000000", shirt_style: "solid",              founded_year: 1904 },
  { id: "schalke-04",               country_id: "germany", name: "Schalke 04",              short_name: "SCHALKE",     category: "clubs", primary_color: "#004D9D", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1904 },
  { id: "borussia-monchengladbach", country_id: "germany", name: "Borussia Mönchengladbach",short_name: "GLADBACH",    category: "clubs", primary_color: "#FFFFFF", secondary_color: "#000000", shirt_style: "solid",              founded_year: 1900 },
  // ── France ──
  { id: "psg",                      country_id: "france",  name: "Paris Saint-Germain",     short_name: "PSG",         category: "clubs", primary_color: "#004170", secondary_color: "#DA291C", shirt_style: "solid",              founded_year: 1970 },
  { id: "olympique-marseille",      country_id: "france",  name: "Olympique de Marseille",  short_name: "MARSEILLE",   category: "clubs", primary_color: "#FFFFFF", secondary_color: "#009DDC", shirt_style: "solid",              founded_year: 1899 },
  { id: "as-monaco",                country_id: "france",  name: "AS Monaco",               short_name: "MONACO",      category: "clubs", primary_color: "#CF092E", secondary_color: "#FFFFFF", shirt_style: "halves",             founded_year: 1924 },
  { id: "olympique-lyonnais",       country_id: "france",  name: "Olympique Lyonnais",      short_name: "LYON",        category: "clubs", primary_color: "#FFFFFF", secondary_color: "#0040A8", shirt_style: "solid",              founded_year: 1950 },
  { id: "fc-nantes",                country_id: "france",  name: "FC Nantes",               short_name: "NANTES",      category: "clubs", primary_color: "#FFDF00", secondary_color: "#008040", shirt_style: "solid",              founded_year: 1943 },
  { id: "girondins-bordeaux",       country_id: "france",  name: "Girondins de Bordeaux",   short_name: "BORDEAUX",    category: "clubs", primary_color: "#000080", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1881 },
  // ── Netherlands ──
  { id: "ajax",                     country_id: "netherlands", name: "AFC Ajax",            short_name: "AJAX",        category: "clubs", primary_color: "#D2122E", secondary_color: "#FFFFFF", shirt_style: "striped_vertical",   founded_year: 1900 },
  { id: "psv",                      country_id: "netherlands", name: "PSV Eindhoven",       short_name: "PSV",         category: "clubs", primary_color: "#ED1C24", secondary_color: "#FFFFFF", shirt_style: "striped_vertical",   founded_year: 1913 },
  { id: "feyenoord",                country_id: "netherlands", name: "Feyenoord",           short_name: "FEYENOORD",   category: "clubs", primary_color: "#ED1C24", secondary_color: "#FFFFFF", shirt_style: "halves",             founded_year: 1908 },
  { id: "az-alkmaar",               country_id: "netherlands", name: "AZ Alkmaar",          short_name: "AZ",          category: "clubs", primary_color: "#E3051B", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1967 },
  // ── Portugal ──
  { id: "sl-benfica",               country_id: "portugal", name: "SL Benfica",             short_name: "BENFICA",     category: "clubs", primary_color: "#E30613", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1904 },
  { id: "fc-porto",                 country_id: "portugal", name: "FC Porto",               short_name: "PORTO",       category: "clubs", primary_color: "#0033A0", secondary_color: "#FFFFFF", shirt_style: "striped_vertical",   founded_year: 1893 },
  { id: "sporting-cp",              country_id: "portugal", name: "Sporting CP",            short_name: "SPORTING",    category: "clubs", primary_color: "#008040", secondary_color: "#FFFFFF", shirt_style: "striped_horizontal", founded_year: 1906 },
  // ── Scotland ──
  { id: "celtic-fc",                country_id: "scotland", name: "Celtic FC",              short_name: "CELTIC",      category: "clubs", primary_color: "#008040", secondary_color: "#FFFFFF", shirt_style: "striped_horizontal", founded_year: 1887 },
  { id: "rangers-fc",               country_id: "scotland", name: "Rangers FC",             short_name: "RANGERS",     category: "clubs", primary_color: "#004D9D", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1872 },
  { id: "aberdeen",                 country_id: "scotland", name: "Aberdeen FC",            short_name: "ABERDEEN",    category: "clubs", primary_color: "#E03A3E", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1903 },
  { id: "hearts",                   country_id: "scotland", name: "Hearts of Midlothian",   short_name: "HEARTS",      category: "clubs", primary_color: "#800020", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1874 },
  // ── Belgium ──
  { id: "anderlecht",               country_id: "belgium",  name: "RSC Anderlecht",         short_name: "ANDERLECHT",  category: "clubs", primary_color: "#7B1F2C", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1908 },
  { id: "club-brugge",              country_id: "belgium",  name: "Club Brugge",            short_name: "BRUGGE",      category: "clubs", primary_color: "#0033A0", secondary_color: "#000000", shirt_style: "solid",              founded_year: 1891 },
  { id: "standard-liege",           country_id: "belgium",  name: "Standard Liège",         short_name: "STANDARD",    category: "clubs", primary_color: "#E03A3E", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1898 },
  // ── Brazil ──
  { id: "flamengo",                 country_id: "brazil",   name: "CR Flamengo",            short_name: "FLAMENGO",    category: "clubs", primary_color: "#D00027", secondary_color: "#000000", shirt_style: "striped_horizontal", founded_year: 1895 },
  { id: "santos",                   country_id: "brazil",   name: "Santos FC",              short_name: "SANTOS",      category: "clubs", primary_color: "#FFFFFF", secondary_color: "#000000", shirt_style: "solid",              founded_year: 1912 },
  { id: "sao-paulo",                country_id: "brazil",   name: "São Paulo FC",           short_name: "SAO PAULO",   category: "clubs", primary_color: "#FFFFFF", secondary_color: "#E3051B", shirt_style: "striped_horizontal", founded_year: 1930 },
  { id: "palmeiras",                country_id: "brazil",   name: "Palmeiras",              short_name: "PALMEIRAS",   category: "clubs", primary_color: "#1D9053", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1914 },
  { id: "corinthians",              country_id: "brazil",   name: "Corinthians",            short_name: "CORINTHIANS", category: "clubs", primary_color: "#FFFFFF", secondary_color: "#000000", shirt_style: "solid",              founded_year: 1910 },
  { id: "fluminense",               country_id: "brazil",   name: "Fluminense",             short_name: "FLUMINENSE",  category: "clubs", primary_color: "#800020", secondary_color: "#008040", shirt_style: "striped_vertical",   founded_year: 1902 },
  { id: "gremio",                   country_id: "brazil",   name: "Grêmio",                 short_name: "GREMIO",      category: "clubs", primary_color: "#00A0E1", secondary_color: "#000000", shirt_style: "striped_vertical",   founded_year: 1903 },
  { id: "internacional",            country_id: "brazil",   name: "SC Internacional",       short_name: "INTER POA",   category: "clubs", primary_color: "#E30613", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1909 },
  // ── Argentina ──
  { id: "boca-juniors",             country_id: "argentina", name: "Boca Juniors",          short_name: "BOCA",        category: "clubs", primary_color: "#003F8A", secondary_color: "#FFDF00", shirt_style: "solid",              founded_year: 1905 },
  { id: "river-plate",              country_id: "argentina", name: "River Plate",           short_name: "RIVER",       category: "clubs", primary_color: "#FFFFFF", secondary_color: "#E30613", shirt_style: "halves",             founded_year: 1901 },
  { id: "independiente",            country_id: "argentina", name: "Independiente",         short_name: "INDEP.",      category: "clubs", primary_color: "#E30613", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1905 },
  { id: "racing-club",              country_id: "argentina", name: "Racing Club",           short_name: "RACING",      category: "clubs", primary_color: "#00A0E1", secondary_color: "#FFFFFF", shirt_style: "striped_vertical",   founded_year: 1903 },
  { id: "san-lorenzo",              country_id: "argentina", name: "San Lorenzo",           short_name: "SAN LORENZO", category: "clubs", primary_color: "#003F8A", secondary_color: "#E30613", shirt_style: "striped_vertical",   founded_year: 1908 },
  { id: "estudiantes",              country_id: "argentina", name: "Estudiantes LP",        short_name: "ESTUDIANTES", category: "clubs", primary_color: "#E30613", secondary_color: "#FFFFFF", shirt_style: "striped_horizontal", founded_year: 1905 },
  // ── Uruguay ──
  { id: "penarol",                  country_id: "uruguay",  name: "Club Atlético Peñarol",  short_name: "PEÑAROL",     category: "clubs", primary_color: "#FFDF00", secondary_color: "#000000", shirt_style: "solid",              founded_year: 1891 },
  { id: "nacional",                 country_id: "uruguay",  name: "Club Nacional",          short_name: "NACIONAL",    category: "clubs", primary_color: "#FFFFFF", secondary_color: "#003F8A", shirt_style: "solid",              founded_year: 1899 },
  // ── Chile ──
  { id: "colo-colo",                country_id: "chile",    name: "Colo-Colo",              short_name: "COLO-COLO",   category: "clubs", primary_color: "#FFFFFF", secondary_color: "#000000", shirt_style: "solid",              founded_year: 1925 },
  { id: "universidad-chile",        country_id: "chile",    name: "Universidad de Chile",   short_name: "U. DE CHILE", category: "clubs", primary_color: "#003F8A", secondary_color: "#E30613", shirt_style: "solid",              founded_year: 1927 },
  // ── Colombia ──
  { id: "atletico-nacional",        country_id: "colombia", name: "Atlético Nacional",      short_name: "NACIONAL",    category: "clubs", primary_color: "#008040", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1947 },
  { id: "millonarios",              country_id: "colombia", name: "Millonarios",            short_name: "MILLOS",      category: "clubs", primary_color: "#003F8A", secondary_color: "#FFFFFF", shirt_style: "solid",              founded_year: 1946 },
];

const BRANDS = ["Adidas", "Nike", "Umbro", "Kappa", "Le Coq Sportif", "Meyba", "Puma"];
const SIZES: ShirtSize[] = ["S", "M", "L", "XL", "XXL"];
const TYPES: ShirtType[] = ["local", "away", "third", "goalkeeper", "sweatshirt"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Deterministic mock shirt generator — 2–3 shirts per club, varied attributes. */
function generateShirts(): MockShirt[] {
  const all: MockShirt[] = [];
  CLUBS.forEach((club, clubIdx) => {
    const shirtCount = 2 + (clubIdx % 2); // 2 or 3 shirts per club
    for (let i = 0; i < shirtCount; i++) {
      const year = 1975 + ((clubIdx * 7 + i * 13) % 45); // 1975-2019
      const brand = BRANDS[(clubIdx + i) % BRANDS.length];
      const size = SIZES[(clubIdx + i * 2) % SIZES.length];
      const type = TYPES[(clubIdx + i * 2) % TYPES.length];
      // Price between 80€ and 800€
      const priceEur = 80 + ((clubIdx * 79 + i * 113) % 720);
      const price_cents = priceEur * 100;
      const stat_condition = clamp(70 + ((clubIdx * 3 + i) % 30), 55, 99);
      const stat_color = clamp(70 + ((clubIdx * 5 + i * 2) % 30), 55, 99);
      const stat_integrity = clamp(70 + ((clubIdx * 7 + i * 3) % 30), 55, 99);
      const stat_iconicity = clamp(40 + ((clubIdx * 11 + i * 5) % 60), 30, 99);
      const yearEnd = (year + 1).toString().slice(-2);
      const season = `${year}-${yearEnd}`;
      const slug = `${year}-${yearEnd}-${club.id}-${type}-${i + 1}`;
      const id = `shirt-${club.id}-${i + 1}`;
      const typeLabelEs =
        type === "local"
          ? "titular"
          : type === "away"
            ? "visitante"
            : type === "third"
              ? "tercera"
              : type === "goalkeeper"
                ? "portero"
                : "sudadera";
      const typeLabelEn =
        type === "local"
          ? "home"
          : type === "away"
            ? "away"
            : type === "third"
              ? "third"
              : type === "goalkeeper"
                ? "goalkeeper"
                : "sweatshirt";
      all.push({
        id,
        slug,
        club_id: club.id,
        year,
        season,
        type,
        brand,
        size,
        price_cents,
        min_offer_pct: 80,
        stat_condition,
        stat_color,
        stat_integrity,
        stat_iconicity,
        description_es: `Camiseta ${typeLabelEs} de ${club.name} temporada ${season}, fabricada por ${brand}. Talla ${size}.`,
        description_en: `${typeLabelEn.charAt(0).toUpperCase() + typeLabelEn.slice(1)} ${club.name} shirt, ${season} season. ${brand} branded. Size ${size}.`,
        photos: [],
      });
    }
  });
  return all;
}

/** Hand-curated featured shirts — override/append to the generated set. */
const FEATURED_SHIRTS: MockShirt[] = [
  {
    id: "shirt-arsenal-bruised-banana",
    slug: "1991-93-arsenal-away-bruised-banana",
    club_id: "arsenal-fc",
    year: 1991,
    season: "1991-1993",
    type: "away",
    brand: "Adidas",
    size: "L",
    competition: "Premier League",
    price_cents: 45000,
    min_offer_pct: 75,
    stat_condition: 88,
    stat_color: 85,
    stat_integrity: 90,
    stat_iconicity: 92,
    match_worn: false,
    kitlegit_url: null,
    description_es:
      "Una de las camisetas más icónicas de los 90. El patrón 'bruised banana' diseñado por Adidas se convirtió en símbolo de la era pre-Wenger del Arsenal. Camiseta visitante utilizada entre 1991 y 1993.",
    description_en:
      "One of the most iconic shirts of the 90s. Adidas's 'bruised banana' pattern became a symbol of the pre-Wenger Arsenal era. Away shirt used between 1991 and 1993.",
    photos: [],
  },
];

export const SHIRTS: MockShirt[] = [...generateShirts(), ...FEATURED_SHIRTS];

export function getClubById(id: string): MockClub | undefined {
  return CLUBS.find((c) => c.id === id);
}

export function getClubsByCountry(countryId: string): MockClub[] {
  return CLUBS.filter((c) => c.country_id === countryId);
}

export function getShirtsByClub(clubId: string): MockShirt[] {
  return SHIRTS.filter((s) => s.club_id === clubId);
}

export function getShirtBySlug(slug: string): MockShirt | undefined {
  return SHIRTS.find((s) => s.slug === slug);
}

export function formatShirtPrice(cents: number): string {
  const euros = cents / 100;
  return `€${euros.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
