const MAPBOX_TOKEN = process.env['EXPO_PUBLIC_MAPBOX_TOKEN'] ?? '';

export type RouteProfile = 'driving' | 'walking';

export interface GeocodingResult {
  id:           string;
  name:         string;
  full_address: string;
  coordinates:  [number, number];
}

export interface DirectionsResult {
  geometry:   GeoJSON.LineString;
  distance_m: number;
  duration_s: number;
  profile:    RouteProfile;
}

export interface BothDirections {
  driving: DirectionsResult | null;
  walking: DirectionsResult | null;
}

export async function reverseGeocodeApi(lng: number, lat: number): Promise<string | null> {
  const params = new URLSearchParams({ access_token: MAPBOX_TOKEN, language: 'en' });
  try {
    const res = await fetch(
      `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&${params.toString()}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (data.features?.[0]?.properties?.full_address as string) ?? null;
  } catch {
    return null;
  }
}

export async function geocodeQueryApi(
  query: string,
  proximity?: [number, number],
): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    q:            query,
    country:      'TH,LA,MM',
    language:     'en,th',
    types:        'poi,place,address,district',
    limit:        '5',
    access_token: MAPBOX_TOKEN,
  });
  if (proximity) params.set('proximity', `${proximity[0]},${proximity[1]}`);

  const res = await fetch(
    `https://api.mapbox.com/search/geocode/v6/forward?${params.toString()}`
  );
  if (!res.ok) return [];
  const data = await res.json();

  return (data.features ?? []).map((f: Record<string, unknown>) => ({
    id:           (f['id'] as string) ?? '',
    name:         ((f['properties'] as Record<string, unknown>)?.['name'] as string) ?? '',
    full_address: ((f['properties'] as Record<string, unknown>)?.['full_address'] as string) ?? '',
    coordinates:  ((f['geometry'] as Record<string, unknown>)?.['coordinates']) as [number, number],
  }));
}

async function fetchDirections(
  from:    [number, number],
  to:      [number, number],
  profile: RouteProfile,
): Promise<DirectionsResult | null> {
  try {
    const url =
      `https://api.mapbox.com/directions/v5/mapbox/${profile}/` +
      `${from[0]},${from[1]};${to[0]},${to[1]}` +
      `?geometries=geojson&overview=full&steps=false` +
      `&access_token=${MAPBOX_TOKEN}`;

    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const route = (data.routes as Record<string, unknown>[])?.[0];
    if (!route) return null;

    return {
      geometry:   route['geometry'] as GeoJSON.LineString,
      distance_m: route['distance'] as number,
      duration_s: route['duration'] as number,
      profile,
    };
  } catch {
    return null;
  }
}

export async function getBothDirectionsApi(
  from: [number, number],
  to:   [number, number],
): Promise<BothDirections> {
  const [driving, walking] = await Promise.all([
    fetchDirections(from, to, 'driving'),
    fetchDirections(from, to, 'walking'),
  ]);
  return { driving, walking };
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.ceil(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rem   = mins % 60;
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}
