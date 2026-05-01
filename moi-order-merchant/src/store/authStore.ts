import { create } from 'zustand';

import { TOKEN_KEY } from 'src/api/client';

import type { MerchantUser } from 'src/types';

// ----------------------------------------------------------------------

interface AuthState {
  user: MerchantUser | null;
  token: string | null;
  setAuth: (user: MerchantUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initialize from localStorage so state survives page refresh
  user: null,
  token: localStorage.getItem(TOKEN_KEY),

  setAuth: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ user, token });
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null });
  },
}));
