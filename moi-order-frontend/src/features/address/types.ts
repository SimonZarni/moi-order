import type { GeocodingResult } from '@/shared/api/mapbox';
import type { GooglePlaceSuggestion } from '@/shared/api/googlePlaces';

export interface AddressFormValues {
  label: 'home' | 'work' | 'other';
  address: string;
  building: string;
  floor: string;
  landmark: string;
  province: string;
  contactName: string;
  contactPhone: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
}

export interface AddressFormErrors {
  address?: string;
  contactName?: string;
  contactPhone?: string;
  province?: string;
}

// ── MapPicker search suggestions ───────────────────────────────────────────────

export type MapPickerSuggestionItem =
  | { key: string; source: 'mapbox'; data: GeocodingResult }
  | { key: string; source: 'google'; data: GooglePlaceSuggestion };
