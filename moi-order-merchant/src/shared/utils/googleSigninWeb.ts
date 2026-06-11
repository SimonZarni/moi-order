import { Platform } from 'react-native';

export const GOOGLE_WEB_CANCELLED = 'GOOGLE_WEB_SIGN_IN_CANCELLED';

interface GisNotification {
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isDismissedMoment: () => boolean;
  isSkippedMoment: () => boolean;
  getDismissedReason: () => string;
}

interface GisCredentialResponse {
  credential: string;
  select_by: string;
}

interface GisAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GisCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  prompt: (notification?: (n: GisNotification) => void) => void;
  disableAutoSelect: () => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GisAccountsId } };
  }
}

// Polls until the GIS library is available (loaded via <script async> in index.html).
// Rejects after timeoutMs if the script never loads (e.g. ad-blocker).
function waitForGis(timeoutMs: number): Promise<GisAccountsId> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Not running in a browser.'));
      return;
    }
    if (window.google?.accounts?.id) {
      resolve(window.google.accounts.id);
      return;
    }
    const deadline = performance.now() + timeoutMs;
    const timer = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(timer);
        resolve(window.google.accounts.id);
      } else if (performance.now() > deadline) {
        clearInterval(timer);
        reject(new Error(
          'Google sign-in failed to load. Check your internet connection or disable any ad blockers, then refresh the page.',
        ));
      }
    }, 100);
  });
}

function notDisplayedMessage(reason: string): string {
  if (reason === 'opt_out_or_no_session') {
    return 'No Google account detected in this browser. Please sign in to Google in another tab first, then try again.';
  }
  if (reason === 'secure_http_required') {
    return 'Google sign-in requires HTTPS. Please access the dashboard over a secure connection.';
  }
  if (reason === 'unregistered_origin') {
    return 'Google sign-in is not configured for this domain. Contact support.';
  }
  return `Google sign-in could not be shown (${reason}). Try a different browser or check your browser settings.`;
}

/**
 * Triggers Google One Tap sign-in and resolves with the credential (JWT ID token).
 * Only call on web — native flows use the @react-native-google-signin package.
 */
export async function signInWithGoogleWeb(clientId: string): Promise<string> {
  if (Platform.OS !== 'web') {
    throw new Error('signInWithGoogleWeb must only be called on web.');
  }

  const gis = await waitForGis(8_000);

  return new Promise<string>((resolve, reject) => {
    gis.initialize({
      client_id: clientId,
      callback: ({ credential }) => {
        resolve(credential);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    gis.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        reject(new Error(notDisplayedMessage(notification.getNotDisplayedReason())));
      } else if (notification.isDismissedMoment()) {
        // User closed the One Tap dialog — treat as cancellation, not an error.
        const err = new Error('Google sign-in was cancelled.');
        (err as Error & { code: string }).code = GOOGLE_WEB_CANCELLED;
        reject(err);
      }
      // isDisplayed: prompt is visible — wait for credential callback.
    });
  });
}
