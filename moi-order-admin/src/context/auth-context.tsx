import type { AppUser } from 'src/types';

import { useState, useEffect, useContext, useCallback, createContext } from 'react';

import { authApi } from 'src/api/auth';
import { registerPushSubscription, unregisterPushSubscription } from 'src/lib/web-push';

// ----------------------------------------------------------------------

type AuthState = {
  admin: AppUser | null;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (key: string) => boolean;
  isSuperAdmin: () => boolean;
};

// ----------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

// ----------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Always call /me on mount to check whether the httpOnly admin_token cookie is
    // still valid. There is no JS-visible token to check first — that is intentional.
    // On 401: the Axios interceptor redirects to /sign-in (unless already there).
    // On any other error: isLoading becomes false, admin stays null, AuthGuard redirects.
    authApi
      .me()
      .then((user) => {
        setAdmin(user);
        registerPushSubscription(); // restore push subscription on page reload
      })
      .catch(() => {
        // 401 on /sign-in page: interceptor skips redirect, we just stay unauthenticated.
        // 401 on protected page: interceptor handles redirect; this catch is a no-op.
        // Network / 5xx: clear state, AuthGuard redirects to sign-in.
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Server sets the httpOnly cookie in the response — nothing to store on our side.
    const { user } = await authApi.login({ email, password });
    setAdmin(user);
    registerPushSubscription(); // fire-and-forget — never blocks login
  }, []);

  const logout = useCallback(async () => {
    await unregisterPushSubscription(); // DELETE from backend before session is cleared
    await authApi.logout().catch(() => {});
    // Server clears the cookie; we clear local state. Browser discards the expired cookie.
    setAdmin(null);
  }, []);

  const isSuperAdmin = useCallback((): boolean => admin?.role?.slug === 'super_admin', [admin]);

  const hasPermission = useCallback(
    (key: string): boolean => {
      if (!admin) return false;
      if (admin.role?.slug === 'super_admin') return true;
      return admin.role?.permission_keys.includes(key) ?? false;
    },
    [admin]
  );

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout, hasPermission, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// ----------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
