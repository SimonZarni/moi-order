/**
 * Formats a price in satang (cents) to Thai Baht display string.
 * Server always stores money as integer cents — never use floats.
 */
export function formatPrice(cents: number): string {
  const baht = cents / 100;
  return `฿${baht.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPriceWhole(cents: number): string {
  const baht = Math.floor(cents / 100);
  return `฿${baht.toLocaleString('th-TH')}`;
}
