/**
 * Format price from cents to euros with European number format.
 * Example: 28000 → "280,00 €" or "€280,00"
 */
export function formatPrice(cents: number, prefix = true): string {
  const euros = cents / 100;
  const formatted = euros.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return prefix ? `€${formatted}` : formatted;
}

/**
 * Format a number with European thousands separator.
 * Example: 12847 → "12.847"
 */
export function formatNumber(n: number): string {
  return n.toLocaleString("es-ES");
}

/**
 * Format a date in European style (DD/MM/YYYY).
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Format time in 24-hour format.
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
