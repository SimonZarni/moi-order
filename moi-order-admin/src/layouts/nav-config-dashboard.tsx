import type { IconifyName } from 'src/components/iconify';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: IconifyName) => <Iconify icon={name} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
  permission?: string;
  children?: Omit<NavItem, 'children'>[];
};

export const navData: NavItem[] = [
  {
    title: 'Overview',
    path: '/',
    icon: icon('solar:home-angle-bold-duotone'),
  },
  {
    title: 'Users',
    path: '/users',
    icon: icon('solar:eye-bold'),
  },
  {
    title: 'Merchants',
    path: '/merchants',
    icon: icon('solar:file-bold'),
    children: [
      {
        title: 'KYC Applications',
        path: '/merchants',
        icon: icon('solar:file-bold'),
      },
      {
        title: 'Create Merchant',
        path: '/merchants/new',
        icon: icon('mingcute:add-line'),
      },
    ],
  },
  {
    title: '90-Day Report',
    path: '/bookings/report',
    icon: icon('solar:restart-bold'),
  },
  {
    title: 'Bookings',
    path: '/bookings',
    icon: icon('solar:clock-circle-outline'),
  },
  {
    title: 'Other Services',
    path: '/services',
    icon: icon('solar:settings-bold-duotone'),
    children: [
      {
        title: 'Manage Services',
        path: '/services',
        icon: icon('solar:settings-bold-duotone'),
      },
      {
        title: 'Submissions',
        path: '/services/submissions',
        icon: icon('eva:done-all-fill'),
        permission: 'submissions.view',
      },
    ],
  },
  {
    title: 'Food & Restaurants',
    path: '/restaurants',
    icon: icon('solar:cart-3-bold'),
    children: [
      {
        title: 'Restaurants',
        path: '/restaurants',
        icon: icon('solar:gallery-bold'),
        permission: 'restaurants.manage',
      },
      {
        title: 'Food Orders',
        path: '/food-orders',
        icon: icon('solar:cart-3-bold'),
      },
    ],
  },
  {
    title: 'Places',
    path: '/places',
    icon: icon('solar:gallery-bold'),
    children: [
      {
        title: 'All Places',
        path: '/places',
        icon: icon('solar:gallery-bold'),
      },
      {
        title: 'Categories',
        path: '/places/categories',
        icon: icon('ic:round-filter-list'),
      },
      {
        title: 'Tags',
        path: '/places/tags',
        icon: icon('solar:check-circle-bold'),
      },
    ],
  },
  {
    title: 'Attractions',
    path: '/attractions',
    icon: icon('solar:play-bold'),
  },
  {
    title: 'Payments',
    path: '/payments',
    icon: icon('eva:trending-up-fill'),
    permission: 'payments.view',
  },
  {
    title: 'Home Cards',
    path: '/home-cards',
    icon: icon('solar:share-bold'),
    permission: 'home_cards.manage',
  },
  {
    title: 'Notifications',
    path: '/notifications',
    icon: icon('solar:bell-bing-bold-duotone'),
  },
  {
    title: 'Push Notifications',
    path: '/push-notifications',
    icon: icon('solar:settings-bold-duotone'),
  },
  {
    title: 'Reviews',
    path: '/reviews',
    icon: icon('solar:check-circle-bold'),
  },
  {
    title: 'Content',
    path: '/content',
    icon: icon('solar:pen-bold'),
  },
  {
    title: 'Support',
    path: '/support',
    icon: icon('solar:chat-round-dots-bold'),
  },
  {
    title: 'Roles & Permissions',
    path: '/roles',
    icon: icon('solar:shield-keyhole-bold-duotone'),
    permission: 'admins.manage',
  },
];
