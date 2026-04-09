export const ERROR_CODES = {
  ORDER_NOT_CANCELLABLE: 'order.not_cancellable',
  SLOT_UNAVAILABLE: 'slot.unavailable',
  SERVICE_INACTIVE: 'service.inactive',
} as const;

export const DOMAIN_ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.ORDER_NOT_CANCELLABLE]: 'This order can no longer be cancelled.',
  [ERROR_CODES.SLOT_UNAVAILABLE]: 'The selected time slot is no longer available.',
  [ERROR_CODES.SERVICE_INACTIVE]: 'This service is currently unavailable.',
};
