import { useCallback, useState } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';

export interface EmbassyVisaRecommendationFormState {
  fullName:          string;
  phone:             string;
  passportBioPage:   ImagePickerAsset | null;
  visaPage:          ImagePickerAsset | null;
  identityCardFront: ImagePickerAsset | null;
  identityCardBack:  ImagePickerAsset | null;
  errors:            Record<string, string>;
}

export interface UseEmbassyVisaRecommendationFormResult {
  form: EmbassyVisaRecommendationFormState;
  handleFullNameChange:          (value: string) => void;
  handlePhoneChange:             (value: string) => void;
  handlePassportBioPageChange:   (asset: ImagePickerAsset) => void;
  handleVisaPageChange:          (asset: ImagePickerAsset) => void;
  handleIdentityCardFrontChange: (asset: ImagePickerAsset) => void;
  handleIdentityCardBackChange:  (asset: ImagePickerAsset) => void;
  validate:      () => boolean;
  applyApiError: (errors: Record<string, string[]>) => void;
}

const FIELD_MAP: Record<string, keyof EmbassyVisaRecommendationFormState> = {
  full_name:           'fullName',
  phone:               'phone',
  passport_bio_page:   'passportBioPage',
  visa_page:           'visaPage',
  identity_card_front: 'identityCardFront',
  identity_card_back:  'identityCardBack',
};

export function useEmbassyVisaRecommendationForm(): UseEmbassyVisaRecommendationFormResult {
  const [form, setForm] = useState<EmbassyVisaRecommendationFormState>({
    fullName:          '',
    phone:             '',
    passportBioPage:   null,
    visaPage:          null,
    identityCardFront: null,
    identityCardBack:  null,
    errors:            {},
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

  const handlePassportBioPageChange = useCallback((asset: ImagePickerAsset): void => {
    clearError('passportBioPage');
    setForm((prev) => ({ ...prev, passportBioPage: asset }));
  }, [clearError]);

  const handleVisaPageChange = useCallback((asset: ImagePickerAsset): void => {
    clearError('visaPage');
    setForm((prev) => ({ ...prev, visaPage: asset }));
  }, [clearError]);

  const handleIdentityCardFrontChange = useCallback((asset: ImagePickerAsset): void => {
    clearError('identityCardFront');
    setForm((prev) => ({ ...prev, identityCardFront: asset }));
  }, [clearError]);

  const handleIdentityCardBackChange = useCallback((asset: ImagePickerAsset): void => {
    clearError('identityCardBack');
    setForm((prev) => ({ ...prev, identityCardBack: asset }));
  }, [clearError]);

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (form.fullName.trim().length === 0)  errors['fullName']          = 'Full name is required.';
    if (form.phone.trim().length === 0)     errors['phone']             = 'Phone number is required.';
    if (form.passportBioPage === null)       errors['passportBioPage']   = 'Passport bio page is required.';
    if (form.visaPage === null)              errors['visaPage']          = 'Visa page is required.';
    if (form.identityCardFront === null)     errors['identityCardFront'] = 'Identity card front is required.';
    if (form.identityCardBack === null)      errors['identityCardBack']  = 'Identity card back is required.';

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
    handlePassportBioPageChange,
    handleVisaPageChange,
    handleIdentityCardFrontChange,
    handleIdentityCardBackChange,
    validate,
    applyApiError,
  };
}
