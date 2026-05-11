/**
 * Principle: SRP — this hook owns exactly one concern: checking app-update gating
 * and in-app alert display on every app launch.
 *
 * Architecture notes:
 *  - Runs only in production builds (__DEV__ = skip entirely).
 *  - Semver comparison is numeric (no string lexicography).
 *  - SecureStore is read once at mount into local vars — never awaited in callbacks.
 *  - If both optional-update and alert need to show, the update alert appears first;
 *    the app alert is shown only after the user taps "Later" (or not at all if they
 *    tap "Update", since the app will background/exit).
 *  - ForceUpdate state is returned so App.tsx can render an undismissable Modal —
 *    navigation-layer workarounds cannot bypass a React Native Modal.
 */
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';

import { fetchAppConfig } from '@/shared/api/appConfig';
import { APP_UPDATE_TYPE, APP_ALERT_FREQUENCY } from '@/types/enums';

// SecureStore keys — namespaced to avoid collisions
const KEY_UPDATE_ALERT_DATE = 'moi_update_alert_date';
const KEY_APP_ALERT_DATE    = 'moi_app_alert_date';

export interface ForceUpdateState {
  title: string;
  message: string;
  storeUrl: string;
}

export interface UseAppConfigResult {
  forceUpdate: ForceUpdateState | null;
}

function todayString(): string {
  // YYYY-MM-DD in local time — consistent with SecureStore-stored values
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns true when storeVersion is strictly greater than currentVersion.
 * Compares each semver component numerically (major → minor → patch).
 */
function isVersionBelow(currentVersion: string, minVersion: string): boolean {
  const parse = (v: string): [number, number, number] => {
    const parts = v.split('.').map(Number);
    return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
  };
  const [cMaj, cMin, cPat] = parse(currentVersion);
  const [mMaj, mMin, mPat] = parse(minVersion);
  if (mMaj !== cMaj) return mMaj > cMaj;
  if (mMin !== cMin) return mMin > cMin;
  return mPat > cPat;
}

export function useAppConfig(): UseAppConfigResult {
  const [forceUpdate, setForceUpdate] = useState<ForceUpdateState | null>(null);

  const run = useCallback(async (): Promise<void> => {
    // Skip all checks in development — avoids noisy alerts while coding
    if (__DEV__) return;

    const currentVersion = Application.nativeApplicationVersion;
    if (currentVersion === null) return;

    let config;
    try {
      config = await fetchAppConfig();
    } catch {
      // Network unavailable — skip silently; never block launch on a network error
      return;
    }

    const today = todayString();
    const { update, alert } = config;

    // ── 1. Determine update need ────────────────────────────────────────────
    const minVersion = Platform.OS === 'ios'
      ? update.ios_min_version
      : update.android_min_version;

    const storeUrl = Platform.OS === 'ios'
      ? update.ios_store_url
      : update.android_store_url;

    const needsUpdate =
      minVersion !== null &&
      storeUrl !== null &&
      update.type !== APP_UPDATE_TYPE.None &&
      isVersionBelow(currentVersion, minVersion);

    // ── 2. Required update — set state so App.tsx renders blocking Modal ──
    if (needsUpdate && update.type === APP_UPDATE_TYPE.Required) {
      setForceUpdate({
        title:    update.title    ?? 'Update Required',
        message:  update.message  ?? 'Please update the app to continue.',
        storeUrl: storeUrl!,
      });
      return; // Don't show any other alert — modal blocks the UI entirely
    }

    // ── 3. Optional update ─────────────────────────────────────────────────
    const showOptional = needsUpdate && update.type === APP_UPDATE_TYPE.Optional;
    let shownUpdateAlert = false;

    if (showOptional) {
      const lastShown = await SecureStore.getItemAsync(KEY_UPDATE_ALERT_DATE).catch(() => null);
      if (lastShown !== today) {
        await SecureStore.setItemAsync(KEY_UPDATE_ALERT_DATE, today).catch(() => {});

        // Wrap in a Promise so we can sequence the app alert AFTER the user taps "Later"
        await new Promise<void>((resolve) => {
          Alert.alert(
            update.title   ?? 'Update Available',
            update.message ?? 'A new version of the app is available.',
            [
              {
                text:    'Later',
                style:   'cancel',
                onPress: () => resolve(),
              },
              {
                text:    'Update',
                onPress: () => {
                  Linking.openURL(storeUrl!).catch(() => {});
                  resolve();
                },
              },
            ],
            { cancelable: false },
          );
        });
        shownUpdateAlert = true;
      }
    }

    // ── 4. In-app alert ────────────────────────────────────────────────────
    if (!alert.is_active || alert.message === null) return;

    let showAlert = false;
    if (alert.frequency === APP_ALERT_FREQUENCY.EveryOpen) {
      showAlert = true;
    } else {
      // once_per_day
      const lastShown = await SecureStore.getItemAsync(KEY_APP_ALERT_DATE).catch(() => null);
      if (lastShown !== today) {
        await SecureStore.setItemAsync(KEY_APP_ALERT_DATE, today).catch(() => {});
        showAlert = true;
      }
    }

    if (showAlert) {
      // If we just showed an update alert (and the user tapped "Later"), give a small
      // tick so the first Alert fully dismisses before the second one appears.
      if (shownUpdateAlert) {
        await new Promise<void>((r) => setTimeout(r, 300));
      }
      Alert.alert(
        alert.title ?? 'Notice',
        alert.message,
        [{ text: 'OK' }],
      );
    }
  }, []);

  useEffect(() => {
    void run();
  }, [run]);

  return { forceUpdate };
}
