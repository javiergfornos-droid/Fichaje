/**
 * Get the color for a stat bar based on its value.
 */
export function getStatColor(value: number): string {
  if (value >= 90) return "#30C040";
  if (value >= 75) return "#30A0E0";
  if (value >= 60) return "#E8C840";
  return "#D83030";
}

/**
 * Get the color for a MEDIA (overall) score.
 */
export function getMediaColor(value: number): string {
  if (value >= 90) return "#30C040";
  if (value >= 75) return "#30A0E0";
  return "#E8C840";
}

/**
 * Calculate star rating from overall condition score.
 */
export function getStarsFromOverall(overall: number): number {
  if (overall >= 88) return 5;
  if (overall >= 78) return 4;
  if (overall >= 65) return 3;
  if (overall >= 50) return 2;
  return 1;
}

/**
 * Get the Spanish label for a shirt type.
 */
export function getTypeLabel(type: "Local" | "Visitante" | "Especial"): string {
  const labels: Record<string, string> = {
    Local: "EQUIPACIÓN LOCAL",
    Visitante: "EQUIPACIÓN VISITANTE",
    Especial: "EQUIPACIÓN ESPECIAL",
  };
  return labels[type] ?? type;
}

/**
 * Get the badge color for a shirt type.
 */
export function getTypeBadgeColor(type: "Local" | "Visitante" | "Especial"): string {
  const colors: Record<string, string> = {
    Local: "#30A030",
    Visitante: "#3060A0",
    Especial: "#D4A843",
  };
  return colors[type] ?? "#888888";
}

/**
 * Get the single-letter abbreviation for a shirt type.
 */
export function getTypeAbbr(type: "Local" | "Visitante" | "Especial"): string {
  const abbrs: Record<string, string> = {
    Local: "L",
    Visitante: "V",
    Especial: "E",
  };
  return abbrs[type] ?? "?";
}
