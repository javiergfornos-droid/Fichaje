/** Country data from the countries table */
export interface Country {
  id: string;
  name: string;
  flag: string;
  continent: "europe" | "americas";
  geo_points: [number, number][];
  flag_center: [number, number];
  sort_order: number;
  created_at: string;
}
