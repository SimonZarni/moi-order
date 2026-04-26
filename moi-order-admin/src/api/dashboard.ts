import apiClient from './client';

export type DashboardSummary = {
  total_orders: number;
  total_orders_change: number;
  total_orders_monthly: number[];
  active_users: number;
  active_users_change: number;
  active_users_monthly: number[];
  listed_places: number;
  listed_places_change: number;
  listed_places_monthly: number[];
  total_revenue: number;
  revenue_change: number;
  revenue_monthly: number[];
};

export type MonthlyOrders = {
  labels: string[];
  this_year: number[];
  last_year: number[];
};

export type ServiceOrder = {
  label: string;
  value: number;
};

export type TopServicesComparison = {
  categories: string[];
  this_month: number[];
  last_month: number[];
};

export type StatusBreakdown = {
  categories: string[];
  series: { name: string; data: number[] }[];
};

export type ActivityItem = {
  id: string;
  title: string;
  cover_url: string;
  description: string;
  posted_at: string;
};

export type TimelineItem = {
  id: string;
  title: string;
  type: string;
  time: string;
};

export type DashboardStats = {
  summary: DashboardSummary;
  monthly_orders: MonthlyOrders;
  orders_by_service: ServiceOrder[];
  top_services_comparison: TopServicesComparison;
  submission_status_breakdown: StatusBreakdown;
  recent_activity: ActivityItem[];
  payment_timeline: TimelineItem[];
  pending_submissions_count: number;
};

export const dashboardApi = {
  get: () =>
    apiClient.get<{ data: DashboardStats }>('/dashboard').then((r) => r.data.data),
};
