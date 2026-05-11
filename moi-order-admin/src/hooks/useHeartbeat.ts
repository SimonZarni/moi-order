import { useEffect } from 'react';

import { settingsApi } from 'src/api/settings';

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Keeps the admin Sanctum token alive by pinging the server every 5 minutes.
 * Only fires when the browser tab is visible — pauses automatically when the
 * admin switches away and resumes when they return.
 *
 * Silently ignores network errors and 503 responses — the purpose is session
 * extension, not UI gating. If the token has genuinely expired, the next real
 * API call will receive a 401 and the client interceptor will redirect to login.
 */
export function useHeartbeat(): void {
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const ping = () => {
      if (document.visibilityState === 'visible') {
        settingsApi.ping().catch(() => {});
      }
    };

    const start = () => {
      ping(); // immediate ping when tab becomes visible
      intervalId = setInterval(ping, INTERVAL_MS);
    };

    const stop = () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        start();
      } else {
        stop();
      }
    };

    // Start immediately if tab is already visible on mount.
    if (document.visibilityState === 'visible') {
      start();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stop();
    };
  }, []);
}
