/**
 * Principle: SRP — owns client-side auth state only (user + isLoggedIn).
 * Principle: DIP — components never import this directly; they receive data from hooks.
 * Security: token management delegated to api/client.ts (setMemoryToken).
 *   SecureStore persistence is fire-and-forget (non-blocking) — never awaited here.
 *   Token is read from SecureStore only at app startup (in App.tsx), then kept in memory.
 */
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { setMemoryToken } from '@/shared/api/client';
import { TOKEN_KEY } from '@/shared/constants/config';
import { User } from '@/types/models';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (user: User, token: string): void => {
    setMemoryToken(token);
    // Persist token for app restart — fire-and-forget, never await in sync context.
    SecureStore.setItemAsync(TOKEN_KEY, token).catch(() => {});
    set({ user, isLoggedIn: true });
  },

  clearAuth: (): void => {
    setMemoryToken(null);
    // Remove persisted token — fire-and-forget.
    SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    set({ user: null, isLoggedIn: false });
  },
}));
