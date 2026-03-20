/**
 * Maps ISO 3166-1 numeric codes (used by world-atlas TopoJSON)
 * to our internal country IDs (used in the Supabase `countries` table).
 *
 * To add a new country:
 * 1. Find its ISO numeric code at https://en.wikipedia.org/wiki/ISO_3166-1_numeric
 * 2. Add the mapping here
 * 3. Insert a row in the `countries` DB table with matching `id` and `iso_numeric`
 * 4. Add clubs to the `clubs` table referencing the new country
 */
export const ISO_NUM_TO_KEY: Record<string, string> = {
  // ── Europe ──
  "620": "portugal",
  "724": "spain",
  "250": "france",
  "826": "england",      // GBR — renders full Great Britain outline
  "56":  "belgium",
  "528": "netherlands",
  "276": "germany",
  "208": "denmark",
  "578": "norway",
  "752": "sweden",
  "246": "finland",
  "380": "italy",
  "756": "switzerland",
  "40":  "austria",
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
  "70":  "bosnia",
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
  "76":  "brazil",
  "152": "chile",
  "600": "paraguay",
  "858": "uruguay",
  "32":  "argentina",
  // Context countries (rendered but no clubs)
  "862": "venezuela",
  "218": "ecuador",
  "68":  "bolivia",
  "124": "canada",
  "591": "panama",
  "188": "costarica",
  "320": "guatemala",
  "340": "honduras",
};

/** Countries assigned to the Europe map tab */
export const EUROPE_ISOS = new Set([
  "620","724","250","826","56","528","276","208","578","752","246",
  "380","756","40","203","703","616","191","688","642","804","643","792",
  "372","348","100","300","70","705","112","440","428","233",
]);

/** Countries assigned to the Americas map tab */
export const AMERICAS_ISOS = new Set([
  "840","484","170","604","76","152","600","858","32",
  "862","218","68","124","591","188","320","340",
]);
