export const ORDER_STATUS = {
  Pending: 'pending',
  Confirmed: 'confirmed',
  InProgress: 'in_progress',
  Completed: 'completed',
  Cancelled: 'cancelled',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
