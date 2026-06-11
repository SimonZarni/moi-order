export const APPLE_WEB_CANCELLED = 'APPLE_WEB_SIGN_IN_CANCELLED';

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

/**
 * Opens an Apple Sign In popup (no server redirect needed with usePopup: true)
 * and returns the id_token to send to /auth/apple.
 *
 * Prerequisites (Apple Developer Console > Services ID):
 *   - Domain: merchant.moiorder.com
 *   - Return URL: https://merchant.moiorder.com/auth/apple/callback
 *
 * Only call on web — native iOS uses expo-apple-authentication.
 */
export async function signInWithAppleWeb(
  clientId: string,
  redirectURI: string,
): Promise<{ idToken: string; name?: string; email?: string }> {
  if (!window.AppleID) {
    throw new Error('Apple Sign In SDK not loaded. Ensure the appleid.auth.js script is in index.html.');
  }

  window.AppleID.auth.init({
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
