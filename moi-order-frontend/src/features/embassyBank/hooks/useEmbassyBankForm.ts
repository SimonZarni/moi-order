import { useCallback, useState } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';

interface EmbassyBankFormState {
  fullName:          string;
  passportNo:        string;
  identityCardNo:    string;
  currentJob:        string;
  company:           string;
  myanmarAddress:    string;
  thaiAddress:       string;
  phone:             string;
  bankName:          string;
  passportSizePhoto: ImagePickerAsset | null;
  passportBioPage:   ImagePickerAsset | null;
  visaPage:          ImagePickerAsset | null;
  identityCardFront: ImagePickerAsset | null;
  identityCardBack:  ImagePickerAsset | null;
  tm30:              ImagePickerAsset | null;
  errors: Record<string, string>;
}

export interface UseEmbassyBankFormResult {
  form: EmbassyBankFormState;
  handleFullNameChange:          (v: string) => void;
  handlePassportNoChange:        (v: string) => void;
  handleIdentityCardNoChange:    (v: string) => void;
  handleCurrentJobChange:        (v: string) => void;
  handleCompanyChange:           (v: string) => void;
  handleMyanmarAddressChange:    (v: string) => void;
  handleThaiAddressChange:       (v: string) => void;
  handlePhoneChange:             (v: string) => void;
  handleBankNameChange:          (v: string) => void;
  handlePassportSizePhotoChange: (a: ImagePickerAsset) => void;
  handlePassportBioPageChange:   (a: ImagePickerAsset) => void;
  handleVisaPageChange:          (a: ImagePickerAsset) => void;
  handleIdentityCardFrontChange: (a: ImagePickerAsset) => void;
  handleIdentityCardBackChange:  (a: ImagePickerAsset) => void;
  handleTm30Change:              (a: ImagePickerAsset) => void;
  validate: () => boolean;
  applyApiError: (errors: Record<string, string[]>) => void;
}

const INITIAL_STATE: EmbassyBankFormState = {
  fullName:          '',
  passportNo:        '',
  identityCardNo:    '',
  currentJob:        '',
  company:           '',
  myanmarAddress:    '',
  thaiAddress:       '',
  phone:             '',
  bankName:          '',
  passportSizePhoto: null,
  passportBioPage:   null,
  visaPage:          null,
  identityCardFront: null,
  identityCardBack:  null,
  tm30:              null,
  errors:            {},
};

const API_KEY_MAP: Record<string, keyof EmbassyBankFormState> = {
  full_name:           'fullName',
  passport_no:         'passportNo',
  identity_card_no:    'identityCardNo',
  current_job:         'currentJob',
  company:             'company',
  myanmar_address:     'myanmarAddress',
  thai_address:        'thaiAddress',
  phone:               'phone',
  bank_name:           'bankName',
  passport_size_photo: 'passportSizePhoto',
  passport_bio_page:   'passportBioPage',
  visa_page:           'visaPage',
  identity_card_front: 'identityCardFront',
  identity_card_back:  'identityCardBack',
  tm30:                'tm30',
};

export function useEmbassyBankForm(): UseEmbassyBankFormResult {
  const [form, setForm] = useState<EmbassyBankFormState>(INITIAL_STATE);

  // Factory to avoid repetition — each text handler clears its own error on change
  const makeTextHandler = useCallback(
    (field: keyof EmbassyBankFormState) => (value: string) => {
      setForm(prev => ({
        ...prev,
        [field]: value,
        errors: { ...prev.errors, [field]: '' },
      }));
    },
    [],
  );

  // Factory for asset pickers
  const makeAssetHandler = useCallback(
    (field: keyof EmbassyBankFormState) => (asset: ImagePickerAsset) => {
      setForm(prev => ({
        ...prev,
        [field]: asset,
        errors: { ...prev.errors, [field]: '' },
      }));
    },
    [],
  );

  const handleFullNameChange          = useCallback(makeTextHandler('fullName'),          [makeTextHandler]);
  const handlePassportNoChange        = useCallback(makeTextHandler('passportNo'),        [makeTextHandler]);
  const handleIdentityCardNoChange    = useCallback(makeTextHandler('identityCardNo'),    [makeTextHandler]);
  const handleCurrentJobChange        = useCallback(makeTextHandler('currentJob'),        [makeTextHandler]);
  const handleCompanyChange           = useCallback(makeTextHandler('company'),           [makeTextHandler]);
  const handleMyanmarAddressChange    = useCallback(makeTextHandler('myanmarAddress'),    [makeTextHandler]);
  const handleThaiAddressChange       = useCallback(makeTextHandler('thaiAddress'),       [makeTextHandler]);
  const handlePhoneChange             = useCallback(makeTextHandler('phone'),             [makeTextHandler]);
  const handleBankNameChange          = useCallback(makeTextHandler('bankName'),          [makeTextHandler]);
  const handlePassportSizePhotoChange = useCallback(makeAssetHandler('passportSizePhoto'),[makeAssetHandler]);
  const handlePassportBioPageChange   = useCallback(makeAssetHandler('passportBioPage'),  [makeAssetHandler]);
  const handleVisaPageChange          = useCallback(makeAssetHandler('visaPage'),         [makeAssetHandler]);
  const handleIdentityCardFrontChange = useCallback(makeAssetHandler('identityCardFront'),[makeAssetHandler]);
  const handleIdentityCardBackChange  = useCallback(makeAssetHandler('identityCardBack'), [makeAssetHandler]);
  const handleTm30Change              = useCallback(makeAssetHandler('tm30'),             [makeAssetHandler]);

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!form.fullName.trim())       errors['fullName']       = 'Full name is required.';
    if (!form.passportNo.trim())     errors['passportNo']     = 'Passport number is required.';
    if (!form.identityCardNo.trim()) errors['identityCardNo'] = 'Identity card number is required.';
    if (!form.myanmarAddress.trim()) errors['myanmarAddress'] = 'Myanmar address is required.';
    if (!form.thaiAddress.trim())    errors['thaiAddress']    = 'Thai address is required.';
    if (!form.phone.trim())          errors['phone']          = 'Phone number is required.';
    if (!form.bankName.trim())       errors['bankName']       = 'Bank name is required.';
    if (!form.passportSizePhoto)     errors['passportSizePhoto'] = 'Passport size photo is required.';
    if (!form.passportBioPage)       errors['passportBioPage']   = 'Passport bio page is required.';
    if (!form.visaPage)              errors['visaPage']           = 'Visa page is required.';
    if (!form.identityCardFront)     errors['identityCardFront']  = 'Identity card front is required.';
    if (!form.identityCardBack)      errors['identityCardBack']   = 'Identity card back is required.';
    if (!form.tm30)                  errors['tm30']               = 'TM30 is required.';

    setForm(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [form]);

  const applyApiError = useCallback(
    (apiErrors: Record<string, string[]>): void => {
      const mapped: Record<string, string> = {};
      for (const [apiKey, messages] of Object.entries(apiErrors)) {
        const formKey = API_KEY_MAP[apiKey];
        if (formKey !== undefined) {
          mapped[formKey as string] = messages[0] ?? '';
        }
      }
      setForm(prev => ({ ...prev, errors: { ...prev.errors, ...mapped } }));
    },
    [],
  );

  return {
    form,
    handleFullNameChange,
    handlePassportNoChange,
    handleIdentityCardNoChange,
    handleCurrentJobChange,
    handleCompanyChange,
    handleMyanmarAddressChange,
    handleThaiAddressChange,
    handlePhoneChange,
    handleBankNameChange,
    handlePassportSizePhotoChange,
    handlePassportBioPageChange,
    handleVisaPageChange,
    handleIdentityCardFrontChange,
    handleIdentityCardBackChange,
    handleTm30Change,
    validate,
    applyApiError,
  };
}
