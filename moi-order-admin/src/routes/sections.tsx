import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { AuthGuard, PermissionRouteGuard } from './components';

// ----------------------------------------------------------------------

export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const RolesPage = lazy(() => import('src/pages/roles'));
export const UsersPage = lazy(() => import('src/pages/users'));
export const UserDetailPage = lazy(() => import('src/pages/user-detail'));
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
export const ServiceDetailPage = lazy(() => import('src/pages/service-detail'));
export const ContentPage = lazy(() => import('src/pages/content'));
export const SupportPage = lazy(() => import('src/pages/support'));
export const SubmissionDetailPage = lazy(() => import('src/pages/submission-detail'));
export const RestaurantsPage = lazy(() => import('src/pages/restaurants'));
export const RestaurantCreatePage = lazy(() => import('src/pages/restaurant-create'));
export const RestaurantDetailPage = lazy(() => import('src/pages/restaurant-detail'));
export const FoodOrdersPage = lazy(() => import('src/pages/food-orders'));
export const FoodOrderDetailPage = lazy(() => import('src/pages/food-order-detail'));
export const HomeCardsPage = lazy(() => import('src/pages/home-cards'));
export const HomeCardCreatePage = lazy(() => import('src/pages/home-card-create'));
export const HomeCardEditPage = lazy(() => import('src/pages/home-card-edit'));
export const UnauthorizedPage = lazy(() => import('src/pages/unauthorized'));
export const MerchantsPage = lazy(() => import('src/pages/merchants'));
export const KycDetailPage = lazy(() => import('src/pages/kyc-detail'));
export const MerchantCreatePage = lazy(() => import('src/pages/merchant-create'));
export const PushNotificationsPage = lazy(() => import('src/pages/push-notifications'));
export const NotificationsPage = lazy(() => import('src/pages/notifications'));

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

const guard = (permission: string, element: React.ReactNode) => (
  <PermissionRouteGuard permission={permission}>{element}</PermissionRouteGuard>
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

      // Places — list open to all; create/edit are permission-gated
      { path: 'places', element: <PlacesPage /> },
      { path: 'places/new', element: guard('places.create', <PlaceCreatePage />) },
      { path: 'places/:id/edit', element: guard('places.update', <PlaceEditPage />) },

      // Attractions — no backend permission guard
      { path: 'attractions', element: <AttractionsPage /> },
      { path: 'attractions/new', element: <AttractionCreatePage /> },
      { path: 'attractions/:id', element: <AttractionDetailPage /> },

      // Bookings — no backend permission guard
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'bookings/:id', element: <BookingDetailPage /> },
      { path: 'bookings/report', element: <ReportPage /> },

      // Users — list open, actions guarded per-button
      { path: 'users', element: <UsersPage /> },
      { path: 'users/:id', element: <UserDetailPage /> },

      // Payments — requires payments.view
      { path: 'payments', element: guard('payments.view', <PaymentsPage />) },
      { path: 'payments/:id', element: guard('payments.view', <PaymentDetailPage />) },

      // Services — list open; detail page requires services.update
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/:id', element: guard('services.update', <ServiceDetailPage />) },

      // Submissions — requires submissions.view
      { path: 'services/submissions', element: guard('submissions.view', <SubmissionsPage />) },
      { path: 'services/submissions/:id', element: guard('submissions.view', <SubmissionDetailPage />) },

      // Roles — requires admins.manage
      { path: 'roles', element: guard('admins.manage', <RolesPage />) },

      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'content', element: <ContentPage /> },
      { path: 'support', element: <SupportPage /> },

      // Restaurants — requires restaurants.manage
      { path: 'restaurants', element: guard('restaurants.manage', <RestaurantsPage />) },
      { path: 'restaurants/new', element: guard('restaurants.manage', <RestaurantCreatePage />) },
      { path: 'restaurants/:id', element: guard('restaurants.manage', <RestaurantDetailPage />) },

      // Food Orders — no backend permission guard
      { path: 'food-orders', element: <FoodOrdersPage /> },
      { path: 'food-orders/:id', element: <FoodOrderDetailPage /> },
      // Home Cards — requires home_cards.manage
      { path: 'home-cards', element: guard('home_cards.manage', <HomeCardsPage />) },
      { path: 'home-cards/new', element: guard('home_cards.manage', <HomeCardCreatePage />) },
      { path: 'home-cards/:id/edit', element: guard('home_cards.manage', <HomeCardEditPage />) },

      // Merchants
      { path: 'merchants', element: <MerchantsPage /> },
      { path: 'merchants/kyc/:id', element: <KycDetailPage /> },
      { path: 'merchants/new', element: <MerchantCreatePage /> },

      // Push Notifications — open to all admins
      { path: 'push-notifications', element: <PushNotificationsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },

      { path: 'account/profile', element: <ProfilePage /> },
      { path: 'account/settings', element: <SettingsPage /> },

      { path: 'unauthorized', element: <UnauthorizedPage /> },
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
