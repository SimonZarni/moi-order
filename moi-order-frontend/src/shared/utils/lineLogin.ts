import { Alert, TurboModuleRegistry } from 'react-native';

export interface LineAccessToken {
  accessToken: string;
  expiresIn: number;
  idToken?: string;
}

export interface LineUserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface LineLoginResult {
  accessToken: LineAccessToken;
  scope: string;
  userProfile?: LineUserProfile;
  idTokenNonce?: string;
  IDTokenNonce?: string;
}

export interface LineModule {
  setup: (options: { channelId: string }) => Promise<void>;
  login: (options: { scopes?: string[] }) => Promise<LineLoginResult>;
}

// Safe shim for @xmartlabs/react-native-line.
// Native LINE login is unavailable in Expo Go, so we show a clear alert instead of crashing.
const isNativeAvailable = TurboModuleRegistry.get('LineLogin') !== null;

const LINE_CANCELLED = 'LINE_LOGIN_CANCELLED';

const mockLineModule: LineModule = {
  setup: async (): Promise<void> => {},
  login: async (): Promise<never> => {
    Alert.alert(
      'Expo Go',
      'LINE sign-in requires a development build. It is not available in Expo Go.',
    );

    throw { code: LINE_CANCELLED };
  },
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const real = isNativeAvailable ? require('@xmartlabs/react-native-line') : null;

export const Line: LineModule = isNativeAvailable ? (real.default ?? real) : mockLineModule;

export const lineErrorCodes = {
  CANCELLED: LINE_CANCELLED,
} as const;
