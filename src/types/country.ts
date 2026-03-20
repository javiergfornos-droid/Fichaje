/** Country data from the countries table */
export interface Country {
  id: string;
  name: string;
  flag: string;
  continent: "europe" | "americas";
  iso_numeric: string;
  sort_order: number;
  created_at: string;
}
