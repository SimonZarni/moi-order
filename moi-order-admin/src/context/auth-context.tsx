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
    if (!sessionStorage.getItem('admin_token')) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then((user) => {
        setAdmin(user);
        registerPushSubscription();
      })
      .catch(() => {
        sessionStorage.removeItem('admin_token');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await authApi.login({ email, password });
    sessionStorage.setItem('admin_token', token);
    setAdmin(user);
    registerPushSubscription();
  }, []);

  const logout = useCallback(async () => {
    await unregisterPushSubscription();
    await authApi.logout().catch(() => {});
    sessionStorage.removeItem('admin_token');
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
