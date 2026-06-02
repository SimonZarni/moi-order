/** variantId → { adult quantity, child quantity selected by the user } */
export type PersonTypeSelections = Record<number, { adult: number; child: number }>;

/** A resolved order line-item ready for the API and date-selection screen. */
export type SelectionItem = {
  ticket_variant_id: number;
  quantity: number;
  person_type: 'adult' | 'child' | 'general';
};
