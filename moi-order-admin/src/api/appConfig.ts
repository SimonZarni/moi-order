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

export type AppConfigData = {
  update: AppUpdateConfig;
};

export type UpdateAppConfigPayload = {
  ios_min_version: string | null;
  android_min_version: string | null;
  update_type: string;
  update_title: string | null;
  update_message: string | null;
  ios_store_url: string | null;
  android_store_url: string | null;
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
