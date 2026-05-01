import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

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
    icon: icon('ic-analytics'),
  },
  {
    title: 'Places',
    path: '/places',
    icon: icon('ic-blog'),
  },
  {
    title: 'Attractions',
    path: '/attractions',
    icon: icon('ic-cart'),
  },
  {
    title: 'Bookings',
    path: '/bookings',
    icon: icon('ic-cart'),
  },
  {
    title: '90-Day Report',
    path: '/bookings/report',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Users',
    path: '/users',
    icon: icon('ic-user'),
  },
  {
    title: 'Payments',
    path: '/payments',
    icon: icon('ic-analytics'),
    permission: 'payments.view',
  },
  {
    title: 'Food & Restaurants',
    path: '/restaurants',
    icon: icon('ic-cart'),
    children: [
      {
        title: 'Restaurants',
        path: '/restaurants',
        icon: icon('ic-cart'),
        permission: 'restaurants.manage',
      },
      {
        title: 'Food Orders',
        path: '/food-orders',
        icon: icon('ic-analytics'),
      },
    ],
  },
  {
    title: 'Other Services',
    path: '/services',
    icon: icon('ic-lock'),
    children: [
      {
        title: 'Manage Services',
        path: '/services',
        icon: icon('ic-lock'),
      },
      {
        title: 'Submissions',
        path: '/services/submissions',
        icon: icon('ic-disabled'),
        permission: 'submissions.view',
      },
    ],
  },
  {
    title: 'Home Cards',
    path: '/home-cards',
    icon: icon('ic-blog'),
    permission: 'home_cards.manage',
  },
  {
    title: 'Roles & Permissions',
    path: '/roles',
    icon: icon('ic-lock'),
    permission: 'admins.manage',
  },
  {
    title: 'Reviews',
    path: '/reviews',
    icon: icon('ic-disabled'),
  },
  {
    title: 'Content',
    path: '/content',
    icon: icon('ic-blog'),
  },
  {
    title: 'Support',
    path: '/support',
    icon: icon('ic-disabled'),
  },
];
