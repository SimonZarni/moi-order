import { ImagePickerAsset } from 'expo-image-picker';

export interface NinetyDayReportFormState {
  fullName: string;
  phone: string;
  passportBioPage: ImagePickerAsset | null;
  visaPage: ImagePickerAsset | null;
  oldSlip: ImagePickerAsset | null;
  errors: Record<string, string>;
}
