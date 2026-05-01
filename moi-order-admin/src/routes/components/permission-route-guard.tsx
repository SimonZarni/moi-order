import { Navigate } from 'react-router-dom';

import { useAuth } from 'src/context/auth-context';

// ----------------------------------------------------------------------

type Props = {
  permission: string;
  children: React.ReactNode;
};

export function PermissionRouteGuard({ permission, children }: Props) {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) return null;

  if (!hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
