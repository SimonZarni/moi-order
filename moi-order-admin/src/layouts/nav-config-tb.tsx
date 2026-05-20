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
    title: 'Clients',
    path: '/tb/people',
    icon: icon('solar:eye-closed-bold'),
  },
  {
    title: 'Kanban Pipelines',
    path: '/tb/kanban/company-reg',
    icon: icon('solar:check-circle-bold'),
    children: [
      {
        title: 'Company Registrations',
        path: '/tb/kanban/company-reg',
        icon: icon('solar:check-circle-bold'),
      },
      {
        title: 'Apply & Renew',
        path: '/tb/kanban/apply-renew',
        icon: icon('solar:restart-bold'),
      },
      {
        title: 'Extension',
        path: '/tb/kanban/extension',
        icon: icon('solar:clock-circle-outline'),
      },
    ],
  },
  {
    title: 'Document Review Desk',
    path: '/tb/documents',
    icon: icon('eva:done-all-fill'),
  },
  {
    title: 'To-Do List',
    path: '/tb/todo',
    icon: icon('solar:check-circle-bold'),
  },
  {
    title: 'Staff Audit Logs',
    path: '/tb/audit-logs',
    icon: icon('solar:clock-circle-outline'),
  },
  {
    title: 'Stage Templates',
    path: '/tb/templates',
    icon: icon('solar:settings-bold-duotone'),
  },
  {
    title: 'BOD Configuration',
    path: '/tb/bod',
    icon: icon('solar:settings-bold-duotone'),
  },
];
