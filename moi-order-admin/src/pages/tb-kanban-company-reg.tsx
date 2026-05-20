import { TBKanbanView } from 'src/sections/tb/kanban/view/tb-kanban-view';

// ----------------------------------------------------------------------

const SERVICE_TYPES = [
  { id: 'registration', label: 'Registration' },
  { id: 'audit_annual', label: 'Audit & Annual Return' },
  { id: 'company_edit', label: 'Company Edit' },
  { id: 'business_license', label: 'Business License' },
  { id: 'vat_reg', label: 'VAT Registration' },
];

export default function TBKanbanCompanyRegPage() {
  return (
    <>
      <title>Company Registrations — Trusted Brothers</title>
      <TBKanbanView
        pipeline="company_registration"
        pageTitle="Company Registrations"
        serviceTypes={SERVICE_TYPES}
      />
    </>
  );
}
