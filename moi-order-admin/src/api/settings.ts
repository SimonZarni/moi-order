import apiClient from './client';

export type PaymentMode = 'stripe' | 'global_qr' | 'manual_qr';

export type PaymentSettings = {
  auto_payment_enabled: boolean;
  payment_mode: PaymentMode;
  global_qr_image_url: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
};

export type MaintenanceStatus = {
  active: boolean;
};

export const settingsApi = {
  getPaymentSettings: () =>
    apiClient
      .get<{ data: PaymentSettings }>('/payment-settings')
      .then((r) => r.data.data),

  toggleAutoPayment: () =>
    apiClient
      .put<{ data: PaymentSettings }>('/payment-settings')
      .then((r) => r.data.data),

  updatePaymentMode: (params: {
    mode: PaymentMode;
    bank_name?: string | null;
    bank_account_number?: string | null;
    bank_account_name?: string | null;
  }) =>
    apiClient
      .patch<{ data: { payment_mode: PaymentMode } }>('/payment-settings/mode', params)
      .then((r) => r.data.data),

  uploadGlobalQr: (image: File) => {
    const fd = new FormData();
    fd.append('image', image);
    return apiClient
      .post<{ data: { global_qr_image_url: string } }>('/payment-settings/qr', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data);
  },

  removeGlobalQr: () =>
    apiClient
      .delete<{ data: { global_qr_image_url: null } }>('/payment-settings/qr')
      .then((r) => r.data.data),

  getMaintenanceStatus: () =>
    apiClient.get<MaintenanceStatus>('/maintenance').then((r) => r.data),

  enableMaintenance: () =>
    apiClient.post<MaintenanceStatus>('/maintenance/enable').then((r) => r.data),

  disableMaintenance: () =>
    apiClient.post<MaintenanceStatus>('/maintenance/disable').then((r) => r.data),

  ping: () =>
    apiClient.get<{ pong: boolean; time: string }>('/ping').then((r) => r.data),
};
