import apiClient from './client';

export type AppUpdateConfig = {
  ios_min_version: string;
  android_min_version: string;
  type: string;
  title: string;
  message: string;
  ios_store_url: string;
  android_store_url: string;
};

export type AppAlertConfig = {
  is_active: boolean;
  title: string;
  message: string;
  frequency: string;
};

export type AppConfigData = {
  update: AppUpdateConfig;
  alert: AppAlertConfig;
};

// Flat payload expected by the backend PUT endpoint
export type UpdateAppConfigPayload = {
  ios_min_version: string | null;
  android_min_version: string | null;
  update_type: string;
  update_title: string | null;
  update_message: string | null;
  ios_store_url: string | null;
  android_store_url: string | null;
  alert_is_active: boolean;
  alert_title: string | null;
  alert_message: string | null;
  alert_frequency: string;
};

export const appConfigApi = {
  get: () =>
    apiClient
      .get<{ data: AppConfigData }>('/app-config')
      .then((r) => r.data.data),

  update: (payload: UpdateAppConfigPayload) =>
    apiClient
      .put<{ data: AppConfigData }>('/app-config', payload)
      .then((r) => r.data.data),
};
