/**
 * Principle: SRP — pure formatting utilities, no side effects.
 */

// new Date("YYYY-MM-DD") parses as UTC midnight and shifts in UTC- zones.
// Construct a local-midnight date from parts to avoid the offset.
function localDateFromISO(iso: string): Date {
  const parts = iso.split('-');
  const year  = parseInt(parts[0] ?? '0', 10);
  const month = parseInt(parts[1] ?? '1', 10);
  const day   = parseInt(parts[2] ?? '1', 10);
  return new Date(year, month - 1, day);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(localDateFromISO(iso));
}

/** Returns DD-MM-YYYY, used for document date fields. */
export function formatDateDMY(iso: string): string {
  const d    = localDateFromISO(iso);
  const dd   = String(d.getDate()).padStart(2, '0');
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}
