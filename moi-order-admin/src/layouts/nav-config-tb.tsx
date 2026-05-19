import type { IconifyName } from 'src/components/iconify';

import { Iconify } from 'src/components/iconify';

import type { NavItem } from './nav-config-dashboard';

// ----------------------------------------------------------------------

const icon = (name: IconifyName) => <Iconify icon={name} />;

export const tbNavData: NavItem[] = [
  {
    title: 'Overview',
    path: '/tb',
    icon: icon('solar:home-angle-bold-duotone'),
  },
  {
    title: 'Companies Overview',
    path: '/tb/clients',
    icon: icon('solar:eye-bold'),
  },
  {
    title: 'Kanban Pipelines',
    path: '/tb/kanban',
    icon: icon('solar:check-circle-bold'),
  },
  {
    title: 'Document Review Desk',
    path: '/tb/documents',
    icon: icon('eva:done-all-fill'),
  },
  {
    title: 'Staff Audit Logs',
    path: '/tb/audit-logs',
    icon: icon('solar:clock-circle-outline'),
  },
  {
    title: 'BOD Configuration',
    path: '/tb/bod',
    icon: icon('solar:settings-bold-duotone'),
  },
];
