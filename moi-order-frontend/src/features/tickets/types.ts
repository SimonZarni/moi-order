/** variantId → { adult quantity, child quantity selected by the user } */
export type PersonTypeSelections = Record<number, { adult: number; child: number }>;

/** A single day option shown in the day-picker grid. */
export interface DateOption {
  date:    string;   // "YYYY-MM-DD"
  label:   string;   // "Thu 17 Apr"  (weekday · number · month abbrev)
  isToday: boolean;
}

/** Month metadata for the month-picker grid. */
export interface MonthOption {
  value:    number;  // 1–12
  abbrev:   string;  // "Jan"
  fullName: string;  // "January"
}

/** A resolved order line-item ready for the API and date-selection screen. */
export type SelectionItem = {
  ticket_variant_id: number;
  quantity: number;
  person_type: 'adult' | 'child' | 'general';
};
