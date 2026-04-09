/**
 * Principle: SRP — owns client-side auth state only (user + isLoggedIn).
 * Principle: DIP — components never import this directly; they receive data from hooks.
 * Security: token management delegated to api/client.ts (setMemoryToken).
 */
import { create } from 'zustand';

import { setMemoryToken } from '@/shared/api/client';
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
    set({ user, isLoggedIn: true });
  },

  clearAuth: (): void => {
    setMemoryToken(null);
    set({ user: null, isLoggedIn: false });
  },
}));
