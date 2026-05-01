import { useAuth } from 'src/context/auth-context';

// ----------------------------------------------------------------------

type PermissionGuardProps = {
  permission: string;
  children: React.ReactNode;
};

export function PermissionGuard({ permission, children }: PermissionGuardProps) {
  const { hasPermission } = useAuth();
  if (!hasPermission(permission)) return null;
  return <>{children}</>;
}
