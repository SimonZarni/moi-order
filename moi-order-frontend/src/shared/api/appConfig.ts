/**
 * API functions for app-wide configuration (update gating + in-app alerts).
 * DIP: components and hooks never import axios — all HTTP goes through this typed module.
 */
import apiClient from './client';
import type { AppUpdateType, AppAlertFrequency } from '@/types/enums';

export interface AppConfigUpdate {
  ios_min_version: string | null;
  android_min_version: string | null;
  type: AppUpdateType;
  title: string | null;
  message: string | null;
  ios_store_url: string | null;
  android_store_url: string | null;
}

export interface AppConfigAlert {
  is_active: boolean;
  title: string | null;
  message: string | null;
  frequency: AppAlertFrequency;
}

export interface AppConfig {
  update: AppConfigUpdate;
  alert: AppConfigAlert;
}

export async function fetchAppConfig(): Promise<AppConfig> {
  const res = await apiClient.get<{ data: AppConfig }>('/api/v1/app-config');
  return res.data.data;
}
