import apiClient from './client';

export type PaymentSettings = {
  auto_payment_enabled: boolean;
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
};
