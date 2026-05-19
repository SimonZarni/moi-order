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
  { id: 'person-001', name: "Mr. James O'Brien", nationality: 'Irish', phone: '+66 84 890 1234', companyId: 'cl-007', companyName: 'บริษัท อินเตอร์เนชั่นแนล คอนซัลติ้ง จำกัด', visaType: 'Non-B', visaExpiry: '2026-05-31', workPermit: true, clientType: 'company_linked' },
  { id: 'person-002', name: 'Ms. Sarah Lin', nationality: 'Singaporean', companyId: 'cl-007', companyName: 'บริษัท อินเตอร์เนชั่นแนล คอนซัลติ้ง จำกัด', visaType: 'Non-B', visaExpiry: '2026-08-15', workPermit: false, clientType: 'company_linked' },
  { id: 'person-003', name: 'Mr. David Chen', nationality: 'Taiwanese', phone: '+66 85 901 2345', companyId: 'cl-008', companyName: 'บริษัท โกลบอล ซอฟแวร์ จำกัด', visaType: 'Non-B', visaExpiry: '2026-06-15', workPermit: true, clientType: 'company_linked' },
  { id: 'person-004', name: 'Mr. Andreas Schmidt', nationality: 'German', companyId: 'cl-003', companyName: 'บริษัท แมนูแฟคเจอริ่ง ไทย จำกัด', visaType: 'Non-B', visaExpiry: '2026-05-25', workPermit: true, clientType: 'company_linked' },
  { id: 'person-005', name: 'Ms. Yuki Tanaka', nationality: 'Japanese', companyId: 'cl-003', companyName: 'บริษัท แมนูแฟคเจอริ่ง ไทย จำกัด', visaType: 'Non-B', visaExpiry: '2026-06-10', workPermit: true, clientType: 'company_linked' },
  { id: 'person-006', name: 'Ms. Emma Williams', nationality: 'Australian', companyId: 'cl-006', companyName: 'บริษัท ซัพพลาย เชน จำกัด', visaType: 'Non-B', visaExpiry: '2027-01-10', workPermit: true, clientType: 'company_linked' },
  { id: 'person-007', name: 'Mr. James Thornton', nationality: 'British', companyId: 'cl-001', companyName: 'บริษัท เทคโนโลยี สยาม จำกัด', visaType: 'Non-B', visaExpiry: '2026-09-30', workPermit: true, clientType: 'company_linked' },
  { id: 'person-008', name: 'Ms. Charlotte Brown', nationality: 'Canadian', phone: '+66 62 345 6789', visaType: 'Non-O', visaExpiry: '2026-07-01', workPermit: false, clientType: 'visa_only', notes: 'Retirement visa extension' },
  { id: 'person-009', name: 'Mr. Henrik Larsson', nationality: 'Swedish', visaType: 'Non-OA', visaExpiry: '2027-03-15', workPermit: false, clientType: 'visa_only' },
  { id: 'person-010', name: 'Ms. Nadia Popescu', nationality: 'Romanian', phone: '+66 91 234 5678', visaType: 'Non-B', visaExpiry: '2026-11-20', workPermit: true, clientType: 'visa_only', notes: 'Freelance consultant, no sponsoring company' },
];

// ----------------------------------------------------------------------
// Kanban

export type KanbanColumn = string; // dynamic — not a fixed union
export type KanbanPipeline = 'company_registration' | 'visa_work_permit';
export type UrgencyLevel = 'high' | 'medium' | 'low';

export type KanbanStage = {
  id: string;
  label: string;
  order: number;
};

export type KanbanCard = {
  id: string;
  pipeline: KanbanPipeline;
  column: KanbanColumn;
  companyName: string;
  thaiRegNumber: string;
  companyId?: string;
  directorNames: string[];
  visaExpiryDate?: string;
  durationDays?: number;
  createdDate: string;
  urgency: UrgencyLevel;
  notes?: string;
};

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

const INITIAL_STAGES: KanbanStage[] = [
  { id: 'backlog', label: 'Backlog', order: 0 },
  { id: 'processing', label: 'Processing', order: 1 },
  { id: 'document_review', label: 'Document Review', order: 2 },
  { id: 'completed', label: 'Completed', order: 3 },
];

// ----------------------------------------------------------------------
// Initial mock data

const DBD_URL = 'https://www.dbd.go.th/dbdekm/applicationRD/apply_search.do';

const INITIAL_CLIENTS: TBClient[] = [
  {
    id: 'cl-001',
    companyName: 'บริษัท เทคโนโลยี สยาม จำกัด',
    thaiRegNumber: '0105565001234',
    registrationDate: '2023-03-15',
    clientName: 'นาย สมชาย วงศ์สุวรรณ',
    clientPhone: '+66 81 234 5678',
    directors: [
      { id: 'd-001-1', name: 'นาย สมชาย วงศ์สุวรรณ', nationality: 'Thai', position: 'Managing Director' },
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
    companyName: 'บริษัท อินโนเวท กรุ๊ป จำกัด',
    thaiRegNumber: '0105562009876',
    registrationDate: '2022-07-22',
    clientName: 'นาง สุดา พานิชย์',
    clientPhone: '+66 86 345 6789',
    directors: [
      { id: 'd-002-1', name: 'นาย ประวิทย์ ศรีสมบูรณ์', nationality: 'Thai', position: 'Director' },
      { id: 'd-002-2', name: 'นาง สุดา พานิชย์', nationality: 'Thai', position: 'Director' },
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
    companyName: 'บริษัท แมนูแฟคเจอริ่ง ไทย จำกัด',
    thaiRegNumber: '0105560004512',
    registrationDate: '2020-01-10',
    clientName: 'นาย วิชัย ตันติเวช',
    clientPhone: '+66 89 456 7890',
    directors: [
      { id: 'd-003-1', name: 'นาย วิชัย ตันติเวช', nationality: 'Thai', position: 'Managing Director' },
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
    companyName: 'บริษัท ดิจิทัล โซลูชัน จำกัด',
    thaiRegNumber: '0105564007823',
    registrationDate: '2024-02-28',
    clientName: 'นาย ธนวัฒน์ จิรายุ',
    clientPhone: '+66 90 567 8901',
    directors: [
      { id: 'd-004-1', name: 'นาย ธนวัฒน์ จิรายุ', nationality: 'Thai', position: 'Managing Director' },
      { id: 'd-004-2', name: 'นาง ลดาวัลย์ อินทรัตน์', nationality: 'Thai', position: 'Director' },
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
    companyName: 'บริษัท เอเชีย เทรด จำกัด',
    thaiRegNumber: '0105558012390',
    registrationDate: '2018-11-05',
    clientName: 'นาง รัตนา สิทธิโชค',
    clientPhone: '+66 82 678 9012',
    directors: [
      { id: 'd-005-1', name: 'นาง รัตนา สิทธิโชค', nationality: 'Thai', position: 'Managing Director' },
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
    companyName: 'บริษัท ซัพพลาย เชน จำกัด',
    thaiRegNumber: '0105563011847',
    registrationDate: '2023-09-14',
    clientName: 'นาย ประวิทย์ ศรีสมบูรณ์',
    clientPhone: '+66 83 789 0123',
    directors: [
      { id: 'd-006-1', name: 'นาย ประวิทย์ ศรีสมบูรณ์', nationality: 'Thai', position: 'Managing Director' },
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
    companyName: 'บริษัท อินเตอร์เนชั่นแนล คอนซัลติ้ง จำกัด',
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
    companyName: 'บริษัท โกลบอล ซอฟแวร์ จำกัด',
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
  {
    id: 'cr-001',
    pipeline: 'company_registration',
    column: 'backlog',
    companyName: 'บริษัท เทคโนโลยี สยาม จำกัด',
    thaiRegNumber: '0105565001234',
    directorNames: ['นาย สมชาย วงศ์สุวรรณ', 'นาง สุดา พานิชย์'],
    urgency: 'medium',
    durationDays: 30,
    createdDate: '2026-05-10',
    notes: 'BOI-registered entity, requires special approval',
  },
  {
    id: 'cr-002',
    pipeline: 'company_registration',
    column: 'processing',
    companyName: 'บริษัท อินโนเวท กรุ๊ป จำกัด',
    thaiRegNumber: '0105562009876',
    directorNames: ['นาย ประวิทย์ ศรีสมบูรณ์'],
    urgency: 'low',
    createdDate: '2026-05-08',
    notes: 'Standard registration',
  },
  {
    id: 'cr-003',
    pipeline: 'company_registration',
    column: 'document_review',
    companyName: 'บริษัท ดิจิทัล โซลูชัน จำกัด',
    thaiRegNumber: '0105564007823',
    directorNames: ['นาย ธนวัฒน์ จิรายุ', 'นาง ลดาวัลย์ อินทรัตน์'],
    urgency: 'high',
    durationDays: 7,
    createdDate: '2026-05-15',
    notes: 'Urgent — client deadline end of month',
  },
  {
    id: 'cr-004',
    pipeline: 'company_registration',
    column: 'completed',
    companyName: 'บริษัท เอเชีย เทรด จำกัด',
    thaiRegNumber: '0105558012390',
    directorNames: ['นาง รัตนา สิทธิโชค'],
    urgency: 'low',
    createdDate: '2026-04-20',
    notes: 'All documents received and filed',
  },
  {
    id: 'vw-001',
    pipeline: 'visa_work_permit',
    column: 'backlog',
    companyName: 'บริษัท อินเตอร์เนชั่นแนล คอนซัลติ้ง จำกัด',
    thaiRegNumber: '0105561008765',
    directorNames: ["Mr. James O'Brien", 'Ms. Sarah Lin'],
    visaExpiryDate: '2026-05-31',
    durationDays: 14,
    createdDate: '2026-05-17',
    urgency: 'high',
    notes: 'Work permit renewal — expiring soon',
  },
  {
    id: 'vw-002',
    pipeline: 'visa_work_permit',
    column: 'processing',
    companyName: 'บริษัท โกลบอล ซอฟแวร์ จำกัด',
    thaiRegNumber: '0105566003421',
    directorNames: ['Mr. David Chen'],
    visaExpiryDate: '2026-06-15',
    durationDays: 21,
    createdDate: '2026-05-12',
    urgency: 'medium',
    notes: 'Non-B visa extension',
  },
  {
    id: 'vw-003',
    pipeline: 'visa_work_permit',
    column: 'document_review',
    companyName: 'บริษัท แมนูแฟคเจอริ่ง ไทย จำกัด',
    thaiRegNumber: '0105560004512',
    directorNames: ['Mr. Andreas Schmidt', 'Ms. Yuki Tanaka'],
    visaExpiryDate: '2026-07-20',
    createdDate: '2026-05-14',
    urgency: 'medium',
    notes: 'Work permit extension + type change',
  },
  {
    id: 'vw-004',
    pipeline: 'visa_work_permit',
    column: 'completed',
    companyName: 'บริษัท ซัพพลาย เชน จำกัด',
    thaiRegNumber: '0105563011847',
    directorNames: ['Ms. Emma Williams'],
    visaExpiryDate: '2027-01-10',
    createdDate: '2026-04-28',
    urgency: 'low',
    notes: 'Extension granted — 1 year',
  },
];

const INITIAL_DOCUMENT_BATCHES: DocumentBatch[] = [
  {
    id: 'doc-001',
    clientName: 'บริษัท เทคโนโลยี สยาม จำกัด',
    batchName: 'May 2026 Invoices',
    uploadedAt: '2026-05-14T09:30:00Z',
    fileCount: 12,
    fileTypes: ['PDF', 'PDF', 'PDF'],
    status: 'pending',
  },
  {
    id: 'doc-002',
    clientName: 'บริษัท อินโนเวท กรุ๊ป จำกัด',
    batchName: 'Q1 2026 Financial Statements',
    uploadedAt: '2026-05-12T14:20:00Z',
    fileCount: 5,
    fileTypes: ['PDF', 'Image'],
    status: 'pending',
  },
  {
    id: 'doc-003',
    clientName: 'บริษัท ดิจิทัล โซลูชัน จำกัด',
    batchName: 'Work Permit Supporting Docs',
    uploadedAt: '2026-05-13T11:00:00Z',
    fileCount: 8,
    fileTypes: ['PDF', 'Image', 'PDF'],
    status: 'pending',
  },
  {
    id: 'doc-004',
    clientName: 'บริษัท เอเชีย เทรด จำกัด',
    batchName: 'April 2026 Invoices',
    uploadedAt: '2026-05-10T08:45:00Z',
    fileCount: 9,
    fileTypes: ['PDF'],
    status: 'approved',
  },
  {
    id: 'doc-005',
    clientName: 'บริษัท อินเตอร์เนชั่นแนล คอนซัลติ้ง จำกัด',
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
    action: 'Approved batch "April 2026 Invoices" for บริษัท เอเชีย เทรด จำกัด',
    actor: 'Admin',
    category: 'document',
  },
  {
    id: 'log-init-2',
    timestamp: '2026-05-13T15:30:00Z',
    action: 'Moved "บริษัท ดิจิทัล โซลูชัน จำกัด" from Processing to Document Review',
    actor: 'Admin',
    category: 'kanban',
  },
  {
    id: 'log-init-3',
    timestamp: '2026-05-12T09:15:00Z',
    action: 'Rejected batch "Company Registration Docs" for บริษัท อินเตอร์เนชั่นแนล คอนซัลติ้ง จำกัด',
    actor: 'Admin',
    category: 'document',
  },
];

// ----------------------------------------------------------------------
// Module-level mutable store

export const tbStore = {
  stages: INITIAL_STAGES as KanbanStage[],
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

export function moveKanbanCard(cardId: string, newColumn: KanbanColumn): void {
  const card = tbStore.kanbanCards.find((c) => c.id === cardId);
  if (!card || card.column === newColumn) return;
  const getLabel = (id: string) => tbStore.stages.find((s) => s.id === id)?.label ?? id;
  const oldLabel = getLabel(card.column);
  const newLabel = getLabel(newColumn);
  card.column = newColumn;
  appendAuditEntry(`Moved "${card.companyName}" from ${oldLabel} to ${newLabel}`, 'kanban');
}

export function addKanbanCard(card: Omit<KanbanCard, 'id'>): KanbanCard {
  const newCard: KanbanCard = {
    ...card,
    id: `card-${Date.now()}`,
    createdDate: card.createdDate || new Date().toISOString().slice(0, 10),
  };
  tbStore.kanbanCards.push(newCard);
  const pipeline = card.pipeline === 'company_registration' ? 'Company Registration' : 'Visa/Work Permit';
  appendAuditEntry(`Added case "${newCard.companyName}" to ${pipeline} pipeline`, 'kanban');
  return newCard;
}

export function addKanbanStage(label: string): KanbanStage {
  const id = `stage_${Date.now()}`;
  const stage: KanbanStage = { id, label: label.trim(), order: tbStore.stages.length };
  tbStore.stages.push(stage);
  appendAuditEntry(`Added pipeline stage "${label}"`, 'kanban');
  return stage;
}

export function updateKanbanStage(stageId: string, label: string): void {
  const stage = tbStore.stages.find((s) => s.id === stageId);
  if (!stage) return;
  const old = stage.label;
  stage.label = label.trim();
  appendAuditEntry(`Renamed stage "${old}" to "${label}"`, 'kanban');
}

export function deleteKanbanStage(stageId: string): boolean {
  const hasCards = tbStore.kanbanCards.some((c) => c.column === stageId);
  if (hasCards || tbStore.stages.length <= 1) return false;
  const stage = tbStore.stages.find((s) => s.id === stageId);
  tbStore.stages = tbStore.stages.filter((s) => s.id !== stageId);
  if (stage) appendAuditEntry(`Deleted pipeline stage "${stage.label}"`, 'kanban');
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
  tbStore.kanbanCards[idx] = { id: cardId, ...updates };
  appendAuditEntry(`Edited case "${updates.companyName}"`, 'kanban');
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

export function reorderKanbanStages(orderedIds: string[]): void {
  const map = new Map(tbStore.stages.map((s) => [s.id, s]));
  tbStore.stages = orderedIds.map((id, index) => {
    const stage = map.get(id)!;
    stage.order = index;
    return stage;
  });
  appendAuditEntry('Reordered pipeline stages', 'kanban');
}

export function addBodAuditEntry(action: string): void {
  appendAuditEntry(action, 'config');
}
