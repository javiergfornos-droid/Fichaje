/** Search synonym dictionary for common club/player nicknames. */
export const SYNONYMS: Record<string, string> = {
  "man u": "manchester united",
  "man utd": "manchester united",
  mufc: "manchester united",
  "red devils": "manchester united",
  barca: "fc barcelona",
  fcb: "fc barcelona",
  juve: "juventus",
  "old lady": "juventus",
  inter: "inter milan",
  nerazzurri: "inter milan",
  cr7: "cristiano ronaldo",
  zizou: "zinedine zidane",
  "three lions": "england",
  "les bleus": "france",
  azzurri: "italy",
  "la roja": "spain",
  selecao: "brazil",
  oranje: "netherlands",
};

/**
 * Resolve synonyms in a search query.
 * Replaces known nicknames with their full names before querying.
 */
export function resolveSynonyms(query: string): string {
  const lower = query.toLowerCase().trim();
  return SYNONYMS[lower] ?? lower;
}
