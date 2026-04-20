import type { Country } from "@/types/country";

/**
 * Mock countries — shared across all /map routes.
 * `flag` kept empty (no emojis on the map), `iso_code` drives the flag-icons sprite.
 * UK sub-nations (England / Scotland / Wales / N. Ireland) share iso_numeric "826"
 * and carry individual flag_center overrides so their flags don't stack.
 */
export const DEMO_COUNTRIES: Country[] = [
  // ── Europe ──
  { id: "portugal",         name: "PORTUGAL",          flag: "", iso_code: "pt",     continent: "europe", iso_numeric: "620", sort_order: 0,  created_at: "" },
  { id: "spain",            name: "ESPAÑA",            flag: "", iso_code: "es",     continent: "europe", iso_numeric: "724", sort_order: 1,  created_at: "" },
  { id: "france",           name: "FRANCIA",           flag: "", iso_code: "fr",     continent: "europe", iso_numeric: "250", sort_order: 2,  created_at: "" },
  { id: "england",          name: "INGLATERRA",        flag: "", iso_code: "gb-eng", continent: "europe", iso_numeric: "826", flag_center: [-1.2, 52.5], sort_order: 3,  created_at: "" },
  { id: "scotland",         name: "ESCOCIA",           flag: "", iso_code: "gb-sct", continent: "europe", iso_numeric: "826", flag_center: [-3.9, 56.5], sort_order: 4,  created_at: "" },
  { id: "wales",            name: "GALES",             flag: "", iso_code: "gb-wls", continent: "europe", iso_numeric: "826", flag_center: [-3.5, 52.3], sort_order: 5,  created_at: "" },
  { id: "northern_ireland", name: "IRLANDA DEL NORTE", flag: "", iso_code: "gb-nir", continent: "europe", iso_numeric: "826", flag_center: [-6.8, 54.6], sort_order: 6,  created_at: "" },
  { id: "ireland",          name: "IRLANDA",           flag: "", iso_code: "ie",     continent: "europe", iso_numeric: "372", sort_order: 7,  created_at: "" },
  { id: "netherlands",      name: "PAÍSES BAJOS",      flag: "", iso_code: "nl",     continent: "europe", iso_numeric: "528", sort_order: 8,  created_at: "" },
  { id: "belgium",          name: "BÉLGICA",           flag: "", iso_code: "be",     continent: "europe", iso_numeric: "056", sort_order: 9,  created_at: "" },
  { id: "germany",          name: "ALEMANIA",          flag: "", iso_code: "de",     continent: "europe", iso_numeric: "276", flag_center: [10.5, 51.3], sort_order: 10, created_at: "" },
  { id: "switzerland",      name: "SUIZA",             flag: "", iso_code: "ch",     continent: "europe", iso_numeric: "756", sort_order: 11, created_at: "" },
  { id: "austria",          name: "AUSTRIA",           flag: "", iso_code: "at",     continent: "europe", iso_numeric: "040", sort_order: 12, created_at: "" },
  { id: "italy",            name: "ITALIA",            flag: "", iso_code: "it",     continent: "europe", iso_numeric: "380", sort_order: 13, created_at: "" },
  { id: "denmark",          name: "DINAMARCA",         flag: "", iso_code: "dk",     continent: "europe", iso_numeric: "208", sort_order: 14, created_at: "" },
  { id: "sweden",           name: "SUECIA",            flag: "", iso_code: "se",     continent: "europe", iso_numeric: "752", sort_order: 15, created_at: "" },
  { id: "norway",           name: "NORUEGA",           flag: "", iso_code: "no",     continent: "europe", iso_numeric: "578", sort_order: 16, created_at: "" },
  { id: "finland",          name: "FINLANDIA",         flag: "", iso_code: "fi",     continent: "europe", iso_numeric: "246", sort_order: 17, created_at: "" },
  { id: "iceland",          name: "ISLANDIA",          flag: "", iso_code: "is",     continent: "europe", iso_numeric: "352", sort_order: 18, created_at: "" },
  { id: "poland",           name: "POLONIA",           flag: "", iso_code: "pl",     continent: "europe", iso_numeric: "616", sort_order: 19, created_at: "" },
  { id: "czech",            name: "REPÚBLICA CHECA",   flag: "", iso_code: "cz",     continent: "europe", iso_numeric: "203", sort_order: 20, created_at: "" },
  { id: "slovakia",         name: "ESLOVAQUIA",        flag: "", iso_code: "sk",     continent: "europe", iso_numeric: "703", sort_order: 21, created_at: "" },
  { id: "hungary",          name: "HUNGRÍA",           flag: "", iso_code: "hu",     continent: "europe", iso_numeric: "348", sort_order: 22, created_at: "" },
  { id: "romania",          name: "RUMANÍA",           flag: "", iso_code: "ro",     continent: "europe", iso_numeric: "642", sort_order: 23, created_at: "" },
  { id: "bulgaria",         name: "BULGARIA",          flag: "", iso_code: "bg",     continent: "europe", iso_numeric: "100", sort_order: 24, created_at: "" },
  { id: "greece",           name: "GRECIA",            flag: "", iso_code: "gr",     continent: "europe", iso_numeric: "300", sort_order: 25, created_at: "" },
  { id: "croatia",          name: "CROACIA",           flag: "", iso_code: "hr",     continent: "europe", iso_numeric: "191", sort_order: 26, created_at: "" },
  { id: "serbia",           name: "SERBIA",            flag: "", iso_code: "rs",     continent: "europe", iso_numeric: "688", sort_order: 27, created_at: "" },
  { id: "ukraine",          name: "UCRANIA",           flag: "", iso_code: "ua",     continent: "europe", iso_numeric: "804", sort_order: 28, created_at: "" },
  { id: "russia",           name: "RUSIA",             flag: "", iso_code: "ru",     continent: "europe", iso_numeric: "643", sort_order: 29, created_at: "" },
  { id: "turkey",           name: "TURQUÍA",           flag: "", iso_code: "tr",     continent: "europe", iso_numeric: "792", sort_order: 30, created_at: "" },
  // ── South America ──
  { id: "brazil",           name: "BRASIL",            flag: "", iso_code: "br",     continent: "americas", iso_numeric: "076", sort_order: 0,  created_at: "" },
  { id: "argentina",        name: "ARGENTINA",         flag: "", iso_code: "ar",     continent: "americas", iso_numeric: "032", sort_order: 1,  created_at: "" },
  { id: "uruguay",          name: "URUGUAY",           flag: "", iso_code: "uy",     continent: "americas", iso_numeric: "858", sort_order: 2,  created_at: "" },
  { id: "chile",            name: "CHILE",             flag: "", iso_code: "cl",     continent: "americas", iso_numeric: "152", sort_order: 3,  created_at: "" },
  { id: "paraguay",         name: "PARAGUAY",          flag: "", iso_code: "py",     continent: "americas", iso_numeric: "600", sort_order: 4,  created_at: "" },
  { id: "peru",             name: "PERÚ",              flag: "", iso_code: "pe",     continent: "americas", iso_numeric: "604", sort_order: 5,  created_at: "" },
  { id: "colombia",         name: "COLOMBIA",          flag: "", iso_code: "co",     continent: "americas", iso_numeric: "170", sort_order: 6,  created_at: "" },
  { id: "ecuador",          name: "ECUADOR",           flag: "", iso_code: "ec",     continent: "americas", iso_numeric: "218", sort_order: 7,  created_at: "" },
  { id: "venezuela",        name: "VENEZUELA",         flag: "", iso_code: "ve",     continent: "americas", iso_numeric: "862", sort_order: 8,  created_at: "" },
  { id: "bolivia",          name: "BOLIVIA",           flag: "", iso_code: "bo",     continent: "americas", iso_numeric: "068", sort_order: 9,  created_at: "" },
];

export function getCountryById(id: string): Country | undefined {
  return DEMO_COUNTRIES.find((c) => c.id === id);
}
