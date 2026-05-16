import apiClient from './client';

export type AppUpdateConfig = {
  ios_min_version:     string;
  ios_min_build:       number | null;
  android_min_version: string;
  android_min_code:    number | null;
  type:                string;
  title:               string;
  message:             string;
  ios_store_url:       string;
  android_store_url:   string;
  next_version:        string;
  changelog:           string[];
};

export type AppConfigData = {
  update: AppUpdateConfig;
};

export type UpdateAppConfigPayload = {
  ios_min_version:     string | null;
  ios_min_build:       number | null;
  android_min_version: string | null;
  android_min_code:    number | null;
  update_type:         string;
  update_title:        string | null;
  update_message:      string | null;
  ios_store_url:       string | null;
  android_store_url:   string | null;
  next_version:        string | null;
  changelog:           string[] | null;
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
