import type { AppUser } from 'src/types';

import { useState, useEffect, useContext, useCallback, createContext } from 'react';

import { authApi } from 'src/api/auth';
import { TOKEN_KEY } from 'src/api/client';
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
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then((user) => {
        setAdmin(user);
        registerPushSubscription(); // restore subscription on page reload
      })
      .catch((err: unknown) => {
        // 401 is handled by the Axios interceptor (clears token + redirects).
        // Any other error (network failure, 5xx) silently clears the session
        // so the guard redirects to sign-in rather than showing a broken state.
        const status = (err as { response?: { status?: number } }).response?.status;
        if (status !== 401) {
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, token);
    setAdmin(user);
    registerPushSubscription(); // fire-and-forget — never blocks login
  }, []);

  const logout = useCallback(async () => {
    await unregisterPushSubscription(); // DELETE from backend before token is cleared
    await authApi.logout().catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
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
