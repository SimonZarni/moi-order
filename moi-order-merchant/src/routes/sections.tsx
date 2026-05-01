import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { useAuthStore } from 'src/store/authStore';
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

const SignInPage = lazy(() => import('src/pages/sign-in'));
const OrdersPage = lazy(() => import('src/pages/orders'));
const MenuPage = lazy(() => import('src/pages/menu'));
const RestaurantPage = lazy(() => import('src/pages/restaurant'));

// ----------------------------------------------------------------------

function PageLoader() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}

// ----------------------------------------------------------------------

function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/sign-in" replace />;
  return <>{children}</>;
}

function GuestGuard({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/orders" replace />;
  return <>{children}</>;
}

// ----------------------------------------------------------------------

export function AppRoutes() {
  return useRoutes([
    {
      path: '/sign-in',
      element: (
        <GuestGuard>
          <Suspense fallback={<PageLoader />}>
            <SignInPage />
          </Suspense>
        </GuestGuard>
      ),
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { index: true, element: <Navigate to="/orders" replace /> },
        {
          path: 'orders',
          element: (
            <Suspense fallback={<PageLoader />}>
              <OrdersPage />
            </Suspense>
          ),
        },
        {
          path: 'menu',
          element: (
            <Suspense fallback={<PageLoader />}>
              <MenuPage />
            </Suspense>
          ),
        },
        {
          path: 'restaurant',
          element: (
            <Suspense fallback={<PageLoader />}>
              <RestaurantPage />
            </Suspense>
          ),
        },
      ],
    },
    { path: '*', element: <Navigate to="/orders" replace /> },
  ]);
}
