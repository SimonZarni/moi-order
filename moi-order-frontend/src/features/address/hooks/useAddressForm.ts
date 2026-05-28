import { useState } from 'react';
import { AddressFormErrors, AddressFormValues } from '../types';

const DEFAULT_VALUES: AddressFormValues = {
  label:     'home',
  address:   '',
  building:  '',
  floor:     '',
  landmark:  '',
  latitude:  null,
  longitude: null,
  isDefault: false,
};

export interface UseAddressFormResult {
  values: AddressFormValues;
  errors: AddressFormErrors;
  setField: <K extends keyof AddressFormValues>(key: K, value: AddressFormValues[K]) => void;
  setCoordinates: (lat: number, lng: number, resolvedAddress?: string) => void;
  clearCoordinates: () => void;
  validate: () => boolean;
  applyApiError: (errors: Record<string, string[]>) => void;
  reset: (initial?: Partial<AddressFormValues>) => void;
}

export function useAddressForm(initial?: Partial<AddressFormValues>): UseAddressFormResult {
  const [values, setValues] = useState<AddressFormValues>({ ...DEFAULT_VALUES, ...initial });
  const [errors, setErrors] = useState<AddressFormErrors>({});

  const setField = <K extends keyof AddressFormValues>(key: K, value: AddressFormValues[K]): void => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => { const next = { ...prev }; delete next[key as keyof AddressFormErrors]; return next; });
    }
  };

  const setCoordinates = (lat: number, lng: number, resolvedAddress?: string): void => {
    setValues((prev) => ({
      ...prev,
      latitude:  lat,
      longitude: lng,
      ...(resolvedAddress ? { address: resolvedAddress } : {}),
    }));
    setErrors((prev) => { const next = { ...prev }; delete next.address; return next; });
  };

  const clearCoordinates = (): void => {
    setValues((prev) => ({ ...prev, latitude: null, longitude: null }));
  };

  const validate = (): boolean => {
    const next: AddressFormErrors = {};
    if (!values.address.trim()) next.address = 'Street address is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const applyApiError = (apiErrors: Record<string, string[]>): void => {
    const next: AddressFormErrors = {};
    if (apiErrors['address']?.[0]) next.address = apiErrors['address'][0];
    setErrors(next);
  };

  const reset = (overrides?: Partial<AddressFormValues>): void => {
    setValues({ ...DEFAULT_VALUES, ...overrides });
    setErrors({});
  };

  return { values, errors, setField, setCoordinates, clearCoordinates, validate, applyApiError, reset };
}
