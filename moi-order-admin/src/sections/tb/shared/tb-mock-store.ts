// ----------------------------------------------------------------------

export type KanbanColumn = 'backlog' | 'processing' | 'document_review' | 'completed';
export type KanbanPipeline = 'company_registration' | 'visa_work_permit';
export type UrgencyLevel = 'high' | 'medium' | 'low';

export type KanbanCard = {
  id: string;
  pipeline: KanbanPipeline;
  column: KanbanColumn;
  companyName: string;
  thaiRegNumber: string;
  directorNames: string[];
  visaExpiryDate?: string;
  urgency: UrgencyLevel;
  notes?: string;
};

export type TBClient = {
  id: string;
  companyName: string;
  thaiRegNumber: string;
  registrationDate: string;
  vatRegistered: boolean;
  monthlyAccounting: boolean;
  dbdUrl: string;
};

export type DocumentBatch = {
  id: string;
  clientName: string;
  batchName: string;
  uploadedAt: string;
  fileCount: number;
  fileTypes: string[];
  status: 'pending' | 'approved' | 'rejected';
};

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  category: 'kanban' | 'document' | 'config';
};

export const COLUMN_LABELS: Record<KanbanColumn, string> = {
  backlog: 'Backlog',
  processing: 'Processing',
  document_review: 'Document Review',
  completed: 'Completed',
};

// ----------------------------------------------------------------------

const DBD_URL = 'https://www.dbd.go.th/dbdekm/applicationRD/apply_search.do';

const INITIAL_CLIENTS: TBClient[] = [
  {
    id: 'cl-001',
    companyName: 'บริษัท เทคโนโลยี สยาม จำกัด',
    thaiRegNumber: '0105565001234',
    registrationDate: '2023-03-15',
    vatRegistered: true,
    monthlyAccounting: true,
    dbdUrl: DBD_URL,
  },
  {
    id: 'cl-002',
    companyName: 'บริษัท อินโนเวท กรุ๊ป จำกัด',
    thaiRegNumber: '0105562009876',
    registrationDate: '2022-07-22',
    vatRegistered: false,
    monthlyAccounting: true,
    dbdUrl: DBD_URL,
  },
  {
    id: 'cl-003',
    companyName: 'บริษัท แมนูแฟคเจอริ่ง ไทย จำกัด',
    thaiRegNumber: '0105560004512',
    registrationDate: '2020-01-10',
    vatRegistered: true,
    monthlyAccounting: false,
    dbdUrl: DBD_URL,
  },
  {
    id: 'cl-004',
    companyName: 'บริษัท ดิจิทัล โซลูชัน จำกัด',
    thaiRegNumber: '0105564007823',
    registrationDate: '2024-02-28',
    vatRegistered: true,
    monthlyAccounting: true,
    dbdUrl: DBD_URL,
  },
  {
    id: 'cl-005',
    companyName: 'บริษัท เอเชีย เทรด จำกัด',
    thaiRegNumber: '0105558012390',
    registrationDate: '2018-11-05',
    vatRegistered: false,
    monthlyAccounting: false,
    dbdUrl: DBD_URL,
  },
  {
    id: 'cl-006',
    companyName: 'บริษัท ซัพพลาย เชน จำกัด',
    thaiRegNumber: '0105563011847',
    registrationDate: '2023-09-14',
    vatRegistered: true,
    monthlyAccounting: true,
    dbdUrl: DBD_URL,
  },
  {
    id: 'cl-007',
    companyName: 'บริษัท อินเตอร์เนชั่นแนล คอนซัลติ้ง จำกัด',
    thaiRegNumber: '0105561008765',
    registrationDate: '2021-06-30',
    vatRegistered: true,
    monthlyAccounting: true,
    dbdUrl: DBD_URL,
  },
  {
    id: 'cl-008',
    companyName: 'บริษัท โกลบอล ซอฟแวร์ จำกัด',
    thaiRegNumber: '0105566003421',
    registrationDate: '2024-08-20',
    vatRegistered: false,
    monthlyAccounting: true,
    dbdUrl: DBD_URL,
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
    notes: 'Standard registration',
  },
  {
    id: 'cr-003',
    pipeline: 'company_registration',
    column: 'document_review',
    companyName: 'บริษัท ดิจิทัล โซลูชัน จำกัด',
    thaiRegNumber: '0105564007823',
    directorNames: ['นาย ธนวัฒน์ จิรายุ', 'นาง ลดาวัลย์ อินทรัตน์', 'นาย วิชัย ตันติเวช'],
    urgency: 'high',
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
// Module-level mutable store — persists across route navigations within a session.

export const tbStore = {
  clients: INITIAL_CLIENTS as TBClient[],
  kanbanCards: INITIAL_KANBAN_CARDS as KanbanCard[],
  documentBatches: INITIAL_DOCUMENT_BATCHES as DocumentBatch[],
  auditLog: INITIAL_AUDIT_LOG as AuditLogEntry[],
};

function appendAuditEntry(action: string, category: AuditLogEntry['category']) {
  tbStore.auditLog.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toISOString(),
    action,
    actor: 'Admin',
    category,
  });
}

export function moveKanbanCard(cardId: string, newColumn: KanbanColumn): void {
  const card = tbStore.kanbanCards.find((c) => c.id === cardId);
  if (!card || card.column === newColumn) return;
  const oldLabel = COLUMN_LABELS[card.column];
  const newLabel = COLUMN_LABELS[newColumn];
  card.column = newColumn;
  appendAuditEntry(
    `Moved "${card.companyName}" from ${oldLabel} to ${newLabel}`,
    'kanban'
  );
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

export function addBodAuditEntry(action: string): void {
  appendAuditEntry(action, 'config');
}
