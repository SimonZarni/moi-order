import { Navigate } from 'react-router-dom';

import { useAuth } from 'src/context/auth-context';

// ----------------------------------------------------------------------

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAuth();

  // Wait for the session check (/auth/me) to resolve before deciding.
  // Rendering null prevents a flash-redirect on page load for users with a valid cookie.
  if (isLoading) {
    return null;
  }

  if (!admin) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
