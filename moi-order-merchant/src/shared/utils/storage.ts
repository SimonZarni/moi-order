import { Platform } from 'react-native';

const webStorage = {
  getItemAsync: async (key: string): Promise<string | null> =>
    typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null,
  setItemAsync: async (key: string, value: string): Promise<void> => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  },
  deleteItemAsync: async (key: string): Promise<void> => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  },
};

// Lazy-load expo-secure-store only on native to avoid web bundle side-effects
function getNativeStorage() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('expo-secure-store') as typeof import('expo-secure-store');
}

export const storage =
  Platform.OS === 'web'
    ? webStorage
    : {
        getItemAsync: (key: string) => getNativeStorage().getItemAsync(key),
        setItemAsync: (key: string, value: string) => getNativeStorage().setItemAsync(key, value),
        deleteItemAsync: (key: string) => getNativeStorage().deleteItemAsync(key),
      };
