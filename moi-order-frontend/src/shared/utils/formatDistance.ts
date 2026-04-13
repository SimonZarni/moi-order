/**
 * Computes straight-line distance between two coordinates using the Haversine
 * formula and returns a human-readable string ("850 m" or "1.2 km").
 *
 * Principle: Information Expert — the formatting lives here, not in components.
 * Principle: Pure function — no side-effects, fully unit-testable.
 */
export function formatDistance(
  userLat: number,
  userLng: number,
  placeLat: number,
  placeLng: number,
): string {
  const R = 6_371_000; // Earth radius in metres
  const φ1 = (userLat  * Math.PI) / 180;
  const φ2 = (placeLat * Math.PI) / 180;
  const Δφ = ((placeLat - userLat) * Math.PI) / 180;
  const Δλ = ((placeLng - userLng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const metres = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  if (metres < 1_000) {
    return `${Math.round(metres)} m`;
  }

  return `${(metres / 1_000).toFixed(1)} km`;
}