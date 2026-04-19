/**
 * Maps ISO 3166-1 numeric codes (used by world-atlas TopoJSON)
 * to our internal country IDs (used in the Supabase `countries` table).
 *
 * IMPORTANT: world-atlas uses zero-padded 3-digit strings as feature IDs
 * (e.g. "032" for Argentina, not "32").
 *
 * To add a new country:
 * 1. Find its ISO numeric code at https://en.wikipedia.org/wiki/ISO_3166-1_numeric
 * 2. Add the zero-padded mapping here
 * 3. Insert a row in the `countries` DB table with matching `id` and `iso_numeric`
 * 4. Add clubs to the `clubs` table referencing the new country
 */
export const ISO_NUM_TO_KEY: Record<string, string> = {
  // ── Europe ──
  "620": "portugal",
  "724": "spain",
  "250": "france",
  "826": "england",      // GBR — renders full Great Britain outline
  "056": "belgium",
  "528": "netherlands",
  "276": "germany",
  "208": "denmark",
  "578": "norway",
  "752": "sweden",
  "246": "finland",
  "380": "italy",
  "756": "switzerland",
  "040": "austria",
  "203": "czech",
  "703": "slovakia",
  "616": "poland",
  "191": "croatia",
  "688": "serbia",
  "642": "romania",
  "804": "ukraine",
  "643": "russia",
  "792": "turkey",
  // Context countries (rendered but no clubs)
  "372": "ireland",
  "348": "hungary",
  "100": "bulgaria",
  "300": "greece",
  "070": "bosnia",
  "705": "slovenia",
  "112": "belarus",
  "440": "lithuania",
  "428": "latvia",
  "233": "estonia",
  // ── Americas ──
  "840": "usa",
  "484": "mexico",
  "170": "colombia",
  "604": "peru",
  "076": "brazil",
  "152": "chile",
  "600": "paraguay",
  "858": "uruguay",
  "032": "argentina",
  // Context countries (rendered but no clubs)
  "862": "venezuela",
  "218": "ecuador",
  "068": "bolivia",
  "124": "canada",
  "591": "panama",
  "188": "costarica",
  "320": "guatemala",
  "340": "honduras",
};

/**
 * Maps ISO 3166-1 numeric codes to flagcdn.com alpha-2 codes (lowercase).
 * Used for loading flag images: https://flagcdn.com/w160/{code}.png
 *
 * Note: England (826) uses "gb" since flagcdn uses sovereign state codes.
 */
export const ISO_NUM_TO_FLAG_CODE: Record<string, string> = {
  // Europe
  "620": "pt", "724": "es", "250": "fr", "826": "gb", "056": "be",
  "528": "nl", "276": "de", "208": "dk", "578": "no", "752": "se",
  "246": "fi", "380": "it", "756": "ch", "040": "at", "203": "cz",
  "703": "sk", "616": "pl", "191": "hr", "688": "rs", "642": "ro",
  "804": "ua", "643": "ru", "792": "tr",
  "372": "ie", "348": "hu", "100": "bg", "300": "gr", "070": "ba",
  "705": "si", "112": "by", "440": "lt", "428": "lv", "233": "ee",
  // Americas
  "840": "us", "484": "mx", "170": "co", "604": "pe", "076": "br",
  "152": "cl", "600": "py", "858": "uy", "032": "ar",
  "862": "ve", "218": "ec", "068": "bo", "124": "ca", "591": "pa",
  "188": "cr", "320": "gt", "340": "hn",
};

/** Countries assigned to the Europe map tab — includes context-only countries (no clubs). */
export const EUROPE_ISOS = new Set([
  "620","724","250","826","056","528","276","208","578","752","246",
  "380","756","040","203","703","616","191","688","642","804","643","792",
  "372","348","100","300","070","705","112","440","428","233",
  // v3 context additions: Iceland, Albania, Moldova, Montenegro, N. Macedonia, Luxembourg
  "352","008","498","499","807","442",
]);

/** Countries assigned to the Americas map tab */
export const AMERICAS_ISOS = new Set([
  "840","484","170","604","076","152","600","858","032",
  "862","218","068","124","591","188","320","340",
]);
