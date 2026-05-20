import { TBKanbanView } from 'src/sections/tb/kanban/view/tb-kanban-view';

// ----------------------------------------------------------------------

const SERVICE_TYPES = [
  { id: 'passport', label: 'Passport' },
  { id: 'ci', label: 'CI' },
  { id: 'visa', label: 'Visa' },
  { id: 'work_permit', label: 'Work Permit' },
];

export default function TBKanbanApplyRenewPage() {
  return (
    <>
      <title>Apply & Renew — Trusted Brothers</title>
      <TBKanbanView
        pipeline="apply_renew"
        pageTitle="Apply & Renew"
        serviceTypes={SERVICE_TYPES}
      />
    </>
  );
}
