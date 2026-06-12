import * as AuthSession from 'expo-auth-session';

export const GOOGLE_WEB_CANCELLED = 'GOOGLE_WEB_SIGN_IN_CANCELLED';

const DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

function generateNonce(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Opens a Google OAuth popup using response_type=id_token (OpenID implicit flow).
 * Returns the Google ID token directly — no code exchange or client_secret required.
 * The caller sends this ID token to /auth/google on the backend.
 *
 * Why not PKCE + code flow: Google's token endpoint requires client_secret for the
 * code exchange even when PKCE is used on web clients. client_secret cannot be
 * embedded in a public frontend bundle, so the implicit id_token flow is the
 * correct approach for browser-only SPAs.
 *
 * Prerequisites (Google Cloud Console > OAuth client):
 *   - Authorized JavaScript origins: https://<domain>
 *   - Authorized redirect URIs: https://<domain>/
 *
 * Only call on web — native flows use @react-native-google-signin.
 */
export async function signInWithGoogleWeb(clientId: string): Promise<string> {
  const redirectUri = AuthSession.makeRedirectUri();
  const nonce = generateNonce();

  const request = new AuthSession.AuthRequest({
    clientId,
    scopes: ['openid', 'email', 'profile'],
    redirectUri,
    usePKCE: false,
    responseType: AuthSession.ResponseType.IdToken,
    extraParams: { nonce },
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

  const idToken = result.params.id_token;
  if (!idToken) {
    throw new Error('Google did not return an ID token.');
  }

  return idToken;
}
