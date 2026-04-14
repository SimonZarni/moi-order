import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse, ServiceSubmission } from '@/types/models';
import { ImagePickerAsset } from 'expo-image-picker';

export interface CompanyRegistrationPayload {
  idempotencyKey:    string;
  serviceTypeId:     number;
  fullName:          string;
  phone:             string;
  passportBioPage:   ImagePickerAsset;
  visaPage:          ImagePickerAsset;
  identityCardFront: ImagePickerAsset;
  identityCardBack:  ImagePickerAsset;
  tm30:              ImagePickerAsset;
}

export async function submitCompanyRegistration(
  payload: CompanyRegistrationPayload,
): Promise<ServiceSubmission> {
  const form = new FormData();
  form.append('idempotency_key',  payload.idempotencyKey);
  form.append('service_type_id',  String(payload.serviceTypeId));
  form.append('full_name',        payload.fullName);
  form.append('phone',            payload.phone);

  const appendImage = (key: string, asset: ImagePickerAsset): void => {
    form.append(key, {
      uri:  asset.uri,
      type: asset.mimeType ?? 'image/jpeg',
      name: `${key}.jpg`,
    } as unknown as Blob);
  };

  appendImage('passport_bio_page',   payload.passportBioPage);
  appendImage('visa_page',           payload.visaPage);
  appendImage('identity_card_front', payload.identityCardFront);
  appendImage('identity_card_back',  payload.identityCardBack);
  appendImage('tm30',                payload.tm30);

  const response = await apiClient.post<ApiResponse<ServiceSubmission>>(
    '/api/v1/submissions/company-registration',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}

export interface NinetyDayReportPayload {
  idempotencyKey: string;
  serviceTypeId: number;
  fullName: string;
  phone: string;
  passportBioPage: ImagePickerAsset;
  visaPage: ImagePickerAsset;
  oldSlip: ImagePickerAsset;
}

export async function submitNinetyDayReport(
  payload: NinetyDayReportPayload,
): Promise<ServiceSubmission> {
  const form = new FormData();
  form.append('idempotency_key', payload.idempotencyKey);
  form.append('service_type_id', String(payload.serviceTypeId));
  form.append('full_name', payload.fullName);
  form.append('phone', payload.phone);

  form.append('passport_bio_page', {
    uri:  payload.passportBioPage.uri,
    type: payload.passportBioPage.mimeType ?? 'image/jpeg',
    name: 'passport_bio_page.jpg',
  } as unknown as Blob);

  form.append('visa_page', {
    uri:  payload.visaPage.uri,
    type: payload.visaPage.mimeType ?? 'image/jpeg',
    name: 'visa_page.jpg',
  } as unknown as Blob);

  form.append('old_slip', {
    uri:  payload.oldSlip.uri,
    type: payload.oldSlip.mimeType ?? 'image/jpeg',
    name: 'old_slip.jpg',
  } as unknown as Blob);

  const response = await apiClient.post<ApiResponse<ServiceSubmission>>(
    '/api/v1/submissions/90-day-report',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}

export interface AirportFastTrackPayload {
  idempotencyKey: string;
  serviceTypeId:  number;
  fullName:       string;
  phone:          string;
  upperBodyPhoto: ImagePickerAsset;
  airplaneTicket: ImagePickerAsset;
}

export async function submitAirportFastTrack(
  payload: AirportFastTrackPayload,
): Promise<ServiceSubmission> {
  const form = new FormData();
  form.append('idempotency_key',  payload.idempotencyKey);
  form.append('service_type_id',  String(payload.serviceTypeId));
  form.append('full_name',        payload.fullName);
  form.append('phone',            payload.phone);

  const appendImage = (key: string, asset: ImagePickerAsset): void => {
    form.append(key, {
      uri:  asset.uri,
      type: asset.mimeType ?? 'image/jpeg',
      name: `${key}.jpg`,
    } as unknown as Blob);
  };

  appendImage('upper_body_photo', payload.upperBodyPhoto);
  appendImage('airplane_ticket',  payload.airplaneTicket);

  const response = await apiClient.post<ApiResponse<ServiceSubmission>>(
    '/api/v1/submissions/airport-fast-track',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}

export interface EmbassyResidentialPayload {
  idempotencyKey:    string;
  serviceTypeId:     number;
  fullName:          string;
  phone:             string;
  passportBioPage:   ImagePickerAsset;
  visaPage:          ImagePickerAsset;
  identityCardFront: ImagePickerAsset;
  identityCardBack:  ImagePickerAsset;
  tm30:              ImagePickerAsset;
}

export async function submitEmbassyResidential(
  payload: EmbassyResidentialPayload,
): Promise<ServiceSubmission> {
  const form = new FormData();
  form.append('idempotency_key',  payload.idempotencyKey);
  form.append('service_type_id',  String(payload.serviceTypeId));
  form.append('full_name',        payload.fullName);
  form.append('phone',            payload.phone);

  const appendImage = (key: string, asset: ImagePickerAsset): void => {
    form.append(key, {
      uri:  asset.uri,
      type: asset.mimeType ?? 'image/jpeg',
      name: `${key}.jpg`,
    } as unknown as Blob);
  };

  appendImage('passport_bio_page',   payload.passportBioPage);
  appendImage('visa_page',           payload.visaPage);
  appendImage('identity_card_front', payload.identityCardFront);
  appendImage('identity_card_back',  payload.identityCardBack);
  appendImage('tm30',                payload.tm30);

  const response = await apiClient.post<ApiResponse<ServiceSubmission>>(
    '/api/v1/submissions/embassy-residential',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}

export interface EmbassyCarLicensePayload {
  idempotencyKey:    string;
  serviceTypeId:     number;
  fullName:          string;
  phone:             string;
  passportBioPage:   ImagePickerAsset;
  visaPage:          ImagePickerAsset;
  identityCardFront: ImagePickerAsset;
  identityCardBack:  ImagePickerAsset;
  tm30:              ImagePickerAsset;
}

export async function submitEmbassyCarLicense(
  payload: EmbassyCarLicensePayload,
): Promise<ServiceSubmission> {
  const form = new FormData();
  form.append('idempotency_key',  payload.idempotencyKey);
  form.append('service_type_id',  String(payload.serviceTypeId));
  form.append('full_name',        payload.fullName);
  form.append('phone',            payload.phone);

  const appendImage = (key: string, asset: ImagePickerAsset): void => {
    form.append(key, {
      uri:  asset.uri,
      type: asset.mimeType ?? 'image/jpeg',
      name: `${key}.jpg`,
    } as unknown as Blob);
  };

  appendImage('passport_bio_page',   payload.passportBioPage);
  appendImage('visa_page',           payload.visaPage);
  appendImage('identity_card_front', payload.identityCardFront);
  appendImage('identity_card_back',  payload.identityCardBack);
  appendImage('tm30',                payload.tm30);

  const response = await apiClient.post<ApiResponse<ServiceSubmission>>(
    '/api/v1/submissions/embassy-car-license',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}

export interface EmbassyBankPayload {
  idempotencyKey:    string;
  serviceTypeId:     number;
  fullName:          string;
  passportNo:        string;
  identityCardNo:    string;
  currentJob:        string | null;
  company:           string | null;
  myanmarAddress:    string;
  thaiAddress:       string;
  phone:             string;
  bankName:          string;
  passportSizePhoto: ImagePickerAsset;
  passportBioPage:   ImagePickerAsset;
  visaPage:          ImagePickerAsset;
  identityCardFront: ImagePickerAsset;
  identityCardBack:  ImagePickerAsset;
  tm30:              ImagePickerAsset;
}

export async function submitEmbassyBank(
  payload: EmbassyBankPayload,
): Promise<ServiceSubmission> {
  const form = new FormData();
  form.append('idempotency_key',  payload.idempotencyKey);
  form.append('service_type_id',  String(payload.serviceTypeId));
  form.append('full_name',        payload.fullName);
  form.append('passport_no',      payload.passportNo);
  form.append('identity_card_no', payload.identityCardNo);
  if (payload.currentJob !== null) form.append('current_job', payload.currentJob);
  if (payload.company    !== null) form.append('company',     payload.company);
  form.append('myanmar_address',  payload.myanmarAddress);
  form.append('thai_address',     payload.thaiAddress);
  form.append('phone',            payload.phone);
  form.append('bank_name',        payload.bankName);

  const appendImage = (key: string, asset: ImagePickerAsset): void => {
    form.append(key, {
      uri:  asset.uri,
      type: asset.mimeType ?? 'image/jpeg',
      name: `${key}.jpg`,
    } as unknown as Blob);
  };

  appendImage('passport_size_photo',  payload.passportSizePhoto);
  appendImage('passport_bio_page',    payload.passportBioPage);
  appendImage('visa_page',            payload.visaPage);
  appendImage('identity_card_front',  payload.identityCardFront);
  appendImage('identity_card_back',   payload.identityCardBack);
  appendImage('tm30',                 payload.tm30);

  const response = await apiClient.post<ApiResponse<ServiceSubmission>>(
    '/api/v1/submissions/embassy-bank',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}

export interface EmbassyVisaRecommendationPayload {
  idempotencyKey:    string;
  serviceTypeId:     number;
  fullName:          string;
  phone:             string;
  passportBioPage:   ImagePickerAsset;
  visaPage:          ImagePickerAsset;
  identityCardFront: ImagePickerAsset;
  identityCardBack:  ImagePickerAsset;
}

export async function submitEmbassyVisaRecommendation(
  payload: EmbassyVisaRecommendationPayload,
): Promise<ServiceSubmission> {
  const form = new FormData();
  form.append('idempotency_key',  payload.idempotencyKey);
  form.append('service_type_id',  String(payload.serviceTypeId));
  form.append('full_name',        payload.fullName);
  form.append('phone',            payload.phone);

  const appendImage = (key: string, asset: ImagePickerAsset): void => {
    form.append(key, {
      uri:  asset.uri,
      type: asset.mimeType ?? 'image/jpeg',
      name: `${key}.jpg`,
    } as unknown as Blob);
  };

  appendImage('passport_bio_page',   payload.passportBioPage);
  appendImage('visa_page',           payload.visaPage);
  appendImage('identity_card_front', payload.identityCardFront);
  appendImage('identity_card_back',  payload.identityCardBack);

  const response = await apiClient.post<ApiResponse<ServiceSubmission>>(
    '/api/v1/submissions/embassy-visa-recommendation',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}

export interface TestServicePayload {
  idempotencyKey: string;
  serviceTypeId:  number;
  fullName:       string;
  phone:          string;
  photo:          ImagePickerAsset;
}

export async function submitTestService(
  payload: TestServicePayload,
): Promise<ServiceSubmission> {
  const form = new FormData();
  form.append('idempotency_key', payload.idempotencyKey);
  form.append('service_type_id', String(payload.serviceTypeId));
  form.append('full_name',       payload.fullName);
  form.append('phone',           payload.phone);
  form.append('photo', {
    uri:  payload.photo.uri,
    type: payload.photo.mimeType ?? 'image/jpeg',
    name: 'photo.jpg',
  } as unknown as Blob);

  const response = await apiClient.post<ApiResponse<ServiceSubmission>>(
    '/api/v1/submissions/test-service',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}

export async function fetchSubmissions(page: number): Promise<PaginatedResponse<ServiceSubmission>> {
  const response = await apiClient.get<PaginatedResponse<ServiceSubmission>>('/api/v1/submissions', {
    params: { page },
  });
  return response.data;
}

export async function fetchSubmission(id: number): Promise<ServiceSubmission> {
  const response = await apiClient.get<ApiResponse<ServiceSubmission>>(`/api/v1/submissions/${id}`);
  return response.data.data;
}
