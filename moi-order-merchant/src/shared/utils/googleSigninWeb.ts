import * as AuthSession from 'expo-auth-session';

export const GOOGLE_WEB_CANCELLED = 'GOOGLE_WEB_SIGN_IN_CANCELLED';

const DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

/**
 * Opens a Google OAuth popup, exchanges the authorization code for tokens via
 * PKCE, and returns the Google ID token.
 *
 * The caller sends this ID token to the existing /auth/google backend endpoint —
 * no backend changes required.
 *
 * Prerequisites (Google Cloud Console > OAuth client):
 *   - Authorized redirect URI: http://localhost:<PORT>/ (dev) and https://<domain>/ (prod)
 *
 * Only call on web — native flows use @react-native-google-signin.
 */
export async function signInWithGoogleWeb(clientId: string): Promise<string> {
  const redirectUri = AuthSession.makeRedirectUri();

  const request = new AuthSession.AuthRequest({
    clientId,
    scopes: ['openid', 'email', 'profile'],
    redirectUri,
    usePKCE: true,
    responseType: AuthSession.ResponseType.Code,
  });

  await request.makeAuthUrlAsync(DISCOVERY);

  const result = await request.promptAsync(DISCOVERY);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    const err = new Error('Google sign-in was cancelled.');
    (err as Error & { code: string }).code = GOOGLE_WEB_CANCELLED;
    throw err;
  }

  if (result.type !== 'success') {
    const msg = (result as { error?: { message?: string } }).error?.message ?? result.type;
    throw new Error(`Google sign-in failed: ${msg}`);
  }

  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      code: result.params.code,
      clientId,
      redirectUri,
      extraParams: { code_verifier: request.codeVerifier ?? '' },
    },
    { tokenEndpoint: DISCOVERY.tokenEndpoint },
  );

  const idToken = tokenResponse.idToken;
  if (!idToken) {
    throw new Error('Google did not return an ID token. Ensure openid is in the scopes.');
  }

  return idToken;
}
