import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
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
  },
  {
    title: 'Other Services',
    path: '/services',
    icon: icon('ic-lock'),
    info: (
      <Label color="primary" variant="inverted">
        New
      </Label>
    ),
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
      },
    ],
  },
  {
    title: 'Roles & Permissions',
    path: '/roles',
    icon: icon('ic-lock'),
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
