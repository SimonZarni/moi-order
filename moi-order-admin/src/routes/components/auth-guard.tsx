import { Navigate } from 'react-router-dom';

import { TOKEN_KEY } from 'src/api/client';

// ----------------------------------------------------------------------

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
