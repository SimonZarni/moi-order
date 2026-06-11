export const APPLE_WEB_CANCELLED = 'APPLE_WEB_SIGN_IN_CANCELLED';

const APPLE_SDK_URL =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

interface AppleAuthResponse {
  authorization: { id_token: string; code: string };
  user?: {
    name?: { firstName?: string; lastName?: string };
    email?: string;
  };
}

interface AppleIDAuth {
  init(config: { clientId: string; scope: string; redirectURI: string; usePopup: boolean }): void;
  signIn(): Promise<AppleAuthResponse>;
}

declare global {
  interface Window { AppleID?: { auth: AppleIDAuth } }
}

function loadAppleSDK(): Promise<void> {
  if (window.AppleID) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${APPLE_SDK_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Apple SDK script failed to load.')));
      return;
    }
    const script = document.createElement('script');
    script.src = APPLE_SDK_URL;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Apple SDK script failed to load.'));
    document.head.appendChild(script);
  });
}

/**
 * Dynamically loads the Apple JS SDK if needed, then opens a Sign In popup.
 * usePopup: true means no server redirect — id_token comes back to the browser.
 *
 * Prerequisites (Apple Developer Console > Services ID com.moiorder.merchantweb):
 *   - Domain: merchant.moiorder.com
 *   - Return URL: https://merchant.moiorder.com/auth/apple/callback
 *
 * Only call on web — native iOS uses expo-apple-authentication.
 */
export async function signInWithAppleWeb(
  clientId: string,
  redirectURI: string,
): Promise<{ idToken: string; name?: string; email?: string }> {
  await loadAppleSDK();

  window.AppleID!.auth.init({
    clientId,
    scope: 'name email',
    redirectURI,
    usePopup: true,
  });

  let response: AppleAuthResponse;
  try {
    response = await window.AppleID.auth.signIn();
  } catch (e: unknown) {
    // Apple throws { error: 'popup_closed_by_user' } when the user dismisses
    const appleError = (e as { error?: string })?.error;
    if (
      appleError === 'popup_closed_by_user' ||
      appleError === 'user_cancelled_authorize'
    ) {
      const err = new Error('Apple sign-in was cancelled.');
      (err as Error & { code: string }).code = APPLE_WEB_CANCELLED;
      throw err;
    }
    throw e;
  }

  const idToken = response.authorization.id_token;
  const firstName = response.user?.name?.firstName;
  const lastName  = response.user?.name?.lastName;
  const name  = [firstName, lastName].filter(Boolean).join(' ') || undefined;
  const email = response.user?.email;

  return { idToken, name, email };
}
