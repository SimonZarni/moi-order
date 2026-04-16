export function formatCurrency(amount: number, currency: string = 'THB'): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatPrice(thb: number): string {
  return `฿${thb.toLocaleString('th-TH')}`;
}
