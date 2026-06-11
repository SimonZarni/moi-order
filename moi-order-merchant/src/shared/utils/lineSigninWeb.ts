import * as AuthSession from 'expo-auth-session';

export const LINE_WEB_CANCELLED = 'LINE_WEB_SIGN_IN_CANCELLED';

const DISCOVERY = {
  authorizationEndpoint: 'https://access.line.me/oauth2/v2.1/authorize',
  tokenEndpoint: 'https://api.line.me/oauth2/v2.1/token',
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
 * Opens a LINE OAuth popup using PKCE (no client_secret exposed in browser).
 * Returns the id_token + nonce to send to /auth/line — no backend changes needed.
 *
 * Prerequisites (LINE Developer Console > your Login channel > Web app):
 *   - Callback URL: https://merchant.moiorder.com/auth/line/callback
 *
 * Only call on web — native flows use @xmartlabs/react-native-line.
 */
export async function signInWithLineWeb(
  channelId: string,
  redirectUri: string,
): Promise<{ idToken: string; nonce: string }> {
  const nonce = generateNonce();

  const request = new AuthSession.AuthRequest({
    clientId: channelId,
    scopes: ['profile', 'openid', 'email'],
    redirectUri,
    usePKCE: true,
    responseType: AuthSession.ResponseType.Code,
    extraParams: { nonce },
  });

  await request.makeAuthUrlAsync(DISCOVERY);

  const result = await request.promptAsync(DISCOVERY);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    const err = new Error('LINE sign-in was cancelled.');
    (err as Error & { code: string }).code = LINE_WEB_CANCELLED;
    throw err;
  }

  if (result.type !== 'success') {
    const msg = (result as { error?: { message?: string } }).error?.message ?? result.type;
    throw new Error(`LINE sign-in failed: ${msg}`);
  }

  // LINE supports PKCE — client_secret not required when code_verifier is present.
  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      code: result.params.code,
      clientId: channelId,
      redirectUri,
      extraParams: { code_verifier: request.codeVerifier ?? '' },
    },
    { tokenEndpoint: DISCOVERY.tokenEndpoint },
  );

  const idToken = tokenResponse.idToken;
  if (!idToken) {
    throw new Error('LINE did not return an ID token. Ensure openid is in the scopes.');
  }

  return { idToken, nonce };
}
