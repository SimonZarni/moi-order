import { useEffect } from 'react';
import * as Updates from 'expo-updates';

/**
 * Silently checks for an Expo OTA update on mount.
 *
 * Strategy: download in the background, apply on the NEXT app launch.
 * Users mid-session are never interrupted — the update is already ready
 * the moment they reopen the app.
 *
 * checkOnLaunch is "NEVER" in app.config.js — all update checking goes
 * through this hook. After download, reloadAsync() applies the bundle
 * immediately so Android doesn't miss it by staying warm in the background.
 *
 * Skipped entirely in development — Updates APIs throw in __DEV__ mode.
 */
export function useOtaUpdate(): void {
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) return;

    async function checkAndDownload(): Promise<void> {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          // Reload immediately so the update applies on both iOS and Android.
          // Android keeps apps alive in the background indefinitely, so waiting
          // for the next cold launch means the cached update never fires.
          await Updates.reloadAsync();
        }
      } catch {
        // Network error, EAS unreachable, or update server down.
        // Fail silently — the current bundle continues to work fine.
      }
    }

    void checkAndDownload();
  }, []);
}
