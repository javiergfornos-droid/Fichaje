/**
 * Convert longitude/latitude to SVG coordinates for the Europe map.
 * Europe SVG viewBox: "0 0 700 500"
 */
export function geoToSvgEurope(lon: number, lat: number): [number, number] {
  return [(lon + 12) * 10.5 + 30, 500 - (lat - 34) * 11.8];
}

/**
 * Convert longitude/latitude to SVG coordinates for the Americas map.
 * Americas SVG viewBox: "0 0 600 730"
 */
export function geoToSvgAmericas(lon: number, lat: number): [number, number] {
  return [(lon + 128) * 5.4 + 20, 730 - (lat + 58) * 6.0];
}

/**
 * Convert an array of [lon, lat] geo points to an SVG polygon points string.
 */
export function geoPointsToSvgPath(
  points: [number, number][],
  projection: (lon: number, lat: number) => [number, number]
): string {
  return points
    .map(([lon, lat]) => {
      const [x, y] = projection(lon, lat);
      return `${x},${y}`;
    })
    .join(" ");
}
