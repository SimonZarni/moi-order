import { useState } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';

import { NinetyDayReportFormState } from '@/features/ninetyDayReport/types';

export interface UseNinetyDayReportFormResult {
  form: NinetyDayReportFormState;
  handleFullNameChange: (value: string) => void;
  handlePhoneChange: (value: string) => void;
  handlePassportBioPageChange: (asset: ImagePickerAsset) => void;
  handleVisaPageChange: (asset: ImagePickerAsset) => void;
  handleOldSlipChange: (asset: ImagePickerAsset) => void;
  validate: () => boolean;
  applyApiError: (errors: Record<string, string[]>) => void;
  clearErrors: () => void;
}

const INITIAL: NinetyDayReportFormState = {
  fullName:        '',
  phone:           '',
  passportBioPage: null,
  visaPage:        null,
  oldSlip:         null,
  errors:          {},
};

export function useNinetyDayReportForm(): UseNinetyDayReportFormResult {
  const [form, setForm] = useState<NinetyDayReportFormState>(INITIAL);

  const setField =
    <K extends keyof NinetyDayReportFormState>(field: K) =>
    (value: NinetyDayReportFormState[K]): void => {
      setForm((prev) => ({ ...prev, [field]: value, errors: { ...prev.errors, [field]: '' } }));
    };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (form.fullName.trim().length === 0)   errors['fullName'] = 'Full name is required.';
    if (form.phone.trim().length === 0)       errors['phone'] = 'Phone number is required.';
    if (form.passportBioPage === null)        errors['passportBioPage'] = 'Passport bio page image is required.';
    if (form.visaPage === null)               errors['visaPage'] = 'Visa page image is required.';
    if (form.oldSlip === null)                errors['oldSlip'] = 'Old 90-day slip image is required.';
    setForm((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const applyApiError = (apiErrors: Record<string, string[]>): void => {
    // Map snake_case API keys to camelCase form keys.
    const keyMap: Record<string, string> = {
      full_name:          'fullName',
      phone:              'phone',
      passport_bio_page:  'passportBioPage',
      visa_page:          'visaPage',
      old_slip:           'oldSlip',
    };
    const flat: Record<string, string> = {};
    for (const [apiKey, messages] of Object.entries(apiErrors)) {
      const formKey = keyMap[apiKey] ?? apiKey;
      flat[formKey] = messages[0] ?? '';
    }
    setForm((prev) => ({ ...prev, errors: flat }));
  };

  const clearErrors = (): void => setForm((prev) => ({ ...prev, errors: {} }));

  return {
    form,
    handleFullNameChange:        setField('fullName'),
    handlePhoneChange:           setField('phone'),
    handlePassportBioPageChange: setField('passportBioPage'),
    handleVisaPageChange:        setField('visaPage'),
    handleOldSlipChange:         setField('oldSlip'),
    validate,
    applyApiError,
    clearErrors,
  };
}
