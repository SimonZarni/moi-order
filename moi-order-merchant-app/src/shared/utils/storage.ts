import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// expo-secure-store on web uses localStorage internally, but can be unreliable
// in some metro web builds. This wrapper uses localStorage directly on web.
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

export const storage = Platform.OS === 'web' ? webStorage : SecureStore;
