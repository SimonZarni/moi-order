import { fNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------
// Context: Trusted Brothers pre-app manual order history.
// This data represents work completed before the Moi Order app was launched.
// Will be replaced by real backend queries once separate TB tables are created.

export const TB_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ----------------------------------------------------------------------
// Summary KPIs

export const TB_SUMMARY = {
  totalOrders: 247,
  totalOrdersMonthly: [18, 22, 28, 19, 25, 21, 30, 24, 26, 18, 14, 17],
  totalOrdersChange: 12.4,

  totalRevenueTHB: 3_842_500,
  totalRevenueMonthly: [285, 342, 425, 295, 380, 318, 455, 362, 392, 275, 215, 257],
  totalRevenueChange: 8.7,

  activeClients: 32,
  activeClientsMonthly: [22, 24, 26, 27, 28, 28, 30, 30, 31, 32, 32, 32],
  activeClientsChange: 45.5,

  servicesCompleted: 189,
  servicesCompletedMonthly: [14, 18, 23, 15, 20, 17, 25, 20, 21, 15, 12, 14],
  servicesCompletedChange: -3.8,
};

// ----------------------------------------------------------------------
// Pie — Orders by service type

export const TB_ORDERS_BY_SERVICE: { label: string; value: number }[] = [
  { label: 'Visa / Work Permit', value: 89 },
  { label: 'Company Registration', value: 68 },
  { label: 'Tax & Accounting', value: 54 },
  { label: 'Business License', value: 24 },
  { label: 'Other Services', value: 12 },
];

// ----------------------------------------------------------------------
// Bar — Monthly revenue (THB thousands)

export const TB_MONTHLY_REVENUE = {
  thisYear: [285, 342, 425, 295, 380, 318, 455, 362, 392, 275, 0, 0],
  lastYear: [248, 290, 365, 268, 320, 298, 415, 322, 350, 248, 205, 278],
};

// ----------------------------------------------------------------------
// Horizontal bar — Top services this month vs last month

export const TB_TOP_SERVICES = {
  categories: ['Visa / Work Permit', 'Company Reg.', 'Tax Monthly', 'Annual Audit', 'Biz License'],
  series: [
    { name: 'This Month', data: [12, 8, 7, 4, 4] },
    { name: 'Last Month', data: [9, 6, 7, 5, 3] },
  ],
};

// ----------------------------------------------------------------------
// Pie — Order status breakdown

export const TB_ORDER_STATUS: { label: string; value: number }[] = [
  { label: 'Completed', value: 189 },
  { label: 'In Progress', value: 42 },
  { label: 'Pending', value: 11 },
  { label: 'Cancelled', value: 5 },
];

export const TB_ORDER_STATUS_COLORS = ['#10B981', '#6366F1', '#F59E0B', '#EF4444'];

// ----------------------------------------------------------------------
// Timeline — Recent payments / invoices

export const TB_PAYMENT_TIMELINE: { id: string; type: string; title: string; time: string }[] = [
  {
    id: 'pay-1',
    type: 'order1',
    title: "Non-B Visa Renewal — Mr. James O'Brien (฿18,500)",
    time: '2026-05-15T10:30:00Z',
  },
  {
    id: 'pay-2',
    type: 'order2',
    title: 'Company Registration (BOI) — นาย ธนวัฒน์ จิรายุ (฿32,000)',
    time: '2026-05-13T14:00:00Z',
  },
  {
    id: 'pay-3',
    type: 'order3',
    title: 'Monthly Tax Filing — บ. เทคโนโลยี สยาม จำกัด (฿8,500)',
    time: '2026-05-10T09:00:00Z',
  },
  {
    id: 'pay-4',
    type: 'order4',
    title: 'Work Permit Extension — Mr. David Chen (฿14,000)',
    time: '2026-05-08T11:00:00Z',
  },
  {
    id: 'pay-5',
    type: 'order5',
    title: 'Business License Renewal — บ. ซัพพลาย เชน จำกัด (฿6,500)',
    time: '2026-05-05T15:00:00Z',
  },
];

// ----------------------------------------------------------------------
// Activity feed — Recent manual orders

export const TB_RECENT_ORDERS: {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  postedAt: string;
}[] = [
  {
    id: 'rec-1',
    title: 'Non-B Visa + Work Permit Renewal',
    coverUrl: '',
    description: "Mr. James O'Brien — บริษัท อินเตอร์เนชั่นแนล คอนซัลติ้ง จำกัด",
    postedAt: '2026-05-15T10:30:00Z',
  },
  {
    id: 'rec-2',
    title: 'Company Registration (BOI Category)',
    coverUrl: '',
    description: 'นาย ธนวัฒน์ จิรายุ — บริษัท ดิจิทัล โซลูชัน จำกัด',
    postedAt: '2026-05-13T14:00:00Z',
  },
  {
    id: 'rec-3',
    title: 'Monthly Tax & Accounting',
    coverUrl: '',
    description: 'นาย สมชาย วงศ์สุวรรณ — บริษัท เทคโนโลยี สยาม จำกัด',
    postedAt: '2026-05-10T09:00:00Z',
  },
  {
    id: 'rec-4',
    title: 'Work Permit Extension + Type Change',
    coverUrl: '',
    description: 'Mr. David Chen — บริษัท โกลบอล ซอฟแวร์ จำกัด',
    postedAt: '2026-05-08T11:00:00Z',
  },
  {
    id: 'rec-5',
    title: 'Annual Business License Renewal',
    coverUrl: '',
    description: 'นาย ประวิทย์ ศรีสมบูรณ์ — บริษัท ซัพพลาย เชน จำกัด',
    postedAt: '2026-05-05T15:00:00Z',
  },
];

// ----------------------------------------------------------------------
// CSV export utility

export function exportTBOverviewCSV(): void {
  const rows: string[][] = [
    ['Trusted Brothers — Operations Summary (Historical / Pre-App)'],
    [`Generated: ${new Date().toLocaleString('en-GB')}`],
    [],
    ['SUMMARY KPIs', 'Value'],
    ['Total Manual Orders (YTD)', String(TB_SUMMARY.totalOrders)],
    ['Total Revenue THB (YTD)', `฿${fNumber(TB_SUMMARY.totalRevenueTHB)}`],
    ['Active Clients', String(TB_SUMMARY.activeClients)],
    ['Services Completed (YTD)', String(TB_SUMMARY.servicesCompleted)],
    [],
    ['ORDERS BY SERVICE TYPE', 'Count'],
    ...TB_ORDERS_BY_SERVICE.map((s) => [s.label, String(s.value)]),
    [],
    ['ORDER STATUS BREAKDOWN', 'Count'],
    ...TB_ORDER_STATUS.map((s) => [s.label, String(s.value)]),
    [],
    ['MONTHLY REVENUE (THB 000s)', 'This Year', 'Last Year'],
    ...TB_MONTHS.map((m, i) => [
      m,
      String(TB_MONTHLY_REVENUE.thisYear[i] ?? 0),
      String(TB_MONTHLY_REVENUE.lastYear[i] ?? 0),
    ]),
    [],
    ['TOP SERVICES — THIS MONTH vs LAST MONTH', 'This Month', 'Last Month'],
    ...TB_TOP_SERVICES.categories.map((cat, i) => [
      cat,
      String(TB_TOP_SERVICES.series[0].data[i]),
      String(TB_TOP_SERVICES.series[1].data[i]),
    ]),
  ];

  const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tb-overview-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
