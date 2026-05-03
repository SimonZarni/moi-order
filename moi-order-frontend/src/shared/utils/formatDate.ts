/**
 * Principle: SRP — pure formatting utilities, no side effects.
 */

// For datetime strings (contain 'T'), parse as UTC — the browser converts to local time.
// For date-only strings ("YYYY-MM-DD"), construct local midnight directly to avoid
// UTC-midnight shift in UTC- timezones (e.g. "2026-05-04" → May 3 in UTC-5).
function localDateFromISO(iso: string): Date {
  if (iso.includes('T')) {
    return new Date(iso);
  }
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

/** Returns "1 June 2026" — used in upload limit reset messages. */
export function formatResetDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(localDateFromISO(iso));
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
