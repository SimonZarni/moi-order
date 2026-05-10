import apiClient from './client';

export type PaymentSettings = {
  auto_payment_enabled: boolean;
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

  getMaintenanceStatus: () =>
    apiClient.get<MaintenanceStatus>('/maintenance').then((r) => r.data),

  enableMaintenance: () =>
    apiClient.post<MaintenanceStatus>('/maintenance/enable').then((r) => r.data),

  disableMaintenance: () =>
    apiClient.post<MaintenanceStatus>('/maintenance/disable').then((r) => r.data),
};
