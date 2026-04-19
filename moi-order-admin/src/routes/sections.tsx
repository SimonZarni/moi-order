import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { AuthGuard } from './components';

// ----------------------------------------------------------------------

export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const RolesPage = lazy(() => import('src/pages/roles'));
export const UsersPage = lazy(() => import('src/pages/users'));
export const ReportPage = lazy(() => import('src/pages/report'));
export const ReviewsPage = lazy(() => import('src/pages/reviews'));
export const PlacesPage = lazy(() => import('src/pages/places'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const BookingsPage = lazy(() => import('src/pages/bookings'));
export const BookingDetailPage = lazy(() => import('src/pages/booking-detail'));
export const PaymentsPage = lazy(() => import('src/pages/payments'));
export const ServicesPage = lazy(() => import('src/pages/services'));
export const SettingsPage = lazy(() => import('src/pages/settings'));
export const PlaceEditPage = lazy(() => import('src/pages/place-edit'));
export const PlaceCreatePage = lazy(() => import('src/pages/place-create'));
export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const AttractionsPage = lazy(() => import('src/pages/attractions'));
export const AttractionDetailPage = lazy(() => import('src/pages/attraction-detail'));
export const AttractionCreatePage = lazy(() => import('src/pages/attraction-create'));
export const SubmissionsPage = lazy(() => import('src/pages/submissions'));
export const PaymentDetailPage = lazy(() => import('src/pages/payment-detail'));
export const ContentPage = lazy(() => import('src/pages/content'));
export const SupportPage = lazy(() => import('src/pages/support'));
export const SubmissionDetailPage = lazy(() => import('src/pages/submission-detail'));

const renderFallback = () => (
  <Box sx={{ display: 'flex', flex: '1 1 auto', alignItems: 'center', justifyContent: 'center' }}>
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'places', element: <PlacesPage /> },
      { path: 'places/new', element: <PlaceCreatePage /> },
      { path: 'places/:id/edit', element: <PlaceEditPage /> },
      { path: 'attractions', element: <AttractionsPage /> },
      { path: 'attractions/new', element: <AttractionCreatePage /> },
      { path: 'attractions/:id', element: <AttractionDetailPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'bookings/:id', element: <BookingDetailPage /> },
      { path: 'bookings/report', element: <ReportPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'payments/:id', element: <PaymentDetailPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/submissions', element: <SubmissionsPage /> },
      { path: 'services/submissions/:id', element: <SubmissionDetailPage /> },
      { path: 'roles', element: <RolesPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'content', element: <ContentPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'account/profile', element: <ProfilePage /> },
      { path: 'account/settings', element: <SettingsPage /> },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  { path: '404', element: <Page404 /> },
  { path: '*', element: <Page404 /> },
];
