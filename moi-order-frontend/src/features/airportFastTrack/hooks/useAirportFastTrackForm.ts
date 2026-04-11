import { useCallback, useState } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';

export interface AirportFastTrackFormState {
  fullName:       string;
  phone:          string;
  upperBodyPhoto: ImagePickerAsset | null;
  airplaneTicket: ImagePickerAsset | null;
  errors:         Record<string, string>;
}

export interface UseAirportFastTrackFormResult {
  form: AirportFastTrackFormState;
  handleFullNameChange:       (value: string) => void;
  handlePhoneChange:          (value: string) => void;
  handleUpperBodyPhotoChange: (asset: ImagePickerAsset) => void;
  handleAirplaneTicketChange: (asset: ImagePickerAsset) => void;
  validate:      () => boolean;
  applyApiError: (errors: Record<string, string[]>) => void;
}

const FIELD_MAP: Record<string, keyof AirportFastTrackFormState> = {
  full_name:        'fullName',
  phone:            'phone',
  upper_body_photo: 'upperBodyPhoto',
  airplane_ticket:  'airplaneTicket',
};

export function useAirportFastTrackForm(): UseAirportFastTrackFormResult {
  const [form, setForm] = useState<AirportFastTrackFormState>({
    fullName:       '',
    phone:          '',
    upperBodyPhoto: null,
    airplaneTicket: null,
    errors:         {},
  });

  const clearError = useCallback((field: string): void => {
    setForm((prev) => {
      if (!prev.errors[field]) return prev;
      const { [field]: _, ...rest } = prev.errors;
      return { ...prev, errors: rest };
    });
  }, []);

  const handleFullNameChange = useCallback((value: string): void => {
    clearError('fullName');
    setForm((prev) => ({ ...prev, fullName: value }));
  }, [clearError]);

  const handlePhoneChange = useCallback((value: string): void => {
    clearError('phone');
    setForm((prev) => ({ ...prev, phone: value }));
  }, [clearError]);

  const handleUpperBodyPhotoChange = useCallback((asset: ImagePickerAsset): void => {
    clearError('upperBodyPhoto');
    setForm((prev) => ({ ...prev, upperBodyPhoto: asset }));
  }, [clearError]);

  const handleAirplaneTicketChange = useCallback((asset: ImagePickerAsset): void => {
    clearError('airplaneTicket');
    setForm((prev) => ({ ...prev, airplaneTicket: asset }));
  }, [clearError]);

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (form.fullName.trim().length === 0)  errors['fullName']       = 'Full name is required.';
    if (form.phone.trim().length === 0)     errors['phone']          = 'Phone number is required.';
    if (form.upperBodyPhoto === null)        errors['upperBodyPhoto'] = 'Upper body photo is required.';
    if (form.airplaneTicket === null)        errors['airplaneTicket'] = 'Airplane ticket is required.';

    setForm((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [form]);

  const applyApiError = useCallback((apiErrors: Record<string, string[]>): void => {
    const errors: Record<string, string> = {};
    Object.entries(apiErrors).forEach(([snakeKey, messages]) => {
      const formKey = FIELD_MAP[snakeKey] ?? snakeKey;
      errors[formKey] = messages[0] ?? '';
    });
    setForm((prev) => ({ ...prev, errors }));
  }, []);

  return {
    form,
    handleFullNameChange,
    handlePhoneChange,
    handleUpperBodyPhotoChange,
    handleAirplaneTicketChange,
    validate,
    applyApiError,
  };
}
