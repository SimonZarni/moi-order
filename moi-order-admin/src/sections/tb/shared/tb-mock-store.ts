// ----------------------------------------------------------------------
// Status

export type StatusLevel = 'good' | 'warning' | 'critical';

export const STATUS_COLORS: Record<StatusLevel, string> = {
  good: '#10B981',
  warning: '#F59E0B',
  critical: '#EF4444',
};
export const STATUS_BG: Record<StatusLevel, string> = {
  good: '#D1FAE5',
  warning: '#FEF3C7',
  critical: '#FEE2E2',
};
export const STATUS_TEXT: Record<StatusLevel, string> = {
  good: '#065F46',
  warning: '#92400E',
  critical: '#991B1B',
};
export const STATUS_LABELS: Record<StatusLevel, string> = {
  good: 'Good',
  warning: 'Warning',
  critical: 'Critical',
};

// ----------------------------------------------------------------------
// Documents

export type CompanyDocumentCategory =
  | 'company_certificate'
  | 'vat_certificate'
  | 'tax_monthly'
  | 'tax_yearly'
  | 'audit_monthly'
  | 'audit_yearly'
  | 'business_license'
  | 'meeting_minutes';

export const DOCUMENT_CATEGORY_LABELS: Record<CompanyDocumentCategory, string> = {
  company_certificate: 'Company Certificate',
  vat_certificate: 'VAT Certificate',
  tax_monthly: 'TAX Monthly',
  tax_yearly: 'TAX Yearly',
  audit_monthly: 'Audit Monthly',
  audit_yearly: 'Audit Yearly',
  business_license: 'Business License',
  meeting_minutes: 'Meeting Minutes',
};

export const DOCUMENT_CATEGORIES: CompanyDocumentCategory[] = [
  'company_certificate',
  'vat_certificate',
  'tax_monthly',
  'tax_yearly',
  'audit_monthly',
  'audit_yearly',
  'business_license',
  'meeting_minutes',
];

export type CompanyDocument = {
  id: string;
  category: CompanyDocumentCategory;
  fileName: string;
  uploadedAt: string;
};

// ----------------------------------------------------------------------
// Directors

export type Director = {
  id: string;
  name: string;
  nationality: string;
  position: string;
  visaType?: string;
  visaExpiry?: string;
  workPermit?: boolean;
};

// ----------------------------------------------------------------------
// History

export type CompanyHistoryEntry = {
  id: string;
  date: string;
  action: string;
  by: string;
};

// ----------------------------------------------------------------------
// Company (TBClient)

export type TBClient = {
  id: string;
  companyName: string;
  thaiRegNumber: string;
  registrationDate: string;
  clientName: string;
  clientPhone: string;
  directors: Director[];
  taxStatus: StatusLevel;
  companyStatus: StatusLevel;
  directorVisaStatus: StatusLevel;
  vatRegistered: boolean;
  monthlyAccounting: boolean;
  documents: CompanyDocument[];
  history: CompanyHistoryEntry[];
  dbdUrl: string;
  notes?: string;
  clientAppAccess?: boolean;
  clientEmail?: string;
  clientPasswordSet?: boolean;
};

// ----------------------------------------------------------------------
// Individual Clients (people, for Visa / Work Permit pipeline)

export type ClientType = 'company_linked' | 'visa_only';

export type TBIndividualClient = {
  id: string;
  name: string;
  nationality: string;
  phone?: string;
  email?: string;
  passportNo?: string;
  companyId?: string;
  companyName?: string;
  visaType?: string;
  visaExpiry?: string;
  workPermit?: boolean;
  clientType: ClientType;
  notes?: string;
};

const INITIAL_INDIVIDUAL_CLIENTS: TBIndividualClient[] = [
  { id: 'person-001', name: "Mr. James O'Brien", nationality: 'Irish', phone: '+66 84 890 1234', companyId: 'cl-007', companyName: 'International Consulting Co., Ltd.', visaType: 'Non-B', visaExpiry: '2026-05-31', workPermit: true, clientType: 'company_linked' },
  { id: 'person-002', name: 'Ms. Sarah Lin', nationality: 'Singaporean', companyId: 'cl-007', companyName: 'International Consulting Co., Ltd.', visaType: 'Non-B', visaExpiry: '2026-08-15', workPermit: false, clientType: 'company_linked' },
  { id: 'person-003', name: 'Mr. David Chen', nationality: 'Taiwanese', phone: '+66 85 901 2345', companyId: 'cl-008', companyName: 'Global Software Co., Ltd.', visaType: 'Non-B', visaExpiry: '2026-06-15', workPermit: true, clientType: 'company_linked' },
  { id: 'person-004', name: 'Mr. Andreas Schmidt', nationality: 'German', companyId: 'cl-003', companyName: 'Thai Manufacturing Co., Ltd.', visaType: 'Non-B', visaExpiry: '2026-05-25', workPermit: true, clientType: 'company_linked' },
  { id: 'person-005', name: 'Ms. Yuki Tanaka', nationality: 'Japanese', companyId: 'cl-003', companyName: 'Thai Manufacturing Co., Ltd.', visaType: 'Non-B', visaExpiry: '2026-06-10', workPermit: true, clientType: 'company_linked' },
  { id: 'person-006', name: 'Ms. Emma Williams', nationality: 'Australian', companyId: 'cl-006', companyName: 'Supply Chain Co., Ltd.', visaType: 'Non-B', visaExpiry: '2027-01-10', workPermit: true, clientType: 'company_linked' },
  { id: 'person-007', name: 'Mr. James Thornton', nationality: 'British', companyId: 'cl-001', companyName: 'Siam Technology Co., Ltd.', visaType: 'Non-B', visaExpiry: '2026-09-30', workPermit: true, clientType: 'company_linked' },
  { id: 'person-008', name: 'Ms. Charlotte Brown', nationality: 'Canadian', phone: '+66 62 345 6789', visaType: 'Non-O', visaExpiry: '2026-07-01', workPermit: false, clientType: 'visa_only', notes: 'Retirement visa extension' },
  { id: 'person-009', name: 'Mr. Henrik Larsson', nationality: 'Swedish', visaType: 'Non-OA', visaExpiry: '2027-03-15', workPermit: false, clientType: 'visa_only' },
  { id: 'person-010', name: 'Ms. Nadia Popescu', nationality: 'Romanian', phone: '+66 91 234 5678', visaType: 'Non-B', visaExpiry: '2026-11-20', workPermit: true, clientType: 'visa_only', notes: 'Freelance consultant, no sponsoring company' },
];

// ----------------------------------------------------------------------
// Kanban

export type KanbanPipeline = 'company_registration' | 'apply_renew' | 'extension';
export type UrgencyLevel = 'high' | 'medium' | 'low';
export type MacroStage = 'backlog' | 'in_progress' | 'review' | 'done';

export const MACRO_STAGES: { id: MacroStage; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export const MACRO_STAGE_LABELS: Record<MacroStage, string> = {
  backlog: 'Backlog',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

export type CardStage = {
  id: string;
  label: string;
  order: number;
};

export type StageTemplate = {
  id: string;
  name: string;
  pipeline: KanbanPipeline | 'any';
  stages: { id: string; label: string }[];
  isDefault?: boolean;
};

export type KanbanCard = {
  id: string;
  pipeline: KanbanPipeline;
  macroStage: MacroStage;
  cardStages: CardStage[];
  currentCardStageId: string;
  templateId?: string;
  companyName: string;
  thaiRegNumber: string;
  serviceType: string;
  companyId?: string;
  directorNames: string[];
  visaExpiryDate?: string;
  endDate?: string;
  durationDays?: number; // computed: Math.ceil((endDate - createdDate) / 86400000)
  createdDate: string;
  urgency: UrgencyLevel;
  notes?: string;
};

export function getMacroStageFromCardStage(cardStages: CardStage[], currentStageId: string): MacroStage {
  const idx = cardStages.findIndex((s) => s.id === currentStageId);
  const total = cardStages.length;
  if (idx <= 0) return 'backlog';
  if (idx >= total - 1) return 'done';
  if (total > 3 && idx === total - 2) return 'review';
  return 'in_progress';
}

// ----------------------------------------------------------------------
// Document Batches

export type DocumentBatch = {
  id: string;
  clientName: string;
  batchName: string;
  uploadedAt: string;
  fileCount: number;
  fileTypes: string[];
  status: 'pending' | 'approved' | 'rejected';
};

// ----------------------------------------------------------------------
// Audit Log

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  category: 'kanban' | 'document' | 'config' | 'company';
};

const INITIAL_STAGE_TEMPLATES: StageTemplate[] = [
  {
    id: 'tpl-std-reg',
    name: 'Standard Company Registration',
    pipeline: 'company_registration',
    isDefault: true,
    stages: [
      { id: 'tpl-std-s0', label: 'Documents Collected' },
      { id: 'tpl-std-s1', label: 'DBD Submission' },
      { id: 'tpl-std-s2', label: 'Awaiting Registration No.' },
      { id: 'tpl-std-s3', label: 'Completed' },
    ],
  },
  {
    id: 'tpl-boi-reg',
    name: 'BOI Registration',
    pipeline: 'company_registration',
    stages: [
      { id: 'tpl-boi-s0', label: 'Documents Collected' },
      { id: 'tpl-boi-s1', label: 'BOI Application Filed' },
      { id: 'tpl-boi-s2', label: 'Ministry Review' },
      { id: 'tpl-boi-s3', label: 'BOI Approval' },
      { id: 'tpl-boi-s4', label: 'Completed' },
    ],
  },
  {
    id: 'tpl-nonb-visa',
    name: 'Non-B Visa Extension',
    pipeline: 'any',
    isDefault: true,
    stages: [
      { id: 'tpl-vis-s0', label: 'Documents Gathered' },
      { id: 'tpl-vis-s1', label: 'Immigration Visit' },
      { id: 'tpl-vis-s2', label: 'Stamp Received' },
      { id: 'tpl-vis-s3', label: 'Completed' },
    ],
  },
  {
    id: 'tpl-wp-renewal',
    name: 'Work Permit Renewal',
    pipeline: 'any',
    stages: [
      { id: 'tpl-wp-s0', label: 'Documents Gathered' },
      { id: 'tpl-wp-s1', label: 'Labour Dept. Filing' },
      { id: 'tpl-wp-s2', label: 'Awaiting Permit' },
      { id: 'tpl-wp-s3', label: 'Permit Collected' },
      { id: 'tpl-wp-s4', label: 'Completed' },
    ],
  },
  {
    id: 'tpl-annual-audit',
    name: 'Annual Tax & Audit',
    pipeline: 'any',
    stages: [
      { id: 'tpl-tax-s0', label: 'Documents Requested' },
      { id: 'tpl-tax-s1', label: 'Bookkeeping' },
      { id: 'tpl-tax-s2', label: 'Tax Filing' },
      { id: 'tpl-tax-s3', label: 'Audit Report' },
      { id: 'tpl-tax-s4', label: 'Completed' },
    ],
  },
  // ── Apply & Renew templates ───────────────────────────────────────────
  {
    id: 'tpl-wp-apply',
    name: 'Work Permit (New Application)',
    pipeline: 'apply_renew',
    isDefault: true,
    stages: [
      { id: 'tpl-wpa-s0', label: 'Documents Gathered' },
      { id: 'tpl-wpa-s1', label: 'Labour Dept. Filing' },
      { id: 'tpl-wpa-s2', label: 'Awaiting Permit' },
      { id: 'tpl-wpa-s3', label: 'Permit Collected' },
      { id: 'tpl-wpa-s4', label: 'Completed' },
    ],
  },
  {
    id: 'tpl-passport-apply',
    name: 'Passport Application',
    pipeline: 'apply_renew',
    stages: [
      { id: 'tpl-ppa-s0', label: 'Documents Prepared' },
      { id: 'tpl-ppa-s1', label: 'Embassy Appointment' },
      { id: 'tpl-ppa-s2', label: 'Submitted' },
      { id: 'tpl-ppa-s3', label: 'Collected' },
    ],
  },
  {
    id: 'tpl-ci-apply',
    name: 'Certificate of Incorporation (Apply)',
    pipeline: 'apply_renew',
    stages: [
      { id: 'tpl-cia-s0', label: 'Documents Prepared' },
      { id: 'tpl-cia-s1', label: 'Submitted to Authority' },
      { id: 'tpl-cia-s2', label: 'Approved' },
      { id: 'tpl-cia-s3', label: 'Completed' },
    ],
  },
  // ── Extension templates ───────────────────────────────────────────────
  {
    id: 'tpl-visa-ext',
    name: 'Visa Extension',
    pipeline: 'extension',
    isDefault: true,
    stages: [
      { id: 'tpl-vex-s0', label: 'Documents Gathered' },
      { id: 'tpl-vex-s1', label: 'Immigration Visit' },
      { id: 'tpl-vex-s2', label: 'Stamp Received' },
      { id: 'tpl-vex-s3', label: 'Completed' },
    ],
  },
  {
    id: 'tpl-wp-ext',
    name: 'Work Permit Extension',
    pipeline: 'extension',
    stages: [
      { id: 'tpl-wpe-s0', label: 'Documents Gathered' },
      { id: 'tpl-wpe-s1', label: 'Labour Dept. Filing' },
      { id: 'tpl-wpe-s2', label: 'Awaiting Renewal' },
      { id: 'tpl-wpe-s3', label: 'Permit Collected' },
      { id: 'tpl-wpe-s4', label: 'Completed' },
    ],
  },
  {
    id: 'tpl-passport-ext',
    name: 'Passport Renewal',
    pipeline: 'extension',
    stages: [
      { id: 'tpl-ppe-s0', label: 'Current Passport Check' },
      { id: 'tpl-ppe-s1', label: 'Documents Prepared' },
      { id: 'tpl-ppe-s2', label: 'Appointment Booked' },
      { id: 'tpl-ppe-s3', label: 'Renewed' },
      { id: 'tpl-ppe-s4', label: 'Collected' },
    ],
  },
  {
    id: 'tpl-ci-ext',
    name: 'CI Extension',
    pipeline: 'extension',
    stages: [
      { id: 'tpl-cie-s0', label: 'Documents Prepared' },
      { id: 'tpl-cie-s1', label: 'Filed to Authority' },
      { id: 'tpl-cie-s2', label: 'Approved' },
      { id: 'tpl-cie-s3', label: 'Completed' },
    ],
  },
];

// Helpers to build per-card stage arrays from template stages
const mkStages = (cardId: string, labels: string[]): CardStage[] =>
  labels.map((label, i) => ({ id: `${cardId}-s${i}`, label, order: i }));

// ----------------------------------------------------------------------
// Initial mock data

const DBD_URL = 'https://www.dbd.go.th/dbdekm/applicationRD/apply_search.do';

const INITIAL_CLIENTS: TBClient[] = [
  {
    id: 'cl-001',
    companyName: 'Siam Technology Co., Ltd.',
    thaiRegNumber: '0105565001234',
    registrationDate: '2023-03-15',
    clientName: 'Mr. Somchai Wongsuwarn',
    clientPhone: '+66 81 234 5678',
    directors: [
      { id: 'd-001-1', name: 'Mr. Somchai Wongsuwarn', nationality: 'Thai', position: 'Managing Director' },
      { id: 'd-001-2', name: 'Mr. James Thornton', nationality: 'British', position: 'Director', visaType: 'Non-B', visaExpiry: '2026-09-30', workPermit: true },
    ],
    taxStatus: 'good',
    companyStatus: 'good',
    directorVisaStatus: 'good',
    vatRegistered: true,
    monthlyAccounting: true,
    documents: [
      { id: 'doc-cl001-1', category: 'company_certificate', fileName: 'company_cert_siam_tech.pdf', uploadedAt: '2023-03-20T10:00:00Z' },
      { id: 'doc-cl001-2', category: 'vat_certificate', fileName: 'vat_cert_siam_tech.pdf', uploadedAt: '2023-04-01T09:00:00Z' },
      { id: 'doc-cl001-3', category: 'business_license', fileName: 'business_license_2024.pdf', uploadedAt: '2024-01-10T14:00:00Z' },
    ],
    history: [
      { id: 'h-001-1', date: '2023-03-15', action: 'Company registered', by: 'Admin' },
      { id: 'h-001-2', date: '2023-04-01', action: 'VAT registration completed', by: 'Admin' },
      { id: 'h-001-3', date: '2024-01-10', action: 'Business license renewed', by: 'Admin' },
    ],
    dbdUrl: DBD_URL,
    notes: 'BOI-registered entity. Requires quarterly BOI reporting.',
  },
  {
    id: 'cl-002',
    companyName: 'Innovate Group Co., Ltd.',
    thaiRegNumber: '0105562009876',
    registrationDate: '2022-07-22',
    clientName: 'Mrs. Suda Panich',
    clientPhone: '+66 86 345 6789',
    directors: [
      { id: 'd-002-1', name: 'Mr. Prawit Srisomboon', nationality: 'Thai', position: 'Director' },
      { id: 'd-002-2', name: 'Mrs. Suda Panich', nationality: 'Thai', position: 'Director' },
    ],
    taxStatus: 'warning',
    companyStatus: 'good',
    directorVisaStatus: 'good',
    vatRegistered: false,
    monthlyAccounting: true,
    documents: [
      { id: 'doc-cl002-1', category: 'company_certificate', fileName: 'innovate_group_cert.pdf', uploadedAt: '2022-07-25T11:00:00Z' },
    ],
    history: [
      { id: 'h-002-1', date: '2022-07-22', action: 'Company registered', by: 'Admin' },
      { id: 'h-002-2', date: '2026-04-10', action: 'Q1 tax filing overdue — follow-up sent', by: 'Admin' },
    ],
    dbdUrl: DBD_URL,
    notes: 'Pending VAT registration. Tax filing Q1 delayed.',
  },
  {
    id: 'cl-003',
    companyName: 'Thai Manufacturing Co., Ltd.',
    thaiRegNumber: '0105560004512',
    registrationDate: '2020-01-10',
    clientName: 'Mr. Wichai Tantiwech',
    clientPhone: '+66 89 456 7890',
    directors: [
      { id: 'd-003-1', name: 'Mr. Wichai Tantiwech', nationality: 'Thai', position: 'Managing Director' },
      { id: 'd-003-2', name: 'Mr. Andreas Schmidt', nationality: 'German', position: 'Director', visaType: 'Non-B', visaExpiry: '2026-05-25', workPermit: true },
      { id: 'd-003-3', name: 'Ms. Yuki Tanaka', nationality: 'Japanese', position: 'Director', visaType: 'Non-B', visaExpiry: '2026-06-10', workPermit: true },
    ],
    taxStatus: 'good',
    companyStatus: 'good',
    directorVisaStatus: 'warning',
    vatRegistered: true,
    monthlyAccounting: false,
    documents: [
      { id: 'doc-cl003-1', category: 'company_certificate', fileName: 'thai_mfg_cert.pdf', uploadedAt: '2020-01-15T09:00:00Z' },
      { id: 'doc-cl003-2', category: 'vat_certificate', fileName: 'thai_mfg_vat.pdf', uploadedAt: '2020-02-01T10:00:00Z' },
      { id: 'doc-cl003-3', category: 'tax_yearly', fileName: 'tax_annual_2025.pdf', uploadedAt: '2026-02-28T14:00:00Z' },
      { id: 'doc-cl003-4', category: 'audit_yearly', fileName: 'audit_2025.pdf', uploadedAt: '2026-03-15T11:00:00Z' },
      { id: 'doc-cl003-5', category: 'meeting_minutes', fileName: 'agm_minutes_2025.pdf', uploadedAt: '2026-04-01T09:00:00Z' },
    ],
    history: [
      { id: 'h-003-1', date: '2020-01-10', action: 'Company registered', by: 'Admin' },
      { id: 'h-003-2', date: '2026-02-28', action: 'Annual tax return filed', by: 'Admin' },
      { id: 'h-003-3', date: '2026-05-15', action: 'Director visa expiry flagged — Mr. Schmidt expires 2026-05-25', by: 'Admin' },
    ],
    dbdUrl: DBD_URL,
    notes: 'Two director visas expiring soon. Work permit renewals in progress.',
  },
  {
    id: 'cl-004',
    companyName: 'Digital Solution Co., Ltd.',
    thaiRegNumber: '0105564007823',
    registrationDate: '2024-02-28',
    clientName: 'Mr. Thanawat Jirayu',
    clientPhone: '+66 90 567 8901',
    directors: [
      { id: 'd-004-1', name: 'Mr. Thanawat Jirayu', nationality: 'Thai', position: 'Managing Director' },
      { id: 'd-004-2', name: 'Mrs. Ladawan Intarat', nationality: 'Thai', position: 'Director' },
    ],
    taxStatus: 'good',
    companyStatus: 'good',
    directorVisaStatus: 'good',
    vatRegistered: true,
    monthlyAccounting: true,
    documents: [
      { id: 'doc-cl004-1', category: 'company_certificate', fileName: 'digital_solution_cert.pdf', uploadedAt: '2024-03-01T10:00:00Z' },
      { id: 'doc-cl004-2', category: 'vat_certificate', fileName: 'digital_solution_vat.pdf', uploadedAt: '2024-03-15T09:00:00Z' },
    ],
    history: [
      { id: 'h-004-1', date: '2024-02-28', action: 'Company registered', by: 'Admin' },
      { id: 'h-004-2', date: '2024-03-15', action: 'VAT registration completed', by: 'Admin' },
    ],
    dbdUrl: DBD_URL,
  },
  {
    id: 'cl-005',
    companyName: 'Asia Trade Co., Ltd.',
    thaiRegNumber: '0105558012390',
    registrationDate: '2018-11-05',
    clientName: 'Mrs. Ratana Sittichoek',
    clientPhone: '+66 82 678 9012',
    directors: [
      { id: 'd-005-1', name: 'Mrs. Ratana Sittichoek', nationality: 'Thai', position: 'Managing Director' },
    ],
    taxStatus: 'critical',
    companyStatus: 'warning',
    directorVisaStatus: 'good',
    vatRegistered: false,
    monthlyAccounting: false,
    documents: [
      { id: 'doc-cl005-1', category: 'company_certificate', fileName: 'asia_trade_cert.pdf', uploadedAt: '2018-11-10T09:00:00Z' },
    ],
    history: [
      { id: 'h-005-1', date: '2018-11-05', action: 'Company registered', by: 'Admin' },
      { id: 'h-005-2', date: '2026-04-01', action: 'Annual tax return overdue — client contacted', by: 'Admin' },
      { id: 'h-005-3', date: '2026-05-01', action: 'Suspension risk flagged — awaiting client response', by: 'Admin' },
    ],
    dbdUrl: DBD_URL,
    notes: 'Annual tax return overdue. Company status at risk of suspension. Urgent follow-up required.',
  },
  {
    id: 'cl-006',
    companyName: 'Supply Chain Co., Ltd.',
    thaiRegNumber: '0105563011847',
    registrationDate: '2023-09-14',
    clientName: 'Mr. Prawit Srisomboon',
    clientPhone: '+66 83 789 0123',
    directors: [
      { id: 'd-006-1', name: 'Mr. Prawit Srisomboon', nationality: 'Thai', position: 'Managing Director' },
      { id: 'd-006-2', name: 'Ms. Emma Williams', nationality: 'Australian', position: 'Director', visaType: 'Non-B', visaExpiry: '2027-01-10', workPermit: true },
    ],
    taxStatus: 'good',
    companyStatus: 'good',
    directorVisaStatus: 'good',
    vatRegistered: true,
    monthlyAccounting: true,
    documents: [
      { id: 'doc-cl006-1', category: 'company_certificate', fileName: 'supply_chain_cert.pdf', uploadedAt: '2023-09-18T10:00:00Z' },
      { id: 'doc-cl006-2', category: 'vat_certificate', fileName: 'supply_chain_vat.pdf', uploadedAt: '2023-10-01T09:00:00Z' },
      { id: 'doc-cl006-3', category: 'business_license', fileName: 'business_license_2025.pdf', uploadedAt: '2025-01-05T11:00:00Z' },
    ],
    history: [
      { id: 'h-006-1', date: '2023-09-14', action: 'Company registered', by: 'Admin' },
      { id: 'h-006-2', date: '2023-10-01', action: 'VAT registration completed', by: 'Admin' },
    ],
    dbdUrl: DBD_URL,
  },
  {
    id: 'cl-007',
    companyName: 'International Consulting Co., Ltd.',
    thaiRegNumber: '0105561008765',
    registrationDate: '2021-06-30',
    clientName: "Mr. James O'Brien",
    clientPhone: '+66 84 890 1234',
    directors: [
      { id: 'd-007-1', name: "Mr. James O'Brien", nationality: 'Irish', position: 'Managing Director', visaType: 'Non-B', visaExpiry: '2026-05-31', workPermit: true },
      { id: 'd-007-2', name: 'Ms. Sarah Lin', nationality: 'Singaporean', position: 'Director', visaType: 'Non-B', visaExpiry: '2026-08-15', workPermit: false },
    ],
    taxStatus: 'good',
    companyStatus: 'good',
    directorVisaStatus: 'critical',
    vatRegistered: true,
    monthlyAccounting: true,
    documents: [
      { id: 'doc-cl007-1', category: 'company_certificate', fileName: 'intl_consulting_cert.pdf', uploadedAt: '2021-07-01T10:00:00Z' },
      { id: 'doc-cl007-2', category: 'vat_certificate', fileName: 'intl_consulting_vat.pdf', uploadedAt: '2021-07-15T09:00:00Z' },
      { id: 'doc-cl007-3', category: 'tax_yearly', fileName: 'tax_2025_intl.pdf', uploadedAt: '2026-02-20T14:00:00Z' },
    ],
    history: [
      { id: 'h-007-1', date: '2021-06-30', action: 'Company registered', by: 'Admin' },
      { id: 'h-007-2', date: '2026-05-01', action: "MD visa expiring 2026-05-31 — renewal submitted to Immigration", by: 'Admin' },
    ],
    dbdUrl: DBD_URL,
    notes: "Managing Director O'Brien visa expires 2026-05-31. Renewal application submitted.",
  },
  {
    id: 'cl-008',
    companyName: 'Global Software Co., Ltd.',
    thaiRegNumber: '0105566003421',
    registrationDate: '2024-08-20',
    clientName: 'Mr. David Chen',
    clientPhone: '+66 85 901 2345',
    directors: [
      { id: 'd-008-1', name: 'Mr. David Chen', nationality: 'Taiwanese', position: 'Managing Director', visaType: 'Non-B', visaExpiry: '2026-06-15', workPermit: true },
    ],
    taxStatus: 'good',
    companyStatus: 'good',
    directorVisaStatus: 'warning',
    vatRegistered: false,
    monthlyAccounting: true,
    documents: [
      { id: 'doc-cl008-1', category: 'company_certificate', fileName: 'global_software_cert.pdf', uploadedAt: '2024-08-25T10:00:00Z' },
    ],
    history: [
      { id: 'h-008-1', date: '2024-08-20', action: 'Company registered', by: 'Admin' },
      { id: 'h-008-2', date: '2026-05-10', action: 'Director visa expiry flagged — expires 2026-06-15', by: 'Admin' },
    ],
    dbdUrl: DBD_URL,
    notes: 'VAT registration pending. Director visa renewal needed before June 2026.',
  },
];

const INITIAL_KANBAN_CARDS: KanbanCard[] = [
  // ── Company Registration ──────────────────────────────────────────────
  {
    id: 'cr-001', pipeline: 'company_registration', serviceType: 'registration',
    macroStage: 'backlog',
    cardStages: mkStages('cr-001', ['Documents Collected', 'DBD Submission', 'Awaiting Registration No.', 'Completed']),
    currentCardStageId: 'cr-001-s0', templateId: 'tpl-std-reg',
    companyName: 'Siam Technology Co., Ltd.', thaiRegNumber: '0105565001234',
    directorNames: ['Mr. Somchai Wongsuwarn', 'Mrs. Suda Panich'],
    urgency: 'medium', endDate: '2026-06-09', durationDays: 30, createdDate: '2026-05-10',
    notes: 'BOI-registered entity, requires special approval',
  },
  {
    id: 'cr-002', pipeline: 'company_registration', serviceType: 'registration',
    macroStage: 'in_progress',
    cardStages: mkStages('cr-002', ['Documents Collected', 'DBD Submission', 'Awaiting Registration No.', 'Completed']),
    currentCardStageId: 'cr-002-s1', templateId: 'tpl-std-reg',
    companyName: 'Innovate Group Co., Ltd.', thaiRegNumber: '0105562009876',
    directorNames: ['Mr. Prawit Srisomboon'],
    urgency: 'low', createdDate: '2026-05-08', notes: 'Standard registration',
  },
  {
    id: 'cr-003', pipeline: 'company_registration', serviceType: 'registration',
    macroStage: 'review',
    cardStages: mkStages('cr-003', ['Documents Collected', 'BOI Application Filed', 'Ministry Review', 'BOI Approval', 'Completed']),
    currentCardStageId: 'cr-003-s2', templateId: 'tpl-boi-reg',
    companyName: 'Digital Solution Co., Ltd.', thaiRegNumber: '0105564007823',
    directorNames: ['Mr. Thanawat Jirayu', 'Mrs. Ladawan Intarat'],
    urgency: 'high', endDate: '2026-05-22', durationDays: 7, createdDate: '2026-05-15',
    notes: 'Urgent — client deadline end of month',
  },
  {
    id: 'cr-004', pipeline: 'company_registration', serviceType: 'registration',
    macroStage: 'done',
    cardStages: mkStages('cr-004', ['Documents Collected', 'DBD Submission', 'Awaiting Registration No.', 'Completed']),
    currentCardStageId: 'cr-004-s3', templateId: 'tpl-std-reg',
    companyName: 'Asia Trade Co., Ltd.', thaiRegNumber: '0105558012390',
    directorNames: ['Mrs. Ratana Sittichoek'],
    urgency: 'low', createdDate: '2026-04-20', notes: 'All documents received and filed',
  },
  // ── Apply & Renew ──────────────────────────────────────────────────────
  {
    id: 'ar-001', pipeline: 'apply_renew', serviceType: 'work_permit',
    macroStage: 'backlog',
    cardStages: mkStages('ar-001', ['Documents Gathered', 'Labour Dept. Filing', 'Awaiting Permit', 'Permit Collected', 'Completed']),
    currentCardStageId: 'ar-001-s0', templateId: 'tpl-wp-apply',
    companyName: 'International Consulting Co., Ltd.', thaiRegNumber: '0105561008765',
    directorNames: ["Mr. James O'Brien", 'Ms. Sarah Lin'],
    visaExpiryDate: '2026-05-31', endDate: '2026-05-31', durationDays: 14, createdDate: '2026-05-17',
    urgency: 'high', notes: 'New work permit application — expiring soon',
  },
  {
    id: 'ar-002', pipeline: 'apply_renew', serviceType: 'visa',
    macroStage: 'in_progress',
    cardStages: mkStages('ar-002', ['Documents Gathered', 'Application Filed', 'Immigration Visit', 'Stamp Received', 'Completed']),
    currentCardStageId: 'ar-002-s1', templateId: 'tpl-nonb-visa',
    companyName: 'Global Software Co., Ltd.', thaiRegNumber: '0105566003421',
    directorNames: ['Mr. David Chen'],
    visaExpiryDate: '2026-06-15', endDate: '2026-06-02', durationDays: 21, createdDate: '2026-05-12',
    urgency: 'medium', notes: 'Non-B visa application',
  },
  // ── Extension ─────────────────────────────────────────────────────────
  {
    id: 'ex-001', pipeline: 'extension', serviceType: 'work_permit',
    macroStage: 'review',
    cardStages: mkStages('ex-001', ['Documents Gathered', 'Labour Dept. Filing', 'Awaiting Permit', 'Permit Collected', 'Completed']),
    currentCardStageId: 'ex-001-s2', templateId: 'tpl-wp-renewal',
    companyName: 'Thai Manufacturing Co., Ltd.', thaiRegNumber: '0105560004512',
    directorNames: ['Mr. Andreas Schmidt', 'Ms. Yuki Tanaka'],
    visaExpiryDate: '2026-07-20', createdDate: '2026-05-14',
    urgency: 'medium', notes: 'Work permit extension + type change',
  },
  {
    id: 'ex-002', pipeline: 'extension', serviceType: 'visa',
    macroStage: 'done',
    cardStages: mkStages('ex-002', ['Documents Gathered', 'Immigration Visit', 'Stamp Received', 'Completed']),
    currentCardStageId: 'ex-002-s3', templateId: 'tpl-nonb-visa',
    companyName: 'Supply Chain Co., Ltd.', thaiRegNumber: '0105563011847',
    directorNames: ['Ms. Emma Williams'],
    visaExpiryDate: '2027-01-10', createdDate: '2026-04-28',
    urgency: 'low', notes: 'Visa extension granted — 1 year',
  },
];

const INITIAL_DOCUMENT_BATCHES: DocumentBatch[] = [
  {
    id: 'doc-001',
    clientName: 'Siam Technology Co., Ltd.',
    batchName: 'May 2026 Invoices',
    uploadedAt: '2026-05-14T09:30:00Z',
    fileCount: 12,
    fileTypes: ['PDF', 'PDF', 'PDF'],
    status: 'pending',
  },
  {
    id: 'doc-002',
    clientName: 'Innovate Group Co., Ltd.',
    batchName: 'Q1 2026 Financial Statements',
    uploadedAt: '2026-05-12T14:20:00Z',
    fileCount: 5,
    fileTypes: ['PDF', 'Image'],
    status: 'pending',
  },
  {
    id: 'doc-003',
    clientName: 'Digital Solution Co., Ltd.',
    batchName: 'Work Permit Supporting Docs',
    uploadedAt: '2026-05-13T11:00:00Z',
    fileCount: 8,
    fileTypes: ['PDF', 'Image', 'PDF'],
    status: 'pending',
  },
  {
    id: 'doc-004',
    clientName: 'Asia Trade Co., Ltd.',
    batchName: 'April 2026 Invoices',
    uploadedAt: '2026-05-10T08:45:00Z',
    fileCount: 9,
    fileTypes: ['PDF'],
    status: 'approved',
  },
  {
    id: 'doc-005',
    clientName: 'International Consulting Co., Ltd.',
    batchName: 'Company Registration Docs',
    uploadedAt: '2026-05-11T16:00:00Z',
    fileCount: 4,
    fileTypes: ['PDF', 'Image'],
    status: 'rejected',
  },
];

const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'log-init-1',
    timestamp: '2026-05-14T10:00:00Z',
    action: 'Approved batch "April 2026 Invoices" for Asia Trade Co., Ltd.',
    actor: 'Admin',
    category: 'document',
  },
  {
    id: 'log-init-2',
    timestamp: '2026-05-13T15:30:00Z',
    action: 'Moved "Digital Solution Co., Ltd." from Processing to Document Review',
    actor: 'Admin',
    category: 'kanban',
  },
  {
    id: 'log-init-3',
    timestamp: '2026-05-12T09:15:00Z',
    action: 'Rejected batch "Company Registration Docs" for International Consulting Co., Ltd.',
    actor: 'Admin',
    category: 'document',
  },
];

// ----------------------------------------------------------------------
// Module-level mutable store

export const tbStore = {
  stageTemplates: INITIAL_STAGE_TEMPLATES as StageTemplate[],
  clients: INITIAL_CLIENTS as TBClient[],
  individualClients: INITIAL_INDIVIDUAL_CLIENTS as TBIndividualClient[],
  kanbanCards: INITIAL_KANBAN_CARDS as KanbanCard[],
  documentBatches: INITIAL_DOCUMENT_BATCHES as DocumentBatch[],
  auditLog: INITIAL_AUDIT_LOG as AuditLogEntry[],
};

// ----------------------------------------------------------------------
// Store mutation helpers

function appendAuditEntry(action: string, category: AuditLogEntry['category']) {
  tbStore.auditLog.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toISOString(),
    action,
    actor: 'Admin',
    category,
  });
}

export function addCompany(client: Omit<TBClient, 'id' | 'history' | 'dbdUrl' | 'clientPasswordSet'> & { clientPasswordSet?: boolean }): TBClient {
  const newClient: TBClient = {
    ...client,
    id: `cl-${Date.now()}`,
    dbdUrl: DBD_URL,
    history: [
      {
        id: `h-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        action: 'Company added to Trusted Brothers system',
        by: 'Admin',
      },
    ],
  };
  tbStore.clients.push(newClient);
  appendAuditEntry(`Added company "${newClient.companyName}" to Companies Overview`, 'company');
  return newClient;
}

export function moveKanbanCardMacro(cardId: string, newMacro: MacroStage): void {
  const card = tbStore.kanbanCards.find((c) => c.id === cardId);
  if (!card || card.macroStage === newMacro) return;
  const old = MACRO_STAGE_LABELS[card.macroStage];
  card.macroStage = newMacro;
  appendAuditEntry(`Moved "${card.companyName}" from ${old} to ${MACRO_STAGE_LABELS[newMacro]}`, 'kanban');
}

export function moveKanbanCardStage(cardId: string, newStageId: string): void {
  const card = tbStore.kanbanCards.find((c) => c.id === cardId);
  if (!card || card.currentCardStageId === newStageId) return;
  const oldStage = card.cardStages.find((s) => s.id === card.currentCardStageId);
  const newStage = card.cardStages.find((s) => s.id === newStageId);
  card.currentCardStageId = newStageId;
  card.macroStage = getMacroStageFromCardStage(card.cardStages, newStageId);
  if (oldStage && newStage) {
    appendAuditEntry(`"${card.companyName}": ${oldStage.label} → ${newStage.label}`, 'kanban');
  }
}

export function addKanbanCard(card: Omit<KanbanCard, 'id'>): KanbanCard {
  const id = `card-${Date.now()}`;
  const newCard: KanbanCard = {
    ...card,
    id,
    createdDate: card.createdDate || new Date().toISOString().slice(0, 10),
    macroStage: getMacroStageFromCardStage(card.cardStages, card.currentCardStageId),
  };
  tbStore.kanbanCards.push(newCard);
  const PL_LABEL: Record<KanbanPipeline, string> = { company_registration: 'Company Registrations', apply_renew: 'Apply & Renew', extension: 'Extension' };
  const pl = PL_LABEL[card.pipeline] ?? card.pipeline;
  appendAuditEntry(`Added case "${newCard.companyName}" to ${pl} pipeline`, 'kanban');
  return newCard;
}

export function addStageTemplate(tpl: Omit<StageTemplate, 'id'>): StageTemplate {
  const newTpl: StageTemplate = { ...tpl, id: `tpl-${Date.now()}` };
  tbStore.stageTemplates.push(newTpl);
  return newTpl;
}

export function updateStageTemplate(id: string, updates: Partial<Omit<StageTemplate, 'id'>>): void {
  const tpl = tbStore.stageTemplates.find((t) => t.id === id);
  if (tpl) Object.assign(tpl, updates);
}

export function deleteStageTemplate(id: string): boolean {
  const idx = tbStore.stageTemplates.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tbStore.stageTemplates.splice(idx, 1);
  return true;
}

export function approveDocumentBatch(batchId: string): void {
  const batch = tbStore.documentBatches.find((b) => b.id === batchId);
  if (!batch) return;
  batch.status = 'approved';
  appendAuditEntry(
    `Approved batch "${batch.batchName}" for ${batch.clientName}`,
    'document'
  );
}

export function rejectDocumentBatch(batchId: string): void {
  const batch = tbStore.documentBatches.find((b) => b.id === batchId);
  if (!batch) return;
  batch.status = 'rejected';
  appendAuditEntry(
    `Rejected batch "${batch.batchName}" for ${batch.clientName}`,
    'document'
  );
}

export function editKanbanCard(cardId: string, updates: Omit<KanbanCard, 'id'>): void {
  const idx = tbStore.kanbanCards.findIndex((c) => c.id === cardId);
  if (idx === -1) return;
  tbStore.kanbanCards[idx] = {
    id: cardId,
    ...updates,
    macroStage: getMacroStageFromCardStage(updates.cardStages, updates.currentCardStageId),
  };
  appendAuditEntry(`Edited case "${updates.companyName}"`, 'kanban');
}

export function renameCardStage(cardId: string, stageId: string, label: string): void {
  const card = tbStore.kanbanCards.find((c) => c.id === cardId);
  if (!card) return;
  const stage = card.cardStages.find((s) => s.id === stageId);
  if (stage) stage.label = label.trim();
}

export function deleteCardStage(cardId: string, stageId: string): boolean {
  const card = tbStore.kanbanCards.find((c) => c.id === cardId);
  if (!card || card.cardStages.length <= 1 || card.currentCardStageId === stageId) return false;
  card.cardStages = card.cardStages.filter((s) => s.id !== stageId);
  card.cardStages.forEach((s, i) => { s.order = i; });
  return true;
}

export function addCardStage(cardId: string, label: string): CardStage | null {
  const card = tbStore.kanbanCards.find((c) => c.id === cardId);
  if (!card) return null;
  const newStage: CardStage = { id: `${cardId}-s${Date.now()}`, label: label.trim(), order: card.cardStages.length };
  card.cardStages.push(newStage);
  return newStage;
}

export function reorderKanbanCards(activeId: string, overId: string): void {
  const ai = tbStore.kanbanCards.findIndex((c) => c.id === activeId);
  const oi = tbStore.kanbanCards.findIndex((c) => c.id === overId);
  if (ai === -1 || oi === -1 || ai === oi) return;
  const list = [...tbStore.kanbanCards];
  const [removed] = list.splice(ai, 1);
  list.splice(oi, 0, removed);
  tbStore.kanbanCards = list;
}

export function addBodAuditEntry(action: string): void {
  appendAuditEntry(action, 'config');
}
