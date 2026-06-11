import type { StatusFilter } from './hooks/useOrdersScreen';

let _pending: StatusFilter | null = null;

export function requestOrdersFilter(filter: StatusFilter): void {
  _pending = filter;
}

export function consumeOrdersFilter(): StatusFilter | null {
  const v = _pending;
  _pending = null;
  return v;
}
