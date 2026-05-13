import apiClient from './client';

export interface GooglePlaceSuggestion {
  place_id: string;
  name:     string;
  address:  string;
}

export interface GooglePlaceLocation {
  lat: number;
  lng: number;
}

export async function searchGooglePlaces(
  query: string,
  lat?: number,
  lng?: number,
): Promise<GooglePlaceSuggestion[]> {
  const params: Record<string, string> = { q: query };
  if (lat !== undefined) params['lat'] = String(lat);
  if (lng !== undefined) params['lng'] = String(lng);

  const response = await apiClient.get<{ data: GooglePlaceSuggestion[] }>(
    '/api/v1/google-places',
    { params },
  );
  return response.data.data;
}

export async function getGooglePlaceLocation(
  placeId: string,
): Promise<GooglePlaceLocation | null> {
  const response = await apiClient.get<{ data: GooglePlaceLocation }>(
    `/api/v1/google-places/${encodeURIComponent(placeId)}/location`,
  );
  return response.data.data;
}
