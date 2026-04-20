import type { MockShirt } from "@/lib/mocks/clubs-and-shirts";

/**
 * ME (Media) rating — arithmetic mean of the four condition stats, rounded.
 * Matches the PC Fútbol "media" rating shown in the roster table.
 */
export function getShirtMedia(
  shirt: Pick<
    MockShirt,
    "stat_condition" | "stat_color" | "stat_integrity" | "stat_iconicity"
  >
): number {
  return Math.round(
    (shirt.stat_condition +
      shirt.stat_color +
      shirt.stat_integrity +
      shirt.stat_iconicity) /
      4
  );
}
