/**
 * Principle: SRP — owns app-update gating and in-app alert queuing on every launch.
 *
 * Architecture:
 *  - Skips entirely in __DEV__ to avoid noise while coding.
 *  - Returns { forceUpdate, pendingAlert, dismissAlert } — callers render the UI.
 *  - Alerts are queued in declaration order; dismissAlert() advances the queue.
 *  - "once_per_day" alerts use a per-alert-ID SecureStore key so that each alert
 *    has its own seen-today state (independent of other alerts in the same slot).
 *  - "every_open" alerts always appear.
 *  - Optional update alert (Alert.alert) resolves before the app-alert queue starts.
 */
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';

import type { AppConfigAlertItem } from '@/shared/api/appConfig';
import { fetchAppConfig } from '@/shared/api/appConfig';
import { APP_UPDATE_TYPE, APP_ALERT_FREQUENCY } from '@/types/enums';

const KEY_UPDATE_ALERT_DATE = 'moi_update_alert_date';
const alertSeenKey = (id: number): string => `moi_app_alert_seen_${id}`;

export interface ForceUpdateState {
  title: string;
  message: string;
  storeUrl: string;
}

export interface UseAppConfigResult {
  forceUpdate: ForceUpdateState | null;
  pendingAlert: AppConfigAlertItem | null;
  dismissAlert: () => void;
}

function todayString(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Semver-aware comparison — avoids string comparison bug where "2.10.0" < "2.9.0".
function compareVersions(a: string, b: string): number {
  const parse = (v: string): [number, number, number] => {
    const parts = v.split('.').map(Number);
    return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
  };
  const [aMaj, aMin, aPat] = parse(a);
  const [bMaj, bMin, bPat] = parse(b);
  if (aMaj !== bMaj) return aMaj - bMaj;
  if (aMin !== bMin) return aMin - bMin;
  return aPat - bPat;
}

// Returns true when the device needs to update.
// Checks version string first; if equal, falls back to build number gating.
function needsNativeUpdate(
  currentVersion: string,
  currentBuild:   number,
  minVersion:     string | null,
  minBuild:       number | null,
): boolean {
  if (!minVersion) return false;
  const vCmp = compareVersions(currentVersion, minVersion);
  if (vCmp < 0) return true;          // version is older — must update
  if (vCmp > 0) return false;         // version is newer — fine
  // Same version string: gate on build number if admin set one
  if (minBuild !== null && currentBuild < minBuild) return true;
  return false;
}

export function useAppConfig(): UseAppConfigResult {
  const [forceUpdate, setForceUpdate] = useState<ForceUpdateState | null>(null);
  const [alertQueue, setAlertQueue] = useState<AppConfigAlertItem[]>([]);
  const [alertIndex, setAlertIndex] = useState(0);

  const pendingAlert = alertQueue[alertIndex] ?? null;
  const dismissAlert = useCallback(() => setAlertIndex((i) => i + 1), []);

  const run = useCallback(async (): Promise<void> => {
    const currentVersion = Application.nativeApplicationVersion;
    if (currentVersion === null) return;

    // nativeBuildVersion: iOS Build Number (string) or Android versionCode (string).
    // Both are integers in practice so parsing is safe.
    const currentBuild = parseInt(Application.nativeBuildVersion ?? '0', 10);

    let config;
    try {
      config = await fetchAppConfig();
    } catch {
      return;
    }

    const today = todayString();
    const { update, alerts } = config;

    // ── 1. Version + build gating ──────────────────────────────────────────
    const minVersion = Platform.OS === 'ios' ? update.ios_min_version     : update.android_min_version;
    const minBuild   = Platform.OS === 'ios' ? update.ios_min_build       : update.android_min_code;
    const storeUrl   = Platform.OS === 'ios' ? update.ios_store_url       : update.android_store_url;

    const needsUpdate =
      storeUrl   !== null &&
      update.type !== APP_UPDATE_TYPE.None &&
      needsNativeUpdate(currentVersion, currentBuild, minVersion, minBuild);

    if (needsUpdate && update.type === APP_UPDATE_TYPE.Required) {
      setForceUpdate({
        title:    update.title   ?? 'Update Required',
        message:  update.message ?? 'Please update the app to continue.',
        storeUrl,
      });
      return;
    }

    // ── 2. Optional update (Alert.alert, awaited) ─────────────────────────
    if (needsUpdate && update.type === APP_UPDATE_TYPE.Optional) {
      const lastShown = await SecureStore.getItemAsync(KEY_UPDATE_ALERT_DATE).catch(() => null);
      if (lastShown !== today) {
        await SecureStore.setItemAsync(KEY_UPDATE_ALERT_DATE, today).catch(() => {});
        await new Promise<void>((resolve) => {
          Alert.alert(
            update.title   ?? 'Update Available',
            update.message ?? 'A new version of the app is available.',
            [
              { text: 'Later', style: 'cancel', onPress: () => resolve() },
              {
                text: 'Update',
                onPress: () => {
                  Linking.openURL(storeUrl!).catch(() => {});
                  resolve();
                },
              },
            ],
            { cancelable: false },
          );
        });
      }
    }

    // ── 3. App alerts queue ────────────────────────────────────────────────
    const toShow: AppConfigAlertItem[] = [];
    for (const alert of alerts) {
      if (alert.frequency === APP_ALERT_FREQUENCY.EveryOpen) {
        toShow.push(alert);
      } else {
        // once_per_day — per-alert-ID seen key so alerts are independent
        const key = alertSeenKey(alert.id);
        const lastShown = await SecureStore.getItemAsync(key).catch(() => null);
        if (lastShown !== today) {
          await SecureStore.setItemAsync(key, today).catch(() => {});
          toShow.push(alert);
        }
      }
    }

    if (toShow.length > 0) {
      setAlertQueue(toShow);
    }
  }, []);

  useEffect(() => {
    void run();
  }, [run]);

  return { forceUpdate, pendingAlert, dismissAlert };
}
