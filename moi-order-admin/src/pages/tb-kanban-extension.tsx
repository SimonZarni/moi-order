import { TBKanbanView } from 'src/sections/tb/kanban/view/tb-kanban-view';

// ----------------------------------------------------------------------

const SERVICE_TYPES = [
  { id: 'passport', label: 'Passport' },
  { id: 'ci', label: 'CI' },
  { id: 'visa', label: 'Visa' },
  { id: 'work_permit', label: 'Work Permit' },
];

export default function TBKanbanExtensionPage() {
  return (
    <>
      <title>Extension — Trusted Brothers</title>
      <TBKanbanView
        pipeline="extension"
        pageTitle="Extension"
        serviceTypes={SERVICE_TYPES}
      />
    </>
  );
}
