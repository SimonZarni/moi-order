import { Platform } from 'react-native';
import { create } from 'zustand';
import { setApiToken } from '../api/client';
import { storage } from '../shared/utils/storage';
import { initiateWebPushUnregister } from '../lib/web-push';
import type { MerchantUser } from '../types/models';
import { TOKEN_KEY } from '../shared/constants/config';

interface AuthStore {
  user: MerchantUser | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: MerchantUser, token: string) => void;
  setUser: (user: MerchantUser) => void;
  logout: () => void;
  initFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth(user, token) {
    storage.setItemAsync(TOKEN_KEY, token).catch(() => {});
    setApiToken(token);
    set({ user, token });
  },

  setUser(user) {
    set({ user });
  },

  logout() {
    // Dispatch web push unregister BEFORE clearing the token so the DELETE
    // request is issued with a valid Authorization header. The call is
    // fire-and-forget — it never blocks or delays the logout.
    if (Platform.OS === 'web') {
      const currentToken = get().token;
      if (currentToken) {
        initiateWebPushUnregister(currentToken);
      }
    }

    storage.deleteItemAsync(TOKEN_KEY).catch(() => {});
    setApiToken(null);
    try { localStorage.removeItem('merchant_screen'); } catch {}
    try { localStorage.removeItem('merchant_order_id'); } catch {}
    set({ user: null, token: null });
  },

  async initFromStorage() {
    try {
      const token = await storage.getItemAsync(TOKEN_KEY);
      if (token) setApiToken(token);
      set({ token: token ?? null, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
