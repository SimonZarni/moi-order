import * as AuthSession from 'expo-auth-session';

export const LINE_WEB_CANCELLED = 'LINE_WEB_SIGN_IN_CANCELLED';

const DISCOVERY = {
  authorizationEndpoint: 'https://access.line.me/oauth2/v2.1/authorize',
  // Token exchange is done server-side — LINE's token endpoint lacks CORS headers
  // for browser requests. The backend endpoint /auth/line/web handles the exchange.
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
 * Opens a LINE OAuth popup and returns the authorization code + nonce.
 * The caller must send these to /auth/line/web (backend) which exchanges
 * the code server-side (LINE's token endpoint has no CORS headers for browsers).
 *
 * Prerequisites (LINE Developer Console > your Login channel > Web app):
 *   - Callback URL: https://merchant.moiorder.com/auth/line/callback
 *
 * Only call on web — native flows use @xmartlabs/react-native-line.
 */
export async function signInWithLineWeb(
  channelId: string,
  redirectUri: string,
): Promise<{ code: string; nonce: string; redirectUri: string }> {
  const nonce = generateNonce();

  const request = new AuthSession.AuthRequest({
    clientId: channelId,
    scopes: ['profile', 'openid', 'email'],
    redirectUri,
    usePKCE: false,
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

  return { code: result.params.code, nonce, redirectUri };
}
