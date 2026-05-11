import { useEffect } from 'react';
import * as Updates from 'expo-updates';

/**
 * Silently checks for an Expo OTA update on mount.
 *
 * Strategy: download in the background, apply on the NEXT app launch.
 * Users mid-session are never interrupted — the update is already ready
 * the moment they reopen the app.
 *
 * checkOnLaunch: "ALWAYS" in app.config.js handles the initial launch case
 * at the native layer (before JS runs). This hook catches updates published
 * while the user is already inside the app.
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
          // Update is now cached. Expo applies it automatically on the
          // next cold launch — no action or alert needed here.
        }
      } catch {
        // Network error, EAS unreachable, or update server down.
        // Fail silently — the current bundle continues to work fine.
      }
    }

    void checkAndDownload();
  }, []);
}
