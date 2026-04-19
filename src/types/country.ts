/** Country data from the countries table */
export interface Country {
  id: string;
  name: string;
  /** Legacy emoji flag — kept for compatibility with retro/roster views. New code uses `iso_code`. */
  flag: string;
  /** flag-icons code (e.g. "es", "gb-eng"). Drives the CSS sprite flag on the map. */
  iso_code: string;
  continent: "europe" | "americas";
  iso_numeric: string;
  /** Optional [lng, lat] override for the flag badge position — required when several countries share a polygon (UK sub-nations). */
  flag_center?: [number, number];
  sort_order: number;
  created_at: string;
}
