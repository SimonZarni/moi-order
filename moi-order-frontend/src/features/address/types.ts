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
}
