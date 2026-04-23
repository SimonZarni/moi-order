import { Alert, TurboModuleRegistry } from 'react-native';

// Safe shim for @react-native-google-signin/google-signin.
// TurboModuleRegistry.get (non-throwing) detects Expo Go at runtime.
// Metro bundles the real module but never evaluates it in Expo Go,
// so TurboModuleRegistry.getEnforcing never fires and the app doesn't crash.

const isNativeAvailable = TurboModuleRegistry.get('RNGoogleSignin') !== null;

const SIGN_IN_CANCELLED = 'SIGN_IN_CANCELLED';

const mockStatusCodes = {
  SIGN_IN_CANCELLED,
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
} as const;

const mockGoogleSignin = {
  configure: (_options: Record<string, unknown>): void => {},
  hasPlayServices: async (): Promise<boolean> => true,
  signOut: async (): Promise<null> => null,
  signIn: async (): Promise<never> => {
    Alert.alert(
      'Expo Go',
      'Google Sign-In requires a development build (APK). It is not available in Expo Go.',
    );
    throw { code: SIGN_IN_CANCELLED };
  },
  getTokens: async (): Promise<{ idToken: string; accessToken: string }> => {
    throw { code: SIGN_IN_CANCELLED };
  },
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const real = isNativeAvailable ? require('@react-native-google-signin/google-signin') : null;

export const GoogleSignin: typeof import('@react-native-google-signin/google-signin').GoogleSignin =
  isNativeAvailable ? real.GoogleSignin : mockGoogleSignin;

export const statusCodes: typeof import('@react-native-google-signin/google-signin').statusCodes =
  isNativeAvailable ? real.statusCodes : mockStatusCodes;
