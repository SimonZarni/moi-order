/**
 * Principle: SRP — pure formatting utility, no side effects.
 * Formats an integer price (whole currency units) to a localised currency string.
 */
export function formatCurrency(amount: number, currency: string = 'THB'): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
